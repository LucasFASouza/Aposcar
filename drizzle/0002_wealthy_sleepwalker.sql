-- Create editions table
CREATE TABLE "aposcar_editions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" integer NOT NULL,
	"isActive" boolean DEFAULT false NOT NULL,
	CONSTRAINT "aposcar_editions_year_unique" UNIQUE("year")
);
--> statement-breakpoint

-- Add edition columns
ALTER TABLE "aposcar_categories" ADD COLUMN "edition" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "aposcar_movies" ADD COLUMN "edition" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "aposcar_nominations" ADD COLUMN "edition" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "aposcar_votes" ADD COLUMN "edition" uuid NOT NULL;--> statement-breakpoint

-- Add foreign key constraints
ALTER TABLE "aposcar_categories" ADD CONSTRAINT "aposcar_categories_edition_aposcar_editions_id_fk" FOREIGN KEY ("edition") REFERENCES "public"."aposcar_editions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aposcar_movies" ADD CONSTRAINT "aposcar_movies_edition_aposcar_editions_id_fk" FOREIGN KEY ("edition") REFERENCES "public"."aposcar_editions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aposcar_nominations" ADD CONSTRAINT "aposcar_nominations_edition_aposcar_editions_id_fk" FOREIGN KEY ("edition") REFERENCES "public"."aposcar_editions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aposcar_votes" ADD CONSTRAINT "aposcar_votes_edition_aposcar_editions_id_fk" FOREIGN KEY ("edition") REFERENCES "public"."aposcar_editions"("id") ON DELETE no action ON UPDATE no action;