// SCRIPT BUILDER
// =============================================

const SCRIPT_BUILDER_STORAGE_KEY = 'nexus_script_builder_config';
const SCRIPT_BUILDER_ACCESS_PASSWORD = '36491209';
const SCRIPT_BUILDER_DAYS = [
  { key: 'segunda', label: 'SEGUNDA' },
  { key: 'terca', label: 'TERÇA' },
  { key: 'quarta', label: 'QUARTA' },
  { key: 'quinta', label: 'QUINTA' },
  { key: 'sexta', label: 'SEXTA' },
  { key: 'sabado', label: 'SÁBADO' },
  { key: 'domingo', label: 'DOMINGO' }
];
const SCRIPT_BUILDER_EMPTY_SCRIPT = [
  '// Configure o administrador, os agendadores e os horários para gerar o Apps Script v4.0.',
  '//',
  '// Este script inclui:',
  '// - Agendamentos com duração e serviços',
  '// - Clientes, Serviços, Produtos',
  '// - Caixa (movimentações financeiras)',
  '// - Bloqueios de agenda',
  '// - Histórico de edições',
  '//',
  '// Regras:',
  '// 1. O administrador precisa ter senha.',
  '// 2. Você pode gerar mesmo sem profissionais, mas crie pelo menos um agendador.',
  '// 3. O preview é atualizado pelo botão GERAR SCRIPT.'
].join('\n');

let ScriptBuilderState = null;
let ScriptBuilderAccessPending = false;

function isScriptBuilderAuthorized() {
  return ScriptBuilderAccessPending === true;
}

function grantScriptBuilderAccess() {
  ScriptBuilderAccessPending = true;
}

function consumeScriptBuilderAccess() {
  const granted = ScriptBuilderAccessPending === true;
  ScriptBuilderAccessPending = false;
  return granted;
}

function openScriptBuilderProtected() {
  const modal = document.getElementById('modal-script-builder-access');
  const input = document.getElementById('scriptBuilderAccessPassword');
  if (!modal || !input) {
    showToast('Não foi possível abrir a proteção do gerador', 'error');
    return;
  }

  input.value = '';
  modal.classList.add('active');
  setTimeout(() => input.focus(), 50);
}

function closeScriptBuilderAccessModal() {
  const modal = document.getElementById('modal-script-builder-access');
  const input = document.getElementById('scriptBuilderAccessPassword');
  if (input) input.value = '';
  if (modal) modal.classList.remove('active');
}

function submitScriptBuilderAccessPassword() {
  const input = document.getElementById('scriptBuilderAccessPassword');
  if (!input) return;

  const password = String(input.value || '').trim();
  if (password !== SCRIPT_BUILDER_ACCESS_PASSWORD) {
    showToast('Senha incorreta para acessar o gerador', 'error');
    input.focus();
    input.select();
    return;
  }

  grantScriptBuilderAccess();
  closeScriptBuilderAccessModal();
  showToast('Gerador liberado para este acesso', 'success');
  switchScreen('screen-script-builder');
}

function createDefaultScriptBuilderConfig() {
    return {
    nextId: 1,
    diaAtual: 0,
        agendadores: [
      { id: 'admin', nome: 'Admin', senha: '', isAdmin: true }
        ],
        horarios: {
            segunda: { abre: '08:00', fecha: '18:00' },
            terca: { abre: '08:00', fecha: '18:00' },
            quarta: { abre: '08:00', fecha: '18:00' },
            quinta: { abre: '08:00', fecha: '18:00' },
            sexta: { abre: '08:00', fecha: '18:00' },
            sabado: { abre: '08:00', fecha: '12:00' },
            domingo: { abre: '00:00', fecha: '00:00' }
        }
    };
}

function cloneScriptBuilderConfig(config) {
    return JSON.parse(JSON.stringify(config));
}

function normalizeScriptBuilderConfig(config) {
    const normalized = cloneScriptBuilderConfig(createDefaultScriptBuilderConfig());

    if (config && typeof config === 'object') {
        if (Array.isArray(config.agendadores) && config.agendadores.length > 0) {
      normalized.agendadores = config.agendadores.map((ag, index) => ({
        id: ag.isAdmin ? 'admin' : Number(ag.id) || index + 1,
                nome: ag.nome || '',
                senha: ag.senha || '',
                isAdmin: !!ag.isAdmin
            }));
        }

        if (config.horarios) {
            SCRIPT_BUILDER_DAYS.forEach(({ key }) => {
                const source = config.horarios[key] || {};
                normalized.horarios[key] = {
                    abre: source.abre || normalized.horarios[key].abre,
                    fecha: source.fecha || normalized.horarios[key].fecha
                };
            });
        }

    normalized.nextId = Number(config.nextId) || getNextScriptBuilderId(normalized.agendadores);
    normalized.diaAtual = Number.isInteger(config.diaAtual) ? config.diaAtual : 0;
    }

    let admin = normalized.agendadores.find((ag) => ag.isAdmin);
    if (!admin) {
    admin = { id: 'admin', nome: 'Admin', senha: '', isAdmin: true };
        normalized.agendadores.unshift(admin);
    }

    normalized.agendadores = normalized.agendadores.map((ag, index) => ({
        ...ag,
    id: ag.isAdmin ? 'admin' : Number(ag.id) || index + 1,
    isAdmin: ag.id === admin.id ? true : !!ag.isAdmin
    }));

    normalized.nextId = Math.max(normalized.nextId, getNextScriptBuilderId(normalized.agendadores));
  normalized.diaAtual = Math.max(0, Math.min(SCRIPT_BUILDER_DAYS.length - 1, normalized.diaAtual || 0));
    return normalized;
}

function getNextScriptBuilderId(agendadores) {
  const maxId = (agendadores || []).reduce((max, ag) => {
    const currentId = Number(ag.id);
    return Math.max(max, Number.isFinite(currentId) ? currentId : 0);
  }, 0);
    return maxId + 1;
}

function loadScriptBuilderConfig() {
    try {
        const saved = localStorage.getItem(SCRIPT_BUILDER_STORAGE_KEY);
        if (saved) {
            ScriptBuilderState = normalizeScriptBuilderConfig(JSON.parse(saved));
            return;
        }
    } catch (error) {
        console.error('Error loading script builder config:', error);
    }

    ScriptBuilderState = normalizeScriptBuilderConfig();
}

function saveScriptBuilderConfig() {
    if (!ScriptBuilderState) {
        ScriptBuilderState = normalizeScriptBuilderConfig();
    }

    try {
        localStorage.setItem(SCRIPT_BUILDER_STORAGE_KEY, JSON.stringify(ScriptBuilderState));
    } catch (error) {
        console.error('Error saving script builder config:', error);
        showToast('Erro ao salvar o gerador local', 'error');
    }
}

function ensureScriptBuilderLoaded() {
    if (!ScriptBuilderState) {
        loadScriptBuilderConfig();
    }
}

function renderScriptBuilderScreen() {
    ensureScriptBuilderLoaded();
    ensureScriptBuilderAdmin();

    const admin = ScriptBuilderState.agendadores.find((ag) => ag.isAdmin);
    const adminName = document.getElementById('scriptBuilderAdminName');
    const adminPassword = document.getElementById('scriptBuilderAdminPassword');
    if (adminName) adminName.value = admin?.nome || '';
    if (adminPassword) adminPassword.value = admin?.senha || '';

    renderScriptBuilderProfessionals();
  updateScriptBuilderDayDisplay();
  updateScriptBuilderPreview();
}

function ensureScriptBuilderAdmin() {
    const admin = ScriptBuilderState.agendadores.find((ag) => ag.isAdmin);
    if (admin) return admin;

  const created = { id: 'admin', nome: 'Admin', senha: '', isAdmin: true };
    ScriptBuilderState.agendadores.unshift(created);
    saveScriptBuilderConfig();
    return created;
}

function renderScriptBuilderProfessionals() {
    const container = document.getElementById('scriptBuilderProfessionals');
    if (!container) return;

    const professionals = ScriptBuilderState.agendadores.filter((ag) => !ag.isAdmin);
    if (professionals.length === 0) {
    container.innerHTML = '<div class="script-builder-empty">Nenhum agendador criado ainda. Use NOVO AGENDADOR para montar a equipe.</div>';
        return;
    }

    container.innerHTML = professionals.map((ag) => `
    <div class="script-builder-row" data-script-builder-id="${ag.id}">
      <input class="script-builder-professional-input" type="text" value="${escapeScriptBuilderHtml(ag.nome || '')}" placeholder="Nome do profissional" oninput="updateScriptBuilderProfessional(${ag.id}, 'nome', this.value)">
      <input class="script-builder-professional-input" type="text" value="${escapeScriptBuilderHtml(ag.senha || '')}" placeholder="Senha do profissional (opcional)" oninput="updateScriptBuilderProfessional(${ag.id}, 'senha', this.value)">
            <button class="script-builder-remove" onclick="removeScriptBuilderProfessional(${ag.id})" aria-label="Excluir profissional">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function updateScriptBuilderAdmin(field, value) {
    ensureScriptBuilderLoaded();
    const admin = ensureScriptBuilderAdmin();
    admin[field] = value;
    saveScriptBuilderConfig();
    updateScriptBuilderPreview();
}

function toggleScriptBuilderAdminPassword() {
  const input = document.getElementById('scriptBuilderAdminPassword');
  const icon = document.getElementById('scriptBuilderAdminPasswordIcon');
  if (!input || !icon) return;

  const shouldShow = input.type === 'password';
  input.type = shouldShow ? 'text' : 'password';
  icon.className = shouldShow ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
}

function addScriptBuilderProfessional() {
    ensureScriptBuilderLoaded();
    const newId = ScriptBuilderState.nextId || getNextScriptBuilderId(ScriptBuilderState.agendadores);
    ScriptBuilderState.agendadores.push({
        id: newId,
        nome: '',
        senha: '',
        isAdmin: false
    });
    ScriptBuilderState.nextId = newId + 1;
    saveScriptBuilderConfig();
    renderScriptBuilderScreen();
    showToast('Agendador adicionado', 'success');
}

function removeScriptBuilderProfessional(id) {
    ensureScriptBuilderLoaded();
    ScriptBuilderState.agendadores = ScriptBuilderState.agendadores.filter((ag) => Number(ag.id) !== Number(id) || ag.isAdmin);
    saveScriptBuilderConfig();
    renderScriptBuilderScreen();
}

function updateScriptBuilderProfessional(id, field, value) {
    ensureScriptBuilderLoaded();
    const professional = ScriptBuilderState.agendadores.find((ag) => Number(ag.id) === Number(id) && !ag.isAdmin);
    if (!professional) return;
    professional[field] = value;
    saveScriptBuilderConfig();
    updateScriptBuilderPreview();
}

  function changeScriptBuilderDay(direction) {
    ensureScriptBuilderLoaded();
    ScriptBuilderState.diaAtual = (ScriptBuilderState.diaAtual + direction + SCRIPT_BUILDER_DAYS.length) % SCRIPT_BUILDER_DAYS.length;
    saveScriptBuilderConfig();
    updateScriptBuilderDayDisplay();
  }

  function updateScriptBuilderDayDisplay() {
    ensureScriptBuilderLoaded();
    const currentDay = SCRIPT_BUILDER_DAYS[ScriptBuilderState.diaAtual] || SCRIPT_BUILDER_DAYS[0];
    const horario = ScriptBuilderState.horarios[currentDay.key] || { abre: '00:00', fecha: '00:00' };

    const currentDayLabel = document.getElementById('scriptBuilderCurrentDay');
    const openTime = document.getElementById('scriptBuilderOpenTime');
    const closeTime = document.getElementById('scriptBuilderCloseTime');

    if (currentDayLabel) currentDayLabel.textContent = currentDay.label;
    if (openTime) openTime.textContent = horario.abre || '00:00';
    if (closeTime) closeTime.textContent = horario.fecha || '00:00';
  }

  function updateScriptBuilderSchedule(dayKey, field, value) {
    ensureScriptBuilderLoaded();
    if (!ScriptBuilderState.horarios[dayKey]) {
        ScriptBuilderState.horarios[dayKey] = { abre: '00:00', fecha: '00:00' };
    }
    ScriptBuilderState.horarios[dayKey][field] = value || '00:00';
    saveScriptBuilderConfig();
    updateScriptBuilderDayDisplay();
    updateScriptBuilderPreview();
}

  function applyScriptBuilderCurrentDayToAll() {
    ensureScriptBuilderLoaded();
    const currentDay = SCRIPT_BUILDER_DAYS[ScriptBuilderState.diaAtual] || SCRIPT_BUILDER_DAYS[0];
    const horarioAtual = cloneScriptBuilderConfig(ScriptBuilderState.horarios[currentDay.key] || { abre: '00:00', fecha: '00:00' });

    ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'].forEach((day) => {
      ScriptBuilderState.horarios[day] = cloneScriptBuilderConfig(horarioAtual);
    });

    saveScriptBuilderConfig();
    updateScriptBuilderDayDisplay();
    updateScriptBuilderPreview();
    showToast(`Horário ${horarioAtual.abre} - ${horarioAtual.fecha} aplicado à semana`, 'success');
  }

  function editScriptBuilderTime(field) {
    ensureScriptBuilderLoaded();
    closeScriptBuilderTimeModal();

    const currentDay = SCRIPT_BUILDER_DAYS[ScriptBuilderState.diaAtual] || SCRIPT_BUILDER_DAYS[0];
    const currentValue = (ScriptBuilderState.horarios[currentDay.key] && ScriptBuilderState.horarios[currentDay.key][field]) || '00:00';
    const parts = currentValue.split(':');
    const hours = parts[0] || '00';
    const minutes = parts[1] || '00';

    const modal = document.createElement('div');
    modal.id = 'scriptBuilderTimeModal';
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content script-builder-time-modal" onclick="event.stopPropagation()">
        <div class="script-builder-time-modal-title">${field === 'abre' ? 'ABERTURA' : 'FECHAMENTO'} - ${currentDay.label}</div>
        <div class="script-builder-time-controls">
          <div class="script-builder-time-group">
            <button class="script-builder-time-adjust" onclick="adjustScriptBuilderTimeValue('hour', 1)">+</button>
            <input id="scriptBuilderTimeHour" class="script-builder-time-value-readonly" value="${hours}" readonly>
            <button class="script-builder-time-adjust" onclick="adjustScriptBuilderTimeValue('hour', -1)">-</button>
          </div>
          <div class="script-builder-hours-separator">:</div>
          <div class="script-builder-time-group">
            <button class="script-builder-time-adjust" onclick="adjustScriptBuilderTimeValue('minute', 1)">+</button>
            <input id="scriptBuilderTimeMinute" class="script-builder-time-value-readonly" value="${minutes}" readonly>
            <button class="script-builder-time-adjust" onclick="adjustScriptBuilderTimeValue('minute', -1)">-</button>
          </div>
        </div>
        <div class="script-builder-time-modal-actions">
          <button class="btn-secondary" onclick="closeScriptBuilderTimeModal()">Cancelar</button>
          <button class="btn-primary" onclick="confirmScriptBuilderTimeEdit('${field}')">Confirmar</button>
        </div>
      </div>
    `;

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeScriptBuilderTimeModal();
      }
    });

    document.body.appendChild(modal);
  }

  function adjustScriptBuilderTimeValue(unit, delta) {
    const hourInput = document.getElementById('scriptBuilderTimeHour');
    const minuteInput = document.getElementById('scriptBuilderTimeMinute');
    if (!hourInput || !minuteInput) return;

    if (unit === 'hour') {
      let hour = Number(hourInput.value) + delta;
      hour = (hour + 24) % 24;
      hourInput.value = String(hour).padStart(2, '0');
      return;
    }

    let minute = Number(minuteInput.value) + delta;
    minute = (minute + 60) % 60;
    minuteInput.value = String(minute).padStart(2, '0');
  }

  function confirmScriptBuilderTimeEdit(field) {
    ensureScriptBuilderLoaded();
    const hourInput = document.getElementById('scriptBuilderTimeHour');
    const minuteInput = document.getElementById('scriptBuilderTimeMinute');
    if (!hourInput || !minuteInput) return;

    const currentDay = SCRIPT_BUILDER_DAYS[ScriptBuilderState.diaAtual] || SCRIPT_BUILDER_DAYS[0];
    const newValue = `${hourInput.value}:${minuteInput.value}`;
    updateScriptBuilderSchedule(currentDay.key, field, newValue);
    closeScriptBuilderTimeModal();
  }

  function closeScriptBuilderTimeModal() {
    const modal = document.getElementById('scriptBuilderTimeModal');
    if (modal) {
      modal.remove();
    }
  }

function applyScriptBuilderWeekdayPreset() {
    ensureScriptBuilderLoaded();
    ['segunda', 'terca', 'quarta', 'quinta', 'sexta'].forEach((day) => {
        ScriptBuilderState.horarios[day] = { abre: '08:00', fecha: '18:00' };
    });
    ScriptBuilderState.horarios.sabado = { abre: '08:00', fecha: '12:00' };
    ScriptBuilderState.horarios.domingo = { abre: '00:00', fecha: '00:00' };
    saveScriptBuilderConfig();
    updateScriptBuilderDayDisplay();
    updateScriptBuilderPreview();
    showToast('Horário comercial aplicado', 'success');
}

function resetScriptBuilderConfig() {
    ScriptBuilderState = normalizeScriptBuilderConfig();
    saveScriptBuilderConfig();
    renderScriptBuilderScreen();
    showToast('Gerador resetado para o padrão', 'info');
}

function importConnectedConfigToBuilder() {
    if (!AppState.agendadores || AppState.agendadores.length === 0) {
        showToast('Nenhum sistema conectado para importar', 'warning');
        return;
    }

  let hasAdmin = false;
    const imported = {
        nextId: getNextScriptBuilderId(AppState.agendadores),
    diaAtual: 0,
        agendadores: AppState.agendadores.map((ag, index) => ({
      id: ag.isAdmin ? 'admin' : Number(ag.id) || index + 1,
            nome: ag.nome || ag.name || '',
            senha: ag.senha || '',
      isAdmin: !!ag.isAdmin
        })),
        horarios: cloneScriptBuilderConfig(AppState.horarios || createDefaultScriptBuilderConfig().horarios)
    };

  hasAdmin = imported.agendadores.some((ag) => ag.isAdmin);
  if (!hasAdmin) {
    imported.agendadores.unshift({ id: 'admin', nome: 'Admin', senha: '', isAdmin: true });
  }

    ScriptBuilderState = normalizeScriptBuilderConfig(imported);
    saveScriptBuilderConfig();
    renderScriptBuilderScreen();
    showToast('Configuração importada do sistema conectado', 'success');
}

function generateScriptBuilderPreview() {
  updateScriptBuilderPreview(true);
}

function generateAndCopyScriptBuilder() {
  updateScriptBuilderPreview(false);
  copyScriptBuilderScript({ showNotice: true });
}

function updateScriptBuilderPreview(showFeedback = false) {
    ensureScriptBuilderLoaded();
    const preview = document.getElementById('scriptBuilderPreview');
  const status = document.getElementById('scriptBuilderPreviewStatus');
  if (!preview) return;

  const script = buildScriptBuilderScript();
  const professionals = ScriptBuilderState.agendadores.filter((ag) => !ag.isAdmin && (ag.nome || ag.senha));
  const admin = ScriptBuilderState.agendadores.find((ag) => ag.isAdmin);

  preview.value = script;

  if (!admin || !admin.senha) {
    if (status) status.textContent = 'Defina a senha do administrador para liberar o Apps Script completo.';
    if (showFeedback) showToast('Falta definir a senha do administrador', 'warning');
    return;
  }

  if (status) {
    status.textContent = `v4.0 • ${professionals.length} agendador(es) • ${SCRIPT_BUILDER_DAYS.length} dias • prévia atualizada`;
  }

  if (showFeedback) {
    showToast('Prévia do script atualizada', 'success');
  }
}

function getScriptBuilderData() {
    ensureScriptBuilderLoaded();
    return normalizeScriptBuilderConfig(ScriptBuilderState);
}

function buildScriptBuilderScript() {
    const config = getScriptBuilderData();
    const agendadores = config.agendadores;
    const horarios = config.horarios;

    const admin = agendadores.find((ag) => ag.isAdmin);
    if (!admin || !admin.senha) {
    return SCRIPT_BUILDER_EMPTY_SCRIPT;
    }

    return `/**
 * =============================================
 * NEXUS - Sistema de Gestao SaaS v4.0
 * Google Apps Script + Google Sheets
 * Gerado em: ${new Date().toLocaleString('pt-BR')}
 * =============================================
 *
 * ESTRUTURA:
 * 1. Profissionais  - Agendadores/funcionarios
 * 2. Clientes       - Base de clientes
 * 3. Servicos       - Catalogo de servicos
 * 4. Produtos       - Catalogo de produtos
 * 5. Agendamentos   - Horarios ocupados
 * 6. Bloqueios      - Horarios bloqueados
 * 7. Caixa          - Movimentacoes financeiras
 * 8. CaixaItens     - Itens das movimentacoes
 * 9. CaixaHistorico - Historico de edicoes
 *
 * COMO USAR:
 * 1. Crie uma planilha no Google Sheets
 * 2. Extensoes > Apps Script
 * 3. Apague tudo e cole este codigo
 * 4. Salve (Ctrl+S)
 * 5. Implantar > Nova implantacao
 *    - Tipo: App da Web
 *    - Executar como: Eu
 *    - Acesso: Qualquer pessoa
 * 6. Copie a URL e use no app
 */

// =====================================================
// CONFIGURACOES INICIAIS
// =====================================================

var PROFISSIONAIS_INICIAIS = ${JSON.stringify(agendadores.map((a) => ({ id: a.id, nome: a.nome, senha: a.senha, isAdmin: a.isAdmin || false })), null, 2)};

var HORARIOS = ${JSON.stringify(horarios, null, 2)};

// NOMES DAS ABAS
var SH = {
  PROF: "Profissionais",
  CLI: "Clientes",
  SERV: "Servicos",
  PROD: "Produtos",
  APPT: "Agendamentos",
  BLOCK: "Bloqueios",
  CASH: "Caixa",
  CASH_ITEMS: "CaixaItens",
  CASH_HIST: "CaixaHistorico"
};

// COLUNAS
var COLS = {
  PROF: ["id","nome","senha","isAdmin","status","hora_inicio","hora_fim","almoco_inicio","almoco_fim","agenda_bloqueada","created_at","updated_at"],
  CLI: ["id","nome","telefone","cpf","aniversario","observacoes","status","created_at","updated_at"],
  SERV: ["id","nome","preco","duracao_minutos","descricao","icon","status","created_at","updated_at"],
  PROD: ["id","nome","preco","estoque","descricao","icon","status","created_at","updated_at"],
  APPT: ["id","profissional_id","cliente_id","servico_id","data","hora_inicio","hora_fim","status","observacoes","created_at","updated_at"],
  BLOCK: ["id","profissional_id","data","hora_inicio","hora_fim","tipo_bloqueio","descricao","created_at","updated_at"],
  CASH: ["id","tipo","cliente_id","descricao","forma_pagamento","bandeira_cartao","taxa_cartao","valor_original","valor_real","data","hora","status","created_at","updated_at"],
  CASH_ITEMS: ["id","movimentacao_id","tipo_item","produto_id","servico_id","quantidade","valor_unitario","valor_total","created_at","updated_at"],
  CASH_HIST: ["id","movimentacao_id","descricao_anterior","forma_anterior","bandeira_anterior","taxa_anterior","valor_orig_anterior","valor_real_anterior","data_edicao","hora_edicao","motivo","created_at"]
};

// =====================================================
// BOOT - INICIALIZA PLANILHA
// =====================================================

function boot() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Script precisa estar vinculado a uma planilha");
  
  var sheets = {};
  
  // Cria todas as abas
  Object.keys(SH).forEach(function(k) {
    var name = SH[k];
    var cols = COLS[k];
    var sh = ss.getSheetByName(name);
    
    if (!sh) {
      sh = ss.insertSheet(name);
      sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight("bold");
      sh.setFrozenRows(1);
    }
    
    sheets[k] = sh;
  });
  
  // Inicializar profissionais se vazio
  if (sheets.PROF.getLastRow() <= 1) {
    var now = iso();
    PROFISSIONAIS_INICIAIS.forEach(function(p) {
      sheets.PROF.appendRow([
        p.id, p.nome, p.senha, p.isAdmin,
        "ativo", "", "", "", "", false,
        now, now
      ]);
    });
  }
  
  return sheets;
}

// =====================================================
// WEB ENDPOINTS
// =====================================================

function doGet(e) {
  try {
    var action = e && e.parameter && e.parameter.action ? e.parameter.action : "ping";
    return reply(route(action, null));
  } catch (err) {
    return reply({ ok: false, err: err.toString() });
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return reply({ ok: false, err: "Requisicao invalida" });
    }
    var body = JSON.parse(e.postData.contents);
    var action = body.action || "ping";
    return reply(route(action, body));
  } catch (err) {
    return reply({ ok: false, err: err.toString() });
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// =====================================================
// ROUTER PRINCIPAL
// =====================================================

function route(action, body) {
  try {
    switch (action) {
      // ===== SISTEMA =====
      case "ping": return ping();
      case "auth": return auth(body);
      case "agendadores": return profList(body);
      
      // ===== LEGACY (compatibilidade frontend) =====
      case "list": return apptList(body);
      case "create": return apptCreateLegacy(body);
      case "update": return apptUpdateLegacy(body);
      case "delete": return apptDelete(body);
      case "disponibilidade": return getDisponibilidade(body);
      case "buscarCliente": return clientSearch(body);
      case "cadastrarCliente": return clientCreate(body);
      case "atualizarCliente": return clientUpdate(body);
      case "excluirCliente": return clientDelete(body);
      case "listarClientes": return clientList(body);
      case "getAgendadorConfig": return profGetConfig(body);
      case "setAgendadorConfig": return profSetConfig(body);
      case "getAllConfigs": return profGetAllConfigs();
      
      // ===== PROFISSIONAIS =====
      case "PROF_CREATE": return profCreate(body);
      case "PROF_UPDATE": return profUpdate(body);
      case "PROF_DELETE": return profDelete(body);
      case "PROF_LIST": return profList(body);
      case "PROF_SET_STATUS": return profSetStatus(body);
      case "PROF_SET_LUNCH": return profSetLunch(body);
      case "PROF_SET_AGENDA_BLOCK": return profSetAgendaBlock(body);
      
      // ===== CLIENTES =====
      case "CLIENT_CREATE": return clientCreate(body);
      case "CLIENT_UPDATE": return clientUpdate(body);
      case "CLIENT_DELETE": return clientDelete(body);
      case "CLIENT_LIST": return clientList(body);
      case "CLIENT_SEARCH": return clientSearch(body);
      case "CLIENT_SET_STATUS": return clientSetStatus(body);
      case "CLIENT_GET_HISTORY_COUNT": return clientGetHistoryCount(body);
      
      // ===== SERVICOS =====
      case "SERVICE_CREATE": return servCreate(body);
      case "SERVICE_UPDATE": return servUpdate(body);
      case "SERVICE_DELETE": return servDelete(body);
      case "SERVICE_LIST": return servList(body);
      case "SERVICE_SET_STATUS": return servSetStatus(body);
      
      // ===== PRODUTOS =====
      case "PRODUCT_CREATE": return prodCreate(body);
      case "PRODUCT_UPDATE": return prodUpdate(body);
      case "PRODUCT_DELETE": return prodDelete(body);
      case "PRODUCT_LIST": return prodList(body);
      case "PRODUCT_SET_STATUS": return prodSetStatus(body);
      case "PRODUCT_STOCK_ADD": return prodStockAdd(body);
      case "PRODUCT_STOCK_REMOVE": return prodStockRemove(body);
      case "PRODUCT_STOCK_SET": return prodStockSet(body);
      
      // ===== AGENDAMENTOS =====
      case "APPT_CREATE": return apptCreate(body);
      case "APPT_UPDATE": return apptUpdate(body);
      case "APPT_DELETE": return apptDelete(body);
      case "APPT_LIST": return apptList(body);
      case "APPT_GET_BY_DATE": return apptList({ data: body.data });
      case "APPT_GET_BY_CLIENT": return apptList({ cliente_id: body.cliente_id });
      case "APPT_GET_BY_PROFESSIONAL": return apptList({ profissional_id: body.profissional_id });
      
      // ===== BLOQUEIOS =====
      case "BLOCK_CREATE": return blockCreate(body);
      case "BLOCK_UPDATE": return blockUpdate(body);
      case "BLOCK_DELETE": return blockDelete(body);
      case "BLOCK_LIST": return blockList(body);
      case "BLOCK_GET_BY_DATE": return blockList({ data: body.data });
      case "BLOCK_GET_BY_PROFESSIONAL": return blockList({ profissional_id: body.profissional_id });
      
      // ===== CAIXA =====
      case "CASH_CREATE": return cashCreate(body);
      case "CASH_UPDATE": return cashUpdate(body);
      case "CASH_CANCEL": return cashCancel(body);
      case "CASH_LIST": return cashList(body);
      case "CASH_GET_BY_DATE": return cashList({ data: body.data });
      case "CASH_GET_BY_CLIENT": return cashList({ cliente_id: body.cliente_id });
      case "CASH_GET_REPORT": return cashReport(body);
      
      // ===== CAIXA ITENS =====
      case "CASH_ITEM_ADD": return cashItemAdd(body);
      case "CASH_ITEM_UPDATE": return cashItemUpdate(body);
      case "CASH_ITEM_REMOVE": return cashItemRemove(body);
      case "CASH_ITEM_LIST": return cashItemList(body);
      
      // ===== HISTORICO =====
      case "CASH_HISTORY_SAVE": return cashHistorySave(body);
      case "CASH_HISTORY_GET": return cashHistoryGet(body);
      
      default:
        return { ok: false, err: "Acao desconhecida: " + action };
    }
  } catch (e) {
    return { ok: false, err: e.toString() };
  }
}

// =====================================================
// HELPERS
// =====================================================

function iso() { return new Date().toISOString(); }
function genId() { return String(Date.now()) + String(Math.floor(Math.random() * 1000)); }
function pad(n) { return n < 10 ? "0" + n : "" + n; }

function fmtDate(v) {
  if (!v) return "";
  if (typeof v === "string" && /^\\d{4}-\\d{2}-\\d{2}$/.test(v)) return v;
  if (v instanceof Date) return v.getFullYear() + "-" + pad(v.getMonth() + 1) + "-" + pad(v.getDate());
  try { var d = new Date(v); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  catch (e) { return String(v); }
}

function fmtTime(v) {
  if (!v) return "";
  if (typeof v === "string" && /^\\d{2}:\\d{2}$/.test(v)) return v;
  if (v instanceof Date) return pad(v.getHours()) + ":" + pad(v.getMinutes());
  var m = String(v).match(/(\\d{1,2}):(\\d{2})/);
  if (m) return pad(parseInt(m[1], 10)) + ":" + m[2];
  return String(v);
}

function toNum(v, d) { var n = Number(v); return isNaN(n) ? (d || 0) : n; }
function toBool(v) { return v === true || v === "true" || v === 1; }
function str(v) { return String(v || ""); }

function getRows(sh, cols) {
  var last = sh.getLastRow();
  if (last <= 1) return [];
  return sh.getRange(2, 1, last - 1, cols.length).getValues();
}

function findRow(sh, id) {
  if (!id) return -1;
  var last = sh.getLastRow();
  if (last <= 1) return -1;
  var ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function addMinutes(time, mins) {
  var p = String(time || "00:00").split(":");
  var total = Number(p[0]) * 60 + Number(p[1]) + Number(mins || 0);
  var h = Math.floor(total / 60);
  var m = total % 60;
  return pad(h) + ":" + pad(m);
}

function timeConflict(a1, a2, b1, b2) {
  return a1 < b2 && a2 > b1;
}

// =====================================================
// PING / AUTH
// =====================================================

function ping() {
  var sheets = boot();
  var profs = getProfissionaisComConfig(sheets.PROF);
  return {
    ok: true,
    msg: "Conectado!",
    agendadores: profs,
    horarios: HORARIOS
  };
}

function auth(body) {
  if (!body || !body.agendadorId || !body.senha) {
    return { ok: false, err: "ID e senha obrigatorios" };
  }
  var sheets = boot();
  var prof = getProfById(sheets.PROF, body.agendadorId);
  if (!prof) return { ok: false, err: "Profissional nao encontrado" };
  if (prof.senha !== body.senha) return { ok: false, err: "Senha incorreta" };
  return {
    ok: true,
    agendador: {
      id: prof.id,
      nome: prof.nome,
      isAdmin: prof.isAdmin,
      status: prof.status
    }
  };
}

// =====================================================
// PROFISSIONAIS
// =====================================================

function formatProf(r) {
  return {
    id: r[0], nome: str(r[1]), senha: str(r[2]), isAdmin: toBool(r[3]),
    status: str(r[4]) || "ativo",
    hora_inicio: str(r[5]), hora_fim: str(r[6]),
    almoco_inicio: str(r[7]), almoco_fim: str(r[8]),
    agenda_bloqueada: toBool(r[9]),
    created_at: str(r[10]), updated_at: str(r[11])
  };
}

function getProfById(sh, id) {
  var rows = getRows(sh, COLS.PROF);
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) return formatProf(rows[i]);
  }
  return null;
}

function getProfissionaisComConfig(sh) {
  var rows = getRows(sh, COLS.PROF);
  return rows.map(function(r) {
    var p = formatProf(r);
    return {
      id: p.id, nome: p.nome, isAdmin: p.isAdmin, status: p.status,
      almocoInicio: p.almoco_inicio, almocoFim: p.almoco_fim,
      bloqueado: p.agenda_bloqueada
    };
  });
}

function profList(body) {
  var sheets = boot();
  var profs = getProfissionaisComConfig(sheets.PROF);
  return { ok: true, data: profs };
}

function profCreate(body) {
  if (!body || !body.nome) return { ok: false, err: "Nome obrigatorio" };
  var sheets = boot();
  var sh = sheets.PROF;
  var id = body.id || genId();
  var now = iso();
  sh.appendRow([
    id, body.nome, body.senha || "", toBool(body.isAdmin),
    body.status || "ativo", body.hora_inicio || "", body.hora_fim || "",
    body.almoco_inicio || "", body.almoco_fim || "", false,
    now, now
  ]);
  return { ok: true, id: id, msg: "Profissional criado" };
}

function profUpdate(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var sh = sheets.PROF;
  var row = findRow(sh, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  
  var cur = sh.getRange(row, 1, 1, COLS.PROF.length).getValues()[0];
  sh.getRange(row, 1, 1, COLS.PROF.length).setValues([[
    body.id,
    body.nome !== undefined ? body.nome : cur[1],
    body.senha !== undefined ? body.senha : cur[2],
    body.isAdmin !== undefined ? toBool(body.isAdmin) : cur[3],
    body.status !== undefined ? body.status : cur[4],
    body.hora_inicio !== undefined ? body.hora_inicio : cur[5],
    body.hora_fim !== undefined ? body.hora_fim : cur[6],
    body.almoco_inicio !== undefined ? body.almoco_inicio : cur[7],
    body.almoco_fim !== undefined ? body.almoco_fim : cur[8],
    body.agenda_bloqueada !== undefined ? toBool(body.agenda_bloqueada) : cur[9],
    cur[10], iso()
  ]]);
  return { ok: true, msg: "Atualizado" };
}

function profDelete(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.PROF, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  sheets.PROF.deleteRow(row);
  return { ok: true, msg: "Removido" };
}

function profSetStatus(body) {
  if (!body || !body.id || !body.status) return { ok: false, err: "ID e status obrigatorios" };
  return profUpdate({ id: body.id, status: body.status });
}

function profSetLunch(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  return profUpdate({
    id: body.id,
    almoco_inicio: body.almoco_inicio || body.almocoInicio || "",
    almoco_fim: body.almoco_fim || body.almocoFim || ""
  });
}

function profSetAgendaBlock(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  return profUpdate({
    id: body.id,
    agenda_bloqueada: toBool(body.agenda_bloqueada || body.bloqueado)
  });
}

// Legacy compatibilidade
function profGetConfig(body) {
  if (!body || !body.agendadorId) return { ok: false, err: "agendadorId obrigatorio" };
  var sheets = boot();
  var prof = getProfById(sheets.PROF, body.agendadorId);
  if (!prof) return { ok: true, config: { agendadorId: body.agendadorId, almocoInicio: "", almocoFim: "", bloqueado: false } };
  return {
    ok: true,
    config: {
      agendadorId: prof.id,
      agendadorNome: prof.nome,
      almocoInicio: prof.almoco_inicio,
      almocoFim: prof.almoco_fim,
      bloqueado: prof.agenda_bloqueada
    }
  };
}

function profSetConfig(body) {
  if (!body || !body.agendadorId) return { ok: false, err: "agendadorId obrigatorio" };
  return profUpdate({
    id: body.agendadorId,
    almoco_inicio: body.almocoInicio,
    almoco_fim: body.almocoFim,
    agenda_bloqueada: toBool(body.bloqueado)
  });
}

function profGetAllConfigs() {
  var sheets = boot();
  var rows = getRows(sheets.PROF, COLS.PROF);
  var configs = {};
  rows.forEach(function(r) {
    var p = formatProf(r);
    configs[String(p.id)] = {
      agendadorId: p.id,
      agendadorNome: p.nome,
      almocoInicio: p.almoco_inicio,
      almocoFim: p.almoco_fim,
      bloqueado: p.agenda_bloqueada
    };
  });
  return { ok: true, configs: configs };
}

// =====================================================
// CLIENTES
// =====================================================

function formatCli(r) {
  return {
    id: r[0], nome: str(r[1]), telefone: str(r[2]), cpf: str(r[3]),
    aniversario: str(r[4]), observacoes: str(r[5]),
    status: str(r[6]) || "ativo",
    created_at: str(r[7]), updated_at: str(r[8])
  };
}

function clientList(body) {
  var sheets = boot();
  var rows = getRows(sheets.CLI, COLS.CLI);
  var out = rows.map(function(r) { return formatCli(r); });
  if (body && body.status) out = out.filter(function(c) { return c.status === body.status; });
  return { ok: true, clientes: out };
}

function clientCreate(body) {
  if (!body || !body.nome) return { ok: false, err: "Nome obrigatorio" };
  var sheets = boot();
  var sh = sheets.CLI;
  
  // Verificar duplicado
  if (body.telefone) {
    var busca = clientSearch({ termo: body.telefone });
    if (busca.ok && busca.encontrado) {
      return { ok: false, err: "Ja existe cliente com este telefone" };
    }
  }
  
  var id = body.id || genId();
  var now = iso();
  sh.appendRow([
    id, body.nome, body.telefone || "", body.cpf || "",
    body.aniversario || "", body.observacoes || "",
    body.status || "ativo", now, now
  ]);
  return { ok: true, id: id, msg: "Cliente cadastrado" };
}

function clientUpdate(body) {
  if (!body) return { ok: false, err: "Dados obrigatorios" };
  var sheets = boot();
  var sh = sheets.CLI;
  
  var row = -1;
  if (body.id) {
    row = findRow(sh, body.id);
  } else if (body.telefone) {
    var rows = getRows(sh, COLS.CLI);
    var telNum = str(body.telefone).replace(/\\D/g, "");
    for (var i = 0; i < rows.length; i++) {
      var rowTel = str(rows[i][2]).replace(/\\D/g, "");
      if (rowTel && telNum && rowTel === telNum) { row = i + 2; break; }
    }
  }
  
  if (row <= 0) return { ok: false, err: "Cliente nao encontrado" };
  
  var cur = sh.getRange(row, 1, 1, COLS.CLI.length).getValues()[0];
  sh.getRange(row, 1, 1, COLS.CLI.length).setValues([[
    cur[0],
    body.nome !== undefined ? body.nome : cur[1],
    body.telefone !== undefined ? body.telefone : cur[2],
    body.cpf !== undefined ? body.cpf : cur[3],
    body.aniversario !== undefined ? body.aniversario : cur[4],
    body.observacoes !== undefined ? body.observacoes : cur[5],
    body.status !== undefined ? body.status : cur[6],
    cur[7], iso()
  ]]);
  return { ok: true, msg: "Cliente atualizado" };
}

function clientDelete(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.CLI, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  sheets.CLI.deleteRow(row);
  return { ok: true, msg: "Cliente excluido" };
}

function clientSearch(body) {
  if (!body || !body.termo) return { ok: true, encontrado: false };
  var sheets = boot();
  var rows = getRows(sheets.CLI, COLS.CLI);
  var termo = str(body.termo).toLowerCase().trim();
  var termoNum = termo.replace(/\\D/g, "");
  
  for (var i = 0; i < rows.length; i++) {
    var c = formatCli(rows[i]);
    var nome = c.nome.toLowerCase();
    var tel = c.telefone.replace(/\\D/g, "");
    var cpf = c.cpf.replace(/\\D/g, "");
    
    if (termoNum && tel && (tel.indexOf(termoNum) >= 0 || termoNum.indexOf(tel) >= 0)) {
      return { ok: true, encontrado: true, cliente: c };
    }
    if (termo && nome.indexOf(termo) >= 0) {
      return { ok: true, encontrado: true, cliente: c };
    }
    if (termoNum && cpf && cpf === termoNum) {
      return { ok: true, encontrado: true, cliente: c };
    }
  }
  return { ok: true, encontrado: false, msg: "Cliente nao encontrado" };
}

function clientSetStatus(body) {
  if (!body || !body.id || !body.status) return { ok: false, err: "ID e status obrigatorios" };
  return clientUpdate({ id: body.id, status: body.status });
}

function clientGetHistoryCount(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var rows = getRows(sheets.APPT, COLS.APPT);
  var count = 0;
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][2]) === String(body.id) && str(rows[i][7]) === "agendado") count++;
  }
  return { ok: true, count: count };
}

// =====================================================
// SERVICOS
// =====================================================

function formatServ(r) {
  return {
    id: r[0], nome: str(r[1]), preco: toNum(r[2]), duracao_minutos: toNum(r[3]),
    descricao: str(r[4]), icon: str(r[5]) || "fa-scissors", status: str(r[6]) || "ativo",
    created_at: str(r[7]), updated_at: str(r[8])
  };
}

function servList(body) {
  var sheets = boot();
  var rows = getRows(sheets.SERV, COLS.SERV);
  var out = rows.map(function(r) { return formatServ(r); });
  if (body && body.status) out = out.filter(function(s) { return s.status === body.status; });
  return { ok: true, servicos: out };
}

function servCreate(body) {
  if (!body || !body.nome) return { ok: false, err: "Nome obrigatorio" };
  var sheets = boot();
  var id = body.id || genId();
  var now = iso();
  sheets.SERV.appendRow([
    id, body.nome, toNum(body.preco), toNum(body.duracao_minutos, 30),
    body.descricao || "", body.icon || "fa-scissors", body.status || "ativo", now, now
  ]);
  return { ok: true, id: id, msg: "Servico criado" };
}

function servUpdate(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.SERV, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  
  var cur = sheets.SERV.getRange(row, 1, 1, COLS.SERV.length).getValues()[0];
  sheets.SERV.getRange(row, 1, 1, COLS.SERV.length).setValues([[
    body.id,
    body.nome !== undefined ? body.nome : cur[1],
    body.preco !== undefined ? toNum(body.preco) : cur[2],
    body.duracao_minutos !== undefined ? toNum(body.duracao_minutos) : cur[3],
    body.descricao !== undefined ? body.descricao : cur[4],
    body.icon !== undefined ? body.icon : cur[5],
    body.status !== undefined ? body.status : cur[6],
    cur[7], iso()
  ]]);
  return { ok: true, msg: "Servico atualizado" };
}

function servDelete(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.SERV, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  sheets.SERV.deleteRow(row);
  return { ok: true, msg: "Servico removido" };
}

function servSetStatus(body) {
  return servUpdate({ id: body.id, status: body.status });
}

function getServById(sheets, id) {
  var rows = getRows(sheets.SERV, COLS.SERV);
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) return formatServ(rows[i]);
  }
  return null;
}

// =====================================================
// PRODUTOS
// =====================================================

function formatProd(r) {
  return {
    id: r[0], nome: str(r[1]), preco: toNum(r[2]), estoque: toNum(r[3]),
    descricao: str(r[4]), icon: str(r[5]) || "fa-box", status: str(r[6]) || "ativo",
    created_at: str(r[7]), updated_at: str(r[8])
  };
}

function prodList(body) {
  var sheets = boot();
  var rows = getRows(sheets.PROD, COLS.PROD);
  var out = rows.map(function(r) { return formatProd(r); });
  if (body && body.status) out = out.filter(function(p) { return p.status === body.status; });
  return { ok: true, produtos: out };
}

function prodCreate(body) {
  if (!body || !body.nome) return { ok: false, err: "Nome obrigatorio" };
  var sheets = boot();
  var id = body.id || genId();
  var now = iso();
  sheets.PROD.appendRow([
    id, body.nome, toNum(body.preco), toNum(body.estoque),
    body.descricao || "", body.icon || "fa-box", body.status || "ativo", now, now
  ]);
  return { ok: true, id: id, msg: "Produto criado" };
}

function prodUpdate(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.PROD, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  
  var cur = sheets.PROD.getRange(row, 1, 1, COLS.PROD.length).getValues()[0];
  sheets.PROD.getRange(row, 1, 1, COLS.PROD.length).setValues([[
    body.id,
    body.nome !== undefined ? body.nome : cur[1],
    body.preco !== undefined ? toNum(body.preco) : cur[2],
    body.estoque !== undefined ? toNum(body.estoque) : cur[3],
    body.descricao !== undefined ? body.descricao : cur[4],
    body.icon !== undefined ? body.icon : cur[5],
    body.status !== undefined ? body.status : cur[6],
    cur[7], iso()
  ]]);
  return { ok: true, msg: "Produto atualizado" };
}

function prodDelete(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.PROD, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  sheets.PROD.deleteRow(row);
  return { ok: true, msg: "Produto removido" };
}

function prodSetStatus(body) {
  return prodUpdate({ id: body.id, status: body.status });
}

function prodStockAdd(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.PROD, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  var cur = sheets.PROD.getRange(row, 4).getValue();
  var novoEstoque = toNum(cur) + toNum(body.quantidade, 1);
  prodUpdate({ id: body.id, estoque: novoEstoque });
  return { ok: true, data: { estoque: novoEstoque }, msg: "Estoque adicionado" };
}

function prodStockRemove(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.PROD, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  var cur = sheets.PROD.getRange(row, 4).getValue();
  var novoEstoque = Math.max(0, toNum(cur) - toNum(body.quantidade, 1));
  prodUpdate({ id: body.id, estoque: novoEstoque });
  return { ok: true, data: { estoque: novoEstoque }, msg: "Estoque removido" };
}

function prodStockSet(body) {
  return prodUpdate({ id: body.id, estoque: toNum(body.quantidade) });
}

function getProdById(sheets, id) {
  var rows = getRows(sheets.PROD, COLS.PROD);
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) return formatProd(rows[i]);
  }
  return null;
}

// =====================================================
// AGENDAMENTOS
// =====================================================

function formatAppt(r, sheets) {
  var profId = r[1];
  var cliId = r[2];
  var servId = r[3];
  
  var prof = profId ? getProfById(sheets.PROF, profId) : null;
  var serv = servId ? getServById(sheets, servId) : null;
  
  return {
    id: r[0],
    profissional_id: profId,
    agendadorId: profId,
    agendadorNome: prof ? prof.nome : "",
    cliente_id: cliId,
    clienteId: cliId,
    servico_id: servId,
    servico: serv ? serv.nome : "",
    data: fmtDate(r[4]),
    date: fmtDate(r[4]),
    hora_inicio: fmtTime(r[5]),
    time: fmtTime(r[5]),
    hora_fim: fmtTime(r[6]),
    status: str(r[7]) || "agendado",
    observacoes: str(r[8]),
    created_at: str(r[9]),
    updated_at: str(r[10])
  };
}

function apptList(body) {
  var sheets = boot();
  var rows = getRows(sheets.APPT, COLS.APPT);
  var out = [];
  
  // Carregar nomes de clientes
  var cliRows = getRows(sheets.CLI, COLS.CLI);
  var cliMap = {};
  cliRows.forEach(function(r) { cliMap[String(r[0])] = { nome: str(r[1]), telefone: str(r[2]) }; });
  
  for (var i = 0; i < rows.length; i++) {
    var apt = formatAppt(rows[i], sheets);
    
    // Adicionar dados do cliente
    var cli = cliMap[String(apt.cliente_id)] || {};
    apt.client = cli.nome || "";
    apt.phone = cli.telefone || "";
    
    // Filtros
    if (body) {
      if (body.date && apt.date !== body.date) continue;
      if (body.data && apt.data !== body.data) continue;
      if (body.agendadorId && String(apt.agendadorId) !== String(body.agendadorId)) continue;
      if (body.profissional_id && String(apt.profissional_id) !== String(body.profissional_id)) continue;
      if (body.cliente_id && String(apt.cliente_id) !== String(body.cliente_id)) continue;
    }
    
    out.push(apt);
  }
  
  return { ok: true, data: out };
}

function apptCreate(body) {
  if (!body) return { ok: false, err: "Sem dados" };
  if (!body.data && !body.date) return { ok: false, err: "Data obrigatoria" };
  if (!body.hora_inicio && !body.time) return { ok: false, err: "Hora obrigatoria" };
  if (!body.profissional_id && !body.agendadorId) return { ok: false, err: "Profissional obrigatorio" };
  
  var sheets = boot();
  var profId = body.profissional_id || body.agendadorId;
  var prof = getProfById(sheets.PROF, profId);
  if (!prof) return { ok: false, err: "Profissional nao encontrado" };
  
  // Verificar bloqueio total
  if (prof.agenda_bloqueada) {
    return { ok: false, err: "Agenda bloqueada para " + prof.nome };
  }
  
  var data = body.data || body.date;
  var horaInicio = body.hora_inicio || body.time;
  var duracao = body.duracao_minutos || 30;
  
  // Calcular hora fim
  if (body.servico_id) {
    var serv = getServById(sheets, body.servico_id);
    if (serv) duracao = serv.duracao_minutos || 30;
  }
  var horaFim = body.hora_fim || addMinutes(horaInicio, duracao);
  
  // Verificar almoco
  if (prof.almoco_inicio && prof.almoco_fim) {
    if (timeConflict(horaInicio, horaFim, prof.almoco_inicio, prof.almoco_fim)) {
      return { ok: false, err: "Conflito com horario de almoco" };
    }
  }
  
  // Verificar bloqueios
  var bloqueios = getRows(sheets.BLOCK, COLS.BLOCK);
  for (var b = 0; b < bloqueios.length; b++) {
    var bl = bloqueios[b];
    if (String(bl[1]) !== String(profId)) continue;
    if (fmtDate(bl[2]) !== data) continue;
    if (timeConflict(horaInicio, horaFim, fmtTime(bl[3]), fmtTime(bl[4]))) {
      return { ok: false, err: "Horario bloqueado" };
    }
  }
  
  // Verificar conflito com outros agendamentos
  var appts = getRows(sheets.APPT, COLS.APPT);
  for (var a = 0; a < appts.length; a++) {
    var ap = appts[a];
    if (String(ap[1]) !== String(profId)) continue;
    if (fmtDate(ap[4]) !== data) continue;
    if (str(ap[7]) === "cancelado") continue;
    if (timeConflict(horaInicio, horaFim, fmtTime(ap[5]), fmtTime(ap[6]))) {
      return { ok: false, err: "Horario ja ocupado" };
    }
  }
  
  // Auto-cadastrar cliente
  var clienteId = body.cliente_id || body.clienteId || null;
  if (!clienteId && (body.client || body.phone)) {
    var busca = clientSearch({ termo: body.phone || body.client });
    if (busca.ok && busca.encontrado) {
      clienteId = busca.cliente.id;
    } else if (body.client) {
      var novo = clientCreate({ nome: body.client, telefone: body.phone || "" });
      if (novo.ok) clienteId = novo.id;
    }
  }
  
  var id = body.id || genId();
  var now = iso();
  
  sheets.APPT.appendRow([
    id, profId, clienteId, body.servico_id || "",
    data, horaInicio, horaFim,
    body.status || "agendado", body.observacoes || "",
    now, now
  ]);
  
  return { ok: true, id: id, msg: "Agendamento criado" };
}

function apptUpdate(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.APPT, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  
  var cur = sheets.APPT.getRange(row, 1, 1, COLS.APPT.length).getValues()[0];
  
  // Recalcular hora fim se necessario
  var horaInicio = body.hora_inicio !== undefined ? body.hora_inicio : (body.time !== undefined ? body.time : fmtTime(cur[5]));
  var horaFim = body.hora_fim !== undefined ? body.hora_fim : fmtTime(cur[6]);
  
  if (body.servico_id && body.servico_id !== cur[3]) {
    var serv = getServById(sheets, body.servico_id);
    if (serv) horaFim = addMinutes(horaInicio, serv.duracao_minutos || 30);
  }
  
  sheets.APPT.getRange(row, 1, 1, COLS.APPT.length).setValues([[
    body.id,
    body.profissional_id !== undefined ? body.profissional_id : (body.agendadorId !== undefined ? body.agendadorId : cur[1]),
    body.cliente_id !== undefined ? body.cliente_id : (body.clienteId !== undefined ? body.clienteId : cur[2]),
    body.servico_id !== undefined ? body.servico_id : cur[3],
    body.data !== undefined ? body.data : (body.date !== undefined ? body.date : cur[4]),
    horaInicio,
    horaFim,
    body.status !== undefined ? body.status : cur[7],
    body.observacoes !== undefined ? body.observacoes : cur[8],
    cur[9], iso()
  ]]);
  
  return { ok: true, msg: "Atualizado" };
}

function apptDelete(body) {
  var id = body && body.id ? body.id : body;
  if (!id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.APPT, id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  sheets.APPT.deleteRow(row);
  return { ok: true, msg: "Removido" };
}

// Legacy - formato antigo
function apptCreateLegacy(body) {
  return apptCreate({
    profissional_id: body.agendadorId,
    cliente_id: body.clienteId,
    client: body.client,
    phone: body.phone,
    servico_id: body.servicoId,
    data: body.date,
    hora_inicio: body.time,
    status: body.status || "agendado",
    observacoes: body.observacoes || body.servico || ""
  });
}

function apptUpdateLegacy(body) {
  return apptUpdate({
    id: body.id,
    profissional_id: body.agendadorId,
    cliente_id: body.clienteId,
    servico_id: body.servicoId,
    data: body.date,
    hora_inicio: body.time,
    status: body.status,
    observacoes: body.observacoes
  });
}

// Disponibilidade
function getDisponibilidade(body) {
  if (!body || !body.date) return { ok: false, err: "Data obrigatoria" };
  var sheets = boot();
  var profs = getRows(sheets.PROF, COLS.PROF);
  var appts = getRows(sheets.APPT, COLS.APPT);
  var blocks = getRows(sheets.BLOCK, COLS.BLOCK);
  
  var resultado = [];
  
  for (var p = 0; p < profs.length; p++) {
    var prof = formatProf(profs[p]);
    var ocupados = [];
    var bloqueios = [];
    
    // Agendamentos do dia
    for (var a = 0; a < appts.length; a++) {
      if (String(appts[a][1]) !== String(prof.id)) continue;
      if (fmtDate(appts[a][4]) !== body.date) continue;
      if (str(appts[a][7]) === "cancelado") continue;
      ocupados.push(fmtTime(appts[a][5]));
    }
    
    // Bloqueios do dia
    for (var b = 0; b < blocks.length; b++) {
      if (String(blocks[b][1]) !== String(prof.id)) continue;
      if (fmtDate(blocks[b][2]) !== body.date) continue;
      bloqueios.push({
        hora_inicio: fmtTime(blocks[b][3]),
        hora_fim: fmtTime(blocks[b][4]),
        tipo: str(blocks[b][5])
      });
    }
    
    resultado.push({
      agendadorId: String(prof.id),
      nome: prof.nome,
      horariosOcupados: ocupados.sort(),
      bloqueado: prof.agenda_bloqueada,
      almocoInicio: prof.almoco_inicio,
      almocoFim: prof.almoco_fim,
      bloqueios: bloqueios
    });
  }
  
  return { ok: true, date: body.date, profissionais: resultado };
}

// =====================================================
// BLOQUEIOS
// =====================================================

function formatBlock(r) {
  return {
    id: r[0], profissional_id: r[1], data: fmtDate(r[2]),
    hora_inicio: fmtTime(r[3]), hora_fim: fmtTime(r[4]),
    tipo_bloqueio: str(r[5]) || "manual", descricao: str(r[6]),
    created_at: str(r[7]), updated_at: str(r[8])
  };
}

function blockList(body) {
  var sheets = boot();
  var rows = getRows(sheets.BLOCK, COLS.BLOCK);
  var out = rows.map(function(r) { return formatBlock(r); });
  
  if (body) {
    if (body.data) out = out.filter(function(b) { return b.data === body.data; });
    if (body.profissional_id) out = out.filter(function(b) { return String(b.profissional_id) === String(body.profissional_id); });
  }
  
  return { ok: true, bloqueios: out };
}

function blockCreate(body) {
  if (!body || !body.profissional_id || !body.data || !body.hora_inicio || !body.hora_fim) {
    return { ok: false, err: "profissional_id, data, hora_inicio e hora_fim obrigatorios" };
  }
  var sheets = boot();
  var id = body.id || genId();
  var now = iso();
  sheets.BLOCK.appendRow([
    id, body.profissional_id, body.data,
    body.hora_inicio, body.hora_fim,
    body.tipo_bloqueio || "manual", body.descricao || "",
    now, now
  ]);
  return { ok: true, id: id, msg: "Bloqueio criado" };
}

function blockUpdate(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.BLOCK, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  
  var cur = sheets.BLOCK.getRange(row, 1, 1, COLS.BLOCK.length).getValues()[0];
  sheets.BLOCK.getRange(row, 1, 1, COLS.BLOCK.length).setValues([[
    body.id,
    body.profissional_id !== undefined ? body.profissional_id : cur[1],
    body.data !== undefined ? body.data : cur[2],
    body.hora_inicio !== undefined ? body.hora_inicio : cur[3],
    body.hora_fim !== undefined ? body.hora_fim : cur[4],
    body.tipo_bloqueio !== undefined ? body.tipo_bloqueio : cur[5],
    body.descricao !== undefined ? body.descricao : cur[6],
    cur[7], iso()
  ]]);
  return { ok: true, msg: "Bloqueio atualizado" };
}

function blockDelete(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.BLOCK, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  sheets.BLOCK.deleteRow(row);
  return { ok: true, msg: "Bloqueio removido" };
}

// =====================================================
// CAIXA
// =====================================================

function formatCash(r) {
  return {
    id: r[0], tipo: str(r[1]), cliente_id: r[2], descricao: str(r[3]),
    forma_pagamento: str(r[4]), bandeira_cartao: str(r[5]),
    taxa_cartao: toNum(r[6]), valor_original: toNum(r[7]), valor_real: toNum(r[8]),
    data: fmtDate(r[9]), hora: fmtTime(r[10]), status: str(r[11]) || "ativo",
    created_at: str(r[12]), updated_at: str(r[13])
  };
}

function cashList(body) {
  var sheets = boot();
  var rows = getRows(sheets.CASH, COLS.CASH);
  var out = rows.map(function(r) { return formatCash(r); });
  
  if (body) {
    if (body.data) out = out.filter(function(c) { return c.data === body.data; });
    if (body.cliente_id) out = out.filter(function(c) { return String(c.cliente_id) === String(body.cliente_id); });
    if (body.status) out = out.filter(function(c) { return c.status === body.status; });
    if (body.tipo) out = out.filter(function(c) { return c.tipo === body.tipo; });
  }
  
  return { ok: true, movimentacoes: out };
}

function cashCreate(body) {
  if (!body || !body.tipo) return { ok: false, err: "Tipo obrigatorio (entrada/saida)" };
  var sheets = boot();
  var id = body.id || genId();
  var now = iso();
  var data = body.data || fmtDate(new Date());
  var hora = body.hora || fmtTime(new Date());
  
  sheets.CASH.appendRow([
    id, body.tipo, body.cliente_id || "", body.descricao || "",
    body.forma_pagamento || "", body.bandeira_cartao || "",
    toNum(body.taxa_cartao), toNum(body.valor_original), toNum(body.valor_real || body.valor_original),
    data, hora, body.status || "ativo",
    now, now
  ]);
  
  // Adicionar itens se vierem
  if (body.itens && body.itens.length) {
    body.itens.forEach(function(item) {
      cashItemAdd({
        movimentacao_id: id,
        tipo_item: item.tipo_item,
        produto_id: item.produto_id,
        servico_id: item.servico_id,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario
      });
    });
    recalcCashTotal(id);
  }
  
  return { ok: true, id: id, msg: "Movimentacao criada" };
}

function cashUpdate(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.CASH, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  
  var cur = sheets.CASH.getRange(row, 1, 1, COLS.CASH.length).getValues()[0];
  
  // Salvar historico
  cashHistorySave({
    movimentacao_id: body.id,
    descricao_anterior: cur[3],
    forma_anterior: cur[4],
    bandeira_anterior: cur[5],
    taxa_anterior: cur[6],
    valor_orig_anterior: cur[7],
    valor_real_anterior: cur[8],
    motivo: body.motivo || ""
  });
  
  sheets.CASH.getRange(row, 1, 1, COLS.CASH.length).setValues([[
    body.id,
    body.tipo !== undefined ? body.tipo : cur[1],
    body.cliente_id !== undefined ? body.cliente_id : cur[2],
    body.descricao !== undefined ? body.descricao : cur[3],
    body.forma_pagamento !== undefined ? body.forma_pagamento : cur[4],
    body.bandeira_cartao !== undefined ? body.bandeira_cartao : cur[5],
    body.taxa_cartao !== undefined ? toNum(body.taxa_cartao) : cur[6],
    body.valor_original !== undefined ? toNum(body.valor_original) : cur[7],
    body.valor_real !== undefined ? toNum(body.valor_real) : cur[8],
    body.data !== undefined ? body.data : cur[9],
    body.hora !== undefined ? body.hora : cur[10],
    "editado",
    cur[12], iso()
  ]]);
  
  return { ok: true, msg: "Movimentacao atualizada" };
}

function cashCancel(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.CASH, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  
  var cur = sheets.CASH.getRange(row, 1, 1, COLS.CASH.length).getValues()[0];
  cashHistorySave({
    movimentacao_id: body.id,
    descricao_anterior: cur[3],
    forma_anterior: cur[4],
    bandeira_anterior: cur[5],
    taxa_anterior: cur[6],
    valor_orig_anterior: cur[7],
    valor_real_anterior: cur[8],
    motivo: body.motivo || "cancelamento"
  });
  
  sheets.CASH.getRange(row, 12).setValue("cancelado");
  sheets.CASH.getRange(row, 14).setValue(iso());
  
  return { ok: true, msg: "Movimentacao cancelada" };
}

function cashReport(body) {
  var lista = cashList(body).movimentacoes || [];
  var entradas = 0, saidas = 0, count = 0;
  
  lista.forEach(function(m) {
    if (m.status === "cancelado") return;
    count++;
    if (m.tipo === "entrada") entradas += m.valor_real;
    if (m.tipo === "saida") saidas += m.valor_real;
  });
  
  return {
    ok: true,
    total_entradas: entradas,
    total_saidas: saidas,
    saldo: entradas - saidas,
    quantidade: count
  };
}

function recalcCashTotal(movId) {
  var sheets = boot();
  var itens = cashItemList({ movimentacao_id: movId }).itens || [];
  var total = 0;
  itens.forEach(function(i) { total += i.valor_total; });
  
  var row = findRow(sheets.CASH, movId);
  if (row > 0) {
    sheets.CASH.getRange(row, 8).setValue(total);
    var curReal = sheets.CASH.getRange(row, 9).getValue();
    if (!curReal) sheets.CASH.getRange(row, 9).setValue(total);
    sheets.CASH.getRange(row, 14).setValue(iso());
  }
}

// =====================================================
// CAIXA ITENS
// =====================================================

function formatCashItem(r) {
  return {
    id: r[0], movimentacao_id: r[1], tipo_item: str(r[2]),
    produto_id: r[3], servico_id: r[4],
    quantidade: toNum(r[5], 1), valor_unitario: toNum(r[6]), valor_total: toNum(r[7]),
    created_at: str(r[8]), updated_at: str(r[9])
  };
}

function cashItemList(body) {
  if (!body || !body.movimentacao_id) return { ok: false, err: "movimentacao_id obrigatorio" };
  var sheets = boot();
  var rows = getRows(sheets.CASH_ITEMS, COLS.CASH_ITEMS);
  var out = [];
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][1]) === String(body.movimentacao_id)) {
      out.push(formatCashItem(rows[i]));
    }
  }
  return { ok: true, itens: out };
}

function cashItemAdd(body) {
  if (!body || !body.movimentacao_id || !body.tipo_item) {
    return { ok: false, err: "movimentacao_id e tipo_item obrigatorios" };
  }
  var sheets = boot();
  var id = body.id || genId();
  var now = iso();
  
  var valorUnit = toNum(body.valor_unitario);
  var prodId = "", servId = "";
  
  if (body.tipo_item === "produto" && body.produto_id) {
    prodId = body.produto_id;
    if (!valorUnit) {
      var prod = getProdById(sheets, body.produto_id);
      if (prod) valorUnit = prod.preco;
    }
  } else if (body.tipo_item === "servico" && body.servico_id) {
    servId = body.servico_id;
    if (!valorUnit) {
      var serv = getServById(sheets, body.servico_id);
      if (serv) valorUnit = serv.preco;
    }
  }
  
  var qtd = toNum(body.quantidade, 1);
  var valorTotal = qtd * valorUnit;
  
  sheets.CASH_ITEMS.appendRow([
    id, body.movimentacao_id, body.tipo_item,
    prodId, servId, qtd, valorUnit, valorTotal,
    now, now
  ]);
  
  recalcCashTotal(body.movimentacao_id);
  
  return { ok: true, id: id, msg: "Item adicionado" };
}

function cashItemUpdate(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.CASH_ITEMS, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  
  var cur = sheets.CASH_ITEMS.getRange(row, 1, 1, COLS.CASH_ITEMS.length).getValues()[0];
  var qtd = body.quantidade !== undefined ? toNum(body.quantidade, 1) : toNum(cur[5], 1);
  var valorUnit = body.valor_unitario !== undefined ? toNum(body.valor_unitario) : toNum(cur[6]);
  
  sheets.CASH_ITEMS.getRange(row, 1, 1, COLS.CASH_ITEMS.length).setValues([[
    body.id, cur[1],
    body.tipo_item !== undefined ? body.tipo_item : cur[2],
    body.produto_id !== undefined ? body.produto_id : cur[3],
    body.servico_id !== undefined ? body.servico_id : cur[4],
    qtd, valorUnit, qtd * valorUnit,
    cur[8], iso()
  ]]);
  
  recalcCashTotal(cur[1]);
  
  return { ok: true, msg: "Item atualizado" };
}

function cashItemRemove(body) {
  if (!body || !body.id) return { ok: false, err: "ID obrigatorio" };
  var sheets = boot();
  var row = findRow(sheets.CASH_ITEMS, body.id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };
  
  var movId = sheets.CASH_ITEMS.getRange(row, 2).getValue();
  sheets.CASH_ITEMS.deleteRow(row);
  recalcCashTotal(movId);
  
  return { ok: true, msg: "Item removido" };
}

// =====================================================
// CAIXA HISTORICO
// =====================================================

function cashHistorySave(body) {
  if (!body || !body.movimentacao_id) return { ok: false, err: "movimentacao_id obrigatorio" };
  var sheets = boot();
  var id = genId();
  var now = new Date();
  
  sheets.CASH_HIST.appendRow([
    id, body.movimentacao_id,
    body.descricao_anterior || "", body.forma_anterior || "",
    body.bandeira_anterior || "", toNum(body.taxa_anterior),
    toNum(body.valor_orig_anterior), toNum(body.valor_real_anterior),
    fmtDate(now), fmtTime(now), body.motivo || "",
    iso()
  ]);
  
  return { ok: true, id: id };
}

function cashHistoryGet(body) {
  if (!body || !body.movimentacao_id) return { ok: false, err: "movimentacao_id obrigatorio" };
  var sheets = boot();
  var rows = getRows(sheets.CASH_HIST, COLS.CASH_HIST);
  var out = [];
  
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][1]) === String(body.movimentacao_id)) {
      out.push({
        id: rows[i][0],
        movimentacao_id: rows[i][1],
        descricao_anterior: str(rows[i][2]),
        forma_anterior: str(rows[i][3]),
        bandeira_anterior: str(rows[i][4]),
        taxa_anterior: toNum(rows[i][5]),
        valor_orig_anterior: toNum(rows[i][6]),
        valor_real_anterior: toNum(rows[i][7]),
        data_edicao: str(rows[i][8]),
        hora_edicao: str(rows[i][9]),
        motivo: str(rows[i][10]),
        created_at: str(rows[i][11])
      });
    }
  }
  
  return { ok: true, historico: out };
}
`;
}

function showScriptBuilderCopiedNotice() {
  const existing = document.getElementById('script-builder-copied-notice');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'script-builder-copied-notice';
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal-content modal-confirm" onclick="event.stopPropagation()">
      <span class="modal-title">SCRIPT v4.0 COPIADO</span>
      <p class="modal-desc" style="text-align: left; line-height: 1.6;">
        Próximos passos:<br>
        1. Crie uma planilha no Google Sheets<br>
        2. Acesse Extensões &gt; Apps Script<br>
        3. Apague tudo e cole o script<br>
        4. Salve (Ctrl+S)<br>
        5. Implantar &gt; Nova implantação<br>
        6. Tipo: App da Web<br>
        7. Executar como: Eu<br>
        8. Acesso: Qualquer pessoa<br>
        9. Copie a URL gerada e use no app
      </p>
      <div class="modal-confirm-buttons">
        <button type="button" class="btn-secondary" onclick="document.getElementById('script-builder-copied-notice').remove()">OK</button>
      </div>
    </div>
  `;

  modal.onclick = function (event) {
    if (event.target === modal) modal.remove();
  };

  document.body.appendChild(modal);
}

function copyScriptBuilderScript(options) {
    const settings = options || {};
    const script = buildScriptBuilderScript();
  if (script === SCRIPT_BUILDER_EMPTY_SCRIPT) {
        showToast('Defina uma senha para o administrador antes de copiar', 'warning');
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(script)
            .then(() => {
              showToast('Script copiado para a área de transferência', 'success');
              if (settings.showNotice) showScriptBuilderCopiedNotice();
            })
            .catch(() => fallbackCopyScriptBuilderScript(script));
        return;
    }

    fallbackCopyScriptBuilderScript(script, settings);
}

function fallbackCopyScriptBuilderScript(script, settings) {
    const textArea = document.createElement('textarea');
    textArea.value = script;
    textArea.setAttribute('readonly', 'readonly');
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();

    const copied = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (copied) {
        showToast('Script copiado para a área de transferência', 'success');
    if (settings && settings.showNotice) showScriptBuilderCopiedNotice();
    } else {
        showToast('Não foi possível copiar automaticamente', 'error');
    }
}

function downloadScriptBuilderScript() {
    const script = buildScriptBuilderScript();
  if (script === SCRIPT_BUILDER_EMPTY_SCRIPT) {
        showToast('Defina uma senha para o administrador antes de baixar', 'warning');
        return;
    }

    const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nexus-saas-v4.gs';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function escapeScriptBuilderHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

loadScriptBuilderConfig();

Object.assign(window, {
  isScriptBuilderAuthorized,
  consumeScriptBuilderAccess,
  openScriptBuilderProtected,
  closeScriptBuilderAccessModal,
  submitScriptBuilderAccessPassword,
  generateAndCopyScriptBuilder,
  renderScriptBuilderScreen,
  updateScriptBuilderAdmin,
  toggleScriptBuilderAdminPassword,
  addScriptBuilderProfessional,
  removeScriptBuilderProfessional,
  updateScriptBuilderProfessional,
  changeScriptBuilderDay,
  editScriptBuilderTime,
  adjustScriptBuilderTimeValue,
  confirmScriptBuilderTimeEdit,
  closeScriptBuilderTimeModal,
  applyScriptBuilderCurrentDayToAll,
  applyScriptBuilderWeekdayPreset,
  resetScriptBuilderConfig,
  importConnectedConfigToBuilder,
  generateScriptBuilderPreview,
  copyScriptBuilderScript,
  downloadScriptBuilderScript
});
