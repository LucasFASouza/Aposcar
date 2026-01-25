"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WinningNominationCard } from "@/components/home/WinningNominationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { useEdition } from "@/contexts/EditionContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

type HomeContentProps = {
  userId?: string;
  username?: string;
  userImage?: string | null;
  showVotingReminder: boolean;
};

export function HomeContent({
  userId,
  username,
  userImage,
  showVotingReminder,
}: HomeContentProps) {
  const { selectedYear, activeEditionYear } = useEdition();
  const [rankingFilter, setRankingFilter] = useState<"global" | "following">(
    "global",
  );

  const { data: winningNominations = [], isLoading: isLoadingWinners } =
    api.nominations.getWinningNominations.useQuery(
      { editionYear: selectedYear },
      { enabled: !!selectedYear },
    );

  const { data: rankingsData, isLoading: isLoadingRankings } =
    api.votes.getUserRankings.useQuery(
      {
        editionYear: selectedYear,
        followingOnly: rankingFilter === "following",
      },
      { enabled: !!selectedYear },
    );

  const usersScores = rankingsData?.usersScores ?? [];
  const maxData = rankingsData?.maxData ?? { maxScore: 0 };

  const isActiveEdition = selectedYear === activeEditionYear;

  const { data: votingStatus } = api.votes.getUserVotingStatus.useQuery(
    undefined,
    { enabled: !!userId && isActiveEdition },
  );

  const shouldShowVotingReminder =
    userId && votingStatus?.pendingVotes && activeEditionYear;
  const isLoading = isLoadingWinners || isLoadingRankings;

  // Show message if following filter is selected and no users are found
  const showFollowingEmpty =
    rankingFilter === "following" && usersScores.length === 0;

  return (
    <div className="flex h-full flex-col gap-6 pt-4">
      {/* Show message if following filter is empty */}
      {showFollowingEmpty && (
        <div className="mb-4 rounded border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
          You are not following anyone yet.{" "}
          <Link href="/users" className="underline hover:text-primary">
            Find users to follow
          </Link>
          .
        </div>
      )}

      {isLoading ? (
        // Loading skeleton
        <div className="flex flex-col justify-between gap-6 lg:flex-row">
          <div className="lg:w-2/3">
            <h2 className="pb-4 pl-4 text-2xl font-bold">Ranking</h2>
            <div className="rounded-md border p-3">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 lg:gap-4">
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
                    <div className="flex w-full flex-col gap-2">
                      <div className="flex w-full items-end justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:w-1/3">
            <h2 className="pb-4 pl-4 text-2xl font-bold">Last updates</h2>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-between gap-6 lg:flex-row">
          {winningNominations.length === 0 && (
            <>
              {shouldShowVotingReminder && (
                <div className="flex flex-col items-center justify-between gap-4 rounded bg-primary p-4 text-sm lg:hidden">
                  <p className="w-full text-primary-foreground">
                    Don&apos;t forget to cast your votes and share your
                    predictions!
                    <br />
                    You&apos;ll be able to change them until the awards begin.
                  </p>
                  <div className="flex w-full justify-end">
                    <Link
                      className={buttonVariants({ variant: "outline" })}
                      href="/votes"
                    >
                      Go vote
                    </Link>
                  </div>
                </div>
              )}

              {!userId && isActiveEdition && (
                <div className="flex flex-col items-center justify-between gap-4 rounded bg-primary p-4 lg:hidden">
                  <p className="w-full text-primary-foreground">
                    Sign in to cast your votes and share your predictions!
                  </p>
                  <div className="flex w-full justify-end">
                    <Link
                      className={buttonVariants({ variant: "outline" })}
                      href="/login"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="lg:w-2/3">
            <div className="flex items-center justify-between pb-4 pl-4">
              <h2 className="text-2xl font-bold">Ranking</h2>
              {userId && (
                <Tabs
                  value={rankingFilter}
                  onValueChange={(v) =>
                    setRankingFilter(v as "global" | "following")
                  }
                >
                  <TabsList>
                    <TabsTrigger value="global">Global</TabsTrigger>
                    <TabsTrigger value="following">Following</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </div>

            <ScrollArea
              className="flex flex-col gap-4 rounded-md border"
              style={{ maxHeight: "calc(100vh - 17rem)" }}
            >
              {usersScores.map((user) => (
                <div key={user.username}>
                  <Link
                    href={`/users/${user.username}`}
                    className="flex w-full items-center gap-2 border-b border-secondary p-3 hover:bg-secondary lg:gap-4 lg:px-6 lg:py-4"
                  >
                    <div
                      className={`text-xl font-bold ${user.username === username ? "text-primary" : ""}`}
                    >
                      {user.position}º
                    </div>
                    <Avatar
                      className={
                        user.username === username
                          ? "border-2 border-primary"
                          : ""
                      }
                    >
                      <AvatarImage src={user.image ?? ""} />
                      <AvatarFallback>
                        {user.username?.[0]?.toUpperCase() ?? "@"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex w-full flex-col gap-2">
                      <div className="flex w-full items-end justify-between">
                        <p className="font-sm">
                          {user.username}

                          {user.username === username && (
                            <span className="pl-2 text-muted-foreground">
                              (you)
                            </span>
                          )}
                        </p>

                        <p className="text-sm">{user.score} points</p>
                      </div>
                      <Progress
                        key={`${user.username}-${selectedYear}-${user.score}`}
                        value={maxData.maxScore ? Number(user.score) || 0 : 1}
                        max={Number(maxData.maxScore) || 0}
                        className="h-2"
                      />
                    </div>
                  </Link>
                </div>
              ))}
            </ScrollArea>
          </div>

          <div className="flex flex-col lg:w-1/3">
            <h2 className="pb-4 pl-4 text-2xl font-bold">Last updates</h2>

            {winningNominations.length === 0 && (
              <div className="space-y-4">
                {shouldShowVotingReminder && (
                  <div className="hidden flex-col items-center justify-between gap-4 rounded bg-primary p-4 text-sm lg:flex">
                    <p className="w-full text-primary-foreground">
                      Don&apos;t forget to cast your votes and share your
                      predictions! You&apos;ll be able to change them until the
                      awards begin.
                    </p>
                    <div className="flex w-full justify-end">
                      <Link
                        className={buttonVariants({ variant: "outline" })}
                        href="/votes"
                      >
                        Go vote
                      </Link>
                    </div>
                  </div>
                )}

                {!userId && isActiveEdition && (
                  <div className="hidden flex-col items-center justify-between gap-4 rounded bg-primary p-4 text-sm lg:flex">
                    <p className="w-full text-primary-foreground">
                      Sign in to cast your votes and share your predictions!
                    </p>
                    <div className="flex w-full justify-end">
                      <Link
                        className={buttonVariants({ variant: "outline" })}
                        href="/login"
                      >
                        Sign in
                      </Link>
                    </div>
                  </div>
                )}

                <div className="space-y-1 rounded border p-4">
                  <h3 className="text-sm">
                    When the premiation starts you&apos;ll see the winners right
                    here!
                  </h3>
                </div>
              </div>
            )}

            <ScrollArea
              className="flex flex-col gap-4 rounded-md border"
              style={{ maxHeight: "calc(100vh - 17rem)" }}
            >
              {winningNominations.map((nomination) => (
                <WinningNominationCard
                  key={nomination.id}
                  nomination={nomination}
                  editionYear={selectedYear}
                />
              ))}
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
