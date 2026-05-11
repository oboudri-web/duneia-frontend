'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'
const ADMIN_SECRET = 'duneia_admin_2026'

export default function Admin() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [auth, setAuth] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    const saved = localStorage.getItem('duneia_admin_auth')
    if(saved === 'true') { setAuth(true); fetchStats() }
    else setLoading(false)
  }, [])

  async function fetchStats() {
    setLoading(true)
    try {
      const r = await fetch(`${BACKEND}/api/admin/stats?secret=${ADMIN_SECRET}`)
      const d = await r.json()
      if(!r.ok) throw new Error(d.error)
      setStats(d)
      setLastRefresh(new Date())
    } catch(e:any) { setError(e.message) }
    finally { setLoading(false) }
  }

  function login() {
    if(password === ADMIN_SECRET) {
      setAuth(true)
      localStorage.setItem('duneia_admin_auth', 'true')
      fetchStats()
    } else {
      setError('Mot de passe incorrect')
    }
  }

  const card = (label:string, value:any, color:string, sub?:string) => (
    <div style={{background:'#131120', border:`2px solid ${color}22`, borderRadius:'16px', padding:'20px', textAlign:'center'}}>
      <div style={{fontSize:'0.72rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px'}}>{label}</div>
      <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'2.2rem', fontWeight:700, color}}>{value}</div>
      {sub && <div style={{fontSize:'0.72rem', color:'#8e8cb0', fontWeight:600, marginTop:'4px'}}>{sub}</div>}
    </div>
  )

  if(!auth) return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:1}}>
      <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'22px', padding:'40px', width:'100%', maxWidth:'380px', textAlign:'center'}}>
        <div style={{fontSize:'2.5rem', marginBottom:'16px'}}>🔐</div>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.3rem', fontWeight:700, marginBottom:'20px'}}>Dashboard Fondateur</div>
        {error && <div style={{background:'rgba(239,71,111,0.1)', border:'2px solid rgba(239,71,111,0.25)', borderRadius:'10px', padding:'10px', color:'#ef476f', fontSize:'0.82rem', fontWeight:700, marginBottom:'14px'}}>{error}</div>}
        <input
          type="password"
          placeholder="Mot de passe admin"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&login()}
          style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'12px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:600, outline:'none', marginBottom:'14px', boxSizing:'border-box'}}
        />
        <button onClick={login} style={{width:'100%', padding:'13px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.95rem', cursor:'pointer'}}>
          Accéder au dashboard
        </button>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'50px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>🎓 DuneIA</div>
        <div style={{fontSize:'0.78rem', fontWeight:800, color:'#a48bff'}}>Dashboard Fondateur</div>
        <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{fontSize:'0.7rem', color:'#8e8cb0', fontWeight:600}}>Mis à jour : {lastRefresh.toLocaleTimeString()}</div>
          <button onClick={fetchStats} style={{background:'rgba(124,92,252,0.1)', border:'2px solid rgba(124,92,252,0.3)', borderRadius:'9px', color:'#a48bff', padding:'6px 12px', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.78rem', cursor:'pointer'}}>🔄 Refresh</button>
        </div>
      </nav>

      <div style={{maxWidth:'900px', margin:'0 auto', padding:'20px 16px'}}>
        {loading ? (
          <div style={{textAlign:'center', padding:'60px'}}>
            <div style={{width:'40px', height:'40px', border:'3px solid rgba(124,92,252,0.3)', borderTopColor:'#7c5cfc', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px'}}/>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', color:'#a48bff'}}>Chargement des stats...</div>
          </div>
        ) : error ? (
          <div style={{background:'rgba(239,71,111,0.1)', border:'2px solid rgba(239,71,111,0.25)', borderRadius:'14px', padding:'20px', color:'#ef476f', textAlign:'center'}}>{error}</div>
        ) : stats && (
          <>
            {/* KPIs principaux */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'20px'}}>
              {card('Inscrits total', stats.totalUsers, '#a48bff')}
              {card('Premium actifs', stats.premium, '#06d6a0', `Taux : ${stats.conversionRate}%`)}
              {card('MRR', stats.mrr+'€', '#ffd166', 'par mois')}
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'20px'}}>
              {card("Inscrits aujourd'hui", stats.usersToday, '#ff6b9d')}
              {card('Inscrits cette semaine', stats.usersWeek, '#7c5cfc')}
              {card('ARR estimé', Math.round(stats.mrr*12)+'€', '#06d6a0', 'annualisé')}
            </div>

            {/* Répartition par classe */}
            {Object.keys(stats.classeStats).length > 0 && (
              <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px', marginBottom:'20px'}}>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'16px'}}>🎓 Répartition par classe</div>
                <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
                  {Object.entries(stats.classeStats).sort((a:any,b:any)=>b[1]-a[1]).map(([classe, count]:any)=>(
                    <div key={classe} style={{background:'rgba(124,92,252,0.1)', border:'2px solid rgba(124,92,252,0.25)', borderRadius:'100px', padding:'6px 16px', display:'flex', alignItems:'center', gap:'8px'}}>
                      <span style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.9rem', fontWeight:700, color:'#a48bff'}}>{classe}</span>
                      <span style={{background:'rgba(124,92,252,0.2)', borderRadius:'100px', padding:'2px 8px', fontSize:'0.72rem', fontWeight:800, color:'#a48bff'}}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Derniers inscrits */}
            <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'16px'}}>👥 Derniers inscrits</div>
              {stats.recentUsers.length === 0 ? (
                <div style={{textAlign:'center', padding:'20px', color:'#8e8cb0', fontSize:'0.86rem', fontWeight:600}}>Aucun inscrit pour le moment</div>
              ) : (
                stats.recentUsers.map((u:any, i:number) => (
                  <div key={i} style={{display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom:i<stats.recentUsers.length-1?'1px solid rgba(255,255,255,0.04)':'none'}}>
                    <div style={{width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:'white', flexShrink:0}}>
                      {(u.nom||'?')[0].toUpperCase()}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'0.86rem', fontWeight:800}}>{u.nom || 'Anonyme'}</div>
                      <div style={{fontSize:'0.72rem', color:'#8e8cb0', fontWeight:600}}>{u.email}</div>
                    </div>
                    <div style={{fontSize:'0.72rem', fontWeight:700, color:'#8e8cb0'}}>{u.classe || '—'}</div>
                    <div style={{flexShrink:0}}>
                      {u.plan_active ? (
                        <span style={{background:'rgba(6,214,160,0.1)', border:'1px solid rgba(6,214,160,0.25)', color:'#06d6a0', fontSize:'0.65rem', fontWeight:800, padding:'3px 8px', borderRadius:'100px'}}>⭐ {u.plan}</span>
                      ) : (
                        <span style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#8e8cb0', fontSize:'0.65rem', fontWeight:800, padding:'3px 8px', borderRadius:'100px'}}>Gratuit</span>
                      )}
                    </div>
                    <div style={{fontSize:'0.68rem', color:'#8e8cb0', fontWeight:600, flexShrink:0}}>
                      {new Date(u.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
