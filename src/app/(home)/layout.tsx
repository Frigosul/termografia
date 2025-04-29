import { Header } from '@/components/header'
import { SideBar } from '@/components/sidebar'

import { Separator } from '@/components/ui/separator'
import { ReactNode } from 'react'
import { UpdateUser } from './users/components/update-user'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <div className="w-full h-full flex flex-col">
        <Header />
        {children}
        <footer className="border-t shadow-sm flex justify-center items-center text-xs lg:text-sm tracking-wide text-muted-foreground py-4">
          <div className="flex mr-4 items-center w-full justify-center space-x-4">
            <span className="text-sm flex items-center after:inline-block after:ml-2 after:w-6 after:h-2.5 after:bg-primary after:rounded-md after:content-['']">
              Ideal:
            </span>
            <span className="text-sm  flex items-center after:inline-block after:ml-2 after:w-6 after:h-2.5 after:bg-yellow-600 after:rounded-md after:content-['']">
              Acima de 60%:
            </span>
            <span className="text-sm  flex items-center after:inline-block after:ml-2 after:w-6 after:h-2.5 after:bg-red-600 after:rounded-md after:content-['']">
              Acima de 90%:
            </span>
          </div>
          <Separator orientation='vertical' className='h-10' />
          <div className="ml-4 w-full justify-center text-center items-center">
            <span>SulTerm | suporte2.apms@frigosul.com.br</span>
          </div>
        </footer>
      </div>
      <UpdateUser />
    </div>
  )
}
