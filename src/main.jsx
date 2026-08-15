import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { createVisionProvider } from './services/vision.js';
import { validateProfile } from './services/safety.js';
import { createMealFromAnalysis, updateMealItem } from './services/meal.js';
import { storage } from './services/storage.js';
import { summarizeDay } from './services/analytics.js';

const defaultProfile = { name: '', age: '', weight: '', height: '', goal: 'bienestar', activity: 'moderada', conditions: '' };
const visionProvider = createVisionProvider();

function App() {
  const [profile, setProfile] = useState(() => storage.getProfile() || defaultProfile);
  const [meals, setMeals] = useState(() => storage.getMeals());
  const [activities, setActivities] = useState(() => storage.getActivity());
  const [view, setView] = useState('inicio');
  const [photo, setPhoto] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const today = useMemo(() => summarizeDay(meals, activities), [meals, activities]);
  useEffect(() => { if (notice) { const t = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(t); } }, [notice]);

  function updateProfile(e) {
    e.preventDefault();
    const next = Object.fromEntries(new FormData(e.currentTarget).entries());
    const safety = validateProfile(next);
    if (!safety.isAdult) return setNotice(safety.warnings[0] || 'Nutrifoto está diseñada para personas adultas.');
    setProfile(next); storage.saveProfile(next); setNotice('Perfil guardado.');
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setNotice('Seleccioná una imagen.');
    if (file.size > 8 * 1024 * 1024) return setNotice('La imagen debe pesar menos de 8 MB.');
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file); setAnalysis(null);
  }

  async function analyzePhoto() {
    if (!photo) return setNotice('Primero cargá una foto.');
    setBusy(true);
    try { setAnalysis(await visionProvider.analyzeImage(photo)); }
    catch (error) { setNotice(error.message || 'No se pudo analizar la imagen.'); }
    finally { setBusy(false); }
  }

  function editItem(index, field, value) {
    const numeric = ['portionGrams', 'calories', 'protein', 'carbs', 'fat'].includes(field);
    setAnalysis(a => updateMealItem({ ...a, items: a.items }, index, { [field]: numeric ? Number(value) : value }));
  }

  function saveMeal() {
    try {
      const meal = createMealFromAnalysis(analysis);
      storage.saveMeal(meal); setMeals(storage.getMeals());
      setNotice('Comida registrada.'); setAnalysis(null); setPhoto(null); setView('registro');
    } catch { setNotice('Revisá el resultado antes de guardar.'); }
  }

  function addActivity(e) {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.currentTarget).entries());
    const entry = { id: crypto.randomUUID(), date: new Date().toISOString(), activity: form.activity, durationMinutes: Number(form.minutes) };
    storage.saveActivity(entry); setActivities(storage.getActivity()); e.currentTarget.reset(); setNotice('Actividad registrada.');
  }

  return <div className="app">
    <header className="topbar"><button className="brand" onClick={() => setView('inicio')}><span className="brand-mark">N</span><span>Nutrifoto</span></button><nav>{[['inicio','Inicio'],['foto','Analizar foto'],['registro','Registro'],['perfil','Mi perfil']].map(([id,label]) => <button className={view===id?'active':''} key={id} onClick={() => setView(id)}>{label}</button>)}</nav></header>
    {notice && <div className="notice">{notice}</div>}
    <main>
      {view === 'inicio' && <><section className="hero"><div><span className="eyebrow">NUTRICIÓN PERSONALIZADA</span><h1>Tu alimentación,<br/><em>vista de otra manera.</em></h1><p>Fotografiá tu comida, obtené una estimación nutricional y construí tu registro diario en un solo lugar.</p><button className="primary" onClick={() => setView('foto')}>Analizar una comida →</button></div><div className="hero-card"><div className="ring">N</div><strong>Tu día</strong><div className="metric"><span>Calorías registradas</span><b>{Math.round(today.calories)}</b><small>kcal estimadas</small></div><div className="progress"><span style={{width:`${Math.min(today.calories/20,100)}%`}}/></div><div className="mini-grid"><div><b>{today.mealCount}</b><small>comidas</small></div><div><b>{today.activityMinutes}</b><small>min actividad</small></div></div></div></section><section className="features"><article><span>01</span><h3>Fotografía</h3><p>Cargá una imagen de tu comida desde el teléfono o computadora.</p></article><article><span>02</span><h3>Estimación</h3><p>La app propone alimentos y valores que podés corregir antes de guardarlos.</p></article><article><span>03</span><h3>Evolución</h3><p>Conservá tus registros y observá tus hábitos a lo largo del tiempo.</p></article></section></>}

      {view === 'foto' && <section className="page"><div className="section-head"><div><span className="eyebrow">ANÁLISIS</span><h2>¿Qué comiste?</h2><p>Cargá una fotografía. La identificación nutricional es estimativa.</p></div></div><div className="photo-layout"><label className="dropzone">{photo ? <img src={photo} alt="Comida cargada"/> : <><span className="camera">＋</span><strong>Elegir una foto</strong><small>JPG, PNG o imagen desde cámara</small></>}<input type="file" accept="image/*" capture="environment" onChange={handlePhoto}/></label><div className="analysis-panel">{analysis ? <><span className="eyebrow">RESULTADO EDITABLE</span>{analysis.items.map((item,index)=><div className="food-item" key={`${item.name}-${index}`}><label>Alimento<input value={item.name} onChange={e=>editItem(index,'name',e.target.value)}/></label><label>Porción (g)<input type="number" min="0" value={item.portionGrams} onChange={e=>editItem(index,'portionGrams',e.target.value)}/></label><div className="nutri"><label><b>kcal</b><input type="number" min="0" value={item.calories} onChange={e=>editItem(index,'calories',e.target.value)}/></label><label><b>proteína</b><input type="number" min="0" value={item.protein} onChange={e=>editItem(index,'protein',e.target.value)}/></label><label><b>carbohidratos</b><input type="number" min="0" value={item.carbs} onChange={e=>editItem(index,'carbs',e.target.value)}/></label><label><b>grasas</b><input type="number" min="0" value={item.fat} onChange={e=>editItem(index,'fat',e.target.value)}/></label></div></div>)}<button className="primary full" onClick={saveMeal}>Guardar en mi registro</button><p className="warning">Los valores son estimaciones. Revisalos antes de guardarlos y no los uses como diagnóstico o indicación médica.</p></> : <><div className="empty"><span>✦</span><strong>{busy ? 'Analizando…' : 'Listo para analizar'}</strong><p>{busy ? 'Procesando la imagen.' : 'Subí una imagen y comenzá el análisis.'}</p></div><button className="primary full" disabled={busy} onClick={analyzePhoto}>{busy ? 'Analizando…' : 'Analizar fotografía'}</button></>}</div></div></section>}

      {view === 'registro' && <section className="page"><div className="section-head"><div><span className="eyebrow">MI DÍA</span><h2>Registro</h2><p>{meals.length ? `${meals.length} comidas guardadas · ${today.activityMinutes} minutos de actividad` : 'Todavía no tenés comidas registradas.'}</p></div><button className="primary" onClick={() => setView('foto')}>+ Agregar comida</button></div><div className="summary-grid"><div><b>{Math.round(today.calories)}</b><small>kcal estimadas</small></div><div><b>{Math.round(today.protein)} g</b><small>proteína</small></div><div><b>{Math.round(today.carbs)} g</b><small>carbohidratos</small></div><div><b>{Math.round(today.fat)} g</b><small>grasas</small></div></div><div className="log-list">{meals.filter(m=>String(m.date).slice(0,10)===today.date).map(m=><article className="log" key={m.id}><div className="food-icon">◌</div><div><strong>{m.items?.map(i=>i.name).join(', ') || 'Comida'}</strong><small>{new Date(m.date).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}</small></div><b>{Math.round(m.calories)} kcal</b></article>)}{!meals.filter(m=>String(m.date).slice(0,10)===today.date).length && <div className="empty large"><span>○</span><strong>Tu registro empieza acá</strong><p>Analizá tu primera comida para verla en este espacio.</p></div>}</div><div className="activity-card"><div><span className="eyebrow">ACTIVIDAD</span><h3>Registrar movimiento</h3></div><form onSubmit={addActivity}><input name="activity" placeholder="Ej. caminar" required/><input name="minutes" type="number" min="1" placeholder="Minutos" required/><button className="secondary">Guardar</button></form></div></section>}

      {view === 'perfil' && <section className="page narrow"><span className="eyebrow">PERSONALIZACIÓN</span><h2>Mi perfil</h2><p className="lead">Estos datos permiten adaptar la experiencia. Completalos con información propia y actualizada.</p><form className="profile" onSubmit={updateProfile}>{[['name','Nombre','text'],['age','Edad','number'],['weight','Peso (kg)','number'],['height','Altura (cm)','number']].map(([name,label,type])=><label key={name}>{label}<input name={name} type={type} defaultValue={profile[name]} min={type==='number'?0:undefined}/></label>)}<label>Objetivo<select name="goal" defaultValue={profile.goal}><option value="bienestar">Bienestar</option><option value="mantener">Mantener hábitos</option><option value="organizar">Organizar alimentación</option></select></label><label>Actividad<select name="activity" defaultValue={profile.activity}><option>ligera</option><option>moderada</option><option>alta</option></select></label><label className="wide">Condiciones o información relevante<textarea name="conditions" defaultValue={profile.conditions} placeholder="Opcional. No ingreses información que no quieras almacenar."/></label><button className="primary wide">Guardar perfil</button></form><p className="warning">Nutrifoto no diagnostica, no prescribe medicamentos y no reemplaza la evaluación de profesionales de la salud.</p></section>}
    </main><footer>Nutrifoto · MVP · Las estimaciones nutricionales son orientativas.</footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);