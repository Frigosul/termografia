// hooks/useLogin.ts
import { signIn } from '@/app/http/sign-in'
import { useMutation } from '@tanstack/react-query'

export const useSignIn = (
  onSuccess: (data: { token: string }) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: any) => void,
) => {
  return useMutation({
    mutationFn: signIn,
    onSuccess,
    onError,
  })
}
