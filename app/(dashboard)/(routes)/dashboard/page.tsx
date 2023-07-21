"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MessageSquare, ImageIcon, VideoIcon, Music, Code, Settings, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [
  {
    label: "Bate-papo",
    icon: MessageSquare,
    href: "/conversa",
    color: "text-violet-500"
  },
  {
    label: "Gerador de imagem",
    icon: ImageIcon,
    href: "/imagem",
    color: "text-pink-700",
  },
  {
    label: "Gerador de vídeo",
    icon: VideoIcon,
    href: "/video",
    color: "text-orange-700",
  },
  {
    label: "Gerador de música",
    icon: Music,
    href: "/musica",
    color: "text-emerald-500",
  },
  {
    label: "Gerador de código",
    icon: Code,
    href: "/codigo",
    color: "text-green-700",
  },
  {
    label: "Configurações",
    icon: Settings,
    href: "/configuracoes"
  },
]

const Dashboard = () => {
    const router = useRouter();

    return (
      <div className="md:ml-2 rounded-l-md">
        <div className="mb-8 mt-2 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-center py-4">Explore o poder do BrainyAI</h2>
          <p className="text-gray-200 font-light text-sm md:text-lg text-center">Teste todas as funcionalidades da nossa AI</p>
        </div>
        <div className="px-4 md:px-20 lg:px-32 space-y-4">
          {tools.map((tool) => (
            <Card onClick={() => router.push(tool.href)} key={tool.href} className="p-4 flex bg-[#1f1f1f] text-white border-black/5 items-center justify-between hover:shadow-md transition cursor-pointer">
              <div className="flex items-center gap-x-4">
                <div className={cn("p-2 w-fit rounded-md")}>
                  <tool.icon className={cn("w-6 h-6", tool.color)} />
                </div>
                <div className="font-semibold">
                  {tool.label}
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Card>
          ))}
        </div>
      </div>
    )
}

export default Dashboard;