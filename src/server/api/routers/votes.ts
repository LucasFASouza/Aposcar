import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  dbtEdition,
  dbtCategoryTypesPoints,
  dbtCategory,
  dbtNomination,
  dbtVote,
  dbtMovie,
  dbtReceiver,
} from "@/server/db/schema/aposcar";
import { users, userFavoriteMovies } from "@/server/db/schema/auth";
import { eq, sql, sum, and } from "drizzle-orm";
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
      const activeEdition = await ctx.db.query.dbtEdition.findFirst({
        where: eq(dbtEdition.isActive, true),
      });

      if (!activeEdition) {
        throw new Error("No active edition found");
      }

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
              AND ${dbtVote.edition} = ${activeEdition.id}
          )  
      `);

      const category = await ctx.db.query.dbtCategory.findFirst({
        where: and(
          eq(dbtCategory.slug, input.categorySlug),
          eq(dbtCategory.edition, activeEdition.id),
        ),
      });

      await ctx.db.insert(dbtVote).values({
        nomination: input.nominationId,
        user: ctx.session.user.id,
        category: category?.id,
        edition: activeEdition.id,
      });
      return {
        success: true,
      };
    }),

  getUserRankings: publicProcedure.query(async ({ ctx }) => {
    const activeEdition = await ctx.db.query.dbtEdition.findFirst({
      where: eq(dbtEdition.isActive, true),
    });

    if (!activeEdition) {
      throw new Error("No active edition found");
    }

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
      .leftJoin(
        dbtVote,
        and(eq(dbtVote.user, users.id), eq(dbtVote.edition, activeEdition.id)),
      )
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
      .where(
        and(
          dbtNomination.isWinner.getSQL(),
          eq(dbtNomination.edition, activeEdition.id),
        ),
      );

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
      const activeEdition = await ctx.db.query.dbtEdition.findFirst({
        where: eq(dbtEdition.isActive, true),
      });

      if (!activeEdition) {
        throw new Error("No active edition found");
      }

      const allCategories = await ctx.db
        .select({
          id: dbtCategory.id,
          categoryName: dbtCategory.name,
        })
        .from(dbtCategory)
        .where(eq(dbtCategory.edition, activeEdition.id))
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
        .where(
          and(
            eq(dbtNomination.isWinner, true),
            eq(dbtNomination.edition, activeEdition.id),
          ),
        )
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
        .where(
          and(eq(users.username, input), eq(dbtVote.edition, activeEdition.id)),
        );

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
          letterboxdUsername: users.letterboxdUsername,
          twitterUsername: users.twitterUsername,
          bskyUsername: users.bskyUsername,
          githubUsername: users.githubUsername,
        })
        .from(users)
        .where(eq(users.username, input));

      const favoriteMovieData = await ctx.db
        .select({
          favoriteMovie: dbtMovie.name,
          backdrop: dbtMovie.backdrop,
        })
        .from(userFavoriteMovies)
        .innerJoin(dbtMovie, eq(userFavoriteMovies.movie, dbtMovie.id))
        .where(
          and(
            eq(userFavoriteMovies.user, userData[0]?.id ?? ""),
            eq(userFavoriteMovies.edition, activeEdition.id),
          ),
        )
        .limit(1);

      const userDataWithFavorite = {
        ...userData[0],
        favoriteMovie: favoriteMovieData[0]?.favoriteMovie ?? null,
        backdrop: favoriteMovieData[0]?.backdrop ?? null,
      };

      return { userNominations: userNominations, userData: userDataWithFavorite };
    }),

  getUserVotingStatus: protectedProcedure.query(async ({ ctx }) => {
    const activeEdition = await ctx.db.query.dbtEdition.findFirst({
      where: eq(dbtEdition.isActive, true),
    });

    if (!activeEdition) {
      throw new Error("No active edition found");
    }

    const categories = await ctx.db.query.dbtCategory.findMany({
      where: eq(dbtCategory.edition, activeEdition.id),
    });
    const userVotes = await ctx.db.query.dbtVote.findMany({
      where: and(
        eq(dbtVote.user, ctx.session.user.id),
        eq(dbtVote.edition, activeEdition.id),
      ),
    });

    return {
      pendingVotes: userVotes.length < categories.length,
    };
  }),
});
