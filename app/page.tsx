'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Landing() {
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number|null>(null)

  return (
    <div style={{position:'relative', zIndex:1}}>
      {/* NAV */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        paddingTop:'50px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px',
        display:'flex', alignItems:'center', gap:'12px',
        background:'rgba(10,9,20,0.95)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.5rem', fontWeight:700, color:'#ffd166', display:'flex', alignItems:'center', gap:'8px'}}>
          <img src="/dune-mascotte.png" style={{width:"32px",height:"32px",objectFit:"contain"}} alt="Dune"/> DuneIA
        </div>
        <div style={{marginLeft:'auto', display:'flex', gap:'10px'}}>
          <button onClick={()=>router.push('/auth')} style={{
            background:'rgba(255,255,255,0.06)', border:'2px solid rgba(255,255,255,0.15)',
            color:'#f0eeff', borderRadius:'10px', padding:'8px 16px',
            fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem', cursor:'pointer'
          }}>Connexion</button>
          <button onClick={()=>router.push('/auth?tab=signup')} style={{
            background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white',
            border:'none', borderRadius:'10px', padding:'8px 18px',
            fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem', cursor:'pointer',
            boxShadow:'0 4px 16px rgba(124,92,252,0.3)'
          }}>Essai gratuit 🚀</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'160px 24px 80px'}}>
        <div style={{maxWidth:'100%'}}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            background:'rgba(255,209,102,0.1)', border:'1px solid rgba(255,209,102,0.3)',
            color:'#ffd166', fontSize:'0.75rem', fontWeight:800,
            textTransform:'uppercase', letterSpacing:'0.1em',
            padding:'6px 16px', borderRadius:'100px', marginBottom:'28px'
          }}>
            🔗 Connecté à Pronote & EcoleDirecte — Conforme RGPD
          </div>

          <h1 style={{fontFamily:'Fredoka,sans-serif', fontSize:'clamp(2.8rem,7vw,5rem)', fontWeight:700, lineHeight:1.05, marginBottom:'20px'}}>
            Tes notes vont<br/>
            <span style={{background:'linear-gradient(135deg,#a48bff,#ff6b9d)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
              monter en niveau
            </span><br/>
            <span style={{color:'#ffd166'}}>pour de vrai 🚀</span>
          </h1>

          <p style={{fontSize:'1.05rem', color:'rgba(240,238,255,0.72)', lineHeight:1.7, maxWidth:'520px', margin:'0 auto 36px', fontWeight:600}}>
            Connecte ton Pronote ou EcoleDirecte en 30 secondes. DuneIA analyse tout ton compte — notes, appréciations des profs, devoirs rendus, absences — et génère un plan de révision au millimètre. Sans rien saisir à la main.
          </p>

          <div style={{display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap', marginBottom:'48px'}}>
            <button onClick={()=>router.push('/auth?tab=signup')} style={{
              padding:'16px 32px', borderRadius:'14px', border:'none',
              background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white',
              fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'1rem', cursor:'pointer',
              boxShadow:'0 6px 28px rgba(124,92,252,0.4)'
            }}>🎮 Commencer gratuitement</button>
            <a href="https://duneia-frontend.vercel.app/auth" style={{
              padding:'16px 32px', borderRadius:'14px',
              background:'transparent', border:'2px solid #2a2740',
              color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'1rem', cursor:'pointer',
              textDecoration:'none', display:'inline-block'
            }}>Voir comment ça marche</a>
          </div>

          <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'20px', fontSize:'0.8rem', color:'rgba(240,238,255,0.65)', fontWeight:700, flexWrap:'wrap'}}>
            <span>✅ Essai gratuit sans CB</span>
            <span>🔒 Données en France</span>
            <span>⭐ 4,9/5 sur 200+ avis</span>
            <span>🎓 6ème → Terminale</span>
          </div>
          <div style={{marginTop:'20px'}}>
            <a href="https://duneia-frontend.vercel.app/pour-les-parents" style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,209,102,0.08)', border:'2px solid rgba(255,209,102,0.25)', borderRadius:'100px', padding:'14px 28px', color:'#ffd166', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'1rem', textDecoration:'none', cursor:'pointer'}}>
              👨‍👩‍👧 Vous êtes parent ? Espace dédié →
            </a>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{padding:'60px 16px', maxWidth:'100%', margin:'0 auto'}} id="features">
        <div style={{textAlign:'center', marginBottom:'50px'}}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'6px',
            background:'rgba(124,92,252,0.18)', border:'1px solid rgba(124,92,252,0.35)',
            color:'#a48bff', fontSize:'0.72rem', fontWeight:800,
            textTransform:'uppercase', letterSpacing:'0.1em',
            padding:'5px 14px', borderRadius:'100px', marginBottom:'16px'
          }}>⚡ Fonctionnalités</div>
          <h2 style={{fontFamily:'Fredoka,sans-serif', fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:700, marginBottom:'14px'}}>
            Ce que DuneIA analyse pour toi
          </h2>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))', gap:'14px'}}>
          {[
            {icon:'🔗', bg:'rgba(124,92,252,0.2)', title:'Sync Pronote & EcoleDirecte', desc:'Notes, appréciations, devoirs rendus, absences — tout ton compte récupéré en 30 secondes automatiquement.', tag:'AUTO'},
            {icon:'🧠', bg:'rgba(6,214,160,0.2)', title:'Plan IA 3 semaines', desc:'L\'IA croise toutes tes données et génère un plan de révision ultra-précis, semaine par semaine.', tag:'IA'},
            {icon:'🎯', bg:'rgba(255,209,102,0.2)', title:'Annales + Oral IA', desc:'Exercices d\'annales corrigés par l\'IA et entraînement à l\'oral avec un examinateur virtuel.', tag:'PREMIUM'},
            {icon:'🧬', bg:'rgba(255,107,157,0.2)', title:'ADN Scolaire', desc:'Profil cognitif complet : tes forces cachées, tes vrais blocages, ton archétype d\'élève.', tag:'PREMIUM'},
            {icon:'📸', bg:'rgba(255,159,28,0.2)', title:'Scanner de copie', desc:'Prends ta copie corrigée en photo. L\'IA lit les annotations du prof et génère un plan de rattrapage.', tag:'PREMIUM'},
            {icon:'👨‍👩‍👧', bg:'rgba(17,138,178,0.2)', title:'Dashboard parents', desc:'Alertes décrochage, rapport hebdo, messagerie — les parents voient tout en temps réel.', tag:'PREMIUM'},
            {icon:'🎮', bg:'rgba(255,107,157,0.2)', title:'Jeux éducatifs', desc:'Speed Quiz, Duel entre amis, Défi du jour — apprends en jouant et gagne des XP.', tag:'NOUVEAU'},
            {icon:'📚', bg:'rgba(255,209,102,0.2)', title:'Annales IA', desc:'Exercices style brevet et bac generés et corrigés par l IA avec explications détaillées.', tag:'PREMIUM'},
            {icon:'🎤', bg:'rgba(124,92,252,0.2)', title:'Oral IA', desc:'Un examinateur IA te pose des questions et te donne une note sur 20 avec justification.', tag:'PREMIUM'},
            {icon:'📈', bg:'rgba(6,214,160,0.2)', title:'Prédiction de notes', desc:'L IA predit tes notes de fin d annee matiere par matiere avec un score de confiance.', tag:'PREMIUM'},
            {icon:'🃏', bg:'rgba(255,107,157,0.2)', title:'Flashcards IA', desc:'Cartes mémo avec répétition espacée. Mémorise formules, dates et définitions facilement.', tag:'GRATUIT'},
          ].map((f,i) => (
            <div key={i} style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'22px', transition:'all 0.3s'}}>
              <div style={{width:'46px', height:'46px', borderRadius:'13px', background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', marginBottom:'13px'}}>{f.icon}</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.98rem', fontWeight:600, marginBottom:'6px'}}>{f.title}</div>
              <p style={{fontSize:'0.8rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.6, marginBottom:'10px'}}>{f.desc}</p>
              <span style={{
                display:'inline-flex', fontSize:'0.66rem', fontWeight:800,
                textTransform:'uppercase', letterSpacing:'0.06em', padding:'3px 9px', borderRadius:'100px',
                background: f.tag==='AUTO'?'rgba(6,214,160,0.12)':f.tag==='IA'?'rgba(124,92,252,0.12)':'rgba(255,209,102,0.12)',
                color: f.tag==='AUTO'?'#06d6a0':f.tag==='IA'?'#a48bff':'#ffd166',
                border: `1px solid ${f.tag==='AUTO'?'rgba(6,214,160,0.25)':f.tag==='IA'?'rgba(124,92,252,0.25)':'rgba(255,209,102,0.25)'}`
              }}>{f.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{padding:'60px 16px', maxWidth:'100%', margin:'0 auto'}}>
        <div style={{textAlign:'center', marginBottom:'50px'}}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'6px',
            background:'rgba(124,92,252,0.18)', border:'1px solid rgba(124,92,252,0.35)',
            color:'#a48bff', fontSize:'0.72rem', fontWeight:800,
            textTransform:'uppercase', letterSpacing:'0.1em',
            padding:'5px 14px', borderRadius:'100px', marginBottom:'16px'
          }}>💳 Tarifs simples</div>
          <h2 style={{fontFamily:'Fredoka,sans-serif', fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:700}}>

      {/* MÉTHODE SOCRATIQUE */}
      <div style={{padding:'60px 16px', maxWidth:'860px', margin:'0 auto'}}>
        <div style={{background:'linear-gradient(135deg,#1a1040,#15102a)', border:'2px solid rgba(124,92,252,0.4)', borderRadius:'26px', padding:'48px 36px', textAlign:'center'}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(6,214,160,0.1)', border:'1px solid rgba(6,214,160,0.3)', color:'#06d6a0', fontSize:'0.75rem', fontWeight:800, padding:'6px 16px', borderRadius:'100px', marginBottom:'20px', textTransform:'uppercase', letterSpacing:'0.08em'}}>
            Notre philosophie
          </div>
          <h2 style={{fontFamily:'Fredoka,sans-serif', fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:700, marginBottom:'16px', lineHeight:1.2}}>
            DuneIA ne donne jamais les reponses
          </h2>
          <p style={{fontSize:'1rem', color:'rgba(240,238,255,0.75)', lineHeight:1.8, maxWidth:'580px', margin:'0 auto 36px', fontWeight:600}}>
            ChatGPT donne la reponse en 10 secondes. L eleve recopie et oublie le lendemain. DuneIA utilise la methode socratique — l IA pose des questions pour guider l eleve vers la comprehension. Il trouve la reponse lui-meme. Il s en souvient vraiment.
          </p>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'36px', textAlign:'left'}}>
            <div style={{background:'rgba(239,71,111,0.06)', border:'2px solid rgba(239,71,111,0.2)', borderRadius:'16px', padding:'20px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:'#ef476f', marginBottom:'12px'}}>ChatGPT / Claude</div>
              {['Donne la reponse directement','L eleve recopie sans comprendre','Aucune personnalisation scolaire','20-24 euros/mois pour un outil generaliste','Aucun suivi de progression'].map((t,i)=>(
                <div key={i} style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', fontSize:'0.82rem', fontWeight:600, color:'rgba(240,238,255,0.6)'}}><span style={{color:'#ef476f', flexShrink:0}}>X</span> {t}</div>
              ))}
            </div>
            <div style={{background:'rgba(6,214,160,0.06)', border:'2px solid rgba(6,214,160,0.3)', borderRadius:'16px', padding:'20px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:'#06d6a0', marginBottom:'12px'}}>DuneIA</div>
              {['Guide avec des questions, jamais de reponse','L eleve comprend et retient vraiment','Connecte a Pronote, adapte a sa classe','9,99 euros/mois pense pour l apprentissage','Suivi des progres et plan personnalise'].map((t,i)=>(
                <div key={i} style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', fontSize:'0.82rem', fontWeight:600, color:'rgba(240,238,255,0.8)'}}><span style={{color:'#06d6a0', flexShrink:0}}>OK</span> {t}</div>
              ))}
            </div>
          </div>
          <button onClick={()=>router.push('/auth')} style={{padding:'16px 40px', borderRadius:'14px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'1rem', cursor:'pointer', boxShadow:'0 6px 28px rgba(124,92,252,0.4)'}}>
            Essayer le tuteur IA gratuitement
          </button>
        </div>
      </div>
            Un seul prix, zéro surprise
          </h2>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'18px'}}>
          {/* GRATUIT */}
          <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'20px', padding:'26px'}}>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'5px'}}>🆓 Gratuit</div>
            <div style={{display:'flex', alignItems:'baseline', gap:'4px', margin:'12px 0'}}>
              <span style={{fontFamily:'Fredoka,sans-serif', fontSize:'2.6rem', fontWeight:700}}>0€</span>
              <span style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:700}}>/mois</span>
            </div>
            <p style={{fontSize:'0.78rem', color:'#8e8cb0', fontWeight:600, marginBottom:'18px', lineHeight:1.5}}>Pour voir la puissance de DuneIA avant de s'abonner.</p>
            <ul style={{listStyle:'none', display:'flex', flexDirection:'column', gap:'8px', marginBottom:'22px'}}>
              {['Sync Pronote / EcoleDirecte','Plan IA 1 semaine','5 questions tuteur/jour','3 imports cours photo','XP, badges et streaks'].map(f=>(
                <li key={f} style={{fontSize:'0.81rem', fontWeight:700, display:'flex', alignItems:'center', gap:'7px'}}><span style={{color:'#06d6a0'}}>✅</span> {f}</li>
              ))}
              {['Annales, Prédiction, Oral IA','ADN scolaire & Scanner','Dashboard parents'].map(f=>(
                <li key={f} style={{fontSize:'0.81rem', fontWeight:700, display:'flex', alignItems:'center', gap:'7px', color:'#8e8cb0', opacity:0.5}}><span>✗</span> {f}</li>
              ))}
            </ul>
            <button onClick={()=>router.push('/auth?tab=signup')} style={{width:'100%', padding:'12px', borderRadius:'11px', background:'transparent', border:'2px solid #2a2740', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.9rem', cursor:'pointer'}}>Commencer gratuitement</button>
          </div>
          {/* PREMIUM */}
          <div style={{background:'linear-gradient(160deg,#1a1535,#12102a)', border:'2px solid rgba(124,92,252,0.55)', borderRadius:'20px', padding:'26px', position:'relative', boxShadow:'0 8px 40px rgba(124,92,252,0.25)'}}>
            <div style={{position:'absolute', top:'14px', right:'14px', background:'#7c5cfc', color:'white', fontSize:'0.62rem', fontWeight:900, letterSpacing:'0.06em', padding:'3px 9px', borderRadius:'100px'}}>⭐ POPULAIRE</div>
            {/* Plan Annuel */}
            <div style={{background:'linear-gradient(135deg,rgba(255,209,102,0.12),rgba(255,159,28,0.06))', border:'2px solid rgba(255,209,102,0.4)', borderRadius:'18px', padding:'20px', marginBottom:'14px', position:'relative'}}>
              <div style={{position:'absolute', top:'-11px', left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#ffd166,#ff9f1c)', borderRadius:'100px', padding:'3px 14px', fontSize:'0.7rem', fontWeight:900, color:'#0a0914', whiteSpace:'nowrap'}}>
                🔥 2 MOIS OFFERTS
              </div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'5px', color:'#ffd166'}}>🔥 Premium Annuel</div>
              <div style={{display:'flex', alignItems:'baseline', gap:'4px', marginBottom:'4px'}}>
                <span style={{fontFamily:'Fredoka,sans-serif', fontSize:'2.6rem', fontWeight:700, color:'#ffd166'}}>79€</span>
                <span style={{fontSize:'0.85rem', color:'#8e8cb0', fontWeight:700}}>/an</span>
              </div>
              <div style={{fontSize:'0.75rem', color:'#8e8cb0', fontWeight:700, marginBottom:'12px'}}>soit 6,58€/mois — économise 41€</div>
              <button onClick={()=>router.push('/paiement?plan=annuel')} style={{width:'100%', padding:'12px', borderRadius:'11px', background:'linear-gradient(135deg,#ffd166,#ff9f1c)', color:'#0a0914', border:'none', fontFamily:'Nunito,sans-serif', fontWeight:900, fontSize:'0.9rem', cursor:'pointer'}}>Choisir le plan annuel</button>
            </div>

            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'5px', color:'#a48bff'}}>⭐ Premium</div>
            <div style={{display:'flex', alignItems:'baseline', gap:'4px', margin:'12px 0'}}>
              <span style={{fontFamily:'Fredoka,sans-serif', fontSize:'2.6rem', fontWeight:700, color:'#c4b5fd'}}>9,99€</span>
              <span style={{fontSize:'0.82rem', color:'rgba(240,238,255,0.6)', fontWeight:700}}>/mois</span>
            </div>
            <p style={{fontSize:'0.78rem', color:'rgba(240,238,255,0.65)', fontWeight:600, marginBottom:'18px', lineHeight:1.5}}>Pour 1 élève. Sync Pronote & EcoleDirecte illimitée. Sans engagement.</p>
            <ul style={{listStyle:'none', display:'flex', flexDirection:'column', gap:'8px', marginBottom:'22px'}}>
              {['Sync Pronote & EcoleDirecte','Analyse complète du compte','Plan IA 3 semaines détaillé','Tuteur IA illimité 24h/24','Annales IA + correction','Prédiction de notes','Entraînement oral IA','ADN scolaire + Scanner copie','Dashboard parents inclus','Import cours illimité (OCR)'].map(f=>(
                <li key={f} style={{fontSize:'0.81rem', fontWeight:700, display:'flex', alignItems:'center', gap:'7px', color:'#f0eeff'}}><span style={{color:'#06d6a0'}}>✅</span> {f}</li>
              ))}
            </ul>
            <button onClick={()=>router.push('/auth?tab=signup')} style={{width:'100%', padding:'12px', borderRadius:'11px', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', border:'none', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.9rem', cursor:'pointer', boxShadow:'0 4px 16px rgba(124,92,252,0.3)'}}>Commencer — 9,99€/mois</button>
          </div>
          {/* FAMILLE */}
          <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'20px', padding:'26px'}}>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'5px'}}>👨‍👩‍👧 Famille</div>
            <div style={{display:'flex', alignItems:'baseline', gap:'4px', margin:'12px 0'}}>
              <span style={{fontFamily:'Fredoka,sans-serif', fontSize:'2.6rem', fontWeight:700, color:'#ffd166'}}>14,99€</span>
              <span style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:700}}>/mois</span>
            </div>
            <p style={{fontSize:'0.78rem', color:'#8e8cb0', fontWeight:600, marginBottom:'18px', lineHeight:1.5}}>Jusqu'à 3 enfants. Tout le Premium multiplié.</p>
            <ul style={{listStyle:'none', display:'flex', flexDirection:'column', gap:'8px', marginBottom:'22px'}}>
              {['Tout le plan Premium','3 profils élèves indépendants','Sync Pronote & EcoleDirecte','Dashboard parents unifié','Alertes décrochage temps réel','Rapport email hebdomadaire','Messagerie parent ↔ enfant','Support prioritaire'].map(f=>(
                <li key={f} style={{fontSize:'0.81rem', fontWeight:700, display:'flex', alignItems:'center', gap:'7px'}}><span style={{color:'#06d6a0'}}>✅</span> {f}</li>
              ))}
            </ul>
            <button onClick={()=>router.push('/auth?tab=signup')} style={{width:'100%', padding:'12px', borderRadius:'11px', background:'transparent', border:'2px solid #2a2740', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.9rem', cursor:'pointer'}}>Choisir Famille</button>
          </div>
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{textAlign:'center', padding:'60px 16px'}}>
        <div style={{maxWidth:'100%', margin:'0 auto', background:'linear-gradient(135deg,#1a1040,#15102a)', border:'2px solid rgba(124,92,252,0.4)', borderRadius:'26px', padding:'52px 36px'}}>
          <h2 style={{fontFamily:'Fredoka,sans-serif', fontSize:'clamp(1.7rem,4vw,2.6rem)', fontWeight:700, marginBottom:'13px', lineHeight:1.2}}>
            Connecte ton Pronote ou EcoleDirecte<br/>et progresse vraiment 🚀
          </h2>
          <p style={{fontSize:'0.9rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7, marginBottom:'28px', maxWidth:'420px', marginLeft:'auto', marginRight:'auto'}}>
            DuneIA analyse tout ton compte Pronote ou EcoleDirecte et génère un plan au millimètre. Sans rien saisir à la main. Sans carte bancaire.
          </p>
          <button onClick={()=>router.push('/auth?tab=signup')} style={{padding:'16px 32px', borderRadius:'14px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'1rem', cursor:'pointer', boxShadow:'0 6px 28px rgba(124,92,252,0.4)'}}>
            🚀 Commencer gratuitement
          </button>
          <div style={{marginTop:'14px', fontSize:'0.76rem', color:'#8e8cb0', fontWeight:700}}>
            ✅ Gratuit · 🔥 Annuel 79€/an · ⭐ Premium 9,99€/mois · ❌ Sans engagement
          </div>
        </div>
      </div>

      {/* DUNE MASCOTTE */}
      <div style={{position:'fixed', bottom:'24px', right:'16px', zIndex:99999, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px'}}>
        <img src="/dune-mascotte.png" alt="Dune" onClick={()=>router.push('/auth?tab=signup')} style={{width:'90px', height:'90px', objectFit:'contain', cursor:'pointer', animation:'bounce 2s infinite', filter:'drop-shadow(0 4px 12px rgba(124,92,252,0.5))'}}/>
        <div style={{background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', borderRadius:'12px', padding:'8px 12px', fontSize:'0.75rem', fontWeight:800, boxShadow:'0 4px 20px rgba(124,92,252,0.4)', textAlign:'center', lineHeight:1.4}}>
          Essai gratuit 🚀<br/><span style={{fontSize:'0.68rem', opacity:0.85}}>Sans CB requis</span>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: "@keyframes bounce { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }"}} />
      {/* FOOTER */}
      {/* FAQ */}
      <div style={{padding:'60px 16px', maxWidth:'760px', margin:'0 auto'}}>
        <div style={{textAlign:'center', marginBottom:'40px'}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:'6px', background:'rgba(124,92,252,0.18)', border:'1px solid rgba(124,92,252,0.35)', color:'#a48bff', fontSize:'0.72rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', padding:'5px 14px', borderRadius:'100px', marginBottom:'16px'}}>❓ FAQ</div>
          <h2 style={{fontFamily:'Fredoka,sans-serif', fontSize:'clamp(1.6rem,3.5vw,2.4rem)', fontWeight:700}}>Questions fréquentes</h2>
        </div>
        {[
          {q:"Pourquoi DuneIA plutôt que ChatGPT ou Claude ?", a:"ChatGPT et Claude donnent la réponse directement — ils empêchent la vraie compréhension. DuneIA utilise la méthode socratique : guide sans donner la réponse. ChatGPT Plus 20€/mois, Claude 24€/mois sans personnalisation. DuneIA 2x moins cher, connecté à Pronote."},
          {q:"Comment DuneIA se connecte à Pronote ?", a:"Entrez vos identifiants Pronote habituels. DuneIA récupère notes, appréciations, devoirs en 30 secondes. Identifiants chiffrés AES-256, jamais stockés en clair."},
          {q:"DuneIA fait-il les devoirs à la place ?", a:"Non — cest le contraire. DuneIA pose des questions pour guider vers la compréhension. Jamais de réponse directe."},
          {q:"Puis-je résilier à tout moment ?", a:"Oui, sans engagement. Résiliation en un clic depuis le profil. Remboursement sous 14 jours."},
          {q:"Mes données sont-elles sécurisées ?", a:"Oui. Hébergées en France, conformes RGPD. Identifiants Pronote chiffrés, jamais partagés. Aucun tracking."},
          {q:"DuneIA fonctionne avec EcoleDirecte ?", a:"En cours de développement. Actuellement connecté à Pronote (18 millions élèves). Saisie manuelle ou photo de bulletin disponibles."},
        ].map((item, i) => (
          <div key={i} style={{borderBottom:'1px solid #2a2740', padding:'20px 0'}}>
            <div onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:'#f0eeff', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'12px'}}>
              {item.q}
              <span style={{color:'#7c5cfc', fontSize:'1.2rem', flexShrink:0, transition:'transform 0.3s', transform:openFaq===i?'rotate(45deg)':'rotate(0deg)'}}>+</span>
            </div>
            {openFaq===i && (
              <p style={{fontSize:'0.85rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.8, margin:'12px 0 0'}}>{item.a}</p>
            )}
          </div>
        ))}
      </div>

      <footer style={{borderTop:'1px solid #2a2740', padding:'36px 24px', textAlign:'center', background:'#0a0914'}}>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700, color:'#ffd166', marginBottom:'14px'}}><img src="/dune-mascotte.png" style={{width:"32px",height:"32px",objectFit:"contain"}} alt="Dune"/> DuneIA</div>
        <div style={{display:'flex', gap:'18px', justifyContent:'center', flexWrap:'wrap', marginBottom:'14px'}}>
          {[
            {label:'Mentions légales', url:'https://duneia-frontend.vercel.app/mentions'},
            {label:'CGV', url:'https://duneia-frontend.vercel.app/cgv'},
            {label:'Confidentialité', url:'https://duneia-frontend.vercel.app/confidentialite'},
          ].map(l=>(
            <a key={l.label} href={l.url} style={{color:'#8e8cb0', fontSize:'0.8rem', fontWeight:700, cursor:'pointer', textDecoration:'none'}}>{l.label}</a>
          ))}
        </div>
        <div style={{fontSize:'0.72rem', color:'#8e8cb0', fontWeight:600}}>
          © 2026 DuneIA — Propulsé par Claude IA 🤖 — Hébergé en France 🇫🇷
        </div>
      </footer>
    </div>
  )
}
