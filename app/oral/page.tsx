'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

export default function OralIA() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [matiere, setMatiere] = useState('Histoire-Géo')
  const [sujet, setSujet] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [note, setNote] = useState<any>(null)

  const matieres = ['Histoire-Géo','Français','Philosophie','Anglais','Espagnol','SVT','Physique-Chimie','SES']

  useEffect(() => {
    const u = localStorage.getItem('duneia_user')
    if(!u) { router.push('/auth'); return }
    setUser(JSON.parse(u))
  }, [])

  async function commencer() {
    setStarted(true)
    setMessages([])
    setNote(null)
    setLoading(true)
    try {
      const token = localStorage.getItem('duneia_token')
      const r = await fetch(BACKEND+'/api/ai/tuteur', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({
          question: `Commence l'interrogation orale sur le sujet suivant : ${sujet || matiere}. Presente-toi comme un examinateur et pose la premiere question.`,
          matiere,
          classe: user?.classe,
          historique: [],
        })
      })
      const d = await r.json()
      if(d.success) setMessages([{role:'assistant', content:d.reponse, isExaminateur:true}])
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function repondre() {
    if(!input.trim()||loading) return
    const userMsg = {role:'user', content:input}
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    try {
      const token = localStorage.getItem('duneia_token')
      const systemPrompt = `Tu es un examinateur oral pour un eleve de ${user?.classe || 'lycee'}. Matiere: ${matiere}. Sujet: ${sujet || matiere}.

REGLES:
- Pose des questions progressives comme un vrai examinateur
- Rebondis sur les reponses de l'eleve
- Apres 5-6 echanges, donne une note sur 20 avec justification detaillee
- Format note: [NOTE: X/20 - Justification]
- Encourage et guide sans donner les reponses
- Style professionnel mais bienveillant`

      const r = await fetch(BACKEND+'/api/ai/tuteur', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({
          question: input,
          matiere,
          classe: user?.classe,
          historique: newMessages.slice(-8).map((m:any)=>({role:m.role, content:m.content}))
        })
      })
      const d = await r.json()
      if(d.success) {
        const reponse = d.reponse
        const noteMatch = reponse.match(/\[NOTE:\s*([\d.]+\/20)\s*-\s*([^\]]+)\]/)
        if(noteMatch) {
          setNote({note: noteMatch[1], justification: noteMatch[2]})
        }
        setMessages([...newMessages, {role:'assistant', content:reponse, isExaminateur:true}])
      }
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'50px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>started?setStarted(false):router.push('/app')} style={{background:'rgba(255,255,255,0.06)', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← {started?'Arreter':'App'}</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>DuneIA</div>
        <div style={{marginLeft:'auto', fontSize:'0.78rem', fontWeight:800, color:'#a48bff'}}>Oral IA</div>
      </nav>

      <div style={{maxWidth:'680px', margin:'0 auto', padding:'20px 16px'}}>
        {!started ? (
          <div>
            <div style={{textAlign:'center', marginBottom:'28px'}}>
              <div style={{fontSize:'2.5rem', marginBottom:'12px'}}>🎤</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.3rem', fontWeight:700, marginBottom:'8px'}}>Oral IA</div>
              <p style={{fontSize:'0.84rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7}}>Entraine-toi a l oral avec un examinateur IA. Reponds aux questions comme en vrai, recois une note et des conseils.</p>
            </div>

            <div style={{display:'flex', flexDirection:'column', gap:'14px', marginBottom:'20px'}}>
              <div>
                <label style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:'6px'}}>Matiere</label>
                <select value={matiere} onChange={e=>setMatiere(e.target.value)} style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:700, outline:'none'}}>
                  {matieres.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:'6px'}}>Sujet (optionnel)</label>
                <input value={sujet} onChange={e=>setSujet(e.target.value)} placeholder="ex: La Seconde Guerre mondiale, Les inegalites..." style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:600, outline:'none', boxSizing:'border-box' as any}}/>
              </div>
            </div>

            <div style={{background:'rgba(124,92,252,0.08)', border:'2px solid rgba(124,92,252,0.2)', borderRadius:'14px', padding:'16px', marginBottom:'20px'}}>
              {['L IA joue le role d un vrai examinateur','Questions progressives adaptees a ton niveau','Note sur 20 avec justification detaillee','Conseils pour progresser a l oral'].map((t,i)=>(
                <div key={i} style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:i<3?'8px':0, fontSize:'0.82rem', fontWeight:700}}>
                  <span style={{color:'#a48bff'}}>✓</span> {t}
                </div>
              ))}
            </div>

            <button onClick={commencer} style={{padding:'14px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.95rem', cursor:'pointer', width:'100%'}}>
              Commencer l oral
            </button>
          </div>
        ) : (
          <div>
            {note && (
              <div style={{background:'linear-gradient(135deg,rgba(255,209,102,0.15),rgba(255,159,28,0.08))', border:'2px solid rgba(255,209,102,0.3)', borderRadius:'18px', padding:'20px', marginBottom:'16px', textAlign:'center'}}>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'2rem', fontWeight:700, color:'#ffd166', marginBottom:'8px'}}>{note.note}</div>
                <p style={{fontSize:'0.84rem', color:'#f0eeff', fontWeight:600, lineHeight:1.7, margin:'0 0 12px'}}>{note.justification}</p>
                <button onClick={()=>{setStarted(false);setMessages([]);setNote(null)}} style={{padding:'10px 20px', borderRadius:'10px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.85rem', cursor:'pointer'}}>
                  Recommencer
                </button>
              </div>
            )}

            <div style={{display:'flex', flexDirection:'column', gap:'10px', marginBottom:'14px', maxHeight:'450px', overflowY:'auto'}}>
              {messages.map((m:any,i:number)=>(
                <div key={i} style={{display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                  <div style={{
                    maxWidth:'82%', padding:'12px 16px',
                    borderRadius:m.role==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px',
                    background:m.role==='user'?'linear-gradient(135deg,#7c5cfc,#ff6b9d)':'#131120',
                    border:m.role==='assistant'?'2px solid #2a2740':'none',
                    fontSize:'0.84rem', fontWeight:600, lineHeight:1.7, color:'#f0eeff'
                  }}>
                    {m.role==='assistant' && <div style={{fontSize:'0.7rem', fontWeight:800, color:'#ffd166', marginBottom:'4px'}}>Examinateur IA</div>}
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{display:'flex', justifyContent:'flex-start'}}>
                  <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px 18px 18px 4px', padding:'12px 16px'}}>
                    <div style={{display:'flex', gap:'4px'}}>
                      {[0,1,2].map(i=><div key={i} style={{width:'6px', height:'6px', borderRadius:'50%', background:'#ffd166', animation:`bounce 0.8s ${i*0.2}s infinite`}}/>)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!note && (
              <div style={{display:'flex', gap:'10px'}}>
                <input
                  value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&repondre()}
                  placeholder="Ta reponse..."
                  style={{flex:1, background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'12px', padding:'12px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:600, outline:'none'}}
                />
                <button onClick={repondre} disabled={loading||!input.trim()} style={{padding:'12px 20px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.88rem', cursor:'pointer', opacity:loading||!input.trim()?0.5:1}}>
                  Envoyer
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav active="app"/>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }`}</style>
    </div>
  )
}
