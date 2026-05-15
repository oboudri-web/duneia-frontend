'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

export default function Parrainage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [code, setCode] = useState('')
  const [stats, setStats] = useState<any>(null)
  const [codeInput, setCodeInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('duneia_user')
    if(!u) { router.push('/auth'); return }
    setUser(JSON.parse(u))
    loadStats()
  }, [])

  async function loadStats() {
    const token = localStorage.getItem('duneia_token')
    try {
      const r = await fetch(BACKEND+'/api/auth/parrainage/stats', {
        headers: {'Authorization': 'Bearer '+token}
      })
      const d = await r.json()
      if(d.success) { setCode(d.code || ''); setStats(d) }
    } catch(e) { console.error(e) }
  }

  async function genererCode() {
    setLoading(true)
    const token = localStorage.getItem('duneia_token')
    try {
      const r = await fetch(BACKEND+'/api/auth/parrainage/code', {
        headers: {'Authorization': 'Bearer '+token}
      })
      const d = await r.json()
      if(d.success) { setCode(d.code); loadStats() }
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function utiliserCode() {
    if(!codeInput.trim()) return
    setLoading(true)
    setMsg('')
    const token = localStorage.getItem('duneia_token')
    try {
      const r = await fetch(BACKEND+'/api/auth/parrainage/utiliser', {
        method: 'POST',
        headers: {'Content-Type':'application/json','Authorization': 'Bearer '+token},
        body: JSON.stringify({code: codeInput.toUpperCase()})
      })
      const d = await r.json()
      if(d.success) {
        setMsg('✅ ' + d.message)
        const u = JSON.parse(localStorage.getItem('duneia_user') || '{}')
        u.plan = 'premium'
        u.plan_active = true
        localStorage.setItem('duneia_user', JSON.stringify(u))
      } else {
        setMsg('❌ ' + d.error)
      }
    } catch(e) { setMsg('❌ Erreur réseau') }
    finally { setLoading(false) }
  }

  function partager() {
    const msg = `🎓 J'utilise DuneIA pour réviser — c'est comme Duolingo mais pour ton Pronote ou EcoleDirecte ! Utilise mon code ${code} pour avoir 1 mois Premium gratuit ! duneia.fr`
    if(typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'DuneIA', text: msg, url: 'https://duneia.fr' })
    } else {
      navigator.clipboard?.writeText(msg)
      setCopied(true)
      setTimeout(()=>setCopied(false), 2000)
    }
  }

  function copierCode() {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(()=>setCopied(false), 2000)
  }

  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'54px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>router.push('/profil')} style={{background:'rgba(255,255,255,0.06)', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← Profil</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>DuneIA</div>
        <div style={{marginLeft:'auto', fontSize:'0.78rem', fontWeight:800, color:'#06d6a0'}}>🔗 Parrainage</div>
      </nav>

      <div style={{maxWidth:'680px', margin:'0 auto', padding:'20px 16px'}}>

        {/* Hero */}
        <div style={{background:'linear-gradient(135deg,rgba(6,214,160,0.12),rgba(124,92,252,0.08))', border:'2px solid rgba(6,214,160,0.3)', borderRadius:'22px', padding:'28px', textAlign:'center', marginBottom:'16px'}}>
          <div style={{fontSize:'2.5rem', marginBottom:'12px'}}>🎁</div>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.4rem', fontWeight:700, marginBottom:'8px'}}>Invite un ami, gagnez tous les deux</div>
          <p style={{fontSize:'0.86rem', color:'rgba(240,238,255,0.75)', fontWeight:600, lineHeight:1.7, marginBottom:'20px'}}>
            Partage ton code à un ami. Quand il s'inscrit, vous recevez tous les deux <strong style={{color:'#06d6a0'}}>1 mois Premium gratuit</strong> !
          </p>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
            {[
              {emoji:'👤', label:'Toi', desc:'+1 mois Premium offert'},
              {emoji:'👥', label:'Ton ami', desc:'+1 mois Premium offert'},
            ].map((item,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,0.05)', borderRadius:'12px', padding:'14px'}}>
                <div style={{fontSize:'1.5rem', marginBottom:'6px'}}>{item.emoji}</div>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.9rem', fontWeight:700}}>{item.label}</div>
                <div style={{fontSize:'0.75rem', color:'#06d6a0', fontWeight:700}}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mon code */}
        <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px', marginBottom:'14px'}}>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'14px'}}>🎟️ Mon code parrainage</div>
          
          {code ? (
            <div>
              <div style={{background:'rgba(6,214,160,0.08)', border:'2px solid rgba(6,214,160,0.3)', borderRadius:'14px', padding:'16px', textAlign:'center', marginBottom:'12px'}}>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.8rem', fontWeight:700, color:'#06d6a0', letterSpacing:'3px'}}>{code}</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                <button onClick={copierCode} style={{padding:'12px', borderRadius:'12px', border:'2px solid rgba(6,214,160,0.3)', background:'rgba(6,214,160,0.08)', color:'#06d6a0', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.85rem', cursor:'pointer'}}>
                  {copied ? '✅ Copié !' : '📋 Copier le code'}
                </button>
                <button onClick={partager} style={{padding:'12px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#06d6a0,#00a8b5)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.85rem', cursor:'pointer'}}>
                  🔗 Partager
                </button>
              </div>
            </div>
          ) : (
            <button onClick={genererCode} disabled={loading} style={{width:'100%', padding:'14px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#06d6a0,#00a8b5)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.92rem', cursor:'pointer', opacity:loading?0.7:1}}>
              {loading ? 'Génération...' : '🎟️ Générer mon code'}
            </button>
          )}
        </div>

        {/* Stats parrainage */}
        {stats && (
          <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px', marginBottom:'14px'}}>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'14px'}}>📊 Mes parrainages</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'14px'}}>
              <div style={{background:'rgba(255,209,102,0.08)', border:'2px solid rgba(255,209,102,0.2)', borderRadius:'12px', padding:'14px', textAlign:'center'}}>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'2rem', fontWeight:700, color:'#ffd166'}}>{stats.filleuls?.length || 0}</div>
                <div style={{fontSize:'0.75rem', color:'#8e8cb0', fontWeight:700}}>Amis parrainés</div>
              </div>
              <div style={{background:'rgba(6,214,160,0.08)', border:'2px solid rgba(6,214,160,0.2)', borderRadius:'12px', padding:'14px', textAlign:'center'}}>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'2rem', fontWeight:700, color:'#06d6a0'}}>{stats.mois_offerts || 0}</div>
                <div style={{fontSize:'0.75rem', color:'#8e8cb0', fontWeight:700}}>Mois offerts</div>
              </div>
            </div>
            {stats.filleuls?.length > 0 && (
              <div>
                <div style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0', marginBottom:'8px'}}>Tes filleuls :</div>
                {stats.filleuls.map((f:any,i:number)=>(
                  <div key={i} style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px 0', borderBottom:i<stats.filleuls.length-1?'1px solid rgba(255,255,255,0.04)':'none'}}>
                    <div style={{fontSize:'1.2rem'}}>🧑‍🎓</div>
                    <div style={{fontSize:'0.84rem', fontWeight:700}}>{f.users?.nom || 'Élève'}</div>
                    <div style={{marginLeft:'auto', fontSize:'0.72rem', color:'#06d6a0', fontWeight:700}}>+1 mois ✅</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Utiliser un code */}
        <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px'}}>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'14px'}}>🎟️ J'ai un code parrainage</div>
          <input
            value={codeInput}
            onChange={e=>setCodeInput(e.target.value.toUpperCase())}
            placeholder="DUNE-XXXX-XXXX"
            style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'12px', color:'#f0eeff', fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, outline:'none', textAlign:'center', letterSpacing:'2px', boxSizing:'border-box' as any, marginBottom:'10px'}}
          />
          {msg && (
            <div style={{background:msg.startsWith('✅')?'rgba(6,214,160,0.08)':'rgba(239,71,111,0.08)', border:`1px solid ${msg.startsWith('✅')?'rgba(6,214,160,0.3)':'rgba(239,71,111,0.3)'}`, borderRadius:'10px', padding:'10px', fontSize:'0.82rem', fontWeight:700, color:msg.startsWith('✅')?'#06d6a0':'#ef476f', marginBottom:'10px', textAlign:'center'}}>
              {msg}
            </div>
          )}
          <button onClick={utiliserCode} disabled={loading||!codeInput.trim()} style={{width:'100%', padding:'13px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.92rem', cursor:'pointer', opacity:loading||!codeInput.trim()?0.6:1}}>
            {loading ? 'Vérification...' : '🎁 Utiliser ce code'}
          </button>
        </div>

      </div>
      <BottomNav active="app"/>
    </div>
  )
}
