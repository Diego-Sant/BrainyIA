import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
    try {
        const {userId} = auth();
        const body = await req.json();
        const {prompt, amount = 1, resolution = "512x512"} = body;

        if (!userId) {
            return new NextResponse("Não autorizado!", {status: 401});
        }

        if (!configuration.apiKey) {
            return new NextResponse("Open AI não está configurada!", {status: 500})
        }

        if (!prompt) {
            return new NextResponse("A requisição é obrigatória!", {status: 400})
        }

        if (!amount) {
            return new NextResponse("A quantidade é obrigatória!", {status: 400})
        }

        if (!resolution) {
            return new NextResponse("A resolução é obrigatória!", {status: 400})
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial) {
            return new NextResponse("Teste de avaliação gratuita expirou!", { status: 403 })
        }

        const response = await openai.createImage({
            prompt,
            n: parseInt(amount, 10),
            size: resolution
        });

        await increaseApiLimit();

        return NextResponse.json(response.data.data);
    } catch (error) {
        console.log("[IMAGEM_ERROR]", error);
        return new NextResponse("Erro interno", { status: 500 })
    }
}