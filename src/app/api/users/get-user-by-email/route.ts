import { PrismaClient } from '@prisma/client'

import { NextRequest, NextResponse } from 'next/server'
const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')!

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ message: 'User not exist' }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error get  user by email', details: error },
      { status: 500 },
    )
  }
}
