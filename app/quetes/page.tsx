'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

const LIGUES = [
  { nom: 'Bronze', emoji: '🥉', color: '#cd7f32', min: 0, max: 199 },
  { nom: 'Argent', emoji: '🥈', color: '#c0c0c0', min: 200, max: 499 },
  { nom: 'Or', emoji: '🥇', color: '#ffd166', min: 500, max: 999 },
  { nom: 'Platine', emoji: '💎', color: '#a48bff', min: 1000, max: 2499 },
  { nom: 'Diamant', emoji: '💠', color: '#06d6a0', min: 2500, max: 999999 },
]

export default function Quetes() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [quetes, setQuetes] = useState<any[]>([])
  const [vies, setVies] = useState(5)
  const [loading, setLoading] = useState(true)
  const [xpTotal, setXpTotal] = useState(0)

  useEffect(() => {
    const u = localStorage.getItem('duneia_user')
    if(!u) { router.push('/auth'); return }
    setUser(JSON.parse(u))
    loadAll()
  }, [])

  async function loadAll() {
    const token = localStorage.getItem('duneia_token')
    try {
      const [qR, vR] = await Promise.all([
        fetch(BACKEND+'/api/ai/quetes', { headers: {'Authorization': 'Bearer '+token} }),
        fetch(BACKEND+'/api/ai/vies', { headers: {'Authorization': 'Bearer '+token} })
      ])
      const [qD, vD] = await Promise.all([qR.json(), vR.json()])
      if(qD.success) { setQuetes(qD.quetes); setXpTotal(qD.xp_total) }
      if(vD.success) setVies(vD.vies)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  function getLigue(xp: number) {
    return LIGUES.find(l => xp >= l.min && xp <= l.max) || LIGUES[0]
  }

  function getNextLigue(xp: number) {
    const idx = LIGUES.findIndex(l => xp >= l.min && xp <= l.max)
    return idx < LIGUES.length - 1 ? LIGUES[idx + 1] : null
  }

  const totalXp = user?.xp || 0
  const ligue = getLigue(totalXp)
  const nextLigue = getNextLigue(totalXp)
  const progressPct = nextLigue ? Math.round(((totalXp - ligue.min) / (nextLigue.min - ligue.min)) * 100) : 100

  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'54px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>router.push('/app')} style={{background:'rgba(255,255,255,0.06)', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← App</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>DuneIA</div>
        <div style={{marginLeft:'auto', fontSize:'0.78rem', fontWeight:800, color:'#ffd166'}}>🎯 Quêtes & Ligues</div>
      </nav>

      <div style={{maxWidth:'680px', margin:'0 auto', padding:'20px 16px'}}>

        {/* Vies */}
        <div style={{background:'linear-gradient(135deg,rgba(239,71,111,0.12),rgba(255,107,157,0.06))', border:'2px solid rgba(239,71,111,0.3)', borderRadius:'18px', padding:'18px', marginBottom:'14px'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'4px'}}>❤️ Vies</div>
              <div style={{fontSize:'0.78rem', color:'#8e8cb0', fontWeight:600}}>+1 vie toutes les 4h · Max 5</div>
            </div>
            <div style={{display:'flex', gap:'6px'}}>
              {[1,2,3,4,5].map(i=>(
                <div key={i} style={{fontSize:'1.4rem', opacity:i<=vies?1:0.25}}>❤️</div>
              ))}
            </div>
          </div>
          {vies === 0 && (
            <div style={{marginTop:'10px', background:'rgba(239,71,111,0.08)', borderRadius:'8px', padding:'8px 12px', fontSize:'0.78rem', color:'#ef476f', fontWeight:700, textAlign:'center'}}>
              Plus de vies ! Reviens dans 4h ou fais des révisions sans QCM
            </div>
          )}
        </div>

        {/* Ligue */}
        <div style={{background:'#131120', border:`2px solid ${ligue.color}44`, borderRadius:'20px', padding:'22px', marginBottom:'14px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'16px', marginBottom:'14px'}}>
            <div style={{fontSize:'2.8rem'}}>{ligue.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700, color:ligue.color}}>Ligue {ligue.nom}</div>
              <div style={{fontSize:'0.78rem', color:'#8e8cb0', fontWeight:600}}>{totalXp} XP total</div>
            </div>
            {nextLigue && (
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'0.72rem', color:'#8e8cb0', fontWeight:700}}>Prochain</div>
                <div style={{fontSize:'0.88rem', fontWeight:800, color:nextLigue.color}}>{nextLigue.emoji} {nextLigue.nom}</div>
                <div style={{fontSize:'0.68rem', color:'#8e8cb0', fontWeight:600}}>{nextLigue.min - totalXp} XP restants</div>
              </div>
            )}
          </div>
          <div style={{background:'rgba(255,255,255,0.06)', borderRadius:'100px', height:'8px', overflow:'hidden'}}>
            <div style={{height:'100%', background:`linear-gradient(135deg,${ligue.color},${nextLigue?.color||ligue.color})`, width:`${progressPct}%`, borderRadius:'100px', transition:'width 0.5s'}}/>
          </div>
          
          {/* Toutes les ligues */}
          <div style={{display:'flex', justifyContent:'space-between', marginTop:'16px'}}>
            {LIGUES.map(l=>(
              <div key={l.nom} style={{textAlign:'center', opacity:totalXp>=l.min?1:0.35}}>
                <div style={{fontSize:'1.2rem'}}>{l.emoji}</div>
                <div style={{fontSize:'0.6rem', fontWeight:800, color:totalXp>=l.min?l.color:'#8e8cb0'}}>{l.nom}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quêtes du jour */}
        <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'20px', padding:'20px', marginBottom:'14px'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px'}}>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700}}>🎯 Quêtes du jour</div>
            <div style={{background:'rgba(255,209,102,0.1)', border:'1px solid rgba(255,209,102,0.25)', borderRadius:'100px', padding:'3px 10px', fontSize:'0.72rem', fontWeight:800, color:'#ffd166'}}>+{xpTotal} XP gagnés</div>
          </div>

          {loading ? (
            <div style={{textAlign:'center', padding:'20px', color:'#8e8cb0'}}>Chargement...</div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              {quetes.map((q,i)=>(
                <div key={i} style={{
                  background: q.done ? 'rgba(6,214,160,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `2px solid ${q.done ? 'rgba(6,214,160,0.3)' : '#2a2740'}`,
                  borderRadius:'14px', padding:'14px',
                  display:'flex', alignItems:'center', gap:'12px'
                }}>
                  <div style={{fontSize:'1.5rem', flexShrink:0}}>{q.done ? '✅' : q.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'0.86rem', fontWeight:700, color: q.done ? '#06d6a0' : '#f0eeff', marginBottom:'6px'}}>{q.label}</div>
                    <div style={{background:'rgba(255,255,255,0.06)', borderRadius:'100px', height:'6px', overflow:'hidden'}}>
                      <div style={{height:'100%', background: q.done ? '#06d6a0' : 'linear-gradient(135deg,#7c5cfc,#ff6b9d)', width:`${Math.min(100, (q.progress/q.total)*100)}%`, borderRadius:'100px'}}/>
                    </div>
                    <div style={{fontSize:'0.68rem', color:'#8e8cb0', fontWeight:600, marginTop:'4px'}}>{q.progress}/{q.total}</div>
                  </div>
                  <div style={{background:'rgba(255,209,102,0.1)', border:'1px solid rgba(255,209,102,0.2)', borderRadius:'100px', padding:'4px 10px', fontSize:'0.72rem', fontWeight:800, color:'#ffd166', flexShrink:0}}>
                    +{q.xp} XP
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
          <button onClick={()=>router.push('/revision')} style={{padding:'14px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.88rem', cursor:'pointer'}}>
            📚 Réviser
          </button>
          <button onClick={()=>router.push('/jeux')} style={{padding:'14px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#ff6b9d,#ff9f1c)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.88rem', cursor:'pointer'}}>
            🎮 Jouer
          </button>
        </div>

      </div>
      <BottomNav active="app"/>
    </div>
  )
}
