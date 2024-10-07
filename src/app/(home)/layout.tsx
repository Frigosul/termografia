import { SheetSidebar } from '@/components/sheet-sidebar'
import { SideBar } from '@/components/sidebar'

import { ReactNode } from 'react'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-h-screen overflow-hidden">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center py-3 lg:py-8 shadow-sm px-6 lg:justify-end border-b">
          <SheetSidebar />
        </header>
        {children}
        <footer className="border-t shadow-sm flex justify-center items-center text-xs lg:text-sm tracking-wide text-muted-foreground py-5 ">
          Termografia | suporte2.apms@frigosul.com.br
        </footer>
      </div>
    </div>
  )
}
