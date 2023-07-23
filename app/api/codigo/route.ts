import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
    role: "system",
    content: "Você é um programador que tem conhecimento de diversas áreas de programação, responda sempre perguntas envolvendo programação, caso o usuário pergunte sobre outra área, apenas diga que você não tem conhecimento sobre esse assunto e que trabalha apenas com programação. Caso necessário, use sempre códigos para explicar alguma pergunta."
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
        console.log("[CODIGO_ERROR]", error);
        return new NextResponse("Erro interno", { status: 500 })
    }
}