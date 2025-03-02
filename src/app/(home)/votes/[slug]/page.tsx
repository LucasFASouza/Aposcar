import { db } from "@/server/db";
import { Suspense } from "react";
import { VotePageContent } from "./VotePageContent";
import { api } from "@/trpc/server";
import VotesPageSkeleton from "@/components/votes/VotesPageSkeleton";
import { redirect } from "next/navigation";

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const categories = await db.query.dbtCategory.findMany();
  return categories.map((category) => ({
    slug: category.slug,
  }));
};

const VotePage = async ({ params }: { params: { slug: string } }) => {
  const categories = await api.nominations.getCategories({ ascending: false });
  const winningNominations = await api.nominations.getWinningNominations();

  if (winningNominations.length !== 0) {
    redirect("/");
  }

  return (
    <Suspense fallback={<VotesPageSkeleton />}>
      <VotePageContent categorySlug={params.slug} categories={categories} />
    </Suspense>
  );
};

export default VotePage;
