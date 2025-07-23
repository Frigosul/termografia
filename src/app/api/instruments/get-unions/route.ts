import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET() {
  const joinInstrument = await prisma.joinInstrument.findMany({
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

  const formattedUnionInstruments = joinInstrument.map((unionInstrument) => {
    return {
      id: unionInstrument.id,
      name: unionInstrument.name,
      firstInstrument: unionInstrument.firstInstrument.name,
      secondInstrument: unionInstrument.secondInstrument.name,
      isActive: unionInstrument.isActive,
    }
  })

  return NextResponse.json(formattedUnionInstruments, { status: 200 })
}
