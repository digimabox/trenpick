import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { filterBuzzTrends } from "@/lib/trends";
import type { TrendWithScores } from "@/types/trend";

/**
 * GET /api/trends/hot
 * バズ初動商品を取得するAPIエンドポイント
 *
 * Query Parameters:
 * - threshold: バズスコアの閾値（デフォルト: 1.5）
 * - limit: 取得件数（デフォルト: 10）
 * - category: カテゴリフィルター（オプション）
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const threshold = parseFloat(searchParams.get("threshold") || "1.5");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const category = searchParams.get("category");

    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    // クエリビルダー
    let query = supabase.from("trends").select("*").eq("trend_date", today);

    // カテゴリフィルター
    if (category) {
      query = query.eq("category", category);
    }

    const { data: trends, error } = await query;

    if (error) {
      console.error("Error fetching trends:", error);
      return NextResponse.json(
        { error: "Failed to fetch trends", details: error.message },
        { status: 500 }
      );
    }

    if (!trends || trends.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: "No trends found for today",
      });
    }

    // バズ初動商品をフィルタリング
    const buzzTrends = filterBuzzTrends(trends as any[], threshold);

    // 件数制限
    const limitedTrends = buzzTrends.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: limitedTrends,
      count: limitedTrends.length,
      threshold,
      meta: {
        totalTrends: trends.length,
        buzzTrendsCount: buzzTrends.length,
        date: today,
      },
    });
  } catch (error: any) {
    console.error("Error in /api/trends/hot:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
