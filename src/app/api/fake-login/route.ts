import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

// Chave secreta para gerar o JWT
const SECRET_KEY = 'supersecretkey'
const expiresIn = '12h'

// Função para gerar o token JWT
function createToken(payload: object) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
  }

  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required' },
      { status: 400 },
    )
  }

  const response = await fetch(`http://localhost:3333/users?email=${email}`)
  const userExist = await response.json()

  if (userExist && userExist.password === password) {
    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 },
    )
  }

  const token = createToken({ id: userExist.id, email: userExist.email })

  return NextResponse.json({ token }, { status: 200 })
}
