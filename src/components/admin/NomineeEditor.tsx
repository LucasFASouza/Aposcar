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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@/server/api/zod/schema";

const nominationSchema = z.object({
  nominations: z
    .array(
      z.object({
        movieId: z.string(),
        receiverId: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .length(5),
});

type NominationFormData = z.infer<typeof nominationSchema>;

export function NomineeEditor({ categories }: { categories: Category[] }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [nomineesNumber, setNomineesNumber] = useState(5);
  const { toast } = useToast();
  const router = useRouter();

  const { data: nominations, isLoading } =
    api.nominations.getNominationsByCategoryId.useQuery(selectedCategory, {
      enabled: selectedCategory !== "",
    });

  console.log(nominations);

  const { data: movies } = api.nominations.getMovies.useQuery();
  const { data: receivers } = api.nominations.getReceivers.useQuery();

  const form = useForm<NominationFormData>({
    resolver: zodResolver(nominationSchema),
    defaultValues: {
      nominations: Array(5).fill({
        movieId: "",
        receiverId: "",
        description: "",
      }),
    },
  });

  const { mutate } = api.nominations.setNominees.useMutation({
    onSuccess: () => {
      toast({
        title: "Nominations updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update nominations",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (nominations && nominations.length > 0) {
      const firstNomination = nominations[0];
      let numberNomineesCategory = 5;

      if (firstNomination && firstNomination.categoryName === "Best Picture") {
        numberNomineesCategory = 10;
      }

      setNomineesNumber(numberNomineesCategory);

      const existingNominations = nominations.map((nom) => ({
        movieId: nom.movieId,
        receiverId: nom.receiverId ?? "",
        description: nom.description ?? "",
      }));

      const emptyRows = Array(
        numberNomineesCategory - existingNominations.length,
      ).fill({
        movieId: "",
        receiverId: "",
        description: "",
      });

      form.reset({
        nominations: [...existingNominations, ...emptyRows],
      });
    }

    console.log("nominations", nominations);
    console.log("form", form);
  }, [nominations, form, selectedCategory]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          mutate({
            categoryId: selectedCategory,
            nominations: data.nominations,
          }),
        )}
        className="space-y-8"
      >
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category: Category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {movies && nominations && (
          <div className="space-y-4">
            {Array.from({ length: nomineesNumber }).map((_, index) => (
              <div key={index} className="flex gap-4">
                <FormField
                  control={form.control}
                  name={`nominations.${index}.movieId`}
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a movie" />
                          </SelectTrigger>
                          <SelectContent>
                            {movies.map((movie) => (
                              <SelectItem key={movie.id} value={movie.id}>
                                {movie.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`nominations.${index}.receiverId`}
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                          <SelectContent>
                            {receivers?.map((receiver) => (
                              <SelectItem key={receiver.id} value={receiver.id}>
                                {receiver.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`nominations.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormControl>
                        <Input
                          placeholder="Description (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        )}

        {isLoading && <p>Loading...</p>}

        <Button type="submit" disabled={!selectedCategory}>
          Save Nominations
        </Button>
      </form>
    </Form>
  );
}
