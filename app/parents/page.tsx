'use client'
import BottomNav from '../../components/BottomNav'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

export default function Parents() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [activeChild, setActiveChild] = useState(0)

  const children = [
    { nom: 'Lucas', classe: '3ème', avatar: '🧑‍🎓', xp: 350, streak: 5, plan: 'premium' },
    { nom: 'Emma', classe: '5ème', avatar: '👩‍🎓', xp: 120, streak: 2, plan: 'gratuit' },
  ]

  useEffect(() => {
    const u = localStorage.getItem('duneia_user')
    if(!u) { router.push('/auth'); return }
    setUser(JSON.parse(u))
    const savedNotes = localStorage.getItem('duneia_notes')
    if(savedNotes) {
      const parsed = JSON.parse(savedNotes)
      const allNotes = Object.values(parsed).flat() as any[]
      setNotes(allNotes.filter((n:any) => n.matiere && n.note))
    }
  }, [])

  const moy = notes.length ? (notes.reduce((s,n)=>s+parseFloat(n.note),0)/notes.length).toFixed(1) : '—'
  const moyColor = moy !== '—' ? parseFloat(moy)>=14?'#06d6a0':parseFloat(moy)>=10?'#ffd166':'#ef476f' : '#8e8cb0'
  const faibles = notes.filter(n=>parseFloat(n.note)<10)
  const bonnes = notes.filter(n=>parseFloat(n.note)>=14)

  const alertes = [
    faibles.length > 0 && { type:'danger', icon:'⚠️', msg: `${faibles.length} matière${faibles.length>1?'s':''} en difficulté : ${faibles.map(n=>n.matiere).join(', ')}` },
    notes.length === 0 && { type:'info', icon:'📊', msg: 'Aucune note synchronisée — connecter Pronote' },
    bonnes.length > 0 && { type:'success', icon:'🌟', msg: `Excellent en ${bonnes.map(n=>n.matiere).join(', ')}` },
  ].filter(Boolean) as any[]

  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.95)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'50px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>router.push('/app')} style={{background:'transparent', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← App</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>🎓 DuneIA</div>
        <div style={{marginLeft:'auto', fontSize:'0.78rem', fontWeight:700, color:'#a48bff'}}>👨‍👩‍👧 Parents</div>
      </nav>

      <div style={{maxWidth:'600px', margin:'0 auto', padding:'20px 16px'}}>

        {/* Sélecteur enfants */}
        <div style={{display:'flex', gap:'10px', marginBottom:'16px', overflowX:'auto'}}>
          {children.map((child, i) => (
            <div key={i} onClick={()=>setActiveChild(i)} style={{
              flexShrink:0, display:'flex', alignItems:'center', gap:'10px',
              padding:'12px 16px', borderRadius:'14px', cursor:'pointer',
              background: activeChild===i ? 'rgba(124,92,252,0.12)' : '#131120',
              border: `2px solid ${activeChild===i ? 'rgba(124,92,252,0.4)' : '#2a2740'}`,
              transition:'all 0.2s'
            }}>
              <div style={{width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem'}}>{child.avatar}</div>
              <div>
                <div style={{fontWeight:800, fontSize:'0.86rem'}}>{child.nom}</div>
                <div style={{fontSize:'0.7rem', color:'#8e8cb0', fontWeight:700}}>{child.classe}</div>
              </div>
            </div>
          ))}
          <div style={{flexShrink:0, display:'flex', alignItems:'center', gap:'8px', padding:'12px 16px', borderRadius:'14px', cursor:'pointer', background:'transparent', border:'2px dashed rgba(124,92,252,0.3)'}}>
            <div style={{fontSize:'1.2rem'}}>➕</div>
            <div style={{fontSize:'0.78rem', fontWeight:800, color:'#a48bff'}}>Ajouter</div>
          </div>
        </div>

        {/* Stats enfant actif */}
        <div style={{background:'linear-gradient(135deg,rgba(124,92,252,0.15),rgba(255,107,157,0.08))', border:'2px solid rgba(124,92,252,0.3)', borderRadius:'22px', padding:'24px', marginBottom:'16px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px'}}>
            <div style={{width:'56px', height:'56px', borderRadius:'16px', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem'}}>{children[activeChild].avatar}</div>
            <div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700}}>{children[activeChild].nom}</div>
              <div style={{fontSize:'0.78rem', color:'#8e8cb0', fontWeight:700}}>{children[activeChild].classe} · {children[activeChild].plan === 'premium' ? '⭐ Premium' : '🆓 Gratuit'}</div>
            </div>
            <div style={{marginLeft:'auto', textAlign:'right'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.8rem', fontWeight:700, color:moyColor}}>{moy}</div>
              <div style={{fontSize:'0.7rem', color:'#8e8cb0', fontWeight:700}}>/20 moy.</div>
            </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px'}}>
            {[
              {v:children[activeChild].xp, l:'XP', c:'#ffd166'},
              {v:children[activeChild].streak+'j', l:'Streak', c:'#ff9f1c'},
              {v:notes.length, l:'Matières', c:'#a48bff'},
            ].map((s,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,0.05)', borderRadius:'12px', padding:'12px', textAlign:'center'}}>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.3rem', fontWeight:700, color:s.c}}>{s.v}</div>
                <div style={{fontSize:'0.65rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase'}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertes */}
        {alertes.length > 0 && (
          <div style={{marginBottom:'16px'}}>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'10px'}}>🔔 Alertes</div>
            {alertes.map((a,i)=>(
              <div key={i} style={{
                display:'flex', alignItems:'flex-start', gap:'10px', padding:'12px 14px',
                borderRadius:'12px', marginBottom:'8px',
                background: a.type==='danger'?'rgba(239,71,111,0.08)':a.type==='success'?'rgba(6,214,160,0.08)':'rgba(124,92,252,0.08)',
                border: `2px solid ${a.type==='danger'?'rgba(239,71,111,0.25)':a.type==='success'?'rgba(6,214,160,0.25)':'rgba(124,92,252,0.25)'}`
              }}>
                <div style={{fontSize:'1.1rem'}}>{a.icon}</div>
                <div style={{fontSize:'0.82rem', fontWeight:700, lineHeight:1.5}}>{a.msg}</div>
              </div>
            ))}
          </div>
        )}

        {/* Notes détaillées */}
        {notes.length > 0 && (
          <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px', marginBottom:'16px'}}>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'14px'}}>📊 Notes du trimestre</div>
            {[...notes].sort((a,b)=>parseFloat(a.note)-parseFloat(b.note)).map((n,i)=>{
              const v = parseFloat(n.note)
              const col = v>=14?'#06d6a0':v>=10?'#ffd166':'#ef476f'
              return (
                <div key={i} style={{display:'flex', alignItems:'center', gap:'12px', padding:'9px 0', borderBottom:i<notes.length-1?'1px solid rgba(255,255,255,0.04)':'none'}}>
                  <div style={{flex:1, fontSize:'0.84rem', fontWeight:700}}>{n.matiere}</div>
                  <div style={{height:'5px', width:'80px', background:'#1c1a2e', borderRadius:'100px', overflow:'hidden'}}>
                    <div style={{height:'100%', background:col, width:Math.round(v/20*100)+'%', borderRadius:'100px'}}/>
                  </div>
                  <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.92rem', fontWeight:700, color:col, minWidth:'40px', textAlign:'right'}}>{n.note}</div>
                </div>
              )
            })}
          </div>
        )}

        {/* Actions parents */}
        <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px', marginBottom:'16px'}}>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'14px'}}>⚙️ Actions</div>
          {[
            {icon:'📧', label:'Envoyer le rapport par email', action:()=>alert('Rapport envoyé !')},
            {icon:'🔗', label:'Connecter Pronote de mon enfant', action:()=>router.push('/onboarding')},
            {icon:'📊', label:'Voir l\'analyse IA complète', action:()=>router.push('/analyse')},
            {icon:'⭐', label:'Passer en Premium', action:()=>router.push('/paiement')},
          ].map((item,i)=>(
            <div key={i} onClick={item.action} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:i<3?'1px solid rgba(255,255,255,0.04)':'none', cursor:'pointer'}}>
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <span style={{fontSize:'1.1rem'}}>{item.icon}</span>
                <span style={{fontSize:'0.84rem', fontWeight:700}}>{item.label}</span>
              </div>
              <span style={{color:'#8e8cb0'}}>→</span>
            </div>
          ))}
        </div>

        {/* Rapport hebdo */}
        <div style={{background:'rgba(6,214,160,0.05)', border:'2px solid rgba(6,214,160,0.2)', borderRadius:'16px', padding:'18px', textAlign:'center'}}>
          <div style={{fontSize:'1.3rem', marginBottom:'8px'}}>📬</div>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, marginBottom:'6px'}}>Rapport hebdomadaire</div>
          <p style={{fontSize:'0.78rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.6, marginBottom:'12px'}}>Reçois chaque dimanche un résumé de la semaine de {children[activeChild].nom} par email.</p>
          <button style={{padding:'10px 20px', borderRadius:'11px', border:'none', background:'linear-gradient(135deg,#06d6a0,#00a8b5)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.85rem', cursor:'pointer'}}>
            ✅ Activer le rapport
          </button>
        </div>

      </div>
      <BottomNav active="parents" />
    </div>
  )
}
