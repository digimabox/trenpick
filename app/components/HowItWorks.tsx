import { Database, Brain, Bell, Video } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Database,
    title: "トレンドデータを自動収集",
    description:
      "TikTok Shopの商品データを24時間自動で収集し、リアルタイムで分析します。",
  },
  {
    number: "02",
    icon: Brain,
    title: "独自ロジックで「バズ初動」を判定",
    description:
      "前日比、ランキング変動、過去3日平均など複数の指標を組み合わせて、本物のバズを検知します。",
  },
  {
    number: "03",
    icon: Bell,
    title: "あなたのDiscordに通知",
    description:
      "バズ初動を検知したら、即座にDiscord Webhookで通知。アプリを開かなくても情報が届きます。",
  },
  {
    number: "04",
    icon: Video,
    title: "すぐに動画やフォト投稿を作成",
    description:
      "通知を受け取ったら、すぐにコンテンツ作成に取り掛かれます。競合より早く動画を公開できます。",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            仕組み
          </h2>
          <p className="text-xl text-gray-600">
            シンプルな4ステップで、バズ初動をキャッチ
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center gap-8`}
                >
                  {/* Icon & Number */}
                  <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center">
                    <div className="relative">
                      <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon className="h-16 w-16 text-blue-600" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          {step.number}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

