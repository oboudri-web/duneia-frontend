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

  const hiddenPaths = ['/', '/auth', '/onboarding', '/paiement']
  if(hiddenPaths.includes(path || '')) return null

  return (
    <>
      <div style={{height:'90px'}}/>
      <nav style={{
        position:'fixed',
        bottom:0,
        left:0,
        right:0,
        zIndex:9999,
        background:'#0a0914',
        borderTop:'2px solid #2a2740',
        display:'flex',
        alignItems:'center',
        justifyContent:'space-around',
        paddingTop:'10px',
        paddingBottom:'calc(10px + env(safe-area-inset-bottom, 0px))',
        minHeight:'60px',
      }}>
        {tabs.map((tab, i) => {
          const active = path === tab.href
          return (
            <button
              key={i}
              onClick={()=>router.push(tab.href)}
              style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                gap:'3px',
                background: active ? 'rgba(124,92,252,0.15)' : 'transparent',
                border: active ? '1px solid rgba(124,92,252,0.3)' : '1px solid transparent',
                cursor:'pointer',
                padding:'6px 18px',
                borderRadius:'12px',
                minWidth:'60px',
              }}
            >
              <span style={{fontSize:'1.2rem'}}>{tab.icon}</span>
              <span style={{
                fontSize:'0.6rem',
                fontWeight:800,
                color: active ? '#a48bff' : '#8e8cb0',
                fontFamily:'Nunito,sans-serif',
                whiteSpace:'nowrap',
              }}>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
