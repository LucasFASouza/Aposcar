import { type Unpacked } from "@/lib/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  categorySchema,
  moviesSchema,
  nominationSchema,
  receiverSchema,
} from "@/server/api/zod/schema";
import {
  dbtEdition,
  dbtCategory,
  dbtCategoryTypesPoints,
  dbtMovie,
  dbtNomination,
  dbtReceiver,
  dbtVote,
} from "@/server/db/schema/aposcar";
import { TRPCError } from "@trpc/server";
import { eq, isNotNull, and, desc, sql, count } from "drizzle-orm";
import { z } from "zod";

const getCategoryInputSchema = z.object({
  categorySlug: z.string(),
});

const getCategoriesInput = z.object({
  ascending: z.boolean().optional().default(false),
});

export const fullNominationSchema = nominationSchema.extend({
  movie: moviesSchema,
  receiver: receiverSchema.nullable(),
});

const getCategoryWithNavigationSchema = z.object({
  currentCategory: categorySchema,
  prevCategory: categorySchema,
  nextCategory: categorySchema,
  categoryPoints: z.number(),
  nominations: fullNominationSchema.extend({ isUserVote: z.boolean() }).array(),
});

export const getNominationsByCategoryIdSchema = z.array(
  z.object({
    id: z.string(),
    description: z.string().nullable(),
    categoryId: z.string(),
    categoryName: z.string(),
    movieId: z.string(),
    movieName: z.string().nullable(),
    receiverId: z.string().nullable(),
    receiverName: z.string().nullable(),
  }),
);

export type CategoryWithNavigation = z.infer<
  typeof getCategoryWithNavigationSchema
>;

export type FullNomination = Unpacked<CategoryWithNavigation["nominations"]>;

export const nominationsRouter = createTRPCRouter({
  getCategoryWithNavigation: protectedProcedure
    .input(getCategoryInputSchema)
    .output(getCategoryWithNavigationSchema)
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

      const nominations = await ctx.db
        .select({
          id: dbtNomination.id,
          description: dbtNomination.description,
          isWinner: dbtNomination.isWinner,
          isWinnerLastUpdate: dbtNomination.isWinnerLastUpdate,
          category: dbtNomination.category,
          edition: dbtNomination.edition,
          categoryName: dbtCategory.name,
          isUserVote: isNotNull(dbtVote.user).as<boolean>("isUserVote"),
          movie: {
            id: dbtMovie.id,
            poster: dbtMovie.poster,
            name: dbtMovie.name,
            slug: dbtMovie.slug,
            description: dbtMovie.description,
            tagline: dbtMovie.tagline,
            backdrop: dbtMovie.backdrop,
            letterboxd: dbtMovie.letterboxd,
            edition: dbtMovie.edition,
          },
          receiver: {
            id: dbtReceiver.id,
            name: dbtReceiver.name,
            image: dbtReceiver.image,
            slug: dbtReceiver.slug,
            letterboxd: dbtReceiver.letterboxd,
          },
        })
        .from(dbtNomination)
        .innerJoin(dbtCategory, eq(dbtNomination.category, dbtCategory.id))
        .innerJoin(dbtMovie, eq(dbtNomination.movie, dbtMovie.id))
        .leftJoin(dbtReceiver, eq(dbtNomination.receiver, dbtReceiver.id))
        .leftJoin(
          dbtVote,
          and(
            eq(dbtVote.nomination, dbtNomination.id),
            eq(dbtVote.user, ctx.session.user.id),
          ),
        )
        .where(
          and(
            eq(dbtCategory.slug, input.categorySlug),
            eq(dbtNomination.edition, activeEdition.id),
          ),
        )
        .orderBy(dbtMovie.name);

      if (nominations.length < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category not found",
        });
      }

      const categories = await ctx.db
        .select({
          id: dbtCategory.id,
          description: dbtCategory.description,
          slug: dbtCategory.slug,
          name: dbtCategory.name,
          type: dbtCategory.type,
          ordering: dbtCategory.ordering,
        })
        .from(dbtCategory)
        .orderBy(desc(dbtCategory.ordering));

      const currentIndex = categories.findIndex(
        (c) => c.slug === input.categorySlug,
      );

      const current = categories[currentIndex]!;

      const categoryPoints = (
        await ctx.db
          .select({
            categoryType: dbtCategoryTypesPoints.categoryType,
            points: dbtCategoryTypesPoints.points,
          })
          .from(dbtCategoryTypesPoints)
          .where(eq(dbtCategoryTypesPoints.categoryType, current.type))
      ).at(0)?.points;

      if (!categoryPoints) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Category has configured points",
        });
      }

      return {
        currentCategory: current,
        prevCategory:
          currentIndex > 0
            ? categories[currentIndex - 1]!
            : categories[categories.length - 1]!,
        nextCategory:
          currentIndex < categories.length - 1
            ? categories[currentIndex + 1]!
            : categories[0]!,
        categoryPoints,
        nominations: nominations,
      };
    }),

  getCategories: publicProcedure
    .input(getCategoriesInput)
    .output(categorySchema.array())
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

      return await ctx.db
        .select()
        .from(dbtCategory)
        .orderBy(
          input.ascending ? dbtCategory.ordering : desc(dbtCategory.ordering),
        );
    }),

  getNominationsByCategoryId: publicProcedure
    .input(z.string())
    .output(getNominationsByCategoryIdSchema)
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

      const nominations = await ctx.db
        .select({
          id: dbtNomination.id,
          description: dbtNomination.description,
          categoryId: dbtNomination.category,
          categoryName: dbtCategory.name,
          movieId: dbtNomination.movie,
          movieName: dbtMovie.name,
          receiverId: dbtNomination.receiver,
          receiverName: dbtReceiver.name,
        })
        .from(dbtNomination)
        .innerJoin(dbtCategory, eq(dbtNomination.category, dbtCategory.id))
        .innerJoin(dbtMovie, eq(dbtNomination.movie, dbtMovie.id))
        .leftJoin(dbtReceiver, eq(dbtNomination.receiver, dbtReceiver.id))
        .where(
          and(
            eq(dbtCategory.id, input),
            eq(dbtNomination.edition, activeEdition.id),
          ),
        );

      if (nominations.length < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category not found",
        });
      }

      return nominations;
    }),

  getWinningNominations: publicProcedure
    .output(fullNominationSchema.extend({ categoryName: z.string() }).array())
    .query(async ({ ctx }) => {
      const activeEdition = await ctx.db.query.dbtEdition.findFirst({
        where: eq(dbtEdition.isActive, true),
      });

      if (!activeEdition) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No active edition found",
        });
      }

      const winningNominations = await ctx.db
        .select({
          id: dbtNomination.id,
          description: dbtNomination.description,
          isWinner: dbtNomination.isWinner,
          isWinnerLastUpdate: dbtNomination.isWinnerLastUpdate,
          category: dbtNomination.category,
          edition: dbtNomination.edition,
          categoryName: dbtCategory.name,
          movie: {
            id: dbtMovie.id,
            poster: dbtMovie.poster,
            name: dbtMovie.name,
            slug: dbtMovie.slug,
            description: dbtMovie.description,
            tagline: dbtMovie.tagline,
            backdrop: dbtMovie.backdrop,
            letterboxd: dbtMovie.letterboxd,
            edition: dbtMovie.edition,
          },
          receiver: {
            id: dbtReceiver.id,
            name: dbtReceiver.name,
            image: dbtReceiver.image,
            slug: dbtReceiver.slug,
            letterboxd: dbtReceiver.letterboxd,
          },
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
        .leftJoin(dbtReceiver, eq(dbtNomination.receiver, dbtReceiver.id))
        .orderBy(desc(dbtNomination.isWinnerLastUpdate));

      return winningNominations;
    }),

  getMovies: publicProcedure
    .output(moviesSchema.array())
    .query(async ({ ctx }) => {
      const activeEdition = await ctx.db.query.dbtEdition.findFirst({
        where: eq(dbtEdition.isActive, true),
      });

      if (!activeEdition) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No active edition found",
        });
      }

      return await ctx.db
        .select()
        .from(dbtMovie)
        .where(eq(dbtMovie.edition, activeEdition.id));
    }),

  setWinner: protectedProcedure
    .input(
      z.object({
        nominationId: z.string(),
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const activeEdition = await ctx.db.query.dbtEdition.findFirst({
        where: eq(dbtEdition.isActive, true),
      });

      if (!activeEdition) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No active edition found",
        });
      }

      await ctx.db
        .update(dbtNomination)
        .set({ isWinner: false })
        .where(
          and(
            eq(dbtNomination.category, input.categoryId),
            eq(dbtNomination.edition, activeEdition.id),
          ),
        );

      await ctx.db
        .update(dbtNomination)
        .set({ isWinner: true, isWinnerLastUpdate: new Date() })
        .where(eq(dbtNomination.id, input.nominationId));

      return { success: true };
    }),

  setNominees: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
        nominations: z
          .array(
            z.object({
              movieId: z.string(),
              receiverId: z.string().optional(),
              description: z.string().optional(),
            }),
          )
          .length(5),
      }),
    )

    .mutation(async ({ ctx, input }) => {
      const activeEdition = await ctx.db.query.dbtEdition.findFirst({
        where: eq(dbtEdition.isActive, true),
      });

      if (!activeEdition) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No active edition found",
        });
      }

      await ctx.db
        .delete(dbtNomination)
        .where(
          and(
            eq(dbtNomination.category, input.categoryId),
            eq(dbtNomination.edition, activeEdition.id),
          ),
        );

      await ctx.db.insert(dbtNomination).values(
        input.nominations.map((nom) => ({
          category: input.categoryId,
          movie: nom.movieId,
          receiver: nom.receiverId,
          description: nom.description,
          isWinner: false,
          edition: activeEdition.id,
        })),
      );

      return { success: true };
    }),

  getReceivers: publicProcedure
    .output(receiverSchema.array())
    .query(async ({ ctx }) => {
      return await ctx.db.select().from(dbtReceiver);
    }),

  getCategoryVoteStats: protectedProcedure
    .input(z.object({ categoryId: z.string() }))
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

      const voteStats = await ctx.db
        .select({
          nominationId: dbtNomination.id,
          movieName: dbtMovie.name,
          receiverName: dbtReceiver.name,
          description: dbtNomination.description,
          isWinner: dbtNomination.isWinner,
          voteCount: count(dbtVote.id).as("voteCount"),
        })
        .from(dbtNomination)
        .where(
          and(
            eq(dbtNomination.category, input.categoryId),
            eq(dbtNomination.edition, activeEdition.id),
          ),
        )
        .innerJoin(dbtMovie, eq(dbtNomination.movie, dbtMovie.id))
        .leftJoin(dbtReceiver, eq(dbtNomination.receiver, dbtReceiver.id))
        .leftJoin(
          dbtVote,
          and(
            eq(dbtVote.nomination, dbtNomination.id),
            eq(dbtVote.edition, activeEdition.id),
          ),
        )
        .groupBy(
          dbtNomination.id,
          dbtMovie.name,
          dbtReceiver.name,
          dbtNomination.description,
          dbtNomination.isWinner,
        );

      const userVote = await ctx.db
        .select({
          nominationId: dbtVote.nomination,
        })
        .from(dbtVote)
        .innerJoin(dbtNomination, eq(dbtVote.nomination, dbtNomination.id))
        .where(
          and(
            eq(dbtVote.user, ctx.session.user.id),
            eq(dbtNomination.category, input.categoryId),
            eq(dbtVote.edition, activeEdition.id),
          ),
        )
        .limit(1);

      return {
        voteStats,
        userVoteNominationId: userVote[0]?.nominationId ?? null,
      };
    }),
});
