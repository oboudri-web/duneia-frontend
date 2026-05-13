'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

export default function Annales() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [matiere, setMatiere] = useState('Mathématiques')
  const [chapitre, setChapitre] = useState('')
  const [niveau, setNiveau] = useState('standard')
  const [exercice, setExercice] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showCorrection, setShowCorrection] = useState(false)
  const [reponses, setReponses] = useState<{[key:number]:string}>({})

  const matieres = ['Mathématiques','Français','Histoire-Géo','Physique-Chimie','SVT','Anglais','Philosophie','SES']

  useEffect(() => {
    const u = localStorage.getItem('duneia_user')
    if(!u) { router.push('/auth'); return }
    setUser(JSON.parse(u))
  }, [])

  async function generer() {
    setLoading(true)
    setExercice(null)
    setShowCorrection(false)
    setReponses({})
    try {
      const token = localStorage.getItem('duneia_token')
      const r = await fetch(BACKEND+'/api/ai/annales', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({matiere, classe:user?.classe, chapitre, niveau})
      })
      const d = await r.json()
      if(d.success) setExercice(d.exercice)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const btn = {padding:'10px 20px', borderRadius:'12px', border:'none', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.88rem'}

  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'54px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>router.push('/app')} style={{...btn, background:'rgba(255,255,255,0.06)', color:'#8e8cb0', padding:'6px 12px'}}>← App</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>🎓 DuneIA</div>
        <div style={{marginLeft:'auto', fontSize:'0.78rem', fontWeight:800, color:'#ffd166'}}>📚 Annales IA</div>
      </nav>

      <div style={{maxWidth:'680px', margin:'0 auto', padding:'20px 16px'}}>
        {!exercice ? (
          <div>
            <div style={{textAlign:'center', marginBottom:'28px'}}>
              <div style={{fontSize:'2.5rem', marginBottom:'12px'}}>📚</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.3rem', fontWeight:700, marginBottom:'8px'}}>Annales IA</div>
              <p style={{fontSize:'0.84rem', color:'#8e8cb0', fontWeight:600}}>
                {user?.classe?.includes('3') ? 'Exercices style Brevet des colleges' :
                 user?.classe?.includes('Terminale') ? 'Exercices style Baccalaureat' :
                 user?.classe?.includes('ère') || user?.classe?.includes('Première') ? 'Exercices style Bac 1ere' :
                 'Exercices style controle — programme officiel'}
              </p>
            </div>

            <div style={{display:'flex', flexDirection:'column', gap:'14px', marginBottom:'20px'}}>
              <div>
                <label style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:'6px'}}>Matière</label>
                <select value={matiere} onChange={e=>setMatiere(e.target.value)} style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:700, outline:'none'}}>
                  {matieres.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:'6px'}}>Chapitre (optionnel)</label>
                <input value={chapitre} onChange={e=>setChapitre(e.target.value)} placeholder="ex: Les fonctions, La Première Guerre mondiale..." style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:600, outline:'none', boxSizing:'border-box' as any}}/>
              </div>
              <div>
                <label style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:'6px'}}>Niveau</label>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px'}}>
                  {[{v:'facile',l:'🟢 Facile'},{v:'standard',l:'🟡 Standard'},{v:'difficile',l:'🔴 Difficile'}].map(n=>(
                    <button key={n.v} onClick={()=>setNiveau(n.v)} style={{...btn, background:niveau===n.v?'rgba(124,92,252,0.15)':'transparent', border:`2px solid ${niveau===n.v?'rgba(124,92,252,0.4)':'#2a2740'}`, color:niveau===n.v?'#a48bff':'#8e8cb0', padding:'10px'}}>
                      {n.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={generer} disabled={loading} style={{...btn, background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', width:'100%', padding:'14px', fontSize:'0.95rem', opacity:loading?0.7:1}}>
              {loading ? '⏳ Génération de l\'exercice...' : '📚 Générer un exercice'}
            </button>
          </div>
        ) : (
          <div>
            {/* Header exercice */}
            <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px', marginBottom:'16px'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px'}}>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:'#ffd166'}}>{exercice.titre}</div>
                <div style={{display:'flex', gap:'8px'}}>
                  <span style={{background:'rgba(124,92,252,0.1)', border:'1px solid rgba(124,92,252,0.25)', color:'#a48bff', fontSize:'0.7rem', fontWeight:800, padding:'3px 8px', borderRadius:'100px'}}>⏱️ {exercice.duree}</span>
                  <span style={{background:'rgba(255,209,102,0.1)', border:'1px solid rgba(255,209,102,0.25)', color:'#ffd166', fontSize:'0.7rem', fontWeight:800, padding:'3px 8px', borderRadius:'100px'}}>/{exercice.bareme} pts</span>
                </div>
              </div>
              <p style={{fontSize:'0.84rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7, margin:0}}>{exercice.enonce}</p>
            </div>

            {/* Questions */}
            {exercice.questions?.map((q:any, i:number)=>(
              <div key={i} style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'16px', padding:'18px', marginBottom:'12px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px'}}>
                  <div style={{width:'28px', height:'28px', borderRadius:'8px', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Fredoka,sans-serif', fontSize:'0.85rem', fontWeight:700, color:'white', flexShrink:0}}>{q.id}</div>
                  <div style={{flex:1, fontSize:'0.86rem', fontWeight:700, lineHeight:1.5}}>{q.question}</div>
                  <span style={{fontSize:'0.7rem', fontWeight:800, color:'#8e8cb0', flexShrink:0}}>{q.points} pts</span>
                </div>
                {q.indice && !showCorrection && (
                  <div style={{background:'rgba(255,209,102,0.06)', border:'1px solid rgba(255,209,102,0.2)', borderRadius:'8px', padding:'8px 12px', marginBottom:'10px', fontSize:'0.76rem', color:'#ffd166', fontWeight:700}}>
                    💡 Indice : {q.indice}
                  </div>
                )}
                <textarea
                  value={reponses[q.id]||''}
                  onChange={e=>setReponses(r=>({...r,[q.id]:e.target.value}))}
                  placeholder="Écris ta réponse ici..."
                  rows={3}
                  style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.85rem', fontWeight:600, outline:'none', resize:'vertical', boxSizing:'border-box' as any}}
                />
                {showCorrection && exercice.correction?.[i] && (
                  <div style={{background:'rgba(6,214,160,0.06)', border:'2px solid rgba(6,214,160,0.25)', borderRadius:'12px', padding:'14px', marginTop:'10px'}}>
                    <div style={{fontSize:'0.72rem', fontWeight:800, color:'#06d6a0', marginBottom:'6px'}}>✅ Correction</div>
                    <p style={{fontSize:'0.82rem', color:'#f0eeff', fontWeight:600, lineHeight:1.7, margin:'0 0 8px'}}>{exercice.correction[i].reponse}</p>
                    <div style={{fontSize:'0.75rem', color:'#8e8cb0', fontWeight:600, fontStyle:'italic'}}>Méthode : {exercice.correction[i].methode}</div>
                  </div>
                )}
              </div>
            ))}

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'8px'}}>
              <button onClick={()=>setExercice(null)} style={{...btn, background:'rgba(124,92,252,0.1)', color:'#a48bff', border:'2px solid rgba(124,92,252,0.3)', padding:'12px'}}>
                🔄 Nouvel exercice
              </button>
              <button onClick={()=>setShowCorrection(s=>!s)} style={{...btn, background:showCorrection?'rgba(6,214,160,0.1)':'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:showCorrection?'#06d6a0':'white', border:showCorrection?'2px solid rgba(6,214,160,0.3)':'none', padding:'12px'}}>
                {showCorrection ? '🙈 Cacher correction' : '✅ Voir la correction'}
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomNav active="app"/>
    </div>
  )
}
