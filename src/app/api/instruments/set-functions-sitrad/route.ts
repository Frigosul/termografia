import { httpInstance } from '@/lib/http-instance'
import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json([], { status: 200 })
  }
  const { action, active, model, id } = await req.json()
  try {
    let dataBody = {}
    if (action === 'Deg') {
      if (model === 73) {
        dataBody = {
          code: 'INV',
          value: active ? 0 : 1,
          groupCode: null,
          showSpc: true,
        }
      } else if (model === 72) {
        dataBody = {
          code: 'DEFR',
          value: 0,
          groupCode: null,
          showSpc: true,
        }
      }
    } else if (action === 'Vent' && model === 72) {
      dataBody = {
        code: 'F21',
        value: active ? 7 : 4,
        showSpc: true,
      }
    }
    const url =
      action === 'Vent'
        ? `/instruments/${id}/functions`
        : `/instruments/${id}/commands`

    const response = await httpInstance.post(url, dataBody)
    return NextResponse.json(response.data, { status: 202 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error api', details: error },
      { status: 500 },
    )
  }
}
