import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'iansi-executive-dashboard',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  )
}
