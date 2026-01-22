import { db } from "@/server/db";
import {
  dbtCategory,
  dbtCategoryTypesPoints,
} from "@/server/db/schema/aposcar";

type CategoryType = "main" | "regular" | "secondary" | undefined;

const categories = [
  {
    name: "Best Picture",
    type: "main" as CategoryType,
    description:
      "Honoring the producers of the year's most outstanding motion picture.",
  },
  {
    name: "Directing",
    type: "main" as CategoryType,
    description: "Honoring the best achievement in film direction.",
  },
  {
    name: "Actress In A Leading Role",
    type: "main" as CategoryType,
    description:
      "Recognizing the best performance by an actress in a leading role.",
  },
  {
    name: "Actor In A Leading Role",
    type: "main" as CategoryType,
    description:
      "Recognizing the best performance by an actor in a leading role.",
  },
  {
    name: "Actress In A Supporting Role",
    type: "main" as CategoryType,
    description:
      "Recognizing the best performance by an actress in a supporting role.",
  },
  {
    name: "Actor In A Supporting Role",
    type: "main" as CategoryType,
    description:
      "Recognizing the best performance by an actor in a supporting role.",
  },
  {
    name: "Writing (Adapted Screenplay)",
    type: "main" as CategoryType,
    description:
      "The best screenplay adapted from previously published or produced material.",
  },
  {
    name: "Writing (Original Screenplay)",
    type: "main" as CategoryType,
    description:
      "The best screenplay not based upon previously published material.",
  },
  {
    name: "Animated Feature Film",
    type: "main" as CategoryType,
    description: "The best full-length film primarily created using animation.",
  },
  {
    name: "International Feature Film",
    type: "main" as CategoryType,
    description:
      "The best feature-length film produced outside the United States with a predominantly non-English dialogue track.",
  },
  {
    name: "Music (Original Song)",
    description: "The best original song written specifically for a film.",
  },
  {
    name: "Music (Original Score)",
    description:
      "The best original musical score created specifically for a film.",
  },
  {
    name: "Sound",
    description:
      "Honoring excellence in the creation, recording, mixing, and design of a film's sound.",
  },
  {
    name: "Film Editing",
    description:
      "Recognizing outstanding achievement in the editing of a film.",
  },
  {
    name: "Visual Effects",
    description: "Recognizing outstanding achievement in visual effects.",
  },
  {
    name: "Cinematography",
    description:
      "Honoring outstanding achievement in motion picture photography.",
  },
  {
    name: "Costume Design",
    description:
      "Recognizing excellence in the creation of costumes for a film.",
  },
  {
    name: "Makeup And Hairstyling",
    description: "Honoring excellence in makeup and hairstyling for a film.",
  },
  {
    name: "Production Design",
    description:
      "Recognizing excellence in the visual environment and set design of a film.",
  },
  {
    name: "Documentary Feature Film",
    description:
      "The best non-fiction film with a running time of 40 minutes or longer.",
  },
  {
    name: "Documentary Short Film",
    description:
      "The best non-fiction film with a running time of 40 minutes or less.",
  },
  {
    name: "Animated Short Film",
    description: "The best short film primarily created using animation.",
  },
  {
    name: "Live Action Short Film",
    description: "The best short film not primarily animated.",
  },
].map((c) => ({
  ...c,
  slug: c.name
    .toLowerCase()
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
    .replaceAll(" ", "-"),
}));

const points: { categoryType: CategoryType; points: number }[] = [
  {
    categoryType: "main",
    points: 10,
  },
  {
    categoryType: "regular",
    points: 5,
  },
  {
    categoryType: "secondary",
    points: 3,
  },
];

void (async () => {
  await db
    .insert(dbtCategory)
    .values(categories)
    .onConflictDoNothing({ target: dbtCategory.slug });
  console.log("Inserted categories: ", { count: categories.length });

  await db
    .insert(dbtCategoryTypesPoints)
    .values(points)
    .onConflictDoNothing({ target: dbtCategoryTypesPoints.categoryType });
  console.log("Inserted points: ", { count: points.length });
})();
