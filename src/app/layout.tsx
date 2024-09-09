import { NavLink } from "@/components/nav-link";
import { SideBar } from "@/components/sidebar";
import { ToggleTheme } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { ThemeProvider } from "@/context/theme-provider";
import { cn } from "@/lib/utils";
import { BadgeInfo, BetweenHorizontalEnd, Database, LayoutGrid, LineChart, LockKeyhole, LogOut, Menu, ScrollText, Users } from "lucide-react";
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
    <html lang="pt-br" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex items-start overflow-hidden",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <SideBar />
          <div className="w-screen h-screen">

            <header className="flex justify-between items-center py-4 shadow-sm px-6 md:justify-end border-b">
              <Sheet>
                <SheetTrigger asChild className="md:sr-only">
                  <Button variant="ghost">
                    <Menu size={28} />
                  </Button>
                </SheetTrigger>
                <SheetContent className="min-h-screen" side="left">
                  <SheetTitle className="m-4 text-center text-xl uppercase tracking-tight font-medium">Termografia</SheetTitle>
                  <SheetDescription className="sr-only">Menu</SheetDescription>
                  <nav className="flex flex-col space-y-4 h-full pb-12">
                    <NavLink href="/" >
                      <LayoutGrid size={20} />
                      Home
                    </NavLink>
                    <NavLink href="/auth/users" >
                      <Users size={20} />
                      Usuários
                    </NavLink>
                    <NavLink href="/data/chart" >
                      <LineChart size={20} />
                      Gerar gráfico
                    </NavLink>
                    <NavLink href="/data/managed-data" >
                      <Database size={20} />
                      Gerenciar dados
                    </NavLink>
                    <NavLink href="/data/managed-standards" >
                      <ScrollText size={20} />
                      Gerenciar padrões
                    </NavLink>
                    <NavLink href="/data/managed-equipments" >
                      <BetweenHorizontalEnd size={20} />
                      Gerenciar equipamentos
                    </NavLink>
                    <NavLink href="/data/register-access" >
                      <BadgeInfo size={20} />
                      Registro de acessos
                    </NavLink>
                    <NavLink href="/auth/reset-password" >
                      <LockKeyhole size={20} />
                      Alterar senha
                    </NavLink>
                    <NavLink href="/auth/sign-in">
                      <LogOut size={20} className="rotate-180" />
                      Sair
                    </NavLink>
                  </nav>
                </SheetContent>

              </Sheet>
              <div>
                <ToggleTheme />
              </div>
            </header>
            {children}
          </div>

        </ThemeProvider>
      </body>
    </html>
  );
}
