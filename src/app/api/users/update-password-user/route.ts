import { prisma } from '@/lib/prisma'
import bcryptjs from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  try {
    const userId = String(req.nextUrl.searchParams.get('userId')!)
    const { newPassword, oldPassword } = await req.json()
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!existingUser) {
      return NextResponse.json({ message: 'User not exist' }, { status: 404 })
    }

    const isPasswordValid = await bcryptjs.compare(
      oldPassword,
      existingUser.password,
    )

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Old password is incorrect' },
        { status: 401 },
      )
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 8)

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    })

    return NextResponse.json({ status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating user', details: error },
      { status: 500 },
    )
  }
}
