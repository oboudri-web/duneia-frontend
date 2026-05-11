'use client'
import { useRouter, usePathname } from 'next/navigation'

export default function BottomNav() {
  const router = useRouter()
  const path = usePathname()

  const tabs = [
    { icon: '🏠', label: 'Accueil', href: '/app' },
    { icon: '🧠', label: 'Analyse', href: '/analyse' },
    { icon: '👨‍👩‍👧', label: 'Parents', href: '/parents' },
    { icon: '👤', label: 'Profil', href: '/profil' },
  ]

  if(['/', '/auth', '/onboarding', '/paiement'].some(p => path?.startsWith(p) && path === p)) return null
  if(path === '/' || path === '/auth' || path === '/onboarding' || path === '/paiement') return null

  return (
    <>
      <div style={{height:'80px'}}/>
      <div style={{
        position:'fixed', bottom:0, left:0, right:0, zIndex:200,
        background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)',
        borderTop:'2px solid #2a2740',
        display:'flex', alignItems:'center', justifyContent:'space-around',
        padding:'10px 0 20px',
      }}>
        {tabs.map((tab, i) => {
          const active = path === tab.href
          return (
            <button key={i} onClick={()=>router.push(tab.href)} style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:'3px',
              background: active ? 'rgba(124,92,252,0.15)' : 'transparent',
              border: active ? '1px solid rgba(124,92,252,0.3)' : '1px solid transparent',
              cursor:'pointer', padding:'8px 20px', borderRadius:'14px',
              transition:'all 0.2s',
            }}>
              <span style={{fontSize:'1.3rem'}}>{tab.icon}</span>
              <span style={{
                fontSize:'0.62rem', fontWeight:800,
                color: active ? '#a48bff' : '#8e8cb0',
                fontFamily:'Nunito,sans-serif'
              }}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
