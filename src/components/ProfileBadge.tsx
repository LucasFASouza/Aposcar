"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarImage } from "@radix-ui/react-avatar";
import PhSignOut from "~icons/ph/sign-out";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useSession, signOut } from "next-auth/react";
import { api } from "@/trpc/react";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoginButton = () => (
  <Button variant="ghost" asChild>
    <Link href="/login">Login</Link>
  </Button>
);

export const AvatarDropdown: React.FC = () => {
  const { data: session, status } = useSession();
  const {
    data: user,
    isLoading,
    error,
  } = api.users.getUserById.useQuery(session?.user?.id ?? "", {
    enabled: !!session?.user?.id,
  });

  const content = useMemo(() => {
    if (status === "loading" || isLoading) {
      return <Skeleton className="h-10 w-32" />;
    }

    if (!session) {
      return <LoginButton />;
    }

    if (error) {
      signOut();
      return <div>Error loading user data</div>;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="space-x-2 hover:bg-transparent">
            <div className="flex flex-col">
              <div>{user?.username}</div>
              {user?.role === "admin" && (
                <Badge variant="default" className="ml-auto">
                  Admin
                </Badge>
              )}
            </div>
            <Avatar>
              <AvatarImage src={user?.image ?? ""} />
              <AvatarFallback />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href="/votes">Cast your vote!</Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`/users/${user?.username}`}>Your Profile</Link>
          </DropdownMenuItem>

          {user?.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin">Admin Tools</Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <button
              type="submit"
              className="flex items-center gap-x-1"
              onClick={() => signOut()}
            >
              <PhSignOut />
              Sign out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [session, user, status, isLoading, error]);

  return content;
};
