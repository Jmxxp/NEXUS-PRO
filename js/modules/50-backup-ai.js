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
    // Valores zerados - só mostrar se existir no backend
    return {
        credito: {
            visa: 0,
            mastercard: 0,
            elo: 0,
            amex: 0,
            hipercard: 0
        },
        debito: {
            visa: 0,
            mastercard: 0,
            elo: 0,
            amex: 0,
            hipercard: 0
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
                <h2><i class="fa-solid fa-percent" style="color: #ffb432;"></i> Taxas de CartÃ£o</h2>
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
                                MovimentaÃ§Ãµes do MÃªs
                            </div>
                            <span class="fees-transactions-count" id="feesTransactionsCount">0 transaÃ§Ãµes</span>
                        </div>
                        <div class="fees-transactions-list" id="feesTransactionsList"></div>
                    </div>
                </div>
                
                <!-- Config Panel -->
                <div class="card-fees-panel" id="feesConfigPanel">
                    <div class="fee-config-section">
                        <div class="fee-config-title">
                            <i class="fa-solid fa-credit-card"></i>
                            CrÃ©dito
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
                            DÃ©bito
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
    
    const monthNames = ['Janeiro', 'Fevereiro', 'MarÃ§o', 'Abril', 'Maio', 'Junho', 
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
                        <div class="fees-summary-label">Total Vendas CartÃ£o</div>
                        <div class="fees-summary-value">${formatBRL(totalSales)}</div>
                    </div>
                </div>
                
                <div class="fees-summary-row">
                    <div class="fees-summary-card credito">
                        <div class="fees-summary-icon credito-icon">
                            <i class="fa-solid fa-arrow-up"></i>
                        </div>
                        <div class="fees-summary-content">
                            <div class="fees-summary-label">Vendas CrÃ©dito</div>
                            <div class="fees-summary-value">${formatBRL(creditoSales)}</div>
                        </div>
                    </div>
                    <div class="fees-summary-card taxa credito">
                        <div class="fees-summary-icon taxa-icon">
                            <i class="fa-solid fa-percent"></i>
                        </div>
                        <div class="fees-summary-content">
                            <div class="fees-summary-label">Taxa CrÃ©dito</div>
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
                            <div class="fees-summary-label">Vendas DÃ©bito</div>
                            <div class="fees-summary-value">${formatBRL(debitoSales)}</div>
                        </div>
                    </div>
                    <div class="fees-summary-card taxa debito">
                        <div class="fees-summary-icon taxa-icon">
                            <i class="fa-solid fa-percent"></i>
                        </div>
                        <div class="fees-summary-content">
                            <div class="fees-summary-label">Taxa DÃ©bito</div>
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
        countEl.textContent = `${transactionsWithFees.length} transaÃ§Ãµes`;
    }
    
    // Render transactions list
    const listEl = document.getElementById('feesTransactionsList');
    if (listEl) {
        if (transactionsWithFees.length === 0) {
            listEl.innerHTML = `
                <div class="fees-empty">
                    <i class="fa-solid fa-credit-card"></i>
                    <p>Nenhuma venda no cartÃ£o neste mÃªs</p>
                </div>
            `;
        } else {
            listEl.innerHTML = transactionsWithFees.map(t => {
                const typeLabel = t.paymentMethod === 'credito' ? 'CrÃ©dito' : 'DÃ©bito';
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
                <div class="ai-header-actions">
                    <button class="ai-action-btn ai-action-clear" onclick="clearAIConversation()" title="Limpar conversa">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                    <div class="ai-action-divider"></div>
                    <button class="ai-action-btn ai-action-close" onclick="closeAIChatModal()" title="Fechar">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="ai-chat-messages" id="aiChatMessages">
                <div class="ai-placeholder-wrap" id="aiPlaceholderWrap">
                    <div class="ai-placeholder-text" id="aiPlaceholderText">Como posso ajudar?</div>
                </div>
            </div>
            <div class="ai-chat-input-wrap">
                <input type="text" class="ai-chat-input" id="aiChatInput" 
                       placeholder="Pergunte qualquer coisa..." 
                       onkeypress="if(event.key==='Enter' && !aiIsResponding) sendAIMessage()">
                <button class="ai-chat-send" id="aiSendBtn" onclick="sendAIMessage()">
                    <i class="fa-solid fa-location-arrow"></i>
                </button>
                <button class="ai-chat-stop" id="aiStopBtn" onclick="stopAIResponse()" style="display: none;">
                    <i class="fa-solid fa-stop"></i>
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
            <div class="ai-message-bubble">
                ${aiResponse}
            </div>
        `;
        messagesContainer.appendChild(aiMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1200 + Math.random() * 800);
}

function getAIResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    // Get context from AppState (dados vem do backend)
    const transactions = AppState.transactions || [];
    const services = AppState.services || [];
    const products = AppState.products || [];
    const clients = AppState.clients || [];
    
    const today = new Date();
    const thisMonth = transactions.filter(t => {
        const d = new Date(t.date || t.data);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });
    const totalThisMonth = thisMonth.reduce((sum, t) => sum + (t.value || t.valor || 0), 0);
    
    // Simple keyword-based responses
    if (lowerMsg.includes('olÃ¡') || lowerMsg.includes('oi') || lowerMsg.includes('ola')) {
        return 'OlÃ¡! ðŸ˜Š Como posso ajudar vocÃª hoje?';
    }
    
    if (lowerMsg.includes('faturamento') || lowerMsg.includes('vendas') || lowerMsg.includes('quanto')) {
        return `ðŸ“Š <strong>Resumo do MÃªs</strong><br><br>
        Total de vendas: <strong>${thisMonth.length}</strong> transaÃ§Ãµes<br>
        Faturamento: <strong>${formatBRL(totalThisMonth)}</strong><br><br>
        Posso ajudar com mais alguma anÃ¡lise?`;
    }
    
    if (lowerMsg.includes('serviÃ§o') || lowerMsg.includes('servico')) {
        return `ðŸ’‡ VocÃª tem <strong>${services.length}</strong> serviÃ§os cadastrados.<br><br>
        Dica: Mantenha seus serviÃ§os atualizados com preÃ§os competitivos!`;
    }
    
    if (lowerMsg.includes('produto')) {
        return `ðŸ“¦ VocÃª tem <strong>${products.length}</strong> produtos cadastrados.<br><br>
        Dica: Controle o estoque para nÃ£o perder vendas!`;
    }
    
    if (lowerMsg.includes('cliente')) {
        const numClients = clients.length;
        return `👥 Você tem <strong>${numClients}</strong> clientes cadastrados.<br><br>
        Dica: Mantenha contato com seus clientes e envie promoções personalizadas!`;
    }
    
    if (lowerMsg.includes('ajuda') || lowerMsg.includes('help') || lowerMsg.includes('fazer')) {
        return `ðŸŽ¯ <strong>O que posso fazer:</strong><br><br>
        â€¢ Mostrar resumo de <strong>faturamento</strong><br>
        â€¢ Informar sobre <strong>clientes</strong><br>
        â€¢ Listar <strong>serviÃ§os</strong> e <strong>produtos</strong><br>
        â€¢ Dar <strong>dicas</strong> de gestÃ£o<br>
        â€¢ Responder <strong>dÃºvidas</strong> gerais<br><br>
        Ã‰ sÃ³ perguntar! ðŸ˜Š`;
    }
    
    if (lowerMsg.includes('dica') || lowerMsg.includes('sugestÃ£o') || lowerMsg.includes('sugestao')) {
        const tips = [
            'ðŸ’¡ <strong>Dica do dia:</strong> Agende lembretes para clientes que nÃ£o visitam hÃ¡ mais de 30 dias.',
            'ðŸ’¡ <strong>Dica do dia:</strong> OfereÃ§a combos de serviÃ§os para aumentar o ticket mÃ©dio.',
            'ðŸ’¡ <strong>Dica do dia:</strong> Mantenha fotos dos trabalhos para o portfÃ³lio do negÃ³cio.',
            'ðŸ’¡ <strong>Dica do dia:</strong> Analise seus horÃ¡rios de pico para otimizar a agenda.',
            'ðŸ’¡ <strong>Dica do dia:</strong> Fidelize clientes com programas de pontos ou descontos.'
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }
    
    if (lowerMsg.includes('obrigado') || lowerMsg.includes('obrigada') || lowerMsg.includes('valeu')) {
        return 'De nada! ðŸ˜Š Estou sempre aqui para ajudar. Qualquer dÃºvida, Ã© sÃ³ chamar!';
    }
    
    // Default responses
    const defaultResponses = [
        'Interessante! Me conta mais sobre o que vocÃª precisa? ðŸ¤”',
        'Entendi! Posso te ajudar com informaÃ§Ãµes sobre vendas, clientes, serviÃ§os ou produtos. O que prefere?',
        'Hmm, nÃ£o tenho certeza se entendi. Pode reformular a pergunta? ðŸ˜Š',
        'Boa pergunta! Para te dar uma resposta melhor, me diz se Ã© sobre vendas, clientes ou agenda.',
        'Estou aprendendo cada dia mais! Por enquanto, posso te ajudar com relatÃ³rios e informaÃ§Ãµes do sistema.'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function exportBackup() {
    // Exporta dados do AppState (que vem 100% do backend)
    const backupData = {
        version: 2,
        date: new Date().toISOString(),
        source: 'backend',
        data: {
            services: AppState.services || [],
            products: AppState.products || [],
            transactions: AppState.transactions || [],
            clients: AppState.clients || [],
            professionals: AppState.professionals || [],
            appointments: AppState.appointments || [],
            blocks: AppState.blocks || []
        },
        config: {
            theme: localStorage.getItem('nexus_theme'),
            language: localStorage.getItem('nexus_language'),
            db_url: localStorage.getItem('nexus_db_url')
        }
    };
    
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
    reader.onload = async function(e) {
        try {
            const backupData = JSON.parse(e.target.result);
            
            if (!backupData.data || typeof backupData.data !== 'object') {
                showToast('Arquivo de backup inválido', 'error');
                return;
            }
            
            if (!confirm('Isso irá substituir todos os dados atuais no backend. Deseja continuar?')) return;
            
            // V2: Importa para o backend
            if (backupData.version >= 2 && backupData.source === 'backend') {
                showToast('Importando dados para o backend...', 'info');
                
                // Import services
                if (backupData.data.services) {
                    for (const svc of backupData.data.services) {
                        await DB.serviceCreate(svc);
                    }
                }
                // Import products
                if (backupData.data.products) {
                    for (const prod of backupData.data.products) {
                        await DB.productCreate(prod);
                    }
                }
                // Import transactions
                if (backupData.data.transactions) {
                    for (const tx of backupData.data.transactions) {
                        await DB.cashCreate(tx);
                    }
                }
                
                // Restore config only
                if (backupData.config) {
                    if (backupData.config.theme) localStorage.setItem('nexus_theme', backupData.config.theme);
                    if (backupData.config.language) localStorage.setItem('nexus_language', backupData.config.language);
                }
                
                showToast('Backup importado com sucesso!', 'success');
                setTimeout(() => location.reload(), 1500);
            } else {
                // V1 legacy: apenas config local
                showToast('Backup antigo - importando apenas configurações', 'warning');
                if (backupData.data.nexus_theme) localStorage.setItem('nexus_theme', backupData.data.nexus_theme);
                if (backupData.data.nexus_language) localStorage.setItem('nexus_language', backupData.data.nexus_language);
                setTimeout(() => location.reload(), 1500);
            }
        } catch (err) {
            console.error('Backup import error:', err);
            showToast('Erro ao ler arquivo de backup', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// =============================================
