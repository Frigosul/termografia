import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'
const prisma = new PrismaClient()

export async function PUT(req: NextRequest) {
  const { id, temperaure, userName } = await req.json()


  if (!id || !temperaure || !userName) {
    return NextResponse.json(
      { message: 'Missing data' },
      { status: 400 },
    )
  }
  try {
    const existTemperature = await prisma.temperature.findUnique({ where: { id } })
    if (!existTemperature) {
      return NextResponse.json({ message: 'Temperature not exist' }, { status: 404 })
    }

    const updateTemperature = await prisma.temperature.update({
      where: { id },
      data: {
        editValue: temperaure,
        updatedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]'),
        userUpdatedAt: userName
      },
    })

    return NextResponse.json({ updateTemperature }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating user', details: error },
      { status: 500 },
    )
  }
}
