'use client'
import { useRouter } from 'next/navigation'

export default function LimiteModal({ type, onClose }: { type: string, onClose: ()=>void }) {
  const router = useRouter()
  
  const messages: any = {
    qcm: { emoji: '❓', titre: 'QCM épuisés', desc: '5 QCM par jour en version gratuite.', cta: 'QCM illimités avec Premium' },
    tuteur: { emoji: '🧑‍🏫', titre: 'Tuteur limité', desc: '3 questions par jour en version gratuite.', cta: 'Tuteur illimité avec Premium' },
    flashcards: { emoji: '🃏', titre: 'Flashcards épuisées', desc: '10 flashcards par jour en version gratuite.', cta: 'Flashcards illimitées avec Premium' },
    speedquiz: { emoji: '⚡', titre: 'Speed Quiz limité', desc: '1 Speed Quiz par jour en version gratuite.', cta: 'Speed Quiz illimité avec Premium' },
    resume: { emoji: '📖', titre: 'Résumé limité', desc: '1 résumé de cours par jour en version gratuite.', cta: 'Résumés illimités avec Premium' },
  }

  const msg = messages[type] || { emoji: '⭐', titre: 'Limite atteinte', desc: 'Tu as atteint ta limite quotidienne.', cta: 'Passer Premium' }

  return (
    <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
      <div style={{background:'#131120', border:'2px solid rgba(124,92,252,0.4)', borderRadius:'24px', padding:'32px', maxWidth:'360px', width:'100%', textAlign:'center'}}>
        <div style={{fontSize:'3rem', marginBottom:'16px'}}>{msg.emoji}</div>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.4rem', fontWeight:700, marginBottom:'10px'}}>{msg.titre}</div>
        <p style={{fontSize:'0.86rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7, marginBottom:'24px'}}>{msg.desc}<br/>Reviens demain ou passe Premium pour continuer.</p>
        
        <div style={{background:'rgba(255,209,102,0.08)', border:'2px solid rgba(255,209,102,0.2)', borderRadius:'14px', padding:'16px', marginBottom:'20px'}}>
          <div style={{fontSize:'0.72rem', fontWeight:800, color:'#ffd166', marginBottom:'8px'}}>🔥 ANNUEL 79€/an · ⭐ PREMIUM 9,99€/mois</div>
          {['QCM illimités','Tuteur IA illimité','Flashcards illimitées','Speed Quiz illimité','Annales IA','Oral IA','Prédiction notes','ADN Scolaire'].map((f,i)=>(
            <div key={i} style={{fontSize:'0.75rem', fontWeight:600, color:'#f0eeff', textAlign:'left', marginBottom:'3px'}}>✓ {f}</div>
          ))}
        </div>

        <button onClick={()=>{ router.push('/paiement'); onClose() }} style={{width:'100%', padding:'14px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:900, fontSize:'0.95rem', cursor:'pointer', marginBottom:'10px'}}>
          ⭐ {msg.cta}
        </button>
        <button onClick={onClose} style={{width:'100%', padding:'10px', borderRadius:'12px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.85rem', cursor:'pointer'}}>
          Revenir demain
        </button>
      </div>
    </div>
  )
}
