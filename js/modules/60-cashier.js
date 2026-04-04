// CASHIER (BACKEND)
// =============================================

async function loadTransactionsFromBackend() {
    try {
        const result = await DB.cashList();
        if (result.ok && (result.data || result.movimentacoes)) {
            const items = result.data || result.movimentacoes || [];
            AppState.transactions = items.map(t => {
                // Converter tipo do backend (entrada/saida) para formato frontend (income/expense)
                let type = t.type || t.tipo || 'income';
                if (type === 'entrada') type = 'income';
                else if (type === 'saida') type = 'expense';
                
                return {
                    id: t.id,
                    type: type,
                    description: t.description || t.descricao || '',
                    value: Number(t.value || t.valor_real || t.valor_original) || 0,
                    originalValue: Number(t.valor_original) || 0,
                    date: t.date || t.data || formatDate(new Date()),
                    paymentMethod: t.paymentMethod || t.forma_pagamento || '',
                    cardBrand: t.cardBrand || t.bandeira_cartao || '',
                    clientName: t.clientName || t.cliente_nome || '',
                    clientPhone: t.clientPhone || t.cliente_telefone || t.cliente_id || '',
                    items: t.items || [],
                    editHistory: t.editHistory || t.historico || [],
                    createdAt: t.createdAt || t.created_at || '',
                    lastEditedAt: t.lastEditedAt || t.updated_at || '',
                    status: t.status || 'ativo'
                };
            });
        } else {
            // ⚠️ CRÍTICO: Limpar dados se falha para não mostrar dados de outro backend!
            AppState.transactions = [];
        }
        AppState._transactionsLoaded = true;
    } catch (e) {
        console.error('[Caixa] Erro ao carregar do backend:', e);
        // ⚠️ CRÍTICO: Limpar dados em caso de erro de conexão!
        AppState.transactions = [];
        AppState._transactionsLoaded = true;
    }
}

async function renderCashier() {
    const list = document.getElementById('transactionsList');
    
    // Só buscar do backend se ainda não carregou
    if (!AppState._transactionsLoaded) {
        if (list) {
            list.innerHTML = `
                <div class="skeleton-transaction"><div class="skeleton-trans-icon"></div><div class="skeleton-trans-info"><div class="skeleton-line" style="height:13px;width:55%"></div><div class="skeleton-line" style="height:10px;width:35%"></div></div><div class="skeleton-trans-value"></div></div>
                <div class="skeleton-transaction"><div class="skeleton-trans-icon"></div><div class="skeleton-trans-info"><div class="skeleton-line" style="height:13px;width:65%"></div><div class="skeleton-line" style="height:10px;width:40%"></div></div><div class="skeleton-trans-value"></div></div>
                <div class="skeleton-transaction"><div class="skeleton-trans-icon"></div><div class="skeleton-trans-info"><div class="skeleton-line" style="height:13px;width:50%"></div><div class="skeleton-line" style="height:10px;width:30%"></div></div><div class="skeleton-trans-value"></div></div>
                <div class="skeleton-transaction"><div class="skeleton-trans-icon"></div><div class="skeleton-trans-info"><div class="skeleton-line" style="height:13px;width:60%"></div><div class="skeleton-line" style="height:10px;width:45%"></div></div><div class="skeleton-trans-value"></div></div>
                <div class="skeleton-transaction"><div class="skeleton-trans-icon"></div><div class="skeleton-trans-info"><div class="skeleton-line" style="height:13px;width:45%"></div><div class="skeleton-line" style="height:10px;width:32%"></div></div><div class="skeleton-trans-value"></div></div>
            `;
        }
        await loadTransactionsFromBackend();
    }
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
    
    // Calcular taxas de cartÃ£o
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
    
    // Calcular taxas de cartÃ£o anteriores
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
            breakdownHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-credit-card"></i>CartÃ£o</div><span>${formatBRL(incomeCartao)}</span></div>`;
        }
        if (incomePix > 0) {
            breakdownHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-qrcode"></i>PIX</div><span>${formatBRL(incomePix)}</span></div>`;
        }
        if (incomeCarne > 0) {
            breakdownHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-file-invoice"></i>CarnÃª</div><span>${formatBRL(incomeCarne)}</span></div>`;
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
        balanceHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-arrow-down"></i>SaÃ­das Hoje</div><span style="color: #ff6b6b">-${formatBRL(expense)}</span></div>`;
        if (cardFees > 0) {
            balanceHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-percent"></i>Taxas CartÃ£o</div><span style="color: #ffa500">-${formatBRL(cardFees)}</span></div>`;
        }
        balanceBreakdownEl.innerHTML = balanceHtml;
    }
    
    // Render expense breakdown
    if (expenseBreakdownEl) {
        const expenseCount = expenseTransactions.length;
        const expenseAvg = expenseCount > 0 ? expense / expenseCount : 0;
        let expenseHtml = '';
        expenseHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-receipt"></i>TransaÃ§Ãµes</div><span>${expenseCount}</span></div>`;
        expenseHtml += `<div class="breakdown-item"><div><i class="fa-solid fa-calculator"></i>MÃ©dia</div><span>${formatBRL(expenseAvg)}</span></div>`;
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

    const dateLabel = AppState.cashierDateFilter ? formatDateBR(AppState.cashierDateFilter) : 'este perÃ­odo';

    if (transactions.length === 0) {
        list.innerHTML = `
            <div class="cashier-empty">
                <i class="fa-solid fa-receipt"></i>
                <p>Nenhuma movimentaÃ§Ã£o${filter !== 'all' ? ` do tipo ${filter === 'income' ? 'entrada' : 'saÃ­da'}` : ''} em ${dateLabel}</p>
            </div>
        `;
        return;
    }
    
    const paymentMethodLabels = {
        'dinheiro': { icon: 'fa-money-bill-wave', label: 'Dinheiro' },
        'pix': { icon: 'fa-qrcode', label: 'PIX' },
        'credito': { icon: 'fa-credit-card', label: 'CrÃ©dito' },
        'debito': { icon: 'fa-credit-card', label: 'DÃ©bito' },
        'carne': { icon: 'fa-file-invoice', label: 'CarnÃª' }
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
        
        // Gerar histÃ³rico de ediÃ§Ãµes
        let historyHtml = '';
        if (hasEdits) {
            historyHtml = `
                <div class="transaction-edit-history">
                    <div class="transaction-edit-history-title"><i class="fa-solid fa-clock-rotate-left"></i> HistÃ³rico de EdiÃ§Ãµes (${editCount})</div>
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
                                <span class="edit-record-label">DescriÃ§Ã£o:</span>
                                <span class="edit-record-text">${edit.previousDescription}</span>
                            </div>
                        </div>
                    `).reverse().join('')}
                </div>
            `;
        }
        
        // Calcular valores para exibiÃ§Ã£o
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
                        ${hasEdits ? `<span class="transaction-edited-badge" onclick="toggleEditHistory(this)" title="Editado ${editCount}x - clique para ver histÃ³rico"><i class="fa-solid fa-pen"></i> ${editCount}</span>` : ''}
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
                        <span class="cashier-cal-month" id="cashierCalMonth">MARÃ‡O 2026</span>
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
    
    const months = ['JANEIRO', 'FEVEREIRO', 'MARÃ‡O', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    
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
        { id: 'credito', icon: 'fa-credit-card', label: 'CrÃ©dito' },
        { id: 'debito', icon: 'fa-credit-card', label: 'DÃ©bito' },
        { id: 'carne', icon: 'fa-file-invoice', label: 'CarnÃª' }
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
                <h2><i class="fa-solid fa-receipt" style="color: var(--primary);"></i> ${isEdit ? 'Editar' : 'Nova'} MovimentaÃ§Ã£o</h2>
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
                            <i class="fa-solid fa-arrow-trend-down"></i> SaÃ­da
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
                    <label>Bandeira do CartÃ£o <span style="opacity:0.6;font-weight:normal;">(opcional)</span></label>
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
                        <input type="text" id="itemSearchInput" class="form-input" placeholder="Digite para buscar produtos ou serviÃ§os..." autocomplete="off">
                        <div class="item-suggestions" id="itemSuggestions"></div>
                    </div>
                    <div class="selected-items-list" id="selectedItemsList"></div>
                    <div class="items-total-row" id="itemsTotalRow" style="display:none;">
                        <span class="items-total-label">Total dos itens:</span>
                        <span class="items-total-value" id="itemsTotalValue">R$ 0,00</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>DescriÃ§Ã£o</label>
                    <input type="text" id="transactionDesc" class="form-input" value="${transaction?.description || ''}" placeholder="Ex: Venda de produto">
                </div>
                
                <!-- Professional Selection for Commissions -->
                <div class="form-group professional-section" id="professionalSection" style="${(!transaction || transaction.type === 'income') ? 'display:block;' : 'display:none;'}">
                    <label>Profissional ResponsÃ¡vel <span style="opacity:0.6;font-weight:normal;">(Comissionado)</span></label>
                    <select id="transactionProfissional" class="form-input">
                        <option value="">-- Estabelecimento / Nenhum --</option>
                        ${(AppState.agendadores || []).map(ag => 
                            `<option value="${ag.id}" ${transaction?.profissional_id == ag.id ? 'selected' : ''}>${ag.nome}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div class="form-group">
                        <label>Valor Final (R$)</label>
                        <input type="number" id="transactionValue" class="form-input" value="${transaction?.value || ''}" placeholder="100.00" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Data</label>
                        <input type="date" id="transactionDate" class="form-input" value="${transaction?.date || formatDate(new Date())}" ${AppState.currentUser?.isAdmin ? '' : 'readonly title="Apenas o administrador pode alterar a data"'}>
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
    const professionalSection = document.getElementById('professionalSection');
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
    if (professionalSection) {
        professionalSection.style.display = type === 'income' ? 'block' : 'none';
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

async function saveTransaction(index) {
    const type = document.getElementById('transactionType').value;
    const description = document.getElementById('transactionDesc').value.trim();
    const value = parseFloat(document.getElementById('transactionValue').value) || 0;
    const date = document.getElementById('transactionDate').value;
    const paymentMethod = type === 'income' ? document.getElementById('transactionPaymentMethod').value : null;
    const cardBrand = type === 'income' ? document.getElementById('transactionCardBrand')?.value : null;
    const clientName = type === 'income' ? document.getElementById('transactionClientSearch')?.value.trim() : null;
    const clientPhone = type === 'income' ? document.getElementById('transactionClientPhone')?.value : null;
    const profissionalId = document.getElementById('transactionProfissional') ? document.getElementById('transactionProfissional').value : null;
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

    const isEdit = index !== null && index >= 0;
    const existingId = isEdit ? AppState.transactions[index]?.id : null;

    // Converter tipo do frontend para backend
    const tipoBackend = type === 'income' ? 'entrada' : (type === 'expense' ? 'saida' : type);

    // Dados para backend
    const cashData = {
        tipo: tipoBackend,
        descricao: description,
        valor_original: originalValue || value,
        valor_real: value,
        data: date,
        forma_pagamento: paymentMethod || '',
        bandeira_cartao: cardBrand || '',
        profissional_id: profissionalId || '',
        cliente_nome: clientName || '',
        cliente_telefone: clientPhone || '',
        itens: items.map(i => ({
            tipo_item: i.type,
            produto_id: i.type === 'product' ? i.id : null,
            servico_id: i.type === 'service' ? i.id : null,
            quantidade: i.quantity,
            valor_unitario: i.price
        }))
    };
    
    if (isEdit) {
        cashData.id = existingId;
    }

    try {
        const result = isEdit 
            ? await DB.cashUpdate(cashData)
            : await DB.cashCreate(cashData);
            
        if (result.ok) {
            await loadTransactionsFromBackend();
            // A baixa e devolução de estoque agora ocorrem atomicamente no Google Apps Script.
            // Apenas recarregamos a view de produtos para refletir os novos números.
            if (items.some(i => i.type === 'product')) {
                await loadProductsFromBackend();
            }
            closeModal('transactionModal');
            renderCashier();
            showToast('Movimentação salva!', 'success');
        } else {
            showToast(result.err || 'Erro ao salvar movimentação', 'error');
        }
    } catch (e) {
        console.error('[Caixa] Erro ao salvar:', e);
        showToast('Erro ao salvar movimentação', 'error');
    }
}



function editTransaction(index) {
    const transaction = AppState.transactions[index];
    if (transaction) openTransactionModal(transaction, index);
}

// FunÃ§Ã£o de exclusÃ£o desabilitada - movimentaÃ§Ãµes nÃ£o podem ser excluÃ­das
// function deleteTransaction(index) {
//     if (!confirm('Excluir esta movimentaÃ§Ã£o?')) return;
//     const transaction = AppState.transactions[index];
//     if (transaction?.items) {
//         restoreProductStock(transaction.items);
//     }
//     AppState.transactions.splice(index, 1);
//     saveTransactionsToStorage();
//     renderCashier();
//     showToast('MovimentaÃ§Ã£o excluÃ­da', 'success');
// }

