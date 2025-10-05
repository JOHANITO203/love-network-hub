-- Add date_of_birth column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN date_of_birth DATE;

-- Add trigger to automatically calculate age from date_of_birth
CREATE OR REPLACE FUNCTION public.calculate_age_from_dob()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.date_of_birth IS NOT NULL THEN
    NEW.age = FLOOR(EXTRACT(days FROM (current_date - NEW.date_of_birth)) / 365.25);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_age_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_age_from_dob();