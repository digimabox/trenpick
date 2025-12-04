-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create alert_settings table
CREATE TABLE IF NOT EXISTS alert_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_channel TEXT NOT NULL CHECK (notification_channel IN ('discord', 'email')),
  discord_webhook_url TEXT,
  email_address TEXT,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, notification_channel)
);

-- Create trends table
CREATE TABLE IF NOT EXISTS trends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  views_today INTEGER NOT NULL DEFAULT 0,
  views_yesterday INTEGER NOT NULL DEFAULT 0,
  growth_rate NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trend_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_alert_settings_user_id ON alert_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_trends_trend_date ON trends(trend_date);
CREATE INDEX IF NOT EXISTS idx_trends_growth_rate ON trends(growth_rate);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trends ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for alert_settings
CREATE POLICY "Users can view their own alert settings"
  ON alert_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alert settings"
  ON alert_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alert settings"
  ON alert_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alert settings"
  ON alert_settings FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for trends (public read access)
CREATE POLICY "Anyone can view trends"
  ON trends FOR SELECT
  USING (true);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

