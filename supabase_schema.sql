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
-- 🍺 CARDÁPIO COMPLETO OFICIAL DO ZÉ CHOPP (43 PRODUTOS CADASTRADOS)
-- ==========================================================================
INSERT INTO public.produtos (name, price, description, image_url, category, tags, available) VALUES
-- --- CHOPPS ---
('Chopp Brahma', 13.90, 'O clássico número um. Chopp Brahma claro, leve e refrescante, servido em caneca trincando de gelada com colarinho super cremoso.', 'assets/chopp_premium.png', 'chopps', ARRAY['Mais Pedido', 'Gelado no Grau'], true),
('Chopp Pilsen Pantanal', 11.90, 'Direto da torneira! Chopp Pilsen regional leve, suave e estupidamente gelado. Perfeito para o happy hour sob o calor de Novo Progresso.', 'assets/chopp_premium.png', 'chopps', ARRAY['Local', 'Refrescante'], true),
('Chopp de Vinho', 14.90, 'A união perfeita do frescor do chopp claro com a doçura e encorpamento do chopp de vinho tinto. Doce e cremoso na medida certa.', 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&q=80&w=400', 'chopps', ARRAY['Sucesso'], true),
('Chopp de Ice', 14.90, 'Uma explosão cítrica de limão com o frescor gelado de ice de pressão. Leve, adocicado e ideal para refrescar a noite.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400', 'chopps', ARRAY['Novidade'], true),
('Chopp IPA', 17.90, 'Para os amantes de lúpulo. Chopp IPA artesanal sob pressão, com amargor marcante, aroma cítrico e notas frutadas persistentes.', 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400', 'chopps', ARRAY['Artesanal'], true),
('Chopp APA', 16.90, 'American Pale Ale direto do barril. Equilíbrio perfeito entre malte e lúpulos americanos aromáticos, com amargor médio e refrescante.', 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&q=80&w=400', 'chopps', ARRAY['Lançamento'], true),
('Chopp Drink Moscow Mule', 18.90, 'Releitura espetacular do clássico cocktail. Chopp leve de pressão saborizado com infusão de limão e o toque picante e refrescante do gengibre.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400', 'chopps', ARRAY['Sucesso de Vendas'], true),
('Chopp Drink Moscow Mule Zero', 15.90, 'Toda a experiência refrescante do Moscow Mule (limão e gengibre) em formato de chopp de pressão, mas com 0,0% teor alcoólico.', 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=400', 'chopps', ARRAY['Zero Álcool'], true),
('Chopp Porn Star Martini', 19.90, 'Drink sob pressão afrodisíaco e exótico. Notas marcantes de baunilha, maracujá fresco e um toque sutil e frisante de espumante.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400', 'chopps', ARRAY['Exótico', 'Premium'], true),

-- --- CERVEJAS ---
('Heineken Shot (250 ml)', 7.90, 'A clássica puro malte holandesa em garrafa pequena (Shot). A quantidade perfeita para você beber estupidamente gelada até o último gole.', 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?auto=format&fit=crop&q=80&w=400', 'cervejas', ARRAY['Trincando'], true),
('Heineken Zero', 9.90, 'Todo o sabor inconfundível, amargor perfeitamente equilibrado e qualidade puro malte da Heineken clássica, mas com zero álcool.', 'https://images.unsplash.com/photo-1598063412586-a67b6d822e0b?auto=format&fit=crop&q=80&w=400', 'cervejas', ARRAY['Zero Álcool'], true),
('Império Gold (210 ml)', 6.50, 'Cerveja nacional de qualidade superior, puro malte com notas douradas e leveza inigualável. Ideal para acompanhar um dia quente.', 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&q=80&w=400', 'cervejas', ARRAY['Custo-Benefício'], true),
('Coronita (210 ml)', 7.90, 'A clássica cerveja mexicana em sua simpática e charmosa garrafa menor. Super leve e ideal para ser apreciada com uma fatia de limão.', 'https://images.unsplash.com/photo-1629813876008-db29bf8b6a18?auto=format&fit=crop&q=80&w=400', 'cervejas', ARRAY['Refrescante'], true),
('Corona Zero', 8.90, 'Toda a refrescância, suavidade e estilo tropical da clássica Corona mexicana, mas em uma versão totalmente livre de álcool.', 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=400', 'cervejas', ARRAY['Zero Álcool'], true),

-- --- DRINKS ---
('Caipirinha Clássica', 18.90, 'O orgulho nacional. Preparada com cachaça artesanal selecionada, limão tahiti espremido na hora, açúcar e muito gelo batido.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400', 'drinks', ARRAY['Clássico'], true),
('Caipirosca Premium', 21.90, 'Uma releitura sofisticada. Vodka nacional triplamente destilada e purificada, combinada com limão fresco macerado e açúcar.', 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&q=80&w=400', 'drinks', ARRAY['Mais Pedido'], true),
('Gin Tônica (Sabores)', 26.90, 'Gin premium importado, água tônica gelada e infusões exclusivas de frutas e especiarias. Escolha: Limão, Maracujá, Morango ou Frutas Vermelhas.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400', 'drinks', ARRAY['Estiloso', 'Queridinho'], true),
('Drinks Zero Álcool da Casa', 16.90, 'Coquetel sem álcool exclusivo criado pelo nosso bartender. Blend refrescante de xarope de frutas artesanal, soda limonada e hortelã.', 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=400', 'drinks', ARRAY['Zero Álcool', 'Refrescante'], true),
('Lagoa Azul', 24.90, 'Lindo, refrescante e super saboroso. Mistura clássica à base de vodka, licor Curaçau Blue (que dá o tom azul), limão espremido e refrigerante citrus.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400', 'drinks', ARRAY['Visual', 'Refrescante'], true),

-- --- PORÇÕES (PETISCOS) ---
('Batata Palito Crocante', 29.90, 'Uma generosa porção de batatas fritas palito fritas em alta temperatura para garantir maciez interna e casquinha super crocante. Acompanha molho rose.', 'assets/porcao_batata.png', 'petiscos', ARRAY['Clássico de Boteco'], true),
('Tábua de Frios do Zé', 39.90, 'Petisco completo e sortido! Ovos de codorna no azeite, azeitonas verdes suculentas, palmito em rodelas, pepino crocante em conserva e cubos de queijo mussarela premium.', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=400', 'petiscos', ARRAY['Completa', 'Frios'], true),
('Pururuca Suprema', 19.90, 'Pele de porco selecionada, desidratada e pururucada na hora. Leve, aerada, extremamente crocante e sequinha. O par perfeito para seu Chopp Brahma.', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400', 'petiscos', ARRAY['Tradicional', 'Barato'], true),
('Mini Quibe c/ Queijo (8 un)', 27.90, 'Porção com 8 unidades de mini quibes artesanais fritos na hora, feitos com carne de primeira moída com hortelã fresca e recheados com mussarela derretida.', 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=400', 'petiscos', ARRAY['Sucesso de Vendas'], true),
('Frango a Passarinho do Zé', 38.90, 'Tradicionais cortes de frango caipira marinados nas ervas finas, fritos na hora com alho dourado e bastante cheiro-verde picadinho.', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=400', 'petiscos', ARRAY['Fartura', 'Crocante'], true),

-- --- CARNES & PEIXES ---
('Filé Mignon Acebolado', 64.90, 'Tiras macias e suculentas de filé mignon nobre grelhadas em chapa de ferro bem quente, com generosa porção de cebolas douradas na manteiga. Acompanha farofa do chefe.', 'assets/porcao_picanha.png', 'peixes-carnes', ARRAY['Nobre', 'Suarento'], true),
('Filé Mignon c/ Fritas', 74.90, 'A combinação suprema de boteco. Iscas suculentas e macias de filé mignon na chapa acebolada acompanhadas de uma farta porção de batatas palito super douradas.', 'assets/porcao_picanha.png', 'peixes-carnes', ARRAY['Campeão de Pedidos'], true),
('Calabresa Acebolada', 34.90, 'Linguiça calabresa defumada fatiada de primeira qualidade, salteada na chapa de ferro com bastante cebola em rodelas douradas e salsinha. Simples e saboroso.', 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&q=80&w=400', 'peixes-carnes', ARRAY['O Clássico'], true),
('Costelinha Suína na Chapa', 49.90, 'Costelinha de porco temperada na cachaça e ervas finas, assada na brasa e finalizada na chapa quente para garantir uma casquinha dourada e carne desfiando.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400', 'peixes-carnes', ARRAY['Deliciosa'], true),
('Iscas de Tilápia Crocantes', 48.90, 'Iscas generosas de filé de tilápia fresca, empanadas na farinha panko especial e fritas na hora. Super sequinhas e crocantes. Acompanha molho tártaro da casa.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', 'peixes-carnes', ARRAY['Crocante', 'Leve'], true),
('Filé de Tambaqui Grelhado', 56.90, 'O sabor autêntico dos peixes da nossa bacia amazônica. Filé nobre de tambaqui sem espinhos grelhado na chapa de ferro com ervas finas e manteiga de garrafa.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', 'peixes-carnes', ARRAY['Regional', 'Saudável'], true),
('Costelinha de Tambaqui Frita', 52.90, 'As famosas costelinhas de tambaqui da região, cortadas e temperadas no grau, fritas na hora até dourar. Fartas de carne branca, suculenta e saborosa.', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400', 'peixes-carnes', ARRAY['Fartura', 'Saboroso'], true),
('Pirarucu na Chapa', 62.90, 'O gigante da Amazônia servido de forma premium. Lombos suculentos de Pirarucu grelhados com azeite, alcaparras e cebola caramelizada. Sabor refinado e regional.', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400', 'peixes-carnes', ARRAY['Premium', 'Amazônico'], true),

-- --- COMBOS ---
('Combo Jack Daniel''s', 299.00, 'Para os fortes. 1 Garrafa do clássico uísque americano Jack Daniel''s Tennessee Whiskey Old No. 7 (1 Litro) + 4 Energéticos em lata Monster ou Red Bull + Balde de gelo.', 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=400', 'combos', ARRAY['Whiskey Premium', 'Vibe'], true),
('Combo Buchanan''s Deluxe', 349.00, 'Alto padrão. 1 Garrafa do nobre uísque escocês Buchanan''s Deluxe 12 anos (1 Litro) + 4 Energéticos Red Bull + Gelo de coco artesanal em balde iluminado.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400', 'combos', ARRAY['Elite', 'Mais Pedido'], true),
('Combo de Vodka Premium (Ciroc/Absolut)', 279.00, '1 Garrafa de Vodka Importada à sua escolha (Ciroc francesa de uvas finas ou a clássica sueca Absolut) + 4 Energéticos ou 4 refrigerantes Citrus + Balde de gelo redondo.', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400', 'combos', ARRAY['Vodka Premium', 'Balada'], true),
('Combo de Vodka (Smirnoff/Kislla)', 159.00, 'Excelente custo-benefício para brindar com a galera. 1 Garrafa de Vodka (Smirnoff clássica ou a frutada Kislla) + 4 Energéticos nacionais ou refrigerantes + Balde cheio de gelo.', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400', 'combos', ARRAY['Custo-Benefício'], true),
('Combo de Campari de Boteco', 199.00, 'O sabor amargo mais charmoso da noite. 1 Garrafa de Campari (1 Litro) + 4 latas de água tônica ou soda limonada + Fatias frescas de laranja + Balde de gelo abundante.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400', 'combos', ARRAY['Boteco Clássico'], true),
('Combo de Tequila Jose Cuervo', 249.00, 'Pra esquentar a noite! 1 Garrafa de Tequila mexicana Jose Cuervo Especial Gold + Fatias de limão fresco + Sal em copinho + Copos de shot. Perfeito para rodadas com amigos.', 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?auto=format&fit=crop&q=80&w=400', 'combos', ARRAY['Acelera', 'Shots'], true),

-- --- BEBIDAS SEM ÁLCOOL ---
('Refrigerante Lata', 6.50, 'Coca-Cola, Coca Zero, Guaraná Antarctica, Guaraná Zero, Fanta Laranja ou Sprite. Servido estupidamente gelado.', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400', 'bebidas', ARRAY['Gelado'], true),
('Água Mineral com Gás', 5.00, 'Garrafa de 500ml estupidamente gelada, servida com copo de vidro, gelo e rodela de limão fresco.', 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=400', 'bebidas', ARRAY['Leve'], true),
('Água Mineral sem Gás', 4.50, 'Garrafa de 500ml estupidamente gelada para refrescar e hidratar durante a noite.', 'https://images.unsplash.com/photo-1608885898957-a599fb18ec3f?auto=format&fit=crop&q=80&w=400', 'bebidas', ARRAY[]::TEXT[], true),
('Suco Natural de Laranja', 9.90, 'Espremido na hora com laranjas frescas selecionadas. Copo de 400ml super refrescante e saudável.', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400', 'bebidas', ARRAY['Saudável', 'Fresco'], true),
('Suco de Limonada Suíça', 8.90, 'Suco natural de limão batido na hora com casca, leite condensado (opcional) e muito gelo. Refrescância insana no copo de 400ml.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400', 'bebidas', ARRAY['Refrescante'], true);

