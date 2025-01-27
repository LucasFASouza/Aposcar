// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTableCreator,
  text,
  uuid,
  integer,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `aposcar_${name}`);

export const dbeCategoryType = pgEnum("categoryType", [
  "main",
  "regular",
  "secondary",
]);

export const dbtCategoryTypesPoints = createTable("categoryTypesPoints", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryType: dbeCategoryType("categoryType").unique(),
  points: integer("points"),
});

export const dbtCategory = createTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: dbeCategoryType("type").default("regular").notNull(),
  ordering: serial("ordering").notNull(),
});

export const categoriesRelations = relations(dbtCategory, ({ many }) => ({
  nomination: many(dbtNomination),
}));

export const dbtMovie = createTable("movies", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique(),
  name: text("name"),
  description: text("description"),
  poster: text("image"),
  tagline: text("tagline"),
  backdrop: text("backdrop"),
  letterboxd: text("letterboxd"),
});

export const dbtReceiver = createTable("receivers", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique(),
  name: text("name"),
  image: text("image"),
  letterboxd: text("letterboxd"),
});

export const dbtNomination = createTable("nominations", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  isWinner: boolean("isWinner").default(false).notNull(),
  isWinnerLastUpdate: timestamp("isWinnerLastUpdate"),
  category: uuid("category")
    .references(() => dbtCategory.id)
    .notNull(),
  movie: uuid("movie")
    .references(() => dbtMovie.id)
    .notNull(),
  receiver: uuid("receiver").references(() => dbtReceiver.id),
  description: text("description"),
});

export const nominationRelations = relations(dbtNomination, ({ one }) => ({
  movie: one(dbtMovie, {
    fields: [dbtNomination.movie],
    references: [dbtMovie.id],
    relationName: "movie",
  }),
  receiver: one(dbtReceiver, {
    fields: [dbtNomination.receiver],
    references: [dbtReceiver.id],
    relationName: "receiver",
  }),
  category: one(dbtCategory, {
    fields: [dbtNomination.category],
    references: [dbtCategory.id],
  }),
}));

export const dbtVote = createTable("votes", {
  id: uuid("id").defaultRandom().primaryKey(),
  user: text("user")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  nomination: uuid("nomination")
    .notNull()
    .references(() => dbtNomination.id, { onDelete: "cascade" }),
  category: uuid("category").references(() => dbtCategory.id, {
    onDelete: "cascade",
  }),
});

export const votesConstraint = sql`
  ALTER TABLE ${dbtVote} 
  ADD CONSTRAINT one_vote_per_category
  UNIQUE (user, category);`;

export const voteRelations = relations(dbtVote, ({ one }) => ({
  user: one(users, {
    fields: [dbtVote.user],
    references: [users.id],
  }),
  nomination: one(dbtNomination, {
    fields: [dbtVote.nomination],
    references: [dbtNomination.id],
  }),
  category: one(dbtCategory, {
    fields: [dbtVote.category],
    references: [dbtCategory.id],
  }),
}));

export const nominationVotesRelation = relations(dbtNomination, ({ many }) => ({
  votes: many(dbtVote),
}));

export const updateTimestamp = sql`CREATE OR REPLACE FUNCTION update_changetimestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."isWinnerLastUpdate" = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';`;

export const updateTimestampOnIsWinner = sql`
CREATE TRIGGER updateTimestampOnIsWinner BEFORE UPDATE
    ON ${dbtNomination} FOR EACH ROW EXECUTE PROCEDURE 
    update_changetimestamp_column();
`;
