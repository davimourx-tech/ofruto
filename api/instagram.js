// ============================================================
// oFruto — Função serverless (Vercel): dados PÚBLICOS do Instagram (Apify)
// Só dados públicos (seguidores, seguindo, nº de posts). Métricas privadas
// (alcance, salvamentos, views) você preenche à mão (vêm do Insights do cliente).
// Configure no Vercel: APIFY_TOKEN = seu token do apify.com
// ============================================================
module.exports = async (req, res) => {
  if(req.method !== 'POST'){ res.status(405).json({ error:'Método não permitido' }); return; }
  const token = process.env.APIFY_TOKEN;
  if(!token){ res.status(500).json({ error:'Configure APIFY_TOKEN no Vercel para puxar do Instagram.' }); return; }
  try{
    const body = typeof req.body === 'string' ? JSON.parse(req.body||'{}') : (req.body||{});
    let handle = (body.handle||'').replace(/^@/,'').trim().replace(/\/$/,'').split('/').pop();
    if(!handle){ res.status(400).json({ error:'Informe o @ do cliente.' }); return; }
    const r = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${token}`, {
      method:'POST', headers:{'content-type':'application/json'},
      body: JSON.stringify({ usernames:[handle] })
    });
    const data = await r.json();
    if(!r.ok){ res.status(502).json({ error:'Erro no Apify.', detail:data }); return; }
    const p = Array.isArray(data) ? data[0] : null;
    if(!p){ res.status(404).json({ error:'Perfil não encontrado ou privado.' }); return; }
    res.status(200).json({
      nome: p.fullName || '',
      seguidores: p.followersCount ?? null,
      seguindo: p.followsCount ?? null,
      posts: p.postsCount ?? null
    });
  }catch(e){ res.status(500).json({ error:'Falha inesperada.', detail:String(e) }); }
};
