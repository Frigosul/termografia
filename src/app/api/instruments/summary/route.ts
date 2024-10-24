import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {

  const prisma = new PrismaClient()
  const instruments = await prisma.instrument.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      status: true,
      isSensorError: true,
      temperatures: {
        select: {
          temperature: {
            select: {
              editValue: true,
              updatedAt: true,
            }

          },
        },
        orderBy: {
          temperature: {
            updatedAt: 'desc'
          },

        },
        take: 1
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  const formattedInstruments = instruments.map(instrument => ({
    id: instrument.id,
    name: instrument.name,
    type: instrument.type,
    status: instrument.status,
    isSensorError: instrument.isSensorError,
    temperature: instrument.temperatures?.[0]?.temperature?.editValue ?? null
  }));


  return NextResponse.json(formattedInstruments, { status: 200 })
}
