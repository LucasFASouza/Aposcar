import { db } from "@/server/db";
import { redirect } from "next/navigation";
import VotesPageSkeleton from "@/components/votes/VotesPageSkeleton";

// TODO: Essa página pode conter a lista de categorias e mostrar quais o usuário ainda não apostou
export default async function VotesPage() {
  const firstCategory = await db.query.dbtCategory.findFirst();

  if (!firstCategory) {
    return <div>No categories found</div>;
  }

  redirect(`/votes/${firstCategory.slug}`);

  return <VotesPageSkeleton />;
}
