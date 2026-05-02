import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getLugares, addLugar } from '@/lib/github'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const lugares = await getLugares()
  return NextResponse.json(lugares)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  await addLugar(body)
  return NextResponse.json({ ok: true })
}
