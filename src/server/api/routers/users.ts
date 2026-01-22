import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { onboardUserInputSchema } from "@/server/api/zod/users";
import { auth } from "@/server/auth";
import { users, userSelectSchema, userFavoriteMovies } from "@/server/db/schema/auth";
import { dbtEdition } from "@/server/db/schema/aposcar";
import { TRPCError } from "@trpc/server";
import { eq, and, not } from "drizzle-orm";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  onboardUser: protectedProcedure
    .input(onboardUserInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({
          username: input.username,
          image: input.image,
          completedOnboarding: new Date(),
        })
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
        image: z.string().optional(),
        favoriteMovie: z.string().uuid().optional(),
        letterboxdUsername: z.string().optional(),
        twitterUsername: z.string().optional(),
        bskyUsername: z.string().optional(),
        githubUsername: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db
        .select()
        .from(users)
        .where(
          and(
            eq(users.username, input.username),
            not(eq(users.id, ctx.session.user.id)),
          ),
        );

      if (existingUser.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "DUPLICATE_USERNAME",
        });
      }

      const { favoriteMovie, ...userData } = input;

      await ctx.db
        .update(users)
        .set(userData)
        .where(eq(users.id, ctx.session.user.id));

      // Update favorite movie if provided
      if (favoriteMovie) {
        const activeEdition = await ctx.db.query.dbtEdition.findFirst({
          where: eq(dbtEdition.isActive, true),
        });

        if (!activeEdition) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "No active edition found",
          });
        }

        // Delete existing favorite for this edition
        await ctx.db
          .delete(userFavoriteMovies)
          .where(
            and(
              eq(userFavoriteMovies.user, ctx.session.user.id),
              eq(userFavoriteMovies.edition, activeEdition.id),
            ),
          );

        // Insert new favorite
        await ctx.db.insert(userFavoriteMovies).values({
          user: ctx.session.user.id,
          movie: favoriteMovie,
          edition: activeEdition.id,
        });
      }

      return { success: true };
    }),
  getUserById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const activeEdition = await ctx.db.query.dbtEdition.findFirst({
        where: eq(dbtEdition.isActive, true),
      });

      if (!activeEdition) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No active edition found",
        });
      }

      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input),
        with: {
          favoriteMovies: {
            where: eq(userFavoriteMovies.edition, activeEdition.id),
            limit: 1,
          },
        },
      });

      if (!user) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "User not found" });
      }

      return {
        ...user,
        favoriteMovie: user.favoriteMovies[0]?.movie ?? null,
      };
    }),
});
