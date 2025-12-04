import {
  Zap,
  MessageSquare,
  Smartphone,
  Package,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "バズ初動を自動検知",
    description:
      "前日比・急上昇ランキングをもとにリアルタイム分析。バズり始めた商品をいち早くキャッチします。",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    icon: MessageSquare,
    title: "Discordに即時通知",
    description:
      "アプリ不要で手軽。通知スピードが速く、バズ初動を逃しません。",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
  {
    icon: Smartphone,
    title: "TikTokアフィに最適化",
    description:
      "今バズっている商品ネタを毎日自動入手。フォト投稿との相性が最高で、コンテンツ作成が効率化されます。",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
  },
  {
    icon: Package,
    title: "全ジャンル対応",
    description:
      "ガジェット / 美容 / 日用品 / 生活雑貨など、幅広いカテゴリに対応。今後もカテゴリ拡張予定です。",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            なぜTrenpickなのか
          </h2>
          <p className="text-xl text-gray-600">
            バズ初動を逃さない、クリエイターのためのツール
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <div
                    className={`w-14 h-14 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <Icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

