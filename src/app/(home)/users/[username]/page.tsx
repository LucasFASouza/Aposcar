import { auth } from "@/server/auth";
import { UserProfileContent } from "./UserProfileContent";

const UserPage = async ({ params }: { params: { username: string } }) => {
  const session = await auth();

  return (
    <UserProfileContent
      username={params.username}
      sessionUserId={session?.user?.id}
      sessionUsername={session?.user?.username}
    />
  );
};

export default UserPage;
