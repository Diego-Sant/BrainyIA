"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import axios from "axios";
import {ChatCompletionRequestMessage} from "openai";

import { MessageSquare, SendHorizonal, Trash2 } from "lucide-react"

import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Heading from "@/components/heading"
import { cn } from "@/lib/utils";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/userAvatar";
import { BotAvatar } from "@/components/botAvatar";
import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useProModal } from "@/hooks/useProModal";

const ConversationPage = () => {
    const router = useRouter();
    const proModal = useProModal();
    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionRequestMessage = {
                role: "user",
                content: values.prompt
            }

            const newMessages = [...messages, userMessage]; // Aparecer todas as messages que já foram usadas

            const response = await axios.post("/api/conversa", {
                messages: newMessages
            });

            setMessages((current) => [...current, userMessage, response.data]);

            const updatedMessages = [...messages, userMessage, response.data];
            localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));

            form.reset();
        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            }
        } finally {
            router.refresh();
        }
    }

    const clearChatMessages = () => {
        localStorage.removeItem("chatMessages");
        setMessages([]);
    };

    useEffect(() => {
        const savedMessages = localStorage.getItem("chatMessages");
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          setMessages(parsedMessages);
        }
    }, []);

  return (
    <div>
        <div className="flex justify-between items-center">
            <Heading title="Bate-papo" description="Faça requisições, tire dúvidas e muito mais!" icon={MessageSquare} iconColor="text-violet-500" bgColor="bg-violet-500/10" />
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="mr-4 lg:mr-7" disabled={messages.length === 0} variant="destructive">
                        <Trash2 />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>Se você apagar as conversas atuais elas nunca mais irão aparecer novamente!</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={clearChatMessages}>Deletar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        <div className="px-4 lg:px-8">
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg bg-[#1f1f1f] w-full p-4 px-3 md:px-6 grid grid-cols-12 gap-2">
                        <FormField name="prompt" render={({ field }) => (
                            <FormItem className="col-span-10 lg:col-span-11">
                                <FormControl className="m-0 p-0">
                                    <Input className="text-sm bg-[#1f1f1f] focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading} placeholder="Ex: Explique a teoria da relatividade de Einstein de forma simples." {...field} />
                                </FormControl>
                            </FormItem>
                        )} />
                        <Button className="col-span-2 lg:col-span-1 w-full bg-[#121212] hover:bg-[#121212]/60" disabled={isLoading}>
                            <SendHorizonal />
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="space-y-4 mt-4">
                {isLoading && (
                    <div className="flex flex-col justify-center items-center">
                        <Loader />
                    </div>
                )}
                {messages.length === 0 && !isLoading && (
                    <Empty label="Ainda não há nenhum histórico de conversa." />
                )}
                <div className="flex flex-col-reverse gap-y-4">
                    {messages.map((message) => (
                        <div key={message.content} className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg text-white", message.role === "user" ? "bg-[#1f1f1f] border border-black/10" : "bg-[#2d2d2d]")}>
                            {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                            <ReactMarkdown className="text-sm overflow-hidden leading-7" components={{
                                pre: ({node, ...props}) => (
                                    <div className="overflow-auto w-full my-2 bg-black/20 p-2 rounded-lg">
                                        <pre {...props} />
                                    </div>
                                ),
                                code: ({ node, ...props}) => (
                                    <code className="bg-black/40 rounded-lg p-1" {...props} />
                                )
                            }}>
                                {message.content || ""}
                            </ReactMarkdown>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ConversationPage