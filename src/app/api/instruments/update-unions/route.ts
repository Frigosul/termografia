import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
  const { unions } = await req.json()

  if (!unions) {
    return NextResponse.json({ message: 'Missing data' }, { status: 400 })
  }
  try {
    const result = await Promise.all(
      unions.map(
        async ({
          id,
          name,
          isActive,
        }: {
          id: string
          name: string
          isActive: boolean
        }) => {
          const existUnion = await prisma.joinInstrument.findUnique({
            where: { id },
          })
          if (!existUnion) {
            return { message: 'Union not exist', status: 400 }
          }
          await prisma.joinInstrument.update({
            where: { id },
            data: {
              name,
              isActive,
            },
          })

          return { message: 'Union updated successfully', status: 200 }
        },
      ),
    )
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error update unions', details: error },
      { status: 500 },
    )
  }
}
