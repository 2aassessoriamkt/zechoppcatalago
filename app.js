/* ==========================================================================
   🍺 ZÉ CHOPP - CARDÁPIO DIGITAL & SIMULADOR DE CONTA (JS DINÂMICO SUPABASE)
   ========================================================================== */

// --- 1. BANCO DE DADOS DE FALLBACK OFFLINE (STATIC MOCK DATA) ---
const STATIC_PRODUCTS = [
    // --- CATEGORIA: CHOPPS ---
    {
        id: "chopp-brahma",
        name: "Chopp Brahma",
        price: 13.90,
        description: "O clássico número um. Chopp Brahma claro, leve e refrescante, servido em caneca trincando de gelada com colarinho super cremoso.",
        image: "assets/chopp_premium.png",
        category: "chopps",
        tags: ["Mais Pedido", "Gelado no Grau"]
    },
    {
        id: "chopp-pantanal",
        name: "Chopp Pilsen Pantanal",
        price: 11.90,
        description: "Direto da torneira! Chopp Pilsen regional leve, suave e estupidamente gelado. Perfeito para o happy hour sob o calor de Novo Progresso.",
        image: "assets/chopp_premium.png",
        category: "chopps",
        tags: ["Local", "Refrescante"]
    },
    {
        id: "chopp-vinho",
        name: "Chopp de Vinho",
        price: 14.90,
        description: "A união perfeita do frescor do chopp claro com a doçura e encorpamento do chopp de vinho tinto. Doce e cremoso na medida certa.",
        image: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&q=80&w=400",
        category: "chopps",
        tags: ["Sucesso"]
    },
    {
        id: "chopp-ice",
        name: "Chopp de Ice",
        price: 14.90,
        description: "Uma explosão cítrica de limão com o frescor gelado de ice de pressão. Leve, adocicado e ideal para refrescar a noite.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400",
        category: "chopps",
        tags: ["Novidade"]
    },
    {
        id: "chopp-ipa",
        name: "Chopp IPA",
        price: 17.90,
        description: "Para os amantes de lúpulo. Chopp IPA artesanal sob pressão, com amargor marcante, aroma cítrico e notas frutadas persistentes.",
        image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400",
        category: "chopps",
        tags: ["Artesanal"]
    },
    {
        id: "chopp-apa",
        name: "Chopp APA",
        price: 16.90,
        description: "American Pale Ale direto do barril. Equilíbrio perfeito entre malte e lúpulos americanos aromáticos, com amargor médio e refrescante.",
        image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&q=80&w=400",
        category: "chopps",
        tags: ["Lançamento"]
    },
    {
        id: "chopp-moscow",
        name: "Chopp Drink Moscow Mule",
        price: 18.90,
        description: "Releitura espetacular do clássico cocktail. Chopp leve de pressão saborizado com infusão de limão e o toque picante e refrescante do gengibre.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400",
        category: "chopps",
        tags: ["Sucesso de Vendas"]
    },
    {
        id: "chopp-moscow-zero",
        name: "Chopp Drink Moscow Mule Zero",
        price: 15.90,
        description: "Toda a experiência refrescante do Moscow Mule (limão e gengibre) em formato de chopp de pressão, mas com 0,0% teor alcoólico.",
        image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=400",
        category: "chopps",
        tags: ["Zero Álcool"]
    },
    {
        id: "chopp-pornstar",
        name: "Chopp Porn Star Martini",
        price: 19.90,
        description: "Drink sob pressão afrodisíaco e exótico. Notas marcantes de baunilha, maracujá fresco e um toque sutil e frisante de espumante.",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400",
        category: "chopps",
        tags: ["Exótico", "Premium"]
    },

    // --- CATEGORIA: CERVEJAS ---
    {
        id: "cerveja-heineken-shot",
        name: "Heineken Shot (250 ml)",
        price: 7.90,
        description: "A clássica puro malte holandesa em garrafa pequena (Shot). A quantidade perfeita para você beber estupidamente gelada até o último gole.",
        image: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?auto=format&fit=crop&q=80&w=400",
        category: "cervejas",
        tags: ["Trincando"]
    },
    {
        id: "cerveja-heineken-zero",
        name: "Heineken Zero",
        price: 9.90,
        description: "Todo o sabor inconfundível, amargor perfeitamente equilibrado e qualidade puro malte da Heineken clássica, mas com zero álcool.",
        image: "https://images.unsplash.com/photo-1598063412586-a67b6d822e0b?auto=format&fit=crop&q=80&w=400",
        category: "cervejas",
        tags: ["Zero Álcool"]
    },
    {
        id: "cerveja-imperio",
        name: "Império Gold (210 ml)",
        price: 6.50,
        description: "Cerveja nacional de qualidade superior, puro malte com notas douradas e leveza inigualável. Ideal para acompanhar um dia quente.",
        image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&q=80&w=400",
        category: "cervejas",
        tags: ["Custo-Benefício"]
    },
    {
        id: "cerveja-coronita",
        name: "Coronita (210 ml)",
        price: 7.90,
        description: "A clássica cerveja mexicana em sua simpática e charmosa garrafa menor. Super leve e ideal para ser apreciada com uma fatia de limão.",
        image: "https://images.unsplash.com/photo-1629813876008-db29bf8b6a18?auto=format&fit=crop&q=80&w=400",
        category: "cervejas",
        tags: ["Refrescante"]
    },
    {
        id: "cerveja-corona-zero",
        name: "Corona Zero",
        price: 8.90,
        description: "Toda a refrescância, suavidade e estilo tropical da clássica Corona mexicana, mas em uma versão totalmente livre de álcool.",
        image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=400",
        category: "cervejas",
        tags: ["Zero Álcool"]
    },

    // --- CATEGORIA: DRINKS ---
    {
        id: "drink-caipirinha",
        name: "Caipirinha Clássica",
        price: 18.90,
        description: "O orgulho nacional. Preparada com cachaça artesanal selecionada, limão tahiti espremido na hora, açúcar e muito gelo batido.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400",
        category: "drinks",
        tags: ["Clássico"]
    },
    {
        id: "drink-caipirosca",
        name: "Caipirosca Premium",
        price: 21.90,
        description: "Uma releitura sofisticada. Vodka nacional triplamente destilada e purificada, combinada com limão fresco macerado e açúcar.",
        image: "https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&q=80&w=400",
        category: "drinks",
        tags: ["Mais Pedido"]
    },
    {
        id: "drink-gin-sabores",
        name: "Gin Tônica (Sabores)",
        price: 26.90,
        description: "Gin premium importado, água tônica gelada e infusões exclusivas de frutas e especiarias. Escolha: Limão, Maracujá, Morango ou Frutas Vermelhas.",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400",
        category: "drinks",
        tags: ["Estiloso", "Queridinho"]
    },
    {
        id: "drink-zero-casa",
        name: "Drinks Zero Álcool da Casa",
        price: 16.90,
        description: "Coquetel sem álcool exclusivo criado pelo nosso bartender. Blend refrescante de xarope de frutas artesanal, soda limonada e hortelã.",
        image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=400",
        category: "drinks",
        tags: ["Zero Álcool", "Refrescante"]
    },
    {
        id: "drink-lagoa-azul",
        name: "Lagoa Azul",
        price: 24.90,
        description: "Lindo, refrescante e super saboroso. Mistura clássica à base de vodka, licor Curaçau Blue (que dá o tom azul), limão espremido e refrigerante citrus.",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400",
        category: "drinks",
        tags: ["Visual", "Refrescante"]
    },

    // --- CATEGORIA: PETISCOS (PORÇÕES) ---
    {
        id: "petisco-batata-palito",
        name: "Batata Palito Crocante",
        price: 29.90,
        description: "Uma generosa porção de batatas fritas palito fritas em alta temperatura para garantir maciez interna e casquinha super crocante. Acompanha molho rose.",
        image: "assets/porcao_batata.png",
        category: "petiscos",
        tags: ["Clássico de Boteco"]
    },
    {
        id: "petisco-frios",
        name: "Tábua de Frios do Zé",
        price: 39.90,
        description: "Petisco completo e sortido! Ovos de codorna no azeite, azeitonas verdes suculentas, palmito em rodelas, pepino crocante em conserva e cubos de queijo mussarela premium.",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=400",
        category: "petiscos",
        tags: ["Completa", "Frios"]
    },
    {
        id: "petisco-pururuca",
        name: "Pururuca Suprema",
        price: 19.90,
        description: "Pele de porco selecionada, desidratada e pururucada na hora. Leve, aerada, extremamente crocante e sequinha. O par perfeito para seu Chopp Brahma.",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400",
        category: "petiscos",
        tags: ["Tradicional", "Barato"]
    },
    {
        id: "petisco-quibe-queijo",
        name: "Mini Quibe c/ Queijo (8 un)",
        price: 27.90,
        description: "Porção com 8 unidades de mini quibes artesanais fritos na hora, feitos com carne de primeira moída com hortelã fresca e recheados com mussarela derretida.",
        image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=400",
        category: "petiscos",
        tags: ["Sucesso de Vendas"]
    },
    {
        id: "petisco-frango-passarinho",
        name: "Frango a Passarinho do Zé",
        price: 38.90,
        description: "Tradicionais cortes de frango caipira marinados nas ervas finas, fritos na hora com alho dourado e bastante cheiro-verde picadinho.",
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=400",
        category: "petiscos",
        tags: ["Fartura", "Crocante"]
    },

    // --- CATEGORIA: CARNES & PEIXES ---
    {
        id: "carne-file-acebolado",
        name: "Filé Mignon Acebolado",
        price: 64.90,
        description: "Tiras macias e suculentas de filé mignon nobre grelhadas em chapa de ferro bem quente, com generosa porção de cebolas douradas na manteiga. Acompanha farofa do chefe.",
        image: "assets/porcao_picanha.png",
        category: "peixes-carnes",
        tags: ["Nobre", "Suarento"]
    },
    {
        id: "carne-file-fritas",
        name: "Filé Mignon c/ Fritas",
        price: 74.90,
        description: "A combinação suprema de boteco. Iscas suculentas e macias de filé mignon na chapa acebolada acompanhadas de uma farta porção de batatas palito super douradas.",
        image: "assets/porcao_picanha.png",
        category: "peixes-carnes",
        tags: ["Campeão de Pedidos"]
    },
    {
        id: "carne-calabresa",
        name: "Calabresa Acebolada",
        price: 34.90,
        description: "Linguiça calabresa defumada fatiada de primeira qualidade, salteada na chapa de ferro com bastante cebola em rodelas douradas e salsinha. Simples e saboroso.",
        image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&q=80&w=400",
        category: "peixes-carnes",
        tags: ["O Clássico"]
    },
    {
        id: "carne-costelinha-suina",
        name: "Costelinha Suína na Chapa",
        price: 49.90,
        description: "Costelinha de porco temperada na cachaça e ervas finas, assada na brasa e finalizada na chapa quente para garantir uma casquinha dourada e carne desfiando.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400",
        category: "peixes-carnes",
        tags: ["Deliciosa"]
    },
    {
        id: "peixe-tilapia",
        name: "Iscas de Tilápia Crocantes",
        price: 48.90,
        description: "Iscas generosas de filé de tilápia fresca, empanadas na farinha panko especial e fritas na hora. Super sequinhas e crocantes. Acompanha molho tártaro da casa.",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400",
        category: "peixes-carnes",
        tags: ["Crocante", "Leve"]
    },
    {
        id: "peixe-file-tambaqui",
        name: "Filé de Tambaqui Grelhado",
        price: 56.90,
        description: "O sabor autêntico dos peixes da nossa bacia amazônica. Filé nobre de tambaqui sem espinhos grelhado na chapa de ferro com ervas finas e manteiga de garrafa.",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400",
        category: "peixes-carnes",
        tags: ["Regional", "Saudável"]
    },
    {
        id: "peixe-costelinha-tambaqui",
        name: "Costelinha de Tambaqui Frita",
        price: 52.90,
        description: "As famosas costelinhas de tambaqui da região, cortadas e temperadas no grau, fritas na hora até dourar. Fartas de carne branca, suculenta e saborosa.",
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400",
        category: "peixes-carnes",
        tags: ["Fartura", "Saboroso"]
    },
    {
        id: "peixe-pirarucu",
        name: "Pirarucu na Chapa",
        price: 62.90,
        description: "O gigante da Amazônia servido de forma premium. Lombos suculentos de Pirarucu grelhados com azeite, alcaparras e cebola caramelizada. Sabor refinado e regional.",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400",
        category: "peixes-carnes",
        tags: ["Premium", "Amazônico"]
    },

    // --- CATEGORIA: COMBOS DESTILADOS ---
    {
        id: "combo-jack",
        name: "Combo Jack Daniel's",
        price: 299.00,
        description: "Para os fortes. 1 Garrafa do clássico uísque americano Jack Daniel's Tennessee Whiskey Old No. 7 (1 Litro) + 4 Energéticos em lata Monster ou Red Bull + Balde de gelo.",
        image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=400",
        category: "combos",
        tags: ["Whiskey Premium", "Vibe"]
    },
    {
        id: "combo-buchanans",
        name: "Combo Buchanan's Deluxe",
        price: 349.00,
        description: "Alto padrão. 1 Garrafa do nobre uísque escocês Buchanan's Deluxe 12 anos (1 Litro) + 4 Energéticos Red Bull + Gelo de coco artesanal em balde iluminado.",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400",
        category: "combos",
        tags: ["Elite", "Mais Pedido"]
    },
    {
        id: "combo-vodka-importada",
        name: "Combo de Vodka Premium (Ciroc/Absolut)",
        price: 279.00,
        description: "1 Garrafa de Vodka Importada à sua escolha (Ciroc francesa de uvas finas ou a clássica sueca Absolut) + 4 Energéticos ou 4 refrigerantes Citrus + Balde de gelo redondo.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
        category: "combos",
        tags: ["Vodka Premium", "Balada"]
    },
    {
        id: "combo-vodka-nacional",
        name: "Combo de Vodka (Smirnoff/Kislla)",
        price: 159.00,
        description: "Excelente custo-benefício para brindar com a galera. 1 Garrafa de Vodka (Smirnoff clássica ou a frutada Kislla) + 4 Energéticos nacionais ou refrigerantes + Balde cheio de gelo.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
        category: "combos",
        tags: ["Custo-Benefício"]
    },
    {
        id: "combo-campari",
        name: "Combo de Campari de Boteco",
        price: 199.00,
        description: "O sabor amargo mais charmoso da noite. 1 Garrafa de Campari (1 Litro) + 4 latas de água tônica ou soda limonada + Fatias frescas de laranja + Balde de gelo abundante.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400",
        category: "combos",
        tags: ["Boteco Clássico"]
    },
    {
        id: "combo-tequila",
        name: "Combo de Tequila Jose Cuervo",
        price: 249.00,
        description: "Pra esquentar a noite! 1 Garrafa de Tequila mexicana Jose Cuervo Especial Gold + Fatias de limão fresco + Sal em copinho + Copos de shot. Perfeito para rodadas com amigos.",
        image: "https://images.unsplash.com/photo-1516535794938-6063878f08cc?auto=format&fit=crop&q=80&w=400",
        category: "combos",
        tags: ["Acelera", "Shots"]
    },
    // --- CATEGORIA: BEBIDAS SEM ÁLCOOL (REFRIGERANTES) ---
    {
        id: "refri-lata",
        name: "Refrigerante Lata",
        price: 6.50,
        description: "Coca-Cola, Coca Zero, Guaraná Antarctica, Guaraná Zero, Fanta Laranja ou Sprite. Servido estupidamente gelado.",
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400",
        category: "bebidas",
        tags: ["Gelado"]
    },
    {
        id: "agua-gas",
        name: "Água Mineral com Gás",
        price: 5.00,
        description: "Garrafa de 500ml estupidamente gelada, servida com copo de vidro, gelo e rodela de limão fresco.",
        image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=400",
        category: "bebidas",
        tags: ["Leve"]
    },
    {
        id: "agua-sem-gas",
        name: "Água Mineral sem Gás",
        price: 4.50,
        description: "Garrafa de 500ml estupidamente gelada para refrescar e hidratar durante a noite.",
        image: "https://images.unsplash.com/photo-1608885898957-a599fb18ec3f?auto=format&fit=crop&q=80&w=400",
        category: "bebidas",
        tags: []
    },
    {
        id: "suco-laranja",
        name: "Suco Natural de Laranja",
        price: 9.90,
        description: "Espremido na hora com laranjas frescas selecionadas. Copo de 400ml super refrescante e saudável.",
        image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400",
        category: "bebidas",
        tags: ["Saudável", "Fresco"]
    },
    {
        id: "suco-limao",
        name: "Limonada Suíça Natural",
        price: 8.90,
        description: "Suco natural de limão batido na hora com casca, leite condensado (opcional) e muito gelo. Refrescância insana no copo de 400ml.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400",
        category: "bebidas",
        tags: ["Refrescante"]
    }
];

// --- 2. ESTADO DA APLICAÇÃO (DINÂMICO E REATIVO) ---
let products = []; // Array que receberá os produtos (do Supabase ou Fallback)
let cart = {};
let currentCategory = "todos";
let searchQuery = "";

// --- 3. ELEMENTOS DO DOM ---
const productsGrid = document.getElementById("productsGrid");
const categoriesScroll = document.getElementById("categoriesScroll");
const categoryTitle = document.getElementById("categoryTitle");
const productCountElement = document.getElementById("productCount");
const searchInput = document.getElementById("searchInput");
const cartBar = document.getElementById("cartBar");
const cartBadgeCount = document.getElementById("cartBadgeCount");
const cartTotal = document.getElementById("cartTotal");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartDrawerOverlay = document.getElementById("cartDrawerOverlay");
const cartItemsList = document.getElementById("cartItemsList");
const drawerSubtotal = document.getElementById("drawerSubtotal");
const drawerFee = document.getElementById("drawerFee");
const drawerTotal = document.getElementById("drawerTotal");
const closeDrawerFooterBtn = document.getElementById("closeDrawerFooterBtn");

// --- 4. INICIALIZAÇÃO E INTEGRAÇÃO SUPABASE ---
document.addEventListener("DOMContentLoaded", () => {
    initSupabase();
    setupEventListeners();
});

async function initSupabase() {
    // 1. Registra a leitura do QR Code de forma silenciosa
    registerPageView();
    
    // 2. Carrega os produtos da base
    await fetchProducts();
}

async function registerPageView() {
    try {
        // Verifica se a URL do Supabase é a padrão/placeholder
        if (typeof SUPABASE_URL === "undefined" || SUPABASE_URL.includes("seu-projeto") || !supabaseClient) {
            console.log("Supabase não configurado. Registrando Analytics em modo offline/mock.");
            return;
        }

        const userAgent = navigator.userAgent || "";
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const deviceType = isMobile ? "Mobile" : "Desktop";

        const { error } = await supabaseClient
            .from("page_views")
            .insert([{ device_type: deviceType, user_agent: userAgent }]);

        if (error) throw error;
        console.log("Analytics: Leitura do QR Code registrada com sucesso no Supabase!");
    } catch (err) {
        console.warn("Analytics: Falha silenciosa no registro (Supabase offline/mock):", err.message);
    }
}

async function fetchProducts() {
    try {
        if (typeof SUPABASE_URL === "undefined" || SUPABASE_URL.includes("seu-projeto") || !supabaseClient) {
            console.log("Supabase não configurado. Utilizando cardápio estático local.");
            products = [...STATIC_PRODUCTS];
            sortProductsByCategory();
            renderProducts();
            return;
        }

        const { data, error } = await supabaseClient
            .from("produtos")
            .select("*")
            .eq("available", true);

        if (error) throw error;

        if (data && data.length > 0) {
            // Mapeia do banco para a estrutura interna do frontend
            products = data.map(item => ({
                id: item.id,
                name: item.name,
                price: parseFloat(item.price),
                description: item.description || "",
                image: item.image_url || "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&q=80&w=400",
                category: item.category,
                tags: item.tags || []
            }));
            
            sortProductsByCategory();
            console.log(`Carregados ${products.length} produtos ativos do Supabase!`);
        } else {
            console.log("Banco Supabase sem produtos ativos. Usando mock de fallback.");
            products = [...STATIC_PRODUCTS];
            sortProductsByCategory();
        }
    } catch (err) {
        console.error("Falha ao puxar dados do Supabase. Usando fallback estático local:", err.message);
        products = [...STATIC_PRODUCTS];
        sortProductsByCategory();
    }
    
    renderProducts();
}

// Ordenar produtos por categoria (Chopps sempre primeiro)
function sortProductsByCategory() {
    const CATEGORY_ORDER = {
        "chopps": 1,
        "cervejas": 2,
        "drinks": 3,
        "petiscos": 4,
        "peixes-carnes": 5,
        "combos": 6,
        "bebidas": 7
    };
    
    products.sort((a, b) => {
        const orderA = CATEGORY_ORDER[a.category] || 99;
        const orderB = CATEGORY_ORDER[b.category] || 99;
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        // Se for da mesma categoria, ordena alfabeticamente por nome
        return a.name.localeCompare(b.name, 'pt-BR');
    });
}

// --- 5. RENDERIZAÇÃO DOS CARDÁPIOS ---
function renderProducts() {
    productsGrid.innerHTML = "";
    
    // Filtrar produtos da lista ativa
    const filteredProducts = products.filter(product => {
        const matchesCategory = currentCategory === "todos" || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Atualizar título da seção e quantidade de produtos
    categoryTitle.textContent = getCategoryName(currentCategory);
    productCountElement.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? 'item' : 'itens'}`;

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🍽️</div>
                <h4>Nenhum item encontrado</h4>
                <p>Que tal buscar por outra palavra-chave?</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(product => {
        const qty = cart[product.id] ? cart[product.id].quantity : 0;
        const isAdded = qty > 0;
        
        const card = document.createElement("div");
        card.className = "product-card";
        card.setAttribute("data-id", product.id);

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&q=80&w=400';">
            </div>
            <div class="product-info">
                <div class="product-text">
                    <h4>${product.name}</h4>
                    <p class="product-description">${product.description}</p>
                </div>
                <div class="product-footer">
                    <span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    <div class="action-wrapper" id="action-wrapper-${product.id}">
                        ${isAdded ? `
                            <div class="qty-control">
                                <button class="qty-btn minus" onclick="updateQty('${product.id}', -1)"><i class="fa-solid fa-minus"></i></button>
                                <span class="qty-number">${qty}</span>
                                <button class="qty-btn plus" onclick="updateQty('${product.id}', 1)"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        ` : `
                            <button class="add-to-cart-btn" onclick="addToCart('${product.id}')" title="Adicionar para Somar">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(card);
    });
}

// Obter nome legível da categoria
function getCategoryName(category) {
    const names = {
        "todos": "Cardápio Completo",
        "chopps": "🍺 Chopps Trincando",
        "cervejas": "🍻 Cervejas Geladas",
        "drinks": "🍹 Coquetéis & Drinks",
        "petiscos": "🍟 Porções de Boteco",
        "peixes-carnes": "🥩 Carnes & Peixes Regionais",
        "combos": "🍾 Combos Premium",
        "bebidas": "🥤 Bebidas Sem Álcool"
    };
    return names[category] || "Cardápio";
}

// --- 6. CONTROLE DO CARRINHO (SIMULADOR DE CONTA) ---
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    cart[productId] = {
        product: product,
        quantity: 1
    };

    updateCartUI();
    renderProducts(); // Redesenha para atualizar os controles
    triggerHapticFeedback();
}

window.updateQty = function(productId, delta) {
    if (!cart[productId]) return;

    cart[productId].quantity += delta;

    if (cart[productId].quantity <= 0) {
        delete cart[productId];
    }

    updateCartUI();
    renderProducts();
    triggerHapticFeedback();
}

function updateCartUI() {
    let totalItems = 0;
    let totalPrice = 0;

    for (const key in cart) {
        totalItems += cart[key].quantity;
        totalPrice += cart[key].product.price * cart[key].quantity;
    }

    // Exibir/Esconder a barra de carrinho
    if (totalItems > 0) {
        cartBar.classList.add("visible");
    } else {
        cartBar.classList.remove("visible");
        closeCartDrawer();
    }

    // Atualizar contagem e totais nas views
    cartBadgeCount.textContent = totalItems;
    cartTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    
    // Atualizar Drawer de forma reativa caso esteja aberto
    if (cartDrawer.classList.contains("active")) {
        renderDrawerItems();
    }
}

// --- 7. GAVETA (CART DRAWER) RENDER ---
function renderDrawerItems() {
    cartItemsList.innerHTML = "";
    
    let subtotal = 0;
    let itemsCount = 0;

    for (const key in cart) {
        const item = cart[key];
        const itemTotal = item.product.price * item.quantity;
        subtotal += itemTotal;
        itemsCount++;

        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
            <div class="cart-item-details">
                <span class="cart-item-name">${item.product.name}</span>
                <span class="cart-item-price">R$ ${item.product.price.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="qty-control">
                <button class="qty-btn minus" onclick="updateQty('${item.product.id}', -1)"><i class="fa-solid fa-minus"></i></button>
                <span class="qty-number">${item.quantity}</span>
                <button class="qty-btn plus" onclick="updateQty('${item.product.id}', 1)"><i class="fa-solid fa-plus"></i></button>
            </div>
        `;
        cartItemsList.appendChild(itemDiv);
    }

    if (itemsCount === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-state" style="padding: 40px 0;">
                <div class="empty-icon" style="font-size: 2.5rem;">📊</div>
                <h4>Sua simulação está vazia!</h4>
                <p>Adicione itens para ver quanto vai ficar.</p>
            </div>
        `;
    }

    const serviceFee = subtotal * 0.10; // Taxa de 10% opcional
    const finalTotal = subtotal + serviceFee;

    drawerSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    drawerFee.textContent = `R$ ${serviceFee.toFixed(2).replace('.', ',')}`;
    drawerTotal.textContent = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
}

function openCartDrawer() {
    renderDrawerItems();
    cartDrawer.classList.add("active");
    cartDrawerOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Trava o scroll
}

function closeCartDrawer() {
    cartDrawer.classList.remove("active");
    cartDrawerOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

// --- 8. CONFIGURAÇÃO DE EVENT LISTENERS ---
function setupEventListeners() {
    // Categorias scroll horizontal click
    categoriesScroll.addEventListener("click", (e) => {
        const btn = e.target.closest(".category-btn");
        if (!btn) return;

        // Limpa classe ativa de todos
        document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
        
        // Ativa o clicado
        btn.classList.add("active");
        currentCategory = btn.getAttribute("data-category");
        renderProducts();
        
        // Scroll suave do botão selecionado
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });

    // Busca com de-bounce leve
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = e.target.value;
            renderProducts();
        }, 150);
    });

    // Comanda drawer abrir/fechar
    openCartBtn.addEventListener("click", openCartDrawer);
    closeCartBtn.addEventListener("click", closeCartDrawer);
    closeDrawerFooterBtn.addEventListener("click", closeCartDrawer);
    cartDrawerOverlay.addEventListener("click", closeCartDrawer);
}

// Feedback tátil
function triggerHapticFeedback() {
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(40);
    }
}
