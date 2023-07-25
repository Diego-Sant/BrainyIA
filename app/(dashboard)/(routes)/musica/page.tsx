"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import axios from "axios";

import { Music, SendHorizonal } from "lucide-react"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";
import { useState } from "react";

import Heading from "@/components/heading"
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { useProModal } from "@/hooks/useProModal";

const MusicPage = () => {
    const router = useRouter();
    const proModal = useProModal();
    const [music, setMusic] = useState<string>();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            setMusic(undefined)

            const response = await axios.post("/api/musica", values);

            setMusic(response.data.audio);

            form.reset();
        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            }
        } finally {
            router.refresh();
        }
    }

  return (
    <div>
        <div className="flex justify-between items-center">
            <Heading title="Gerador de música" description="Seja criativo e crie sua própria melodia!" icon={Music} iconColor="text-emerald-500" bgColor="bg-emerald-500/10" />
        </div>
        <div className="px-4 lg:px-8">
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg bg-[#1f1f1f] w-full p-4 px-3 md:px-6 grid grid-cols-12 gap-2">
                        <FormField name="prompt" render={({ field }) => (
                            <FormItem className="col-span-10 lg:col-span-11">
                                <FormControl className="m-0 p-0">
                                    <textarea className="text-sm bg-[#1f1f1f] pt-[0.1rem] lg:pt-[0.6rem] -mb-4 focus-visible:ring-0 focus-visible:ring-transparent w-full outline-none" disabled={isLoading} placeholder="Ex: Crie uma melodia relaxante e suave, perfeita para uma tarde tranquila." {...field} />
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
                {!music && !isLoading && (
                    <Empty label="Ainda não foi gerado nenhuma música." />
                )}
                {music && (
                    <audio controls className="w-full mt-8">
                        <source src={music} />
                    </audio>
                )}
            </div>
        </div>
    </div>
  )
}

export default MusicPage