import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { createVisionProvider } from './services/vision.js';
import { nutritionService, validateNutrition } from './services/nutrition.js';
import { safetyService } from './services/safety.js';

const STORAGE = 'nutrifoto-state-v1';
const defaultProfile = { name: '', age: '', weight: '', height: '', goal: 'bienestar', activity: 'moderada', conditions: '' };
const defaultState = { profile: defaultProfile, meals: [], activities: [] };
const visionProvider = createVisionProvider();

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE)) || defaultState; } catch { return defaultState; }
}

function App() {
  const [state, setState] = useState(loadState);
  const [view, setView] = useState('inicio');
  const [photo, setPhoto] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => localStorage.setItem(STORAGE, JSON.stringify(state)), [state]);
  useEffect(() => { if (notice) { const t = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(t); } }, [notice]);

  const calories = useMemo(() => state.meals.reduce((sum, m) => sum + Number(m.calories || 0), 0), [state.meals]);
  const activityMinutes = useMemo(() => state.activities.reduce((sum, a) => sum + Number(a.minutes || 0), 0), [state.activities]);

  function updateProfile(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const profile = Object.fromEntries(form.entries());
    const safety = safetyService.validateProfile(profile);
    if (!safety.ok) return setNotice(safety.message);
    setState(s => ({ ...s, profile }));
    setNotice('Perfil guardado.');
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setNotice('Seleccioná una imagen.');
    if (file.size > 8 * 1024 * 1024) return setNotice('La imagen debe pesar menos de 8 MB.');
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
    setAnalysis(null);
  }

  async function analyzePhoto() {
    if (!photo) return setNotice('Primero cargá una foto.');
    setBusy(true);
    try {
      const result = await visionProvider.analyzeImage(photo);
      const item = nutritionService.estimateFromVision({
        food: result.items?.[0]?.name,
        portion: result.portionGrams,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        confidence: result.items?.[0]?.confidence ?? 'estimación'
      });
      const validation = validateNutrition(item);
      if (!validation.ok) throw new Error('No se pudo validar la estimación.');
      setAnalysis(item);
    } catch (error) {
      setNotice(error.message || 'No se pudo analizar la imagen.');
    } finally { setBusy(false); }
  }

  function updateAnalysis(field, value) {
    setAnalysis(a => ({ ...a, [field]: field === 'food' || field === 'confidence' ? value : Number(value) }));
  }

  function saveMeal() {
    const validation = validateNutrition(analysis);
    if (!validation.ok) return setNotice('Revisá los datos antes de guardar.');
    setState(s => ({ ...s, meals: [{ id: crypto.randomUUID(), date: new Date().toISOString(), name: analysis.food, calories: analysis.calories, protein: analysis.protein, carbs: analysis.carbs, fat: analysis.fat }, ...s.meals] }));
    setNotice('Comida registrada.');
    setAnalysis(null); setPhoto(null); setView('registro');
  }

  function addActivity(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const item = Object.fromEntries(form.entries());
    setState(s => ({ ...s, activities: [{ id: crypto.randomUUID(), date: new Date().toISOString(), ...item }, ...s.activities] }));
    e.currentTarget.reset();
    setNotice('Actividad registrada.');
  }

  return <div className="app">
    <header className="topbar">
      <button className="brand" onClick={() => setView('inicio')}><span className="brand-mark">N</span><span>Nutrifoto</span></button>
      <nav>{[['inicio','Inicio'],['foto','Analizar foto'],['registro','Registro'],['perfil','Mi perfil']].map(([id,label]) => <button className={view===id?'active':''} key={id} onClick={() => setView(id)}>{label}</button>)}</nav>
    </header>

    {notice && <div className="notice">{notice}</div>}

    <main>
      {view === 'inicio' && <>
        <section className="hero">
          <div><span className="eyebrow">NUTRICIÓN PERSONALIZADA</span><h1>Tu alimentación,<br/><em>vista de otra manera.</em></h1><p>Fotografiá tu comida, obtené una estimación nutricional y construí tu registro diario en un solo lugar.</p><button className="primary" onClick={() => setView('foto')}>Analizar una comida →</button></div>
          <div className="hero-card"><div className="ring">N</div><strong>Tu día</strong><div className="metric"><span>Calorías registradas</span><b>{calories}</b><small>kcal estimadas</small></div><div className="progress"><span style={{width:`${Math.min(calories/20,100)}%`}}/></div><div className="mini-grid"><div><b>{state.meals.length}</b><small>comidas</small></div><div><b>{activityMinutes}</b><small>min actividad</small></div></div></div>
        </section>
        <section className="features"><article><span>01</span><h3>Fotografía</h3><p>Cargá una imagen de tu comida desde el teléfono o computadora.</p></article><article><span>02</span><h3>Estimación</h3><p>La app prepara una lectura nutricional que podés corregir antes de guardarla.</p></article><article><span>03</span><h3>Evolución</h3><p>Conservá tus registros y observá tus hábitos a lo largo del tiempo.</p></article></section>
      </>}

      {view === 'foto' && <section className="page"><div className="section-head"><div><span className="eyebrow">ANÁLISIS</span><h2>¿Qué comiste?</h2><p>Cargá una fotografía. La identificación nutricional es estimativa.</p></div></div><div className="photo-layout"><label className="dropzone">{photo ? <img src={photo} alt="Comida cargada"/> : <><span className="camera">＋</span><strong>Elegir una foto</strong><small>JPG, PNG o imagen desde cámara</small></>}<input type="file" accept="image/*" capture="environment" onChange={handlePhoto}/></label><div className="analysis-panel">{analysis ? <><span className="eyebrow">RESULTADO EDITABLE</span><label>Alimento<input value={analysis.food} onChange={e => updateAnalysis('food', e.target.value)}/></label><label>Porción estimada (g)<input type="number" min="0" value={analysis.portion} onChange={e => updateAnalysis('portion', e.target.value)}/></label><div className="nutri"><label><b>kcal</b><input type="number" min="0" value={analysis.calories} onChange={e => updateAnalysis('calories', e.target.value)}/></label><label><b>proteína</b><input type="number" min="0" value={analysis.protein} onChange={e => updateAnalysis('protein', e.target.value)}/></label><label><b>carbohidratos</b><input type="number" min="0" value={analysis.carbs} onChange={e => updateAnalysis('carbs', e.target.value)}/></label><label><b>grasas</b><input type="number" min="0" value={analysis.fat} onChange={e => updateAnalysis('fat', e.target.value)}/></label></div><button className="primary full" onClick={saveMeal}>Guardar en mi registro</button><p className="warning">Los valores son estimaciones. Revisalos antes de guardarlos y no los uses como diagnóstico o indicación médica.</p></> : <><div className="empty"><span>✦</span><strong>{busy ? 'Analizando…' : 'Listo para analizar'}</strong><p>{busy ? 'Procesando la imagen.' : 'Subí una imagen y comenzá el análisis.'}</p></div><button className="primary full" disabled={busy} onClick={analyzePhoto}>{busy ? 'Analizando…' : 'Analizar fotografía'}</button></>}</div></div></section>}

      {view === 'registro' && <section className="page"><div className="section-head"><div><span className="eyebrow">MI DÍA</span><h2>Registro</h2><p>{state.meals.length ? `${state.meals.length} comidas guardadas · ${activityMinutes} minutos de actividad` : 'Todavía no tenés comidas registradas.'}</p></div><button className="primary" onClick={() => setView('foto')}>+ Agregar comida</button></div><div className="log-list">{state.meals.map(m => <article className="log" key={m.id}><div className="food-icon">◌</div><div><strong>{m.name}</strong><small>{new Date(m.date).toLocaleString('es-AR', {dateStyle:'short', timeStyle:'short'})}</small></div><b>{m.calories} kcal</b></article>)}{!state.meals.length && <div className="empty large"><span>○</span><strong>Tu registro empieza acá</strong><p>Analizá tu primera comida para verla en este espacio.</p></div>}</div><div className="activity-card"><div><span className="eyebrow">ACTIVIDAD</span><h3>Registrar movimiento</h3></div><form onSubmit={addActivity}><input name="activity" placeholder="Ej. caminar" required/><input name="minutes" type="number" min="1" placeholder="Minutos" required/><button className="secondary">Guardar</button></form></div></section>}

      {view === 'perfil' && <section className="page narrow"><span className="eyebrow">PERSONALIZACIÓN</span><h2>Mi perfil</h2><p className="lead">Estos datos permiten adaptar la experiencia. Completalos con información propia y actualizada.</p><form className="profile" onSubmit={updateProfile}>{[['name','Nombre','text'],['age','Edad','number'],['weight','Peso (kg)','number'],['height','Altura (cm)','number']].map(([name,label,type]) => <label key={name}>{label}<input name={name} type={type} defaultValue={state.profile[name]} min={type==='number'?0:undefined}/></label>)}<label>Objetivo<select name="goal" defaultValue={state.profile.goal}><option value="bienestar">Bienestar</option><option value="mantener">Mantener hábitos</option><option value="organizar">Organizar alimentación</option></select></label><label>Actividad<select name="activity" defaultValue={state.profile.activity}><option>ligera</option><option>moderada</option><option>alta</option></select></label><label className="wide">Condiciones o información relevante<textarea name="conditions" defaultValue={state.profile.conditions} placeholder="Opcional. No ingreses información que no quieras almacenar."/></label><button className="primary wide">Guardar perfil</button></form><p className="warning">Nutrifoto no diagnostica, no prescribe medicamentos y no reemplaza la evaluación de profesionales de la salud.</p></section>}
    </main>
    <footer>Nutrifoto · MVP · Las estimaciones nutricionales son orientativas.</footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App />);