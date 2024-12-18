import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {

  const prisma = new PrismaClient()
  const instruments = await prisma.instrument.findMany({
    select: {
      id: true,
      idSitrad: true,
      name: true,
      type: true,
      minValue: true,
      maxValue: true,
      isActive: true,
      displayOrder: true,
    },
    orderBy: {
      name: 'asc'
    }
  })


  return NextResponse.json(instruments, { status: 200 })
}
