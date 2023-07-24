"use client";

import { useProModal } from "@/hooks/useProModal";
import { cn } from "@/lib/utils";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Check, Code, ImageIcon, Languages, MessageSquare, Music, Pi, ScrollText, TestTube2, VideoIcon, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

const tools = [
    {
      label: "Bate-papo",
      icon: MessageSquare,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10"
    },
    {
      label: "Gerador de imagem",
      icon: ImageIcon,
      color: "text-pink-700",
      bgColor: "bg-pink-700/10"
    },
    {
      label: "Gerador de vídeo",
      icon: VideoIcon,
      color: "text-orange-700",
      bgColor: "bg-orange-700/10"
    },
    {
      label: "Gerador de música",
      icon: Music,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      label: "Gerador de código",
      icon: Code,
      color: "text-green-700",
      bgColor: "bg-green-700/10"
    },
    {
      label: "Tradutor",
      icon: Languages,
      color: "text-amber-600",
      bgColor: "bg-amber-600/10"
    },
    {
      label: "Matemática",
      icon: Pi,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10"
    },
    {
      label: "História",
      icon: ScrollText,
      color: "text-yellow-600",
      bgColor: "bg-yellow-600/10"
    },
    {
      label: "Ciência",
      icon: TestTube2,
      color: "text-red-600",
      bgColor: "bg-red-600/10"
    }
  ]

export const ProModal = () => {
    const proModal = useProModal();
    
    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                        <div className="flex items-center gap-x-2 font-bold py-1">
                            Melhorar seu plano
                            <Badge variant="premium" className="text-sm py-1 cursor-pointer">
                                PRO
                            </Badge>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2 space-y-2 text-gray-200 font-medium">
                        {tools.map((tool) => (
                            <Card key={tool.label} className="p-3 border-0 bg-[#2d2d2d] text-white flex items-center justify-between">
                                <div className="flex items-center gap-x-4">
                                    <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                        <tool.icon className={cn("w-6 h-6", tool.color)} />
                                    </div>
                                    <div className="font-semibold text-sm">
                                        {tool.label}
                                    </div>
                                </div>
                                <Check className="w-5 h-5" />
                            </Card>
                        ))}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button size="lg" variant="premium" className="w-full">
                        Virar premium
                        <Zap className="w-4 h-4 ml-2 fill-white" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}