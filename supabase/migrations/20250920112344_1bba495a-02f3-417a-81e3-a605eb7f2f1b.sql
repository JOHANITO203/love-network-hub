-- Fix security issue: Update function to set search_path securely
CREATE OR REPLACE FUNCTION public.calculate_age_from_dob()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.date_of_birth IS NOT NULL THEN
    NEW.age = FLOOR(EXTRACT(days FROM (current_date - NEW.date_of_birth)) / 365.25);
  END IF;
  RETURN NEW;
END;
$$;