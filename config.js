// ==========================================================================
// 🍺 CONFIGURAÇÕES DO BACKEND SUPABASE (ZÉ CHOPP)
// Credenciais integradas ao seu projeto oficial do Supabase!
// ==========================================================================

const SUPABASE_URL = "https://bkwmixysvkpkfhzjsmgz.supabase.co"; // URL Oficial do Zé Chopp
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrd21peHlzdmtwa2ZoempzbWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NDIxMjcsImV4cCI6MjA5NTIxODEyN30.nMoWHQ7IlMbbG0QX34t_BIVAMGnESzuOpUiov0KXPHU"; // Chave Anon Oficial

// Criação do cliente global do Supabase para compartilhamento entre telas
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
