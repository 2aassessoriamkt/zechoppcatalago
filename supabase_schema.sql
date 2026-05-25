-- ==========================================================================
-- 🍺 ZÉ CHOPP - SCRIPT DE MIGRAÇÃO DO BANCO DE DADOS (SUPABASE SQL)
-- Cole este script no SQL Editor do seu projeto do Supabase para criar a estrutura!
-- ==========================================================================

-- 1. LIMPEZA PRÉVIA (Remove as tabelas se já existirem para recriar do zero)
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

CREATE POLICY "Modificação de produtos restrita a admins" 
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

CREATE POLICY "Leitura de analytics restrita a admins" 
    ON public.page_views FOR SELECT 
    TO authenticated 
    USING (true);

-- ==========================================================================
-- 🍺 CARDÁPIO COMPLETO EXCLUSIVO E REAL DO ZÉ CHOPP (36 PRODUTOS)
-- ==========================================================================
INSERT INTO public.produtos (name, price, description, image_url, category, tags, available) VALUES

-- === CATEGORIA: CHOPPS ===
('Chopp Brahma', 13.90, 'O clássico número um. Chopp Brahma claro, leve e refrescante, servido em caneca trincando de gelada com colarinho super cremoso.', 'assets/13_chopp_brahma.png', 'chopps', ARRAY[]::TEXT[], true),
('Chopp Pilsen Pantanal', 11.90, 'Direto da torneira! Chopp Pilsen regional leve, suave e estupidamente gelado. Perfeito para o happy hour sob o calor de Novo Progresso.', 'assets/14_chopp_pilsen_pantanal.png', 'chopps', ARRAY[]::TEXT[], true),
('Chopp de Vinho', 14.90, 'A união perfeita do frescor do chopp claro com a doçura e encorpamento do chopp de vinho tinto. Doce e cremoso na medida certa.', 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&q=80&w=400', 'chopps', ARRAY[]::TEXT[], true),
('Chopp de Ice', 14.90, 'Uma explosão cítrica de limão com o frescor gelado de ice de pressão. Leve, adocicado e ideal para refrescar a noite.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400', 'chopps', ARRAY[]::TEXT[], true),
('Chopp IPA', 17.90, 'Para os amantes de lúpulo. Chopp IPA artesanal sob pressão, com amargor marcante, aroma cítrico e notas frutadas persistentes.', 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400', 'chopps', ARRAY[]::TEXT[], true),
('Chopp APA', 16.90, 'American Pale Ale direto do barril. Equilíbrio perfeito entre malte e lúpulos americanos aromáticos, com amargor médio e refrescante.', 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&q=80&w=400', 'chopps', ARRAY[]::TEXT[], true),
('Chopp Drink Moscow Mule', 18.90, 'Releitura espetacular do clássico cocktail. Chopp leve de pressão saborizado com infusão de limão e o toque picante e refrescante do gengibre.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400', 'chopps', ARRAY[]::TEXT[], true),
('Chopp Drink Moscow Mule Zero', 15.90, 'Toda a experiência refrescante do Moscow Mule (limão e gengibre) em formato de chopp de pressão, mas com 0,0% teor alcoólico.', 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=400', 'chopps', ARRAY[]::TEXT[], true),
('Chopp Porn Star Martini', 19.90, 'Drink sob pressão afrodisíaco e exótico. Notas marcantes de baunilha, maracujá fresco e um toque sutil e frisante de espumante.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400', 'chopps', ARRAY[]::TEXT[], true),

-- === CATEGORIA: CERVEJAS ===
('Heineken Shot (250 ml)', 7.90, 'A clássica puro malte holandesa em garrafa pequena (Shot). A quantidade perfeita para você beber estupidamente gelada até o último gole.', 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?auto=format&fit=crop&q=80&w=400', 'cervejas', ARRAY[]::TEXT[], true),
('Heineken Zero', 9.90, 'Todo o sabor inconfundível, amargor perfeitamente equilibrado e qualidade puro malte da Heineken clássica, mas com zero álcool.', 'https://images.unsplash.com/photo-1598063412586-a67b6d822e0b?auto=format&fit=crop&q=80&w=400', 'cervejas', ARRAY[]::TEXT[], true),
('Império Gold (210 ml)', 6.50, 'Cerveja nacional de qualidade superior, puro malte com notas douradas e leveza inigualável. Ideal para acompanhar um dia quente.', 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&q=80&w=400', 'cervejas', ARRAY[]::TEXT[], true),
('Coronita (210 ml)', 7.90, 'A clássica cerveja mexicana em sua simpática e charmosa garrafa menor. Super leve e ideal para ser apreciada com uma fatia de limão.', 'https://images.unsplash.com/photo-1629813876008-db29bf8b6a18?auto=format&fit=crop&q=80&w=400', 'cervejas', ARRAY[]::TEXT[], true),
('Corona Zero', 8.90, 'Toda a refrescância, suavidade e estilo tropical da clássica Corona mexicana, mas em uma versão totalmente livre de álcool.', 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=400', 'cervejas', ARRAY[]::TEXT[], true),

-- === CATEGORIA: DRINKS ===
('Caipirinha Clássica', 18.90, 'O orgulho nacional. Preparada com cachaça artesanal selecionada, limão tahiti espremido na hora, açúcar e muito gelo batido.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400', 'drinks', ARRAY[]::TEXT[], true),
('Caipirosca Premium', 21.90, 'Uma releitura sofisticada. Vodka nacional triplamente destilada e purificada, combinada com limão fresco macerado e açúcar.', 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&q=80&w=400', 'drinks', ARRAY[]::TEXT[], true),
('Gin Tônica (Sabores)', 26.90, 'Gin premium importado, água tônica gelada e infusões exclusivas de frutas e especiarias. Escolha: Limão, Maracujá, Morango ou Frutas Vermelhas.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400', 'drinks', ARRAY[]::TEXT[], true),
('Drinks Zero Álcool da Casa', 16.90, 'Coquetel sem álcool exclusivo criado pelo nosso bartender. Blend refrescante de xarope de frutas artesanal, soda limonada e hortelã.', 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=400', 'drinks', ARRAY[]::TEXT[], true),
('Lagoa Azul', 24.90, 'Lindo, refrescante e super saboroso. Mistura clássica à base de vodka, licor Curaçau Blue (que dá o tom azul), limão espremido e refrigerante citrus.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400', 'drinks', ARRAY[]::TEXT[], true),

-- === CATEGORIA: PORÇÕES ===
('Porção de Filé Acebolado', 64.90, 'Tiras macias e suculentas de filé mignon nobre grelhadas em chapa de ferro bem quente, com cebolas douradas na manteiga.', 'assets/01_porcao_file_acebolado.png', 'petiscos', ARRAY[]::TEXT[], true),
('Porção de Batata Palito', 29.90, 'Uma generosa porção de batatas fritas palito fritas em alta temperatura para garantir maciez interna e casquinha super crocante.', 'assets/02_porcao_batata_palito.png', 'petiscos', ARRAY[]::TEXT[], true),
('Porção de Calabresa Acebolada', 34.90, 'Linguiça calabresa defumada fatiada de primeira qualidade, salteada na chapa de ferro com bastante cebola em rodelas douradas e salsinha.', 'assets/03_porcao_calabresa_acebolada.png', 'petiscos', ARRAY[]::TEXT[], true),
('Porção de Frango a Passarinho', 38.90, 'Tradicionais cortes de frango caipira marinados nas ervas finas, fritos na hora com alho dourado e bastante cheiro-verde picadinho.', 'assets/04_porcao_frango_passarinho.png', 'petiscos', ARRAY[]::TEXT[], true),
('Porção de Frios Completa', 39.90, 'Ovos de codorna no azeite, azeitonas verdes suculentas, palmito em rodelas, pepino crocante em conserva e cubos de queijo mussarela premium.', 'assets/05_porcao_frios.png', 'petiscos', ARRAY[]::TEXT[], true),
('Porção de Pururuca', 19.90, 'Pele de porco selecionada, desidratada e pururucada na hora. Leve, aerada, extremamente crocante e sequinha.', 'assets/06_porcao_pururuca.png', 'petiscos', ARRAY[]::TEXT[], true),
('Porção de Quibe c/ Queijo (8 un)', 27.90, 'Mini quibes artesanais fritos na hora, feitos com carne de primeira moída com hortelã fresca e recheados com mussarela derretida.', 'assets/07_porcao_quibe_queijo.png', 'petiscos', ARRAY[]::TEXT[], true),
('Porção de Tilápia Crocante', 48.90, 'Iscas generosas de filé de tilápia fresca, empanadas na farinha panko especial e fritas na hora. Acompanha molho tártaro.', 'assets/08_porcao_tilapia.png', 'petiscos', ARRAY[]::TEXT[], true),
('Porção de Costelinha de Tambaqui', 52.90, 'As famosas costelinhas de tambaqui da região, cortadas e temperadas no grau, fritas na hora até dourar. Fartas de carne branca e suculenta.', 'assets/09_porcao_costelinha_tambaqui.png', 'petiscos', ARRAY[]::TEXT[], true),
('Porção de Filé de Tambaqui', 56.90, 'Filé nobre de tambaqui sem espinhos grelhado na chapa de ferro com ervas finas e manteiga de garrafa.', 'assets/10_porcao_file_tambaqui.png', 'petiscos', ARRAY[]::TEXT[], true),
('Porção de Costelinha Suína', 49.90, 'Costelinha de porco temperada na cachaça e ervas finas, assada na brasa e finalizada na chapa quente com casquinha dourada.', 'assets/11_porcao_costelinha_suina.png', 'petiscos', ARRAY[]::TEXT[], true),
('Porção de Pirarucu', 62.90, 'Lombos suculentos de Pirarucu grelhados com azeite, alcaparras e cebola caramelizada.', 'assets/12_porcao_pirarucu.png', 'petiscos', ARRAY[]::TEXT[], true),

-- === CATEGORIA: COMBOS ===
('Combo de Jack Daniel''s', 299.00, '1 Garrafa de Jack Daniel''s Tennessee Whiskey Old No. 7 (1 Litro) + 4 Energéticos em lata Monster ou Red Bull + Balde de gelo.', 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=400', 'combos', ARRAY[]::TEXT[], true),
('Combo de Buchanan''s Deluxe', 349.00, '1 Garrafa de uísque escocês Buchanan''s Deluxe 12 anos (1 Litro) + 4 Energéticos Red Bull + Gelo de coco artesanal.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400', 'combos', ARRAY[]::TEXT[], true),
('Combo de Vodka (Ciroc, Absolut, Smirnoff ou Kislla)', 229.00, '1 Garrafa de Vodka Importada ou Nacional à sua escolha (Ciroc, Absolut, Smirnoff ou Kislla) + 4 Energéticos + Balde de gelo.', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400', 'combos', ARRAY[]::TEXT[], true),
('Combo de Campari', 199.00, '1 Garrafa de Campari (1 Litro) + 4 latas de água tônica ou soda limonada + Fatias frescas de laranja + Balde de gelo.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400', 'combos', ARRAY[]::TEXT[], true),
('Combo de Tequila', 249.00, '1 Garrafa de Tequila mexicana Jose Cuervo Especial Gold + Fatias de limão fresco + Sal em copinho + Copos de shot.', 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?auto=format&fit=crop&q=80&w=400', 'combos', ARRAY[]::TEXT[], true);
