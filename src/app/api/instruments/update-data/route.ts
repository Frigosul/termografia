import { prisma } from '@/lib/prisma'
import { convertToUTC } from '@/utils/date-timezone-converter'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
  const { value } = await req.json()
  if (!value) {
    return NextResponse.json({ message: 'Missing data' }, { status: 400 })
  }
  try {
    const result = await Promise.all(
      value.map(
        async ({
          id,
          value: temperature,
          updatedUserAt,
          updatedAt,
        }: {
          id: string
          value: number
          updatedAt: Date
          updatedUserAt: string
        }) => {
          const existTemperature = await prisma.instrumentData.findUnique({
            where: { id },
          })
          if (!existTemperature) {
            return { message: 'Temperature not exists', status: 400 }
          } else if (existTemperature.editData !== temperature) {
            await prisma.instrumentData.update({
              where: { id },
              data: {
                editData: temperature,
                updatedAt: convertToUTC(updatedAt),
                userEditData: updatedUserAt,
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
