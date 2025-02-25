import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET() {
  const instruments = await prisma.instrument.findMany({
    select: {
      id: true,
      idSitrad: true,
      name: true,
      createdAt: true,
      type: true,
      minValue: true,
      maxValue: true,
      isActive: true,
      displayOrder: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return NextResponse.json(instruments, { status: 200 })
}
