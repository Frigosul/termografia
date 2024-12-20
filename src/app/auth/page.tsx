import logo from '@/assets/sulterm.svg'

import Image from 'next/image'
import { SignInForm } from './components/sign-in-form'

export default function SignIn() {
  return (
    <>
      <div className="flex justify-center items-center border-r  w-screen h-screen">
        <div className="flex flex-col space-y-2">
          <Image
            src={logo}
            className="w-60 lg:w-72"
            alt="Logo sulTerm"
            priority
          />
          <span className='text-sm text-center'>Gerenciamento de termografia</span>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full h-full mb-20 lg:mb-0">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight mb-5">
            Acessar painel
          </h2>
        </div>
        <SignInForm />
      </div>
    </>
  )
}
