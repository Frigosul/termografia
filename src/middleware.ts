import { getToken } from 'next-auth/jwt'
import {
  NextAuthMiddlewareOptions,
  NextRequestWithAuth,
  withAuth,
} from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const callbackOptions: NextAuthMiddlewareOptions = {}

export async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  if (!token) {
    const signInUrl = new URL('/auth', request.url)
    return NextResponse.redirect(signInUrl)
  }

  const roleBasedRoutes = {
    adm: [
      '/users',
      '/data/update-data',
      '/data/generate-standards',
      '/data/managed-equipments',
      '/data/chart',
      '/',
    ],
    level2: ['/data/chart', '/'],
    level1: ['/'],
  }

  const userRoles = {
    adm: 'Administrador',
    level1: 'Nível 1',
    level2: 'Nível 2',
  } as const

  function userHasAccess(pathname: string, role: string) {
    const roleKey = (
      Object.keys(userRoles) as Array<keyof typeof userRoles>
    ).find((key) => {
      return key === role
    }) as keyof typeof roleBasedRoutes | undefined

    if (roleKey) {
      const hasAccess = roleBasedRoutes[roleKey]?.includes(pathname) ?? false

      return hasAccess
    }

    return false
  }

  if (!userHasAccess(request.nextUrl.pathname, String(token.role))) {
    return NextResponse.rewrite(new URL('/auth/denied', request.url))
  }

  return NextResponse.next()
}
export default withAuth(middleware, callbackOptions)

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|auth|api).*)',
}
