"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios";
import { cn } from "@/lib/utils";
import {ChatCompletionRequestMessage} from "openai";

import { Pi, SendHorizonal, Trash2 } from "lucide-react"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Heading from "@/components/heading"
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

const MathPage = () => {
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

            const response = await axios.post("/api/matematica", {
                messages: newMessages
            });

            setMessages((current) => [...current, userMessage, response.data]);

            const updatedMessages = [...messages, userMessage, response.data];
            localStorage.setItem("mathMessages", JSON.stringify(updatedMessages));

            form.reset();
        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            }
        } finally {
            router.refresh();
        }
    }

    const clearMathMessages = () => {
        localStorage.removeItem("mathMessages");
        setMessages([]);
    };

    useEffect(() => {
        const savedMessages = localStorage.getItem("mathMessages");
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          setMessages(parsedMessages);
        }
    }, []);

  return (
    <div>
        <div className="flex justify-between items-center">
            <Heading title="Matemática" description="Tire dúvidas sobre cálculos, funções e muito mais!" icon={Pi} iconColor="text-cyan-500" bgColor="bg-cyan-500/10" />
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
                        <AlertDialogAction onClick={clearMathMessages}>Deletar</AlertDialogAction>
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
                                    <textarea className="text-sm bg-[#1f1f1f] pt-[0.1rem] lg:pt-[0.6rem] -mb-4 focus-visible:ring-0 focus-visible:ring-transparent w-full outline-none" disabled={isLoading} placeholder="Ex: Qual é a área de um círculo com raio de 5 metros? (Use π ≈ 3.14)" {...field} />
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
                            <p className={cn("text-sm", message.role === "user" ? "mt-1" : "mt-4")}>
                                {message.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default MathPage