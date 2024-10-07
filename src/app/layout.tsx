import { ToggleTheme } from '@/components/toggle-theme'
import { ThemeProvider } from '@/context/theme-provider'
import { cn } from '@/lib/utils'
import { AuthProvider } from '@/providers/auth-provider'
import { ReactQueryProvider } from '@/providers/react-query-provider'
import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})
export const metadata: Metadata = {
  title: 'Termografia',
  description: 'Project of collect data with control temperature.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const session = await getServerSession()

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <AuthProvider>
        <body
          suppressHydrationWarning={true}
          className={cn(
            'min-h-screen bg-background font-sans antialiased overflow-hidden',
            fontSans.variable,
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ToggleTheme />
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  )
}
