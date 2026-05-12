'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

export default function ADN() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [adn, setAdn] = useState<any>(null)
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
    const savedAdn = localStorage.getItem('duneia_adn')
    if(savedAdn) setAdn(JSON.parse(savedAdn))
  }, [])

  async function genererAdn() {
    setLoading(true)
    try {
      const token = localStorage.getItem('duneia_token')
      const r = await fetch(BACKEND+'/api/ai/analyse-pronote', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({
          notes,
          classe: user?.classe,
          trimestre: 'T1',
          mode: 'adn'
        })
      })
      const d = await r.json()
      if(d.success) {
        const adnData = {
          archetype: detectArchetype(notes),
          forces: d.analyse?.points_forts || [],
          faiblesses: d.analyse?.points_faibles || [],
          diagnostic: d.analyse?.diagnostic || '',
          message: d.analyse?.message_motivation || '',
          scores: computeScores(notes),
          generatedAt: new Date().toISOString()
        }
        setAdn(adnData)
        localStorage.setItem('duneia_adn', JSON.stringify(adnData))
      }
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  function detectArchetype(notes: any[]) {
    if(!notes.length) return {nom:'Explorateur', emoji:'🔭', desc:'Profil en cours de construction'}
    const moy = notes.reduce((s,n)=>s+parseFloat(n.note),0)/notes.length
    const sciences = notes.filter(n=>['Mathématiques','Physique-Chimie','SVT','NSI'].includes(n.matiere))
    const lettres = notes.filter(n=>['Français','Histoire-Géo','Philosophie','Anglais'].includes(n.matiere))
    const moySciences = sciences.length ? sciences.reduce((s,n)=>s+parseFloat(n.note),0)/sciences.length : 0
    const moyLettres = lettres.length ? lettres.reduce((s,n)=>s+parseFloat(n.note),0)/lettres.length : 0

    if(moy >= 15) return {nom:'Élite', emoji:'🏆', desc:'Excellence dans toutes les matières'}
    if(moySciences > moyLettres + 2) return {nom:'Scientifique', emoji:'🔬', desc:'Esprit analytique et logique prononcé'}
    if(moyLettres > moySciences + 2) return {nom:'Littéraire', emoji:'📖', desc:'Sensibilité aux langues et à l\'expression'}
    if(moy >= 12) return {nom:'Équilibré', emoji:'⚖️', desc:'Polyvalent, à l\'aise dans toutes les matières'}
    return {nom:'Battant', emoji:'💪', desc:'Déterminé, avec du potentiel à révéler'}
  }

  function computeScores(notes: any[]) {
    const categories = [
      {label:'Sciences', matieres:['Mathématiques','Physique-Chimie','SVT','NSI'], color:'#7c5cfc'},
      {label:'Lettres', matieres:['Français','Philosophie'], color:'#ff6b9d'},
      {label:'Langues', matieres:['Anglais','Espagnol','Allemand'], color:'#ffd166'},
      {label:'Sciences Humaines', matieres:['Histoire-Géo','SES','EMC'], color:'#06d6a0'},
    ]
    return categories.map(cat => {
      const relevant = notes.filter(n=>cat.matieres.includes(n.matiere))
      const score = relevant.length ? Math.round(relevant.reduce((s,n)=>s+parseFloat(n.note),0)/relevant.length*5) : 0
      return {...cat, score: Math.min(100, score)}
    })
  }

  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'50px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>router.push('/app')} style={{background:'rgba(255,255,255,0.06)', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← App</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>DuneIA</div>
        <div style={{marginLeft:'auto', fontSize:'0.78rem', fontWeight:800, color:'#ff6b9d'}}>🧬 ADN Scolaire</div>
      </nav>

      <div style={{maxWidth:'680px', margin:'0 auto', padding:'20px 16px'}}>
        {notes.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px 20px'}}>
            <div style={{fontSize:'3rem', marginBottom:'16px'}}>🧬</div>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700, marginBottom:'8px'}}>Aucune note trouvée</div>
            <p style={{fontSize:'0.84rem', color:'#8e8cb0', fontWeight:600, marginBottom:'20px'}}>Connecte ton Pronote pour découvrir ton ADN scolaire.</p>
            <button onClick={()=>router.push('/app')} style={{padding:'12px 24px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.92rem', cursor:'pointer'}}>Retour</button>
          </div>
        ) : !adn ? (
          <div>
            <div style={{textAlign:'center', marginBottom:'28px'}}>
              <div style={{fontSize:'2.5rem', marginBottom:'12px'}}>🧬</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.3rem', fontWeight:700, marginBottom:'8px'}}>ADN Scolaire</div>
              <p style={{fontSize:'0.84rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7}}>Découvre ton profil cognitif unique — tes forces cachées, tes vrais blocages et ton archétype d'élève.</p>
            </div>
            <div style={{background:'rgba(255,107,157,0.08)', border:'2px solid rgba(255,107,157,0.2)', borderRadius:'16px', padding:'20px', marginBottom:'20px'}}>
              {['Archetype d\'eleve personnalise','Forces et faiblesses cognitives','Score par domaine (Sciences, Lettres...)','Profil de memoire et d\'apprentissage','Conseils adaptes a TON profil unique'].map((t,i)=>(
                <div key={i} style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:i<4?'8px':0, fontSize:'0.82rem', fontWeight:700}}>
                  <span style={{color:'#ff6b9d'}}>✓</span> {t}
                </div>
              ))}
            </div>
            <button onClick={genererAdn} disabled={loading} style={{padding:'14px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#ff6b9d,#7c5cfc)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.95rem', cursor:'pointer', width:'100%', opacity:loading?0.7:1}}>
              {loading ? 'Analyse de ton ADN...' : 'Découvrir mon ADN Scolaire'}
            </button>
          </div>
        ) : (
          <div>
            {/* Archétype */}
            <div style={{background:'linear-gradient(135deg,rgba(255,107,157,0.15),rgba(124,92,252,0.1))', border:'2px solid rgba(255,107,157,0.35)', borderRadius:'22px', padding:'28px', textAlign:'center', marginBottom:'16px'}}>
              <div style={{fontSize:'3.5rem', marginBottom:'12px'}}>{adn.archetype.emoji}</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.6rem', fontWeight:700, marginBottom:'6px'}}>L'archétype {adn.archetype.nom}</div>
              <p style={{fontSize:'0.86rem', color:'rgba(240,238,255,0.8)', fontWeight:600, lineHeight:1.6, margin:0}}>{adn.archetype.desc}</p>
            </div>

            {/* Scores par domaine */}
            <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px', marginBottom:'16px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'16px'}}>📊 Scores par domaine</div>
              {adn.scores.map((s:any,i:number)=>(
                <div key={i} style={{marginBottom:'14px'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'6px'}}>
                    <div style={{fontSize:'0.84rem', fontWeight:700}}>{s.label}</div>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.9rem', fontWeight:700, color:s.color}}>{s.score}%</div>
                  </div>
                  <div style={{height:'8px', background:'#1c1a2e', borderRadius:'100px', overflow:'hidden'}}>
                    <div style={{height:'100%', background:s.color, borderRadius:'100px', width:`${s.score}%`, transition:'width 1s'}}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Forces et faiblesses */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px'}}>
              <div style={{background:'rgba(6,214,160,0.06)', border:'2px solid rgba(6,214,160,0.25)', borderRadius:'16px', padding:'16px'}}>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.9rem', fontWeight:700, color:'#06d6a0', marginBottom:'10px'}}>✅ Forces</div>
                {(adn.forces||[]).slice(0,4).map((f:string,i:number)=>(
                  <div key={i} style={{fontSize:'0.78rem', fontWeight:600, color:'#f0eeff', lineHeight:1.5, marginBottom:'6px', paddingBottom:'6px', borderBottom:i<3?'1px solid rgba(255,255,255,0.05)':'none'}}>👍 {f}</div>
                ))}
              </div>
              <div style={{background:'rgba(239,71,111,0.06)', border:'2px solid rgba(239,71,111,0.25)', borderRadius:'16px', padding:'16px'}}>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.9rem', fontWeight:700, color:'#ef476f', marginBottom:'10px'}}>⚠️ A travailler</div>
                {(adn.faiblesses||[]).slice(0,4).map((f:string,i:number)=>(
                  <div key={i} style={{fontSize:'0.78rem', fontWeight:600, color:'#f0eeff', lineHeight:1.5, marginBottom:'6px', paddingBottom:'6px', borderBottom:i<3?'1px solid rgba(255,255,255,0.05)':'none'}}>💪 {f}</div>
                ))}
              </div>
            </div>

            {/* Diagnostic */}
            {adn.diagnostic && (
              <div style={{background:'rgba(124,92,252,0.08)', border:'2px solid rgba(124,92,252,0.2)', borderRadius:'16px', padding:'18px', marginBottom:'16px'}}>
                <div style={{fontSize:'0.72rem', fontWeight:800, color:'#a48bff', marginBottom:'6px'}}>🔬 Diagnostic IA</div>
                <p style={{fontSize:'0.85rem', color:'#f0eeff', fontWeight:600, lineHeight:1.7, margin:0}}>{adn.diagnostic}</p>
              </div>
            )}

            {/* Message motivation */}
            {adn.message && (
              <div style={{background:'rgba(255,209,102,0.08)', border:'2px solid rgba(255,209,102,0.2)', borderRadius:'16px', padding:'18px', marginBottom:'16px', textAlign:'center'}}>
                <div style={{fontSize:'1.3rem', marginBottom:'8px'}}>✨</div>
                <p style={{fontSize:'0.86rem', fontWeight:700, color:'#ffd166', lineHeight:1.7, margin:0}}>{adn.message}</p>
              </div>
            )}

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
              <button onClick={()=>setAdn(null)} style={{padding:'12px', borderRadius:'12px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.88rem', cursor:'pointer'}}>
                🔄 Recalculer
              </button>
              <button onClick={()=>router.push('/analyse')} style={{padding:'12px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.88rem', cursor:'pointer'}}>
                📊 Voir analyse
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomNav active="app"/>
    </div>
  )
}
