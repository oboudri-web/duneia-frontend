'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

const OBJECTIFS = [
  '📈 Améliorer ma moyenne générale',
  '🎯 Préparer le brevet / bac',
  '⚡ Rattraper mon retard',
  '📚 Mieux m\'organiser pour réviser',
  '👨‍👩‍👧 Rassurer mes parents',
]

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [platform, setPlatform] = useState('Pronote')
  const [pronoteUrl, setPronoteUrl] = useState('')
  const [pronoteUser, setPronoteUser] = useState('')
  const [pronotePass, setPronotePass] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [synced, setSynced] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')
  const [plan, setPlan] = useState('premium')
  const [selectedObjectifs, setSelectedObjectifs] = useState<number[]>([0])

  function toggleObjectif(i: number) {
    setSelectedObjectifs(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    )
  }

  async function syncPronote() {
    if(!pronoteUrl || !pronoteUser || !pronotePass) { alert('Remplis tous les champs !'); return }
    const token = localStorage.getItem('duneia_token')
    if(!token) { router.push('/auth'); return }
    setSyncing(true)
    try {
      const r = await fetch(BACKEND+'/api/pronote/sync', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({username:pronoteUser, password:pronotePass, url:pronoteUrl})
      })
      const d = await r.json()
      if(!r.ok) throw new Error(d.error)
      setSynced(true)
      setSyncMsg((d.data?.notes?.length || 0) + ' notes récupérées — ' + (d.data?.trimestre || ''))
      // Store Pronote data in localStorage for app
      if(d.data?.notes || d.data?.appreciations) {
        const triIdx = d.data.trimestre?.includes('1')?0:d.data.trimestre?.includes('2')?1:2
        // Utilise les moyennes par matière avec appréciations
        const notes = d.data.appreciations?.map((a:any)=>({
          matiere: a.matiere || '',
          note: a.moyenne_eleve?.toString() || '',
          appreciation: a.appreciation || ''
        })) || []
        const existing = JSON.parse(localStorage.getItem('duneia_notes') || '{"0":[],"1":[],"2":[]}')
        existing[triIdx] = notes
        localStorage.setItem('duneia_notes', JSON.stringify(existing))
        localStorage.setItem('duneia_pronote_connected', '1')
        // Sauvegarde aussi les notes brutes pour l'analyse
        localStorage.setItem('duneia_notes_brutes', JSON.stringify(d.data.notes || []))
        localStorage.setItem('duneia_eleve_nom', d.data.eleve || '')
        localStorage.setItem('duneia_trimestre', d.data.trimestre || '')
        // Auto-redirect to analyse after 2 seconds
        setTimeout(()=>router.push('/analyse'), 2000)
      }
    } catch(e:any) {
      alert('Erreur Pronote : ' + e.message)
    } finally { setSyncing(false) }
  }

  const progress = ((step+1)/5)*100
  const inp: React.CSSProperties = {width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'11px', padding:'10px 13px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.88rem', fontWeight:600, outline:'none', marginBottom:'12px'}
  const lbl: React.CSSProperties = {display:'block', fontSize:'0.72rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px'}
  const btn: React.CSSProperties = {width:'100%', padding:'13px', borderRadius:'13px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.96rem', cursor:'pointer', marginTop:'7px'}
  const skip: React.CSSProperties = {width:'100%', padding:'9px', borderRadius:'11px', border:'none', background:'transparent', color:'#8e8cb0', fontFamily:'Nunito,sans-serif', fontWeight:700, fontSize:'0.83rem', cursor:'pointer', marginTop:'7px'}

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', position:'relative', zIndex:1}}>
      <div style={{width:'100%', maxWidth:'500px'}}>

        {/* Progress bar */}
        <div style={{height:'5px', background:'#1c1a2e', borderRadius:'100px', marginBottom:'36px', overflow:'hidden'}}>
          <div style={{height:'100%', background:'linear-gradient(90deg,#7c5cfc,#ff6b9d)', borderRadius:'100px', width:progress+'%', transition:'width 0.5s ease'}}/>
        </div>

        {/* Step 0 — Bienvenue */}
        {step === 0 && (
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'3.8rem', marginBottom:'18px'}}>🎉</div>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.7rem', fontWeight:700, marginBottom:'9px'}}>Bienvenue sur DuneIA !</div>
            <p style={{fontSize:'0.88rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7, marginBottom:'24px'}}>
              Connecte ton {platform} et DuneIA analyse tout automatiquement. Moins de 2 minutes !
            </p>
            <div style={{background:'linear-gradient(135deg,rgba(255,209,102,0.1),rgba(124,92,252,0.07))', border:'2px solid rgba(255,209,102,0.22)', borderRadius:'15px', padding:'18px', marginBottom:'14px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'2.8rem', fontWeight:700, color:'#ffd166'}}>+100 XP</div>
              <div style={{fontSize:'0.8rem', fontWeight:700, color:'#8e8cb0', marginTop:'3px'}}>Pour avoir créé ton compte 🎮</div>
            </div>
            <button onClick={()=>setStep(1)} style={btn}>C'est parti ! 🚀</button>
          </div>
        )}

        {/* Step 1 — Pronote */}
        {step === 1 && (
          <div>
            <div style={{fontSize:'3.8rem', textAlign:'center', marginBottom:'18px'}}>🔗</div>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.7rem', fontWeight:700, textAlign:'center', marginBottom:'9px'}}>Connecte {platform}</div>
            <p style={{fontSize:'0.88rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7, textAlign:'center', marginBottom:'24px'}}>
              DuneIA récupère tes notes et appréciations automatiquement. Tes identifiants sont chiffrés.
            </p>
            <div style={{background:'linear-gradient(135deg,rgba(6,214,160,0.1),rgba(124,92,252,0.07))', border:'2px solid rgba(6,214,160,0.28)', borderRadius:'16px', padding:'18px', marginBottom:'14px'}}>
              <label style={lbl}>URL Pronote de ton établissement</label>
              {platform === 'Pronote' && (
                <input style={inp} placeholder="https://0XXXXXXX.index-education.net/pronote/" value={pronoteUrl} onChange={e=>setPronoteUrl(e.target.value)}/>
              )}
              <label style={lbl}>Identifiant</label>
              <input style={inp} placeholder={`Ton identifiant ${platform}`} value={pronoteUser} onChange={e=>setPronoteUser(e.target.value)}/>
              <label style={lbl}>Mot de passe</label>
              <input style={{...inp, marginBottom:0}} type="password" placeholder={`Ton mot de passe ${platform}`} value={pronotePass} onChange={e=>setPronotePass(e.target.value)}/>
            </div>
            {synced && (
              <div style={{background:'rgba(6,214,160,0.08)', border:'2px solid rgba(6,214,160,0.25)', borderRadius:'12px', padding:'12px', textAlign:'center', marginBottom:'12px'}}>
                <div style={{fontSize:'1.4rem', marginBottom:'5px'}}>✅</div>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, color:'#06d6a0'}}>Pronote connecté !</div>
                <div style={{fontSize:'0.78rem', color:'#8e8cb0', fontWeight:600, marginTop:'3px'}}>{syncMsg}</div>
              </div>
            )}
            <button
              onClick={synced ? ()=>setStep(2) : syncPronote}
              disabled={syncing}
              style={{...btn, background: synced?'linear-gradient(135deg,#06d6a0,#00a8b5)':'linear-gradient(135deg,#7c5cfc,#ff6b9d)', opacity:syncing?0.7:1}}
            >
              {syncing ? '⏳ Connexion...' : synced ? 'Continuer →' : '🔗 Connecter Pronote'}
            </button>
            <button onClick={()=>setStep(2)} style={skip}>Passer cette étape</button>
          </div>
        )}

        {/* Step 2 — Objectifs */}
        {step === 2 && (
          <div>
            <div style={{fontSize:'3.8rem', textAlign:'center', marginBottom:'18px'}}>🏆</div>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.7rem', fontWeight:700, textAlign:'center', marginBottom:'9px'}}>Tes objectifs</div>
            <p style={{fontSize:'0.88rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7, textAlign:'center', marginBottom:'24px'}}>
              Sélectionne tout ce qui s'applique.
            </p>
            <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'16px', marginBottom:'14px'}}>
              {OBJECTIFS.map((obj, i) => {
                const checked = selectedObjectifs.includes(i)
                return (
                  <div
                    key={i}
                    onClick={()=>toggleObjectif(i)}
                    style={{
                      display:'flex', alignItems:'center', gap:'11px',
                      padding:'11px', marginBottom: i<OBJECTIFS.length-1 ? '8px' : 0,
                      background: checked ? 'rgba(6,214,160,0.05)' : '#1c1a2e',
                      border: `2px solid ${checked ? 'rgba(6,214,160,0.35)' : '#2a2740'}`,
                      borderRadius:'11px', cursor:'pointer',
                      fontSize:'0.85rem', fontWeight:700, transition:'all 0.2s'
                    }}
                  >
                    <div style={{
                      width:'22px', height:'22px', borderRadius:'6px', flexShrink:0,
                      background: checked ? '#06d6a0' : 'transparent',
                      border: `2px solid ${checked ? '#06d6a0' : '#2a2740'}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'0.75rem', color:'white', transition:'all 0.2s'
                    }}>
                      {checked ? '✓' : ''}
                    </div>
                    {obj}
                  </div>
                )
              })}
            </div>
            <button onClick={()=>setStep(3)} style={btn}>Suivant →</button>
          </div>
        )}

        {/* Step 3 — Plan */}
        {step === 3 && (
          <div>
            <div style={{fontSize:'3.8rem', textAlign:'center', marginBottom:'18px'}}>⭐</div>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.7rem', fontWeight:700, textAlign:'center', marginBottom:'9px'}}>Choisis ton plan</div>
            <p style={{fontSize:'0.88rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7, textAlign:'center', marginBottom:'24px'}}>
              Commence gratuitement, upgrade quand tu veux.
            </p>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'9px', marginBottom:'12px'}}>
              {[
                {p:'free', ic:'🆓', name:'Gratuit', price:'0€/mois', color:'#f0eeff'},
                {p:'premium', ic:'⭐', name:'Premium', price:'9,99€/mois', color:'#a48bff'},
              ].map(({p,ic,name,price,color}) => (
                <div
                  key={p}
                  onClick={()=>setPlan(p)}
                  style={{
                    padding:'14px 8px', border:`2px solid ${plan===p?'#7c5cfc':'#2a2740'}`,
                    borderRadius:'13px', cursor:'pointer', textAlign:'center',
                    background: plan===p ? 'rgba(124,92,252,0.08)' : 'transparent',
                    transition:'all 0.2s'
                  }}
                >
                  <div style={{fontSize:'1.4rem', marginBottom:'5px'}}>{ic}</div>
                  <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.92rem', fontWeight:700, color}}>{name}</div>
                  <div style={{fontSize:'0.74rem', color:'#8e8cb0', fontWeight:700}}>{price}</div>
                </div>
              ))}
            </div>
            <div style={{background: plan==='premium' ? 'linear-gradient(135deg,rgba(124,92,252,0.1),rgba(255,107,157,0.06))' : 'rgba(255,255,255,0.03)', border:`2px solid ${plan==='premium' ? 'rgba(124,92,252,0.28)' : '#2a2740'}`, borderRadius:'13px', padding:'13px', marginBottom:'12px', fontSize:'0.8rem', fontWeight:600, color:'#8e8cb0', lineHeight:1.6}}>
              {plan === 'premium'
                ? '✅ Sync Pronote illimitée · Plan IA 3 semaines · Tuteur IA illimité · Annales · Oral IA · ADN scolaire · Dashboard parents · Sans engagement'
                : '✅ Sync Pronote (1 trimestre) · Plan IA 1 semaine · 5 questions/jour · 3 imports cours'}
            </div>
            <button
              onClick={()=> plan==='premium' ? router.push('/paiement') : setStep(4)}
              style={btn}
            >
              {plan==='premium' ? '🚀 Commencer avec Premium' : 'Continuer gratuitement →'}
            </button>
          </div>
        )}

        {/* Step 4 — Done */}
        {step === 4 && (
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'5rem', marginBottom:'16px'}}>🎮</div>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.7rem', fontWeight:700, marginBottom:'9px'}}>C'est parti !</div>
            <p style={{fontSize:'0.88rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7, marginBottom:'24px'}}>
              Ton espace est prêt. DuneIA va analyser ton Pronote !
            </p>
            <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'22px', marginBottom:'14px'}}>
              <div style={{fontSize:'1.5rem', marginBottom:'7px'}}>🏆</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'4px'}}>Badge débloqué !</div>
              <div style={{fontSize:'0.8rem', color:'#8e8cb0', fontWeight:600}}>🔥 "Premier pas" — Tu viens de rejoindre DuneIA</div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'14px'}}>
              {[['100','XP','#ffd166'],['1','Niveau','#a48bff'],['1','Badge','#06d6a0']].map(([v,l,c]) => (
                <div key={l} style={{textAlign:'center', background:'#131120', border:'2px solid #2a2740', borderRadius:'11px', padding:'11px'}}>
                  <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.3rem', color:c}}>{v}</div>
                  <div style={{fontSize:'0.62rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase'}}>{l}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>router.push('/app')} style={btn}>Accéder à DuneIA 🚀</button>
          </div>
        )}

      </div>
    </div>
  )
}
