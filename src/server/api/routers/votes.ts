import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  dbtCategoryTypesPoints,
  dbtCategory,
  dbtNomination,
  dbtVote,
  dbtMovie,
  dbtReceiver,
} from "@/server/db/schema/aposcar";
import { users } from "@/server/db/schema/auth";
import { count } from "console";
import { asc, desc, eq, is, sql, sum } from "drizzle-orm";
import { z } from "zod";

export type UserNomination = {
  categoryName: string;
  votedMovieName: string | null;
  votedReceiverName: string | null;
  votedDescription: string | null;
  isWinner: boolean;
  winnerMovieName: string | null;
  winnerReceiverName: string | null;
  winnerDescription: string | null;
};

const getCurrentUserVotesSchema = z.object({
  id: z.string(),
  isWinner: z.boolean(),
  categoryName: z.string(),
});

const castVoteInputSchema = z.object({
  nominationId: z.string(),
  categorySlug: z.string(),
});

export const votesRouter = createTRPCRouter({
  castVote: protectedProcedure
    .input(castVoteInputSchema)
    .output(
      z.object({
        success: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(ctx.session.user.id);
      // DELETE with JOINS are not yet available on drizzle
      // https://github.com/drizzle-team/drizzle-orm/issues/3100
      await ctx.db.execute(sql`
        DELETE FROM ${dbtVote}
        WHERE
          ${dbtVote.id} IN (
            SELECT
              ${dbtVote.id}
            FROM
              ${dbtVote}
              INNER JOIN ${dbtNomination} ON ${dbtVote.nomination} = ${dbtNomination.id}
              INNER JOIN ${dbtCategory} ON ${dbtNomination.category} = ${dbtCategory.id}
            WHERE
              ${dbtVote.user} = ${ctx.session.user.id}
              AND ${dbtCategory.slug} = ${input.categorySlug}
          )  
      `);

      await ctx.db
        .insert(dbtVote)
        .values({ nomination: input.nominationId, user: ctx.session.user.id });
      return {
        success: true,
      };
    }),

  getUserRankings: publicProcedure.query(async ({ ctx }) => {
    const usersData = await ctx.db
      .select({
        role: users.role,
        username: users.username,
        image: users.image,
        position:
          sql<number>`RANK() OVER (ORDER BY COALESCE(SUM(CASE WHEN ${dbtNomination.isWinner} THEN ${dbtCategoryTypesPoints.points} ELSE 0 END), 0) DESC)`.as(
            "position",
          ),
        score:
          sql<number>`COALESCE(SUM(CASE WHEN ${dbtNomination.isWinner} THEN ${dbtCategoryTypesPoints.points} ELSE 0 END), 0)`.as(
            "score",
          ),
        correctAnswers:
          sql<number>`COUNT(CASE WHEN ${dbtNomination.isWinner} THEN 1 ELSE NULL END)`.as(
            "correctAnswers",
          ),
      })
      .from(users)
      .leftJoin(dbtVote, eq(dbtVote.user, users.id))
      .leftJoin(dbtNomination, eq(dbtVote.nomination, dbtNomination.id))
      .leftJoin(dbtCategory, eq(dbtNomination.category, dbtCategory.id))
      .leftJoin(
        dbtCategoryTypesPoints,
        eq(dbtCategory.type, dbtCategoryTypesPoints.categoryType),
      )
      .groupBy(users.id, users.email, users.role, users.name, users.image)
      .orderBy(() => sql`position`);

    const scoreData = await ctx.db
      .select({
        maxScore: sum(dbtCategoryTypesPoints.points),
        maxCorrectAnswers:
          sql<number>`COUNT(CASE WHEN ${dbtNomination.isWinner} THEN 1 ELSE NULL END)`.as(
            "maxCorrectAnswers",
          ),
      })
      .from(dbtNomination)
      .innerJoin(dbtCategory, eq(dbtNomination.category, dbtCategory.id))
      .innerJoin(
        dbtCategoryTypesPoints,
        eq(dbtCategory.type, dbtCategoryTypesPoints.categoryType),
      )
      .where(dbtNomination.isWinner.getSQL());

    const maxData = {
      maxScore: scoreData[0]?.maxScore ?? 0,
      maxPosition:
        usersData.length > 0
          ? Math.max(...usersData.map((user) => user.position))
          : 0,
      maxCorrectAnswers: scoreData[0]?.maxCorrectAnswers ?? 0,
    };

    return { usersScores: usersData, maxData: maxData };
  }),

  getUserProfile: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const allCategories = await ctx.db
        .select({
          id: dbtCategory.id,
          categoryName: dbtCategory.name,
        })
        .from(dbtCategory)
        .orderBy(dbtCategory.ordering);

      const winningNominations = await ctx.db
        .select({
          id: dbtNomination.id,
          categoryName: dbtCategory.name,
          winnerMovieName: dbtMovie.name,
          winnerReceiverName: dbtReceiver.name,
          winnerDescription: dbtNomination.description,
        })
        .from(dbtNomination)
        .where(eq(dbtNomination.isWinner, true))
        .innerJoin(dbtCategory, eq(dbtNomination.category, dbtCategory.id))
        .innerJoin(dbtMovie, eq(dbtNomination.movie, dbtMovie.id))
        .leftJoin(dbtReceiver, eq(dbtNomination.receiver, dbtReceiver.id));

      const votedNominations = await ctx.db
        .select({
          id: dbtNomination.id,
          categoryName: dbtCategory.name,
          votedMovieName: dbtMovie.name,
          votedReceiverName: dbtReceiver.name,
          votedDescription: dbtNomination.description,
          isWinner: dbtNomination.isWinner,
        })
        .from(dbtVote)
        .innerJoin(dbtNomination, eq(dbtVote.nomination, dbtNomination.id))
        .innerJoin(dbtCategory, eq(dbtNomination.category, dbtCategory.id))
        .innerJoin(dbtMovie, eq(dbtNomination.movie, dbtMovie.id))
        .leftJoin(dbtReceiver, eq(dbtNomination.receiver, dbtReceiver.id))
        .innerJoin(users, eq(dbtVote.user, users.id))
        .where(eq(users.username, input));

      const userNominations = allCategories.map((category) => {
        const voted = votedNominations.find(
          (vote) => vote.categoryName === category.categoryName,
        );
        const winner = winningNominations.find(
          (win) => win.categoryName === category.categoryName,
        );
        return {
          categoryName: category.categoryName,
          votedMovieName: voted?.votedMovieName ?? null,
          votedReceiverName: voted?.votedReceiverName ?? null,
          votedDescription: voted?.votedDescription ?? null,
          isWinner: voted?.isWinner ?? false,
          winnerMovieName: winner?.winnerMovieName ?? null,
          winnerReceiverName: winner?.winnerReceiverName ?? null,
          winnerDescription: winner?.winnerDescription ?? null,
        };
      });

      const userData = await ctx.db
        .select({
          id: users.id,
          username: users.username,
          image: users.image,
          role: users.role,
          favoriteMovie: dbtMovie.name,
          backdrop: dbtMovie.backdrop,
          letterboxdUsername: users.letterboxdUsername,
          twitterUsername: users.twitterUsername,
          bskyUsername: users.bskyUsername,
          githubUsername: users.githubUsername,
        })
        .from(users)
        .leftJoin(dbtMovie, eq(users.favoriteMovie, dbtMovie.id))
        .where(eq(users.username, input));

      return { userNominations: userNominations, userData: userData[0] };
    }),

  getUserVotingStatus: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.query.dbtCategory.findMany();
    const userVotes = await ctx.db.query.dbtVote.findMany({
      where: eq(dbtVote.user, ctx.session.user.id),
    });

    return {
      pendingVotes: userVotes.length < categories.length,
    };
  }),
});
