-- ============================================================================
-- MULTIPLE PHOTOS SYSTEM FOR МОЙDATE
-- ============================================================================

-- 1. CREATE PROFILE_PHOTOS TABLE FOR BETTER PHOTO MANAGEMENT
CREATE TABLE public.profile_photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer,
  mime_type text,
  width integer,
  height integer,
  display_order integer DEFAULT 1,
  is_primary boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  upload_source text DEFAULT 'web' CHECK (upload_source IN ('web', 'mobile', 'api')),
  metadata jsonb, -- Additional metadata like EXIF data, filters applied, etc.
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, display_order),
  CHECK (display_order >= 1 AND display_order <= 6), -- Max 6 photos
  CHECK (file_size > 0),
  CHECK (width > 0 AND height > 0)
);

-- Create indexes for performance
CREATE INDEX idx_profile_photos_user_id ON public.profile_photos(user_id);
CREATE INDEX idx_profile_photos_user_order ON public.profile_photos(user_id, display_order);
CREATE INDEX idx_profile_photos_primary ON public.profile_photos(user_id, is_primary) WHERE is_primary = true;
CREATE INDEX idx_profile_photos_active ON public.profile_photos(user_id, is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profile_photos
CREATE POLICY "Users can manage their own photos"
ON public.profile_photos
FOR ALL
USING (auth.uid() = user_id);

-- Allow viewing photos based on profile visibility
CREATE POLICY "Photos are viewable based on profile access"
ON public.profile_photos
FOR SELECT
USING (
  -- Users can always see their own photos
  auth.uid() = user_id
  OR
  -- Others can see photos if they can see the profile
  (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = profile_photos.user_id
      AND p.is_banned = false
      AND p.profile_visibility = 'public'
      -- User is not blocked
      AND NOT EXISTS (
        SELECT 1 FROM public.blocked_users bu
        WHERE (bu.blocker_id = auth.uid() AND bu.blocked_id = p.user_id)
        OR (bu.blocker_id = p.user_id AND bu.blocked_id = auth.uid())
      )
    )
  )
);

-- 2. CREATE PHOTO_MODERATION TABLE FOR AUTOMATED AND MANUAL REVIEW
CREATE TABLE public.photo_moderation (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id uuid REFERENCES public.profile_photos(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  moderation_status text DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
  moderation_type text DEFAULT 'automatic' CHECK (moderation_type IN ('automatic', 'manual', 'user_report')),
  rejection_reason text[],
  moderator_notes text,
  confidence_score decimal(3,2), -- For AI moderation confidence (0.00 to 1.00)
  ai_analysis jsonb, -- Detailed AI analysis results
  moderated_by uuid REFERENCES auth.users(id), -- NULL for automatic moderation
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_photo_moderation_photo_id ON public.photo_moderation(photo_id);
CREATE INDEX idx_photo_moderation_status ON public.photo_moderation(moderation_status);
CREATE INDEX idx_photo_moderation_pending ON public.photo_moderation(created_at) WHERE moderation_status = 'pending';

-- Enable RLS
ALTER TABLE public.photo_moderation ENABLE ROW LEVEL SECURITY;

-- Users can view moderation status of their own photos
CREATE POLICY "Users can view their own photo moderation"
ON public.photo_moderation
FOR SELECT
USING (auth.uid() = user_id);

-- 3. UPDATE PROFILES TABLE TO TRACK PHOTO COUNT
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS photo_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS primary_photo_url text;

-- 4. CREATE FUNCTION TO MANAGE PHOTO ORDER
CREATE OR REPLACE FUNCTION public.reorder_profile_photos(
  photo_orders jsonb -- Array of {photo_id: uuid, new_order: integer}
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  photo_item jsonb;
  photo_uuid uuid;
  new_order_val integer;
BEGIN
  -- Validate input
  IF photo_orders IS NULL OR jsonb_array_length(photo_orders) = 0 THEN
    RAISE EXCEPTION 'Photo orders array cannot be empty';
  END IF;

  -- Check if user owns all photos
  FOR photo_item IN SELECT * FROM jsonb_array_elements(photo_orders)
  LOOP
    photo_uuid := (photo_item->>'photo_id')::uuid;
    new_order_val := (photo_item->>'new_order')::integer;

    IF NOT EXISTS (
      SELECT 1 FROM public.profile_photos
      WHERE id = photo_uuid AND user_id = auth.uid()
    ) THEN
      RAISE EXCEPTION 'Photo not found or access denied: %', photo_uuid;
    END IF;

    IF new_order_val < 1 OR new_order_val > 6 THEN
      RAISE EXCEPTION 'Invalid order value: must be between 1 and 6';
    END IF;
  END LOOP;

  -- Update photo orders
  FOR photo_item IN SELECT * FROM jsonb_array_elements(photo_orders)
  LOOP
    photo_uuid := (photo_item->>'photo_id')::uuid;
    new_order_val := (photo_item->>'new_order')::integer;

    UPDATE public.profile_photos
    SET
      display_order = new_order_val,
      updated_at = now()
    WHERE id = photo_uuid AND user_id = auth.uid();
  END LOOP;

  -- Update primary photo (order 1 becomes primary)
  UPDATE public.profile_photos
  SET is_primary = (display_order = 1)
  WHERE user_id = auth.uid();

  -- Update profile with primary photo URL and count
  PERFORM public.update_profile_photo_info();

  RETURN true;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.reorder_profile_photos TO authenticated;

-- 5. CREATE FUNCTION TO UPDATE PROFILE PHOTO INFO
CREATE OR REPLACE FUNCTION public.update_profile_photo_info()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  primary_photo_path text;
  total_photos integer;
BEGIN
  -- Get primary photo path
  SELECT file_path INTO primary_photo_path
  FROM public.profile_photos
  WHERE user_id = auth.uid()
    AND is_primary = true
    AND is_active = true
  LIMIT 1;

  -- If no primary photo, get the first one by order
  IF primary_photo_path IS NULL THEN
    SELECT file_path INTO primary_photo_path
    FROM public.profile_photos
    WHERE user_id = auth.uid()
      AND is_active = true
    ORDER BY display_order ASC
    LIMIT 1;
  END IF;

  -- Count total active photos
  SELECT COUNT(*) INTO total_photos
  FROM public.profile_photos
  WHERE user_id = auth.uid()
    AND is_active = true;

  -- Update profile
  UPDATE public.profiles
  SET
    primary_photo_url = primary_photo_path,
    photo_count = total_photos,
    updated_at = now()
  WHERE user_id = auth.uid();

  -- Also update the legacy profile_images array for backward compatibility
  UPDATE public.profiles
  SET profile_images = (
    SELECT COALESCE(array_agg(file_path ORDER BY display_order), ARRAY[]::text[])
    FROM public.profile_photos
    WHERE user_id = auth.uid()
      AND is_active = true
      AND display_order <= 6
  )
  WHERE user_id = auth.uid();
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.update_profile_photo_info TO authenticated;

-- 6. CREATE FUNCTION TO UPLOAD NEW PHOTO
CREATE OR REPLACE FUNCTION public.add_profile_photo(
  file_name_param text,
  file_path_param text,
  file_size_param integer,
  mime_type_param text,
  width_param integer,
  height_param integer,
  display_order_param integer DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_photo_id uuid;
  max_photos integer := 6;
  current_count integer;
  final_order integer;
BEGIN
  -- Validate inputs
  IF file_name_param IS NULL OR file_path_param IS NULL THEN
    RAISE EXCEPTION 'File name and path are required';
  END IF;

  IF file_size_param <= 0 THEN
    RAISE EXCEPTION 'Invalid file size';
  END IF;

  IF width_param <= 0 OR height_param <= 0 THEN
    RAISE EXCEPTION 'Invalid image dimensions';
  END IF;

  -- Check current photo count
  SELECT COUNT(*) INTO current_count
  FROM public.profile_photos
  WHERE user_id = auth.uid() AND is_active = true;

  IF current_count >= max_photos THEN
    RAISE EXCEPTION 'Maximum number of photos (%) exceeded', max_photos;
  END IF;

  -- Determine display order
  IF display_order_param IS NULL THEN
    SELECT COALESCE(MAX(display_order), 0) + 1 INTO final_order
    FROM public.profile_photos
    WHERE user_id = auth.uid() AND is_active = true;
  ELSE
    final_order := display_order_param;

    -- Shift existing photos if necessary
    UPDATE public.profile_photos
    SET display_order = display_order + 1
    WHERE user_id = auth.uid()
      AND is_active = true
      AND display_order >= final_order;
  END IF;

  -- Ensure order is within bounds
  final_order := GREATEST(1, LEAST(final_order, max_photos));

  -- Insert new photo
  INSERT INTO public.profile_photos (
    user_id,
    file_name,
    file_path,
    file_size,
    mime_type,
    width,
    height,
    display_order,
    is_primary
  )
  VALUES (
    auth.uid(),
    file_name_param,
    file_path_param,
    file_size_param,
    mime_type_param,
    width_param,
    height_param,
    final_order,
    current_count = 0 -- First photo becomes primary
  )
  RETURNING id INTO new_photo_id;

  -- Update profile info
  PERFORM public.update_profile_photo_info();

  -- Create moderation record
  INSERT INTO public.photo_moderation (photo_id, user_id)
  VALUES (new_photo_id, auth.uid());

  RETURN new_photo_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.add_profile_photo TO authenticated;

-- 7. CREATE FUNCTION TO DELETE PHOTO
CREATE OR REPLACE FUNCTION public.delete_profile_photo(photo_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_order integer;
BEGIN
  -- Get the order of the photo being deleted
  SELECT display_order INTO deleted_order
  FROM public.profile_photos
  WHERE id = photo_id AND user_id = auth.uid() AND is_active = true;

  IF deleted_order IS NULL THEN
    RAISE EXCEPTION 'Photo not found or access denied';
  END IF;

  -- Mark photo as inactive instead of deleting
  UPDATE public.profile_photos
  SET
    is_active = false,
    updated_at = now()
  WHERE id = photo_id AND user_id = auth.uid();

  -- Shift remaining photos down to fill the gap
  UPDATE public.profile_photos
  SET display_order = display_order - 1
  WHERE user_id = auth.uid()
    AND is_active = true
    AND display_order > deleted_order;

  -- Update profile info
  PERFORM public.update_profile_photo_info();

  RETURN true;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.delete_profile_photo TO authenticated;

-- 8. CREATE TRIGGERS FOR AUTO-UPDATING
CREATE OR REPLACE FUNCTION public.update_photo_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profile_photos_updated_at
  BEFORE UPDATE ON public.profile_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_photo_updated_at();

CREATE TRIGGER update_photo_moderation_updated_at
  BEFORE UPDATE ON public.photo_moderation
  FOR EACH ROW
  EXECUTE FUNCTION public.update_photo_updated_at();

-- 9. CREATE VIEW FOR USER PHOTOS WITH MODERATION STATUS
CREATE OR REPLACE VIEW public.user_photos_view AS
SELECT
  pp.id,
  pp.user_id,
  pp.file_name,
  pp.file_path,
  pp.file_size,
  pp.mime_type,
  pp.width,
  pp.height,
  pp.display_order,
  pp.is_primary,
  pp.is_verified,
  pp.is_active,
  pp.upload_source,
  pp.metadata,
  pp.created_at,
  pp.updated_at,
  pm.moderation_status,
  pm.rejection_reason,
  pm.confidence_score
FROM public.profile_photos pp
LEFT JOIN public.photo_moderation pm ON pp.id = pm.photo_id
WHERE pp.user_id = auth.uid()
ORDER BY pp.display_order ASC;

-- Grant access to the view
GRANT SELECT ON public.user_photos_view TO authenticated;

-- 10. CREATE VIEW FOR PUBLIC PHOTOS (FOR PROFILE DISCOVERY)
CREATE OR REPLACE VIEW public.public_photos_view AS
SELECT
  pp.id,
  pp.user_id,
  pp.file_path,
  pp.width,
  pp.height,
  pp.display_order,
  pp.is_primary,
  pp.is_verified
FROM public.profile_photos pp
LEFT JOIN public.photo_moderation pm ON pp.id = pm.photo_id
WHERE
  pp.is_active = true
  AND COALESCE(pm.moderation_status, 'pending') IN ('approved', 'pending')
  -- Only show photos from profiles user can access
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = pp.user_id
    AND p.is_banned = false
    AND p.profile_visibility = 'public'
    -- User is not blocked
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users bu
      WHERE (bu.blocker_id = auth.uid() AND bu.blocked_id = p.user_id)
      OR (bu.blocker_id = p.user_id AND bu.blocked_id = auth.uid())
    )
  )
ORDER BY pp.display_order ASC;

-- Grant access to the view
GRANT SELECT ON public.public_photos_view TO authenticated;

-- 11. CREATE STORAGE POLICIES FOR ENHANCED SECURITY
-- Update existing storage policies to work with new photo system
DROP POLICY IF EXISTS "Users can upload their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile images" ON storage.objects;

-- New storage policies with enhanced security
CREATE POLICY "Users can upload profile photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
  -- Limit file size to 10MB
  AND COALESCE(metadata->>'size', '0')::bigint <= 10485760
  -- Only allow image files
  AND COALESCE(metadata->>'mimetype', '') SIMILAR TO 'image/(jpeg|jpg|png|webp)'
);

CREATE POLICY "Users can update their own profile photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 12. CREATE FUNCTION TO GET PHOTOS FOR A PROFILE
CREATE OR REPLACE FUNCTION public.get_profile_photos(target_user_id uuid)
RETURNS TABLE (
  id uuid,
  file_path text,
  width integer,
  height integer,
  display_order integer,
  is_primary boolean,
  is_verified boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user can view this profile's photos
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = target_user_id
    AND (
      -- Own profile
      p.user_id = auth.uid()
      OR
      -- Public profile that user can access
      (
        p.is_banned = false
        AND p.profile_visibility = 'public'
        AND NOT EXISTS (
          SELECT 1 FROM public.blocked_users bu
          WHERE (bu.blocker_id = auth.uid() AND bu.blocked_id = p.user_id)
          OR (bu.blocker_id = p.user_id AND bu.blocked_id = auth.uid())
        )
      )
    )
  ) THEN
    RETURN;
  END IF;

  -- Return photos
  RETURN QUERY
  SELECT
    pp.id,
    pp.file_path,
    pp.width,
    pp.height,
    pp.display_order,
    pp.is_primary,
    pp.is_verified
  FROM public.profile_photos pp
  LEFT JOIN public.photo_moderation pm ON pp.id = pm.photo_id
  WHERE
    pp.user_id = target_user_id
    AND pp.is_active = true
    AND COALESCE(pm.moderation_status, 'pending') IN ('approved', 'pending')
  ORDER BY pp.display_order ASC;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_profile_photos TO authenticated;

COMMENT ON MIGRATION IS 'Complete multiple photos system with carousel support, moderation, and enhanced security for МойDate';