import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { NextRequest, NextResponse } from 'next/server'
dayjs.extend(utc)
dayjs.extend(timezone)

export async function PUT(req: NextRequest) {
  const { temperatures } = await req.json()
  const prisma = new PrismaClient()

  if (!temperatures) {
    return NextResponse.json(
      { message: 'Missing data' },
      { status: 400 },
    )
  }
  try {
    const result = await Promise.all(
      temperatures.map(async ({ id, temperature, userUpdatedAt }: { id: string, temperature: number, updatedAt: string, userUpdatedAt: string }) => {

        const existTemperature = await prisma.temperature.findUnique({ where: { id } });
        if (!existTemperature) {
          return { id, message: 'Temperature does not exist', status: 404 };
        }
        if (existTemperature.editValue !== temperature) {
          await prisma.temperature.update({
            where: { id },
            data: {
              editValue: temperature,
              updatedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]'),
              userUpdatedAt,
            },
          });
        }
        return { message: 'Temperature updated successfully', status: 200 };
      })
    );
    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error update temperatures', details: error },
      { status: 500 },
    )
  }
}
