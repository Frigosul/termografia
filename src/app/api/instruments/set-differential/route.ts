import { httpInstance } from '@/lib/http-instance'
import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  const { differential, model, id } = await req.json()
  try {
    const dataBody = {
      code: model === 72 ? 'F02' : model === 73 && 'F05',
      value: differential,
      showSpc: true,
    }
    const response = await httpInstance.post(
      `instruments/${id}/functions`,
      dataBody,
    )
    return NextResponse.json(response.data, { status: 202 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error api', details: error },
      { status: 500 },
    )
  }
}
