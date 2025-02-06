import { api } from "@/trpc/server";
import { WinnerSelector } from "@/components/admin/WinnerSelector";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NomineeEditor } from "@/components/admin/NomineeEditor";
import { Category } from "@/server/api/zod/schema";

export default async function AdminPage() {
  const categories: Category[] = await api.nominations.getCategories({ascending: true});
  return (
    <div className="container flex flex-col gap-8 py-8 lg:flex-row items-center justify-center">
      <Card className="w-full rounded lg:w-1/2">
        <CardHeader>
          <CardTitle>Set Winners</CardTitle>
        </CardHeader>
        <CardContent>
          <WinnerSelector categories={categories} />
        </CardContent>
      </Card>

      {/* <Card className="w-full rounded lg:w-1/2">
        <CardHeader>
          <CardTitle>Set Nominees</CardTitle>
        </CardHeader>
        <CardContent>
          <NomineeEditor categories={categories} />
        </CardContent>
      </Card> */}
    </div>
  );
}
