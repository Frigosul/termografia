import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
  const { value } = await req.json()
  const prisma = new PrismaClient()
  console.log(value)
  if (!value) {
    return NextResponse.json({ message: 'Missing data' }, { status: 400 })
  }
  try {
    const result = await Promise.all(
      value.map(
        async ({
          id,
          temperature,
          updatedUserAt,
          updatedAt,
        }: {
          id: string
          temperature: number
          updatedAt: string
          updatedUserAt: string
        }) => {
          const existTemperature = await prisma.temperature.findUnique({
            where: { id },
          })
          if (!existTemperature) {
            return { message: 'Temperature not exists', status: 400 }
          } else if (existTemperature.editValue !== temperature) {
            await prisma.temperature.update({
              where: { id },
              data: {
                editValue: temperature,
                updatedAt: dayjs(updatedAt).toDate(),
                userUpdatedAt: updatedUserAt,
              },
            })
          }
          return { message: 'Temperature updated successfully', status: 200 }
        },
      ),
    )
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error update value', details: error },
      { status: 500 },
    )
  }
}
