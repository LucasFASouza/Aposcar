import { z } from "zod";

export const onboardUserInputSchema = z.object({
  username: z
    .string()
    .regex(
      new RegExp(/^[a-zA-Z0-9_]+$/),
      "Only letters, numbers and underscores are allowed",
    )
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
});
export type OnboardUserInput = z.infer<typeof onboardUserInputSchema>;
