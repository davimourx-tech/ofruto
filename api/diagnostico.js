// ============================================================
// oFruto — Função serverless (Vercel): Diagnóstico com IA (Claude)
// A chave fica SEGURA aqui no servidor (variável de ambiente),
// nunca aparece no site. Configure no Vercel:
//   Settings → Environment Variables → ANTHROPIC_API_KEY = sua-chave
//   (opcional) AI_MODEL = claude-sonnet-4-6
// ============================================================

const SYSTEM = `Você é o estrategista de marca pessoal do estúdio oFruto (Davi Moura).
Sua função: transformar as respostas de uma reunião de EXTRAÇÃO em um DIAGNÓSTICO estratégico com 4 mapas.
Escreva em português do Brasil, com tom direto, afiado e sem enrolação — do jeito do oFruto: sem romantizar nem catastrofizar, focado em clareza e autoridade.

Gere EXATAMENTE estes 4 mapas:
1. essencia (Mapa de Essência): quem a pessoa é, o que ela defende, como fala, e a NARRATIVA CENTRAL que vai orientar todo o conteúdo. Não é o que ela acha de si mesma — é o que dá pra extrair das respostas com as perguntas certas.
2. presenca (Mapa da Presença Atual): o ponto de partida REAL da presença digital — o que já está em campo, o que funciona, e o que precisa ser quebrado ou descartado. Sem romantizar nem catastrofizar.
3. publico (Retrato do Público): separe quem já segue de quem ela quer atrair. Perfil, comportamento digital, o que consome e por quê — e como essa diferença muda o conteúdo.
4. campo (Mapa do Campo): leitura do mercado/concorrência — o que já existe, onde há ruído/saturação, e ONDE HÁ ESPAÇO pra ocupar com autoridade. Não é pra copiar, é pra encontrar o vazio.

Regras:
- Cada mapa: 1 a 3 parágrafos objetivos, prontos pra orientar a criação de conteúdo.
- Baseie-se SOMENTE nas respostas fornecidas. Se faltar informação para algum mapa, aponte a lacuna claramente ("Falta: ...") em vez de inventar.
- Nada de bullet points nem títulos dentro dos textos; escreva em prosa direta.

Responda APENAS com um JSON válido, sem nenhum texto fora dele, exatamente neste formato:
{"essencia":"...","presenca":"...","publico":"...","campo":"..."}`;

function extractJson(text){
  try { return JSON.parse(text); } catch(e){}
  const m = text.match(/\{[\s\S]*\}/);
  if(m){ try { return JSON.parse(m[0]); } catch(e){} }
  return null;
}

module.exports = async (req, res) => {
  if(req.method !== 'POST'){ res.status(405).json({ error:'Método não permitido' }); return; }
  const key = process.env.ANTHROPIC_API_KEY;
  if(!key){ res.status(500).json({ error:'Falta configurar ANTHROPIC_API_KEY nas variáveis de ambiente do Vercel.' }); return; }

  try{
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const clientName = body.clientName || 'Cliente';
    const respostas = (body.respostas || '').trim();
    if(!respostas){ res.status(400).json({ error:'Sem respostas de extração para analisar.' }); return; }

    const user = `Cliente: ${clientName}\n\nRespostas da reunião de extração:\n${respostas}\n\nGere o diagnóstico (os 4 mapas) no formato JSON pedido.`;

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{ 'content-type':'application/json', 'x-api-key':key, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'claude-sonnet-4-6',
        max_tokens: 2500,
        system: SYSTEM,
        messages: [{ role:'user', content: user }]
      })
    });

    const data = await r.json();
    if(!r.ok){ res.status(502).json({ error:'A IA retornou erro.', detail: data && data.error ? data.error : data }); return; }

    const text = (data.content && data.content[0] && data.content[0].text) || '';
    const maps = extractJson(text);
    if(!maps){ res.status(502).json({ error:'Não consegui interpretar a resposta da IA.', raw:text }); return; }

    res.status(200).json({
      essencia: maps.essencia || '',
      presenca: maps.presenca || '',
      publico:  maps.publico  || '',
      campo:    maps.campo    || ''
    });
  }catch(e){
    res.status(500).json({ error:'Falha inesperada.', detail:String(e) });
  }
};
