'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

export default function Classement() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [classement, setClassement] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(0)
  const [semaine, setSemaine] = useState('')

  useEffect(() => {
    const u = localStorage.getItem('duneia_user')
    if(!u) { router.push('/auth'); return }
    const userObj = JSON.parse(u)
    setUser(userObj)
    setStreak(userObj.streak || 0)
    loadClassement()
    updateStreak()
  }, [])

  async function loadClassement() {
    try {
      const token = localStorage.getItem('duneia_token')
      const r = await fetch(BACKEND+'/api/ai/classement', {
        headers: {'Authorization': 'Bearer '+token}
      })
      const d = await r.json()
      if(d.success) {
        setClassement(d.classement)
        setSemaine(d.semaine)
      }
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function updateStreak() {
    try {
      const token = localStorage.getItem('duneia_token')
      const r = await fetch(BACKEND+'/api/ai/streak/update', {
        method: 'POST',
        headers: {'Content-Type':'application/json', 'Authorization': 'Bearer '+token},
        body: JSON.stringify({})
      })
      const d = await r.json()
      if(d.success) {
        setStreak(d.streak)
        const u = JSON.parse(localStorage.getItem('duneia_user') || '{}')
        u.streak = d.streak
        u.xp = d.total_xp
        localStorage.setItem('duneia_user', JSON.stringify(u))
      }
    } catch(e) { console.error(e) }
  }

  const ligueColor = (rang: number) => rang <= 3 ? '#ffd166' : rang <= 10 ? '#a48bff' : '#8e8cb0'
  const ligueEmoji = (rang: number) => rang === 1 ? '🥇' : rang === 2 ? '🥈' : rang === 3 ? '🥉' : `#${rang}`

  return (
    <>
    <style dangerouslySetInnerHTML={{__html: "@keyframes bounce { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }"}} />
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'54px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>router.push('/app')} style={{background:'rgba(255,255,255,0.06)', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← App</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>DuneIA</div>
        <div style={{marginLeft:'auto', fontSize:'0.78rem', fontWeight:800, color:'#ffd166'}}>🏆 Classement</div>
      </nav>

      <div style={{maxWidth:'680px', margin:'0 auto', padding:'20px 16px'}}>
        
        {/* Streak banner */}
        <div style={{background:'linear-gradient(135deg,rgba(255,159,28,0.15),rgba(255,107,157,0.08))', border:'2px solid rgba(255,159,28,0.3)', borderRadius:'18px', padding:'20px', marginBottom:'16px', display:'flex', alignItems:'center', gap:'16px'}}>
          <img src='/dune-celebre.png' style={{width:'70px',height:'70px',objectFit:'contain',animation:'bounce 2s infinite',filter:'drop-shadow(0 4px 12px rgba(255,159,28,0.5))',mixBlendMode:'multiply' as any}} alt='Dune'/>
          <div>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.5rem', fontWeight:700, color:'#ff9f1c'}}>{streak} jour{streak > 1 ? 's' : ''}</div>
            <div style={{fontSize:'0.8rem', color:'#8e8cb0', fontWeight:600}}>Streak de révision</div>
          </div>
          <div style={{marginLeft:'auto', textAlign:'right'}}>
            <div style={{fontSize:'0.75rem', fontWeight:800, color:'#8e8cb0', marginBottom:'4px'}}>Prochain palier</div>
            <div style={{fontSize:'0.82rem', fontWeight:800, color:'#ffd166'}}>{streak < 3 ? `${3-streak}j → +30 XP` : streak < 7 ? `${7-streak}j → +50 XP` : '🏆 Max !'}</div>
          </div>
        </div>

        {/* Streak milestones */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px', marginBottom:'20px'}}>
          {[
            {days:1, emoji:'🌱', label:'Départ', xp:10},
            {days:3, emoji:'🔥', label:'3 jours', xp:30},
            {days:7, emoji:'⚡', label:'1 semaine', xp:50},
            {days:30, emoji:'💎', label:'1 mois', xp:200},
          ].map(m=>(
            <div key={m.days} style={{background:'#131120', border:`2px solid ${streak>=m.days?'rgba(255,159,28,0.4)':'#2a2740'}`, borderRadius:'12px', padding:'10px', textAlign:'center', opacity:streak>=m.days?1:0.5}}>
              <div style={{fontSize:'1.2rem', marginBottom:'4px'}}>{m.emoji}</div>
              <div style={{fontSize:'0.7rem', fontWeight:800, color:streak>=m.days?'#ff9f1c':'#8e8cb0'}}>{m.label}</div>
              <div style={{fontSize:'0.65rem', fontWeight:700, color:'#a48bff'}}>+{m.xp} XP</div>
            </div>
          ))}
        </div>

        {/* Classement */}
        <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'20px', padding:'20px'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px'}}>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700}}>🏆 Classement de la semaine</div>
            <div style={{fontSize:'0.72rem', fontWeight:800, color:'#8e8cb0'}}>{semaine}</div>
          </div>

          {loading ? (
            <div style={{textAlign:'center', padding:'30px', color:'#8e8cb0', fontWeight:600}}>Chargement...</div>
          ) : classement.length === 0 ? (
            <div style={{textAlign:'center', padding:'30px'}}>
              <img src='/dune-pointe.png' style={{width:'90px',height:'90px',objectFit:'contain',animation:'bounce 2s infinite',filter:'drop-shadow(0 4px 12px rgba(124,92,252,0.5))',marginBottom:'8px'}} alt='Dune'/>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'6px'}}>Sois le premier !</div>
              <p style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:600}}>Commence à réviser pour apparaître dans le classement</p>
            </div>
          ) : (
            <div>
              {classement.map((c, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:'12px', padding:'12px',
                  borderRadius:'12px', marginBottom:'8px',
                  background: c.isMe ? 'rgba(124,92,252,0.1)' : 'transparent',
                  border: c.isMe ? '2px solid rgba(124,92,252,0.3)' : '2px solid transparent'
                }}>
                  <div style={{width:'32px', textAlign:'center', fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:ligueColor(c.rang), flexShrink:0}}>
                    {ligueEmoji(c.rang)}
                  </div>
                  <div style={{fontSize:'1.4rem', flexShrink:0}}>{c.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.92rem', fontWeight:700}}>
                      {c.nom} {c.isMe && <span style={{fontSize:'0.65rem', color:'#a48bff', fontWeight:800}}>TOI</span>}
                    </div>
                    <div style={{fontSize:'0.72rem', color:'#8e8cb0', fontWeight:600}}>{c.classe}</div>
                  </div>
                  <div style={{textAlign:'right', flexShrink:0}}>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, color:'#ffd166'}}>{c.xp} XP</div>
                    <div style={{fontSize:'0.65rem', color:'#8e8cb0', fontWeight:700}}>cette semaine</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ligue info */}
        <div style={{background:'rgba(124,92,252,0.08)', border:'2px solid rgba(124,92,252,0.2)', borderRadius:'14px', padding:'16px', marginTop:'14px', textAlign:'center'}}>
          <p style={{fontSize:'0.82rem', color:'#a48bff', fontWeight:700, margin:0}}>
            💡 Plus tu révises, plus tu gagnes de XP et montes dans le classement. Les 3 premiers reçoivent un badge exclusif chaque semaine !
          </p>
        </div>

      </div>
      {/* Share banner */}
      <div style={{maxWidth:'680px', margin:'0 auto', padding:'0 16px 20px'}}>
        <div style={{background:'linear-gradient(135deg,rgba(124,92,252,0.15),rgba(255,107,157,0.08))', border:'2px solid rgba(124,92,252,0.3)', borderRadius:'16px', padding:'16px', display:'flex', alignItems:'center', gap:'14px'}}>
          <div style={{fontSize:'1.5rem'}}>🔗</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, marginBottom:'3px'}}>Défie tes amis !</div>
            <div style={{fontSize:'0.76rem', color:'#8e8cb0', fontWeight:600}}>Partage DuneIA et monte dans le classement ensemble</div>
          </div>
          <button onClick={()=>{
            const msg = "Rejoins-moi sur DuneIA — l'app qui connecte ton Pronote ou EcoleDirecte et te fait réviser comme Duolingo ! Essai gratuit sur duneia.fr 🚀"
            if(typeof navigator !== 'undefined' && navigator.share) {
              navigator.share({ title: 'DuneIA', text: msg, url: 'https://duneia.fr' })
            } else if(typeof navigator !== 'undefined') {
              navigator.clipboard?.writeText(msg + ' https://duneia.fr')
              alert('Lien copié !')
            }
          }} style={{padding:'10px 16px', borderRadius:'10px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem', cursor:'pointer', flexShrink:0}}>
            Partager
          </button>
        </div>
      </div>

      <BottomNav active="app"/>
    </div>
    </>
  )
}
