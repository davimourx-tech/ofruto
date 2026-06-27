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
  { name: "Davi Moura", studio: "Selo Co.", whatsapp: "5599999999999" },
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
  "carrossel": { label: "Carrossel",   ratio: "ratio-4-5",  icon: "layers" }
};

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
      calendar:'<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>'
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
  const o={ id:x.id, title:x.title, type:x.type, art:x.art||'art-1', embed:x.embed||'',
            caption:x.caption||'', note:x.note||'', status:x.status||'pendente', date:x.pub_date||'' };
  if(x.slides) o.slides=x.slides;
  if(x.request_text) o.request={ scope:x.request_scope||'', text:x.request_text };
  return o;
}
function postToDb(p, projectId){
  return { id:p.id, project_id:projectId, title:p.title||'', type:p.type, art:p.art||'art-1',
           embed:p.embed||'', caption:p.caption||'', note:p.note||'', status:p.status||'pendente',
           pub_date:p.date||null, slides:p.slides||0,
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
      const [cRes,pRes,xRes] = await Promise.all([
        sb.from('clients').select('*').order('created_at',{ascending:true}),
        sb.from('projects').select('*').order('sort',{ascending:true}),
        sb.from('posts').select('*').order('sort',{ascending:true})
      ]);
      const clients=cRes.data||[], projects=pRes.data||[], posts=xRes.data||[];
      DB.clients = clients.map(c=>({
        id:c.id, token:c.token, name:c.name, handle:c.handle||'', color:c.color||'art-1',
        archived:!!c.archived, message:c.message||'',
        projects: projects.filter(p=>p.client_id===c.id).map(p=>({
          id:p.id, name:p.name, status:p.status||'breve', intro:p.intro||'',
          posts: posts.filter(x=>x.project_id===p.id).map(postFromDb)
        }))
      }));
    }catch(e){ console.error('Falha ao carregar do Supabase:',e); U.toast('Erro ao conectar no banco — confira as chaves'); }
    this._loaded=true;
  },

  /* ---- escrita (otimista: muda a memória e grava no banco) ---- */
  async addClient({name,handle,projName}){
    const id=genId(), token=genToken(), color=PALETTE[Math.floor(Math.random()*6)];
    const c={ id, token, name, handle:handle||'@cliente', color, archived:false, message:'', projects:[] };
    if(projName) c.projects.push({ id:genId(), name:projName, status:'breve', intro:'', posts:[] });
    DB.clients.unshift(c);
    if(this.sb){
      await this.sb.from('clients').insert({ id, token, name:c.name, handle:c.handle, color, archived:false, message:'' });
      if(projName) await this.sb.from('projects').insert({ id:c.projects[0].id, client_id:id, name:projName, status:'breve', intro:'', sort:0 });
    }
    return c;
  },
  async setArchived(id,val){ Data.client(id).archived=val;
    if(this.sb) await this.sb.from('clients').update({archived:val}).eq('id',id); },
  async deleteClient(id){ const i=DB.clients.findIndex(c=>c.id===id); if(i>=0) DB.clients.splice(i,1);
    if(this.sb) await this.sb.from('clients').delete().eq('id',id); },
  async setClientMessage(id,msg){ Data.client(id).message=msg;
    if(this.sb) await this.sb.from('clients').update({message:msg}).eq('id',id); },

  async addProject(cid,{name,status,intro}){
    const p={ id:genId(), name, status:status||'breve', intro:intro||'', posts:[] };
    Data.client(cid).projects.push(p);
    if(this.sb) await this.sb.from('projects').insert({ id:p.id, client_id:cid, name:p.name, status:p.status, intro:p.intro, sort:0 });
    return p;
  },
  async setProjectStatus(cid,pid,status){ Data.project(cid,pid).status=status;
    if(this.sb) await this.sb.from('projects').update({status}).eq('id',pid); },

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
