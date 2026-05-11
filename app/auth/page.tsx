'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') === 'signup' ? 'signup' : 'login')
  const [signupStep, setSignupStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedAv, setSelectedAv] = useState('🧑‍🎓')
  const [role, setRole] = useState('eleve')

  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPwd, setLoginPwd] = useState('')

  // Signup fields
  const [sName, setSName] = useState('')
  const [sClass, setSClass] = useState('')
  const [sEmail, setSEmail] = useState('')
  const [sPwd, setSPwd] = useState('')
  const [sPwd2, setSPwd2] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const avatars = ['🧑‍🎓','👩‍🎓','🦊','🐼','🦁','🐸','🚀','⚡']

  async function doLogin() {
    if(!loginEmail || !loginPwd) { setError('Remplis tous les champs !'); return; }
    setLoading(true); setError('')
    try {
      const r = await fetch(BACKEND+'/api/auth/login', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email:loginEmail, password:loginPwd})
      })
      const d = await r.json()
      if(!r.ok) throw new Error(d.error || 'Erreur connexion')
      localStorage.setItem('duneia_token', d.token)
      localStorage.setItem('duneia_user', JSON.stringify(d.user))
      router.push('/app')
    } catch(e:any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function doSignup() {
    if(!acceptTerms) { setError('Accepte les CGV pour continuer.'); return; }
    setLoading(true); setError('')
    try {
      const r = await fetch(BACKEND+'/api/auth/signup', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email:sEmail, password:sPwd, nom:sName, classe:sClass, role, avatar:selectedAv})
      })
      const d = await r.json()
      if(!r.ok) throw new Error(d.error || 'Erreur inscription')
      localStorage.setItem('duneia_token', d.token)
      localStorage.setItem('duneia_user', JSON.stringify(d.user))
      router.push('/onboarding')
    } catch(e:any) { setError(e.message) }
    finally { setLoading(false) }
  }

  function nextStep() {
    setError('')
    if(signupStep === 0) {
      if(!sName) { setError('Entre ton prénom !'); return; }
      setSignupStep(1)
    } else if(signupStep === 1) {
      if(!sEmail.includes('@')) { setError('Email invalide'); return; }
      if(sPwd.length < 8) { setError('Mot de passe trop court (8 min)'); return; }
      if(sPwd !== sPwd2) { setError('Les mots de passe ne correspondent pas'); return; }
      setSignupStep(2)
    }
  }

  const inputStyle = {
    width:'100%', background:'#1c1a2e', border:'2px solid #2a2740',
    borderRadius:'11px', padding:'10px 13px', color:'#f0eeff',
    fontFamily:'Nunito,sans-serif', fontSize:'0.88rem', fontWeight:600,
    outline:'none', marginBottom:'12px'
  }
  const labelStyle = {
    display:'block', fontSize:'0.72rem', fontWeight:800,
    color:'#8e8cb0', textTransform:'uppercase' as const,
    letterSpacing:'0.06em', marginBottom:'6px'
  }

  return (
    <div style={{minHeight:'100vh', display:'flex', flexDirection:'column', padding:'16px', paddingTop:'55px', position:'relative', zIndex:1}}>
      {/* Back button */}
      <button onClick={()=>router.push('/')} style={{
        alignSelf:'flex-start', marginBottom:'16px',
        background:'rgba(255,255,255,0.08)', border:'2px solid #2a2740',
        borderRadius:'10px', color:'#f0eeff', padding:'8px 14px',
        fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem',
        cursor:'pointer', display:'flex', alignItems:'center', gap:'6px'
      }}>← Retour</button>
      <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <style>{`
        @media (max-width: 640px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-left { border-right: none !important; border-top: 2px solid #2a2740; order: 2; padding: 24px !important; }
          .auth-right { order: 1; }
        }
      `}</style>
      <style>{`
        @media (max-width: 640px) {
          .auth-grid {
            grid-template-columns: 1fr !important;
          }
          .auth-left {
            border-right: none !important;
            border-top: 2px solid #2a2740;
            order: 2;
          }
          .auth-right {
            order: 1;
          }
        }
      `}</style>
      <div className='auth-grid' style={{display:'grid', gridTemplateColumns:'1fr 1fr', maxWidth:'860px', width:'100%', background:'#131120', border:'2px solid #2a2740', borderRadius:'26px', overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,0.5)'}}>

        {/* LEFT */}
        <div className='auth-left' style={{background:'linear-gradient(135deg,rgba(124,92,252,0.22),rgba(255,107,157,0.12))', borderRight:'2px solid #2a2740', padding:'44px 32px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.5rem', fontWeight:700, color:'#ffd166', marginBottom:'36px'}}>🎓 DuneIA</div>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.6rem', fontWeight:700, lineHeight:1.2, marginBottom:'10px'}}>
            Level up<br/><span style={{color:'#ffd166'}}>tes notes</span> 🚀
          </div>
          <p style={{fontSize:'0.85rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7, marginBottom:'28px'}}>
            Connecte ton Pronote. DuneIA analyse tout et te génère un plan au millimètre.
          </p>
          <div style={{display:'flex', flexDirection:'column', gap:'11px'}}>
            {[
              {ic:'🔗', txt:<><strong style={{color:'#f0eeff'}}>Sync Pronote automatique</strong> <span style={{color:'#8e8cb0'}}>— notes, appréciations, devoirs en 30s</span></>},
              {ic:'🧠', txt:<><strong style={{color:'#f0eeff'}}>Analyse complète du compte</strong> <span style={{color:'#8e8cb0'}}>— plan IA 3 semaines au millimètre</span></>},
              {ic:'🎯', txt:<><strong style={{color:'#f0eeff'}}>Annales, Oral IA, ADN scolaire</strong> <span style={{color:'#8e8cb0'}}>— tout pour progresser vraiment</span></>},
              {ic:'👨‍👩‍👧', txt:<><strong style={{color:'#f0eeff'}}>Dashboard parents</strong> <span style={{color:'#8e8cb0'}}>— alertes et suivi en temps réel</span></>},
            ].map((f,i) => (
              <div key={i} style={{display:'flex', alignItems:'center', gap:'11px', fontSize:'0.82rem', fontWeight:700}}>
                <div style={{width:'30px', height:'30px', borderRadius:'8px', background:'rgba(124,92,252,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.95rem', flexShrink:0}}>{f.ic}</div>
                <div>{f.txt}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className='auth-right' style={{padding:'44px 36px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
          {/* TABS */}
          <div style={{display:'flex', gap:'4px', background:'#1c1a2e', borderRadius:'11px', padding:'4px', marginBottom:'28px'}}>
            {['login','signup'].map(t => (
              <button key={t} onClick={()=>{setTab(t);setSignupStep(0);setError('')}} style={{
                flex:1, padding:'9px', borderRadius:'8px', border:'none',
                background: tab===t ? '#7c5cfc' : 'transparent',
                color: tab===t ? 'white' : '#8e8cb0',
                fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.83rem', cursor:'pointer',
                boxShadow: tab===t ? '0 2px 12px rgba(124,92,252,0.35)' : 'none'
              }}>{t==='login'?'Connexion':'Inscription'}</button>
            ))}
          </div>

          {error && <div style={{background:'rgba(239,71,111,0.1)', border:'2px solid rgba(239,71,111,0.25)', borderRadius:'10px', padding:'10px 14px', color:'#ef476f', fontSize:'0.82rem', fontWeight:700, marginBottom:'14px'}}>❌ {error}</div>}

          {/* LOGIN */}
          {tab === 'login' && (
            <div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700, marginBottom:'3px'}}>Content de te revoir ! 👋</div>
              <div style={{fontSize:'0.8rem', color:'#8e8cb0', fontWeight:600, marginBottom:'20px'}}>Connecte-toi pour continuer ta progression.</div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" placeholder="ton@email.fr" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doLogin()}/>
              <label style={labelStyle}>Mot de passe</label>
              <input style={inputStyle} type="password" placeholder="••••••••" value={loginPwd} onChange={e=>setLoginPwd(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doLogin()}/>
              <button onClick={doLogin} disabled={loading} style={{width:'100%', padding:'14px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.98rem', cursor:'pointer', marginTop:'8px', opacity:loading?0.7:1}}>
                {loading ? '⏳ Connexion...' : '🔐 Se connecter'}
              </button>
              <div style={{textAlign:'center', marginTop:'12px', fontSize:'0.78rem', color:'#8e8cb0', fontWeight:700, cursor:'pointer'}} onClick={()=>setTab('reset')}>Mot de passe oublié ?</div>
            </div>
          )}

          {/* SIGNUP */}
          {tab === 'signup' && (
            <div>
              {/* Step dots */}
              <div style={{display:'flex', gap:'5px', justifyContent:'center', marginBottom:'20px'}}>
                {[0,1,2].map(i => (
                  <div key={i} style={{height:'7px', borderRadius:'100px', transition:'all 0.3s', background: i<signupStep?'#06d6a0':i===signupStep?'#7c5cfc':'#2a2740', width: i===signupStep?'22px':'7px'}}/>
                ))}
              </div>

              {signupStep === 0 && (
                <div>
                  <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.15rem', fontWeight:700, marginBottom:'3px'}}>Tu es... ? 🤔</div>
                  <div style={{fontSize:'0.8rem', color:'#8e8cb0', fontWeight:600, marginBottom:'16px'}}>On adapte l'expérience pour toi.</div>
                  <div style={{display:'flex', gap:'8px', marginBottom:'14px'}}>
                    {[['eleve','🧑‍🎓 Élève'],['parent','👨‍👩‍👧 Parent']].map(([r,l]) => (
                      <button key={r} onClick={()=>setRole(r)} style={{flex:1, padding:'11px', border:`2px solid ${role===r?'#7c5cfc':'#2a2740'}`, borderRadius:'11px', background: role===r?'rgba(124,92,252,0.08)':'transparent', color: role===r?'#f0eeff':'#8e8cb0', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem', cursor:'pointer'}}>{l}</button>
                    ))}
                  </div>
                  <label style={labelStyle}>Prénom</label>
                  <input style={inputStyle} placeholder="Ton prénom" value={sName} onChange={e=>setSName(e.target.value)}/>
                  <label style={labelStyle}>Classe</label>
                  <select style={{...inputStyle}} value={sClass} onChange={e=>setSClass(e.target.value)}>
                    <option value="">Choisir ma classe</option>
                    {['6ème','5ème','4ème','3ème','2nde','1ère','Terminale'].map(c=><option key={c}>{c}</option>)}
                  </select>
                  <button onClick={nextStep} style={{width:'100%', padding:'13px', borderRadius:'13px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.96rem', cursor:'pointer', marginTop:'4px'}}>Continuer →</button>
                </div>
              )}

              {signupStep === 1 && (
                <div>
                  <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.15rem', fontWeight:700, marginBottom:'3px'}}>Crée ton compte 🔐</div>
                  <div style={{fontSize:'0.8rem', color:'#8e8cb0', fontWeight:600, marginBottom:'16px'}}>Tes données restent privées.</div>
                  <label style={labelStyle}>Email</label>
                  <input style={inputStyle} type="email" placeholder="ton@email.fr" value={sEmail} onChange={e=>setSEmail(e.target.value)}/>
                  <label style={labelStyle}>Mot de passe</label>
                  <input style={inputStyle} type="password" placeholder="8 caractères minimum" value={sPwd} onChange={e=>setSPwd(e.target.value)}/>
                  <label style={labelStyle}>Confirmer</label>
                  <input style={inputStyle} type="password" placeholder="Répète ton mot de passe" value={sPwd2} onChange={e=>setSPwd2(e.target.value)}/>
                  <div style={{display:'flex', gap:'8px', marginTop:'4px'}}>
                    <button onClick={()=>setSignupStep(0)} style={{width:'42px', height:'42px', borderRadius:'11px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', cursor:'pointer', fontSize:'1rem'}}>←</button>
                    <button onClick={nextStep} style={{flex:1, padding:'12px', borderRadius:'13px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.96rem', cursor:'pointer'}}>Continuer →</button>
                  </div>
                </div>
              )}

              {signupStep === 2 && (
                <div>
                  <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.15rem', fontWeight:700, marginBottom:'3px'}}>Choisis ton avatar 🎭</div>
                  <div style={{fontSize:'0.8rem', color:'#8e8cb0', fontWeight:600, marginBottom:'14px'}}>Dernière étape !</div>
                  <div style={{display:'flex', gap:'7px', flexWrap:'wrap', marginBottom:'14px'}}>
                    {avatars.map(a => (
                      <div key={a} onClick={()=>setSelectedAv(a)} style={{width:'38px', height:'38px', borderRadius:'10px', background: selectedAv===a?'rgba(124,92,252,0.1)':'#1c1a2e', border:`2px solid ${selectedAv===a?'#7c5cfc':'#2a2740'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', cursor:'pointer'}}>{a}</div>
                    ))}
                  </div>
                  <div style={{background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'11px', padding:'12px', display:'flex', alignItems:'center', gap:'11px', marginBottom:'14px'}}>
                    <div style={{width:'40px', height:'40px', borderRadius:'11px', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem'}}>{selectedAv}</div>
                    <div>
                      <div style={{fontWeight:800, fontSize:'0.87rem'}}>{sName || 'Joueur'}</div>
                      <div style={{fontSize:'0.7rem', color:'#8e8cb0', fontWeight:700}}>{sClass || 'Élève'} · Niveau 1</div>
                      <div style={{fontSize:'0.66rem', color:'#ffd166', fontWeight:800, marginTop:'2px'}}>⭐ 0 XP — Débutant</div>
                    </div>
                  </div>
                  <label style={{display:'flex', alignItems:'flex-start', gap:'7px', cursor:'pointer', fontSize:'0.75rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.5, marginBottom:'14px'}}>
                    <input type="checkbox" checked={acceptTerms} onChange={e=>setAcceptTerms(e.target.checked)} style={{marginTop:'2px', accentColor:'#7c5cfc'}}/>
                    J'accepte les CGV et la politique de confidentialité.
                  </label>
                  <div style={{display:'flex', gap:'8px'}}>
                    <button onClick={()=>setSignupStep(1)} style={{width:'42px', height:'42px', borderRadius:'11px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', cursor:'pointer', fontSize:'1rem'}}>←</button>
                    <button onClick={doSignup} disabled={loading} style={{flex:1, padding:'12px', borderRadius:'13px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.96rem', cursor:'pointer', opacity:loading?0.7:1}}>
                      {loading ? '⏳ Création...' : '🚀 Créer mon compte'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  )
}
