'use client'
// src/app/(auth)/login/page.tsx
// This is the Login Page
// Student enters email and password to access their account
 
import { useState }    from 'react'
import { useRouter }   from 'next/navigation'
import Link            from 'next/link'
import styles          from './login.module.css'
 
export default function LoginPage() {
  const router = useRouter()
 
  // ── Form values ──────────────────────────────────────────────────
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
 
  // ── UI states ────────────────────────────────────────────────────
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
 
  // ── Called when student clicks Sign In ───────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()   // stop page from refreshing
    setError('')
    setLoading(true)
 
    try {
      // Send email and password to the login API
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
 
      const data = await res.json()
 
      if (!res.ok) {
        // Wrong email or password
        throw new Error(data.error)
      }
 
      // Login successful — cookie saved — go to Home Page
      router.push('/home')
      router.refresh()
 
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }
 
  // ── RENDER ───────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
 
      {/* ── LEFT PANEL — branding ──────────────────────────────── */}
      <div className={styles.leftPanel}>
 
        {/* Logo and brand name */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}>◈</div>
          <span className={styles.brandName}>CBTPortal</span>
        </div>
 
        {/* Tagline */}
        <div className={styles.brandBody}>
          <h1 className={styles.brandHeading}>
            Practice smarter.<br />Perform better.
          </h1>
          <p className={styles.brandSub}>
            AI-powered Computer Based Tests for JEE,
            GATE, CUET and more. Practice with real
            exam patterns and get personalised analysis.
          </p>
        </div>
 
        {/* Exam badges */}
        <div className={styles.examRow}>
          {[
            { name: 'JEE',  sub: 'Main & Advanced' },
            { name: 'GATE', sub: 'CS & ECE' },
            { name: 'CUET', sub: 'UG & PG' },
          ].map(ex => (
            <div key={ex.name} className={styles.examBadge}>
              <span className={styles.examName}>{ex.name}</span>
              <span className={styles.examSub}>{ex.sub}</span>
            </div>
          ))}
        </div>
 
      </div>
 
      {/* ── RIGHT PANEL — login form ────────────────────────────── */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrap}>
 
          {/* Form heading */}
          <div className={styles.formHead}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSub}>
              Sign in to continue your preparation
            </p>
          </div>
 
          {/* Login form */}
          <form onSubmit={handleSubmit} className={styles.form}>
 
            {/* Email */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
 
            {/* Password */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
 
            {/* Error message — shown only if login fails */}
            {error && (
              <div className={styles.errorBox}>
                {error}
              </div>
            )}
 
            {/* Sign In button */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
 
          </form>
 
          {/* Link to register page */}
          <p className={styles.registerLink}>
            Don&apos;t have an account?{' '}
            <Link href="/register">Create one</Link>
          </p>
 
        </div>
      </div>
 
    </div>
  )
}
 