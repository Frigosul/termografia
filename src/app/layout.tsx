import { ToggleTheme } from '@/components/toggle-theme'
import { Toaster } from '@/components/ui/sonner'
import { AppearanceModeProvider } from '@/context/appearance-mode'
import { cn } from '@/lib/utils'
import { AuthProvider } from '@/providers/auth-provider'
import { ReactQueryProvider } from '@/providers/react-query-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})
export const metadata: Metadata = {
  title: 'SulTerm',
  description: 'Project of collect data with control temperature.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {


  return (
    <html lang="pt-br" suppressHydrationWarning>
      <AuthProvider>
        <AppearanceModeProvider>
          <body
            suppressHydrationWarning={true}
            className={cn(
              'min-h-screen bg-background font-sans antialiased overflow-hidden',
              fontSans.variable,
            )}
          >
            <ReactQueryProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <ToggleTheme />
                <Toaster richColors expand visibleToasts={20} />
                {children}
              </ThemeProvider>
            </ReactQueryProvider>
          </body>
        </AppearanceModeProvider>
      </AuthProvider>
    </html>
  )
}
