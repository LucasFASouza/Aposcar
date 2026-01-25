import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { onboardUserInputSchema } from "@/server/api/zod/users";
import { auth } from "@/server/auth";
import {
  users,
  userSelectSchema,
  userFavoriteMovies,
  userFollows,
} from "@/server/db/schema/auth";
import { dbtEdition } from "@/server/db/schema/aposcar";
import { TRPCError } from "@trpc/server";
import { eq, and, not, count, like, or } from "drizzle-orm";
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
        favoriteMovie: z
          .string()
          .uuid()
          .optional()
          .or(z.literal(""))
          .transform((val) => (val === "" ? undefined : val)),
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

      // Get active edition for favorite movie operations
      const activeEdition = await ctx.db.query.dbtEdition.findFirst({
        where: eq(dbtEdition.isActive, true),
      });

      if (!activeEdition) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No active edition found",
        });
      }

      // Always delete existing favorite for this edition first
      await ctx.db
        .delete(userFavoriteMovies)
        .where(
          and(
            eq(userFavoriteMovies.user, ctx.session.user.id),
            eq(userFavoriteMovies.edition, activeEdition.id),
          ),
        );

      // Insert new favorite if provided
      if (favoriteMovie) {
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

  getAllUsers: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const searchTerm = input?.search;

      const allUsers = await ctx.db.query.users.findMany({
        where: searchTerm
          ? or(
              like(users.username, `%${searchTerm}%`),
              like(users.name, `%${searchTerm}%`),
            )
          : undefined,
        columns: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
        orderBy: (users, { asc }) => [asc(users.username)],
      });

      return allUsers;
    }),

  isFollowing: protectedProcedure
    .input(z.object({ targetUserId: z.string() }))
    .query(async ({ ctx, input }) => {
      const follow = await ctx.db.query.userFollows.findFirst({
        where: and(
          eq(userFollows.followerId, ctx.session.user.id),
          eq(userFollows.followingId, input.targetUserId),
        ),
      });
      return !!follow;
    }),

  followUser: protectedProcedure
    .input(z.object({ targetUserId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id === input.targetUserId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot follow yourself",
        });
      }

      await ctx.db.insert(userFollows).values({
        followerId: ctx.session.user.id,
        followingId: input.targetUserId,
      });

      return { success: true };
    }),

  unfollowUser: protectedProcedure
    .input(z.object({ targetUserId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(userFollows)
        .where(
          and(
            eq(userFollows.followerId, ctx.session.user.id),
            eq(userFollows.followingId, input.targetUserId),
          ),
        );

      return { success: true };
    }),

  getFollowCounts: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const followersCount = await ctx.db
        .select({ count: count() })
        .from(userFollows)
        .where(eq(userFollows.followingId, input.userId));

      const followingCount = await ctx.db
        .select({ count: count() })
        .from(userFollows)
        .where(eq(userFollows.followerId, input.userId));

      return {
        followers: followersCount[0]?.count ?? 0,
        following: followingCount[0]?.count ?? 0,
      };
    }),

  getFollowers: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const followers = await ctx.db
        .select({
          id: users.id,
          username: users.username,
          image: users.image,
        })
        .from(userFollows)
        .innerJoin(users, eq(userFollows.followerId, users.id))
        .where(eq(userFollows.followingId, input.userId));

      return followers;
    }),

  getFollowing: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const following = await ctx.db
        .select({
          id: users.id,
          username: users.username,
          image: users.image,
        })
        .from(userFollows)
        .innerJoin(users, eq(userFollows.followingId, users.id))
        .where(eq(userFollows.followerId, input.userId));

      return following;
    }),
});
