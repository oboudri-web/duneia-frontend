'use client'
import { useRouter } from 'next/navigation'

export default function ParentsLanding() {
  const router = useRouter()

  const temoignages = [
    { nom: 'Sophie M.', role: 'Maman de Lucas, 3ème', note: '⭐⭐⭐⭐⭐', texte: 'Mon fils a gagné 3 points de moyenne en 2 mois. Il révise maintenant sans qu\'on le lui demande.' },
    { nom: 'Thomas D.', role: 'Papa d\'Emma, 1ère', note: '⭐⭐⭐⭐⭐', texte: 'J\'ai annulé les cours particuliers. DuneIA fait le même travail pour 10x moins cher.' },
    { nom: 'Marie L.', role: 'Maman de Théo, Terminale', note: '⭐⭐⭐⭐⭐', texte: 'Le dashboard parents me permet de suivre sa progression sans le surveiller constamment.' },
  ]

  const comparatif = [
    { item: 'Cours particulier', prix: '40€/h', duneia: false },
    { item: 'Soutien scolaire', prix: '25€/h', duneia: false },
    { item: 'Plateforme concurrente', prix: '30€/mois', duneia: false },
    { item: 'DuneIA Annuel', prix: '79€/an (6,58€/mois)', duneia: true },
    { item: 'DuneIA Premium', prix: '9,99€/mois', duneia: true },
  ]

  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      {/* NAV */}
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'50px', paddingLeft:'24px', paddingRight:'24px', paddingBottom:'14px', display:'flex', alignItems:'center', gap:'14px'}}>
        <button onClick={()=>router.back()} style={{background:'transparent', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← Retour</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700, color:'#ffd166', cursor:'pointer'}} onClick={()=>router.push('/')}>🎓 DuneIA</div>
        <div style={{marginLeft:'auto', display:'flex', gap:'10px'}}>
          <button onClick={()=>router.push('/auth')} style={{background:'transparent', border:'2px solid #2a2740', borderRadius:'10px', color:'#f0eeff', padding:'8px 16px', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem', cursor:'pointer'}}>Connexion</button>
          <button onClick={()=>router.push('/paiement')} style={{background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', border:'none', borderRadius:'10px', color:'white', padding:'8px 18px', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem', cursor:'pointer'}}>Offrir DuneIA 🎁</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{padding:'80px 24px 60px', textAlign:'center', maxWidth:'760px', margin:'0 auto'}}>
        <div style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,209,102,0.1)', border:'1px solid rgba(255,209,102,0.3)', color:'#ffd166', fontSize:'0.78rem', fontWeight:800, padding:'6px 16px', borderRadius:'100px', marginBottom:'24px', textTransform:'uppercase', letterSpacing:'0.08em'}}>
          👨‍👩‍👧 Espace Parents
        </div>
        <h1 style={{fontFamily:'Fredoka,sans-serif', fontSize:'clamp(2.2rem,5vw,3.8rem)', fontWeight:700, lineHeight:1.1, marginBottom:'20px'}}>
          Votre enfant va enfin<br/>
          <span style={{background:'linear-gradient(135deg,#a48bff,#ff6b9d)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>progresser vraiment</span>
        </h1>
        <p style={{fontSize:'1.05rem', color:'rgba(240,238,255,0.75)', lineHeight:1.7, maxWidth:'580px', margin:'0 auto 36px', fontWeight:600}}>
          DuneIA connecte Pronote, analyse tout le compte de votre enfant et génère un plan de révision personnalisé. Sans cours particuliers. Sans surveiller.
        </p>
        <div style={{display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap'}}>
          <button onClick={()=>router.push('/paiement')} style={{padding:'16px 32px', borderRadius:'14px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'1rem', cursor:'pointer', boxShadow:'0 6px 28px rgba(124,92,252,0.4)'}}>
            🎁 Offrir DuneIA à mon enfant
          </button>
          <button onClick={()=>router.push('/auth')} style={{padding:'16px 32px', borderRadius:'14px', background:'transparent', border:'2px solid #2a2740', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'1rem', cursor:'pointer'}}>
            Créer un compte gratuit
          </button>
        </div>
        <p style={{fontSize:'0.8rem', color:'#8e8cb0', fontWeight:700, marginTop:'16px'}}>✅ Sans engagement · ↩️ Remboursé 14j · 🔒 Données sécurisées RGPD</p>
      </div>

      {/* STATS */}
      <div style={{padding:'0 24px 60px', maxWidth:'860px', margin:'0 auto'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'14px'}}>
          {[
            {v:'+2,8', u:'points', l:'de moyenne gagnés en moyenne'},
            {v:'4x', u:'moins cher', l:'qu\'un cours particulier'},
            {v:'87%', u:'des élèves', l:'révisent plus régulièrement'},
            {v:'14j', u:'satisfait', l:'ou remboursé sans question'},
          ].map((s,i)=>(
            <div key={i} style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'22px', textAlign:'center'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'2rem', fontWeight:700, background:'linear-gradient(135deg,#a48bff,#ff6b9d)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>{s.v}</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, color:'#f0eeff', margin:'4px 0'}}>{s.u}</div>
              <div style={{fontSize:'0.76rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.5}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* COMMENT CA MARCHE */}
      <div style={{padding:'0 24px 70px', maxWidth:'860px', margin:'0 auto'}}>
        <div style={{textAlign:'center', marginBottom:'40px'}}>
          <h2 style={{fontFamily:'Fredoka,sans-serif', fontSize:'clamp(1.6rem,3.5vw,2.4rem)', fontWeight:700, marginBottom:'12px'}}>Comment ça marche ?</h2>
          <p style={{color:'#8e8cb0', fontWeight:600, fontSize:'0.9rem'}}>3 étapes, 5 minutes de configuration</p>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'16px'}}>
          {[
            {n:'1', icon:'🎁', title:'Offrez l\'abonnement', desc:'Souscrivez en ligne en 2 minutes. Votre enfant reçoit un email d\'activation immédiatement.'},
            {n:'2', icon:'🔗', title:'Connexion Pronote', desc:'Votre enfant connecte son compte Pronote en 30 secondes. DuneIA récupère tout automatiquement.'},
            {n:'3', icon:'🧠', title:'L\'IA analyse tout', desc:'Notes, appréciations des profs, absences — DuneIA génère un plan de révision ultra-personnalisé.'},
            {n:'4', icon:'📊', title:'Vous suivez la progression', desc:'Dashboard parents en temps réel : alertes décrochage, rapport hebdo par email, évolution des notes.'},
          ].map((s,i)=>(
            <div key={i} style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'22px'}}>
              <div style={{width:'42px', height:'42px', borderRadius:'12px', background:'linear-gradient(135deg,rgba(124,92,252,0.2),rgba(255,107,157,0.1))', border:'2px solid rgba(124,92,252,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', marginBottom:'14px'}}>{s.icon}</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'8px'}}>{s.title}</div>
              <p style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7, margin:0}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* COMPARATIF PRIX */}
      <div style={{padding:'0 24px 70px', maxWidth:'680px', margin:'0 auto'}}>
        <div style={{textAlign:'center', marginBottom:'36px'}}>
          <h2 style={{fontFamily:'Fredoka,sans-serif', fontSize:'clamp(1.6rem,3.5vw,2.4rem)', fontWeight:700, marginBottom:'12px'}}>Le soutien scolaire intelligent</h2>
          <p style={{color:'#8e8cb0', fontWeight:600, fontSize:'0.9rem'}}>Disponible 24h/24, 7j/7, sans RDV</p>
        </div>
        <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', overflow:'hidden'}}>
          {comparatif.map((c,i)=>(
            <div key={i} style={{display:'flex', alignItems:'center', padding:'14px 20px', borderBottom:i<comparatif.length-1?'1px solid rgba(255,255,255,0.05)':'none', background:c.duneia?'rgba(124,92,252,0.08)':'transparent'}}>
              <div style={{flex:1, fontSize:'0.86rem', fontWeight:700, color:c.duneia?'#f0eeff':'#8e8cb0'}}>{c.item}</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:c.duneia?'#a48bff':'#8e8cb0', marginRight:'16px'}}>{c.prix}</div>
              {c.duneia ? (
                <div style={{background:'rgba(6,214,160,0.12)', border:'1px solid rgba(6,214,160,0.3)', color:'#06d6a0', fontSize:'0.7rem', fontWeight:800, padding:'3px 10px', borderRadius:'100px'}}>✅ Meilleur choix</div>
              ) : (
                <div style={{background:'rgba(239,71,111,0.08)', border:'1px solid rgba(239,71,111,0.2)', color:'#ef476f', fontSize:'0.7rem', fontWeight:800, padding:'3px 10px', borderRadius:'100px'}}>💸 Cher</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DASHBOARD PARENTS */}
      <div style={{padding:'0 24px 70px', maxWidth:'860px', margin:'0 auto'}}>
        <div style={{background:'linear-gradient(135deg,rgba(124,92,252,0.12),rgba(255,107,157,0.06))', border:'2px solid rgba(124,92,252,0.3)', borderRadius:'22px', padding:'36px'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'40px', alignItems:'center'}}>
            <div>
              <div style={{display:'inline-flex', alignItems:'center', gap:'6px', background:'rgba(124,92,252,0.15)', border:'1px solid rgba(124,92,252,0.3)', color:'#a48bff', fontSize:'0.72rem', fontWeight:800, padding:'4px 12px', borderRadius:'100px', marginBottom:'16px', textTransform:'uppercase', letterSpacing:'0.06em'}}>📊 Dashboard Parents</div>
              <h2 style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.6rem', fontWeight:700, marginBottom:'14px', lineHeight:1.2}}>Suivez la progression de votre enfant</h2>
              <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                {[
                  '🔔 Alertes décrochage en temps réel',
                  '📧 Rapport hebdomadaire par email',
                  '📊 Évolution des notes par matière',
                  '📚 Suivi du programme scolaire',
                  '🎯 Plan de révision généré par l\'IA',
                  '💬 Messagerie parent ↔ enfant',
                ].map((f,i)=>(
                  <div key={i} style={{fontSize:'0.84rem', fontWeight:700, color:'#f0eeff'}}>{f}</div>
                ))}
              </div>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              {[
                {matiere:'Mathématiques', note:'13,5', trend:'↑ +2,5', color:'#06d6a0'},
                {matiere:'Français', note:'11,0', trend:'↑ +1,0', color:'#ffd166'},
                {matiere:'Histoire-Géo', note:'9,5', trend:'⚠️ En baisse', color:'#ef476f'},
                {matiere:'Anglais', note:'14,0', trend:'↑ +0,5', color:'#06d6a0'},
              ].map((m,i)=>(
                <div key={i} style={{background:'rgba(255,255,255,0.05)', borderRadius:'11px', padding:'10px 14px', display:'flex', alignItems:'center', gap:'10px'}}>
                  <div style={{flex:1, fontSize:'0.8rem', fontWeight:700}}>{m.matiere}</div>
                  <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, color:m.color}}>{m.note}</div>
                  <div style={{fontSize:'0.7rem', fontWeight:700, color:m.color}}>{m.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TÉMOIGNAGES */}
      <div style={{padding:'0 24px 70px', maxWidth:'860px', margin:'0 auto'}}>
        <div style={{textAlign:'center', marginBottom:'36px'}}>
          <h2 style={{fontFamily:'Fredoka,sans-serif', fontSize:'clamp(1.6rem,3.5vw,2.4rem)', fontWeight:700}}>Ce que disent les parents</h2>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'16px'}}>
          {temoignages.map((t,i)=>(
            <div key={i} style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'22px'}}>
              <div style={{fontSize:'1rem', marginBottom:'10px'}}>{t.note}</div>
              <p style={{fontSize:'0.84rem', color:'#f0eeff', fontWeight:600, lineHeight:1.7, fontStyle:'italic', marginBottom:'14px'}}>"{t.texte}"</p>
              <div style={{fontSize:'0.78rem', fontWeight:800, color:'#a48bff'}}>{t.nom}</div>
              <div style={{fontSize:'0.72rem', color:'#8e8cb0', fontWeight:600}}>{t.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MÉTHODE SOCRATIQUE */}
      <div style={{padding:'0 24px 70px', maxWidth:'860px', margin:'0 auto'}}>
        <div style={{background:'linear-gradient(135deg,#1a1040,#15102a)', border:'2px solid rgba(124,92,252,0.4)', borderRadius:'26px', padding:'40px 32px'}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(6,214,160,0.1)', border:'1px solid rgba(6,214,160,0.3)', color:'#06d6a0', fontSize:'0.75rem', fontWeight:800, padding:'6px 16px', borderRadius:'100px', marginBottom:'20px', textTransform:'uppercase', letterSpacing:'0.08em'}}>
            🧠 Pourquoi pas ChatGPT ?
          </div>
          <h2 style={{fontFamily:'Fredoka,sans-serif', fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:700, marginBottom:'16px', lineHeight:1.2}}>
            DuneIA ne donne jamais les réponses à votre enfant
          </h2>
          <p style={{fontSize:'0.9rem', color:'rgba(240,238,255,0.75)', lineHeight:1.8, marginBottom:'24px', fontWeight:600}}>
            ChatGPT ou Claude donnent la solution en 10 secondes. Votre enfant recopie, rend son devoir, et oublie le lendemain. Rien n'a été appris.
          </p>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'24px'}}>
            <div style={{background:'rgba(239,71,111,0.06)', border:'2px solid rgba(239,71,111,0.2)', borderRadius:'16px', padding:'18px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, color:'#ef476f', marginBottom:'12px'}}>❌ ChatGPT / Claude</div>
              {[
                'Donne la réponse directement',
                "L'élève recopie sans comprendre",
                '20-24€/mois, outil généraliste',
                'Aucun suivi de progression',
                'Non adapté au programme FR',
              ].map((t,i)=>(
                <div key={i} style={{display:'flex', gap:'8px', marginBottom:'7px', fontSize:'0.8rem', fontWeight:600, color:'rgba(240,238,255,0.6)'}}>
                  <span style={{color:'#ef476f', flexShrink:0}}>✗</span>{t}
                </div>
              ))}
            </div>
            <div style={{background:'rgba(6,214,160,0.06)', border:'2px solid rgba(6,214,160,0.3)', borderRadius:'16px', padding:'18px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, color:'#06d6a0', marginBottom:'12px'}}>✅ DuneIA</div>
              {[
                'Pose des questions, jamais de réponse',
                "L'élève comprend et retient vraiment",
                'A partir de 6,58 euros/mois, pense pour l ecole',
                'Connecte a Pronote, suivi continu',
                'Aligné sur les programmes officiels',
              ].map((t,i)=>(
                <div key={i} style={{display:'flex', gap:'8px', marginBottom:'7px', fontSize:'0.8rem', fontWeight:600, color:'rgba(240,238,255,0.8)'}}>
                  <span style={{color:'#06d6a0', flexShrink:0}}>✓</span>{t}
                </div>
              ))}
            </div>
          </div>
          <div style={{background:'rgba(255,209,102,0.08)', border:'2px solid rgba(255,209,102,0.2)', borderRadius:'14px', padding:'18px'}}>
            <div style={{fontSize:'0.75rem', fontWeight:800, color:'#ffd166', marginBottom:'8px'}}>💡 La méthode socratique en pratique</div>
            <p style={{fontSize:'0.84rem', color:'#f0eeff', fontWeight:600, lineHeight:1.8, margin:0}}>
              Quand votre enfant bloque sur un exercice de maths, DuneIA ne lui donne pas la formule. Il lui demande : <em style={{color:'#ffd166'}}>"Qu'est-ce que tu sais déjà sur ce type de problème ?"</em> puis <em style={{color:'#ffd166'}}>"Quel théorème pourrait t'aider ici ?"</em>. L'élève réfléchit, cherche, et trouve lui-même. Il s'en souvient le jour du contrôle.
            </p>
          </div>
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{padding:'0 24px 80px', maxWidth:'680px', margin:'0 auto', textAlign:'center'}}>
        <div style={{background:'linear-gradient(135deg,#1a1040,#15102a)', border:'2px solid rgba(124,92,252,0.4)', borderRadius:'26px', padding:'52px 36px'}}>
          <div style={{fontSize:'2.5rem', marginBottom:'16px'}}>🎁</div>
          <h2 style={{fontFamily:'Fredoka,sans-serif', fontSize:'clamp(1.6rem,3.5vw,2.4rem)', fontWeight:700, marginBottom:'13px', lineHeight:1.2}}>Offrez le meilleur outil scolaire à votre enfant</h2>
          <p style={{fontSize:'0.9rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7, marginBottom:'28px', maxWidth:'420px', marginLeft:'auto', marginRight:'auto'}}>Moins cher qu'une heure de cours particulier. Disponible 24h/24. Sans engagement.</p>
          <button onClick={()=>router.push('/paiement')} style={{padding:'16px 40px', borderRadius:'14px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'1.05rem', cursor:'pointer', boxShadow:'0 6px 28px rgba(124,92,252,0.4)', marginBottom:'14px', display:'block', width:'100%'}}>
            🎁 Offrir DuneIA — à partir de 6,58€/mois
          </button>
          <button onClick={()=>router.push('/auth')} style={{padding:'12px 40px', borderRadius:'14px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.92rem', cursor:'pointer', width:'100%'}}>
            Essayer gratuitement d'abord
          </button>
          <p style={{fontSize:'0.76rem', color:'#8e8cb0', fontWeight:700, marginTop:'14px'}}>✅ Gratuit · 🔥 Annuel 79€/an · ⭐ Premium 9,99€/mois · 👨‍👩‍👧 Famille 14,99€/mois · ❌ Sans engagement</p>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{borderTop:'1px solid #2a2740', padding:'28px 24px', textAlign:'center'}}>
        <div style={{fontSize:'0.78rem', color:'#8e8cb0', fontWeight:600}}>© 2026 DuneIA · <span style={{cursor:'pointer'}} onClick={()=>router.push('/mentions')}>Mentions légales</span> · <span style={{cursor:'pointer'}} onClick={()=>router.push('/confidentialite')}>Confidentialité</span> · <span style={{cursor:'pointer'}} onClick={()=>router.push('/cgv')}>CGV</span></div>
      </footer>
    </div>
  )
}
