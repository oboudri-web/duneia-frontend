'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

export default function Analyse() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [analyse, setAnalyse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState<any[]>([])

  useEffect(() => {
    const u = localStorage.getItem('duneia_user')
    if(!u) { router.push('/auth'); return }
    setUser(JSON.parse(u))
    const savedNotes = localStorage.getItem('duneia_notes')
    if(savedNotes) {
      const parsed = JSON.parse(savedNotes)
      const allNotes = Object.values(parsed).flat() as any[]
      const validNotes = allNotes.filter((n:any) => n.matiere && n.note)
      setNotes(validNotes)
      if(validNotes.length > 0) {
        genAnalyse(validNotes, JSON.parse(u))
      } else {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  async function genAnalyse(notesData: any[], userData: any) {
    const token = localStorage.getItem('duneia_token')
    try {
      const r = await fetch(BACKEND+'/api/ai/analyse-pronote', {
        method: 'POST',
        headers: {'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({
          notes: notesData,
          classe: userData.classe,
          trimestre: 'T1'
        })
      })
      const d = await r.json()
      if(d.success) setAnalyse(d.analyse)
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const moy = notes.length ? (notes.reduce((s:number,n:any)=>s+parseFloat(n.note),0)/notes.length).toFixed(1) : null
  const moyColor = moy ? parseFloat(moy)>=14?'#06d6a0':parseFloat(moy)>=10?'#ffd166':'#ef476f' : '#8e8cb0'

  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.95)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', padding:'12px 16px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>router.push('/app')} style={{background:'transparent', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← App</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>🎓 DuneIA</div>
        <div style={{marginLeft:'auto', fontSize:'0.78rem', fontWeight:700, color:'#8e8cb0'}}>🧠 Analyse IA</div>
      </nav>

      <div style={{maxWidth:'600px', margin:'0 auto', padding:'20px 16px'}}>

        {loading ? (
          <div style={{textAlign:'center', padding:'60px 20px'}}>
            <div style={{width:'50px', height:'50px', border:'3px solid rgba(124,92,252,0.3)', borderTopColor:'#7c5cfc', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 20px'}}/>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700, marginBottom:'8px'}}>L'IA analyse ton bulletin...</div>
            <div style={{fontSize:'0.84rem', color:'#8e8cb0', fontWeight:600}}>Croisement des notes et appréciations</div>
          </div>
        ) : notes.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px 20px'}}>
            <div style={{fontSize:'3rem', marginBottom:'16px'}}>📊</div>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700, marginBottom:'8px'}}>Aucune note trouvée</div>
            <p style={{fontSize:'0.84rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7, marginBottom:'20px'}}>Connecte ton Pronote ou saisis tes notes manuellement pour obtenir ton analyse.</p>
            <button onClick={()=>router.push('/app')} style={{padding:'12px 24px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.92rem', cursor:'pointer'}}>← Retour à l'app</button>
          </div>
        ) : (
          <div>
            {/* Header moyenne */}
            <div style={{background:'linear-gradient(135deg,rgba(124,92,252,0.15),rgba(255,107,157,0.08))', border:'2px solid rgba(124,92,252,0.3)', borderRadius:'22px', padding:'28px', textAlign:'center', marginBottom:'16px'}}>
              <div style={{fontSize:'0.75rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px'}}>Moyenne générale</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'4rem', fontWeight:700, color:moyColor, lineHeight:1}}>{moy}</div>
              <div style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:700, marginTop:'4px'}}>/20 · {notes.length} matières analysées</div>
            </div>

            {/* Notes par matière */}
            <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px', marginBottom:'16px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'14px'}}>📊 Tes notes</div>
              {[...notes].sort((a,b)=>parseFloat(b.note)-parseFloat(a.note)).map((n:any,i:number)=>{
                const v = parseFloat(n.note)
                const col = v>=14?'#06d6a0':v>=10?'#ffd166':'#ef476f'
                const pct = Math.round(v/20*100)
                return (
                  <div key={i} style={{marginBottom:'12px'}}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'5px'}}>
                      <div style={{fontSize:'0.84rem', fontWeight:700}}>{n.matiere}</div>
                      <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, color:col}}>{n.note}/20</div>
                    </div>
                    <div style={{height:'6px', background:'#1c1a2e', borderRadius:'100px', overflow:'hidden'}}>
                      <div style={{height:'100%', background:col, borderRadius:'100px', width:pct+'%', transition:'width 1s'}}/>
                    </div>
                    {n.appreciation && <div style={{fontSize:'0.72rem', color:'#8e8cb0', fontWeight:600, marginTop:'4px', fontStyle:'italic'}}>"{n.appreciation}"</div>}
                  </div>
                )
              })}
            </div>

            {/* Analyse IA */}
            {analyse && (
              <>
                {/* Diagnostic */}
                <div style={{background:'#131120', border:'2px solid rgba(124,92,252,0.3)', borderRadius:'18px', padding:'20px', marginBottom:'16px'}}>
                  <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'10px', color:'#a48bff'}}>🔬 Diagnostic IA</div>
                  <p style={{fontSize:'0.84rem', color:'#f0eeff', fontWeight:600, lineHeight:1.7}}>{analyse.diagnostic}</p>
                </div>

                {/* Points forts + faibles */}
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px'}}>
                  <div style={{background:'rgba(6,214,160,0.06)', border:'2px solid rgba(6,214,160,0.25)', borderRadius:'16px', padding:'16px'}}>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.9rem', fontWeight:700, color:'#06d6a0', marginBottom:'10px'}}>✅ Points forts</div>
                    {(analyse.points_forts||[]).map((p:string,i:number)=>(
                      <div key={i} style={{fontSize:'0.78rem', fontWeight:600, color:'#f0eeff', lineHeight:1.5, marginBottom:'6px', paddingBottom:'6px', borderBottom:i<analyse.points_forts.length-1?'1px solid rgba(255,255,255,0.05)':'none'}}>👍 {p}</div>
                    ))}
                  </div>
                  <div style={{background:'rgba(239,71,111,0.06)', border:'2px solid rgba(239,71,111,0.25)', borderRadius:'16px', padding:'16px'}}>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.9rem', fontWeight:700, color:'#ef476f', marginBottom:'10px'}}>⚠️ À travailler</div>
                    {(analyse.points_faibles||[]).map((p:string,i:number)=>(
                      <div key={i} style={{fontSize:'0.78rem', fontWeight:600, color:'#f0eeff', lineHeight:1.5, marginBottom:'6px', paddingBottom:'6px', borderBottom:i<analyse.points_faibles.length-1?'1px solid rgba(255,255,255,0.05)':'none'}}>💪 {p}</div>
                    ))}
                  </div>
                </div>

                {/* Priorités */}
                <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px', marginBottom:'16px'}}>
                  <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'12px'}}>🎯 Priorités immédiates</div>
                  {(analyse.priorites||[]).map((p:string,i:number)=>(
                    <div key={i} style={{display:'flex', alignItems:'flex-start', gap:'10px', padding:'10px', background:'#1c1a2e', borderRadius:'11px', marginBottom:'8px'}}>
                      <div style={{width:'22px', height:'22px', borderRadius:'7px', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:900, color:'white', flexShrink:0}}>{i+1}</div>
                      <div style={{fontSize:'0.82rem', fontWeight:700, lineHeight:1.5}}>{p}</div>
                    </div>
                  ))}
                </div>

                {/* Plan semaine */}
                {analyse.plan_semaine && analyse.plan_semaine.length > 0 && (
                  <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px', marginBottom:'16px'}}>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'12px'}}>🗓️ Plan de cette semaine</div>
                    {analyse.plan_semaine.map((s:any,i:number)=>{
                      const colors = ['#ef476f','#ff9f1c','#ffd166','#06d6a0','#a48bff']
                      return (
                        <div key={i} style={{display:'flex', alignItems:'center', gap:'12px', padding:'11px', background:'#1c1a2e', borderRadius:'11px', marginBottom:'8px', borderLeft:`4px solid ${colors[i%colors.length]}`}}>
                          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.78rem', fontWeight:700, color:colors[i%colors.length], minWidth:'60px'}}>{s.jour}</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:'0.82rem', fontWeight:800}}>{s.matiere}</div>
                            <div style={{fontSize:'0.72rem', color:'#8e8cb0', fontWeight:600, marginTop:'2px'}}>{s.objectif}</div>
                          </div>
                          <div style={{fontSize:'0.7rem', fontWeight:800, color:'#8e8cb0'}}>⏱️ {s.duree}</div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Message motivation */}
                {analyse.message_motivation && (
                  <div style={{background:'linear-gradient(135deg,rgba(255,209,102,0.1),rgba(255,159,28,0.06))', border:'2px solid rgba(255,209,102,0.3)', borderRadius:'16px', padding:'20px', marginBottom:'16px', textAlign:'center'}}>
                    <div style={{fontSize:'1.5rem', marginBottom:'8px'}}>✨</div>
                    <p style={{fontSize:'0.86rem', fontWeight:700, color:'#ffd166', lineHeight:1.7}}>{analyse.message_motivation}</p>
                  </div>
                )}

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                  <button onClick={()=>router.push('/app?tab=3')} style={{padding:'12px', borderRadius:'12px', border:'2px solid #2a2740', background:'transparent', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.86rem', cursor:'pointer'}}>📚 Mon programme</button>
                  <button onClick={()=>router.push('/app')} style={{padding:'12px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.86rem', cursor:'pointer'}}>🚀 Voir l'app</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
