/**
 * =============================================
 *  NEXUS PRO - DESKTOP WEB VERSION
 *  Complete Scheduling System
 * =============================================
 */

// =============================================
// INTERNATIONALIZATION (i18n)
// =============================================

const TRANSLATIONS = {
    pt: {
        connect: 'CONECTAR',
        disconnect: 'SAIR',
        cancel: 'CANCELAR',
        save: 'SALVAR',
        delete: 'EXCLUIR',
        confirm: 'CONFIRMAR',
        search: 'Buscar...',
        loading: 'Carregando...',
        home: 'InÃ­cio',
        calendar: 'Agenda',
        clients: 'Clientes',
        stats: 'EstatÃ­sticas',
        settings: 'ConfiguraÃ§Ãµes',
        database: 'BANCO DE DADOS',
        pasteUrl: 'Cole a URL do sistema...',
        login: 'LOGIN',
        next: 'PRÃ“XIMO',
        noAppointments: 'Nenhum agendamento prÃ³ximo',
        today: 'HOJE',
        tomorrow: 'AMANHÃƒ',
        todaySchedule: 'Agenda de hoje',
        syncClients: 'Sincronizar',
        addClient: 'Adicionar cliente',
        name: 'Nome',
        recent: 'Recentes',
        noClients: 'Nenhum cliente encontrado',
        updatingClients: 'Atualizando clientes...',
        clientsLoaded: 'cliente(s) carregado(s)',
        newClientsSynced: 'novo(s) cliente(s) sincronizado(s)!',
        professionals: 'PROFISSIONAIS',
        connectToConfig: 'Conecte-se para configurar profissionais',
        lunchConfig: 'Configure horÃ¡rio de almoÃ§o e status de cada profissional',
        notifications: 'NOTIFICAÃ‡Ã•ES',
        notifyNew: 'Notificar novos agendamentos',
        notifyHint: 'Receba alertas quando novos agendamentos forem criados',
        appearance: 'APARÃŠNCIA',
        lightMode: 'Modo Claro',
        lightModeHint: 'Alterne entre tema escuro e claro',
        language: 'IDIOMA',
        languageHint: 'Selecione o idioma do aplicativo',
        total: 'TOTAL:',
        appointments: 'ATENDIMENTOS',
        bestDay: 'MELHOR DIA:',
        worstDay: 'PIOR DIA:',
        newAppointment: 'NOVO AGENDAMENTO',
        clientName: 'Nome do cliente',
        phone: 'Telefone',
        idNumber: 'CPF',
        birthday: 'AniversÃ¡rio',
        service: 'ServiÃ§o',
        notes: 'ObservaÃ§Ãµes',
        schedule: 'AGENDAR',
        blockTime: 'BLOQUEAR HORÃRIO',
        scheduled: 'Agendado!',
        date: 'Data',
        time: 'HorÃ¡rio',
        professional: 'Profissional',
        clientNotes: 'ObservaÃ§Ãµes',
        newClient: 'NOVO CLIENTE',
        editClient: 'EDITAR CLIENTE',
        clientUpdated: 'Cliente atualizado!',
        clientDeleted: 'Cliente excluÃ­do!',
        clientRegistered: 'Cliente cadastrado!',
        deleteClientTitle: 'Excluir Cliente?',
        clientWillBeRemoved: 'O cliente serÃ¡ removido permanentemente.',
        cancelAppointment: 'Cancelar Agendamento?',
        actionCannotBeUndone: 'Esta aÃ§Ã£o nÃ£o pode ser desfeita.',
        appointmentCancelled: 'Agendamento cancelado!',
        connectionSuccess: 'Conectado com sucesso!',
        connectionError: 'Erro de conexÃ£o',
        saveSuccess: 'Salvo com sucesso!',
        saveError: 'Erro ao salvar',
        deleteSuccess: 'ExcluÃ­do com sucesso!',
        deleteError: 'Erro ao excluir',
        fillNamePhone: 'Preencha nome e telefone',
        clientAlreadyExists: 'Cliente jÃ¡ cadastrado',
        viewModeNoEdit: 'Modo visualizaÃ§Ã£o - nÃ£o Ã© possÃ­vel editar',
        viewModeNoDelete: 'Modo visualizaÃ§Ã£o - nÃ£o Ã© possÃ­vel excluir',
        viewModeNoCreate: 'Modo visualizaÃ§Ã£o - nÃ£o Ã© possÃ­vel criar',
        lunch: 'AlmoÃ§o',
        lunchTime: 'HorÃ¡rio de almoÃ§o',
        lunchStart: 'InÃ­cio',
        lunchEnd: 'Fim',
        lunchSaved: 'HorÃ¡rio de almoÃ§o salvo!',
        lunchApplied: 'AlmoÃ§o aplicado!',
        configureLunchFirst: 'Configure o horÃ¡rio de almoÃ§o primeiro',
        blocked: 'Bloqueado',
        apply: 'Aplicar',
        weekdays: ['Domingo', 'Segunda', 'TerÃ§a', 'Quarta', 'Quinta', 'Sexta', 'SÃ¡bado'],
        weekdaysShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÃB'],
        months: ['Janeiro', 'Fevereiro', 'MarÃ§o', 'Abril', 'Maio', 'Junho', 
                 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        previousAttendances: 'atendimento(s) anterior(es)',
        viewMode: 'Modo visualizaÃ§Ã£o',
        admin: 'Admin',
        welcome: 'Bem-vindo',
        logoutDone: 'Logout realizado',
        connected: 'Conectado!',
        professionalsFound: 'profissional(is)',
        slotsBlocked: 'slots bloqueados',
        daysApplied: 'dias',
        scheduleBlocked: 'Agenda BLOQUEADA!',
        scheduleUnblocked: 'Agenda desbloqueada!',
        noNewAppointments: 'NÃ£o aceita novos agendamentos',
        onlyYourSettings: 'VocÃª sÃ³ pode alterar suas prÃ³prias configuraÃ§Ãµes',
        quickEntry: 'Entrar RÃ¡pido',
        noName: 'Sem Nome',
        loggedIn: 'LOGADO',
        enterSystemUrl: 'Digite a URL do sistema',
        invalidUrl: 'URL invÃ¡lida',
        connectionFailed: 'Falha na conexÃ£o',
        schedulerNotFound: 'Agendador nÃ£o encontrado',
        timesNotConfigured: 'HorÃ¡rios nÃ£o configurados no script',
        urlNotConfigured: 'URL nÃ£o configurada',
        closedThisDay: 'Fechado neste dia',
        selectDay: 'SELECIONAR DIA',
        lockSchedule: 'Travar agenda',
        to: 'atÃ©',
        blockedTime: 'HorÃ¡rio bloqueado',
        appointmentsCount: 'Agendamentos',
        client: 'Cliente',
        professionalFallback: 'Profissional',
        fillPassword: 'Preencha a senha',
        incorrectPassword: 'Senha incorreta',
        unknownError: 'Erro desconhecido',
        invalidLunchTime: 'HorÃ¡rio de almoÃ§o invÃ¡lido',
        applyingLunch: 'Aplicando almoÃ§o',
        blockingLunch: 'Bloqueando horÃ¡rios de almoÃ§o',
        lunchBlockedFor: 'AlmoÃ§o bloqueado para',
        error: 'Erro',
        errorSaving: 'Erro ao salvar',
        errorUpdating: 'Erro ao atualizar',
        errorRegistering: 'Erro ao cadastrar cliente',
        failedToSchedule: 'Falha ao agendar',
        failedToBlock: 'Falha ao bloquear',
        week: 'Semana',
        month: 'MÃªs',
        year: 'Ano',
        revenue: 'Faturamento',
        average: 'MÃ©dia/dia',
        allProfessionals: 'Todos',
        all: 'Todos',
        selectProfessional: 'Selecionar profissional'
    },
    
    en: {
        connect: 'CONNECT',
        disconnect: 'LOGOUT',
        cancel: 'CANCEL',
        save: 'SAVE',
        delete: 'DELETE',
        confirm: 'CONFIRM',
        search: 'Search...',
        loading: 'Loading...',
        home: 'Home',
        calendar: 'Calendar',
        clients: 'Clients',
        stats: 'Statistics',
        settings: 'Settings',
        database: 'DATABASE',
        pasteUrl: 'Paste system URL...',
        login: 'LOGIN',
        next: 'UPCOMING',
        noAppointments: 'No upcoming appointments',
        today: 'TODAY',
        tomorrow: 'TOMORROW',
        todaySchedule: "Today's schedule",
        syncClients: 'Sync',
        addClient: 'Add client',
        name: 'Name',
        recent: 'Recent',
        noClients: 'No clients found',
        updatingClients: 'Updating clients...',
        clientsLoaded: 'client(s) loaded',
        newClientsSynced: 'new client(s) synced!',
        professionals: 'PROFESSIONALS',
        connectToConfig: 'Connect to configure professionals',
        lunchConfig: 'Configure lunch time and status for each professional',
        notifications: 'NOTIFICATIONS',
        notifyNew: 'Notify new appointments',
        notifyHint: 'Receive alerts when new appointments are created',
        appearance: 'APPEARANCE',
        lightMode: 'Light Mode',
        lightModeHint: 'Switch between dark and light theme',
        language: 'LANGUAGE',
        languageHint: 'Select app language',
        total: 'TOTAL:',
        appointments: 'APPOINTMENTS',
        bestDay: 'BEST DAY:',
        worstDay: 'WORST DAY:',
        newAppointment: 'NEW APPOINTMENT',
        clientName: 'Client name',
        phone: 'Phone',
        idNumber: 'ID',
        birthday: 'Birthday',
        service: 'Service',
        notes: 'Notes',
        schedule: 'SCHEDULE',
        blockTime: 'BLOCK TIME',
        scheduled: 'Scheduled!',
        date: 'Date',
        time: 'Time',
        professional: 'Professional',
        clientNotes: 'Notes',
        newClient: 'NEW CLIENT',
        editClient: 'EDIT CLIENT',
        clientUpdated: 'Client updated!',
        clientDeleted: 'Client deleted!',
        clientRegistered: 'Client registered!',
        deleteClientTitle: 'Delete Client?',
        clientWillBeRemoved: 'The client will be permanently removed.',
        cancelAppointment: 'Cancel Appointment?',
        actionCannotBeUndone: 'This action cannot be undone.',
        appointmentCancelled: 'Appointment cancelled!',
        connectionSuccess: 'Connected successfully!',
        connectionError: 'Connection error',
        saveSuccess: 'Saved successfully!',
        saveError: 'Error saving',
        deleteSuccess: 'Deleted successfully!',
        deleteError: 'Error deleting',
        fillNamePhone: 'Fill in name and phone',
        clientAlreadyExists: 'Client already registered',
        viewModeNoEdit: 'View mode - cannot edit',
        viewModeNoDelete: 'View mode - cannot delete',
        viewModeNoCreate: 'View mode - cannot create',
        lunch: 'Lunch',
        lunchTime: 'Lunch time',
        lunchStart: 'Start',
        lunchEnd: 'End',
        lunchSaved: 'Lunch time saved!',
        lunchApplied: 'Lunch applied!',
        configureLunchFirst: 'Configure lunch time first',
        blocked: 'Blocked',
        apply: 'Apply',
        weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        weekdaysShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'],
        previousAttendances: 'previous attendance(s)',
        viewMode: 'View mode',
        admin: 'Admin',
        welcome: 'Welcome',
        logoutDone: 'Logged out',
        connected: 'Connected!',
        professionalsFound: 'professional(s)',
        slotsBlocked: 'slots blocked',
        daysApplied: 'days',
        scheduleBlocked: 'Schedule BLOCKED!',
        scheduleUnblocked: 'Schedule unblocked!',
        noNewAppointments: 'Not accepting new appointments',
        onlyYourSettings: 'You can only change your own settings',
        quickEntry: 'Quick Entry',
        noName: 'No Name',
        loggedIn: 'LOGGED IN',
        enterSystemUrl: 'Enter system URL',
        invalidUrl: 'Invalid URL',
        connectionFailed: 'Connection failed',
        schedulerNotFound: 'Scheduler not found',
        timesNotConfigured: 'Times not configured in script',
        urlNotConfigured: 'URL not configured',
        closedThisDay: 'Closed on this day',
        selectDay: 'SELECT DAY',
        lockSchedule: 'Lock schedule',
        to: 'to',
        blockedTime: 'Blocked time',
        appointmentsCount: 'Appointments',
        client: 'Client',
        professionalFallback: 'Professional',
        fillPassword: 'Enter password',
        incorrectPassword: 'Incorrect password',
        unknownError: 'Unknown error',
        invalidLunchTime: 'Invalid lunch time',
        applyingLunch: 'Applying lunch',
        blockingLunch: 'Blocking lunch times',
        lunchBlockedFor: 'Lunch blocked for',
        error: 'Error',
        errorSaving: 'Error saving',
        errorUpdating: 'Error updating',
        errorRegistering: 'Error registering client',
        failedToSchedule: 'Failed to schedule',
        failedToBlock: 'Failed to block',
        week: 'Week',
        month: 'Month',
        year: 'Year',
        revenue: 'Revenue',
        average: 'Avg/day',
        allProfessionals: 'All',
        all: 'All',
        selectProfessional: 'Select professional'
    }
};

let currentLanguage = 'pt';

function t(key) {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['pt'][key] || key;
}

function getWeekdays() {
    return TRANSLATIONS[currentLanguage]?.weekdays || TRANSLATIONS.pt.weekdays;
}

function getWeekdaysShort() {
    return TRANSLATIONS[currentLanguage]?.weekdaysShort || TRANSLATIONS.pt.weekdaysShort;
}

function getMonths() {
    return TRANSLATIONS[currentLanguage]?.months || TRANSLATIONS.pt.months;
}

function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLanguage = lang;
    localStorage.setItem('nexus_language', lang);
    updateLanguageSelector();
    applyTranslations();
    if (AppState.connected) {
        renderAll();
    }
    showToast(t('saveSuccess'), 'success');
}

function updateLanguageSelector() {
    document.querySelectorAll('.language-btn, .settings-lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    });
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        el.placeholder = t(key);
    });
}

function loadLanguage() {
    const saved = localStorage.getItem('nexus_language');
    if (saved && TRANSLATIONS[saved]) {
        currentLanguage = saved;
    } else {
        const browserLang = navigator.language?.substring(0, 2) || 'pt';
        currentLanguage = TRANSLATIONS[browserLang] ? browserLang : 'pt';
    }
    updateLanguageSelector();
    applyTranslations();
}

// =============================================
// STATE & CONFIG
// =============================================

const AppState = {
    connected: false,
    loggedIn: false,
    currentUser: null,
    savedPassword: null,
    dbUrl: '',
    agendadores: [],
    appointments: [],
    clients: [],
    knownClients: new Map(),
    deletedClients: new Set(),
    clientNotes: {},
    clientData: {},
    horarios: null,
    calendarDate: new Date(),
    statsDate: new Date(),
    statsWeekStart: null,
    statsWeekEnd: null,
    refreshInterval: null,
    pendingDeletions: new Set(),
    selectedProfessional: null,
    statsNeedsAnimation: true,
    services: [],
    products: [],
    transactions: []
};

const REFRESH_INTERVAL_MS = 10000;

// =============================================
// DATABASE API
// =============================================

const DB = {
    async _req(action, body = {}) {
        if (!AppState.dbUrl) {
            return { ok: false, err: t('urlNotConfigured') };
        }
        try {
            // Adicionar timestamp para evitar cache do navegador
            const url = new URL(AppState.dbUrl);
            url.searchParams.set('_t', Date.now());
            
            console.log('[DB] Requisição:', action, 'URL:', url.href);
            const r = await fetch(url.href, {
                method: 'POST',
                redirect: 'follow',
                headers: { 
                    'Content-Type': 'text/plain',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                },
                body: JSON.stringify({ action, ...body }),
                cache: 'no-store' // Força o navegador a não usar cache
            });
            const text = await r.text();
            console.log('[DB] Resposta:', text.substring(0, 200));
            return JSON.parse(text);
        } catch (e) {
            console.error('[DB] Erro completo:', e);
            return { ok: false, err: e.message === 'Failed to fetch' 
                ? 'Sem conexão. Verifique a URL e se o script foi implantado corretamente.' 
                : e.message };
        }
    },

    ping()            { return this._req('ping'); },
    list(filters)     { return this._req('list', filters || {}); },
    create(data)      { return this._req('create', data); },
    update(data)      { return this._req('update', data); },
    delete(id)        { return this._req('delete', { id }); },
    auth(id, senha)   { return this._req('auth', { agendadorId: id, senha }); },
    agendadores()     { return this._req('agendadores'); },
    disponibilidade(date, agendadorId) { return this._req('disponibilidade', { date, agendadorId }); },
    buscarCliente(termo)   { return this._req('buscarCliente', { termo }); },
    cadastrarCliente(data) { return this._req('cadastrarCliente', data); },
    atualizarCliente(data) { return this._req('atualizarCliente', data); },
    excluirCliente(id)     { return this._req('excluirCliente', { id }); },
    listarClientes()       { return this._req('listarClientes'); },
    getAgendadorConfig(agendadorId) { return this._req('getAgendadorConfig', { agendadorId }); },
    setAgendadorConfig(data)        { return this._req('setAgendadorConfig', data); },
    getAllConfigs()                 { return this._req('getAllConfigs'); },
    
    // ===== SERVIÇOS (usando ações legadas para compatibilidade) =====
    serviceList()          { return this._req('listarServicos'); },
    serviceCreate(data)    { return this._req('cadastrarServico', data); },
    serviceUpdate(data)    { return this._req('atualizarServico', data); },
    serviceDelete(id)      { return this._req('excluirServico', { id }); },
    
    // ===== PRODUTOS (usando ações legadas para compatibilidade) =====
    productList()          { return this._req('listarProdutos'); },
    productCreate(data)    { return this._req('cadastrarProduto', data); },
    productUpdate(data)    { return this._req('atualizarProduto', data); },
    productDelete(id)      { return this._req('excluirProduto', { id }); },
    productStockAdd(id, qtd)    { return this._req('PRODUCT_STOCK_ADD', { id, quantidade: qtd }); },
    productStockRemove(id, qtd) { return this._req('PRODUCT_STOCK_REMOVE', { id, quantidade: qtd }); },
    
    // ===== CAIXA (usando ações legadas para compatibilidade) =====
    cashList(filters)      { return this._req('listarCaixa', filters || {}); },
    cashCreate(data)       { return this._req('cadastrarCaixa', data); },
    cashUpdate(data)       { return this._req('atualizarCaixa', data); },
    cashCancel(id, motivo) { return this._req('cancelarCaixa', { id, motivo }); },
    cashReport(filters)    { return this._req('CASH_GET_REPORT', filters || {}); },
    cashItemAdd(data)      { return this._req('CASH_ITEM_ADD', data); },
    cashItemList(movId)    { return this._req('CASH_ITEM_LIST', { movimentacao_id: movId }); },
    cashHistoryGet(movId)  { return this._req('CASH_HISTORY_GET', { movimentacao_id: movId }); },
    
    // ===== BLOQUEIOS =====
    blockList(filters)     { return this._req('BLOCK_LIST', filters || {}); },
    blockCreate(data)      { return this._req('BLOCK_CREATE', data); },
    blockDelete(id)        { return this._req('BLOCK_DELETE', { id }); },
    
    // ===== DIAGNÓSTICO =====
    async diagnose() {
        console.log('');
        console.log('╔══════════════════════════════════════════════════════════════╗');
        console.log('║           DIAGNÓSTICO DO SISTEMA NEXUS v4.0                  ║');
        console.log('╚══════════════════════════════════════════════════════════════╝');
        console.log('');
        
        const report = {
            url: AppState.dbUrl || 'NÃO CONFIGURADA',
            ping: { ok: false, err: '' },
            serviceList: { ok: false, err: '' },
            productList: { ok: false, err: '' },
            cashList: { ok: false, err: '' },
            version: 'DESCONHECIDA',
            scriptvATUALIZADO: false
        };
        
        console.log('📍 URL do Backend:', report.url);
        console.log('');
        
        if (!AppState.dbUrl) {
            console.error('❌ URL do backend não configurada!');
            return report;
        }
        
        // Teste 1: Ping
        console.log('1️⃣ Testando PING...');
        try {
            const pingResult = await this.ping();
            report.ping = pingResult;
            if (pingResult.ok) {
                console.log('   ✅ PING: OK - Sistema conectado');
                if (pingResult.agendadores) {
                    console.log(`   📋 ${pingResult.agendadores.length} profissionais encontrados`);
                }
            } else {
                console.error('   ❌ PING falhou:', pingResult.err);
            }
        } catch (e) {
            console.error('   ❌ PING erro de conexão:', e.message);
            report.ping = { ok: false, err: e.message };
        }
        
        // Teste 2: SERVICE_LIST (ação v4.0)
        console.log('');
        console.log('2️⃣ Testando SERVICE_LIST (recurso v4.0)...');
        try {
            const servResult = await this.serviceList();
            report.serviceList = servResult;
            if (servResult.ok) {
                console.log('   ✅ SERVICE_LIST: OK');
                console.log(`   📋 ${(servResult.servicos || []).length} serviços no backend`);
                report.version = 'v4.0';
                report.scriptvATUALIZADO = true;
            } else {
                console.error('   ❌ SERVICE_LIST falhou:', servResult.err);
                if (servResult.err && servResult.err.includes('desconhecida')) {
                    console.error('   ⚠️⚠️⚠️ SCRIPT DESATUALIZADO! Não suporta SERVICE_LIST ⚠️⚠️⚠️');
                    report.version = 'ANTIGA (sem suporte a serviços/produtos)';
                }
            }
        } catch (e) {
            console.error('   ❌ SERVICE_LIST erro:', e.message);
            report.serviceList = { ok: false, err: e.message };
        }
        
        // Teste 3: PRODUCT_LIST (ação v4.0)
        console.log('');
        console.log('3️⃣ Testando PRODUCT_LIST (recurso v4.0)...');
        try {
            const prodResult = await this.productList();
            report.productList = prodResult;
            if (prodResult.ok) {
                console.log('   ✅ PRODUCT_LIST: OK');
                console.log(`   📋 ${(prodResult.produtos || []).length} produtos no backend`);
            } else {
                console.error('   ❌ PRODUCT_LIST falhou:', prodResult.err);
            }
        } catch (e) {
            console.error('   ❌ PRODUCT_LIST erro:', e.message);
            report.productList = { ok: false, err: e.message };
        }
        
        // Teste 4: CASH_LIST (ação v4.0)
        console.log('');
        console.log('4️⃣ Testando CASH_LIST (recurso v4.0)...');
        try {
            const cashResult = await this.cashList();
            report.cashList = cashResult;
            if (cashResult.ok) {
                console.log('   ✅ CASH_LIST: OK');
                console.log(`   📋 ${(cashResult.movimentacoes || []).length} movimentações no backend`);
            } else {
                console.error('   ❌ CASH_LIST falhou:', cashResult.err);
            }
        } catch (e) {
            console.error('   ❌ CASH_LIST erro:', e.message);
            report.cashList = { ok: false, err: e.message };
        }
        
        // Resumo Final
        console.log('');
        console.log('╔══════════════════════════════════════════════════════════════╗');
        console.log('║                      RESULTADO FINAL                         ║');
        console.log('╚══════════════════════════════════════════════════════════════╝');
        
        if (report.scriptvATUALIZADO) {
            console.log('✅✅✅ SCRIPT v4.0 INSTALADO CORRETAMENTE! ✅✅✅');
            console.log('');
            console.log('O sistema está funcionando 100% com backend.');
        } else {
            console.error('');
            console.error('❌❌❌ SCRIPT DESATUALIZADO! ❌❌❌');
            console.error('');
            console.error('O script no Google Sheets NÃO suporta serviços/produtos.');
            console.error('');
            console.error('SOLUÇÃO:');
            console.error('1. Vá em Configurações > Gerador de Script');
            console.error('2. Configure admin e agendadores');
            console.error('3. Clique em GERAR SCRIPT');
            console.error('4. Copie o novo script v4.0');
            console.error('5. Cole no Google Apps Script (substitua TODO o código antigo)');
            console.error('6. Implantar > Nova implantação');
            console.error('7. Use a NOVA URL gerada');
        }
        
        console.log('');
        return report;
    }
};

// =============================================
// LEGACY COMPATIBILITY - DEPRECATED FUNCTIONS
// Estas funções são no-ops porque loadAllData() já carrega
// tudo do backend no início. Mantidas para compatibilidade.
// =============================================
function loadServicesFromStorage() {
    // NO-OP: dados já carregados do backend via loadAllData()
    console.log('[DEPRECATED] loadServicesFromStorage - usar DB.serviceList()');
}
function loadProductsFromStorage() {
    // NO-OP: dados já carregados do backend via loadAllData()
    console.log('[DEPRECATED] loadProductsFromStorage - usar DB.productList()');
}
function loadTransactionsFromStorage() {
    // NO-OP: dados já carregados do backend via loadAllData()
    console.log('[DEPRECATED] loadTransactionsFromStorage - usar DB.cashList()');
}
function saveServicesToStorage() {
    // NO-OP: salvamento é feito via DB.serviceCreate/Update()
    console.log('[DEPRECATED] saveServicesToStorage - usar DB.serviceCreate/Update()');
}
function saveProductsToStorage() {
    // NO-OP: salvamento é feito via DB.productCreate/Update()
    console.log('[DEPRECATED] saveProductsToStorage - usar DB.productCreate/Update()');
}
function saveTransactionsToStorage() {
    // NO-OP: salvamento é feito via DB.cashCreate/Update()
    console.log('[DEPRECATED] saveTransactionsToStorage - usar DB.cashCreate/Update()');
}

// =============================================
// STORAGE
// =============================================

function loadConfig() {
    try {
        AppState.dbUrl = localStorage.getItem('nexus_db_url') || '';
        
        const savedCredentials = localStorage.getItem('nexus_credentials');
        if (savedCredentials) {
            const creds = JSON.parse(savedCredentials);
            AppState.currentUser = creds.user || null;
            AppState.savedPassword = creds.password || null;
            AppState.loggedIn = !!creds.user;
        }
        
        const savedTheme = localStorage.getItem('nexus_theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            const toggle = document.getElementById('themeToggle');
            if (toggle) toggle.checked = true;
        }
        
        // Client data agora vem 100% do backend (tabela Clientes)
        // NÃO carregar de localStorage
        
    } catch (e) {
        console.error('Error loading config:', e);
    }
}

function saveConfig() {
    try {
        if (AppState.dbUrl) {
            localStorage.setItem('nexus_db_url', AppState.dbUrl);
        } else {
            localStorage.removeItem('nexus_db_url');
        }
        
        if (AppState.loggedIn && AppState.currentUser && AppState.savedPassword) {
            localStorage.setItem('nexus_credentials', JSON.stringify({
                user: AppState.currentUser,
                password: AppState.savedPassword
            }));
        }
        
        // Client data agora é salvo 100% no backend (tabela Clientes)
        // NÃO salvar em localStorage
        
    } catch (e) {
        console.error('Error saving config:', e);
        // Notificar usuÃ¡rio sobre erro de armazenamento (quota excedida)
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            showToast('Armazenamento cheio! Limpe dados antigos.', 'error');
        }
    }
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Only trigger if no modal is open and not typing in an input
        const modalActive = document.querySelector('.modal.active');
        const isTyping = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
        
        if (modalActive || isTyping) return;
        
        // Check if we're on the cashier screen
        const cashierScreen = document.getElementById('screen-cashier');
        if (!cashierScreen || !cashierScreen.classList.contains('active')) return;
        
        const key = e.key.toUpperCase();
        
        if (key === 'E') {
            e.preventDefault();
            openTransactionModal();
            // Wait for modal to open, then select income
            setTimeout(() => {
                const incomeBtn = document.querySelector('.transaction-type-btn[data-type="income"]');
                if (incomeBtn && !incomeBtn.classList.contains('active')) {
                    selectTransactionType('income');
                }
            }, 100);
        } else if (key === 'S') {
            e.preventDefault();
            openTransactionModal();
            // Wait for modal to open, then select expense
            setTimeout(() => {
                selectTransactionType('expense');
            }, 100);
        }
    });
}

