'use client'
import { useRouter } from 'next/navigation'

export default function CGV() {
  const router = useRouter()
  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.95)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'50px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>router.back()} style={{background:'transparent', border:'2px solid #2a2740', borderRadius:'9px', color:'#8e8cb0', padding:'6px 12px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}}>← Retour</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>🎓 DuneIA</div>
      </nav>
      <div style={{maxWidth:'700px', margin:'0 auto', padding:'32px 16px'}}>
        <h1 style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.8rem', fontWeight:700, marginBottom:'24px'}}>Conditions Générales de Vente</h1>
        {[
          {title:'1. Objet', content:'Les présentes CGV régissent l\'utilisation de DuneIA, plateforme SaaS d\'accompagnement scolaire par intelligence artificielle, accessible sur duneia.fr.'},
          {title:'2. Offres et tarifs', content:'DuneIA propose trois offres : Gratuit (0€/mois), Premium (9,99€/mois) et Famille (14,99€/mois). Les prix sont TTC. Tout abonnement est sans engagement et résiliable à tout moment.'},
          {title:'3. Paiement', content:'Les paiements sont traités par Mollie, prestataire de paiement sécurisé. DuneIA ne stocke aucune donnée bancaire. Les abonnements sont renouvelés automatiquement chaque mois.'},
          {title:'4. Droit de rétractation', content:'Conformément à la loi, vous disposez d\'un délai de 14 jours à compter de la souscription pour exercer votre droit de rétractation, sans avoir à justifier de motif.'},
          {title:'5. Résiliation', content:'Vous pouvez résilier votre abonnement à tout moment depuis votre espace profil. La résiliation prend effet à la fin de la période en cours.'},
          {title:'6. Données personnelles', content:'Les données collectées sont traitées conformément à notre politique de confidentialité et au RGPD. Vos identifiants Pronote sont chiffrés et ne sont jamais partagés.'},
          {title:'7. Contact', content:'Pour toute question : hello@duneia.fr'},
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
