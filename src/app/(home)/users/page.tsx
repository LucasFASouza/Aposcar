"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

function FollowButton({
  targetUserId,
  currentUserId,
}: {
  targetUserId: string;
  currentUserId: string;
}) {
  const utils = api.useUtils();
  const { data: isFollowing, isLoading } = api.users.isFollowing.useQuery(
    { targetUserId },
    { enabled: !!targetUserId && !!currentUserId },
  );

  const followMutation = api.users.followUser.useMutation({
    onSuccess: () => {
      void utils.users.isFollowing.invalidate({ targetUserId });
      void utils.users.getFollowCounts.invalidate({ userId: targetUserId });
      void utils.users.getFollowCounts.invalidate({ userId: currentUserId });
    },
  });

  const unfollowMutation = api.users.unfollowUser.useMutation({
    onSuccess: () => {
      void utils.users.isFollowing.invalidate({ targetUserId });
      void utils.users.getFollowCounts.invalidate({ userId: targetUserId });
      void utils.users.getFollowCounts.invalidate({ userId: currentUserId });
    },
  });

  const handleClick = () => {
    if (isFollowing) {
      unfollowMutation.mutate({ targetUserId });
    } else {
      followMutation.mutate({ targetUserId });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={
        isLoading || followMutation.isPending || unfollowMutation.isPending
      }
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const { data: session } = useSession();

  const { data: users, isLoading } = api.users.getAllUsers.useQuery({
    search: search || undefined,
  });

  return (
    <div className="flex h-full flex-col gap-6 pt-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">All Users</h1>
        <Input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-md border p-4"
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : users && users.length > 0 ? (
        <ScrollArea
          className="flex flex-col"
          style={{ maxHeight: "calc(100vh - 15rem)" }}
        >
          <div className="grid gap-4 pr-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 rounded-md border p-4"
              >
                <Link
                  href={`/users/${user.username}`}
                  className="flex items-center gap-4"
                  style={{ textDecoration: "none" }}
                >
                  <Avatar className="h-12 w-12 hover:border-2 hover:border-secondary">
                    <AvatarImage src={user.image ?? ""} />
                    <AvatarFallback>
                      {user.username?.[0]?.toUpperCase() ?? "@"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="truncate font-semibold hover:underline">{user.username}</p>
                </Link>
                <div className="flex w-full items-center">
                  <div className="flex min-w-0 flex-1 flex-col">
                    {user.name && (
                      <p className="truncate text-sm text-muted-foreground">
                        {user.name}
                      </p>
                    )}
                  </div>
                  {session?.user?.id && session.user.id !== user.id && (
                    <div
                      className="ml-2 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <FollowButton
                        targetUserId={user.id}
                        currentUserId={session.user.id}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex items-center justify-center rounded-md border p-12">
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}
    </div>
  );
}
