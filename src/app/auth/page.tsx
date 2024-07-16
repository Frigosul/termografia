import logo from "@/assets/logo.png";

import Image from "next/image";
import { SignInForm } from "./components/sign-in-form";




export default function SignIn() {



  return (
    <main className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center border  w-full h-full">
        <div className="flex flex-col space-y-2">
          <Image src={logo} width={280} alt="Logo sulbeef" />
          <h1 className="text-center text-3xl font-semibold tracking-tight">Termografia</h1>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center border  w-full h-full">

        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight mb-5">
            Acessar painel
          </h2>

        </div>
        <SignInForm />
      </div>
    </main>
  )
}