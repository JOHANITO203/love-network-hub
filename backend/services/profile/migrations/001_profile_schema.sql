CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  bio TEXT,
  age INT NOT NULL CHECK (age >= 18 AND age <= 100),
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  looking_for VARCHAR(10) NOT NULL CHECK (looking_for IN ('male', 'female', 'both')),
  location GEOGRAPHY(Point, 4326),
  city VARCHAR(100),
  country VARCHAR(2) DEFAULT 'RU',
  interests TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT max_photos CHECK (array_length(photos, 1) IS NULL OR array_length(photos, 1) <= 6)
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_location ON profiles USING GIST(location);
CREATE INDEX idx_profiles_age_gender ON profiles(age, gender);
CREATE INDEX idx_profiles_looking_for ON profiles(looking_for);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

CREATE TABLE IF NOT EXISTS profile_views (
  id BIGSERIAL PRIMARY KEY,
  viewer_id UUID NOT NULL,
  viewed_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(viewer_id, viewed_id, created_at::date)
);

CREATE INDEX idx_profile_views_viewer ON profile_views(viewer_id);
CREATE INDEX idx_profile_views_viewed ON profile_views(viewed_id);
CREATE INDEX idx_profile_views_created ON profile_views(created_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE profiles IS 'User profiles with geolocation (PostGIS)';
COMMENT ON TABLE profile_views IS 'Track profile view history';
