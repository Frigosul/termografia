import { NavLink } from '@/components/nav-link'
import { SideBar } from '@/components/sidebar'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  BetweenHorizontalEnd,
  Database,
  LayoutGrid,
  LineChart,
  LockKeyhole,
  LogOut,
  Menu,
  ScrollText,
  Users,
} from 'lucide-react'
import { ReactNode } from 'react'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-h-screen overflow-hidden">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center py-3 lg:py-8 shadow-sm px-6 lg:justify-end border-b">
          <Sheet>
            <SheetTrigger asChild className="lg:sr-only">
              <Button variant="ghost">
                <Menu size={28} />
              </Button>
            </SheetTrigger>
            <SheetContent className="min-h-screen" side="left">
              <SheetTitle className="m-4 text-center text-xl uppercase tracking-tight font-medium">
                Termografia
              </SheetTitle>
              <SheetDescription className="sr-only">Menu</SheetDescription>
              <nav className="flex flex-col space-y-4 h-full pb-12">
                <NavLink href="/">
                  <LayoutGrid size={20} />
                  Home
                </NavLink>
                <NavLink href="/auth/users">
                  <Users size={20} />
                  Usuários
                </NavLink>
                <NavLink href="/data/chart">
                  <LineChart size={20} />
                  Gerar gráfico
                </NavLink>
                <NavLink href="/data/managed-data">
                  <Database size={20} />
                  Gerenciar dados
                </NavLink>
                <NavLink href="/data/managed-standards">
                  <ScrollText size={20} />
                  Gerenciar padrões
                </NavLink>
                <NavLink href="/data/managed-equipments">
                  <BetweenHorizontalEnd size={20} />
                  Gerenciar equipamentos
                </NavLink>

                <NavLink href="/auth/reset-password">
                  <LockKeyhole size={20} />
                  Alterar senha
                </NavLink>
                <NavLink href="/auth">
                  <LogOut size={20} className="rotate-180" />
                  Sair
                </NavLink>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        {children}
        <footer className="border-t shadow-sm flex justify-center items-center text-xs lg:text-sm tracking-wide text-muted-foreground py-5 ">
          Termografia | suporte2.apms@frigosul.com.br
        </footer>
      </div>
    </div>
  )
}
