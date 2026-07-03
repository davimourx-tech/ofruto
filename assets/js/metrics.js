/* ============================================================
   oFruto — Painel de Análise de Conteúdo (Instagram via Windsor)
   Dashboard compartilhado entre gestor e cliente.
   data = { account, label, kpis?:{reach,interactions,saved,shares,views}, followers?, posts:[...] }
   KPIs usam os totais REAIS da conta (kpis) quando disponíveis.
   Posts sem insight ainda sincronizado aparecem mesmo assim (com curtidas).
   ============================================================ */
(function(){
  function compact(n){ n=Number(n)||0;
    if(Math.abs(n)>=1e6) return (n/1e6).toLocaleString('pt-BR',{maximumFractionDigits:1})+' mi';
    if(Math.abs(n)>=1e3) return (n/1e3).toLocaleString('pt-BR',{maximumFractionDigits:1})+' mil';
    return n.toLocaleString('pt-BR'); }
  function pct(n){ n=Number(n)||0; return n.toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+'%'; }
  function esc(s){ return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function snippet(s,n){ s=String(s||'').replace(/\s+/g,' ').trim(); return s.length>n? esc(s.slice(0,n))+'…' : esc(s); }
  const MMM=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  function mesAbbr(k){ const [y,m]=k.split('-'); return MMM[+m-1]+'/'+String(y).slice(2); }
  const AXIS='rgba(255,255,255,.55)', GRID='rgba(255,255,255,.08)';

  const CATS = [
    { key:'todos',     label:'Visão global', match:()=>true },
    { key:'reels',     label:'Reels',        match:p=>p.type==='REELS'||p.type==='VIDEO' },
    { key:'carrossel', label:'Carrosséis',   match:p=>p.type==='CAROUSEL_ALBUM' },
    { key:'estatico',  label:'Estáticos',    match:p=>p.type==='IMAGE' }
  ];
  const SORTS = [
    { key:'eng_rate', label:'Engajamento' },
    { key:'likes',    label:'Curtidas' },
    { key:'reach',    label:'Alcance' },
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
    _normalize(){ (this.posts()).forEach(p=>{ if(p.eng_rate==null && p.reach) p.eng_rate=+((p.engagement||0)/p.reach*100).toFixed(2); }); },
    mount(el, data){ this.el=el; this.data=data||{posts:[]}; this.fmt='todos'; this.sort='eng_rate'; this._normalize(); this.render(); },
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
    /* KPIs do período: usa os totais REAIS da conta quando vierem (kpis); curtidas somadas dos posts */
    kpiData(){
      const posts=this.posts();
      const likes=posts.reduce((a,p)=>a+(p.likes||0),0);
      const k=(this.data&&this.data.kpis)||null;
      if(k) return { n:posts.length, reach:k.reach||0, rate:(k.reach?(k.interactions||0)/k.reach*100:0),
        likes, saved:k.saved||0, shares:k.shares||0, views:k.views||0, gained:(k.followers_gained!=null?k.followers_gained:null) };
      const t=this.totals(posts);
      return { n:t.n, reach:t.reach, rate:t.rate, likes:t.likes, saved:t.saved, shares:t.shares, views:t.views, gained:null };
    },
    sorted(list){
      const s=this.sort; const arr=list.slice();
      if(s==='date') arr.sort((a,b)=>(b.date||'').localeCompare(a.date||''));
      else arr.sort((a,b)=>{ const va=(a[s]==null?-1:a[s]), vb=(b[s]==null?-1:b[s]);
        return (vb-va) || ((b.likes||0)-(a.likes||0)); });
      return arr;
    },
    /* agregações pros gráficos */
    byMonth(){ const m={}; this.posts().forEach(p=>{ const key=(p.date||'').slice(0,7); if(!key) return;
      (m[key]=m[key]||{posts:0,engSum:0,engN:0});
      m[key].posts++; if(p.eng_rate!=null){ m[key].engSum+=p.eng_rate; m[key].engN++; } });
      return Object.keys(m).sort().map(k=>({ month:k, posts:m[k].posts, engAvg:m[k].engN? +(m[k].engSum/m[k].engN).toFixed(1) : null })); },
    byFormat(){ const P=this.posts(); return [
      { label:'Reels', posts:P.filter(p=>p.type==='REELS'||p.type==='VIDEO').length },
      { label:'Carrosséis', posts:P.filter(p=>p.type==='CAROUSEL_ALBUM').length },
      { label:'Estáticos', posts:P.filter(p=>p.type==='IMAGE').length }
    ]; },
    chartsHtml(){ if(!this.posts().length || !window.Chart) return '';
      return `<div class="grid c2" style="gap:14px;margin-bottom:18px">
        <div class="card pad"><div class="eyebrow" style="margin-bottom:10px">Publicações e engajamento por mês</div>
          <div style="height:230px"><canvas id="mchart-month"></canvas></div></div>
        <div class="card pad"><div class="eyebrow" style="margin-bottom:10px">Publicações por formato</div>
          <div style="height:230px"><canvas id="mchart-format"></canvas></div></div>
      </div>`; },
    drawCharts(){
      if(!window.Chart) return;
      (this._charts||[]).forEach(c=>{ try{ c.destroy(); }catch(e){} }); this._charts=[];
      const months=this.byMonth(), mEl=document.getElementById('mchart-month');
      if(mEl && months.length){
        this._charts.push(new Chart(mEl,{
          data:{ labels:months.map(m=>mesAbbr(m.month)), datasets:[
            { type:'bar', label:'Posts', data:months.map(m=>m.posts), backgroundColor:'rgba(255,255,255,.22)', borderRadius:6, yAxisID:'y' },
            { type:'line', label:'Engaj. médio (%)', data:months.map(m=>m.engAvg), borderColor:'#fff', backgroundColor:'#fff', tension:.3, spanGaps:true, pointRadius:3, yAxisID:'y1' }
          ]},
          options:{ responsive:true, maintainAspectRatio:false, interaction:{intersect:false,mode:'index'},
            plugins:{ legend:{ labels:{ color:AXIS, boxWidth:12 } } },
            scales:{
              x:{ ticks:{color:AXIS}, grid:{color:GRID} },
              y:{ position:'left', beginAtZero:true, ticks:{color:AXIS,precision:0}, grid:{color:GRID}, title:{display:true,text:'Posts',color:AXIS} },
              y1:{ position:'right', beginAtZero:true, ticks:{color:AXIS,callback:v=>v+'%'}, grid:{drawOnChartArea:false}, title:{display:true,text:'Engaj.',color:AXIS} }
            } }
        }));
      }
      const fmts=this.byFormat(), fEl=document.getElementById('mchart-format');
      if(fEl && fmts.some(f=>f.posts)){
        this._charts.push(new Chart(fEl,{ type:'doughnut',
          data:{ labels:fmts.map(f=>f.label), datasets:[{ data:fmts.map(f=>f.posts),
            backgroundColor:['rgba(255,255,255,.85)','rgba(255,255,255,.5)','rgba(255,255,255,.26)'], borderColor:'rgba(0,0,0,.35)', borderWidth:2 }] },
          options:{ responsive:true, maintainAspectRatio:false, cutout:'58%',
            plugins:{ legend:{ position:'bottom', labels:{ color:AXIS, boxWidth:12 } } } }
        }));
      }
    },
    kpi(label,val,sub){ return `<div class="mkpi"><span class="meta-sm">${label}</span>
      <strong class="mkpi-n">${val}</strong>${sub?`<span class="meta-sm">${sub}</span>`:''}</div>`; },
    kpisHtml(){
      const t=this.kpiData();
      const followers=(this.data&&this.data.followers!=null)? this.kpi('Seguidores', compact(this.data.followers)) : '';
      return `<div class="mkpis">
        ${this.kpi('Posts', t.n)}
        ${this.kpi('Alcance', compact(t.reach))}
        ${this.kpi('Engaj. médio', pct(t.rate))}
        ${this.kpi('Curtidas', compact(t.likes))}
        ${this.kpi('Salvamentos', compact(t.saved))}
        ${this.kpi('Compartilh.', compact(t.shares))}
        ${t.gained!=null?this.kpi('Novos seguidores', compact(t.gained)):''}
        ${followers}
      </div>`;
    },
    postCard(p,i){
      const thumb = p.thumb
        ? `<div class="mpost-thumb" style="background-image:url('${esc(p.thumb).replace(/'/g,'%27')}')"></div>`
        : `<div class="mpost-thumb noimg">${U.icon(typeIcon(p))}</div>`;
      const link = p.permalink? `<a class="btn btn-sm card nowrap" href="${esc(p.permalink)}" target="_blank" rel="noopener">${U.icon('instagram')} Ver no Instagram</a>`:'';
      const engBadge = (p.eng_rate!=null)
        ? `<span class="badge"><b style="color:var(--text)">${pct(p.eng_rate)}</b>&nbsp;engaj.</span>`
        : `<span class="badge" title="Alcance ainda sincronizando no Windsor" style="opacity:.7">${U.icon('clock')} alcance em breve</span>`;
      const stat = (ic,v,t)=> v!=null ? `<span title="${t}">${U.icon(ic)} ${compact(v)}</span>` : '';
      return `<div class="mpost">
        <div class="mpost-rank">${i+1}</div>
        ${thumb}
        <div class="mpost-body">
          <div class="row wrap" style="gap:8px;align-items:center;margin-bottom:6px">
            <span class="badge">${U.icon(typeIcon(p))} ${typeLabel(p)}</span>
            ${engBadge}
            ${p.date?`<span class="meta-sm">${U.fmtDate(p.date)}</span>`:''}
          </div>
          <p class="mpost-cap">${snippet(p.caption,140)||'<span class="dim">Sem legenda.</span>'}</p>
          <div class="mpost-stats">
            ${stat('star',p.likes,'Curtidas')}
            ${stat('eye',p.reach,'Alcance')}
            ${stat('check',p.saved,'Salvamentos')}
            ${stat('send',p.shares,'Compartilhamentos')}
            ${stat('chat',p.comments,'Comentários')}
          </div>
          <div style="margin-top:10px">${link}</div>
        </div>
      </div>`;
    },
    render(){
      if(!this.el) return;
      const list=this.filtered(), sorted=this.sorted(list);
      const tabs=CATS.map(c=>{ const n=this.posts().filter(c.match).length;
        return `<button class="chip ${this.fmt===c.key?'on':''}" onclick="Metrics.setFmt('${c.key}')">${c.label}<span class="chip-n">${n}</span></button>`;
      }).join('');
      const sorts=SORTS.map(s=>`<option value="${s.key}" ${this.sort===s.key?'selected':''}>${s.label}</option>`).join('');
      this.el.innerHTML=`
        ${this.kpisHtml()}
        <div style="margin-top:18px">${this.fmt==='todos'?this.chartsHtml():''}</div>
        <div class="row between wrap" style="gap:12px;margin:6px 0 14px">
          <div class="chips">${tabs}</div>
          <label class="row meta-sm" style="gap:8px;align-items:center">Ordenar por
            <select class="input select-bare" style="width:auto" onchange="Metrics.setSort(this.value)">${sorts}</select></label>
        </div>
        <div class="col" style="gap:12px">
          ${sorted.length? sorted.map((p,i)=>this.postCard(p,i)).join('') : '<div class="empty card pad">Nenhum post neste formato no período.</div>'}
        </div>`;
      if(this.fmt==='todos') this.drawCharts();
    },
    /* versão RESUMO (cliente): KPIs + destaques, sem abas/ordenação */
    mountSummary(el, data, topN){
      if(!el) return; topN=topN||6;
      this.data=data||{posts:[]}; this._normalize();
      const posts=this.posts().slice();
      const top=this.sorted(posts.filter(()=>true));
      // ordena por engajamento (nulls por último) -> reaproveita sorted com sort atual
      this.sort='eng_rate';
      const ranked=this.sorted(posts).slice(0,topN);
      el.innerHTML=`
        ${this.kpisHtml()}
        <div style="margin-top:18px">${this.chartsHtml()}</div>
        <div class="eyebrow" style="margin:8px 0 12px">Destaques do período</div>
        <div class="col" style="gap:12px">
          ${ranked.length? ranked.map((p,i)=>this.postCard(p,i)).join('') : '<div class="empty card pad">Sem posts no período.</div>'}
        </div>`;
      this.drawCharts();
    },
    /* texto da IA (**negrito** + parágrafos) -> HTML */
    resumoHtml(text){
      const e=s=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
      return e(text)
        .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
        .split(/\n{2,}/).map(p=>`<p style="margin:0 0 12px">${p.replace(/\n/g,'<br>')}</p>`).join('');
    }
  };
  window.Metrics = Metrics;
})();
