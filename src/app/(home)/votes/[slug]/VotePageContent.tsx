"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import PhArrowLeft from "~icons/ph/arrow-left";
import PhArrowRight from "~icons/ph/arrow-right";
import type { Category } from "@/types/categories";
import type { Nomination } from "@/types/nominations";
import { useState } from "react";
import { MovieInfo } from "@/components/votes/MovieInfo";
import { MovieSelector } from "@/components/votes/MovieSelector";
import { CategoriesList } from "@/components/votes/CategoriesList";
import { CategoryCard } from "@/components/votes/CategoryCard";
import { api } from "@/trpc/react";

interface VotePageProps {
  currentCategory: Category;
  prevCategory: Category;
  nextCategory: Category;
  categoryPoints: number | undefined | null;
  nominations: Nomination[];
  categories: Category[];
}

export function VotePageContent({
  currentCategory,
  prevCategory,
  nextCategory,
  categoryPoints,
  nominations,
  categories,
}: VotePageProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedNomination, setSelectedNomination] =
    useState<Nomination | null>(null);

  const { data } = api.votes.getVotes.useQuery();

  return (
    <div className="flex h-full justify-between gap-12">
      <div className="flex w-1/3 flex-col justify-center gap-4 pb-16">
        <div className="flex justify-between">
          <Button variant="outline" asChild className="h-12 w-12 p-0">
            <Link href={`/votes/${prevCategory?.slug}`}>
              <PhArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            variant={showAllCategories ? "secondary" : "outline"}
            className="h-12"
            onClick={() => setShowAllCategories(!showAllCategories)}
          >
            See all
          </Button>

          <Button variant="outline" asChild className="h-12 w-12 p-0">
            <Link href={`/votes/${nextCategory?.slug}`}>
              <PhArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {showAllCategories ? (
          <CategoriesList categories={categories} />
        ) : (
          <CategoryCard
            name={currentCategory.name}
            description={currentCategory.description}
            points={categoryPoints}
          />
        )}
      </div>

      <div className="w-2/3">
        <div className="flex h-full flex-col justify-between">
          <div className="flex h-full w-2/3 flex-col justify-around self-end pb-8 text-end">
            <MovieInfo nomination={selectedNomination} />
          </div>
          <MovieSelector
            nominations={nominations}
            selectedId={selectedNomination?.id ?? null}
            onSelect={setSelectedNomination}
          />
        </div>
      </div>
    </div>
  );
}
