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
  }
};
