import { z } from "zod";

export const onboardUserInputSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Only letters, numbers and underscores are allowed",
    )
    .max(20, "Username must be at most 20 characters"),
  image: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type OnboardUserInput = z.infer<typeof onboardUserInputSchema>;