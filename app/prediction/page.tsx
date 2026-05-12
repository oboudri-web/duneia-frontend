'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

export default function Prediction() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('duneia_user')
    if(!u) { router.push('/auth'); return }
    setUser(JSON.parse(u))
    const saved = localStorage.getItem('duneia_notes')
    if(saved) {
      const parsed = JSON.parse(saved)
      const all = Object.values(parsed).flat() as any[]
      setNotes(all.filter((n:any)=>n.matiere&&n.note))
    }
  }, [])

  async function predire() {
    setLoading(true)
    try {
      const token = localStorage.getItem('duneia_token')
      const r = await fetch(BACKEND+'/api/ai/prediction', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({notes, classe:user?.classe, trimestre:'T1'})
      })
      const d = await r.json()
      if(d.success) setPrediction(d.prediction)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const tendanceColor = (t:string) => t==='hausse'?'#06d6a0':t==='baisse'?'#ef476f':'#ffd166'
  const tendanceIcon = (t:string) => t==='hausse'?'📈':t==='baisse'?'📉':'➡️'

  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'50px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>router.push('/app')} style={{background:'rgba(255,255,255,0.06)', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← App</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>🎓 DuneIA</div>
        <div style={{marginLeft:'auto', fontSize:'0.78rem', fontWeight:800, color:'#ff6b9d'}}>📈 Prédiction</div>
      </nav>

      <div style={{maxWidth:'680px', margin:'0 auto', padding:'20px 16px'}}>
        {notes.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px 20px'}}>
            <div style={{fontSize:'3rem', marginBottom:'16px'}}>📊</div>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700, marginBottom:'8px'}}>Aucune note trouvée</div>
            <p style={{fontSize:'0.84rem', color:'#8e8cb0', fontWeight:600, marginBottom:'20px'}}>Connecte ton Pronote ou saisis tes notes pour obtenir ta prédiction.</p>
            <button onClick={()=>router.push('/app')} style={{padding:'12px 24px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.92rem', cursor:'pointer'}}>Retour</button>
          </div>
        ) : !prediction ? (
          <div>
            <div style={{textAlign:'center', marginBottom:'28px'}}>
              <div style={{fontSize:'2.5rem', marginBottom:'12px'}}>🔮</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.3rem', fontWeight:700, marginBottom:'8px'}}>Prediction de notes</div>
              <p style={{fontSize:'0.84rem', color:'#8e8cb0', fontWeight:600}}>L IA analyse tes {notes.length} notes et predit ton evolution</p>
            </div>
            <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px', marginBottom:'20px'}}>
              {notes.map((n,i)=>{
                const v = parseFloat(n.note)
                const col = v>=14?'#06d6a0':v>=10?'#ffd166':'#ef476f'
                return (
                  <div key={i} style={{display:'flex', alignItems:'center', gap:'12px', padding:'8px 0', borderBottom:i<notes.length-1?'1px solid rgba(255,255,255,0.04)':'none'}}>
                    <div style={{flex:1, fontSize:'0.84rem', fontWeight:700}}>{n.matiere}</div>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, color:col}}>{n.note}/20</div>
                  </div>
                )
              })}
            </div>
            <button onClick={predire} disabled={loading} style={{padding:'14px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.95rem', cursor:'pointer', width:'100%', opacity:loading?0.7:1}}>
              {loading ? 'Analyse en cours...' : 'Predire mes notes de fin annee'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{background:'linear-gradient(135deg,rgba(124,92,252,0.15),rgba(255,107,157,0.08))', border:'2px solid rgba(124,92,252,0.3)', borderRadius:'22px', padding:'28px', textAlign:'center', marginBottom:'16px'}}>
              <div style={{fontSize:'0.75rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px'}}>Moyenne prevue fin annee</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'4rem', fontWeight:700, color:tendanceColor(prediction.tendance), lineHeight:1}}>{prediction.moyenne_prevue_fin_annee}</div>
              <div style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:700, marginTop:'4px'}}>/20 {tendanceIcon(prediction.tendance)}</div>
              {prediction.brevet_estime && (
                <div style={{marginTop:'14px', background:'rgba(255,209,102,0.1)', border:'1px solid rgba(255,209,102,0.25)', borderRadius:'100px', padding:'6px 16px', display:'inline-block'}}>
                  <span style={{fontSize:'0.78rem', fontWeight:800, color:'#ffd166'}}>Brevet/Bac estime : {prediction.brevet_estime}/20</span>
                </div>
              )}
            </div>

            <div style={{background:'rgba(124,92,252,0.08)', border:'2px solid rgba(124,92,252,0.2)', borderRadius:'16px', padding:'18px', marginBottom:'16px'}}>
              <div style={{fontSize:'0.72rem', fontWeight:800, color:'#a48bff', marginBottom:'6px'}}>Conseil IA</div>
              <p style={{fontSize:'0.86rem', color:'#f0eeff', fontWeight:600, lineHeight:1.7, margin:0}}>{prediction.conseil_global}</p>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px'}}>
              {prediction.risques?.length > 0 && (
                <div style={{background:'rgba(239,71,111,0.06)', border:'2px solid rgba(239,71,111,0.2)', borderRadius:'14px', padding:'14px'}}>
                  <div style={{fontSize:'0.75rem', fontWeight:800, color:'#ef476f', marginBottom:'8px'}}>Risques</div>
                  {prediction.risques.map((r:string,i:number)=>(
                    <div key={i} style={{fontSize:'0.78rem', fontWeight:600, color:'#f0eeff', marginBottom:'4px'}}>{r}</div>
                  ))}
                </div>
              )}
              {prediction.opportunites?.length > 0 && (
                <div style={{background:'rgba(6,214,160,0.06)', border:'2px solid rgba(6,214,160,0.2)', borderRadius:'14px', padding:'14px'}}>
                  <div style={{fontSize:'0.75rem', fontWeight:800, color:'#06d6a0', marginBottom:'8px'}}>Opportunites</div>
                  {prediction.opportunites.map((o:string,i:number)=>(
                    <div key={i} style={{fontSize:'0.78rem', fontWeight:600, color:'#f0eeff', marginBottom:'4px'}}>{o}</div>
                  ))}
                </div>
              )}
            </div>

            <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px', marginBottom:'16px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'14px'}}>Predictions par matiere</div>
              {prediction.predictions?.map((p:any,i:number)=>(
                <div key={i} style={{padding:'12px 0', borderBottom:i<prediction.predictions.length-1?'1px solid rgba(255,255,255,0.04)':'none'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px'}}>
                    <div style={{flex:1, fontSize:'0.84rem', fontWeight:700}}>{p.matiere}</div>
                    <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                      <span style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:600}}>{p.note_actuelle}</span>
                      <span style={{fontSize:'0.72rem', color:'#8e8cb0'}}>to</span>
                      <span style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, color:tendanceColor(p.tendance)}}>{p.note_prevue}</span>
                      <span>{tendanceIcon(p.tendance)}</span>
                    </div>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <div style={{flex:1, height:'4px', background:'#1c1a2e', borderRadius:'100px', overflow:'hidden'}}>
                      <div style={{height:'100%', background:tendanceColor(p.tendance), width:`${p.confiance}%`, borderRadius:'100px'}}/>
                    </div>
                    <span style={{fontSize:'0.68rem', color:'#8e8cb0', fontWeight:700}}>{p.confiance}%</span>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={()=>setPrediction(null)} style={{padding:'12px', borderRadius:'12px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.88rem', cursor:'pointer', width:'100%'}}>
              Recalculer
            </button>
          </div>
        )}
      </div>
      <BottomNav active="app"/>
    </div>
  )
}
