import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | SulTerm',
}
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col lg:flex-row justify-center items-center h-screen">
      {children}
    </main>
  )
}
