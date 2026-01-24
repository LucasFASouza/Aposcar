import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { HomeContent } from "./HomeContent";

export default async function Home() {
  const session = await auth();

  const userVotingStatus = session?.user
    ? await api.votes.getUserVotingStatus()
    : null;

  const showVotingReminder = session?.user && userVotingStatus?.pendingVotes;

  return (
    <HomeContent
      userId={session?.user?.id}
      username={session?.user?.username}
      userImage={session?.user?.image}
      showVotingReminder={!!showVotingReminder}
    />
  );
}
