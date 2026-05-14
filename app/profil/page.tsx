'use client'
import BottomNav from '../../components/BottomNav'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

export default function Profil() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [xp, setXp] = useState(100)
  const [showPwdModal, setShowPwdModal] = useState(false)
  const [showNotifModal, setShowNotifModal] = useState(false)

  // Password change
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [newPwd2, setNewPwd2] = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdError, setPwdError] = useState('')
  const [pwdSuccess, setPwdSuccess] = useState(false)

  // Notifications
  const [notifs, setNotifs] = useState({
    emailRappel: true,
    emailBulletin: true,
    emailParents: false,
    pushRevision: true,
    pushXp: true,
    pushAmis: true,
    rappelHeure: '18:00',
    frequence: 'quotidien',
  })

  useEffect(() => {
    const u = localStorage.getItem('duneia_user')
    if(!u) { router.push('/auth'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    setXp(parsed.xp || 100)
    const savedNotifs = localStorage.getItem('duneia_notifs')
    if(savedNotifs) setNotifs(JSON.parse(savedNotifs))
  }, [])

  async function changePassword() {
    if(!oldPwd || !newPwd || !newPwd2) { setPwdError('Remplis tous les champs'); return }
    if(newPwd.length < 8) { setPwdError('Nouveau mot de passe trop court (8 min)'); return }
    if(newPwd !== newPwd2) { setPwdError('Les mots de passe ne correspondent pas'); return }
    const token = localStorage.getItem('duneia_token')
    setPwdLoading(true); setPwdError('')
    try {
      const r = await fetch(BACKEND+'/api/auth/password', {
        method: 'PATCH',
        headers: {'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd })
      })
      const d = await r.json()
      if(!r.ok) throw new Error(d.error)
      setPwdSuccess(true)
      setOldPwd(''); setNewPwd(''); setNewPwd2('')
      setTimeout(() => { setShowPwdModal(false); setPwdSuccess(false) }, 2000)
    } catch(e:any) { setPwdError(e.message) }
    finally { setPwdLoading(false) }
  }

  function saveNotifs(updated: typeof notifs) {
    setNotifs(updated)
    localStorage.setItem('duneia_notifs', JSON.stringify(updated))
  }

  function logout() {
    localStorage.removeItem('duneia_token')
    localStorage.removeItem('duneia_user')
    localStorage.removeItem('duneia_notes')
    localStorage.removeItem('duneia_chapitres')
    localStorage.removeItem('duneia_chapitres_notes')
    router.push('/')
  }

  const level = Math.floor(xp/500)+1
  const badges = [
    {icon:'🔥', name:'Premier pas', desc:'Compte créé', active:true},
    {icon:'📚', name:'Studieux', desc:'3 chapitres cochés', active:true},
    {icon:'🧠', name:'Stratège', desc:'Plan IA généré', active:true},
    {icon: user?.plan==='annuel'?'🔥':user?.plan==='famille'?'👨‍👩‍👧':'⭐', name: user?.plan==='annuel'?'Premium Annuel':user?.plan==='famille'?'Famille':'Premium', desc:'Abonnement actif', active:user?.plan_active},
    {icon:'🎯', name:'Annaliste', desc:'1ère annale réussie', active:false},
    {icon:'🏆', name:'Top 3', desc:'Classement amis', active:false},
  ]

  const inp:React.CSSProperties = {width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px 13px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.86rem', fontWeight:600, outline:'none', marginBottom:'11px'}
  const lbl:React.CSSProperties = {display:'block', fontSize:'0.7rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'5px'}

  if(!user) return null

  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.95)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'50px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>router.push('/app')} style={{background:'transparent', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← App</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>🎓 DuneIA</div>
      </nav>

      <div style={{maxWidth:'500px', margin:'0 auto', padding:'20px 16px'}}>

        {/* Avatar */}
        <div style={{background:'linear-gradient(135deg,rgba(124,92,252,0.15),rgba(255,107,157,0.08))', border:'2px solid rgba(124,92,252,0.3)', borderRadius:'22px', padding:'28px', textAlign:'center', marginBottom:'14px'}}>
          <div style={{width:'72px', height:'72px', borderRadius:'20px', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.2rem', margin:'0 auto 14px'}}>{user.avatar || '🧑‍🎓'}</div>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.4rem', fontWeight:700, marginBottom:'4px'}}>{user.nom || 'Joueur'}</div>
          <div style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:700, marginBottom:'14px'}}>{user.email} · {user.classe || 'Classe non définie'}</div>
          <div style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,209,102,0.1)', border:'1px solid rgba(255,209,102,0.25)', borderRadius:'100px', padding:'6px 16px'}}>
            <span style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:'#ffd166'}}>Niveau {level}</span>
            <span style={{fontSize:'0.75rem', color:'#8e8cb0', fontWeight:700}}>· {xp} XP</span>
          </div>
        </div>

        {/* XP Bar */}
        <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'14px', padding:'16px', marginBottom:'14px'}}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
            <span style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0'}}>Progression niveau {level+1}</span>
            <span style={{fontSize:'0.78rem', fontWeight:800, color:'#ffd166'}}>{xp%500} / 500 XP</span>
          </div>
          <div style={{height:'8px', background:'#1c1a2e', borderRadius:'100px', overflow:'hidden'}}>
            <div style={{height:'100%', background:'linear-gradient(90deg,#7c5cfc,#ff6b9d)', borderRadius:'100px', width:((xp%500)/500*100)+'%', transition:'width 1s'}}/>
          </div>
        </div>

        {/* Plan */}
        <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'14px', padding:'16px', marginBottom:'14px'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:'0.72rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px'}}>Plan actuel</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:user.plan_active?'#a48bff':'#f0eeff'}}>
                {user.plan_active ? (user.plan==='famille'?'👨‍👩‍👧 Famille':user.plan==='annuel'?'🔥 Premium Annuel':'⭐ Premium') : '🆓 Gratuit'}
              </div>
            </div>
              {!user.plan_active && <button onClick={()=>router.push('/paiement')} style={{padding:'9px 16px', borderRadius:'10px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem', cursor:'pointer'}}>⭐ Passer Premium</button>}
          </div>
        </div>

        {/* Badges */}
        <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'14px', padding:'16px', marginBottom:'14px'}}>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'14px'}}>🏅 Mes badges</div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'9px'}}>
            {badges.map((b,i)=>(
              <div key={i} style={{background:b.active?'rgba(255,209,102,0.06)':'#1c1a2e', border:`2px solid ${b.active?'rgba(255,209,102,0.25)':'#2a2740'}`, borderRadius:'12px', padding:'12px', textAlign:'center', opacity:b.active?1:0.4}}>
                <div style={{fontSize:'1.4rem', marginBottom:'4px'}}>{b.icon}</div>
                <div style={{fontSize:'0.72rem', fontWeight:800, color:b.active?'#f0eeff':'#8e8cb0', lineHeight:1.3}}>{b.name}</div>
                <div style={{fontSize:'0.62rem', color:'#8e8cb0', fontWeight:600, marginTop:'3px'}}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'9px', marginBottom:'14px'}}>
          {[{v:xp,l:'XP total',c:'#ffd166'},{v:level,l:'Niveau',c:'#a48bff'},{v:badges.filter(b=>b.active).length,l:'Badges',c:'#06d6a0'}].map((s,i)=>(
            <div key={i} style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'12px', padding:'14px', textAlign:'center'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.5rem', fontWeight:700, color:s.c}}>{s.v}</div>
              <div style={{fontSize:'0.68rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.04em'}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'14px', padding:'16px', marginBottom:'14px'}}>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'12px'}}>⚙️ Mon compte</div>
          {[
            {label:'🔗 Connecter / changer Pronote', action:()=>router.push('/onboarding')},
            {label:'⭐ Gérer mon abonnement', action:()=>router.push('/paiement')},
            {label:'🔗 Inviter un ami', action:()=>{
              const msg = "J'utilise DuneIA pour réviser — c'est comme Duolingo mais pour tes notes Pronote ou EcoleDirecte ! Essai gratuit sur duneia.fr 🚀"
              if(navigator.share) {
                navigator.share({ title: 'DuneIA', text: msg, url: 'https://duneia.fr' })
              } else {
                navigator.clipboard.writeText(msg + ' https://duneia.fr')
                alert('Lien copié ! Colle-le à tes amis 📋')
              }
            }},
            {label:'🔔 Notifications', action:()=>setShowNotifModal(true)},
            {label:'🔒 Changer mot de passe', action:()=>setShowPwdModal(true)},
          ].map((item,i)=>(
            <div key={i} onClick={item.action} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:i<3?'1px solid rgba(255,255,255,0.04)':'none', cursor:'pointer'}}>
              <span style={{fontSize:'0.85rem', fontWeight:700}}>{item.label}</span>
              <span style={{color:'#8e8cb0', fontSize:'1rem'}}>→</span>
            </div>
          ))}
        </div>

        <button onClick={logout} style={{width:'100%', padding:'13px', borderRadius:'13px', border:'2px solid rgba(239,71,111,0.3)', background:'rgba(239,71,111,0.06)', color:'#ef476f', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.92rem', cursor:'pointer'}}>
          🚪 Se déconnecter
        </button>
      </div>

      {/* ── MOT DE PASSE MODAL ── */}
      {showPwdModal && (
        <div style={{position:'fixed', inset:0, zIndex:2000, background:'rgba(5,4,15,0.92)', backdropFilter:'blur(18px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px'}} onClick={()=>setShowPwdModal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'22px', maxWidth:'400px', width:'100%', padding:'28px'}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700}}>🔒 Changer le mot de passe</div>
              <button onClick={()=>setShowPwdModal(false)} style={{width:'30px', height:'30px', borderRadius:'8px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', cursor:'pointer'}}>✕</button>
            </div>

            {pwdSuccess ? (
              <div style={{textAlign:'center', padding:'20px'}}>
                <div style={{fontSize:'2.5rem', marginBottom:'10px'}}>✅</div>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:'#06d6a0'}}>Mot de passe modifié !</div>
              </div>
            ) : (
              <>
                {pwdError && <div style={{background:'rgba(239,71,111,0.1)', border:'2px solid rgba(239,71,111,0.25)', borderRadius:'10px', padding:'10px', color:'#ef476f', fontSize:'0.82rem', fontWeight:700, marginBottom:'14px'}}>❌ {pwdError}</div>}
                <label style={lbl}>Ancien mot de passe</label>
                <input style={inp} type="password" placeholder="••••••••" value={oldPwd} onChange={e=>setOldPwd(e.target.value)}/>
                <label style={lbl}>Nouveau mot de passe</label>
                <input style={inp} type="password" placeholder="8 caractères minimum" value={newPwd} onChange={e=>setNewPwd(e.target.value)}/>
                <label style={lbl}>Confirmer le nouveau</label>
                <input style={{...inp, marginBottom:'16px'}} type="password" placeholder="Répète le nouveau mot de passe" value={newPwd2} onChange={e=>setNewPwd2(e.target.value)}/>
                <button onClick={changePassword} disabled={pwdLoading} style={{width:'100%', padding:'13px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.92rem', cursor:'pointer', opacity:pwdLoading?0.7:1}}>
                  {pwdLoading ? '⏳ Modification...' : '✅ Modifier le mot de passe'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS MODAL ── */}
      {showNotifModal && (
        <div style={{position:'fixed', inset:0, zIndex:2000, background:'rgba(5,4,15,0.92)', backdropFilter:'blur(18px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px', overflowY:'auto'}} onClick={()=>setShowNotifModal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'22px', maxWidth:'420px', width:'100%', padding:'28px', marginTop:'20px'}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700}}>🔔 Notifications</div>
              <button onClick={()=>setShowNotifModal(false)} style={{width:'30px', height:'30px', borderRadius:'8px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', cursor:'pointer'}}>✕</button>
            </div>

            {/* Email */}
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.72rem', fontWeight:700, color:'#a48bff', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'0.06em'}}>📧 Emails</div>
            {[
              {key:'emailRappel', label:'Rappels de révision', desc:'Reçois un email quand tu n\'as pas révisé depuis 2 jours'},
              {key:'emailBulletin', label:'Nouveau bulletin Pronote', desc:'Notification dès qu\'un nouveau bulletin est disponible'},
              {key:'emailParents', label:'Rapport parents', desc:'Rapport hebdomadaire envoyé aux parents'},
            ].map(n=>(
              <div key={n.key} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 0', borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <div>
                  <div style={{fontSize:'0.84rem', fontWeight:700, marginBottom:'2px'}}>{n.label}</div>
                  <div style={{fontSize:'0.72rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.4}}>{n.desc}</div>
                </div>
                <div onClick={()=>saveNotifs({...notifs, [n.key]:!notifs[n.key as keyof typeof notifs]})} style={{width:'44px', height:'24px', borderRadius:'100px', background:notifs[n.key as keyof typeof notifs]?'#7c5cfc':'#2a2740', cursor:'pointer', position:'relative', transition:'all 0.2s', flexShrink:0, marginLeft:'12px'}}>
                  <div style={{position:'absolute', top:'3px', left:notifs[n.key as keyof typeof notifs]?'23px':'3px', width:'18px', height:'18px', borderRadius:'50%', background:'white', transition:'all 0.2s'}}/>
                </div>
              </div>
            ))}

            {/* Push */}
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.72rem', fontWeight:700, color:'#a48bff', marginTop:'16px', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'0.06em'}}>📱 Notifications app</div>
            {[
              {key:'pushRevision', label:'Rappel de révision', desc:'Notification à l\'heure que tu choisiras'},
              {key:'pushXp', label:'XP et montées de niveau', desc:'Célèbre tes progrès'},
              {key:'pushAmis', label:'Défis amis', desc:'Quand un ami te lance un défi'},
            ].map(n=>(
              <div key={n.key} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 0', borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <div>
                  <div style={{fontSize:'0.84rem', fontWeight:700, marginBottom:'2px'}}>{n.label}</div>
                  <div style={{fontSize:'0.72rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.4}}>{n.desc}</div>
                </div>
                <div onClick={()=>saveNotifs({...notifs, [n.key]:!notifs[n.key as keyof typeof notifs]})} style={{width:'44px', height:'24px', borderRadius:'100px', background:notifs[n.key as keyof typeof notifs]?'#7c5cfc':'#2a2740', cursor:'pointer', position:'relative', transition:'all 0.2s', flexShrink:0, marginLeft:'12px'}}>
                  <div style={{position:'absolute', top:'3px', left:notifs[n.key as keyof typeof notifs]?'23px':'3px', width:'18px', height:'18px', borderRadius:'50%', background:'white', transition:'all 0.2s'}}/>
                </div>
              </div>
            ))}

            {/* Heure rappel */}
            <div style={{marginTop:'16px'}}>
              <label style={{...lbl, marginBottom:'8px'}}>⏰ Heure du rappel quotidien</label>
              <input type="time" value={notifs.rappelHeure} onChange={e=>saveNotifs({...notifs, rappelHeure:e.target.value})} style={{background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'9px 13px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.86rem', fontWeight:600, outline:'none', width:'100%', marginBottom:'12px'}}/>
              <label style={{...lbl, marginBottom:'8px'}}>📅 Fréquence</label>
              <select value={notifs.frequence} onChange={e=>saveNotifs({...notifs, frequence:e.target.value})} style={{background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'9px 13px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.86rem', fontWeight:600, outline:'none', width:'100%'}}>
                <option value="quotidien">Quotidien</option>
                <option value="3_par_semaine">3x par semaine</option>
                <option value="hebdo">Hebdomadaire</option>
              </select>
            </div>

            <button onClick={()=>setShowNotifModal(false)} style={{width:'100%', marginTop:'18px', padding:'12px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.92rem', cursor:'pointer'}}>
              ✅ Enregistrer
            </button>
          </div>
        </div>
      )}
      <BottomNav active="profil" />
    </div>
  )
}

