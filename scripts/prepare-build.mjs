import fs from 'node:fs';

const path = 'src/main.jsx';
let source = fs.readFileSync(path, 'utf8');

if (!source.includes("./services/energy.js")) {
  source = source.replace(
    "import { getDailyGuide } from './data/dailyGuide.js';",
    "import { getDailyGuide } from './data/dailyGuide.js';\nimport { calculateEnergyPlan } from './services/energy.js';"
  );
}

source = source.replace(
  "const defaultProfile = { name: '', age: '', weight: '', height: '', goal: 'bienestar', activity: 'moderada', conditions: '' };",
  "const defaultProfile = { name: '', age: '', sex: '', weight: '', height: '', goal: 'bienestar', activity: 'moderada', conditions: '' };"
);

source = source.replace(
  "const guide=getDailyGuide(currentDay,profile.goal);",
  "const guide=getDailyGuide(currentDay,profile.goal); const energyPlan=useMemo(()=>calculateEnergyPlan(profile),[profile]);"
);

source = source.replace(
  "<section className=\"hero\"><div>",
  "<section className=\"hero\"><div>"
);

const marker = "<section className=\"day-guide\">";
const card = `<section className="energy-card"><div><span className="eyebrow">OBJETIVO DEL DÍA</span><h2>{energyPlan.target ? energyPlan.target + ' kcal' : 'Completá tu perfil'}</h2><p>{energyPlan.message}</p></div><div className="energy-stats"><div><b>{Math.round(today.calories)}</b><small>consumidas</small></div><div><b>{energyPlan.target ? Math.max(0,Math.round(energyPlan.target-today.calories)) : '—'}</b><small>restantes</small></div></div>{energyPlan.target&&<div className="energy-progress"><span style={{width:\`${Math.min(100,(today.calories/energyPlan.target)*100)}%\`}}/></div>}<div className="macro-targets"><span>Proteínas {energyPlan.proteinTarget ? energyPlan.proteinTarget+' g' : '—'}</span><span>Carbohidratos {energyPlan.carbTarget ? energyPlan.carbTarget+' g' : '—'}</span><span>Grasas {energyPlan.fatTarget ? energyPlan.fatTarget+' g' : '—'}</span></div></section>`;
if (!source.includes('className="energy-card"')) {
  source = source.replace(marker, card + marker);
}

source = source.replace(
  "{[['name','Nombre','text'],['age','Edad','number'],['weight','Peso (kg)','number'],['height','Altura (cm)','number']].map",
  "{[['name','Nombre','text'],['age','Edad','number'],['weight','Peso (kg)','number'],['height','Altura (cm)','number']].map"
);

const sexField = `<label>Sexo para estimación energética<select name="sex" defaultValue={profile.sex||''} required><option value="">Seleccionar</option><option value="female">Mujer</option><option value="male">Hombre</option></select></label>`;
if (!source.includes('name="sex"')) {
  source = source.replace("</label><label>Objetivo<select name=\"goal\"", `</label>${sexField}<label>Objetivo<select name="goal"`);
}

fs.writeFileSync(path, source);
