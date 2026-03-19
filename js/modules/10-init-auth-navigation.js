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
    if (userNameEl) userNameEl.textContent = AppState.currentUser?.name || 'UsuÃ¡rio';
    if (userRoleEl) userRoleEl.textContent = AppState.currentUser?.isAdmin ? 'Administrador' : (isVisitor() ? 'Visitante' : 'Profissional');
    
    const settingsDbInput = document.getElementById('settingsDbUrl');
    const accountUserName = document.getElementById('accountUserName');
    const accountUserRole = document.getElementById('accountUserRole');
    
    if (settingsDbInput) settingsDbInput.value = AppState.dbUrl || '';
    if (accountUserName) accountUserName.textContent = AppState.currentUser?.name || 'UsuÃ¡rio';
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
            
            // Backend is the source of truth â€” rebuild knownClients from scratch
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
            // console.warn('[Clientes] Backend nÃ£o retornou clientes:', result.err || 'sem campo clientes');
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
