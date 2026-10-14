import { z } from "zod";

const envSchema = z.object({
  VITE_BASE_URL: z.coerce.string(),
})

export const ENV = envSchema.parse(import.meta.env);

