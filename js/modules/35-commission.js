/* =============================================
   COMMISSION MODULE
   Configuração e cálculo de comissões por profissional
   ============================================= */

// Formata valor em reais
function formatCurrency(value) {
    const num = parseFloat(value) || 0;
    return 'R$ ' + num.toFixed(2).replace('.', ',');
}

// Storage key for commission config
const COMMISSION_CONFIG_KEY = 'nexus_commission_config';

// Load commission configuration from localStorage
function loadCommissionConfig() {
    try {
        const saved = localStorage.getItem(COMMISSION_CONFIG_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        console.error('Error loading commission config:', e);
        return {};
    }
}

// Save commission configuration to localStorage
function saveCommissionConfigToStorage(config) {
    try {
        localStorage.setItem(COMMISSION_CONFIG_KEY, JSON.stringify(config));
        return true;
    } catch (e) {
        console.error('Error saving commission config:', e);
        return false;
    }
}

// Get commission rates for a specific professional
function getProfessionalCommission(profId) {
    const config = loadCommissionConfig();
    return config[profId] || { services: 0, products: 0 };
}

// Render commission config modal with all professionals
function renderCommissionConfigModal() {
    const listEl = document.getElementById('commissionConfigList');
    if (!listEl) return;
    
    // Pega os agendadores - MESMA variável usada nas abas da agenda
    const agendadores = (typeof AppState !== 'undefined') ? AppState.agendadores : null;
    
    if (!agendadores || agendadores.length === 0) {
        listEl.innerHTML = '<div class="commission-config-empty"><i class="fa-solid fa-users-slash"></i><p>Nenhum profissional cadastrado</p></div>';
        return;
    }
    
    const config = loadCommissionConfig();
    
    // Gera HTML - igual ao forEach das abas
    let html = '';
    agendadores.forEach(ag => {
        const profId = ag.id;
        const name = ag.nome || ag.name || 'Profissional';
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const rates = config[profId] || { services: 0, products: 0 };
        
        html += `
            <div class="commission-config-item" data-prof-id="${profId}">
                <div class="commission-config-prof">
                    <div class="commission-config-avatar">${initials}</div>
                    <span class="commission-config-name">${name}</span>
                </div>
                <div class="commission-config-field">
                    <label><i class="fa-solid fa-scissors"></i> Serviços</label>
                    <div class="commission-config-input">
                        <input type="number" min="0" max="100" step="0.5" class="commission-services-input" value="${rates.services || 0}" data-prof-id="${profId}">
                        <span>%</span>
                    </div>
                </div>
                <div class="commission-config-field">
                    <label><i class="fa-solid fa-box"></i> Produtos</label>
                    <div class="commission-config-input">
                        <input type="number" min="0" max="100" step="0.5" class="commission-products-input" value="${rates.products || 0}" data-prof-id="${profId}">
                        <span>%</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    listEl.innerHTML = html;
}

// Save commission config from modal inputs
function saveCommissionConfig() {
    const config = {};
    
    document.querySelectorAll('.commission-config-item').forEach(item => {
        const profId = item.dataset.profId;
        const servicesInput = item.querySelector('.commission-services-input');
        const productsInput = item.querySelector('.commission-products-input');
        
        if (profId) {
            config[profId] = {
                services: parseFloat(servicesInput?.value) || 0,
                products: parseFloat(productsInput?.value) || 0
            };
        }
    });
    
    if (saveCommissionConfigToStorage(config)) {
        showToast('Configurações de comissão salvas!', 'success');
        closeModal('modal-commission-config');
        // Recalculate commissions if on commission screen
        renderCommissionScreen();
    } else {
        showToast('Erro ao salvar configurações', 'error');
    }
}

// Render commission screen with calculated values
function renderCommissionScreen() {
    const gridEl = document.getElementById('commissionCardsGrid');
    const countEl = document.getElementById('commissionProfessionalsCount');
    
    if (!gridEl) return;
    
    // Verifica se AppState existe (igual faz nas outras telas)
    if (typeof AppState === 'undefined') {
        gridEl.innerHTML = '<div class="commission-empty-state"><i class="fa-solid fa-exclamation-triangle"></i><p>Erro: Sistema não carregado</p></div>';
        return;
    }
    
    // Se não está conectado
    if (!AppState.connected) {
        gridEl.innerHTML = '<div class="commission-empty-state"><i class="fa-solid fa-plug-circle-xmark"></i><p>Conecte ao sistema para ver as comissões</p></div>';
        if (countEl) countEl.textContent = '0 profissionais';
        return;
    }
    
    // Pega os agendadores - MESMA variável usada nas abas da agenda
    const agendadores = AppState.agendadores;
    
    if (!agendadores || agendadores.length === 0) {
        gridEl.innerHTML = '<div class="commission-empty-state"><i class="fa-solid fa-users-slash"></i><p>Nenhum profissional encontrado</p></div>';
        if (countEl) countEl.textContent = '0 profissionais';
        return;
    }
    
    // Atualiza contador
    if (countEl) {
        countEl.textContent = `${agendadores.length} profissiona${agendadores.length === 1 ? 'l' : 'is'}`;
    }
    
    // Carrega config de comissões e período
    const config = loadCommissionConfig();
    const period = getSelectedCommissionPeriod();
    const appointments = filterAppointmentsByPeriod(AppState.appointments || [], period);
    
    let totalServicesCommission = 0;
    let totalProductsCommission = 0;
    
    // Gera HTML dos cards - igual ao forEach das abas
    let cardsHtml = '';
    
    agendadores.forEach(ag => {
        // Usa EXATAMENTE o mesmo padrão das abas
        const profId = ag.id;
        const name = ag.nome || ag.name || 'Profissional';
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const rates = config[profId] || { services: 0, products: 0 };
        
        // Calcula valores deste profissional
        let servicesTotal = 0;
        let appointmentsCount = 0;
        
        appointments.forEach(apt => {
            if (apt.blocked || apt.client === 'BLOQUEADO') return;
            
            // Verifica se o agendamento é deste profissional
            const aptAgId = apt.agendadorId || apt.agendador;
            if (String(aptAgId) === String(profId)) {
                servicesTotal += parseFloat(apt.preco || apt.price || 0);
                appointmentsCount++;
            }
        });
        
        const servicesCommission = servicesTotal * (rates.services / 100);
        const productsCommission = 0;
        const totalCommission = servicesCommission + productsCommission;
        
        totalServicesCommission += servicesCommission;
        totalProductsCommission += productsCommission;
        
        cardsHtml += `
            <div class="commission-card">
                <div class="commission-card-header">
                    <div class="commission-card-avatar">${initials}</div>
                    <div class="commission-card-name">${name}</div>
                </div>
                <div class="commission-card-body">
                    <div class="commission-card-row">
                        <span class="commission-row-label"><i class="fa-solid fa-scissors"></i> Serviços (${rates.services}%)</span>
                        <span class="commission-row-value services">${formatCurrency(servicesCommission)}</span>
                    </div>
                    <div class="commission-card-row">
                        <span class="commission-row-label"><i class="fa-solid fa-box"></i> Produtos (${rates.products}%)</span>
                        <span class="commission-row-value products">${formatCurrency(productsCommission)}</span>
                    </div>
                    <div class="commission-card-divider"></div>
                    <div class="commission-card-row total">
                        <span class="commission-row-label">Total</span>
                        <span class="commission-row-value total">${formatCurrency(totalCommission)}</span>
                    </div>
                </div>
                <div class="commission-card-footer">
                    <span class="commission-appointments"><i class="fa-solid fa-calendar-check"></i> ${appointmentsCount} atendimento${appointmentsCount !== 1 ? 's' : ''}</span>
                    <span class="commission-appointments" style="margin-left: auto;"><i class="fa-solid fa-money-bill-wave"></i> Vendido: ${formatCurrency(servicesTotal)}</span>
                </div>
            </div>
        `;
    });
    
    gridEl.innerHTML = cardsHtml;
    
    // Atualiza totais
    const totalEl = document.getElementById('totalCommissionValue');
    const servicesEl = document.getElementById('servicesCommissionValue');
    const productsEl = document.getElementById('productsCommissionValue');
    
    if (totalEl) totalEl.textContent = formatCurrency(totalServicesCommission + totalProductsCommission);
    if (servicesEl) servicesEl.textContent = formatCurrency(totalServicesCommission);
    if (productsEl) productsEl.textContent = formatCurrency(totalProductsCommission);
    
    // Atualiza exibição de data
    updateCommissionDateDisplay(period);
}

// Get selected commission period
function getSelectedCommissionPeriod() {
    const activeBtn = document.querySelector('.commission-period-btn.active');
    return activeBtn?.dataset.period || 'today';
}

// Filter appointments by period
function filterAppointmentsByPeriod(appointments, period) {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Get week start (Monday)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    // Get month start
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStartStr = monthStart.toISOString().split('T')[0];
    
    return appointments.filter(apt => {
        const aptDate = apt.date || apt.data;
        if (!aptDate) return false;
        
        switch (period) {
            case 'today':
                return aptDate === today;
            case 'week':
                return aptDate >= weekStartStr && aptDate <= today;
            case 'month':
                return aptDate >= monthStartStr && aptDate <= today;
            case 'custom':
                // TODO: implement custom date range
                return true;
            default:
                return aptDate === today;
        }
    });
}

// Update commission date display
function updateCommissionDateDisplay(period) {
    const displayEl = document.getElementById('commissionDateDisplay');
    if (!displayEl) return;
    
    const now = new Date();
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    let text = '';
    switch (period) {
        case 'today':
            text = `${now.getDate()} de ${months[now.getMonth()]}, ${now.getFullYear()}`;
            break;
        case 'week':
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
            text = `${weekStart.getDate()} - ${now.getDate()} de ${months[now.getMonth()]}`;
            break;
        case 'month':
            text = `${months[now.getMonth()]} de ${now.getFullYear()}`;
            break;
        default:
            text = `${now.getDate()} de ${months[now.getMonth()]}, ${now.getFullYear()}`;
    }
    
    displayEl.innerHTML = `<i class="fa-solid fa-calendar"></i><span>${text}</span>`;
}

// Initialize commission period buttons
function initCommissionPeriodButtons() {
    document.querySelectorAll('.commission-period-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.commission-period-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCommissionScreen();
        });
    });
}

// Hook into modal opening
const originalOpenModal = window.openModal;
if (originalOpenModal) {
    window.openModal = function(modalId) {
        const result = originalOpenModal.apply(this, arguments);
        if (modalId === 'modal-commission-config') {
            setTimeout(renderCommissionConfigModal, 50);
        }
        return result;
    };
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initCommissionPeriodButtons();
});

// Export functions
window.renderCommissionConfigModal = renderCommissionConfigModal;
window.saveCommissionConfig = saveCommissionConfig;
window.renderCommissionScreen = renderCommissionScreen;
window.getProfessionalCommission = getProfessionalCommission;
