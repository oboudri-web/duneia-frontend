'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const BACKEND = 'https://scolaria-backend-production.up.railway.app'

const TABS = [
  {id:0, icon:'🍂', label:'T1', sub:'Oct–Déc'},
  {id:1, icon:'❄️', label:'T2', sub:'Jan–Mar'},
  {id:2, icon:'🌸', label:'T3', sub:'Avr–Juin'},
  {id:3, icon:'📚', label:'Programme', sub:'Chapitres'},
  {id:4, icon:'🎯', label:'Annales', sub:'⭐', premium:true},
  {id:5, icon:'📊', label:'Prédiction', sub:'⭐', premium:true},
  {id:6, icon:'🗣️', label:'Oral IA', sub:'⭐', premium:true},
  {id:7, icon:'🏆', label:'Amis', sub:'XP'},
  {id:8, icon:'📸', label:'Copie', sub:'⭐', premium:true},
  {id:9, icon:'🧬', label:'ADN', sub:'⭐', premium:true},
]

const MATIERES = ['Mathématiques','Français','Histoire-Géo','Physique-Chimie','SVT','Anglais','Espagnol','Philosophie','SES','NSI','Autre']

const PROGRAMME: Record<string, Record<string, string[]>> = {
  '6ème': {
    'Mathématiques': ['Nombres entiers et décimaux','Fractions','Calcul littéral','Géométrie plane','Aires et périmètres','Symétrie','Statistiques et probabilités'],
    'Français': ['Récit de création — mythes','Le monstre, auxiliaire du héros','Résister aux plus forts','Vivre en société','Dire, lire, publier la poésie'],
    'Histoire-Géo': ['La longue histoire de l\'humanité','Récits fondateurs, croyances et citoyenneté','L\'empire romain','Regards sur les sociétés médiévales','La Terre, planète habitée'],
    'Anglais': ['Se présenter — identité','La famille et les relations','L\'école et le quotidien','Les loisirs et la culture','Voyager et découvrir'],
    'SVT': ['La Terre, une planète habitée','Le peuplement des milieux','La nutrition des plantes','La reproduction des êtres vivants'],
    'Physique-Chimie': ['L\'air qui nous entoure','Les états de la matière','Les mélanges','La lumière'],
  },
  '5ème': {
    'Mathématiques': ['Nombres relatifs','Fractions et calculs','Proportionnalité','Géométrie — droites et angles','Triangles et quadrilatères','Volumes et contenance','Statistiques'],
    'Français': ['Le voyage et l\'aventure','Résister aux oppresseurs','Imaginer des mondes','La poésie pour célébrer','Informer, s\'informer, déformer'],
    'Histoire-Géo': ['Chrétientés et islam','La Méditerranée médiévale','Société, Église et pouvoir','Transformations de l\'Europe','Thème géo: Des ressources'],
    'Anglais': ['Identité et diversité','Voyage et découverte','Science et progrès','Arts et culture','Citoyenneté'],
    'SVT': ['Organisation du vivant','La nutrition','La reproduction sexuée','Géologie — histoire de la Terre'],
    'Physique-Chimie': ['Diversité de la matière','Propriétés des métaux','Électricité','Le son'],
  },
  '4ème': {
    'Mathématiques': ['Puissances et racines','Développement et factorisation','Équations du 1er degré','Théorème de Pythagore','Théorème de Thalès','Trigonométrie','Probabilités'],
    'Français': ['Se chercher, se construire','Avec autrui — la relation à l\'autre','Regarder le monde','Agir dans la cité','L\'éloquence'],
    'Histoire-Géo': ['L\'Europe et le monde au XVIIIe','La Révolution française','Le XIXe siècle industriel','Un monde en mutation','Géo: Urbanisation'],
    'Anglais': ['Relations et amitié','Histoire et mémoire','Environnement','Innovation','Médias numériques'],
    'SVT': ['Microorganismes et santé','Système nerveux','Reproduction humaine','Tectonique des plaques'],
    'Physique-Chimie': ['Lumière et couleurs','Forces et mouvements','Électricité — circuits','Chimie — réactions'],
  },
  '3ème': {
    'Mathématiques': ['Calcul numérique et littéral','Équations et inéquations','Fonctions','Géométrie — transformations','Théorème de Pythagore avancé','Statistiques et probabilités','Trigonométrie'],
    'Français': ['Le roman — regards sur l\'individu','La poésie — engagements','Le théâtre — rire et savoir','Informer et convaincre','Littérature francophone'],
    'Histoire-Géo': ['L\'Europe, conflits et mémoires','Le monde depuis 1945','Citoyenneté — République','Géo: La France et l\'UE','Géo: Mondialisation'],
    'Anglais': ['Identité nationale','Citoyenneté et engagement','Environnement','Progrès et technologie','Expression culturelle'],
    'SVT': ['Génétique et hérédité','Corps humain — immunité','Évolution des espèces','Géologie — ères géologiques'],
    'Physique-Chimie': ['Signaux et capteurs','Mouvements et forces','Énergie','Chimie organique intro'],
  },
  '2nde': {
    'Mathématiques': ['Ensembles et raisonnement','Fonctions — généralités','Fonctions de référence','Géométrie repérée','Statistiques descriptives','Probabilités','Suites numériques intro'],
    'Français': ['Le roman et le récit','La poésie du XIXe au XXIe','Le théâtre — texte et représentation','La littérature d\'idées','Oral — éloquence'],
    'Histoire-Géo': ['Sociétés et environnements','Le monde méditerranéen (Antiquité)','Essor et affirmation de l\'Europe','Territoires, populations, développement'],
    'Anglais': ['Art et création','Rencontres avec l\'autre','Espace privé et public','Sciences et avenir','Identités et échanges'],
    'SVT': ['La cellule — unité du vivant','Nutrition et respiration','Génome et expression génétique','Évolution — Darwin'],
    'Physique-Chimie': ['Constitution de la matière','Lumière et couleurs','Mouvements','Corps purs et mélanges'],
    'SES': ['Les grandes questions économiques','La production','Le marché','Les revenus et la répartition'],
  },
  '1ère': {
    'Mathématiques': ['Suites numériques','Dérivation','Fonctions exponentielles','Géométrie dans l\'espace','Probabilités conditionnelles','Combinatoire','Algorithmique'],
    'Français': ['Le roman — personnage et société','La poésie — XIX-XXe siècles','Le théâtre classique et moderne','La littérature d\'idées — Lumières','Bac : préparation EAF'],
    'Histoire-Géo': ['L\'industrialisation','Les transformations politiques (XIXe)','La mondialisation','L\'UE — dynamiques et tensions'],
    'Anglais': ['Faire la fête pour résister','Raconter une fiction','S\'informer','Créer et innover','Habitat et peuplement'],
    'SVT': ['Transmission de la vie','Géologie — histoire de la Terre','Corps humain et médecine','Comportement et cerveau'],
    'Physique-Chimie': ['Mécanique — forces et mouvement','Énergie et puissance','Ondes et signaux','Structure de la matière'],
    'SES': ['Marchés et prix','Croissance économique','Stratification sociale','Institutions politiques'],
  },
  'Terminale': {
    'Mathématiques': ['Continuité et limites','Dérivation avancée','Intégration','Logarithme népérien','Probabilités continues','Variables aléatoires','Géométrie vectorielle 3D'],
    'Philosophie': ['Le sujet','La culture','La raison','La politique','La morale','La liberté','La nature'],
    'Histoire-Géo': ['La Méditerranée — espace d\'échanges','Le Proche et Moyen-Orient','L\'Afrique australe','La France et le monde','Mers et océans'],
    'Anglais': ['L\'art de convaincre','Représenter le monde','Exprimer sa singularité','Imaginer des futurs','Mémoire et histoire'],
    'SVT': ['Immunité et santé','Génétique avancée','Neurosciences','Évolution et biodiversité','Procréation et éthique'],
    'Physique-Chimie': ['Modélisation chimique','Chimie organique','Mécanique avancée','Ondes et optique','Énergie et transition'],
    'SES': ['Croissance et développement','Marchés financiers','Mondialisation','Stratification et mobilité','Socialisation et lien social'],
  },
}

type Note = {matiere:string, note:string, appreciation:string}

export default function App() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [xp, setXp] = useState(100)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState('')
  const [importMode, setImportMode] = useState<'none'|'pronote'|'photo'|'manuel'>('none')
  const [classe, setClasse] = useState('3ème')
  const [selectedMatiere, setSelectedMatiere] = useState<string>('')
  const [chapitreStatus, setChapitreStatus] = useState<Record<string,Record<string,'vu'|'en_cours'|'pas_vu'|'a_revoir'>>>({})
  const [chapitreNotes, setChapitreNotes] = useState<Record<string,Record<string,string>>>({})
  const [editingNote, setEditingNote] = useState<string>('')
  const [noteInput, setNoteInput] = useState('')
  const [showPlan, setShowPlan] = useState(false)
  const [planContent, setPlanContent] = useState('')
  const [planLoading, setPlanLoading] = useState(false)
  const [planMatiere, setPlanMatiere] = useState('')

  const [notes, setNotes] = useState<{[tri:number]: Note[]}>({
    0:[{matiere:'',note:'',appreciation:''}],
    1:[{matiere:'',note:'',appreciation:''}],
    2:[{matiere:'',note:'',appreciation:''}],
  })

  useEffect(() => {
    const u = localStorage.getItem('duneia_user')
    if(!u) { router.push('/auth'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    setXp(parsed.xp || 100)
    if(parsed.classe) setClasse(parsed.classe)
    const saved = localStorage.getItem('duneia_notes')
    if(saved) setNotes(JSON.parse(saved))
    const savedChap = localStorage.getItem('duneia_chapitres')
    if(savedChap) setChapitreStatus(JSON.parse(savedChap))
    const savedChapNotes = localStorage.getItem('duneia_chapitres_notes')
    if(savedChapNotes) setChapitreNotes(JSON.parse(savedChapNotes))
  }, [])

  function isPremium() { return user?.plan_active && ['premium','famille'].includes(user?.plan) }

  function handleTab(tab:any) {
    if(tab.premium && !isPremium()) { setUpgradeFeature(tab.label); setShowUpgrade(true); return }
    setActiveTab(tab.id)
    setImportMode('none')
  }

  function updateNote(tri:number, idx:number, field:keyof Note, val:string) {
    const updated = {...notes, [tri]: notes[tri].map((n,i)=>i===idx?{...n,[field]:val}:n)}
    setNotes(updated)
    localStorage.setItem('duneia_notes', JSON.stringify(updated))
  }

  function addNote(tri:number) {
    const updated = {...notes, [tri]:[...notes[tri],{matiere:'',note:'',appreciation:''}]}
    setNotes(updated)
    localStorage.setItem('duneia_notes', JSON.stringify(updated))
  }

  function removeNote(tri:number, idx:number) {
    const updated = {...notes, [tri]:notes[tri].filter((_,i)=>i!==idx)}
    setNotes(updated)
    localStorage.setItem('duneia_notes', JSON.stringify(updated))
  }

  function getMoy(tri:number) {
    const valids = notes[tri].filter(n=>n.note && !isNaN(parseFloat(n.note)))
    if(!valids.length) return null
    return (valids.reduce((s,n)=>s+parseFloat(n.note),0)/valids.length).toFixed(1)
  }

  function getNoteColor(n:string) {
    const v = parseFloat(n)
    if(isNaN(v)) return '#8e8cb0'
    if(v>=14) return '#06d6a0'
    if(v>=10) return '#ffd166'
    return '#ef476f'
  }

  function setChapStatus(matiere:string, chapitre:string, status:'vu'|'en_cours'|'pas_vu'|'a_revoir') {
    const updated = {
      ...chapitreStatus,
      [matiere]: { ...(chapitreStatus[matiere]||{}), [chapitre]: status }
    }
    setChapitreStatus(updated)
    localStorage.setItem('duneia_chapitres', JSON.stringify(updated))
  }

  function saveChapNote(matiere:string, chapitre:string, note:string) {
    const updated = {...chapitreNotes, [matiere]:{...(chapitreNotes[matiere]||{}), [chapitre]:note}}
    setChapitreNotes(updated)
    localStorage.setItem('duneia_chapitres_notes', JSON.stringify(updated))
    setEditingNote('')
    setNoteInput('')
  }

  function getChapNote(matiere:string, chapitre:string) {
    return chapitreNotes[matiere]?.[chapitre] || ''
  }

  async function generatePlan(matiere: string) {
    const prog = PROGRAMME[classe]?.[matiere] || []
    const aRevoir = prog.filter(c=>getChapStatus(matiere,c)==='a_revoir')
    const enCours = prog.filter(c=>getChapStatus(matiere,c)==='en_cours')
    const pasVu = prog.filter(c=>getChapStatus(matiere,c)==='pas_vu')
    const vus = prog.filter(c=>getChapStatus(matiere,c)==='vu')
    const notes_chap = prog.map(c=>({chap:c, note:getChapNote(matiere,c), status:getChapStatus(matiere,c)})).filter(x=>x.note)

    setPlanMatiere(matiere)
    setPlanLoading(true)
    setShowPlan(true)
    setPlanContent('')

    const prompt = `Tu es un expert en pédagogie scolaire française. Génère un plan de révision personnalisé.

Élève: ${classe} · Matière: ${matiere}
Chapitres vus ✅: ${vus.join(', ') || 'aucun'}
En cours 🔄: ${enCours.join(', ') || 'aucun'}
À revoir 🔁: ${aRevoir.join(', ') || 'aucun'}
Pas encore vus ⬜: ${pasVu.join(', ') || 'aucun'}
${notes_chap.length ? 'Notes élève: ' + notes_chap.map(x=>x.chap+': "'+x.note+'"').join(' | ') : ''}

Génère un plan de révision sur 3 semaines, structuré comme suit:
- Semaine 1: priorité aux chapitres "À revoir" (mal compris)
- Semaine 2: compléter les chapitres "En cours" + exercices sur les lacunes
- Semaine 3: revoir tout + préparer l'examen

Pour chaque semaine: 3-4 sessions avec durée, objectif précis et exercices concrets.
Sois direct, motivant, et ultra-personnalisé selon les notes de l'élève.
Commence par un diagnostic en 2 phrases.`

    try {
      const token = localStorage.getItem('duneia_token')
      const r = await fetch(BACKEND+'/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token
        },
        body: JSON.stringify({ prompt })
      })
      const d = await r.json()
      setPlanContent(d.text || d.error || 'Erreur génération plan')
    } catch(e) {
      setPlanContent('Erreur connexion — réessaie !')
    } finally {
      setPlanLoading(false)
    }
  }

  function getChapStatus(matiere:string, chapitre:string): 'vu'|'en_cours'|'pas_vu'|'a_revoir' {
    return chapitreStatus[matiere]?.[chapitre] || 'pas_vu'
  }

  function getProgression(matiere:string) {
    const prog = PROGRAMME[classe]?.[matiere] || []
    if(!prog.length) return null
    const vus = prog.filter(c=>getChapStatus(matiere,c)==='vu').length
    const enCours = prog.filter(c=>getChapStatus(matiere,c)==='en_cours').length
    return {vus, enCours, total:prog.length, pct:Math.round((vus/prog.length)*100)}
  }

  const level = Math.floor(xp/500)+1
  const inp:React.CSSProperties = {width:'100%', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'10px', padding:'9px 12px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.84rem', fontWeight:600, outline:'none'}
  const lbl:React.CSSProperties = {display:'block', fontSize:'0.68rem', fontWeight:800, color:'#8e8cb0', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'5px'}
  const btn:React.CSSProperties = {padding:'11px 18px', borderRadius:'11px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.88rem', cursor:'pointer'}

  function TriPanel({tri}:{tri:number}) {
    const moy = getMoy(tri)
    const moyColor = moy ? getNoteColor(moy) : '#8e8cb0'

    if(importMode === 'none') return (
      <div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px'}}>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.05rem', fontWeight:700}}>{TABS[tri].icon} Trimestre {tri+1}</div>
          {moy && <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.4rem', fontWeight:700, color:moyColor}}>{moy}/20</div>}
        </div>
        {notes[tri].some(n=>n.matiere) && (
          <div style={{marginBottom:'16px'}}>
            {notes[tri].filter(n=>n.matiere).map((n,i)=>(
              <div key={i} style={{display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'11px', marginBottom:'7px'}}>
                <div style={{flex:1, fontSize:'0.84rem', fontWeight:700}}>{n.matiere}</div>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:getNoteColor(n.note)}}>{n.note}/20</div>
                {n.appreciation && <div style={{fontSize:'0.72rem', color:'#8e8cb0', fontWeight:600, maxWidth:'120px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>"{n.appreciation}"</div>}
              </div>
            ))}
          </div>
        )}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'14px'}}>
          {[
            {mode:'pronote', icon:'🔗', label:'Sync Pronote', desc:'Automatique', color:'rgba(6,214,160,0.15)', border:'rgba(6,214,160,0.3)'},
            {mode:'photo', icon:'📸', label:'Photo bulletin', desc:'OCR IA', color:'rgba(124,92,252,0.1)', border:'rgba(124,92,252,0.3)'},
            {mode:'manuel', icon:'✏️', label:'Saisie manuelle', desc:'Rapide', color:'rgba(255,209,102,0.08)', border:'rgba(255,209,102,0.25)'},
          ].map(opt=>(
            <div key={opt.mode} onClick={()=>setImportMode(opt.mode as any)} style={{padding:'12px 8px', background:opt.color, border:`2px solid ${opt.border}`, borderRadius:'13px', cursor:'pointer', textAlign:'center', transition:'all 0.2s'}}>
              <div style={{fontSize:'1.3rem', marginBottom:'4px'}}>{opt.icon}</div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.78rem', fontWeight:700}}>{opt.label}</div>
              <div style={{fontSize:'0.62rem', color:'#8e8cb0', fontWeight:700, marginTop:'2px'}}>{opt.desc}</div>
            </div>
          ))}
        </div>
        {notes[tri].some(n=>n.matiere) && <button style={{...btn, width:'100%'}}>🧠 Analyser avec l'IA</button>}
      </div>
    )

    if(importMode === 'manuel') return (
      <div>
        <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px'}}>
          <button onClick={()=>setImportMode('none')} style={{width:'32px', height:'32px', borderRadius:'9px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', cursor:'pointer', fontSize:'1rem'}}>←</button>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700}}>✏️ Saisie manuelle — T{tri+1}</div>
          {moy && <div style={{marginLeft:'auto', fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', color:moyColor}}>{moy}/20</div>}
        </div>
        {notes[tri].map((n,i)=>(
          <div key={i} style={{background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'13px', padding:'12px', marginBottom:'9px'}}>
            <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'8px', marginBottom:'8px'}}>
              <div>
                <label style={lbl}>Matière</label>
                <select style={inp} value={n.matiere} onChange={e=>updateNote(tri,i,'matiere',e.target.value)}>
                  <option value="">Choisir...</option>
                  {MATIERES.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Note /20</label>
                <input style={{...inp, textAlign:'center'}} type="number" min="0" max="20" step="0.5" placeholder="—" value={n.note} onChange={e=>updateNote(tri,i,'note',e.target.value)}/>
              </div>
            </div>
            <label style={lbl}>Appréciation du prof</label>
            <input style={inp} placeholder="Ex: Bon travail, efforts à maintenir..." value={n.appreciation} onChange={e=>updateNote(tri,i,'appreciation',e.target.value)}/>
            {notes[tri].length > 1 && <button onClick={()=>removeNote(tri,i)} style={{marginTop:'8px', fontSize:'0.72rem', color:'#ef476f', background:'none', border:'none', cursor:'pointer', fontWeight:700}}>✕ Supprimer</button>}
          </div>
        ))}
        <div style={{display:'flex', gap:'8px', marginTop:'4px'}}>
          <button onClick={()=>addNote(tri)} style={{flex:1, padding:'10px', borderRadius:'11px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem', cursor:'pointer'}}>+ Matière</button>
          <button onClick={()=>setImportMode('none')} style={{...btn, flex:1}}>✅ Enregistrer</button>
        </div>
      </div>
    )

    if(importMode === 'photo') return (
      <div>
        <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px'}}>
          <button onClick={()=>setImportMode('none')} style={{width:'32px', height:'32px', borderRadius:'9px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', cursor:'pointer', fontSize:'1rem'}}>←</button>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700}}>📸 Photo du bulletin</div>
        </div>
        <div onClick={()=>document.getElementById('photoInput')?.click()} style={{border:'3px dashed rgba(124,92,252,0.35)', borderRadius:'16px', padding:'36px 20px', textAlign:'center', cursor:'pointer', background:'rgba(124,92,252,0.03)'}}>
          <div style={{fontSize:'2.5rem', marginBottom:'10px'}}>📄</div>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, marginBottom:'4px'}}>Photo de ton bulletin</div>
          <div style={{fontSize:'0.76rem', color:'#8e8cb0', fontWeight:600}}>OCR en cours de développement</div>
        </div>
        <p style={{fontSize:'0.76rem', color:'#8e8cb0', fontWeight:600, textAlign:'center', marginTop:'12px', lineHeight:1.5}}>
          💡 Utilise la <span style={{color:'#a48bff', cursor:'pointer', fontWeight:800}} onClick={()=>setImportMode('manuel')}>saisie manuelle</span> en attendant
        </p>
      </div>
    )

    if(importMode === 'pronote') return (
      <div>
        <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px'}}>
          <button onClick={()=>setImportMode('none')} style={{width:'32px', height:'32px', borderRadius:'9px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', cursor:'pointer', fontSize:'1rem'}}>←</button>
          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700}}>🔗 Sync Pronote</div>
        </div>
        <button onClick={()=>router.push('/onboarding')} style={{...btn, width:'100%'}}>🔗 Connecter Pronote</button>
      </div>
    )
    return null
  }

  // ── PROGRAMME PANEL ──
  const progClasse = PROGRAMME[classe] || {}
  const matieresProg = Object.keys(progClasse)
  const chapitres = selectedMatiere ? (progClasse[selectedMatiere] || []) : []
  const prog = selectedMatiere ? getProgression(selectedMatiere) : null

  const STATUS_CONFIG = {
    pas_vu:  {label:'À voir',    color:'transparent', textColor:'#8e8cb0', icon:'⬜'},
    en_cours:{label:'En cours',  color:'rgba(255,209,102,0.08)', textColor:'#ffd166', icon:'🔄'},
    vu:      {label:'Vu ✓',      color:'rgba(6,214,160,0.07)', textColor:'#06d6a0', icon:'✅'},
    a_revoir:{label:'À revoir',  color:'rgba(239,71,111,0.07)', textColor:'#ef476f', icon:'🔁'},
  }

  return (
    <div style={{minHeight:'100vh', position:'relative', zIndex:1}}>
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(10,9,20,0.95)', backdropFilter:'blur(20px)', borderBottom:'2px solid #2a2740', padding:'12px 16px', display:'flex', alignItems:'center', gap:'12px'}}>
        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#ffd166', cursor:'pointer'}} onClick={()=>router.push('/')}>🎓 DuneIA</div>
        <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{background:'rgba(255,209,102,0.1)', border:'1px solid rgba(255,209,102,0.25)', borderRadius:'100px', padding:'4px 12px', fontSize:'0.75rem', fontWeight:800, color:'#ffd166'}}>⭐ {xp} XP · Niv.{level}</div>
          <div style={{width:'34px', height:'34px', borderRadius:'10px', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', cursor:'pointer'}}>{user?.avatar || '🧑‍🎓'}</div>
        </div>
      </nav>

      <div style={{maxWidth:'680px', margin:'0 auto', padding:'16px'}}>
        <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'14px', padding:'14px 16px', marginBottom:'14px'}}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'6px'}}>
            <span style={{fontSize:'0.75rem', fontWeight:800, color:'#8e8cb0'}}>Niveau {level}</span>
            <span style={{fontSize:'0.75rem', fontWeight:800, color:'#ffd166'}}>{xp} / {level*500} XP</span>
          </div>
          <div style={{height:'6px', background:'#1c1a2e', borderRadius:'100px', overflow:'hidden'}}>
            <div style={{height:'100%', background:'linear-gradient(90deg,#7c5cfc,#ff6b9d)', borderRadius:'100px', width:Math.min(100,(xp%(level*500))/(level*500)*100)+'%', transition:'width 1s'}}/>
          </div>
        </div>

        <div style={{background:'rgba(6,214,160,0.05)', border:'2px solid rgba(6,214,160,0.2)', borderRadius:'13px', padding:'11px 14px', marginBottom:'14px', display:'flex', alignItems:'center', gap:'10px', cursor:'pointer'}} onClick={()=>router.push('/onboarding')}>
          <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#8e8cb0'}}/>
          <span style={{fontSize:'0.8rem', fontWeight:800, color:'#8e8cb0'}}>Connecter Pronote pour importer tes notes automatiquement</span>
          <span style={{marginLeft:'auto', fontSize:'0.75rem', fontWeight:800, color:'#06d6a0'}}>→</span>
        </div>

        <div style={{display:'flex', gap:'5px', overflowX:'auto', marginBottom:'14px', paddingBottom:'4px'}}>
          {TABS.map(tab=>(
            <button key={tab.id} onClick={()=>handleTab(tab)} style={{flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', padding:'8px 10px', borderRadius:'10px', border:'none', cursor:'pointer', background:activeTab===tab.id?'#7c5cfc':'transparent', color:activeTab===tab.id?'white':'#8e8cb0', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.72rem', boxShadow:activeTab===tab.id?'0 4px 16px rgba(124,92,252,0.38)':'none', transition:'all 0.2s'}}>
              <span style={{fontSize:'1rem'}}>{tab.icon}</span>
              {tab.label}
              <span style={{fontSize:'0.55rem', opacity:0.7}}>{tab.sub}</span>
            </button>
          ))}
        </div>

        <div style={{background:'#131120', border:'2px solid #2a2740', borderRadius:'18px', padding:'22px', minHeight:'300px'}}>
          {activeTab <= 2 && <TriPanel tri={activeTab}/>}

          {/* PROGRAMME */}
          {activeTab === 3 && (
            <div>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', flexWrap:'wrap', gap:'10px'}}>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.05rem', fontWeight:700}}>📚 Mon programme — {classe}</div>
                <select value={classe} onChange={e=>{setClasse(e.target.value);setSelectedMatiere('')}} style={{background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'9px', padding:'6px 10px', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.8rem', fontWeight:700, outline:'none'}}>
                  {Object.keys(PROGRAMME).map(c=><option key={c}>{c}</option>)}
                </select>
              </div>

              {!selectedMatiere ? (
                // Liste des matières avec progression
                <div>
                  <p style={{fontSize:'0.8rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.6, marginBottom:'14px'}}>
                    Clique sur une matière pour voir et cocher tes chapitres. DuneIA utilise ça pour cibler ton plan de révision.
                  </p>
                  {matieresProg.map(mat=>{
                    const p = getProgression(mat)
                    return (
                      <div key={mat} onClick={()=>setSelectedMatiere(mat)} style={{display:'flex', alignItems:'center', gap:'12px', padding:'13px', background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'13px', marginBottom:'8px', cursor:'pointer', transition:'all 0.2s'}}>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:800, fontSize:'0.86rem', marginBottom:'5px'}}>{mat}</div>
                          <div style={{height:'5px', background:'#2a2740', borderRadius:'100px', overflow:'hidden', width:'100%'}}>
                            <div style={{height:'100%', background:p && p.pct===100?'#06d6a0':'linear-gradient(90deg,#7c5cfc,#ff6b9d)', borderRadius:'100px', width:(p?.pct||0)+'%', transition:'width 0.8s'}}/>
                          </div>
                        </div>
                        <div style={{textAlign:'right', flexShrink:0}}>
                          <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.9rem', fontWeight:700, color: p && p.pct===100?'#06d6a0':p && p.pct>0?'#ffd166':'#8e8cb0'}}>{p?.pct||0}%</div>
                          <div style={{fontSize:'0.65rem', color:'#8e8cb0', fontWeight:700}}>{p?.vus||0}/{p?.total||0} chapitres</div>
                        </div>
                        <div style={{color:'#8e8cb0', fontSize:'0.9rem'}}>→</div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                // Chapitres d'une matière
                <div>
                  <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px'}}>
                    <button onClick={()=>setSelectedMatiere('')} style={{width:'32px', height:'32px', borderRadius:'9px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', cursor:'pointer', fontSize:'1rem'}}>←</button>
                    <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700}}>{selectedMatiere}</div>
                    {prog && (
                    <div style={{marginLeft:'auto', display:'flex', gap:'8px', fontSize:'0.72rem', fontWeight:800}}>
                      <span style={{color:'#06d6a0'}}>{prog.vus} vus</span>
                      {prog.enCours>0 && <span style={{color:'#ffd166'}}>{prog.enCours} en cours</span>}
                      <span style={{color:'#8e8cb0'}}>/{prog.total}</span>
                    </div>
                  )}
                  </div>

                  {/* Légende */}
                  <div style={{display:'flex', gap:'8px', marginBottom:'14px', flexWrap:'wrap', alignItems:'center'}}>
                    {Object.entries(STATUS_CONFIG).map(([s,c])=>(
                      <div key={s} style={{display:'flex', alignItems:'center', gap:'4px', fontSize:'0.68rem', fontWeight:800, color:c.textColor}}>
                        <span>{c.icon}</span>{c.label}
                      </div>
                    ))}
                    <div style={{fontSize:'0.68rem', color:'#8e8cb0', fontWeight:600, marginLeft:'auto'}}>💬 note · clique pour changer</div>
                  </div>

                  {chapitres.map((chap,i)=>{
                    const status = getChapStatus(selectedMatiere, chap)
                    const cfg = STATUS_CONFIG[status]
                    const nextStatus = status==='pas_vu'?'en_cours':status==='en_cours'?'vu':status==='vu'?'a_revoir':'pas_vu'
                    const note = getChapNote(selectedMatiere, chap)
                    const chapKey = selectedMatiere+'::'+chap
                    const borderColor = status==='pas_vu'?'#2a2740':status==='en_cours'?'rgba(255,209,102,0.25)':status==='vu'?'rgba(6,214,160,0.25)':'rgba(239,71,111,0.25)'
                    return (
                      <div key={i} style={{marginBottom:'8px'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px', background:cfg.color, border:`2px solid ${borderColor}`, borderRadius: note||editingNote===chapKey ? '12px 12px 0 0' : '12px', cursor:'pointer', transition:'all 0.2s'}}
                          onClick={()=>setChapStatus(selectedMatiere,chap,nextStatus)}>
                          <div style={{fontSize:'1.1rem', flexShrink:0}}>{cfg.icon}</div>
                          <div style={{flex:1, fontSize:'0.84rem', fontWeight:700, color: status==='pas_vu'?'#8e8cb0':'#f0eeff'}}>
                            <span style={{fontSize:'0.7rem', fontWeight:800, color:'#8e8cb0', marginRight:'6px'}}>Ch.{i+1}</span>
                            {chap}
                          </div>
                          <div style={{fontSize:'0.66rem', fontWeight:800, color:cfg.textColor, background:'rgba(255,255,255,0.05)', padding:'3px 8px', borderRadius:'100px', flexShrink:0}}>{cfg.label}</div>
                          <div onClick={e=>{e.stopPropagation();setEditingNote(editingNote===chapKey?'':chapKey);setNoteInput(note)}} style={{fontSize:'0.9rem', opacity: note?1:0.4, flexShrink:0}} title="Ajouter une note">💬</div>
                        </div>
                        {note && editingNote!==chapKey && (
                          <div style={{padding:'9px 14px', background:'rgba(124,92,252,0.06)', border:`2px solid ${borderColor}`, borderTop:'none', borderRadius:'0 0 12px 12px', fontSize:'0.78rem', color:'#a48bff', fontWeight:600, fontStyle:'italic', cursor:'pointer'}}
                            onClick={()=>{setEditingNote(chapKey);setNoteInput(note)}}>
                            💬 {note}
                          </div>
                        )}
                        {editingNote===chapKey && (
                          <div style={{padding:'10px 14px', background:'#1c1a2e', border:`2px solid ${borderColor}`, borderTop:'none', borderRadius:'0 0 12px 12px'}}
                            onClick={e=>e.stopPropagation()}>
                            <input
                              autoFocus
                              value={noteInput}
                              onChange={e=>setNoteInput(e.target.value)}
                              onKeyDown={e=>{if(e.key==='Enter')saveChapNote(selectedMatiere,chap,noteInput)}}
                              placeholder="Ex: Je comprends pas la règle de la chaîne..."
                              style={{width:'100%', background:'transparent', border:'none', outline:'none', color:'#f0eeff', fontFamily:'Nunito,sans-serif', fontSize:'0.8rem', fontWeight:600, marginBottom:'8px'}}
                            />
                            <div style={{display:'flex', gap:'7px'}}>
                              <button onClick={()=>saveChapNote(selectedMatiere,chap,noteInput)} style={{flex:1, padding:'7px', borderRadius:'8px', border:'none', background:'#7c5cfc', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.75rem', cursor:'pointer'}}>Enregistrer</button>
                              {note && <button onClick={()=>saveChapNote(selectedMatiere,chap,'')} style={{padding:'7px 10px', borderRadius:'8px', border:'2px solid #2a2740', background:'transparent', color:'#ef476f', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.75rem', cursor:'pointer'}}>Supprimer</button>}
                              <button onClick={()=>setEditingNote('')} style={{padding:'7px 10px', borderRadius:'8px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.75rem', cursor:'pointer'}}>Annuler</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* CTA Plan IA */}
                  {(() => {
                    const aRevoir = chapitres.filter(c=>getChapStatus(selectedMatiere,c)==='a_revoir').length
                    const enCours = chapitres.filter(c=>getChapStatus(selectedMatiere,c)==='en_cours').length
                    const total = aRevoir + enCours
                    if(total === 0) return null
                    return (
                      <div style={{marginTop:'14px', background:'linear-gradient(135deg,rgba(124,92,252,0.12),rgba(255,107,157,0.07))', border:'2px solid rgba(124,92,252,0.3)', borderRadius:'14px', padding:'16px'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px', flexWrap:'wrap'}}>
                          {aRevoir>0 && <span style={{background:'rgba(239,71,111,0.12)', border:'1px solid rgba(239,71,111,0.25)', color:'#ef476f', fontSize:'0.72rem', fontWeight:800, padding:'3px 9px', borderRadius:'100px'}}>🔁 {aRevoir} à revoir</span>}
                          {enCours>0 && <span style={{background:'rgba(255,209,102,0.12)', border:'1px solid rgba(255,209,102,0.25)', color:'#ffd166', fontSize:'0.72rem', fontWeight:800, padding:'3px 9px', borderRadius:'100px'}}>🔄 {enCours} en cours</span>}
                        </div>
                        <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.96rem', fontWeight:700, marginBottom:'5px'}}>🧠 Générer mon plan de révision</div>
                        <div style={{fontSize:'0.78rem', color:'#8e8cb0', fontWeight:600, marginBottom:'12px'}}>DuneIA crée un planning 3 semaines ultra-ciblé sur tes lacunes.</div>
                        <button onClick={()=>generatePlan(selectedMatiere)} style={{width:'100%', padding:'12px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.92rem', cursor:'pointer', boxShadow:'0 4px 16px rgba(124,92,252,0.3)'}}>
                          ✨ Générer le plan IA
                        </button>
                      </div>
                    )
                  })()}

                  {prog && prog.vus === prog.total && (
                    <div style={{textAlign:'center', padding:'16px', background:'rgba(6,214,160,0.08)', border:'2px solid rgba(6,214,160,0.25)', borderRadius:'13px', marginTop:'8px'}}>
                      <div style={{fontSize:'1.5rem', marginBottom:'5px'}}>🎉</div>
                      <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'0.95rem', fontWeight:700, color:'#06d6a0'}}>Programme terminé !</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 7 && (
            <div>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.05rem', fontWeight:700, marginBottom:'14px'}}>🏆 Classement amis</div>
              <p style={{fontSize:'0.85rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7}}>Invite tes amis et comparez vos XP. La compétition saine qui motive à réviser !</p>
            </div>
          )}
        </div>
      </div>

      {/* Plan Modal */}
      {showPlan && (
        <div style={{position:'fixed', inset:0, zIndex:2000, background:'rgba(5,4,15,0.95)', backdropFilter:'blur(18px)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'20px', overflowY:'auto'}} onClick={()=>setShowPlan(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:'#131120', border:'2px solid rgba(124,92,252,0.4)', borderRadius:'22px', maxWidth:'560px', width:'100%', padding:'28px', marginTop:'20px'}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'18px'}}>
              <div>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.15rem', fontWeight:700}}>🧠 Plan de révision IA</div>
                <div style={{fontSize:'0.75rem', color:'#8e8cb0', fontWeight:700, marginTop:'2px'}}>{planMatiere} · {classe}</div>
              </div>
              <button onClick={()=>setShowPlan(false)} style={{width:'32px', height:'32px', borderRadius:'9px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', cursor:'pointer', fontSize:'1rem'}}>✕</button>
            </div>

            {planLoading ? (
              <div style={{textAlign:'center', padding:'40px'}}>
                <div style={{width:'40px', height:'40px', border:'3px solid rgba(124,92,252,0.3)', borderTopColor:'#7c5cfc', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px'}}/>
                <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:'#a48bff'}}>L'IA analyse tes lacunes...</div>
                <div style={{fontSize:'0.78rem', color:'#8e8cb0', fontWeight:600, marginTop:'6px'}}>Génération du plan personnalisé</div>
              </div>
            ) : (
              <div>
                <div style={{background:'#1c1a2e', border:'2px solid #2a2740', borderRadius:'14px', padding:'16px', whiteSpace:'pre-wrap', fontSize:'0.83rem', fontWeight:600, lineHeight:1.8, color:'#f0eeff', maxHeight:'60vh', overflowY:'auto'}}>
                  {planContent}
                </div>
                <div style={{display:'flex', gap:'8px', marginTop:'14px'}}>
                  <button onClick={()=>generatePlan(planMatiere)} style={{flex:1, padding:'11px', borderRadius:'11px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem', cursor:'pointer'}}>🔄 Regénérer</button>
                  <button onClick={()=>setShowPlan(false)} style={{flex:1, padding:'11px', borderRadius:'11px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.82rem', cursor:'pointer'}}>✅ Fermer</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showUpgrade && (
        <div style={{position:'fixed', inset:0, zIndex:2000, background:'rgba(5,4,15,0.92)', backdropFilter:'blur(18px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px'}} onClick={()=>setShowUpgrade(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:'#131120', border:'2px solid rgba(124,92,252,0.4)', borderRadius:'22px', maxWidth:'380px', width:'100%', padding:'32px 24px', textAlign:'center'}}>
            <div style={{fontSize:'3rem', marginBottom:'14px'}}>⭐</div>
            <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.3rem', fontWeight:700, marginBottom:'9px'}}>{upgradeFeature} — Premium</div>
            <p style={{fontSize:'0.84rem', color:'#8e8cb0', fontWeight:600, lineHeight:1.7, marginBottom:'22px'}}>Cette fonctionnalité est disponible en Premium.</p>
            <div style={{background:'linear-gradient(135deg,rgba(124,92,252,0.12),rgba(255,107,157,0.07))', border:'2px solid rgba(124,92,252,0.28)', borderRadius:'14px', padding:'14px', marginBottom:'20px'}}>
              <div style={{fontFamily:'Fredoka,sans-serif', fontSize:'1.8rem', fontWeight:700, color:'#a48bff'}}>9,99€<span style={{fontSize:'0.9rem', color:'#8e8cb0', fontWeight:700}}>/mois</span></div>
              <div style={{fontSize:'0.76rem', color:'#8e8cb0', fontWeight:700, marginTop:'3px'}}>Sans engagement · Satisfait ou remboursé 14j</div>
            </div>
            <button onClick={()=>router.push('/paiement')} style={{width:'100%', padding:'14px', borderRadius:'13px', border:'none', background:'linear-gradient(135deg,#7c5cfc,#ff6b9d)', color:'white', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'0.96rem', cursor:'pointer', marginBottom:'10px'}}>⭐ Passer en Premium</button>
            <button onClick={()=>setShowUpgrade(false)} style={{width:'100%', padding:'10px', borderRadius:'11px', border:'2px solid #2a2740', background:'transparent', color:'#8e8cb0', fontFamily:'Nunito,sans-serif', fontWeight:700, fontSize:'0.86rem', cursor:'pointer'}}>Continuer en gratuit</button>
          </div>
        </div>
      )}
    </div>
  )
}
// fix
