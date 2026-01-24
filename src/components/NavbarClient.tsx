"use client";

import { AvatarDropdown } from "@/components/ProfileBadge";
import Link from "next/link";
import { useEdition } from "@/contexts/EditionContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const NavbarClient = () => {
  const { selectedYear, setSelectedYear, activeEditionYear, editions } =
    useEdition();

  return (
    <nav className="z-50 flex w-full items-center justify-between bg-gradient-to-t from-transparent to-background px-6 py-4 lg:px-12 lg:py-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="transition-opacity hover:opacity-90">
          <h1 className="text-lg font-light text-primary lg:text-2xl">
            Aposcar
          </h1>
        </Link>

        {editions.length > 1 && (
          <Select
            value={selectedYear?.toString()}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="w-[100px] border-muted-foreground/20">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {editions.map((edition) => (
                <SelectItem key={edition.id} value={edition.year.toString()}>
                  {edition.year}
                  {edition.year === activeEditionYear && (
                    <span className="ml-2 text-xs text-primary">●</span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <AvatarDropdown />
    </nav>
  );
};
