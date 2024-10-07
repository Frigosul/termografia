import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
  const prisma = new PrismaClient()
  const chambers = await prisma.chamber.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      status: true,
      value: true,
    },
  })
  return NextResponse.json(chambers, { status: 200 })
}
