"use client";

import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Category } from "@/server/api/zod/schema";

export function WinnerSelector({ categories }: { categories: Category[] }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedNominations, setSelectedNominations] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const { data: nominations } =
    api.nominations.getCategoryWithNavigation.useQuery(
      { categorySlug: selectedCategory },
      { enabled: !!selectedCategory },
    );

  useEffect(() => {
    setSelectedNominations(
      nominations?.nominations
        .filter((nomination) => nomination.isWinner)
        .map((nomination) => nomination.id) ?? [],
    );
  }, [nominations]);

  const toggleNomination = (nominationId: string) => {
    setSelectedNominations((current) =>
      current.includes(nominationId)
        ? current.filter((id) => id !== nominationId)
        : [...current, nominationId],
    );
  };

  const { mutate } = api.nominations.setWinners.useMutation({
    onSuccess: () => {
      toast({
        title: "Winners updated successfully!",
      });
      router.push("/");
    },
  });

  return (
    <div className="space-y-8">
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {nominations && (
        <div className="space-y-2">
          {nominations.nominations.map((nomination) => (
            <div key={nomination.id} className="flex items-center space-x-2">
              <button
                type="button"
                aria-pressed={selectedNominations.includes(nomination.id)}
                onClick={() => toggleNomination(nomination.id)}
                className="h-4 w-4 rounded-sm border"
              >
                {selectedNominations.includes(nomination.id) && (
                  <span className="block h-full w-full bg-primary" />
                )}
              </button>
              <label
                className="cursor-pointer"
                onClick={() => toggleNomination(nomination.id)}
              >
                {nomination.movie.name}
                {nomination.receiver && ` - ${nomination.receiver.name}`}
              </label>
            </div>
          ))}
        </div>
      )}

      <Button
        disabled={selectedNominations.length < 1}
        onClick={() => {
          if (nominations && selectedNominations.length > 0) {
            mutate({
              nominationIds: selectedNominations,
              categoryId: nominations.currentCategory.id,
            });
          }
        }}
      >
        Set as Winner
      </Button>
    </div>
  );
}
