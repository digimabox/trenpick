/**
 * トレンド商品の基本型
 * Supabaseのtrendsテーブルに対応
 */
export type Trend = {
  id: string;
  name: string;
  url: string;
  category: string;
  views_today: number;
  views_yesterday: number;
  views_last_3days_avg: number;
  rank_today: number;
  rank_yesterday: number;
  created_at: string;
  trend_date: string;
};

/**
 * スコア計算結果を含むトレンド型
 */
export type TrendWithScores = Trend & {
  growthRate: number;
  trendScore: number;
  rankChangeNormalized: number;
  buzzScore: number;
};
