import { redirect } from 'next/navigation'
import { parseCookies } from 'nookies'

export async function fetchServer(
  input: string | URL | Request,
  init?: RequestInit | undefined,
): Promise<Response> {
  const { token_jwt: tokenJwt } = parseCookies()

  const response = await fetch(input, {
    ...init,
    cache: 'no-store',
    headers: {
      ...init?.headers,
      ...(tokenJwt && { Authorization: `Bearer ${tokenJwt}` }),
    },
  })
  if (response.status === 401) {
    return redirect('/')
  }
  return response
}
