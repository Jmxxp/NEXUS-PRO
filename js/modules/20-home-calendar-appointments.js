// CLOCK
// =============================================

// Helper para encontrar ID do serviço pelo nome
function findServiceIdByName(serviceName) {
    if (!serviceName || !AppState.services) return null;
    const normalizedName = serviceName.toLowerCase().trim();
    const found = AppState.services.find(s => 
        (s.nome || '').toLowerCase().trim() === normalizedName
    );
    return found ? found.id : null;
}

function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const clockTime = document.getElementById('clockTime');
    const clockSeconds = document.getElementById('clockSeconds');
    const clockDate = document.getElementById('clockDate');
    const todayDate = document.getElementById('todayDate');
    const headerGreeting = document.getElementById('headerGreeting');
    const clientsCount = document.getElementById('clientsCount');
    const statToday = document.getElementById('statToday');
    const statTomorrow = document.getElementById('statTomorrow');
    const statWeek = document.getElementById('statWeek');
    
    const now = new Date();
    
    if (clockTime) {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        clockTime.textContent = `${hours}:${minutes}`;
    }
    
    if (clockSeconds) {
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockSeconds.textContent = `:${seconds}`;
    }
    
    if (todayDate) {
        const day = now.getDate();
        const month = getMonths()[now.getMonth()];
        if (currentLanguage === 'en') {
            todayDate.textContent = `${month} ${day}`;
        } else {
            todayDate.textContent = `${day} de ${month}`;
        }
    }
    
    if (headerGreeting) {
        const hour = now.getHours();
        let greeting;
        if (currentLanguage === 'en') {
            if (hour < 12) greeting = 'Good morning,';
            else if (hour < 18) greeting = 'Good afternoon,';
            else greeting = 'Good evening,';
        } else {
            if (hour < 12) greeting = 'Bom dia,';
            else if (hour < 18) greeting = 'Boa tarde,';
            else greeting = 'Boa noite,';
        }
        headerGreeting.textContent = greeting;
    }
    
    // User name in top bar
    const headerUserName = document.getElementById('headerUserName');
    if (headerUserName && AppState.currentUser) {
        headerUserName.textContent = AppState.currentUser.nome || AppState.currentUser.name || 'UsuÃ¡rio';
    }
    
    // Top bar stats
    const topStatConfirmed = document.getElementById('topStatConfirmed');
    const topStatPending = document.getElementById('topStatPending');
    const topStatClients = document.getElementById('topStatClients');
    
    if (AppState.appointments) {
        const todayStr = formatDate(now);
        const todayAppts = AppState.appointments.filter(a => a.date === todayStr && a.client !== 'BLOQUEADO' && !a.blocked);
        const confirmed = todayAppts.filter(a => a.confirmado || a.confirmed).length;
        const pending = todayAppts.filter(a => !a.confirmado && !a.confirmed).length;
        
        if (topStatConfirmed) topStatConfirmed.textContent = confirmed;
        if (topStatPending) topStatPending.textContent = pending;
    }
    
    if (topStatClients && AppState.clients) {
        topStatClients.textContent = AppState.clients.length;
    }
    
    if (clientsCount && AppState.clients) {
        clientsCount.textContent = AppState.clients.length;
    }
    
    if (clockDate) {
        const dayName = getWeekdays()[now.getDay()];
        const day = now.getDate();
        const month = getMonths()[now.getMonth()];
        const year = now.getFullYear();
        
        if (currentLanguage === 'en') {
            clockDate.textContent = `${dayName}, ${month} ${day}, ${year}`;
        } else {
            clockDate.textContent = `${dayName}, ${day} de ${month} de ${year}`;
        }
    }
    
    if (statToday && AppState.appointments) {
        const todayStr = formatDate(now);
        const todayCount = AppState.appointments.filter(a => 
            a.date === todayStr && a.client !== 'BLOQUEADO' && !a.blocked
        ).length;
        statToday.textContent = todayCount;
    }
    
    if (statTomorrow && AppState.appointments) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = formatDate(tomorrow);
        const tomorrowCount = AppState.appointments.filter(a => 
            a.date === tomorrowStr && a.client !== 'BLOQUEADO' && !a.blocked
        ).length;
        statTomorrow.textContent = tomorrowCount;
    }
    
    if (statWeek && AppState.appointments) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekCount = AppState.appointments.filter(a => {
            if (a.client === 'BLOQUEADO' || a.blocked) return false;
            const aptDate = new Date(a.date);
            return aptDate >= weekStart && aptDate <= weekEnd;
        }).length;
        statWeek.textContent = weekCount;
    }
}

// =============================================
// THEME
// =============================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        const savedTheme = localStorage.getItem('nexus_theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.checked = true;
        }
        
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem('nexus_theme', 'light');
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('nexus_theme', 'dark');
            }
        });
    }
}

// =============================================
// LANGUAGE SELECTOR
// =============================================

function initLanguageSelector() {
    document.querySelectorAll('.language-btn, .settings-lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            if (lang) {
                setLanguage(lang);
            }
        });
    });
}

// =============================================
// DATE SELECTORS & MINI CALENDAR
// =============================================

let miniCalDate = new Date(); // Separate date for mini calendar navigation

function initDateSelectors() {
    // Mini calendar navigation
    document.getElementById('miniCalPrev')?.addEventListener('click', () => changeMiniCalMonth(-1));
    document.getElementById('miniCalNext')?.addEventListener('click', () => changeMiniCalMonth(1));
    
    // Initialize mini calendar
    renderMiniCalendar();
}

function changeMiniCalMonth(delta) {
    miniCalDate.setMonth(miniCalDate.getMonth() + delta);
    renderMiniCalendar();
}

function renderMiniCalendar() {
    const monthEl = document.getElementById('miniCalMonth');
    const daysEl = document.getElementById('miniCalDays');
    if (!monthEl || !daysEl) return;
    
    const months = ['JANEIRO', 'FEVEREIRO', 'MARÃ‡O', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    
    monthEl.textContent = `${months[miniCalDate.getMonth()]} ${miniCalDate.getFullYear()}`;
    
    const year = miniCalDate.getFullYear();
    const month = miniCalDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const today = new Date();
    const selectedDate = AppState.calendarDate;
    
    // Build set of dates that have appointments this month
    const datesWithApts = new Set();
    AppState.appointments.forEach(apt => {
        if (apt.date && apt.client !== 'BLOQUEADO' && !apt.blocked) {
            datesWithApts.add(apt.date);
        }
    });
    
    // Get stats week range for highlighting (only when on stats screen)
    let statsWeekStart = null;
    let statsWeekEnd = null;
    const currentScreen = document.querySelector('.nav-item.active')?.dataset.screen;
    if (currentScreen === 'screen-stats' && AppState.statsPeriodType === 'week') {
        const { start, end } = getStatsPeriodRange();
        statsWeekStart = formatDate(start);
        statsWeekEnd = formatDate(end);
    }
    
    let html = '';
    
    // Previous month ghost days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        html += `<span class="mini-cal-day other-month">${day}</span>`;
    }
    
    // Current month days
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const isSelected = day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
        const isFutureOrToday = dateStr >= todayStr;
        const hasApts = datesWithApts.has(dateStr) && isFutureOrToday;
        const isInWeekRange = statsWeekStart && statsWeekEnd && dateStr >= statsWeekStart && dateStr <= statsWeekEnd;
        const isWeekStart = dateStr === statsWeekStart;
        const isWeekEnd = dateStr === statsWeekEnd;
        
        let classes = 'mini-cal-day';
        if (isToday) classes += ' today';
        if (isSelected && !isToday) classes += ' selected';
        if (hasApts) classes += ' has-appointments';
        if (isInWeekRange) classes += ' in-week-range';
        if (isWeekStart) classes += ' week-start';
        if (isWeekEnd) classes += ' week-end';
        
        html += `<button class="${classes}" data-date="${dateStr}">${day}</button>`;
    }
    
    // Next month ghost days to fill remaining cells (6 rows = 42 cells)
    const totalCells = firstDay + daysInMonth;
    const remainingCells = (42 - totalCells) % 7 || (totalCells <= 35 ? 7 : 0);
    for (let day = 1; day <= remainingCells; day++) {
        html += `<span class="mini-cal-day other-month">${day}</span>`;
    }
    
    daysEl.innerHTML = html;
    
    // Add click events
    daysEl.querySelectorAll('.mini-cal-day:not(.other-month)').forEach(btn => {
        btn.addEventListener('click', function() {
            const dateStr = this.dataset.date;
            if (dateStr) {
                const [y, m, d] = dateStr.split('-').map(Number);
                AppState.calendarDate = new Date(y, m - 1, d);
                renderCalendar();
                updateCalendarDateDisplay();
                renderMiniCalendar();
                switchScreen('screen-calendar');
            }
        });
    });
}

function changeCalendarPart(part, delta) {
    const date = AppState.calendarDate;
    if (part === 'day') {
        date.setDate(date.getDate() + delta);
    } else if (part === 'month') {
        date.setMonth(date.getMonth() + delta);
    } else if (part === 'year') {
        date.setFullYear(date.getFullYear() + delta);
    }
    renderCalendar();
    updateCalendarDateDisplay();
}

function goToToday() {
    AppState.calendarDate = new Date();
    renderCalendar();
    updateCalendarDateDisplay();
    showToast(t('todaySchedule'), 'success');
}

function updateCalendarDateDisplay() {
    const date = AppState.calendarDate;
    const weekdaysFull = ['DOMINGO', 'SEGUNDA', 'TERÃ‡A', 'QUARTA', 'QUINTA', 'SEXTA', 'SÃBADO'];
    const monthsFull = ['JANEIRO', 'FEVEREIRO', 'MARÃ‡O', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    
    // Big header display
    const bigDayEl = document.getElementById('calBigDay');
    const bigWeekdayEl = document.getElementById('calBigWeekday');
    const bigMonthEl = document.getElementById('calBigMonth');
    
    if (bigDayEl) bigDayEl.textContent = date.getDate();
    if (bigWeekdayEl) bigWeekdayEl.textContent = weekdaysFull[date.getDay()];
    if (bigMonthEl) bigMonthEl.textContent = `${monthsFull[date.getMonth()]} ${date.getFullYear()}`;
    
    // Update mini calendar to show selected date
    miniCalDate = new Date(date);
    renderMiniCalendar();
}

function openDatePicker() {
    const modal = document.getElementById('modal-date-picker');
    const daySelect = document.getElementById('datePickerDay');
    const monthSelect = document.getElementById('datePickerMonth');
    const yearSelect = document.getElementById('datePickerYear');
    
    if (!modal || !daySelect || !monthSelect || !yearSelect) return;
    
    const currentDate = AppState.calendarDate;
    const currentYear = new Date().getFullYear();
    
    // Populate days
    daySelect.innerHTML = '';
    for (let d = 1; d <= 31; d++) {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = String(d).padStart(2, '0');
        if (d === currentDate.getDate()) opt.selected = true;
        daySelect.appendChild(opt);
    }
    
    // Populate months
    const months = getMonths();
    monthSelect.innerHTML = '';
    months.forEach((m, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = m;
        if (i === currentDate.getMonth()) opt.selected = true;
        monthSelect.appendChild(opt);
    });
    
    // Populate years
    yearSelect.innerHTML = '';
    for (let y = currentYear - 2; y <= currentYear + 5; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        if (y === currentDate.getFullYear()) opt.selected = true;
        yearSelect.appendChild(opt);
    }
    
    openModal('modal-date-picker');
}

function confirmDatePicker() {
    const daySelect = document.getElementById('datePickerDay');
    const monthSelect = document.getElementById('datePickerMonth');
    const yearSelect = document.getElementById('datePickerYear');
    
    if (!daySelect || !monthSelect || !yearSelect) return;
    
    const day = parseInt(daySelect.value);
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearSelect.value);
    
    const newDate = new Date(year, month, day, 12, 0, 0);
    
    // Validate date
    if (newDate.getDate() !== day) {
        // Invalid date (e.g., Feb 30)
        showToast('Data invÃ¡lida', 'error');
        return;
    }
    
    AppState.calendarDate = newDate;
    renderCalendar();
    updateCalendarDateDisplay();
    closeModal('modal-date-picker');
}

function goToTodayFromPicker() {
    const today = new Date();
    AppState.calendarDate = today;
    renderCalendar();
    updateCalendarDateDisplay();
    closeModal('modal-date-picker');
    showToast(t('todaySchedule'), 'success');
}

// =============================================
// PROFESSIONALS TABS
// =============================================

function renderProfessionalsTabs() {
    const container = document.getElementById('professionalsTabs');
    if (!container) return;
    
    let html = `<button class="pro-btn ${AppState.selectedProfessional === null ? 'active' : ''}" data-pro-id="">
        ${t('all')}
    </button>`;
    
    AppState.agendadores.forEach(ag => {
        const name = ag.nome || ag.name || t('noName');
        const isActive = AppState.selectedProfessional === String(ag.id);
        
        html += `<button class="pro-btn ${isActive ? 'active' : ''}" data-pro-id="${ag.id}">
            ${name}
        </button>`;
    });
    
    container.innerHTML = html;
    
    container.querySelectorAll('.pro-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            const proId = this.dataset.proId;
            AppState.selectedProfessional = proId || null;
            
            container.querySelectorAll('.pro-btn').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            renderCalendar();
        });
    });
}

// =============================================
// HOME - UPCOMING
// =============================================

function renderUpcoming() {
    const container = document.getElementById('appointmentsList');
    if (!container) return;
    
    const today = new Date();
    const todayStr = formatDate(today);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatDate(tomorrow);
    
    let upcoming = AppState.appointments
        .filter(a => a.date >= todayStr && a.client !== 'BLOQUEADO' && !a.blocked)
        .sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        })
        .slice(0, 8);
    
    if (AppState.currentUser && AppState.currentUser.id > 0 && !AppState.currentUser.isAdmin) {
        const currentUserId = String(AppState.currentUser.id);
        upcoming = upcoming.filter(a => String(a.agendadorId) === currentUserId);
    }
    
    if (upcoming.length === 0) {
        container.innerHTML = `
            <div class="empty-state-premium">
                <div class="empty-icon">
                    <i class="fa-regular fa-calendar-check"></i>
                </div>
                <div class="empty-title">${t('noAppointments')}</div>
                <div class="empty-subtitle">Agenda livre para novos agendamentos</div>
            </div>
        `;
        renderMiniSchedule();
        renderRecentClients();
        renderBirthdays();
        renderWeekSummary();
        renderStatusWidget();
        return;
    }
    
    container.innerHTML = upcoming.map(apt => {
        const isToday = apt.date === todayStr;
        const isTomorrow = apt.date === tomorrowStr;
        const dayLabel = isToday ? t('today') : (isTomorrow ? t('tomorrow') : formatDateShort(apt.date));
        
        return `
            <div class="appointment-card ${!isToday ? 'tomorrow' : ''}" onclick="showAppointmentDetail('${apt.id}')">
                <div class="appointment-info">
                    <span class="appointment-client">${apt.client || t('client')}</span>
                    <span class="appointment-service">${apt.servico || t('service')}</span>
                    <span class="appointment-phone">${apt.phone || '-'}</span>
                </div>
                <div class="appointment-time">
                    <span class="appointment-day">${dayLabel}</span>
                    <span class="appointment-hour">${apt.time}</span>
                </div>
            </div>
        `;
    }).join('');
    
    renderMiniSchedule();
    renderRecentClients();
    renderBirthdays();
    renderWeekSummary();
    renderStatusWidget();
}

function renderStatusWidget() {
    const statusClients = document.getElementById('statusClients');
    const statusAppointments = document.getElementById('statusAppointments');
    
    if (statusClients && AppState.clients) {
        statusClients.textContent = AppState.clients.length;
    }
    
    if (statusAppointments && AppState.appointments) {
        const validAppts = AppState.appointments.filter(a => a.client !== 'BLOQUEADO' && !a.blocked);
        statusAppointments.textContent = validAppts.length;
    }
}

function renderMiniSchedule() {
    const container = document.getElementById('scheduleTimeline');
    if (!container) return;
    
    const today = new Date();
    const todayStr = formatDate(today);
    const currentTime = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
    
    const timeSlots = getTimeSlotsForDay(today);
    if (!timeSlots || timeSlots.length === 0) {
        container.innerHTML = `
            <div class="empty-state-premium">
                <div class="empty-icon"><i class="fa-regular fa-moon"></i></div>
                <div class="empty-title">${t('closedThisDay')}</div>
            </div>`;
        return;
    }
    
    const dayAppointments = AppState.appointments.filter(a => 
        a.date === todayStr && a.client && a.client !== 'BLOQUEADO' && !a.blocked
    ).sort((a, b) => a.time.localeCompare(b.time));
    
    if (dayAppointments.length === 0) {
        container.innerHTML = `
            <div class="empty-state-premium">
                <div class="empty-icon"><i class="fa-regular fa-calendar-check"></i></div>
                <div class="empty-title">Nenhum agendamento</div>
                <div class="empty-subtitle">Agenda livre para hoje</div>
            </div>`;
        return;
    }
    
    container.innerHTML = dayAppointments.map(apt => {
        const isPast = apt.time < currentTime;
        let classes = 'time-slot occupied';
        if (isPast) classes += ' past';
        
        const serviceName = apt.servico && apt.servico !== 'AlmoÃ§o' ? apt.servico : '';
        
        const phoneAttr = apt.phone ? apt.phone.replace(/\D/g, '') : '';
        const clientName = (apt.client || '').replace(/'/g, "\\'");
        
        return `
            <div class="${classes}" onclick="openClientFromSchedule('${phoneAttr}', '${clientName}')" style="cursor:pointer">
                <span class="slot-time">${apt.time}</span>
                <div class="slot-client-info">
                    <span class="slot-client">${apt.client?.substring(0, 25) || 'Cliente'}</span>
                    ${serviceName ? `<span class="slot-service">${serviceName}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderRecentClients() {
    const container = document.getElementById('recentClients');
    if (!container) return;
    
    // Update clients count
    const clientsCount = document.getElementById('clientsCount');
    if (clientsCount) {
        clientsCount.textContent = AppState.clients.length;
    }
    
    const clients = AppState.clients.slice(0, 5);
    
    if (clients.length === 0) {
        container.innerHTML = `
            <div class="empty-state-premium">
                <div class="empty-icon">
                    <i class="fa-regular fa-user"></i>
                </div>
                <div class="empty-title">${t('noClients')}</div>
                <div class="empty-subtitle">Adicione seu primeiro cliente</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = clients.map(client => {
        const initials = client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const totalAtend = client.totalAgendamentos || getClientAppointmentCount(client.phone);
        
        return `
            <div class="client-mini" onclick="openClientDetail('${client.phone}')">
                <div class="client-avatar">${initials}</div>
                <div class="client-info">
                    <span class="client-name">${client.name}</span>
                    <span class="client-visits">${totalAtend} ${t('appointmentsCount').toLowerCase()}</span>
                </div>
                <button class="btn-icon-sm" onclick="event.stopPropagation(); openWhatsApp('${client.phone}')">
                    <i class="fab fa-whatsapp"></i>
                </button>
            </div>
        `;
    }).join('');
}

function parseBirthdayDayMonth(dateStr) {
    if (!dateStr) return null;
    // YYYY-MM-DD (from date input)
    if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts.length >= 3) return { day: parseInt(parts[2]), month: parseInt(parts[1]), year: parseInt(parts[0]) };
    }
    // DD/MM/YYYY (from backend)
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length >= 2) return { day: parseInt(parts[0]), month: parseInt(parts[1]), year: parts[2] ? parseInt(parts[2]) : 0 };
    }
    return null;
}

function renderBirthdays() {
    const container = document.getElementById('birthdaysList');
    if (!container) return;
    
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
    
    // Find clients with birthdays today
    const birthdaysToday = AppState.clients.filter(client => {
        const bday = client.birthday || AppState.clientData[client.phone]?.birthday || '';
        const parsed = parseBirthdayDayMonth(bday);
        if (!parsed) return false;
        return parsed.day === todayDay && parsed.month === todayMonth;
    });
    
    if (birthdaysToday.length === 0) {
        container.innerHTML = `
            <div class="birthday-empty">
                <i class="fa-regular fa-face-smile"></i>
                <span>Nenhum aniversariante hoje</span>
            </div>
        `;
        return;
    }
    
    container.innerHTML = birthdaysToday.map(client => {
        const initials = client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const bday = client.birthday || AppState.clientData[client.phone]?.birthday || '';
        const parsed = parseBirthdayDayMonth(bday);
        let age = '';
        if (parsed && parsed.year > 1900) {
            age = `Completa ${today.getFullYear() - parsed.year} anos`;
        }
        
        return `
            <div class="birthday-item">
                <div class="birthday-avatar">${initials}</div>
                <div class="birthday-info">
                    <span class="birthday-name">${client.name}</span>
                    <span class="birthday-age">${age}</span>
                </div>
                <button class="birthday-action" onclick="sendBirthdayMessage('${client.phone}', '${client.name}')" title="Enviar parabÃ©ns">
                    <i class="fab fa-whatsapp"></i>
                </button>
            </div>
        `;
    }).join('');
}

function sendBirthdayMessage(phone, name) {
    const firstName = name.split(' ')[0];
    const defaultMsg = `ðŸŽ‚ Feliz aniversÃ¡rio, ${firstName}! ðŸŽ‰\n\nDesejamos a vocÃª um dia muito especial, cheio de alegria e realizaÃ§Ãµes!\n\nUm abraÃ§o da equipe!`;
    let saved = localStorage.getItem('nexus_birthday_message') || '';
    const message = saved ? saved.replace(/{nome}/gi, firstName) : defaultMsg;
    const url = `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function openBirthdayConfig() {
    const saved = localStorage.getItem('nexus_birthday_message') || '';
    document.getElementById('birthdayMessageInput').value = saved;
    openModal('modal-birthday-config');
}

function saveBirthdayMessage() {
    const msg = document.getElementById('birthdayMessageInput').value.trim();
    if (msg) {
        localStorage.setItem('nexus_birthday_message', msg);
    } else {
        localStorage.removeItem('nexus_birthday_message');
    }
    closeModal('modal-birthday-config');
    showToast('Mensagem de aniversÃ¡rio salva!', 'success');
}

function renderWeekSummary() {
    const container = document.getElementById('weekSummary');
    const weekRangeEl = document.getElementById('weekRange');
    if (!container) return;
    
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Get start of week (Monday = index 1)
    const weekStart = new Date(today);
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    weekStart.setDate(today.getDate() + diff);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    // Update week range text
    if (weekRangeEl) {
        const startDay = weekStart.getDate();
        const endDay = weekEnd.getDate();
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        weekRangeEl.textContent = `${startDay} - ${endDay} ${months[weekEnd.getMonth()]}`;
    }
    
    const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'SÃ¡b', 'Dom'];
    const weekData = [];
    let maxAppts = 0;
    
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + i);
        const dateStr = formatDate(dayDate);
        
        const dayAppts = AppState.appointments.filter(a => 
            a.date === dateStr && a.client !== 'BLOQUEADO' && !a.blocked
        );
        
        const isToday = formatDate(today) === dateStr;
        if (dayAppts.length > maxAppts) maxAppts = dayAppts.length;
        
        weekData.push({
            name: dayNames[i],
            count: dayAppts.length,
            isToday
        });
    }
    
    const scaleMax = 30;
    const scaleSteps = [0, 10, 20, 30];
    
    // Build Y-axis labels
    const yLabels = scaleSteps.slice().reverse().map(v => 
        `<span class="axis-label">${v}</span>`
    ).join('');
    
    // Build bars
    const barsHtml = weekData.map(day => {
        const heightPercent = scaleMax > 0 ? (day.count / scaleMax) * 100 : 0;
        const barHeight = day.count > 0 ? Math.max(heightPercent, 3) : 0;
        
        return `
            <div class="week-bar-col">
                <div class="week-bar-wrapper">
                    <div class="week-bar has-data ${day.isToday ? 'today' : ''}" style="height: ${barHeight}%">
                        ${day.count > 0 ? `<span class="bar-value">${day.count}</span>` : ''}
                    </div>
                </div>
                <span class="week-bar-label ${day.isToday ? 'today' : ''}">${day.name}</span>
            </div>
        `;
    }).join('');
    
    // Stats
    const total = weekData.reduce((sum, d) => sum + d.count, 0);
    const avg = (total / 7).toFixed(1);
    let bestDay = weekData[0];
    weekData.forEach(d => { if (d.count > bestDay.count) bestDay = d; });
    const bestDayText = bestDay.count > 0 ? bestDay.name : '-';
    
    container.innerHTML = `
        <div class="week-chart-container">
            <div class="week-chart-axis">
                ${yLabels}
            </div>
            <div class="week-chart">
                ${barsHtml}
            </div>
        </div>
    `;
    
    const elTotal = document.getElementById('weekStatTotal');
    const elBest = document.getElementById('weekStatBest');
    const elAvg = document.getElementById('weekStatAvg');
    if (elTotal) elTotal.textContent = total;
    if (elBest) elBest.textContent = bestDayText;
    if (elAvg) elAvg.textContent = avg;
}

// =============================================
// CALENDAR
// =============================================

function renderCalendar() {
    const container = document.getElementById('calendarGrid');
    if (!container) return;
    
    const date = AppState.calendarDate;
    const dateStr = formatDate(date);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateOnly = new Date(date);
    selectedDateOnly.setHours(0, 0, 0, 0);
    const isPastDay = selectedDateOnly < today;
    const isToday = selectedDateOnly.getTime() === today.getTime();
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    updateCalendarDateDisplay();
    
    const timeSlots = getTimeSlotsForDay(date);
    
    if (timeSlots === null) {
        container.innerHTML = `
            <div class="empty-state-premium" style="padding: 60px;">
                <div class="empty-icon"><i class="fa-solid fa-triangle-exclamation" style="color: var(--warning);"></i></div>
                <div class="empty-title">${t('timesNotConfigured')}</div>
                <div class="empty-subtitle">Configure os horÃ¡rios no painel</div>
            </div>
        `;
        return;
    }
    
    if (timeSlots.length === 0) {
        container.innerHTML = `
            <div class="empty-state-premium" style="padding: 60px;">
                <div class="empty-icon"><i class="fa-solid fa-door-closed"></i></div>
                <div class="empty-title">${t('closedThisDay')}</div>
                <div class="empty-subtitle">Estabelecimento fechado</div>
            </div>
        `;
        return;
    }
    
    const dayAppointments = AppState.appointments.filter(a => a.date === dateStr);
    
    let agendadores = AppState.agendadores;
    if (AppState.selectedProfessional) {
        agendadores = AppState.agendadores.filter(ag => String(ag.id) === AppState.selectedProfessional);
    }
    
    if (!agendadores || agendadores.length === 0) {
        container.innerHTML = `
            <div class="empty-state-premium" style="padding: 60px;">
                <div class="empty-icon"><i class="fa-regular fa-calendar-xmark"></i></div>
                <div class="empty-title">Nenhum profissional</div>
                <div class="empty-subtitle">Cadastre profissionais no painel</div>
            </div>
        `;
        return;
    }
    
    const numCols = agendadores.length;
    container.style.setProperty('--cols', numCols);
    
    // Adicionar scroll horizontal se muitos profissionais
    const calendarWrapper = container.parentElement;
    if (numCols > 5) {
        calendarWrapper.style.overflowX = 'auto';
        container.style.minWidth = `${numCols * 140}px`;
    } else {
        calendarWrapper.style.overflowX = '';
        container.style.minWidth = '';
    }
    
    let html = '';
    
    // Header row
    html += '<div class="calendar-header-row-premium" style="--cols: ' + numCols + ';">';
    html += '<div class="cal-cell time-header"></div>';
    agendadores.forEach(ag => {
        const agName = ag.nome || ag.name || 'N/A';
        const bloqueado = ag.bloqueado || false;
        html += `<div class="cal-cell header">${agName.toUpperCase()}${bloqueado ? ' <i class="fa-solid fa-lock"></i>' : ''}</div>`;
    });
    html += '</div>';
    
    // Find next upcoming time slot for today
    let nextTimeSlot = null;
    if (isToday) {
        for (const slot of timeSlots) {
            if (slot >= currentTime) {
                nextTimeSlot = slot;
                break;
            }
        }
    }
    
    // Time rows
    timeSlots.forEach(time => {
        const isPastTime = isToday && time < currentTime;
        const isNextSlot = time === nextTimeSlot;
        
        html += `<div class="calendar-row-premium" style="--cols: ${numCols};">`;
        const timeColClass = isNextSlot ? 'cal-cell time-col current-time' : 'cal-cell time-col';
        html += `<div class="${timeColClass}">${time}</div>`;
        
        agendadores.forEach(ag => {
            const agIdStr = String(ag.id);
            const apt = dayAppointments.find(a => a.time === time && String(a.agendadorId) === agIdStr);
            
            const estaBloqueado = ag.bloqueado || false;
            const almocoInicio = ag.almocoInicio || '';
            const almocoFim = ag.almocoFim || '';
            const isLunchTime = almocoInicio && almocoFim && time >= almocoInicio && time < almocoFim;
            const isLunchBlock = apt && apt.servico === 'AlmoÃ§o';
            
            const pastClass = isPastTime ? ' past' : '';
            
            if (estaBloqueado && !apt) {
                html += `<div class="cal-cell blocked${pastClass}"><i class="fa-solid fa-lock"></i></div>`;
            } else if (apt) {
                if (isLunchBlock) {
                    html += `<div class="cal-cell lunch${pastClass}" onclick="showAppointmentDetail('${apt.id}')"><i class="fa-solid fa-utensils"></i></div>`;
                } else if (apt.client === 'BLOQUEADO' || apt.blocked) {
                    html += `<div class="cal-cell blocked${pastClass}" onclick="showAppointmentDetail('${apt.id}')"><i class="fa-solid fa-ban"></i></div>`;
                } else {
                    const clientName = apt.client?.substring(0, 20) || t('client');
                    const serviceName = apt.servico?.substring(0, 25) || '';
                    html += `<div class="cal-cell occupied${pastClass}" onclick="showAppointmentDetail('${apt.id}')">
                        <span class="client-name">${clientName}</span>
                        ${serviceName ? `<span class="service-name">${serviceName}</span>` : ''}
                    </div>`;
                }
            } else if (isLunchTime) {
                html += `<div class="cal-cell lunch${pastClass}"><i class="fa-solid fa-utensils"></i></div>`;
            } else if (isPastDay || isPastTime) {
                html += `<div class="cal-cell free past"></div>`;
            } else {
                html += `<div class="cal-cell free" onclick="openNewAppointment('${dateStr}', '${time}', '${ag.id}')">+</div>`;
            }
        });
        
        html += '</div>';
    });
    
    container.innerHTML = html;
}

function getTimeSlotsForDay(date) {
    const dayNames = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const dayName = dayNames[date.getDay()];
    
    if (!AppState.horarios) return null;
    if (!AppState.horarios[dayName]) return null;
    
    const dayHours = AppState.horarios[dayName];
    const abre = dayHours.abre;
    const fecha = dayHours.fecha;
    
    if (abre === '00:00' && fecha === '00:00') return [];
    
    return generateTimeSlots(abre, fecha);
}

function generateTimeSlots(startTime, endTime) {
    const slots = [];
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    let currentH = startH;
    let currentM = startM;
    
    while (currentH < endH || (currentH === endH && currentM < endM)) {
        slots.push(`${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`);
        currentM += 30;
        if (currentM >= 60) {
            currentM = 0;
            currentH++;
        }
    }
    
    return slots;
}

// =============================================
// APPOINTMENTS
// =============================================

function openNewAppointment(date, time, agendadorId) {
    if (isVisitor()) {
        showToast(t('viewModeNoCreate'), 'error');
        return;
    }
    
    const ag = AppState.agendadores.find(a => String(a.id) === String(agendadorId));
    const agName = ag?.nome || ag?.name || t('professionalFallback');
    
    document.getElementById('appointmentDate').value = date;
    document.getElementById('appointmentTime').value = time;
    document.getElementById('appointmentProfessional').value = agendadorId;
    document.getElementById('appointmentProfessionalName').textContent = agName;
    
    // Format date/time display
    const dateDisplay = formatDateBR(date) + ' Ã s ' + time;
    document.getElementById('appointmentDateTimeDisplay').textContent = dateDisplay;
    
    document.getElementById('appointmentClient').value = '';
    document.getElementById('appointmentPhone').value = '';
    document.getElementById('appointmentService').value = '';
    document.getElementById('appointmentNotes').value = '';
    document.getElementById('appointmentCpf').value = '';
    document.getElementById('appointmentBirthday').value = '';
    
    // Hide history badge and suggestions
    document.getElementById('clientHistoryBadge').style.display = 'none';
    const sugEl = document.getElementById('clientSuggestions');
    sugEl.classList.remove('show');
    sugEl.innerHTML = '';
    
    // Hide service suggestions
    const serviceSugEl = document.getElementById('serviceSuggestions');
    if (serviceSugEl) {
        serviceSugEl.classList.remove('show');
        serviceSugEl.innerHTML = '';
    }
    
    openModal('modal-new-appointment');
    
    // Initialize service autocomplete
    initServiceAutocomplete();
    
    setTimeout(() => {
        document.getElementById('appointmentClient').focus();
    }, 100);
}

async function saveNewAppointment() {
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const agendadorId = document.getElementById('appointmentProfessional').value;
    const client = document.getElementById('appointmentClient').value.trim();
    const phone = document.getElementById('appointmentPhone').value.trim();
    const service = document.getElementById('appointmentService').value.trim();
    const notes = document.getElementById('appointmentNotes').value.trim();
    const cpf = document.getElementById('appointmentCpf').value.trim();
    const birthday = document.getElementById('appointmentBirthday').value;
    
    if (!client) {
        showToast(t('fillNamePhone'), 'error');
        return;
    }
    
    // Block past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date + 'T00:00:00');
    if (selectedDate < today) {
        showToast('NÃ£o Ã© possÃ­vel agendar em datas passadas', 'error');
        return;
    }
    
    const ag = AppState.agendadores.find(a => String(a.id) === String(agendadorId));
    const agName = ag?.nome || ag?.name || t('professionalFallback');
    
    const btn = document.getElementById('btnSaveAppointment');
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="loading-spinner"></div>';
    setModalBusy('modal-new-appointment', true);
    
    // Save client data (CPF/birthday) if provided
    if (phone && (cpf || birthday)) {
        if (!AppState.clientData) AppState.clientData = {};
        AppState.clientData[phone] = {
            cpf: cpf || (AppState.clientData[phone]?.cpf || ''),
            birthday: birthday || (AppState.clientData[phone]?.birthday || '')
        };
        try { localStorage.setItem('nexus_client_data', JSON.stringify(AppState.clientData)); } catch(e) {}
    }
    
    const result = await DB.create({
        date,
        time,
        client,
        phone: phone || '',
        servico: service || '',
        servicoId: findServiceIdByName(service),
        observacoes: notes || '',
        agendadorId,
        agendador: agName,
        blocked: false
    });
    
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    setModalBusy('modal-new-appointment', false);
    
    if (result.ok) {
        closeModal('modal-new-appointment');
        showToast(t('scheduled'), 'success');
        
        // Auto-create client if doesn't exist
        const key = phone ? phone.replace(/\D/g, '') : '';
        let clientExists = false;
        
        if (key && AppState.knownClients.has(key)) {
            clientExists = true;
        } else {
            for (const [k, c] of AppState.knownClients) {
                if (c.name && c.name.toUpperCase() === client.toUpperCase()) {
                    clientExists = true;
                    break;
                }
            }
        }
        
        if (!clientExists && client) {
            const newKey = key || client.replace(/\s/g, '_').toUpperCase();
            AppState.knownClients.set(newKey, { name: client, phone: phone || '', totalAgendamentos: 1 });
            await DB.cadastrarCliente({ nome: client, telefone: phone || '', cpf: cpf || '', aniversario: birthday || '' });
        }
        
        await loadAllData();
    } else {
        showToast(result.err || t('failedToSchedule'), 'error');
    }
}

async function blockTimeSlot() {
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const agendadorId = document.getElementById('appointmentProfessional').value;
    
    // Block past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date + 'T00:00:00');
    if (selectedDate < today) {
        showToast('NÃ£o Ã© possÃ­vel bloquear datas passadas', 'error');
        return;
    }
    
    const ag = AppState.agendadores.find(a => String(a.id) === String(agendadorId));
    const agName = ag?.nome || ag?.name || t('professionalFallback');
    
    const btn = document.getElementById('btnBlockTime');
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="loading-spinner"></div>';
    
    const result = await DB.create({
        date,
        time,
        client: 'BLOQUEADO',
        phone: '',
        servico: t('blockedTime'),
        agendadorId,
        agendador: agName,
        blocked: true
    });
    
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    
    if (result.ok) {
        closeModal('modal-new-appointment');
        showToast(t('blocked'), 'success');
        await loadAllData();
    } else {
        showToast(result.err || t('failedToBlock'), 'error');
    }
}

// =============================================
// CLIENT SUGGESTIONS (Appointment Modal)
// =============================================

function searchClientSuggestions() {
    const name = document.getElementById('appointmentClient').value.trim().toLowerCase();
    const suggestionsContainer = document.getElementById('clientSuggestions');
    
    if (!name || name.length < 2) {
        suggestionsContainer.classList.remove('show');
        suggestionsContainer.innerHTML = '';
        return;
    }
    
    const matches = [];
    for (const [key, client] of AppState.knownClients) {
        if (client.name && client.name.toLowerCase().includes(name)) {
            const count = getClientAppointmentCount(client.phone);
            matches.push({ ...client, key, count });
        }
    }
    
    if (matches.length === 0) {
        suggestionsContainer.classList.remove('show');
        suggestionsContainer.innerHTML = '';
        return;
    }
    
    matches.sort((a, b) => b.count - a.count);
    const limited = matches.slice(0, 6);
    
    suggestionsContainer.innerHTML = limited.map(client => {
        const safeName = (client.name || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const safePhone = (client.phone || '').replace(/'/g, "\\'");
        return `
        <div class="client-suggestion-item" onclick="selectClientSuggestion('${safeName}', '${safePhone}')">
            <div class="client-suggestion-name">${client.name}</div>
            <div class="client-suggestion-info">
                <span class="client-suggestion-phone">${client.phone || '-'}</span>
                <span class="client-suggestion-count">${client.count} atendimento${client.count !== 1 ? 's' : ''}</span>
            </div>
        </div>`;
    }).join('');
    
    suggestionsContainer.classList.add('show');
}

function selectClientSuggestion(name, phone) {
    document.getElementById('appointmentClient').value = name;
    document.getElementById('appointmentPhone').value = phone;
    document.getElementById('clientSuggestions').classList.remove('show');
    
    // Load CPF and birthday if available
    const clientData = (AppState.clientData || {})[phone] || {};
    document.getElementById('appointmentCpf').value = clientData.cpf || '';
    document.getElementById('appointmentBirthday').value = clientData.birthday || '';
    
    // Also check knownClients for extra data
    const cleanPhone = phone.replace(/\D/g, '');
    const known = AppState.knownClients.get(cleanPhone);
    if (known) {
        if (!clientData.cpf && known.cpf) document.getElementById('appointmentCpf').value = known.cpf;
        if (!clientData.birthday && known.aniversario) document.getElementById('appointmentBirthday').value = known.aniversario;
    }
    
    searchClientHistory();
}

function searchClientHistory() {
    const phone = document.getElementById('appointmentPhone').value.trim();
    const badge = document.getElementById('clientHistoryBadge');
    const countEl = document.getElementById('clientHistoryCount');
    
    if (!phone || phone.length < 8) {
        badge.style.display = 'none';
        return;
    }
    
    const cleanPhone = phone.replace(/\D/g, '');
    
    const count = AppState.appointments.filter(a => {
        const aptPhone = (a.phone || '').replace(/\D/g, '');
        return aptPhone === cleanPhone || aptPhone.endsWith(cleanPhone) || cleanPhone.endsWith(aptPhone);
    }).length;
    
    const client = AppState.knownClients.get(cleanPhone);
    
    if (count > 0 || client) {
        countEl.textContent = count;
        badge.style.display = 'flex';
        
        // Auto-fill name if known client and field is empty
        if (client && !document.getElementById('appointmentClient').value.trim()) {
            document.getElementById('appointmentClient').value = client.name;
        }
        
        // Load CPF/birthday if available
        const clientData = (AppState.clientData || {})[client?.phone || phone] || {};
        if (clientData.cpf && !document.getElementById('appointmentCpf').value) {
            document.getElementById('appointmentCpf').value = clientData.cpf;
        }
        if (clientData.birthday && !document.getElementById('appointmentBirthday').value) {
            document.getElementById('appointmentBirthday').value = clientData.birthday;
        }
    } else {
        badge.style.display = 'none';
    }
}

// FunÃ§Ã£o removida - duplicada na linha 3082 com implementaÃ§Ã£o melhor
// (usa match exato e exclui bloqueios)

function formatCPF(input) {
    let v = input.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    input.value = v;
}

// ValidaÃ§Ã£o de dÃ­gitos verificadores do CPF
function validateCPF(cpf) {
    if (!cpf) return true; // CPF opcional
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return false;
    
    // Verifica se todos os dÃ­gitos sÃ£o iguais (invÃ¡lido)
    if (/^(\d)\1{10}$/.test(cleaned)) return false;
    
    // Calcula primeiro dÃ­gito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    
    // Calcula segundo dÃ­gito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    
    return parseInt(cleaned.charAt(9)) === digit1 && parseInt(cleaned.charAt(10)) === digit2;
}

function formatNameCapitalize(input) {
    const pos = input.selectionStart;
    input.value = input.value.replace(/\b\w/g, c => c.toUpperCase());
    input.setSelectionRange(pos, pos);
}

// Close suggestions on outside click
document.addEventListener('click', function(e) {
    const suggestionsEl = document.getElementById('clientSuggestions');
    if (suggestionsEl && !e.target.closest('.input-with-suggestions')) {
        suggestionsEl.classList.remove('show');
    }
});

// =============================================
// APPOINTMENT DETAIL (Enhanced)
// =============================================

function showAppointmentDetail(id) {
    const apt = AppState.appointments.find(a => String(a.id) === String(id));
    if (!apt) return;
    
    const isLunch = apt.servico === 'AlmoÃ§o';
    const isBlocked = apt.client === 'BLOQUEADO' || apt.blocked;
    
    // Check permissions
    const isAdmin = AppState.currentUser && (AppState.currentUser.isAdmin || AppState.currentUser.id === 0);
    const isOwner = AppState.currentUser && String(AppState.currentUser.id) === String(apt.agendadorId);
    const canEdit = (isAdmin || isOwner) && !isVisitor();
    
    // Get professional name
    let agendadorName = apt.agendador || '-';
    if ((!agendadorName || agendadorName === '-') && apt.agendadorId) {
        const ag = AppState.agendadores.find(a => String(a.id) === String(apt.agendadorId));
        if (ag) agendadorName = ag.nome || ag.name || '-';
    }
    
    // Get client CPF, birthday and appointment count
    let clientCpf = '';
    let clientBirthday = '';
    let aptCount = 0;
    if (apt.phone) {
        const clientData = (AppState.clientData || {})[apt.phone] || {};
        const cleanPhone = apt.phone.replace(/\D/g, '');
        const clientInfo = AppState.knownClients.get(cleanPhone);
        clientCpf = clientData.cpf || clientInfo?.cpf || '';
        clientBirthday = clientData.birthday || clientInfo?.aniversario || '';
        aptCount = clientInfo?.totalAgendamentos || getClientAppointmentCount(apt.phone);
    }
    
    // Set hidden fields
    document.getElementById('detailId').value = id;
    document.getElementById('detailPhoneOriginal').value = apt.phone || '';
    
    // Header
    document.getElementById('detailClientName').textContent = isLunch ? 'ALMOÃ‡O' : (isBlocked ? 'BLOQUEADO' : (apt.client || '-'));
    document.getElementById('detailServiceName').textContent = isLunch ? 'HorÃ¡rio de almoÃ§o' : (isBlocked ? 'HorÃ¡rio bloqueado' : (apt.servico || '-'));
    document.getElementById('detailAptCount').textContent = `${aptCount} agendamento${aptCount !== 1 ? 's' : ''}`;
    
    // Editable fields
    document.getElementById('detailClientInput').value = isBlocked ? '' : (apt.client || '');
    document.getElementById('detailPhoneInput').value = isBlocked ? '' : (apt.phone || '');
    document.getElementById('detailCpfInput').value = clientCpf;
    document.getElementById('detailBirthdayInput').value = clientBirthday;
    
    // Read-only fields
    document.getElementById('detailDate').textContent = formatDateBR(apt.date);
    document.getElementById('detailTime').textContent = apt.time || '-';
    document.getElementById('detailProfessional').textContent = agendadorName;
    
    // Show/hide buttons based on permission
    const btnDelete = document.getElementById('btnDeleteApt');
    const btnSave = document.getElementById('btnSaveAptChanges');
    if (btnDelete) btnDelete.style.display = canEdit ? 'flex' : 'none';
    if (btnSave) btnSave.style.display = canEdit && !isBlocked && !isLunch ? 'flex' : 'none';
    
    // Disable inputs for blocked/lunch or no permission
    const inputs = ['detailClientInput', 'detailPhoneInput', 'detailCpfInput', 'detailBirthdayInput'];
    inputs.forEach(inputId => {
        const el = document.getElementById(inputId);
        if (el) el.disabled = !canEdit || isBlocked || isLunch;
    });
    
    openModal('modal-appointment-detail');
}

async function saveAppointmentChanges() {
    const id = document.getElementById('detailId').value;
    const apt = AppState.appointments.find(a => String(a.id) === String(id));
    if (!apt) return;
    
    const newClient = document.getElementById('detailClientInput').value.trim();
    const newPhone = document.getElementById('detailPhoneInput').value.trim();
    const newCpf = document.getElementById('detailCpfInput').value.trim();
    const newBirthday = document.getElementById('detailBirthdayInput').value;
    
    if (!newClient) {
        showToast(t('fillNamePhone'), 'error');
        return;
    }
    
    const btn = document.getElementById('btnSaveAptChanges');
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="loading-spinner"></div>';
    setModalBusy('modal-appointment-detail', true);
    
    // Update appointment
    const result = await DB.update({
        id,
        client: newClient,
        phone: newPhone
    });
    
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    setModalBusy('modal-appointment-detail', false);
    
    if (result.ok) {
        // Save CPF/birthday locally
        if (newPhone && (newCpf || newBirthday)) {
            if (!AppState.clientData) AppState.clientData = {};
            AppState.clientData[newPhone] = {
                cpf: newCpf || '',
                birthday: newBirthday || ''
            };
            try { localStorage.setItem('nexus_client_data', JSON.stringify(AppState.clientData)); } catch(e) {}
        }
        
        // Update client in backend if name/phone changed
        if (newPhone) {
            const cleanPhone = newPhone.replace(/\D/g, '');
            const clientInfo = AppState.knownClients.get(cleanPhone);
            if (clientInfo) {
                try {
                    await DB.atualizarCliente({ telefone: newPhone, nome: newClient, cpf: newCpf, aniversario: newBirthday });
                } catch(e) {}
            }
        }
        
        closeModal('modal-appointment-detail');
        showToast(t('saveSuccess'), 'success');
        await loadAllData();
    } else {
        showToast(result.err || t('saveError'), 'error');
    }
}

function confirmDeleteAppointment() {
    const id = document.getElementById('detailId').value;
    const apt = AppState.appointments.find(a => String(a.id) === String(id));
    if (!apt) return;
    
    // Block deletion of past appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aptDate = new Date(apt.date + 'T00:00:00');
    
    if (aptDate < today) {
        showToast('NÃ£o Ã© possÃ­vel excluir agendamentos de datas passadas', 'error');
        return;
    }
    
    const isBlocked = apt.client === 'BLOQUEADO' || apt.blocked;
    const isLunch = apt.servico === 'AlmoÃ§o';
    
    document.getElementById('confirmCancelAptId').value = id;
    
    if (isBlocked) {
        document.getElementById('confirmCancelTitle').textContent = 'Desbloquear HorÃ¡rio?';
        document.getElementById('confirmCancelDesc').textContent = `${formatDateBR(apt.date)} Ã s ${apt.time}`;
    } else if (isLunch) {
        document.getElementById('confirmCancelTitle').textContent = 'Remover AlmoÃ§o?';
        document.getElementById('confirmCancelDesc').textContent = `${formatDateBR(apt.date)} Ã s ${apt.time}`;
    } else {
        document.getElementById('confirmCancelTitle').textContent = 'Cancelar Agendamento?';
        document.getElementById('confirmCancelDesc').textContent = `${apt.client || 'Cliente'}: ${formatDateBR(apt.date)} Ã s ${apt.time}`;
    }
    
    closeModal('modal-appointment-detail');
    openModal('modal-confirm-cancel');
}

async function executeConfirmedDelete() {
    const id = document.getElementById('confirmCancelAptId').value;
    
    AppState.pendingDeletions.add(String(id));
    
    const result = await DB.delete(id);
    
    if (result.ok) {
        closeModal('modal-confirm-cancel');
        showToast(t('appointmentCancelled'), 'success');
        await loadAllData();
    } else {
        showToast(result.err || t('deleteError'), 'error');
    }
    
    AppState.pendingDeletions.delete(String(id));
}

// =============================================
