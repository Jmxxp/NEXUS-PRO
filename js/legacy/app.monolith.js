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
        home: 'Início',
        calendar: 'Agenda',
        clients: 'Clientes',
        stats: 'Estatísticas',
        settings: 'Configurações',
        database: 'BANCO DE DADOS',
        pasteUrl: 'Cole a URL do sistema...',
        login: 'LOGIN',
        next: 'PRÓXIMO',
        noAppointments: 'Nenhum agendamento próximo',
        today: 'HOJE',
        tomorrow: 'AMANHÃ',
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
        lunchConfig: 'Configure horário de almoço e status de cada profissional',
        notifications: 'NOTIFICAÇÕES',
        notifyNew: 'Notificar novos agendamentos',
        notifyHint: 'Receba alertas quando novos agendamentos forem criados',
        appearance: 'APARÊNCIA',
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
        birthday: 'Aniversário',
        service: 'Serviço',
        notes: 'Observações',
        schedule: 'AGENDAR',
        blockTime: 'BLOQUEAR HORÁRIO',
        scheduled: 'Agendado!',
        date: 'Data',
        time: 'Horário',
        professional: 'Profissional',
        clientNotes: 'Observações',
        newClient: 'NOVO CLIENTE',
        editClient: 'EDITAR CLIENTE',
        clientUpdated: 'Cliente atualizado!',
        clientDeleted: 'Cliente excluído!',
        clientRegistered: 'Cliente cadastrado!',
        deleteClientTitle: 'Excluir Cliente?',
        clientWillBeRemoved: 'O cliente será removido permanentemente.',
        cancelAppointment: 'Cancelar Agendamento?',
        actionCannotBeUndone: 'Esta ação não pode ser desfeita.',
        appointmentCancelled: 'Agendamento cancelado!',
        connectionSuccess: 'Conectado com sucesso!',
        connectionError: 'Erro de conexão',
        saveSuccess: 'Salvo com sucesso!',
        saveError: 'Erro ao salvar',
        deleteSuccess: 'Excluído com sucesso!',
        deleteError: 'Erro ao excluir',
        fillNamePhone: 'Preencha nome e telefone',
        clientAlreadyExists: 'Cliente já cadastrado',
        viewModeNoEdit: 'Modo visualização - não é possível editar',
        viewModeNoDelete: 'Modo visualização - não é possível excluir',
        viewModeNoCreate: 'Modo visualização - não é possível criar',
        lunch: 'Almoço',
        lunchTime: 'Horário de almoço',
        lunchStart: 'Início',
        lunchEnd: 'Fim',
        lunchSaved: 'Horário de almoço salvo!',
        lunchApplied: 'Almoço aplicado!',
        configureLunchFirst: 'Configure o horário de almoço primeiro',
        blocked: 'Bloqueado',
        apply: 'Aplicar',
        weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        weekdaysShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'],
        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        previousAttendances: 'atendimento(s) anterior(es)',
        viewMode: 'Modo visualização',
        admin: 'Admin',
        welcome: 'Bem-vindo',
        logoutDone: 'Logout realizado',
        connected: 'Conectado!',
        professionalsFound: 'profissional(is)',
        slotsBlocked: 'slots bloqueados',
        daysApplied: 'dias',
        scheduleBlocked: 'Agenda BLOQUEADA!',
        scheduleUnblocked: 'Agenda desbloqueada!',
        noNewAppointments: 'Não aceita novos agendamentos',
        onlyYourSettings: 'Você só pode alterar suas próprias configurações',
        quickEntry: 'Entrar Rápido',
        noName: 'Sem Nome',
        loggedIn: 'LOGADO',
        enterSystemUrl: 'Digite a URL do sistema',
        invalidUrl: 'URL inválida',
        connectionFailed: 'Falha na conexão',
        schedulerNotFound: 'Agendador não encontrado',
        timesNotConfigured: 'Horários não configurados no script',
        urlNotConfigured: 'URL não configurada',
        closedThisDay: 'Fechado neste dia',
        selectDay: 'SELECIONAR DIA',
        lockSchedule: 'Travar agenda',
        to: 'até',
        blockedTime: 'Horário bloqueado',
        appointmentsCount: 'Agendamentos',
        client: 'Cliente',
        professionalFallback: 'Profissional',
        fillPassword: 'Preencha a senha',
        incorrectPassword: 'Senha incorreta',
        unknownError: 'Erro desconhecido',
        invalidLunchTime: 'Horário de almoço inválido',
        applyingLunch: 'Aplicando almoço',
        blockingLunch: 'Bloqueando horários de almoço',
        lunchBlockedFor: 'Almoço bloqueado para',
        error: 'Erro',
        errorSaving: 'Erro ao salvar',
        errorUpdating: 'Erro ao atualizar',
        errorRegistering: 'Erro ao cadastrar cliente',
        failedToSchedule: 'Falha ao agendar',
        failedToBlock: 'Falha ao bloquear',
        week: 'Semana',
        month: 'Mês',
        year: 'Ano',
        revenue: 'Faturamento',
        average: 'Média/dia',
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
            const r = await fetch(AppState.dbUrl, {
                method: 'POST',
                redirect: 'follow',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action, ...body })
            });
            const text = await r.text();
            return JSON.parse(text);
        } catch (e) {
            console.error('DB Error:', e);
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
    getAllConfigs()                 { return this._req('getAllConfigs'); }
};

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
        
        const savedClientNotes = localStorage.getItem('nexus_client_notes');
        if (savedClientNotes) AppState.clientNotes = JSON.parse(savedClientNotes);
        
        const savedClientData = localStorage.getItem('nexus_client_data');
        if (savedClientData) AppState.clientData = JSON.parse(savedClientData);
        
        const savedDeletedClients = localStorage.getItem('nexus_deleted_clients');
        if (savedDeletedClients) AppState.deletedClients = new Set(JSON.parse(savedDeletedClients));
        
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
        
        localStorage.setItem('nexus_client_notes', JSON.stringify(AppState.clientNotes));
        localStorage.setItem('nexus_client_data', JSON.stringify(AppState.clientData));
        localStorage.setItem('nexus_deleted_clients', JSON.stringify([...AppState.deletedClients]));
        
    } catch (e) {
        console.error('Error saving config:', e);
        // Notificar usuário sobre erro de armazenamento (quota excedida)
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

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', async () => {
    loadConfig();
    loadLanguage();
    initClock();
    initNavigation();
    initThemeToggle();
    initModals();
    initLoginScreen();
    initDateSelectors();
    initFilters();
    initLanguageSelector();
    initKeyboardShortcuts();
    
    const dbUrlInput = document.getElementById('dbUrl');
    const settingsDbInput = document.getElementById('settingsDbUrl');
    if (dbUrlInput && AppState.dbUrl) dbUrlInput.value = AppState.dbUrl;
    if (settingsDbInput && AppState.dbUrl) settingsDbInput.value = AppState.dbUrl;
    
    if (AppState.dbUrl && AppState.loggedIn && AppState.currentUser) {
        const connected = await tryConnect(AppState.dbUrl);
        if (connected) {
            hideLoadingScreen();
            hideLoginScreen();
            showMainApp();
        } else {
            hideLoadingScreen();
            showLoginScreen();
        }
    } else {
        hideLoadingScreen();
        showLoginScreen();
    }
});

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

function showLoginScreen() {
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.classList.add('active');
    }
}

function hideLoginScreen() {
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.classList.remove('active');
    }
}

function initLoginScreen() {
    const btnConectar = document.querySelector('.btn-conectar');
    if (btnConectar) {
        btnConectar.addEventListener('click', conectarDB);
    }
    
    const btnSettingsConnect = document.getElementById('btnSettingsConnect');
    if (btnSettingsConnect) {
        btnSettingsConnect.addEventListener('click', () => {
            const url = document.getElementById('settingsDbUrl')?.value?.trim();
            if (url) {
                document.getElementById('dbUrl').value = url;
                conectarDB();
            }
        });
    }
}

// =============================================
// CONNECTION & LOGIN
// =============================================

async function conectarDB() {
    const urlInput = document.getElementById('dbUrl');
    const settingsUrlInput = document.getElementById('settingsDbUrl');
    const url = urlInput?.value?.trim() || settingsUrlInput?.value?.trim() || '';
    
    if (!url) {
        showToast(t('enterSystemUrl'), 'error');
        return;
    }
    
    if (!url.includes('script.google.com')) {
        showToast(t('invalidUrl'), 'error');
        return;
    }
    
    const btns = document.querySelectorAll('.btn-conectar');
    btns.forEach(btn => {
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span>';
    });
    
    const connected = await tryConnect(url);
    
    btns.forEach(btn => {
        btn.disabled = false;
        btn.innerHTML = '<span>CONECTAR</span>';
    });
    
    if (connected) {
        showToast(t('connected'), 'success');
    }
}

async function tryConnect(url) {
    AppState.dbUrl = url;
    
    try {
        const pingResult = await DB.ping();
        
        if (!pingResult.ok) {
            showToast(t('connectionFailed') + ': ' + (pingResult.err || t('error')), 'error');
            AppState.connected = false;
            return false;
        }
        
        AppState.connected = true;
        saveConfig();
        
        if (pingResult.agendadores && pingResult.agendadores.length > 0) {
            AppState.agendadores = pingResult.agendadores;
        } else {
            const agResult = await DB.agendadores();
            if (agResult.ok && agResult.data && agResult.data.length > 0) {
                AppState.agendadores = agResult.data;
            } else {
                AppState.agendadores = [];
                showToast(t('schedulerNotFound'), 'error');
            }
        }
        
        if (pingResult.horarios) {
            AppState.horarios = pingResult.horarios;
        } else {
            AppState.horarios = null;
            showToast(t('timesNotConfigured'), 'error');
        }
        
        renderLoginUsers();
        document.getElementById('login-users-section').style.display = 'block';
        
        if (AppState.agendadores.length > 0) {
            showToast(`${t('connected')} ${AppState.agendadores.length} ${t('professionalsFound')}`, 'success');
        }
        
        return true;
    } catch (err) {
        console.error('Error in tryConnect:', err);
        showToast(t('connectionError'), 'error');
        return false;
    }
}

function renderLoginUsers() {
    const container = document.getElementById('login-users-list');
    if (!container) return;
    
    let html = '';
    
    const admin = AppState.agendadores.find(u => u.isAdmin);
    const others = AppState.agendadores.filter(u => !u.isAdmin);
    
    if (admin) {
        const adminName = admin.nome || admin.name || 'Admin';
        html += `<button class="login-user-btn admin" data-userid="${admin.id}" data-username="${adminName}">
            <i class="fa-solid fa-shield-halved"></i> ${adminName}
        </button>`;
    }
    
    others.forEach(user => {
        const userName = user.nome || user.name || t('noName');
        html += `<button class="login-user-btn" data-userid="${user.id}" data-username="${userName}">${userName}</button>`;
    });
    
    html += `<button class="login-user-btn quick" onclick="quickLogin()">${t('quickEntry')}</button>`;
    
    container.innerHTML = html;
    
    container.querySelectorAll('.login-user-btn[data-userid]').forEach(btn => {
        btn.onclick = function() {
            selectUser(this.dataset.userid, this.dataset.username);
        };
    });
}

function isVisitor() {
    return AppState.currentUser && AppState.currentUser.id === -1;
}

function quickLogin() {
    AppState.currentUser = { id: -1, name: 'Visitante' };
    AppState.loggedIn = true;
    saveConfig();
    hideLoginScreen();
    showMainApp();
    showToast(t('viewMode'), 'info');
}

function selectUser(userId, userName) {
    if (userId === undefined || userId === null || userId === '') {
        showToast(t('unknownError'), 'error');
        return;
    }
    
    document.getElementById('loginUserId').value = userId;
    document.getElementById('loginUserName').textContent = userName;
    document.getElementById('loginPassword').value = '';
    openModal('modal-password');
    
    setTimeout(() => {
        document.getElementById('loginPassword').focus();
    }, 100);
}

async function submitLogin() {
    const userId = document.getElementById('loginUserId').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!userId) {
        showToast(t('unknownError'), 'error');
        return;
    }
    
    if (!password) {
        showToast(t('fillPassword'), 'error');
        return;
    }
    
    const btn = document.getElementById('btnLoginConfirm');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<div class="loading-spinner"></div>';
    
    const result = await DB.auth(userId, password);
    
    btn.disabled = false;
    btn.textContent = originalText;
    
    if (result.ok) {
        const ag = result.agendador;
        AppState.currentUser = { 
            id: ag.id,
            name: ag.nome || ag.name,
            isAdmin: ag.isAdmin || false
        };
        AppState.savedPassword = password;
        AppState.loggedIn = true;
        saveConfig();
        closeModal('modal-password');
        hideLoginScreen();
        showMainApp();
        
        if (ag.isAdmin) {
            showToast(`${t('welcome')}, ${ag.nome || ag.name}! (${t('admin')})`, 'success');
        } else {
            showToast(`${t('welcome')}, ${ag.nome || ag.name}!`, 'success');
        }
    } else {
        showToast(result.err || t('incorrectPassword'), 'error');
    }
}

function showMainApp() {
    document.getElementById('login-screen').classList.remove('active');
    document.querySelector('.app-container').style.display = 'flex';
    
    const userNameEl = document.querySelector('.user-name');
    const userRoleEl = document.querySelector('.user-role');
    if (userNameEl) userNameEl.textContent = AppState.currentUser?.name || 'Usuário';
    if (userRoleEl) userRoleEl.textContent = AppState.currentUser?.isAdmin ? 'Administrador' : (isVisitor() ? 'Visitante' : 'Profissional');
    
    const settingsDbInput = document.getElementById('settingsDbUrl');
    const accountUserName = document.getElementById('accountUserName');
    const accountUserRole = document.getElementById('accountUserRole');
    
    if (settingsDbInput) settingsDbInput.value = AppState.dbUrl || '';
    if (accountUserName) accountUserName.textContent = AppState.currentUser?.name || 'Usuário';
    if (accountUserRole) accountUserRole.textContent = AppState.currentUser?.isAdmin ? 'Administrador' : (isVisitor() ? 'Visitante' : 'Profissional');
    
    loadAllData();
    initStatsWeek();
    startAutoRefresh();
    renderProfessionalsTabs();
    renderProfessionalsConfig();
}

function startAutoRefresh() {
    stopAutoRefresh();
    AppState.refreshInterval = setInterval(() => {
        loadAllData();
    }, REFRESH_INTERVAL_MS);
}

function stopAutoRefresh() {
    if (AppState.refreshInterval) {
        clearInterval(AppState.refreshInterval);
        AppState.refreshInterval = null;
    }
}

async function loadAllData() {
    try {
        const result = await DB.list();
        if (result.ok) {
            const data = result.data || [];
            AppState.appointments = data.filter(apt => !AppState.pendingDeletions.has(String(apt.id)));
            // Debug: console.log('[loadAllData] Appointments loaded:', AppState.appointments.length);
        } else {
            // console.warn('[loadAllData] DB.list() failed:', result.err);
            AppState.appointments = [];
        }
        
        await loadClientsFromBackend();
        
    } catch (e) {
        console.error('loadAllData error:', e);
        AppState.appointments = [];
    }
    
    extractClients();
    renderAll();
}

async function loadClientsFromBackend() {
    try {
        // Debug: console.log('[Clientes] Buscando clientes do backend...');
        const result = await DB.listarClientes();
        // Debug: console.log('[Clientes] Resposta listarClientes:', JSON.stringify(result).substring(0, 500));
        
        if (result.ok && result.clientes) {
            // Debug: console.log('[Clientes] Recebidos do backend:', result.clientes.length);
            
            // Backend is the source of truth — rebuild knownClients from scratch
            const backendKeys = new Set();
            
            result.clientes.forEach(c => {
                const key = (c.telefone || c.phone || '').replace(/\D/g, '');
                if (key) {
                    backendKeys.add(key);
                    AppState.knownClients.set(key, {
                        id: c.id,
                        name: c.nome || c.name || '',
                        phone: c.telefone || c.phone || '',
                        cpf: c.cpf || '',
                        birthday: c.aniversario || c.birthday || '',
                        totalAgendamentos: c.totalAgendamentos || 0
                    });
                    
                    const phone = c.telefone || c.phone || '';
                    if (phone && (c.cpf || c.aniversario)) {
                        AppState.clientData[phone] = {
                            cpf: c.cpf || '',
                            birthday: c.aniversario || c.birthday || ''
                        };
                    }
                }
            });
            
            // Remove clients that no longer exist on backend
            for (const key of AppState.knownClients.keys()) {
                if (!backendKeys.has(key)) {
                    AppState.knownClients.delete(key);
                }
            }
            
            // Only clear deletedClients for clients that were re-created on backend
            // Keep entries for truly deleted clients so extractClients() won't re-add them from appointments
            for (const key of AppState.deletedClients) {
                if (backendKeys.has(key)) {
                    AppState.deletedClients.delete(key);
                }
            }
            saveConfig();
            
            AppState.clients = Array.from(AppState.knownClients.values());
        } else {
            // console.warn('[Clientes] Backend não retornou clientes:', result.err || 'sem campo clientes');
        }
        // Debug: console.log('[Clientes] Total no knownClients:', AppState.knownClients.size);
    } catch (e) {
        console.error('[Clientes] Erro ao carregar:', e);
    }
}

async function refreshClientsFromBackend() {
    const container = document.getElementById('clientsGrid');
    const syncIcon = document.getElementById('sync-icon');

    if (syncIcon) syncIcon.classList.add('fa-spin');
    if (container) container.innerHTML = `
        <div class="skeleton-client-card"><div class="skeleton-client-top"><div class="skeleton-avatar-c"></div><div class="skeleton-client-info"><div class="skeleton-line" style="height:14px;width:60%"></div><div class="skeleton-line" style="height:11px;width:45%"></div></div></div><div class="skeleton-client-body"><div class="skeleton-line" style="height:20px;width:30%"></div><div class="skeleton-line" style="height:10px;width:50%"></div></div></div>
        <div class="skeleton-client-card"><div class="skeleton-client-top"><div class="skeleton-avatar-c"></div><div class="skeleton-client-info"><div class="skeleton-line" style="height:14px;width:55%"></div><div class="skeleton-line" style="height:11px;width:40%"></div></div></div><div class="skeleton-client-body"><div class="skeleton-line" style="height:20px;width:25%"></div><div class="skeleton-line" style="height:10px;width:45%"></div></div></div>
        <div class="skeleton-client-card"><div class="skeleton-client-top"><div class="skeleton-avatar-c"></div><div class="skeleton-client-info"><div class="skeleton-line" style="height:14px;width:65%"></div><div class="skeleton-line" style="height:11px;width:50%"></div></div></div><div class="skeleton-client-body"><div class="skeleton-line" style="height:20px;width:28%"></div><div class="skeleton-line" style="height:10px;width:55%"></div></div></div>
        <div class="skeleton-client-card"><div class="skeleton-client-top"><div class="skeleton-avatar-c"></div><div class="skeleton-client-info"><div class="skeleton-line" style="height:14px;width:50%"></div><div class="skeleton-line" style="height:11px;width:42%"></div></div></div><div class="skeleton-client-body"><div class="skeleton-line" style="height:20px;width:32%"></div><div class="skeleton-line" style="height:10px;width:48%"></div></div></div>
        <div class="skeleton-client-card"><div class="skeleton-client-top"><div class="skeleton-avatar-c"></div><div class="skeleton-client-info"><div class="skeleton-line" style="height:14px;width:58%"></div><div class="skeleton-line" style="height:11px;width:38%"></div></div></div><div class="skeleton-client-body"><div class="skeleton-line" style="height:20px;width:26%"></div><div class="skeleton-line" style="height:10px;width:52%"></div></div></div>
        <div class="skeleton-client-card"><div class="skeleton-client-top"><div class="skeleton-avatar-c"></div><div class="skeleton-client-info"><div class="skeleton-line" style="height:14px;width:62%"></div><div class="skeleton-line" style="height:11px;width:44%"></div></div></div><div class="skeleton-client-body"><div class="skeleton-line" style="height:20px;width:30%"></div><div class="skeleton-line" style="height:10px;width:46%"></div></div></div>
    `;

    const countBefore = AppState.knownClients.size;

    try {
        await loadClientsFromBackend();
    } catch (e) {
        console.error('[Clientes] refreshClients error:', e);
    }
    extractClients();

    const countAfter = AppState.knownClients.size;
    const newClients = countAfter - countBefore;

    if (syncIcon) syncIcon.classList.remove('fa-spin');

    // Debug: console.log('[Clientes] Renderizando', countAfter, 'clientes (', newClients, 'novos)');
    renderClients();

    if (newClients > 0) {
        showToast(`${newClients} novos clientes sincronizados`, 'success');
    } else {
        showToast(`${countAfter} clientes carregados`, 'info');
    }
}

function renderAll() {
    renderUpcoming();
    renderMiniSchedule();
    renderBirthdays();
    renderWeekSummary();
    renderCalendar();
    renderClients();
    renderStats();
    updateClock();
    removeSkeletonLoading();
}

function removeSkeletonLoading() {
    document.querySelectorAll('.loading').forEach(el => el.classList.remove('loading'));
}

function logout() {
    stopAutoRefresh();
    
    AppState.currentUser = null;
    AppState.savedPassword = null;
    AppState.loggedIn = false;
    AppState.connected = false;
    AppState.appointments = [];
    AppState.clients = [];
    AppState.agendadores = [];
    
    localStorage.removeItem('nexus_credentials');
    
    document.querySelector('.app-container').style.display = 'none';
    showLoginScreen();
    
    showToast(t('logoutDone'), 'info');
}

// =============================================
// NAVIGATION
// =============================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetScreen = this.dataset.screen;
            if (targetScreen) {
                switchScreen(targetScreen);
                
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

function switchScreen(screenId) {
    if (screenId === 'screen-script-builder') {
        const hasOneTimeAccess = typeof consumeScriptBuilderAccess === 'function'
            ? consumeScriptBuilderAccess()
            : (typeof isScriptBuilderAuthorized === 'function' ? isScriptBuilderAuthorized() : false);

        if (!hasOneTimeAccess) {
            if (typeof openScriptBuilderProtected === 'function') {
                openScriptBuilderProtected();
            }
            return;
        }
    }

    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.toggle('active', screen.id === screenId);
    });
    
    // Update sidebar nav active state
    document.querySelectorAll('.nav-item').forEach(nav => {
        const navScreen = nav.dataset.screen;
        const keepSettingsActive = screenId === 'screen-script-builder' && navScreen === 'screen-settings';
        nav.classList.toggle('active', navScreen === screenId || keepSettingsActive);
    });
    
    if (screenId === 'screen-home') {
        renderUpcoming();
        renderMiniSchedule();
        renderBirthdays();
        renderWeekSummary();
    }
    if (screenId === 'screen-calendar') renderCalendar();
    if (screenId === 'screen-clients') {
        if (AppState.clients && AppState.clients.length > 0) {
            renderClients();
        } else {
            refreshClientsFromBackend();
        }
    }
    if (screenId === 'screen-stats') {
        AppState.statsNeedsAnimation = true;
        renderStats();
    }
    if (screenId === 'screen-script-builder' && typeof renderScriptBuilderScreen === 'function') {
        renderScriptBuilderScreen();
    }
    if (screenId === 'screen-services') renderServices();
    if (screenId === 'screen-products') renderProducts();
    if (screenId === 'screen-cashier') renderCashier();
    if (screenId === 'screen-backup') renderBackupInfo();
}

// =============================================
// CLOCK
// =============================================

function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const clockTime = document.getElementById('clockTime');
    const clockSeconds = document.getElementById('clockSeconds');
    const clockDate = document.getElementById('clockDate');
    const todayDate = document.getElementById('todayDate');
    const headerGreeting = document.getElementById('headerGreeting');
    const clientsCount = document.getElementById('clientsCount');
    const statToday = document.getElementById('statToday');
    const statTomorrow = document.getElementById('statTomorrow');
    const statWeek = document.getElementById('statWeek');
    
    const now = new Date();
    
    if (clockTime) {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        clockTime.textContent = `${hours}:${minutes}`;
    }
    
    if (clockSeconds) {
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockSeconds.textContent = `:${seconds}`;
    }
    
    if (todayDate) {
        const day = now.getDate();
        const month = getMonths()[now.getMonth()];
        if (currentLanguage === 'en') {
            todayDate.textContent = `${month} ${day}`;
        } else {
            todayDate.textContent = `${day} de ${month}`;
        }
    }
    
    if (headerGreeting) {
        const hour = now.getHours();
        let greeting;
        if (currentLanguage === 'en') {
            if (hour < 12) greeting = 'Good morning,';
            else if (hour < 18) greeting = 'Good afternoon,';
            else greeting = 'Good evening,';
        } else {
            if (hour < 12) greeting = 'Bom dia,';
            else if (hour < 18) greeting = 'Boa tarde,';
            else greeting = 'Boa noite,';
        }
        headerGreeting.textContent = greeting;
    }
    
    // User name in top bar
    const headerUserName = document.getElementById('headerUserName');
    if (headerUserName && AppState.currentUser) {
        headerUserName.textContent = AppState.currentUser.nome || AppState.currentUser.name || 'Usuário';
    }
    
    // Top bar stats
    const topStatConfirmed = document.getElementById('topStatConfirmed');
    const topStatPending = document.getElementById('topStatPending');
    const topStatClients = document.getElementById('topStatClients');
    
    if (AppState.appointments) {
        const todayStr = formatDate(now);
        const todayAppts = AppState.appointments.filter(a => a.date === todayStr && a.client !== 'BLOQUEADO' && !a.blocked);
        const confirmed = todayAppts.filter(a => a.confirmado || a.confirmed).length;
        const pending = todayAppts.filter(a => !a.confirmado && !a.confirmed).length;
        
        if (topStatConfirmed) topStatConfirmed.textContent = confirmed;
        if (topStatPending) topStatPending.textContent = pending;
    }
    
    if (topStatClients && AppState.clients) {
        topStatClients.textContent = AppState.clients.length;
    }
    
    if (clientsCount && AppState.clients) {
        clientsCount.textContent = AppState.clients.length;
    }
    
    if (clockDate) {
        const dayName = getWeekdays()[now.getDay()];
        const day = now.getDate();
        const month = getMonths()[now.getMonth()];
        const year = now.getFullYear();
        
        if (currentLanguage === 'en') {
            clockDate.textContent = `${dayName}, ${month} ${day}, ${year}`;
        } else {
            clockDate.textContent = `${dayName}, ${day} de ${month} de ${year}`;
        }
    }
    
    if (statToday && AppState.appointments) {
        const todayStr = formatDate(now);
        const todayCount = AppState.appointments.filter(a => 
            a.date === todayStr && a.client !== 'BLOQUEADO' && !a.blocked
        ).length;
        statToday.textContent = todayCount;
    }
    
    if (statTomorrow && AppState.appointments) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = formatDate(tomorrow);
        const tomorrowCount = AppState.appointments.filter(a => 
            a.date === tomorrowStr && a.client !== 'BLOQUEADO' && !a.blocked
        ).length;
        statTomorrow.textContent = tomorrowCount;
    }
    
    if (statWeek && AppState.appointments) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekCount = AppState.appointments.filter(a => {
            if (a.client === 'BLOQUEADO' || a.blocked) return false;
            const aptDate = new Date(a.date);
            return aptDate >= weekStart && aptDate <= weekEnd;
        }).length;
        statWeek.textContent = weekCount;
    }
}

// =============================================
// THEME
// =============================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        const savedTheme = localStorage.getItem('nexus_theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.checked = true;
        }
        
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem('nexus_theme', 'light');
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('nexus_theme', 'dark');
            }
        });
    }
}

// =============================================
// LANGUAGE SELECTOR
// =============================================

function initLanguageSelector() {
    document.querySelectorAll('.language-btn, .settings-lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            if (lang) {
                setLanguage(lang);
            }
        });
    });
}

// =============================================
// DATE SELECTORS & MINI CALENDAR
// =============================================

let miniCalDate = new Date(); // Separate date for mini calendar navigation

function initDateSelectors() {
    // Mini calendar navigation
    document.getElementById('miniCalPrev')?.addEventListener('click', () => changeMiniCalMonth(-1));
    document.getElementById('miniCalNext')?.addEventListener('click', () => changeMiniCalMonth(1));
    
    // Initialize mini calendar
    renderMiniCalendar();
}

function changeMiniCalMonth(delta) {
    miniCalDate.setMonth(miniCalDate.getMonth() + delta);
    renderMiniCalendar();
}

function renderMiniCalendar() {
    const monthEl = document.getElementById('miniCalMonth');
    const daysEl = document.getElementById('miniCalDays');
    if (!monthEl || !daysEl) return;
    
    const months = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    
    monthEl.textContent = `${months[miniCalDate.getMonth()]} ${miniCalDate.getFullYear()}`;
    
    const year = miniCalDate.getFullYear();
    const month = miniCalDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const today = new Date();
    const selectedDate = AppState.calendarDate;
    
    // Build set of dates that have appointments this month
    const datesWithApts = new Set();
    AppState.appointments.forEach(apt => {
        if (apt.date && apt.client !== 'BLOQUEADO' && !apt.blocked) {
            datesWithApts.add(apt.date);
        }
    });
    
    // Get stats week range for highlighting (only when on stats screen)
    let statsWeekStart = null;
    let statsWeekEnd = null;
    const currentScreen = document.querySelector('.nav-item.active')?.dataset.screen;
    if (currentScreen === 'screen-stats' && AppState.statsPeriodType === 'week') {
        const { start, end } = getStatsPeriodRange();
        statsWeekStart = formatDate(start);
        statsWeekEnd = formatDate(end);
    }
    
    let html = '';
    
    // Previous month ghost days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        html += `<span class="mini-cal-day other-month">${day}</span>`;
    }
    
    // Current month days
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const isSelected = day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
        const isFutureOrToday = dateStr >= todayStr;
        const hasApts = datesWithApts.has(dateStr) && isFutureOrToday;
        const isInWeekRange = statsWeekStart && statsWeekEnd && dateStr >= statsWeekStart && dateStr <= statsWeekEnd;
        const isWeekStart = dateStr === statsWeekStart;
        const isWeekEnd = dateStr === statsWeekEnd;
        
        let classes = 'mini-cal-day';
        if (isToday) classes += ' today';
        if (isSelected && !isToday) classes += ' selected';
        if (hasApts) classes += ' has-appointments';
        if (isInWeekRange) classes += ' in-week-range';
        if (isWeekStart) classes += ' week-start';
        if (isWeekEnd) classes += ' week-end';
        
        html += `<button class="${classes}" data-date="${dateStr}">${day}</button>`;
    }
    
    // Next month ghost days to fill remaining cells (6 rows = 42 cells)
    const totalCells = firstDay + daysInMonth;
    const remainingCells = (42 - totalCells) % 7 || (totalCells <= 35 ? 7 : 0);
    for (let day = 1; day <= remainingCells; day++) {
        html += `<span class="mini-cal-day other-month">${day}</span>`;
    }
    
    daysEl.innerHTML = html;
    
    // Add click events
    daysEl.querySelectorAll('.mini-cal-day:not(.other-month)').forEach(btn => {
        btn.addEventListener('click', function() {
            const dateStr = this.dataset.date;
            if (dateStr) {
                const [y, m, d] = dateStr.split('-').map(Number);
                AppState.calendarDate = new Date(y, m - 1, d);
                renderCalendar();
                updateCalendarDateDisplay();
                renderMiniCalendar();
                switchScreen('screen-calendar');
            }
        });
    });
}

function changeCalendarPart(part, delta) {
    const date = AppState.calendarDate;
    if (part === 'day') {
        date.setDate(date.getDate() + delta);
    } else if (part === 'month') {
        date.setMonth(date.getMonth() + delta);
    } else if (part === 'year') {
        date.setFullYear(date.getFullYear() + delta);
    }
    renderCalendar();
    updateCalendarDateDisplay();
}

function goToToday() {
    AppState.calendarDate = new Date();
    renderCalendar();
    updateCalendarDateDisplay();
    showToast(t('todaySchedule'), 'success');
}

function updateCalendarDateDisplay() {
    const date = AppState.calendarDate;
    const weekdaysFull = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];
    const monthsFull = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    
    // Big header display
    const bigDayEl = document.getElementById('calBigDay');
    const bigWeekdayEl = document.getElementById('calBigWeekday');
    const bigMonthEl = document.getElementById('calBigMonth');
    
    if (bigDayEl) bigDayEl.textContent = date.getDate();
    if (bigWeekdayEl) bigWeekdayEl.textContent = weekdaysFull[date.getDay()];
    if (bigMonthEl) bigMonthEl.textContent = `${monthsFull[date.getMonth()]} ${date.getFullYear()}`;
    
    // Update mini calendar to show selected date
    miniCalDate = new Date(date);
    renderMiniCalendar();
}

function openDatePicker() {
    const modal = document.getElementById('modal-date-picker');
    const daySelect = document.getElementById('datePickerDay');
    const monthSelect = document.getElementById('datePickerMonth');
    const yearSelect = document.getElementById('datePickerYear');
    
    if (!modal || !daySelect || !monthSelect || !yearSelect) return;
    
    const currentDate = AppState.calendarDate;
    const currentYear = new Date().getFullYear();
    
    // Populate days
    daySelect.innerHTML = '';
    for (let d = 1; d <= 31; d++) {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = String(d).padStart(2, '0');
        if (d === currentDate.getDate()) opt.selected = true;
        daySelect.appendChild(opt);
    }
    
    // Populate months
    const months = getMonths();
    monthSelect.innerHTML = '';
    months.forEach((m, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = m;
        if (i === currentDate.getMonth()) opt.selected = true;
        monthSelect.appendChild(opt);
    });
    
    // Populate years
    yearSelect.innerHTML = '';
    for (let y = currentYear - 2; y <= currentYear + 5; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        if (y === currentDate.getFullYear()) opt.selected = true;
        yearSelect.appendChild(opt);
    }
    
    openModal('modal-date-picker');
}

function confirmDatePicker() {
    const daySelect = document.getElementById('datePickerDay');
    const monthSelect = document.getElementById('datePickerMonth');
    const yearSelect = document.getElementById('datePickerYear');
    
    if (!daySelect || !monthSelect || !yearSelect) return;
    
    const day = parseInt(daySelect.value);
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearSelect.value);
    
    const newDate = new Date(year, month, day, 12, 0, 0);
    
    // Validate date
    if (newDate.getDate() !== day) {
        // Invalid date (e.g., Feb 30)
        showToast('Data inválida', 'error');
        return;
    }
    
    AppState.calendarDate = newDate;
    renderCalendar();
    updateCalendarDateDisplay();
    closeModal('modal-date-picker');
}

function goToTodayFromPicker() {
    const today = new Date();
    AppState.calendarDate = today;
    renderCalendar();
    updateCalendarDateDisplay();
    closeModal('modal-date-picker');
    showToast(t('todaySchedule'), 'success');
}

// =============================================
// PROFESSIONALS TABS
// =============================================

function renderProfessionalsTabs() {
    const container = document.getElementById('professionalsTabs');
    if (!container) return;
    
    let html = `<button class="pro-btn ${AppState.selectedProfessional === null ? 'active' : ''}" data-pro-id="">
        ${t('all')}
    </button>`;
    
    AppState.agendadores.forEach(ag => {
        const name = ag.nome || ag.name || t('noName');
        const isActive = AppState.selectedProfessional === String(ag.id);
        
        html += `<button class="pro-btn ${isActive ? 'active' : ''}" data-pro-id="${ag.id}">
            ${name}
        </button>`;
    });
    
    container.innerHTML = html;
    
    container.querySelectorAll('.pro-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            const proId = this.dataset.proId;
            AppState.selectedProfessional = proId || null;
            
            container.querySelectorAll('.pro-btn').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            renderCalendar();
        });
    });
}

// =============================================
// HOME - UPCOMING
// =============================================

function renderUpcoming() {
    const container = document.getElementById('appointmentsList');
    if (!container) return;
    
    const today = new Date();
    const todayStr = formatDate(today);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatDate(tomorrow);
    
    let upcoming = AppState.appointments
        .filter(a => a.date >= todayStr && a.client !== 'BLOQUEADO' && !a.blocked)
        .sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        })
        .slice(0, 8);
    
    if (AppState.currentUser && AppState.currentUser.id > 0 && !AppState.currentUser.isAdmin) {
        const currentUserId = String(AppState.currentUser.id);
        upcoming = upcoming.filter(a => String(a.agendadorId) === currentUserId);
    }
    
    if (upcoming.length === 0) {
        container.innerHTML = `
            <div class="empty-state-premium">
                <div class="empty-icon">
                    <i class="fa-regular fa-calendar-check"></i>
                </div>
                <div class="empty-title">${t('noAppointments')}</div>
                <div class="empty-subtitle">Agenda livre para novos agendamentos</div>
            </div>
        `;
        renderMiniSchedule();
        renderRecentClients();
        renderBirthdays();
        renderWeekSummary();
        renderStatusWidget();
        return;
    }
    
    container.innerHTML = upcoming.map(apt => {
        const isToday = apt.date === todayStr;
        const isTomorrow = apt.date === tomorrowStr;
        const dayLabel = isToday ? t('today') : (isTomorrow ? t('tomorrow') : formatDateShort(apt.date));
        
        return `
            <div class="appointment-card ${!isToday ? 'tomorrow' : ''}" onclick="showAppointmentDetail('${apt.id}')">
                <div class="appointment-info">
                    <span class="appointment-client">${apt.client || t('client')}</span>
                    <span class="appointment-service">${apt.servico || t('service')}</span>
                    <span class="appointment-phone">${apt.phone || '-'}</span>
                </div>
                <div class="appointment-time">
                    <span class="appointment-day">${dayLabel}</span>
                    <span class="appointment-hour">${apt.time}</span>
                </div>
            </div>
        `;
    }).join('');
    
    renderMiniSchedule();
    renderRecentClients();
    renderBirthdays();
    renderWeekSummary();
    renderStatusWidget();
}

function renderStatusWidget() {
    const statusClients = document.getElementById('statusClients');
    const statusAppointments = document.getElementById('statusAppointments');
    
    if (statusClients && AppState.clients) {
        statusClients.textContent = AppState.clients.length;
    }
    
    if (statusAppointments && AppState.appointments) {
        const validAppts = AppState.appointments.filter(a => a.client !== 'BLOQUEADO' && !a.blocked);
        statusAppointments.textContent = validAppts.length;
    }
}

function renderMiniSchedule() {
    const container = document.getElementById('scheduleTimeline');
    if (!container) return;
    
    const today = new Date();
    const todayStr = formatDate(today);
    const currentTime = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
    
    const timeSlots = getTimeSlotsForDay(today);
    if (!timeSlots || timeSlots.length === 0) {
        container.innerHTML = `
            <div class="empty-state-premium">
                <div class="empty-icon"><i class="fa-regular fa-moon"></i></div>
                <div class="empty-title">${t('closedThisDay')}</div>
            </div>`;
        return;
    }
    
    const dayAppointments = AppState.appointments.filter(a => 
        a.date === todayStr && a.client && a.client !== 'BLOQUEADO' && !a.blocked
    ).sort((a, b) => a.time.localeCompare(b.time));
    
    if (dayAppointments.length === 0) {
        container.innerHTML = `
            <div class="empty-state-premium">
                <div class="empty-icon"><i class="fa-regular fa-calendar-check"></i></div>
                <div class="empty-title">Nenhum agendamento</div>
                <div class="empty-subtitle">Agenda livre para hoje</div>
            </div>`;
        return;
    }
    
    container.innerHTML = dayAppointments.map(apt => {
        const isPast = apt.time < currentTime;
        let classes = 'time-slot occupied';
        if (isPast) classes += ' past';
        
        const serviceName = apt.servico && apt.servico !== 'Almoço' ? apt.servico : '';
        
        const phoneAttr = apt.phone ? apt.phone.replace(/\D/g, '') : '';
        const clientName = (apt.client || '').replace(/'/g, "\\'");
        
        return `
            <div class="${classes}" onclick="openClientFromSchedule('${phoneAttr}', '${clientName}')" style="cursor:pointer">
                <span class="slot-time">${apt.time}</span>
                <div class="slot-client-info">
                    <span class="slot-client">${apt.client?.substring(0, 25) || 'Cliente'}</span>
                    ${serviceName ? `<span class="slot-service">${serviceName}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderRecentClients() {
    const container = document.getElementById('recentClients');
    if (!container) return;
    
    // Update clients count
    const clientsCount = document.getElementById('clientsCount');
    if (clientsCount) {
        clientsCount.textContent = AppState.clients.length;
    }
    
    const clients = AppState.clients.slice(0, 5);
    
    if (clients.length === 0) {
        container.innerHTML = `
            <div class="empty-state-premium">
                <div class="empty-icon">
                    <i class="fa-regular fa-user"></i>
                </div>
                <div class="empty-title">${t('noClients')}</div>
                <div class="empty-subtitle">Adicione seu primeiro cliente</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = clients.map(client => {
        const initials = client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const totalAtend = client.totalAgendamentos || getClientAppointmentCount(client.phone);
        
        return `
            <div class="client-mini" onclick="openClientDetail('${client.phone}')">
                <div class="client-avatar">${initials}</div>
                <div class="client-info">
                    <span class="client-name">${client.name}</span>
                    <span class="client-visits">${totalAtend} ${t('appointmentsCount').toLowerCase()}</span>
                </div>
                <button class="btn-icon-sm" onclick="event.stopPropagation(); openWhatsApp('${client.phone}')">
                    <i class="fab fa-whatsapp"></i>
                </button>
            </div>
        `;
    }).join('');
}

function parseBirthdayDayMonth(dateStr) {
    if (!dateStr) return null;
    // YYYY-MM-DD (from date input)
    if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts.length >= 3) return { day: parseInt(parts[2]), month: parseInt(parts[1]), year: parseInt(parts[0]) };
    }
    // DD/MM/YYYY (from backend)
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length >= 2) return { day: parseInt(parts[0]), month: parseInt(parts[1]), year: parts[2] ? parseInt(parts[2]) : 0 };
    }
    return null;
}

function renderBirthdays() {
    const container = document.getElementById('birthdaysList');
    if (!container) return;
    
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
    
    // Find clients with birthdays today
    const birthdaysToday = AppState.clients.filter(client => {
        const bday = client.birthday || AppState.clientData[client.phone]?.birthday || '';
        const parsed = parseBirthdayDayMonth(bday);
        if (!parsed) return false;
        return parsed.day === todayDay && parsed.month === todayMonth;
    });
    
    if (birthdaysToday.length === 0) {
        container.innerHTML = `
            <div class="birthday-empty">
                <i class="fa-regular fa-face-smile"></i>
                <span>Nenhum aniversariante hoje</span>
            </div>
        `;
        return;
    }
    
    container.innerHTML = birthdaysToday.map(client => {
        const initials = client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const bday = client.birthday || AppState.clientData[client.phone]?.birthday || '';
        const parsed = parseBirthdayDayMonth(bday);
        let age = '';
        if (parsed && parsed.year > 1900) {
            age = `Completa ${today.getFullYear() - parsed.year} anos`;
        }
        
        return `
            <div class="birthday-item">
                <div class="birthday-avatar">${initials}</div>
                <div class="birthday-info">
                    <span class="birthday-name">${client.name}</span>
                    <span class="birthday-age">${age}</span>
                </div>
                <button class="birthday-action" onclick="sendBirthdayMessage('${client.phone}', '${client.name}')" title="Enviar parabéns">
                    <i class="fab fa-whatsapp"></i>
                </button>
            </div>
        `;
    }).join('');
}

function sendBirthdayMessage(phone, name) {
    const firstName = name.split(' ')[0];
    const defaultMsg = `🎂 Feliz aniversário, ${firstName}! 🎉\n\nDesejamos a você um dia muito especial, cheio de alegria e realizações!\n\nUm abraço da equipe!`;
    let saved = localStorage.getItem('nexus_birthday_message') || '';
    const message = saved ? saved.replace(/{nome}/gi, firstName) : defaultMsg;
    const url = `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function openBirthdayConfig() {
    const saved = localStorage.getItem('nexus_birthday_message') || '';
    document.getElementById('birthdayMessageInput').value = saved;
    openModal('modal-birthday-config');
}

function saveBirthdayMessage() {
    const msg = document.getElementById('birthdayMessageInput').value.trim();
    if (msg) {
        localStorage.setItem('nexus_birthday_message', msg);
    } else {
        localStorage.removeItem('nexus_birthday_message');
    }
    closeModal('modal-birthday-config');
    showToast('Mensagem de aniversário salva!', 'success');
}

function renderWeekSummary() {
    const container = document.getElementById('weekSummary');
    const weekRangeEl = document.getElementById('weekRange');
    if (!container) return;
    
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Get start of week (Monday = index 1)
    const weekStart = new Date(today);
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    weekStart.setDate(today.getDate() + diff);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    // Update week range text
    if (weekRangeEl) {
        const startDay = weekStart.getDate();
        const endDay = weekEnd.getDate();
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        weekRangeEl.textContent = `${startDay} - ${endDay} ${months[weekEnd.getMonth()]}`;
    }
    
    const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const weekData = [];
    let maxAppts = 0;
    
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + i);
        const dateStr = formatDate(dayDate);
        
        const dayAppts = AppState.appointments.filter(a => 
            a.date === dateStr && a.client !== 'BLOQUEADO' && !a.blocked
        );
        
        const isToday = formatDate(today) === dateStr;
        if (dayAppts.length > maxAppts) maxAppts = dayAppts.length;
        
        weekData.push({
            name: dayNames[i],
            count: dayAppts.length,
            isToday
        });
    }
    
    const scaleMax = 30;
    const scaleSteps = [0, 10, 20, 30];
    
    // Build Y-axis labels
    const yLabels = scaleSteps.slice().reverse().map(v => 
        `<span class="axis-label">${v}</span>`
    ).join('');
    
    // Build bars
    const barsHtml = weekData.map(day => {
        const heightPercent = scaleMax > 0 ? (day.count / scaleMax) * 100 : 0;
        const barHeight = day.count > 0 ? Math.max(heightPercent, 3) : 0;
        
        return `
            <div class="week-bar-col">
                <div class="week-bar-wrapper">
                    <div class="week-bar has-data ${day.isToday ? 'today' : ''}" style="height: ${barHeight}%">
                        ${day.count > 0 ? `<span class="bar-value">${day.count}</span>` : ''}
                    </div>
                </div>
                <span class="week-bar-label ${day.isToday ? 'today' : ''}">${day.name}</span>
            </div>
        `;
    }).join('');
    
    // Stats
    const total = weekData.reduce((sum, d) => sum + d.count, 0);
    const avg = (total / 7).toFixed(1);
    let bestDay = weekData[0];
    weekData.forEach(d => { if (d.count > bestDay.count) bestDay = d; });
    const bestDayText = bestDay.count > 0 ? bestDay.name : '-';
    
    container.innerHTML = `
        <div class="week-chart-container">
            <div class="week-chart-axis">
                ${yLabels}
            </div>
            <div class="week-chart">
                ${barsHtml}
            </div>
        </div>
    `;
    
    const elTotal = document.getElementById('weekStatTotal');
    const elBest = document.getElementById('weekStatBest');
    const elAvg = document.getElementById('weekStatAvg');
    if (elTotal) elTotal.textContent = total;
    if (elBest) elBest.textContent = bestDayText;
    if (elAvg) elAvg.textContent = avg;
}

// =============================================
// CALENDAR
// =============================================

function renderCalendar() {
    const container = document.getElementById('calendarGrid');
    if (!container) return;
    
    const date = AppState.calendarDate;
    const dateStr = formatDate(date);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateOnly = new Date(date);
    selectedDateOnly.setHours(0, 0, 0, 0);
    const isPastDay = selectedDateOnly < today;
    const isToday = selectedDateOnly.getTime() === today.getTime();
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    updateCalendarDateDisplay();
    
    const timeSlots = getTimeSlotsForDay(date);
    
    if (timeSlots === null) {
        container.innerHTML = `
            <div class="empty-state-premium" style="padding: 60px;">
                <div class="empty-icon"><i class="fa-solid fa-triangle-exclamation" style="color: var(--warning);"></i></div>
                <div class="empty-title">${t('timesNotConfigured')}</div>
                <div class="empty-subtitle">Configure os horários no painel</div>
            </div>
        `;
        return;
    }
    
    if (timeSlots.length === 0) {
        container.innerHTML = `
            <div class="empty-state-premium" style="padding: 60px;">
                <div class="empty-icon"><i class="fa-solid fa-door-closed"></i></div>
                <div class="empty-title">${t('closedThisDay')}</div>
                <div class="empty-subtitle">Estabelecimento fechado</div>
            </div>
        `;
        return;
    }
    
    const dayAppointments = AppState.appointments.filter(a => a.date === dateStr);
    
    let agendadores = AppState.agendadores;
    if (AppState.selectedProfessional) {
        agendadores = AppState.agendadores.filter(ag => String(ag.id) === AppState.selectedProfessional);
    }
    
    if (!agendadores || agendadores.length === 0) {
        container.innerHTML = `
            <div class="empty-state-premium" style="padding: 60px;">
                <div class="empty-icon"><i class="fa-regular fa-calendar-xmark"></i></div>
                <div class="empty-title">Nenhum profissional</div>
                <div class="empty-subtitle">Cadastre profissionais no painel</div>
            </div>
        `;
        return;
    }
    
    const numCols = agendadores.length;
    container.style.setProperty('--cols', numCols);
    
    // Adicionar scroll horizontal se muitos profissionais
    const calendarWrapper = container.parentElement;
    if (numCols > 5) {
        calendarWrapper.style.overflowX = 'auto';
        container.style.minWidth = `${numCols * 140}px`;
    } else {
        calendarWrapper.style.overflowX = '';
        container.style.minWidth = '';
    }
    
    let html = '';
    
    // Header row
    html += '<div class="calendar-header-row-premium" style="--cols: ' + numCols + ';">';
    html += '<div class="cal-cell time-header"></div>';
    agendadores.forEach(ag => {
        const agName = ag.nome || ag.name || 'N/A';
        const bloqueado = ag.bloqueado || false;
        html += `<div class="cal-cell header">${agName.toUpperCase()}${bloqueado ? ' <i class="fa-solid fa-lock"></i>' : ''}</div>`;
    });
    html += '</div>';
    
    // Find next upcoming time slot for today
    let nextTimeSlot = null;
    if (isToday) {
        for (const slot of timeSlots) {
            if (slot >= currentTime) {
                nextTimeSlot = slot;
                break;
            }
        }
    }
    
    // Time rows
    timeSlots.forEach(time => {
        const isPastTime = isToday && time < currentTime;
        const isNextSlot = time === nextTimeSlot;
        
        html += `<div class="calendar-row-premium" style="--cols: ${numCols};">`;
        const timeColClass = isNextSlot ? 'cal-cell time-col current-time' : 'cal-cell time-col';
        html += `<div class="${timeColClass}">${time}</div>`;
        
        agendadores.forEach(ag => {
            const agIdStr = String(ag.id);
            const apt = dayAppointments.find(a => a.time === time && String(a.agendadorId) === agIdStr);
            
            const estaBloqueado = ag.bloqueado || false;
            const almocoInicio = ag.almocoInicio || '';
            const almocoFim = ag.almocoFim || '';
            const isLunchTime = almocoInicio && almocoFim && time >= almocoInicio && time < almocoFim;
            const isLunchBlock = apt && apt.servico === 'Almoço';
            
            const pastClass = isPastTime ? ' past' : '';
            
            if (estaBloqueado && !apt) {
                html += `<div class="cal-cell blocked${pastClass}"><i class="fa-solid fa-lock"></i></div>`;
            } else if (apt) {
                if (isLunchBlock) {
                    html += `<div class="cal-cell lunch${pastClass}" onclick="showAppointmentDetail('${apt.id}')"><i class="fa-solid fa-utensils"></i></div>`;
                } else if (apt.client === 'BLOQUEADO' || apt.blocked) {
                    html += `<div class="cal-cell blocked${pastClass}" onclick="showAppointmentDetail('${apt.id}')"><i class="fa-solid fa-ban"></i></div>`;
                } else {
                    const clientName = apt.client?.substring(0, 20) || t('client');
                    const serviceName = apt.servico?.substring(0, 25) || '';
                    html += `<div class="cal-cell occupied${pastClass}" onclick="showAppointmentDetail('${apt.id}')">
                        <span class="client-name">${clientName}</span>
                        ${serviceName ? `<span class="service-name">${serviceName}</span>` : ''}
                    </div>`;
                }
            } else if (isLunchTime) {
                html += `<div class="cal-cell lunch${pastClass}"><i class="fa-solid fa-utensils"></i></div>`;
            } else if (isPastDay || isPastTime) {
                html += `<div class="cal-cell free past"></div>`;
            } else {
                html += `<div class="cal-cell free" onclick="openNewAppointment('${dateStr}', '${time}', '${ag.id}')">+</div>`;
            }
        });
        
        html += '</div>';
    });
    
    container.innerHTML = html;
}

function getTimeSlotsForDay(date) {
    const dayNames = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const dayName = dayNames[date.getDay()];
    
    if (!AppState.horarios) return null;
    if (!AppState.horarios[dayName]) return null;
    
    const dayHours = AppState.horarios[dayName];
    const abre = dayHours.abre;
    const fecha = dayHours.fecha;
    
    if (abre === '00:00' && fecha === '00:00') return [];
    
    return generateTimeSlots(abre, fecha);
}

function generateTimeSlots(startTime, endTime) {
    const slots = [];
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    let currentH = startH;
    let currentM = startM;
    
    while (currentH < endH || (currentH === endH && currentM < endM)) {
        slots.push(`${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`);
        currentM += 30;
        if (currentM >= 60) {
            currentM = 0;
            currentH++;
        }
    }
    
    return slots;
}

// =============================================
// APPOINTMENTS
// =============================================

function openNewAppointment(date, time, agendadorId) {
    if (isVisitor()) {
        showToast(t('viewModeNoCreate'), 'error');
        return;
    }
    
    const ag = AppState.agendadores.find(a => String(a.id) === String(agendadorId));
    const agName = ag?.nome || ag?.name || t('professionalFallback');
    
    document.getElementById('appointmentDate').value = date;
    document.getElementById('appointmentTime').value = time;
    document.getElementById('appointmentProfessional').value = agendadorId;
    document.getElementById('appointmentProfessionalName').textContent = agName;
    
    // Format date/time display
    const dateDisplay = formatDateBR(date) + ' às ' + time;
    document.getElementById('appointmentDateTimeDisplay').textContent = dateDisplay;
    
    document.getElementById('appointmentClient').value = '';
    document.getElementById('appointmentPhone').value = '';
    document.getElementById('appointmentService').value = '';
    document.getElementById('appointmentNotes').value = '';
    document.getElementById('appointmentCpf').value = '';
    document.getElementById('appointmentBirthday').value = '';
    
    // Hide history badge and suggestions
    document.getElementById('clientHistoryBadge').style.display = 'none';
    const sugEl = document.getElementById('clientSuggestions');
    sugEl.classList.remove('show');
    sugEl.innerHTML = '';
    
    // Hide service suggestions
    const serviceSugEl = document.getElementById('serviceSuggestions');
    if (serviceSugEl) {
        serviceSugEl.classList.remove('show');
        serviceSugEl.innerHTML = '';
    }
    
    openModal('modal-new-appointment');
    
    // Initialize service autocomplete
    initServiceAutocomplete();
    
    setTimeout(() => {
        document.getElementById('appointmentClient').focus();
    }, 100);
}

async function saveNewAppointment() {
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const agendadorId = document.getElementById('appointmentProfessional').value;
    const client = document.getElementById('appointmentClient').value.trim();
    const phone = document.getElementById('appointmentPhone').value.trim();
    const service = document.getElementById('appointmentService').value.trim();
    const notes = document.getElementById('appointmentNotes').value.trim();
    const cpf = document.getElementById('appointmentCpf').value.trim();
    const birthday = document.getElementById('appointmentBirthday').value;
    
    if (!client) {
        showToast(t('fillNamePhone'), 'error');
        return;
    }
    
    // Block past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date + 'T00:00:00');
    if (selectedDate < today) {
        showToast('Não é possível agendar em datas passadas', 'error');
        return;
    }
    
    const ag = AppState.agendadores.find(a => String(a.id) === String(agendadorId));
    const agName = ag?.nome || ag?.name || t('professionalFallback');
    
    const btn = document.getElementById('btnSaveAppointment');
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="loading-spinner"></div>';
    setModalBusy('modal-new-appointment', true);
    
    // Save client data (CPF/birthday) if provided
    if (phone && (cpf || birthday)) {
        if (!AppState.clientData) AppState.clientData = {};
        AppState.clientData[phone] = {
            cpf: cpf || (AppState.clientData[phone]?.cpf || ''),
            birthday: birthday || (AppState.clientData[phone]?.birthday || '')
        };
        try { localStorage.setItem('nexus_client_data', JSON.stringify(AppState.clientData)); } catch(e) {}
    }
    
    const result = await DB.create({
        date,
        time,
        client,
        phone: phone || '',
        servico: service || '',
        observacoes: notes || '',
        agendadorId,
        agendador: agName,
        blocked: false
    });
    
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    setModalBusy('modal-new-appointment', false);
    
    if (result.ok) {
        closeModal('modal-new-appointment');
        showToast(t('scheduled'), 'success');
        
        // Auto-create client if doesn't exist
        const key = phone ? phone.replace(/\D/g, '') : '';
        let clientExists = false;
        
        if (key && AppState.knownClients.has(key)) {
            clientExists = true;
        } else {
            for (const [k, c] of AppState.knownClients) {
                if (c.name && c.name.toUpperCase() === client.toUpperCase()) {
                    clientExists = true;
                    break;
                }
            }
        }
        
        if (!clientExists && client) {
            const newKey = key || client.replace(/\s/g, '_').toUpperCase();
            AppState.knownClients.set(newKey, { name: client, phone: phone || '', totalAgendamentos: 1 });
            await DB.cadastrarCliente({ nome: client, telefone: phone || '', cpf: cpf || '', aniversario: birthday || '' });
        }
        
        await loadAllData();
    } else {
        showToast(result.err || t('failedToSchedule'), 'error');
    }
}

async function blockTimeSlot() {
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const agendadorId = document.getElementById('appointmentProfessional').value;
    
    // Block past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date + 'T00:00:00');
    if (selectedDate < today) {
        showToast('Não é possível bloquear datas passadas', 'error');
        return;
    }
    
    const ag = AppState.agendadores.find(a => String(a.id) === String(agendadorId));
    const agName = ag?.nome || ag?.name || t('professionalFallback');
    
    const btn = document.getElementById('btnBlockTime');
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="loading-spinner"></div>';
    
    const result = await DB.create({
        date,
        time,
        client: 'BLOQUEADO',
        phone: '',
        servico: t('blockedTime'),
        agendadorId,
        agendador: agName,
        blocked: true
    });
    
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    
    if (result.ok) {
        closeModal('modal-new-appointment');
        showToast(t('blocked'), 'success');
        await loadAllData();
    } else {
        showToast(result.err || t('failedToBlock'), 'error');
    }
}

// =============================================
// CLIENT SUGGESTIONS (Appointment Modal)
// =============================================

function searchClientSuggestions() {
    const name = document.getElementById('appointmentClient').value.trim().toLowerCase();
    const suggestionsContainer = document.getElementById('clientSuggestions');
    
    if (!name || name.length < 2) {
        suggestionsContainer.classList.remove('show');
        suggestionsContainer.innerHTML = '';
        return;
    }
    
    const matches = [];
    for (const [key, client] of AppState.knownClients) {
        if (client.name && client.name.toLowerCase().includes(name)) {
            const count = getClientAppointmentCount(client.phone);
            matches.push({ ...client, key, count });
        }
    }
    
    if (matches.length === 0) {
        suggestionsContainer.classList.remove('show');
        suggestionsContainer.innerHTML = '';
        return;
    }
    
    matches.sort((a, b) => b.count - a.count);
    const limited = matches.slice(0, 6);
    
    suggestionsContainer.innerHTML = limited.map(client => {
        const safeName = (client.name || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const safePhone = (client.phone || '').replace(/'/g, "\\'");
        return `
        <div class="client-suggestion-item" onclick="selectClientSuggestion('${safeName}', '${safePhone}')">
            <div class="client-suggestion-name">${client.name}</div>
            <div class="client-suggestion-info">
                <span class="client-suggestion-phone">${client.phone || '-'}</span>
                <span class="client-suggestion-count">${client.count} atendimento${client.count !== 1 ? 's' : ''}</span>
            </div>
        </div>`;
    }).join('');
    
    suggestionsContainer.classList.add('show');
}

function selectClientSuggestion(name, phone) {
    document.getElementById('appointmentClient').value = name;
    document.getElementById('appointmentPhone').value = phone;
    document.getElementById('clientSuggestions').classList.remove('show');
    
    // Load CPF and birthday if available
    const clientData = (AppState.clientData || {})[phone] || {};
    document.getElementById('appointmentCpf').value = clientData.cpf || '';
    document.getElementById('appointmentBirthday').value = clientData.birthday || '';
    
    // Also check knownClients for extra data
    const cleanPhone = phone.replace(/\D/g, '');
    const known = AppState.knownClients.get(cleanPhone);
    if (known) {
        if (!clientData.cpf && known.cpf) document.getElementById('appointmentCpf').value = known.cpf;
        if (!clientData.birthday && known.aniversario) document.getElementById('appointmentBirthday').value = known.aniversario;
    }
    
    searchClientHistory();
}

function searchClientHistory() {
    const phone = document.getElementById('appointmentPhone').value.trim();
    const badge = document.getElementById('clientHistoryBadge');
    const countEl = document.getElementById('clientHistoryCount');
    
    if (!phone || phone.length < 8) {
        badge.style.display = 'none';
        return;
    }
    
    const cleanPhone = phone.replace(/\D/g, '');
    
    const count = AppState.appointments.filter(a => {
        const aptPhone = (a.phone || '').replace(/\D/g, '');
        return aptPhone === cleanPhone || aptPhone.endsWith(cleanPhone) || cleanPhone.endsWith(aptPhone);
    }).length;
    
    const client = AppState.knownClients.get(cleanPhone);
    
    if (count > 0 || client) {
        countEl.textContent = count;
        badge.style.display = 'flex';
        
        // Auto-fill name if known client and field is empty
        if (client && !document.getElementById('appointmentClient').value.trim()) {
            document.getElementById('appointmentClient').value = client.name;
        }
        
        // Load CPF/birthday if available
        const clientData = (AppState.clientData || {})[client?.phone || phone] || {};
        if (clientData.cpf && !document.getElementById('appointmentCpf').value) {
            document.getElementById('appointmentCpf').value = clientData.cpf;
        }
        if (clientData.birthday && !document.getElementById('appointmentBirthday').value) {
            document.getElementById('appointmentBirthday').value = clientData.birthday;
        }
    } else {
        badge.style.display = 'none';
    }
}

// Função removida - duplicada na linha 3082 com implementação melhor
// (usa match exato e exclui bloqueios)

function formatCPF(input) {
    let v = input.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    input.value = v;
}

// Validação de dígitos verificadores do CPF
function validateCPF(cpf) {
    if (!cpf) return true; // CPF opcional
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais (inválido)
    if (/^(\d)\1{10}$/.test(cleaned)) return false;
    
    // Calcula primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    
    // Calcula segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    
    return parseInt(cleaned.charAt(9)) === digit1 && parseInt(cleaned.charAt(10)) === digit2;
}

function formatNameCapitalize(input) {
    const pos = input.selectionStart;
    input.value = input.value.replace(/\b\w/g, c => c.toUpperCase());
    input.setSelectionRange(pos, pos);
}

// Close suggestions on outside click
document.addEventListener('click', function(e) {
    const suggestionsEl = document.getElementById('clientSuggestions');
    if (suggestionsEl && !e.target.closest('.input-with-suggestions')) {
        suggestionsEl.classList.remove('show');
    }
});

// =============================================
// APPOINTMENT DETAIL (Enhanced)
// =============================================

function showAppointmentDetail(id) {
    const apt = AppState.appointments.find(a => String(a.id) === String(id));
    if (!apt) return;
    
    const isLunch = apt.servico === 'Almoço';
    const isBlocked = apt.client === 'BLOQUEADO' || apt.blocked;
    
    // Check permissions
    const isAdmin = AppState.currentUser && (AppState.currentUser.isAdmin || AppState.currentUser.id === 0);
    const isOwner = AppState.currentUser && String(AppState.currentUser.id) === String(apt.agendadorId);
    const canEdit = (isAdmin || isOwner) && !isVisitor();
    
    // Get professional name
    let agendadorName = apt.agendador || '-';
    if ((!agendadorName || agendadorName === '-') && apt.agendadorId) {
        const ag = AppState.agendadores.find(a => String(a.id) === String(apt.agendadorId));
        if (ag) agendadorName = ag.nome || ag.name || '-';
    }
    
    // Get client CPF, birthday and appointment count
    let clientCpf = '';
    let clientBirthday = '';
    let aptCount = 0;
    if (apt.phone) {
        const clientData = (AppState.clientData || {})[apt.phone] || {};
        const cleanPhone = apt.phone.replace(/\D/g, '');
        const clientInfo = AppState.knownClients.get(cleanPhone);
        clientCpf = clientData.cpf || clientInfo?.cpf || '';
        clientBirthday = clientData.birthday || clientInfo?.aniversario || '';
        aptCount = clientInfo?.totalAgendamentos || getClientAppointmentCount(apt.phone);
    }
    
    // Set hidden fields
    document.getElementById('detailId').value = id;
    document.getElementById('detailPhoneOriginal').value = apt.phone || '';
    
    // Header
    document.getElementById('detailClientName').textContent = isLunch ? 'ALMOÇO' : (isBlocked ? 'BLOQUEADO' : (apt.client || '-'));
    document.getElementById('detailServiceName').textContent = isLunch ? 'Horário de almoço' : (isBlocked ? 'Horário bloqueado' : (apt.servico || '-'));
    document.getElementById('detailAptCount').textContent = `${aptCount} agendamento${aptCount !== 1 ? 's' : ''}`;
    
    // Editable fields
    document.getElementById('detailClientInput').value = isBlocked ? '' : (apt.client || '');
    document.getElementById('detailPhoneInput').value = isBlocked ? '' : (apt.phone || '');
    document.getElementById('detailCpfInput').value = clientCpf;
    document.getElementById('detailBirthdayInput').value = clientBirthday;
    
    // Read-only fields
    document.getElementById('detailDate').textContent = formatDateBR(apt.date);
    document.getElementById('detailTime').textContent = apt.time || '-';
    document.getElementById('detailProfessional').textContent = agendadorName;
    
    // Show/hide buttons based on permission
    const btnDelete = document.getElementById('btnDeleteApt');
    const btnSave = document.getElementById('btnSaveAptChanges');
    if (btnDelete) btnDelete.style.display = canEdit ? 'flex' : 'none';
    if (btnSave) btnSave.style.display = canEdit && !isBlocked && !isLunch ? 'flex' : 'none';
    
    // Disable inputs for blocked/lunch or no permission
    const inputs = ['detailClientInput', 'detailPhoneInput', 'detailCpfInput', 'detailBirthdayInput'];
    inputs.forEach(inputId => {
        const el = document.getElementById(inputId);
        if (el) el.disabled = !canEdit || isBlocked || isLunch;
    });
    
    openModal('modal-appointment-detail');
}

async function saveAppointmentChanges() {
    const id = document.getElementById('detailId').value;
    const apt = AppState.appointments.find(a => String(a.id) === String(id));
    if (!apt) return;
    
    const newClient = document.getElementById('detailClientInput').value.trim();
    const newPhone = document.getElementById('detailPhoneInput').value.trim();
    const newCpf = document.getElementById('detailCpfInput').value.trim();
    const newBirthday = document.getElementById('detailBirthdayInput').value;
    
    if (!newClient) {
        showToast(t('fillNamePhone'), 'error');
        return;
    }
    
    const btn = document.getElementById('btnSaveAptChanges');
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="loading-spinner"></div>';
    setModalBusy('modal-appointment-detail', true);
    
    // Update appointment
    const result = await DB.update({
        id,
        client: newClient,
        phone: newPhone
    });
    
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    setModalBusy('modal-appointment-detail', false);
    
    if (result.ok) {
        // Save CPF/birthday locally
        if (newPhone && (newCpf || newBirthday)) {
            if (!AppState.clientData) AppState.clientData = {};
            AppState.clientData[newPhone] = {
                cpf: newCpf || '',
                birthday: newBirthday || ''
            };
            try { localStorage.setItem('nexus_client_data', JSON.stringify(AppState.clientData)); } catch(e) {}
        }
        
        // Update client in backend if name/phone changed
        if (newPhone) {
            const cleanPhone = newPhone.replace(/\D/g, '');
            const clientInfo = AppState.knownClients.get(cleanPhone);
            if (clientInfo) {
                try {
                    await DB.atualizarCliente({ telefone: newPhone, nome: newClient, cpf: newCpf, aniversario: newBirthday });
                } catch(e) {}
            }
        }
        
        closeModal('modal-appointment-detail');
        showToast(t('saveSuccess'), 'success');
        await loadAllData();
    } else {
        showToast(result.err || t('saveError'), 'error');
    }
}

function confirmDeleteAppointment() {
    const id = document.getElementById('detailId').value;
    const apt = AppState.appointments.find(a => String(a.id) === String(id));
    if (!apt) return;
    
    // Block deletion of past appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aptDate = new Date(apt.date + 'T00:00:00');
    
    if (aptDate < today) {
        showToast('Não é possível excluir agendamentos de datas passadas', 'error');
        return;
    }
    
    const isBlocked = apt.client === 'BLOQUEADO' || apt.blocked;
    const isLunch = apt.servico === 'Almoço';
    
    document.getElementById('confirmCancelAptId').value = id;
    
    if (isBlocked) {
        document.getElementById('confirmCancelTitle').textContent = 'Desbloquear Horário?';
        document.getElementById('confirmCancelDesc').textContent = `${formatDateBR(apt.date)} às ${apt.time}`;
    } else if (isLunch) {
        document.getElementById('confirmCancelTitle').textContent = 'Remover Almoço?';
        document.getElementById('confirmCancelDesc').textContent = `${formatDateBR(apt.date)} às ${apt.time}`;
    } else {
        document.getElementById('confirmCancelTitle').textContent = 'Cancelar Agendamento?';
        document.getElementById('confirmCancelDesc').textContent = `${apt.client || 'Cliente'}: ${formatDateBR(apt.date)} às ${apt.time}`;
    }
    
    closeModal('modal-appointment-detail');
    openModal('modal-confirm-cancel');
}

async function executeConfirmedDelete() {
    const id = document.getElementById('confirmCancelAptId').value;
    
    AppState.pendingDeletions.add(String(id));
    
    const result = await DB.delete(id);
    
    if (result.ok) {
        closeModal('modal-confirm-cancel');
        showToast(t('appointmentCancelled'), 'success');
        await loadAllData();
    } else {
        showToast(result.err || t('deleteError'), 'error');
    }
    
    AppState.pendingDeletions.delete(String(id));
}

// =============================================
// CLIENTS
// =============================================

function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.filters-bar');
            if (parent) {
                parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            }
            
            const sort = this.dataset.sort;
            if (sort) {
                sortClients(sort);
            }
        });
    });
    
    const searchInput = document.getElementById('clientSearch');
    if (searchInput) {
        searchInput.addEventListener('input', renderClients);
    }
}

function extractClients() {
    let addedFromApts = 0;
    AppState.appointments.forEach(apt => {
        if (apt.client && apt.phone && apt.client !== 'BLOQUEADO') {
            const key = apt.phone.replace(/\D/g, '');
            if (!AppState.deletedClients.has(key) && !AppState.knownClients.has(key)) {
                AppState.knownClients.set(key, {
                    name: apt.client,
                    phone: apt.phone,
                    totalAgendamentos: 0
                });
                addedFromApts++;
            }
        }
    });
    
    AppState.knownClients.forEach((client, key) => {
        const count = getClientAppointmentCount(client.phone);
        if (!client.id || count > (client.totalAgendamentos || 0)) {
            client.totalAgendamentos = count;
        }
    });
    
    AppState.clients = Array.from(AppState.knownClients.values());
    // Debug: console.log('[extractClients] Appointments:', AppState.appointments.length, '| Added from apts:', addedFromApts, '| Total clients:', AppState.clients.length, '| DeletedClients:', AppState.deletedClients.size);
}

function renderClients() {
    const container = document.getElementById('clientsGrid');
    if (!container) return;
    
    const countEl = document.getElementById('clientsCount');
    if (countEl) countEl.textContent = AppState.clients.length;
    
    const searchInput = document.getElementById('clientSearch');
    const search = searchInput?.value?.toLowerCase() || '';
    
    let filtered = AppState.clients;
    if (search) {
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(search) || 
            c.phone.includes(search) ||
            (c.cpf && c.cpf.includes(search))
        );
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px;">
                <i class="fa-regular fa-address-book" style="font-size: 40px; margin-bottom: 16px;"></i>
                <p>${t('noClients')}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(client => {
        const initials = client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const totalAtend = client.totalAgendamentos || getClientAppointmentCount(client.phone);
        const hasNotes = AppState.clientNotes[client.phone];
        const clientData = AppState.clientData[client.phone] || {};
        const hasBirthday = clientData.birthday || client.birthday;
        
        let badges = [];
        if (totalAtend >= 10) badges.push('<span class="client-badge vip"><i class="fas fa-crown"></i> VIP</span>');
        if (hasNotes) badges.push('<span class="client-badge note"><i class="fa-solid fa-note-sticky"></i></span>');
        if (hasBirthday) badges.push('<span class="client-badge birthday"><i class="fas fa-cake-candles"></i></span>');
        
        return `
            <div class="client-card" onclick="openClientDetail('${client.phone}')">
                <div class="client-card-top">
                    <div class="client-avatar">${initials}</div>
                    <div class="client-card-info">
                        <div class="client-name">${client.name}</div>
                        <div class="client-phone"><i class="fas fa-phone"></i> ${client.phone}</div>
                    </div>
                    <div class="client-card-actions">
                        <button class="btn-card-action whatsapp" onclick="event.stopPropagation(); openWhatsApp('${client.phone}')" title="WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                    </div>
                </div>
                <div class="client-card-body">
                    <div class="client-stats-row">
                        <div class="client-stat-item">
                            <span class="stat-num">${totalAtend}</span>
                            <span class="stat-lbl">${t('appointments')}</span>
                        </div>
                    </div>
                    <div class="client-badges">
                        ${badges.join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function sortClients(sortType) {
    if (sortType === 'name') {
        AppState.clients.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'recent') {
        extractClients();
    }
    renderClients();
}

function openClientFromSchedule(phone, clientName) {
    // Try by phone first
    if (phone) {
        const key = phone.replace(/\D/g, '');
        if (AppState.knownClients.has(key)) {
            openClientDetail(phone);
            return;
        }
    }
    // Fallback: find by name
    if (clientName) {
        for (const [key, client] of AppState.knownClients) {
            if (client.name && client.name.toUpperCase() === clientName.toUpperCase()) {
                openClientDetail(client.phone || key);
                return;
            }
        }
    }
    showToast('Cliente não encontrado no cadastro', 'error');
}

function openClientDetail(phone) {
    const key = phone.replace(/\D/g, '');
    const client = AppState.knownClients.get(key);
    if (!client) return;
    
    document.getElementById('clientDetailId').value = client.id || '';
    document.getElementById('clientDetailPhone').value = client.phone;
    document.getElementById('clientDetailOriginalPhone').value = client.phone;
    document.getElementById('clientDetailName').value = client.name;
    document.getElementById('clientDetailCpf').value = client.cpf || AppState.clientData[client.phone]?.cpf || '';
    document.getElementById('clientDetailBirthday').value = client.birthday || AppState.clientData[client.phone]?.birthday || '';
    document.getElementById('clientDetailNotes').value = AppState.clientNotes[client.phone] || '';
    
    // Populate appointments history
    renderClientAppointmentsHistory(client.phone, client.name);
    
    // Populate purchases history
    renderClientPurchasesHistory(client.phone, client.name);
    
    // Reset to appointments tab
    switchClientHistoryTab('appointments');
    
    const isReadOnly = isVisitor();
    document.querySelectorAll('#modal-client-detail input, #modal-client-detail textarea').forEach(el => {
        el.readOnly = isReadOnly;
    });
    
    document.getElementById('btnSaveClient').style.display = isReadOnly ? 'none' : 'flex';
    document.getElementById('btnDeleteClient').style.display = isReadOnly ? 'none' : 'flex';
    
    openModal('modal-client-detail');
}

function renderClientAppointmentsHistory(phone, clientName) {
    const historyEl = document.getElementById('clientAppointmentsHistory');
    if (!historyEl) return;
    
    // Get appointments from AppState for this client
    const clientAppointments = (AppState.appointments || [])
        .filter(apt => {
            // Check both possible field names (phone/telefone, client/nome)
            const aptPhone = (apt.phone || apt.telefone || '').replace(/\D/g, '');
            const clientPhone = phone.replace(/\D/g, '');
            const aptName = (apt.client || apt.nome || '').toUpperCase();
            const searchName = (clientName || '').toUpperCase();
            const phoneMatch = aptPhone && clientPhone && aptPhone === clientPhone;
            const nameMatch = aptName && searchName && aptName === searchName;
            // Exclude blocked slots
            if (apt.blocked || apt.client === 'BLOQUEADO') return false;
            return phoneMatch || nameMatch;
        })
        .sort((a, b) => {
            const dateA = new Date((a.date || a.data) + 'T' + (a.time || a.hora || '00:00'));
            const dateB = new Date((b.date || b.data) + 'T' + (b.time || b.hora || '00:00'));
            return dateB - dateA; // Sort descending (most recent first)
        })
        .slice(0, 10); // Show last 10
    
    if (clientAppointments.length === 0) {
        historyEl.innerHTML = '<div class="history-empty"><i class="fa-regular fa-calendar"></i><span>Nenhum agendamento encontrado</span></div>';
        return;
    }
    
    historyEl.innerHTML = clientAppointments.map(apt => {
        const aptDate = apt.date || apt.data;
        const date = aptDate ? formatDisplayDate(aptDate) : '-';
        const time = apt.time || apt.hora || '-';
        const professional = apt.agendadorNome || apt.agendador || 'Profissional';
        const service = apt.servico || apt.service || '-';
        
        return `
            <div class="history-item appointment">
                <div class="history-item-icon">
                    <i class="fa-solid fa-calendar-check"></i>
                </div>
                <div class="history-item-content">
                    <div class="history-item-main">
                        <span class="history-item-service">${service}</span>
                        <span class="history-item-professional"><i class="fa-solid fa-user-tie"></i> ${professional}</span>
                    </div>
                    <div class="history-item-meta">
                        <span class="history-item-date"><i class="fa-regular fa-calendar"></i> ${date}</span>
                        <span class="history-item-time"><i class="fa-regular fa-clock"></i> ${time}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderClientPurchasesHistory(phone, clientName) {
    const historyEl = document.getElementById('clientPurchasesHistory');
    if (!historyEl) return;
    
    // Load transactions and filter by this client
    loadTransactionsFromStorage();
    
    // Normalizar telefone para comparação
    const normalizedPhone = phone.replace(/\D/g, '');
    // Normalizar nome para comparação (remover acentos, espaços extras)
    const normalizedClientName = (clientName || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    
    const clientTransactions = (AppState.transactions || [])
        .filter(t => {
            if (t.type !== 'income') return false;
            if (!t.items || t.items.length === 0) return false;
            
            // Match por telefone (preferência)
            const transPhone = (t.clientPhone || '').replace(/\D/g, '');
            if (transPhone && normalizedPhone && transPhone === normalizedPhone) {
                return true;
            }
            
            // Match por nome (normalizado)
            const transName = (t.clientName || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
            if (transName && normalizedClientName && transName === normalizedClientName) {
                return true;
            }
            
            return false;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 15);
    
    // Extract all items (products and services) from transactions
    const purchasedItems = [];
    clientTransactions.forEach(t => {
        (t.items || []).forEach(item => {
            purchasedItems.push({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                date: t.date,
                paymentMethod: t.paymentMethod,
                type: item.type || 'product'
            });
        });
    });
    
    if (purchasedItems.length === 0) {
        historyEl.innerHTML = '<div class="history-empty"><i class="fa-solid fa-shopping-bag"></i><span>Nenhuma compra registrada</span></div>';
        return;
    }
    
    historyEl.innerHTML = purchasedItems.map(p => {
        const date = p.date ? formatDisplayDate(p.date) : '-';
        const total = (p.price * p.quantity).toFixed(2).replace('.', ',');
        const icon = p.type === 'service' ? 'fa-scissors' : 'fa-box';
        const iconClass = p.type === 'service' ? '' : 'product';
        
        return `
            <div class="history-item purchase">
                <div class="history-item-icon ${iconClass}">
                    <i class="fa-solid ${icon}"></i>
                </div>
                <div class="history-item-content">
                    <div class="history-item-main">
                        <span class="history-item-product">${p.name}</span>
                        <span class="history-item-qty">${p.quantity}x</span>
                    </div>
                    <div class="history-item-meta">
                        <span class="history-item-date"><i class="fa-regular fa-calendar"></i> ${date}</span>
                        <span class="history-item-value">R$ ${total}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function formatDisplayDate(dateStr) {
    if (!dateStr) return '-';
    try {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    } catch (e) {
        return dateStr;
    }
}

function switchClientHistoryTab(tab) {
    // Update tabs
    document.querySelectorAll('.history-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    
    // Update lists
    const appointmentsList = document.getElementById('clientAppointmentsHistory');
    const purchasesList = document.getElementById('clientPurchasesHistory');
    
    if (appointmentsList) {
        appointmentsList.classList.toggle('active', tab === 'appointments');
    }
    if (purchasesList) {
        purchasesList.classList.toggle('active', tab === 'purchases');
    }
}

function openNewClient() {
    if (isVisitor()) {
        showToast(t('viewModeNoCreate'), 'error');
        return;
    }
    
    document.getElementById('newClientName').value = '';
    document.getElementById('newClientPhone').value = '';
    document.getElementById('newClientCpf').value = '';
    document.getElementById('newClientBirthday').value = '';
    
    openModal('modal-new-client');
    
    setTimeout(() => {
        document.getElementById('newClientName').focus();
    }, 100);
}

async function saveNewClient() {
    const name = document.getElementById('newClientName').value.trim();
    const phone = document.getElementById('newClientPhone').value.trim();
    const cpf = document.getElementById('newClientCpf').value.trim();
    const birthday = document.getElementById('newClientBirthday').value;
    
    if (!name || !phone) {
        showToast(t('fillNamePhone'), 'error');
        return;
    }
    
    // Validar formato do telefone (mínimo 10 dígitos)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        showToast('Telefone inválido - use DDD + número', 'error');
        return;
    }
    
    // Validar CPF se informado
    if (cpf && !validateCPF(cpf)) {
        showToast('CPF inválido - verifique os dígitos', 'error');
        return;
    }
    
    // Validar aniversário não é no futuro
    if (birthday) {
        const birthDate = new Date(birthday + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (birthDate > today) {
            showToast('Data de aniversário não pode ser no futuro', 'error');
            return;
        }
    }
    
    const key = phone.replace(/\D/g, '');
    if (AppState.knownClients.has(key)) {
        showToast(t('clientAlreadyExists'), 'error');
        return;
    }
    
    const btn = document.getElementById('btnSaveNewClient');
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="loading-spinner"></div>';
    setModalBusy('modal-new-client', true);
    
    const result = await DB.cadastrarCliente({
        nome: name,
        telefone: phone,
        cpf: cpf || '',
        aniversario: birthday || ''
    });
    
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    setModalBusy('modal-new-client', false);
    
    if (result.ok) {
        AppState.knownClients.set(key, {
            id: result.id,
            name,
            phone,
            cpf,
            birthday,
            totalAgendamentos: 0
        });
        
        AppState.clients = Array.from(AppState.knownClients.values());
        
        closeModal('modal-new-client');
        showToast(t('clientRegistered'), 'success');
        renderClients();
    } else {
        showToast(result.err || t('errorRegistering'), 'error');
    }
}

async function saveClientChanges() {
    const id = document.getElementById('clientDetailId').value;
    const originalPhone = document.getElementById('clientDetailOriginalPhone').value;
    const name = document.getElementById('clientDetailName').value.trim();
    const phone = document.getElementById('clientDetailPhone').value.trim();
    const cpf = document.getElementById('clientDetailCpf').value.trim();
    const birthday = document.getElementById('clientDetailBirthday').value;
    const notes = document.getElementById('clientDetailNotes').value.trim();
    
    if (!name || !phone) {
        showToast(t('fillNamePhone'), 'error');
        return;
    }
    
    // Validar formato do telefone (mínimo 10 dígitos)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        showToast('Telefone inválido - use DDD + número', 'error');
        return;
    }
    
    // Validar CPF se informado
    if (cpf && !validateCPF(cpf)) {
        showToast('CPF inválido - verifique os dígitos', 'error');
        return;
    }
    
    // Validar aniversário não é no futuro
    if (birthday) {
        const birthDate = new Date(birthday + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (birthDate > today) {
            showToast('Data de aniversário não pode ser no futuro', 'error');
            return;
        }
    }
    
    if (id) {
        const result = await DB.atualizarCliente({
            id,
            nome: name,
            telefone: phone,
            cpf: cpf || '',
            aniversario: birthday || ''
        });
        
        if (!result.ok) {
            showToast(result.err || t('errorUpdating'), 'error');
        }
    }
    
    const originalKey = originalPhone.replace(/\D/g, '');
    const newKey = phone.replace(/\D/g, '');
    
    if (AppState.knownClients.has(originalKey)) {
        AppState.knownClients.delete(originalKey);
    }
    
    AppState.knownClients.set(newKey, {
        id,
        name,
        phone,
        cpf,
        birthday,
        totalAgendamentos: AppState.knownClients.get(originalKey)?.totalAgendamentos || 0
    });
    
    if (notes) {
        AppState.clientNotes[phone] = notes;
    } else {
        delete AppState.clientNotes[phone];
    }
    
    if (cpf || birthday) {
        AppState.clientData[phone] = { cpf, birthday };
    } else {
        delete AppState.clientData[phone];
    }
    
    saveConfig();
    AppState.clients = Array.from(AppState.knownClients.values());
    
    closeModal('modal-client-detail');
    showToast(t('clientUpdated'), 'success');
    renderClients();
}

async function deleteClient() {
    const id = document.getElementById('clientDetailId').value;
    const phone = document.getElementById('clientDetailPhone').value;
    
    if (!confirm(t('deleteClientTitle') + '\n' + t('clientWillBeRemoved'))) {
        return;
    }
    
    // Exclui no backend primeiro
    if (id) {
        try {
            const result = await DB.excluirCliente(id);
            if (!result.ok) {
                console.error('[Clientes] Backend recusou exclusão:', result.err);
                showToast('Erro ao excluir: ' + (result.err || 'erro desconhecido'), 'error');
                return;
            }
        } catch (e) {
            console.error('[Clientes] Erro ao excluir no backend:', e);
            showToast('Erro ao excluir cliente', 'error');
            return;
        }
    }
    
    const key = phone.replace(/\D/g, '');
    AppState.knownClients.delete(key);
    AppState.deletedClients.add(key);
    delete AppState.clientNotes[phone];
    delete AppState.clientData[phone];
    
    saveConfig();
    AppState.clients = Array.from(AppState.knownClients.values());
    
    closeModal('modal-client-detail');
    showToast(t('clientDeleted'), 'success');
    renderClients();
}

function openWhatsApp(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${cleanPhone}`;
    window.open(whatsappUrl, '_blank');
}

function getClientAppointmentCount(phone) {
    if (!phone) return 0;
    const cleanPhone = phone.replace(/\D/g, '');
    return AppState.appointments.filter(a => 
        a.phone && a.phone.replace(/\D/g, '') === cleanPhone && 
        a.client !== 'BLOQUEADO' && !a.blocked
    ).length;
}

// =============================================
// STATISTICS
// =============================================

// State for stats period navigation
if (!AppState.statsPeriodType) AppState.statsPeriodType = 'week';
if (!AppState.statsPeriodOffset) AppState.statsPeriodOffset = 0;
if (!AppState.statsChartType) AppState.statsChartType = 'bar';

function setStatsPeriod(type) {
    AppState.statsPeriodType = type;
    AppState.statsPeriodOffset = 0;
    document.querySelectorAll('.period-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.period === type);
    });
    renderStats();
}

function setChartType(type) {
    AppState.statsChartType = type;
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
    renderStats();
}

function navigateStatsPeriod(dir) {
    // Limitar navegação: máximo 24 meses no passado, não pode ir pro futuro
    const newOffset = AppState.statsPeriodOffset + dir;
    if (newOffset > 0) {
        showToast('Não é possível navegar para o futuro', 'warning');
        return;
    }
    if (newOffset < -24) {
        showToast('Limite de histórico: 24 meses', 'warning');
        return;
    }
    AppState.statsPeriodOffset = newOffset;
    renderStats();
}

function getStatsPeriodRange() {
    const today = new Date();
    const offset = AppState.statsPeriodOffset || 0;

    if (AppState.statsPeriodType === 'month') {
        const start = new Date(today.getFullYear(), today.getMonth() + offset, 1);
        const end = new Date(today.getFullYear(), today.getMonth() + offset + 1, 0);
        return { start, end, label: getMonths()[start.getMonth()] + ' ' + start.getFullYear() };
    }

    // week
    const ref = new Date(today);
    ref.setDate(today.getDate() + (offset * 7));
    const dayOfWeek = ref.getDay();
    const start = new Date(ref);
    start.setDate(ref.getDate() - dayOfWeek);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const fmt = d => String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0');
    return { start, end, label: fmt(start) + ' — ' + fmt(end) };
}

function initStatsWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    AppState.statsWeekStart = new Date(today);
    AppState.statsWeekStart.setDate(today.getDate() - dayOfWeek);
    
    AppState.statsWeekEnd = new Date(AppState.statsWeekStart);
    AppState.statsWeekEnd.setDate(AppState.statsWeekStart.getDate() + 6);
}

const RING_COLORS = ['#00ff88','#4DABF7','#ffa500','#ff4444','#a855f7','#ec4899','#14b8a6','#eab308'];

function renderStats() {
    const today = new Date();
    const todayStr = formatDate(today);

    // Control animations - only animate when navigating to stats screen
    const statsScreen = document.getElementById('screen-stats');
    if (statsScreen) {
        if (AppState.statsNeedsAnimation) {
            statsScreen.classList.remove('stats-no-animate');
            // Disable animation for subsequent auto-refresh updates
            setTimeout(() => {
                AppState.statsNeedsAnimation = false;
            }, 50);
        } else {
            statsScreen.classList.add('stats-no-animate');
        }
    }

    // Update mini calendar to show week highlight
    if (typeof renderMiniCalendar === 'function') {
        renderMiniCalendar();
    }

    const validAppointments = AppState.appointments.filter(a =>
        a.client !== 'BLOQUEADO' && !a.blocked && a.servico !== 'Almoço'
    );

    const { start, end, label } = getStatsPeriodRange();
    const startStr = formatDate(start);
    const endStr = formatDate(end);

    // Period label - Premium display
    const periodLabel = document.getElementById('statsPeriodLabel');
    if (periodLabel) {
        const rangeText = periodLabel.querySelector('.date-range-text');
        if (rangeText) {
            rangeText.textContent = label;
        } else {
            periodLabel.textContent = label;
        }
    }

    // Filter appointments for current period
    const periodAppts = validAppointments.filter(a => a.date >= startStr && a.date <= endStr);

    // ---- KPI Cards ----
    const totalClients = AppState.clients.length;

    const el = id => document.getElementById(id);
    const setTxt = (id, v) => { const e = el(id); if (e) e.textContent = v; };

    setTxt('statTotalAppointments', periodAppts.length);
    setTxt('statTotalClients', totalClients);

    // Average per day
    const daySpan = Math.round((end - start) / 86400000) + 1;
    const uniqueDaysInPeriod = new Set(periodAppts.map(a => a.date)).size;
    const avg = uniqueDaysInPeriod > 0 ? (periodAppts.length / uniqueDaysInPeriod).toFixed(1) : '0';
    setTxt('statAvgDay', avg);

    // Peak day
    const dayCounts = {};
    periodAppts.forEach(a => { dayCounts[a.date] = (dayCounts[a.date] || 0) + 1; });
    let peakDay = '—', peakCount = 0;
    Object.entries(dayCounts).forEach(([date, count]) => {
        if (count > peakCount) { peakCount = count; peakDay = formatDateBR(date); }
    });
    setTxt('statPeakDay', peakCount > 0 ? peakCount : '—');
    const peakLabel = el('statPeakDayLabel');
    if (peakLabel) peakLabel.textContent = peakCount > 0 ? peakDay : t('bestDay');

    // ---- KPI Badges (comparison vs previous period) ----
    const periodMs = end - start;
    const prevStart = new Date(start.getTime() - periodMs - 86400000);
    const prevEnd = new Date(start.getTime() - 86400000);
    const prevStartStr = formatDate(prevStart);
    const prevEndStr = formatDate(prevEnd);
    const prevAppts = validAppointments.filter(a => a.date >= prevStartStr && a.date <= prevEndStr);

    renderKpiBadge('kpiBadgeTotal', periodAppts.length, prevAppts.length);
    renderKpiBadge('kpiBadgeAvg', parseFloat(avg), prevAppts.length > 0 ? parseFloat((prevAppts.length / Math.max(1, new Set(prevAppts.map(a=>a.date)).size)).toFixed(1)) : 0);

    // Hide badges for clients (no period comparison) and peak
    const bc = el('kpiBadgeClients'); if (bc) bc.textContent = '';
    const bp = el('kpiBadgePeak'); if (bp) bp.textContent = '';

    // ---- Bar Chart ----
    renderBarChart(validAppointments, start, end, todayStr);

    // ---- Services Ring ----
    renderServicesRing(periodAppts);

    // ---- Peak Hours ----
    renderPeakHours(periodAppts);

    // ---- Top Professionals ----
    renderTopProfessionals(periodAppts);

    // ---- Summary ----
    renderStatsSummary(periodAppts, validAppointments, todayStr);
}

function renderKpiBadge(id, current, previous) {
    const badge = document.getElementById(id);
    if (!badge) return;
    if (previous === 0 && current === 0) { badge.textContent = ''; badge.className = 'kpi-badge'; return; }
    if (previous === 0) {
        badge.textContent = '+100%';
        badge.className = 'kpi-badge up';
        return;
    }
    const pct = Math.round(((current - previous) / previous) * 100);
    if (pct === 0) {
        badge.textContent = '0%';
        badge.className = 'kpi-badge neutral';
    } else if (pct > 0) {
        badge.textContent = '+' + pct + '%';
        badge.className = 'kpi-badge up';
    } else {
        badge.textContent = pct + '%';
        badge.className = 'kpi-badge down';
    }
}

function renderBarChart(allAppts, start, end, todayStr) {
    const chartArea = document.getElementById('chartBars');
    const gridLines = document.getElementById('chartGridLines');
    const svgOverlay = document.getElementById('chartSvgOverlay');
    if (!chartArea) return;

    const chartType = AppState.statsChartType || 'bar';
    const isMonth = AppState.statsPeriodType === 'month';

    // Build data points
    const dayNames = getWeekdaysShort();
    const dataPoints = [];
    let maxCount = 0;

    if (!isMonth) {
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            const dateStr = formatDate(date);
            const count = allAppts.filter(a => a.date === dateStr).length;
            dataPoints.push({ label: dayNames[i], count, isToday: dateStr === todayStr });
            if (count > maxCount) maxCount = count;
        }
    } else {
        const totalDays = Math.round((end - start) / 86400000) + 1;
        for (let i = 0; i < totalDays; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            const dateStr = formatDate(date);
            const count = allAppts.filter(a => a.date === dateStr).length;
            dataPoints.push({ label: String(date.getDate()), count, isToday: dateStr === todayStr });
            if (count > maxCount) maxCount = count;
        }
    }

    // Render grid lines
    if (gridLines) {
        const steps = 5;
        const gridMax = maxCount > 0 ? Math.ceil(maxCount / steps) * steps : 5;
        let gridHtml = '';
        for (let i = steps; i >= 0; i--) {
            const val = Math.round((gridMax / steps) * i);
            gridHtml += `<div class="chart-grid-line"><span class="grid-value">${val}</span></div>`;
        }
        gridLines.innerHTML = gridHtml;
    }

    const gridMax = maxCount > 0 ? Math.ceil(maxCount / 5) * 5 : 5;

    // Clear SVG
    if (svgOverlay) {
        svgOverlay.innerHTML = '';
        svgOverlay.style.display = chartType === 'bar' ? 'none' : 'block';
    }

    if (chartType === 'bar') {
        // Bar chart - add scrollable wrapper for month view
        const parentEl = chartArea.parentElement;
        if (isMonth && dataPoints.length > 14) {
            parentEl.style.overflowX = 'auto';
            parentEl.style.overflowY = 'hidden';
            chartArea.style.minWidth = `${dataPoints.length * 28}px`;
        } else {
            parentEl.style.overflowX = '';
            parentEl.style.overflowY = '';
            chartArea.style.minWidth = '';
        }
        
        const barStyle = isMonth ? 'flex:0 0 auto; width: 24px; min-width: 24px;' : '';
        chartArea.innerHTML = dataPoints.map(d => {
            const height = gridMax > 0 ? Math.max(2, (d.count / gridMax) * 100) : 2;
            return `<div class="chart-bar-col ${d.isToday ? 'today' : ''}" ${barStyle ? `style="${barStyle}"` : ''}>
                <span class="bar-value">${d.count}</span>
                <div class="chart-bar ${d.isToday ? 'active' : ''}" style="--height: ${height}%;"></div>
                <span class="bar-label">${d.label}</span>
            </div>`;
        }).join('');

    } else {
        // Line or Area chart — render labels only (no value numbers above)
        // Reset scroll settings from bar mode
        const parentEl = chartArea.parentElement;
        parentEl.style.overflowX = '';
        parentEl.style.overflowY = '';
        chartArea.style.minWidth = '';
        
        chartArea.innerHTML = dataPoints.map(d => {
            return `<div class="chart-bar-col ${d.isToday ? 'today' : ''}">
                <div style="flex:1"></div>
                <span class="bar-label">${d.label}</span>
            </div>`;
        }).join('');

        if (svgOverlay) {
            // Use actual pixel dimensions for proper aspect ratio
            const contentRect = chartArea.getBoundingClientRect();
            const w = contentRect.width || 400;
            const h = contentRect.height || 180;
            const n = dataPoints.length;

            // Each column is centered, calculate X from column centers
            const colW = w / n;
            const points = dataPoints.map((d, i) => {
                const x = colW * i + colW / 2;
                // Map count to Y: 0 = bottom (y=h), gridMax = top (y=0)
                const y = gridMax > 0 ? (1 - d.count / gridMax) * h : h;
                return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, isToday: d.isToday };
            });

            const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
            let svgHtml = `<defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(0,255,136,0.3)"/>
                <stop offset="100%" stop-color="rgba(0,255,136,0.02)"/>
            </linearGradient></defs>`;

            if (chartType === 'area') {
                const first = points[0];
                const last = points[points.length - 1];
                const bottomY = h;
                const areaPoints = `${first.x},${bottomY} ${pointsStr} ${last.x},${bottomY}`;
                svgHtml += `<polygon points="${areaPoints}" fill="url(#areaGrad)" />`;
            }

            svgHtml += `<polyline points="${pointsStr}" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />`;

            // Dots
            points.forEach(p => {
                const r = p.isToday ? 5 : 4;
                const glow = p.isToday ? `<circle cx="${p.x}" cy="${p.y}" r="10" fill="rgba(0,255,136,0.15)" />` : '';
                svgHtml += glow;
                svgHtml += `<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="var(--primary)" stroke="#1a1a1a" stroke-width="2" />`;
            });

            svgOverlay.setAttribute('viewBox', `0 0 ${w} ${h}`);
            svgOverlay.innerHTML = svgHtml;
        }
    }
}

// Period Modal - Premium
let periodModalState = {
    type: 'week',
    weekOffset: 0,
    yearOffset: 0,
    selectedMonth: null
};

function openPeriodModal() {
    const modal = document.getElementById('periodModal');
    if (!modal) return;

    // Reset state to current period
    periodModalState.type = AppState.statsPeriodType || 'week';
    periodModalState.weekOffset = AppState.statsPeriodOffset || 0;
    periodModalState.yearOffset = 0;
    periodModalState.selectedMonth = null;

    if (periodModalState.type === 'month') {
        const { start } = getStatsPeriodRange();
        periodModalState.selectedMonth = start.getMonth();
        periodModalState.yearOffset = start.getFullYear() - new Date().getFullYear();
    }

    // Update tabs
    document.querySelectorAll('.period-modal-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.type === periodModalState.type);
    });

    // Update title
    const title = document.getElementById('periodModalTitle');
    if (title) {
        title.textContent = periodModalState.type === 'week' ? 'Selecionar Semana' : 'Selecionar Mês';
    }

    // Show correct view
    document.getElementById('periodViewWeek').style.display = periodModalState.type === 'week' ? 'block' : 'none';
    document.getElementById('periodViewMonth').style.display = periodModalState.type === 'month' ? 'block' : 'none';

    renderPeriodModalContent();
    modal.classList.add('active');
}

function setPeriodModalType(type) {
    periodModalState.type = type;
    
    const title = document.getElementById('periodModalTitle');
    if (title) {
        title.textContent = type === 'week' ? 'Selecionar Semana' : 'Selecionar Mês';
    }

    document.querySelectorAll('.period-modal-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.type === type);
    });

    document.getElementById('periodViewWeek').style.display = type === 'week' ? 'block' : 'none';
    document.getElementById('periodViewMonth').style.display = type === 'month' ? 'block' : 'none';

    if (type === 'month' && periodModalState.selectedMonth === null) {
        periodModalState.selectedMonth = new Date().getMonth();
    }

    renderPeriodModalContent();
}

function navigatePeriodModalWeek(dir) {
    periodModalState.weekOffset += dir;
    renderPeriodModalContent();
}

function navigatePeriodModalYear(dir) {
    periodModalState.yearOffset += dir;
    renderPeriodModalContent();
}

function renderPeriodModalContent() {
    if (periodModalState.type === 'week') {
        renderPeriodWeekView();
    } else {
        renderPeriodMonthView();
    }
}

function renderPeriodWeekView() {
    const today = new Date();
    const todayStr = formatDate(today);
    const dayNames = getWeekdaysShort();
    const months = getMonths();

    // Calculate week start based on offset
    const ref = new Date(today);
    ref.setDate(today.getDate() + (periodModalState.weekOffset * 7));
    const dayOfWeek = ref.getDay();
    const weekStart = new Date(ref);
    weekStart.setDate(ref.getDate() - dayOfWeek);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Update header
    const fmt = d => String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0');
    document.getElementById('periodWeekRange').textContent = fmt(weekStart) + ' — ' + fmt(weekEnd);
    document.getElementById('periodWeekYear').textContent = weekStart.getFullYear();

    // Get appointments
    const validAppointments = AppState.appointments.filter(a =>
        a.client !== 'BLOQUEADO' && !a.blocked && a.servico !== 'Almoço'
    );

    // Render week grid
    let gridHtml = '';
    let totalCount = 0;
    let maxCount = 0;
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const dateStr = formatDate(date);
        const isToday = dateStr === todayStr;
        const count = validAppointments.filter(a => a.date === dateStr).length;
        totalCount += count;
        if (count > maxCount) maxCount = count;

        gridHtml += `<div class="period-week-day in-range ${isToday ? 'is-today' : ''}">
            <span class="period-day-label">${dayNames[i]}</span>
            <span class="period-day-num">${date.getDate()}</span>
            <span class="period-day-count">${count > 0 ? `<span class="dot"></span>${count}` : '-'}</span>
        </div>`;
    }

    document.getElementById('periodWeekGrid').innerHTML = gridHtml;

    // Render summary
    const avgCount = (totalCount / 7).toFixed(1);
    document.getElementById('periodWeekSummary').innerHTML = `
        <div class="period-summary-item">
            <span class="period-summary-value">${totalCount}</span>
            <span class="period-summary-label">Total</span>
        </div>
        <div class="period-summary-item">
            <span class="period-summary-value">${avgCount}</span>
            <span class="period-summary-label">Média/dia</span>
        </div>
        <div class="period-summary-item">
            <span class="period-summary-value">${maxCount}</span>
            <span class="period-summary-label">Pico</span>
        </div>
    `;
}

function renderPeriodMonthView() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const targetYear = currentYear + periodModalState.yearOffset;
    const months = getMonths();

    document.getElementById('periodYearLabel').textContent = targetYear;

    const validAppointments = AppState.appointments.filter(a =>
        a.client !== 'BLOQUEADO' && !a.blocked && a.servico !== 'Almoço'
    );

    let gridHtml = '';
    for (let m = 0; m < 12; m++) {
        const monthStart = new Date(targetYear, m, 1);
        const monthEnd = new Date(targetYear, m + 1, 0);
        const startStr = formatDate(monthStart);
        const endStr = formatDate(monthEnd);
        
        const count = validAppointments.filter(a => a.date >= startStr && a.date <= endStr).length;
        const isCurrent = (m === currentMonth && targetYear === currentYear);
        const isSelected = (m === periodModalState.selectedMonth && periodModalState.yearOffset === 0) 
            || (periodModalState.selectedMonth === m);

        gridHtml += `<div class="period-month-item ${isCurrent ? 'current' : ''} ${isSelected ? 'selected' : ''}" onclick="selectPeriodMonth(${m})">
            <span class="period-month-name">${months[m].substring(0, 3).toUpperCase()}</span>
            <span class="period-month-count">${count} agend.</span>
        </div>`;
    }

    document.getElementById('periodMonthGrid').innerHTML = gridHtml;
}

function selectPeriodMonth(month) {
    periodModalState.selectedMonth = month;
    renderPeriodMonthView();
}

function applyPeriodSelection() {
    if (periodModalState.type === 'week') {
        AppState.statsPeriodType = 'week';
        AppState.statsPeriodOffset = periodModalState.weekOffset;
    } else {
        AppState.statsPeriodType = 'month';
        // Calculate month offset from current month
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const targetYear = currentYear + periodModalState.yearOffset;
        const monthDiff = ((targetYear - currentYear) * 12) + (periodModalState.selectedMonth - currentMonth);
        AppState.statsPeriodOffset = monthDiff;
    }

    // Update tabs in stats screen
    document.querySelectorAll('.period-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.period === AppState.statsPeriodType);
    });

    closePeriodModal();
    renderStats();
}

function closePeriodModal() {
    const modal = document.getElementById('periodModal');
    if (modal) modal.classList.remove('active');
}

function renderServicesRing(appointments) {
    const ring = document.getElementById('servicesRing');
    const legend = document.getElementById('servicesLegend');
    const center = document.getElementById('servicesRingCenter');
    if (!ring || !legend) return;

    const serviceCounts = {};
    appointments.forEach(a => {
        const name = a.servico || 'Outro';
        serviceCounts[name] = (serviceCounts[name] || 0) + 1;
    });

    const sorted = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const total = sorted.reduce((s, e) => s + e[1], 0);

    if (center) {
        const totalEl = center.querySelector('.ring-total');
        if (totalEl) totalEl.textContent = total;
    }

    // Detect viewBox size - use larger size for new layout
    const viewBox = ring.getAttribute('viewBox');
    const isLarge = viewBox && viewBox.includes('160');
    const cx = isLarge ? 80 : 60;
    const cy = isLarge ? 80 : 60;
    const r = isLarge ? 65 : 45;
    const strokeWidth = isLarge ? 14 : 10;

    if (total === 0) {
        ring.innerHTML = `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="rgba(255,255,255,0.06)" stroke-width="${strokeWidth}" fill="none"/>`;
        legend.innerHTML = '<div class="stats-empty">Sem dados</div>';
        return;
    }

    const circumference = 2 * Math.PI * r;
    let offset = 0;
    let circlesHtml = '';

    sorted.forEach(([name, count], i) => {
        const pct = count / total;
        const dash = pct * circumference;
        const gap = circumference - dash;
        const color = RING_COLORS[i % RING_COLORS.length];
        circlesHtml += `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="${color}" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${-offset}" />`;
        offset += dash;
    });

    ring.innerHTML = circlesHtml;

    // Use new list format for premium layout
    const isPremiumLayout = legend.classList.contains('services-list-premium');
    
    if (isPremiumLayout) {
        legend.innerHTML = sorted.map(([name, count], i) => {
            const pct = Math.round((count / total) * 100);
            const color = RING_COLORS[i % RING_COLORS.length];
            return `<div class="service-list-item">
                <span class="service-color-dot" style="background:${color}"></span>
                <div class="service-info">
                    <span class="service-name">${name}</span>
                    <span class="service-count">${count}x atendimento${count > 1 ? 's' : ''}</span>
                </div>
                <span class="service-pct-badge">${pct}%</span>
            </div>`;
        }).join('');
    } else {
        legend.innerHTML = sorted.map(([name, count], i) => {
            const pct = Math.round((count / total) * 100);
            const color = RING_COLORS[i % RING_COLORS.length];
            return `<div class="legend-item">
                <span class="legend-dot" style="background:${color}"></span>
                <div class="legend-info">
                    <span class="legend-name">${name}</span>
                    <span class="legend-count">${count}x</span>
                </div>
                <span class="legend-pct">${pct}%</span>
            </div>`;
        }).join('');
    }
}

function renderPeakHours(appointments) {
    const grid = document.getElementById('peakHoursGrid');
    if (!grid) return;

    // Get all business hours from settings
    let allHours = [];
    
    if (AppState.horarios) {
        // Find the widest range of hours across all days
        let minHour = 23;
        let maxHour = 0;
        
        Object.values(AppState.horarios).forEach(dayHours => {
            if (dayHours && dayHours.abre && dayHours.fecha) {
                const openH = parseInt(dayHours.abre.split(':')[0], 10);
                const closeH = parseInt(dayHours.fecha.split(':')[0], 10);
                if (dayHours.abre !== '00:00' || dayHours.fecha !== '00:00') {
                    if (openH < minHour) minHour = openH;
                    if (closeH > maxHour) maxHour = closeH;
                }
            }
        });
        
        // Generate all hours between min and max
        if (minHour <= maxHour) {
            for (let h = minHour; h <= maxHour; h++) {
                allHours.push(String(h).padStart(2, '0'));
            }
        }
    }
    
    // Fallback to default business hours if no config
    if (allHours.length === 0) {
        allHours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
    }

    // Count appointments per hour
    const hourCounts = {};
    allHours.forEach(h => { hourCounts[h] = 0; });
    
    appointments.forEach(a => {
        if (!a.time) return;
        const hour = a.time.split(':')[0];
        if (hourCounts.hasOwnProperty(hour)) {
            hourCounts[hour]++;
        }
    });

    // Find max for percentage calculation - use 70% max width for comparative display
    const maxCount = Math.max(...Object.values(hourCounts), 1);

    if (allHours.length === 0) {
        grid.innerHTML = '<div class="stats-empty">Horários não configurados</div>';
        return;
    }

    grid.innerHTML = allHours.map(hour => {
        const count = hourCounts[hour] || 0;
        // Cap at 70% width for comparative look (not filling entire bar)
        const pct = maxCount > 0 ? Math.round((count / maxCount) * 70) : 0;
        const isEmpty = count === 0;
        
        return `<div class="peak-hour-row">
            <span class="peak-hour-label">${hour}:00</span>
            <div class="peak-hour-bar-bg">
                <div class="peak-hour-bar" style="width: ${pct}%"></div>
            </div>
            <span class="peak-hour-count ${isEmpty ? 'peak-hour-empty' : ''}">${count}</span>
        </div>`;
    }).join('');
}

function renderStatsSummary(periodAppts, allAppts, todayStr) {
    const summaryRows = document.getElementById('statsSummaryRows');
    if (!summaryRows) return;
    
    const todayCount = periodAppts.filter(a => a.date === todayStr).length;
    
    const dayCounts = {};
    periodAppts.forEach(a => { dayCounts[a.date] = (dayCounts[a.date] || 0) + 1; });
    
    let bestDay = '—', bestCount = 0, worstDay = '—', worstCount = Infinity;
    Object.entries(dayCounts).forEach(([date, count]) => {
        if (count > bestCount) { bestCount = count; bestDay = formatDateBR(date); }
        if (count < worstCount) { worstCount = count; worstDay = formatDateBR(date); }
    });
    if (worstCount === Infinity) { worstCount = 0; worstDay = '—'; }
    
    const uniqueDays = Object.keys(dayCounts).length;
    const average = uniqueDays > 0 ? (periodAppts.length / uniqueDays).toFixed(1) : 0;
    
    summaryRows.innerHTML = `
        <div class="summary-row">
            <span class="summary-label"><i class="fa-solid fa-calendar-day"></i> ${t('today')}</span>
            <span class="summary-value highlight">${todayCount}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label"><i class="fa-solid fa-arrow-up"></i> ${t('bestDay')}</span>
            <span class="summary-value">${bestDay} (${bestCount})</span>
        </div>
        <div class="summary-row">
            <span class="summary-label"><i class="fa-solid fa-arrow-down"></i> ${t('worstDay')}</span>
            <span class="summary-value danger">${worstDay} (${worstCount})</span>
        </div>
        <div class="summary-row">
            <span class="summary-label"><i class="fa-solid fa-chart-simple"></i> ${t('average')}</span>
            <span class="summary-value">${average}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label"><i class="fa-solid fa-hashtag"></i> ${t('total')}</span>
            <span class="summary-value">${periodAppts.length}</span>
        </div>
    `;
}

function renderTopProfessionals(appointments) {
    const container = document.getElementById('topProfessionals');
    if (!container) return;
    
    // Get all professionals from AppState
    const allPros = AppState.agendadores || [];
    
    // Count appointments per professional
    const proCounts = {};
    
    // Initialize all professionals with 0 (exclude generic fallback names)
    allPros.forEach(ag => {
        const proName = ag.nome || ag.name || '';
        // Skip if name is empty or is the generic fallback
        if (proName && proName !== 'Profissional' && proName !== 'Professional') {
            proCounts[proName] = 0;
        }
    });
    
    // Count appointments for each professional
    appointments.forEach(a => {
        // Get professional name - try agendador field first, then look up by agendadorId
        let proName = a.agendador || '';
        
        // If no agendador name but has agendadorId, look it up
        if ((!proName || proName === '-') && a.agendadorId) {
            const ag = allPros.find(p => String(p.id) === String(a.agendadorId));
            if (ag) {
                proName = ag.nome || ag.name || '';
            }
        }
        
        // Skip generic names and empty
        if (proName && proName !== 'Profissional' && proName !== 'Professional' && proName !== '-') {
            if (proCounts.hasOwnProperty(proName)) {
                proCounts[proName] = proCounts[proName] + 1;
            } else {
                proCounts[proName] = 1;
            }
        }
    });
    
    // Sort by count (descending) - show ALL professionals
    const sorted = Object.entries(proCounts)
        .sort((a, b) => b[1] - a[1]);
    
    if (sorted.length === 0) {
        container.innerHTML = '<div class="stats-empty">Nenhum profissional cadastrado</div>';
        return;
    }

    const maxCount = sorted[0][1] || 1;
    
    container.innerHTML = sorted.map(([name, count], index) => {
        const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'default';
        return `<div class="top-item">
            <span class="top-rank ${rankClass}">${index + 1}</span>
            <div class="top-pro-info">
                <span class="top-name">${name}</span>
                <div class="top-bar-track"><div class="top-bar-fill" style="width: ${pct}%"></div></div>
            </div>
            <span class="top-value">${count}</span>
        </div>`;
    }).join('');
}

// =============================================
// PROFESSIONALS CONFIG
// =============================================

function renderProfessionalsConfig() {
    const container = document.getElementById('professionalsConfig');
    if (!container) return;
    
    if (!AppState.agendadores || AppState.agendadores.length === 0) {
        container.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted);">${t('connectToConfig')}</div>`;
        return;
    }
    
    const isAdmin = AppState.currentUser?.isAdmin || false;
    const currentUserId = String(AppState.currentUser?.id || '');
    
    const visibleAgendadores = isAdmin 
        ? AppState.agendadores 
        : AppState.agendadores.filter(ag => String(ag.id) === currentUserId);
    
    if (visibleAgendadores.length === 0) {
        container.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted);">${t('connectToConfig')}</div>`;
        return;
    }
    
    container.innerHTML = visibleAgendadores.map(ag => {
        const agName = ag.nome || ag.name || t('professionalFallback');
        const almocoInicio = ag.almocoInicio || '';
        const almocoFim = ag.almocoFim || '';
        const bloqueado = ag.bloqueado || false;
        const initials = agName.substring(0, 2).toUpperCase();
        
        return `
            <div class="professional-item${bloqueado ? ' blocked' : ''}" data-pro-id="${ag.id}">
                <div class="pro-header">
                    <div class="pro-header-left">
                        <div class="pro-avatar">${initials}</div>
                        <span class="pro-name">${agName}</span>
                    </div>
                    <div class="pro-header-right">
                        <span class="pro-lock-label">${bloqueado ? 'Bloqueado' : 'Bloquear'}</span>
                        <label class="toggle-switch" title="${t('lockSchedule')}">
                            <input type="checkbox" id="lockSchedule-${ag.id}" 
                                   ${bloqueado ? 'checked' : ''} 
                                   onchange="toggleAgendaBloqueada('${ag.id}')">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div class="pro-schedule-card">
                    <div class="pro-schedule-icon">
                        <i class="fas fa-utensils"></i>
                    </div>
                    <div class="pro-schedule-inputs">
                        <span>Almoço</span>
                        <input type="time" class="time-input" id="lunch-start-${ag.id}" value="${almocoInicio}">
                        <span>às</span>
                        <input type="time" class="time-input" id="lunch-end-${ag.id}" value="${almocoFim}">
                    </div>
                    <button class="btn-confirm" onclick="saveLunchTime('${ag.id}')">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

async function toggleAgendaBloqueada(agendadorId) {
    if (isVisitor()) {
        showToast(t('viewModeNoEdit'), 'error');
        return;
    }
    
    const ag = AppState.agendadores.find(a => String(a.id) === String(agendadorId));
    if (!ag) return;
    
    const toggle = document.getElementById(`lockSchedule-${agendadorId}`);
    const novoBloqueado = toggle ? toggle.checked : !ag.bloqueado;
    
    // Update UI immediately
    const proCard = document.querySelector(`.professional-item[data-pro-id="${agendadorId}"]`);
    if (proCard) {
        if (novoBloqueado) {
            proCard.classList.add('blocked');
            proCard.querySelector('.pro-lock-label').textContent = 'Bloqueado';
        } else {
            proCard.classList.remove('blocked');
            proCard.querySelector('.pro-lock-label').textContent = 'Bloquear';
        }
    }
    
    const result = await DB.setAgendadorConfig({
        agendadorId,
        bloqueado: novoBloqueado
    });
    
    if (result.ok) {
        ag.bloqueado = novoBloqueado;
        renderCalendar();
        
        const agName = ag.nome || ag.name || t('professionalFallback');
        if (novoBloqueado) {
            showToast(`${agName}: ${t('scheduleBlocked')}`, 'warning');
        } else {
            showToast(`${agName}: ${t('scheduleUnblocked')}`, 'success');
        }
    } else {
        // Revert UI on error
        if (toggle) toggle.checked = ag.bloqueado;
        if (proCard) {
            if (ag.bloqueado) {
                proCard.classList.add('blocked');
                proCard.querySelector('.pro-lock-label').textContent = 'Bloqueado';
            } else {
                proCard.classList.remove('blocked');
                proCard.querySelector('.pro-lock-label').textContent = 'Bloquear';
            }
        }
        showToast(t('errorSaving'), 'error');
    }
}

async function saveLunchTime(agendadorId) {
    if (isVisitor()) {
        showToast(t('viewModeNoEdit'), 'error');
        return;
    }
    
    const start = document.getElementById(`lunch-start-${agendadorId}`).value;
    const end = document.getElementById(`lunch-end-${agendadorId}`).value;
    
    // Validar que horário início < fim
    if (start && end && start >= end) {
        showToast('Horário de início deve ser antes do fim', 'error');
        return;
    }
    
    const result = await DB.setAgendadorConfig({
        agendadorId,
        almocoInicio: start || '',
        almocoFim: end || ''
    });
    
    if (result.ok) {
        const ag = AppState.agendadores.find(a => String(a.id) === String(agendadorId));
        if (ag) {
            ag.almocoInicio = start || '';
            ag.almocoFim = end || '';
        }
        
        renderCalendar();
        
        const agName = ag?.nome || ag?.name || t('professionalFallback');
        showToast(`${t('lunchTime')} ${agName} ${t('lunchSaved').replace('!', '')}!`, 'success');
    } else {
        showToast(t('errorSaving'), 'error');
    }
}

// =============================================
// MODALS
// =============================================

function initModals() {
    document.querySelectorAll('.btn-close, [data-close-modal]').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            // Prevenir fecha durante operações async
            if (this.classList.contains('modal-busy')) {
                return;
            }
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    document.getElementById('btnNewAppointment')?.addEventListener('click', () => {
        const today = formatDate(new Date());
        const ag = AppState.agendadores[0];
        if (ag) {
            const timeSlots = getTimeSlotsForDay(new Date());
            const firstTime = timeSlots?.[0] || '09:00';
            openNewAppointment(today, firstTime, ag.id);
        }
    });
    
    document.getElementById('btnCalendarNewAppointment')?.addEventListener('click', () => {
        const dateStr = formatDate(AppState.calendarDate);
        const ag = AppState.agendadores[0];
        if (ag) {
            const timeSlots = getTimeSlotsForDay(AppState.calendarDate);
            const firstTime = timeSlots?.[0] || '09:00';
            openNewAppointment(dateStr, firstTime, ag.id);
        }
    });
    
    document.getElementById('btnSaveAppointment')?.addEventListener('click', saveNewAppointment);
    document.getElementById('btnBlockTime')?.addEventListener('click', blockTimeSlot);
    
    // Appointment detail modal
    document.getElementById('btnDeleteApt')?.addEventListener('click', confirmDeleteAppointment);
    document.getElementById('btnSaveAptChanges')?.addEventListener('click', saveAppointmentChanges);
    document.getElementById('btnConfirmDelete')?.addEventListener('click', executeConfirmedDelete);
    
    // Client suggestions in appointment modal
    document.getElementById('appointmentClient')?.addEventListener('input', searchClientSuggestions);
    document.getElementById('appointmentPhone')?.addEventListener('input', searchClientHistory);
    document.getElementById('appointmentCpf')?.addEventListener('input', function() { formatCPF(this); });

    // Auto-capitalize name inputs
    ['appointmentClient', 'detailClientInput', 'clientDetailName', 'newClientName'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', function() { formatNameCapitalize(this); });
    });
    
    document.getElementById('btnLoginConfirm')?.addEventListener('click', submitLogin);
    document.getElementById('loginPassword')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') submitLogin();
    });
    
    document.getElementById('btnAddClient')?.addEventListener('click', openNewClient);
    document.getElementById('btnSaveNewClient')?.addEventListener('click', saveNewClient);
    document.getElementById('btnSaveClient')?.addEventListener('click', saveClientChanges);
    document.getElementById('btnDeleteClient')?.addEventListener('click', deleteClient);
    
    // Birthday config
    document.getElementById('btnBirthdayConfig')?.addEventListener('click', openBirthdayConfig);
    document.getElementById('btnSaveBirthdayMsg')?.addEventListener('click', saveBirthdayMessage);
    
    // Date picker modal
    document.getElementById('btnConfirmDate')?.addEventListener('click', confirmDatePicker);
    document.getElementById('btnGoToToday')?.addEventListener('click', goToTodayFromPicker);
    
    document.querySelector('.btn-logout, .settings-logout-btn')?.addEventListener('click', logout);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// =============================================
// TOASTS
// =============================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    // Limitar a 4 toasts visíveis
    const existingToasts = container.querySelectorAll('.toast');
    if (existingToasts.length >= 4) {
        existingToasts[0].remove();
    }
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info} toast-icon"></i>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// =============================================
// UTILITIES
// =============================================

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function formatDateBR(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

function formatDateShort(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}`;
}

function formatBRL(val) {
    const parts = Number(val).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${parts.join(',')}`;
}

function formatDateTimeBR(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${d}/${m}/${y} às ${h}:${min}`;
}

function toggleEditHistory(element) {
    const historyEl = element.closest('.cashier-transaction-info').querySelector('.transaction-edit-history');
    if (historyEl) {
        historyEl.classList.toggle('visible');
    }
}

// =============================================
// SERVICES
// =============================================

function loadServicesFromStorage() {
    try {
        const saved = localStorage.getItem('nexus_services');
        if (saved) AppState.services = JSON.parse(saved);
    } catch (e) {
        console.error('Error loading services:', e);
    }
}

function saveServicesToStorage() {
    try {
        localStorage.setItem('nexus_services', JSON.stringify(AppState.services));
    } catch (e) {
        console.error('Error saving services:', e);
    }
}

function renderServices() {
    const grid = document.getElementById('servicesGrid');
    const countEl = document.getElementById('servicesCount');
    if (!grid) return;

    loadServicesFromStorage();
    
    // Sort services alphabetically
    const services = (AppState.services || []).slice().sort((a, b) => 
        a.nome.localeCompare(b.nome, 'pt-BR')
    );
    
    if (countEl) countEl.textContent = services.length;

    if (services.length === 0) {
        grid.innerHTML = `
            <div class="premium-empty">
                <i class="fa-solid fa-scissors"></i>
                <p>Clique em + para adicionar um serviço</p>
            </div>
        `;
        initServiceSearch();
        return;
    }

    grid.innerHTML = services.map((s) => {
        // Find original index in AppState.services
        const originalIndex = AppState.services.findIndex(svc => svc.id === s.id);
        const iconClass = s.icon || 'fa-scissors';
        return `
            <div class="premium-long-card service-card" onclick="editService(${originalIndex})">
                <div class="long-card-icon service-icon">
                    <i class="fa-solid ${iconClass}"></i>
                </div>
                <div class="long-card-info">
                    <h4 class="long-card-name">${s.nome}</h4>
                    ${s.descricao ? `<span class="long-card-desc">${s.descricao}</span>` : ''}
                </div>
                <div class="long-card-meta">
                    <span class="long-card-duration"><i class="fa-regular fa-clock"></i> ${s.duracao || 30} min</span>
                </div>
                <div class="long-card-price">R$ ${parseFloat(s.preco || 0).toFixed(2).replace('.', ',')}</div>
                <button class="long-card-delete" onclick="event.stopPropagation(); confirmDeleteService(${originalIndex})" title="Excluir">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
    
    initServiceSearch();
}

function openServiceModal(service = null, index = null) {
    const isEdit = service !== null;
    const currentIcon = service?.icon || 'fa-scissors';
    window.selectedItemIcon = currentIcon;
    
    // Formatar preço com vírgula
    const precoFormatado = service?.preco ? service.preco.toFixed(2).replace('.', ',') : '0,00';
    
    const html = `
        <div class="modal-content" style="max-width: 420px;">
            <div class="modal-header">
                <h2><i class="fa-solid fa-scissors" style="color: #00d26a;"></i> ${isEdit ? 'Editar' : 'Novo'} Serviço</h2>
                <button class="modal-close" onclick="closeModal('serviceModal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Ícone</label>
                    <div class="icon-picker-trigger" onclick="openIconPicker('service')">
                        <div class="icon-picker-preview service">
                            <i class="fa-solid ${currentIcon}" id="serviceIconPreview"></i>
                        </div>
                        <span class="icon-picker-text">Clique para escolher um ícone</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                    <input type="hidden" id="serviceIcon" value="${currentIcon}">
                </div>
                <div class="form-group">
                    <label>Nome do Serviço</label>
                    <input type="text" id="serviceNome" class="form-input" value="${service?.nome || ''}" placeholder="Ex: Corte Masculino">
                </div>
                <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div class="form-group">
                        <label>Preço (R$)</label>
                        <div class="input-stepper">
                            <input type="text" id="servicePreco" class="form-input" value="${precoFormatado}" placeholder="0,00" inputmode="decimal">
                            <div class="stepper-buttons">
                                <button type="button" class="stepper-btn" onclick="stepPriceInput('servicePreco', 1)"><i class="fa-solid fa-chevron-up"></i></button>
                                <button type="button" class="stepper-btn" onclick="stepPriceInput('servicePreco', -1)"><i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Duração (min)</label>
                        <div class="input-stepper">
                            <input type="number" id="serviceDuracao" class="form-input" value="${service?.duracao || 30}" placeholder="30">
                            <div class="stepper-buttons">
                                <button type="button" class="stepper-btn" onclick="stepInput('serviceDuracao', 5)"><i class="fa-solid fa-chevron-up"></i></button>
                                <button type="button" class="stepper-btn" onclick="stepInput('serviceDuracao', -5)"><i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Descrição (opcional)</label>
                    <textarea id="serviceDescricao" class="form-input" rows="2" placeholder="Descrição do serviço...">${service?.descricao || ''}</textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal('serviceModal')">Cancelar</button>
                <button class="btn-primary" onclick="saveService(${index})"><i class="fa-solid fa-check"></i> Salvar</button>
            </div>
        </div>
    `;
    
    let modal = document.getElementById('serviceModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'serviceModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = html;
    modal.classList.add('active');
    
    // Proteção da vírgula no campo de preço
    const precoInput = document.getElementById('servicePreco');
    if (precoInput) {
        setupPriceInputProtection(precoInput);
    }
    
    document.getElementById('serviceNome')?.focus();
}

function saveService(index) {
    const nome = document.getElementById('serviceNome').value.trim();
    const preco = parsePreco(document.getElementById('servicePreco').value);
    const duracao = parseInt(document.getElementById('serviceDuracao').value) || 30;
    const descricao = document.getElementById('serviceDescricao').value.trim();
    const icon = document.getElementById('serviceIcon')?.value || 'fa-scissors';

    if (!nome) {
        showToast('Nome do serviço é obrigatório', 'error');
        return;
    }
    
    if (preco <= 0) {
        showToast('Preço deve ser maior que zero', 'error');
        return;
    }
    
    if (duracao <= 0 || duracao > 480) {
        showToast('Duração deve ser entre 1 e 480 minutos', 'error');
        return;
    }

    const service = { nome, preco, duracao, descricao, icon, id: Date.now() };

    if (index !== null && index >= 0) {
        service.id = AppState.services[index].id;
        AppState.services[index] = service;
    } else {
        AppState.services.push(service);
    }

    saveServicesToStorage();
    closeModal('serviceModal');
    renderServices();
    showToast('Serviço salvo!', 'success');
}

// Icon Picker for Services and Products
const iconCategories = {
    'Roupas': ['fa-shirt', 'fa-vest', 'fa-vest-patches', 'fa-user-tie', 'fa-person-dress', 'fa-children', 'fa-socks', 'fa-mitten', 'fa-user'],
    'Calçados': ['fa-shoe-prints', 'fa-person-walking', 'fa-person-running', 'fa-socks', 'fa-road'],
    'Chapéus & Bonés': ['fa-hat-cowboy', 'fa-hat-cowboy-side', 'fa-hat-wizard', 'fa-graduation-cap', 'fa-helmet-safety', 'fa-crown', 'fa-user-astronaut'],
    'Óculos': ['fa-glasses', 'fa-eye', 'fa-sun', 'fa-circle-half-stroke', 'fa-face-grin-beam'],
    'Relógios': ['fa-clock', 'fa-stopwatch', 'fa-hourglass', 'fa-hourglass-half', 'fa-calendar-days'],
    'Joias & Acessórios': ['fa-gem', 'fa-ring', 'fa-crown', 'fa-star', 'fa-diamond', 'fa-circle', 'fa-certificate', 'fa-award', 'fa-medal', 'fa-trophy'],
    'Bolsas & Carteiras': ['fa-wallet', 'fa-bag-shopping', 'fa-briefcase', 'fa-suitcase', 'fa-suitcase-rolling', 'fa-basket-shopping', 'fa-cart-shopping', 'fa-handbag'],
    'Cintos & Acessórios': ['fa-circle-notch', 'fa-link', 'fa-chain', 'fa-ring', 'fa-key', 'fa-lock'],
    'Perfumes & Cosméticos': ['fa-spray-can', 'fa-spray-can-sparkles', 'fa-bottle-droplet', 'fa-flask', 'fa-droplet', 'fa-wand-magic-sparkles', 'fa-fire-flame-curved', 'fa-wind'],
    'Celulares': ['fa-mobile-screen', 'fa-mobile', 'fa-mobile-screen-button', 'fa-phone', 'fa-tablet-screen-button', 'fa-tablet', 'fa-sim-card', 'fa-sd-card', 'fa-microchip'],
    'Fones & Áudio': ['fa-headphones', 'fa-headphones-simple', 'fa-podcast', 'fa-microphone', 'fa-volume-high', 'fa-music', 'fa-radio', 'fa-compact-disc', 'fa-bluetooth'],
    'Eletrônicos': ['fa-laptop', 'fa-computer', 'fa-desktop', 'fa-tv', 'fa-display', 'fa-camera', 'fa-video', 'fa-gamepad', 'fa-keyboard', 'fa-mouse', 'fa-plug', 'fa-battery-full', 'fa-charging-station'],
    'Beleza & Cabelo': ['fa-scissors', 'fa-face-smile', 'fa-hand-sparkles', 'fa-palette', 'fa-paintbrush', 'fa-spa', 'fa-leaf', 'fa-feather'],
    'Saúde & Bem-estar': ['fa-heart-pulse', 'fa-dumbbell', 'fa-spa', 'fa-apple-whole', 'fa-hand-holding-heart', 'fa-brain', 'fa-lungs', 'fa-pills', 'fa-syringe', 'fa-stethoscope'],
    'Produtos': ['fa-box', 'fa-box-open', 'fa-boxes-stacked', 'fa-gift', 'fa-tags', 'fa-barcode', 'fa-store', 'fa-receipt', 'fa-percent'],
    'Higiene': ['fa-pump-soap', 'fa-soap', 'fa-shower', 'fa-bath', 'fa-tooth', 'fa-hands-bubbles', 'fa-hand-holding-droplet', 'fa-fill-drip'],
    'Ferramentas': ['fa-screwdriver-wrench', 'fa-hammer', 'fa-wrench', 'fa-toolbox', 'fa-gear', 'fa-gears', 'fa-lightbulb', 'fa-fan', 'fa-bolt'],
    'Alimentos': ['fa-utensils', 'fa-mug-hot', 'fa-wine-glass', 'fa-burger', 'fa-pizza-slice', 'fa-ice-cream', 'fa-cake-candles', 'fa-cookie', 'fa-lemon', 'fa-carrot', 'fa-egg', 'fa-fish'],
    'Casa & Decoração': ['fa-couch', 'fa-bed', 'fa-chair', 'fa-lamp', 'fa-blender', 'fa-kitchen-set', 'fa-spoon', 'fa-fire-burner', 'fa-sink', 'fa-toilet', 'fa-rug', 'fa-fan'],
    'Esportes': ['fa-futbol', 'fa-basketball', 'fa-volleyball', 'fa-baseball', 'fa-football', 'fa-golf-ball-tee', 'fa-table-tennis-paddle-ball', 'fa-bowling-ball', 'fa-bicycle', 'fa-person-swimming', 'fa-dumbbell'],
    'Brinquedos & Games': ['fa-gamepad', 'fa-puzzle-piece', 'fa-chess', 'fa-dice', 'fa-ghost', 'fa-robot', 'fa-dragon', 'fa-wand-sparkles', 'fa-masks-theater'],
    'Diversos': ['fa-star', 'fa-bookmark', 'fa-flag', 'fa-bell', 'fa-calendar', 'fa-film', 'fa-book', 'fa-pen', 'fa-paperclip', 'fa-thumbtack', 'fa-umbrella', 'fa-smoking']
};

window.iconPickerType = null;

function openIconPicker(type) {
    window.iconPickerType = type;
    const currentIcon = type === 'service' 
        ? document.getElementById('serviceIcon')?.value 
        : document.getElementById('productIcon')?.value;
    
    let iconsHtml = '';
    for (const [category, icons] of Object.entries(iconCategories)) {
        iconsHtml += `
            <div class="icon-category">
                <div class="icon-category-title">${category}</div>
                <div class="icon-category-grid">
                    ${icons.map(icon => `
                        <div class="icon-option ${icon === currentIcon ? 'selected' : ''}" data-icon="${icon}" onclick="selectIcon('${icon}')">
                            <i class="fa-solid ${icon}"></i>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    const html = `
        <div class="modal-content" style="max-width: 520px;">
            <div class="modal-header">
                <h2><i class="fa-solid fa-icons"></i> Escolher Ícone</h2>
                <button class="modal-close" onclick="closeModal('iconPickerModal')">&times;</button>
            </div>
            <div class="modal-body icon-picker-body">
                <div class="icon-search-wrap">
                    <i class="fa-solid fa-search"></i>
                    <input type="text" id="iconSearchInput" class="form-input" placeholder="Buscar ícone..." oninput="filterIcons(this.value)">
                </div>
                <div class="icon-categories-container" id="iconCategoriesContainer">
                    ${iconsHtml}
                </div>
            </div>
        </div>
    `;
    
    let modal = document.getElementById('iconPickerModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'iconPickerModal';
        modal.className = 'modal';
        modal.style.zIndex = '2100';
        document.body.appendChild(modal);
    }
    modal.innerHTML = html;
    modal.classList.add('active');
}

function selectIcon(icon) {
    const type = window.iconPickerType;
    
    if (type === 'service') {
        document.getElementById('serviceIcon').value = icon;
        const preview = document.getElementById('serviceIconPreview');
        preview.className = `fa-solid ${icon}`;
    } else if (type === 'product') {
        document.getElementById('productIcon').value = icon;
        const preview = document.getElementById('productIconPreview');
        preview.className = `fa-solid ${icon}`;
    }
    
    closeModal('iconPickerModal');
}

function filterIcons(search) {
    const container = document.getElementById('iconCategoriesContainer');
    const categories = container.querySelectorAll('.icon-category');
    const searchLower = search.toLowerCase().trim();
    
    categories.forEach(cat => {
        const icons = cat.querySelectorAll('.icon-option');
        let visibleCount = 0;
        
        icons.forEach(iconEl => {
            const iconName = iconEl.dataset.icon.replace('fa-', '').replace(/-/g, ' ');
            if (iconName.includes(searchLower) || searchLower === '') {
                iconEl.style.display = '';
                visibleCount++;
            } else {
                iconEl.style.display = 'none';
            }
        });
        
        cat.style.display = visibleCount > 0 ? '' : 'none';
    });
}

function editService(index) {
    const service = AppState.services[index];
    if (service) openServiceModal(service, index);
}

function deleteService(index) {
    AppState.services.splice(index, 1);
    saveServicesToStorage();
    renderServices();
    showToast('Serviço excluído', 'success');
}

function confirmDeleteService(index) {
    const service = AppState.services[index];
    if (!service) return;
    
    const html = `
        <div class="modal-content modal-sm modal-confirm">
            <div class="modal-confirm-icon danger-icon">
                <i class="fa-solid fa-scissors"></i>
            </div>
            <span class="modal-confirm-title">Excluir Serviço?</span>
            <p class="modal-confirm-desc">${service.nome}</p>
            <div class="modal-confirm-buttons">
                <button class="btn-secondary" onclick="closeModal('confirmDeleteModal')">Cancelar</button>
                <button class="btn-danger" onclick="deleteService(${index}); closeModal('confirmDeleteModal')">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `;
    
    let modal = document.getElementById('confirmDeleteModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirmDeleteModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = html;
    modal.classList.add('active');
}

function initServiceSearch() {
    const el = document.getElementById('serviceSearch');
    if (el && !el.dataset.init) {
        el.dataset.init = '1';
        el.addEventListener('input', function() {
            const search = this.value.toLowerCase().trim();
            document.querySelectorAll('#servicesGrid .premium-item-card').forEach(card => {
                const name = card.querySelector('.premium-item-name')?.textContent.toLowerCase() || '';
                card.style.display = name.includes(search) ? '' : 'none';
            });
        });
    }
}

// =============================================
// PRODUCTS
// =============================================

function loadProductsFromStorage() {
    try {
        const saved = localStorage.getItem('nexus_products');
        if (saved) AppState.products = JSON.parse(saved);
    } catch (e) {
        console.error('Error loading products:', e);
    }
}

function saveProductsToStorage() {
    try {
        localStorage.setItem('nexus_products', JSON.stringify(AppState.products));
    } catch (e) {
        console.error('Error saving products:', e);
    }
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const countEl = document.getElementById('productsCount');
    if (!grid) return;

    loadProductsFromStorage();
    const products = AppState.products || [];
    
    if (countEl) countEl.textContent = products.length;

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="premium-empty">
                <i class="fa-solid fa-box"></i>
                <p>Clique em + para adicionar um produto</p>
            </div>
        `;
        initProductSearch();
        return;
    }

    grid.innerHTML = products.map((p, i) => {
        const stock = p.estoque || 0;
        const stockClass = stock < 3 ? 'out' : stock < 7 ? 'low' : 'ok';
        const iconClass = p.icon || 'fa-box';
        return `
            <div class="premium-long-card product-card" onclick="editProduct(${i})">
                <div class="long-card-icon product-icon">
                    <i class="fa-solid ${iconClass}"></i>
                </div>
                <div class="long-card-info">
                    <h4 class="long-card-name">${p.nome}</h4>
                    ${p.descricao ? `<span class="long-card-desc">${p.descricao}</span>` : ''}
                </div>
                <div class="long-card-stock ${stockClass}">
                    <i class="fa-solid fa-cubes"></i>
                    <span>${p.estoque || 0}</span>
                </div>
                <div class="long-card-price">R$ ${parseFloat(p.preco || 0).toFixed(2).replace('.', ',')}</div>
                <button class="long-card-delete" onclick="event.stopPropagation(); confirmDeleteProduct(${i})" title="Excluir">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
    
    initProductSearch();
}

function openProductModal(product = null, index = null) {
    const isEdit = product !== null;
    const currentIcon = product?.icon || 'fa-box';
    window.selectedItemIcon = currentIcon;
    
    const precoFormatado = product?.preco ? parseFloat(product.preco).toFixed(2).replace('.', ',') : '0,00';
    
    const html = `
        <div class="modal-content" style="max-width: 420px;">
            <div class="modal-header">
                <h2><i class="fa-solid fa-box" style="color: var(--primary);"></i> ${isEdit ? 'Editar' : 'Novo'} Produto</h2>
                <button class="modal-close" onclick="closeModal('productModal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Ícone</label>
                    <div class="icon-picker-trigger" onclick="openIconPicker('product')">
                        <div class="icon-picker-preview product">
                            <i class="fa-solid ${currentIcon}" id="productIconPreview"></i>
                        </div>
                        <span class="icon-picker-text">Clique para escolher um ícone</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                    <input type="hidden" id="productIcon" value="${currentIcon}">
                </div>
                <div class="form-group">
                    <label>Nome do Produto</label>
                    <input type="text" id="productNome" class="form-input" value="${product?.nome || ''}" placeholder="Ex: Shampoo Premium">
                </div>
                <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div class="form-group">
                        <label>Preço (R$)</label>
                        <div class="input-stepper">
                            <input type="text" id="productPreco" class="form-input" value="${precoFormatado}" placeholder="0,00" inputmode="decimal">
                            <div class="stepper-buttons">
                                <button type="button" class="stepper-btn" onclick="stepPriceInput('productPreco', 1)"><i class="fa-solid fa-chevron-up"></i></button>
                                <button type="button" class="stepper-btn" onclick="stepPriceInput('productPreco', -1)"><i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Estoque</label>
                        <div class="input-stepper">
                            <input type="number" id="productEstoque" class="form-input" value="${product?.estoque || 0}" placeholder="10" step="1">
                            <div class="stepper-buttons">
                                <button type="button" class="stepper-btn" onclick="stepInput('productEstoque', 1)"><i class="fa-solid fa-chevron-up"></i></button>
                                <button type="button" class="stepper-btn" onclick="stepInput('productEstoque', -1)"><i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Descrição (opcional)</label>
                    <textarea id="productDescricao" class="form-input" rows="2" placeholder="Descrição do produto...">${product?.descricao || ''}</textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal('productModal')">Cancelar</button>
                <button class="btn-primary" onclick="saveProduct(${index})"><i class="fa-solid fa-check"></i> Salvar</button>
            </div>
        </div>
    `;
    
    let modal = document.getElementById('productModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'productModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = html;
    modal.classList.add('active');
    
    // Proteção da vírgula no campo de preço
    const precoInput = document.getElementById('productPreco');
    if (precoInput) {
        setupPriceInputProtection(precoInput);
    }
    
    document.getElementById('productNome')?.focus();
}

function stepInput(inputId, delta) {
    const input = document.getElementById(inputId);
    if (!input) return;
    let value = parseFloat(input.value) || 0;
    value += delta;
    if (value < 0) value = 0;
    input.value = value;
}

function stepPriceInput(inputId, delta) {
    const input = document.getElementById(inputId);
    if (!input) return;
    // Converter vírgula para ponto e pegar o valor
    let value = parseFloat(input.value.replace(',', '.')) || 0;
    value += delta;
    if (value < 0) value = 0;
    // Formatar com 2 casas decimais e vírgula
    input.value = value.toFixed(2).replace('.', ',');
}

function setupPriceInputProtection(input) {
    // Impedir deletar a vírgula e manter formato correto
    input.addEventListener('keydown', function(e) {
        const cursorPos = this.selectionStart;
        const value = this.value;
        const commaPos = value.indexOf(',');
        
        // Se estiver tentando deletar a vírgula
        if ((e.key === 'Backspace' && cursorPos === commaPos + 1) ||
            (e.key === 'Delete' && cursorPos === commaPos)) {
            e.preventDefault();
            // Mover cursor para o outro lado da vírgula
            if (e.key === 'Backspace') {
                this.setSelectionRange(commaPos, commaPos);
            } else {
                this.setSelectionRange(commaPos + 1, commaPos + 1);
            }
        }
    });
    
    // Garantir formato correto ao sair do campo
    input.addEventListener('blur', function() {
        let value = parseFloat(this.value.replace(',', '.')) || 0;
        if (value < 0) value = 0;
        this.value = value.toFixed(2).replace('.', ',');
    });
    
    // Permitir apenas números e vírgula
    input.addEventListener('input', function() {
        let val = this.value.replace(/[^\d,]/g, '');
        // Garantir apenas uma vírgula
        const parts = val.split(',');
        if (parts.length > 2) {
            val = parts[0] + ',' + parts.slice(1).join('');
        }
        // Limitar casas decimais a 2
        if (parts.length === 2 && parts[1].length > 2) {
            val = parts[0] + ',' + parts[1].substring(0, 2);
        }
        this.value = val;
    });
}

function parsePreco(str) {
    if (!str) return 0;
    return parseFloat(str.replace(',', '.')) || 0;
}

function saveProduct(index) {
    const nome = document.getElementById('productNome').value.trim();
    const preco = parsePreco(document.getElementById('productPreco').value);
    const estoque = parseInt(document.getElementById('productEstoque').value) || 0;
    const descricao = document.getElementById('productDescricao').value.trim();
    const icon = document.getElementById('productIcon')?.value || 'fa-box';

    if (!nome) {
        showToast('Nome do produto é obrigatório', 'error');
        return;
    }

    const product = { nome, preco, estoque, descricao, icon, id: Date.now() };

    if (index !== null && index >= 0) {
        product.id = AppState.products[index].id;
        AppState.products[index] = product;
    } else {
        AppState.products.push(product);
    }

    saveProductsToStorage();
    closeModal('productModal');
    renderProducts();
    showToast('Produto salvo!', 'success');
}

function editProduct(index) {
    const product = AppState.products[index];
    if (product) openProductModal(product, index);
}

function deleteProduct(index) {
    AppState.products.splice(index, 1);
    saveProductsToStorage();
    renderProducts();
    showToast('Produto excluído', 'success');
}

function confirmDeleteProduct(index) {
    const product = AppState.products[index];
    if (!product) return;
    
    const html = `
        <div class="modal-content modal-sm modal-confirm">
            <div class="modal-confirm-icon danger-icon">
                <i class="fa-solid fa-box"></i>
            </div>
            <span class="modal-confirm-title">Excluir Produto?</span>
            <p class="modal-confirm-desc">${product.nome}</p>
            <div class="modal-confirm-buttons">
                <button class="btn-secondary" onclick="closeModal('confirmDeleteModal')">Cancelar</button>
                <button class="btn-danger" onclick="deleteProduct(${index}); closeModal('confirmDeleteModal')">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `;
    
    let modal = document.getElementById('confirmDeleteModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirmDeleteModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = html;
    modal.classList.add('active');
}

function initProductSearch() {
    const el = document.getElementById('productSearch');
    if (el && !el.dataset.init) {
        el.dataset.init = '1';
        el.addEventListener('input', function() {
            const search = this.value.toLowerCase().trim();
            document.querySelectorAll('#productsGrid .premium-item-card').forEach(card => {
                const name = card.querySelector('.premium-item-name')?.textContent.toLowerCase() || '';
                card.style.display = name.includes(search) ? '' : 'none';
            });
        });
    }
}

// =============================================
// BACKUP
// =============================================

function renderBackupInfo() {
    const clients = AppState.clients ? AppState.clients.length : 0;
    const services = AppState.services ? AppState.services.length : 0;
    const products = AppState.products ? AppState.products.length : 0;
    const transactions = AppState.transactions ? AppState.transactions.length : 0;
    
    const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    el('backupCountClients', clients);
    el('backupCountServices', services);
    el('backupCountProducts', products);
    el('backupCountTransactions', transactions);
}

// ===== CARD FEES SYSTEM =====
function loadCardFees() {
    const stored = localStorage.getItem('nexus_card_fees');
    if (stored) {
        return JSON.parse(stored);
    }
    // Default fees
    return {
        credito: {
            visa: 3.5,
            mastercard: 3.5,
            elo: 4.0,
            amex: 4.5,
            hipercard: 4.0
        },
        debito: {
            visa: 2.0,
            mastercard: 2.0,
            elo: 2.5,
            amex: 2.5,
            hipercard: 2.5
        }
    };
}

function saveCardFees(fees) {
    localStorage.setItem('nexus_card_fees', JSON.stringify(fees));
}

function openCardFeesModal() {
    const fees = loadCardFees();
    window.cardFeesMonth = new Date();
    
    const cardBrands = [
        { id: 'visa', icon: 'fa-cc-visa', iconClass: 'fa-brands', label: 'Visa' },
        { id: 'mastercard', icon: 'fa-cc-mastercard', iconClass: 'fa-brands', label: 'Mastercard' },
        { id: 'elo', icon: 'fa-credit-card', iconClass: 'fa-solid', label: 'Elo' },
        { id: 'amex', icon: 'fa-cc-amex', iconClass: 'fa-brands', label: 'American Express' },
        { id: 'hipercard', icon: 'fa-credit-card', iconClass: 'fa-solid', label: 'Hipercard' }
    ];
    
    const html = `
        <div class="modal-content card-fees-modal-large">
            <div class="modal-header">
                <h2><i class="fa-solid fa-percent" style="color: #ffb432;"></i> Taxas de Cartão</h2>
                <button class="modal-close" onclick="closeModal('cardFeesModal')">&times;</button>
            </div>
            <div class="modal-body" style="padding: 0;">
                <div class="card-fees-tabs">
                    <button class="card-fees-tab active" onclick="switchFeesTab('summary')">
                        <i class="fa-solid fa-chart-pie"></i>
                        Resumo Mensal
                    </button>
                    <button class="card-fees-tab" onclick="switchFeesTab('config')">
                        <i class="fa-solid fa-sliders"></i>
                        Configurar Taxas
                    </button>
                </div>
                
                <!-- Summary Panel (now default) -->
                <div class="card-fees-panel active" id="feesSummaryPanel">
                    <div class="fees-month-selector">
                        <button class="fees-month-nav" onclick="navigateFeesMonth(-1)">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>
                        <span class="fees-month-label" id="feesMonthLabel"></span>
                        <button class="fees-month-nav" onclick="navigateFeesMonth(1)">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                    
                    <!-- Main Summary Grid -->
                    <div class="fees-main-summary" id="feesMainSummary"></div>
                    
                    <!-- Transactions List -->
                    <div class="fees-transactions-section">
                        <div class="fees-transactions-header">
                            <div class="fees-transactions-title">
                                <i class="fa-solid fa-list"></i>
                                Movimentações do Mês
                            </div>
                            <span class="fees-transactions-count" id="feesTransactionsCount">0 transações</span>
                        </div>
                        <div class="fees-transactions-list" id="feesTransactionsList"></div>
                    </div>
                </div>
                
                <!-- Config Panel -->
                <div class="card-fees-panel" id="feesConfigPanel">
                    <div class="fee-config-section">
                        <div class="fee-config-title">
                            <i class="fa-solid fa-credit-card"></i>
                            Crédito
                        </div>
                        <div class="fee-cards-grid">
                            ${cardBrands.map(brand => `
                                <div class="fee-card-item">
                                    <div class="fee-card-icon ${brand.id}">
                                        <i class="${brand.iconClass} ${brand.icon}"></i>
                                    </div>
                                    <div class="fee-card-info">
                                        <div class="fee-card-name">${brand.label}</div>
                                        <div class="fee-card-input-wrap">
                                            <input type="number" class="fee-card-input" id="fee_credito_${brand.id}" 
                                                   value="${fees.credito[brand.id] || 0}" step="0.1" min="0" max="100"
                                                   onchange="updateCardFee('credito', '${brand.id}', this.value)">
                                            <span>%</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="fee-config-section">
                        <div class="fee-config-title debit">
                            <i class="fa-solid fa-credit-card"></i>
                            Débito
                        </div>
                        <div class="fee-cards-grid">
                            ${cardBrands.map(brand => `
                                <div class="fee-card-item">
                                    <div class="fee-card-icon ${brand.id}">
                                        <i class="${brand.iconClass} ${brand.icon}"></i>
                                    </div>
                                    <div class="fee-card-info">
                                        <div class="fee-card-name">${brand.label}</div>
                                        <div class="fee-card-input-wrap">
                                            <input type="number" class="fee-card-input" id="fee_debito_${brand.id}" 
                                                   value="${fees.debito[brand.id] || 0}" step="0.1" min="0" max="100"
                                                   onchange="updateCardFee('debito', '${brand.id}', this.value)">
                                            <span>%</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal('cardFeesModal')">Fechar</button>
            </div>
        </div>
    `;
    
    let modal = document.getElementById('cardFeesModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cardFeesModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = html;
    modal.classList.add('active');
    
    // Initialize summary
    renderFeesSummary();
}

function switchFeesTab(tab) {
    document.querySelectorAll('.card-fees-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.card-fees-panel').forEach(p => p.classList.remove('active'));
    
    document.querySelector(`[onclick="switchFeesTab('${tab}')"]`).classList.add('active');
    document.getElementById(tab === 'summary' ? 'feesSummaryPanel' : 'feesConfigPanel').classList.add('active');
    
    if (tab === 'summary') {
        renderFeesSummary();
    }
}

function updateCardFee(type, brand, value) {
    const fees = loadCardFees();
    fees[type][brand] = parseFloat(value) || 0;
    saveCardFees(fees);
    showToast('Taxa atualizada!', 'success');
}

function navigateFeesMonth(delta) {
    window.cardFeesMonth.setMonth(window.cardFeesMonth.getMonth() + delta);
    renderFeesSummary();
}

function renderFeesSummary() {
    const fees = loadCardFees();
    const month = window.cardFeesMonth;
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const labelEl = document.getElementById('feesMonthLabel');
    if (labelEl) {
        labelEl.textContent = `${monthNames[month.getMonth()]} ${month.getFullYear()}`;
    }
    
    // Filter transactions for the month
    loadTransactionsFromStorage();
    const monthStr = formatDate(monthStart).substring(0, 7); // YYYY-MM
    
    const cardTransactions = (AppState.transactions || []).filter(t => {
        if (t.type !== 'income') return false;
        if (t.paymentMethod !== 'credito' && t.paymentMethod !== 'debito') return false;
        if (!t.date || !t.date.startsWith(monthStr)) return false;
        return true;
    });
    
    // Calculate detailed totals
    let totalSales = 0;
    let totalFees = 0;
    let creditoSales = 0;
    let creditoFees = 0;
    let debitoSales = 0;
    let debitoFees = 0;
    
    const brandInfo = {
        visa: { icon: 'fa-cc-visa', iconClass: 'fa-brands', label: 'Visa' },
        mastercard: { icon: 'fa-cc-mastercard', iconClass: 'fa-brands', label: 'Mastercard' },
        elo: { icon: 'fa-credit-card', iconClass: 'fa-solid', label: 'Elo' },
        amex: { icon: 'fa-cc-amex', iconClass: 'fa-brands', label: 'American Express' },
        hipercard: { icon: 'fa-credit-card', iconClass: 'fa-solid', label: 'Hipercard' },
        other: { icon: 'fa-credit-card', iconClass: 'fa-solid', label: 'Outro' }
    };
    
    // Calculate fees for each transaction
    const transactionsWithFees = cardTransactions.map(t => {
        const type = t.paymentMethod;
        const brand = t.cardBrand || 'other';
        const feePercent = (fees[type] && fees[type][brand]) ? fees[type][brand] : 0;
        const feeAmount = (t.value * feePercent) / 100;
        
        totalSales += t.value;
        totalFees += feeAmount;
        
        if (type === 'credito') {
            creditoSales += t.value;
            creditoFees += feeAmount;
        } else {
            debitoSales += t.value;
            debitoFees += feeAmount;
        }
        
        return { ...t, feePercent, feeAmount, brandInfo: brandInfo[brand] || brandInfo.other };
    });
    
    // Sort by date desc
    transactionsWithFees.sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return (b.id || 0) - (a.id || 0);
    });
    
    const netAmount = totalSales - totalFees;
    
    // Render main summary
    const mainSummaryEl = document.getElementById('feesMainSummary');
    if (mainSummaryEl) {
        mainSummaryEl.innerHTML = `
            <div class="fees-summary-grid">
                <div class="fees-summary-card large">
                    <div class="fees-summary-icon total-sales">
                        <i class="fa-solid fa-credit-card"></i>
                    </div>
                    <div class="fees-summary-content">
                        <div class="fees-summary-label">Total Vendas Cartão</div>
                        <div class="fees-summary-value">${formatBRL(totalSales)}</div>
                    </div>
                </div>
                
                <div class="fees-summary-row">
                    <div class="fees-summary-card credito">
                        <div class="fees-summary-icon credito-icon">
                            <i class="fa-solid fa-arrow-up"></i>
                        </div>
                        <div class="fees-summary-content">
                            <div class="fees-summary-label">Vendas Crédito</div>
                            <div class="fees-summary-value">${formatBRL(creditoSales)}</div>
                        </div>
                    </div>
                    <div class="fees-summary-card taxa credito">
                        <div class="fees-summary-icon taxa-icon">
                            <i class="fa-solid fa-percent"></i>
                        </div>
                        <div class="fees-summary-content">
                            <div class="fees-summary-label">Taxa Crédito</div>
                            <div class="fees-summary-value danger">-${formatBRL(creditoFees)}</div>
                        </div>
                    </div>
                </div>
                
                <div class="fees-summary-row">
                    <div class="fees-summary-card debito">
                        <div class="fees-summary-icon debito-icon">
                            <i class="fa-solid fa-arrow-up"></i>
                        </div>
                        <div class="fees-summary-content">
                            <div class="fees-summary-label">Vendas Débito</div>
                            <div class="fees-summary-value">${formatBRL(debitoSales)}</div>
                        </div>
                    </div>
                    <div class="fees-summary-card taxa debito">
                        <div class="fees-summary-icon taxa-icon">
                            <i class="fa-solid fa-percent"></i>
                        </div>
                        <div class="fees-summary-content">
                            <div class="fees-summary-label">Taxa Débito</div>
                            <div class="fees-summary-value danger">-${formatBRL(debitoFees)}</div>
                        </div>
                    </div>
                </div>
                
                <div class="fees-summary-row final">
                    <div class="fees-summary-card total-taxas">
                        <div class="fees-summary-icon total-taxas-icon">
                            <i class="fa-solid fa-calculator"></i>
                        </div>
                        <div class="fees-summary-content">
                            <div class="fees-summary-label">Total Taxas</div>
                            <div class="fees-summary-value danger">-${formatBRL(totalFees)}</div>
                        </div>
                    </div>
                    <div class="fees-summary-card net highlight">
                        <div class="fees-summary-icon net-icon">
                            <i class="fa-solid fa-wallet"></i>
                        </div>
                        <div class="fees-summary-content">
                            <div class="fees-summary-label">Total a Receber</div>
                            <div class="fees-summary-value success">${formatBRL(netAmount)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Update transactions count
    const countEl = document.getElementById('feesTransactionsCount');
    if (countEl) {
        countEl.textContent = `${transactionsWithFees.length} transações`;
    }
    
    // Render transactions list
    const listEl = document.getElementById('feesTransactionsList');
    if (listEl) {
        if (transactionsWithFees.length === 0) {
            listEl.innerHTML = `
                <div class="fees-empty">
                    <i class="fa-solid fa-credit-card"></i>
                    <p>Nenhuma venda no cartão neste mês</p>
                </div>
            `;
        } else {
            listEl.innerHTML = transactionsWithFees.map(t => {
                const typeLabel = t.paymentMethod === 'credito' ? 'Crédito' : 'Débito';
                const typeClass = t.paymentMethod === 'credito' ? 'credito' : 'debito';
                return `
                    <div class="fees-transaction-item">
                        <div class="fees-transaction-icon fee-card-icon ${t.cardBrand || 'other'}">
                            <i class="${t.brandInfo.iconClass} ${t.brandInfo.icon}"></i>
                        </div>
                        <div class="fees-transaction-info">
                            <div class="fees-transaction-desc">${t.description}</div>
                            <div class="fees-transaction-meta">
                                <span class="fees-transaction-date">${formatDateBR(t.date)}</span>
                                <span class="fees-transaction-type ${typeClass}">${typeLabel}</span>
                                <span class="fees-transaction-brand">${t.brandInfo.label}</span>
                            </div>
                        </div>
                        <div class="fees-transaction-values">
                            <div class="fees-transaction-amount">${formatBRL(t.value)}</div>
                            <div class="fees-transaction-fee">
                                <span class="fee-percent">${t.feePercent.toFixed(1)}%</span>
                                <span class="fee-value">-${formatBRL(t.feeAmount)}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

// ==== AI CHAT FUNCTIONS ====
let aiChatMessages = [];

let aiPlaceholderInterval = null;

function openAIChatModal() {
    const fab = document.getElementById('aiChatFab');
    const fabRect = fab.getBoundingClientRect();
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'ai-chat-backdrop';
    backdrop.id = 'aiChatBackdrop';
    backdrop.onclick = closeAIChatModal;
    document.body.appendChild(backdrop);
    
    // Create expanding chat container
    const chatContainer = document.createElement('div');
    chatContainer.className = 'ai-chat-container';
    chatContainer.id = 'aiChatContainer';
    
    // Set initial position and size to match FAB
    chatContainer.style.cssText = `
        position: fixed;
        bottom: ${window.innerHeight - fabRect.bottom}px;
        right: ${window.innerWidth - fabRect.right}px;
        width: ${fabRect.width}px;
        height: ${fabRect.height}px;
    `;
    
    chatContainer.innerHTML = `
        <div class="ai-chat-inner">
            <div class="ai-chat-header">
                <div class="ai-chat-avatar">
                    <img src="https://ico.hugeicons.com/ai-magic-solid-standard-512.webp" alt="AI">
                </div>
                <div class="ai-chat-title">
                    <h2>Nexus AI</h2>
                    <span>Online</span>
                </div>
                <button class="ai-chat-close" onclick="closeAIChatModal()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="ai-chat-messages" id="aiChatMessages">
                <div class="ai-placeholder-wrap" id="aiPlaceholderWrap">
                    <div class="ai-placeholder-text" id="aiPlaceholderText">Como posso ajudar?</div>
                </div>
            </div>
            <div class="ai-chat-input-wrap">
                <input type="text" class="ai-chat-input" id="aiChatInput" 
                       placeholder="Pergunte qualquer coisa..." 
                       onkeypress="if(event.key==='Enter') sendAIMessage()">
                <button class="ai-chat-send" onclick="sendAIMessage()">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(chatContainer);
    
    // Hide FAB immediately
    fab.style.opacity = '0';
    fab.style.transform = 'scale(0)';
    fab.style.pointerEvents = 'none';
    
    // Trigger expansion after a frame
    requestAnimationFrame(() => {
        backdrop.classList.add('active');
        chatContainer.classList.add('ai-chat-expanding');
        
        // After expansion completes
        setTimeout(() => {
            chatContainer.classList.remove('ai-chat-expanding');
            chatContainer.classList.add('ai-chat-expanded');
            document.getElementById('aiChatInput').focus();
            
            // Start placeholder animation
            startAIPlaceholderAnimation();
        }, 500);
    });
}

function startAIPlaceholderAnimation() {
    if (!aiPlaceholderInterval) aiPlaceholderInterval = true; // Flag to indicate animation is running
    
    const container = document.getElementById('aiPlaceholderText');
    if (!container) return;
    
    const text = 'Como posso ajudar?';
    container.innerHTML = '';
    
    // Create letter spans with blur effect
    text.split('').forEach((char) => {
        const span = document.createElement('span');
        span.className = 'premium-letter';
        span.textContent = char === ' ' ? '\u00A0' : char;
        container.appendChild(span);
    });
    
    // Animate letters appearing with blur -> solid
    const letters = container.querySelectorAll('.premium-letter');
    let currentIndex = 0;
    
    function animateNextLetter() {
        const wrap = document.getElementById('aiPlaceholderWrap');
        if (!wrap || wrap.style.display === 'none' || currentIndex >= letters.length) {
            if (currentIndex >= letters.length) {
                // All letters appeared - wait then fade out
                setTimeout(fadeOutPremiumText, 10000);
            }
            return;
        }
        
        const span = letters[currentIndex];
        span.classList.add('visible');
        
        currentIndex++;
        
        // Next letter with slight randomness like NEO
        const delay = 55 + Math.random() * 25;
        setTimeout(animateNextLetter, delay);
    }
    
    // Start animation after small delay
    setTimeout(animateNextLetter, 200);
}

function fadeOutPremiumText() {
    const container = document.getElementById('aiPlaceholderText');
    const wrap = document.getElementById('aiPlaceholderWrap');
    if (!container || !wrap || wrap.style.display === 'none') return;
    
    const letters = container.querySelectorAll('.premium-letter');
    let currentIndex = letters.length - 1;
    
    function fadeNextLetter() {
        if (currentIndex < 0) {
            // All letters faded - restart after pause
            setTimeout(() => {
                if (document.getElementById('aiPlaceholderWrap')?.style.display !== 'none') {
                    startAIPlaceholderAnimation();
                }
            }, 800);
            return;
        }
        
        const span = letters[currentIndex];
        span.classList.remove('visible');
        span.classList.add('hiding');
        
        currentIndex--;
        
        // Next letter fade out
        setTimeout(fadeNextLetter, 40);
    }
    
    setTimeout(fadeNextLetter, 60);
}

function hideAIPlaceholder() {
    const wrap = document.getElementById('aiPlaceholderWrap');
    if (wrap) {
        wrap.style.display = 'none';
    }
    if (aiPlaceholderInterval) {
        clearInterval(aiPlaceholderInterval);
        aiPlaceholderInterval = null;
    }
}

function closeAIChatModal() {
    const chatContainer = document.getElementById('aiChatContainer');
    const backdrop = document.getElementById('aiChatBackdrop');
    const fab = document.getElementById('aiChatFab');
    
    if (aiPlaceholderInterval) {
        clearInterval(aiPlaceholderInterval);
        aiPlaceholderInterval = null;
    }
    
    if (backdrop) {
        backdrop.classList.remove('active');
    }
    
    if (chatContainer) {
        chatContainer.classList.remove('ai-chat-expanded');
        chatContainer.classList.add('ai-chat-collapsing');
        
        setTimeout(() => {
            chatContainer.remove();
            if (backdrop) backdrop.remove();
            
            // Show FAB again
            fab.style.opacity = '1';
            fab.style.transform = 'scale(1)';
            fab.style.pointerEvents = 'auto';
        }, 400);
    }
}

function sendAIMessage() {
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Hide placeholder when user sends first message
    hideAIPlaceholder();
    
    const messagesContainer = document.getElementById('aiChatMessages');
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-message user';
    userMsg.innerHTML = `
        <div class="ai-message-avatar">
            <i class="fa-solid fa-user"></i>
        </div>
        <div class="ai-message-bubble">${escapeHtml(message)}</div>
    `;
    messagesContainer.appendChild(userMsg);
    
    // Clear input
    input.value = '';
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Show typing indicator
    const typingEl = document.createElement('div');
    typingEl.className = 'ai-message ai';
    typingEl.id = 'aiTypingIndicator';
    typingEl.innerHTML = `
        <div class="ai-message-avatar">
            <img src="https://ico.hugeicons.com/ai-magic-solid-standard-512.webp" alt="AI">
        </div>
        <div class="ai-message-bubble">
            <div class="ai-typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Simulate AI response after delay
    setTimeout(() => {
        typingEl.remove();
        const aiResponse = getAIResponse(message);
        
        const aiMsg = document.createElement('div');
        aiMsg.className = 'ai-message ai';
        aiMsg.innerHTML = `
            <div class="ai-message-avatar">
                <img src="https://ico.hugeicons.com/ai-magic-solid-standard-512.webp" alt="AI">
            </div>
            <div class="ai-message-bubble">
                <div class="ai-bubble-glow"></div>
                ${aiResponse}
            </div>
        `;
        messagesContainer.appendChild(aiMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1200 + Math.random() * 800);
}

function getAIResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    // Get some context data
    const transactions = JSON.parse(localStorage.getItem('nexus_transactions') || '[]');
    const services = JSON.parse(localStorage.getItem('nexus_services') || '[]');
    const products = JSON.parse(localStorage.getItem('nexus_products') || '[]');
    const clients = JSON.parse(localStorage.getItem('nexus_clientData') || '{}');
    
    const today = new Date();
    const thisMonth = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });
    const totalThisMonth = thisMonth.reduce((sum, t) => sum + (t.value || 0), 0);
    
    // Simple keyword-based responses
    if (lowerMsg.includes('olá') || lowerMsg.includes('oi') || lowerMsg.includes('ola')) {
        return 'Olá! 😊 Como posso ajudar você hoje?';
    }
    
    if (lowerMsg.includes('faturamento') || lowerMsg.includes('vendas') || lowerMsg.includes('quanto')) {
        return `📊 <strong>Resumo do Mês</strong><br><br>
        Total de vendas: <strong>${thisMonth.length}</strong> transações<br>
        Faturamento: <strong>${formatBRL(totalThisMonth)}</strong><br><br>
        Posso ajudar com mais alguma análise?`;
    }
    
    if (lowerMsg.includes('serviço') || lowerMsg.includes('servico')) {
        return `💇 Você tem <strong>${services.length}</strong> serviços cadastrados.<br><br>
        Dica: Mantenha seus serviços atualizados com preços competitivos!`;
    }
    
    if (lowerMsg.includes('produto')) {
        return `📦 Você tem <strong>${products.length}</strong> produtos cadastrados.<br><br>
        Dica: Controle o estoque para não perder vendas!`;
    }
    
    if (lowerMsg.includes('cliente')) {
        const numClients = Object.keys(clients).length;
        return `👥 Você tem <strong>${numClients}</strong> clientes cadastrados.<br><br>
        Dica: Mantenha contato com seus clientes e envie promoções personalizadas!`;
    }
    
    if (lowerMsg.includes('ajuda') || lowerMsg.includes('help') || lowerMsg.includes('fazer')) {
        return `🎯 <strong>O que posso fazer:</strong><br><br>
        • Mostrar resumo de <strong>faturamento</strong><br>
        • Informar sobre <strong>clientes</strong><br>
        • Listar <strong>serviços</strong> e <strong>produtos</strong><br>
        • Dar <strong>dicas</strong> de gestão<br>
        • Responder <strong>dúvidas</strong> gerais<br><br>
        É só perguntar! 😊`;
    }
    
    if (lowerMsg.includes('dica') || lowerMsg.includes('sugestão') || lowerMsg.includes('sugestao')) {
        const tips = [
            '💡 <strong>Dica do dia:</strong> Agende lembretes para clientes que não visitam há mais de 30 dias.',
            '💡 <strong>Dica do dia:</strong> Ofereça combos de serviços para aumentar o ticket médio.',
            '💡 <strong>Dica do dia:</strong> Mantenha fotos dos trabalhos para o portfólio do negócio.',
            '💡 <strong>Dica do dia:</strong> Analise seus horários de pico para otimizar a agenda.',
            '💡 <strong>Dica do dia:</strong> Fidelize clientes com programas de pontos ou descontos.'
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }
    
    if (lowerMsg.includes('obrigado') || lowerMsg.includes('obrigada') || lowerMsg.includes('valeu')) {
        return 'De nada! 😊 Estou sempre aqui para ajudar. Qualquer dúvida, é só chamar!';
    }
    
    // Default responses
    const defaultResponses = [
        'Interessante! Me conta mais sobre o que você precisa? 🤔',
        'Entendi! Posso te ajudar com informações sobre vendas, clientes, serviços ou produtos. O que prefere?',
        'Hmm, não tenho certeza se entendi. Pode reformular a pergunta? 😊',
        'Boa pergunta! Para te dar uma resposta melhor, me diz se é sobre vendas, clientes ou agenda.',
        'Estou aprendendo cada dia mais! Por enquanto, posso te ajudar com relatórios e informações do sistema.'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function exportBackup() {
    const backupData = {
        version: 1,
        date: new Date().toISOString(),
        data: {}
    };
    
    const keys = [
        'nexus_services', 'nexus_products', 'nexus_transactions',
        'nexus_client_data', 'nexus_client_notes', 'nexus_deleted_clients',
        'nexus_birthday_message', 'nexus_language', 'nexus_theme',
        'nexus_db_url', 'nexus_credentials'
    ];
    
    keys.forEach(key => {
        const val = localStorage.getItem(key);
        if (val !== null) backupData.data[key] = val;
    });
    
    const json = JSON.stringify(backupData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    a.href = url;
    a.download = `nexus-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Backup exportado com sucesso!', 'success');
}

function importBackup() {
    const input = document.getElementById('backupFileInput');
    if (input) input.click();
}

function handleBackupImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backupData = JSON.parse(e.target.result);
            
            if (!backupData.data || typeof backupData.data !== 'object') {
                showToast('Arquivo de backup inválido', 'error');
                return;
            }
            
            if (!confirm('Isso irá substituir todos os dados atuais. Deseja continuar?')) return;
            
            Object.entries(backupData.data).forEach(([key, value]) => {
                if (key.startsWith('nexus_')) {
                    localStorage.setItem(key, value);
                }
            });
            
            showToast('Backup importado! Recarregando...', 'success');
            setTimeout(() => location.reload(), 1500);
        } catch (err) {
            showToast('Erro ao ler arquivo de backup', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// =============================================
// CASHIER
// =============================================

function loadTransactionsFromStorage() {
    try {
        const saved = localStorage.getItem('nexus_transactions');
        if (saved) AppState.transactions = JSON.parse(saved);
    } catch (e) {
        console.error('Error loading transactions:', e);
    }
}

function saveTransactionsToStorage() {
    try {
        localStorage.setItem('nexus_transactions', JSON.stringify(AppState.transactions));
    } catch (e) {
        console.error('Error saving transactions:', e);
    }
}

function renderCashier() {
    loadTransactionsFromStorage();
    // Inicializar data do filtro se não existir
    if (!AppState.cashierDateFilter) {
        AppState.cashierDateFilter = formatDate(new Date());
    }
    updateCashierDateLabel();
    updateCashierTotals();
    renderTransactions();
    initCashierFilters();
}

function updateCashierDateLabel() {
    const label = document.getElementById('cashierDateLabel');
    if (!label) return;
    
    const today = formatDate(new Date());
    const filterDate = AppState.cashierDateFilter;
    
    if (filterDate === today) {
        label.textContent = 'Hoje';
    } else {
        label.textContent = formatDateBR(filterDate);
    }
}

function getFilteredTransactions() {
    let transactions = [...(AppState.transactions || [])];
    
    // Filtrar por data se houver filtro
    if (AppState.cashierDateFilter) {
        transactions = transactions.filter(t => t.date === AppState.cashierDateFilter);
    }
    
    return transactions;
}

function updateCashierTotals() {
    const transactions = getFilteredTransactions();
    
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const income = incomeTransactions.reduce((sum, t) => sum + (t.value || 0), 0);
    
    // Calculate breakdown by payment method
    const incomeDinheiro = incomeTransactions
        .filter(t => t.paymentMethod === 'dinheiro')
        .reduce((sum, t) => sum + (t.value || 0), 0);
    
    const incomeCartao = incomeTransactions
        .filter(t => t.paymentMethod === 'credito' || t.paymentMethod === 'debito')
        .reduce((sum, t) => sum + (t.value || 0), 0);
    
    const incomePix = incomeTransactions
        .filter(t => t.paymentMethod === 'pix')
        .reduce((sum, t) => sum + (t.value || 0), 0);
    
    const incomeCarne = incomeTransactions
        .filter(t => t.paymentMethod === 'carne')
        .reduce((sum, t) => sum + (t.value || 0), 0);
    
    const incomeOutros = incomeTransactions
        .filter(t => !t.paymentMethod)
        .reduce((sum, t) => sum + (t.value || 0), 0);
    
    // Calcular taxas de cartão
    const fees = loadCardFees();
    let cardFees = 0;
    incomeTransactions.forEach(t => {
        if (t.paymentMethod === 'credito' || t.paymentMethod === 'debito') {
            const brand = t.cardBrand || 'other';
            const feePercent = (fees[t.paymentMethod] && fees[t.paymentMethod][brand]) ? fees[t.paymentMethod][brand] : 0;
            cardFees += (t.value * feePercent) / 100;
        }
    });
    
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const expense = expenseTransactions.reduce((sum, t) => sum + (t.value || 0), 0);
    
    // Calculate previous balance (saldo anterior) - all transactions before current filter date
    const filterDate = AppState.cashierDateFilter || formatDate(new Date());
    const previousTransactions = (AppState.transactions || []).filter(t => t.date < filterDate);
    const previousIncome = previousTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.value || 0), 0);
    const previousExpense = previousTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.value || 0), 0);
    
    // Calcular taxas de cartão anteriores
    let previousCardFees = 0;
    previousTransactions.filter(t => t.type === 'income').forEach(t => {
        if (t.paymentMethod === 'credito' || t.paymentMethod === 'debito') {
            const brand = t.cardBrand || 'other';
            const feePercent = (fees[t.paymentMethod] && fees[t.paymentMethod][brand]) ? fees[t.paymentMethod][brand] : 0;
            previousCardFees += (t.value * feePercent) / 100;
        }
    });
    
    const previousBalance = previousIncome - previousExpense - previousCardFees;
    
    const dayBalance = income - expense - cardFees;
    const balance = previousBalance + dayBalance;
    
    const incomeEl = document.getElementById('cashierIncome');
    const expenseEl = document.getElementById('cashierExpense');
    const balanceEl = document.getElementById('cashierBalance');
    const breakdownEl = document.getElementById('incomeBreakdown');
    const balanceBreakdownEl = document.getElementById('balanceBreakdown');
    const expenseBreakdownEl = document.getElementById('expenseBreakdown');
    
    if (incomeEl) incomeEl.textContent = formatBRL(income);
    if (expenseEl) expenseEl.textContent = formatBRL(expense);
    if (balanceEl) {
        balanceEl.textContent = formatBRL(balance);
        balanceEl.style.color = balance >= 0 ? '#64b4ff' : '#ff6b6b';
    }
    
    // Render income breakdown
    if (breakdownEl && income > 0) {
        let breakdownHtml = '';
        if (incomeDinheiro > 0) {
            breakdownHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-money-bill-wave"></i>Dinheiro</div><span>${formatBRL(incomeDinheiro)}</span></div>`;
        }
        if (incomeCartao > 0) {
            breakdownHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-credit-card"></i>Cartão</div><span>${formatBRL(incomeCartao)}</span></div>`;
        }
        if (incomePix > 0) {
            breakdownHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-qrcode"></i>PIX</div><span>${formatBRL(incomePix)}</span></div>`;
        }
        if (incomeCarne > 0) {
            breakdownHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-file-invoice"></i>Carnê</div><span>${formatBRL(incomeCarne)}</span></div>`;
        }
        if (incomeOutros > 0) {
            breakdownHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-ellipsis"></i>Outros</div><span>${formatBRL(incomeOutros)}</span></div>`;
        }
        breakdownEl.innerHTML = breakdownHtml;
    } else if (breakdownEl) {
        breakdownEl.innerHTML = '';
    }
    
    // Render balance breakdown
    if (balanceBreakdownEl) {
        let balanceHtml = '';
        if (previousBalance !== 0) {
            const prevColor = previousBalance >= 0 ? 'var(--primary)' : '#ff6b6b';
            const prevSign = previousBalance >= 0 ? '+' : '';
            balanceHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-clock-rotate-left"></i>Saldo Anterior</div><span style="color: ${prevColor}">${prevSign}${formatBRL(previousBalance)}</span></div>`;
        }
        balanceHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-arrow-up"></i>Entradas Hoje</div><span style="color: var(--primary)">+${formatBRL(income)}</span></div>`;
        balanceHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-arrow-down"></i>Saídas Hoje</div><span style="color: #ff6b6b">-${formatBRL(expense)}</span></div>`;
        if (cardFees > 0) {
            balanceHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-percent"></i>Taxas Cartão</div><span style="color: #ffa500">-${formatBRL(cardFees)}</span></div>`;
        }
        balanceBreakdownEl.innerHTML = balanceHtml;
    }
    
    // Render expense breakdown
    if (expenseBreakdownEl) {
        const expenseCount = expenseTransactions.length;
        const expenseAvg = expenseCount > 0 ? expense / expenseCount : 0;
        let expenseHtml = '';
        expenseHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-receipt"></i>Transações</div><span>${expenseCount}</span></div>`;
        expenseHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-calculator"></i>Média</div><span>${formatBRL(expenseAvg)}</span></div>`;
        expenseBreakdownEl.innerHTML = expenseHtml;
    }
}

function renderTransactions(filter = 'all') {
    const list = document.getElementById('transactionsList');
    if (!list) return;

    let transactions = getFilteredTransactions();
    
    if (filter === 'income') transactions = transactions.filter(t => t.type === 'income');
    if (filter === 'expense') transactions = transactions.filter(t => t.type === 'expense');
    
    // Sort by date desc
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    const dateLabel = AppState.cashierDateFilter ? formatDateBR(AppState.cashierDateFilter) : 'este período';

    if (transactions.length === 0) {
        list.innerHTML = `
            <div class="cashier-empty">
                <i class="fa-solid fa-receipt"></i>
                <p>Nenhuma movimentação${filter !== 'all' ? ` do tipo ${filter === 'income' ? 'entrada' : 'saída'}` : ''} em ${dateLabel}</p>
            </div>
        `;
        return;
    }
    
    const paymentMethodLabels = {
        'dinheiro': { icon: 'fa-money-bill-wave', label: 'Dinheiro' },
        'pix': { icon: 'fa-qrcode', label: 'PIX' },
        'credito': { icon: 'fa-credit-card', label: 'Crédito' },
        'debito': { icon: 'fa-credit-card', label: 'Débito' },
        'carne': { icon: 'fa-file-invoice', label: 'Carnê' }
    };

    list.innerHTML = transactions.map((t, i) => {
        const originalIndex = AppState.transactions.findIndex(tr => tr.id === t.id);
        const icon = t.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down';
        const signal = t.type === 'income' ? '+' : '-';
        const hasEdits = t.editHistory && t.editHistory.length > 0;
        const editCount = hasEdits ? t.editHistory.length : 0;
        const hasItems = t.items && t.items.length > 0;
        
        // Badge de pagamento
        const pmInfo = t.paymentMethod ? paymentMethodLabels[t.paymentMethod] : null;
        const paymentBadge = pmInfo ? `<span class="payment-method-badge"><i class="fa-solid ${pmInfo.icon}"></i> ${pmInfo.label}</span>` : '';
        
        // Items list
        let itemsHtml = '';
        if (hasItems) {
            const itemsTotal = t.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            itemsHtml = `
                <div class="transaction-items-preview">
                    <div class="transaction-items-toggle" onclick="toggleTransactionItems(this)">
                        <i class="fa-solid fa-box-open"></i> ${t.items.length} item(s) <i class="fa-solid fa-chevron-down toggle-arrow"></i>
                    </div>
                    <div class="transaction-items-list">
                        ${t.items.map(item => `
                            <div class="transaction-item-row">
                                <span class="transaction-item-icon ${item.type}"><i class="fa-solid ${item.icon || (item.type === 'product' ? 'fa-box' : 'fa-scissors')}"></i></span>
                                <span class="transaction-item-name">${item.name}</span>
                                <span class="transaction-item-qty">${item.quantity}x</span>
                                <span class="transaction-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                        `).join('')}
                        <div class="transaction-items-summary">
                            <span>Total itens:</span>
                            <span>R$ ${itemsTotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        ${t.value !== itemsTotal ? `
                            <div class="transaction-items-summary final">
                                <span>Valor cobrado:</span>
                                <span>R$ ${t.value.toFixed(2).replace('.', ',')}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        
        // Gerar histórico de edições
        let historyHtml = '';
        if (hasEdits) {
            historyHtml = `
                <div class="transaction-edit-history">
                    <div class="transaction-edit-history-title"><i class="fa-solid fa-clock-rotate-left"></i> Histórico de Edições (${editCount})</div>
                    ${t.editHistory.map((edit, idx) => `
                        <div class="transaction-edit-record">
                            <div class="edit-record-header">
                                <span class="edit-record-number">#${idx + 1}</span>
                                <span class="edit-record-date">${formatDateTimeBR(edit.editedAt)}</span>
                            </div>
                            <div class="edit-record-details">
                                <span class="edit-record-label">Valor anterior:</span>
                                <span class="edit-record-value ${edit.previousType}">${edit.previousType === 'income' ? '+' : '-'} R$ ${edit.previousValue.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div class="edit-record-details">
                                <span class="edit-record-label">Descrição:</span>
                                <span class="edit-record-text">${edit.previousDescription}</span>
                            </div>
                        </div>
                    `).reverse().join('')}
                </div>
            `;
        }
        
        // Calcular valores para exibição
        const itemsTotal = t.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
        const originalVal = t.originalValue || itemsTotal;
        const hasValueDiff = hasItems && originalVal > 0 && Math.abs(t.value - originalVal) >= 0.01;
        
        return `
            <div class="cashier-transaction-item ${t.type} ${hasEdits ? 'was-edited' : ''} ${hasItems ? 'has-items' : ''}">
                <div class="cashier-transaction-icon"><i class="fa-solid ${icon}"></i></div>
                <div class="cashier-transaction-info">
                    <div class="cashier-transaction-desc">
                        ${t.description}
                        ${paymentBadge}
                        ${hasEdits ? `<span class="transaction-edited-badge" onclick="toggleEditHistory(this)" title="Editado ${editCount}x - clique para ver histórico"><i class="fa-solid fa-pen"></i> ${editCount}</span>` : ''}
                    </div>
                    <div class="cashier-transaction-date">${formatDateBR(t.date)}</div>
                    ${itemsHtml}
                    ${historyHtml}
                </div>
                <div class="cashier-transaction-value">
                    ${signal} ${formatBRL(t.value)}
                    ${hasValueDiff ? `<span class="original-value-badge" title="Valor original dos itens">(orig: ${formatBRL(originalVal)})</span>` : ''}
                </div>
                <div class="cashier-transaction-actions">
                    <button class="cashier-transaction-btn" onclick="editTransaction(${originalIndex})"><i class="fa-solid fa-pen"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

function toggleTransactionItems(el) {
    const itemsList = el.nextElementSibling;
    if (itemsList) {
        itemsList.classList.toggle('expanded');
        el.classList.toggle('expanded');
    }
}

function initCashierFilters() {
    document.querySelectorAll('.cashier-btn-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.cashier-btn-filter').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderTransactions(this.dataset.filter);
        });
    });
}

let cashierCalDate = new Date(); // Separate date for cashier calendar navigation

function openCashierDateModal() {
    const today = formatDate(new Date());
    const currentFilter = AppState.cashierDateFilter || today;
    
    // Parse current filter to set initial calendar month
    if (currentFilter) {
        const [y, m, d] = currentFilter.split('-').map(Number);
        cashierCalDate = new Date(y, m - 1, 1);
    } else {
        cashierCalDate = new Date();
    }
    
    const html = `
        <div class="modal-content" style="max-width: 320px;">
            <div class="modal-header">
                <h2><i class="fa-solid fa-calendar"></i> Selecionar Data</h2>
                <button class="modal-close" onclick="closeModal('cashierDateModal')">&times;</button>
            </div>
            <div class="modal-body" style="padding: 16px;">
                <div class="cashier-calendar-widget">
                    <div class="cashier-cal-header">
                        <button class="cashier-cal-nav" onclick="changeCashierCalMonth(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                        <span class="cashier-cal-month" id="cashierCalMonth">MARÇO 2026</span>
                        <button class="cashier-cal-nav" onclick="changeCashierCalMonth(1)"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                    <div class="cashier-cal-weekdays">
                        <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                    </div>
                    <div class="cashier-cal-days" id="cashierCalDays"></div>
                </div>
                <button class="cashier-today-btn" onclick="setCashierDateToday()">
                    <i class="fa-solid fa-calendar-day"></i> Hoje
                </button>
            </div>
        </div>
    `;
    
    let modal = document.getElementById('cashierDateModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cashierDateModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = html;
    modal.classList.add('active');
    
    renderCashierCalendar();
}

function changeCashierCalMonth(delta) {
    cashierCalDate.setMonth(cashierCalDate.getMonth() + delta);
    renderCashierCalendar();
}

function renderCashierCalendar() {
    const monthEl = document.getElementById('cashierCalMonth');
    const daysEl = document.getElementById('cashierCalDays');
    if (!monthEl || !daysEl) return;
    
    const months = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    
    monthEl.textContent = `${months[cashierCalDate.getMonth()]} ${cashierCalDate.getFullYear()}`;
    
    const year = cashierCalDate.getFullYear();
    const month = cashierCalDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const today = new Date();
    const todayStr = formatDate(today);
    const selectedDate = AppState.cashierDateFilter || todayStr;
    
    // Build set of dates that have transactions this month
    const datesWithTransactions = new Set();
    (AppState.transactions || []).forEach(t => {
        if (t.date) datesWithTransactions.add(t.date);
    });
    
    let html = '';
    
    // Previous month ghost days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        html += `<span class="cashier-cal-day other-month">${day}</span>`;
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const isSelected = dateStr === selectedDate;
        const hasTransactions = datesWithTransactions.has(dateStr);
        
        let classes = 'cashier-cal-day';
        if (isToday) classes += ' today';
        if (isSelected) classes += ' selected';
        if (hasTransactions) classes += ' has-transactions';
        
        html += `<button class="${classes}" onclick="selectCashierDate('${dateStr}')">${day}</button>`;
    }
    
    // Next month ghost days to fill remaining cells
    const totalCells = firstDay + daysInMonth;
    const remainingCells = (42 - totalCells) % 7 || (totalCells <= 35 ? 7 : 0);
    for (let day = 1; day <= remainingCells; day++) {
        html += `<span class="cashier-cal-day other-month">${day}</span>`;
    }
    
    daysEl.innerHTML = html;
}

function selectCashierDate(dateStr) {
    AppState.cashierDateFilter = dateStr;
    closeModal('cashierDateModal');
    updateCashierDateLabel();
    updateCashierTotals();
    renderTransactions();
}

function setCashierDateToday() {
    const today = formatDate(new Date());
    selectCashierDate(today);
}

function openTransactionModal(transaction = null, index = null) {
    const isEdit = transaction !== null;
    const paymentMethods = [
        { id: 'dinheiro', icon: 'fa-money-bill-wave', label: 'Dinheiro' },
        { id: 'pix', icon: 'fa-qrcode', label: 'PIX' },
        { id: 'credito', icon: 'fa-credit-card', label: 'Crédito' },
        { id: 'debito', icon: 'fa-credit-card', label: 'Débito' },
        { id: 'carne', icon: 'fa-file-invoice', label: 'Carnê' }
    ];
    
    const cardBrands = [
        { id: 'visa', icon: 'fa-cc-visa', iconClass: 'fa-brands', label: 'Visa' },
        { id: 'mastercard', icon: 'fa-cc-mastercard', iconClass: 'fa-brands', label: 'Master' },
        { id: 'elo', icon: 'fa-credit-card', iconClass: 'fa-solid', label: 'Elo' },
        { id: 'amex', icon: 'fa-cc-amex', iconClass: 'fa-brands', label: 'Amex' },
        { id: 'hipercard', icon: 'fa-credit-card', iconClass: 'fa-solid', label: 'Hiper' }
    ];
    
    // Initialize selected items from existing transaction or empty
    window.transactionItems = transaction?.items ? [...transaction.items] : [];
    
    const html = `
        <div class="modal-content" style="max-width: 520px;">
            <div class="modal-header">
                <h2><i class="fa-solid fa-receipt" style="color: var(--primary);"></i> ${isEdit ? 'Editar' : 'Nova'} Movimentação</h2>
                <button class="modal-close" onclick="closeModal('transactionModal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Tipo</label>
                    <div style="display:flex;gap:8px;">
                        <button type="button" class="transaction-type-btn ${(!transaction || transaction.type === 'income') ? 'active' : ''}" data-type="income" onclick="selectTransactionType('income')">
                            <i class="fa-solid fa-arrow-trend-up"></i> Entrada
                        </button>
                        <button type="button" class="transaction-type-btn ${transaction?.type === 'expense' ? 'active' : ''}" data-type="expense" onclick="selectTransactionType('expense')">
                            <i class="fa-solid fa-arrow-trend-down"></i> Saída
                        </button>
                    </div>
                    <input type="hidden" id="transactionType" value="${transaction?.type || 'income'}">
                </div>
                <div class="form-group payment-method-group" id="paymentMethodGroup">
                    <label>Forma de Pagamento</label>
                    <div class="payment-methods-grid">
                        ${paymentMethods.map(pm => `
                            <button type="button" class="payment-method-btn ${transaction?.paymentMethod === pm.id ? 'active' : ''}" data-method="${pm.id}" onclick="selectPaymentMethod('${pm.id}')">
                                <i class="fa-solid ${pm.icon}"></i>
                                <span>${pm.label}</span>
                            </button>
                        `).join('')}
                    </div>
                    <input type="hidden" id="transactionPaymentMethod" value="${transaction?.paymentMethod || ''}">
                </div>
                
                <!-- Card Brand Selection (for Credit/Debit) -->
                <div class="form-group card-brand-group" id="cardBrandGroup" style="display:none;">
                    <label>Bandeira do Cartão <span style="opacity:0.6;font-weight:normal;">(opcional)</span></label>
                    <div class="card-brands-grid">
                        ${cardBrands.map(cb => `
                            <button type="button" class="card-brand-btn ${transaction?.cardBrand === cb.id ? 'active' : ''}" data-brand="${cb.id}" onclick="selectCardBrand('${cb.id}')">
                                <i class="${cb.iconClass} ${cb.icon}"></i>
                                <span>${cb.label}</span>
                            </button>
                        `).join('')}
                    </div>
                    <input type="hidden" id="transactionCardBrand" value="${transaction?.cardBrand || ''}">
                </div>
                
                <!-- Client Selection -->
                <div class="form-group client-section" id="clientSection">
                    <label>Cliente</label>
                    <div class="client-search-wrap">
                        <input type="text" id="transactionClientSearch" class="form-input" placeholder="Digite para buscar cliente..." value="${transaction?.clientName || ''}" autocomplete="off">
                        <div class="client-suggestions-transaction" id="clientSuggestionsTransaction"></div>
                    </div>
                    <input type="hidden" id="transactionClientPhone" value="${transaction?.clientPhone || ''}">
                </div>
                
                <!-- Items Section for Income -->
                <div class="form-group items-section" id="itemsSection">
                    <label>Adicionar Itens</label>
                    <div class="item-search-wrap">
                        <input type="text" id="itemSearchInput" class="form-input" placeholder="Digite para buscar produtos ou serviços..." autocomplete="off">
                        <div class="item-suggestions" id="itemSuggestions"></div>
                    </div>
                    <div class="selected-items-list" id="selectedItemsList"></div>
                    <div class="items-total-row" id="itemsTotalRow" style="display:none;">
                        <span class="items-total-label">Total dos itens:</span>
                        <span class="items-total-value" id="itemsTotalValue">R$ 0,00</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Descrição</label>
                    <input type="text" id="transactionDesc" class="form-input" value="${transaction?.description || ''}" placeholder="Ex: Venda de produto">
                </div>
                <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div class="form-group">
                        <label>Valor Final (R$)</label>
                        <input type="number" id="transactionValue" class="form-input" value="${transaction?.value || ''}" placeholder="100.00" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Data</label>
                        <input type="date" id="transactionDate" class="form-input" value="${transaction?.date || formatDate(new Date())}">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal('transactionModal')">Cancelar</button>
                <button class="btn-primary" onclick="saveTransaction(${index})"><i class="fa-solid fa-check"></i> Salvar</button>
            </div>
        </div>
    `;
    
    let modal = document.getElementById('transactionModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'transactionModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = html;
    modal.classList.add('active');
    
    // Initialize item search
    initItemSearch();
    
    // Initialize client search
    initTransactionClientSearch();
    
    // Render existing items if editing
    if (transaction?.items) {
        renderSelectedItems();
    }
    
    // Show/hide items section based on type
    selectTransactionType(transaction?.type || 'income');
    
    // Show/hide card brand based on payment method
    if (transaction?.paymentMethod === 'credito' || transaction?.paymentMethod === 'debito') {
        document.getElementById('cardBrandGroup').style.display = 'block';
    }
    
    document.getElementById('transactionDesc')?.focus();
}

function initTransactionClientSearch() {
    const input = document.getElementById('transactionClientSearch');
    const suggestionsEl = document.getElementById('clientSuggestionsTransaction');
    if (!input || !suggestionsEl) return;
    
    input.addEventListener('input', function() {
        const search = this.value.toLowerCase().trim();
        if (search.length < 2) {
            suggestionsEl.innerHTML = '';
            suggestionsEl.classList.remove('active');
            return;
        }
        
        const clients = Array.from(AppState.knownClients.values())
            .filter(c => c.name.toLowerCase().includes(search) || c.phone.includes(search))
            .slice(0, 5);
        
        if (clients.length === 0) {
            suggestionsEl.innerHTML = '<div class="client-suggestion-empty">Nenhum cliente encontrado</div>';
            suggestionsEl.classList.add('active');
            return;
        }
        
        suggestionsEl.innerHTML = clients.map(client => {
            const initials = client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            return `
                <div class="client-suggestion-item" onclick="selectTransactionClient('${client.name.replace(/'/g, "\\'")}', '${client.phone}')">
                    <div class="client-suggestion-avatar">${initials}</div>
                    <div class="client-suggestion-info">
                        <span class="client-suggestion-name">${client.name}</span>
                        <span class="client-suggestion-phone">${client.phone}</span>
                    </div>
                </div>
            `;
        }).join('');
        suggestionsEl.classList.add('active');
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.client-search-wrap')) {
            suggestionsEl.classList.remove('active');
        }
    });
}

function selectTransactionClient(name, phone) {
    document.getElementById('transactionClientSearch').value = name;
    document.getElementById('transactionClientPhone').value = phone;
    document.getElementById('clientSuggestionsTransaction').classList.remove('active');
    
    // Update description with client name first
    const descInput = document.getElementById('transactionDesc');
    if (descInput && !descInput.dataset.userEdited && window.transactionItems?.length > 0) {
        const itemNames = window.transactionItems.map(i => i.name).join(', ');
        descInput.value = `${name} - ${itemNames}`;
    }
}

function selectCardBrand(brand) {
    document.getElementById('transactionCardBrand').value = brand;
    document.querySelectorAll('.card-brand-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.brand === brand);
    });
}

function initItemSearch() {
    const input = document.getElementById('itemSearchInput');
    const suggestionsEl = document.getElementById('itemSuggestions');
    if (!input || !suggestionsEl) return;
    
    input.addEventListener('input', function() {
        const search = this.value.toLowerCase().trim();
        if (search.length < 1) {
            suggestionsEl.innerHTML = '';
            suggestionsEl.classList.remove('active');
            return;
        }
        
        // Load products and services
        loadProductsFromStorage();
        loadServicesFromStorage();
        
        const products = (AppState.products || []).filter(p => 
            p.nome.toLowerCase().includes(search)
        ).map(p => ({
            type: 'product',
            id: p.id,
            name: p.nome,
            price: p.preco,
            stock: p.estoque,
            icon: 'fa-box'
        }));
        
        const services = (AppState.services || []).filter(s => 
            s.nome.toLowerCase().includes(search)
        ).map(s => ({
            type: 'service',
            id: s.id,
            name: s.nome,
            price: s.preco,
            duration: s.duracao,
            icon: 'fa-scissors'
        }));
        
        const allItems = [...services, ...products];
        
        if (allItems.length === 0) {
            suggestionsEl.innerHTML = '<div class="item-suggestion-empty">Nenhum item encontrado</div>';
            suggestionsEl.classList.add('active');
            return;
        }
        
        suggestionsEl.innerHTML = allItems.map(item => {
            const stockInfo = item.type === 'product' ? 
                `<span class="item-stock ${item.stock <= 0 ? 'out' : item.stock < 5 ? 'low' : ''}">${item.stock} un</span>` : 
                `<span class="item-duration">${item.duration || 30} min</span>`;
            return `
                <div class="item-suggestion" onclick="addTransactionItem(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                    <div class="item-suggestion-icon ${item.type}"><i class="fa-solid ${item.icon}"></i></div>
                    <div class="item-suggestion-info">
                        <span class="item-suggestion-name">${item.name}</span>
                        ${stockInfo}
                    </div>
                    <span class="item-suggestion-price">R$ ${parseFloat(item.price || 0).toFixed(2).replace('.', ',')}</span>
                </div>
            `;
        }).join('');
        suggestionsEl.classList.add('active');
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.item-search-wrap')) {
            suggestionsEl.classList.remove('active');
        }
    });
}

function initServiceAutocomplete() {
    const input = document.getElementById('appointmentService');
    const suggestionsEl = document.getElementById('serviceSuggestions');
    if (!input || !suggestionsEl) return;
    
    // Remove old listeners by cloning the element
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);
    
    newInput.addEventListener('input', function() {
        const search = this.value.toLowerCase().trim();
        
        loadServicesFromStorage();
        
        // Sort services alphabetically
        const sortedServices = (AppState.services || [])
            .slice()
            .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        
        // Filter services
        const filtered = search.length > 0 
            ? sortedServices.filter(s => s.nome.toLowerCase().includes(search))
            : sortedServices;
        
        if (filtered.length === 0) {
            suggestionsEl.classList.remove('show');
            suggestionsEl.innerHTML = '';
            return;
        }
        
        suggestionsEl.innerHTML = filtered.map(s => `
            <div class="service-suggestion" onclick="selectServiceSuggestion('${s.nome.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-scissors"></i>
                <span>${s.nome}</span>
                <span class="service-price">R$ ${parseFloat(s.preco || 0).toFixed(2).replace('.', ',')}</span>
            </div>
        `).join('');
        suggestionsEl.classList.add('show');
    });
    
    newInput.addEventListener('focus', function() {
        const search = this.value.toLowerCase().trim();
        loadServicesFromStorage();
        
        const sortedServices = (AppState.services || [])
            .slice()
            .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        
        const filtered = search.length > 0 
            ? sortedServices.filter(s => s.nome.toLowerCase().includes(search))
            : sortedServices;
        
        if (filtered.length > 0) {
            suggestionsEl.innerHTML = filtered.map(s => `
                <div class="service-suggestion" onclick="selectServiceSuggestion('${s.nome.replace(/'/g, "\\'")}')">
                    <i class="fa-solid fa-scissors"></i>
                    <span>${s.nome}</span>
                    <span class="service-price">R$ ${parseFloat(s.preco || 0).toFixed(2).replace('.', ',')}</span>
                </div>
            `).join('');
            suggestionsEl.classList.add('show');
        }
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.input-with-suggestions')) {
            suggestionsEl.classList.remove('show');
        }
    });
}

function selectServiceSuggestion(serviceName) {
    const input = document.getElementById('appointmentService');
    if (input) input.value = serviceName;
    
    const suggestionsEl = document.getElementById('serviceSuggestions');
    if (suggestionsEl) {
        suggestionsEl.classList.remove('show');
        suggestionsEl.innerHTML = '';
    }
}

function addTransactionItem(item) {
    // Check if already added
    const existingIndex = window.transactionItems.findIndex(i => i.id === item.id && i.type === item.type);
    
    if (existingIndex >= 0) {
        // Increment quantity
        window.transactionItems[existingIndex].quantity++;
    } else {
        // Add new item
        window.transactionItems.push({
            ...item,
            quantity: 1
        });
    }
    
    // Clear search
    document.getElementById('itemSearchInput').value = '';
    document.getElementById('itemSuggestions').classList.remove('active');
    
    // Update UI
    renderSelectedItems();
    updateTransactionTotal();
}

function removeTransactionItem(index) {
    window.transactionItems.splice(index, 1);
    renderSelectedItems();
    updateTransactionTotal();
}

function updateItemQuantity(index, delta) {
    const item = window.transactionItems[index];
    if (!item) return;
    
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeTransactionItem(index);
        return;
    }
    
    renderSelectedItems();
    updateTransactionTotal();
}

function renderSelectedItems() {
    const listEl = document.getElementById('selectedItemsList');
    const totalRow = document.getElementById('itemsTotalRow');
    if (!listEl) return;
    
    if (window.transactionItems.length === 0) {
        listEl.innerHTML = '';
        if (totalRow) totalRow.style.display = 'none';
        return;
    }
    
    listEl.innerHTML = window.transactionItems.map((item, index) => `
        <div class="selected-item">
            <div class="selected-item-icon ${item.type}"><i class="fa-solid ${item.icon}"></i></div>
            <div class="selected-item-info">
                <span class="selected-item-name">${item.name}</span>
                <span class="selected-item-price">R$ ${parseFloat(item.price || 0).toFixed(2).replace('.', ',')} un</span>
            </div>
            <div class="selected-item-qty">
                <button class="qty-btn" onclick="updateItemQuantity(${index}, -1)"><i class="fa-solid fa-minus"></i></button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="updateItemQuantity(${index}, 1)"><i class="fa-solid fa-plus"></i></button>
            </div>
            <span class="selected-item-subtotal">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
            <button class="selected-item-remove" onclick="removeTransactionItem(${index})"><i class="fa-solid fa-times"></i></button>
        </div>
    `).join('');
    
    if (totalRow) totalRow.style.display = 'flex';
}

function updateTransactionTotal() {
    const total = window.transactionItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const totalValueEl = document.getElementById('itemsTotalValue');
    const valueInput = document.getElementById('transactionValue');
    
    if (totalValueEl) {
        totalValueEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
    
    // Auto-fill value if empty or matches previous total
    if (valueInput && (!valueInput.value || valueInput.dataset.autoFilled === 'true')) {
        valueInput.value = total.toFixed(2);
        valueInput.dataset.autoFilled = 'true';
    }
    
    // Generate description from items (with client name first if exists)
    if (window.transactionItems.length > 0) {
        const descInput = document.getElementById('transactionDesc');
        if (descInput && !descInput.dataset.userEdited) {
            const clientInput = document.getElementById('transactionClientSearch');
            const clientName = clientInput?.value?.trim();
            const itemNames = window.transactionItems.map(i => i.name).join(', ');
            descInput.value = clientName ? `${clientName} - ${itemNames}` : itemNames;
        }
    }
}

function selectTransactionType(type) {
    document.getElementById('transactionType').value = type;
    document.querySelectorAll('.transaction-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
    // Mostrar/ocultar formas de pagamento, itens e cliente apenas para entradas
    const paymentGroup = document.getElementById('paymentMethodGroup');
    const itemsSection = document.getElementById('itemsSection');
    const clientSection = document.getElementById('clientSection');
    const cardBrandGroup = document.getElementById('cardBrandGroup');
    if (paymentGroup) {
        paymentGroup.style.display = type === 'income' ? 'block' : 'none';
    }
    if (itemsSection) {
        itemsSection.style.display = type === 'income' ? 'block' : 'none';
    }
    if (clientSection) {
        clientSection.style.display = type === 'income' ? 'block' : 'none';
    }
    if (cardBrandGroup && type !== 'income') {
        cardBrandGroup.style.display = 'none';
    }
}

function selectPaymentMethod(method) {
    document.getElementById('transactionPaymentMethod').value = method;
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.method === method);
    });
    
    // Mostrar/ocultar seleção de bandeira do cartão
    const cardBrandGroup = document.getElementById('cardBrandGroup');
    if (cardBrandGroup) {
        const showCardBrand = method === 'credito' || method === 'debito';
        cardBrandGroup.style.display = showCardBrand ? 'block' : 'none';
        if (!showCardBrand) {
            document.getElementById('transactionCardBrand').value = '';
            document.querySelectorAll('.card-brand-btn').forEach(btn => btn.classList.remove('active'));
        }
    }
}

function saveTransaction(index) {
    const type = document.getElementById('transactionType').value;
    const description = document.getElementById('transactionDesc').value.trim();
    const value = parseFloat(document.getElementById('transactionValue').value) || 0;
    const date = document.getElementById('transactionDate').value;
    const paymentMethod = type === 'income' ? document.getElementById('transactionPaymentMethod').value : null;
    const cardBrand = type === 'income' ? document.getElementById('transactionCardBrand')?.value : null;
    const clientName = type === 'income' ? document.getElementById('transactionClientSearch')?.value.trim() : null;
    const clientPhone = type === 'income' ? document.getElementById('transactionClientPhone')?.value : null;
    const items = type === 'income' ? (window.transactionItems || []) : [];
    
    // Calcular valor original dos itens
    const originalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (!description) {
        showToast('Descrição é obrigatória', 'error');
        return;
    }
    if (isNaN(value) || value <= 0) {
        showToast('Valor deve ser maior que zero', 'error');
        return;
    }

    // Get old items for stock restoration if editing
    const oldItems = (index !== null && index >= 0) ? (AppState.transactions[index]?.items || []) : [];

    if (index !== null && index >= 0) {
        // Edição - restaurar estoque antigo primeiro
        restoreProductStock(oldItems);
        
        // Salvar histórico (manter apenas últimas 10 edições)
        const oldTransaction = AppState.transactions[index];
        let editHistory = oldTransaction.editHistory || [];
        
        // Adicionar registro de edição com dados anteriores
        editHistory.push({
            editedAt: new Date().toISOString(),
            previousType: oldTransaction.type,
            previousDescription: oldTransaction.description,
            previousValue: oldTransaction.value,
            previousDate: oldTransaction.date,
            previousPaymentMethod: oldTransaction.paymentMethod,
            previousItems: oldTransaction.items
        });
        
        // Limitar a 10 entradas no histórico
        if (editHistory.length > 10) {
            editHistory = editHistory.slice(-10);
        }
        
        AppState.transactions[index] = {
            ...oldTransaction,
            type,
            description,
            value,
            originalValue,
            date,
            paymentMethod,
            cardBrand,
            clientName,
            clientPhone,
            items,
            editHistory,
            lastEditedAt: new Date().toISOString()
        };
    } else {
        // Nova transação
        const transaction = { 
            type, 
            description, 
            value, 
            originalValue,
            date,
            paymentMethod,
            cardBrand,
            clientName,
            clientPhone,
            items,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        AppState.transactions.push(transaction);
    }

    // Diminuir estoque dos produtos
    decreaseProductStock(items);

    saveTransactionsToStorage();
    closeModal('transactionModal');
    renderCashier();
    showToast('Movimentação salva!', 'success');
}

function decreaseProductStock(items) {
    if (!items || items.length === 0) return;
    
    loadProductsFromStorage();
    
    const lowStockProducts = [];
    const outOfStockProducts = [];
    
    items.forEach(item => {
        if (item.type === 'product') {
            const productIndex = AppState.products.findIndex(p => p.id === item.id);
            if (productIndex >= 0) {
                const product = AppState.products[productIndex];
                const currentStock = product.estoque || 0;
                const newStock = currentStock - item.quantity;
                
                if (newStock < 0) {
                    outOfStockProducts.push(product.nome || 'Produto');
                } else if (newStock <= 3) {
                    lowStockProducts.push(product.nome || 'Produto');
                }
                
                AppState.products[productIndex].estoque = Math.max(0, newStock);
            }
        }
    });
    
    saveProductsToStorage();
    
    // Alertar sobre estoque baixo ou zerado
    if (outOfStockProducts.length > 0) {
        showToast(`Estoque zerado: ${outOfStockProducts.join(', ')}`, 'warning');
    } else if (lowStockProducts.length > 0) {
        showToast(`Estoque baixo: ${lowStockProducts.join(', ')}`, 'warning');
    }
}

function restoreProductStock(items) {
    if (!items || items.length === 0) return;
    
    loadProductsFromStorage();
    
    items.forEach(item => {
        if (item.type === 'product') {
            const productIndex = AppState.products.findIndex(p => p.id === item.id);
            if (productIndex >= 0) {
                AppState.products[productIndex].estoque = (AppState.products[productIndex].estoque || 0) + item.quantity;
            }
        }
    });
    
    saveProductsToStorage();
}

function editTransaction(index) {
    const transaction = AppState.transactions[index];
    if (transaction) openTransactionModal(transaction, index);
}

// Função de exclusão desabilitada - movimentações não podem ser excluídas
// function deleteTransaction(index) {
//     if (!confirm('Excluir esta movimentação?')) return;
//     const transaction = AppState.transactions[index];
//     if (transaction?.items) {
//         restoreProductStock(transaction.items);
//     }
//     AppState.transactions.splice(index, 1);
//     saveTransactionsToStorage();
//     renderCashier();
//     showToast('Movimentação excluída', 'success');
// }

// =============================================
// STATISTICS - FINANCIAL VIEW
// =============================================

// State for financial stats
if (!AppState.statsMode) AppState.statsMode = 'desempenho';
if (!AppState.financeiroPeriodType) AppState.financeiroPeriodType = 'week';
if (!AppState.financeiroPeriodOffset) AppState.financeiroPeriodOffset = 0;
if (!AppState.finChartType) AppState.finChartType = 'bar';

function switchStatsMode(mode) {
    AppState.statsMode = mode;
    
    // Update pill buttons
    document.querySelectorAll('.stats-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Switch views
    const desempenhoView = document.getElementById('statsViewDesempenho');
    const financeiroView = document.getElementById('statsViewFinanceiro');
    
    if (desempenhoView && financeiroView) {
        if (mode === 'desempenho') {
            desempenhoView.style.display = 'block';
            financeiroView.style.display = 'none';
            renderStats();
        } else {
            desempenhoView.style.display = 'none';
            financeiroView.style.display = 'block';
            renderFinanceiroStats();
        }
    }
}

function setFinanceiroPeriod(type) {
    AppState.financeiroPeriodType = type;
    AppState.financeiroPeriodOffset = 0;
    document.querySelectorAll('.period-tab-fin').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.period === type);
    });
    renderFinanceiroStats();
}

function setFinChartType(type) {
    AppState.finChartType = type;
    document.querySelectorAll('.chart-type-btn-fin').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
    renderFinanceiroStats();
}

function navigateFinanceiroPeriod(dir) {
    // Limitar navegação: máximo 24 meses no passado, não pode ir pro futuro
    const newOffset = AppState.financeiroPeriodOffset + dir;
    if (newOffset > 0) {
        showToast('Não é possível navegar para o futuro', 'warning');
        return;
    }
    if (newOffset < -24) {
        showToast('Limite de histórico: 24 meses', 'warning');
        return;
    }
    AppState.financeiroPeriodOffset = newOffset;
    renderFinanceiroStats();
}

function getFinanceiroPeriodRange() {
    const today = new Date();
    const offset = AppState.financeiroPeriodOffset || 0;

    if (AppState.financeiroPeriodType === 'month') {
        const start = new Date(today.getFullYear(), today.getMonth() + offset, 1);
        const end = new Date(today.getFullYear(), today.getMonth() + offset + 1, 0);
        return { start, end, label: getMonths()[start.getMonth()] + ' ' + start.getFullYear() };
    }

    // week
    const ref = new Date(today);
    ref.setDate(today.getDate() + (offset * 7));
    const dayOfWeek = ref.getDay();
    const start = new Date(ref);
    start.setDate(ref.getDate() - dayOfWeek);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const fmt = d => String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0');
    return { start, end, label: fmt(start) + ' — ' + fmt(end) };
}

function renderFinanceiroStats() {
    loadTransactionsFromStorage();
    
    const today = new Date();
    const todayStr = formatDate(today);
    const { start, end, label } = getFinanceiroPeriodRange();
    const startStr = formatDate(start);
    const endStr = formatDate(end);
    
    // Update period label
    const periodLabel = document.getElementById('financeiroPeriodLabel');
    if (periodLabel) {
        const rangeText = periodLabel.querySelector('.date-range-text');
        if (rangeText) {
            rangeText.textContent = label;
        } else {
            periodLabel.textContent = label;
        }
    }
    
    // Filter transactions for current period
    const periodTransactions = (AppState.transactions || []).filter(t => 
        t.date >= startStr && t.date <= endStr
    );
    
    const incomeTransactions = periodTransactions.filter(t => t.type === 'income');
    const expenseTransactions = periodTransactions.filter(t => t.type === 'expense');
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + (t.value || 0), 0);
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + (t.value || 0), 0);
    const balance = totalIncome - totalExpense;
    
    // Days with transactions
    const uniqueDays = new Set(periodTransactions.map(t => t.date)).size;
    const avgPerDay = uniqueDays > 0 ? (totalIncome / uniqueDays) : 0;
    
    // Update KPIs
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    
    setVal('finStatBalance', formatBRL(balance));
    setVal('finStatIncome', formatBRL(totalIncome));
    setVal('finStatExpense', formatBRL(totalExpense));
    setVal('finStatAvg', formatBRL(avgPerDay));
    
    // Update balance color
    const balanceEl = document.getElementById('finStatBalance');
    if (balanceEl) {
        balanceEl.style.color = balance >= 0 ? '#64b4ff' : '#ff6b6b';
    }
    
    // Calculate badges (comparison with previous period)
    const periodMs = end - start;
    const prevStart = new Date(start.getTime() - periodMs - 86400000);
    const prevEnd = new Date(start.getTime() - 86400000);
    const prevStartStr = formatDate(prevStart);
    const prevEndStr = formatDate(prevEnd);
    
    const prevTransactions = (AppState.transactions || []).filter(t => 
        t.date >= prevStartStr && t.date <= prevEndStr
    );
    const prevIncome = prevTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.value || 0), 0);
    const prevExpense = prevTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.value || 0), 0);
    const prevBalance = prevIncome - prevExpense;
    
    renderFinKpiBadge('finBadgeBalance', balance, prevBalance);
    renderFinKpiBadge('finBadgeIncome', totalIncome, prevIncome);
    renderFinKpiBadge('finBadgeExpense', totalExpense, prevExpense);
    
    const prevUniquedays = new Set(prevTransactions.map(t => t.date)).size;
    const prevAvg = prevUniquedays > 0 ? prevTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.value || 0), 0) / prevUniquedays : 0;
    renderFinKpiBadge('finBadgeAvg', avgPerDay, prevAvg);
    
    // Render charts and details
    renderFinBarChart(start, end, todayStr);
    renderPaymentMethodsRing(incomeTransactions);
    renderFinDailyGrid(start, end, todayStr);
    renderFinTopTransactions(periodTransactions);
    renderFinSummary(totalIncome, totalExpense, balance, periodTransactions.length, uniqueDays);
}

function renderFinKpiBadge(id, current, previous) {
    const badge = document.getElementById(id);
    if (!badge) return;
    if (previous === 0 && current === 0) { badge.textContent = ''; badge.className = 'kpi-badge'; return; }
    if (previous === 0) {
        badge.textContent = current > 0 ? '+100%' : '0%';
        badge.className = current > 0 ? 'kpi-badge up' : 'kpi-badge neutral';
        return;
    }
    const pct = Math.round(((current - previous) / Math.abs(previous)) * 100);
    if (pct === 0) {
        badge.textContent = '0%';
        badge.className = 'kpi-badge neutral';
    } else if (pct > 0) {
        badge.textContent = '+' + pct + '%';
        badge.className = 'kpi-badge up';
    } else {
        badge.textContent = pct + '%';
        badge.className = 'kpi-badge down';
    }
}

function renderFinBarChart(start, end, todayStr) {
    const chartArea = document.getElementById('finChartBars');
    const gridLines = document.getElementById('finChartGridLines');
    const svgOverlay = document.getElementById('finChartSvgOverlay');
    if (!chartArea) return;
    
    const chartType = AppState.finChartType || 'bar';
    const isMonth = AppState.financeiroPeriodType === 'month';
    const dayNames = getWeekdaysShort();
    
    loadTransactionsFromStorage();
    const transactions = AppState.transactions || [];
    
    const dataPoints = [];
    let maxValue = 0;
    
    const totalDays = Math.round((end - start) / 86400000) + 1;
    
    for (let i = 0; i < totalDays; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const dateStr = formatDate(date);
        
        const dayTrans = transactions.filter(t => t.date === dateStr);
        const income = dayTrans.filter(t => t.type === 'income').reduce((s, t) => s + (t.value || 0), 0);
        const expense = dayTrans.filter(t => t.type === 'expense').reduce((s, t) => s + (t.value || 0), 0);
        
        const label = isMonth ? String(date.getDate()) : dayNames[date.getDay()];
        dataPoints.push({ label, income, expense, isToday: dateStr === todayStr });
        
        if (income > maxValue) maxValue = income;
        if (expense > maxValue) maxValue = expense;
    }
    
    // Render grid lines
    if (gridLines) {
        const steps = 5;
        const gridMax = maxValue > 0 ? Math.ceil(maxValue / 100) * 100 : 500;
        let gridHtml = '';
        for (let i = steps; i >= 0; i--) {
            const val = Math.round((gridMax / steps) * i);
            const formatted = val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val;
            gridHtml += `<div class="chart-grid-line"><span class="grid-value">${formatted}</span></div>`;
        }
        gridLines.innerHTML = gridHtml;
    }
    
    const gridMax = maxValue > 0 ? Math.ceil(maxValue / 100) * 100 : 500;
    
    // Clear SVG for line chart
    if (svgOverlay) {
        svgOverlay.innerHTML = '';
        svgOverlay.style.display = chartType === 'line' ? 'block' : 'none';
    }
    
    if (chartType === 'bar') {
        // Bar chart with stacked income/expense
        const parentEl = chartArea.parentElement;
        if (isMonth && dataPoints.length > 14) {
            parentEl.style.overflowX = 'auto';
            parentEl.style.overflowY = 'hidden';
            chartArea.style.minWidth = `${dataPoints.length * 32}px`;
        } else {
            parentEl.style.overflowX = '';
            parentEl.style.overflowY = '';
            chartArea.style.minWidth = '';
        }
        
        chartArea.innerHTML = dataPoints.map(d => {
            const incomeHeight = gridMax > 0 ? Math.max(0, (d.income / gridMax) * 100) : 0;
            const expenseHeight = gridMax > 0 ? Math.max(0, (d.expense / gridMax) * 100) : 0;
            
            return `<div class="fin-bar-col ${d.isToday ? 'today' : ''}">
                <div class="fin-bar-wrapper">
                    <div class="fin-bar-stack">
                        <div class="fin-bar income" style="height: ${incomeHeight}%;">
                            ${d.income > 0 ? `<span class="fin-bar-value income">${formatBRLShort(d.income)}</span>` : ''}
                        </div>
                        <div class="fin-bar expense" style="height: ${expenseHeight}%;">
                            ${d.expense > 0 ? `<span class="fin-bar-value expense">${formatBRLShort(d.expense)}</span>` : ''}
                        </div>
                    </div>
                </div>
                <span class="fin-bar-label">${d.label}</span>
            </div>`;
        }).join('');
    } else {
        // Line chart
        const parentEl = chartArea.parentElement;
        parentEl.style.overflowX = '';
        parentEl.style.overflowY = '';
        chartArea.style.minWidth = '';
        
        chartArea.innerHTML = dataPoints.map(d => {
            return `<div class="fin-bar-col ${d.isToday ? 'today' : ''}">
                <div style="flex:1"></div>
                <span class="fin-bar-label">${d.label}</span>
            </div>`;
        }).join('');
        
        if (svgOverlay) {
            const contentRect = chartArea.getBoundingClientRect();
            const w = contentRect.width || 400;
            const h = contentRect.height || 180;
            const n = dataPoints.length;
            const colW = w / n;
            
            const incomePoints = dataPoints.map((d, i) => ({
                x: colW * i + colW / 2,
                y: gridMax > 0 ? (1 - d.income / gridMax) * h : h
            }));
            
            const expensePoints = dataPoints.map((d, i) => ({
                x: colW * i + colW / 2,
                y: gridMax > 0 ? (1 - d.expense / gridMax) * h : h
            }));
            
            const incomeStr = incomePoints.map(p => `${p.x},${p.y}`).join(' ');
            const expenseStr = expensePoints.map(p => `${p.x},${p.y}`).join(' ');
            
            let svgHtml = `
                <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="rgba(0,255,136,0.2)"/>
                        <stop offset="100%" stop-color="rgba(0,255,136,0.02)"/>
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="rgba(255,107,107,0.2)"/>
                        <stop offset="100%" stop-color="rgba(255,107,107,0.02)"/>
                    </linearGradient>
                </defs>
            `;
            
            // Income line
            svgHtml += `<polyline points="${incomeStr}" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />`;
            
            // Expense line
            svgHtml += `<polyline points="${expenseStr}" fill="none" stroke="#ff6b6b" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />`;
            
            // Dots
            incomePoints.forEach(p => {
                svgHtml += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="var(--primary)" stroke="#1a1a1a" stroke-width="2" />`;
            });
            expensePoints.forEach(p => {
                svgHtml += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#ff6b6b" stroke="#1a1a1a" stroke-width="2" />`;
            });
            
            svgOverlay.setAttribute('viewBox', `0 0 ${w} ${h}`);
            svgOverlay.innerHTML = svgHtml;
        }
    }
}

function formatBRLShort(val) {
    if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'k';
    }
    return val.toFixed(0);
}

function renderPaymentMethodsRing(incomeTransactions) {
    const ring = document.getElementById('paymentMethodsRing');
    const legend = document.getElementById('paymentMethodsLegend');
    const center = document.getElementById('paymentMethodsRingCenter');
    if (!ring || !legend) return;
    
    const methodLabels = {
        'dinheiro': 'Dinheiro',
        'pix': 'PIX',
        'credito': 'Crédito',
        'debito': 'Débito',
        'carne': 'Carnê',
        'other': 'Outros'
    };
    
    const methodColors = {
        'dinheiro': '#00ff88',
        'pix': '#4DABF7',
        'credito': '#a855f7',
        'debito': '#ec4899',
        'carne': '#ffa500',
        'other': '#8898aa'
    };
    
    // Count by payment method
    const methodTotals = {};
    incomeTransactions.forEach(t => {
        const method = t.paymentMethod || 'other';
        methodTotals[method] = (methodTotals[method] || 0) + (t.value || 0);
    });
    
    const sorted = Object.entries(methodTotals).sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((s, e) => s + e[1], 0);
    
    if (center) {
        const totalEl = center.querySelector('.ring-total');
        if (totalEl) totalEl.textContent = formatBRLShort(total);
    }
    
    const cx = 80, cy = 80, r = 65, strokeWidth = 14;
    
    if (total === 0) {
        ring.innerHTML = `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="rgba(255,255,255,0.06)" stroke-width="${strokeWidth}" fill="none"/>`;
        legend.innerHTML = '<div class="stats-empty">Sem dados</div>';
        return;
    }
    
    const circumference = 2 * Math.PI * r;
    let offset = 0;
    let circlesHtml = '';
    
    sorted.forEach(([method, value]) => {
        const pct = value / total;
        const dash = pct * circumference;
        const gap = circumference - dash;
        const color = methodColors[method] || methodColors.other;
        circlesHtml += `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="${color}" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${-offset}" />`;
        offset += dash;
    });
    
    ring.innerHTML = circlesHtml;
    
    legend.innerHTML = sorted.map(([method, value]) => {
        const pct = Math.round((value / total) * 100);
        const color = methodColors[method] || methodColors.other;
        const label = methodLabels[method] || method;
        return `<div class="service-list-item">
            <span class="service-color-dot" style="background:${color}"></span>
            <div class="service-info">
                <span class="service-name">${label}</span>
                <span class="service-count">${formatBRL(value)}</span>
            </div>
            <span class="service-pct-badge">${pct}%</span>
        </div>`;
    }).join('');
}

function renderFinDailyGrid(start, end, todayStr) {
    const grid = document.getElementById('finDailyGrid');
    if (!grid) return;
    
    loadTransactionsFromStorage();
    const transactions = AppState.transactions || [];
    const dayNames = getWeekdaysShort();
    
    const totalDays = Math.round((end - start) / 86400000) + 1;
    const dailyData = [];
    let maxTotal = 0;
    
    for (let i = 0; i < totalDays; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const dateStr = formatDate(date);
        
        const dayTrans = transactions.filter(t => t.date === dateStr);
        const income = dayTrans.filter(t => t.type === 'income').reduce((s, t) => s + (t.value || 0), 0);
        const expense = dayTrans.filter(t => t.type === 'expense').reduce((s, t) => s + (t.value || 0), 0);
        const total = income + expense;
        
        if (total > maxTotal) maxTotal = total;
        
        dailyData.push({
            date: dateStr,
            day: date.getDate(),
            weekday: dayNames[date.getDay()],
            income,
            expense,
            isToday: dateStr === todayStr
        });
    }
    
    if (dailyData.length === 0) {
        grid.innerHTML = '<div class="fin-empty-state"><i class="fa-solid fa-calendar-xmark"></i><p>Sem dados no período</p></div>';
        return;
    }
    
    grid.innerHTML = dailyData.map(d => {
        const incomeWidth = maxTotal > 0 ? (d.income / maxTotal) * 100 : 0;
        const expenseWidth = maxTotal > 0 ? (d.expense / maxTotal) * 100 : 0;
        
        return `<div class="fin-daily-row ${d.isToday ? 'today' : ''}">
            <div class="fin-daily-date">
                <span class="fin-daily-day">${String(d.day).padStart(2, '0')}</span>
                <span class="fin-daily-weekday">${d.weekday}</span>
            </div>
            <div class="fin-daily-bar-wrap">
                <div class="fin-daily-bar income" style="width: ${incomeWidth}%"></div>
                <div class="fin-daily-bar expense" style="width: ${expenseWidth}%"></div>
            </div>
            <div class="fin-daily-values">
                <span class="fin-daily-income">${d.income > 0 ? '+' + formatBRLShort(d.income) : '-'}</span>
                ${d.expense > 0 ? `<span class="fin-daily-expense">-${formatBRLShort(d.expense)}</span>` : ''}
            </div>
        </div>`;
    }).join('');
}

function renderFinTopTransactions(transactions) {
    const container = document.getElementById('finTopTransactions');
    if (!container) return;
    
    // Sort by value desc and take top 6
    const sorted = [...transactions].sort((a, b) => (b.value || 0) - (a.value || 0)).slice(0, 6);
    
    if (sorted.length === 0) {
        container.innerHTML = '<div class="stats-empty">Sem movimentações</div>';
        return;
    }
    
    container.innerHTML = sorted.map(t => {
        const icon = t.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down';
        const signal = t.type === 'income' ? '+' : '-';
        
        return `<div class="top-item">
            <div class="fin-transaction-icon ${t.type}">
                <i class="fa-solid ${icon}"></i>
            </div>
            <div class="fin-transaction-info">
                <div class="fin-transaction-desc">${t.description || 'Movimentação'}</div>
                <div class="fin-transaction-date">${formatDateBR(t.date)}</div>
            </div>
            <div class="fin-transaction-value ${t.type}">${signal} ${formatBRL(t.value)}</div>
        </div>`;
    }).join('');
}

function renderFinSummary(totalIncome, totalExpense, balance, transactionCount, uniqueDays) {
    const container = document.getElementById('finSummaryRows');
    if (!container) return;
    
    const avgTicket = transactionCount > 0 ? totalIncome / transactionCount : 0;
    
    container.innerHTML = `
        <div class="summary-row">
            <span class="summary-label"><i class="fa-solid fa-arrow-up"></i> Total Entradas</span>
            <span class="summary-value income">${formatBRL(totalIncome)}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label"><i class="fa-solid fa-arrow-down"></i> Total Saídas</span>
            <span class="summary-value expense">${formatBRL(totalExpense)}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label"><i class="fa-solid fa-wallet"></i> Saldo</span>
            <span class="summary-value balance" style="color: ${balance >= 0 ? '#64b4ff' : '#ff6b6b'}">${formatBRL(balance)}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label"><i class="fa-solid fa-receipt"></i> Transações</span>
            <span class="summary-value">${transactionCount}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label"><i class="fa-solid fa-ticket"></i> Ticket Médio</span>
            <span class="summary-value">${formatBRL(avgTicket)}</span>
        </div>
    `;
}

// =============================================
// BACKUP & RESTORE
// =============================================

function downloadBackup() {
    try {
        const backupData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            data: {
                transactions: AppState.transactions || [],
                services: AppState.services || [],
                products: AppState.products || [],
                clientNotes: AppState.clientNotes || {},
                clientData: AppState.clientData || {},
                cardFees: loadCardFees()
            }
        };
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const dateStr = new Date().toISOString().split('T')[0];
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `nexus-backup-${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Backup baixado com sucesso!', 'success');
    } catch (e) {
        console.error('Erro ao criar backup:', e);
        showToast('Erro ao criar backup', 'error');
    }
}

function triggerRestoreBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const backupData = JSON.parse(text);
            
            if (!backupData.version || !backupData.data) {
                showToast('Arquivo de backup inválido', 'error');
                return;
            }
            
            if (!confirm('Restaurar backup irá SUBSTITUIR os dados atuais. Continuar?')) {
                return;
            }
            
            // Restore data
            if (backupData.data.transactions) {
                AppState.transactions = backupData.data.transactions;
                saveTransactionsToStorage();
            }
            
            if (backupData.data.services) {
                AppState.services = backupData.data.services;
                saveServicesToStorage();
            }
            
            if (backupData.data.products) {
                AppState.products = backupData.data.products;
                saveProductsToStorage();
            }
            
            if (backupData.data.clientNotes) {
                AppState.clientNotes = backupData.data.clientNotes;
            }
            
            if (backupData.data.clientData) {
                AppState.clientData = backupData.data.clientData;
            }
            
            if (backupData.data.cardFees) {
                saveCardFees(backupData.data.cardFees);
            }
            
            saveConfig();
            
            const exportDate = new Date(backupData.exportedAt).toLocaleDateString('pt-BR');
            showToast(`Backup de ${exportDate} restaurado!`, 'success');
            
            // Refresh screens
            renderCashier();
            renderServices();
            renderProducts();
            
        } catch (e) {
            console.error('Erro ao restaurar backup:', e);
            showToast('Erro ao ler arquivo de backup', 'error');
        }
    };
    input.click();
}

// =============================================
// MODAL BUSY HELPERS
// =============================================

function setModalBusy(modalId, busy) {
    const modal = document.getElementById(modalId);
    if (modal) {
        if (busy) {
            modal.classList.add('modal-busy');
        } else {
            modal.classList.remove('modal-busy');
        }
    }
}

// Application loaded
// console.log('Nexus PRO Web - Sistema completo carregado');
