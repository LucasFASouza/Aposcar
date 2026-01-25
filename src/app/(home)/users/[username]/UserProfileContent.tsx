"use client";

import { SocialMediaBadge } from "@/components/SocialMediaBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { api } from "@/trpc/react";
import PhTrophy from "~icons/ph/trophy";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEdition } from "@/contexts/EditionContext";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type UserProfileContentProps = {
  username: string;
  sessionUserId?: string;
  sessionUsername?: string;
};

export function UserProfileContent({
  username,
  sessionUserId,
  sessionUsername,
}: UserProfileContentProps) {
  const { selectedYear } = useEdition();
  const [followDialogOpen, setFollowDialogOpen] = useState(false);
  const [followDialogType, setFollowDialogType] = useState<
    "followers" | "following"
  >("followers");

  const { data: rankingsData, isLoading: isLoadingRankings } =
    api.votes.getUserRankings.useQuery(
      { editionYear: selectedYear },
      { enabled: !!selectedYear },
    );

  const { data: profileData, isLoading: isLoadingProfile } =
    api.votes.getUserProfile.useQuery(
      { username, editionYear: selectedYear },
      { enabled: !!selectedYear },
    );

  const { data: followCounts } = api.users.getFollowCounts.useQuery(
    { userId: profileData?.userData.id ?? "" },
    { enabled: !!profileData?.userData.id },
  );

  const usersScores = rankingsData?.usersScores ?? [];
  const maxData = rankingsData?.maxData ?? {
    maxPosition: 0,
    maxCorrectAnswers: 0,
    maxScore: 0,
  };

  const currentUser = usersScores.find((user) => user.username === username);
  const userNominations = profileData?.userNominations ?? [];
  const userData = profileData?.userData;

  const isLoading = isLoadingRankings || isLoadingProfile;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* User info skeleton */}
        <div className="flex flex-col lg:w-1/3">
          <div className="w-full space-y-4">
            {/* Avatar & username skeleton */}
            <div className="flex w-full items-end justify-between">
              <div className="flex items-center">
                <Skeleton className="h-16 w-16 rounded-full lg:h-24 lg:w-24" />
                <Skeleton className="ml-4 mt-8 h-8 w-32" />
              </div>
            </div>

            {/* Stats skeleton */}
            <div className="flex w-full gap-2 lg:gap-4">
              <Skeleton className="h-20 w-1/3 rounded-sm" />
              <Skeleton className="h-20 w-1/3 rounded-sm" />
              <Skeleton className="h-20 w-1/3 rounded-sm" />
            </div>

            {/* Favorite movie skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="aspect-[2/3] w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Votes table skeleton */}
        <div className="flex-1 lg:w-2/3">
          <Skeleton className="mb-4 h-8 w-40" />
          <div className="rounded-md border">
            <div className="space-y-2 p-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  const hasVotedThisYear = !!currentUser;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* User info */}
      <div className="flex flex-col lg:w-1/3">
        {/* Backdrop */}
        {userData?.backdrop && (
          <div className="absolute left-0 top-0 block aspect-[16/9] w-full lg:w-1/3">
            <Image
              src={userData?.backdrop ?? "/images/backdrop-placeholder.png"}
              alt="Favorite movie backdrop"
              fill
              className="object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-background" />
            <div className="absolute inset-y-0 right-0 lg:w-1/4 lg:bg-gradient-to-r lg:from-transparent lg:to-background" />
          </div>
        )}

        <div
          className={`w-full space-y-4 ${userData?.backdrop ? "relative z-10 pt-[calc(100%*5/16)]" : ""}`}
        >
          {/* Avatar & username */}
          <div className="flex w-full items-end justify-between">
            <div className="flex items-center">
              <Avatar
                className={`h-16 w-16 lg:h-24 lg:w-24 ${
                  userData?.username === sessionUsername
                    ? "border-2 border-primary"
                    : ""
                }`}
              >
                <AvatarImage src={userData?.image ?? ""} />
                <AvatarFallback className="text-2xl font-bold lg:text-4xl">
                  {userData?.username?.[0]?.toUpperCase() ?? "@"}
                </AvatarFallback>
              </Avatar>
              <h1 className="pl-4 pt-8 text-2xl font-bold">
                {userData?.username}
              </h1>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end justify-end space-y-2">
              {userData?.id === sessionUserId ? (
                <Link
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                  href="/users/edit"
                >
                  Edit profile
                </Link>
              ) : sessionUserId && userData?.id ? (
                <FollowButton
                  targetUserId={userData.id}
                  currentUserId={sessionUserId}
                />
              ) : null}
            </div>
          </div>

          {/* Social medias */}
          <div className="flex flex-wrap gap-2 py-2">
            {userData?.letterboxdUsername && (
              <SocialMediaBadge
                url={`https://letterboxd.com/` + userData.letterboxdUsername}
                text="Letterboxd"
              />
            )}
            {userData?.twitterUsername && (
              <SocialMediaBadge
                url={`https://x.com/` + userData.twitterUsername}
                text="Twitter"
              />
            )}
            {userData?.bskyUsername && (
              <SocialMediaBadge
                url={`https://bsky.app/profile/` + userData.bskyUsername}
                text="Bluesky"
              />
            )}
            {userData?.githubUsername && (
              <SocialMediaBadge
                url={`https://github.com/` + userData.githubUsername}
                text="Github"
              />
            )}
          </div>

          {/* General Info */}
          <div className="w-full space-y-4 py-2">
            {hasVotedThisYear ? (
              <div className="flex w-full gap-2 lg:gap-4">
                <div className="w-1/3 rounded-sm border px-4 py-2">
                  <p className="text-xs text-muted-foreground lg:text-sm">
                    Position
                  </p>

                  <div className="flex w-full items-end justify-end gap-2">
                    <div className="text-lg font-bold lg:text-xl">
                      {currentUser.position}
                    </div>
                    <div className="text-sm text-muted-foreground lg:text-base">
                      / {maxData.maxPosition}
                    </div>
                  </div>
                </div>

                <div className="w-1/3 rounded-sm border px-4 py-2">
                  <p className="text-xs text-muted-foreground lg:text-sm">
                    Predictions
                  </p>

                  <div className="flex w-full items-end justify-end gap-2">
                    <div className="text-lg font-bold lg:text-xl">
                      {currentUser.correctAnswers}
                    </div>
                    <div className="text-sm text-muted-foreground lg:text-base">
                      / {maxData.maxCorrectAnswers}
                    </div>
                  </div>
                </div>

                <div className="w-1/3 rounded-sm border px-4 py-2">
                  <p className="text-xs text-muted-foreground lg:text-sm">
                    Total score
                  </p>

                  <div className="flex w-full items-end justify-end gap-2">
                    <div className="text-lg font-bold lg:text-xl">
                      {currentUser.score}
                    </div>
                    <div className="text-sm text-muted-foreground lg:text-base">
                      pts
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full rounded-sm border p-4">
                <p className="text-sm text-muted-foreground">
                  No votes cast for this edition
                </p>
              </div>
            )}

            {userData?.favoriteMovie && (
              <div className="w-full rounded-sm border p-4">
                <p className="text-xs text-muted-foreground lg:text-sm">
                  Favorite movie of the season
                </p>
                <p className="font-bold lg:text-lg">{userData.favoriteMovie}</p>
              </div>
            )}

            {/* Follow stats */}
            <div className="flex w-full gap-2 lg:gap-4">
              <button
                onClick={() => {
                  setFollowDialogType("following");
                  setFollowDialogOpen(true);
                }}
                className="w-1/2 rounded-sm border px-4 py-2 text-left transition-colors hover:bg-secondary"
              >
                <p className="text-xs text-muted-foreground lg:text-sm">
                  Following
                </p>
                <div className="text-lg font-bold lg:text-xl">
                  {followCounts?.following ?? 0}
                </div>
              </button>

              <button
                onClick={() => {
                  setFollowDialogType("followers");
                  setFollowDialogOpen(true);
                }}
                className="w-1/2 rounded-sm border px-4 py-2 text-left transition-colors hover:bg-secondary"
              >
                <p className="text-xs text-muted-foreground lg:text-sm">
                  Followers
                </p>
                <div className="text-lg font-bold lg:text-xl">
                  {followCounts?.followers ?? 0}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Follow Dialog */}
      <FollowDialog
        open={followDialogOpen}
        onOpenChange={setFollowDialogOpen}
        userId={profileData?.userData.id ?? ""}
        type={followDialogType}
      />

      {/* Votes table */}
      <div className="pb-8 pt-2 lg:w-2/3 lg:p-0">
        <h2 className="pb-4 pl-4 text-2xl font-bold">
          {username === sessionUsername ? "Your votes" : `${username}'s votes`}
        </h2>

        <Table>
          <TableHeader>
            <TableRow className="font-bold">
              <TableHead className="px-2 py-2 lg:px-3 lg:py-3">
                Category
              </TableHead>
              <TableHead className="px-2 py-2 lg:px-3 lg:py-3">Vote</TableHead>
              {userNominations.some((n) => n.winnerMovieName ?? n.isWinner) && (
                <TableHead className="px-2 py-2 lg:px-3 lg:py-3">
                  Winner
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {userNominations.map((nomination) => (
              <TableRow key={nomination.categoryName}>
                <TableCell className="px-2 py-2 text-xs font-bold lg:px-3 lg:py-3 lg:text-sm">
                  {nomination.categoryName}
                </TableCell>
                <TableCell
                  className={cn(
                    "px-2 py-2 text-xs lg:px-3 lg:py-3 lg:text-sm",
                    nomination.isWinner && "text-primary",
                  )}
                >
                  {nomination.votedReceiverName ? (
                    <span>
                      {nomination.votedReceiverName}
                      {" ("}
                      {nomination.votedMovieName}
                      {") "}
                    </span>
                  ) : (
                    (nomination.votedMovieName ?? (
                      <span className="font-normal text-muted-foreground">
                        -
                      </span>
                    ))
                  )}
                </TableCell>
                {userNominations.some(
                  (n) => n.winnerMovieName ?? n.isWinner,
                ) && (
                  <TableCell className="px-2 py-2 text-xs lg:px-3 lg:py-3 lg:text-sm">
                    {nomination.isWinner ? (
                      <PhTrophy className="text-primary" />
                    ) : nomination.winnerReceiverName ? (
                      <span>
                        {nomination.winnerReceiverName}
                        {" ("}
                        {nomination.winnerMovieName}
                        {") "}
                      </span>
                    ) : (
                      (nomination.winnerMovieName ?? (
                        <span className="text-muted-foreground">-</span>
                      ))
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

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

function FollowDialog({
  open,
  onOpenChange,
  userId,
  type,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  type: "followers" | "following";
}) {
  const { data: users, isLoading } =
    type === "followers"
      ? api.users.getFollowers.useQuery(
          { userId },
          { enabled: open && !!userId },
        )
      : api.users.getFollowing.useQuery(
          { userId },
          { enabled: open && !!userId },
        );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === "followers" ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px]">
          {isLoading ? (
            <div className="space-y-2 px-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : users && users.length > 0 ? (
            <div className="space-y-1 px-2">
              {users.map((user) => (
                <Link
                  key={user.id}
                  href={`/users/${user.username}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-secondary"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image ?? ""} />
                    <AvatarFallback>
                      {user.username?.[0]?.toUpperCase() ?? "@"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.username}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-4 text-center text-sm text-muted-foreground">
              No {type === "followers" ? "followers" : "following"} yet
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
