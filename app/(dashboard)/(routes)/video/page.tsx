"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import axios from "axios";

import { SendHorizonal, VideoIcon } from "lucide-react"

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

const VideoPage = () => {
    const router = useRouter();
    const proModal = useProModal();
    const [video, setVideo] = useState<string>();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            setVideo(undefined)

            const response = await axios.post("/api/video", values);

            setVideo(response.data[0]);

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
            <Heading title="Gerador de vídeo" description="Crie um vídeo curto de acordo com a sua criatividade!" icon={VideoIcon} iconColor="text-orange-700" bgColor="bg-orange-700/10" />
        </div>
        <div className="px-4 lg:px-8">
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg bg-[#1f1f1f] w-full p-4 px-3 md:px-6 grid grid-cols-12 gap-2">
                        <FormField name="prompt" render={({ field }) => (
                            <FormItem className="col-span-10 lg:col-span-11">
                                <FormControl className="m-0 p-0">
                                    <Input className="text-sm bg-[#1f1f1f] focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading} placeholder="Ex: Film a quick tour of a workspace or room. (De preferência em inglês)" {...field} />
                                </FormControl>
                            </FormItem>
                        )} />
                        <Button className="col-span-2 lg:col-span-1 w-full bg-[#121212] hover:bg-[#121212]/60" type="submit" disabled={isLoading}>
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
                {!video && !isLoading && (
                    <Empty label="Ainda não foi gerado nenhuma música." />
                )}
                {video && (
                    <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
                        <source src={video} />
                    </video>
                )}
            </div>
        </div>
    </div>
  )
}

export default VideoPage