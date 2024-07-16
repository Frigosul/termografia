import { ToggleTheme } from "@/components/toggle-theme";
import { ThemeProvider } from "@/context/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
export const metadata: Metadata = {
  title: "Termografia",
  description: "Project of collect data with control temperature.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem

        >
          <header className="pr-16 pt-2  flex items-center justify-end">

            <ToggleTheme />

          </header>
          {children}

        </ThemeProvider>
      </body>
    </html>
  );
}
