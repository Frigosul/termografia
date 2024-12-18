import { PrismaClient } from '@prisma/client'

import { NextRequest, NextResponse } from 'next/server'
const prisma = new PrismaClient()

export async function DELETE(req: NextRequest) {
  const userId = String(req.nextUrl.searchParams.get('userId')!)

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!existingUser) {
      return NextResponse.json({ message: 'User not exist' }, { status: 404 })
    }
    await prisma.user.delete({ where: { id: userId } })

    return NextResponse.json({ status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting user', details: error },
      { status: 500 },
    )
  }
}
