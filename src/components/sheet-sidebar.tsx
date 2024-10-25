'use client'
import { NavLink } from '@/components/nav-link'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import {
  BetweenHorizontalEnd,
  Database,
  House,
  LineChart,
  LockKeyhole,
  LogOut,
  Menu,
  ScrollText,
  UserPen,
  Users,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
export function SheetSidebar() {
  const { data: session } = useSession()

  return (
    <Sheet>
      <SheetTrigger asChild className="lg:sr-only">
        <Button variant="ghost">
          <Menu size={28} />
        </Button>
      </SheetTrigger>
      <SheetContent className="min-h-screen px-2" side="left">
        <SheetTitle className="m-4 text-center text-xl uppercase tracking-tight font-medium">
          Termografia
        </SheetTitle>
        <SheetDescription className="sr-only">Menu</SheetDescription>
        <NavigationMenu className="my-4 flex items-center justify-center px-0 md:hidden">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center justify-center gap-2">
                <Avatar className="size-9 flex items-center justify-center">
                  <AvatarImage
                    className="rounded-full"
                  // src="https://github.com/joaoeduardodias.png"
                  />
                  <AvatarFallback className="flex items-center justify-center bg-slate-500/50 rounded-full size-9">
                    JD
                  </AvatarFallback>
                </Avatar>
                João Dias
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuList className="flex flex-col w-40 gap-3 p-2 items-start justify-center text-sm font-light">
                  <NavigationMenuItem className="cursor-pointer flex items-center justify-center gap-2 ml-1">
                    <UserPen size={18} />
                    Alterar Perfil
                  </NavigationMenuItem>
                  <NavigationMenuItem className="cursor-pointer flex items-center justify-center gap-2">
                    <LockKeyhole size={16} />
                    Alterar Senha
                  </NavigationMenuItem>
                  <NavigationMenuItem className="cursor-pointer flex items-center justify-center gap-2">
                    <LogOut size={16} className="rotate-180" />
                    Sair
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <nav className="flex flex-col space-y-4 h-full pb-12">
          <NavLink href="/">
            <House size={20} />
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
      </SheetContent>
    </Sheet>
  )
}
