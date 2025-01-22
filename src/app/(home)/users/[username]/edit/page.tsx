"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PhCircleNotch from "~icons/ph/circle-notch";
import { useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      new RegExp(/^[a-zA-Z0-9_]+$/),
      "Only letters, numbers and underscores are allowed",
    )
    .max(20, "Username must be at most 20 characters"),
  profilePic: z.string().url("Invalid URL").optional().or(z.literal("")),
  favoriteMovie: z.string().uuid().optional().or(z.literal("")),
  letterboxdUsername: z.string().optional().or(z.literal("")),
  twitterUsername: z.string().optional().or(z.literal("")),
  bskyUsername: z.string().optional().or(z.literal("")),
});

const EditUserPage = ({ params }: { params: { username: string } }) => {
  const { toast } = useToast();
  const router = useRouter();

  const { data: userData, isLoading } = api.users.getUserFromSession.useQuery();
  const { data: movies } = api.nominations.getMovies.useQuery();

  const { mutate, isPending } = api.users.updateUser.useMutation({
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      router.push(`/users/${userData?.username}`);
    },
  });

  const [previewUrl, setPreviewUrl] = useState(userData?.image || "");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: params.username,
      profilePic: userData?.image ?? "",
      favoriteMovie: userData?.favoriteMovie ?? "",
      letterboxdUsername: userData?.letterboxdUsername ?? "",
      twitterUsername: userData?.twitterUsername ?? "",
      bskyUsername: userData?.bskyUsername ?? "",
    },
  });

  if (isLoading || !movies) return <div>Loading...</div>;

  const onSubmit = (data: any) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="space-y-4 rounded border p-8 lg:w-3/5">
            <h2 className="text-2xl font-bold">Basic Information</h2>
            <FormDescription>
              Set the information that will be displayed on your profile and in
              the global ranking
            </FormDescription>
            <div className="flex flex-col gap-12 lg:flex-row">
              <div className="flex flex-col items-center justify-center lg:w-1/4">
                <div className="relative aspect-square w-1/2 overflow-hidden rounded-full lg:w-full">
                  <Image
                    src={previewUrl || "/images/poster-placeholder.png"}
                    alt="Profile picture preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 lg:w-3/4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="ShadowTheHedgehog" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profilePic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setPreviewUrl(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="favoriteMovie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favorite Movie of the Season</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a movie">
                            {
                              movies.find((movie) => movie.id === field.value)
                                ?.name
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {movies.map((movie) => (
                            <SelectItem key={movie.id} value={movie.id}>
                              {movie.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded border p-8 lg:w-2/5">
            <h2 className="text-2xl font-bold">Social Media</h2>
            <FormDescription>
              Add your social media usernames to connect with other users.
            </FormDescription>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="letterboxdUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Letterboxd</FormLabel>
                    <FormControl>
                      <Input placeholder="mcu_hater_616" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitterUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="@fernanda_torres_believer"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.startsWith("@")
                            ? e.target.value.slice(1)
                            : e.target.value;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bskyUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bluesky</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="@emilia_perez_hater.bsky.social"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.startsWith("@")
                            ? e.target.value.slice(1)
                            : e.target.value;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={`/users/${userData?.username}`}
          >
            Go back
          </Link>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <PhCircleNotch className="animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditUserPage;
