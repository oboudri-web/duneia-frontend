'use client'
import { useRouter } from 'next/navigation'

export default function Mentions() {
  const router = useRouter()
  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.95)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', padding:'12px 16px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>router.back()} style={{background:'transparent', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← Retour</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>🎓 DuneIA</div>
      </nav>
      <div style={{maxWidth:'700px', margin:'0 auto', padding:'32px 16px'}}>
        <h1 style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.8rem', fontWeight:700, marginBottom:'24px'}}>Mentions Légales</h1>
        {[
          {title:'Éditeur', content:'DuneIA\nSite web : duneia.fr\nEmail : hello@duneia.fr'},
          {title:'Hébergement', content:'Frontend : Vercel Inc., 340 Pine Street, San Francisco, CA\nBackend : Railway Corp.\nBase de données : Supabase (région EU West)'},
          {title:'Propriété intellectuelle', content:'L\'ensemble du contenu de DuneIA (textes, graphismes, logo, code) est protégé par le droit d\'auteur. Toute reproduction est interdite sans autorisation.'},
          {title:'Limitation de responsabilité', content:'DuneIA est un outil d\'aide à la révision. Les plans de révision générés par l\'IA sont indicatifs et ne remplacent pas l\'accompagnement d\'un enseignant.'},
          {title:'Droit applicable', content:'Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français sont compétents.'},
        ].map((s,i) => (
          <div key={i} style={{marginBottom:'24px'}}>
            <h2 style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#a48bff', marginBottom:'8px'}}>{s.title}</h2>
            <p style={{fontSize:'0.88rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.8, whiteSpace:'pre-line'}}>{s.content}</p>
          </div>
        ))}
        <p style={{fontSize:'0.78rem', color:'#8e8cb0', fontWeight:600, marginTop:'32px'}}>Dernière mise à jour : Mai 2026</p>
      </div>
    </div>
  )
}
