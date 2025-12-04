import type { Trend, TrendWithScores } from "@/types/trend";

/**
 * 前日比の伸び率を計算
 * @param trend トレンドデータ
 * @returns 伸び率（1.0 = 100%、2.0 = 200%）
 */
export function calcGrowthRate(trend: Trend): number {
  const denominator = Math.max(trend.views_yesterday, 1);
  return trend.views_today / denominator;
}

/**
 * 過去3日平均との比較スコアを計算
 * @param trend トレンドデータ
 * @returns トレンドスコア（1.0以上で上昇傾向）
 */
export function calcTrendScore(trend: Trend): number {
  const denominator = Math.max(trend.views_last_3days_avg, 1);
  return trend.views_today / denominator;
}

/**
 * ランキング変動を正規化（0-1の範囲）
 * ランキングが上がる（数値が小さくなる）= 良い = 1.0に近い
 * @param trend トレンドデータ
 * @returns 正規化されたランキング変動スコア（0-1）
 */
export function calcRankChangeNormalized(trend: Trend): number {
  // ランキングが同じ場合
  if (trend.rank_today === trend.rank_yesterday) {
    return 0.5;
  }

  // ランキングが上がった場合（数値が小さくなった）
  if (trend.rank_today < trend.rank_yesterday) {
    const rankChange = trend.rank_yesterday - trend.rank_today;
    // 最大100位の変動を想定して正規化
    const normalized = Math.min(rankChange / 100, 1.0);
    return 0.5 + normalized * 0.5; // 0.5-1.0の範囲
  }

  // ランキングが下がった場合（数値が大きくなった）
  const rankChange = trend.rank_today - trend.rank_yesterday;
  const normalized = Math.min(rankChange / 100, 1.0);
  return 0.5 - normalized * 0.5; // 0.0-0.5の範囲
}

/**
 * バズスコアを計算（総合的なバズ初動指標）
 * @param trend トレンドデータ
 * @returns バズスコア（1.5以上でバズ扱い）
 */
export function calcBuzzScore(trend: Trend): number {
  const growthRate = calcGrowthRate(trend);
  const trendScore = calcTrendScore(trend);
  const rankChangeNormalized = calcRankChangeNormalized(trend);

  // 重み付け平均
  // growthRate: 40%, trendScore: 30%, rankChangeNormalized: 30%
  const buzzScore =
    growthRate * 0.4 + trendScore * 0.3 + rankChangeNormalized * 2.0 * 0.3;

  return buzzScore;
}

/**
 * トレンドデータにスコアを付与
 * @param trend トレンドデータ
 * @returns スコア付きトレンドデータ
 */
export function addScoresToTrend(trend: Trend): TrendWithScores {
  return {
    ...trend,
    growthRate: calcGrowthRate(trend),
    trendScore: calcTrendScore(trend),
    rankChangeNormalized: calcRankChangeNormalized(trend),
    buzzScore: calcBuzzScore(trend),
  };
}

/**
 * バズ初動商品をフィルタリング
 * @param trends トレンドデータの配列
 * @param threshold バズスコアの閾値（デフォルト: 1.5）
 * @returns バズ初動商品の配列（バズスコア降順）
 */
export function filterBuzzTrends(
  trends: Trend[],
  threshold: number = 1.5
): TrendWithScores[] {
  return trends
    .map(addScoresToTrend)
    .filter((trend) => trend.buzzScore >= threshold)
    .sort((a, b) => b.buzzScore - a.buzzScore);
}
