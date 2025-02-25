import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET() {
  const instruments = await prisma.instrument.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
    where: {
      isActive: true,
    },
  })

  const unions = await prisma.unionInstruments.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      name: 'asc',
    },
    where: {
      isActive: true,
    },
  })

  const instrumentsWithUnions = [...instruments, ...unions]

  return NextResponse.json(instrumentsWithUnions, { status: 200 })
}
