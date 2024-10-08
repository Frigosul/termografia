'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/utils/return-initials'
import { LockKeyhole, LogOut, UserPen } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { SheetSidebar } from './sheet-sidebar'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu'

export function Header() {
  const { data: session } = useSession()
  const userName = session?.user?.name ?? ''

  return (
    <header className="flex justify-between items-center py-3 shadow-sm px-6 lg:justify-end border-b">
      <SheetSidebar />

      <NavigationMenu className="mr-11 lg:mr-8 hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="flex items-center justify-center gap-2">
              <Avatar className="size-9 flex items-center justify-center">
                <AvatarImage
                  className="rounded-full"
                  // src="https://github.com/joaoeduardodias.png"
                />
                <AvatarFallback className="flex items-center justify-center bg-slate-500/50 rounded-full size-9">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              {userName}
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
                <NavigationMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut size={16} className="rotate-180" />
                  Sair
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}
