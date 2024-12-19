import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Termografia',
}
export default function ForgotPasswordLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen">
      {children}
    </main>
  )
}
