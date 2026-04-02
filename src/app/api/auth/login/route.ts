// src/app/api/auth/login/route.ts
// This runs on the SERVER when student clicks Sign In
// Checks email + password, then saves login cookie
 
import { NextRequest, NextResponse } from 'next/server'
import bcrypt                        from 'bcryptjs'
import { prisma }                    from '@/lib/prisma'
import { createSession }             from '@/lib/auth'
 
export async function POST(req: NextRequest) {
  try {
 
    // STEP 1 — read email and password from form
    const { email, password } = await req.json()
 
    // STEP 2 — check fields are not empty
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
 
    // STEP 3 — find student in database
    const user = await prisma.user.findUnique({
      where: { email },
    })
 
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
 
    // STEP 4 — check password matches
    // bcrypt compares typed password with saved hashed password
    const correct = await bcrypt.compare(password, user.password)
 
    if (!correct) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
 
    // STEP 5 — create JWT session token
    const token = await createSession({
      userId:   user.id,
      name:     user.name,
      email:    user.email,
    })
 
    // STEP 6 — save token as cookie in browser
    const response = NextResponse.json({ ok: true })
 
    response.cookies.set('cbt_session', token, {
      httpOnly: true,    // JS cannot read this (security)
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7,   // 7 days
      path:     '/',
    })
 
    return response
 
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
 