'use client'
import { useRouter } from 'next/navigation'

export default function Confidentialite() {
  const router = useRouter()
  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.95)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', padding:'12px 16px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>router.back()} style={{background:'transparent', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← Retour</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>🎓 DuneIA</div>
      </nav>
      <div style={{maxWidth:'700px', margin:'0 auto', padding:'32px 16px'}}>
        <h1 style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.8rem', fontWeight:700, marginBottom:'24px'}}>Politique de Confidentialité</h1>
        {[
          {title:'1. Responsable du traitement', content:'DuneIA est responsable du traitement de vos données personnelles. Contact : hello@duneia.fr'},
          {title:'2. Données collectées', content:'Nous collectons : votre email, prénom, classe, et les données scolaires issues de Pronote (notes, appréciations). Vos identifiants Pronote sont chiffrés en transit et ne sont jamais stockés.'},
          {title:'3. Finalité du traitement', content:'Vos données sont utilisées pour personnaliser votre expérience d\'apprentissage, générer des plans de révision et analyser votre progression scolaire.'},
          {title:'4. Base légale', content:'Le traitement est basé sur votre consentement explicite lors de l\'inscription et l\'exécution du contrat de service.'},
          {title:'5. Conservation', content:'Vos données sont conservées pendant la durée de votre compte + 3 ans. Vous pouvez demander la suppression à tout moment.'},
          {title:'6. Vos droits', content:'Conformément au RGPD, vous disposez des droits d\'accès, rectification, effacement, portabilité et opposition. Exercez-les via hello@duneia.fr'},
          {title:'7. Hébergement', content:'Vos données sont hébergées en Europe (Supabase EU, Railway EU, Vercel). Elles ne sont jamais transférées hors UE.'},
          {title:'8. Cookies', content:'DuneIA n\'utilise pas de cookies publicitaires. Seuls des cookies techniques nécessaires au fonctionnement sont utilisés.'},
        ].map((s,i) => (
          <div key={i} style={{marginBottom:'24px'}}>
            <h2 style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#a48bff', marginBottom:'8px'}}>{s.title}</h2>
            <p style={{fontSize:'0.88rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.8}}>{s.content}</p>
          </div>
        ))}
        <p style={{fontSize:'0.78rem', color:'#8e8cb0', fontWeight:600, marginTop:'32px'}}>Dernière mise à jour : Mai 2026</p>
      </div>
    </div>
  )
}
