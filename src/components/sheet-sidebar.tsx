'use client'
import { NavLink } from '@/components/nav-link'
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
import { signOut, useSession } from 'next-auth/react'
export function SheetSidebar() {
  const { data: session } = useSession()

  return (
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
          {session?.role === 'adm' && (
            <>
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
              <NavLink href="/users">
                <Users size={20} />
                Usuários
              </NavLink>
              <NavLink href="/auth/reset-password">
                <LockKeyhole size={20} />
                Alterar senha
              </NavLink>
            </>
          )}

          {session?.role === 'level2' && (
            <>
              <NavLink href="/data/chart">
                <LineChart size={20} />
                Gerar gráfico
              </NavLink>
            </>
          )}
          <NavLink onClick={() => signOut()} href="/auth">
            <LogOut size={20} className="rotate-180" />
            Sair
          </NavLink>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
