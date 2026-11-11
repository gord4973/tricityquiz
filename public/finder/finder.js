const STAGE1 = [
  { id:'family', text:'How many people do you usually need to seat?',
    answers:[
      { label:'Just me, or two of us', tags:{ rvr:3, 'eclipse-cross':3, 'eclipse-sportback':2, outlander:1, 'outlander-phev':1 }, needThird:false },
      { label:'Three to five — no third row needed', tags:{ rvr:2, 'eclipse-cross':2, outlander:2, 'outlander-phev':2, 'eclipse-sportback':2 }, needThird:false },
      { label:'We need a third row (six or seven seats)', tags:{ outlander:6, 'outlander-phev':6, rvr:-8, 'eclipse-cross':-8, 'eclipse-sportback':-8 }, needThird:true }
    ]},
  { id:'budget', text:'What weekly payment range feels comfortable? (estimates, before taxes and fees)',
    answers:[
      { label:'Under $100 / week', weeklyMax:100, tags:{ rvr:5, 'eclipse-cross':3, outlander:1, 'outlander-phev':-2, 'eclipse-sportback':-3 } },
      { label:'About $100–$150 / week', weeklyMax:150, tags:{ rvr:2, 'eclipse-cross':3, outlander:3, 'outlander-phev':1, 'eclipse-sportback':1 } },
      { label:'About $150–$200 / week', weeklyMax:200, tags:{ outlander:3, 'outlander-phev':3, 'eclipse-sportback':3, 'eclipse-cross':2, rvr:1 } },
      { label:'$200 / week or more is fine', weeklyMax:999, tags:{ 'outlander-phev':2, 'eclipse-sportback':2, outlander:2, 'eclipse-cross':1, rvr:0 } }
    ]},
  { id:'power', text:'What kind of powertrain are you leaning toward?',
    answers:[
      { label:'Regular gasoline (keep it simple)', prefer:'gas', tags:{ rvr:3, 'eclipse-cross':3, outlander:3, 'outlander-phev':-3, 'eclipse-sportback':-5 } },
      { label:'Plug-in hybrid — electric for short trips, gas for longer ones', prefer:'phev', tags:{ 'outlander-phev':6, outlander:1, 'eclipse-sportback':1, rvr:-1, 'eclipse-cross':-1 } },
      { label:'Fully electric', prefer:'ev', tags:{ 'eclipse-sportback':7, 'outlander-phev':2, outlander:-2, rvr:-3, 'eclipse-cross':-3 } },
      { label:'No preference yet — surprise me', prefer:'any', tags:{ outlander:1, 'outlander-phev':1, rvr:1, 'eclipse-cross':1, 'eclipse-sportback':1 } }
    ]},
  { id:'charging', text:'Can you charge a vehicle at home?',
    answers:[
      { label:'Yes — I can install or already have 240V (Level 2)', charge:'l2', tags:{ 'eclipse-sportback':4, 'outlander-phev':4 } },
      { label:'I only have a regular household outlet (120V)', charge:'l1', tags:{ 'outlander-phev':3, 'eclipse-sportback':1 } },
      { label:'No home charging', charge:'none', tags:{ 'eclipse-sportback':-6, 'outlander-phev':-3, rvr:2, 'eclipse-cross':2, outlander:2 } },
      { label:'Not sure yet', charge:'unsure', tags:{ 'outlander-phev':1, outlander:1 } }
    ]},
  { id:'driving', text:'What does most of your driving look like?',
    answers:[
      { label:'Short city trips and errands', tags:{ rvr:3, 'eclipse-cross':2, 'outlander-phev':3, 'eclipse-sportback':2, outlander:1 } },
      { label:'A regular mixed commute, some highway', tags:{ outlander:2, 'outlander-phev':3, 'eclipse-cross':2, rvr:2, 'eclipse-sportback':2 } },
      { label:'Long highway trips, often', tags:{ outlander:3, 'outlander-phev':3, 'eclipse-cross':1, rvr:0, 'eclipse-sportback':1 } },
      { label:'Weekends out of town, or lots of uneven / winter roads', tags:{ outlander:3, 'eclipse-cross':3, rvr:2, 'outlander-phev':2, 'eclipse-sportback':-2 } }
    ]},
  { id:'awd', text:'How important is all-wheel control for winter or outdoor driving?',
    answers:[
      { label:'Must-have — I want AWD / S-AWC', needAwd:true, tags:{ 'eclipse-cross':4, outlander:4, 'outlander-phev':4, rvr:2, 'eclipse-sportback':-6 } },
      { label:'Nice to have for B.C. winters', needAwd:false, tags:{ 'eclipse-cross':3, outlander:3, 'outlander-phev':3, rvr:2, 'eclipse-sportback':-2 } },
      { label:'Mostly city — front-wheel drive is fine', needAwd:false, tags:{ rvr:3, 'eclipse-sportback':2, 'eclipse-cross':1, outlander:1, 'outlander-phev':1 } }
    ]},
  { id:'cargo', text:'How do you use cargo space — or do you tow?',
    answers:[
      { label:'Groceries and daily bags are enough', tags:{ rvr:2, 'eclipse-cross':2, 'eclipse-sportback':2, outlander:1, 'outlander-phev':1 } },
      { label:'Sports gear, luggage, or bulky weekly loads', tags:{ outlander:4, 'outlander-phev':4, 'eclipse-sportback':2, 'eclipse-cross':1, rvr:0 } },
      { label:'I want to tow a small trailer or toys (check the rating)', tags:{ outlander:5, 'outlander-phev':3, 'eclipse-cross':0, rvr:0, 'eclipse-sportback':-2 } }
    ]},
  { id:'priority', text:'What matters most once the basics are covered?',
    answers:[
      { label:'Value and a lower payment', tags:{ rvr:4, 'eclipse-cross':2, outlander:1, 'outlander-phev':0, 'eclipse-sportback':0 } },
      { label:'Comfort and convenience (heat, liftgate, easy access)', tags:{ outlander:2, 'outlander-phev':2, 'eclipse-cross':2, rvr:1, 'eclipse-sportback':2 } },
      { label:'Tech and driver assistance', tags:{ 'eclipse-sportback':3, 'outlander-phev':2, outlander:2, 'eclipse-cross':2, rvr:0 } },
      { label:'A more premium, dressed-up feel', tags:{ outlander:2, 'outlander-phev':2, 'eclipse-sportback':2, 'eclipse-cross':1, rvr:0 } }
    ]}
];

const TRIM_Q = {
  common: [
    { id:'trimBudget', text:'For this model, how do you want to spend?',
      answers:[
        { label:'Keep the payment as low as I reasonably can', prefer:'value' },
        { label:'Add the comfort features I will use every day', prefer:'comfort' },
        { label:'I want a more loaded, premium trim', prefer:'luxury' }
      ]},
    { id:'heat', text:'How important are heated seats and a heated steering wheel?',
      answers:[
        { label:'Heated front seats are enough', want:['heated-front'] },
        { label:'I want a heated steering wheel too', want:['heated-front','heated-wheel'] },
        { label:'Heat the second row as well, if this model offers it', want:['heated-front','heated-wheel','heated-rear'] }
      ]},
    { id:'roof', text:'Do you want a sunroof or panoramic glass roof?',
      answers:[
        { label:'Not a must-have', want:[] },
        { label:'Yes — I’d like a sunroof or glass roof', want:['sunroof'] }
      ]},
    { id:'interior', text:'What kind of interior are you after?',
      answers:[
        { label:'Cloth or standard comfort is fine', want:[] },
        { label:'Synthetic or leather-appointed seats', want:['leather'] },
        { label:'A more premium / dressed-up cabin', want:['leather','luxury','style'] }
      ]},
    { id:'safety', text:'Which driver-assist and tech extras matter most?',
      answers:[
        { label:'The essentials on the base trim are enough', want:[] },
        { label:'I want stronger safety tech (cameras, adaptive cruise, alerts)', want:['safety','tech'] },
        { label:'Give me the works — audio, HUD, or a tech package if there is one', want:['safety','tech','audio'] }
      ]}
  ],
  rvr: [
    { id:'awdTrim', text:'Do you want All-Wheel Control on your RVR?',
      answers:[
        { label:'Yes — I want AWC', require:'awd' },
        { label:'Front-wheel drive is fine if it saves money', require:null }
      ]}
  ],
  'eclipse-cross': [],
  outlander: [],
  'outlander-phev': [],
  'eclipse-sportback': [
    { id:'techPkg', text:'The Technology Package adds a panoramic glass roof, BOSE 10-speaker audio, a hands-free liftgate and black roof rails. Worth it?',
      answers:[
        { label:'Yes — I want the Technology Package', want:['sunroof','audio','luxury','tech'] },
        { label:'The standard EV already has what I need', prefer:'value' }
      ]}
  ]
};

const MONEY = new Intl.NumberFormat('en-CA',{ style:'currency', currency:'CAD', maximumFractionDigits:0 });
const MONEY2 = new Intl.NumberFormat('en-CA',{ style:'currency', currency:'CAD', minimumFractionDigits:2, maximumFractionDigits:2 });

let DATA = null;
let state = { step:'intro', s1:0, s2:0, answers:[], trimAnswers:[], picks:null, chosen:null, trims:null };

function weeklyPayment(principal, aprPercent, termMonths, ppy){
  const n = termMonths * ppy / 12;
  const r = (aprPercent/100) / ppy;
  if (!r) return principal / n;
  return principal * r / (1 - Math.pow(1+r, -n));
}
function availableModels(){
  return (DATA.models || []).filter(m => m.inStock !== false);
}
function docFee(model){
  const f = DATA.finance || {};
  const mf = model.finance || {};
  return (mf.docFee != null ? mf.docFee : (f.docFee || 0));
}
function feesFor(model){
  const mf = model.finance || {};
  return (mf.freightPdi || 0) + (mf.acCharge || 0) + (mf.tireDuty || 0) + (mf.ehf || 0) + docFee(model);
}
function amountFor(model, trim){
  const f = DATA.finance || {};
  const msrp = trim ? trim.msrp : model.startingMsrp;
  return msrp + feesFor(model) - (f.downPayment || 0);
}
function weeklyFor(model, trim){
  const f = DATA.finance || {};
  const mf = model.finance || {};
  return weeklyPayment(amountFor(model, trim), mf.aprPercent, mf.termMonths, f.paymentsPerYear || 52);
}
function familyOf(modelOrId){
  const m = typeof modelOrId === 'string' ? modelById(modelOrId) : modelOrId;
  return (m && m.family) || (m && m.id) || modelOrId;
}
function inventoryUrl(model, trim){
  const L = (DATA.links && DATA.links.inventory) || {};
  const base = L.base || 'https://www.tricitymits.com/vehicles/new/';
  const u = new URL(base, 'https://www.tricitymits.com');
  Object.entries(L.params || {}).forEach(([k,v])=>{ if(v!=null && v!=='') u.searchParams.set(k, v); });
  const md = model.inventoryModel || model.name;
  if (md) u.searchParams.set(L.modelParam || 'md', md);
  if (model.year) u.searchParams.set(L.yearParam || 'yr', String(model.year));
  if (trim){
    const tr = trim.inventoryTrim || (trim.trim && trim.trim.inventoryTrim) || (trim.name) || (trim.trim && trim.trim.name);
    if (tr) u.searchParams.set(L.trimParam || 'tr', tr);
  }
  return u.toString();
}
function buildAndPriceUrl(model, trim){
  const base = model.buildAndPriceUrl || ((DATA.links && DATA.links.buildAndPrice && DATA.links.buildAndPrice.base) || 'https://www.mitsubishi-motors.ca/en/buy/configure-your-mitsubishi');
  const rec = trim && (trim.buildModelCode || (trim.trim && trim.trim.buildModelCode));
  if (!rec) return base;
  const u = new URL(base, 'https://www.mitsubishi-motors.ca');
  u.searchParams.set('model', rec);
  return u.toString();
}
const TRIM_LABELS = ['Best Price Option', 'Premium Option', 'Top-Tier Loaded Option'];
function isPhev(m){
  return !!(m && (m.powertrain==='phev' || m.family==='outlander-phev' || String(m.id||'').startsWith('outlander-phev')));
}
function fuelSavingsCalculatorUrl(){
  return (DATA.links && DATA.links.fuelSavingsCalculator) || '';
}

function $(id){ return document.getElementById(id); }

function render(){
  const app = $('app');
  const nav = $('nav');
  const restart = $('restartBtn');
  const pwrap = $('progressWrap');
  if (state.step==='intro'){ nav.hidden=true; restart.hidden=true; pwrap.hidden=true; return; }
  nav.hidden = false;
  restart.hidden = false;
  pwrap.hidden = false;

  const s1n = STAGE1.length;
  if (state.step==='s1'){
    setProgress((state.s1)/ (s1n + 8) );
    const q = STAGE1[state.s1];
    app.innerHTML = `<section class="screen">
      <p class="eyebrow">Stage 1</p>
      <p class="step">Find the best Mitsubishi for your family · ${state.s1+1} of ${s1n}</p>
      <h2>${esc(q.text)}</h2>
      <div class="choices">${q.answers.map((a,i)=>`<button type="button" class="choice" data-i="${i}">${esc(a.label)}</button>`).join('')}</div>
    </section>`;
    app.querySelectorAll('.choice').forEach(b=>b.onclick=()=>answerS1(+b.dataset.i));
    return;
  }
  if (state.step==='models'){
    setProgress(s1n / (s1n+8));
    const [first, second] = state.picks;
    app.innerHTML = `<section class="screen">
      <p class="eyebrow">Your matches</p>
      <h2>Here are your first and second choices.</h2>
      <p class="lede">Pick the one you want to trim out next.</p>
      <div class="cards">${[first,second].map((p,idx)=>modelCard(p, idx===0?'First choice':'Second choice')).join('')}</div>
    </section>`;
    app.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>chooseModel(b.dataset.pick));
    return;
  }
  if (state.step==='s2'){
    const qs = trimQuestions(state.chosen);
    setProgress((s1n + 1 + state.s2) / (s1n + 1 + qs.length + 2));
    const q = qs[state.s2];
    const m = modelById(state.chosen);
    app.innerHTML = `<section class="screen">
      <div class="selected-model"><strong>${esc(m.yearLabel)} ${esc(m.name)}</strong> selected</div>
      <p class="eyebrow">Stage 2</p>
      <p class="step">Help me determine the best trim level for me · ${state.s2+1} of ${qs.length}</p>
      <h2>${esc(q.text)}</h2>
      <div class="choices">${q.answers.map((a,i)=>`<button type="button" class="choice" data-i="${i}">${esc(a.label)}</button>`).join('')}</div>
    </section>`;
    app.querySelectorAll('.choice').forEach(b=>b.onclick=()=>answerS2(+b.dataset.i));
    return;
  }
  if (state.step==='end'){
    setProgress(1);
    const m = modelById(state.chosen);
    const ranked = state.trims;
    const low = Math.min(...ranked.map(t=>t.weekly));
    const d = DATA.dealer;
    app.innerHTML = `<section class="screen">
      <p class="eyebrow">Your ${esc(m.yearLabel)} ${esc(m.name)} trims</p>
      <h2>Your recommended trim level${ranked.length===1?'':'s'}.</h2>
      <p class="lede">Shown from lowest to highest price, with approximate weekly payments and the difference versus the lowest (Best Price Option).</p>
      <div class="cards">${ranked.map((t,i)=>trimCard(m,t,i,low)).join('')}</div>
      ${isPhev(m) && fuelSavingsCalculatorUrl()?`<div class="cta-row primary">
        <a class="red" href="${esc(fuelSavingsCalculatorUrl())}" target="_blank" rel="noopener">PHEV Fuel Savings Calculator</a>
      </div>`:''}
      <div class="cta-row secondary">
        <a class="outline" href="${esc(d.testDriveUrl)}" target="_blank" rel="noopener">Book a test drive</a>
        <a class="outline" href="${esc(d.phoneHref)}">Call ${esc(d.phone)}</a>
      </div>
      <p><strong>Tricity Mitsubishi</strong><br>${esc(d.address)}<br><a href="${esc(d.website)}" target="_blank" rel="noopener">tricitymits.com</a></p>
      <div class="disclaimer">
        ${paymentDisclaimer(m)}
      </div>
    </section>`;
  }
}
function moneyPlain(n){
  return Number(n).toLocaleString('en-CA', { minimumFractionDigits: Number.isInteger(n)?0:2, maximumFractionDigits: 2 });
}
function paymentDisclaimer(m){
  const f = DATA.finance || {};
  const mf = m.finance || {};
  const parts = [
    `MSRP + freight/PDI ($${moneyPlain(mf.freightPdi||0)})`,
    `A/C charge ($${moneyPlain(mf.acCharge||0)})`,
    `tire duty ($${moneyPlain(mf.tireDuty||0)})`,
    `EHF ($${moneyPlain(mf.ehf||0)})`,
    `documentation fee ($${moneyPlain(docFee(m))})`
  ];
  const loyalty = mf.loyaltyNote ? ' '+mf.loyaltyNote : '';
  const window = f.offerWindowLabel || 'November 3–30, 2026';
  return `<p><strong>Payment estimates only (approx.).</strong> Figures use ${parts.join(' + ')} at ${mf.aprPercent}% APR, ${mf.termMonths} months, $${f.downPayment||0} down, ${f.paymentsPerYear||52} weekly payments per year, before taxes.${loyalty} On approved credit (OAC). BC finance offers used here are valid ${window} and are subject to change. Taxes, licensing, insurance, registration and other charges are extra unless noted. Employee price adjustments are not included. This is not an offer to finance or a guarantee of price, rate, payment or inventory. Dealer may sell for less. Programs and stock change — confirm current details with Tricity Mitsubishi. Warranty terms and conditions apply.</p>`;
}
function modelCard(p, label){
  const m = p.model;
  const w = weeklyFor(m);
  const phev = isPhev(m);
  return `<article class="card">
    <span class="rank">${esc(label)}</span>
    <img src="${esc(m.image)}" alt="${esc(m.yearLabel)} Mitsubishi ${esc(m.name)}">
    <h3>${esc(m.yearLabel)} ${esc(m.name)}</h3>
    <p class="price">From ${MONEY.format(m.startingMsrp)} MSRP · approx. ${MONEY2.format(w)} / week${phev?'*':''}</p>
    ${phev?`<p class="phev-note">* Fuel savings from a PHEV vs traditional gas vehicles may significantly reduce your overall monthly cost.</p>`:''}
    <p class="why">${esc(p.why)}</p>
    <ul class="features">${m.highlights.map(h=>`<li>${esc(h)}</li>`).join('')}</ul>
    ${m.note?`<p class="fine">${esc(m.note)}</p>`:''}
    <button type="button" class="pick" data-pick="${esc(m.id)}">Choose the ${esc(m.name)}</button>
  </article>`;
}
function trimCard(m,t,i,low){
  const extra = t.weekly - low;
  const label = TRIM_LABELS[i] || TRIM_LABELS[TRIM_LABELS.length-1];
  const extraTxt = extra<=0.5 ? 'Lowest weekly payment of these options' : `+${MONEY2.format(extra)} / week vs the lowest (Best Price Option)`;
  return `<article class="card">
    <span class="rank">${esc(label)}</span>
    <h3>${esc(t.trim.name)}</h3>
    <p class="price">${MONEY.format(t.trim.msrp)} MSRP · approx. ${MONEY2.format(t.weekly)} / week</p>
    <p class="delta">${extraTxt}</p>
    <ul class="features">${t.trim.features.map(h=>`<li>${esc(h)}</li>`).join('')}</ul>
    <div class="cta-row card-ctas">
      <a class="red" href="${esc(inventoryUrl(m, t.trim))}" target="_blank" rel="noopener">Check Out Our Inventory</a>
      <a class="dark" href="${esc(buildAndPriceUrl(m, t.trim))}" target="_blank" rel="noopener">Build Your Own</a>
    </div>
  </article>`;
}
function setProgress(p){ $('progressBar').style.width = Math.round(Math.min(1,Math.max(0,p))*100)+'%'; }
function esc(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
function modelById(id){ return (DATA.models||[]).find(m=>m.id===id); }

function answerS1(i){
  state.answers[state.s1] = i;
  if (state.s1 < STAGE1.length-1){ state.s1++; render(); }
  else { state.picks = scoreModels(); state.step='models'; render(); }
}
function chooseModel(id){
  state.chosen = id;
  state.s2 = 0;
  state.trimAnswers = [];
  state.step='s2';
  render();
}
function trimQuestions(modelId){
  const fam = familyOf(modelId);
  return TRIM_Q.common.concat(TRIM_Q[fam] || TRIM_Q[modelId] || []);
}
function answerS2(i){
  state.trimAnswers[state.s2] = i;
  const qs = trimQuestions(state.chosen);
  if (state.s2 < qs.length-1){ state.s2++; render(); }
  else { state.trims = scoreTrims(); state.step='end'; render(); }
}

function scoreModels(){
  const models = availableModels();
  const scores = Object.fromEntries(models.map(m=>[m.id,0]));
  let needThird=false, needAwd=false, prefer='any', charge='unsure', weeklyMax=999;
  STAGE1.forEach((q,qi)=>{
    const a = q.answers[state.answers[qi]];
    if (!a) return;
    if (a.needThird) needThird=true;
    if (a.needAwd) needAwd=true;
    if (a.prefer) prefer=a.prefer;
    if (a.charge) charge=a.charge;
    if (a.weeklyMax) weeklyMax=a.weeklyMax;
    Object.entries(a.tags||{}).forEach(([fam,n])=>{
      models.forEach(m=>{
        if ((m.family||m.id)===fam) scores[m.id]=(scores[m.id]||0)+n;
      });
    });
  });
  models.forEach(m=>{
    const w = weeklyFor(m);
    if (w > weeklyMax+15) scores[m.id]-=4;
    else if (w <= weeklyMax) scores[m.id]+=1;
    if (needThird && m.seats<7) scores[m.id]-=20;
    if (needAwd && m.drive==='fwd_only') scores[m.id]-=12;
    if (prefer==='ev' && m.powertrain!=='ev') scores[m.id]-=3;
    if (prefer==='phev' && m.powertrain!=='phev') scores[m.id]-=2;
    if (prefer==='gas' && m.powertrain!=='gas') scores[m.id]-=4;
    if ((prefer==='ev' || prefer==='phev') && charge==='none' && m.powertrain!=='gas') scores[m.id]-=3;
  });
  const ranked = models.map(m=>({ model:m, score:scores[m.id], why:whyFor(m, {needThird,needAwd,prefer,charge,weeklyMax}) }))
    .sort((a,b)=> b.score-a.score || a.model.startingMsrp-b.model.startingMsrp);
  // If third row is required, prefer two 7-seaters when possible
  let picks = ranked;
  if (needThird){
    const seven = ranked.filter(p=>p.model.seats>=7);
    if (seven.length>=2) picks = seven.concat(ranked.filter(p=>p.model.seats<7));
  }
  return picks.slice(0,2);
}
function whyFor(m, ctx){
  const bits=[];
  if (ctx.needThird && m.seats>=7) bits.push(m.whyHints.family);
  if (ctx.needAwd && m.drive!=='fwd_only') bits.push(m.whyHints.awd);
  if (ctx.prefer==='ev' && m.powertrain==='ev') bits.push(m.whyHints.ev || m.whyHints.range);
  if (ctx.prefer==='phev' && m.powertrain==='phev') bits.push(m.whyHints.phev);
  if (ctx.weeklyMax<=100 && m.whyHints.budget) bits.push(m.whyHints.budget);
  if (m.whyHints.cargo && (m.seats>=7 || m.cargoL)) bits.push(m.whyHints.cargo || m.whyHints.size);
  bits.push(m.tagline);
  return [...new Set(bits.filter(Boolean))].slice(0,3).join(' ');
}

function scoreTrims(){
  const m = modelById(state.chosen);
  const qs = trimQuestions(m.id);
  const want = new Set();
  let prefer='comfort', require=null;
  qs.forEach((q,qi)=>{
    const a=q.answers[state.trimAnswers[qi]];
    if(!a) return;
    (a.want||[]).forEach(t=>want.add(t));
    if (a.prefer) prefer=a.prefer;
    if (a.require) require=a.require;
  });
  const scored = m.trims.filter(t=>{
    if (require==='awd' && t.drive==='FWD') return false;
    return true;
  }).map(t=>{
    let s=0;
    (t.tags||[]).forEach(tag=>{ if (want.has(tag)) s+=3; });
    if (prefer==='value') s += (m.trims[0].msrp / t.msrp)*4;
    if (prefer==='luxury') s += (t.msrp / m.trims[m.trims.length-1].msrp)*4;
    if (prefer==='comfort'){
      if ((t.tags||[]).some(x=>['comfort','heated-wheel','sunroof','leather'].includes(x))) s+=2;
    }
    return { trim:t, score:s, weekly: weeklyFor(m,t) };
  }).sort((a,b)=> b.score-a.score || a.trim.msrp-b.trim.msrp);
  // Keep the top matches, then show them lowest price to highest.
  const top = scored.slice(0, Math.min(3, scored.length));
  return top.sort((a,b)=> a.trim.msrp-b.trim.msrp || a.trim.name.localeCompare(b.trim.name));
}

function goBack(){
  if (state.step==='s1' && state.s1>0){ state.s1--; render(); return; }
  if (state.step==='s1'){ state.step='intro'; $('intro') || location.reload(); showIntro(); return; }
  if (state.step==='models'){ state.step='s1'; state.s1=STAGE1.length-1; render(); return; }
  if (state.step==='s2' && state.s2>0){ state.s2--; render(); return; }
  if (state.step==='s2'){ state.step='models'; render(); return; }
  if (state.step==='end'){ state.step='s2'; state.s2=trimQuestions(state.chosen).length-1; render(); }
}
function showIntro(){
  state = { step:'intro', s1:0, s2:0, answers:[], trimAnswers:[], picks:null, chosen:null, trims:null };
  $('progressWrap').hidden=true; $('nav').hidden=true; $('restartBtn').hidden=true;
  $('app').innerHTML = `<section class="screen" id="intro">
    <p class="eyebrow">Port Coquitlam, BC</p>
    <h1>Find the best Mitsubishi for your family.</h1>
    <p class="lede">Just answer a few quick questions and we'll show you the best new Mitsubishi model to meet your family's needs, then we'll help you determine the right trim level. When we're done, we'll even show you what we have in stock, or let you build your perfect vehicle!</p>
    <button type="button" class="cta" id="startBtn" disabled>Loading…</button>
    <p class="fine">Takes about two minutes. Payments shown later are approximate estimates only, before taxes, using current BC finance offers (November 3–30, 2026).</p>
  </section>`;
  if (DATA) armStart();
}
function start(){
  if (!DATA) return;
  state.step='s1'; state.s1=0; state.answers=[]; render();
}
function armStart(){
  const btn = $('startBtn');
  if (!btn) return;
  btn.disabled = false;
  btn.textContent = "Let’s go";
  btn.onclick = start;
}

window.addEventListener('DOMContentLoaded', async ()=>{
  $('backBtn').onclick=goBack;
  $('restartBtn').onclick=()=>{ if (state.step==='intro' || confirm('Start the finder from the beginning?')) showIntro(); };
  try {
    const r = await fetch('/finder/finder-data.json');
    if (!r.ok) throw new Error('HTTP '+r.status);
    DATA = await r.json();
    armStart();
  } catch (err) {
    const btn = $('startBtn');
    if (btn){ btn.disabled = true; btn.textContent = "Couldn't load — please refresh"; }
    console.error('Finder data failed to load', err);
  }
});

// exported for tests
window.FinderCore = { weeklyPayment, scoreModels, STAGE1 };
