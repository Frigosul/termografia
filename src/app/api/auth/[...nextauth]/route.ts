import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import CredentialProvider from 'next-auth/providers/credentials'

const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null
        try {
          const response = await fetch(
            'http://localhost:3000/api/users/sign-in',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          )

          if (response.status !== 200) return null

          const data = await response.json()
          if (!data.token || !data.role) return null

          return {
            id: data.token.id,
            email: data.email,
            role: data.role,
            name: data.name,
          }
        } catch (error) {
          console.error('Erro na autenticação:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      return token
    },
    async session({ session, token }) {
      session.id = token.id as string
      session.role = token.role as string

      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      return baseUrl
    },
  },
  pages: {
    signIn: '/auth',
    signOut: '/auth',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
