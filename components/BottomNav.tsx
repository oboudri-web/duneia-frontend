'use client'
import { useRouter } from 'next/navigation'

interface Props {
  active: 'app' | 'analyse' | 'parents' | 'profil'
}

export default function BottomNav({ active }: Props) {
  const router = useRouter()

  const tabs = [
    { icon: '🏠', label: 'Accueil', href: '/app', id: 'app' },
    { icon: '🧠', label: 'Analyse', href: '/analyse', id: 'analyse' },
    { icon: '👨‍👩‍👧', label: 'Parents', href: '/parents', id: 'parents' },
    { icon: '👤', label: 'Profil', href: '/profil', id: 'profil' },
  ]

  return (
    <>
      <div style={{height:'80px'}}/>
      <nav style={{
        position:'fixed', bottom:0, left:0, right:0, zIndex:9999,
        background:'#0a0914', borderTop:'2px solid #2a2740',
        display:'flex', alignItems:'center', justifyContent:'space-around',
        padding:'10px 0 20px',
      }}>
        {tabs.map((tab) => {
          const isActive = active === tab.id
          return (
            <button key={tab.id} onClick={()=>router.push(tab.href)} style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:'3px',
              background: isActive ? 'rgba(124,92,252,0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(124,92,252,0.3)' : '1px solid transparent',
              cursor:'pointer', padding:'8px 16px', borderRadius:'12px',
            }}>
              <span style={{fontSize:'1.2rem'}}>{tab.icon}</span>
              <span style={{
                fontSize:'0.6rem', fontWeight:800,
                color: isActive ? '#a48bff' : '#8e8cb0',
                fontFamily:'Nunito,sans-serif',
              }}>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
