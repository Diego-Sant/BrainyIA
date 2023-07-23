import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

import { increaseApiLimit, checkApiLimit} from "@/lib/apiLimit";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
    role: "system",
    content: "Você é um historiador renomado e sabe tudo sobre história, responda apenas perguntas envolvendo questões históricas, caso a dúvida do usuário seja sobre outro assunto, apenas diga que não tem conhecimento sobre essa área."
}

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

        if (!freeTrial) {
            return new NextResponse("Teste de avaliação gratuita expirou!", { status: 403 })
        }

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        });

        await increaseApiLimit();

        return NextResponse.json(response.data.choices[0].message);
    } catch (error) {
        console.log("[HISTORIA_ERROR]", error);
        return new NextResponse("Erro interno", { status: 500 })
    }
}