import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/server/auth";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/trpc/server";

export default async function Home() {
  const session = await auth();

  const userVotingStatus = session?.user
    ? await api.votes.getUserVotingStatus()
    : null;

  const showVotingReminder = session?.user && userVotingStatus?.pendingVotes;

  const winningNominations = await api.nominations.getWinningNominations();
  const { maxData, usersScores } = await api.votes.getUserRankings();

  // TODO: No mobile adicionar um toggle entre a visão de ranking e updates.
  return (
    <div className="flex h-full flex-col justify-between gap-6 lg:flex-row">
      {winningNominations.length === 0 && (
        <>
          {showVotingReminder && (
            <div className="my-4 flex flex-col items-center justify-between gap-4 rounded bg-primary p-4 text-sm lg:hidden">
              <p className="w-full text-primary-foreground">
                Don&apos;t forget to cast your votes and share your predictions!
                <br />
                You&apos;ll be able to change them until the awards begin.
              </p>
              <div className="flex w-full justify-end">
                <Link
                  className={buttonVariants({ variant: "outline" })}
                  href="/votes/documentary-short-film"
                >
                  Go vote
                </Link>
              </div>
            </div>
          )}

          {!session?.user && (
            <div className="my-4 flex flex-col items-center justify-between gap-4 rounded bg-primary p-4 lg:hidden">
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

      <div className="pt-4 lg:w-2/3 lg:p-0">
        <h2 className="pb-4 pl-4 text-2xl font-bold">Ranking</h2>

        <ScrollArea
          className="flex flex-col gap-4 rounded-md border"
          style={{ maxHeight: "calc(100vh - 13rem)" }}
        >
          {usersScores.map((user) => (
            <div key={user.username}>
              <Link
                href={`/users/${user.username}`}
                className="flex w-full items-center gap-2 lg:gap-4 border-b border-secondary p-3 lg:px-6 lg:py-4 hover:bg-secondary"
              >
                <div className="text-xl font-bold">{user.position}º</div>
                <Avatar
                  className={
                    user.username === session?.user.username
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

                      {user.username === session?.user.username && (
                        <span className="pl-2 text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </p>

                    <p className="text-sm">{user.score} points</p>
                  </div>
                  <Progress
                    value={Number(user.score) || 1}
                    max={Number(maxData.maxScore) || 1}
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
            {showVotingReminder && (
              <div className="hidden flex-col items-center justify-between gap-4 rounded bg-primary p-4 text-sm lg:flex">
                <p className="w-full text-primary-foreground">
                  Don&apos;t forget to cast your votes and share your
                  predictions! You&apos;ll be able to change them until the
                  awards begin.
                </p>
                <div className="flex w-full justify-end">
                  <Link
                    className={buttonVariants({ variant: "outline" })}
                    href="/votes/documentary-short-film"
                  >
                    Go vote
                  </Link>
                </div>
              </div>
            )}

            {!session?.user && (
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
          style={{ maxHeight: "calc(100vh - 13rem)" }}
        >
          {winningNominations.map((nomination) => (
            <div key={nomination.id} className="space-y-1 border-b p-4">
              <div className="flex justify-between">
                <h3 className="text-sm">{nomination.categoryName}</h3>
                {nomination.isWinnerLastUpdate && (
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(nomination.isWinnerLastUpdate)} ago
                  </p>
                )}
              </div>

              <h2 className="text-lg font-semibold text-primary">
                {nomination.movie.name}
              </h2>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
