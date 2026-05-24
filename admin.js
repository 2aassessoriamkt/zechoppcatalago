/* ==========================================================================
   🍺 ZÉ CHOPP - LÓGICA DO DASHBOARD ADMINISTRATIVO (ADMIN CORE JS)
   ========================================================================== */

// --- 1. CONFIGURAÇÕES E ESTADOS ---
let adminProducts = []; // Armazenará os produtos ativos/inativos da base
let isSupabaseConfigured = false;
let userSession = null;
let productToDeleteId = null;

// Mock de fallback na memória para testes sem Supabase
let mockProducts = [
    { id: "mock-1", name: "Chopp Brahma", price: 13.90, description: "O clássico número um.", image_url: "assets/chopp_premium.png", category: "chopps", tags: ["Mais Pedido"], available: true, created_at: new Date() },
    { id: "mock-2", name: "Chopp Pilsen Pantanal", price: 11.90, description: "Direto da torneira!", image_url: "assets/chopp_premium.png", category: "chopps", tags: ["Local"], available: true, created_at: new Date() },
    { id: "mock-3", name: "Batata Palito Crocante", price: 29.90, description: "Porção farta crocante.", image_url: "assets/porcao_batata.png", category: "petiscos", tags: ["Favorito"], available: true, created_at: new Date() },
    { id: "mock-4", name: "Filé Mignon Acebolado", price: 64.90, description: "Tiras macias aceboladas.", image_url: "assets/porcao_picanha.png", category: "petiscos", tags: ["Nobre"], available: true, created_at: new Date() }
];
let mockViews = 428;
let mockViewsToday = 34;

// --- 2. ELEMENTOS DO DOM ---
// Login
const loginContainer = document.getElementById("loginContainer");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");

// Dashboard
const adminDashboard = document.getElementById("adminDashboard");
const logoutBtn = document.getElementById("logoutBtn");
const kpiTotalViews = document.getElementById("kpiTotalViews");
const kpiTodayViews = document.getElementById("kpiTodayViews");
const kpiActiveProducts = document.getElementById("kpiActiveProducts");
const adminSearchInput = document.getElementById("adminSearchInput");
const btnOpenAddModal = document.getElementById("btnOpenAddModal");
const adminProductsCount = document.getElementById("adminProductsCount");
const adminProductsTableBody = document.getElementById("adminProductsTableBody");

// Modal de Produto
const productModalOverlay = document.getElementById("productModalOverlay");
const productModal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const productForm = document.getElementById("productForm");
const productIdInput = document.getElementById("productIdInput");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productCategory = document.getElementById("productCategory");
const productTags = document.getElementById("productTags");
const productImage = document.getElementById("productImage");
const imagePreview = document.getElementById("imagePreview");
const productImageFile = document.getElementById("productImageFile");
const uploadTriggerArea = document.getElementById("uploadTriggerArea");
const uploadText = document.getElementById("uploadText");
const productDescription = document.getElementById("productDescription");
const btnCloseProductModal = document.getElementById("btnCloseProductModal");
const btnCancelProductModal = document.getElementById("btnCancelProductModal");

// Modal de Exclusão
const deleteModalOverlay = document.getElementById("deleteModalOverlay");
const deleteModal = document.getElementById("deleteModal");
const deleteProductName = document.getElementById("deleteProductName");
const btnCancelDelete = document.getElementById("btnCancelDelete");
const btnConfirmDelete = document.getElementById("btnConfirmDelete");

// --- 3. INICIALIZAÇÃO ---
document.addEventListener("DOMContentLoaded", async () => {
    checkSupabaseConfiguration();
    setupEventListeners();
    await checkExistingSession();
});

// Verificar se as credenciais do Supabase no config.js foram configuradas
function checkSupabaseConfiguration() {
    if (typeof SUPABASE_URL !== "undefined" && !SUPABASE_URL.includes("seu-projeto") && supabaseClient) {
        isSupabaseConfigured = true;
        console.log("Supabase ativo no Dashboard administrativo.");
    } else {
        isSupabaseConfigured = false;
        console.warn("Supabase não configurado. Rodando em modo DEMO/MOCK offline.");
    }
}

// Verificar se já existe login gravado
async function checkExistingSession() {
    if (isSupabaseConfigured) {
        try {
            const { data } = await supabaseClient.auth.getSession();
            if (data && data.session) {
                userSession = data.session;
                showDashboard();
            } else {
                showLogin();
            }
        } catch (err) {
            console.error("Erro ao verificar sessão do Supabase:", err);
            showLogin();
        }
    } else {
        // Modo Demo: verifica localStorage simples
        const cachedSession = localStorage.getItem("ze_chopp_demo_login");
        if (cachedSession) {
            userSession = { user: { email: cachedSession } };
            showDashboard();
        } else {
            showLogin();
        }
    }
}

// --- 4. EXIBIÇÃO DE TELAS (ROUTING SIMPLES) ---
function showDashboard() {
    loginContainer.classList.add("hidden");
    adminDashboard.classList.remove("hidden");
    loadDashboardData();
}

function showLogin() {
    loginContainer.classList.remove("hidden");
    adminDashboard.classList.add("hidden");
}

async function loadDashboardData() {
    await fetchKPIs();
    await fetchAdminProducts();
}

// --- 5. AUTENTICAÇÃO (LOGIN / LOGOUT) ---
async function handleLogin(e) {
    e.preventDefault();
    loginError.textContent = "";
    loginSubmitBtn.innerHTML = `Entrando... <i class="fa-solid fa-spinner fa-spin"></i>`;
    loginSubmitBtn.disabled = true;

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    try {
        if (isSupabaseConfigured) {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;
            userSession = data.session;
            showDashboard();
        } else {
            // Modo Demo: Qualquer login com senha 'admin123' ou qualquer e-mail com senha do Zé funciona!
            // Facilitando o teste inicial do usuário
            if (password.length >= 4) {
                userSession = { user: { email: email } };
                localStorage.setItem("ze_chopp_demo_login", email);
                showDashboard();
            } else {
                throw new Error("Senha de teste muito curta! Digite qualquer senha com 4 ou mais dígitos.");
            }
        }
    } catch (err) {
        loginError.textContent = err.message || "E-mail ou senha incorretos.";
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.innerHTML = `Entrar no Painel <i class="fa-solid fa-arrow-right-to-bracket"></i>`;
    }
}

async function handleLogout() {
    if (isSupabaseConfigured) {
        await supabaseClient.auth.signOut();
    } else {
        localStorage.removeItem("ze_chopp_demo_login");
    }
    userSession = null;
    showLogin();
}

// --- 6. BUSCA E ATUALIZAÇÃO DE METRICAS (KPIS) ---
async function fetchKPIs() {
    if (isSupabaseConfigured) {
        try {
            // 1. Leituras totais do QR Code
            const { count: totalCount, error: err1 } = await supabaseClient
                .from("page_views")
                .select("*", { count: "exact", head: true });
            
            if (err1) throw err1;
            kpiTotalViews.textContent = totalCount || 0;

            // 2. Leituras hoje (últimas 24 horas)
            const yesterday = new Date();
            yesterday.setHours(yesterday.getHours() - 24);
            const { count: todayCount, error: err2 } = await supabaseClient
                .from("page_views")
                .select("*", { count: "exact", head: true })
                .gte("viewed_at", yesterday.toISOString());
            
            if (err2) throw err2;
            kpiTodayViews.textContent = todayCount || 0;

            // 3. Contagem de produtos (ativos vs inativos)
            const { data: prodData, error: err3 } = await supabaseClient
                .from("produtos")
                .select("available");
            
            if (err3) throw err3;
            
            const totalProducts = prodData.length;
            const activeProducts = prodData.filter(p => p.available).length;
            kpiActiveProducts.textContent = `${activeProducts} / ${totalProducts}`;

        } catch (err) {
            console.error("Falha ao puxar KPIs analíticos do Supabase:", err.message);
        }
    } else {
        // KPIs Mockados (Demo)
        kpiTotalViews.textContent = mockViews;
        kpiTodayViews.textContent = mockViewsToday;
        const total = mockProducts.length;
        const active = mockProducts.filter(p => p.available).length;
        kpiActiveProducts.textContent = `${active} / ${total}`;
    }
}

// --- 7. CRUD DE PRODUTOS ---
async function fetchAdminProducts() {
    if (isSupabaseConfigured) {
        try {
            const { data, error } = await supabaseClient
                .from("produtos")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            adminProducts = data || [];
        } catch (err) {
            console.error("Erro ao puxar produtos da tabela:", err.message);
        }
    } else {
        adminProducts = [...mockProducts];
    }

    renderAdminTable();
}

function renderAdminTable() {
    adminProductsTableBody.innerHTML = "";
    const filterQuery = adminSearchInput.value.toLowerCase().trim();

    const filtered = adminProducts.filter(p => 
        p.name.toLowerCase().includes(filterQuery) || 
        p.category.toLowerCase().includes(filterQuery)
    );

    adminProductsCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'produto listado' : 'produtos listados'}`;

    if (filtered.length === 0) {
        adminProductsTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #a09fa6;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">🍽️</div>
                    Nenhum produto cadastrado ou encontrado na busca.
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach(product => {
        const tr = document.createElement("tr");
        
        let tagsHTML = "";
        if (product.tags && product.tags.length > 0) {
            tagsHTML = product.tags.map(t => `<span class="table-tag">${t}</span>`).join('');
        }

        // Formatação do Switch iOS
        const switchHTML = `
            <label class="switch">
                <input type="checkbox" ${product.available ? 'checked' : ''} onchange="toggleAvailability('${product.id}', this.checked)">
                <span class="slider"></span>
            </label>
        `;

        tr.innerHTML = `
            <td>
                <img class="table-img" src="${product.image_url || product.image || 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&q=80&w=150'}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&q=80&w=150';">
            </td>
            <td>
                <span class="table-product-name">${product.name}</span>
            </td>
            <td>
                <span class="table-category-badge">${getCategoryIcon(product.category)} ${getCategoryName(product.category)}</span>
            </td>
            <td>
                <span class="table-price">R$ ${parseFloat(product.price).toFixed(2).replace('.', ',')}</span>
            </td>
            <td>
                <div style="max-width: 180px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                    ${tagsHTML || '<span style="color: #72707a;">-</span>'}
                </div>
            </td>
            <td>
                ${switchHTML}
            </td>
            <td>
                <div class="actions-cell">
                    <button class="btn-action edit" onclick="openEditModal('${product.id}')" title="Editar Produto">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-action delete" onclick="openDeleteModal('${product.id}')" title="Excluir Produto">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        adminProductsTableBody.appendChild(tr);
    });
}

// Alteração rápida de disponibilidade (Toggle no switch)
window.toggleAvailability = async function(productId, isAvailable) {
    if (isSupabaseConfigured) {
        try {
            const { error } = await supabaseClient
                .from("produtos")
                .update({ available: isAvailable })
                .eq("id", productId);

            if (error) throw error;
            console.log(`Disponibilidade alterada com sucesso! Produto: ${productId} -> ${isAvailable}`);
        } catch (err) {
            console.error("Erro ao alterar disponibilidade no Supabase:", err.message);
            alert("Erro ao salvar alteração. Tente novamente.");
            fetchAdminProducts(); // recarrega a tabela para desfazer a alteração visual
        }
    } else {
        // Modo Demo
        const idx = mockProducts.findIndex(p => p.id === productId);
        if (idx !== -1) {
            mockProducts[idx].available = isAvailable;
        }
    }
    fetchKPIs(); // Recalcula produtos ativos
}

// Enviar Formulário de Cadastro / Edição
async function handleProductSubmit(e) {
    e.preventDefault();

    const id = productIdInput.value;
    const name = productName.value.trim();
    const price = parseFloat(productPrice.value);
    const category = productCategory.value;
    const desc = productDescription.value.trim();
    const image = productImage.value.trim() || "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&q=80&w=400";
    
    // Tratamento de tags
    const tagsArr = productTags.value.split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

    const productPayload = {
        name: name,
        price: price,
        category: category,
        description: desc,
        image_url: image,
        tags: tagsArr,
        available: true // padrão ativo
    };

    try {
        if (isSupabaseConfigured) {
            if (id) {
                // UPDATE
                const { error } = await supabaseClient
                    .from("produtos")
                    .update(productPayload)
                    .eq("id", id);
                
                if (error) throw error;
            } else {
                // INSERT
                const { error } = await supabaseClient
                    .from("produtos")
                    .insert([productPayload]);
                
                if (error) throw error;
            }
        } else {
            // Modo Demo
            if (id) {
                const idx = mockProducts.findIndex(p => p.id === id);
                if (idx !== -1) {
                    mockProducts[idx] = { ...mockProducts[idx], ...productPayload };
                }
            } else {
                const newId = "mock-" + (mockProducts.length + 1);
                mockProducts.push({
                    id: newId,
                    ...productPayload,
                    created_at: new Date()
                });
            }
        }

        closeProductModal();
        await loadDashboardData();
    } catch (err) {
        console.error("Erro ao salvar produto:", err.message);
        alert("Erro ao salvar o produto no banco: " + err.message);
    }
}

// Deletar Produto
async function confirmDeleteProduct() {
    if (!productToDeleteId) return;

    try {
        if (isSupabaseConfigured) {
            const { error } = await supabaseClient
                .from("produtos")
                .delete()
                .eq("id", productToDeleteId);

            if (error) throw error;
        } else {
            // Modo Demo
            mockProducts = mockProducts.filter(p => p.id !== productToDeleteId);
        }

        closeDeleteModal();
        await loadDashboardData();
    } catch (err) {
        console.error("Erro ao deletar produto:", err.message);
        alert("Erro ao deletar produto do Supabase: " + err.message);
    }
}

// --- 8. CONTROLES DE MODAIS E FORMULÁRIOS ---
window.openEditModal = function(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;

    productIdInput.value = product.id;
    productName.value = product.name;
    productPrice.value = parseFloat(product.price);
    productCategory.value = product.category;
    productTags.value = product.tags ? product.tags.join(', ') : '';
    productImage.value = product.image_url || product.image || '';
    productDescription.value = product.description || '';

    // Preview de Imagem
    imagePreview.src = product.image_url || product.image || 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&q=80&w=150';

    // Reset da área de upload para edição
    if (product.image_url && product.image_url.startsWith('data:image')) {
        uploadText.textContent = "📸 Foto local já carregada (Base64). Clique para alterar.";
    } else {
        uploadText.textContent = "Clique ou toque para carregar foto do celular ou computador";
    }
    productImageFile.value = "";

    modalTitle.textContent = "Editar Produto";
    productModalOverlay.classList.add("active");
    productModal.classList.add("active");
}

window.openDeleteModal = function(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;

    productToDeleteId = product.id;
    deleteProductName.textContent = product.name;
    
    deleteModalOverlay.classList.add("active");
    deleteModal.classList.add("active");
}

function openAddModal() {
    productForm.reset();
    productIdInput.value = "";
    imagePreview.src = 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&q=80&w=150';
    uploadText.textContent = "Clique ou toque para carregar foto do celular ou computador";
    productImageFile.value = "";
    modalTitle.textContent = "Adicionar Novo Produto";
    
    productModalOverlay.classList.add("active");
    productModal.classList.add("active");
}

function closeProductModal() {
    productModalOverlay.classList.remove("active");
    productModal.classList.remove("active");
}

function closeDeleteModal() {
    deleteModalOverlay.classList.remove("active");
    deleteModal.classList.remove("active");
    productToDeleteId = null;
}

// --- 9. AUXILIARES ---
function getCategoryIcon(category) {
    const icons = {
        "chopps": "🍺",
        "cervejas": "🍻",
        "drinks": "🍹",
        "petiscos": "🍟",
        "combos": "🍾"
    };
    return icons[category] || "🍽️";
}

function getCategoryName(category) {
    const names = {
        "chopps": "Chopps",
        "cervejas": "Cervejas",
        "drinks": "Drinks",
        "petiscos": "Porções",
        "combos": "Combos"
    };
    return names[category] || "Outros";
}

// --- 10. SETUP DE EVENT LISTENERS ---
function setupEventListeners() {
    // Autenticação
    loginForm.addEventListener("submit", handleLogin);
    logoutBtn.addEventListener("click", handleLogout);

    // Busca tabela
    adminSearchInput.addEventListener("input", renderAdminTable);

    // Modais Produto
    btnOpenAddModal.addEventListener("click", openAddModal);
    btnCloseProductModal.addEventListener("click", closeProductModal);
    btnCancelProductModal.addEventListener("click", closeProductModal);
    productModalOverlay.addEventListener("click", () => {
        // Apenas fecha se não estiver com modal travado
        closeProductModal();
    });

    // Submissão produto
    productForm.addEventListener("submit", handleProductSubmit);

    // Preview dinâmico de imagem
    productImage.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        imagePreview.src = val || 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&q=80&w=150';
        
        // Limpa seletor se o usuário digitar URL manualmente
        if (val && !val.startsWith('data:image')) {
            uploadText.textContent = "Clique ou toque para carregar foto do celular ou computador";
            productImageFile.value = "";
        }
    });

    // Acionar seletor de arquivo local ao clicar na área tracejada
    uploadTriggerArea.addEventListener("click", () => {
        productImageFile.click();
    });

    // Processar arquivo de imagem local e converter em Base64
    productImageFile.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Limita o tamanho em 1.5MB para evitar estouro de string de banco de dados
        if (file.size > 1.5 * 1024 * 1024) {
            alert("A foto selecionada é muito grande! Escolha uma imagem de até 1.5MB.");
            productImageFile.value = "";
            return;
        }

        const reader = new FileReader();
        uploadText.textContent = "Carregando imagem...";

        reader.onload = (event) => {
            const base64String = event.target.result;
            productImage.value = base64String;
            imagePreview.src = base64String;
            uploadText.textContent = `📸 Foto: ${file.name}`;
            triggerHapticFeedback();
        };

        reader.onerror = (err) => {
            console.error("Erro ao ler arquivo:", err);
            uploadText.textContent = "Erro ao carregar arquivo. Tente novamente.";
        };

        reader.readAsDataURL(file);
    });

    // Suporte a Drag & Drop de arquivos
    uploadTriggerArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadTriggerArea.classList.add("dragover");
    });

    uploadTriggerArea.addEventListener("dragleave", () => {
        uploadTriggerArea.classList.remove("dragover");
    });

    uploadTriggerArea.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadTriggerArea.classList.remove("dragover");
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            productImageFile.files = e.dataTransfer.files;
            
            // Dispara o evento de change
            const event = new Event("change");
            productImageFile.dispatchEvent(event);
        }
    });

    // Modal Exclusão
    btnCancelDelete.addEventListener("click", closeDeleteModal);
    btnConfirmDelete.addEventListener("click", confirmDeleteProduct);
    deleteModalOverlay.addEventListener("click", closeDeleteModal);
}

// Feedback tátil
function triggerHapticFeedback() {
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(40);
    }
}
