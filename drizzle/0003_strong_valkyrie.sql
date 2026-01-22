CREATE TABLE "userFavoriteMovie" (
	"id" text PRIMARY KEY NOT NULL,
	"user" text NOT NULL,
	"movie" uuid NOT NULL,
	"edition" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_favoriteMovie_aposcar_movies_id_fk";
--> statement-breakpoint
ALTER TABLE "userFavoriteMovie" ADD CONSTRAINT "userFavoriteMovie_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userFavoriteMovie" ADD CONSTRAINT "userFavoriteMovie_movie_aposcar_movies_id_fk" FOREIGN KEY ("movie") REFERENCES "public"."aposcar_movies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userFavoriteMovie" ADD CONSTRAINT "userFavoriteMovie_edition_aposcar_editions_id_fk" FOREIGN KEY ("edition") REFERENCES "public"."aposcar_editions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "favoriteMovie";