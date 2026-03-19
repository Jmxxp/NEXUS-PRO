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
  '// Configure o administrador, os agendadores e os horários para gerar o Apps Script.',
  '//',
  '// Regras:',
  '// 1. O administrador precisa ter senha.',
  '// 2. Você pode gerar mesmo sem profissionais, mas o normal é criar pelo menos um agendador.',
  '// 3. O preview é atualizado pelo botão GERAR SCRIPT e também após as alterações principais.'
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
    status.textContent = `${professionals.length} agendador(es) configurado(s) • ${SCRIPT_BUILDER_DAYS.length} dias prontos • prévia atualizada`;
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
 *  NEXUS - SISTEMA DE AGENDAMENTO v2.0
 *  Google Apps Script
 *  Gerado em: ${new Date().toLocaleString('pt-BR')}
 * =============================================
 * 
 *  COMO USAR:
 *  1. Crie uma planilha no Google Sheets
 *  2. Na planilha: Extensões > Apps Script
 *  3. Apague tudo e cole este código
 *  4. Salve (Ctrl+S)
 *  5. Implantar > Nova implantação
 *     - Tipo: App da Web
 *     - Executar como: Eu
 *     - Acesso: Qualquer pessoa
 *  6. Copie a URL e cole no app
 */

// Configurações - AGENDADORES (primeiro é sempre ADMIN)
var AGENDADORES = ${JSON.stringify(agendadores.map((a) => ({ id: a.id, nome: a.nome, senha: a.senha, isAdmin: a.isAdmin || false })), null, 2)};
var HORARIOS = ${JSON.stringify(horarios, null, 2)};

// Abas da planilha
var SHEET_AGENDAMENTOS = 'Agendamentos';
var SHEET_CLIENTES = 'Clientes';
var SHEET_CONFIGURACOES = 'Configuracoes';

// Colunas
var COLS_AGENDAMENTOS = ['ID','Data','Hora','ClienteID','Cliente','Telefone','AgendadorID','AgendadorNome','Servico','Status','Criado'];
var COLS_CLIENTES = ['ID','Nome','Telefone','CPF','Aniversario','TotalAgendamentos','Criado','Atualizado'];
var COLS_CONFIGURACOES = ['AgendadorID','AgendadorNome','AlmocoInicio','AlmocoFim','Bloqueado','Atualizado'];

function boot() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('ERRO: Este script precisa estar vinculado a uma planilha do Google Sheets! Abra uma planilha, vá em Extensões > Apps Script e cole o código lá.');
  }

  var shAgend = ss.getSheetByName(SHEET_AGENDAMENTOS);
  if (!shAgend) {
    shAgend = ss.insertSheet(SHEET_AGENDAMENTOS);
    shAgend.getRange(1,1,1,COLS_AGENDAMENTOS.length).setValues([COLS_AGENDAMENTOS]).setFontWeight('bold');
    shAgend.setFrozenRows(1);
  }

  var shClientes = ss.getSheetByName(SHEET_CLIENTES);
  if (!shClientes) {
    shClientes = ss.insertSheet(SHEET_CLIENTES);
    shClientes.getRange(1,1,1,COLS_CLIENTES.length).setValues([COLS_CLIENTES]).setFontWeight('bold');
    shClientes.setFrozenRows(1);
  }

  var shConfig = ss.getSheetByName(SHEET_CONFIGURACOES);
  if (!shConfig) {
    shConfig = ss.insertSheet(SHEET_CONFIGURACOES);
    shConfig.getRange(1,1,1,COLS_CONFIGURACOES.length).setValues([COLS_CONFIGURACOES]).setFontWeight('bold');
    shConfig.setFrozenRows(1);

    var configRows = [];
    AGENDADORES.forEach(function(a) {
      configRows.push([a.id, a.nome, '', '', false, new Date().toISOString()]);
    });
    if (configRows.length > 0) {
      shConfig.getRange(2,1,configRows.length,COLS_CONFIGURACOES.length).setValues(configRows);
    }
  }

  return { agendamentos: shAgend, clientes: shClientes, configuracoes: shConfig };
}

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';
    return reply(route(action, null));
  } catch(err) {
    return reply({ok: false, err: 'doGet error: ' + err.toString()});
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return reply({ok: false, err: 'Requisição inválida - sem dados'});
    }
    var body = JSON.parse(e.postData.contents);
    var action = body.action || (e.parameter && e.parameter.action) || 'ping';
    return reply(route(action, body));
  } catch(err) {
    return reply({ok: false, err: 'doPost error: ' + err.toString()});
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function route(action, body) {
  try {
    switch (action) {
      case 'ping':       return pingComConfigs();
      case 'list':       return list(body);
      case 'create':     return create(body);
      case 'update':     return update(body);
      case 'delete':     return remove(body.id);
      case 'agendadores':return {ok:true, data: AGENDADORES.map(function(a){return {id:a.id,nome:a.nome,isAdmin:a.isAdmin};})};
      case 'auth':       return auth(body);
      case 'disponibilidade': return checkDisponibilidade(body);
      case 'buscarCliente': return buscarCliente(body);
      case 'cadastrarCliente': return cadastrarCliente(body);
      case 'atualizarCliente': return atualizarCliente(body);
      case 'excluirCliente': return excluirCliente(body);
      case 'listarClientes': return listarClientes(body);
      case 'getAgendadorConfig': return getAgendadorConfig(body);
      case 'setAgendadorConfig': return setAgendadorConfig(body);
      case 'getAllConfigs': return getAllConfigs();
      default:           return {ok:false, err:'Ação desconhecida: '+action};
    }
  } catch(e) {
    return {ok:false, err:e.toString()};
  }
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
      almocoInicio: cfg.almocoInicio || '',
      almocoFim: cfg.almocoFim || '',
      bloqueado: cfg.bloqueado || false
    };
  });

  return {
    ok: true,
    msg: 'Conectado!',
    agendadores: agendadoresComConfig,
    horarios: HORARIOS
  };
}

function carregarTodasConfigs(shConfig) {
  var configs = {};
  var last = shConfig.getLastRow();

  if (last <= 1) return configs;

  var rows = shConfig.getRange(2,1,last-1,COLS_CONFIGURACOES.length).getValues();
  for (var i=0; i<rows.length; i++) {
    var r = rows[i];
    configs[String(r[0])] = {
      agendadorId: r[0],
      agendadorNome: r[1],
      almocoInicio: r[2] || '',
      almocoFim: r[3] || '',
      bloqueado: r[4] === true || r[4] === 'true' || r[4] === 'TRUE',
      atualizado: r[5]
    };
  }

  return configs;
}

function getAllConfigs() {
  var sheets = boot();
  var configs = carregarTodasConfigs(sheets.configuracoes);
  return {ok: true, configs: configs};
}

function getAgendadorConfig(body) {
  if (!body || !body.agendadorId) return {ok: false, err: 'agendadorId obrigatório'};

  var sheets = boot();
  var configs = carregarTodasConfigs(sheets.configuracoes);
  var cfg = configs[String(body.agendadorId)];

  if (cfg) {
    return {ok: true, config: cfg};
  }

  return {ok: true, config: {
    agendadorId: body.agendadorId,
    almocoInicio: '',
    almocoFim: '',
    bloqueado: false
  }};
}

function setAgendadorConfig(body) {
  if (!body || !body.agendadorId) return {ok: false, err: 'agendadorId obrigatório'};

  var sheets = boot();
  var sh = sheets.configuracoes;
  var last = sh.getLastRow();
  var found = false;

  var agendador = AGENDADORES.filter(function(a) { return String(a.id) === String(body.agendadorId); })[0];
  if (!agendador) return {ok: false, err: 'Agendador não encontrado'};

  if (last > 1) {
    var ids = sh.getRange(2,1,last-1,1).getValues();
    for (var i=0; i<ids.length; i++) {
      if (String(ids[i][0]) === String(body.agendadorId)) {
        var row = i+2;
        sh.getRange(row,1,1,COLS_CONFIGURACOES.length).setValues([[
          body.agendadorId,
          agendador.nome,
          body.almocoInicio !== undefined ? body.almocoInicio : '',
          body.almocoFim !== undefined ? body.almocoFim : '',
          body.bloqueado !== undefined ? body.bloqueado : false,
          new Date().toISOString()
        ]]);
        found = true;
        break;
      }
    }
  }

  if (!found) {
    sh.appendRow([
      body.agendadorId,
      agendador.nome,
      body.almocoInicio || '',
      body.almocoFim || '',
      body.bloqueado || false,
      new Date().toISOString()
    ]);
  }

  return {ok: true, msg: 'Configuração salva'};
}

function buscarCliente(body) {
  if (!body) return {ok:false, err:'Dados obrigatórios'};

  var sheets = boot();
  var sh = sheets.clientes;
  var last = sh.getLastRow();

  if (last <= 1) return {ok:true, encontrado:false, msg:'Nenhum cliente cadastrado'};

  var rows = sh.getRange(2,1,last-1,COLS_CLIENTES.length).getValues();
  var termo = String(body.termo || '').toLowerCase().trim();

  for (var i=0; i<rows.length; i++) {
    var r = rows[i];
    var nome = String(r[1]||'').toLowerCase();
    var telefone = String(r[2]||'').replace(/\\D/g, '');
    var cpf = String(r[3]||'').replace(/\\D/g, '');
    var termoLimpo = termo.replace(/\\D/g, '');

    if (termoLimpo && telefone && (telefone.includes(termoLimpo) || termoLimpo.includes(telefone))) {
      return {ok:true, encontrado:true, cliente: formatarCliente(r)};
    }

    if (termo && nome.includes(termo)) {
      return {ok:true, encontrado:true, cliente: formatarCliente(r)};
    }

    if (termoLimpo && cpf && cpf === termoLimpo) {
      return {ok:true, encontrado:true, cliente: formatarCliente(r)};
    }
  }

  return {ok:true, encontrado:false, msg:'Cliente não encontrado'};
}

function formatarCliente(row) {
  return {
    id: row[0],
    nome: String(row[1]||''),
    telefone: String(row[2]||''),
    cpf: String(row[3]||''),
    aniversario: String(row[4]||''),
    totalAgendamentos: Number(row[5]||0),
    criado: String(row[6]||''),
    atualizado: String(row[7]||'')
  };
}

function cadastrarCliente(body) {
  if (!body || !body.nome) return {ok:false, err:'Nome é obrigatório'};

  var sheets = boot();
  var sh = sheets.clientes;

  if (body.telefone) {
    var existente = buscarCliente({termo: body.telefone});
    if (existente.encontrado) {
      return {ok:false, err:'Já existe cliente com este telefone: ' + existente.cliente.nome};
    }
  }

  var id = Date.now();
  var agora = new Date().toISOString();

  sh.appendRow([
    id,
    body.nome || '',
    body.telefone || '',
    body.cpf || '',
    body.aniversario || '',
    0,
    agora,
    agora
  ]);

  return {ok:true, id:id, msg:'Cliente ' + body.nome + ' cadastrado com sucesso!'};
}

function atualizarCliente(body) {
  if (!body || !body.id) return {ok:false, err:'ID do cliente obrigatório'};

  var sheets = boot();
  var sh = sheets.clientes;
  var last = sh.getLastRow();

  if (last <= 1) return {ok:false, err:'Nenhum cliente cadastrado'};

  var ids = sh.getRange(2,1,last-1,1).getValues();
  for (var i=0; i<ids.length; i++) {
    if (String(ids[i][0]) === String(body.id)) {
      var row = i+2;
      var cur = sh.getRange(row,1,1,COLS_CLIENTES.length).getValues()[0];

      sh.getRange(row,1,1,COLS_CLIENTES.length).setValues([[
        body.id,
        body.nome || cur[1],
        body.telefone || cur[2],
        body.cpf || cur[3],
        body.aniversario || cur[4],
        body.totalAgendamentos !== undefined ? body.totalAgendamentos : cur[5],
        cur[6],
        new Date().toISOString()
      ]]);

      return {ok:true, msg:'Cliente atualizado'};
    }
  }

  return {ok:false, err:'Cliente não encontrado'};
}

function incrementarAgendamentos(clienteId) {
  if (!clienteId) return;

  var sheets = boot();
  var sh = sheets.clientes;
  var last = sh.getLastRow();

  if (last <= 1) return;

  var ids = sh.getRange(2,1,last-1,1).getValues();
  for (var i=0; i<ids.length; i++) {
    if (String(ids[i][0]) === String(clienteId)) {
      var row = i+2;
      var cur = sh.getRange(row,1,1,COLS_CLIENTES.length).getValues()[0];
      var total = Number(cur[5]||0) + 1;
      sh.getRange(row,6).setValue(total);
      sh.getRange(row,8).setValue(new Date().toISOString());
      return;
    }
  }
}

function excluirCliente(body) {
  if (!body || !body.id) return {ok:false, err:'ID do cliente obrigatório'};

  var sheets = boot();
  var sh = sheets.clientes;
  var last = sh.getLastRow();

  if (last <= 1) return {ok:false, err:'Nenhum cliente cadastrado'};

  var ids = sh.getRange(2,1,last-1,1).getValues();
  for (var i=0; i<ids.length; i++) {
    if (String(ids[i][0]) === String(body.id)) {
      sh.deleteRow(i+2);
      return {ok:true, msg:'Cliente excluído'};
    }
  }

  return {ok:false, err:'Cliente não encontrado'};
}

function listarClientes(body) {
  var sheets = boot();
  var sh = sheets.clientes;
  var last = sh.getLastRow();

  if (last <= 1) return {ok:true, clientes:[]};

  var rows = sh.getRange(2,1,last-1,COLS_CLIENTES.length).getValues();
  var clientes = [];

  for (var i=0; i<rows.length; i++) {
    clientes.push(formatarCliente(rows[i]));
  }

  return {ok:true, clientes: clientes};
}

function list(body) {
  var sheets = boot();
  var sh = sheets.agendamentos;
  var last = sh.getLastRow();
  if (last <= 1) return {ok:true, data:[]};
  var rows = sh.getRange(2,1,last-1,COLS_AGENDAMENTOS.length).getValues();
  var out = [];
  for (var i=0; i<rows.length; i++) {
    var r = rows[i];
    if (!r[0]) continue;
    var apt = {
      id: r[0],
      date: fmtDate(r[1]),
      time: fmtTime(r[2]),
      clienteId: r[3],
      client: String(r[4]||''),
      phone: String(r[5]||''),
      agendadorId: r[6],
      agendadorNome: String(r[7]||''),
      servico: String(r[8]||''),
      status: String(r[9]||'confirmado'),
      created: String(r[10]||'')
    };
    if (body && body.date && apt.date !== body.date) continue;
    if (body && body.agendadorId && String(apt.agendadorId) !== String(body.agendadorId)) continue;
    out.push(apt);
  }
  return {ok:true, data:out};
}

function checkDisponibilidade(body) {
  if (!body || !body.date) return {ok:false, err:'Data obrigatória'};
  var sheets = boot();
  var sh = sheets.agendamentos;
  var last = sh.getLastRow();
  var horariosOcupados = {};

  var configs = carregarTodasConfigs(sheets.configuracoes);

  AGENDADORES.forEach(function(a) {
    var cfg = configs[String(a.id)] || {};
    horariosOcupados[a.id] = {
      nome: a.nome,
      ocupados: [],
      bloqueado: cfg.bloqueado || false,
      almocoInicio: cfg.almocoInicio || '',
      almocoFim: cfg.almocoFim || ''
    };
  });

  if (last > 1) {
    var rows = sh.getRange(2,1,last-1,COLS_AGENDAMENTOS.length).getValues();
    for (var i=0; i<rows.length; i++) {
      var aptDate = fmtDate(rows[i][1]);
      var aptTime = fmtTime(rows[i][2]);
      var agendadorId = String(rows[i][6]);
      var status = String(rows[i][9]||'confirmado');

      if (status === 'cancelado') continue;
      if (aptDate !== body.date) continue;
      if (body.agendadorId && String(body.agendadorId) !== agendadorId) continue;

      if (horariosOcupados[agendadorId]) {
        horariosOcupados[agendadorId].ocupados.push(aptTime);
      }
    }
  }

  var resultado = [];
  Object.keys(horariosOcupados).forEach(function(id) {
    var info = horariosOcupados[id];
    resultado.push({
      agendadorId: String(id),
      nome: info.nome,
      horariosOcupados: info.ocupados.sort(),
      bloqueado: info.bloqueado,
      almocoInicio: info.almocoInicio,
      almocoFim: info.almocoFim
    });
  });

  return {ok:true, date: body.date, profissionais: resultado};
}

function create(d) {
  if (!d) return {ok:false, err:'Sem dados'};
  if (!d.date || !d.time || !d.client) return {ok:false, err:'Data, hora e cliente são obrigatórios'};

  var sheets = boot();
  var sh = sheets.agendamentos;
  var agendadorId = d.agendadorId || 1;
  var agendador = AGENDADORES.filter(function(a){return String(a.id)===String(agendadorId);})[0] || {nome:''};

  var configs = carregarTodasConfigs(sheets.configuracoes);
  var cfg = configs[String(agendadorId)] || {};
  if (cfg.bloqueado) {
    return {ok:false, err:'AGENDA BLOQUEADA! ' + agendador.nome + ' não está aceitando agendamentos no momento.'};
  }

  if (cfg.almocoInicio && cfg.almocoFim) {
    var horaAgendamento = d.time;
    if (horaAgendamento >= cfg.almocoInicio && horaAgendamento < cfg.almocoFim) {
      return {ok:false, err:'HORÁRIO DE ALMOÇO! ' + agendador.nome + ' está em horário de almoço das ' + cfg.almocoInicio + ' às ' + cfg.almocoFim};
    }
  }

  var last = sh.getLastRow();
  if (last > 1) {
    var rows = sh.getRange(2,1,last-1,COLS_AGENDAMENTOS.length).getValues();
    for (var i=0; i<rows.length; i++) {
      var existingDate = fmtDate(rows[i][1]);
      var existingTime = fmtTime(rows[i][2]);
      var existingAgendadorId = String(rows[i][6]);
      var existingStatus = String(rows[i][9]||'confirmado');

      if (existingStatus === 'cancelado') continue;
      if (existingDate === d.date && existingTime === d.time && existingAgendadorId === String(agendadorId)) {
        return {ok:false, err:'HORÁRIO OCUPADO! Já existe agendamento para ' + agendador.nome + ' em ' + d.date + ' às ' + d.time};
      }
    }
  }

  var id = d.id || Date.now();
  var clienteId = d.clienteId || null;

  if (!clienteId && d.client) {
    var clienteExistente = null;

    if (d.phone) {
      var buscaTel = buscarCliente({termo: d.phone});
      if (buscaTel.ok && buscaTel.encontrado) {
        clienteExistente = buscaTel.cliente;
      }
    }

    if (!clienteExistente && d.client) {
      var buscaNome = buscarCliente({termo: d.client});
      if (buscaNome.ok && buscaNome.encontrado) {
        if (buscaNome.cliente.nome.toLowerCase() === d.client.toLowerCase()) {
          clienteExistente = buscaNome.cliente;
        }
      }
    }

    if (clienteExistente) {
      clienteId = clienteExistente.id;
    } else {
      var novoCliente = cadastrarCliente({
        nome: d.client,
        telefone: d.phone || '',
        cpf: '',
        aniversario: ''
      });
      if (novoCliente.ok && novoCliente.id) {
        clienteId = novoCliente.id;
      }
    }
  }

  sh.appendRow([
    id,
    d.date||'',
    d.time||'',
    clienteId,
    d.client||'',
    d.phone||'',
    agendadorId,
    agendador.nome,
    d.servico||'',
    d.status||'confirmado',
    new Date().toISOString()
  ]);

  if (clienteId) {
    incrementarAgendamentos(clienteId);
  }

  return {ok:true, id:id, msg:'Agendamento criado para ' + d.client + ' com ' + agendador.nome + ' em ' + d.date + ' às ' + d.time};
}

function update(d) {
  if (!d||!d.id) return {ok:false, err:'ID obrigatório'};
  var sheets = boot();
  var sh = sheets.agendamentos;
  var last = sh.getLastRow();
  if (last<=1) return {ok:false, err:'Vazio'};
  var ids = sh.getRange(2,1,last-1,1).getValues();
  for (var i=0;i<ids.length;i++) {
    if (String(ids[i][0])===String(d.id)) {
      var row = i+2;
      var cur = sh.getRange(row,1,1,COLS_AGENDAMENTOS.length).getValues()[0];
      var agendador = AGENDADORES.filter(function(a){return String(a.id)===String(d.agendadorId||cur[6]);})[0] || {nome:cur[7]};
      sh.getRange(row,1,1,COLS_AGENDAMENTOS.length).setValues([[
        d.id, d.date||cur[1], d.time||cur[2], d.clienteId||cur[3], d.client||cur[4],
        d.phone||cur[5], d.agendadorId||cur[6], agendador.nome,
        d.servico||cur[8], d.status||cur[9], cur[10]
      ]]);
      return {ok:true};
    }
  }
  return {ok:false, err:'Não encontrado'};
}

function remove(id) {
  if (!id) return {ok:false, err:'ID obrigatório'};
  var sheets = boot();
  var sh = sheets.agendamentos;
  var last = sh.getLastRow();
  if (last<=1) return {ok:false, err:'Vazio'};
  var ids = sh.getRange(2,1,last-1,1).getValues();
  for (var i=0;i<ids.length;i++) {
    if (String(ids[i][0])===String(id)) {
      sh.deleteRow(i+2);
      return {ok:true};
    }
  }
  return {ok:false, err:'Não encontrado'};
}

function auth(d) {
  if (!d.agendadorId || !d.senha) return {ok:false, err:'ID e senha obrigatórios'};
  var ag = AGENDADORES.filter(function(a){return String(a.id)===String(d.agendadorId);})[0];
  if (!ag) return {ok:false, err:'Agendador não encontrado'};
  if (ag.senha !== d.senha) return {ok:false, err:'Senha incorreta'};
  return {ok:true, agendador:{id:ag.id, nome:ag.nome, isAdmin:ag.isAdmin}};
}

function fmtDate(v) {
  if (!v) return '';
  if (typeof v==='string' && /^\\d{4}-\\d{2}-\\d{2}$/.test(v)) return v;
  if (v instanceof Date) return v.getFullYear()+'-'+pad(v.getMonth()+1)+'-'+pad(v.getDate());
  try { var d=new Date(v); return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
  catch(e) { return String(v); }
}

function fmtTime(v) {
  if (!v) return '';
  if (typeof v==='string' && /^\\d{2}:\\d{2}$/.test(v)) return v;
  if (v instanceof Date) return pad(v.getHours())+':'+pad(v.getMinutes());
  var m = String(v).match(/(\\d{1,2}):(\\d{2})/);
  if (m) return pad(parseInt(m[1]))+':'+m[2];
  return String(v);
}

function pad(n) { return n<10?'0'+n:''+n; }
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
      <span class="modal-title">SCRIPT COPIADO</span>
      <p class="modal-desc" style="text-align: left; line-height: 1.6;">
        Próximos passos:<br>
        1. Crie uma planilha no Google Sheets<br>
        2. Acesse Extensões &gt; Apps Script<br>
        3. Cole o script e salve<br>
        4. Implantar &gt; Nova implantação<br>
        5. Tipo: App da Web<br>
        6. Acesso: Qualquer pessoa<br>
        7. Copie a URL gerada
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
    link.download = 'nexus-agendamento.gs';
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
