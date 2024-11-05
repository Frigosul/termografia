import { httpInstance } from '@/lib/http-instance'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
const credentials = btoa(`${process.env.API_USER}:${process.env.API_PASSWORD}`)
export async function PUT(req: NextRequest) {

  const { instruments } = await req.json()
  const prisma = new PrismaClient()

  if (!instruments) {
    return NextResponse.json(
      { message: 'Missing data' },
      { status: 400 },
    )
  }
  try {
    const result = await Promise.all(
      instruments.map(async ({ id, name, minValue, maxValue, displayOrder, type, isActive, idSitrad }: { id: string, idSitrad: number, name: string, type: 'temp' | 'press', maxValue: number, minValue: number, isActive: boolean, displayOrder: number }) => {
        const existInstrument = await prisma.instrument.findUnique({ where: { id } });
        if (!existInstrument) {
          return { message: 'Instrument not exist', status: 400 };
        }

        if (name !== existInstrument.name) {
          const response = await httpInstance.put(`/instruments/${idSitrad}`, {
            name
          })
          if (response.status === 200) {
            await prisma.instrument.update({
              where: { id },
              data: {
                displayOrder,
                isActive,
                maxValue,
                minValue,
                name,
                type
              },
            });
          }
        } else {
          await prisma.instrument.update({
            where: { id },
            data: {
              displayOrder,
              isActive,
              maxValue,
              minValue,
              name,
              type
            },
          });
        }

        return { message: 'Instrument updated successfully', status: 200 };
      })
    );
    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error update instruments', details: error },
      { status: 500 },
    )
  }
}
