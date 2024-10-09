type UserRequest = {
  userId: string
  oldPassword: string
  newPassword: string
}

export async function updatePasswordUser({
  userId,
  oldPassword,
  newPassword,
}: UserRequest) {
  const response = await fetch(
    `/api/users/update-password-user?userId=${userId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newPassword,
        oldPassword,
      }),
    },
  )

  if (response.ok) {
    const data = await response.json()
    return data
  } else {
    const error = await response.json()
    console.error('Error:', error.message)
    return error
  }
}
