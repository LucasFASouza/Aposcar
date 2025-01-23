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
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      new RegExp(/^[a-zA-Z0-9_]+$/),
      "Only letters, numbers and underscores are allowed",
    )
    .max(20, "Username must be at most 20 characters"),
  image: z.string().url("Invalid URL").optional().or(z.literal("")),
  favoriteMovie: z.string().uuid().optional().or(z.literal("")),
  letterboxdUsername: z.string().optional().or(z.literal("")),
  twitterUsername: z.string().optional().or(z.literal("")),
  bskyUsername: z.string().optional().or(z.literal("")),
});

type UserFormData = z.infer<typeof formSchema>;

const EditUserPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState("");

  const { data: session, update } = useSession();

  const { data: userData, isLoading: isUserLoading } =
    api.users.getUserById.useQuery(session?.user?.id ?? "", {
      enabled: !!session?.user?.id,
    });

  const { data: movies, isLoading: isMoviesLoading } =
    api.nominations.getMovies.useQuery();

  const { mutate, isPending } = api.users.updateUser.useMutation({
    onSuccess: (data, { username, image }) => {
      update({ user: { username, image } });
      toast({
        title: "Profile updated!",
        description:
          "Your profile has been updated successfully. It may take a few minutes to reflect the changes.",
      });
      router.push("/");
    },
    onError: (error) => {
      if (error.data?.code === "CONFLICT") {
        toast({
          title: "Username taken",
          description: "This username is already taken. Please choose another",
        });
        return;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Something went wrong. Please try again later or contact us.",
        });
      }
    },
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: userData?.username ?? "",
      image: userData?.image ?? "",
      favoriteMovie: userData?.favoriteMovie ?? "",
      letterboxdUsername: userData?.letterboxdUsername ?? "",
      twitterUsername: userData?.twitterUsername ?? "",
      bskyUsername: userData?.bskyUsername ?? "",
    },
  });

  useEffect(() => {
    if (userData?.image) {
      setPreviewUrl(userData.image);
    }
  }, [userData]);

  if (isUserLoading || isMoviesLoading || !movies)
    return (
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-4 lg:flex-row">
          <Skeleton className="h-[650px] lg:h-96 lg:w-3/5" />
          <Skeleton className="h-[500px] lg:h-96 lg:w-2/5" />
        </div>
        <div className="flex w-full justify-between">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );

  const onSubmit = (data: UserFormData) => {
    if (data.favoriteMovie === "Select a movie") {
      data.favoriteMovie = "";
    }
    if (data?.twitterUsername && data.twitterUsername.startsWith("@")) {
      data.twitterUsername = data.twitterUsername.slice(1);
    }
    if (data?.letterboxdUsername && data.letterboxdUsername.startsWith("@")) {
      data.letterboxdUsername = data.letterboxdUsername.slice(1);
    }
    
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
                {/* <div className="relative aspect-square w-1/2 overflow-hidden rounded-full lg:w-full">
                  <Image
                    src={previewUrl || "/images/poster-placeholder.png"}
                    alt="Profile picture preview"
                    fill
                    className="object-cover"
                  />
                </div> */}

                <Avatar className="aspect-square h-fit w-1/2 lg:w-full">
                  <AvatarImage src={previewUrl ?? ""} />
                  <AvatarFallback className="text-5xl font-bold">
                    @
                  </AvatarFallback>
                </Avatar>
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
                  name="image"
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
