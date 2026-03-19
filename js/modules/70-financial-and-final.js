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
    // Limitar navegaÃ§Ã£o: mÃ¡ximo 24 meses no passado, nÃ£o pode ir pro futuro
    const newOffset = AppState.financeiroPeriodOffset + dir;
    if (newOffset > 0) {
        showToast('NÃ£o Ã© possÃ­vel navegar para o futuro', 'warning');
        return;
    }
    if (newOffset < -24) {
        showToast('Limite de histÃ³rico: 24 meses', 'warning');
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
    return { start, end, label: fmt(start) + ' â€” ' + fmt(end) };
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
        'credito': 'CrÃ©dito',
        'debito': 'DÃ©bito',
        'carne': 'CarnÃª',
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
        grid.innerHTML = '<div class="fin-empty-state"><i class="fa-solid fa-calendar-xmark"></i><p>Sem dados no perÃ­odo</p></div>';
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
        container.innerHTML = '<div class="stats-empty">Sem movimentaÃ§Ãµes</div>';
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
                <div class="fin-transaction-desc">${t.description || 'MovimentaÃ§Ã£o'}</div>
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
            <span class="summary-label"><i class="fa-solid fa-arrow-down"></i> Total SaÃ­das</span>
            <span class="summary-value expense">${formatBRL(totalExpense)}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label"><i class="fa-solid fa-wallet"></i> Saldo</span>
            <span class="summary-value balance" style="color: ${balance >= 0 ? '#64b4ff' : '#ff6b6b'}">${formatBRL(balance)}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label"><i class="fa-solid fa-receipt"></i> TransaÃ§Ãµes</span>
            <span class="summary-value">${transactionCount}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label"><i class="fa-solid fa-ticket"></i> Ticket MÃ©dio</span>
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
                showToast('Arquivo de backup invÃ¡lido', 'error');
                return;
            }
            
            if (!confirm('Restaurar backup irÃ¡ SUBSTITUIR os dados atuais. Continuar?')) {
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
