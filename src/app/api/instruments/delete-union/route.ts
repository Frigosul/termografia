import { PrismaClient } from '@prisma/client'

import { NextRequest, NextResponse } from 'next/server'
const prisma = new PrismaClient()

export async function DELETE(req: NextRequest) {
  const unionId = String(req.nextUrl.searchParams.get('unionId')!)

  try {
    const existingUnion = await prisma.unionInstruments.findUnique({
      where: { id: unionId },
    })
    if (!existingUnion) {
      return NextResponse.json({ message: 'Union not exist' }, { status: 404 })
    }
    await prisma.unionInstruments.delete({ where: { id: unionId } })

    return NextResponse.json({ status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting union', details: error },
      { status: 500 },
    )
  }
}
