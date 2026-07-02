/* ============================================================
   APROVA — Camada de dados (FICTÍCIA / mock)
   ------------------------------------------------------------
   Etapa 1: tudo vem deste arquivo.
   Etapa 2: trocar o objeto DB por chamadas ao Supabase
   (mesma forma de dados → as telas não precisam mudar).

   ESTRUTURA DE STATUS
   - Projeto:  pronto | andamento | breve
   - Post:     pendente | aprovado | reprovado | ajustes

   TIPOS DE POST
   - reel-9-16   (reel vertical)
   - reel-16-9   (vídeo horizontal)
   - foto        (foto retrato 4:5)
   - carrossel   (várias imagens)
   ============================================================ */

const MANAGER = Object.assign(
  { name: "Davi Moura", studio: "oFruto", whatsapp: "5599999999999" },
  (window.APP_CONFIG && window.APP_CONFIG.MANAGER) || {}
);

const STATUS = {
  project: {
    pronto:    { label: "Pronto para visualizar", cls: "is-pronto",    live:false },
    andamento: { label: "Em andamento",           cls: "is-andamento", live:true  },
    breve:     { label: "Em breve disponível",    cls: "is-breve",     live:false }
  },
  post: {
    pendente:  { label: "Aguardando aprovação", cls: "is-pendente"  },
    aprovado:  { label: "Aprovado",             cls: "is-aprovado"  },
    reprovado: { label: "Reprovado",            cls: "is-reprovado" },
    ajustes:   { label: "Em ajustes",           cls: "is-ajustes"   }
  }
};

const TYPE = {
  "reel-9-16": { label: "Reel 9:16",   ratio: "ratio-9-16", icon: "film" },
  "reel-16-9": { label: "Vídeo 16:9",  ratio: "ratio-16-9", icon: "film" },
  "foto":      { label: "Foto retrato",ratio: "ratio-4-5",  icon: "image" },
  "carrossel": { label: "Carrossel",   ratio: "ratio-4-5",  icon: "layers" },
  "stories":   { label: "Stories",     ratio: "ratio-9-16", icon: "chat" }
};
const WEEKDAYS = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const MONTHS_FULL = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

/* DB fictício -------------------------------------------------- */
const DB = {
  clients: [
    {
      id: "yoko",
      token: "yk7f2a",
      name: "Yoko Tanizaki",
      handle: "@yokotanizaki",
      color: "art-1",
      archived: false,
      message: "Yoko, deixei o reel manifesto pra você ver primeiro — acho que ficou a sua cara. 🙌",
      projects: [
        {
          id: "junho",
          name: "Conteúdos de Junho",
          status: "pronto",
          intro: "Esses são os conteúdos para aprovação, visualização e acompanhamento de Junho. Role para o lado e abra cada um.",
          posts: [
            { id:"p1", title:"Reel manifesto — Clube de visão", type:"reel-9-16", art:"art-1",
              date:"2026-06-03", status:"aprovado", embed:"",
              caption:"Não é um clube de livro. É um clube de visão.\n\nUm espaço para quem quer pensar melhor, se comunicar com clareza e construir autoridade no digital.\n\n👉 Link na bio para assinar.",
              note:"" },
            { id:"p2", title:"Carrossel — Para quem é o YokoBook", type:"carrossel", art:"art-3",
              date:"2026-06-07", status:"ajustes", embed:"", slides:5,
              caption:"6 perfis que mais aproveitam o YokoBook 👇\nSalve esse post para lembrar depois.",
              note:"Cliente pediu ajuste no slide 2 — ver solicitação abaixo.",
              request:{ scope:"Arte — slide 2", text:"No slide 2, trocar a cor do título para o vermelho da marca e diminuir um pouco o texto, está apertado." } },
            { id:"p3", title:"Foto — Leituras do mês", type:"foto", art:"art-5",
              date:"2026-06-12", status:"pendente", embed:"",
              caption:"LEITURAS 📚\nLivros e repertório para aprofundar — além dos resumos.",
              note:"Essa foto é a capa da nova seção de Leituras." },
            { id:"p4", title:"Vídeo 16:9 — Bastidores", type:"reel-16-9", art:"art-2",
              date:"2026-06-16", status:"pendente", embed:"",
              caption:"Um pouco dos bastidores da gravação de Junho. 🎬",
              note:"" },
            { id:"p5", title:"Reel — Assista de onde quiser", type:"reel-9-16", art:"art-4",
              date:"2026-06-21", status:"reprovado", embed:"",
              caption:"Computador, tablet ou celular: o YokoBook vai com você.",
              note:"",
              request:{ scope:"Vídeo — 00:08 a 00:12", text:"Cortar o trecho de 00:08 a 00:12, ficou repetido. Resto está ótimo." } },
            { id:"p6", title:"Carrossel — Garantia de 15 dias", type:"carrossel", art:"art-6",
              date:"2026-06-26", status:"pendente", embed:"", slides:3,
              caption:"Garantia de 15 dias. Se não fizer sentido, é só cancelar.",
              note:"" }
          ]
        },
        {
          id: "trafego",
          name: "Tráfego Pago — Junho",
          status: "andamento",
          intro: "Criativos para as campanhas de tráfego pago de Junho. Aprovação por aqui antes de subir nos anúncios.",
          posts: [
            { id:"t1", title:"Criativo 9:16 — Dor/solução", type:"reel-9-16", art:"art-1",
              date:"2026-06-09", status:"aprovado", embed:"",
              caption:"Você faz muitos cursos mas ainda falta visão estratégica? O YokoBook resolve isso.", note:"" },
            { id:"t2", title:"Criativo 16:9 — Prova social", type:"reel-16-9", art:"art-2",
              date:"2026-06-11", status:"pendente", embed:"",
              caption:"O que nossos assinantes dizem depois de 30 dias.", note:"Versão para YouTube/Meta." },
            { id:"t3", title:"Estático — Oferta", type:"foto", art:"art-5",
              date:"2026-06-13", status:"pendente", embed:"",
              caption:"A partir de R$ 49,90/mês. Comece hoje.", note:"" }
          ]
        },
        {
          id: "campanha",
          name: "Campanha Lançamento",
          status: "breve",
          intro: "Conteúdos da campanha de lançamento. Disponível em breve.",
          posts: []
        }
      ]
    },
    {
      id: "atlas",
      token: "at9k3b",
      name: "Atlas Café",
      handle: "@atlascafe",
      color: "art-4",
      archived: false,
      message: "",
      projects: [
        {
          id: "julho",
          name: "Conteúdos de Julho",
          status: "andamento",
          intro: "Conteúdos de Julho do Atlas Café para aprovação.",
          posts: [
            { id:"a1", title:"Reel — Novo grão da casa", type:"reel-9-16", art:"art-5",
              date:"2026-07-02", status:"pendente", embed:"",
              caption:"Chegou o novo grão da casa ☕ Notas de chocolate e caramelo.", note:"" },
            { id:"a2", title:"Foto — Cardápio de inverno", type:"foto", art:"art-1",
              date:"2026-07-05", status:"aprovado", embed:"",
              caption:"Cardápio de inverno no ar. Venha esquentar. 🔥", note:"" },
            { id:"a3", title:"Carrossel — Como fazer em casa", type:"carrossel", art:"art-3",
              date:"2026-07-08", status:"pendente", embed:"", slides:4,
              caption:"4 passos para um café coado perfeito em casa.", note:"" }
          ]
        }
      ]
    },
    {
      id: "vértice",
      token: "vt4m8c",
      name: "Vértice Consultoria",
      handle: "@verticeconsult",
      color: "art-2",
      archived: false,
      message: "",
      projects: [
        {
          id: "institucional",
          name: "Institucional Q3",
          status: "pronto",
          intro: "Linha institucional do trimestre. Tudo pronto para sua visualização.",
          posts: [
            { id:"v1", title:"Foto — Time", type:"foto", art:"art-6",
              date:"2026-06-30", status:"aprovado", embed:"", caption:"Gente que faz a Vértice acontecer.", note:"" },
            { id:"v2", title:"Carrossel — Cases", type:"carrossel", art:"art-2",
              date:"2026-07-03", status:"aprovado", embed:"", slides:6, caption:"3 cases, 3 resultados.", note:"" }
          ]
        }
      ]
    },
    {
      id: "lumen",
      token: "lm2p6d",
      name: "Lumen Arquitetura",
      handle: "@lumenarq",
      color: "art-3",
      archived: true,
      message: "",
      projects: [
        { id:"maio", name:"Conteúdos de Maio", status:"pronto", intro:"Projeto encerrado.",
          posts:[ { id:"l1", title:"Foto — Projeto residencial", type:"foto", art:"art-6", date:"2026-05-20", status:"aprovado", embed:"", caption:"Luz natural como protagonista.", note:"" } ] }
      ]
    }
  ]
};

/* ---------- Helpers de leitura ---------- */
const Data = {
  manager: () => MANAGER,
  allClients:    () => DB.clients,
  activeClients: () => DB.clients.filter(c => !c.archived),
  archivedClients:()=> DB.clients.filter(c => c.archived),
  client: (id)   => DB.clients.find(c => c.id === id),
  clientByToken: (tok) => DB.clients.find(c => c.token === tok) || DB.clients.find(c => c.id === tok),
  events: () => DB.events || [],
  eventsOfClient: (cid) => (DB.events||[]).filter(e => e.client_id === cid),
  project: (cid, pid) => {
    const c = Data.client(cid); return c ? c.projects.find(p => p.id === pid) : null;
  },
  post: (cid, pid, postId) => {
    const p = Data.project(cid, pid); return p ? p.posts.find(x => x.id === postId) : null;
  },

  /* progresso de aprovação de um cliente (todos os posts de todos projetos) */
  progress: (client) => {
    let total=0, ok=0, adj=0, rej=0, pend=0;
    client.projects.forEach(p => p.posts.forEach(post => {
      total++;
      if (post.status==="aprovado") ok++;
      else if (post.status==="ajustes") adj++;
      else if (post.status==="reprovado") rej++;
      else pend++;
    }));
    return { total, ok, adj, rej, pend, pct: total ? Math.round(ok/total*100) : 0 };
  },
  projectProgress: (project) => {
    const total = project.posts.length;
    const ok = project.posts.filter(p=>p.status==="aprovado").length;
    return { total, ok, pct: total ? Math.round(ok/total*100) : 0 };
  }
};

/* ---------- Util compartilhado ---------- */
const U = {
  qs: (k) => new URLSearchParams(location.search).get(k),
  greet: () => {
    const h = new Date().getHours();
    if (h < 12) return "bom dia";
    if (h < 18) return "boa tarde";
    return "boa noite";
  },
  fmtDate: (iso) => {
    if(!iso) return "—";
    const d = new Date(iso+"T12:00:00");
    return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"long"});
  },
  fmtDateShort: (iso) => {
    if(!iso) return "—";
    const d = new Date(iso+"T12:00:00");
    return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});
  },
  initials: (name) => name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase(),
  toast: (msg) => {
    let t = document.querySelector(".toast");
    if(!t){ t=document.createElement("div"); t.className="toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(U._tt); U._tt = setTimeout(()=>t.classList.remove("show"), 2400);
  },
  reveal: () => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((es)=>es.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
    }),{threshold:.12});
    els.forEach(e=>io.observe(e));
  },
  /* SVG icons (stroke currentColor) */
  icon: (name) => {
    const p = {
      film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
      image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.5-4.5L7 20"/>',
      layers:'<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
      check:'<path d="M20 6 9 17l-5-5"/>',
      x:'<path d="M18 6 6 18M6 6l12 12"/>',
      plus:'<path d="M12 5v14M5 12h14"/>',
      edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
      message:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>',
      archive:'<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4"/>',
      trash:'<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6"/>',
      link:'<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
      arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
      back:'<path d="M19 12H5M11 18l-6-6 6-6"/>',
      play:'<path d="M6 4v16l14-8z" fill="currentColor" stroke="none"/>',
      star:'<path d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.3 6.8 19l1-5.8L3.6 9.1l5.8-.8Z"/>',
      eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
      clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
      whats:'<path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l2-5.5A8.5 8.5 0 1 1 21 11.5Z"/>',
      chat:'<path d="M8 10h8M8 14h5M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12Z"/>',
      grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
      user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
      megaphone:'<path d="M3 11v2a1 1 0 0 0 1 1h2l9 5V5L6 10H4a1 1 0 0 0-1 1Z"/><path d="M15 8a4 4 0 0 1 0 8"/>',
      sparkle:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/>',
      clapper:'<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
      calendar:'<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>',
      upload:'<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>',
      instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/>',
      tiktok:'<path d="M12 4v12.6a3 3 0 1 1-2.2-2.9"/><path d="M12 4c.4 2.6 2.3 4.2 4.6 4.4"/>',
      pinterest:'<circle cx="12" cy="12" r="9"/><path d="M11.2 16.4 12.4 11M10.6 11.2a2 2 0 1 1 3.2 1.7c-1 .8-2.4.5-2.8-.7"/>',
      idea:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2h5c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z"/>'
    };
    return `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p[name]||""}</svg>`;
  }
};

/* ============================================================
   STORE — persistência (Supabase) com fallback para MODO DEMO
   A API de leitura (Data.*) continua igual e síncrona; o Store
   carrega tudo para memória uma vez e grava as mudanças.
   ============================================================ */
function genId(){ return (crypto.randomUUID? crypto.randomUUID() : 'id-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)); }
function genToken(){ return Math.random().toString(36).slice(2,8); }
const PALETTE = ["art-1","art-2","art-3","art-4","art-5","art-6"];

function postFromDb(x){
  const o={ id:x.id, title:x.title, type:x.type, art:x.art||'art-1', embed:x.embed||'', cover:x.cover||'',
            caption:x.caption||'', note:x.note||'', status:x.status||'pendente', date:x.pub_date||'', pilar:x.pilar||'',
            briefing:x.briefing||'', roteiro:x.roteiro||'', refs:x.refs||'', palpite:x.palpite||'' };
  if(x.slides) o.slides=x.slides;
  if(x.request_text) o.request={ scope:x.request_scope||'', text:x.request_text };
  return o;
}
function postToDb(p, projectId){
  return { id:p.id, project_id:projectId, title:p.title||'', type:p.type, art:p.art||'art-1', cover:p.cover||'',
           embed:p.embed||'', caption:p.caption||'', note:p.note||'', status:p.status||'pendente',
           pub_date:p.date||null, slides:p.slides||0, pilar:p.pilar||'',
           briefing:p.briefing||'', roteiro:p.roteiro||'', refs:p.refs||'', palpite:p.palpite||'',
           request_scope:p.request?p.request.scope:'', request_text:p.request?p.request.text:'' };
}

const Store = {
  _loaded:false, _sb:null,
  configured(){ return !!(window.APP_CONFIG && APP_CONFIG.SUPABASE_URL && APP_CONFIG.SUPABASE_ANON_KEY); },
  get sb(){
    if(!this._sb && this.configured() && window.supabase){
      this._sb = window.supabase.createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_ANON_KEY);
    }
    return this._sb;
  },
  demo(){ return !this.configured(); },

  async load(){
    if(this._loaded) return;
    if(this.demo()){ this._loaded=true; return; }   // MODO DEMO: mantém o seed
    try{
      const sb=this.sb;
      const [cRes,pRes,xRes,tRes,eRes] = await Promise.all([
        sb.from('clients').select('*').order('created_at',{ascending:true}),
        sb.from('projects').select('*').order('sort',{ascending:true}),
        sb.from('posts').select('*').order('sort',{ascending:true}),
        sb.from('tasks').select('*').order('sort',{ascending:true}),
        sb.from('events').select('*').order('date',{ascending:true})
      ]);
      const clients=cRes.data||[], projects=pRes.data||[], posts=xRes.data||[], tasks=(tRes&&tRes.data)||[];
      DB.events = (eRes&&eRes.data)||[];
      DB.clients = clients.map(c=>({
        id:c.id, token:c.token, name:c.name, handle:c.handle||'', color:c.color||'art-1',
        archived:!!c.archived, message:c.message||'', avatar:c.avatar||'', dados:c.dados||{},
        extraction:c.extraction||{}, diagnostico:c.diagnostico||{}, matriz:c.matriz||[], finance:c.finance||{},
        tasks: tasks.filter(t=>t.client_id===c.id).map(t=>({ id:t.id, title:t.title||'', note:t.note||'', done:!!t.done, due:t.due||'', sort:t.sort||0 })),
        projects: projects.filter(p=>p.client_id===c.id).map(p=>({
          id:p.id, name:p.name, status:p.status||'breve', intro:p.intro||'', cover:p.cover||'',
          kind:p.kind||'conteudo', deadline:p.deadline||'',
          posts: posts.filter(x=>x.project_id===p.id).map(postFromDb)
        }))
      }));
    }catch(e){ console.error('Falha ao carregar do Supabase:',e); U.toast('Erro ao conectar no banco — confira as chaves'); }
    this._loaded=true;
  },

  /* ---- escrita (otimista: muda a memória e grava no banco) ---- */
  async addClient({name,handle,projName}){
    const id=genId(), token=genToken(), color=PALETTE[Math.floor(Math.random()*6)];
    const c={ id, token, name, handle:handle||'@cliente', color, archived:false, message:'', avatar:'', dados:{}, extraction:{}, diagnostico:{}, matriz:[], finance:{}, tasks:[], projects:[] };
    if(projName) c.projects.push({ id:genId(), name:projName, status:'breve', intro:'', posts:[] });
    DB.clients.unshift(c);
    if(this.sb){
      await this.sb.from('clients').insert({ id, token, name:c.name, handle:c.handle, color, archived:false, message:'' });
      if(projName) await this.sb.from('projects').insert({ id:c.projects[0].id, client_id:id, name:projName, status:'breve', intro:'', sort:0 });
    }
    await this.seedOnboarding(id);   // cria o checklist padrão
    return c;
  },

  /* ---- onboarding (checklist por cliente) ---- */
  async seedOnboarding(cid){
    const defs=(window.APP_CONFIG && APP_CONFIG.DEFAULT_ONBOARDING) || [];
    for(let i=0;i<defs.length;i++){ await this.addTask(cid, defs[i], i); }
  },
  async addTask(cid, title, sort){
    const c=Data.client(cid); if(!c) return; c.tasks=c.tasks||[];
    const t={ id:genId(), title:title||'Nova etapa', note:'', done:false, due:'', sort:(sort!=null?sort:c.tasks.length) };
    c.tasks.push(t);
    if(this.sb) await this.sb.from('tasks').insert({ id:t.id, client_id:cid, title:t.title, note:'', done:false, due:null, sort:t.sort });
    return t;
  },
  async toggleTask(cid,id){ const t=(Data.client(cid).tasks||[]).find(x=>x.id===id); if(!t) return; t.done=!t.done;
    if(this.sb) await this.sb.from('tasks').update({done:t.done}).eq('id',id); },
  async setTaskDue(cid,id,due){ const t=(Data.client(cid).tasks||[]).find(x=>x.id===id); if(!t) return; t.due=due;
    if(this.sb) await this.sb.from('tasks').update({due:due||null}).eq('id',id); },
  async renameTask(cid,id,title){ const t=(Data.client(cid).tasks||[]).find(x=>x.id===id); if(!t) return; t.title=title;
    if(this.sb) await this.sb.from('tasks').update({title}).eq('id',id); },
  async deleteTask(cid,id){ const c=Data.client(cid); const i=(c.tasks||[]).findIndex(x=>x.id===id); if(i>=0) c.tasks.splice(i,1);
    if(this.sb) await this.sb.from('tasks').delete().eq('id',id); },
  async setArchived(id,val){ Data.client(id).archived=val;
    if(this.sb) await this.sb.from('clients').update({archived:val}).eq('id',id); },
  async deleteClient(id){ const i=DB.clients.findIndex(c=>c.id===id); if(i>=0) DB.clients.splice(i,1);
    if(this.sb) await this.sb.from('clients').delete().eq('id',id); },
  async setClientMessage(id,msg){ Data.client(id).message=msg;
    if(this.sb) await this.sb.from('clients').update({message:msg}).eq('id',id); },
  async setAvatar(id,url){ Data.client(id).avatar=url;
    if(this.sb) await this.sb.from('clients').update({avatar:url}).eq('id',id); },
  async setDados(id,dados){ Data.client(id).dados=dados;
    if(this.sb) await this.sb.from('clients').update({dados}).eq('id',id); },
  async setExtraction(id, qid, val){
    const c=Data.client(id); c.extraction=c.extraction||{};
    const empty = val==null || val==='' || (Array.isArray(val)&&val.length===0);
    if(empty) delete c.extraction[qid]; else c.extraction[qid]=val;
    if(this.sb) await this.sb.from('clients').update({ extraction:c.extraction }).eq('id',id);
  },
  async setDiagnostico(id, key, val){
    const c=Data.client(id); c.diagnostico=c.diagnostico||{}; c.diagnostico[key]=val;
    if(this.sb) await this.sb.from('clients').update({ diagnostico:c.diagnostico }).eq('id',id);
  },
  /* monta as respostas da extração e chama a função de IA (/api/diagnostico) */
  async generateDiagnostico(id){
    const c=Data.client(id);
    const tpl=(window.APP_CONFIG && APP_CONFIG.DEFAULT_EXTRACTION)||[];
    let respostas='';
    tpl.forEach(b=>b.questions.forEach(q=>{
      const v=(c.extraction||{})[q.id];
      if(v && (Array.isArray(v)?v.length:String(v).trim())) respostas += `- ${q.q}\n  ${Array.isArray(v)?v.join(', '):v}\n`;
    }));
    if(!respostas.trim()) throw new Error('Preencha a Extração antes de gerar o diagnóstico.');
    const r = await fetch('/api/diagnostico', {
      method:'POST', headers:{'content-type':'application/json'},
      body: JSON.stringify({ clientName:c.name, respostas })
    });
    let data; try{ data=await r.json(); }catch(e){ throw new Error('Resposta inválida do servidor. A função /api está publicada no Vercel?'); }
    if(!r.ok) throw new Error(data.error||'Erro ao gerar o diagnóstico.');
    c.diagnostico = { essencia:data.essencia||'', presenca:data.presenca||'', publico:data.publico||'', campo:data.campo||'' };
    if(this.sb) await this.sb.from('clients').update({ diagnostico:c.diagnostico }).eq('id',id);
    return c.diagnostico;
  },

  async addProject(cid,{name,status,intro,cover,kind,deadline}){
    const p={ id:genId(), name, status:status||'breve', intro:intro||'', cover:cover||'art-1',
              kind:kind||'conteudo', deadline:deadline||'', posts:[] };
    Data.client(cid).projects.push(p);
    if(this.sb) await this.sb.from('projects').insert({ id:p.id, client_id:cid, name:p.name, status:p.status,
      intro:p.intro, cover:p.cover, kind:p.kind, deadline:p.deadline||null, sort:0 });
    return p;
  },
  async setProjectStatus(cid,pid,status){ Data.project(cid,pid).status=status;
    if(this.sb) await this.sb.from('projects').update({status}).eq('id',pid); },

  /* ---- matriz de conteúdo (grade semanal) ---- */
  async setMatriz(cid, arr){ Data.client(cid).matriz=arr;
    if(this.sb) await this.sb.from('clients').update({ matriz:arr }).eq('id',cid); },

  /* ---- financeiro (contrato + parcelas) ---- */
  async setFinance(cid, finance){ Data.client(cid).finance=finance;
    if(this.sb) await this.sb.from('clients').update({ finance }).eq('id',cid); },

  /* ---- agenda (eventos) ---- */
  async addEvent(e){
    const ev={ id:genId(), client_id:e.client_id||null, title:e.title||'Evento', date:e.date||'', time:e.time||'', type:e.type||'reuniao', note:e.note||'' };
    DB.events=DB.events||[]; DB.events.push(ev);
    if(this.sb) await this.sb.from('events').insert(ev);
    return ev;
  },
  async updateEvent(id, patch){ const ev=(DB.events||[]).find(x=>x.id===id); if(!ev) return; Object.assign(ev,patch);
    if(this.sb) await this.sb.from('events').update(patch).eq('id',id); },
  async deleteEvent(id){ const i=(DB.events||[]).findIndex(x=>x.id===id); if(i>=0) DB.events.splice(i,1);
    if(this.sb) await this.sb.from('events').delete().eq('id',id); },

  /* gera um projeto de planejamento com as pautas do mês, a partir da matriz */
  async generateMonth(cid, year, month){   // month: 0-11
    const c=Data.client(cid);
    const slots=(c.matriz||[]);
    if(!slots.length) throw new Error('Monte a matriz do cliente primeiro.');
    const nome=`Conteúdos de ${MONTHS_FULL[month].charAt(0).toUpperCase()+MONTHS_FULL[month].slice(1)} ${year}`;
    const proj = await this.addProject(cid, { name:nome, status:'andamento', kind:'planejamento', intro:'Planejamento gerado pela matriz. Cada pauta já vem com formato e pilar; falta o roteiro.' });
    const days = new Date(year, month+1, 0).getDate();
    let count=0;
    for(let d=1; d<=days; d++){
      const wd=new Date(year, month, d).getDay();
      const daySlots=slots.filter(s=>Number(s.weekday)===wd);
      for(const s of daySlots){
        const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const t=TYPE[s.format]||TYPE['reel-9-16'];
        const title=`${t.label}${s.pilar?' · '+s.pilar:''}`;
        await this.savePost(cid, proj.id, { title, type:s.format, date:dateStr, pilar:s.pilar||'',
          status:'pendente', caption:'', note:'', embed:'', cover:'', briefing:'', roteiro:'', refs:'' }, null);
        count++;
      }
    }
    return { project:proj, count };
  },
  async setProjectName(cid,pid,name){ Data.project(cid,pid).name=name;
    if(this.sb) await this.sb.from('projects').update({name}).eq('id',pid); },
  async setProjectIntro(cid,pid,intro){ Data.project(cid,pid).intro=intro;
    if(this.sb) await this.sb.from('projects').update({intro}).eq('id',pid); },
  async setProjectDeadline(cid,pid,deadline){ Data.project(cid,pid).deadline=deadline;
    if(this.sb) await this.sb.from('projects').update({deadline:deadline||null}).eq('id',pid); },
  async setPalpite(cid,pid,postId,text){ Data.post(cid,pid,postId).palpite=text;
    if(this.sb) await this.sb.from('posts').update({palpite:text}).eq('id',postId); },
  /* auto-aprovação: ao vencer o prazo, itens 'pendente' viram 'aprovado' */
  async applyDeadline(project){
    if(!project || !project.deadline) return false;
    const end=new Date(project.deadline+'T23:59:59');
    if(new Date() <= end) return false;
    let changed=false;
    for(const p of project.posts){ if(p.status==='pendente'){ p.status='aprovado'; changed=true;
      if(this.sb) await this.sb.from('posts').update({status:'aprovado'}).eq('id',p.id); } }
    return changed;
  },
  async setProjectCover(cid,pid,cover){ Data.project(cid,pid).cover=cover;
    if(this.sb) await this.sb.from('projects').update({cover}).eq('id',pid); },

  /* upload de vídeo -> Supabase Storage (bucket 'videos') -> retorna URL pública */
  async uploadVideo(file){
    if(!this.sb){ U.toast('Configure o Supabase para enviar vídeos'); return null; }
    if(file.size > 50*1024*1024){ U.toast('Vídeo acima de 50MB — comprima ou aumente o limite no Supabase'); return null; }
    const ext=(file.name.split('.').pop()||'mp4').toLowerCase().replace(/[^a-z0-9]/g,'')||'mp4';
    const path='video-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)+'.'+ext;
    const up=await this.sb.storage.from('videos').upload(path, file, { upsert:true, contentType:file.type||'video/mp4' });
    if(up.error){ console.error(up.error); U.toast('Erro ao enviar — confira o bucket "videos"'); return null; }
    const { data } = this.sb.storage.from('videos').getPublicUrl(path);
    return data.publicUrl;
  },

  /* upload de imagem de capa -> Supabase Storage (bucket 'capas') -> retorna URL pública */
  async uploadCover(file){
    if(!this.sb){ U.toast('Configure o Supabase para enviar imagens'); return null; }
    if(file.size > 8*1024*1024){ U.toast('Imagem muito grande (máx. 8MB)'); return null; }
    const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
    const path='capa-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)+'.'+ext;
    const up=await this.sb.storage.from('capas').upload(path, file, { upsert:true, contentType:file.type||'image/jpeg' });
    if(up.error){ console.error(up.error); U.toast('Erro ao enviar — confira o bucket "capas"'); return null; }
    const { data } = this.sb.storage.from('capas').getPublicUrl(path);
    return data.publicUrl;
  },

  async savePost(cid,pid,data,editingId){
    const proj=Data.project(cid,pid);
    if(editingId){ Object.assign(Data.post(cid,pid,editingId),data); }
    else { data.id=genId(); data.art=data.art||PALETTE[Math.floor(Math.random()*6)]; proj.posts.push(data); editingId=data.id; }
    const post=Data.post(cid,pid,editingId);
    if(this.sb) await this.sb.from('posts').upsert(postToDb(post,pid));
    return editingId;
  },
  async deletePost(cid,pid,postId){ const proj=Data.project(cid,pid);
    const i=proj.posts.findIndex(p=>p.id===postId); if(i>=0) proj.posts.splice(i,1);
    if(this.sb) await this.sb.from('posts').delete().eq('id',postId); },
  async setPostStatus(cid,pid,postId,status){ const post=Data.post(cid,pid,postId);
    post.status=status; if(status==='aprovado') post.request=undefined;
    if(this.sb) await this.sb.from('posts').update({ status, request_scope:post.request?post.request.scope:'', request_text:post.request?post.request.text:'' }).eq('id',postId); },
  async setPostRequest(cid,pid,postId,req){ const post=Data.post(cid,pid,postId);
    post.request=req; post.status='ajustes';
    if(this.sb) await this.sb.from('posts').update({ status:'ajustes', request_scope:req.scope, request_text:req.text }).eq('id',postId); }
};

/* ============================================================
   AUTH — senha única do painel do gestor (sessão do navegador)
   ============================================================ */
const Auth = {
  ok(){ return sessionStorage.getItem('selo_mgr')==='1'; },
  pass(){ return (window.APP_CONFIG && APP_CONFIG.MANAGER_PASSWORD) || ''; },
  gate(){
    return new Promise(resolve=>{
      if(!this.pass() || this.ok()) return resolve(true);
      const ov=document.createElement('div');
      ov.className='authgate';
      ov.innerHTML=`<div class="authcard">
        <div class="brand" style="justify-content:center;margin-bottom:18px"><span class="dot"></span> ${MANAGER.studio}</div>
        <div class="eyebrow" style="justify-content:center">Painel do gestor</div>
        <h2 class="display" style="text-align:center;font-size:26px;margin-bottom:18px">Acesso restrito</h2>
        <input class="input" id="authpw" type="password" placeholder="Senha do gestor" autofocus>
        <button class="btn btn-primary btn-block" id="authgo" style="margin-top:12px">Entrar</button>
        <p class="hint" style="text-align:center;margin-top:12px">Apenas você acessa esta área. Os clientes usam o link próprio.</p>
      </div>`;
      document.body.appendChild(ov);
      paintBrand();
      const input=ov.querySelector('#authpw'), go=ov.querySelector('#authgo');
      const tryPw=()=>{ if(input.value===this.pass()){ sessionStorage.setItem('selo_mgr','1'); ov.remove(); resolve(true); }
        else { ov.querySelector('.authcard').classList.add('shake'); setTimeout(()=>ov.querySelector('.authcard').classList.remove('shake'),420); input.select(); } };
      go.onclick=tryPw;
      input.onkeydown=e=>{ if(e.key==='Enter') tryPw(); };
      setTimeout(()=>input.focus(),50);
    });
  },
  logout(){ sessionStorage.removeItem('selo_mgr'); location.href='../index.html'; }
};

/* referências de planejamento: detecta plataforma e lista links */
U.platform = function(url){
  const u=(url||'').toLowerCase();
  if(/instagram\.com/.test(u)) return 'instagram';
  if(/tiktok\.com/.test(u))    return 'tiktok';
  if(/pinterest\.|pin\.it/.test(u)) return 'pinterest';
  if(/youtu/.test(u))          return 'film';
  return 'link';
};
U.platformLabel = function(p){ return {instagram:'Instagram',tiktok:'TikTok',pinterest:'Pinterest',film:'YouTube',link:'Link'}[p]||'Link'; };
U.refList = function(text){
  return (text||'').split('\n').map(s=>s.trim()).filter(Boolean).map(url=>{
    let host=url; try{ host=new URL(url).hostname.replace(/^www\./,''); }catch(e){}
    const plat=U.platform(url);
    return { url, plat, host, label:U.platformLabel(plat) };
  });
};
/* moeda BRL */
U.brl = function(n){ n=Number(n)||0; return n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); };

/* avatar do cliente: foto (se houver) ou iniciais */
U.avatarHtml = function(c, cls){
  cls = cls||'';
  if(c && c.avatar) return `<div class="avatar ${cls}" style="background-image:url('${c.avatar.replace(/'/g,'%27')}');background-size:cover;background-position:center"></div>`;
  return `<div class="avatar ${cls} ${(c&&c.color)||''}">${c?U.initials(c.name):''}</div>`;
};

/* link "adicionar ao Google Calendar" a partir de um evento */
U.gcalUrl = function(ev){
  const d=(ev.date||'').replace(/-/g,''); if(!d) return '#';
  const p=new URLSearchParams({ action:'TEMPLATE', text:ev.title||'Evento', details:ev.note||'' });
  if(ev.time){
    let [hh,mm]=ev.time.split(':').map(Number); mm=mm||0;
    const start=`${d}T${String(hh).padStart(2,'0')}${String(mm).padStart(2,'0')}00`;
    let eh=(hh+1)%24; const end=`${d}T${String(eh).padStart(2,'0')}${String(mm).padStart(2,'0')}00`;
    p.set('dates', start+'/'+end);
  } else {
    p.set('dates', d+'/'+d);   // dia inteiro
  }
  return 'https://calendar.google.com/calendar/render?'+p.toString();
};
U.hora = function(t){ return t? t : ''; };

/* dias restantes até uma data (YYYY-MM-DD) */
U.daysLeft = function(iso){ if(!iso) return null;
  const end=new Date(iso+'T23:59:59'), now=new Date();
  return Math.ceil((end-now)/(1000*60*60*24));
};

/* detecta arquivo de vídeo direto (player nativo) vs link de embed (iframe) */
U.isVideoFile = function(url){ return /\.(mp4|mov|webm|m4v|ogg)(\?|#|$)/i.test(url||''); };

/* normaliza link do Google Drive para o formato embutível (/preview) */
U.embedUrl = function(url){
  if(!url) return url;
  // Google Drive
  let m = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if(m) return 'https://drive.google.com/file/d/'+m[1]+'/preview';
  // Pasta do Drive (carrossel) -> grade incorporável
  let fo = url.match(/drive\.google\.com\/drive\/folders\/([^/?#]+)/);
  if(fo) return 'https://drive.google.com/embeddedfolderview?id='+fo[1]+'#grid';
  m = url.match(/drive\.google\.com\/open\?id=([^&]+)/) || url.match(/[?&]id=([^&]+)/);
  if(m && /drive\.google/.test(url)) return 'https://drive.google.com/file/d/'+m[1]+'/preview';
  // YouTube (watch, shorts, youtu.be) -> player incorporável e limpo
  const y = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if(y) return 'https://www.youtube.com/embed/'+y[1]+'?rel=0&modestbranding=1&playsinline=1';
  // Vimeo
  const v = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if(v) return 'https://player.vimeo.com/video/'+v[1];
  return url;  // outro embed: usa como está
};

/* capa de projeto: art-X (preset) ou URL de imagem */
U.coverAttrs = function(cover){
  cover = cover || 'art-1';
  if(/^https?:/i.test(cover)) return { cls:'cover grad', style:"background-image:url('"+cover.replace(/'/g,'%27')+"')" };
  return { cls:'cover grad '+cover, style:'' };
};

/* boot helper: (gestor) pede senha -> carrega dados -> renderiza */
U.boot = async function(fn, opts){
  opts=opts||{};
  if(opts.manager) await Auth.gate();
  await Store.load();
  fn();
};

/* logo (selo de verificado) — preenche todas as paginas automaticamente */
const VERIFIED_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true">'
  + '<g fill="#fff"><rect x="5" y="5" width="14" height="14" rx="4.5"/>'
  + '<rect x="5" y="5" width="14" height="14" rx="4.5" transform="rotate(45 12 12)"/></g>'
  + '<path d="M8.5 12.2l2.3 2.3 4.6-4.8" fill="none" stroke="#0a0a0c" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>'
  + '</svg>';
function paintBrand(){
  document.querySelectorAll(".brand .dot").forEach(el=>{
    if(!el.dataset.brand){ el.innerHTML = VERIFIED_SVG; el.dataset.brand="1"; }
  });
}
if(document.readyState!=="loading") paintBrand();
else document.addEventListener("DOMContentLoaded", paintBrand);

/* expor globais */
window.DB=DB; window.Data=Data; window.U=U; window.Store=Store; window.Auth=Auth;
window.STATUS=STATUS; window.TYPE=TYPE; window.MANAGER=MANAGER;
window.WEEKDAYS=WEEKDAYS; window.MONTHS_FULL=MONTHS_FULL;
