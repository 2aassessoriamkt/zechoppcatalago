-- ==========================================================================
-- 🍺 ZÉ CHOPP - SCRIPT DE MIGRAÇÃO DO BANCO DE DADOS (SUPABASE SQL)
-- Cole este script no SQL Editor do seu projeto do Supabase para criar a estrutura!
-- ==========================================================================

-- 1. LIMPEZA PRÉVIA (Se já existirem as tabelas)
DROP TABLE IF EXISTS public.page_views;
DROP TABLE IF EXISTS public.produtos;

-- 2. CRIAÇÃO DA TABELA DE PRODUTOS
CREATE TABLE public.produtos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}'::TEXT[],
    available BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Habilitar RLS (Row Level Security) em produtos
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança para produtos
CREATE POLICY "Leitura pública de produtos" 
    ON public.produtos FOR SELECT 
    USING (true);

CREATE POLICY "Modificação de produtos restrita a administradores autenticados" 
    ON public.produtos FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- 3. CRIAÇÃO DA TABELA DE VISUALIZAÇÕES DO QR CODE (ANALYTICS)
CREATE TABLE public.page_views (
    id BIGSERIAL PRIMARY KEY,
    viewed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    device_type TEXT,
    user_agent TEXT
);

-- Habilitar RLS em page_views
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança para page_views
CREATE POLICY "Qualquer dispositivo pode registrar leitura de QR Code" 
    ON public.page_views FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Leitura de analytics restrita a administradores autenticados" 
    ON public.page_views FOR SELECT 
    TO authenticated 
    USING (true);

-- ==========================================================================
-- 🍺 DADOS INICIAIS DE TESTE (Se quiser preencher o cardápio automaticamente)
-- ==========================================================================
INSERT INTO public.produtos (name, price, description, image_url, category, tags, available) VALUES
('Chopp Brahma', 13.90, 'O clássico número um. Chopp Brahma claro, leve e refrescante, servido em caneca trincando de gelada com colarinho super cremoso.', 'assets/chopp_premium.png', 'chopps', ARRAY['Mais Pedido', 'Gelado no Grau'], true),
('Chopp Pilsen Pantanal', 11.90, 'Direto da torneira! Chopp Pilsen regional leve, suave e estupidamente gelado. Perfeito para o happy hour sob o calor de Novo Progresso.', 'assets/chopp_premium.png', 'chopps', ARRAY['Local', 'Refrescante'], true),
('Batata Palito Crocante', 29.90, 'Uma generosa porção de batatas fritas palito fritas em alta temperatura para garantir maciez interna e casquinha super crocante. Acompanha molho rose.', 'assets/porcao_batata.png', 'petiscos', ARRAY['Clássico de Boteco'], true),
('Filé Mignon Acebolado', 64.90, 'Tiras macias e suculentas de filé mignon nobre grelhadas em chapa de ferro bem quente, com generosa porção de cebolas douradas na manteiga. Acompanha farofa do chefe.', 'assets/porcao_picanha.png', 'peixes-carnes', ARRAY['Nobre', 'Suarento'], true),
('Refrigerante Lata', 6.50, 'Coca-Cola, Coca Zero, Guaraná Antarctica, Guaraná Zero, Fanta Laranja ou Sprite. Servido estupidamente gelado.', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400', 'bebidas', ARRAY['Gelado'], true),
('Combo Jack Daniel''s', 299.00, 'Para os fortes. 1 Garrafa do clássico uísque americano Jack Daniel''s Tennessee Whiskey Old No. 7 (1 Litro) + 4 Energéticos em lata Monster ou Red Bull + Balde de gelo.', 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=400', 'combos', ARRAY['Whiskey Premium', 'Vibe'], true);
