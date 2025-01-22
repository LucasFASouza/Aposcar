import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { onboardUserInputSchema } from "@/server/api/zod/users";
import { auth } from "@/server/auth";
import { users, userSelectSchema } from "@/server/db/schema/auth";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  onboardUser: protectedProcedure
    .input(onboardUserInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ username: input.username, completedOnboarding: new Date() })
        .where(eq(users.id, ctx.session.user.id));

      return { success: true };
    }),
  getUserFromSession: protectedProcedure
    .output(userSelectSchema)
    .query(async ({ ctx }) => {
      const user = (
        await ctx.db
          .select()
          .from(users)
          .where(eq(users.id, ctx.session.user.id))
      ).at(0);
      if (!user) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "User not found" });
      }
      return user;
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        profilePic: z.string().optional(),
        favoriteMovie: z.string().uuid().optional(),
        letterboxdUsername: z.string().optional(),
        twitterUsername: z.string().optional(),
        bskyUsername: z.string().optional(),
        githubUsername: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set(input)
        .where(eq(users.id, ctx.session.user.id));

      return { success: true };
    }),
  getUserById: publicProcedure
    .input(z.string())
    .output(userSelectSchema)
    .query(async ({ ctx, input }) => {
      const user = (
        await ctx.db.select().from(users).where(eq(users.id, input))
      ).at(0);
      if (!user) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "User not found" });
      }
      return user;
    }),
});
