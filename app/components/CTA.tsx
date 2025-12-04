import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6" />
            <span className="text-blue-100 font-medium">今すぐ始めよう</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span style={{ color: "#ff751f" }}>Trenpick</span>
            を使って
            <br />
            トレンドの初動を取ろう
          </h2>

          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            バズ初動を逃さない。競合より早く動画を作る。
            <br />
            無料で始めて、今すぐトレンドに乗り遅れない。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto text-lg px-8 py-6 h-auto bg-white text-blue-600 hover:bg-gray-100"
              >
                今すぐ無料で始める
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-6 h-auto border-white text-white hover:bg-white/10"
              >
                料金を見る
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-blue-100">
            クレジットカード不要・登録は30秒で完了
          </p>
        </div>
      </div>
    </section>
  );
}

