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
                        <span>AlmoÃ§o</span>
                        <input type="time" class="time-input" id="lunch-start-${ag.id}" value="${almocoInicio}">
                        <span>Ã s</span>
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
    
    // Validar que horÃ¡rio inÃ­cio < fim
    if (start && end && start >= end) {
        showToast('HorÃ¡rio de inÃ­cio deve ser antes do fim', 'error');
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
            // Prevenir fecha durante operaÃ§Ãµes async
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
    
    // Limitar a 4 toasts visÃ­veis
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
    return `${d}/${m}/${y} Ã s ${h}:${min}`;
}

function toggleEditHistory(element) {
    const historyEl = element.closest('.cashier-transaction-info').querySelector('.transaction-edit-history');
    if (historyEl) {
        historyEl.classList.toggle('visible');
    }
}

// =============================================
// SERVICES (BACKEND)
// =============================================

async function loadServicesFromBackend() {
    try {
        console.log('[Serviços] Carregando do backend...');
        const result = await DB.serviceList();
        console.log('[Serviços] Resposta:', result);
        if (result.ok && result.servicos) {
            AppState.services = result.servicos.map(s => ({
                id: s.id,
                nome: s.nome || '',
                preco: Number(s.preco) || 0,
                duracao: Number(s.duracao_minutos) || 30,
                descricao: s.descricao || '',
                icon: s.icon || 'fa-scissors',
                status: s.status || 'ativo'
            }));
            console.log('[Serviços] Carregados:', AppState.services.length);
        } else {
            console.warn('[Serviços] Backend retornou erro ou sem dados:', result.err);
        }
    } catch (e) {
        console.error('[Serviços] Erro ao carregar do backend:', e);
    }
}

async function renderServices() {
    const grid = document.getElementById('servicesGrid');
    const countEl = document.getElementById('servicesCount');
    if (!grid) return;

    // SEMPRE carrega do backend para garantir sincronização
    await loadServicesFromBackend();
    
    // Sort services alphabetically
    const services = (AppState.services || []).slice().sort((a, b) => 
        a.nome.localeCompare(b.nome, 'pt-BR')
    );
    
    if (countEl) countEl.textContent = services.length;

    if (services.length === 0) {
        grid.innerHTML = `
            <div class="premium-empty">
                <i class="fa-solid fa-scissors"></i>
                <p>Clique em + para adicionar um serviÃ§o</p>
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
    
    // Formatar preÃ§o com vÃ­rgula
    const precoFormatado = service?.preco ? service.preco.toFixed(2).replace('.', ',') : '0,00';
    
    const html = `
        <div class="modal-content" style="max-width: 420px;">
            <div class="modal-header">
                <h2><i class="fa-solid fa-scissors" style="color: #00d26a;"></i> ${isEdit ? 'Editar' : 'Novo'} ServiÃ§o</h2>
                <button class="modal-close" onclick="closeModal('serviceModal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Ãcone</label>
                    <div class="icon-picker-trigger" onclick="openIconPicker('service')">
                        <div class="icon-picker-preview service">
                            <i class="fa-solid ${currentIcon}" id="serviceIconPreview"></i>
                        </div>
                        <span class="icon-picker-text">Clique para escolher um Ã­cone</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                    <input type="hidden" id="serviceIcon" value="${currentIcon}">
                </div>
                <div class="form-group">
                    <label>Nome do ServiÃ§o</label>
                    <input type="text" id="serviceNome" class="form-input" value="${service?.nome || ''}" placeholder="Ex: Corte Masculino">
                </div>
                <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div class="form-group">
                        <label>PreÃ§o (R$)</label>
                        <div class="input-stepper">
                            <input type="text" id="servicePreco" class="form-input" value="${precoFormatado}" placeholder="0,00" inputmode="decimal">
                            <div class="stepper-buttons">
                                <button type="button" class="stepper-btn" onclick="stepPriceInput('servicePreco', 1)"><i class="fa-solid fa-chevron-up"></i></button>
                                <button type="button" class="stepper-btn" onclick="stepPriceInput('servicePreco', -1)"><i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>DuraÃ§Ã£o (min)</label>
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
                    <label>DescriÃ§Ã£o (opcional)</label>
                    <textarea id="serviceDescricao" class="form-input" rows="2" placeholder="DescriÃ§Ã£o do serviÃ§o...">${service?.descricao || ''}</textarea>
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
    
    // ProteÃ§Ã£o da vÃ­rgula no campo de preÃ§o
    const precoInput = document.getElementById('servicePreco');
    if (precoInput) {
        setupPriceInputProtection(precoInput);
    }
    
    document.getElementById('serviceNome')?.focus();
}

async function saveService(index) {
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

    const isEdit = index !== null && index >= 0;
    const serviceData = { nome, preco, duracao_minutos: duracao, descricao, icon, status: 'ativo' };
    
    if (isEdit) {
        serviceData.id = AppState.services[index].id;
    }

    try {
        const result = isEdit 
            ? await DB.serviceUpdate(serviceData)
            : await DB.serviceCreate(serviceData);
            
        if (result.ok) {
            await loadServicesFromBackend();
            closeModal('serviceModal');
            renderServices();
            showToast('Serviço salvo!', 'success');
        } else {
            showToast(result.err || 'Erro ao salvar serviço', 'error');
        }
    } catch (e) {
        console.error('[Serviço] Erro ao salvar:', e);
        showToast('Erro ao salvar serviço', 'error');
    }
}

// Icon Picker for Services and Products
const iconCategories = {
    'Roupas': ['fa-shirt', 'fa-vest', 'fa-vest-patches', 'fa-user-tie', 'fa-person-dress', 'fa-children', 'fa-socks', 'fa-mitten', 'fa-user'],
    'CalÃ§ados': ['fa-shoe-prints', 'fa-person-walking', 'fa-person-running', 'fa-socks', 'fa-road'],
    'ChapÃ©us & BonÃ©s': ['fa-hat-cowboy', 'fa-hat-cowboy-side', 'fa-hat-wizard', 'fa-graduation-cap', 'fa-helmet-safety', 'fa-crown', 'fa-user-astronaut'],
    'Ã“culos': ['fa-glasses', 'fa-eye', 'fa-sun', 'fa-circle-half-stroke', 'fa-face-grin-beam'],
    'RelÃ³gios': ['fa-clock', 'fa-stopwatch', 'fa-hourglass', 'fa-hourglass-half', 'fa-calendar-days'],
    'Joias & AcessÃ³rios': ['fa-gem', 'fa-ring', 'fa-crown', 'fa-star', 'fa-diamond', 'fa-circle', 'fa-certificate', 'fa-award', 'fa-medal', 'fa-trophy'],
    'Bolsas & Carteiras': ['fa-wallet', 'fa-bag-shopping', 'fa-briefcase', 'fa-suitcase', 'fa-suitcase-rolling', 'fa-basket-shopping', 'fa-cart-shopping', 'fa-handbag'],
    'Cintos & AcessÃ³rios': ['fa-circle-notch', 'fa-link', 'fa-chain', 'fa-ring', 'fa-key', 'fa-lock'],
    'Perfumes & CosmÃ©ticos': ['fa-spray-can', 'fa-spray-can-sparkles', 'fa-bottle-droplet', 'fa-flask', 'fa-droplet', 'fa-wand-magic-sparkles', 'fa-fire-flame-curved', 'fa-wind'],
    'Celulares': ['fa-mobile-screen', 'fa-mobile', 'fa-mobile-screen-button', 'fa-phone', 'fa-tablet-screen-button', 'fa-tablet', 'fa-sim-card', 'fa-sd-card', 'fa-microchip'],
    'Fones & Ãudio': ['fa-headphones', 'fa-headphones-simple', 'fa-podcast', 'fa-microphone', 'fa-volume-high', 'fa-music', 'fa-radio', 'fa-compact-disc', 'fa-bluetooth'],
    'EletrÃ´nicos': ['fa-laptop', 'fa-computer', 'fa-desktop', 'fa-tv', 'fa-display', 'fa-camera', 'fa-video', 'fa-gamepad', 'fa-keyboard', 'fa-mouse', 'fa-plug', 'fa-battery-full', 'fa-charging-station'],
    'Beleza & Cabelo': ['fa-scissors', 'fa-face-smile', 'fa-hand-sparkles', 'fa-palette', 'fa-paintbrush', 'fa-spa', 'fa-leaf', 'fa-feather'],
    'SaÃºde & Bem-estar': ['fa-heart-pulse', 'fa-dumbbell', 'fa-spa', 'fa-apple-whole', 'fa-hand-holding-heart', 'fa-brain', 'fa-lungs', 'fa-pills', 'fa-syringe', 'fa-stethoscope'],
    'Produtos': ['fa-box', 'fa-box-open', 'fa-boxes-stacked', 'fa-gift', 'fa-tags', 'fa-barcode', 'fa-store', 'fa-receipt', 'fa-percent'],
    'Higiene': ['fa-pump-soap', 'fa-soap', 'fa-shower', 'fa-bath', 'fa-tooth', 'fa-hands-bubbles', 'fa-hand-holding-droplet', 'fa-fill-drip'],
    'Ferramentas': ['fa-screwdriver-wrench', 'fa-hammer', 'fa-wrench', 'fa-toolbox', 'fa-gear', 'fa-gears', 'fa-lightbulb', 'fa-fan', 'fa-bolt'],
    'Alimentos': ['fa-utensils', 'fa-mug-hot', 'fa-wine-glass', 'fa-burger', 'fa-pizza-slice', 'fa-ice-cream', 'fa-cake-candles', 'fa-cookie', 'fa-lemon', 'fa-carrot', 'fa-egg', 'fa-fish'],
    'Casa & DecoraÃ§Ã£o': ['fa-couch', 'fa-bed', 'fa-chair', 'fa-lamp', 'fa-blender', 'fa-kitchen-set', 'fa-spoon', 'fa-fire-burner', 'fa-sink', 'fa-toilet', 'fa-rug', 'fa-fan'],
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
                <h2><i class="fa-solid fa-icons"></i> Escolher Ãcone</h2>
                <button class="modal-close" onclick="closeModal('iconPickerModal')">&times;</button>
            </div>
            <div class="modal-body icon-picker-body">
                <div class="icon-search-wrap">
                    <i class="fa-solid fa-search"></i>
                    <input type="text" id="iconSearchInput" class="form-input" placeholder="Buscar Ã­cone..." oninput="filterIcons(this.value)">
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

async function deleteService(index) {
    const service = AppState.services[index];
    if (!service?.id) return;
    
    try {
        const result = await DB.serviceDelete(service.id);
        if (result.ok) {
            await loadServicesFromBackend();
            renderServices();
            showToast('Serviço excluído', 'success');
        } else {
            showToast(result.err || 'Erro ao excluir serviço', 'error');
        }
    } catch (e) {
        console.error('[Serviço] Erro ao excluir:', e);
        showToast('Erro ao excluir serviço', 'error');
    }
}

function confirmDeleteService(index) {
    const service = AppState.services[index];
    if (!service) return;
    
    const html = `
        <div class="modal-content modal-sm modal-confirm">
            <div class="modal-confirm-icon danger-icon">
                <i class="fa-solid fa-scissors"></i>
            </div>
            <span class="modal-confirm-title">Excluir ServiÃ§o?</span>
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
// PRODUCTS (BACKEND)
// =============================================

async function loadProductsFromBackend() {
    try {
        console.log('[Produtos] Carregando do backend...');
        const result = await DB.productList();
        console.log('[Produtos] Resposta:', result);
        if (result.ok && result.produtos) {
            AppState.products = result.produtos.map(p => ({
                id: p.id,
                nome: p.nome || '',
                preco: Number(p.preco) || 0,
                estoque: Number(p.estoque) || 0,
                descricao: p.descricao || '',
                icon: p.icon || 'fa-box',
                status: p.status || 'ativo'
            }));
            console.log('[Produtos] Carregados:', AppState.products.length);
        } else {
            console.warn('[Produtos] Backend retornou erro ou sem dados:', result.err);
        }
    } catch (e) {
        console.error('[Produtos] Erro ao carregar do backend:', e);
    }
}

async function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const countEl = document.getElementById('productsCount');
    if (!grid) return;

    // SEMPRE carrega do backend para garantir sincronização
    await loadProductsFromBackend();
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
                    <label>Ãcone</label>
                    <div class="icon-picker-trigger" onclick="openIconPicker('product')">
                        <div class="icon-picker-preview product">
                            <i class="fa-solid ${currentIcon}" id="productIconPreview"></i>
                        </div>
                        <span class="icon-picker-text">Clique para escolher um Ã­cone</span>
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
                        <label>PreÃ§o (R$)</label>
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
                    <label>DescriÃ§Ã£o (opcional)</label>
                    <textarea id="productDescricao" class="form-input" rows="2" placeholder="DescriÃ§Ã£o do produto...">${product?.descricao || ''}</textarea>
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
    
    // ProteÃ§Ã£o da vÃ­rgula no campo de preÃ§o
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
    // Converter vÃ­rgula para ponto e pegar o valor
    let value = parseFloat(input.value.replace(',', '.')) || 0;
    value += delta;
    if (value < 0) value = 0;
    // Formatar com 2 casas decimais e vÃ­rgula
    input.value = value.toFixed(2).replace('.', ',');
}

function setupPriceInputProtection(input) {
    // Impedir deletar a vÃ­rgula e manter formato correto
    input.addEventListener('keydown', function(e) {
        const cursorPos = this.selectionStart;
        const value = this.value;
        const commaPos = value.indexOf(',');
        
        // Se estiver tentando deletar a vÃ­rgula
        if ((e.key === 'Backspace' && cursorPos === commaPos + 1) ||
            (e.key === 'Delete' && cursorPos === commaPos)) {
            e.preventDefault();
            // Mover cursor para o outro lado da vÃ­rgula
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
    
    // Permitir apenas nÃºmeros e vÃ­rgula
    input.addEventListener('input', function() {
        let val = this.value.replace(/[^\d,]/g, '');
        // Garantir apenas uma vÃ­rgula
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

async function saveProduct(index) {
    const nome = document.getElementById('productNome').value.trim();
    const preco = parsePreco(document.getElementById('productPreco').value);
    const estoque = parseInt(document.getElementById('productEstoque').value) || 0;
    const descricao = document.getElementById('productDescricao').value.trim();
    const icon = document.getElementById('productIcon')?.value || 'fa-box';

    if (!nome) {
        showToast('Nome do produto é obrigatório', 'error');
        return;
    }

    const isEdit = index !== null && index >= 0;
    const productData = { nome, preco, estoque, descricao, icon, status: 'ativo' };
    
    if (isEdit) {
        productData.id = AppState.products[index].id;
    }

    try {
        const result = isEdit 
            ? await DB.productUpdate(productData)
            : await DB.productCreate(productData);
            
        if (result.ok) {
            await loadProductsFromBackend();
            closeModal('productModal');
            renderProducts();
            showToast('Produto salvo!', 'success');
        } else {
            showToast(result.err || 'Erro ao salvar produto', 'error');
        }
    } catch (e) {
        console.error('[Produto] Erro ao salvar:', e);
        showToast('Erro ao salvar produto', 'error');
    }
}

function editProduct(index) {
    const product = AppState.products[index];
    if (product) openProductModal(product, index);
}

async function deleteProduct(index) {
    const product = AppState.products[index];
    if (!product?.id) return;
    
    try {
        const result = await DB.productDelete(product.id);
        if (result.ok) {
            await loadProductsFromBackend();
            renderProducts();
            showToast('Produto excluído', 'success');
        } else {
            showToast(result.err || 'Erro ao excluir produto', 'error');
        }
    } catch (e) {
        console.error('[Produto] Erro ao excluir:', e);
        showToast('Erro ao excluir produto', 'error');
    }
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

