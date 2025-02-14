import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json([], { status: 200 })
  }
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
