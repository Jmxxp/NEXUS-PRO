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
  '// Configure o administrador, os agendadores e os horários para gerar o Apps Script v3.0.',
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
    status.textContent = `v3.0 • ${professionals.length} agendador(es) • ${SCRIPT_BUILDER_DAYS.length} dias • prévia atualizada`;
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
 * NEXUS - SISTEMA DE AGENDAMENTO / GESTAO v3.0
 * Google Apps Script + Google Sheets
 * Gerado em: ${new Date().toLocaleString('pt-BR')}
 * =============================================
 *
 * COMO USAR:
 * 1. Crie uma planilha no Google Sheets
 * 2. Extensoes > Apps Script
 * 3. Apague tudo e cole este codigo
 * 4. Salve
 * 5. Implantar > Nova implantacao
 *    - Tipo: App da Web
 *    - Executar como: Eu
 *    - Acesso: Qualquer pessoa
 * 6. Copie a URL e use no app
 *
 * =============================================
 * ACTIONS DISPONIVEIS
 * =============================================
 *
 * GERAIS
 * - ping
 * - auth
 * - agendadores
 *
 * CLIENTES
 * - buscarCliente
 * - cadastrarCliente
 * - atualizarCliente
 * - excluirCliente
 * - listarClientes
 * - CLIENT_CREATE
 * - CLIENT_UPDATE
 * - CLIENT_DELETE
 * - CLIENT_LIST
 * - CLIENT_SEARCH
 *
 * SERVICOS
 * - SERVICE_CREATE
 * - SERVICE_UPDATE
 * - SERVICE_DELETE
 * - SERVICE_LIST
 * - SERVICE_GET
 *
 * PRODUTOS
 * - PRODUCT_CREATE
 * - PRODUCT_UPDATE
 * - PRODUCT_DELETE
 * - PRODUCT_LIST
 * - PRODUCT_GET
 * - PRODUCT_STOCK_ADD
 * - PRODUCT_STOCK_REMOVE
 * - PRODUCT_STOCK_SET
 *
 * AGENDA
 * - list                      (legacy)
 * - create                    (legacy)
 * - update                    (legacy)
 * - delete                    (legacy)
 * - disponibilidade
 * - APPT_CREATE
 * - APPT_UPDATE
 * - APPT_DELETE
 * - APPT_LIST
 * - APPT_GET_BY_DATE
 * - APPT_GET_BY_CLIENT
 * - APPT_GET_BY_PROFESSIONAL
 *
 * BLOQUEIOS
 * - BLOCK_CREATE
 * - BLOCK_UPDATE
 * - BLOCK_DELETE
 * - BLOCK_LIST
 * - BLOCK_GET_BY_DATE
 * - BLOCK_GET_BY_PROFESSIONAL
 *
 * CONFIGURACOES / PROFISSIONAIS
 * - getAgendadorConfig
 * - setAgendadorConfig
 * - getAllConfigs
 * - PROF_SET_STATUS
 * - PROF_SET_LUNCH
 * - PROF_SET_AGENDA_BLOCK
 *
 * CAIXA
 * - CASH_CREATE
 * - CASH_UPDATE
 * - CASH_CANCEL
 * - CASH_GET_BY_DATE
 * - CASH_GET_BY_CLIENT
 * - CASH_GET_REPORT
 * - CASH_ITEM_ADD
 * - CASH_ITEM_UPDATE
 * - CASH_ITEM_REMOVE
 * - CASH_ITEM_LIST
 * - CASH_HISTORY_GET
 */

// =====================================================
// CONFIGURACOES FIXAS
// =====================================================

// AGENDADORES / PROFISSIONAIS
// OBS: primeiro sempre admin
var AGENDADORES = ${JSON.stringify(agendadores.map((a) => ({ id: a.id, nome: a.nome, senha: a.senha, isAdmin: a.isAdmin || false })), null, 2)};

// Horario geral do sistema por dia da semana
var HORARIOS = ${JSON.stringify(horarios, null, 2)};

// Abas
var SHEET_AGENDAMENTOS       = "Agendamentos";
var SHEET_CLIENTES           = "Clientes";
var SHEET_CONFIGURACOES      = "Configuracoes";
var SHEET_SERVICOS           = "Servicos";
var SHEET_PRODUTOS           = "Produtos";
var SHEET_BLOQUEIOS          = "BloqueiosAgenda";
var SHEET_CAIXA              = "Caixa";
var SHEET_CAIXA_ITENS        = "CaixaItens";
var SHEET_CAIXA_HISTORICO    = "CaixaHistorico";

// Colunas
var COLS_AGENDAMENTOS = [
  "ID",
  "Data",
  "HoraInicio",
  "HoraFim",
  "ClienteID",
  "ClienteNome",
  "Telefone",
  "AgendadorID",
  "AgendadorNome",
  "ServicoID",
  "ServicoNome",
  "Status",
  "Observacoes",
  "Criado",
  "Atualizado"
];

var COLS_CLIENTES = [
  "ID",
  "Nome",
  "Telefone",
  "CPF",
  "Aniversario",
  "Observacoes",
  "Status",
  "Criado",
  "Atualizado"
];

var COLS_CONFIGURACOES = [
  "AgendadorID",
  "AgendadorNome",
  "Status",
  "AlmocoInicio",
  "AlmocoFim",
  "AgendaTotalBloqueada",
  "Atualizado"
];

var COLS_SERVICOS = [
  "ID",
  "Nome",
  "Preco",
  "DuracaoMinutos",
  "Descricao",
  "Status",
  "Criado",
  "Atualizado"
];

var COLS_PRODUTOS = [
  "ID",
  "Nome",
  "Preco",
  "EstoqueDisponivel",
  "Descricao",
  "Status",
  "Criado",
  "Atualizado"
];

var COLS_BLOQUEIOS = [
  "ID",
  "ProfissionalID",
  "ProfissionalNome",
  "Data",
  "HoraInicio",
  "HoraFim",
  "TipoBloqueio", // almoco / manual / agenda_total
  "Descricao",
  "Criado",
  "Atualizado"
];

var COLS_CAIXA = [
  "ID",
  "TipoMovimentacao",     // entrada / saida
  "ClienteID",
  "ClienteNome",
  "Descricao",
  "FormaPagamento",       // dinheiro / pix / cartao / carne
  "BandeiraCartao",       // visa / elo / mastercard / amex / hiper
  "TaxaCartao",
  "ValorOriginal",
  "ValorCobradoReal",
  "Data",
  "Hora",
  "Status",               // ativo / editado / cancelado
  "Criado",
  "Atualizado"
];

var COLS_CAIXA_ITENS = [
  "ID",
  "MovimentacaoID",
  "TipoItem",             // produto / servico
  "ProdutoID",
  "ProdutoNome",
  "ServicoID",
  "ServicoNome",
  "Quantidade",
  "ValorUnitario",
  "ValorTotal",
  "Criado",
  "Atualizado"
];

var COLS_CAIXA_HISTORICO = [
  "ID",
  "MovimentacaoID",
  "DescricaoAnterior",
  "FormaPagamentoAnterior",
  "BandeiraCartaoAnterior",
  "TaxaCartaoAnterior",
  "ValorOriginalAnterior",
  "ValorCobradoRealAnterior",
  "DataEdicao",
  "HoraEdicao",
  "MotivoEdicao",
  "Criado"
];

// =====================================================
// BOOT
// =====================================================

function boot() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error("Este script precisa estar vinculado a uma planilha do Google Sheets.");
  }

  var shAgend = ensureSheet(ss, SHEET_AGENDAMENTOS, COLS_AGENDAMENTOS);
  var shClientes = ensureSheet(ss, SHEET_CLIENTES, COLS_CLIENTES);
  var shConfig = ensureSheet(ss, SHEET_CONFIGURACOES, COLS_CONFIGURACOES);
  var shServicos = ensureSheet(ss, SHEET_SERVICOS, COLS_SERVICOS);
  var shProdutos = ensureSheet(ss, SHEET_PRODUTOS, COLS_PRODUTOS);
  var shBloqueios = ensureSheet(ss, SHEET_BLOQUEIOS, COLS_BLOQUEIOS);
  var shCaixa = ensureSheet(ss, SHEET_CAIXA, COLS_CAIXA);
  var shCaixaItens = ensureSheet(ss, SHEET_CAIXA_ITENS, COLS_CAIXA_ITENS);
  var shCaixaHistorico = ensureSheet(ss, SHEET_CAIXA_HISTORICO, COLS_CAIXA_HISTORICO);

  initConfigs(shConfig);

  return {
    agendamentos: shAgend,
    clientes: shClientes,
    configuracoes: shConfig,
    servicos: shServicos,
    produtos: shProdutos,
    bloqueios: shBloqueios,
    caixa: shCaixa,
    caixaItens: shCaixaItens,
    caixaHistorico: shCaixaHistorico
  };
}

function ensureSheet(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
  }

  var hasHeader = sh.getLastRow() >= 1;
  if (!hasHeader) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sh.setFrozenRows(1);
  } else {
    var currentHeaders = sh.getRange(1, 1, 1, headers.length).getValues()[0];
    var needsUpdate = false;
    for (var i = 0; i < headers.length; i++) {
      if (String(currentHeaders[i] || "") !== String(headers[i])) {
        needsUpdate = true;
        break;
      }
    }
    if (needsUpdate) {
      sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
      sh.setFrozenRows(1);
    }
  }

  return sh;
}

function initConfigs(shConfig) {
  var last = shConfig.getLastRow();
  var existing = {};
  if (last > 1) {
    var rows = shConfig.getRange(2, 1, last - 1, COLS_CONFIGURACOES.length).getValues();
    for (var i = 0; i < rows.length; i++) {
      existing[String(rows[i][0])] = true;
    }
  }

  var insertRows = [];
  AGENDADORES.forEach(function(a) {
    if (!existing[String(a.id)]) {
      insertRows.push([
        a.id,
        a.nome,
        "ativo",
        "",
        "",
        false,
        new Date().toISOString()
      ]);
    }
  });

  if (insertRows.length > 0) {
    shConfig.getRange(shConfig.getLastRow() + 1, 1, insertRows.length, COLS_CONFIGURACOES.length).setValues(insertRows);
  }
}

// =====================================================
// WEB ENTRYPOINTS
// =====================================================

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "ping";
    return reply(route(action, null));
  } catch (err) {
    return reply({ ok: false, err: "doGet error: " + err.toString() });
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return reply({ ok: false, err: "Requisicao invalida - sem dados" });
    }
    var body = JSON.parse(e.postData.contents);
    var action = body.action || (e.parameter && e.parameter.action) || "ping";
    return reply(route(action, body));
  } catch (err) {
    return reply({ ok: false, err: "doPost error: " + err.toString() });
  }
}

function reply(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// =====================================================
// ROUTER
// =====================================================

function route(action, body) {
  try {
    switch (action) {
      // Gerais
      case "ping": return pingComConfigs();
      case "auth": return auth(body);
      case "agendadores": return listAgendadores();

      // Legacy agenda
      case "list": return listAgendamentos(body);
      case "create": return createAgendamento(body);
      case "update": return updateAgendamento(body);
      case "delete": return removeAgendamento(body && body.id ? body.id : null);
      case "disponibilidade": return checkDisponibilidade(body);

      // Legacy clientes
      case "buscarCliente": return buscarCliente(body);
      case "cadastrarCliente": return cadastrarCliente(body);
      case "atualizarCliente": return atualizarCliente(body);
      case "excluirCliente": return excluirCliente(body);
      case "listarClientes": return listarClientes(body);

      // Legacy configuracoes
      case "getAgendadorConfig": return getAgendadorConfig(body);
      case "setAgendadorConfig": return setAgendadorConfig(body);
      case "getAllConfigs": return getAllConfigs();

      // Clientes
      case "CLIENT_CREATE": return cadastrarCliente(body);
      case "CLIENT_UPDATE": return atualizarCliente(body);
      case "CLIENT_DELETE": return excluirCliente(body);
      case "CLIENT_LIST": return listarClientes(body);
      case "CLIENT_SEARCH": return buscarCliente(body);

      // Servicos
      case "SERVICE_CREATE": return serviceCreate(body);
      case "SERVICE_UPDATE": return serviceUpdate(body);
      case "SERVICE_DELETE": return serviceDelete(body);
      case "SERVICE_LIST": return serviceList(body);
      case "SERVICE_GET": return serviceGet(body);

      // Produtos
      case "PRODUCT_CREATE": return productCreate(body);
      case "PRODUCT_UPDATE": return productUpdate(body);
      case "PRODUCT_DELETE": return productDelete(body);
      case "PRODUCT_LIST": return productList(body);
      case "PRODUCT_GET": return productGet(body);
      case "PRODUCT_STOCK_ADD": return productStockAdd(body);
      case "PRODUCT_STOCK_REMOVE": return productStockRemove(body);
      case "PRODUCT_STOCK_SET": return productStockSet(body);

      // Agenda
      case "APPT_CREATE": return createAgendamento(body);
      case "APPT_UPDATE": return updateAgendamento(body);
      case "APPT_DELETE": return removeAgendamento(body && body.id ? body.id : null);
      case "APPT_LIST": return listAgendamentos(body);
      case "APPT_GET_BY_DATE": return listAgendamentos(body);
      case "APPT_GET_BY_CLIENT": return listAgendamentos(body);
      case "APPT_GET_BY_PROFESSIONAL": return listAgendamentos(body);

      // Bloqueios
      case "BLOCK_CREATE": return blockCreate(body);
      case "BLOCK_UPDATE": return blockUpdate(body);
      case "BLOCK_DELETE": return blockDelete(body);
      case "BLOCK_LIST": return blockList(body);
      case "BLOCK_GET_BY_DATE": return blockList(body);
      case "BLOCK_GET_BY_PROFESSIONAL": return blockList(body);

      // Configs / profissionais
      case "PROF_SET_STATUS": return setProfStatus(body);
      case "PROF_SET_LUNCH": return setProfLunch(body);
      case "PROF_SET_AGENDA_BLOCK": return setProfAgendaBlock(body);

      // Caixa
      case "CASH_CREATE": return cashCreate(body);
      case "CASH_UPDATE": return cashUpdate(body);
      case "CASH_CANCEL": return cashCancel(body);
      case "CASH_GET_BY_DATE": return cashList(body);
      case "CASH_GET_BY_CLIENT": return cashList(body);
      case "CASH_GET_REPORT": return cashReport(body);

      // Itens caixa
      case "CASH_ITEM_ADD": return cashItemAdd(body);
      case "CASH_ITEM_UPDATE": return cashItemUpdate(body);
      case "CASH_ITEM_REMOVE": return cashItemRemove(body);
      case "CASH_ITEM_LIST": return cashItemList(body);

      // Historico
      case "CASH_HISTORY_GET": return cashHistoryGet(body);

      default:
        return { ok: false, err: "Acao desconhecida: " + action };
    }
  } catch (e) {
    return { ok: false, err: e.toString() };
  }
}

// =====================================================
// HELPERS GERAIS
// =====================================================

function nowIso() {
  return new Date().toISOString();
}

function genId() {
  return String(new Date().getTime()) + String(Math.floor(Math.random() * 1000));
}

function fmtDate(v) {
  if (!v) return "";
  if (typeof v === "string" && /^\\d{4}-\\d{2}-\\d{2}$/.test(v)) return v;
  if (v instanceof Date) return v.getFullYear() + "-" + pad(v.getMonth() + 1) + "-" + pad(v.getDate());
  try {
    var d = new Date(v);
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  } catch (e) {
    return String(v);
  }
}

function fmtTime(v) {
  if (!v) return "";
  if (typeof v === "string" && /^\\d{2}:\\d{2}$/.test(v)) return v;
  if (v instanceof Date) return pad(v.getHours()) + ":" + pad(v.getMinutes());
  var m = String(v).match(/(\\d{1,2}):(\\d{2})/);
  if (m) return pad(parseInt(m[1], 10)) + ":" + m[2];
  return String(v);
}

function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}

function toNumber(v, def) {
  var n = Number(v);
  return isNaN(n) ? (def || 0) : n;
}

function toBool(v) {
  return v === true || v === "true" || v === "TRUE" || v === 1 || v === "1";
}

function normalizeText(v) {
  return String(v || "").trim();
}

function findRowById(sh, id) {
  if (!id) return -1;
  var last = sh.getLastRow();
  if (last <= 1) return -1;
  var ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function getSheetRows(sh, colsLength) {
  var last = sh.getLastRow();
  if (last <= 1) return [];
  return sh.getRange(2, 1, last - 1, colsLength).getValues();
}

function listAgendadores() {
  var configs = carregarTodasConfigs(boot().configuracoes);
  return {
    ok: true,
    data: AGENDADORES.map(function(a) {
      var cfg = configs[String(a.id)] || {};
      return {
        id: a.id,
        nome: a.nome,
        isAdmin: a.isAdmin,
        status: cfg.status || "ativo",
        almocoInicio: cfg.almocoInicio || "",
        almocoFim: cfg.almocoFim || "",
        agendaTotalBloqueada: cfg.agendaTotalBloqueada || false
      };
    })
  };
}

function getAgendadorById(id) {
  return AGENDADORES.filter(function(a) {
    return String(a.id) === String(id);
  })[0] || null;
}

// =====================================================
// CONFIGURACOES / PROFISSIONAIS
// =====================================================

function carregarTodasConfigs(shConfig) {
  var configs = {};
  var rows = getSheetRows(shConfig, COLS_CONFIGURACOES.length);

  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    configs[String(r[0])] = {
      agendadorId: r[0],
      agendadorNome: r[1],
      status: String(r[2] || "ativo"),
      almocoInicio: String(r[3] || ""),
      almocoFim: String(r[4] || ""),
      agendaTotalBloqueada: toBool(r[5]),
      atualizado: r[6]
    };
  }
  return configs;
}

function pingComConfigs() {
  var sheets = boot();
  var configs = carregarTodasConfigs(sheets.configuracoes);

  var agendadoresComConfig = AGENDADORES.map(function(a) {
    var cfg = configs[String(a.id)] || {};
    return {
      id: a.id,
      nome: a.nome,
      isAdmin: a.isAdmin,
      status: cfg.status || "ativo",
      almocoInicio: cfg.almocoInicio || "",
      almocoFim: cfg.almocoFim || "",
      agendaTotalBloqueada: cfg.agendaTotalBloqueada || false
    };
  });

  return {
    ok: true,
    msg: "Conectado!",
    agendadores: agendadoresComConfig,
    horarios: HORARIOS
  };
}

function getAllConfigs() {
  var sheets = boot();
  var configs = carregarTodasConfigs(sheets.configuracoes);
  return { ok: true, configs: configs };
}

function getAgendadorConfig(body) {
  if (!body || !body.agendadorId) return { ok: false, err: "agendadorId obrigatorio" };

  var sheets = boot();
  var configs = carregarTodasConfigs(sheets.configuracoes);
  var cfg = configs[String(body.agendadorId)];

  if (cfg) {
    return { ok: true, config: cfg };
  }

  return {
    ok: true,
    config: {
      agendadorId: body.agendadorId,
      agendadorNome: "",
      status: "ativo",
      almocoInicio: "",
      almocoFim: "",
      agendaTotalBloqueada: false
    }
  };
}

function setAgendadorConfig(body) {
  if (!body || !body.agendadorId) return { ok: false, err: "agendadorId obrigatorio" };

  var sheets = boot();
  var sh = sheets.configuracoes;
  var ag = getAgendadorById(body.agendadorId);
  if (!ag) return { ok: false, err: "Agendador nao encontrado" };

  var row = findRowById(sh, body.agendadorId);
  var current = row > 0 ? sh.getRange(row, 1, 1, COLS_CONFIGURACOES.length).getValues()[0] : null;

  var values = [
    body.agendadorId,
    ag.nome,
    body.status !== undefined ? body.status : (current ? current[2] : "ativo"),
    body.almocoInicio !== undefined ? body.almocoInicio : (current ? current[3] : ""),
    body.almocoFim !== undefined ? body.almocoFim : (current ? current[4] : ""),
    body.agendaTotalBloqueada !== undefined ? toBool(body.agendaTotalBloqueada) : (current ? toBool(current[5]) : false),
    nowIso()
  ];

  if (row > 0) {
    sh.getRange(row, 1, 1, COLS_CONFIGURACOES.length).setValues([values]);
  } else {
    sh.appendRow(values);
  }

  return { ok: true, msg: "Configuracao salva" };
}

function setProfStatus(body) {
  if (!body || !body.agendadorId || !body.status) {
    return { ok: false, err: "agendadorId e status obrigatorios" };
  }
  return setAgendadorConfig({
    agendadorId: body.agendadorId,
    status: body.status
  });
}

function setProfLunch(body) {
  if (!body || !body.agendadorId) {
    return { ok: false, err: "agendadorId obrigatorio" };
  }
  return setAgendadorConfig({
    agendadorId: body.agendadorId,
    almocoInicio: body.almocoInicio || "",
    almocoFim: body.almocoFim || ""
  });
}

function setProfAgendaBlock(body) {
  if (!body || !body.agendadorId) {
    return { ok: false, err: "agendadorId obrigatorio" };
  }
  return setAgendadorConfig({
    agendadorId: body.agendadorId,
    agendaTotalBloqueada: toBool(body.agendaTotalBloqueada)
  });
}

// =====================================================
// AUTH
// =====================================================

function auth(d) {
  if (!d || !d.agendadorId || !d.senha) {
    return { ok: false, err: "ID e senha obrigatorios" };
  }
  var ag = getAgendadorById(d.agendadorId);
  if (!ag) return { ok: false, err: "Agendador nao encontrado" };
  if (ag.senha !== d.senha) return { ok: false, err: "Senha incorreta" };

  var cfg = carregarTodasConfigs(boot().configuracoes)[String(ag.id)] || {};
  return {
    ok: true,
    agendador: {
      id: ag.id,
      nome: ag.nome,
      isAdmin: ag.isAdmin,
      status: cfg.status || "ativo",
      almocoInicio: cfg.almocoInicio || "",
      almocoFim: cfg.almocoFim || "",
      agendaTotalBloqueada: cfg.agendaTotalBloqueada || false
    }
  };
}

// =====================================================
// CLIENTES
// =====================================================

function formatarCliente(row) {
  return {
    id: row[0],
    nome: String(row[1] || ""),
    telefone: String(row[2] || ""),
    cpf: String(row[3] || ""),
    aniversario: String(row[4] || ""),
    observacoes: String(row[5] || ""),
    status: String(row[6] || "ativo"),
    criado: String(row[7] || ""),
    atualizado: String(row[8] || "")
  };
}

function buscarCliente(body) {
  if (!body) return { ok: false, err: "Dados obrigatorios" };

  var sheets = boot();
  var sh = sheets.clientes;
  var rows = getSheetRows(sh, COLS_CLIENTES.length);
  var termo = String(body.termo || body.nome || body.telefone || body.cpf || "").toLowerCase().trim();
  var termoNumeros = termo.replace(/\\D/g, "");

  if (!termo) return { ok: true, encontrado: false, msg: "Termo vazio" };

  var encontrados = [];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var nome = String(r[1] || "").toLowerCase();
    var telefone = String(r[2] || "").replace(/\\D/g, "");
    var cpf = String(r[3] || "").replace(/\\D/g, "");

    var match = false;
    if (termoNumeros && telefone && (telefone.indexOf(termoNumeros) >= 0 || termoNumeros.indexOf(telefone) >= 0)) match = true;
    if (termo && nome.indexOf(termo) >= 0) match = true;
    if (termoNumeros && cpf && cpf === termoNumeros) match = true;

    if (match) {
      encontrados.push(formatarCliente(r));
    }
  }

  if (encontrados.length === 0) {
    return { ok: true, encontrado: false, msg: "Cliente nao encontrado", clientes: [] };
  }

  return {
    ok: true,
    encontrado: true,
    cliente: encontrados[0],
    clientes: encontrados
  };
}

function cadastrarCliente(body) {
  if (!body || !body.nome) return { ok: false, err: "Nome obrigatorio" };

  var sheets = boot();
  var sh = sheets.clientes;

  if (body.telefone) {
    var existente = buscarCliente({ termo: body.telefone });
    if (existente.ok && existente.encontrado && existente.cliente) {
      return { ok: false, err: "Ja existe cliente com este telefone: " + existente.cliente.nome };
    }
  }

  var id = body.id || genId();
  var agora = nowIso();

  sh.appendRow([
    id,
    body.nome || "",
    body.telefone || "",
    body.cpf || "",
    body.aniversario || "",
    body.observacoes || "",
    body.status || "ativo",
    agora,
    agora
  ]);

  return { ok: true, id: id, msg: "Cliente cadastrado com sucesso" };
}

function atualizarCliente(body) {
  if (!body || !body.id) return { ok: false, err: "ID do cliente obrigatorio" };

  var sheets = boot();
  var sh = sheets.clientes;
  var row = findRowById(sh, body.id);

  if (row <= 0) return { ok: false, err: "Cliente nao encontrado" };

  var cur = sh.getRange(row, 1, 1, COLS_CLIENTES.length).getValues()[0];

  sh.getRange(row, 1, 1, COLS_CLIENTES.length).setValues([[
    body.id,
    body.nome !== undefined ? body.nome : cur[1],
    body.telefone !== undefined ? body.telefone : cur[2],
    body.cpf !== undefined ? body.cpf : cur[3],
    body.aniversario !== undefined ? body.aniversario : cur[4],
    body.observacoes !== undefined ? body.observacoes : cur[5],
    body.status !== undefined ? body.status : cur[6],
    cur[7],
    nowIso()
  ]]);

  return { ok: true, msg: "Cliente atualizado" };
}

function excluirCliente(body) {
  if (!body || !body.id) return { ok: false, err: "ID do cliente obrigatorio" };

  var sheets = boot();
  var sh = sheets.clientes;
  var row = findRowById(sh, body.id);

  if (row <= 0) return { ok: false, err: "Cliente nao encontrado" };

  sh.deleteRow(row);
  return { ok: true, msg: "Cliente excluido" };
}

function listarClientes(body) {
  var sheets = boot();
  var sh = sheets.clientes;
  var rows = getSheetRows(sh, COLS_CLIENTES.length);
  var out = [];

  for (var i = 0; i < rows.length; i++) {
    var c = formatarCliente(rows[i]);

    if (body && body.status && String(c.status) !== String(body.status)) continue;
    if (body && body.id && String(c.id) !== String(body.id)) continue;

    out.push(c);
  }

  return { ok: true, clientes: out };
}

function getClienteById(clienteId) {
  if (!clienteId) return null;
  var sheets = boot();
  var sh = sheets.clientes;
  var row = findRowById(sh, clienteId);
  if (row <= 0) return null;
  var data = sh.getRange(row, 1, 1, COLS_CLIENTES.length).getValues()[0];
  return formatarCliente(data);
}

// =====================================================
// SERVICOS
// =====================================================

function formatarServico(row) {
  return {
    id: row[0],
    nome: String(row[1] || ""),
    preco: Number(row[2] || 0),
    duracaoMinutos: Number(row[3] || 0),
    descricao: String(row[4] || ""),
    status: String(row[5] || "ativo"),
    criado: String(row[6] || ""),
    atualizado: String(row[7] || "")
  };
}

function serviceCreate(body) {
  if (!body || !body.nome) return { ok: false, err: "Nome do servico obrigatorio" };

  var sheets = boot();
  var sh = sheets.servicos;
  var id = body.id || genId();
  var agora = nowIso();

  sh.appendRow([
    id,
    body.nome || "",
    toNumber(body.preco, 0),
    toNumber(body.duracaoMinutos, 0),
    body.descricao || "",
    body.status || "ativo",
    agora,
    agora
  ]);

  return { ok: true, id: id, msg: "Servico criado" };
}

function serviceUpdate(body) {
  if (!body || !body.id) return { ok: false, err: "ID do servico obrigatorio" };

  var sheets = boot();
  var sh = sheets.servicos;
  var row = findRowById(sh, body.id);
  if (row <= 0) return { ok: false, err: "Servico nao encontrado" };

  var cur = sh.getRange(row, 1, 1, COLS_SERVICOS.length).getValues()[0];
  sh.getRange(row, 1, 1, COLS_SERVICOS.length).setValues([[
    body.id,
    body.nome !== undefined ? body.nome : cur[1],
    body.preco !== undefined ? toNumber(body.preco, 0) : cur[2],
    body.duracaoMinutos !== undefined ? toNumber(body.duracaoMinutos, 0) : cur[3],
    body.descricao !== undefined ? body.descricao : cur[4],
    body.status !== undefined ? body.status : cur[5],
    cur[6],
    nowIso()
  ]]);

  return { ok: true, msg: "Servico atualizado" };
}

function serviceDelete(body) {
  if (!body || !body.id) return { ok: false, err: "ID do servico obrigatorio" };

  var sheets = boot();
  var sh = sheets.servicos;
  var row = findRowById(sh, body.id);
  if (row <= 0) return { ok: false, err: "Servico nao encontrado" };

  sh.deleteRow(row);
  return { ok: true, msg: "Servico excluido" };
}

function serviceList(body) {
  var sheets = boot();
  var rows = getSheetRows(sheets.servicos, COLS_SERVICOS.length);
  var out = [];

  for (var i = 0; i < rows.length; i++) {
    var s = formatarServico(rows[i]);
    if (body && body.id && String(s.id) !== String(body.id)) continue;
    if (body && body.status && String(s.status) !== String(body.status)) continue;
    out.push(s);
  }

  return { ok: true, servicos: out };
}

function serviceGet(body) {
  if (!body || !body.id) return { ok: false, err: "ID do servico obrigatorio" };
  var r = serviceList({ id: body.id });
  return {
    ok: true,
    servico: r.servicos && r.servicos.length ? r.servicos[0] : null
  };
}

function getServicoById(servicoId) {
  if (!servicoId) return null;
  var sheets = boot();
  var sh = sheets.servicos;
  var row = findRowById(sh, servicoId);
  if (row <= 0) return null;
  return formatarServico(sh.getRange(row, 1, 1, COLS_SERVICOS.length).getValues()[0]);
}

// =====================================================
// PRODUTOS
// =====================================================

function formatarProduto(row) {
  return {
    id: row[0],
    nome: String(row[1] || ""),
    preco: Number(row[2] || 0),
    estoqueDisponivel: Number(row[3] || 0),
    descricao: String(row[4] || ""),
    status: String(row[5] || "ativo"),
    criado: String(row[6] || ""),
    atualizado: String(row[7] || "")
  };
}

function productCreate(body) {
  if (!body || !body.nome) return { ok: false, err: "Nome do produto obrigatorio" };

  var sheets = boot();
  var sh = sheets.produtos;
  var id = body.id || genId();
  var agora = nowIso();

  sh.appendRow([
    id,
    body.nome || "",
    toNumber(body.preco, 0),
    toNumber(body.estoqueDisponivel, 0),
    body.descricao || "",
    body.status || "ativo",
    agora,
    agora
  ]);

  return { ok: true, id: id, msg: "Produto criado" };
}

function productUpdate(body) {
  if (!body || !body.id) return { ok: false, err: "ID do produto obrigatorio" };

  var sheets = boot();
  var sh = sheets.produtos;
  var row = findRowById(sh, body.id);
  if (row <= 0) return { ok: false, err: "Produto nao encontrado" };

  var cur = sh.getRange(row, 1, 1, COLS_PRODUTOS.length).getValues()[0];
  sh.getRange(row, 1, 1, COLS_PRODUTOS.length).setValues([[
    body.id,
    body.nome !== undefined ? body.nome : cur[1],
    body.preco !== undefined ? toNumber(body.preco, 0) : cur[2],
    body.estoqueDisponivel !== undefined ? toNumber(body.estoqueDisponivel, 0) : cur[3],
    body.descricao !== undefined ? body.descricao : cur[4],
    body.status !== undefined ? body.status : cur[5],
    cur[6],
    nowIso()
  ]]);

  return { ok: true, msg: "Produto atualizado" };
}

function productDelete(body) {
  if (!body || !body.id) return { ok: false, err: "ID do produto obrigatorio" };

  var sheets = boot();
  var sh = sheets.produtos;
  var row = findRowById(sh, body.id);
  if (row <= 0) return { ok: false, err: "Produto nao encontrado" };

  sh.deleteRow(row);
  return { ok: true, msg: "Produto excluido" };
}

function productList(body) {
  var sheets = boot();
  var rows = getSheetRows(sheets.produtos, COLS_PRODUTOS.length);
  var out = [];

  for (var i = 0; i < rows.length; i++) {
    var p = formatarProduto(rows[i]);
    if (body && body.id && String(p.id) !== String(body.id)) continue;
    if (body && body.status && String(p.status) !== String(body.status)) continue;
    out.push(p);
  }

  return { ok: true, produtos: out };
}

function productGet(body) {
  if (!body || !body.id) return { ok: false, err: "ID do produto obrigatorio" };
  var r = productList({ id: body.id });
  return {
    ok: true,
    produto: r.produtos && r.produtos.length ? r.produtos[0] : null
  };
}

function productStockAdd(body) {
  if (!body || !body.id) return { ok: false, err: "ID do produto obrigatorio" };
  var produto = productGet({ id: body.id }).produto;
  if (!produto) return { ok: false, err: "Produto nao encontrado" };
  return productUpdate({
    id: body.id,
    estoqueDisponivel: Number(produto.estoqueDisponivel || 0) + Number(body.quantidade || 0)
  });
}

function productStockRemove(body) {
  if (!body || !body.id) return { ok: false, err: "ID do produto obrigatorio" };
  var produto = productGet({ id: body.id }).produto;
  if (!produto) return { ok: false, err: "Produto nao encontrado" };
  return productUpdate({
    id: body.id,
    estoqueDisponivel: Number(produto.estoqueDisponivel || 0) - Number(body.quantidade || 0)
  });
}

function productStockSet(body) {
  if (!body || !body.id) return { ok: false, err: "ID do produto obrigatorio" };
  return productUpdate({
    id: body.id,
    estoqueDisponivel: Number(body.quantidade || 0)
  });
}

function getProdutoById(produtoId) {
  if (!produtoId) return null;
  var sheets = boot();
  var sh = sheets.produtos;
  var row = findRowById(sh, produtoId);
  if (row <= 0) return null;
  return formatarProduto(sh.getRange(row, 1, 1, COLS_PRODUTOS.length).getValues()[0]);
}

// =====================================================
// BLOQUEIOS
// =====================================================

function formatarBloqueio(row) {
  return {
    id: row[0],
    profissionalId: row[1],
    profissionalNome: String(row[2] || ""),
    data: fmtDate(row[3]),
    horaInicio: fmtTime(row[4]),
    horaFim: fmtTime(row[5]),
    tipoBloqueio: String(row[6] || "manual"),
    descricao: String(row[7] || ""),
    criado: String(row[8] || ""),
    atualizado: String(row[9] || "")
  };
}

function blockCreate(body) {
  if (!body || !body.profissionalId || !body.data || !body.horaInicio || !body.horaFim) {
    return { ok: false, err: "profissionalId, data, horaInicio e horaFim obrigatorios" };
  }

  var ag = getAgendadorById(body.profissionalId);
  if (!ag) return { ok: false, err: "Profissional nao encontrado" };

  var sheets = boot();
  var sh = sheets.bloqueios;
  var id = body.id || genId();
  var agora = nowIso();

  sh.appendRow([
    id,
    body.profissionalId,
    ag.nome,
    body.data,
    body.horaInicio,
    body.horaFim,
    body.tipoBloqueio || "manual",
    body.descricao || "",
    agora,
    agora
  ]);

  return { ok: true, id: id, msg: "Bloqueio criado" };
}

function blockUpdate(body) {
  if (!body || !body.id) return { ok: false, err: "ID do bloqueio obrigatorio" };

  var sheets = boot();
  var sh = sheets.bloqueios;
  var row = findRowById(sh, body.id);
  if (row <= 0) return { ok: false, err: "Bloqueio nao encontrado" };

  var cur = sh.getRange(row, 1, 1, COLS_BLOQUEIOS.length).getValues()[0];
  var profId = body.profissionalId !== undefined ? body.profissionalId : cur[1];
  var ag = getAgendadorById(profId);
  var nome = ag ? ag.nome : cur[2];

  sh.getRange(row, 1, 1, COLS_BLOQUEIOS.length).setValues([[
    body.id,
    profId,
    nome,
    body.data !== undefined ? body.data : cur[3],
    body.horaInicio !== undefined ? body.horaInicio : cur[4],
    body.horaFim !== undefined ? body.horaFim : cur[5],
    body.tipoBloqueio !== undefined ? body.tipoBloqueio : cur[6],
    body.descricao !== undefined ? body.descricao : cur[7],
    cur[8],
    nowIso()
  ]]);

  return { ok: true, msg: "Bloqueio atualizado" };
}

function blockDelete(body) {
  if (!body || !body.id) return { ok: false, err: "ID do bloqueio obrigatorio" };

  var sheets = boot();
  var sh = sheets.bloqueios;
  var row = findRowById(sh, body.id);
  if (row <= 0) return { ok: false, err: "Bloqueio nao encontrado" };

  sh.deleteRow(row);
  return { ok: true, msg: "Bloqueio excluido" };
}

function blockList(body) {
  var sheets = boot();
  var rows = getSheetRows(sheets.bloqueios, COLS_BLOQUEIOS.length);
  var out = [];

  for (var i = 0; i < rows.length; i++) {
    var b = formatarBloqueio(rows[i]);

    if (body && body.id && String(b.id) !== String(body.id)) continue;
    if (body && body.data && String(b.data) !== String(body.data)) continue;
    if (body && body.profissionalId && String(b.profissionalId) !== String(body.profissionalId)) continue;

    out.push(b);
  }

  return { ok: true, bloqueios: out };
}

// =====================================================
// AGENDA / AGENDAMENTOS
// =====================================================

function formatarAgendamento(row) {
  return {
    id: row[0],
    date: fmtDate(row[1]),
    horaInicio: fmtTime(row[2]),
    horaFim: fmtTime(row[3]),
    clienteId: row[4],
    client: String(row[5] || ""),
    phone: String(row[6] || ""),
    agendadorId: row[7],
    agendadorNome: String(row[8] || ""),
    servicoId: row[9],
    servico: String(row[10] || ""),
    status: String(row[11] || "agendado"),
    observacoes: String(row[12] || ""),
    created: String(row[13] || ""),
    updated: String(row[14] || "")
  };
}

function listAgendamentos(body) {
  var sheets = boot();
  var rows = getSheetRows(sheets.agendamentos, COLS_AGENDAMENTOS.length);
  var out = [];

  for (var i = 0; i < rows.length; i++) {
    var apt = formatarAgendamento(rows[i]);

    if (body && body.date && apt.date !== body.date) continue;
    if (body && body.agendadorId && String(apt.agendadorId) !== String(body.agendadorId)) continue;
    if (body && body.clienteId && String(apt.clienteId) !== String(body.clienteId)) continue;
    if (body && body.status && String(apt.status) !== String(body.status)) continue;

    out.push(apt);
  }

  return { ok: true, data: out };
}

function checkDisponibilidade(body) {
  if (!body || !body.date) return { ok: false, err: "Data obrigatoria" };

  var sheets = boot();
  var configs = carregarTodasConfigs(sheets.configuracoes);
  var agRows = getSheetRows(sheets.agendamentos, COLS_AGENDAMENTOS.length);
  var blockRows = getSheetRows(sheets.bloqueios, COLS_BLOQUEIOS.length);

  var resultado = [];

  AGENDADORES.forEach(function(a) {
    if (body.agendadorId && String(body.agendadorId) !== String(a.id)) return;

    var cfg = configs[String(a.id)] || {};
    var ocupados = [];
    var bloqueios = [];

    for (var i = 0; i < agRows.length; i++) {
      var ag = formatarAgendamento(agRows[i]);
      if (ag.date !== body.date) continue;
      if (String(ag.agendadorId) !== String(a.id)) continue;
      if (ag.status === "cancelado") continue;

      ocupados.push({
        id: ag.id,
        horaInicio: ag.horaInicio,
        horaFim: ag.horaFim,
        cliente: ag.client,
        servico: ag.servico,
        status: ag.status
      });
    }

    for (var j = 0; j < blockRows.length; j++) {
      var bl = formatarBloqueio(blockRows[j]);
      if (bl.data !== body.date) continue;
      if (String(bl.profissionalId) !== String(a.id)) continue;

      bloqueios.push({
        id: bl.id,
        horaInicio: bl.horaInicio,
        horaFim: bl.horaFim,
        tipoBloqueio: bl.tipoBloqueio,
        descricao: bl.descricao
      });
    }

    if (cfg.almocoInicio && cfg.almocoFim) {
      bloqueios.push({
        id: "almoco_" + a.id,
        horaInicio: cfg.almocoInicio,
        horaFim: cfg.almocoFim,
        tipoBloqueio: "almoco",
        descricao: "Horario de almoco"
      });
    }

    resultado.push({
      agendadorId: String(a.id),
      nome: a.nome,
      status: cfg.status || "ativo",
      agendaTotalBloqueada: cfg.agendaTotalBloqueada || false,
      almocoInicio: cfg.almocoInicio || "",
      almocoFim: cfg.almocoFim || "",
      ocupados: ocupados,
      bloqueios: bloqueios
    });
  });

  return { ok: true, date: body.date, profissionais: resultado };
}

function isHorarioConflitante(inicioA, fimA, inicioB, fimB) {
  return inicioA < fimB && fimA > inicioB;
}

function createAgendamento(d) {
  if (!d) return { ok: false, err: "Sem dados" };
  if (!d.date || !d.horaInicio || !d.agendadorId || !d.servicoId) {
    return { ok: false, err: "date, horaInicio, agendadorId e servicoId sao obrigatorios" };
  }

  var sheets = boot();
  var ag = getAgendadorById(d.agendadorId);
  if (!ag) return { ok: false, err: "Agendador nao encontrado" };

  var configs = carregarTodasConfigs(sheets.configuracoes);
  var cfg = configs[String(d.agendadorId)] || {};

  if (cfg.status && cfg.status !== "ativo") {
    return { ok: false, err: "Profissional inativo" };
  }

  if (cfg.agendaTotalBloqueada) {
    return { ok: false, err: "Agenda bloqueada para este profissional" };
  }

  var servico = getServicoById(d.servicoId);
  if (!servico) {
    return { ok: false, err: "Servico nao encontrado" };
  }
  if (servico.status !== "ativo") {
    return { ok: false, err: "Servico inativo" };
  }

  var horaInicio = fmtTime(d.horaInicio);
  var horaFim = d.horaFim ? fmtTime(d.horaFim) : addMinutesToTime(horaInicio, Number(servico.duracaoMinutos || 0));

  if (cfg.almocoInicio && cfg.almocoFim && isHorarioConflitante(horaInicio, horaFim, cfg.almocoInicio, cfg.almocoFim)) {
    return { ok: false, err: "Horario entra no intervalo de almoco" };
  }

  // bloqueios
  var bloqueios = blockList({ data: d.date, profissionalId: d.agendadorId }).bloqueios || [];
  for (var b = 0; b < bloqueios.length; b++) {
    var bl = bloqueios[b];
    if (isHorarioConflitante(horaInicio, horaFim, bl.horaInicio, bl.horaFim)) {
      return { ok: false, err: "Horario bloqueado: " + (bl.descricao || bl.tipoBloqueio) };
    }
  }

  // conflitos com outros agendamentos
  var agendamentos = listAgendamentos({ date: d.date, agendadorId: d.agendadorId }).data || [];
  for (var i = 0; i < agendamentos.length; i++) {
    var ex = agendamentos[i];
    if (String(ex.status) === "cancelado") continue;
    if (isHorarioConflitante(horaInicio, horaFim, ex.horaInicio, ex.horaFim)) {
      return { ok: false, err: "Conflito com agendamento existente" };
    }
  }

  var clienteId = d.clienteId || null;
  var clienteNome = d.client || d.clienteNome || "";
  var telefone = d.phone || d.telefone || "";

  if (!clienteId && clienteNome) {
    var clienteExistente = null;

    if (telefone) {
      var buscaTel = buscarCliente({ termo: telefone });
      if (buscaTel.ok && buscaTel.encontrado && buscaTel.cliente) {
        clienteExistente = buscaTel.cliente;
      }
    }

    if (!clienteExistente && clienteNome) {
      var buscaNome = buscarCliente({ termo: clienteNome });
      if (buscaNome.ok && buscaNome.encontrado && buscaNome.cliente && String(buscaNome.cliente.nome).toLowerCase() === String(clienteNome).toLowerCase()) {
        clienteExistente = buscaNome.cliente;
      }
    }

    if (clienteExistente) {
      clienteId = clienteExistente.id;
      clienteNome = clienteExistente.nome;
      telefone = clienteExistente.telefone || telefone;
    } else {
      var novoCliente = cadastrarCliente({
        nome: clienteNome,
        telefone: telefone || "",
        cpf: "",
        aniversario: "",
        observacoes: "",
        status: "ativo"
      });
      if (novoCliente.ok && novoCliente.id) {
        clienteId = novoCliente.id;
      }
    }
  } else if (clienteId) {
    var c = getClienteById(clienteId);
    if (c) {
      clienteNome = c.nome;
      telefone = c.telefone || telefone;
    }
  }

  var id = d.id || genId();
  var agora = nowIso();

  sheets.agendamentos.appendRow([
    id,
    d.date,
    horaInicio,
    horaFim,
    clienteId,
    clienteNome,
    telefone,
    d.agendadorId,
    ag.nome,
    d.servicoId,
    servico.nome,
    d.status || "agendado",
    d.observacoes || "",
    agora,
    agora
  ]);

  return {
    ok: true,
    id: id,
    msg: "Agendamento criado",
    data: {
      id: id,
      date: d.date,
      horaInicio: horaInicio,
      horaFim: horaFim,
      clienteId: clienteId,
      clienteNome: clienteNome,
      agendadorId: d.agendadorId,
      agendadorNome: ag.nome,
      servicoId: d.servicoId,
      servicoNome: servico.nome
    }
  };
}

function updateAgendamento(d) {
  if (!d || !d.id) return { ok: false, err: "ID obrigatorio" };

  var sheets = boot();
  var sh = sheets.agendamentos;
  var row = findRowById(sh, d.id);
  if (row <= 0) return { ok: false, err: "Agendamento nao encontrado" };

  var cur = sh.getRange(row, 1, 1, COLS_AGENDAMENTOS.length).getValues()[0];

  var newDate = d.date !== undefined ? d.date : fmtDate(cur[1]);
  var newHoraInicio = d.horaInicio !== undefined ? fmtTime(d.horaInicio) : fmtTime(cur[2]);
  var newHoraFim = d.horaFim !== undefined ? fmtTime(d.horaFim) : fmtTime(cur[3]);
  var newAgendadorId = d.agendadorId !== undefined ? d.agendadorId : cur[7];
  var newServicoId = d.servicoId !== undefined ? d.servicoId : cur[9];

  var ag = getAgendadorById(newAgendadorId);
  if (!ag) return { ok: false, err: "Agendador nao encontrado" };

  var serv = getServicoById(newServicoId);
  if (!serv) return { ok: false, err: "Servico nao encontrado" };

  if (!newHoraFim) {
    newHoraFim = addMinutesToTime(newHoraInicio, Number(serv.duracaoMinutos || 0));
  }

  var configs = carregarTodasConfigs(sheets.configuracoes);
  var cfg = configs[String(newAgendadorId)] || {};

  if (cfg.agendaTotalBloqueada) {
    return { ok: false, err: "Agenda bloqueada para este profissional" };
  }

  if (cfg.almocoInicio && cfg.almocoFim && isHorarioConflitante(newHoraInicio, newHoraFim, cfg.almocoInicio, cfg.almocoFim)) {
    return { ok: false, err: "Horario entra no intervalo de almoco" };
  }

  var bloqueios = blockList({ data: newDate, profissionalId: newAgendadorId }).bloqueios || [];
  for (var b = 0; b < bloqueios.length; b++) {
    var bl = bloqueios[b];
    if (isHorarioConflitante(newHoraInicio, newHoraFim, bl.horaInicio, bl.horaFim)) {
      return { ok: false, err: "Horario bloqueado: " + (bl.descricao || bl.tipoBloqueio) };
    }
  }

  var agendamentos = listAgendamentos({ date: newDate, agendadorId: newAgendadorId }).data || [];
  for (var i = 0; i < agendamentos.length; i++) {
    var ex = agendamentos[i];
    if (String(ex.id) === String(d.id)) continue;
    if (String(ex.status) === "cancelado") continue;
    if (isHorarioConflitante(newHoraInicio, newHoraFim, ex.horaInicio, ex.horaFim)) {
      return { ok: false, err: "Conflito com agendamento existente" };
    }
  }

  var clienteId = d.clienteId !== undefined ? d.clienteId : cur[4];
  var clienteNome = d.client !== undefined ? d.client : cur[5];
  var telefone = d.phone !== undefined ? d.phone : cur[6];

  if (clienteId) {
    var c = getClienteById(clienteId);
    if (c) {
      clienteNome = d.client !== undefined ? d.client : c.nome;
      telefone = d.phone !== undefined ? d.phone : c.telefone;
    }
  }

  sh.getRange(row, 1, 1, COLS_AGENDAMENTOS.length).setValues([[
    d.id,
    newDate,
    newHoraInicio,
    newHoraFim,
    clienteId,
    clienteNome,
    telefone,
    newAgendadorId,
    ag.nome,
    newServicoId,
    serv.nome,
    d.status !== undefined ? d.status : cur[11],
    d.observacoes !== undefined ? d.observacoes : cur[12],
    cur[13],
    nowIso()
  ]]);

  return { ok: true, msg: "Agendamento atualizado" };
}

function removeAgendamento(id) {
  if (!id) return { ok: false, err: "ID obrigatorio" };

  var sheets = boot();
  var sh = sheets.agendamentos;
  var row = findRowById(sh, id);
  if (row <= 0) return { ok: false, err: "Nao encontrado" };

  sh.deleteRow(row);
  return { ok: true, msg: "Agendamento removido" };
}

function addMinutesToTime(hora, minutos) {
  var p = String(hora || "00:00").split(":");
  var total = Number(p[0]) * 60 + Number(p[1]) + Number(minutos || 0);
  var h = Math.floor(total / 60);
  var m = total % 60;
  return pad(h) + ":" + pad(m);
}

// =====================================================
// CAIXA
// =====================================================

function formatarCaixa(row) {
  return {
    id: row[0],
    tipoMovimentacao: String(row[1] || ""),
    clienteId: row[2],
    clienteNome: String(row[3] || ""),
    descricao: String(row[4] || ""),
    formaPagamento: String(row[5] || ""),
    bandeiraCartao: String(row[6] || ""),
    taxaCartao: Number(row[7] || 0),
    valorOriginal: Number(row[8] || 0),
    valorCobradoReal: Number(row[9] || 0),
    data: fmtDate(row[10]),
    hora: fmtTime(row[11]),
    status: String(row[12] || "ativo"),
    criado: String(row[13] || ""),
    atualizado: String(row[14] || "")
  };
}

function cashCreate(body) {
  if (!body || !body.tipoMovimentacao) {
    return { ok: false, err: "tipoMovimentacao obrigatorio" };
  }

  var sheets = boot();
  var sh = sheets.caixa;
  var id = body.id || genId();
  var agora = nowIso();
  var data = body.data || fmtDate(new Date());
  var hora = body.hora || fmtTime(new Date());

  var clienteId = body.clienteId || "";
  var clienteNome = body.clienteNome || "";

  if (clienteId) {
    var cli = getClienteById(clienteId);
    if (cli) clienteNome = cli.nome;
  }

  // cria movimentacao primeiro
  sh.appendRow([
    id,
    body.tipoMovimentacao, // entrada / saida
    clienteId,
    clienteNome,
    body.descricao || "",
    body.formaPagamento || "",
    body.bandeiraCartao || "",
    toNumber(body.taxaCartao, 0),
    0,
    0,
    data,
    hora,
    body.status || "ativo",
    agora,
    agora
  ]);

  // se vierem itens, adiciona
  if (body.itens && body.itens.length) {
    for (var i = 0; i < body.itens.length; i++) {
      var item = body.itens[i];
      cashItemAdd({
        movimentacaoId: id,
        tipoItem: item.tipoItem,
        produtoId: item.produtoId,
        servicoId: item.servicoId,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario
      });
    }
  }

  // recalcula valor original
  var valorOriginal = calcularValorOriginalMovimentacao(id);
  var valorCobradoReal = body.valorCobradoReal !== undefined ? toNumber(body.valorCobradoReal, valorOriginal) : valorOriginal;

  var row = findRowById(sh, id);
  var cur = sh.getRange(row, 1, 1, COLS_CAIXA.length).getValues()[0];
  sh.getRange(row, 1, 1, COLS_CAIXA.length).setValues([[
    cur[0],
    cur[1],
    cur[2],
    cur[3],
    cur[4],
    cur[5],
    cur[6],
    cur[7],
    valorOriginal,
    valorCobradoReal,
    cur[10],
    cur[11],
    cur[12],
    cur[13],
    nowIso()
  ]]);

  return {
    ok: true,
    id: id,
    msg: "Movimentacao criada",
    movimentacao: cashGetById(id)
  };
}

function cashUpdate(body) {
  if (!body || !body.id) return { ok: false, err: "ID da movimentacao obrigatorio" };

  var sheets = boot();
  var sh = sheets.caixa;
  var row = findRowById(sh, body.id);
  if (row <= 0) return { ok: false, err: "Movimentacao nao encontrada" };

  var cur = sh.getRange(row, 1, 1, COLS_CAIXA.length).getValues()[0];

  // salva historico antes de editar
  saveCashHistory({
    movimentacaoId: body.id,
    descricaoAnterior: cur[4],
    formaPagamentoAnterior: cur[5],
    bandeiraCartaoAnterior: cur[6],
    taxaCartaoAnterior: cur[7],
    valorOriginalAnterior: cur[8],
    valorCobradoRealAnterior: cur[9],
    motivoEdicao: body.motivoEdicao || ""
  });

  // se vierem itens para substituir, apaga antigos e recria
  if (body.replaceItens === true) {
    removeAllCashItems(body.id);

    var itens = body.itens || [];
    for (var i = 0; i < itens.length; i++) {
      cashItemAdd({
        movimentacaoId: body.id,
        tipoItem: itens[i].tipoItem,
        produtoId: itens[i].produtoId,
        servicoId: itens[i].servicoId,
        quantidade: itens[i].quantidade,
        valorUnitario: itens[i].valorUnitario
      });
    }
  }

  var valorOriginal = calcularValorOriginalMovimentacao(body.id);
  var valorCobradoReal = body.valorCobradoReal !== undefined ? toNumber(body.valorCobradoReal, valorOriginal) : cur[9];

  var clienteId = body.clienteId !== undefined ? body.clienteId : cur[2];
  var clienteNome = body.clienteNome !== undefined ? body.clienteNome : cur[3];
  if (clienteId) {
    var cli = getClienteById(clienteId);
    if (cli) clienteNome = cli.nome;
  }

  sh.getRange(row, 1, 1, COLS_CAIXA.length).setValues([[
    body.id,
    body.tipoMovimentacao !== undefined ? body.tipoMovimentacao : cur[1],
    clienteId,
    clienteNome,
    body.descricao !== undefined ? body.descricao : cur[4],
    body.formaPagamento !== undefined ? body.formaPagamento : cur[5],
    body.bandeiraCartao !== undefined ? body.bandeiraCartao : cur[6],
    body.taxaCartao !== undefined ? toNumber(body.taxaCartao, 0) : cur[7],
    valorOriginal,
    valorCobradoReal,
    body.data !== undefined ? body.data : cur[10],
    body.hora !== undefined ? body.hora : cur[11],
    body.status !== undefined ? body.status : "editado",
    cur[13],
    nowIso()
  ]]);

  return { ok: true, msg: "Movimentacao atualizada", movimentacao: cashGetById(body.id) };
}

function cashCancel(body) {
  if (!body || !body.id) return { ok: false, err: "ID da movimentacao obrigatorio" };

  var sheets = boot();
  var sh = sheets.caixa;
  var row = findRowById(sh, body.id);
  if (row <= 0) return { ok: false, err: "Movimentacao nao encontrada" };

  var cur = sh.getRange(row, 1, 1, COLS_CAIXA.length).getValues()[0];
  saveCashHistory({
    movimentacaoId: body.id,
    descricaoAnterior: cur[4],
    formaPagamentoAnterior: cur[5],
    bandeiraCartaoAnterior: cur[6],
    taxaCartaoAnterior: cur[7],
    valorOriginalAnterior: cur[8],
    valorCobradoRealAnterior: cur[9],
    motivoEdicao: body.motivoEdicao || "cancelamento"
  });

  sh.getRange(row, 13).setValue("cancelado");
  sh.getRange(row, 15).setValue(nowIso());

  return { ok: true, msg: "Movimentacao cancelada" };
}

function cashList(body) {
  var sheets = boot();
  var rows = getSheetRows(sheets.caixa, COLS_CAIXA.length);
  var out = [];

  for (var i = 0; i < rows.length; i++) {
    var c = formatarCaixa(rows[i]);

    if (body && body.id && String(c.id) !== String(body.id)) continue;
    if (body && body.data && String(c.data) !== String(body.data)) continue;
    if (body && body.clienteId && String(c.clienteId) !== String(body.clienteId)) continue;
    if (body && body.status && String(c.status) !== String(body.status)) continue;
    if (body && body.tipoMovimentacao && String(c.tipoMovimentacao) !== String(body.tipoMovimentacao)) continue;

    out.push(c);
  }

  return { ok: true, movimentacoes: out };
}

function cashGetById(id) {
  var r = cashList({ id: id });
  return r.movimentacoes && r.movimentacoes.length ? r.movimentacoes[0] : null;
}

function cashReport(body) {
  var lista = cashList(body).movimentacoes || [];
  var entradas = 0;
  var saidas = 0;

  for (var i = 0; i < lista.length; i++) {
    var mov = lista[i];
    if (mov.status === "cancelado") continue;

    if (mov.tipoMovimentacao === "entrada") entradas += Number(mov.valorCobradoReal || 0);
    if (mov.tipoMovimentacao === "saida") saidas += Number(mov.valorCobradoReal || 0);
  }

  return {
    ok: true,
    totalEntradas: entradas,
    totalSaidas: saidas,
    saldo: entradas - saidas,
    quantidade: lista.length
  };
}

// =====================================================
// CAIXA ITENS
// =====================================================

function formatarCaixaItem(row) {
  return {
    id: row[0],
    movimentacaoId: row[1],
    tipoItem: String(row[2] || ""),
    produtoId: row[3],
    produtoNome: String(row[4] || ""),
    servicoId: row[5],
    servicoNome: String(row[6] || ""),
    quantidade: Number(row[7] || 0),
    valorUnitario: Number(row[8] || 0),
    valorTotal: Number(row[9] || 0),
    criado: String(row[10] || ""),
    atualizado: String(row[11] || "")
  };
}

function cashItemAdd(body) {
  if (!body || !body.movimentacaoId || !body.tipoItem) {
    return { ok: false, err: "movimentacaoId e tipoItem obrigatorios" };
  }

  var sheets = boot();
  var sh = sheets.caixaItens;
  var mov = cashGetById(body.movimentacaoId);
  if (!mov) return { ok: false, err: "Movimentacao nao encontrada" };

  var id = body.id || genId();
  var agora = nowIso();
  var produtoId = "";
  var produtoNome = "";
  var servicoId = "";
  var servicoNome = "";
  var valorUnitario = toNumber(body.valorUnitario, 0);
  var quantidade = toNumber(body.quantidade, 1);

  if (body.tipoItem === "produto") {
    var prod = getProdutoById(body.produtoId);
    if (!prod) return { ok: false, err: "Produto nao encontrado" };
    produtoId = prod.id;
    produtoNome = prod.nome;
    if (body.valorUnitario === undefined) valorUnitario = Number(prod.preco || 0);
  } else if (body.tipoItem === "servico") {
    var serv = getServicoById(body.servicoId);
    if (!serv) return { ok: false, err: "Servico nao encontrado" };
    servicoId = serv.id;
    servicoNome = serv.nome;
    if (body.valorUnitario === undefined) valorUnitario = Number(serv.preco || 0);
  } else {
    return { ok: false, err: "tipoItem invalido. Use produto ou servico" };
  }

  var valorTotal = quantidade * valorUnitario;

  sh.appendRow([
    id,
    body.movimentacaoId,
    body.tipoItem,
    produtoId,
    produtoNome,
    servicoId,
    servicoNome,
    quantidade,
    valorUnitario,
    valorTotal,
    agora,
    agora
  ]);

  recalcCashTotals(body.movimentacaoId);

  return { ok: true, id: id, msg: "Item adicionado" };
}

function cashItemUpdate(body) {
  if (!body || !body.id) return { ok: false, err: "ID do item obrigatorio" };

  var sheets = boot();
  var sh = sheets.caixaItens;
  var row = findRowById(sh, body.id);
  if (row <= 0) return { ok: false, err: "Item nao encontrado" };

  var cur = sh.getRange(row, 1, 1, COLS_CAIXA_ITENS.length).getValues()[0];
  var tipoItem = body.tipoItem !== undefined ? body.tipoItem : cur[2];
  var produtoId = body.produtoId !== undefined ? body.produtoId : cur[3];
  var produtoNome = cur[4];
  var servicoId = body.servicoId !== undefined ? body.servicoId : cur[5];
  var servicoNome = cur[6];
  var quantidade = body.quantidade !== undefined ? toNumber(body.quantidade, 1) : Number(cur[7] || 1);
  var valorUnitario = body.valorUnitario !== undefined ? toNumber(body.valorUnitario, 0) : Number(cur[8] || 0);

  if (tipoItem === "produto") {
    var prod = getProdutoById(produtoId);
    if (!prod) return { ok: false, err: "Produto nao encontrado" };
    produtoNome = prod.nome;
    servicoId = "";
    servicoNome = "";
    if (body.valorUnitario === undefined) valorUnitario = Number(prod.preco || 0);
  } else if (tipoItem === "servico") {
    var serv = getServicoById(servicoId);
    if (!serv) return { ok: false, err: "Servico nao encontrado" };
    servicoNome = serv.nome;
    produtoId = "";
    produtoNome = "";
    if (body.valorUnitario === undefined) valorUnitario = Number(serv.preco || 0);
  } else {
    return { ok: false, err: "tipoItem invalido" };
  }

  var valorTotal = quantidade * valorUnitario;

  sh.getRange(row, 1, 1, COLS_CAIXA_ITENS.length).setValues([[
    body.id,
    cur[1],
    tipoItem,
    produtoId,
    produtoNome,
    servicoId,
    servicoNome,
    quantidade,
    valorUnitario,
    valorTotal,
    cur[10],
    nowIso()
  ]]);

  recalcCashTotals(cur[1]);

  return { ok: true, msg: "Item atualizado" };
}

function cashItemRemove(body) {
  if (!body || !body.id) return { ok: false, err: "ID do item obrigatorio" };

  var sheets = boot();
  var sh = sheets.caixaItens;
  var row = findRowById(sh, body.id);
  if (row <= 0) return { ok: false, err: "Item nao encontrado" };

  var movId = sh.getRange(row, 2).getValue();
  sh.deleteRow(row);

  recalcCashTotals(movId);

  return { ok: true, msg: "Item removido" };
}

function cashItemList(body) {
  if (!body || !body.movimentacaoId) return { ok: false, err: "movimentacaoId obrigatorio" };

  var sheets = boot();
  var rows = getSheetRows(sheets.caixaItens, COLS_CAIXA_ITENS.length);
  var out = [];

  for (var i = 0; i < rows.length; i++) {
    var item = formatarCaixaItem(rows[i]);
    if (String(item.movimentacaoId) !== String(body.movimentacaoId)) continue;
    out.push(item);
  }

  return { ok: true, itens: out };
}

function removeAllCashItems(movimentacaoId) {
  var sheets = boot();
  var sh = sheets.caixaItens;
  var rows = getSheetRows(sh, COLS_CAIXA_ITENS.length);

  for (var i = rows.length - 1; i >= 0; i--) {
    if (String(rows[i][1]) === String(movimentacaoId)) {
      sh.deleteRow(i + 2);
    }
  }
}

function calcularValorOriginalMovimentacao(movimentacaoId) {
  var itens = cashItemList({ movimentacaoId: movimentacaoId });
  if (!itens.ok || !itens.itens) return 0;

  var total = 0;
  for (var i = 0; i < itens.itens.length; i++) {
    total += Number(itens.itens[i].valorTotal || 0);
  }
  return total;
}

function recalcCashTotals(movimentacaoId) {
  var sheets = boot();
  var sh = sheets.caixa;
  var row = findRowById(sh, movimentacaoId);
  if (row <= 0) return;

  var cur = sh.getRange(row, 1, 1, COLS_CAIXA.length).getValues()[0];
  var valorOriginal = calcularValorOriginalMovimentacao(movimentacaoId);
  var valorCobradoReal = Number(cur[9] || 0);

  // regra:
  // se ainda estiver zerado, assume valor original
  // se o usuario alterou manualmente, mantem o valor manual
  if (!valorCobradoReal) {
    valorCobradoReal = valorOriginal;
  }

  sh.getRange(row, 9).setValue(valorOriginal);
  sh.getRange(row, 10).setValue(valorCobradoReal);
  sh.getRange(row, 15).setValue(nowIso());
}

// =====================================================
// HISTORICO DO CAIXA
// =====================================================

function saveCashHistory(data) {
  var sheets = boot();
  var sh = sheets.caixaHistorico;
  var agora = new Date();

  sh.appendRow([
    genId(),
    data.movimentacaoId || "",
    data.descricaoAnterior || "",
    data.formaPagamentoAnterior || "",
    data.bandeiraCartaoAnterior || "",
    toNumber(data.taxaCartaoAnterior, 0),
    toNumber(data.valorOriginalAnterior, 0),
    toNumber(data.valorCobradoRealAnterior, 0),
    fmtDate(agora),
    fmtTime(agora),
    data.motivoEdicao || "",
    nowIso()
  ]);
}

function cashHistoryGet(body) {
  if (!body || !body.movimentacaoId) return { ok: false, err: "movimentacaoId obrigatorio" };

  var sheets = boot();
  var rows = getSheetRows(sheets.caixaHistorico, COLS_CAIXA_HISTORICO.length);
  var out = [];

  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (String(r[1]) !== String(body.movimentacaoId)) continue;

    out.push({
      id: r[0],
      movimentacaoId: r[1],
      descricaoAnterior: String(r[2] || ""),
      formaPagamentoAnterior: String(r[3] || ""),
      bandeiraCartaoAnterior: String(r[4] || ""),
      taxaCartaoAnterior: Number(r[5] || 0),
      valorOriginalAnterior: Number(r[6] || 0),
      valorCobradoRealAnterior: Number(r[7] || 0),
      dataEdicao: fmtDate(r[8]),
      horaEdicao: fmtTime(r[9]),
      motivoEdicao: String(r[10] || ""),
      criado: String(r[11] || "")
    });
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
      <span class="modal-title">SCRIPT v3.0 COPIADO</span>
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
    link.download = 'nexus-gestao-v3.gs';
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
