import { PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";
import { EditionProvider } from "@/contexts/EditionContext";
import { TRPCReactProvider } from "@/trpc/react";

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <SessionProvider>
      <TRPCReactProvider>
        <EditionProvider>{children}</EditionProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
};
