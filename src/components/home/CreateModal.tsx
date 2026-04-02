'use client'
import { useState } from 'react'    
import styles from './CreateModal.module.css'

export default function CreateModal({ onClose, onCreated }: any) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ examType: 'JEE Main', subject: 'Physics', topics: '', numQuestions: 10 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Here we would call your /api/tests/create
    console.log("Generating test...", form)
    setTimeout(() => {
      setLoading(false)
      onClose()
    }, 2000)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={e => e.stopPropagation()}>
        <div className={styles.handle} />
        <h2 className={styles.title}>AI Test Generator</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Topics</label>
            <input 
              className={styles.input} 
              placeholder="e.g. Calculus, Mechanics" 
              onChange={e => setForm({...form, topics: e.target.value})}
            />
          </div>
          <button type="submit" className={styles.genBtn} disabled={loading}>
            {loading ? 'Generating...' : 'Start Generating'}
          </button>
        </form>
      </div>
    </div>
  )
}