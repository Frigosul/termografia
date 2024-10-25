'use client'
import {
  BetweenHorizontalEnd,
  Database,
  House,
  LineChart,
  PanelLeftClose,
  PanelLeftOpen,
  ScrollText,
  Users
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { NavLink } from './nav-link'
import { Button } from './ui/button'

export function SideBar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <aside className="flex flex-col min-h-screen border-r sr-only lg:not-sr-only">
      <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} className={`flex justify-start items-center ${!isOpen && "w-14"} mt-4`}>
        {isOpen ? <PanelLeftClose className="size-6" strokeWidth={1} /> : <PanelLeftOpen className="size-6" strokeWidth={1} />}
        <span className={`text-xl font-light pl-2 ${!isOpen && 'sr-only'}`}>
          Menu
        </span>
      </Button>

      <nav className={`flex flex-col space-y-3 mt-5 flex-1 transition-all duration-300  ${isOpen ? "w-64" : "w-14"}`}>
        <NavLink href="/">
          <House size={20} />
          {isOpen && 'Home'}
        </NavLink>
        {session?.role === 'adm' && (
          <>
            <NavLink href="/data/chart">
              <LineChart size={20} />
              {isOpen && 'Gerar gráfico'}
            </NavLink>
            <NavLink href="/data/managed-data">
              <Database size={20} />
              {isOpen && 'Gerenciar dados'}
            </NavLink>
            <NavLink href="/data/managed-standards">
              <ScrollText size={20} />
              {isOpen && ' Gerenciar padrões'}
            </NavLink>
            <NavLink href="/data/managed-equipments">
              <BetweenHorizontalEnd size={20} />
              {isOpen && 'Gerenciar equipamentos'}
            </NavLink>
            <NavLink href="/users">
              <Users size={20} />
              {isOpen && 'Usuários'}
            </NavLink>
          </>
        )}

        {session?.role === 'level2' && (
          <>
            <NavLink href="/data/chart">
              <LineChart size={20} />
              {isOpen && 'Gerar gráfico'}
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  )
}
