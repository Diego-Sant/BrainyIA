"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"
import { Montserrat } from "next/font/google";

import Logo from "@/public/images/logo.png"

import { cn } from "@/lib/utils";

import { LayoutDashboard, MessageSquare, ImageIcon, VideoIcon, Music, Code, Settings } from "lucide-react";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Painel de controle",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Bate-papo",
    icon: MessageSquare,
    href: "/conversa",
    color: "text-violet-500",
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
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#1f1f1f] text-white">
        <div className="px-3 py-2 flex-1">
          <Link href="/dashboard" className="flex items-center pl-3 mb-14">
            <div className="relative w-10 h-10 mr-4 flex items-center">
              <Image src={Logo} alt="BrainyIA" />
            </div>
            <h1 className={cn("text-2xl font-bold", montserrat.className)}>BrainyIA</h1>
          </Link>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link key={route.href} href={route.href} className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:font-semibold hover:bg-white/10 rounded-lg transition", pathname === route.href ? "text-white font-semibold" : "text-zinc-400")}>
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
    </div>
  )
}

export default Sidebar