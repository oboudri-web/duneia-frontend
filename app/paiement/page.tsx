'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

export default function Paiement() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<'premium'|'famille'>('premium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const u = localStorage.getItem('duneia_user')
    if(!u) { router.push('/auth'); return }
    setUser(JSON.parse(u))
  }, [])

  async function startPaiement() {
    const token = localStorage.getItem('duneia_token')
    if(!token) { router.push('/auth'); return }
    setLoading(true); setError('')
    try {
      const r = await fetch(BACKEND+'/api/paiement/create', {
        method: 'POST',
        headers: {'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({ plan: selectedPlan })
      })
      const d = await r.json()
      if(!r.ok) throw new Error(d.error || 'Erreur paiement')
      window.location.href = d.checkoutUrl
    } catch(e:any) {
      setError(e.message)
      setLoading(false)
    }
  }

  const plans = {
    annuel: {
      icon: '🔥',
      name: 'Premium Annuel',
      price: '79€',
      period: '/an',
      color: '#ffd166',
      border: 'rgba(255,209,102,0.5)',
      bg: 'linear-gradient(135deg,rgba(255,209,102,0.15),rgba(255,159,28,0.08))',
      badge: '2 MOIS OFFERTS',
      features: [
        'Tout le plan Premium inclus',
        '6,58€/mois seulement',
        'Economise 41€ vs mensuel',
        'Accès 12 mois sans interruption',
        'Badge exclusif annuel',
      ],
      mollie_id: 'annuel'
    },
    premium: {
      icon: '⭐',
      name: 'Premium',
      price: '9,99€',
      period: '/mois',
      color: '#a48bff',
      border: 'rgba(124,92,252,0.5)',
      bg: 'linear-gradient(135deg,rgba(124,92,252,0.15),rgba(255,107,157,0.08))',
      features: [
        'Sync Pronote tous trimestres',
        'Analyse complète du compte',
        'Plan IA 3 semaines détaillé',
        'Tuteur IA illimité 24h/24',
        'Annales IA + correction',
        'Prédiction de notes',
        'Entraînement oral IA',
        'ADN scolaire + Scanner copie',
        'Dashboard parents inclus',
        'Import cours illimité',
      ]
    },
    famille: {
      icon: '👨‍👩‍👧',
      name: 'Famille',
      price: '14,99€',
      period: '/mois',
      color: '#ffd166',
      border: 'rgba(255,209,102,0.4)',
      bg: 'linear-gradient(135deg,rgba(255,209,102,0.1),rgba(255,159,28,0.06))',
      features: [
        'Tout le plan Premium',
        '3 profils élèves indépendants',
        'Sync Pronote pour chaque enfant',
        'Dashboard parents unifié',
        'Alertes décrochage temps réel',
        'Rapport email hebdomadaire',
        'Messagerie parent ↔ enfant',
        'Support prioritaire',
      ]
    }
  }

  const plan = plans[selectedPlan]

  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1, display:'flex', flexDirection:'column'}}>
      {/* NAV */}
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.95)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'50px', paddingLeft:'24px', paddingRight:'24px', paddingBottom:'14px', display:'flex', alignItems:'center', gap:'14px'}}>
        <button onClick={()=>router.back()} style={{background:'transparent', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← Retour</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>🎓 DuneIA</div>
        <div style={{marginLeft:'auto', fontSize:'0.78rem', fontWeight:700, color:'#8e8cb0'}}>🔒 Paiement sécurisé</div>
      </nav>

      <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px'}}>
        <div style={{width:'100%', maxWidth:'520px'}}>

          {/* Header */}
          <div style={{textAlign:'center', marginBottom:'28px'}}>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.8rem', fontWeight:700, marginBottom:'8px'}}>
              Passe à la vitesse supérieure 🚀
            </div>
            <p style={{fontSize:'0.88rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.6}}>
              Sans engagement · Résiliable à tout moment · Satisfait ou remboursé 14j
            </p>
          </div>

          {/* Plan selector */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'20px'}}>
            {/* Plan annuel en premier */}
            <div style={{gridColumn:'1/-1', position:'relative'}}>
              {(()=>{ const pa = plans['annuel']; const sel = selectedPlan==='annuel'; return (
              <div onClick={()=>setSelectedPlan('annuel')} style={{
                padding:'16px', borderRadius:'16px', cursor:'pointer', textAlign:'center',
                border:'2px solid ' + (sel ? pa.border : 'rgba(255,209,102,0.3)'),
                background: sel ? pa.bg : 'rgba(255,209,102,0.05)',
                transition:'all 0.2s'
              }}>
                <div style={{position:'absolute', top:'-11px', left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#ffd166,#ff9f1c)', borderRadius:'100px', padding:'3px 14px', fontSize:'0.7rem', fontWeight:900, color:'#0a0914', whiteSpace:'nowrap'}}>🔥 2 MOIS OFFERTS</div>
                <div style={{fontSize:'1.6rem', marginBottom:'6px'}}>{pa.icon}</div>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:sel?pa.color:'#ffd166'}}>{pa.name}</div>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.4rem', fontWeight:700, marginTop:'4px', color:sel?pa.color:'#ffd166'}}>
                  {pa.price}<span style={{fontSize:'0.75rem', fontWeight:700, color:'#8e8cb0'}}>{pa.period}</span>
                </div>
                <div style={{fontSize:'0.72rem', color:'#8e8cb0', fontWeight:700, marginTop:'4px'}}>6,58€/mois · économise 41€</div>
              </div>
              )}})()}
            </div>
            {(['premium','famille'] as const).map(p=>(
              <div key={p} onClick={()=>setSelectedPlan(p)} style={{
                padding:'16px', borderRadius:'16px', cursor:'pointer', textAlign:'center',
                border:`2px solid ${selectedPlan===p ? plans[p].border : '#2a2740'}`,
                background: selectedPlan===p ? plans[p].bg : 'transparent',
                transition:'all 0.2s'
              }}>
                <div style={{fontSize:'1.6rem', marginBottom:'6px'}}>{plans[p].icon}</div>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:selectedPlan===p?plans[p].color:'#f0eeff'}}>{plans[p].name}</div>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.4rem', fontWeight:700, marginTop:'4px', color:selectedPlan===p?plans[p].color:'#8e8cb0'}}>
                  {plans[p].price}<span style={{fontSize:'0.75rem', fontWeight:700, color:'#8e8cb0'}}>{plans[p].period}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div style={{background:'#131120', border:`2px solid ${plan.border}`, borderRadius:'18px', padding:'20px', marginBottom:'18px'}}>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'14px', color:plan.color}}>
              {plan.icon} {plan.name} — inclus
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'7px'}}>
              {plan.features.map((f,i)=>(
                <div key={i} style={{display:'flex', alignItems:'flex-start', gap:'6px', fontSize:'0.78rem', fontWeight:700}}>
                  <span style={{color:'#06d6a0', flexShrink:0}}>✅</span>
                  <span style={{color:'#f0eeff', lineHeight:1.4}}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Garanties */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'18px'}}>
            {[
              {icon:'🔒', label:'Paiement sécurisé', sub:'Mollie · SSL'},
              {icon:'↩️', label:'Remboursé 14j', sub:'Sans question'},
              {icon:'❌', label:'Sans engagement', sub:'Résilie quand tu veux'},
            ].map((g,i)=>(
              <div key={i} style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'12px', padding:'12px', textAlign:'center'}}>
                <div style={{fontSize:'1.2rem', marginBottom:'4px'}}>{g.icon}</div>
                <div style={{fontSize:'0.68rem', fontWeight:800, color:'#f0eeff', lineHeight:1.3}}>{g.label}</div>
                <div style={{fontSize:'0.62rem', color:'#8e8cb0', fontWeight:600, marginTop:'2px'}}>{g.sub}</div>
              </div>
            ))}
          </div>

          {error && (
            <div style={{background:'rgba(239,71,111,0.1)', border:'2px solid rgba(239,71,111,0.25)', borderRadius:'11px', padding:'12px', color:'#ef476f', fontSize:'0.82rem', fontWeight:700, marginBottom:'14px', textAlign:'center'}}>
              ❌ {error}
            </div>
          )}

          {/* CTA */}
          <button onClick={startPaiement} disabled={loading} style={{
            width:'100%', padding:'16px', borderRadius:'14px', border:'none',
            background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white',
            fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'1.05rem',
            cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1,
            boxShadow:'0 6px 28px rgba(124,92,252,0.4)', marginBottom:'12px',
            display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'
          }}>
            {loading ? (
              <>
                <div style={{width:'18px', height:'18px', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.7s linear infinite'}}/>
                Redirection vers le paiement...
              </>
            ) : (
              <>🔐 Payer {plan.price}/mois — {plan.name}</>
            )}
          </button>

          <div style={{textAlign:'center', fontSize:'0.75rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.6}}>
            En cliquant tu acceptes nos <span style={{color:'#a48bff', cursor:'pointer'}}>CGV</span> et notre <span style={{color:'#a48bff', cursor:'pointer'}}>politique de confidentialité</span>.<br/>
            Paiement traité par <strong style={{color:'#f0eeff'}}>Mollie</strong> — DuneIA ne stocke pas tes données bancaires.
          </div>
        </div>
      </div>
    </div>
  )
}
