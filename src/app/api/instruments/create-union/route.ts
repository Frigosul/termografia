import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
const prisma = new PrismaClient()

interface CreateUnionInstrumentType {
  name: string
  firstInstrument: string
  secondInstrument: string
}

export async function POST(request: NextRequest) {
  const body: CreateUnionInstrumentType = await request.json()
  const { name, firstInstrument, secondInstrument } = body

  if (!name || !firstInstrument || !secondInstrument) {
    return NextResponse.json(
      { message: 'name or firstInstrument or secondInstrument missing' },
      { status: 400 },
    )
  }
  try {
    const existingUnionInstrument = await prisma.unionInstruments.findUnique({
      where: {
        name,
      },
    })
    if (existingUnionInstrument) {
      return NextResponse.json(
        { message: 'Union already exists' },
        { status: 409 },
      )
    }

    const unionInstrument = await prisma.unionInstruments.create({
      data: {
        name,
        first_instrument_id: firstInstrument,
        second_instrument_id: secondInstrument,
      },
    })

    return NextResponse.json({ unionInstrument }, { status: 201 })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { error: 'Error creating unionInstrument', details: error },
      { status: 500 },
    )
  }
}
