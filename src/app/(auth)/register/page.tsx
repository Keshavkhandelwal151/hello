'use client'
// src/app/(auth)/register/page.tsx
 
import { useState }  from 'react'
import { useRouter } from 'next/navigation'
import Link          from 'next/link'
import styles        from '../login/login.module.css'
 
export default function RegisterPage() {
  const router = useRouter()
 
  const [name,     setName]     = useState('')
  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
 
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
 
    setLoading(true)
 
    try {
      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, username, email, password }),
      })
 
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
 
      router.push('/home')
      router.refresh()
 
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }
 
  return (
    <div className={styles.page}>
 
      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className={styles.leftPanel}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>◈</div>
          <span className={styles.brandName}>CBTPortal</span>
        </div>
 
        <div className={styles.brandBody}>
          <h1 className={styles.brandHeading}>
            Start your journey.<br />Ace your exam.
          </h1>
          <p className={styles.brandSub}>
            Create your free account and start practising
            with AI-powered tests for JEE, GATE and CUET.
          </p>
        </div>
 
        <div className={styles.examRow}>
          {['JEE', 'GATE', 'CUET'].map(ex => (
            <div key={ex} className={styles.examBadge}>
              <span className={styles.examName}>{ex}</span>
            </div>
          ))}
        </div>
      </div>
 
      {/* ── RIGHT PANEL — register form ─────────────────────────── */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrap}>
 
          <div className={styles.formHead}>
            <h2 className={styles.formTitle}>Create account</h2>
            <p className={styles.formSub}>
              Fill in the details below to get started
            </p>
          </div>
 
          <form onSubmit={handleSubmit} className={styles.form}>
 
            <div className={styles.field}>
              <label className={styles.label}>Full name</label>
              <input
                className={styles.input}
                placeholder="Rahul Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
 
            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <input
                className={styles.input}
                placeholder="rahul_s"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
 
            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input
                type="email"
                className={styles.input}
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
 
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
 
            {error && (
              <div className={styles.errorBox}>{error}</div>
            )}
 
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
 
          </form>
 
          {/* Link back to login */}
          <div className={styles.registerBox}>
            <p className={styles.registerText}>
              Already have an account?
            </p>
            <Link href="/login" className={styles.registerBtn}>
              Sign in instead
            </Link>
          </div>
 
        </div>
      </div>
 
    </div>
  )
}
 