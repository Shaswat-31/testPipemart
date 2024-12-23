import { z } from "zod";

export const loginSchma = z.object({
    email: z.string(),
    password: z.string(),
}) 