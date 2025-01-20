import { httpInstance } from '@/lib/http-instance'
import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  const { setpoint, id } = await req.json()
  try {
    const dataBody = {
      code: 'F01',
      value: setpoint,
      showSpc: true,
    }
    const response = await httpInstance.post(
      `instruments/${id}/functions`,
      dataBody,
    )
    return NextResponse.json(response.data, { status: 202 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Error api', details: error },
      { status: 500 },
    )
  }
}
