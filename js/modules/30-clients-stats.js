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
    showToast('Cliente nÃ£o encontrado no cadastro', 'error');
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
    
    // Normalizar telefone para comparaÃ§Ã£o
    const normalizedPhone = phone.replace(/\D/g, '');
    // Normalizar nome para comparaÃ§Ã£o (remover acentos, espaÃ§os extras)
    const normalizedClientName = (clientName || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    
    const clientTransactions = (AppState.transactions || [])
        .filter(t => {
            if (t.type !== 'income') return false;
            if (!t.items || t.items.length === 0) return false;
            
            // Match por telefone (preferÃªncia)
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
    
    // Validar formato do telefone (mÃ­nimo 10 dÃ­gitos)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        showToast('Telefone invÃ¡lido - use DDD + nÃºmero', 'error');
        return;
    }
    
    // Validar CPF se informado
    if (cpf && !validateCPF(cpf)) {
        showToast('CPF invÃ¡lido - verifique os dÃ­gitos', 'error');
        return;
    }
    
    // Validar aniversÃ¡rio nÃ£o Ã© no futuro
    if (birthday) {
        const birthDate = new Date(birthday + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (birthDate > today) {
            showToast('Data de aniversÃ¡rio nÃ£o pode ser no futuro', 'error');
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
    
    // Validar formato do telefone (mÃ­nimo 10 dÃ­gitos)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        showToast('Telefone invÃ¡lido - use DDD + nÃºmero', 'error');
        return;
    }
    
    // Validar CPF se informado
    if (cpf && !validateCPF(cpf)) {
        showToast('CPF invÃ¡lido - verifique os dÃ­gitos', 'error');
        return;
    }
    
    // Validar aniversÃ¡rio nÃ£o Ã© no futuro
    if (birthday) {
        const birthDate = new Date(birthday + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (birthDate > today) {
            showToast('Data de aniversÃ¡rio nÃ£o pode ser no futuro', 'error');
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
                console.error('[Clientes] Backend recusou exclusÃ£o:', result.err);
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
    // Limitar navegaÃ§Ã£o: mÃ¡ximo 24 meses no passado, nÃ£o pode ir pro futuro
    const newOffset = AppState.statsPeriodOffset + dir;
    if (newOffset > 0) {
        showToast('NÃ£o Ã© possÃ­vel navegar para o futuro', 'warning');
        return;
    }
    if (newOffset < -24) {
        showToast('Limite de histÃ³rico: 24 meses', 'warning');
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
    return { start, end, label: fmt(start) + ' â€” ' + fmt(end) };
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
        a.client !== 'BLOQUEADO' && !a.blocked && a.servico !== 'AlmoÃ§o'
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
    let peakDay = 'â€”', peakCount = 0;
    Object.entries(dayCounts).forEach(([date, count]) => {
        if (count > peakCount) { peakCount = count; peakDay = formatDateBR(date); }
    });
    setTxt('statPeakDay', peakCount > 0 ? peakCount : 'â€”');
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
        // Line or Area chart â€” render labels only (no value numbers above)
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
        title.textContent = periodModalState.type === 'week' ? 'Selecionar Semana' : 'Selecionar MÃªs';
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
        title.textContent = type === 'week' ? 'Selecionar Semana' : 'Selecionar MÃªs';
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
    document.getElementById('periodWeekRange').textContent = fmt(weekStart) + ' â€” ' + fmt(weekEnd);
    document.getElementById('periodWeekYear').textContent = weekStart.getFullYear();

    // Get appointments
    const validAppointments = AppState.appointments.filter(a =>
        a.client !== 'BLOQUEADO' && !a.blocked && a.servico !== 'AlmoÃ§o'
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
            <span class="period-summary-label">MÃ©dia/dia</span>
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
        a.client !== 'BLOQUEADO' && !a.blocked && a.servico !== 'AlmoÃ§o'
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
        grid.innerHTML = '<div class="stats-empty">HorÃ¡rios nÃ£o configurados</div>';
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
    
    let bestDay = 'â€”', bestCount = 0, worstDay = 'â€”', worstCount = Infinity;
    Object.entries(dayCounts).forEach(([date, count]) => {
        if (count > bestCount) { bestCount = count; bestDay = formatDateBR(date); }
        if (count < worstCount) { worstCount = count; worstDay = formatDateBR(date); }
    });
    if (worstCount === Infinity) { worstCount = 0; worstDay = 'â€”'; }
    
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
