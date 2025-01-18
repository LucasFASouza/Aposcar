"use client";

import React from "react";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type FullNomination } from "@/server/api/routers/nominations";
import { api } from "@/trpc/react";

interface MovieSelectorProps {
  selectedId: string | null;
  categorySlug: string;
  onSelect: (nomination: FullNomination) => void;
}

export function MovieSelector({
  selectedId,
  onSelect,
  categorySlug,
}: MovieSelectorProps) {
  const { data } = api.nominations.getCategoryWithNavigation.useQuery({
    categorySlug,
  });
  const nominations = data?.nominations;

  const SelectedBadge = () => (
    <div className="absolute right-0 z-50 rounded-bl-lg bg-primary p-1 text-xs font-semibold text-primary-foreground">
      this one
    </div>
  );
  return (
    <>
      {/* Mobile view */}
      <div className="lg:hidden">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex flex-row gap-4 p-2">
            {nominations?.map((nomination) => (
              <div key={nomination.id} className="relative shrink-0">
                {nomination.isUserVote && <SelectedBadge />}
                <Image
                  src={
                    nomination.receiver?.image ??
                    nomination.movie.poster ??
                    "/images/placeholder.jpg"
                  }
                  alt={
                    nomination.receiver?.name ??
                    nomination.movie.name ??
                    "Movie poster"
                  }
                  width={120}
                  height={180}
                  className={`h-full cursor-pointer rounded-md object-cover ${
                    selectedId === nomination.id
                      ? "outline outline-primary"
                      : "hover:outline hover:outline-foreground"
                  }`}
                  onClick={() => onSelect(nomination)}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Desktop view */}
      <div className="hidden w-full gap-2 p-2 lg:flex">
        {nominations?.map((nomination) => (
          <div
            key={nomination.id}
            className={`relative aspect-[2/3] flex-1 cursor-pointer rounded-md ${
              selectedId === nomination.id
                ? "outline outline-primary"
                : "hover:outline hover:outline-foreground"
            }`}
            onClick={() => onSelect(nomination)}
          >
            {nomination.isUserVote && <SelectedBadge />}
            <Image
              src={
                nomination.receiver?.image ??
                nomination.movie.poster ??
                "/images/placeholder.jpg"
              }
              alt={
                nomination.receiver?.name ??
                nomination.movie.name ??
                "Movie poster"
              }
              fill
              className="rounded-md object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
}
