import { api } from "@/trpc/server";
import { WinnerSelector } from "@/components/admin/WinnerSelector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NomineeEditor } from "@/components/admin/NomineeEditor";

export default async function AdminPage() {
  const categories = await api.nominations.getCategories();
  return (
    <div className="container flex flex-col gap-8 py-8 lg:flex-row">
      <Card className="w-full rounded lg:w-1/2">
        <CardHeader>
          <CardTitle>Set Winners</CardTitle>
        </CardHeader>
        <CardContent>
          <WinnerSelector categories={categories} />
        </CardContent>
      </Card>

      <Card className="w-full rounded lg:w-1/2">
        <CardHeader>
          <CardTitle>Set Nominees</CardTitle>
        </CardHeader>
        <CardContent>
          <NomineeEditor categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
