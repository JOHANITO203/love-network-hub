-- Add new columns to profiles table for enhanced profile setup

-- Add country fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS country_origin TEXT,
ADD COLUMN IF NOT EXISTS country_current TEXT;

-- Add permission fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS contact_access_granted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT FALSE;

-- Add comments for documentation
COMMENT ON COLUMN profiles.country_origin IS 'ISO2 country code of user origin/birth country';
COMMENT ON COLUMN profiles.country_current IS 'ISO2 country code of user current residence';
COMMENT ON COLUMN profiles.contact_access_granted IS 'User permission for contact access';
COMMENT ON COLUMN profiles.notifications_enabled IS 'User preference for notifications';

-- Update updated_at trigger if it exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger exists on profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
