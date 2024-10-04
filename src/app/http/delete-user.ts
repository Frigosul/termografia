interface DeleteUserRequest {
  userId: string
}

export async function deleteUser({ userId }: DeleteUserRequest): Promise<void> {
  const response = await fetch(`/api/users/delete-user?userId=${userId}`, {
    method: 'DELETE',
  })
  if (response.ok) {
    const data = await response.json()

    return data
  } else {
    const error = await response.json()
    console.error('Error:', error.message)
    return error
  }
}
