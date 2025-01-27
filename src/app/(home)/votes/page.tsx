import { redirect } from "next/navigation";
import VotesPageSkeleton from "@/components/votes/VotesPageSkeleton";
import { api } from "@/trpc/server";

export default async function VotesPage() {
  const categories = await api.nominations.getCategories({ ascending: false });

  if (!categories) {
    return <div>No categories found</div>;
  }

  if (categories.length > 0 && categories[0] && categories[0].slug) {
    redirect(`/votes/${categories[0].slug}`);
  }

  return <VotesPageSkeleton />;
}
