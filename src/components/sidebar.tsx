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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

export function SideBar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <aside className="flex flex-col min-h-screen border-r sr-only lg:not-sr-only">
      <TooltipProvider>
        <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} className={`flex justify-start items-center mt-4`}>
          {isOpen ? <PanelLeftClose className="size-6" strokeWidth={1} /> : <PanelLeftOpen className="size-6" strokeWidth={1} />}
          <span className={`text-xl font-light pl-2 ${!isOpen && 'sr-only'}`}>
            Menu
          </span>
        </Button>

        <nav className={`flex flex-col mt-5 flex-1 transition-all duration-300 overflow-hidden ${isOpen ? "w-64" : "w-12"}`}>
          <Tooltip >
            <TooltipTrigger>
              <NavLink href="/">
                <House size={20} />
                Home
              </NavLink>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side='right'>
                Home
              </TooltipContent>
            )}
          </Tooltip>
          {session?.role === 'adm' && (
            <>
              <Tooltip>
                <TooltipTrigger>
                  <NavLink href="/data/chart">
                    <LineChart size={20} />
                    Gerar gráfico
                  </NavLink>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side='right'>
                    Gerar gráfico
                  </TooltipContent>
                )}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <NavLink href="/data/update-data">
                    <Database size={20} />
                    Editar dados
                  </NavLink>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side='right'>
                    Editar dados
                  </TooltipContent>
                )}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <NavLink href="/data/generate-data">
                    <ScrollText size={20} />
                    Gerar padrões
                  </NavLink>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side='right'>
                    Gerar padrões
                  </TooltipContent>
                )}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <NavLink href="/data/managed-equipments">
                    <BetweenHorizontalEnd size={20} />
                    Gerenciar equipamentos
                  </NavLink>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side='right'>
                    Gerenciar equipamentos
                  </TooltipContent>
                )}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <NavLink href="/users">
                    <Users size={20} />
                    Usuários
                  </NavLink>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side='right'>
                    Usuários
                  </TooltipContent>
                )}
              </Tooltip>
            </>
          )}

          {session?.role === 'level2' && (
            <>
              <Tooltip>
                <TooltipTrigger>
                  <NavLink href="/data/chart">
                    <LineChart size={20} />
                    Gerar gráfico
                  </NavLink>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side='right'>
                    Gerar gráfico
                  </TooltipContent>
                )}
              </Tooltip>
            </>
          )}
        </nav>
      </TooltipProvider>
    </aside >
  )
}
