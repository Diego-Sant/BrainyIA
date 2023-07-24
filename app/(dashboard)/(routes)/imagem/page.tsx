"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import axios from "axios";

import { Download, ImageIcon, SendHorizonal } from "lucide-react"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";
import { useState } from "react";

import Heading from "@/components/heading"
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useProModal } from "@/hooks/useProModal";

const ImagePage = () => {
    const [images, setImages] = useState<string[]>([])
    const router = useRouter();
    const proModal = useProModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          prompt: "",
          amount: "1",
          resolution: "512x512"
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            setImages([]);
            const response = await axios.post("/api/imagem", values);

            const urls = response.data.map((image: {url: string}) => image.url)

            setImages(urls);

            form.reset();
        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            }
        } finally {
            router.refresh();
        }
    }

    const parseResolution = (resolution: string) => {
        const [width, height] = resolution.split("x").map((str) => parseInt(str, 10));
        return { width, height };
    };

  return (
    <div>
        <div className="flex justify-between items-center">
            <Heading title="Gerador de imagens" description="Teste sua imaginação e crie imagens com nossa inteligência artificial!" icon={ImageIcon} iconColor="text-pink-700" bgColor="bg-pink-700/10" />
        </div>
        <div className="px-4 lg:px-8">
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg bg-[#1f1f1f] w-full p-4 px-3 md:px-6 grid grid-cols-12 gap-2">
                        <FormField name="prompt" render={({ field }) => (
                            <FormItem className="col-span-12 lg:col-span-7">
                                <FormControl className="m-0 p-0">
                                    <Input className="text-sm bg-[#1f1f1f] focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading} placeholder="Ex: Golden sunflowers dancing in the summer breeze. (De preferência em inglês)" {...field} />
                                </FormControl>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="amount" render={({field}) => (
                            <FormItem className="col-span-12 lg:col-span-2">
                                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {amountOptions.map((options) => (
                                            <SelectItem key={options.value} value={options.value}>
                                                {options.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="resolution" render={({field}) => (
                            <FormItem className="col-span-12 lg:col-span-2">
                                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {resolutionOptions.map((options) => (
                                            <SelectItem key={options.value} value={options.value}>
                                                {options.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                        <Button className="col-span-12 lg:col-span-1 w-full bg-[#121212] hover:bg-[#121212]/60" disabled={isLoading}>
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
                {images.length === 0 && !isLoading && (
                    <Empty label="Nenhuma imagem foi gerada ainda." />
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                    {images.map((src) => {
                        const { width, height } = parseResolution(form.getValues().resolution);
                        
                        return (
                            <Card key={src} className="rounded-lg overflow-hidden">
                            <div className="relative aspect-square">
                                <Image src={src} alt="Imagem gerada pela AI" width={width} height={height} />
                            </div>
                            <CardFooter className="p-2 bg-[#1f1f1f]">
                                <Button onClick={() => window.open(src)} variant="default" className="w-full bg-[#1f1f1f] hover:bg-black/10">
                                <Download className="h-4 w-4 mr-2 text-white" />
                                    <p className="text-white">Baixar</p>
                                </Button>
                            </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ImagePage