-- Add fields for trend analysis and buzz detection
ALTER TABLE trends
  ADD COLUMN IF NOT EXISTS views_last_3days_avg NUMERIC(10, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rank_today INTEGER,
  ADD COLUMN IF NOT EXISTS rank_yesterday INTEGER;

-- Create index for rank_today for faster queries
CREATE INDEX IF NOT EXISTS idx_trends_rank_today ON trends(rank_today);

-- Create index for views_last_3days_avg
CREATE INDEX IF NOT EXISTS idx_trends_views_last_3days_avg ON trends(views_last_3days_avg);

