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
      error: true,
      minValue: true,
      maxValue: true,
      isSensorError: true,
      temperatures: {
        select: {
          temperature: {
            select: {
              editValue: true,
              createdAt: true,
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
    temperature: instrument.temperatures?.[0]?.temperature?.editValue ?? null,
    createdAt: instrument.temperatures?.[0].temperature.createdAt,
    error: instrument.error,
    maxValue: instrument.maxValue,
    minValue: instrument.minValue,
  }));

  return NextResponse.json(formattedInstruments, { status: 200 })
}
