import * as z from "zod";

export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "A requisição precisa ter pelo menos 1 caractere!"
    })
})