import { prisma } from '@/lib/prisma'
import bcryptjs from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, email, password, userRole } = await req.json()

  if (!name || !email || !password || !userRole) {
    return NextResponse.json(
      { message: 'name or email or password or user role missing' },
      { status: 400 },
    )
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 },
      )
    }

    const hashedPassword = await bcryptjs.hash(password, 8)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userRole,
      },
    })
    console.log(user)
    return NextResponse.json({ message: 'Created user', user }, { status: 201 })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { error: 'Error creating user', details: error },
      { status: 500 },
    )
  }
}
