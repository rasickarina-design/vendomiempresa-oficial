# Business Match Maker

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Empresas en Venta</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0a0a0a; --bg-card:#141414; --bg-card-hover:#1b1b1b; --bg-input:#111111;
    --yellow:#FFD400; --yellow-dim:#8a7300; --yellow-soft:rgba(255,212,0,0.12);
    --white:#F5F5F1; --gray:#8c8c8c; --gray-dim:#5a5a5a;
    --border:#252525; --border-soft:#1c1c1c;
    --red:#FF5B5B; --green:#4ADE80;
  }
  *{box-sizing:border-box; margin:0; padding:0;}
  html,body{background:var(--bg); color:var(--white); font-family:'Inter',sans-serif; min-height:100vh;}
  #root{min-height:100vh; display:flex; flex-direction:column;}
  h1,h2,h3,.brand{font-family:'Space Grotesk',sans-serif;}
  .mono{font-family:'JetBrains Mono',monospace;}

  .topbar{display:flex; align-items:center; justify-content:space-between; padding:18px 28px; border-bottom:1px solid var(--border-soft); position:sticky; top:0; background:rgba(10,10,10,0.9); backdrop-filter:blur(8px); z-index:20; flex-wrap:wrap; gap:10px;}
  .brand{color:var(--yellow); font-weight:700; font-size:19px; letter-spacing:-0.02em; display:flex; align-items:center; gap:9px;}
  .brand .dot{width:8px; height:8px; border-radius:50%; background:var(--yellow); box-shadow:0 0 10px var(--yellow);}
  .topbar-right{display:flex; align-items:center; gap:12px; flex-wrap:wrap;}
  .user-pill{display:flex; align-items:center; gap:8px; background:var(--bg-card); border:1px solid var(--border); padding:7px 12px; border-radius:100px; font-size:13px; color:var(--gray);}
  .lock-badge{display:flex; align-items:center; gap:6px; font-size:11px; color:var(--green); background:rgba(74,222,128,0.08); border:1px solid rgba(74,222,128,0.25); padding:5px 10px; border-radius:100px;}
  .btn-ghost{background:transparent; border:1px solid var(--border); color:var(--gray); padding:8px 14px; border-radius:9px; font-size:13px; cursor:pointer; font-family:'Inter',sans-serif; transition:all .15s;}
  .btn-ghost:hover{border-color:var(--gray); color:var(--white);}

  .auth-wrap{flex:1; display:flex; align-items:center; justify-content:center; padding:24px; position:relative; overflow:hidden;}
  .auth-glow{position:absolute; width:600px; height:600px; background:radial-gradient(circle, rgba(255,212,0,0.07) 0%, transparent 65%); top:-200px; right:-150px; pointer-events:none;}
  .auth-card{width:100%; max-width:440px; background:var(--bg-card); border:1px solid var(--border); border-radius:20px; padding:38px 34px; position:relative; z-index:1;}
  .auth-eyebrow{font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--gray); font-weight:600; margin-bottom:10px;}
  .auth-title{color:var(--yellow); font-size:26px; font-weight:700; letter-spacing:-0.02em; margin-bottom:8px;}
  .auth-sub{color:var(--gray); font-size:14px; line-height:1.5; margin-bottom:26px;}
  .field{margin-bottom:16px;}
  .field label{display:block; font-size:12px; color:var(--gray); margin-bottom:7px; font-weight:600;}
  .field input, .field select{width:100%; background:var(--bg-input); border:1px solid var(--border); color:var(--white); padding:13px 14px; border-radius:10px; font-size:14px; font-family:'Inter',sans-serif; outline:none; transition:border-color .15s, box-shadow .15s;}
  .field input::placeholder{color:var(--gray-dim);}
  .field input:focus, .field select:focus{border-color:var(--yellow); box-shadow:0 0 0 3px var(--yellow-soft);}
  .field input.error{border-color:var(--red);}
  .field-error{color:var(--red); font-size:12px; margin-top:6px;}
  .btn-primary{width:100%; background:var(--yellow); color:#0a0a0a; border:none; padding:14px; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer; font-family:'Inter',sans-serif; transition:transform .1s, opacity .15s; margin-top:6px;}
  .btn-primary:hover{opacity:0.9;}
  .btn-primary:active{transform:scale(0.99);}
  .btn-link{background:none; border:none; color:var(--yellow); font-size:13px; cursor:pointer; font-family:'Inter',sans-serif; text-decoration:underline; text-underline-offset:3px;}
  .auth-foot{margin-top:20px; text-align:center; font-size:12px; color:var(--gray-dim);}
  .security-note{display:flex; gap:10px; align-items:flex-start; background:var(--bg-input); border:1px solid var(--border-soft); border-radius:10px; padding:12px 13px; margin-top:22px;}
  .security-note svg{flex-shrink:0; margin-top:1px;}
  .security-note p{font-size:11.5px; color:var(--gray); line-height:1.5;}

  .code-row{display:flex; gap:9px; justify-content:space-between; margin-bottom:18px;}
  .code-box{width:46px; height:56px; text-align:center; font-size:22px; font-weight:700; background:var(--bg-input); border:1px solid var(--border); border-radius:10px; color:var(--yellow); font-family:'JetBrains Mono',monospace; outline:none; transition:border-color .15s, box-shadow .15s;}
  .code-box:focus{border-color:var(--yellow); box-shadow:0 0 0 3px var(--yellow-soft);}
  .demo-code-box{background:var(--yellow-soft); border:1px dashed var(--yellow-dim); border-radius:10px; padding:12px 13px; margin-bottom:20px; font-size:12.5px; color:var(--yellow); line-height:1.5;}
  .demo-code-box b{font-family:'JetBrains Mono',monospace; font-size:15px; letter-spacing:0.15em;}

  .role-grid{display:flex; flex-direction:column; gap:10px; margin-bottom:6px;}
  .role-opt{display:flex; align-items:center; gap:14px; background:var(--bg-input); border:1px solid var(--border); border-radius:12px; padding:16px; cursor:pointer; text-align:left; transition:border-color .15s, background .15s;}
  .role-opt:hover{border-color:var(--yellow-dim); background:var(--bg-card-hover);}
  .role-icon{font-size:22px;}
  .role-opt-title{font-weight:700; font-size:14px; margin-bottom:2px;}
  .role-opt-sub{font-size:12px; color:var(--gray);}

  .dash{flex:1; padding:32px 28px 60px; max-width:1180px; width:100%; margin:0 auto;}
  .dash-head{display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:22px;}
  .dash-title{font-size:24px; font-weight:700; color:var(--yellow); letter-spacing:-0.02em;}
  .dash-sub{color:var(--gray); font-size:13px; margin-top:4px;}
  .tabs{display:flex; gap:6px; background:var(--bg-card); border:1px solid var(--border); padding:4px; border-radius:11px; width:fit-content; margin-bottom:24px; flex-wrap:wrap;}
  .tab{padding:9px 16px; border-radius:8px; font-size:13px; font-weight:600; color:var(--gray); cursor:pointer; border:none; background:transparent; font-family:'Inter',sans-serif; transition:all .15s; position:relative;}
  .tab.active{background:var(--yellow); color:#0a0a0a;}
  .tab-badge{display:inline-block; background:var(--red); color:#fff; font-size:9px; font-weight:700; border-radius:100px; padding:1px 6px; margin-left:6px;}
  .tab.active .tab-badge{background:#0a0a0a; color:var(--yellow);}

  .toolbar{display:flex; gap:10px; margin-bottom:22px; flex-wrap:wrap;}
  .search-box{flex:1; min-width:220px; background:var(--bg-card); border:1px solid var(--border); border-radius:10px; padding:11px 14px; color:var(--white); font-size:13px; outline:none;}
  .search-box:focus{border-color:var(--yellow);}
  .select-box{background:var(--bg-card); border:1px solid var(--border); border-radius:10px; padding:11px 14px; color:var(--white); font-size:13px; outline:none;}

  .grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(280px,1fr)); gap:16px;}
  .card{background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:20px; transition:border-color .15s, transform .15s; position:relative;}
  .card:hover{border-color:var(--yellow-dim); transform:translateY(-2px);}
  .card-top{display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; gap:8px;}
  .card-sector{font-size:10.5px; text-transform:uppercase; letter-spacing:0.08em; color:var(--yellow); font-weight:700; background:var(--yellow-soft); padding:4px 9px; border-radius:100px;}
  .match-badge{font-size:10px; font-weight:700; color:#0a0a0a; background:var(--green); padding:4px 9px; border-radius:100px; white-space:nowrap;}
  .card-name{font-size:17px; font-weight:700; margin-bottom:6px; letter-spacing:-0.01em;}
  .card-loc{font-size:12px; color:var(--gray); margin-bottom:12px;}
  .card-desc{font-size:13px; color:#c4c4c0; line-height:1.55; margin-bottom:16px; min-height:40px;}
  .card-stats{display:flex; justify-content:space-between; border-top:1px solid var(--border-soft); padding-top:13px; margin-bottom:12px;}
  .stat-label{font-size:10px; color:var(--gray-dim); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:3px;}
  .stat-val{font-size:14px; font-weight:700; color:var(--white); font-family:'JetBrains Mono',monospace;}
  .card-foot{display:flex; justify-content:space-between; align-items:center; gap:8px;}
  .card-owner{font-size:11px; color:var(--gray-dim);}
  .card-del{font-size:11px; color:var(--red); background:none; border:none; cursor:pointer; font-family:'Inter',sans-serif;}
  .empty-state{text-align:center; padding:70px 20px; color:var(--gray);}
  .empty-state h3{color:var(--white); font-size:17px; margin-bottom:8px;}
  .empty-state p{font-size:13px;}

  .form-card{background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:28px; max-width:660px;}
  .form-grid{display:grid; grid-template-columns:1fr 1fr; gap:14px;}
  .form-grid .full{grid-column:1/-1;}
  .form-grid .third{grid-column:span 1;}
  textarea{width:100%; background:var(--bg-input); border:1px solid var(--border); color:var(--white); padding:13px 14px; border-radius:10px; font-size:13.5px; font-family:'Inter',sans-serif; outline:none; resize:vertical; min-height:80px;}
  textarea:focus{border-color:var(--yellow); box-shadow:0 0 0 3px var(--yellow-soft);}
  .form-hint{font-size:11.5px; color:var(--gray-dim); margin-bottom:18px; margin-top:-8px;}

  .match-section{margin-bottom:34px;}
  .match-section h3{color:var(--yellow); font-size:15px; margin-bottom:4px;}
  .match-section .sub{color:var(--gray); font-size:12.5px; margin-bottom:16px;}
  .match-row{display:flex; align-items:center; justify-content:space-between; gap:14px; background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:14px 16px; margin-bottom:10px; flex-wrap:wrap;}
  .match-row-info{flex:1; min-width:220px;}
  .match-row-title{font-weight:700; font-size:14px; margin-bottom:3px;}
  .match-row-sub{font-size:12px; color:var(--gray);}
  .mail-btn{display:inline-flex; align-items:center; gap:6px; background:var(--yellow); color:#0a0a0a; border:none; padding:9px 14px; border-radius:9px; font-size:12.5px; font-weight:700; cursor:pointer; text-decoration:none; font-family:'Inter',sans-serif; white-space:nowrap;}
  .mail-btn.sent{background:var(--bg-input); color:var(--green); border:1px solid var(--green);}

  .toast{position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:var(--bg-card); border:1px solid var(--yellow-dim); color:var(--yellow); padding:13px 22px; border-radius:100px; font-size:13px; font-weight:600; z-index:100; box-shadow:0 8px 30px rgba(0,0,0,0.5); animation:toastIn .25s ease; max-width:90vw; text-align:center;}
  @keyframes toastIn{from{opacity:0; transform:translate(-50%,10px);} to{opacity:1; transform:translate(-50%,0);}}
  @media(max-width:560px){.form-grid{grid-template-columns:1fr;} .code-box{width:38px; height:50px; font-size:18px;}}
</style>
</head>
<body>
<div id="root"></div>

<script>
const KEY_COMPANIES = 'companies-list';
const KEY_BUYERS = 'buyers-list';
const KEY_CONTACTS = 'contacts-log';

let state = {
  screen: 'login',        // login | verify | role | profile | dashboard
  email: '', phone: '',
  pendingCode: '', codeExpires: 0, attempts: 0,
  errors: {},
  role: null,              // seller | buyer | both
  profile: { name:'', sectors:'', budgetMin:'', budgetMax:'', currency:'USD', locationPref:'', thesis:'' },
  tab: 'explore',
  search: '', sectorFilter: '',
  companies: [], buyers: [], contacts: [],
  toast: null
};

function setState(patch){ state = {...state, ...patch}; render(); }
function showToast(msg){ setState({toast: msg}); setTimeout(()=>{ if(state.toast===msg) setState({toast:null}); }, 3400); }

// ---------- storage ----------
async function loadList(key){
  try{ const r = await window.storage.get(key, true); return r && r.value ? JSON.parse(r.value) : []; }
  catch(e){ return []; }
}
async function saveList(key, list){
  try{ await window.storage.set(key, JSON.stringify(list), true); }
  catch(e){ console.error('storage error', e); }
}

// ---------- helpers ----------
function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function validPhone(v){ return /^[0-9+\s()-]{8,18}$/.test(v); }
function maskEmail(e){ const [u,d]=e.split('@'); if(!d) return e; return u.slice(0,2)+'*'.repeat(Math.max(u.length-2,1))+'@'+d; }
function genCode(){ return String(Math.floor(100000 + Math.random()*900000)); }
function fmtMoney(amount, currency){ if(!amount) return 'A convenir'; return currency+' '+Number(amount).toLocaleString('es-AR'); }
function esc(s){ return (s||'').toString().replace(/s.trim().toLowerCase()).filter(Boolean); }
function sectorMatches(companySector, buyerSectorsStr){
  const cs = (companySector||'').trim().toLowerCase();
  if(!cs) return false;
  const list = sectorList(buyerSectorsStr);
  if(list.length===0) return false;
  return list.some(s => cs.includes(s) || s.includes(cs));
}
function budgetMatches(company, buyer){
  if(!company.priceAmount || buyer.budgetMin==='' || buyer.budgetMax==='' || buyer.budgetMin==null || buyer.budgetMax==null) return true;
  if(company.priceCurrency !== buyer.currency) return true; // can't compare across currencies, don't block match
  const p = Number(company.priceAmount);
  return p >= Number(buyer.budgetMin) && p <= Number(buyer.budgetMax);
}
function isMatch(company, buyer){
  if(company.owner === buyer.email) return false;
  return sectorMatches(company.sector, buyer.sectors) && budgetMatches(company, buyer);
}
function getMyBuyerProfile(){ return state.buyers.find(b=>b.email===state.email); }
function getMyCompanies(){ return state.companies.filter(c=>c.owner===state.email); }
function contactKey(buyerEmail, companyId){ return buyerEmail+'::'+companyId; }
function wasContacted(buyerEmail, companyId){ return state.contacts.some(c=>c.key===contactKey(buyerEmail,companyId)); }

function mailtoLink(to, subject, body){
  return 'mailto:'+encodeURIComponent(to)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
}

const iconLock = ``;
const iconShield = ``;

// ================= RENDER ROOT =================
function render(){
  const root = document.getElementById('root');
  if(state.screen === 'login') root.innerHTML = renderLogin();
  else if(state.screen === 'verify') root.innerHTML = renderVerify();
  else if(state.screen === 'role') root.innerHTML = renderRole();
  else if(state.screen === 'profile') root.innerHTML = renderProfile();
  else root.innerHTML = renderDashboard();
  attachHandlers();
}

// ================= LOGIN =================
function renderLogin(){
  const errs = state.errors;
  return `
  


    


      

Portal de empresas en venta


      

Empresas en Venta


      

Conectamos vendedores y compradores de empresas. Login sin contraseña: solo tu email y un código de un solo uso.


      

Email
        @empresa.com" value="${esc(state.email)}" class="${errs.email?'error':''}"/>
        ${errs.email?`

${errs.email}

`:''}
      
      

Teléfono
        
        ${errs.phone?`

${errs.phone}

`:''}
      


      Enviar código de verificación
      

${iconShield}
        

No usamos contraseñas. Te enviamos un código de 6 dígitos a tu email, válido por 5 minutos, para confirmar que sos vos.


      


    
  `;
}
function handleSendCode(){
  const email = document.getElementById('in-email').value.trim();
  const phone = document.getElementById('in-phone').value.trim();
  const errors = {};
  if(!validEmail(email)) errors.email = 'Ingresá un email válido.';
  if(!validPhone(phone)) errors.phone = 'Ingresá un teléfono válido (mínimo 8 dígitos).';
  if(Object.keys(errors).length){ setState({errors, email, phone}); return; }
  const code = genCode();
  setState({ email, phone, errors:{}, pendingCode:code, codeExpires:Date.now()+5*60*1000, attempts:0, screen:'verify' });
}

// ================= VERIFY =================
function renderVerify(){
  const minutesLeft = Math.max(0, Math.ceil((state.codeExpires - Date.now())/60000));
  return `
  


    


      

Paso 2 de 2


      

Confirmá tu email


      

Enviamos un código de 6 dígitos a ${maskEmail(state.email)}. Válido por ${minutesLeft} min.


      

MODO DEMO — esta app todavía no tiene un servicio de envío de emails conectado, así que te mostramos el código acá: ${state.pendingCode}. En producción llegaría solo a la casilla de email.


      

${[0,1,2,3,4,5].map(i=>``).join('')}


      ${state.errors.code?`

${state.errors.code}

`:''}
      Verificar y entrar
      

Volver / cambiar email


    

`;
}
function handleVerify(){
  const boxes = document.querySelectorAll('.code-box');
  const entered = Array.from(boxes).map(b=>b.value).join('');
  if(entered.length < 6){ setState({errors:{code:'Completá los 6 dígitos.'}}); return; }
  if(Date.now() > state.codeExpires){ setState({errors:{code:'El código expiró. Volvé atrás y pedí uno nuevo.'}}); return; }
  if(entered !== state.pendingCode){
    const attempts = state.attempts + 1;
    if(attempts >= 5){ setState({screen:'login', errors:{}, attempts:0}); showToast('Demasiados intentos fallidos. Pedí un nuevo código.'); return; }
    setState({errors:{code:`Código incorrecto (intento ${attempts}/5).`}, attempts});
    return;
  }
  // ¿ya tenemos perfil / rol de una sesión anterior?
  const existingBuyer = state.buyers.find(b=>b.email===state.email);
  if(existingBuyer){
    setState({ screen:'dashboard', errors:{}, role: existingBuyer.role||'buyer',
      profile:{...state.profile, name:existingBuyer.name, sectors:existingBuyer.sectors, budgetMin:existingBuyer.budgetMin, budgetMax:existingBuyer.budgetMax, currency:existingBuyer.currency, locationPref:existingBuyer.locationPref, thesis:existingBuyer.thesis},
      tab:'explore' });
    showToast('¡Bienvenido/a de nuevo!');
    return;
  }
  setState({ screen:'role', errors:{} });
}

// ================= ROLE =================
function renderRole(){
  return `
  


    


      

Último paso


      

¿Qué te trae por acá?


      

Así te mostramos lo que te sirve primero. Podés hacer las dos cosas en cualquier momento.


      


        🏢

Vendo mi empresa

Quiero publicar los datos de mi empresa para encontrar compradores.


        🔎

Busco comprar una empresa

Quiero definir qué busco y que me avisen cuando haya match.


        🤝

Las dos cosas

Vendo una empresa y también estoy evaluando comprar otra.


      


    

`;
}

// ================= PROFILE =================
function renderProfile(){
  const p = state.profile;
  const needsBuyerFields = state.role==='buyer' || state.role==='both';
  return `
  


    


      

Tu perfil


      

Contanos un poco más


      

Estos datos se usan para armar los matches y para que la otra parte sepa con quién está hablando.


      

Nombre completo
        
        ${state.errors.name?`

${state.errors.name}

`:''}
      


      ${needsBuyerFields ? `
        

Rubros que te interesan (separados por coma)
          
          ${state.errors.sectors?`

${state.errors.sectors}

`:''}
        


        


          

Presupuesto mínimo


          

Presupuesto máximo


        


        

Moneda
          USDARS
        


        

Ubicación preferida (opcional)


        

¿Qué tipo de empresa estás buscando?${esc(p.thesis)}


      ` : ''}
      Continuar
    

`;
}
function handleSaveProfile(){
  const name = document.getElementById('p-name').value.trim();
  const errors = {};
  if(!name) errors.name = 'Ingresá tu nombre.';
  const needsBuyerFields = state.role==='buyer' || state.role==='both';
  let sectors='', budgetMin='', budgetMax='', currency='USD', locationPref='', thesis='';
  if(needsBuyerFields){
    sectors = document.getElementById('p-sectors').value.trim();
    budgetMin = document.getElementById('p-budgetmin').value;
    budgetMax = document.getElementById('p-budgetmax').value;
    currency = document.getElementById('p-currency').value;
    locationPref = document.getElementById('p-location').value.trim();
    thesis = document.getElementById('p-thesis').value.trim();
    if(!sectors) errors.sectors = 'Contanos al menos un rubro de interés para poder buscarte matches.';
  }
  if(Object.keys(errors).length){ setState({errors}); return; }

  const profile = { name, sectors, budgetMin, budgetMax, currency, locationPref, thesis };
  let buyers = state.buyers;
  if(needsBuyerFields){
    const entry = { email: state.email, phone: state.phone, name, sectors, budgetMin, budgetMax, currency, locationPref, thesis, role: state.role, updatedAt: Date.now() };
    const idx = buyers.findIndex(b=>b.email===state.email);
    buyers = idx>=0 ? buyers.map((b,i)=> i===idx?entry:b) : [entry, ...buyers];
    saveList(KEY_BUYERS, buyers);
  }
  const defaultTab = state.role==='buyer' ? 'explore' : 'publish';
  setState({ profile, buyers, errors:{}, screen:'dashboard', tab: defaultTab });
  showToast('¡Perfil listo!');
}

// ================= DASHBOARD =================
function renderDashboard(){
  const list = state.companies
    .filter(c => !state.sectorFilter || c.sector === state.sectorFilter)
    .filter(c => !state.search || (c.name+c.desc+c.location).toLowerCase().includes(state.search.toLowerCase()));
  const sectors = [...new Set(state.companies.map(c=>c.sector))].filter(Boolean);
  const myBuyer = getMyBuyerProfile();
  const myCompanies = getMyCompanies();

  let matchCount = 0;
  myCompanies.forEach(c => matchCount += state.buyers.filter(b=>isMatch(c,b)).length);
  if(myBuyer) matchCount += state.companies.filter(c=>isMatch(c,myBuyer)).length;

  return `
  


    

Empresas en Venta


    


      

${iconLock} Sesión verificada


      

${esc(state.profile.name)} · ${maskEmail(state.email)}


      Salir
    


    


      


        

Hola, ${esc(state.profile.name.split(' ')[0]||'')}


        

${state.companies.length} empresa${state.companies.length===1?'':'s'} publicada${state.companies.length===1?'':'s'} · ${state.buyers.length} compradore${state.buyers.length===1?'':'s'} registrados


      


    


    


      Explorar empresas
      Publicar mi empresa
      Buscar para comprar
      Mis matches${matchCount>0?`${matchCount}`:''}
    


    ${state.tab==='explore' ? renderExplore(list, sectors, myBuyer) :
      state.tab==='publish' ? renderPublishForm() :
      state.tab==='buyerprofile' ? renderBuyerProfileForm() :
      renderMatches(myBuyer, myCompanies)}
  


  ${state.toast?`

${state.toast}

`:''}
  `;
}

function renderExplore(list, sectors, myBuyer){
  return `
    


      
      Todos los rubros${sectors.map(s=>`${esc(s)}`).join('')}
    


    ${list.length===0 ? `

Todavía no hay empresas para mostrar

Sé el primero en publicar en la pestaña "Publicar mi empresa".

` : `
      

${list.map(c=>{
        const match = myBuyer ? isMatch(c, myBuyer) : false;
        return `
          


            


              ${esc(c.sector)}
              ${match?`★ Match con vos`:''}
              ${c.owner===state.email?`Eliminar`:''}
            


            

${esc(c.name)}


            

📍 ${esc(c.location)}


            

${esc(c.desc)}


            


              

Facturación anual

${esc(c.revenue)}


              

Precio de venta

${fmtMoney(c.priceAmount,c.priceCurrency)}


            


            

Publicado por ${esc(c.ownerName)} · ${maskEmail(c.owner)}


          

`;
      }).join('')}

`}
  `;
}

function renderPublishForm(){
  return `
  


    

Datos de la empresa


    

Esta información será visible para compradores en la plataforma, junto con tu nombre y email.


    


      

Nombre de la empresa


      

Rubro / Sector


      

Ubicación


      

Antigüedad


      

Facturación anual


      

Precio de venta (monto)


      

Moneda del precioUSDARS


      

Descripción y motivo de venta


    


    Publicar empresa

`;
}
function handlePublish(){
  const name = document.getElementById('f-name').value.trim();
  const sector = document.getElementById('f-sector').value.trim();
  const location = document.getElementById('f-location').value.trim();
  const age = document.getElementById('f-age').value.trim();
  const revenue = document.getElementById('f-revenue').value.trim();
  const priceAmount = document.getElementById('f-price').value;
  const priceCurrency = document.getElementById('f-currency').value;
  const desc = document.getElementById('f-desc').value.trim();
  if(!name || !sector || !desc){ showToast('Completá al menos nombre, rubro y descripción.'); return; }
  const entry = { id:'c_'+Date.now()+'_'+Math.floor(Math.random()*1000), name, sector, location:location||'—', age:age||'—',
    revenue:revenue||'No especificada', priceAmount: priceAmount?Number(priceAmount):null, priceCurrency,
    desc, owner: state.email, ownerName: state.profile.name, ownerPhone: state.phone, createdAt: Date.now() };
  const updated = [entry, ...state.companies];
  setState({companies: updated, tab:'explore'});
  saveList(KEY_COMPANIES, updated);
  showToast('¡Empresa publicada con éxito!');
}

function renderBuyerProfileForm(){
  const p = state.profile;
  return `
  


    

¿Qué empresa estás buscando?


    

Con esto te avisamos qué publicaciones hacen match con vos, y los vendedores pueden contactarte directamente.


    

Rubros que te interesan (separados por coma)


    


      

Presupuesto mínimo


      

Presupuesto máximo


    


    

MonedaUSDARS


    

Ubicación preferida (opcional)


    

Descripción de lo que buscás${esc(p.thesis)}


    Guardar búsqueda

`;
}
function handleSaveBuyerProfile(){
  const sectors = document.getElementById('bp-sectors').value.trim();
  const budgetMin = document.getElementById('bp-budgetmin').value;
  const budgetMax = document.getElementById('bp-budgetmax').value;
  const currency = document.getElementById('bp-currency').value;
  const locationPref = document.getElementById('bp-location').value.trim();
  const thesis = document.getElementById('bp-thesis').value.trim();
  if(!sectors){ showToast('Contanos al menos un rubro de interés.'); return; }
  const profile = {...state.profile, sectors, budgetMin, budgetMax, currency, locationPref, thesis};
  const entry = { email: state.email, phone: state.phone, name: state.profile.name, sectors, budgetMin, budgetMax, currency, locationPref, thesis, role: state.role==='seller'?'both':(state.role||'buyer'), updatedAt: Date.now() };
  const idx = state.buyers.findIndex(b=>b.email===state.email);
  const buyers = idx>=0 ? state.buyers.map((b,i)=> i===idx?entry:b) : [entry, ...state.buyers];
  setState({ profile, buyers, role: entry.role, tab:'matches' });
  saveList(KEY_BUYERS, buyers);
  showToast('¡Tu búsqueda quedó guardada! Ya podés ver tus matches.');
}

function renderMatches(myBuyer, myCompanies){
  const sellerBlocks = myCompanies.map(c=>{
    const buyers = state.buyers.filter(b=>isMatch(c,b));
    return { company:c, buyers };
  });
  const buyerMatches = myBuyer ? state.companies.filter(c=>isMatch(c,myBuyer)) : [];

  const hasAnything = sellerBlocks.some(b=>b.buyers.length>0) || buyerMatches.length>0;

  let html = '';

  if(myCompanies.length>0){
    html += `

Compradores interesados en tus empresas

Compradores cuyos criterios de búsqueda coinciden con lo que publicaste.

`;
    sellerBlocks.forEach(({company, buyers})=>{
      if(buyers.length===0){
        html += `

${esc(company.name)}

Todavía no hay compradores que hagan match con esta publicación.

`;
      } else {
        buyers.forEach(b=>{
          const key = contactKey(b.email, company.id);
          const sent = wasContacted(b.email, company.id);
          const subject = `Interés en tu búsqueda de empresas — ${company.name}`;
          const body = `Hola ${b.name},\n\nTe contacto desde Empresas en Venta porque tu búsqueda (${b.sectors}) coincide con mi empresa "${company.name}", ubicada en ${company.location}.\n\nFacturación anual: ${company.revenue}\nPrecio de venta: ${fmtMoney(company.priceAmount, company.priceCurrency)}\n\nMis datos de contacto:\n${company.ownerName}\n${company.ownerPhone}\n${company.owner}\n\nQuedo atento/a si querés que conversemos.\n\nSaludos.`;
          html += `

${esc(b.name)} → interesado en ${esc(company.name)}

Busca: ${esc(b.sectors)} · Presupuesto: ${b.budgetMin&&b.budgetMax?fmtMoney(b.budgetMin,b.currency)+' – '+fmtMoney(b.budgetMax,b.currency):'No especificado'}


          ${sent?'✓ Contactado':'✉ Contactar comprador'}

`;
        });
      }
    });
    html += `

`;
  }

  if(myBuyer){
    html += `

Empresas que coinciden con tu búsqueda

Según los rubros y presupuesto que definiste en "Buscar para comprar".

`;
    if(buyerMatches.length===0){
      html += `

Todavía no hay matches

Te vamos a mostrar acá las empresas publicadas que coincidan con tu búsqueda.

`;
    } else {
      buyerMatches.forEach(c=>{
        const key = contactKey(myBuyer.email, c.id);
        const sent = wasContacted(myBuyer.email, c.id);
        const subject = `Interesado/a en comprar tu empresa — ${c.name}`;
        const body = `Hola ${c.ownerName},\n\nVi tu publicación de "${c.name}" en Empresas en Venta y coincide con lo que estoy buscando (${myBuyer.sectors}).\n\n${myBuyer.thesis ? myBuyer.thesis + '\n\n' : ''}Mis datos de contacto:\n${myBuyer.name}\n${myBuyer.phone}\n${myBuyer.email}\n\nQuedo a la espera de tu respuesta.\n\nSaludos.`;
        html += `

${esc(c.name)}

${esc(c.sector)} · ${fmtMoney(c.priceAmount,c.priceCurrency)} · 📍 ${esc(c.location)}


        ${sent?'✓ Contactado':'✉ Contactar vendedor'}

`;
      });
    }
    html += `

`;
  }

  if(myCompanies.length===0 && !myBuyer){
    html = `

Todavía no configuraste nada para matchear

Publicá una empresa o completá tu búsqueda en "Buscar para comprar" para empezar a ver matches acá.

`;
  }

  return html;
}

// ================= EVENTS =================
function attachHandlers(){
  if(state.screen==='login'){
    document.getElementById('btn-send-code').onclick = handleSendCode;
    ['in-email','in-phone'].forEach(id=>{ document.getElementById(id).onkeydown = e=>{ if(e.key==='Enter') handleSendCode(); }; });
  }
  else if(state.screen==='verify'){
    const boxes = document.querySelectorAll('.code-box');
    boxes.forEach((b,i)=>{
      b.oninput = ()=>{ b.value=b.value.replace(/[^0-9]/g,'').slice(0,1); if(b.value && boxes[i+1]) boxes[i+1].focus(); };
      b.onkeydown = e=>{ if(e.key==='Backspace' && !b.value && boxes[i-1]) boxes[i-1].focus(); if(e.key==='Enter') handleVerify(); };
    });
    if(boxes[0]) boxes[0].focus();
    document.getElementById('btn-verify').onclick = handleVerify;
    document.getElementById('btn-back').onclick = ()=> setState({screen:'login', errors:{}});
  }
  else if(state.screen==='role'){
    document.querySelectorAll('.role-opt').forEach(btn=>{
      btn.onclick = ()=> setState({ role: btn.getAttribute('data-role'), screen:'profile', errors:{} });
    });
  }
  else if(state.screen==='profile'){
    document.getElementById('btn-save-profile').onclick = handleSaveProfile;
  }
  else if(state.screen==='dashboard'){
    document.getElementById('btn-logout').onclick = ()=> setState({screen:'login', email:'', phone:'', role:null, profile:{name:'',sectors:'',budgetMin:'',budgetMax:'',currency:'USD',locationPref:'',thesis:''}, errors:{}});
    document.querySelectorAll('.tab').forEach(t=>{ t.onclick = ()=> setState({tab: t.getAttribute('data-tab')}); });

    if(state.tab==='explore'){
      const s = document.getElementById('in-search'); const sel = document.getElementById('in-sector');
      if(s) s.oninput = ()=> setState({search:s.value});
      if(sel) sel.onchange = ()=> setState({sectorFilter:sel.value});
      document.querySelectorAll('[data-del]').forEach(btn=>{
        btn.onclick = ()=>{ const id=btn.getAttribute('data-del'); const updated=state.companies.filter(c=>c.id!==id); setState({companies:updated}); saveList(KEY_COMPANIES, updated); showToast('Empresa eliminada.'); };
      });
    } else if(state.tab==='publish'){
      document.getElementById('btn-publish').onclick = handlePublish;
    } else if(state.tab==='buyerprofile'){
      document.getElementById('btn-save-buyer').onclick = handleSaveBuyerProfile;
    } else if(state.tab==='matches'){
      document.querySelectorAll('[data-contact]').forEach(a=>{
        a.addEventListener('click', ()=>{
          const key = a.getAttribute('data-contact');
          if(!state.contacts.some(c=>c.key===key)){
            const contacts = [...state.contacts, {key, at: Date.now()}];
            state.contacts = contacts; // avoid full re-render wiping the mailto navigation
            saveList(KEY_CONTACTS, contacts);
            a.classList.add('sent'); a.textContent = '✓ Contactado';
          }
        });
      });
    }
  }
}

// ================= INIT =================
(async function init(){
  render();
  const [companies, buyers, contacts] = await Promise.all([loadList(KEY_COMPANIES), loadList(KEY_BUYERS), loadList(KEY_CONTACTS)]);
  setState({companies, buyers, contacts});
})();

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://vendomiempresa.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/657c3473-28fd-4280-a581-787daf3084c7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
