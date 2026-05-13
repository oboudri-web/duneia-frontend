'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

export default function ScannerCopie() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [matiere, setMatiere] = useState('Mathématiques')
  const [analyse, setAnalyse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string|null>(null)

  const matieres = ['Mathématiques','Français','Histoire-Géo','Physique-Chimie','SVT','Anglais','Philosophie','SES']

  useEffect(() => {
    const u = localStorage.getItem('duneia_user')
    if(!u) { router.push('/auth'); return }
    setUser(JSON.parse(u))
  }, [])

  async function analyserCopie(file: File) {
    setLoading(true)
    setAnalyse(null)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const base64 = (ev.target?.result as string).split(',')[1]
      const mime = file.type || 'image/jpeg'
      setPreview(ev.target?.result as string)
      try {
        const token = localStorage.getItem('duneia_token')
        const r = await fetch(BACKEND+'/api/ai/scanner-copie', {
          method: 'POST',
          headers: {'Content-Type':'application/json','Authorization':'Bearer '+token},
          body: JSON.stringify({imageBase64: base64, mimeType: mime, matiere, classe: user?.classe})
        })
        const d = await r.json()
        if(d.success) setAnalyse(d.analyse)
        else alert(d.error || 'Erreur analyse')
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'54px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>router.push('/app')} style={{background:'rgba(255,255,255,0.06)', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← App</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>DuneIA</div>
        <div style={{marginLeft:'auto', fontSize:'0.78rem', fontWeight:800, color:'#ff9f1c'}}>📸 Scanner Copie</div>
      </nav>

      <div style={{maxWidth:'680px', margin:'0 auto', padding:'20px 16px'}}>
        {!analyse ? (
          <div>
            <div style={{textAlign:'center', marginBottom:'28px'}}>
              <div style={{fontSize:'2.5rem', marginBottom:'12px'}}>📸</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.3rem', fontWeight:700, marginBottom:'8px'}}>Scanner de copie</div>
              <p style={{fontSize:'0.84rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7}}>Prends ta copie corrigée en photo. DuneIA lit les annotations du prof et génère un plan de rattrapage personnalisé.</p>
            </div>

            <div style={{marginBottom:'14px'}}>
              <label style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:'6px'}}>Matière</label>
              <select value={matiere} onChange={e=>setMatiere(e.target.value)} style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:700, outline:'none'}}>
                {matieres.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {preview && (
              <div style={{marginBottom:'14px', borderRadius:'14px', overflow:'hidden', border:'2px solid #2a2740'}}>
                <img src={preview} alt="Copie" style={{width:'100%', display:'block'}}/>
              </div>
            )}

            <input
              id="copieInput"
              type="file"
              accept="image/*"
              capture="environment"
              style={{display:'none'}}
              onChange={e=>{const f=e.target.files?.[0]; if(f) analyserCopie(f)}}
            />

            {loading ? (
              <div style={{textAlign:'center', padding:'40px'}}>
                <div style={{width:'40px', height:'40px', border:'3px solid rgba(255,159,28,0.3)', borderTopColor:'#ff9f1c', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px'}}/>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', color:'#ff9f1c'}}>Analyse de ta copie en cours...</div>
                <div style={{fontSize:'0.8rem', color:'#8e8cb0', marginTop:'8px'}}>DuneIA lit les annotations de ton prof</div>
              </div>
            ) : (
              <div style={{display:'grid', gap:'10px'}}>
                <button onClick={()=>document.getElementById('copieInput')?.click()} style={{padding:'16px', borderRadius:'14px', border:'none', background:'linear-gradient(135deg,#ff9f1c,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.95rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
                  📷 Prendre une photo de ma copie
                </button>
                <button onClick={()=>{const i=document.getElementById('copieInput') as HTMLInputElement; if(i){i.removeAttribute('capture');i.click()}}} style={{padding:'14px', borderRadius:'14px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.88rem', cursor:'pointer'}}>
                  🖼️ Choisir depuis la galerie
                </button>
              </div>
            )}

            <div style={{background:'rgba(255,159,28,0.08)', border:'2px solid rgba(255,159,28,0.2)', borderRadius:'14px', padding:'16px', marginTop:'20px'}}>
              {['📝 Lit toutes les annotations du prof','❌ Identifie chaque erreur','📚 Génère un plan de rattrapage ciblé','💡 Conseils pour ne plus refaire les mêmes erreurs'].map((t,i)=>(
                <div key={i} style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:i<3?'8px':0, fontSize:'0.82rem', fontWeight:700}}>{t}</div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Note */}
            <div style={{background:'linear-gradient(135deg,rgba(255,159,28,0.15),rgba(255,107,157,0.08))', border:'2px solid rgba(255,159,28,0.3)', borderRadius:'22px', padding:'28px', textAlign:'center', marginBottom:'16px'}}>
              <div style={{fontSize:'0.75rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px'}}>Note obtenue</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'4rem', fontWeight:700, color:'#ff9f1c', lineHeight:1}}>{analyse.note}</div>
              <div style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:700, marginTop:'4px'}}>{analyse.matiere}</div>
            </div>

            {/* Annotations prof */}
            {analyse.annotations_prof?.length > 0 && (
              <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px', marginBottom:'16px'}}>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'12px'}}>✏️ Annotations du prof</div>
                {analyse.annotations_prof.map((a:string,i:number)=>(
                  <div key={i} style={{display:'flex', gap:'10px', padding:'8px 0', borderBottom:i<analyse.annotations_prof.length-1?'1px solid rgba(255,255,255,0.04)':'none'}}>
                    <span style={{color:'#ffd166', flexShrink:0}}>→</span>
                    <span style={{fontSize:'0.84rem', fontWeight:600, color:'#f0eeff', lineHeight:1.6}}>{a}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Points forts et faibles */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px'}}>
              <div style={{background:'rgba(6,214,160,0.06)', border:'2px solid rgba(6,214,160,0.25)', borderRadius:'16px', padding:'16px'}}>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.9rem', fontWeight:700, color:'#06d6a0', marginBottom:'10px'}}>✅ Points forts</div>
                {(analyse.points_forts||[]).map((p:string,i:number)=>(
                  <div key={i} style={{fontSize:'0.78rem', fontWeight:600, color:'#f0eeff', lineHeight:1.5, marginBottom:'6px'}}>👍 {p}</div>
                ))}
              </div>
              <div style={{background:'rgba(239,71,111,0.06)', border:'2px solid rgba(239,71,111,0.25)', borderRadius:'16px', padding:'16px'}}>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.9rem', fontWeight:700, color:'#ef476f', marginBottom:'10px'}}>❌ Erreurs</div>
                {(analyse.points_faibles||[]).map((p:string,i:number)=>(
                  <div key={i} style={{fontSize:'0.78rem', fontWeight:600, color:'#f0eeff', lineHeight:1.5, marginBottom:'6px'}}>✗ {p}</div>
                ))}
              </div>
            </div>

            {/* Plan de rattrapage */}
            <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'20px', marginBottom:'16px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'12px'}}>🎯 Plan de rattrapage</div>
              {(analyse.plan_rattrapage||[]).map((p:string,i:number)=>(
                <div key={i} style={{display:'flex', alignItems:'flex-start', gap:'10px', padding:'10px', background:'#1c1a2e', borderRadius:'11px', marginBottom:'8px'}}>
                  <div style={{width:'22px', height:'22px', borderRadius:'7px', background:'linear-gradient(135deg,#ff9f1c,#ff6b9d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:900, color:'white', flexShrink:0}}>{i+1}</div>
                  <div style={{fontSize:'0.82rem', fontWeight:700, lineHeight:1.5}}>{p}</div>
                </div>
              ))}
            </div>

            {/* Conseil global */}
            {analyse.conseil_global && (
              <div style={{background:'rgba(255,209,102,0.08)', border:'2px solid rgba(255,209,102,0.2)', borderRadius:'16px', padding:'18px', marginBottom:'16px', textAlign:'center'}}>
                <p style={{fontSize:'0.86rem', fontWeight:700, color:'#ffd166', lineHeight:1.7, margin:0}}>{analyse.conseil_global}</p>
              </div>
            )}

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
              <button onClick={()=>{setAnalyse(null);setPreview(null)}} style={{padding:'12px', borderRadius:'12px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.88rem', cursor:'pointer'}}>
                📸 Nouvelle copie
              </button>
              <button onClick={()=>router.push('/revision')} style={{padding:'12px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.88rem', cursor:'pointer'}}>
                📚 Réviser maintenant
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomNav active="app"/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
