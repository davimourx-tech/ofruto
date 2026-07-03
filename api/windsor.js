// ============================================================
// oFruto — Função serverless (Vercel): métricas REAIS do Instagram via Windsor.ai
// ------------------------------------------------------------
// O Windsor.ai conecta (login oficial) na conta de cada cliente e expõe os
// números privados (alcance, salvamentos, compartilhamentos, interações...).
// Campos calibrados com dados reais (conector "instagram").
//
// Pegadinha aprendida: campos "diários" (reach, views, saves, shares,
// total_interactions, follower_count) NÃO podem vir na mesma consulta que os
// campos de "total do perfil" (followers_count, media_count) — mistura zera o
// resultado. Por isso fazemos DUAS consultas e juntamos.
//
// Configure no Vercel (Settings → Environment Variables):
//   WINDSOR_API_KEY    = sua chave da API do Windsor (onboard.windsor.ai → API)
//   WINDSOR_CONNECTOR  (opcional) = "instagram"  (padrão)
//
// Uso a partir do site:
//   POST /api/windsor  { account, date_from, date_to }   -> métricas do mês
//   POST /api/windsor  { accounts: true }                 -> lista contas conectadas
//   POST /api/windsor  { discover: true }                 -> lista campos disponíveis
// ============================================================

const BASE = 'https://connectors.windsor.ai';

// campos diários (somados no período)
const DAILY_FIELDS = 'date,account_name,reach,views,total_interactions,saves,shares,follower_count';
// campos de total do perfil (valor de hoje)
const SNAP_FIELDS = 'account_name,followers_count,media_count';

function num(v){ const n = Number(v); return Number.isFinite(n) ? n : null; }

// nome da conta a filtrar: aceita "amanda_sobottka" ou "instagram__Amanda (amanda_sobottka)"
function normAccount(a){
  if(!a) return '';
  const paren = a.match(/\(([^)]+)\)\s*$/);      // pega o que está entre parênteses
  if(paren) return paren[1].trim();
  return a.replace(/^instagram__/,'').replace(/^@/,'').trim();
}

async function windsorGet(path, params){
  const url = new URL(BASE + path);
  Object.entries(params||{}).forEach(([k,v]) => { if(v != null && v !== '') url.searchParams.set(k, v); });
  const r = await fetch(url.toString(), { headers:{ 'User-Agent':'Windsor/1.0' } });
  const text = await r.text();
  let json; try{ json = JSON.parse(text); }catch(e){ json = { raw:text }; }
  return { ok:r.ok, status:r.status, json };
}

function sum(rows, key){ let s=0, any=false; for(const r of rows){ const n=num(r[key]); if(n!=null){ s+=n; any=true; } } return any?Math.round(s):null; }

module.exports = async (req, res) => {
  if(req.method !== 'POST'){ res.status(405).json({ error:'Método não permitido' }); return; }
  const key = process.env.WINDSOR_API_KEY;
  if(!key){ res.status(500).json({ error:'Configure WINDSOR_API_KEY no Vercel para puxar as métricas reais.' }); return; }
  const connector = (process.env.WINDSOR_CONNECTOR || 'instagram').trim();

  try{
    const body = typeof req.body === 'string' ? JSON.parse(req.body||'{}') : (req.body||{});

    // listar campos disponíveis
    if(body.discover){
      const { ok, status, json } = await windsorGet(`/${connector}/fields`, { api_key:key });
      if(!ok){ res.status(502).json({ error:'Não deu pra listar os campos.', status, detail:json }); return; }
      res.status(200).json({ connector, fields:json }); return;
    }

    // listar contas conectadas (com o username já extraído pra facilitar)
    if(body.accounts){
      const r = await fetch(`https://onboard.windsor.ai/api/common/ds-accounts?datasource=${connector}&api_key=${encodeURIComponent(key)}`, { headers:{ 'User-Agent':'Windsor/1.0' } });
      const j = await r.json().catch(()=>([]));
      if(!r.ok){ res.status(502).json({ error:'Não deu pra listar as contas.', detail:j }); return; }
      const accounts = (Array.isArray(j)?j:[]).map(a => ({
        account_id: a.account_id, raw: a.account_name,
        username: normAccount(a.account_name)
      }));
      res.status(200).json({ connector, accounts }); return;
    }

    // ---- métricas POR POST (media_*) ----
    if(body.posts){
      const account = normAccount(body.account);
      const filter = account ? JSON.stringify([['account_name','eq', account]]) : null;
      const today = new Date().toISOString().slice(0,10);
      const from = body.date_from || '2015-01-01';
      const to   = body.date_to   || today;

      // 1) INFO de todos os posts. IMPORTANTE: buscamos SEMPRE até hoje (date_to=today) porque
      //    o Windsor retorna vazio em janelas totalmente no passado. Filtramos o período no código.
      const infoFields = 'media_id,timestamp,media_type,media_product_type,media_caption,media_permalink,media_thumbnail_url,media_url,media_like_count,media_comments_count';
      const info = await windsorGet(`/${connector}`, { api_key:key, fields:infoFields, _renderer:'json', date_from:from, date_to:today, ...(filter?{filter}:{}) });
      if(!info.ok){ res.status(502).json({ error:'Erro ao puxar os posts do Windsor.', status:info.status, detail:info.json }); return; }
      let infoRows = Array.isArray(info.json.data) ? info.json.data : [];
      infoRows = infoRows.filter(x => { const d=(x.timestamp||'').slice(0,10); return d && d>=from && d<=to; });

      // 2) INSIGHTS por post (alcance/engajamento) — só vêm dos posts já sincronizados; casa por media_id
      const insFields = 'media_id,media_reach,media_engagement,media_saved,media_shares,media_views';
      const ins = await windsorGet(`/${connector}`, { api_key:key, fields:insFields, _renderer:'json', ...(filter?{filter}:{}) });
      const insMap = {};
      if(ins.ok && Array.isArray(ins.json.data)) ins.json.data.forEach(r => { if(r.media_id) insMap[r.media_id] = r; });

      const posts = infoRows.map(x => {
        const ii = insMap[x.media_id] || {};
        const reach = num(ii.media_reach), eng = num(ii.media_engagement);
        const hasIns = reach != null;
        return {
          id: x.media_id, type: x.media_type || '', product: x.media_product_type || '',
          caption: x.media_caption || '', permalink: x.media_permalink || '',
          thumb: x.media_thumbnail_url || x.media_url || '', date: (x.timestamp||'').slice(0,10),
          likes: num(x.media_like_count) || 0, comments: num(x.media_comments_count) || 0,
          reach: reach != null ? reach : null, engagement: eng != null ? eng : null,
          saved: num(ii.media_saved) || 0, shares: num(ii.media_shares) || 0, views: num(ii.media_views) || 0,
          eng_rate: (hasIns && reach) ? +(((eng||0) / reach) * 100).toFixed(2) : null,
          has_insights: hasIns
        };
      });
      posts.sort((a,b) => (b.date||'').localeCompare(a.date||''));
      res.status(200).json({
        connector, account: account||null,
        count: posts.length, with_insights: posts.filter(p=>p.has_insights).length, posts
      });
      return;
    }

    // ---- métricas do período ----
    // OBS/Meta: as métricas DIÁRIAS da conta só existem ~30 dias (o Instagram não guarda mais).
    // Além disso, juntar vários campos de insight com date_from/date_to zera o retorno no Windsor.
    // Solução robusta: usar date_preset (last_30d, que funciona) e filtrar o período no código.
    const account = normAccount(body.account);
    const from = body.date_from || null;
    const to   = body.date_to   || null;
    const filter = account ? JSON.stringify([['account_name','eq', account]]) : null;

    // consulta 1: diários — preset confiável, depois filtra
    const daily = await windsorGet(`/${connector}`, {
      api_key:key, fields:DAILY_FIELDS, _renderer:'json', date_preset:'last_30d', ...(filter?{filter}:{})
    });
    if(!daily.ok){ res.status(502).json({ error:'Erro ao consultar o Windsor (diário). Confira a chave e o conector.', status:daily.status, detail:daily.json }); return; }
    let rows = Array.isArray(daily.json.data) ? daily.json.data : [];
    if(from || to) rows = rows.filter(r => { const d=(r.date||'').slice(0,10); return d && (!from||d>=from) && (!to||d<=to); });
    const daysCovered = rows.length;

    // consulta 2: total do perfil (valor de hoje — followers_count, media_count)
    const snap = await windsorGet(`/${connector}`, {
      api_key:key, fields:SNAP_FIELDS, _renderer:'json', ...(filter?{filter}:{})
    });
    const snapRows = (snap.ok && Array.isArray(snap.json.data)) ? snap.json.data : [];
    const snapRow = snapRows[snapRows.length-1] || {};

    if(!rows.length && !snapRows.length){
      res.status(404).json({ error:'Nenhum dado no período. A conta está conectada e já sincronizou no Windsor? Confira o nome (username).', account:account||null }); return;
    }

    // monta as métricas do oFruto
    const metrics = {};
    const put = (k,v) => { if(v!=null) metrics[k]=v; };
    put('alcance',            sum(rows,'reach'));
    put('views',              sum(rows,'views'));
    put('interacoes',         sum(rows,'total_interactions'));
    put('salvamentos',        sum(rows,'saves'));
    put('compartilhamentos',  sum(rows,'shares'));
    put('seguidores_ganhos',  sum(rows,'follower_count'));
    put('seguidores_total',   num(snapRow.followers_count));
    // posts_publicados e visitas_perfil: Instagram não entrega histórico confiável -> ficam manuais

    res.status(200).json({
      connector, account: account||null, rows: rows.length, days_covered: daysCovered,
      metrics,
      note: 'Métricas diárias da conta só existem ~30 dias (limite do Instagram). Períodos mais antigos que isso vêm parciais/vazios. seguidores_total = valor de hoje.'
    });
  }catch(e){
    res.status(500).json({ error:'Falha inesperada.', detail:String(e) });
  }
};
