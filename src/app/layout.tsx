import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { AppProviders } from "@/app/_providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Aposcar",
  description: "Aposcar",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <AppProviders>
        <body>
          <main className="min-h-screen bg-background text-foreground">
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <Analytics />
            <SpeedInsights />
          </main>
        </body>
      </AppProviders>
    </html>
  );
}
