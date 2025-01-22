"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { redirect, useRouter } from "next/navigation";

export function WinnerSelector({ categories }: { categories: any }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedNomination, setSelectedNomination] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const { data: nominations } =
    api.nominations.getCategoryWithNavigation.useQuery(
      { categorySlug: selectedCategory },
      { enabled: !!selectedCategory },
    );

  const { mutate } = api.nominations.setWinner.useMutation({
    onSuccess: () => {
      toast({
        title: "Winner updated successfully!",
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
        <RadioGroup
          value={selectedNomination}
          onValueChange={setSelectedNomination}
        >
          {nominations.nominations.map((nomination) => (
            <div key={nomination.id} className="flex items-center space-x-2">
              <RadioGroupItem value={nomination.id} />
              <label>
                {nomination.movie.name}
                {nomination.receiver && ` - ${nomination.receiver.name}`}
              </label>
            </div>
          ))}
        </RadioGroup>
      )}

      <Button
        disabled={!selectedNomination}
        onClick={() => {
          if (nominations && selectedNomination) {
            mutate({
              nominationId: selectedNomination,
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
