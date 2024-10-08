'use client'
import {
  BetweenHorizontalEnd,
  Database,
  LayoutGrid,
  LineChart,
  LockKeyhole,
  ScrollText,
  Users,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { NavLink } from './nav-link'

export function SideBar() {
  const { data: session } = useSession()

  return (
    <aside className="flex flex-col min-h-screen  border-r px-4 sr-only lg:not-sr-only">
      <p className="m-4 text-center text-xl uppercase tracking-tight font-medium">
        Menu
      </p>
      <nav className="flex flex-col space-y-4 mt-5 flex-1 p-5 min-w-64">
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
      </nav>
    </aside>
  )
}
