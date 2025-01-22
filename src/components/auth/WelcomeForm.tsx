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
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import PhCircleNotch from "~icons/ph/circle-notch";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import {
  OnboardUserInput,
  onboardUserInputSchema,
} from "@/server/api/zod/users";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export const WelcomeForm = () => {
  const { data: session, update } = useSession();
  const [previewUrl, setPreviewUrl] = useState(session?.user.image || "");

  const { toast } = useToast();
  const router = useRouter();

  const { mutate, isPending, isSuccess } = api.users.onboardUser.useMutation({
    onSuccess: (data, { username, image }) => {
      update({ user: { username, image } });
      toast({
        title: "Account created successfully",
        description: `Welcome ${username}. Edit your profile later to add your social links and favorite movie!`,
      });
      router.push("/");
    },
  });

  const form = useForm<OnboardUserInput>({
    resolver: zodResolver(onboardUserInputSchema),
    defaultValues: {
      username: session?.user?.username ?? "",
      image: session?.user?.image ?? "",
    },
  });

  useEffect(() => {
    if (session?.user?.image) {
      setPreviewUrl(session.user.image);
      form.reset({
        username: "",
        image: session.user.image,
      });
    }
  }, [session, form]);

  const onSubmit = (data: OnboardUserInput) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row">
          <div className="flex w-1/2 flex-col">
            <div className="relative aspect-square w-full overflow-hidden rounded-full">
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
              disabled={isSuccess}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="madelineThorson" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              disabled={isSuccess}
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
                  <FormDescription>
                    Add the URL of your chosen profile picture. Or leave it
                    blank to use the default.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="mt-8 w-full"
          disabled={isSuccess || isPending}
        >
          {isPending ? <PhCircleNotch className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
