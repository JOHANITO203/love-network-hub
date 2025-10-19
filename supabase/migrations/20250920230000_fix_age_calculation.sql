-- Fix the age calculation function
-- This fixes the PostgreSQL error: function pg_catalog.extract(unknown, integer) does not exist

DROP TRIGGER IF EXISTS calculate_age_trigger ON public.profiles;
DROP FUNCTION IF EXISTS public.calculate_age_from_dob();

-- Create corrected function to calculate age from date_of_birth
CREATE OR REPLACE FUNCTION public.calculate_age_from_dob()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.date_of_birth IS NOT NULL THEN
    -- Correct PostgreSQL syntax for age calculation
    NEW.age = EXTRACT(YEAR FROM AGE(current_date, NEW.date_of_birth));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER calculate_age_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_age_from_dob();