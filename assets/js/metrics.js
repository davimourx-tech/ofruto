/* ============================================================
   oFruto — Painel de Análise de Conteúdo (Instagram via Windsor)
   Dashboard compartilhado entre gestor e cliente.
   Uso:  Metrics.mount(containerEl, { account, period, followers, posts:[...] })
   ============================================================ */
(function(){
  function compact(n){ n=Number(n)||0;
    if(Math.abs(n)>=1e6) return (n/1e6).toLocaleString('pt-BR',{maximumFractionDigits:1})+' mi';
    if(Math.abs(n)>=1e3) return (n/1e3).toLocaleString('pt-BR',{maximumFractionDigits:1})+' mil';
    return n.toLocaleString('pt-BR'); }
  function pct(n){ n=Number(n)||0; return n.toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+'%'; }
  function esc(s){ return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function snippet(s,n){ s=String(s||'').replace(/\s+/g,' ').trim(); return s.length>n? esc(s.slice(0,n))+'…' : esc(s); }

  const CATS = [
    { key:'todos',     label:'Visão global', match:()=>true },
    { key:'reels',     label:'Reels',        match:p=>p.type==='REELS'||p.type==='VIDEO' },
    { key:'carrossel', label:'Carrosséis',   match:p=>p.type==='CAROUSEL_ALBUM' },
    { key:'estatico',  label:'Estáticos',    match:p=>p.type==='IMAGE' }
  ];
  const SORTS = [
    { key:'eng_rate', label:'Engajamento' },
    { key:'reach',    label:'Alcance' },
    { key:'likes',    label:'Curtidas' },
    { key:'saved',    label:'Salvamentos' },
    { key:'shares',   label:'Compart.' },
    { key:'date',     label:'Recentes' }
  ];
  function typeLabel(p){
    if(p.type==='REELS') return 'Reel';
    if(p.type==='CAROUSEL_ALBUM') return 'Carrossel';
    if(p.type==='IMAGE') return 'Estático';
    if(p.type==='VIDEO') return 'Vídeo';
    return p.type||'Post';
  }
  function typeIcon(p){
    if(p.type==='CAROUSEL_ALBUM') return 'layers';
    if(p.type==='IMAGE') return 'image';
    return 'film';
  }

  const Metrics = {
    el:null, data:null, fmt:'todos', sort:'eng_rate',
    mount(el, data){ this.el=el; this.data=data||{posts:[]};
      // garante eng_rate mesmo em snapshots antigos
      (this.data.posts||[]).forEach(p=>{ if(p.eng_rate==null) p.eng_rate = p.reach? +((p.engagement/p.reach)*100).toFixed(2) : 0; });
      this.fmt='todos'; this.sort='eng_rate'; this.render(); },
    setFmt(f){ this.fmt=f; this.render(); },
    setSort(s){ this.sort=s; this.render(); },
    posts(){ return (this.data&&this.data.posts)||[]; },
    filtered(){ const c=CATS.find(x=>x.key===this.fmt)||CATS[0]; return this.posts().filter(c.match); },
    totals(list){
      const t={ n:list.length, reach:0, eng:0, likes:0, saved:0, shares:0, views:0, comments:0 };
      list.forEach(p=>{ t.reach+=p.reach||0; t.eng+=p.engagement||0; t.likes+=p.likes||0;
        t.saved+=p.saved||0; t.shares+=p.shares||0; t.views+=p.views||0; t.comments+=p.comments||0; });
      t.rate = t.reach? (t.eng/t.reach*100) : 0;
      return t;
    },
    sorted(list){
      const s=this.sort; const arr=list.slice();
      if(s==='date') arr.sort((a,b)=>(b.date||'').localeCompare(a.date||''));
      else arr.sort((a,b)=>(b[s]||0)-(a[s]||0));
      return arr;
    },
    kpi(label,val,sub){ return `<div class="mkpi"><span class="meta-sm">${label}</span>
      <strong class="mkpi-n">${val}</strong>${sub?`<span class="meta-sm">${sub}</span>`:''}</div>`; },
    postCard(p,i){
      const thumb = p.thumb
        ? `<div class="mpost-thumb" style="background-image:url('${esc(p.thumb).replace(/'/g,'%27')}')"></div>`
        : `<div class="mpost-thumb noimg">${U.icon(typeIcon(p))}</div>`;
      const link = p.permalink? `<a class="btn btn-sm card nowrap" href="${esc(p.permalink)}" target="_blank" rel="noopener">${U.icon('instagram')} Ver no Instagram</a>`:'';
      return `<div class="mpost">
        <div class="mpost-rank">${i+1}</div>
        ${thumb}
        <div class="mpost-body">
          <div class="row wrap" style="gap:8px;align-items:center;margin-bottom:6px">
            <span class="badge">${U.icon(typeIcon(p))} ${typeLabel(p)}</span>
            <span class="badge"><b style="color:var(--text)">${pct(p.eng_rate)}</b>&nbsp;engaj.</span>
            ${p.date?`<span class="meta-sm">${U.fmtDate(p.date)}</span>`:''}
          </div>
          <p class="mpost-cap">${snippet(p.caption,140)||'<span class="dim">Sem legenda.</span>'}</p>
          <div class="mpost-stats">
            <span title="Curtidas">${U.icon('star')} ${compact(p.likes)}</span>
            <span title="Alcance">${U.icon('eye')} ${compact(p.reach)}</span>
            <span title="Salvamentos">${U.icon('check')} ${compact(p.saved)}</span>
            <span title="Compartilhamentos">${U.icon('send')} ${compact(p.shares)}</span>
            <span title="Comentários">${U.icon('chat')} ${compact(p.comments)}</span>
          </div>
          <div style="margin-top:10px">${link}</div>
        </div>
      </div>`;
    },
    render(){
      if(!this.el) return;
      const list=this.filtered(), t=this.totals(list), sorted=this.sorted(list);
      const tabs=CATS.map(c=>{ const n=this.posts().filter(c.match).length;
        return `<button class="chip ${this.fmt===c.key?'on':''}" onclick="Metrics.setFmt('${c.key}')">${c.label}<span class="chip-n">${n}</span></button>`;
      }).join('');
      const sorts=SORTS.map(s=>`<option value="${s.key}" ${this.sort===s.key?'selected':''}>${s.label}</option>`).join('');
      const followers = (this.data&&this.data.followers!=null)? this.kpi('Seguidores', compact(this.data.followers)) : '';
      this.el.innerHTML=`
        <div class="mkpis">
          ${this.kpi('Posts', t.n)}
          ${this.kpi('Alcance', compact(t.reach))}
          ${this.kpi('Engaj. médio', pct(t.rate))}
          ${this.kpi('Curtidas', compact(t.likes))}
          ${this.kpi('Salvamentos', compact(t.saved))}
          ${this.kpi('Compartilh.', compact(t.shares))}
          ${followers}
        </div>
        <div class="row between wrap" style="gap:12px;margin:20px 0 14px">
          <div class="chips">${tabs}</div>
          <label class="row meta-sm" style="gap:8px;align-items:center">Ordenar por
            <select class="input select-bare" style="width:auto" onchange="Metrics.setSort(this.value)">${sorts}</select></label>
        </div>
        <div class="col" style="gap:12px">
          ${sorted.length? sorted.map((p,i)=>this.postCard(p,i)).join('') : '<div class="empty card pad">Nenhum post neste formato no período.</div>'}
        </div>`;
    },
    /* versão RESUMO (cliente): KPIs + destaques, sem abas/ordenação */
    mountSummary(el, data, topN){
      if(!el) return; topN=topN||6;
      const posts=((data&&data.posts)||[]).slice();
      posts.forEach(p=>{ if(p.eng_rate==null) p.eng_rate=p.reach?+((p.engagement/p.reach)*100).toFixed(2):0; });
      const t=this.totals(posts);
      const top=posts.slice().sort((a,b)=>(b.eng_rate||0)-(a.eng_rate||0)).slice(0,topN);
      const followers=(data&&data.followers!=null)?this.kpi('Seguidores',compact(data.followers)):'';
      el.innerHTML=`
        <div class="mkpis">
          ${this.kpi('Posts',t.n)}
          ${this.kpi('Alcance',compact(t.reach))}
          ${this.kpi('Engaj. médio',pct(t.rate))}
          ${this.kpi('Curtidas',compact(t.likes))}
          ${this.kpi('Salvamentos',compact(t.saved))}
          ${this.kpi('Compartilh.',compact(t.shares))}
          ${followers}
        </div>
        <div class="eyebrow" style="margin:24px 0 12px">Destaques do período</div>
        <div class="col" style="gap:12px">
          ${top.length? top.map((p,i)=>this.postCard(p,i)).join('') : '<div class="empty card pad">Sem posts no período.</div>'}
        </div>`;
    },
    /* texto da IA (**negrito** + parágrafos) -> HTML */
    resumoHtml(text){
      const esc=s=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
      return esc(text)
        .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
        .split(/\n{2,}/).map(p=>`<p style="margin:0 0 12px">${p.replace(/\n/g,'<br>')}</p>`).join('');
    }
  };
  window.Metrics = Metrics;
})();
