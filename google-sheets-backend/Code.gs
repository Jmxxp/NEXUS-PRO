/**
 * ================================================================================
 * NEXUS PRO - Google Apps Script Backend
 * ================================================================================
 * 
 * Este script gerencia TODOS os dados do sistema NEXUS PRO em Google Sheets.
 * 
 * PLANILHAS NECESSÁRIAS:
 * 1. Agendadores    - Profissionais/funcionários
 * 2. Agendamentos   - Appointments/reservas
 * 3. Clientes       - Cadastro de clientes
 * 4. Servicos       - Catálogo de serviços
 * 5. Produtos       - Inventário de produtos
 * 6. Transacoes     - Caixa/financeiro
 * 7. Configuracoes  - Configs gerais (horários, taxas, etc)
 * 
 * DEPLOY: 
 * 1. Criar novo projeto em https://script.google.com
 * 2. Colar este código
 * 3. Implantar > Nova implantação > Aplicativo Web
 * 4. Executar como: Eu / Quem pode acessar: Qualquer pessoa
 * 5. Copiar URL e usar no NEXUS PRO
 * 
 * ================================================================================
 */

// ===== CONFIGURAÇÃO =====
const SPREADSHEET_ID = 'SEU_SPREADSHEET_ID_AQUI'; // ID da planilha Google Sheets

// Nomes das abas (planilhas)
const SHEETS = {
  AGENDADORES: 'Agendadores',
  AGENDAMENTOS: 'Agendamentos',
  CLIENTES: 'Clientes',
  SERVICOS: 'Servicos',
  PRODUTOS: 'Produtos',
  TRANSACOES: 'Transacoes',
  CONFIGURACOES: 'Configuracoes'
};

// ===== UTILITÁRIOS =====

/**
 * Obtém uma aba da planilha pelo nome
 */
function getSheet(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  
  // Criar aba se não existir
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    initializeSheet(sheet, sheetName);
  }
  
  return sheet;
}

/**
 * Inicializa uma aba com cabeçalhos
 */
function initializeSheet(sheet, sheetName) {
  const headers = {
    [SHEETS.AGENDADORES]: ['id', 'nome', 'senha', 'isAdmin', 'bloqueado', 'almocoInicio', 'almocoFim', 'criadoEm', 'atualizadoEm'],
    [SHEETS.AGENDAMENTOS]: ['id', 'date', 'time', 'client', 'phone', 'servico', 'observacoes', 'agendadorId', 'agendador', 'blocked', 'confirmado', 'criadoEm', 'atualizadoEm'],
    [SHEETS.CLIENTES]: ['id', 'nome', 'telefone', 'cpf', 'aniversario', 'notas', 'totalAgendamentos', 'criadoEm', 'atualizadoEm'],
    [SHEETS.SERVICOS]: ['id', 'nome', 'preco', 'duracao', 'descricao', 'icon', 'ativo', 'criadoEm', 'atualizadoEm'],
    [SHEETS.PRODUTOS]: ['id', 'nome', 'preco', 'estoque', 'estoqueMinimo', 'descricao', 'icon', 'ativo', 'criadoEm', 'atualizadoEm'],
    [SHEETS.TRANSACOES]: ['id', 'type', 'description', 'value', 'date', 'paymentMethod', 'items', 'clientPhone', 'agendadorId', 'criadoEm', 'atualizadoEm', 'editHistory'],
    [SHEETS.CONFIGURACOES]: ['chave', 'valor', 'atualizadoEm']
  };
  
  if (headers[sheetName]) {
    sheet.getRange(1, 1, 1, headers[sheetName].length).setValues([headers[sheetName]]);
    sheet.getRange(1, 1, 1, headers[sheetName].length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

/**
 * Gera próximo ID para uma aba
 */
function getNextId(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 1;
  
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat().filter(id => id !== '');
  if (ids.length === 0) return 1;
  
  return Math.max(...ids.map(Number)) + 1;
}

/**
 * Converte linha em objeto usando cabeçalhos
 */
function rowToObject(headers, row) {
  const obj = {};
  headers.forEach((header, index) => {
    let value = row[index];
    
    // Parse JSON strings
    if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
      try { value = JSON.parse(value); } catch (e) {}
    }
    
    // Parse booleans
    if (value === 'TRUE' || value === true) value = true;
    if (value === 'FALSE' || value === false) value = false;
    
    obj[header] = value;
  });
  return obj;
}

/**
 * Encontra linha por ID
 */
function findRowById(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) return i + 1; // +1 porque getRange é 1-indexed
  }
  return -1;
}

/**
 * Timestamp atual ISO
 */
function now() {
  return new Date().toISOString();
}

/**
 * Resposta JSON padronizada
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== HANDLER PRINCIPAL =====

/**
 * Handler GET - para testes de conexão
 */
function doGet(e) {
  return jsonResponse({ ok: true, message: 'NEXUS PRO Backend ativo', timestamp: now() });
}

/**
 * Handler POST - todas as operações
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    
    // Roteamento de ações
    const actions = {
      // Conexão
      'ping': () => handlePing(params),
      
      // Autenticação
      'auth': () => handleAuth(params),
      
      // Agendadores
      'agendadores': () => listarAgendadores(),
      'getAgendadorConfig': () => getAgendadorConfig(params),
      'setAgendadorConfig': () => setAgendadorConfig(params),
      
      // Agendamentos
      'list': () => listarAgendamentos(params),
      'create': () => criarAgendamento(params),
      'update': () => atualizarAgendamento(params),
      'delete': () => excluirAgendamento(params),
      'disponibilidade': () => verificarDisponibilidade(params),
      
      // Clientes
      'listarClientes': () => listarClientes(),
      'buscarCliente': () => buscarCliente(params),
      'cadastrarCliente': () => cadastrarCliente(params),
      'atualizarCliente': () => atualizarCliente(params),
      'excluirCliente': () => excluirCliente(params),
      
      // Serviços
      'listarServicos': () => listarServicos(),
      'criarServico': () => criarServico(params),
      'atualizarServico': () => atualizarServico(params),
      'excluirServico': () => excluirServico(params),
      
      // Produtos
      'listarProdutos': () => listarProdutos(),
      'criarProduto': () => criarProduto(params),
      'atualizarProduto': () => atualizarProduto(params),
      'excluirProduto': () => excluirProduto(params),
      'ajustarEstoque': () => ajustarEstoque(params),
      
      // Transações/Caixa
      'listarTransacoes': () => listarTransacoes(params),
      'criarTransacao': () => criarTransacao(params),
      'atualizarTransacao': () => atualizarTransacao(params),
      'excluirTransacao': () => excluirTransacao(params),
      
      // Configurações
      'getConfig': () => getConfig(params),
      'setConfig': () => setConfig(params),
      'getAllConfigs': () => getAllConfigs(),
      'getTaxasCartao': () => getTaxasCartao(),
      'setTaxasCartao': () => setTaxasCartao(params)
    };
    
    if (actions[action]) {
      return jsonResponse(actions[action]());
    }
    
    return jsonResponse({ ok: false, error: 'Ação desconhecida: ' + action });
    
  } catch (error) {
    return jsonResponse({ ok: false, error: error.toString() });
  }
}

// ================================================================================
// CONEXÃO E AUTENTICAÇÃO
// ================================================================================

function handlePing(params) {
  const agendadores = listarAgendadores();
  const horarios = getHorarios();
  
  return {
    ok: true,
    agendadores: agendadores.data || [],
    horarios: horarios
  };
}

function handleAuth(params) {
  const { id, senha } = params;
  const sheet = getSheet(SHEETS.AGENDADORES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    if (row.id == id && row.senha === senha) {
      return {
        ok: true,
        user: {
          id: row.id,
          nome: row.nome,
          isAdmin: row.isAdmin === true
        }
      };
    }
  }
  
  return { ok: false, error: 'Credenciais inválidas' };
}

// ================================================================================
// AGENDADORES (PROFISSIONAIS)
// ================================================================================

function listarAgendadores() {
  const sheet = getSheet(SHEETS.AGENDADORES);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return { ok: true, data: [] };
  }
  
  const headers = data[0];
  const agendadores = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    agendadores.push({
      id: row.id,
      nome: row.nome,
      isAdmin: row.isAdmin === true,
      bloqueado: row.bloqueado === true,
      almocoInicio: row.almocoInicio || '',
      almocoFim: row.almocoFim || ''
    });
  }
  
  return { ok: true, data: agendadores };
}

function getAgendadorConfig(params) {
  const { agendadorId } = params;
  const sheet = getSheet(SHEETS.AGENDADORES);
  const rowNum = findRowById(sheet, agendadorId);
  
  if (rowNum === -1) {
    return { ok: false, error: 'Agendador não encontrado' };
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
  const agendador = rowToObject(headers, row);
  
  return {
    ok: true,
    config: {
      bloqueado: agendador.bloqueado === true,
      almocoInicio: agendador.almocoInicio || '',
      almocoFim: agendador.almocoFim || ''
    }
  };
}

function setAgendadorConfig(params) {
  const { agendadorId, bloqueado, almocoInicio, almocoFim } = params;
  const sheet = getSheet(SHEETS.AGENDADORES);
  const rowNum = findRowById(sheet, agendadorId);
  
  if (rowNum === -1) {
    return { ok: false, error: 'Agendador não encontrado' };
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const bloqueadoCol = headers.indexOf('bloqueado') + 1;
  const almocoInicioCol = headers.indexOf('almocoInicio') + 1;
  const almocoFimCol = headers.indexOf('almocoFim') + 1;
  const atualizadoEmCol = headers.indexOf('atualizadoEm') + 1;
  
  if (bloqueadoCol > 0) sheet.getRange(rowNum, bloqueadoCol).setValue(bloqueado);
  if (almocoInicioCol > 0) sheet.getRange(rowNum, almocoInicioCol).setValue(almocoInicio || '');
  if (almocoFimCol > 0) sheet.getRange(rowNum, almocoFimCol).setValue(almocoFim || '');
  if (atualizadoEmCol > 0) sheet.getRange(rowNum, atualizadoEmCol).setValue(now());
  
  return { ok: true };
}

// ================================================================================
// AGENDAMENTOS (APPOINTMENTS)
// ================================================================================

function listarAgendamentos(params) {
  const { date, agendadorId, dateStart, dateEnd } = params;
  const sheet = getSheet(SHEETS.AGENDAMENTOS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return { ok: true, data: [] };
  }
  
  const headers = data[0];
  let agendamentos = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    
    // Filtros
    if (date && row.date !== date) continue;
    if (agendadorId && row.agendadorId != agendadorId) continue;
    if (dateStart && row.date < dateStart) continue;
    if (dateEnd && row.date > dateEnd) continue;
    
    agendamentos.push(row);
  }
  
  return { ok: true, data: agendamentos };
}

function criarAgendamento(params) {
  const sheet = getSheet(SHEETS.AGENDAMENTOS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const id = getNextId(sheet);
  
  const newRow = headers.map(header => {
    if (header === 'id') return id;
    if (header === 'criadoEm') return now();
    if (header === 'atualizadoEm') return now();
    if (header === 'blocked') return params.blocked === true;
    if (header === 'confirmado') return params.confirmado === true;
    return params[header] || '';
  });
  
  sheet.appendRow(newRow);
  
  return { ok: true, id: id };
}

function atualizarAgendamento(params) {
  const { id } = params;
  const sheet = getSheet(SHEETS.AGENDAMENTOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) {
    return { ok: false, error: 'Agendamento não encontrado' };
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  headers.forEach((header, index) => {
    if (header === 'id' || header === 'criadoEm') return;
    if (header === 'atualizadoEm') {
      sheet.getRange(rowNum, index + 1).setValue(now());
      return;
    }
    if (params.hasOwnProperty(header)) {
      let value = params[header];
      if (header === 'blocked' || header === 'confirmado') {
        value = value === true;
      }
      sheet.getRange(rowNum, index + 1).setValue(value);
    }
  });
  
  return { ok: true };
}

function excluirAgendamento(params) {
  const { id } = params;
  const sheet = getSheet(SHEETS.AGENDAMENTOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) {
    return { ok: false, error: 'Agendamento não encontrado' };
  }
  
  sheet.deleteRow(rowNum);
  return { ok: true };
}

function verificarDisponibilidade(params) {
  const { date, agendadorId } = params;
  const result = listarAgendamentos({ date, agendadorId });
  
  const horariosOcupados = result.data.map(a => a.time);
  
  return {
    ok: true,
    ocupados: horariosOcupados
  };
}

// ================================================================================
// CLIENTES
// ================================================================================

function listarClientes() {
  const sheet = getSheet(SHEETS.CLIENTES);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return { ok: true, data: [] };
  }
  
  const headers = data[0];
  const clientes = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    clientes.push({
      id: row.id,
      name: row.nome,
      phone: row.telefone,
      cpf: row.cpf || '',
      birthday: row.aniversario || '',
      notes: row.notas || '',
      totalAgendamentos: row.totalAgendamentos || 0
    });
  }
  
  return { ok: true, data: clientes };
}

function buscarCliente(params) {
  const { termo } = params;
  const sheet = getSheet(SHEETS.CLIENTES);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return { ok: true, data: [] };
  }
  
  const headers = data[0];
  const termoLower = (termo || '').toLowerCase();
  const resultados = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    const nome = (row.nome || '').toLowerCase();
    const telefone = (row.telefone || '').replace(/\D/g, '');
    const termoNum = termoLower.replace(/\D/g, '');
    
    if (nome.includes(termoLower) || telefone.includes(termoNum)) {
      resultados.push({
        id: row.id,
        name: row.nome,
        phone: row.telefone,
        cpf: row.cpf || '',
        birthday: row.aniversario || '',
        notes: row.notas || '',
        totalAgendamentos: row.totalAgendamentos || 0
      });
    }
  }
  
  return { ok: true, data: resultados };
}

function cadastrarCliente(params) {
  const { nome, telefone, cpf, aniversario, notas } = params;
  const sheet = getSheet(SHEETS.CLIENTES);
  
  // Verificar se já existe
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const telefoneCol = headers.indexOf('telefone');
  
  for (let i = 1; i < data.length; i++) {
    const tel = (data[i][telefoneCol] || '').replace(/\D/g, '');
    if (tel === (telefone || '').replace(/\D/g, '')) {
      return { ok: false, error: 'Cliente já cadastrado com este telefone' };
    }
  }
  
  const id = getNextId(sheet);
  
  const newRow = headers.map(header => {
    if (header === 'id') return id;
    if (header === 'nome') return nome || '';
    if (header === 'telefone') return telefone || '';
    if (header === 'cpf') return cpf || '';
    if (header === 'aniversario') return aniversario || '';
    if (header === 'notas') return notas || '';
    if (header === 'totalAgendamentos') return 0;
    if (header === 'criadoEm') return now();
    if (header === 'atualizadoEm') return now();
    return '';
  });
  
  sheet.appendRow(newRow);
  
  return { ok: true, id: id };
}

function atualizarCliente(params) {
  const { id, nome, telefone, cpf, aniversario, notas, totalAgendamentos } = params;
  const sheet = getSheet(SHEETS.CLIENTES);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) {
    return { ok: false, error: 'Cliente não encontrado' };
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const updates = { nome, telefone, cpf, aniversario, notas, totalAgendamentos };
  
  headers.forEach((header, index) => {
    if (header === 'id' || header === 'criadoEm') return;
    if (header === 'atualizadoEm') {
      sheet.getRange(rowNum, index + 1).setValue(now());
      return;
    }
    if (updates.hasOwnProperty(header) && updates[header] !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(updates[header]);
    }
  });
  
  return { ok: true };
}

function excluirCliente(params) {
  const { id } = params;
  const sheet = getSheet(SHEETS.CLIENTES);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) {
    return { ok: false, error: 'Cliente não encontrado' };
  }
  
  sheet.deleteRow(rowNum);
  return { ok: true };
}

// ================================================================================
// SERVIÇOS
// ================================================================================

function listarServicos() {
  const sheet = getSheet(SHEETS.SERVICOS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return { ok: true, data: [] };
  }
  
  const headers = data[0];
  const servicos = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    if (row.ativo === false) continue; // Pula inativos
    
    servicos.push({
      id: row.id,
      nome: row.nome,
      preco: parseFloat(row.preco) || 0,
      duracao: parseInt(row.duracao) || 30,
      descricao: row.descricao || '',
      icon: row.icon || 'fa-cut'
    });
  }
  
  return { ok: true, data: servicos };
}

function criarServico(params) {
  const { nome, preco, duracao, descricao, icon } = params;
  const sheet = getSheet(SHEETS.SERVICOS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const id = getNextId(sheet);
  
  const newRow = headers.map(header => {
    if (header === 'id') return id;
    if (header === 'nome') return nome || '';
    if (header === 'preco') return parseFloat(preco) || 0;
    if (header === 'duracao') return parseInt(duracao) || 30;
    if (header === 'descricao') return descricao || '';
    if (header === 'icon') return icon || 'fa-cut';
    if (header === 'ativo') return true;
    if (header === 'criadoEm') return now();
    if (header === 'atualizadoEm') return now();
    return '';
  });
  
  sheet.appendRow(newRow);
  
  return { ok: true, id: id };
}

function atualizarServico(params) {
  const { id, nome, preco, duracao, descricao, icon, ativo } = params;
  const sheet = getSheet(SHEETS.SERVICOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) {
    return { ok: false, error: 'Serviço não encontrado' };
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const updates = { nome, preco, duracao, descricao, icon, ativo };
  
  headers.forEach((header, index) => {
    if (header === 'id' || header === 'criadoEm') return;
    if (header === 'atualizadoEm') {
      sheet.getRange(rowNum, index + 1).setValue(now());
      return;
    }
    if (updates.hasOwnProperty(header) && updates[header] !== undefined) {
      let value = updates[header];
      if (header === 'preco') value = parseFloat(value) || 0;
      if (header === 'duracao') value = parseInt(value) || 30;
      sheet.getRange(rowNum, index + 1).setValue(value);
    }
  });
  
  return { ok: true };
}

function excluirServico(params) {
  const { id } = params;
  const sheet = getSheet(SHEETS.SERVICOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) {
    return { ok: false, error: 'Serviço não encontrado' };
  }
  
  // Soft delete - marca como inativo
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const ativoCol = headers.indexOf('ativo') + 1;
  const atualizadoEmCol = headers.indexOf('atualizadoEm') + 1;
  
  if (ativoCol > 0) sheet.getRange(rowNum, ativoCol).setValue(false);
  if (atualizadoEmCol > 0) sheet.getRange(rowNum, atualizadoEmCol).setValue(now());
  
  return { ok: true };
}

// ================================================================================
// PRODUTOS
// ================================================================================

function listarProdutos() {
  const sheet = getSheet(SHEETS.PRODUTOS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return { ok: true, data: [] };
  }
  
  const headers = data[0];
  const produtos = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    if (row.ativo === false) continue;
    
    produtos.push({
      id: row.id,
      nome: row.nome,
      preco: parseFloat(row.preco) || 0,
      estoque: parseInt(row.estoque) || 0,
      estoqueMinimo: parseInt(row.estoqueMinimo) || 5,
      descricao: row.descricao || '',
      icon: row.icon || 'fa-box'
    });
  }
  
  return { ok: true, data: produtos };
}

function criarProduto(params) {
  const { nome, preco, estoque, estoqueMinimo, descricao, icon } = params;
  const sheet = getSheet(SHEETS.PRODUTOS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const id = getNextId(sheet);
  
  const newRow = headers.map(header => {
    if (header === 'id') return id;
    if (header === 'nome') return nome || '';
    if (header === 'preco') return parseFloat(preco) || 0;
    if (header === 'estoque') return parseInt(estoque) || 0;
    if (header === 'estoqueMinimo') return parseInt(estoqueMinimo) || 5;
    if (header === 'descricao') return descricao || '';
    if (header === 'icon') return icon || 'fa-box';
    if (header === 'ativo') return true;
    if (header === 'criadoEm') return now();
    if (header === 'atualizadoEm') return now();
    return '';
  });
  
  sheet.appendRow(newRow);
  
  return { ok: true, id: id };
}

function atualizarProduto(params) {
  const { id, nome, preco, estoque, estoqueMinimo, descricao, icon, ativo } = params;
  const sheet = getSheet(SHEETS.PRODUTOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) {
    return { ok: false, error: 'Produto não encontrado' };
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const updates = { nome, preco, estoque, estoqueMinimo, descricao, icon, ativo };
  
  headers.forEach((header, index) => {
    if (header === 'id' || header === 'criadoEm') return;
    if (header === 'atualizadoEm') {
      sheet.getRange(rowNum, index + 1).setValue(now());
      return;
    }
    if (updates.hasOwnProperty(header) && updates[header] !== undefined) {
      let value = updates[header];
      if (header === 'preco') value = parseFloat(value) || 0;
      if (header === 'estoque' || header === 'estoqueMinimo') value = parseInt(value) || 0;
      sheet.getRange(rowNum, index + 1).setValue(value);
    }
  });
  
  return { ok: true };
}

function excluirProduto(params) {
  const { id } = params;
  const sheet = getSheet(SHEETS.PRODUTOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) {
    return { ok: false, error: 'Produto não encontrado' };
  }
  
  // Soft delete
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const ativoCol = headers.indexOf('ativo') + 1;
  const atualizadoEmCol = headers.indexOf('atualizadoEm') + 1;
  
  if (ativoCol > 0) sheet.getRange(rowNum, ativoCol).setValue(false);
  if (atualizadoEmCol > 0) sheet.getRange(rowNum, atualizadoEmCol).setValue(now());
  
  return { ok: true };
}

function ajustarEstoque(params) {
  const { id, quantidade, tipo } = params; // tipo: 'adicionar' ou 'remover'
  const sheet = getSheet(SHEETS.PRODUTOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) {
    return { ok: false, error: 'Produto não encontrado' };
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const estoqueCol = headers.indexOf('estoque') + 1;
  const atualizadoEmCol = headers.indexOf('atualizadoEm') + 1;
  
  const estoqueAtual = parseInt(sheet.getRange(rowNum, estoqueCol).getValue()) || 0;
  let novoEstoque;
  
  if (tipo === 'adicionar') {
    novoEstoque = estoqueAtual + parseInt(quantidade);
  } else {
    novoEstoque = estoqueAtual - parseInt(quantidade);
    if (novoEstoque < 0) novoEstoque = 0;
  }
  
  sheet.getRange(rowNum, estoqueCol).setValue(novoEstoque);
  if (atualizadoEmCol > 0) sheet.getRange(rowNum, atualizadoEmCol).setValue(now());
  
  return { ok: true, novoEstoque: novoEstoque };
}

// ================================================================================
// TRANSAÇÕES (CAIXA)
// ================================================================================

function listarTransacoes(params) {
  const { dataInicio, dataFim, type, paymentMethod } = params || {};
  const sheet = getSheet(SHEETS.TRANSACOES);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return { ok: true, data: [] };
  }
  
  const headers = data[0];
  const transacoes = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    
    // Filtros
    if (dataInicio && row.date < dataInicio) continue;
    if (dataFim && row.date > dataFim) continue;
    if (type && row.type !== type) continue;
    if (paymentMethod && row.paymentMethod !== paymentMethod) continue;
    
    transacoes.push({
      id: row.id,
      type: row.type,
      description: row.description,
      value: parseFloat(row.value) || 0,
      date: row.date,
      paymentMethod: row.paymentMethod,
      items: row.items || [],
      clientPhone: row.clientPhone || '',
      agendadorId: row.agendadorId || '',
      createdAt: row.criadoEm,
      lastEditedAt: row.atualizadoEm,
      editHistory: row.editHistory || []
    });
  }
  
  return { ok: true, data: transacoes };
}

function criarTransacao(params) {
  const { type, description, value, date, paymentMethod, items, clientPhone, agendadorId } = params;
  const sheet = getSheet(SHEETS.TRANSACOES);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const id = getNextId(sheet);
  
  const newRow = headers.map(header => {
    if (header === 'id') return id;
    if (header === 'type') return type || 'income';
    if (header === 'description') return description || '';
    if (header === 'value') return parseFloat(value) || 0;
    if (header === 'date') return date || new Date().toISOString().split('T')[0];
    if (header === 'paymentMethod') return paymentMethod || 'dinheiro';
    if (header === 'items') return JSON.stringify(items || []);
    if (header === 'clientPhone') return clientPhone || '';
    if (header === 'agendadorId') return agendadorId || '';
    if (header === 'criadoEm') return now();
    if (header === 'atualizadoEm') return now();
    if (header === 'editHistory') return '[]';
    return '';
  });
  
  sheet.appendRow(newRow);
  
  // Se tem produtos, decrementar estoque
  if (items && items.length > 0) {
    items.forEach(item => {
      if (item.type === 'product') {
        ajustarEstoque({ id: item.id, quantidade: item.quantity || 1, tipo: 'remover' });
      }
    });
  }
  
  return { ok: true, id: id };
}

function atualizarTransacao(params) {
  const { id, type, description, value, date, paymentMethod, items, editHistory } = params;
  const sheet = getSheet(SHEETS.TRANSACOES);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) {
    return { ok: false, error: 'Transação não encontrada' };
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const updates = { type, description, value, date, paymentMethod };
  
  headers.forEach((header, index) => {
    if (header === 'id' || header === 'criadoEm') return;
    if (header === 'atualizadoEm') {
      sheet.getRange(rowNum, index + 1).setValue(now());
      return;
    }
    if (header === 'items' && items !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(JSON.stringify(items));
      return;
    }
    if (header === 'editHistory' && editHistory !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(JSON.stringify(editHistory));
      return;
    }
    if (updates.hasOwnProperty(header) && updates[header] !== undefined) {
      let val = updates[header];
      if (header === 'value') val = parseFloat(val) || 0;
      sheet.getRange(rowNum, index + 1).setValue(val);
    }
  });
  
  return { ok: true };
}

function excluirTransacao(params) {
  const { id } = params;
  const sheet = getSheet(SHEETS.TRANSACOES);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) {
    return { ok: false, error: 'Transação não encontrada' };
  }
  
  sheet.deleteRow(rowNum);
  return { ok: true };
}

// ================================================================================
// CONFIGURAÇÕES
// ================================================================================

function getConfig(params) {
  const { chave } = params;
  const sheet = getSheet(SHEETS.CONFIGURACOES);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === chave) {
      let valor = data[i][1];
      // Tentar parse JSON
      try { valor = JSON.parse(valor); } catch (e) {}
      return { ok: true, valor: valor };
    }
  }
  
  return { ok: true, valor: null };
}

function setConfig(params) {
  const { chave, valor } = params;
  const sheet = getSheet(SHEETS.CONFIGURACOES);
  const data = sheet.getDataRange().getValues();
  
  // Procurar se já existe
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === chave) {
      const valorStr = typeof valor === 'object' ? JSON.stringify(valor) : valor;
      sheet.getRange(i + 1, 2).setValue(valorStr);
      sheet.getRange(i + 1, 3).setValue(now());
      return { ok: true };
    }
  }
  
  // Criar novo
  const valorStr = typeof valor === 'object' ? JSON.stringify(valor) : valor;
  sheet.appendRow([chave, valorStr, now()]);
  
  return { ok: true };
}

function getAllConfigs() {
  const sheet = getSheet(SHEETS.CONFIGURACOES);
  const data = sheet.getDataRange().getValues();
  
  const configs = {};
  
  for (let i = 1; i < data.length; i++) {
    const chave = data[i][0];
    let valor = data[i][1];
    try { valor = JSON.parse(valor); } catch (e) {}
    configs[chave] = valor;
  }
  
  return { ok: true, data: configs };
}

// Horários de funcionamento
function getHorarios() {
  const result = getConfig({ chave: 'horarios' });
  
  if (result.valor) {
    return result.valor;
  }
  
  // Padrão
  return {
    domingo: { abre: '00:00', fecha: '00:00' },
    segunda: { abre: '08:00', fecha: '18:00' },
    terca: { abre: '08:00', fecha: '18:00' },
    quarta: { abre: '08:00', fecha: '18:00' },
    quinta: { abre: '08:00', fecha: '18:00' },
    sexta: { abre: '08:00', fecha: '18:00' },
    sabado: { abre: '08:00', fecha: '14:00' }
  };
}

function setHorarios(params) {
  return setConfig({ chave: 'horarios', valor: params.horarios });
}

// Taxas de cartão
function getTaxasCartao() {
  const result = getConfig({ chave: 'taxas_cartao' });
  
  if (result.valor) {
    return { ok: true, data: result.valor };
  }
  
  // Padrão
  return {
    ok: true,
    data: {
      credito: {
        visa: 3.5,
        mastercard: 3.5,
        elo: 4.0,
        amex: 4.5,
        hipercard: 4.0
      },
      debito: {
        visa: 2.0,
        mastercard: 2.0,
        elo: 2.5,
        amex: 2.5,
        hipercard: 2.5
      }
    }
  };
}

function setTaxasCartao(params) {
  const { taxas } = params;
  return setConfig({ chave: 'taxas_cartao', valor: taxas });
}

// Mensagem de aniversário
function getBirthdayMessage() {
  const result = getConfig({ chave: 'birthday_message' });
  return {
    ok: true,
    message: result.valor || 'Olá {nome}! 🎂 Feliz aniversário!'
  };
}

function setBirthdayMessage(params) {
  return setConfig({ chave: 'birthday_message', valor: params.message });
}

// ================================================================================
// SETUP INICIAL - EXECUTAR UMA VEZ
// ================================================================================

/**
 * Executa configuração inicial criando todas as planilhas
 * Execute manualmente uma vez após criar o projeto
 */
function setupInicial() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Criar todas as abas
  Object.values(SHEETS).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      initializeSheet(sheet, sheetName);
      Logger.log('Criada aba: ' + sheetName);
    }
  });
  
  // Configurações iniciais padrão
  setConfig({ chave: 'horarios', valor: {
    domingo: { abre: '00:00', fecha: '00:00' },
    segunda: { abre: '08:00', fecha: '18:00' },
    terca: { abre: '08:00', fecha: '18:00' },
    quarta: { abre: '08:00', fecha: '18:00' },
    quinta: { abre: '08:00', fecha: '18:00' },
    sexta: { abre: '08:00', fecha: '18:00' },
    sabado: { abre: '08:00', fecha: '14:00' }
  }});
  
  setConfig({ chave: 'taxas_cartao', valor: {
    credito: { visa: 3.5, mastercard: 3.5, elo: 4.0, amex: 4.5, hipercard: 4.0 },
    debito: { visa: 2.0, mastercard: 2.0, elo: 2.5, amex: 2.5, hipercard: 2.5 }
  }});
  
  setConfig({ chave: 'birthday_message', valor: 'Olá {nome}! 🎂 Feliz aniversário!' });
  
  Logger.log('Setup inicial concluído!');
}

/**
 * Cria um agendador de exemplo (admin)
 */
function criarAgendadorAdmin() {
  const sheet = getSheet(SHEETS.AGENDADORES);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const newRow = headers.map(header => {
    if (header === 'id') return 1;
    if (header === 'nome') return 'Admin';
    if (header === 'senha') return '1234';
    if (header === 'isAdmin') return true;
    if (header === 'bloqueado') return false;
    if (header === 'almocoInicio') return '12:00';
    if (header === 'almocoFim') return '13:00';
    if (header === 'criadoEm') return now();
    if (header === 'atualizadoEm') return now();
    return '';
  });
  
  sheet.appendRow(newRow);
  Logger.log('Agendador Admin criado com senha 1234');
}
