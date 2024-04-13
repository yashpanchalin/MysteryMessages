import { z } from "zod";

export const sigInSchema = z.object({
    email : z.string(),
    password : z.string()
}) 