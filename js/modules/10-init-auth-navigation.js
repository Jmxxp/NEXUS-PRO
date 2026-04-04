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
    // Garantir que a URL termina em /exec
    let cleanUrl = url.trim();
    if (cleanUrl.endsWith('/')) {
        cleanUrl = cleanUrl.slice(0, -1);
    }
    if (!cleanUrl.endsWith('/exec')) {
        // Se tem /dev no final, substituir por /exec
        if (cleanUrl.endsWith('/dev')) {
            cleanUrl = cleanUrl.replace(/\/dev$/, '/exec');
        } else if (!cleanUrl.includes('/exec')) {
            cleanUrl = cleanUrl + '/exec';
        }
    }
    
    AppState.dbUrl = cleanUrl;
    console.log('[Conexão] Tentando URL:', cleanUrl);
    
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
            // Normalizar dados para garantir que almocoInicio/almocoFim existam
            AppState.agendadores = pingResult.agendadores.map(ag => ({
                ...ag,
                almocoInicio: ag.almocoInicio || ag.almoco_inicio || '',
                almocoFim: ag.almocoFim || ag.almoco_fim || '',
                bloqueado: ag.bloqueado || ag.agenda_bloqueada || false
            }));
            console.log('[DEBUG] Agendadores from ping (normalized):', JSON.stringify(AppState.agendadores.map(a => ({ nome: a.nome, almocoInicio: a.almocoInicio, almocoFim: a.almocoFim }))));
        } else {
            const agResult = await DB.agendadores();
            if (agResult.ok && agResult.data && agResult.data.length > 0) {
                AppState.agendadores = agResult.data.map(ag => ({
                    ...ag,
                    almocoInicio: ag.almocoInicio || ag.almoco_inicio || '',
                    almocoFim: ag.almocoFim || ag.almoco_fim || '',
                    bloqueado: ag.bloqueado || ag.agenda_bloqueada || false
                }));
            } else {
                AppState.agendadores = [];
                showToast(t('schedulerNotFound'), 'error');
            }
        }
        
        if (pingResult.horarios) {
            AppState.horarios = pingResult.horarios;
            // Normalizar sábado para horário completo se estiver reduzido
            if (AppState.horarios.sabado && AppState.horarios.sabado.fecha === '12:00') {
                AppState.horarios.sabado.fecha = '18:00';
            }
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
        const ag = result.agendador || result.user;
        AppState.currentUser = { 
            id: ag.id,
            name: ag.nome || ag.name,
            isAdmin: ag.isAdmin === true
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
    
    // Atualizar visibilidade de navegação baseado em permissões
    updateNavPermissions();
    
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
    if (typeof renderAdminAgendadoresSection === 'function') {
        renderAdminAgendadoresSection();
    }
    if (typeof renderBusinessHoursSection === 'function') {
        renderBusinessHoursSection();
    }
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
        
        // Carregar serviços, produtos e transações do backend
        // E verificar se o script suporta v4.0
        const [servResult, prodResult, cashResult] = await Promise.all([
            loadServicesFromBackend(),
            loadProductsFromBackend(),
            loadTransactionsFromBackend()
        ]);
        
        // Verificar versão do script (usa ação legada para compatibilidade)
        const serviceTestResult = await DB.serviceList();
        if (!serviceTestResult.ok) {
            const errMsg = serviceTestResult.err || '';
            const scriptDesatualizado = errMsg.includes('desconhecida') || 
                                         errMsg.includes('unknown') ||
                                         errMsg.includes('listarServicos') ||
                                         errMsg.includes('undefined');
            
            if (scriptDesatualizado) {
                console.error('');
                console.error('╔══════════════════════════════════════════════════════════════╗');
                console.error('║  ❌ SCRIPT DESATUALIZADO NO GOOGLE SHEETS!                   ║');
                console.error('╠══════════════════════════════════════════════════════════════╣');
                console.error('║  O script atual não suporta serviços, produtos e caixa.      ║');
                console.error('║  GERE UM NOVO SCRIPT v4.0 E SUBSTITUA NO GOOGLE APPS SCRIPT  ║');
                console.error('╚══════════════════════════════════════════════════════════════╝');
                console.error('');
                
                // Mostrar modal com opção de copiar script atualizado
                showScriptUpdateModal();
            }
        }
        
    } catch (e) {
        console.error('loadAllData error:', e);
        AppState.appointments = [];
    }
    
    extractClients();
    renderAll();
}

function showScriptUpdateModal() {
    const existingModal = document.getElementById('script-update-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'script-update-modal';
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;" onclick="event.stopPropagation()">
            <div class="modal-header">
                <h2 style="color: #ff6b6b;"><i class="fa-solid fa-triangle-exclamation"></i> Script Desatualizado!</h2>
            </div>
            <div class="modal-body" style="text-align: left; padding: 20px;">
                <p style="margin-bottom: 15px; font-size: 14px; color: #ccc;">
                    O script no Google Sheets é de uma <strong>versão antiga</strong> que não suporta:
                </p>
                <ul style="margin-left: 20px; margin-bottom: 20px; color: #999;">
                    <li>❌ Serviços</li>
                    <li>❌ Produtos</li>
                    <li>❌ Caixa/Financeiro</li>
                </ul>
                <p style="margin-bottom: 20px; font-size: 14px; color: #64b4ff;">
                    <strong>Solução:</strong> Copie o script v4.0 e substitua no Google Apps Script.
                </p>
                
                <div style="background: #1a1a2e; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                    <strong style="color: #fff;">Passos:</strong>
                    <ol style="margin-top: 10px; margin-left: 20px; color: #aaa; line-height: 1.8;">
                        <li>Clique em <strong style="color: #64b4ff;">COPIAR SCRIPT v4.0</strong></li>
                        <li>Vá no Google Apps Script da sua planilha</li>
                        <li><strong style="color: #ff6b6b;">Apague TODO</strong> o código antigo</li>
                        <li>Cole o novo código (Ctrl+V)</li>
                        <li>Salve (Ctrl+S)</li>
                        <li>Implantar → <strong>Nova implantação</strong></li>
                        <li>Use a <strong>NOVA URL</strong> gerada</li>
                    </ol>
                </div>
            </div>
            <div class="modal-footer" style="display: flex; gap: 10px; justify-content: flex-end; padding: 15px 20px; border-top: 1px solid #2a2a3e;">
                <button class="btn-secondary" onclick="document.getElementById('script-update-modal').remove()">
                    Depois
                </button>
                <button class="btn-primary" onclick="copyScriptV4AndClose()">
                    <i class="fa-solid fa-copy"></i> COPIAR SCRIPT v4.0
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function copyScriptV4AndClose() {
    // Carregar config do script builder
    if (typeof loadScriptBuilderConfig === 'function') {
        loadScriptBuilderConfig();
    }
    
    // Verificar se tem admin configurado
    let admin = ScriptBuilderState?.agendadores?.find(ag => ag.isAdmin);
    
    // Se não tem admin ou senha, tentar importar do sistema conectado
    if ((!admin || !admin.senha) && AppState.agendadores && AppState.agendadores.length > 0) {
        console.log('[Script Update] Importando configuração do sistema conectado...');
        
        // Criar config baseada nos agendadores atuais
        ScriptBuilderState = {
            nextId: 1,
            diaAtual: 0,
            agendadores: AppState.agendadores.map((ag, i) => ({
                id: ag.isAdmin ? 'admin' : (ag.id || i + 1),
                nome: ag.nome || ag.name || 'Agendador ' + (i + 1),
                senha: ag.senha || '',
                isAdmin: !!ag.isAdmin
            })),
            horarios: AppState.horarios || {
                segunda: { abre: '08:00', fecha: '18:00' },
                terca: { abre: '08:00', fecha: '18:00' },
                quarta: { abre: '08:00', fecha: '18:00' },
                quinta: { abre: '08:00', fecha: '18:00' },
                sexta: { abre: '08:00', fecha: '18:00' },
                sabado: { abre: '08:00', fecha: '18:00' },
                domingo: { abre: '00:00', fecha: '00:00' }
            }
        };
        
        // Garantir que tem admin
        admin = ScriptBuilderState.agendadores.find(ag => ag.isAdmin);
        if (!admin) {
            admin = { id: 'admin', nome: 'Admin', senha: '123456', isAdmin: true };
            ScriptBuilderState.agendadores.unshift(admin);
        }
        
        // Se admin não tem senha, dar uma temporária
        if (!admin.senha) {
            admin.senha = '123456';
            showToast('Senha temporária do admin: 123456 - ALTERE depois!', 'warning');
        }
        
        if (typeof saveScriptBuilderConfig === 'function') {
            saveScriptBuilderConfig();
        }
    }
    
    if (!admin || !admin.senha) {
        // Se ainda não tem admin configurado, ir pro gerador
        document.getElementById('script-update-modal').remove();
        showToast('Configure o administrador no Gerador de Script', 'info');
        switchScreen('screen-script-builder');
        return;
    }
    
    // Gerar e copiar script
    const script = buildScriptBuilderScript();
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(script)
            .then(() => {
                showToast('✅ Script v4.0 copiado! Cole no Google Apps Script.', 'success');
                document.getElementById('script-update-modal').remove();
                showScriptPasteInstructions();
            })
            .catch(() => {
                // Fallback
                copyTextFallback(script);
            });
    } else {
        copyTextFallback(script);
    }
}

function copyTextFallback(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast('✅ Script v4.0 copiado!', 'success');
    document.getElementById('script-update-modal').remove();
    showScriptPasteInstructions();
}

function showScriptPasteInstructions() {
    const modal = document.createElement('div');
    modal.id = 'script-paste-instructions';
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 450px;" onclick="event.stopPropagation()">
            <div class="modal-header">
                <h2 style="color: #64b4ff;"><i class="fa-solid fa-check-circle"></i> Script Copiado!</h2>
            </div>
            <div class="modal-body" style="text-align: center; padding: 30px;">
                <div style="font-size: 48px; margin-bottom: 20px;">📋</div>
                <p style="font-size: 16px; color: #fff; margin-bottom: 20px;">
                    Agora vá no <strong>Google Apps Script</strong>:
                </p>
                <ol style="text-align: left; margin: 0 auto; max-width: 320px; line-height: 2; color: #ccc;">
                    <li>Apague <strong style="color: #ff6b6b;">TODO</strong> o código antigo</li>
                    <li>Cole o novo (Ctrl+V)</li>
                    <li>Salve (Ctrl+S)</li>
                    <li>Implantar → Nova implantação</li>
                    <li>Configure a nova URL aqui</li>
                </ol>
            </div>
            <div class="modal-footer" style="justify-content: center; padding: 15px;">
                <button class="btn-primary" onclick="document.getElementById('script-paste-instructions').remove()">
                    <i class="fa-solid fa-thumbs-up"></i> Entendi!
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
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
            // ⚠️ CRÍTICO: Limpar dados se falha para não mostrar dados de outro backend!
            console.warn('[Clientes] Backend não retornou clientes:', result.err || 'sem campo clientes');
            AppState.knownClients = new Map();
            AppState.clients = [];
            AppState.clientData = {};
        }
        // Debug: console.log('[Clientes] Total no knownClients:', AppState.knownClients.size);
    } catch (e) {
        console.error('[Clientes] Erro ao carregar:', e);
        // ⚠️ CRÍTICO: Limpar dados em caso de erro de conexão!
        AppState.knownClients = new Map();
        AppState.clients = [];
        AppState.clientData = {};
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
    // Não limpar connected, agendadores e horários - são dados do sistema
    // Assim o usuário pode fazer login com outro profissional sem reconectar
    AppState.appointments = [];
    AppState.clients = [];
    // Reset flags de carregamento para recarregar do backend quando logar
    AppState._servicesLoaded = false;
    AppState._productsLoaded = false;
    AppState._transactionsLoaded = false;
    
    localStorage.removeItem('nexus_credentials');
    
    document.querySelector('.app-container').style.display = 'none';
    showLoginScreen();
    
    showToast(t('logoutDone'), 'info');
}

// Atualiza visibilidade dos itens de navegação baseado nas permissões do usuário
function updateNavPermissions() {
    const isAdmin = AppState.currentUser?.isAdmin;
    
    // Telas restritas só para admin
    const restrictedScreens = ['screen-services', 'screen-products', 'screen-cashier'];
    
    restrictedScreens.forEach(screenId => {
        const navItem = document.querySelector(`.nav-item[data-screen="${screenId}"]`);
        if (navItem) {
            navItem.style.display = isAdmin ? '' : 'none';
        }
    });
    
    // Pílula de modo das estatísticas - esconder inteira se não é admin (só tem uma opção)
    const statsModePill = document.querySelector('.stats-mode-pill');
    if (statsModePill) {
        statsModePill.style.display = isAdmin ? '' : 'none';
    }
    
    // Se não é admin e está na view financeiro, mudar para desempenho
    if (!isAdmin) {
        const finView = document.getElementById('statsViewFinanceiro');
        const desView = document.getElementById('statsViewDesempenho');
        if (finView && finView.style.display !== 'none') {
            finView.style.display = 'none';
            if (desView) desView.style.display = 'block';
            // Atualizar botões ativos
            document.querySelectorAll('.stats-mode-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === 'desempenho');
            });
        }
    }
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
    // Verificar permissão para telas restritas (só admin)
    const isAdmin = AppState.currentUser?.isAdmin;
    const restrictedScreens = ['screen-services', 'screen-products', 'screen-cashier'];
    
    if (!isAdmin && restrictedScreens.includes(screenId)) {
        showToast('Acesso restrito ao administrador', 'error');
        return;
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
    if (screenId === 'screen-calendar') {
        renderCalendar();
        if (typeof renderMobileMiniCalendar === 'function') {
            renderMobileMiniCalendar();
        }
    }
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
    if (screenId === 'screen-settings') {
        // Renderiza a seção de admin usando os dados já carregados
        if (typeof renderAdminAgendadoresSection === 'function') {
            renderAdminAgendadoresSection();
        }
        // Renderiza a seção de horário de funcionamento
        if (typeof renderBusinessHoursSection === 'function') {
            renderBusinessHoursSection();
        }
    }
}

// =============================================
