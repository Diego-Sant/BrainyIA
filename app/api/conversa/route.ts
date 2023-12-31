import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

import { increaseApiLimit, checkApiLimit} from "@/lib/apiLimit";
import { checkSubscription } from "@/lib/subscription";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
    try {
        const {userId} = auth();
        const body = await req.json();
        const {messages} = body;

        if (!userId) {
            return new NextResponse("Não autorizado!", {status: 401});
        }

        if (!configuration.apiKey) {
            return new NextResponse("Open AI não está configurada!", {status: 500})
        }

        if (!messages) {
            return new NextResponse("As mensagens são obrigatórias!", {status: 400})
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro) {
            return new NextResponse("Teste de avaliação gratuita expirou!", { status: 403 })
        }

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages
        });

        if (!isPro) {
            await increaseApiLimit();
        }
        

        return NextResponse.json(response.data.choices[0].message);
    } catch (error) {
        console.log("[CONVERSA_ERROR]", error);
        return new NextResponse("Erro interno", { status: 500 })
    }
}