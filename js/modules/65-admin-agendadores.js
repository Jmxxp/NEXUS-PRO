// =============================================
// ADMIN - GESTÃO DE AGENDADORES
// =============================================

// Permissões padrão para novos agendadores
const DEFAULT_PERMISSIONS = {
    agenda: true,
    clientes: true,
    retorno: true,
    servicos: false,
    produtos: false,
    caixa: false,
    comissoes: false,
    estatisticas: true,
    configuracoes: false,
    backups: false
};

const ADMIN_PERMISSIONS = {
    agenda: true,
    clientes: true,
    retorno: true,
    servicos: true,
    produtos: true,
    caixa: true,
    comissoes: true,
    estatisticas: true,
    configuracoes: true,
    backups: true
};

// Helper: Extrai HH:mm de uma string de horário (aceita "HH:mm" ou Date string)
function parseTimeToHHMM(value) {
    if (!value) return '';
    
    // Se já está no formato HH:mm, retorna direto
    if (/^\d{2}:\d{2}$/.test(value)) return value;
    
    // Se for uma string de Date (ex: "Sat Dec 30 1899 11:00:00 GMT...")
    if (typeof value === 'string' && value.includes(':')) {
        // Tenta extrair HH:mm:ss da string
        const match = value.match(/(\d{2}):(\d{2}):\d{2}/);
        if (match) {
            return `${match[1]}:${match[2]}`;
        }
    }
    
    // Se for um objeto Date
    if (value instanceof Date) {
        const h = String(value.getHours()).padStart(2, '0');
        const m = String(value.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    }
    
    return '';
}

const PERMISSION_LABELS = {
    agenda: { label: 'Agenda', icon: 'fa-calendar-days' },
    clientes: { label: 'Clientes', icon: 'fa-users' },
    retorno: { label: 'Retorno', icon: 'fa-rotate-left' },
    servicos: { label: 'Serviços', icon: 'fa-scissors' },
    produtos: { label: 'Produtos', icon: 'fa-box' },
    caixa: { label: 'Caixa', icon: 'fa-dollar-sign' },
    comissoes: { label: 'Comissões', icon: 'fa-hand-holding-dollar' },
    estatisticas: { label: 'Estatísticas', icon: 'fa-chart-line' },
    configuracoes: { label: 'Configurações', icon: 'fa-gear' },
    backups: { label: 'Backups', icon: 'fa-cloud-arrow-up' }
};

// ===== API METHODS =====

const AgendadorAPI = {
    async list() {
        return DB._req('agendadores');
    },
    
    async get(id) {
        const result = await DB._req('agendadorGet', { id });
        if (result.err && result.err.includes('desconhecida')) {
            console.error('[AgendadorAPI] Backend desatualizado! Regenere o script em Configurações → Criador de Script');
            showToast('BACKEND DESATUALIZADO! Regenere o script em Configurações → Criador de Script', 'error', 10000);
        }
        return result;
    },
    
    async create(data) {
        return DB._req('agendadorCreate', data);
    },
    
    async update(data) {
        const result = await DB._req('agendadorUpdate', data);
        if (result.err && result.err.includes('desconhecida')) {
            console.error('[AgendadorAPI] Backend desatualizado! Regenere o script em Configurações → Criador de Script');
            showToast('BACKEND DESATUALIZADO! Regenere o script em Configurações → Criador de Script', 'error', 10000);
        }
        return result;
    },
    
    async delete(id) {
        return DB._req('agendadorDelete', { id });
    },
    
    async updatePassword(id, novaSenha, senhaAtual, isAdmin) {
        return DB._req('agendadorUpdatePassword', { id, novaSenha, senhaAtual, isAdmin });
    },
    
    async updatePermissions(id, permissoes) {
        return DB._req('agendadorUpdatePermissions', { id, permissoes });
    },
    
    async updateSchedule(id, data) {
        return DB._req('agendadorUpdateSchedule', { id, ...data });
    },
    
    async updateCommission(id, comissao_servicos, comissao_produtos) {
        return DB._req('agendadorUpdateCommission', { id, comissao_servicos, comissao_produtos });
    },
    
    async toggleBlock(id, bloqueado) {
        return DB._req('agendadorToggleBlock', { id, bloqueado });
    }
};

// ===== RENDER AGENDADORES LIST =====

function renderAdminAgendadoresSection() {
    const container = document.getElementById('adminAgendadoresSection');
    if (!container) return;
    
    // Só admin pode ver esta seção
    if (!AppState.currentUser?.isAdmin) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    
    // Usa os mesmos dados que renderProfessionalsConfig usa
    const agendadores = AppState.agendadores || [];
    
    if (!agendadores || agendadores.length === 0) {
        container.innerHTML = `
            <div class="settings-section admin-section-premium">
                <div class="admin-section-header">
                    <div class="admin-section-title">
                        <div class="admin-section-icon">
                            <i class="fa-solid fa-users-gear"></i>
                        </div>
                        <div>
                            <h3>Gestão de Agendadores</h3>
                            <span class="admin-section-subtitle">Gerencie os profissionais do sistema</span>
                        </div>
                    </div>
                </div>
                <div class="admin-agendadores-empty">
                    <div class="empty-icon"><i class="fa-solid fa-user-slash"></i></div>
                    <p>Nenhum agendador cadastrado</p>
                    <button class="btn-primary-gradient" onclick="openNewAgendadorModal()">
                        <i class="fa-solid fa-user-plus"></i> Criar Primeiro Agendador
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    const html = `
        <div class="settings-section admin-section-premium">
            <div class="admin-section-header">
                <div class="admin-section-title">
                    <div class="admin-section-icon">
                        <i class="fa-solid fa-users-gear"></i>
                    </div>
                    <div>
                        <h3>Gestão de Agendadores</h3>
                        <span class="admin-section-subtitle">${agendadores.length} profissional(is) cadastrado(s)</span>
                    </div>
                </div>
                <button class="btn-add-professional" onclick="openNewAgendadorModal()">
                    <i class="fa-solid fa-user-plus"></i>
                    <span>Novo</span>
                </button>
            </div>
            <div class="admin-agendadores-grid" id="adminAgendadoresList">
                ${agendadores.map(ag => renderAgendadorItem(ag)).join('')}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderAgendadorItem(ag) {
    const initials = (ag.nome || 'AG').substring(0, 2).toUpperCase();
    const isAdmin = ag.isAdmin === true;
    const bloqueado = ag.bloqueado || ag.agenda_bloqueada;
    const status = ag.status || 'ativo';
    const statusClass = status === 'inativo' ? 'inactive' : '';
    
    // Badges de status
    let badges = '';
    if (bloqueado) {
        badges += '<span class="agendador-badge blocked"><i class="fa-solid fa-lock"></i></span>';
    }
    if (status === 'inativo') {
        badges += '<span class="agendador-badge inactive"><i class="fa-solid fa-moon"></i></span>';
    }
    
    return `
        <div class="admin-agendador-card ${statusClass} ${isAdmin ? 'is-admin' : ''}" data-agendador-id="${ag.id}">
            <div class="agendador-card-header">
                <div class="agendador-avatar-lg ${isAdmin ? 'admin' : ''}">
                    ${isAdmin ? '<i class="fa-solid fa-shield-halved"></i>' : initials}
                </div>
                <div class="agendador-badges">${badges}</div>
            </div>
            <div class="agendador-card-body">
                <span class="agendador-card-name">${ag.nome || 'Sem nome'}</span>
                <span class="agendador-card-role">${isAdmin ? 'Administrador' : 'Profissional'}</span>
            </div>
            <div class="agendador-card-actions">
                <button class="btn-card-action edit" onclick="openEditAgendadorModal('${ag.id}')" title="Editar">
                    <i class="fa-solid fa-pen"></i>
                </button>
                ${!isAdmin ? `
                    <button class="btn-card-action delete" onclick="confirmDeleteAgendador('${ag.id}', '${ag.nome}')" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

// ===== MODALS =====

function openNewAgendadorModal() {
    if (!AppState.currentUser?.isAdmin) {
        showToast('Apenas administradores podem criar agendadores', 'error');
        return;
    }
    
    const html = `
        <div class="modal-content modal-lg">
            <div class="modal-header">
                <h2 class="modal-title">
                    <i class="fa-solid fa-user-plus"></i> Novo Agendador
                </h2>
                <button class="btn-close" onclick="closeModal('agendadorModal')">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Nome *</label>
                    <input type="text" id="agendadorNome" class="form-input" placeholder="Nome do agendador">
                </div>
                <div class="form-group">
                    <label>Senha *</label>
                    <div class="input-password-wrap">
                        <input type="password" id="agendadorSenha" class="form-input" placeholder="Senha de acesso">
                        <button type="button" class="btn-toggle-password" onclick="togglePasswordVisibility('agendadorSenha', this)">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="form-section-title"><i class="fa-solid fa-briefcase"></i> Expediente</div>
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fa-solid fa-right-to-bracket"></i> Entrada</label>
                        <input type="time" id="agendadorHoraInicio" class="form-input" value="08:00">
                    </div>
                    <div class="form-group">
                        <label><i class="fa-solid fa-right-from-bracket"></i> Saída</label>
                        <input type="time" id="agendadorHoraFim" class="form-input" value="18:00">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fa-solid fa-utensils"></i> Almoço Início</label>
                        <input type="time" id="agendadorAlmocoInicio" class="form-input" value="">
                    </div>
                    <div class="form-group">
                        <label><i class="fa-solid fa-utensils"></i> Almoço Fim</label>
                        <input type="time" id="agendadorAlmocoFim" class="form-input" value="">
                    </div>
                </div>
                
                <div class="form-section-title">Comissões</div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Comissão Serviços (%)</label>
                        <input type="number" id="agendadorComissaoServicos" class="form-input" value="0" min="0" max="100">
                    </div>
                    <div class="form-group">
                        <label>Comissão Produtos (%)</label>
                        <input type="number" id="agendadorComissaoProdutos" class="form-input" value="0" min="0" max="100">
                    </div>
                </div>
                
                <div class="form-section-title">Permissões de Acesso</div>
                <div class="permissions-grid" id="permissionsGrid">
                    ${renderPermissionsCheckboxes(DEFAULT_PERMISSIONS)}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal('agendadorModal')">Cancelar</button>
                <button class="btn-primary" onclick="saveNewAgendador()">
                    <i class="fa-solid fa-check"></i> Criar Agendador
                </button>
            </div>
        </div>
    `;
    
    showAgendadorModal(html);
}

async function openEditAgendadorModal(id) {
    if (!AppState.currentUser?.isAdmin) {
        showToast('Apenas administradores podem editar agendadores', 'error');
        return;
    }
    
    showToast('Carregando dados...', 'info');
    
    // Tentar buscar do backend
    let result = await AgendadorAPI.get(id);
    console.log('[DEBUG] openEditAgendadorModal - resultado get:', JSON.stringify(result));
    
    // Se falhar (backend antigo), usar dados do AppState
    if (!result.ok) {
        const localAg = AppState.agendadores.find(a => String(a.id) === String(id));
        if (localAg) {
            console.log('[DEBUG] Usando dados locais do AppState');
            result = { 
                ok: true, 
                agendador: {
                    ...localAg,
                    almoco_inicio: localAg.almocoInicio || localAg.almoco_inicio || '',
                    almoco_fim: localAg.almocoFim || localAg.almoco_fim || ''
                }
            };
        } else {
            showToast(result.error || result.err || 'Erro ao carregar agendador', 'error');
            return;
        }
    }
    
    const ag = result.agendador;
    console.log('[DEBUG] openEditAgendadorModal - agendador:', JSON.stringify({ id: ag.id, nome: ag.nome, almoco_inicio: ag.almoco_inicio, almocoInicio: ag.almocoInicio }));
    const isAdminUser = ag.isAdmin === true;
    const permissoes = ag.permissoes || (isAdminUser ? ADMIN_PERMISSIONS : DEFAULT_PERMISSIONS);
    
    const html = `
        <div class="modal-content modal-lg">
            <div class="modal-header">
                <h2 class="modal-title">
                    <i class="fa-solid fa-user-pen"></i> Editar Agendador
                </h2>
                <button class="btn-close" onclick="closeModal('agendadorModal')">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="agendadorId" value="${ag.id}">
                
                <div class="form-group">
                    <label>Nome *</label>
                    <input type="text" id="agendadorNome" class="form-input" value="${ag.nome || ''}">
                </div>
                
                <div class="form-group">
                    <label>Status</label>
                    <div class="custom-select-wrap">
                        <select id="agendadorStatus" class="form-input form-select" ${isAdminUser && ag.id === 'admin' ? 'disabled' : ''}>
                            <option value="ativo" ${ag.status === 'ativo' ? 'selected' : ''}>✓ Ativo</option>
                            <option value="inativo" ${ag.status === 'inativo' ? 'selected' : ''}>✗ Inativo</option>
                        </select>
                        <i class="fa-solid fa-chevron-down select-arrow"></i>
                    </div>
                    <span class="form-hint">Usuários inativos não podem fazer login no sistema</span>
                </div>
                
                <div class="form-group">
                    <label>Nova Senha (deixe em branco para manter)</label>
                    <div class="input-password-wrap">
                        <input type="password" id="agendadorNovaSenha" class="form-input" placeholder="Nova senha">
                        <button type="button" class="btn-toggle-password" onclick="togglePasswordVisibility('agendadorNovaSenha', this)">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="form-section-title"><i class="fa-solid fa-briefcase"></i> Expediente</div>
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fa-solid fa-right-to-bracket"></i> Entrada</label>
                        <input type="time" id="agendadorHoraInicio" class="form-input" value="${parseTimeToHHMM(ag.hora_inicio) || '08:00'}">
                    </div>
                    <div class="form-group">
                        <label><i class="fa-solid fa-right-from-bracket"></i> Saída</label>
                        <input type="time" id="agendadorHoraFim" class="form-input" value="${parseTimeToHHMM(ag.hora_fim) || '18:00'}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fa-solid fa-utensils"></i> Almoço Início</label>
                        <input type="time" id="agendadorAlmocoInicio" class="form-input" value="${parseTimeToHHMM(ag.almocoInicio || ag.almoco_inicio)}">
                    </div>
                    <div class="form-group">
                        <label><i class="fa-solid fa-utensils"></i> Almoço Fim</label>
                        <input type="time" id="agendadorAlmocoFim" class="form-input" value="${parseTimeToHHMM(ag.almocoFim || ag.almoco_fim)}">
                    </div>
                </div>
                
                <div class="toggle-block-row">
                    <div class="toggle-block-info">
                        <i class="fa-solid fa-ban"></i>
                        <div>
                            <span class="toggle-block-label">Bloquear agenda</span>
                            <span class="toggle-block-hint">Não aceita novos agendamentos</span>
                        </div>
                    </div>
                    <label class="toggle-switch-danger">
                        <input type="checkbox" id="agendadorAgendaBloqueada" ${ag.agenda_bloqueada ? 'checked' : ''}>
                        <span class="toggle-slider-danger"></span>
                    </label>
                </div>
                
                <div class="form-section-title">Comissões</div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Comissão Serviços (%)</label>
                        <input type="number" id="agendadorComissaoServicos" class="form-input" value="${ag.comissao_servicos || 0}" min="0" max="100">
                    </div>
                    <div class="form-group">
                        <label>Comissão Produtos (%)</label>
                        <input type="number" id="agendadorComissaoProdutos" class="form-input" value="${ag.comissao_produtos || 0}" min="0" max="100">
                    </div>
                </div>
                
                <div class="form-section-title">Permissões de Acesso</div>
                <div class="permissions-grid" id="permissionsGrid">
                    ${renderPermissionsCheckboxes(permissoes, isAdminUser)}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal('agendadorModal')">Cancelar</button>
                <button class="btn-primary" onclick="saveEditAgendador()">
                    <i class="fa-solid fa-check"></i> Salvar Alterações
                </button>
            </div>
        </div>
    `;
    
    showAgendadorModal(html);
}

function renderPermissionsCheckboxes(permissoes, isAdmin = false) {
    return Object.entries(PERMISSION_LABELS).map(([key, config]) => {
        const checked = permissoes[key] === true;
        const disabled = isAdmin ? 'disabled' : '';
        const label = config.label || config;
        const icon = config.icon || '';
        return `
            <label class="permission-item ${checked ? 'active' : ''}">
                <input type="checkbox" name="perm_${key}" ${checked ? 'checked' : ''} ${disabled}
                       onchange="this.closest('.permission-item').classList.toggle('active', this.checked)">
                <i class="fa-solid ${icon}"></i>
                <span>${label}</span>
            </label>
        `;
    }).join('');
}

function showAgendadorModal(html) {
    let modal = document.getElementById('agendadorModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'agendadorModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }
    modal.innerHTML = html;
    modal.classList.add('active');
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
}

// ===== SAVE FUNCTIONS =====

async function saveNewAgendador() {
    const nome = document.getElementById('agendadorNome')?.value?.trim();
    const senha = document.getElementById('agendadorSenha')?.value;
    
    if (!nome) {
        showToast('Nome é obrigatório', 'error');
        return;
    }
    
    if (!senha) {
        showToast('Senha é obrigatória', 'error');
        return;
    }
    
    // Coletar permissões
    const permissoes = {};
    Object.keys(PERMISSION_LABELS).forEach(key => {
        const checkbox = document.querySelector(`input[name="perm_${key}"]`);
        permissoes[key] = checkbox?.checked === true;
    });
    
    const data = {
        nome,
        senha,
        isAdmin: false,
        permissoes,
        hora_inicio: document.getElementById('agendadorHoraInicio')?.value || '08:00',
        hora_fim: document.getElementById('agendadorHoraFim')?.value || '18:00',
        almoco_inicio: document.getElementById('agendadorAlmocoInicio')?.value || '',
        almoco_fim: document.getElementById('agendadorAlmocoFim')?.value || '',
        comissao_servicos: parseInt(document.getElementById('agendadorComissaoServicos')?.value) || 0,
        comissao_produtos: parseInt(document.getElementById('agendadorComissaoProdutos')?.value) || 0
    };
    
    showToast('Criando agendador...', 'info');
    
    const result = await AgendadorAPI.create(data);
    
    if (result.ok) {
        closeModal('agendadorModal');
        showToast('Agendador criado com sucesso!', 'success');
        await refreshAgendadores();
    } else {
        showToast(result.error || 'Erro ao criar agendador', 'error');
    }
}

async function saveEditAgendador() {
    const id = document.getElementById('agendadorId')?.value;
    const nome = document.getElementById('agendadorNome')?.value?.trim();
    
    if (!id) {
        showToast('Erro: ID não encontrado', 'error');
        return;
    }
    
    // Coletar permissões
    const permissoes = {};
    Object.keys(PERMISSION_LABELS).forEach(key => {
        const checkbox = document.querySelector(`input[name="perm_${key}"]`);
        permissoes[key] = checkbox?.checked === true;
    });
    
    const data = {
        id,
        nome,
        status: document.getElementById('agendadorStatus')?.value || 'ativo',
        permissoes,
        hora_inicio: document.getElementById('agendadorHoraInicio')?.value,
        hora_fim: document.getElementById('agendadorHoraFim')?.value,
        almoco_inicio: document.getElementById('agendadorAlmocoInicio')?.value,
        almoco_fim: document.getElementById('agendadorAlmocoFim')?.value,
        agenda_bloqueada: document.getElementById('agendadorAgendaBloqueada')?.checked === true,
        comissao_servicos: parseInt(document.getElementById('agendadorComissaoServicos')?.value) || 0,
        comissao_produtos: parseInt(document.getElementById('agendadorComissaoProdutos')?.value) || 0
    };
    
    console.log('[DEBUG] saveEditAgendador - dados enviados:', JSON.stringify(data));
    showToast('Salvando alterações...', 'info');
    
    // Tentar atualizar via agendadorUpdate primeiro
    let result = await AgendadorAPI.update(data);
    console.log('[DEBUG] saveEditAgendador - resultado agendadorUpdate:', JSON.stringify(result));
    
    // Se falhou com "ação desconhecida", usar setAgendadorConfig como fallback
    if (!result.ok && result.err && result.err.includes('desconhecida')) {
        console.log('[DEBUG] Usando fallback setAgendadorConfig...');
        
        // Salvar config de almoço e bloqueio via setAgendadorConfig (que já existe)
        const configResult = await DB.setAgendadorConfig({
            agendadorId: id,
            almocoInicio: data.almoco_inicio || '',
            almocoFim: data.almoco_fim || '',
            bloqueado: data.agenda_bloqueada
        });
        
        console.log('[DEBUG] setAgendadorConfig resultado:', JSON.stringify(configResult));
        
        if (configResult.ok) {
            result = { ok: true, msg: 'Salvo via setAgendadorConfig' };
            showToast('AVISO: Backend antigo. Regenere o script para funcionalidade completa.', 'warning', 5000);
        } else {
            result = configResult;
        }
    }
    
    if (!result.ok) {
        console.error('[DEBUG] Erro ao salvar:', result);
        showToast(result.error || result.err || 'Erro ao salvar agendador', 'error');
        return;
    }
    
    // Tentar verificar se salvou corretamente (pode falhar em backend antigo)
    let verifyResult = { ok: false };
    try {
        verifyResult = await AgendadorAPI.get(id);
        console.log('[DEBUG] Verificação após salvar:', JSON.stringify({
            almoco_inicio: verifyResult.agendador?.almoco_inicio,
            almocoInicio: verifyResult.agendador?.almocoInicio,
            hora_inicio: verifyResult.agendador?.hora_inicio
        }));
    } catch(e) {
        console.log('[DEBUG] agendadorGet não disponível, atualizando local apenas');
    }
    
    // Atualizar AppState imediatamente
    const agIndex = AppState.agendadores.findIndex(a => String(a.id) === String(id));
    if (agIndex >= 0) {
        if (verifyResult.ok && verifyResult.agendador) {
            const ag = verifyResult.agendador;
            AppState.agendadores[agIndex] = {
                ...AppState.agendadores[agIndex],
                nome: ag.nome || data.nome,
                almocoInicio: ag.almoco_inicio || ag.almocoInicio || data.almoco_inicio || '',
                almocoFim: ag.almoco_fim || ag.almocoFim || data.almoco_fim || '',
                bloqueado: ag.agenda_bloqueada ?? data.agenda_bloqueada,
                agenda_bloqueada: ag.agenda_bloqueada ?? data.agenda_bloqueada,
                hora_inicio: ag.hora_inicio || data.hora_inicio,
                hora_fim: ag.hora_fim || data.hora_fim
            };
        } else {
            // Fallback: usar os dados locais que acabamos de salvar
            AppState.agendadores[agIndex] = {
                ...AppState.agendadores[agIndex],
                nome: data.nome,
                almocoInicio: data.almoco_inicio || '',
                almocoFim: data.almoco_fim || '',
                bloqueado: data.agenda_bloqueada,
                agenda_bloqueada: data.agenda_bloqueada,
                hora_inicio: data.hora_inicio,
                hora_fim: data.hora_fim
            };
        }
        console.log('[DEBUG] AppState.agendadores atualizado:', JSON.stringify(AppState.agendadores[agIndex]));
    }
    
    // Atualizar senha se informada
    const novaSenha = document.getElementById('agendadorNovaSenha')?.value;
    if (novaSenha) {
        const senhaResult = await AgendadorAPI.updatePassword(id, novaSenha, null, true);
        if (!senhaResult.ok) {
            showToast('Agendador salvo, mas erro ao atualizar senha: ' + (senhaResult.error || ''), 'warning');
        }
    }
    
    closeModal('agendadorModal');
    showToast('Agendador atualizado com sucesso!', 'success');
    await refreshAgendadores();
}

// ===== DELETE =====

function confirmDeleteAgendador(id, nome) {
    if (!AppState.currentUser?.isAdmin) {
        showToast('Apenas administradores podem excluir agendadores', 'error');
        return;
    }
    
    const html = `
        <div class="modal-content modal-sm modal-confirm">
            <div class="modal-confirm-icon danger-icon">
                <i class="fa-solid fa-user-xmark"></i>
            </div>
            <span class="modal-confirm-title">Excluir Agendador?</span>
            <p class="modal-confirm-desc">${nome}</p>
            <p class="modal-confirm-warning">Esta ação não pode ser desfeita.</p>
            <div class="modal-confirm-buttons">
                <button class="btn-secondary" onclick="closeModal('confirmDeleteAgendadorModal')">Cancelar</button>
                <button class="btn-danger" onclick="deleteAgendador('${id}')">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `;
    
    let modal = document.getElementById('confirmDeleteAgendadorModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirmDeleteAgendadorModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }
    modal.innerHTML = html;
    modal.classList.add('active');
}

async function deleteAgendador(id) {
    closeModal('confirmDeleteAgendadorModal');
    showToast('Excluindo agendador...', 'info');
    
    const result = await AgendadorAPI.delete(id);
    
    if (result.ok) {
        showToast('Agendador excluído com sucesso!', 'success');
        await refreshAgendadores();
    } else {
        showToast(result.error || 'Erro ao excluir agendador', 'error');
    }
}

// ===== REFRESH =====

async function refreshAgendadores() {
    try {
        const result = await AgendadorAPI.list();
        
        if (result.ok && Array.isArray(result.data)) {
            // Normalizar dados para garantir que almocoInicio/almocoFim existam
            AppState.agendadores = result.data.map(ag => ({
                ...ag,
                almocoInicio: ag.almocoInicio || ag.almoco_inicio || '',
                almocoFim: ag.almocoFim || ag.almoco_fim || '',
                bloqueado: ag.bloqueado || ag.agenda_bloqueada || false
            }));
            console.log('[DEBUG] refreshAgendadores - dados atualizados:', 
                AppState.agendadores.map(a => ({ nome: a.nome, almocoInicio: a.almocoInicio, almocoFim: a.almocoFim })));
        }
        // Se falhar, mantém os dados existentes em AppState.agendadores
    } catch (e) {
        console.error('[Admin] Erro ao atualizar agendadores:', e);
        // Mantém dados existentes
    }
    
    renderAdminAgendadoresSection();
    if (typeof renderProfessionalsTabs === 'function') renderProfessionalsTabs();
    if (typeof renderLoginUsers === 'function') renderLoginUsers();
    renderCalendar(); // Re-renderiza calendário para mostrar almoço
}

// ===== PERMISSION CHECKING =====

function checkPermission(module) {
    // Se não está logado, sem permissão
    if (!AppState.currentUser) return false;
    
    // Admin tem todas as permissões
    if (AppState.currentUser.isAdmin) return true;
    
    // Verificar permissão específica
    const permissoes = AppState.currentUser.permissoes || DEFAULT_PERMISSIONS;
    return permissoes[module] === true;
}

function updateNavPermissionsV2() {
    const screenPermissions = {
        'screen-calendar': 'agenda',
        'screen-clients': 'clientes',
        'screen-retorno': 'retorno',
        'screen-services': 'servicos',
        'screen-products': 'produtos',
        'screen-cashier': 'caixa',
        'screen-commission': 'comissoes',
        'screen-stats': 'estatisticas',
        'screen-settings': 'configuracoes',
        'screen-backup': 'backups'
    };
    
    Object.entries(screenPermissions).forEach(([screenId, permission]) => {
        const navItem = document.querySelector(`.nav-item[data-screen="${screenId}"]`);
        if (navItem) {
            const hasPermission = checkPermission(permission);
            navItem.style.display = hasPermission ? '' : 'none';
        }
    });
}

// Hook into the existing updateNavPermissions
const originalUpdateNavPermissions = typeof updateNavPermissions === 'function' ? updateNavPermissions : null;

window.updateNavPermissions = function() {
    // Chamar a função original se existir
    if (originalUpdateNavPermissions) {
        originalUpdateNavPermissions();
    }
    
    // Aplicar permissões detalhadas
    updateNavPermissionsV2();
}

// ===== INITIALIZE =====

document.addEventListener('DOMContentLoaded', () => {
    // Aguardar app inicializar
    setTimeout(() => {
        if (AppState.currentUser?.isAdmin) {
            renderAdminAgendadoresSection();
        }
    }, 1000);
});
