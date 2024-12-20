interface UserRequest {
  userId: string
  oldPassword: string
  newPassword: string
}
interface UpdatePasswordResponse {
  success: boolean
  message: string
}

interface UpdatePasswordError {
  success: false
  message: string
  errorCode?: string
}
export async function updatePasswordUser({
  userId,
  oldPassword,
  newPassword,
}: UserRequest): Promise<UpdatePasswordError | UpdatePasswordResponse> {
  const response = await fetch(
    `/api/users/update-password-user?userId=${userId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-interface': 'application/json',
      },
      body: JSON.stringify({
        newPassword,
        oldPassword,
      }),
    },
  )

  if (!response.ok) {
    const error = await response.json()
    return Promise.reject(
      new Error(
        JSON.stringify({
          status: response.status,
          message: error.error || 'Error api',
        }),
      ),
    )
  }
  const data = await response.json()
  return data
}
