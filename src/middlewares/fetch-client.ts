'use client'
import { signOut } from 'next-auth/react'
import { parseCookies } from 'nookies'

export async function fetchClient(
  input: string | URL | Request,
  init?: RequestInit | undefined,
): Promise<Response> {
  const { token_jwt: tokenJwt } = parseCookies()

  const response = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      ...(tokenJwt && { Authorization: `Bearer ${tokenJwt}` }),
    },
  })
  if (response.status === 401) {
    await signOut()
  }
  return response
}
