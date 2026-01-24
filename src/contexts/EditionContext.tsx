"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { api } from "@/trpc/react";

type EditionContextType = {
  selectedYear: number | undefined;
  setSelectedYear: (year: number) => void;
  activeEditionYear: number | undefined;
  editions: Array<{ id: string; year: number; isActive: boolean }>;
};

const EditionContext = createContext<EditionContextType | undefined>(undefined);

export function EditionProvider({ children }: { children: ReactNode }) {
  const { data: editions = [] } = api.nominations.getAllEditions.useQuery();
  const activeEdition = editions.find((e) => e.isActive);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    activeEdition?.year,
  );

  useEffect(() => {
    if (activeEdition && !selectedYear) {
      setSelectedYear(activeEdition.year);
    }
  }, [activeEdition, selectedYear]);

  return (
    <EditionContext.Provider
      value={{
        selectedYear,
        setSelectedYear,
        activeEditionYear: activeEdition?.year,
        editions,
      }}
    >
      {children}
    </EditionContext.Provider>
  );
}

export function useEdition() {
  const context = useContext(EditionContext);
  if (context === undefined) {
    throw new Error("useEdition must be used within an EditionProvider");
  }
  return context;
}
