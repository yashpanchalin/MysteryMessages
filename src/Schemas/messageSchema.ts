import { z } from "zod";

export const messageSchema = z.object({
    content : z
    .string()
    .min(10, {message: "Content must contain 10 Characters"})
    .max(300, {message: "Content must contain upto 300 Characters"})
})