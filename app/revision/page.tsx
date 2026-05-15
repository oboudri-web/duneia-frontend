'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav'
import LimiteModal from '../../components/LimiteModal'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

export default function Revision() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mode, setMode] = useState<'menu'|'tuteur'|'qcm'|'flash'|'resume'>('menu')
  
  // Tuteur
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [matiere, setMatiere] = useState('Mathématiques')
  const messagesEnd = useRef<any>(null)
  const [limiteType, setLimiteType] = useState<string|null>(null)

  // Résumé
  const [resumeTexte, setResumeTexte] = useState('')
  const [resumeMatiere, setResumeMatiere] = useState('Mathématiques')
  const [resumeResult, setResumeResult] = useState<any>(null)
  const [resumeLoading, setResumeLoading] = useState(false)

  // Flashcards
  const [flashMatiere, setFlashMatiere] = useState('Mathématiques')
  const [flashChapitre, setFlashChapitre] = useState('')
  const [flashcards, setFlashcards] = useState<any>(null)
  const [flashLoading, setFlashLoading] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState<number[]>([])
  const [unknown, setUnknown] = useState<number[]>([])

  // QCM
  const [qcmMatiere, setQcmMatiere] = useState('Mathématiques')
  const [qcmChapitre, setQcmChapitre] = useState('')
  const [qcm, setQcm] = useState<any>(null)
  const [qcmLoading, setQcmLoading] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number|null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const matieres = ['Mathématiques','Français','Histoire-Géo','Physique-Chimie','SVT','Anglais','Espagnol','Philosophie','SES','NSI']

  useEffect(() => {
    const u = localStorage.getItem('duneia_user')
    if(!u) { router.push('/auth'); return }
    setUser(JSON.parse(u))
  }, [])

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if(!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    try {
      const token = localStorage.getItem('duneia_token')
      const r = await fetch(BACKEND+'/api/ai/tuteur', {
        method: 'POST',
        headers: {'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({
          question: input,
          matiere,
          classe: user?.classe,
          historique: messages.slice(-6)
        })
      })
      const d = await r.json()
      if(d.success) {
        setMessages([...newMessages, { role: 'assistant', content: d.reponse }])
      }
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function genererQCM() {
    setQcmLoading(true)
    setQcm(null)
    setCurrentQ(0)
    setScore(0)
    setFinished(false)
    setSelected(null)
    setAnswered(false)
    try {
      const token = localStorage.getItem('duneia_token')
      const r = await fetch(BACKEND+'/api/ai/qcm', {
        method: 'POST',
        headers: {'Content-Type':'application/json','Authorization':'Bearer '+token},
        body: JSON.stringify({ matiere: qcmMatiere, classe: user?.classe, chapitre: qcmChapitre, nbQuestions: 5 })
      })
      const d = await r.json()
      if(d.success) setQcm(d.qcm)
    } catch(e) { console.error(e) }
    finally { setQcmLoading(false) }
  }

  function repondre(idx: number) {
    if(answered) return
    setSelected(idx)
    setAnswered(true)
    if(idx === qcm.questions[currentQ].bonne_reponse) setScore(s=>s+1)
  }

  function suivant() {
    if(currentQ < qcm.questions.length - 1) {
      setCurrentQ(q=>q+1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
    }
  }

  const btn = {padding:'8px 16px', borderRadius:'10px', border:'none', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem'}

  return (
    <>
    <style dangerouslySetInnerHTML={{__html: "@keyframes bounce { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }"}} />
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', paddingTop:'54px', paddingLeft:'16px', paddingRight:'16px', paddingBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
        <button onClick={()=>mode==='menu'?router.push('/app'):setMode('menu')} style={{...btn, background:'rgba(255,255,255,0.06)', color:'#8e8cb0'}}>← {mode==='menu'?'App':'Menu'}</button>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166'}}>🎓 DuneIA</div>
        <div style={{marginLeft:'auto', fontSize:'0.78rem', fontWeight:800, color:'#a48bff'}}>
          {mode==='tuteur'?'🧑‍🏫 Tuteur IA':mode==='qcm'?'❓ QCM':mode==='flash'?'🃏 Flashcards':mode==='resume'?'📖 Résumé':'📚 Révision'}
        </div>
      </nav>

      <div style={{maxWidth:'680px', margin:'0 auto', padding:'20px 16px'}}>

        {/* MENU */}
        {mode==='menu' && (
          <div>
            <div style={{textAlign:'center', marginBottom:'30px'}}>
              <img src='/dune-lit.png' style={{width:'90px',height:'90px',objectFit:'contain',animation:'bounce 2s infinite',filter:'drop-shadow(0 4px 12px rgba(124,92,252,0.5))',marginBottom:'8px'}} alt='Dune'/>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.4rem', fontWeight:700, marginBottom:'8px'}}>Mode Révision</div>
              <p style={{fontSize:'0.84rem', color:'#8e8cb0', fontWeight:600}}>Choisis comment tu veux réviser aujourd'hui</p>
            </div>

            <div style={{display:'grid', gap:'14px'}}>
              <div onClick={()=>setMode('tuteur')} style={{background:'#131120', border:'2px solid rgba(124,92,252,0.3)', borderRadius:'20px', padding:'24px', cursor:'pointer', transition:'all 0.2s'}}>
                <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'12px'}}>
                  <div style={{width:'48px', height:'48px', borderRadius:'14px', background:'rgba(124,92,252,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem'}}>🧑‍🏫</div>
                  <div>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700}}>Tuteur IA Socratique</div>
                    <div style={{fontSize:'0.76rem', color:'#8e8cb0', fontWeight:600}}>L'IA te guide sans donner les réponses</div>
                  </div>
                </div>
                <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  {['🤔 Méthode socratique','💬 Conversation naturelle','📚 Toutes matières'].map(t=>(
                    <span key={t} style={{background:'rgba(124,92,252,0.1)', border:'1px solid rgba(124,92,252,0.2)', borderRadius:'100px', padding:'3px 10px', fontSize:'0.7rem', fontWeight:800, color:'#a48bff'}}>{t}</span>
                  ))}
                </div>
              </div>

              <div onClick={()=>setMode('resume')} style={{background:'#131120', border:'2px solid rgba(164,139,255,0.3)', borderRadius:'20px', padding:'24px', cursor:'pointer', transition:'all 0.2s'}}>
                <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'12px'}}>
                  <div style={{width:'48px', height:'48px', borderRadius:'14px', background:'rgba(164,139,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem'}}>📖</div>
                  <div>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700}}>Résumé de cours IA</div>
                    <div style={{fontSize:'0.76rem', color:'#8e8cb0', fontWeight:600}}>Fiche de révision en 30 secondes</div>
                  </div>
                </div>
                <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  {['📝 Colle ton cours','🖼️ Photo du cours','📌 Points clés + définitions'].map(t=>(
                    <span key={t} style={{background:'rgba(164,139,255,0.08)', border:'1px solid rgba(164,139,255,0.2)', borderRadius:'100px', padding:'3px 10px', fontSize:'0.7rem', fontWeight:800, color:'#a48bff'}}>{t}</span>
                  ))}
                </div>
              </div>

              <div onClick={()=>setMode('qcm')} style={{background:'#131120', border:'2px solid rgba(255,209,102,0.3)', borderRadius:'20px', padding:'24px', cursor:'pointer', transition:'all 0.2s'}}>
                <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'12px'}}>
                  <div style={{width:'48px', height:'48px', borderRadius:'14px', background:'rgba(255,209,102,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem'}}>❓</div>
                  <div>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700}}>QCM Généré par l'IA</div>
                    <div style={{fontSize:'0.76rem', color:'#8e8cb0', fontWeight:600}}>Questions personnalisées sur tes lacunes</div>
                  </div>
                </div>
                <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  {['🎯 Ciblé sur tes lacunes','📊 Score instantané','💡 Explications détaillées'].map(t=>(
                    <span key={t} style={{background:'rgba(255,209,102,0.08)', border:'1px solid rgba(255,209,102,0.2)', borderRadius:'100px', padding:'3px 10px', fontSize:'0.7rem', fontWeight:800, color:'#ffd166'}}>{t}</span>
                  ))}
                </div>
              </div>
              <div onClick={()=>setMode('flash')} style={{background:'#131120', border:'2px solid rgba(6,214,160,0.3)', borderRadius:'20px', padding:'24px', cursor:'pointer', transition:'all 0.2s'}}>
                <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'12px'}}>
                  <div style={{width:'48px', height:'48px', borderRadius:'14px', background:'rgba(6,214,160,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem'}}>🃏</div>
                  <div>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700}}>Flashcards IA</div>
                    <div style={{fontSize:'0.76rem', color:'#8e8cb0', fontWeight:600}}>Mémorise avec la répétition espacée</div>
                  </div>
                </div>
                <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  {['🔄 Recto-verso','📊 Suivi mémorisation','🎯 Ciblé sur tes lacunes'].map(t=>(
                    <span key={t} style={{background:'rgba(6,214,160,0.08)', border:'1px solid rgba(6,214,160,0.2)', borderRadius:'100px', padding:'3px 10px', fontSize:'0.7rem', fontWeight:800, color:'#06d6a0'}}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TUTEUR IA */}
        {mode==='tuteur' && (
          <div>
            <div style={{marginBottom:'14px'}}>
              <select value={matiere} onChange={e=>setMatiere(e.target.value)} style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:700, outline:'none'}}>
                {matieres.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {messages.length === 0 && (
              <div style={{background:'rgba(124,92,252,0.08)', border:'2px solid rgba(124,92,252,0.2)', borderRadius:'16px', padding:'20px', marginBottom:'14px', textAlign:'center'}}>
                <div style={{fontSize:'1.5rem', marginBottom:'8px'}}>🧑‍🏫</div>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, marginBottom:'6px'}}>Bonjour ! Je suis ton tuteur DuneIA</div>
                <p style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7}}>Pose-moi une question sur tes cours. Je vais te guider avec des questions pour que tu comprennes vraiment — sans te donner la réponse directement 😊</p>
              </div>
            )}

            <div style={{display:'flex', flexDirection:'column', gap:'10px', marginBottom:'14px', maxHeight:'400px', overflowY:'auto'}}>
              {messages.map((m,i)=>(
                <div key={i} style={{display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                  <div style={{
                    maxWidth:'80%', padding:'12px 16px', borderRadius:m.role==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px',
                    background:m.role==='user'?'linear-gradient(135deg,#7c5cfc,#ff6b9d)':'#131120',
                    border:m.role==='assistant'?'2px solid #2a2740':'none',
                    fontSize:'0.84rem', fontWeight:600, lineHeight:1.7, color:'#f0eeff'
                  }}>
                    {m.role==='assistant' && <div style={{fontSize:'0.7rem', fontWeight:800, color:'#a48bff', marginBottom:'4px'}}>🧑‍🏫 Tuteur DuneIA</div>}
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{display:'flex', justifyContent:'flex-start'}}>
                  <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px 18px 18px 4px', padding:'12px 16px'}}>
                    <div style={{display:'flex', gap:'4px'}}>
                      {[0,1,2].map(i=><div key={i} style={{width:'6px', height:'6px', borderRadius:'50%', background:'#a48bff', animation:`bounce 0.8s ${i*0.2}s infinite`}}/>)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEnd}/>
            </div>

            <div style={{display:'flex', gap:'10px'}}>
              <input
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&sendMessage()}
                placeholder="Pose ta question..."
                style={{flex:1, background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'12px', padding:'12px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:600, outline:'none'}}
              />
              <button onClick={sendMessage} disabled={loading||!input.trim()} style={{...btn, background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', padding:'12px 20px', opacity:loading||!input.trim()?0.5:1}}>→</button>
            </div>
          </div>
        )}

        {/* QCM */}
        {mode==='qcm' && (
          <div>
            {!qcm ? (
              <div>
                <div style={{marginBottom:'14px'}}>
                  <label style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:'6px'}}>Matière</label>
                  <select value={qcmMatiere} onChange={e=>setQcmMatiere(e.target.value)} style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:700, outline:'none'}}>
                    {matieres.map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:'20px'}}>
                  <label style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:'6px'}}>Chapitre (optionnel)</label>
                  <input value={qcmChapitre} onChange={e=>setQcmChapitre(e.target.value)} placeholder="ex: Les fractions, La Révolution française..." style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:600, outline:'none', boxSizing:'border-box'}}/>
                </div>
                <button onClick={genererQCM} disabled={qcmLoading} style={{...btn, background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', width:'100%', padding:'14px', fontSize:'0.95rem', opacity:qcmLoading?0.7:1}}>
                  {qcmLoading ? '⏳ Génération du QCM...' : '🎯 Générer le QCM'}
                </button>
              </div>
            ) : finished ? (
              <div style={{textAlign:'center', padding:'40px 20px'}}>
                <img src={score>=3?'/dune-celebre.png':'/dune-lit.png'} style={{width:'100px',height:'100px',objectFit:'contain',animation:'bounce 1.5s infinite',filter:'drop-shadow(0 4px 16px rgba(124,92,252,0.5))',marginBottom:'8px'}} alt='Dune'/>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.6rem', fontWeight:700, marginBottom:'8px'}}>
                  {score}/{qcm.questions.length} bonnes réponses
                </div>
                <div style={{fontSize:'0.9rem', color:'#8e8cb0', fontWeight:600, marginBottom:'24px'}}>
                  {score>=4?'Excellent ! Tu maîtrises ce chapitre 🎉':score>=3?'Bien ! Quelques révisions et tu y es 📚':'Continue à réviser, tu vas y arriver 💪'}
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                  <button onClick={()=>{setQcm(null);setFinished(false);setScore(0)}} style={{...btn, background:'rgba(124,92,252,0.1)', color:'#a48bff', border:'2px solid rgba(124,92,252,0.3)', padding:'12px'}}>
                    🔄 Nouveau QCM
                  </button>
                  <button onClick={()=>setMode('tuteur')} style={{...btn, background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', padding:'12px'}}>
                    🧑‍🏫 Tuteur IA
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px'}}>
                  <div style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0'}}>Question {currentQ+1}/{qcm.questions.length}</div>
                  <div style={{fontSize:'0.78rem', fontWeight:800, color:'#06d6a0'}}>Score : {score}/{currentQ}</div>
                </div>

                <div style={{background:'rgba(255,255,255,0.04)', borderRadius:'6px', height:'4px', marginBottom:'20px', overflow:'hidden'}}>
                  <div style={{height:'100%', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', width:`${((currentQ)/qcm.questions.length)*100}%`, transition:'width 0.3s'}}/>
                </div>

                <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'22px', marginBottom:'14px'}}>
                  <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, lineHeight:1.5}}>
                    {qcm.questions[currentQ].question}
                  </div>
                </div>

                <div style={{display:'flex', flexDirection:'column', gap:'10px', marginBottom:'14px'}}>
                  {qcm.questions[currentQ].options.map((opt:string, i:number)=>{
                    const isCorrect = i === qcm.questions[currentQ].bonne_reponse
                    const isSelected = i === selected
                    let bg = '#131120'
                    let border = '#2a2740'
                    let color = '#f0eeff'
                    if(answered) {
                      if(isCorrect) { bg='rgba(6,214,160,0.1)'; border='rgba(6,214,160,0.4)'; color='#06d6a0' }
                      else if(isSelected) { bg='rgba(239,71,111,0.1)'; border='rgba(239,71,111,0.4)'; color='#ef476f' }
                    } else if(isSelected) {
                      bg='rgba(124,92,252,0.1)'; border='rgba(124,92,252,0.4)'
                    }
                    return (
                      <div key={i} onClick={()=>repondre(i)} style={{
                        background:bg, border:`2px solid ${border}`, borderRadius:'14px',
                        padding:'14px 16px', cursor:answered?'default':'pointer',
                        display:'flex', alignItems:'center', gap:'12px', transition:'all 0.2s'
                      }}>
                        <div style={{width:'28px', height:'28px', borderRadius:'8px', background:`${border}33`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Fredoka,sans-serif', fontSize:'0.85rem', fontWeight:700, color, flexShrink:0}}>
                          {answered?(isCorrect?'✅':isSelected?'❌':String.fromCharCode(65+i)):String.fromCharCode(65+i)}
                        </div>
                        <div style={{fontSize:'0.86rem', fontWeight:700, color, lineHeight:1.5}}>{opt}</div>
                      </div>
                    )
                  })}
                </div>

                {answered && (
                  <div>
                    <div style={{background:'rgba(124,92,252,0.08)', border:'2px solid rgba(124,92,252,0.2)', borderRadius:'14px', padding:'14px', marginBottom:'12px'}}>
                      <div style={{fontSize:'0.72rem', fontWeight:800, color:'#a48bff', marginBottom:'4px'}}>💡 Explication</div>
                      <p style={{fontSize:'0.83rem', color:'#f0eeff', fontWeight:600, lineHeight:1.7, margin:0}}>{qcm.questions[currentQ].explication}</p>
                    </div>
                    <button onClick={suivant} style={{...btn, background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', width:'100%', padding:'14px', fontSize:'0.95rem'}}>
                      {currentQ < qcm.questions.length-1 ? 'Question suivante →' : 'Voir mes résultats 🏆'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
        {/* FLASHCARDS */}
        {mode==='flash' && (
          <div>
            {!flashcards ? (
              <div>
                <div style={{marginBottom:'14px'}}>
                  <label style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:'6px'}}>Matière</label>
                  <select value={flashMatiere} onChange={e=>setFlashMatiere(e.target.value)} style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:700, outline:'none'}}>
                    {matieres.map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:'20px'}}>
                  <label style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:'6px'}}>Chapitre (optionnel)</label>
                  <input value={flashChapitre} onChange={e=>setFlashChapitre(e.target.value)} placeholder="ex: La photosynthèse, Les équations..." style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:600, outline:'none', boxSizing:'border-box' as any}}/>
                </div>
                <button onClick={async()=>{
                  setFlashLoading(true)
                  setFlashcards(null)
                  setCurrentCard(0)
                  setFlipped(false)
                  setKnown([])
                  setUnknown([])
                  try {
                    const token = localStorage.getItem('duneia_token')
                    const r = await fetch(BACKEND+'/api/ai/flashcards', {
                      method:'POST',
                      headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
                      body: JSON.stringify({matiere:flashMatiere, classe:user?.classe, chapitre:flashChapitre, nbCartes:8})
                    })
                    const d = await r.json()
                    if(d.success) setFlashcards(d.flashcards)
                  } catch(e) { console.error(e) }
                  finally { setFlashLoading(false) }
                }} disabled={flashLoading} style={{...btn, background:'linear-gradient(135deg,#06d6a0,#00a8b5)', color:'white', width:'100%', padding:'14px', fontSize:'0.95rem', opacity:flashLoading?0.7:1}}>
                  {flashLoading ? '⏳ Génération des flashcards...' : '🃏 Générer les flashcards'}
                </button>
              </div>
            ) : known.length + unknown.length === flashcards.cartes.length ? (
              <div style={{textAlign:'center', padding:'40px 20px'}}>
                <img src={known.length >= flashcards.cartes.length*0.7 ? '/dune-celebre.png' : '/dune-lit.png'} style={{width:'100px',height:'100px',objectFit:'contain',animation:'bounce 1.5s infinite',filter:'drop-shadow(0 4px 16px rgba(124,92,252,0.5))',marginBottom:'8px'}} alt='Dune'/>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.6rem', fontWeight:700, marginBottom:'8px'}}>
                  {known.length}/{flashcards.cartes.length} mémorisées
                </div>
                <div style={{fontSize:'0.9rem', color:'#8e8cb0', fontWeight:600, marginBottom:'24px'}}>
                  {known.length >= flashcards.cartes.length*0.7 ? 'Excellent ! Tu maîtrises ce chapitre 🎉' : 'Continue à réviser les cartes ratées 📚'}
                </div>
                {unknown.length > 0 && (
                  <div style={{background:'rgba(239,71,111,0.08)', border:'2px solid rgba(239,71,111,0.2)', borderRadius:'14px', padding:'16px', marginBottom:'20px', textAlign:'left'}}>
                    <div style={{fontSize:'0.78rem', fontWeight:800, color:'#ef476f', marginBottom:'8px'}}>📌 À retravailler :</div>
                    {unknown.map(i=>(
                      <div key={i} style={{fontSize:'0.8rem', fontWeight:600, color:'#f0eeff', marginBottom:'4px', padding:'6px 10px', background:'rgba(255,255,255,0.03)', borderRadius:'8px'}}>{flashcards.cartes[i].recto}</div>
                    ))}
                  </div>
                )}
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                  <button onClick={()=>{setFlashcards(null);setKnown([]);setUnknown([])}} style={{...btn, background:'rgba(6,214,160,0.1)', color:'#06d6a0', border:'2px solid rgba(6,214,160,0.3)', padding:'12px'}}>
                    🔄 Nouvelles cartes
                  </button>
                  <button onClick={()=>{
                    const toReview = unknown
                    setCurrentCard(0)
                    setFlipped(false)
                    setKnown([])
                    setUnknown([])
                    setFlashcards({...flashcards, cartes: toReview.map((i:number)=>flashcards.cartes[i])})
                  }} style={{...btn, background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', padding:'12px'}}>
                    🔁 Retravailler les ratées
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px'}}>
                  <div style={{fontSize:'0.78rem', fontWeight:800, color:'#8e8cb0'}}>Carte {currentCard+1}/{flashcards.cartes.length}</div>
                  <div style={{display:'flex', gap:'8px'}}>
                    <span style={{fontSize:'0.72rem', fontWeight:800, color:'#06d6a0'}}>✅ {known.length}</span>
                    <span style={{fontSize:'0.72rem', fontWeight:800, color:'#ef476f'}}>❌ {unknown.length}</span>
                  </div>
                </div>

                <div style={{background:'rgba(255,255,255,0.04)', borderRadius:'6px', height:'4px', marginBottom:'20px', overflow:'hidden'}}>
                  <div style={{height:'100%', background:'linear-gradient(135deg,#06d6a0,#00a8b5)', width:`${((known.length+unknown.length)/flashcards.cartes.length)*100}%`, transition:'width 0.3s'}}/>
                </div>

                <div onClick={()=>setFlipped(f=>!f)} style={{
                  background:'#131120', border:`2px solid ${flipped?'rgba(6,214,160,0.4)':'#2a2740'}`,
                  borderRadius:'22px', padding:'40px 24px', textAlign:'center', cursor:'pointer',
                  minHeight:'200px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  marginBottom:'16px', transition:'all 0.3s'
                }}>
                  {!flipped ? (
                    <>
                      <div style={{fontSize:'0.72rem', fontWeight:800, color:'#a48bff', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'16px'}}>
                        {flashcards.cartes[currentCard].type === 'formule' ? '🔢 Formule' : flashcards.cartes[currentCard].type === 'date' ? '📅 Date' : flashcards.cartes[currentCard].type === 'definition' ? '📖 Définition' : '💡 Concept'}
                      </div>
                      <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700, lineHeight:1.5}}>{flashcards.cartes[currentCard].recto}</div>
                      <div style={{fontSize:'0.75rem', color:'#8e8cb0', fontWeight:600, marginTop:'20px'}}>👆 Tape pour voir la réponse</div>
                    </>
                  ) : (
                    <>
                      <div style={{fontSize:'0.72rem', fontWeight:800, color:'#06d6a0', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'16px'}}>✅ Réponse</div>
                      <div style={{fontSize:'0.95rem', fontWeight:600, lineHeight:1.7, color:'#f0eeff'}}>{flashcards.cartes[currentCard].verso}</div>
                    </>
                  )}
                </div>

                {flipped && (
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                    <button onClick={()=>{
                      setUnknown(u=>[...u, currentCard])
                      setCurrentCard(c=>c+1)
                      setFlipped(false)
                    }} style={{...btn, background:'rgba(239,71,111,0.1)', color:'#ef476f', border:'2px solid rgba(239,71,111,0.3)', padding:'14px', fontSize:'0.9rem'}}>
                      ❌ Je ne savais pas
                    </button>
                    <button onClick={()=>{
                      setKnown(k=>[...k, currentCard])
                      setCurrentCard(c=>c+1)
                      setFlipped(false)
                    }} style={{...btn, background:'rgba(6,214,160,0.1)', color:'#06d6a0', border:'2px solid rgba(6,214,160,0.3)', padding:'14px', fontSize:'0.9rem'}}>
                      ✅ Je savais !
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* RÉSUMÉ DE COURS */}
        {mode==='resume' && (
          <div>
            {!resumeResult ? (
              <div>
                <div style={{textAlign:'center', marginBottom:'24px'}}>
                  <img src='/dune-lit.png' style={{width:'70px',height:'70px',objectFit:'contain',animation:'bounce 2s infinite',filter:'drop-shadow(0 4px 12px rgba(124,92,252,0.5))',marginBottom:'8px'}} alt='Dune'/>
                  <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', fontWeight:700}}>Résumé de cours IA</div>
                  <p style={{fontSize:'0.82rem', color:'#8e8cb0', fontWeight:600, marginTop:'6px'}}>Colle ton cours ou prends une photo — DuneIA génère une fiche de révision complète</p>
                </div>
                <div style={{marginBottom:'12px'}}>
                  <select value={resumeMatiere} onChange={e=>setResumeMatiere(e.target.value)} style={{width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.9rem', fontWeight:700, outline:'none'}}>
                    {matieres.map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                {resumeTexte && (
                  <div style={{marginBottom:'12px', borderRadius:'12px', overflow:'hidden', border:'2px solid #2a2740'}}>
                    <img src={resumeTexte} alt="Cours" style={{width:'100%', display:'block'}}/>
                  </div>
                )}

                <input id="resumePhoto" type="file" accept="image/*" capture="environment" style={{display:'none'}}
                  onChange={async(e)=>{
                    const file = e.target.files?.[0]
                    if(!file) return
                    const reader = new FileReader()
                    reader.onload = async(ev) => {
                      const dataUrl = ev.target?.result as string
                      const base64 = dataUrl.split(',')[1]
                      setResumeTexte(dataUrl)
                      setResumeLoading(true)
                      try {
                        const token = localStorage.getItem('duneia_token')
                        const r = await fetch('https://scolaria-backend-production.up.railway.app/api/ai/resume-cours', {
                          method:'POST',
                          headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
                          body: JSON.stringify({imageBase64:base64, mimeType:file.type, matiere:resumeMatiere, classe:user?.classe})
                        })
                        const d = await r.json()
                        if(d.success) setResumeResult(d.resume)
                      } catch(e) { console.error(e) }
                      finally { setResumeLoading(false) }
                    }
                    reader.readAsDataURL(file)
                  }}
                />

                {resumeLoading ? (
                  <div style={{textAlign:'center', padding:'30px'}}>
                    <div style={{width:'36px', height:'36px', border:'3px solid rgba(164,139,255,0.3)', borderTopColor:'#a48bff', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px'}}/>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', color:'#a48bff'}}>Génération de ta fiche...</div>
                  </div>
                ) : (
                  <div style={{display:'grid', gap:'10px'}}>
                    <button onClick={()=>document.getElementById('resumePhoto')?.click()} style={{...btn, background:'linear-gradient(135deg,#a48bff,#7c5cfc)', color:'white', width:'100%', padding:'14px', fontSize:'0.95rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                      📷 Prendre une photo de mon cours
                    </button>
                    <button onClick={()=>{const i=document.getElementById('resumePhoto') as HTMLInputElement; if(i){i.removeAttribute('capture');i.click()}}} style={{...btn, background:'transparent', border:'2px solid #2a2740', color:'#8e8cb0', width:'100%', padding:'12px', fontSize:'0.88rem'}}>
                      🖼️ Choisir depuis la galerie
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{background:'linear-gradient(135deg,rgba(124,92,252,0.15),rgba(255,107,157,0.08))', border:'2px solid rgba(124,92,252,0.3)', borderRadius:'18px', padding:'20px', marginBottom:'14px'}}>
                  <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, marginBottom:'8px'}}>{resumeResult.titre}</div>
                  <p style={{fontSize:'0.84rem', color:'#f0eeff', fontWeight:600, lineHeight:1.7, margin:0}}>{resumeResult.resume}</p>
                </div>
                {resumeResult.a_retenir && (
                  <div style={{background:'rgba(255,209,102,0.08)', border:'2px solid rgba(255,209,102,0.2)', borderRadius:'14px', padding:'14px', marginBottom:'14px'}}>
                    <div style={{fontSize:'0.72rem', fontWeight:800, color:'#ffd166', marginBottom:'6px'}}>⭐ À RETENIR</div>
                    <p style={{fontSize:'0.86rem', fontWeight:700, color:'#ffd166', margin:0}}>{resumeResult.a_retenir}</p>
                  </div>
                )}
                {resumeResult.points_cles?.length > 0 && (
                  <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'16px', padding:'18px', marginBottom:'14px'}}>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, marginBottom:'12px'}}>📌 Points clés</div>
                    {resumeResult.points_cles.map((p:string,i:number)=>(
                      <div key={i} style={{display:'flex', gap:'8px', marginBottom:'8px', fontSize:'0.83rem', fontWeight:600, color:'#f0eeff'}}>
                        <span style={{color:'#a48bff', flexShrink:0}}>•</span>{p}
                      </div>
                    ))}
                  </div>
                )}
                {resumeResult.definitions?.length > 0 && (
                  <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'16px', padding:'18px', marginBottom:'14px'}}>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, marginBottom:'12px'}}>📚 Définitions</div>
                    {resumeResult.definitions.map((d:any,i:number)=>(
                      <div key={i} style={{marginBottom:'10px', paddingBottom:'10px', borderBottom:i<resumeResult.definitions.length-1?'1px solid rgba(255,255,255,0.05)':'none'}}>
                        <div style={{fontSize:'0.82rem', fontWeight:800, color:'#a48bff', marginBottom:'3px'}}>{d.terme}</div>
                        <div style={{fontSize:'0.8rem', fontWeight:600, color:'#8e8cb0', lineHeight:1.6}}>{d.definition}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                  <button onClick={()=>{setResumeResult(null);setResumeTexte('')}} style={{...btn, background:'rgba(124,92,252,0.1)', color:'#a48bff', border:'2px solid rgba(124,92,252,0.3)', padding:'12px'}}>
                    🔄 Nouveau résumé
                  </button>
                  <button onClick={()=>setMode('flash')} style={{...btn, background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', padding:'12px'}}>
                    🃏 Flashcards
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      {limiteType && <LimiteModal type={limiteType} onClose={()=>setLimiteType(null)}/>}
      <BottomNav active="app"/>
      <style dangerouslySetInnerHTML={{__html: "@keyframes bounce { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }"}}/>
    </div>
    </>
  )
}
// jeu. 14 mai 2026 15:47:10 CEST
