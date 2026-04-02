// src/app/api/auth/register/route.ts
// Creates a new student account in the database
 
import { NextRequest, NextResponse } from 'next/server'
import bcrypt                        from 'bcryptjs'
import { prisma }                    from '@/lib/prisma'
import { createSession }             from '@/lib/auth'
 
export async function POST(req: NextRequest) {
  try {
    const { name, username, email, password } = await req.json()
 
    // Check all fields are filled
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }
 
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }
 
    // Check email or username not already taken
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email },{name}] },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Email or username already taken' },
        { status: 409 }
      )
    }
 
    // Hash the password before saving (never save plain password)
    const hashed = await bcrypt.hash(password, 12)
 
    // Save new student in database
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    })
 
    // Create session token and set cookie
    const token = await createSession({
      userId:   user.id,
      name:     user.name,
      email:    user.email,
    })
 
    const response = NextResponse.json({ ok: true })
    response.cookies.set('cbt_session', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7,
      path:     '/',
    })
 
    return response
 
  } catch (err: any) {
    console.error('Register error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
 