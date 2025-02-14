import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json([], { status: 200 })
  }
  const unionInstruments = await prisma.unionInstruments.findMany({
    select: {
      id: true,
      name: true,
      isActive: true,
      firstInstrument: {
        select: {
          name: true,
        },
      },
      secondInstrument: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  const formattedUnionInstruments = unionInstruments.map((unionInstrument) => {
    return {
      id: unionInstrument.id,
      name: unionInstrument.name,
      fisrtInstrument: unionInstrument.firstInstrument.name,
      secondInstrument: unionInstrument.secondInstrument.name,
      isActive: unionInstrument.isActive,
    }
  })

  return NextResponse.json(formattedUnionInstruments, { status: 200 })
}
