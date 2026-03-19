/**
 * ================================================================================
 * NEXUS PRO - Integração Frontend
 * ================================================================================
 * 
 * Este arquivo mostra como integrar o app.js com o novo backend completo.
 * Copie e adapte as funções necessárias para o seu app.js
 * 
 * ================================================================================
 */

// ===== DB OBJECT ATUALIZADO =====
// Substitua o objeto DB no app.js por este:

const DB = {
    _url: null,
    
    setUrl(url) { 
        this._url = url; 
    },
    
    async _req(action, data = {}) {
        if (!this._url) throw new Error('DB URL não configurada');
        
        const resp = await fetch(this._url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...data })
        });
        
        return resp.json();
    },
    
    // ===== CONEXÃO =====
    ping() { return this._req('ping'); },
    auth(id, senha) { return this._req('auth', { id, senha }); },
    
    // ===== AGENDADORES =====
    agendadores() { return this._req('agendadores'); },
    getAgendadorConfig(agendadorId) { return this._req('getAgendadorConfig', { agendadorId }); },
    setAgendadorConfig(data) { return this._req('setAgendadorConfig', data); },
    
    // ===== AGENDAMENTOS =====
    list(filters) { return this._req('list', filters); },
    create(data) { return this._req('create', data); },
    update(data) { return this._req('update', data); },
    delete(id) { return this._req('delete', { id }); },
    disponibilidade(date, agendadorId) { return this._req('disponibilidade', { date, agendadorId }); },
    
    // ===== CLIENTES =====
    listarClientes() { return this._req('listarClientes'); },
    buscarCliente(termo) { return this._req('buscarCliente', { termo }); },
    cadastrarCliente(data) { return this._req('cadastrarCliente', data); },
    atualizarCliente(data) { return this._req('atualizarCliente', data); },
    excluirCliente(id) { return this._req('excluirCliente', { id }); },
    
    // ===== SERVIÇOS (NOVO!) =====
    listarServicos() { return this._req('listarServicos'); },
    criarServico(data) { return this._req('criarServico', data); },
    atualizarServico(data) { return this._req('atualizarServico', data); },
    excluirServico(id) { return this._req('excluirServico', { id }); },
    
    // ===== PRODUTOS (NOVO!) =====
    listarProdutos() { return this._req('listarProdutos'); },
    criarProduto(data) { return this._req('criarProduto', data); },
    atualizarProduto(data) { return this._req('atualizarProduto', data); },
    excluirProduto(id) { return this._req('excluirProduto', { id }); },
    ajustarEstoque(id, quantidade, tipo) { return this._req('ajustarEstoque', { id, quantidade, tipo }); },
    
    // ===== TRANSAÇÕES/CAIXA (NOVO!) =====
    listarTransacoes(filtros) { return this._req('listarTransacoes', filtros); },
    criarTransacao(data) { return this._req('criarTransacao', data); },
    atualizarTransacao(data) { return this._req('atualizarTransacao', data); },
    excluirTransacao(id) { return this._req('excluirTransacao', { id }); },
    
    // ===== CONFIGURAÇÕES (NOVO!) =====
    getConfig(chave) { return this._req('getConfig', { chave }); },
    setConfig(chave, valor) { return this._req('setConfig', { chave, valor }); },
    getAllConfigs() { return this._req('getAllConfigs'); },
    getTaxasCartao() { return this._req('getTaxasCartao'); },
    setTaxasCartao(taxas) { return this._req('setTaxasCartao', { taxas }); }
};


// ================================================================================
// EXEMPLO: MODIFICAR loadServices() PARA USAR BACKEND
// ================================================================================

async function loadServicesFromBackend() {
    try {
        const result = await DB.listarServicos();
        
        if (result.ok && result.data) {
            AppState.services = result.data;
            renderServices();
        }
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        // Fallback para localStorage
        loadServicesFromStorage();
    }
}

async function saveServiceToBackend(service) {
    try {
        if (service.id) {
            // Atualizar existente
            const result = await DB.atualizarServico(service);
            return result.ok;
        } else {
            // Criar novo
            const result = await DB.criarServico(service);
            if (result.ok) {
                service.id = result.id;
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Erro ao salvar serviço:', error);
        return false;
    }
}


// ================================================================================
// EXEMPLO: MODIFICAR loadProducts() PARA USAR BACKEND
// ================================================================================

async function loadProductsFromBackend() {
    try {
        const result = await DB.listarProdutos();
        
        if (result.ok && result.data) {
            AppState.products = result.data;
            renderProducts();
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        loadProductsFromStorage();
    }
}

async function saveProductToBackend(product) {
    try {
        if (product.id) {
            const result = await DB.atualizarProduto(product);
            return result.ok;
        } else {
            const result = await DB.criarProduto(product);
            if (result.ok) {
                product.id = result.id;
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        return false;
    }
}


// ================================================================================
// EXEMPLO: MODIFICAR loadTransactions() PARA USAR BACKEND
// ================================================================================

async function loadTransactionsFromBackend(filtros = {}) {
    try {
        const result = await DB.listarTransacoes(filtros);
        
        if (result.ok && result.data) {
            AppState.transactions = result.data;
            renderCashier();
        }
    } catch (error) {
        console.error('Erro ao carregar transações:', error);
        loadTransactionsFromStorage();
    }
}

async function saveTransactionToBackend(transaction) {
    try {
        if (transaction.id && AppState.transactions.find(t => t.id === transaction.id)) {
            // Atualizar existente
            const result = await DB.atualizarTransacao(transaction);
            return result.ok;
        } else {
            // Criar nova
            const result = await DB.criarTransacao(transaction);
            if (result.ok) {
                transaction.id = result.id;
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Erro ao salvar transação:', error);
        return false;
    }
}


// ================================================================================
// EXEMPLO: MODIFICAR loadCardFees() PARA USAR BACKEND
// ================================================================================

async function loadCardFeesFromBackend() {
    try {
        const result = await DB.getTaxasCartao();
        
        if (result.ok && result.data) {
            return result.data;
        }
    } catch (error) {
        console.error('Erro ao carregar taxas:', error);
    }
    
    // Retorna padrão se falhar
    return {
        credito: { visa: 3.5, mastercard: 3.5, elo: 4.0, amex: 4.5, hipercard: 4.0 },
        debito: { visa: 2.0, mastercard: 2.0, elo: 2.5, amex: 2.5, hipercard: 2.5 }
    };
}

async function saveCardFeesToBackend(fees) {
    try {
        const result = await DB.setTaxasCartao(fees);
        return result.ok;
    } catch (error) {
        console.error('Erro ao salvar taxas:', error);
        return false;
    }
}


// ================================================================================
// EXEMPLO: SINCRONIZAÇÃO HÍBRIDA (LOCAL + BACKEND)
// ================================================================================

/**
 * Estratégia: 
 * 1. Carregar do backend se conectado
 * 2. Salvar localmente como cache
 * 3. Se offline, usar cache local
 * 4. Sincronizar quando reconectar
 */

async function syncServices() {
    if (!AppState.connected) {
        // Offline - usar local
        loadServicesFromStorage();
        return;
    }
    
    try {
        // Online - carregar do backend
        const result = await DB.listarServicos();
        
        if (result.ok && result.data) {
            AppState.services = result.data;
            // Salvar cache local
            saveServicesToStorage();
            renderServices();
        }
    } catch (error) {
        // Erro de rede - usar cache
        loadServicesFromStorage();
    }
}

async function syncProducts() {
    if (!AppState.connected) {
        loadProductsFromStorage();
        return;
    }
    
    try {
        const result = await DB.listarProdutos();
        
        if (result.ok && result.data) {
            AppState.products = result.data;
            saveProductsToStorage();
            renderProducts();
        }
    } catch (error) {
        loadProductsFromStorage();
    }
}

async function syncTransactions() {
    if (!AppState.connected) {
        loadTransactionsFromStorage();
        return;
    }
    
    try {
        // Carregar últimos 30 dias por padrão
        const hoje = new Date();
        const mes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        
        const result = await DB.listarTransacoes({
            dataInicio: mes.toISOString().split('T')[0],
            dataFim: hoje.toISOString().split('T')[0]
        });
        
        if (result.ok && result.data) {
            AppState.transactions = result.data;
            saveTransactionsToStorage();
            renderCashier();
        }
    } catch (error) {
        loadTransactionsFromStorage();
    }
}


// ================================================================================
// MIGRAÇÃO: ENVIAR DADOS LOCAIS PARA BACKEND
// ================================================================================

async function migrarDadosLocaisParaBackend() {
    const confirma = confirm(
        'Isso irá enviar todos os dados locais (serviços, produtos, transações) para o servidor.\n\n' +
        'Dados já existentes no servidor NÃO serão sobrescritos.\n\n' +
        'Continuar?'
    );
    
    if (!confirma) return;
    
    showToast('Iniciando migração...', 'info');
    
    let sucesso = 0;
    let erros = 0;
    
    // Migrar Serviços
    const services = JSON.parse(localStorage.getItem('nexus_services') || '[]');
    for (const service of services) {
        try {
            const result = await DB.criarServico({
                nome: service.nome,
                preco: service.preco,
                duracao: service.duracao,
                descricao: service.descricao || '',
                icon: service.icon || 'fa-cut'
            });
            if (result.ok) sucesso++;
            else erros++;
        } catch (e) {
            erros++;
        }
    }
    
    // Migrar Produtos
    const products = JSON.parse(localStorage.getItem('nexus_products') || '[]');
    for (const product of products) {
        try {
            const result = await DB.criarProduto({
                nome: product.nome,
                preco: product.preco,
                estoque: product.estoque,
                descricao: product.descricao || '',
                icon: product.icon || 'fa-box'
            });
            if (result.ok) sucesso++;
            else erros++;
        } catch (e) {
            erros++;
        }
    }
    
    // Migrar Transações
    const transactions = JSON.parse(localStorage.getItem('nexus_transactions') || '[]');
    for (const trans of transactions) {
        try {
            const result = await DB.criarTransacao({
                type: trans.type,
                description: trans.description,
                value: trans.value,
                date: trans.date,
                paymentMethod: trans.paymentMethod,
                items: trans.items || []
            });
            if (result.ok) sucesso++;
            else erros++;
        } catch (e) {
            erros++;
        }
    }
    
    showToast(`Migração concluída! ${sucesso} itens enviados, ${erros} erros.`, 'success');
}


// ================================================================================
// MODIFICAÇÕES NO handleConnect() PARA CARREGAR NOVOS DADOS
// ================================================================================

async function handleConnectModificado() {
    // ... código existente de conexão ...
    
    if (pingResult.ok) {
        AppState.connected = true;
        
        // Carregar dados do backend
        await Promise.all([
            syncServices(),
            syncProducts(),
            syncTransactions()
        ]);
        
        // Carregar taxas de cartão
        const taxas = await loadCardFeesFromBackend();
        // ... aplicar taxas ...
    }
}
