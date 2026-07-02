/* ============================================================
   SELO CO. — Configuração
   ------------------------------------------------------------
   Preencha as 2 chaves do Supabase para ATIVAR o salvamento real.
   Enquanto estiverem vazias, o site roda em MODO DEMO
   (tudo funciona na tela, mas não salva — usa dados de exemplo).

   Onde achar as chaves:
   Supabase → seu projeto → Settings → API
     • Project URL          -> SUPABASE_URL
     • Project API keys: anon public -> SUPABASE_ANON_KEY
   ============================================================ */
window.APP_CONFIG = {

  SUPABASE_URL:      "https://azapggxgoslpvjelntbw.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable__knwwCmWQc6h79tyQ2E_dA_LLt0cYxz",

  /* Senha única para abrir o PAINEL DO GESTOR (troque!) */
  MANAGER_PASSWORD: "selo2026",

  /* Seus dados (aparecem para o cliente e no WhatsApp) */
  MANAGER: {
    name:     "Davi Moura",
    studio:   "oFruto",
    whatsapp: "5519994299115"   // 55 + 19 + 994299115
  },

  /* Checklist de onboarding criado automaticamente para cada cliente novo.
     Edite esta lista com o SEU processo. Você também pode ajustar por cliente depois. */
  /* Etapas de PRODUÇÃO dos conteúdos (Operacional) — pipeline oFruto */
  PROD_STAGES: [
    "Ideia e Briefing",
    "Desenvolver Copy/Roteiro",
    "Validação do Planejamento",
    "Captação",
    "Edição dos Vídeos",
    "Design de Artes e Carrosséis",
    "Validação dos Conteúdos",
    "Revisão e Ajustes",
    "Gestão dos Conteúdos"
  ],

  /* Etapas da JORNADA do cliente (Administrativo) — jornada oFruto */
  JOURNEY_STAGES: [
    "Contrato & Onboarding",
    "Reunião de Extração",
    "Base Estratégica",
    "Validação do Cliente",
    "Produção (recorrência)",
    "Relatório mensal"
  ],

  /* Status de cada CONTEÚDO (matriz do projeto) — "Status do vídeo" */
  CONTENT_STATUS: ["Em processo", "Roteiro pronto", "Gravado", "Editado", "Designer feito", "Pronto", "Postado"],

  /* Equipe / responsáveis */
  TEAM: ["Davi Moura", "Social media", "Editor", "Designer"],

  DEFAULT_ONBOARDING: [
    "Assinar contrato",
    "Coletar acessos das redes sociais",
    "Preencher base estratégica",
    "Reunião de kickoff / alinhamento",
    "Definir matriz de conteúdo",
    "Planejar o primeiro mês",
    "Enviar primeiro lote para aprovação"
  ],

  /* Roteiro de EXTRAÇÃO (base estratégica). Aparece em cada cliente novo.
     Edite/adicione perguntas à vontade. type "choice" = opções clicáveis. */
  DEFAULT_EXTRACTION: [
    { title:"Identidade & negócio", questions:[
      { id:"i_prof",      q:"Qual é a sua profissão ou especialidade?" },
      { id:"i_tempo",     q:"Há quanto tempo você atua nessa área?" },
      { id:"i_estrutura", q:"Você tem alguma estrutura de negócio? (clínica, escritório, consultório, autônomo…)" },
      { id:"i_insta",     q:"@ do Instagram — pessoal e profissional (se houver)" }
    ]},
    { title:"Essência & história", questions:[
      { id:"e_porque",   q:"Por que você escolheu essa área? Conte a história real — não a versão bonita do currículo." },
      { id:"e_palavras", q:"Liste 3 a 5 palavras que descrevem quem você é como profissional (sem pensar muito)." },
      { id:"e_aumentar", q:"O que você quer aumentar com a sua marca pessoal?" }
    ]},
    { title:"Cliente & público", questions:[
      { id:"p_ideal",    q:"Descreva o cliente que você mais gosta de atender. Quem é essa pessoa?" },
      { id:"p_dor",      q:"Qual é a maior dor ou problema que você resolve para esse cliente?" },
      { id:"p_depois",   q:"O que esse cliente sente DEPOIS de trabalhar com você? O que muda na vida dele?" },
      { id:"p_perderia", q:"Se sua marca sumisse hoje, o que seu cliente perderia de verdade?" },
      { id:"p_chegam",   q:"Como seus clientes chegam até você hoje?" },
      { id:"p_naoquer",  q:"Existe algum tipo de cliente que você NÃO quer atender? Por quê?" }
    ]},
    { title:"Mercado & concorrência", questions:[
      { id:"m_percebido",   q:"Como você é percebido no seu mercado hoje? E como gostaria de ser percebido?" },
      { id:"m_diferente",   q:"O que você faz na prática que seus concorrentes não fazem — ou fazem diferente?" },
      { id:"m_naotolera",   q:"O que você NÃO tolera na sua área? O que te incomoda no mercado?" },
      { id:"m_comunicacao", q:"O que te incomoda na comunicação de outros profissionais da sua área?" },
      { id:"m_admira",      q:"Existe algum profissional (dentro ou fora da sua área) cuja comunicação você admira? Por quê?" },
      { id:"m_admira_link", q:"Link do perfil desse profissional que você admira (se houver).", type:"url" }
    ]},
    { title:"Presença digital", questions:[
      { id:"d_hoje",  q:"Como você descreveria sua presença digital hoje? Seja honesto." },
      { id:"d_mudar", q:"Se pudesse mudar uma única coisa na sua presença digital a partir de amanhã, o que seria?" },
      { id:"d_falta", q:"Como o digital vai te ajudar a chegar aonde você quer? O que você acredita que falta hoje?" }
    ]},
    { title:"Ambições & monetização", questions:[
      { id:"a_3anos",    q:"Onde você quer estar daqui a 3 anos? Seja específico." },
      { id:"a_ticket",   q:"Qual é o seu ticket médio atual? E qual você gostaria de ter?" },
      { id:"a_receitas", q:"Além do serviço principal, você já pensa em outros formatos de receita?", type:"choice",
        options:["Sim","Não","Já faço","Quero mas não sei como"] }
    ]},
    { title:"Comunicação, formato & limites", questions:[
      { id:"c_camera",   q:"Você tem facilidade para falar na câmera? Qual formato te parece mais natural?", type:"choice",
        options:["Falar direto pra câmera","Bastidores/Rotina","Entrevistas/Depoimento","Educativo","Não sei ainda"] },
      { id:"c_naovisto", q:"Como você NÃO quer ser visto(a) pela sua audiência?" },
      { id:"c_tabu",     q:"Existe algum tema que você não quer abordar publicamente? Por quê?" }
    ]},
    { title:"Aberto", questions:[
      { id:"o_extra", q:"Tem algo importante sobre você, sua história ou seu trabalho que não foi perguntado e que você acha que eu deveria saber?" }
    ]}
  ]
};
