import { createClient } from '@supabase/supabase-js';

// SUBSTITUA PELAS SUAS CHAVES DO PAINEL DO SUPABASE
const supabaseUrl = 'https://gotjnyawywjgudxgqmfj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdGpueWF3eXdqZ3VkeGdxbWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTk2NjYsImV4cCI6MjA4MTQ3NTY2Nn0.49bt7xIj-59PYJF8eSbdK9mYMTiU2rALv_CmTRrRv80';

// Verificação de segurança
if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('seu-projeto')) {
  console.warn("ATENÇÃO: Chaves do Supabase não configuradas corretamente em src/services/supabase.js");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- FUNÇÃO DE LOGIN CORRIGIDA ---
export const loginGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // CORREÇÃO: Removemos '/editor'. Agora ele volta para a Home.
      redirectTo: window.location.origin 
    }
  });
  if (error) console.error("Erro login:", error);
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Erro logout:", error);
  // Opcional: Recarregar a página após sair para limpar estados
  window.location.href = '/';
};