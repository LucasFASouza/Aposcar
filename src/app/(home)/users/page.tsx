"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const { data: users, isLoading } = api.users.getAllUsers.useQuery({
    search: search || undefined,
  });

  return (
    <div className="flex h-full flex-col gap-6 pt-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">All Users</h1>
        <Input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-md border p-4"
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : users && users.length > 0 ? (
        <ScrollArea
          className="flex flex-col"
          style={{ maxHeight: "calc(100vh - 15rem)" }}
        >
          <div className="grid gap-4 pr-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/users/${user.username}`}
                className="flex items-center gap-4 rounded-md border p-4 transition-colors hover:bg-secondary"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.image ?? ""} />
                  <AvatarFallback>
                    {user.username?.[0]?.toUpperCase() ?? "@"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-semibold">{user.username}</p>
                  {user.name && (
                    <p className="text-sm text-muted-foreground">{user.name}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex items-center justify-center rounded-md border p-12">
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}
    </div>
  );
}
