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
      // OBS: filtro de data zera os insights de mídia -> puxamos tudo e filtramos por timestamp aqui.
      const fields = 'media_id,media_type,media_product_type,media_caption,media_permalink,media_thumbnail_url,media_url,timestamp,media_reach,media_engagement,media_saved,media_shares,media_like_count,media_comments_count,media_views';
      const r = await windsorGet(`/${connector}`, { api_key:key, fields, _renderer:'json', ...(filter?{filter}:{}) });
      if(!r.ok){ res.status(502).json({ error:'Erro ao puxar os posts do Windsor.', status:r.status, detail:r.json }); return; }
      let rows = Array.isArray(r.json.data) ? r.json.data : [];
      if(body.date_from || body.date_to){
        const from = body.date_from || '0000-01-01', to = body.date_to || '9999-12-31';
        rows = rows.filter(x => { const d = (x.timestamp||'').slice(0,10); return d && d >= from && d <= to; });
      }
      const posts = rows.map(x => {
        const reach = num(x.media_reach) || 0, eng = num(x.media_engagement) || 0;
        return {
          id: x.media_id, type: x.media_type || '', product: x.media_product_type || '',
          caption: x.media_caption || '', permalink: x.media_permalink || '',
          thumb: x.media_thumbnail_url || x.media_url || '', date: (x.timestamp||'').slice(0,10),
          reach, engagement: eng, likes: num(x.media_like_count) || 0, comments: num(x.media_comments_count) || 0,
          saved: num(x.media_saved) || 0, shares: num(x.media_shares) || 0, views: num(x.media_views) || 0,
          eng_rate: reach ? +(((eng) / reach) * 100).toFixed(2) : 0
        };
      });
      res.status(200).json({ connector, account: account||null, count: posts.length, posts });
      return;
    }

    // ---- métricas do período ----
    const account = normAccount(body.account);
    const dateParams = {};
    if(body.date_from) dateParams.date_from = body.date_from;
    if(body.date_to)   dateParams.date_to   = body.date_to;
    if(!body.date_from && !body.date_to) dateParams.date_preset = body.date_preset || 'last_30d';
    const filter = account ? JSON.stringify([['account_name','eq', account]]) : null;

    // consulta 1: diários
    const daily = await windsorGet(`/${connector}`, {
      api_key:key, fields:DAILY_FIELDS, _renderer:'json', ...dateParams, ...(filter?{filter}:{})
    });
    if(!daily.ok){ res.status(502).json({ error:'Erro ao consultar o Windsor (diário). Confira a chave e o conector.', status:daily.status, detail:daily.json }); return; }
    let rows = Array.isArray(daily.json.data) ? daily.json.data : [];

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
      connector, account: account||null, rows: rows.length,
      metrics,
      note: 'seguidores_total = valor de hoje (Instagram não dá histórico). posts/visitas ao perfil: preencha à mão.'
    });
  }catch(e){
    res.status(500).json({ error:'Falha inesperada.', detail:String(e) });
  }
};
