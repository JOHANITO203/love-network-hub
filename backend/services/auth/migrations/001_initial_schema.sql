-- МойDate Auth Service Database Schema
-- Russian Data Protection Law (152-FZ) Compliant

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE,
  phone_verified BOOLEAN DEFAULT false,
  email VARCHAR(255) UNIQUE,
  email_verified BOOLEAN DEFAULT false,
  vk_id VARCHAR(100) UNIQUE,
  google_id VARCHAR(100) UNIQUE,
  apple_id VARCHAR(100) UNIQUE,
  instagram_id VARCHAR(100) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  CONSTRAINT at_least_one_identifier CHECK (
    phone IS NOT NULL OR
    email IS NOT NULL OR
    vk_id IS NOT NULL OR
    google_id IS NOT NULL OR
    apple_id IS NOT NULL OR
    instagram_id IS NOT NULL
  )
);

CREATE INDEX idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_vk_id ON users(vk_id) WHERE vk_id IS NOT NULL;
CREATE INDEX idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;
CREATE INDEX idx_users_created_at ON users(created_at);

-- OTP codes table
CREATE TABLE IF NOT EXISTS otp_codes (
  id BIGSERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  attempts INT DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_otp_phone_verified ON otp_codes(phone, verified) WHERE verified = false;
CREATE INDEX idx_otp_expires_at ON otp_codes(expires_at);

-- Auth logs table (152-FZ audit requirement)
CREATE TABLE IF NOT EXISTS auth_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  provider VARCHAR(20) NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_auth_logs_user_id ON auth_logs(user_id);
CREATE INDEX idx_auth_logs_created_at ON auth_logs(created_at);
CREATE INDEX idx_auth_logs_event_type ON auth_logs(event_type);
CREATE INDEX idx_auth_logs_ip_address ON auth_logs(ip_address);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Cleanup expired OTP codes (run daily)
CREATE OR REPLACE FUNCTION cleanup_expired_otp()
RETURNS void AS $$
BEGIN
  DELETE FROM otp_codes WHERE expires_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE users IS 'User accounts with multiple auth providers (152-FZ compliant)';
COMMENT ON TABLE otp_codes IS 'One-time password codes for phone verification';
COMMENT ON TABLE auth_logs IS 'Audit log for all authentication events (152-FZ requirement)';
