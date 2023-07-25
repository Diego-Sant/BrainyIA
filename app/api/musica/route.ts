import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || ""
});

export async function POST(req: Request) {
    try {
        const {userId} = auth();
        const body = await req.json();
        const {prompt} = body;

        if (!userId) {
            return new NextResponse("Não autorizado!", {status: 401});
        }

        if (!prompt) {
            return new NextResponse("As mensagens são obrigatórias!", {status: 400})
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro) {
            return new NextResponse("Teste de avaliação gratuita expirou!", { status: 403 })
        }

        const response = await replicate.run(
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            {
              input: {
                prompt_a: prompt
              }
            }
        );

        if (!isPro) {
            await increaseApiLimit();
        }

        return NextResponse.json(response);
    } catch (error) {
        console.log("[MUSICA_ERROR]", error);
        return new NextResponse("Erro interno", { status: 500 })
    }
}