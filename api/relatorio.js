// ============================================================
// oFruto — Função serverless (Vercel): análise do relatório mensal (Claude)
// Usa a mesma ANTHROPIC_API_KEY do diagnóstico.
// ============================================================
const SYSTEM = `Você é o estrategista da oFruto (Davi Moura). Escreva a ANÁLISE de um relatório mensal de marca pessoal a partir das métricas fornecidas.
Tom oFruto: direto, afiado, sem enrolação, focado em clareza e próximos passos. Português do Brasil, em prosa (nada de bullets).
Estruture em 3 blocos curtos, cada um com um subtítulo em negrito:
**O que aconteceu** — leitura honesta dos números: o que cresceu, o que caiu, o que chamou atenção.
**O que funcionou e o que não** — hipóteses do porquê.
**O que ajustar no próximo mês** — recomendações concretas e acionáveis.
Use a base estratégica quando fizer sentido. Se algum número estiver faltando/zerado, não invente — foque no que existe.
Responda APENAS com JSON válido: {"analysis":"...texto com os 3 blocos..."}`;

function extractJson(text){
  try { return JSON.parse(text); } catch(e){}
  const m = text.match(/\{[\s\S]*\}/); if(m){ try { return JSON.parse(m[0]); } catch(e){} }
  return null;
}

module.exports = async (req, res) => {
  if(req.method !== 'POST'){ res.status(405).json({ error:'Método não permitido' }); return; }
  const key = process.env.ANTHROPIC_API_KEY;
  if(!key){ res.status(500).json({ error:'Falta configurar ANTHROPIC_API_KEY no Vercel.' }); return; }
  try{
    const body = typeof req.body === 'string' ? JSON.parse(req.body||'{}') : (req.body||{});
    const { clientName='Cliente', handle='', month='', metrics={}, diagnostico={} } = body;
    const linhas = Object.entries(metrics).filter(([k,v])=>v!=='' && v!=null).map(([k,v])=>`- ${k}: ${v}`).join('\n');
    if(!linhas.trim()){ res.status(400).json({ error:'Sem métricas para analisar.' }); return; }
    const ctx = (diagnostico && diagnostico.essencia) ? `\n\nBase estratégica (essência): ${diagnostico.essencia}` : '';
    const user = `Cliente: ${clientName} (${handle})\nMês: ${month}\n\nMétricas do mês:\n${linhas}${ctx}\n\nEscreva a análise no formato JSON pedido.`;

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{ 'content-type':'application/json', 'x-api-key':key, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({ model: process.env.AI_MODEL || 'claude-sonnet-4-6', max_tokens:1800, system:SYSTEM, messages:[{role:'user', content:user}] })
    });
    const data = await r.json();
    if(!r.ok){ res.status(502).json({ error:'A IA retornou erro.', detail:data && data.error ? data.error : data }); return; }
    const text = (data.content && data.content[0] && data.content[0].text) || '';
    const parsed = extractJson(text);
    res.status(200).json({ analysis: (parsed && parsed.analysis) || text });
  }catch(e){ res.status(500).json({ error:'Falha inesperada.', detail:String(e) }); }
};
