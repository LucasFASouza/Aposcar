"use client";

import { UserNomination } from "@/server/api/routers/votes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import PhTrophy from "~icons/ph/trophy";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface UserBallotProps {
  userData: {
    id: string;
    username: string;
    image?: string | null;
    backdrop?: string | null;
    letterboxdUsername?: string | null;
    twitterUsername?: string | null;
    bskyUsername?: string | null;
    githubUsername?: string | null;
    favoriteMovie?: string | null;
  };
  userNominations: UserNomination[];
  userScores: {
    username: string;
    position: number;
    correctAnswers: number;
    score: number;
  }[];
  maxScores: {
    maxPosition: number;
    maxCorrectAnswers: number;
  };
}

export function UserBallot({
  userData,
  userNominations,
  userScores,
  maxScores,
}: UserBallotProps) {
  const currentUser = userScores.find(
    (user) => user.username === userData.username,
  );

  const ballotRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (ballotRef.current) {
      console.log(ballotRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button onClick={handleExport}>Download</Button>

      <div
        className="flex aspect-[2/3] h-fit flex-col justify-between bg-background p-4"
        ref={ballotRef}
      >
        {/* Avatar & username */}
        <div className="flex items-end justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userData?.image ?? ""} />
              <AvatarFallback className="text-2xl font-bold">
                {userData?.username?.[0]?.toUpperCase() ?? "@"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-2xl font-bold">{userData?.username}</h1>
              <p className="text-lg text-muted-foreground">
                {currentUser?.score} points
              </p>
            </div>
          </div>

          <div>
            <span className="text-3xl font-bold">
              {currentUser?.correctAnswers}
            </span>
            <span className="text-lg text-muted-foreground">
              /{maxScores.maxCorrectAnswers}
            </span>
          </div>
        </div>

        {/* Votes table */}
        <div className="my-4">
          <h2 className="text-xl font-bold">Your votes</h2>
          <Table>
            <TableHeader>
              <TableRow className="font-bold">
                <TableHead className="px-2 py-2">Category</TableHead>
                <TableHead className="px-2 py-2">Vote</TableHead>
                {userNominations.some(
                  (n) => n.winnerMovieName ?? n.isWinner,
                ) && <TableHead className="px-2 py-2">Winner</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {userNominations.map((nomination) => (
                <TableRow key={nomination.categoryName}>
                  <TableCell className="px-2 py-2 text-sm font-bold">
                    {nomination.categoryName}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "px-2 py-2 text-sm",
                      nomination.isWinner && "text-primary",
                    )}
                  >
                    {nomination.votedReceiverName ? (
                      <span>
                        {nomination.votedReceiverName} (
                        {nomination.votedMovieName})
                      </span>
                    ) : (
                      (nomination.votedMovieName ?? (
                        <span className="text-sm font-normal text-muted-foreground">
                          -
                        </span>
                      ))
                    )}
                  </TableCell>
                  {userNominations.some(
                    (n) => n.winnerMovieName ?? n.isWinner,
                  ) && (
                    <TableCell className="px-2 py-2 text-sm">
                      {nomination.isWinner ? (
                        <PhTrophy className="text-primary" />
                      ) : nomination.winnerReceiverName ? (
                        <span>
                          {nomination.winnerReceiverName} (
                          {nomination.winnerMovieName})
                        </span>
                      ) : (
                        (nomination.winnerMovieName ?? (
                          <span className="text-sm text-muted-foreground">
                            -
                          </span>
                        ))
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="w-full text-center">
          <h2 className="text-xl font-bold text-primary">Aposcar</h2>
          <p className="text-lg">aposcar.vercel.app</p>
        </div>
      </div>
    </div>
  );
}
