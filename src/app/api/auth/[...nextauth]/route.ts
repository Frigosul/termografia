import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { setCookie } from 'nookies'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null

        try {
          const response = await fetch(
            `http://localhost:3333/users?email=${credentials.email}`,
          )
          const user = await response.json()
          if (!user) {
            return null
          }
          const responseData = await fetch(`http://localhost:3333/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              password: credentials.password,
            }),
          })
          if (responseData.status !== 200) return null

          const authData = await responseData.json()
          if (!authData.jwt || !authData.user) return null

          setCookie(null, 'token_jwt', authData.jwt)

          return {
            id: authData.user.id,
            email: authData.user.email,
            name: authData.user.name,
          }
        } catch (error) {}
        return null
      },
    }),
  ],
})
