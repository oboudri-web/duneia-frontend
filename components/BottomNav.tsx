'use client'
import { useRouter, usePathname } from 'next/navigation'

export default function BottomNav() {
  const router = useRouter()
  const path = usePathname()

  const tabs = [
    { icon: '🏠', label: 'Accueil', href: '/app' },
    { icon: '📚', label: 'Programme', href: '/app' },
    { icon: '🧠', label: 'Analyse', href: '/analyse' },
    { icon: '👤', label: 'Profil', href: '/profil' },
  ]

  // Don't show on landing, auth, onboarding
  if(['/', '/auth', '/onboarding', '/paiement'].includes(path)) return null

  return (
    <>
      {/* Bottom nav spacer */}
      <div style={{height:'80px'}}/>

      {/* Bottom nav */}
      <div style={{
        position:'fixed', bottom:0, left:0, right:0, zIndex:200,
        background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)',
        borderTop:'2px solid #2a2740',
        paddingBottom:'env(safe-area-inset-bottom)',
        display:'flex', alignItems:'center', justifyContent:'space-around',
        padding:'8px 0 calc(8px + env(safe-area-inset-bottom))',
      }}>
        {tabs.map((tab, i) => {
          const active = path === tab.href
          return (
            <button key={i} onClick={()=>router.push(tab.href)} style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:'3px',
              background:'transparent', border:'none', cursor:'pointer',
              padding:'6px 16px', borderRadius:'12px',
              transition:'all 0.2s',
              opacity: active ? 1 : 0.5,
            }}>
              <span style={{fontSize:'1.3rem'}}>{tab.icon}</span>
              <span style={{
                fontSize:'0.62rem', fontWeight:800,
                color: active ? '#a48bff' : '#8e8cb0',
                fontFamily:'Nunito,sans-serif'
              }}>{tab.label}</span>
              {active && <div style={{width:'4px', height:'4px', borderRadius:'50%', background:'#7c5cfc', marginTop:'1px'}}/>}
            </button>
          )
        })}
      </div>
    </>
  )
}
