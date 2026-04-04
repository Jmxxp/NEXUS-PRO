// =============================================
// RETORNO — Clientes para retorno
// =============================================

const RETORNO_STORAGE_KEY = 'nexus_retorno_days';
const RETORNO_DEFAULT_DAYS = 30;
const RETORNO_MESSAGE_STORAGE_KEY = 'nexus_retorno_message';

function getRetornoDays() {
    return parseInt(localStorage.getItem(RETORNO_STORAGE_KEY) || RETORNO_DEFAULT_DAYS, 10);
}

function setRetornoDays(days) {
    localStorage.setItem(RETORNO_STORAGE_KEY, days);
}

function getRetornoMessageTemplate() {
    return localStorage.getItem(RETORNO_MESSAGE_STORAGE_KEY) || '';
}

function buildRetornoMessage(name, service, dateLabel, daysAgo) {
    const firstName = (name || 'Cliente').trim().split(' ')[0] || 'Cliente';
    const defaultMsg = `Olá, ${firstName}! Passando para lembrar que você já veio há ${daysAgo} dias. Posso agendar para você o próximo horário para manter o estilo em dia?`;
    const saved = getRetornoMessageTemplate().trim();
    if (!saved) return defaultMsg;

    return saved
        .replace(/{nome}/gi, firstName)
        .replace(/{servico}/gi, service || 'Serviço')
        .replace(/{data}/gi, dateLabel || '-')
        .replace(/{dias}/gi, String(daysAgo));
}

function sendRetornoMessage(phone, name, service, dateLabel, daysAgo) {
    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone) {
        showToast('Cliente sem telefone para WhatsApp', 'warning');
        return;
    }

    const message = buildRetornoMessage(name, service, dateLabel, daysAgo);
    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function openRetornoMessageConfig() {
    const input = document.getElementById('retornoMessageInput');
    if (input) input.value = getRetornoMessageTemplate();
    openModal('modal-retorno-message-config');
}

function saveRetornoMessageConfig() {
    const input = document.getElementById('retornoMessageInput');
    if (!input) return;
    const msg = input.value.trim();
    if (msg) {
        localStorage.setItem(RETORNO_MESSAGE_STORAGE_KEY, msg);
    } else {
        localStorage.removeItem(RETORNO_MESSAGE_STORAGE_KEY);
    }
    closeModal('modal-retorno-message-config');
    showToast('Mensagem de retorno salva!', 'success');
}

function normalizePhone(value) {
    return (value || '').replace(/\D/g, '');
}

function normalizeName(value) {
    return (value || '').trim().toUpperCase();
}

function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function parseAppointmentDate(raw) {
    if (!raw) return null;

    // Already a Date
    if (raw instanceof Date && !isNaN(raw)) {
        return startOfDay(raw);
    }

    const str = String(raw).trim();
    if (!str) return null;

    // yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        const [y, m, d] = str.split('-').map(Number);
        const parsed = new Date(y, m - 1, d);
        return isNaN(parsed) ? null : startOfDay(parsed);
    }

    // dd/mm/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
        const [d, m, y] = str.split('/').map(Number);
        const parsed = new Date(y, m - 1, d);
        return isNaN(parsed) ? null : startOfDay(parsed);
    }

    // Fallback (ISO with time, etc.)
    const fallback = new Date(str);
    return isNaN(fallback) ? null : startOfDay(fallback);
}

function collectRetornoRecords(days) {
    const today = startOfDay(new Date());
    const byClient = new Map();

    (AppState.appointments || []).forEach(apt => {
        if (!apt) return;
        if (apt.blocked || apt.client === 'BLOQUEADO') return;

        const name = apt.client || apt.nome || apt.cliente || '';
        const phone = apt.phone || apt.telefone || apt.celular || '';

        const keyPhone = normalizePhone(phone);
        const keyName = normalizeName(name);
        const uniqueKey = keyPhone || keyName;
        if (!uniqueKey) return;

        const rawDate = apt.date || apt.data || apt.dataAgendamento;
        const aptDate = parseAppointmentDate(rawDate);
        if (!aptDate) return;

        const daysAgo = Math.floor((today - aptDate) / 86400000);
        // Modo exato: mostra apenas quem teve agendamento exatamente N dias atras.
        if (daysAgo !== days) return;

        const existing = byClient.get(uniqueKey);
        if (!existing || aptDate > existing.aptDate) {
            byClient.set(uniqueKey, {
                apt,
                aptDate,
                daysAgo,
                displayName: name || 'Cliente',
                displayPhone: phone || keyPhone || '',
                uniqueKey
            });
        }
    });

    return Array.from(byClient.values()).sort((a, b) => b.daysAgo - a.daysAgo);
}

function renderRetorno(records) {
    const container = document.getElementById('retornoGrid');
    const countEl = document.getElementById('retornoCount');
    const daysInput = document.getElementById('retornoDaysInput');
    if (!container) return;

    const days = getRetornoDays();
    if (daysInput) daysInput.value = days;

    const data = Array.isArray(records) ? records : collectRetornoRecords(days);

    if (countEl) countEl.textContent = data.length;

    if (!data.length) {
        container.innerHTML = `
            <div class="retorno-empty">
                <i class="fa-solid fa-rotate-left"></i>
                <p>Nenhum agendamento encontrado há ${days} dias.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = data.map(item => {
        const apt = item.apt;
        const name = item.displayName;
        const phone = item.displayPhone;
        const initials = name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CL';
        const service = apt.servico || apt.service || apt.servicoNome || 'Serviço';
        const rawDate = apt.date || apt.data || apt.dataAgendamento;
        const displayDate = (typeof formatDisplayDate === 'function' && rawDate)
            ? formatDisplayDate(rawDate)
            : (rawDate || '-');
        const professional = apt.agendadorNome || apt.agendador || apt.profissional || '';

        let urgencyClass = 'fresh';
        if (item.daysAgo >= Math.floor(getRetornoDays() * 0.8)) urgencyClass = 'urgent';
        else if (item.daysAgo >= Math.floor(getRetornoDays() * 0.5)) urgencyClass = 'mid';

        const daysLabel = item.daysAgo === 0
            ? 'hoje'
            : (item.daysAgo === 1 ? '1 dia atrás' : `${item.daysAgo} dias atrás`);

        const safeName = name.replace(/'/g, "\\'");
        const safePhone = String(phone || '').replace(/'/g, "\\'");
        const safeService = String(service || '').replace(/'/g, "\\'");
        const safeDate = String(displayDate || '').replace(/'/g, "\\'");

        return `
            <div class="client-card retorno-client-card" onclick="openClientFromSchedule('${safePhone}', '${safeName}')">
                <div class="client-card-top">
                    <div class="client-avatar">${initials}</div>
                    <div class="client-card-info">
                        <div class="client-name">${name}</div>
                        <div class="client-phone"><i class="fas fa-phone"></i> ${phone || 'Não informado'}</div>
                    </div>
                    <div class="client-card-actions">
                        ${safePhone
                            ? `<button class="btn-card-action whatsapp" onclick="event.stopPropagation(); sendRetornoMessage('${safePhone}', '${safeName}', '${safeService}', '${safeDate}', ${item.daysAgo})" title="Enviar mensagem de retorno"><i class="fab fa-whatsapp"></i></button>`
                            : `<button class="btn-card-action whatsapp" disabled title="Sem telefone"><i class="fab fa-whatsapp"></i></button>`
                        }
                    </div>
                </div>
                <div class="client-card-body retorno-card-body">
                    <div class="retorno-details">
                        <div class="retorno-detail-row">
                            <i class="fa-solid fa-scissors"></i>
                            <span>${service}</span>
                        </div>
                        ${professional ? `
                        <div class="retorno-detail-row">
                            <i class="fa-solid fa-user-tie"></i>
                            <span>${professional}</span>
                        </div>` : ''}
                        <div class="retorno-detail-row">
                            <i class="fa-regular fa-calendar"></i>
                            <span>${displayDate}</span>
                        </div>
                    </div>
                    <div class="client-badges">
                        <span class="client-badge retorno-days-badge ${urgencyClass}">${daysLabel}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function refreshRetornoAppointments() {
    if (!window.DB || typeof DB.list !== 'function') return;
    try {
        const result = await DB.list();
        if (result && result.ok) {
            const data = result.data || [];
            AppState.appointments = data.filter(apt => !AppState.pendingDeletions.has(String(apt.id)));
        }
    } catch (e) {
        console.warn('Retorno: falha ao atualizar agendamentos', e);
    }
}

async function retornoBuscar() {
    const daysInput = document.getElementById('retornoDaysInput');
    if (daysInput) {
        const val = Math.max(1, Math.min(365, parseInt(daysInput.value, 10) || RETORNO_DEFAULT_DAYS));
        daysInput.value = val;
        setRetornoDays(val);
    }

    await refreshRetornoAppointments();
    renderRetorno();
}

function initRetorno() {
    const daysInput = document.getElementById('retornoDaysInput');
    if (daysInput) {
        daysInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') retornoBuscar();
        });
    }

    document.getElementById('btnSaveRetornoMsg')?.addEventListener('click', saveRetornoMessageConfig);

    const _orig = window.switchScreen;
    if (typeof _orig === 'function') {
        window.switchScreen = function (screenId) {
            _orig(screenId);
            if (screenId === 'screen-retorno') {
                retornoBuscar();
            }
        };
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRetorno);
} else {
    initRetorno();
}
