"use client";

import { useEffect, useState } from "react";

import { MAX_FREE_COUNTS } from "@/contants";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/useProModal";

interface FreeCounterProps {
    apiLimitCount: number;
}

export const FreeCounter: React.FC<FreeCounterProps> = ({ apiLimitCount }) => {
    const [isMounted, setIsMounted] = useState(false);
    const proModal = useProModal();
    
    useEffect(() => {
        setIsMounted(true)
      }, []);
    
      if (!isMounted) { 
        return null;
    }

    return (
        <div className="px-3">
            <Card className="bg-[#2d2d2d]/70 border-0">
                <CardContent className="py-6">
                    <div className="text-center text-sm text-white mb-4 space-y-2">
                        <p>
                            {apiLimitCount} / {MAX_FREE_COUNTS} Testes gratuitos
                        </p>
                        <Progress className="h-3 bg-[#121212]" value={(apiLimitCount / MAX_FREE_COUNTS) * 100} />
                    </div>
                    <Button onClick={proModal.onOpen} variant="premium" className="w-full">Virar premium <Zap className="w-4 h-4 ml-2 fill-white" /></Button>
                </CardContent>
            </Card>
        </div>
    )
}