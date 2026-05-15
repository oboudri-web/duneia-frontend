'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

export default function Jeux() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mode, setMode] = useState<'menu'|'speedquiz'|'duel_creer'|'duel_rejoindre'|'duel_jouer'|'defi'>('menu')

  // Speed Quiz
  const [sqMatiere, setSqMatiere] = useState('Mathématiques')
  const [sqQuestions, setSqQuestions] = useState<any[]>([])
  const [sqLoading, setSqLoading] = useState(false)
  const [sqCurrent, setSqCurrent] = useState(0)
  const [sqScore, setSqScore] = useState(0)
  const [sqTime, setSqTime] = useState(60)
  const [sqSelected, setSqSelected] = useState<number|null>(null)
  const [sqFinished, setSqFinished] = useState(false)
  const timerRef = useRef<any>(null)

  // Duel
  const [duelMatiere, setDuelMatiere] = useState('Mathématiques')
  const [duelCode, setDuelCode] = useState('')
  const [duelCodeInput, setDuelCodeInput] = useState('')
  const [duelQuestions, setDuelQuestions] = useState<any[]>([])
  const [duelCurrent, setDuelCurrent] = useState(0)
  const [duelScore, setDuelScore] = useState(0)
  const [duelSelected, setDuelSelected] = useState<number|null>(null)
  const [duelAnswered, setDuelAnswered] = useState(false)
  const [duelFinished, setDuelFinished] = useState(false)
  const [duelJoueur, setDuelJoueur] = useState(1)
  const [duelLoading, setDuelLoading] = useState(false)
  const [adversaireScore, setAdversaireScore] = useState<number|null>(null)

  // Défi du jour
  const [defiDone, setDefiDone] = useState(false)
  const [defiScore, setDefiScore] = useState(0)
  const [defiQuestions, setDefiQuestions] = useState<any[]>([])
  const [defiCurrent, setDefiCurrent] = useState(0)
  const [defiSelected, setDefiSelected] = useState<number|null>(null)
  const [defiAnswered, setDefiAnswered] = useState(false)
  const [defiLoading, setDefiLoading] = useState(false)

  const matieres = ['Mathématiques','Français','Histoire-Géo','Physique-Chimie','SVT','Anglais','Culture générale']

  useEffect(() => {
    const u = localStorage.getItem('duneia_user')
    if(!u) { router.push('/auth'); return }
    setUser(JSON.parse(u))
    const today = new Date().toDateString()
    const defiSaved = localStorage.getItem('duneia_defi_'+today)
    if(defiSaved) { setDefiDone(true); setDefiScore(parseInt(defiSaved)) }
  }, [])

  useEffect(() => {
    if(mode==='speedquiz' && sqQuestions.length > 0 && !sqFinished) {
      timerRef.current = setInterval(()=>{
        setSqTime(t=>{
          if(t<=1) { clearInterval(timerRef.current); setSqFinished(true); return 0 }
          return t-1
        })
      }, 1000)
      return ()=>clearInterval(timerRef.current)
    }
  }, [mode, sqQuestions])

  async function startSpeedQuiz() {
    setSqLoading(true)
    setSqQuestions([])
    setSqCurrent(0)
    setSqScore(0)
    setSqTime(60)
    setSqFinished(false)
    setSqSelected(null)
    try {
      const token = localStorage.getItem('duneia_token')
      const r = await fetch(BACKEND+'/api/ai/speedquiz', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({matiere:sqMatiere, classe:user?.classe})
      })
      const d = await r.json()
      if(d.success) setSqQuestions(d.quiz.questions)
    } catch(e) { console.error(e) }
    finally { setSqLoading(false) }
  }

  function sqRepondre(idx:number) {
    if(sqSelected!==null) return
    setSqSelected(idx)
    if(idx === sqQuestions[sqCurrent].bonne_reponse) setSqScore(s=>s+10)
    setTimeout(()=>{
      if(sqCurrent < sqQuestions.length-1) {
        setSqCurrent(c=>c+1)
        setSqSelected(null)
      } else {
        clearInterval(timerRef.current)
        setSqFinished(true)
      }
    }, 600)
  }

  async function creerDuel() {
    setDuelLoading(true)
    try {
      const token = localStorage.getItem('duneia_token')
      const r = await fetch(BACKEND+'/api/ai/duel/creer', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({matiere:duelMatiere, classe:user?.classe})
      })
      const d = await r.json()
      if(d.success) {
        setDuelCode(d.code)
        setDuelQuestions(d.questions)
        setDuelJoueur(1)
        setMode('duel_jouer')
      }
    } catch(e) { console.error(e) }
    finally { setDuelLoading(false) }
  }

  async function rejoindre() {
    setDuelLoading(true)
    try {
      const token = localStorage.getItem('duneia_token')
      const r = await fetch(BACKEND+'/api/ai/duel/rejoindre', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({code:duelCodeInput.toUpperCase()})
      })
      const d = await r.json()
      if(d.success) {
        setDuelCode(duelCodeInput.toUpperCase())
        setDuelQuestions(d.duel.questions)
        setDuelJoueur(2)
        setMode('duel_jouer')
      } else {
        alert(d.error || 'Code invalide')
      }
    } catch(e) { console.error(e) }
    finally { setDuelLoading(false) }
  }

  function duelRepondre(idx:number) {
    if(duelAnswered) return
    setDuelSelected(idx)
    setDuelAnswered(true)
    if(idx === duelQuestions[duelCurrent].bonne_reponse) setDuelScore(s=>s+20)
  }

  async function duelSuivant() {
    if(duelCurrent < duelQuestions.length-1) {
      setDuelCurrent(c=>c+1)
      setDuelSelected(null)
      setDuelAnswered(false)
    } else {
      const finalScore = duelScore + (duelSelected === duelQuestions[duelCurrent].bonne_reponse ? 20 : 0)
      setDuelFinished(true)
      try {
        const token = localStorage.getItem('duneia_token')
        const r = await fetch(BACKEND+'/api/ai/duel/resultat', {
          method:'POST',
          headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
          body: JSON.stringify({code:duelCode, score:finalScore, joueur:duelJoueur})
        })
        const d = await r.json()
        if(d.success && d.duel) {
          const adv = duelJoueur===1 ? d.duel.score_joueur2 : d.duel.score_joueur1
          setAdversaireScore(adv)
        }
      } catch(e) {}
    }
  }

  async function startDefi() {
    setDefiLoading(true)
    setDefiQuestions([])
    setDefiCurrent(0)
    setDefiScore(0)
    setDefiSelected(null)
    setDefiAnswered(false)
    try {
      const token = localStorage.getItem('duneia_token')
      const r = await fetch(BACKEND+'/api/ai/qcm', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({matiere:'Culture générale', classe:user?.classe, chapitre:'Défi du jour', nbQuestions:5})
      })
      const d = await r.json()
      if(d.success) setDefiQuestions(d.qcm.questions)
    } catch(e) { console.error(e) }
    finally { setDefiLoading(false) }
  }

  function defiRepondre(idx:number) {
    if(defiAnswered) return
    setDefiSelected(idx)
    setDefiAnswered(true)
    if(idx === defiQuestions[defiCurrent].bonne_reponse) setDefiScore(s=>s+20)
  }

  function defiSuivant() {
    if(defiCurrent < defiQuestions.length-1) {
      setDefiCurrent(c=>c+1)
      setDefiSelected(null)
      setDefiAnswered(false)
    } else {
      const today = new Date().toDateString()
      localStorage.setItem('duneia_defi_'+today, defiScore.toString())
      setDefiDone(true)
    }
  }

  const btn = {padding:'10px 20px', borderRadius:'12px', border:'none', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.88rem'}

  const QCMQuestion = ({questions, current, selected, answered, onAnswer, score, total}: any) => {
    const q = questions[current]
    return (
      <div>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
          <div style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0'}}>Q {current+1}/{questions.length}</div>
          <div style={{fontSize:'0.78rem', fontWeight:800, color:'#06d6a0'}}>Score: {score}/{total}</div>
        </div>
        <div style={{background:'rgba(255,255,255,0.04)', borderRadius:'6px', height:'4px', marginBottom:'20px'}}>
          <div style={{height:'100%', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', width:`${(current/questions.length)*100}%`}}/>
        </div>
        <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'16px', padding:'20px', marginBottom:'14px'}}>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, lineHeight:1.5}}>{q.question}</div>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          {q.options.map((opt:string, i:number) => {
            const isCorrect = i === q.bonne_reponse
            const isSelected = i === selected
            let bg = '#131120', border = '#2a2740', color = '#f0eeff'
            if(answered) {
              if(isCorrect) { bg='rgba(6,214,160,0.1)'; border='rgba(6,214,160,0.4)'; color='#06d6a0' }
              else if(isSelected) { bg='rgba(239,71,111,0.1)'; border='rgba(239,71,111,0.4)'; color='#ef476f' }
            }
            return (
              <div key={i} onClick={()=>onAnswer(i)} style={{background:bg, border:`2px solid ${border}`, borderRadius:'12px', padding:'12px 16px', cursor:answered?'default':'pointer', display:'flex', alignItems:'center', gap:'10px'}}>
                <div style={{width:'26px', height:'26px', borderRadius:'7px', background:`${border}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:700, color, flexShrink:0}}>
                  {answered?(isCorrect?'✅':isSelected?'❌':String.fromCharCode(65+i)):String.fromCharCode(65+i)}
                </div>
                <div style={{fontSize:'0.84rem', fontWeight:700, color}}>{opt}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
    <style dangerouslySetInnerHTML={{__html: "@keyframes bounce { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }"}} />
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'54px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>mode==='menu'?router.push('/app'):setMode('menu')} style={{...btn, background:'rgba(255,255,255,0.06)', color:'#8e8cb0', padding:'6px 12px'}}>← {mode==='menu'?'App':'Menu'}</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>DuneIA</div>
        <div style={{marginLeft:'auto', fontSize:'0.78rem', fontWeight:800, color:'#ffd166'}}>🎮 Jeux</div>
      </nav>

      <div style={{maxWidth:'680px', margin:'0 auto', padding:'20px 16px'}}>

        {/* MENU */}
        {mode==='menu' && (
          <div>
            <div style={{textAlign:'center', marginBottom:'28px'}}>
              <img src='/dune-pointe.png' style={{width:'90px',height:'90px',objectFit:'contain',animation:'bounce 2s infinite',filter:'drop-shadow(0 4px 16px rgba(124,92,252,0.5))',mixBlendMode:'screen' as any}} alt='Dune'/>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.3rem', fontWeight:700, marginBottom:'6px'}}>Apprends en jouant</div>
              <p style={{fontSize:'0.84rem', color:'#8e8cb0', fontWeight:600}}>Gagne des XP en t'amusant</p>
            </div>

            <div style={{display:'grid', gap:'12px'}}>
              {/* Speed Quiz */}
              <div onClick={()=>setMode('speedquiz')} style={{background:'#131120', border:'2px solid rgba(255,107,157,0.3)', borderRadius:'20px', padding:'22px', cursor:'pointer'}}>
                <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'10px'}}>
                  <div style={{width:'48px', height:'48px', borderRadius:'14px', background:'rgba(255,107,157,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem'}}>⚡</div>
                  <div>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700}}>Speed Quiz</div>
                    <div style={{fontSize:'0.76rem', color:'#8e8cb0', fontWeight:600}}>10 questions en 60 secondes</div>
                  </div>
                  <div style={{marginLeft:'auto', background:'rgba(255,107,157,0.1)', border:'1px solid rgba(255,107,157,0.3)', borderRadius:'100px', padding:'3px 10px', fontSize:'0.7rem', fontWeight:800, color:'#ff6b9d'}}>+100 XP</div>
                </div>
              </div>

              {/* Duel */}
              <div onClick={()=>setMode('duel_creer')} style={{background:'#131120', border:'2px solid rgba(124,92,252,0.3)', borderRadius:'20px', padding:'22px', cursor:'pointer'}}>
                <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'10px'}}>
                  <div style={{width:'48px', height:'48px', borderRadius:'14px', background:'rgba(124,92,252,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem'}}>⚔️</div>
                  <div>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700}}>Duel entre amis</div>
                    <div style={{fontSize:'0.76rem', color:'#8e8cb0', fontWeight:600}}>Affronte un ami avec un code</div>
                  </div>
                  <div style={{marginLeft:'auto', background:'rgba(124,92,252,0.1)', border:'1px solid rgba(124,92,252,0.3)', borderRadius:'100px', padding:'3px 10px', fontSize:'0.7rem', fontWeight:800, color:'#a48bff'}}>+150 XP</div>
                </div>
              </div>

              {/* Rejoindre duel */}
              <div onClick={()=>setMode('duel_rejoindre')} style={{background:'#131120', border:'2px solid rgba(124,92,252,0.2)', borderRadius:'20px', padding:'18px', cursor:'pointer', display:'flex', alignItems:'center', gap:'12px'}}>
                <div style={{fontSize:'1.2rem'}}>🔗</div>
                <div>
                  <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700}}>Rejoindre un duel</div>
                  <div style={{fontSize:'0.74rem', color:'#8e8cb0', fontWeight:600}}>Entre le code reçu par ton ami</div>
                </div>
                <div style={{marginLeft:'auto', color:'#a48bff', fontSize:'1.1rem'}}>→</div>
              </div>

              {/* Défi du jour */}
              <div onClick={()=>!defiDone&&setMode('defi')} style={{background:'#131120', border:`2px solid ${defiDone?'rgba(6,214,160,0.3)':'rgba(255,209,102,0.3)'}`, borderRadius:'20px', padding:'22px', cursor:defiDone?'default':'pointer'}}>
                <div style={{display:'flex', alignItems:'center', gap:'14px'}}>
                  <div style={{width:'48px', height:'48px', borderRadius:'14px', background:defiDone?'rgba(6,214,160,0.12)':'rgba(255,209,102,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem'}}>{defiDone?'✅':'🏆'}</div>
                  <div>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700}}>Défi du jour</div>
                    <div style={{fontSize:'0.76rem', color:'#8e8cb0', fontWeight:600}}>{defiDone?`Complété — ${defiScore}/100 pts`:'5 questions, renouvelé chaque jour'}</div>
                  </div>
                  {!defiDone && <div style={{marginLeft:'auto', background:'rgba(255,209,102,0.1)', border:'1px solid rgba(255,209,102,0.3)', borderRadius:'100px', padding:'3px 10px', fontSize:'0.7rem', fontWeight:800, color:'#ffd166'}}>+200 XP</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SPEED QUIZ SETUP */}
        {mode==='speedquiz' && sqQuestions.length===0 && (
          <div>
            <div style={{textAlign:'center', marginBottom:'24px'}}>
              <div style={{fontSize:'2rem', marginBottom:'10px'}}>⚡</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700}}>Speed Quiz</div>
              <p style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:600, marginTop:'6px'}}>10 questions · 60 secondes · Maximum de points !</p>
            </div>
            <select value={sqMatiere} onChange={e=>setSqMatiere(e.target.value)} style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:700, outline:'none', marginBottom:'16px'}}>
              {matieres.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
            <button onClick={startSpeedQuiz} disabled={sqLoading} style={{...btn, background:'linear-gradient(135deg,#ff6b9d,#7c5cfc)', color:'white', width:'100%', padding:'14px', fontSize:'0.95rem', opacity:sqLoading?0.7:1}}>
              {sqLoading?'Génération...':'⚡ Lancer le Speed Quiz !'}
            </button>
          </div>
        )}

        {/* SPEED QUIZ EN COURS */}
        {mode==='speedquiz' && sqQuestions.length>0 && !sqFinished && (
          <div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.5rem', fontWeight:700, color:sqTime<=10?'#ef476f':'#06d6a0'}}>{sqTime}s</div>
              <div style={{fontSize:'0.82rem', fontWeight:800, color:'#ffd166'}}>⚡ {sqScore} pts</div>
              <div style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0'}}>{sqCurrent+1}/10</div>
            </div>
            <div style={{background:'rgba(255,255,255,0.04)', borderRadius:'6px', height:'6px', marginBottom:'20px'}}>
              <div style={{height:'100%', background:sqTime<=10?'#ef476f':'linear-gradient(135deg,#ff6b9d,#7c5cfc)', width:`${sqTime/60*100}%`, transition:'width 1s linear', borderRadius:'6px'}}/>
            </div>
            <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'16px', padding:'20px', marginBottom:'14px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700}}>{sqQuestions[sqCurrent].question}</div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
              {sqQuestions[sqCurrent].options.map((opt:string,i:number)=>{
                const isCorrect = i===sqQuestions[sqCurrent].bonne_reponse
                const isSelected = i===sqSelected
                let bg='#131120', border='#2a2740'
                if(sqSelected!==null) {
                  if(isCorrect) { bg='rgba(6,214,160,0.15)'; border='rgba(6,214,160,0.4)' }
                  else if(isSelected) { bg='rgba(239,71,111,0.15)'; border='rgba(239,71,111,0.4)' }
                }
                return (
                  <div key={i} onClick={()=>sqRepondre(i)} style={{background:bg, border:`2px solid ${border}`, borderRadius:'12px', padding:'12px', cursor:'pointer', textAlign:'center', fontSize:'0.84rem', fontWeight:700, transition:'all 0.2s'}}>
                    {opt}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* SPEED QUIZ RÉSULTAT */}
        {mode==='speedquiz' && sqFinished && (
          <div style={{textAlign:'center', padding:'40px 20px'}}>
            <img src={sqScore>=50?'/dune-celebre.png':'/dune-lit.png'} style={{width:'100px',height:'100px',objectFit:'contain',animation:'bounce 1.5s infinite',filter:'drop-shadow(0 4px 16px rgba(124,92,252,0.5))',marginBottom:'8px'}} alt='Dune'/>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'2rem', fontWeight:700, color:'#ffd166', marginBottom:'8px'}}>{sqScore} pts</div>
            <div style={{fontSize:'0.88rem', color:'#8e8cb0', fontWeight:600, marginBottom:'24px'}}>
              {sqScore>=80?'Excellent ! Tu es imbattable 🔥':sqScore>=50?'Bien joué ! Continue comme ça 💪':'Encore un peu d\'entraînement 📚'}
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
              <button onClick={()=>{setSqQuestions([]);setSqFinished(false)}} style={{...btn, background:'rgba(255,107,157,0.1)', color:'#ff6b9d', border:'2px solid rgba(255,107,157,0.3)', padding:'12px'}}>🔄 Rejouer</button>
              <button onClick={()=>setMode('menu')} style={{...btn, background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', padding:'12px'}}>← Menu</button>
            </div>
          </div>
        )}

        {/* DUEL CRÉER */}
        {mode==='duel_creer' && !duelCode && (
          <div>
            <div style={{textAlign:'center', marginBottom:'24px'}}>
              <div style={{fontSize:'2rem', marginBottom:'10px'}}>⚔️</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700}}>Créer un Duel</div>
              <p style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:600, marginTop:'6px'}}>Tu réponds en premier, ton ami répond ensuite avec le code</p>
            </div>
            <select value={duelMatiere} onChange={e=>setDuelMatiere(e.target.value)} style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:700, outline:'none', marginBottom:'16px'}}>
              {matieres.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
            <button onClick={creerDuel} disabled={duelLoading} style={{...btn, background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', width:'100%', padding:'14px', fontSize:'0.95rem', opacity:duelLoading?0.7:1}}>
              {duelLoading?'Création...':'⚔️ Créer le duel'}
            </button>
          </div>
        )}

        {/* DUEL REJOINDRE */}
        {mode==='duel_rejoindre' && (
          <div>
            <div style={{textAlign:'center', marginBottom:'24px'}}>
              <div style={{fontSize:'2rem', marginBottom:'10px'}}>🔗</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700}}>Rejoindre un Duel</div>
              <p style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:600, marginTop:'6px'}}>Entre le code envoyé par ton ami</p>
            </div>
            <input value={duelCodeInput} onChange={e=>setDuelCodeInput(e.target.value.toUpperCase())} placeholder="ex: MATH-4829" style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'14px', color:'#f0eeff', fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700, outline:'none', textAlign:'center', letterSpacing:'4px', boxSizing:'border-box' as any, marginBottom:'16px'}}/>
            <button onClick={rejoindre} disabled={duelLoading||!duelCodeInput} style={{...btn, background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', width:'100%', padding:'14px', fontSize:'0.95rem', opacity:duelLoading||!duelCodeInput?0.6:1}}>
              {duelLoading?'Connexion...':'⚔️ Rejoindre le duel'}
            </button>
          </div>
        )}

        {/* DUEL EN COURS */}
        {mode==='duel_jouer' && duelQuestions.length>0 && !duelFinished && (
          <div>
            <div style={{background:'rgba(124,92,252,0.1)', border:'2px solid rgba(124,92,252,0.25)', borderRadius:'12px', padding:'12px 16px', marginBottom:'16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <div style={{fontSize:'0.78rem', fontWeight:800, color:'#a48bff'}}>Code : {duelCode}</div>
              <div style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0'}}>Joueur {duelJoueur}</div>
            </div>
            <QCMQuestion
              questions={duelQuestions}
              current={duelCurrent}
              selected={duelSelected}
              answered={duelAnswered}
              onAnswer={duelRepondre}
              score={duelScore}
              total={duelQuestions.length*20}
            />
            {duelAnswered && (
              <button onClick={duelSuivant} style={{...btn, background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', width:'100%', padding:'14px', marginTop:'14px'}}>
                {duelCurrent<duelQuestions.length-1?'Question suivante →':'Terminer le duel 🏆'}
              </button>
            )}
          </div>
        )}

        {/* DUEL RÉSULTAT */}
        {mode==='duel_jouer' && duelFinished && (
          <div style={{textAlign:'center', padding:'40px 20px'}}>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.4rem', fontWeight:700, marginBottom:'20px'}}>Ton score : {duelScore}/100</div>
            {adversaireScore !== null ? (
              <div>
                <div style={{background:duelScore>adversaireScore?'rgba(6,214,160,0.1)':'rgba(239,71,111,0.1)', border:`2px solid ${duelScore>adversaireScore?'rgba(6,214,160,0.3)':'rgba(239,71,111,0.3)'}`, borderRadius:'16px', padding:'20px', marginBottom:'20px'}}>
                  <div style={{fontSize:'2rem', marginBottom:'8px'}}>{duelScore>adversaireScore?'🏆':'💪'}</div>
                  <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700, color:duelScore>adversaireScore?'#06d6a0':'#ef476f'}}>
                    {duelScore>adversaireScore?'Tu as gagné !':duelScore===adversaireScore?'Égalité !':'Tu as perdu'}
                  </div>
                  <div style={{fontSize:'0.84rem', color:'#8e8cb0', fontWeight:600, marginTop:'8px'}}>
                    Toi: {duelScore} pts · Adversaire: {adversaireScore} pts
                  </div>
                </div>
              </div>
            ) : (
              <div style={{background:'rgba(255,209,102,0.08)', border:'2px solid rgba(255,209,102,0.2)', borderRadius:'14px', padding:'16px', marginBottom:'20px'}}>
                <p style={{fontSize:'0.84rem', color:'#ffd166', fontWeight:700, margin:0}}>Envoie le code <strong>{duelCode}</strong> à ton ami pour qu'il joue à son tour !</p>
              </div>
            )}
            <button onClick={()=>{setMode('menu');setDuelCode('');setDuelQuestions([]);setDuelFinished(false);setDuelScore(0);setDuelCurrent(0)}} style={{...btn, background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', width:'100%', padding:'14px'}}>
              ← Menu Jeux
            </button>
          </div>
        )}

        {/* DÉFI DU JOUR */}
        {mode==='defi' && defiQuestions.length===0 && (
          <div style={{textAlign:'center'}}>
            <img src='/dune-celebre.png' style={{width:'90px',height:'90px',objectFit:'contain',animation:'bounce 2s infinite',filter:'drop-shadow(0 4px 16px rgba(255,209,102,0.5))',marginBottom:'8px'}} alt='Dune'/>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700, marginBottom:'8px'}}>Défi du jour</div>
            <p style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:600, marginBottom:'20px'}}>5 questions de culture générale. Un seul essai par jour !</p>
            <button onClick={startDefi} disabled={defiLoading} style={{...btn, background:'linear-gradient(135deg,#ffd166,#ff9f1c)', color:'#0a0914', width:'100%', padding:'14px', fontSize:'0.95rem', opacity:defiLoading?0.7:1}}>
              {defiLoading?'Chargement...':'🏆 Commencer le défi !'}
            </button>
          </div>
        )}

        {mode==='defi' && defiQuestions.length>0 && !defiDone && (
          <div>
            <div style={{background:'rgba(255,209,102,0.08)', border:'1px solid rgba(255,209,102,0.2)', borderRadius:'10px', padding:'8px 14px', marginBottom:'16px', textAlign:'center'}}>
              <span style={{fontSize:'0.75rem', fontWeight:800, color:'#ffd166'}}>🏆 Défi du jour — Un seul essai !</span>
            </div>
            <QCMQuestion
              questions={defiQuestions}
              current={defiCurrent}
              selected={defiSelected}
              answered={defiAnswered}
              onAnswer={defiRepondre}
              score={defiScore}
              total={defiQuestions.length*20}
            />
            {defiAnswered && (
              <button onClick={defiSuivant} style={{...btn, background:'linear-gradient(135deg,#ffd166,#ff9f1c)', color:'#0a0914', width:'100%', padding:'14px', marginTop:'14px', fontWeight:900}}>
                {defiCurrent<defiQuestions.length-1?'Question suivante →':'Voir mes résultats 🏆'}
              </button>
            )}
          </div>
        )}

      </div>
      <BottomNav active="app"/>
    </div>
    </>
  )
}
