"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import { MessageSquare, SendHorizonal } from "lucide-react"

import { useForm } from "react-hook-form"

import Heading from "@/components/heading"
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ConversationPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

  return (
    <div>
        <Heading title="Bate-papo" description="Faça requisições, tire dúvidas e muito mais!" icon={MessageSquare} iconColor="text-violet-500" bgColor="bg-violet-500/10" />
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
                        <Button className="col-span-2 lg:col-span-1 w-full" disabled={isLoading}>
                            <SendHorizonal />
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="space-y-4 mt-4">
                Conteúdo
            </div>
        </div>
    </div>
  )
}

export default ConversationPage