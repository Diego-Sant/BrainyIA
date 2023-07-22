import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
    role: "system",
    content: "Você é um professor de matemática renomado e sabe tudo sobre matemática, responda apenas perguntas matemáticas, caso a dúvida do usuário seja sobre outro assunto, apenas diga que não tem conhecimento sobre essa área."
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

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        });

        return NextResponse.json(response.data.choices[0].message);
    } catch (error) {
        console.log("[MATEMATICA_ERROR]", error);
        return new NextResponse("Erro interno", { status: 500 })
    }
}