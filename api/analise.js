// ============================================================
// oFruto — Função serverless (Vercel): RESUMO do desempenho pro CLIENTE (Claude)
// Recebe os dados REAIS do Windsor (totais + posts de destaque) e escreve um
// resumo acessível, honesto e motivador, feito pro cliente ler (não é especialista).
// Usa a mesma ANTHROPIC_API_KEY.
// ============================================================
const SYSTEM = `Você é Davi Moura, estrategista de conteúdo da agência oFruto, escrevendo o resumo mensal de desempenho do Instagram DIRETAMENTE PARA O CLIENTE ler.
Público: o cliente, que NÃO é especialista em métricas. Explique os números em linguagem simples, sem jargão, com contexto ("alcance é quantas pessoas viram", quando ajudar).
Tom: caloroso, claro e motivador, mas honesto — se algo caiu ou foi fraco, diga com leveza e aponte o caminho. Português do Brasil, em prosa (nada de bullets).
Use os DADOS REAIS fornecidos. Cite posts específicos pelo tema/legenda quando forem destaque, explicando por que funcionaram. Não invente números que não estão nos dados.
Estruture em blocos curtos, cada um com um subtítulo em negrito:
**Resumo do mês** — visão geral do que aconteceu, com os números principais.
**Destaques** — os conteúdos que mais performaram e o porquê (cite os posts).
**O caminho a seguir** — 2 a 3 recomendações práticas e animadoras pro próximo mês.
Responda APENAS com JSON válido: {"resumo":"...texto com os blocos..."}`;

function extractJson(text){
  try { return JSON.parse(text); } catch(e){}
  const m = text.match(/\{[\s\S]*\}/); if(m){ try { return JSON.parse(m[0]); } catch(e){} }
  return null;
}
function fmt(n){ n=Number(n)||0; return n.toLocaleString('pt-BR'); }
function snip(s,n){ s=String(s||'').replace(/\s+/g,' ').trim(); return s.length>n? s.slice(0,n)+'…' : s; }
function tipo(t){ return t==='REELS'?'Reel':t==='CAROUSEL_ALBUM'?'Carrossel':t==='IMAGE'?'Estático':t==='VIDEO'?'Vídeo':(t||'Post'); }

module.exports = async (req, res) => {
  if(req.method !== 'POST'){ res.status(405).json({ error:'Método não permitido' }); return; }
  const key = process.env.ANTHROPIC_API_KEY;
  if(!key){ res.status(500).json({ error:'Falta configurar ANTHROPIC_API_KEY no Vercel.' }); return; }
  try{
    const body = typeof req.body === 'string' ? JSON.parse(req.body||'{}') : (req.body||{});
    const { clientName='Cliente', label='o período', followers=null, totals={}, posts=[], diagnostico={} } = body;

    // totais
    const linhasTot = [];
    if(totals.reach!=null)  linhasTot.push(`Alcance total: ${fmt(totals.reach)}`);
    if(totals.rate!=null)   linhasTot.push(`Engajamento médio: ${Number(totals.rate).toFixed(1)}%`);
    if(totals.likes!=null)  linhasTot.push(`Curtidas: ${fmt(totals.likes)}`);
    if(totals.saved!=null)  linhasTot.push(`Salvamentos: ${fmt(totals.saved)}`);
    if(totals.shares!=null) linhasTot.push(`Compartilhamentos: ${fmt(totals.shares)}`);
    if(totals.n!=null)      linhasTot.push(`Posts publicados: ${fmt(totals.n)}`);
    if(followers!=null)     linhasTot.push(`Seguidores (hoje): ${fmt(followers)}`);

    // top posts (já vêm ordenados por engajamento do lado do site)
    const top = (posts||[]).slice(0,6).map((p,i)=>
      `${i+1}. [${tipo(p.type)}] "${snip(p.caption,120)}" — engajamento ${Number(p.eng_rate||0).toFixed(1)}%, alcance ${fmt(p.reach)}, curtidas ${fmt(p.likes)}, salvamentos ${fmt(p.saved)}, compartilhamentos ${fmt(p.shares)}`
    ).join('\n');

    if(!linhasTot.length && !top){ res.status(400).json({ error:'Sem dados para resumir.' }); return; }
    const ctx = (diagnostico && diagnostico.essencia) ? `\n\nBase estratégica do cliente (essência): ${diagnostico.essencia}` : '';
    const user = `Cliente: ${clientName}\nPeríodo: ${label}\n\nNúmeros do período:\n${linhasTot.map(l=>'- '+l).join('\n')}\n\nPosts de destaque (do que mais performou pro que menos):\n${top||'(sem posts no período)'}${ctx}\n\nEscreva o resumo pro cliente no formato JSON pedido.`;

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{ 'content-type':'application/json', 'x-api-key':key, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({ model: process.env.AI_MODEL || 'claude-sonnet-4-6', max_tokens:2000, system:SYSTEM, messages:[{role:'user', content:user}] })
    });
    const data = await r.json();
    if(!r.ok){ res.status(502).json({ error:'A IA retornou erro.', detail:data && data.error ? data.error : data }); return; }
    const text = (data.content && data.content[0] && data.content[0].text) || '';
    const parsed = extractJson(text);
    res.status(200).json({ resumo: (parsed && parsed.resumo) || text });
  }catch(e){ res.status(500).json({ error:'Falha inesperada.', detail:String(e) }); }
};
