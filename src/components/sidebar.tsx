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
  const [hoverLinkOpen, setHoverLinkOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <aside className="flex flex-col min-h-screen border-r sr-only lg:not-sr-only">
      <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} className={`flex justify-start items-center mt-4`}>
        {isOpen || hoverLinkOpen ? <PanelLeftClose className="size-6" strokeWidth={1} /> : <PanelLeftOpen className="size-6" strokeWidth={1} />}
        <span className={`text-xl font-light pl-2 ${!isOpen && !hoverLinkOpen && 'sr-only'}`}>
          Menu
        </span>
      </Button>

      <nav className={`flex flex-col mt-5 flex-1 transition-all duration-300 overflow-hidden ${isOpen || hoverLinkOpen ? "w-64" : "w-12"}`}>
        <NavLink setIsOpen={setHoverLinkOpen} href="/">
          <House size={20} />
          Home
        </NavLink>
        {session?.role === 'adm' && (
          <>
            <NavLink setIsOpen={setHoverLinkOpen} href="/data/chart">
              <LineChart size={20} />
              Gerar gráfico
            </NavLink>
            <NavLink setIsOpen={setHoverLinkOpen} href="/data/update-data">
              <Database size={20} />
              Editar dados
            </NavLink>
            <NavLink setIsOpen={setHoverLinkOpen} href="/data/generate-standards">
              <ScrollText size={20} />
              Gerar padrões
            </NavLink>
            <NavLink setIsOpen={setHoverLinkOpen} href="/data/managed-equipments">
              <BetweenHorizontalEnd size={20} />
              Gerenciar equipamentos
            </NavLink>
            <NavLink setIsOpen={setHoverLinkOpen} href="/users">
              <Users size={20} />
              Usuários
            </NavLink>
          </>
        )}

        {session?.role === 'level2' && (
          <>
            <NavLink setIsOpen={setHoverLinkOpen} href="/data/chart">
              <LineChart size={20} />
              Gerar gráfico
            </NavLink>
          </>
        )}
      </nav>
    </aside >
  )
}
