'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import styles from './home.module.css'
import CreateModal from '@/components/home/CreateModal'

/* -- Types & Constants -- */
interface Tag { id: string; name: string; label: string }
interface QP {
  id: string; name: string; time_limit: number;
  _count: { testSessions: number; questions: number };
  tagQps: { tag: Tag }[];
}

const EXAM_COLORS: Record<string, any> = {
  'JEE Main': { bg: '#6366f1', badge: 'rgba(255,255,255,0.2)' },
  'GATE': { bg: '#0f6e56', badge: 'rgba(255,255,255,0.2)' },
  'CUET': { bg: '#854F0B', badge: 'rgba(255,255,255,0.2)' },
};

const FILTER_CHIPS = ['All', 'JEE', 'GATE', 'CUET', 'Physics', 'Chemistry', 'Mathematics'];

export default function HomeClient({ userName, presetQPs, recommended }: any) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')
  const [activeChip, setActiveChip] = useState('All')

  const filtered = useMemo(() => {
    let list = presetQPs
    if (search) {
      list = list.filter((qp: any) => qp.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (activeChip !== 'All') {
      list = list.filter((qp: any) => qp.tagQps.some((t: any) => t.tag.label.includes(activeChip)))
    }
    return list
  }, [presetQPs, search, activeChip])

  return (
    <div className={styles.page}>
      <section className={styles.heroBand}>
        <div className={styles.heroText}>
          <p className={styles.greeting}>Welcome back, {userName.split(' ')[0]}</p>
          <h1 className={styles.heroTitle}>Ready to practice?</h1>
        </div>
        <button className={styles.createPill} onClick={() => setShowCreate(true)}>
          <span>Create with AI</span>
        </button>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Discover Tests</h2>
        <div className={styles.searchBar}>
          <input 
            placeholder="Search topics..." 
            className={styles.searchInput}
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <div className={styles.chips}>
          {FILTER_CHIPS.map(c => (
            <button 
              key={c} 
              className={`${styles.chip} ${activeChip === c ? styles.chipActive : ''}`}
              onClick={() => setActiveChip(c)}
            >{c}</button>
          ))}
        </div>
        <div className={styles.discList}>
          {filtered.map((qp: any) => (
            <div key={qp.id} className={styles.discCard} onClick={() => router.push(`/test/${qp.id}`)}>
              <p className={styles.discTitle}>{qp.name}</p>
              <span className={styles.discMeta}>{qp._count.questions} Questions • {qp.time_limit}m</span>
            </div>
          ))}
        </div>
      </section>

      {showCreate && (
        <CreateModal 
          onClose={() => setShowCreate(false)} 
          onCreated={(id: string) => router.push(`/test/${id}`)} 
        />
      )}
    </div>
  )
}