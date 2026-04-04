/**
 * ================================================================================
 * NEXUS PRO - BACKEND COMPLETO
 * ================================================================================
 * 
 * INSTRUÇÕES:
 * 1. Acesse: https://script.google.com
 * 2. Abra seu projeto NEXUS (ou crie um novo)
 * 3. APAGUE TUDO que está lá
 * 4. COLE TODO este código
 * 5. Salve (Ctrl+S)
 * 6. Clique: Implantar > Nova implantação
 * 7. Tipo: Aplicativo da Web
 * 8. Executar como: Eu
 * 9. Quem pode acessar: Qualquer pessoa
 * 10. Clique Implantar e copie a nova URL
 * 11. Cole a URL no app (Configurações)
 * 
 * ================================================================================
 */

// Nomes das abas
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

function getSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    initializeSheet(sheet, sheetName);
  }
  
  return sheet;
}

function initializeSheet(sheet, sheetName) {
  const headers = {
    [SHEETS.AGENDADORES]: ['id', 'nome', 'senha', 'isAdmin', 'bloqueado', 'almocoInicio', 'almocoFim', 'comissaoServicos', 'comissaoProdutos', 'permissoes', 'status', 'criadoEm', 'atualizadoEm'],
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

function getNextId(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 1;
  
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat().filter(id => id !== '');
  if (ids.length === 0) return 1;
  
  return Math.max(...ids.map(Number)) + 1;
}

function rowToObject(headers, row) {
  const obj = {};
  headers.forEach((header, index) => {
    let value = row[index];
    if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
      try { value = JSON.parse(value); } catch (e) {}
    }
    if (value === 'TRUE' || value === true) value = true;
    if (value === 'FALSE' || value === false) value = false;
    obj[header] = value;
  });
  return obj;
}

function findRowById(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) return i + 1;
  }
  return -1;
}

function now() {
  return new Date().toISOString();
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== HANDLERS PRINCIPAIS =====

function doGet(e) {
  return jsonResponse({ ok: true, message: 'NEXUS PRO Backend ativo', timestamp: now() });
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    
    const actions = {
      'ping': () => handlePing(params),
      'auth': () => handleAuth(params),
      'agendadores': () => listarAgendadores(),
      'getAgendadorConfig': () => getAgendadorConfig(params),
      'setAgendadorConfig': () => setAgendadorConfig(params),
      'agendadorCreate': () => criarAgendador(params),
      'agendadorUpdate': () => atualizarAgendador(params),
      'agendadorDelete': () => excluirAgendador(params),
      'agendadorUpdatePassword': () => atualizarSenhaAgendador(params),
      'list': () => listarAgendamentos(params),
      'create': () => criarAgendamento(params),
      'update': () => atualizarAgendamento(params),
      'delete': () => excluirAgendamento(params),
      'disponibilidade': () => verificarDisponibilidade(params),
      'listarClientes': () => listarClientes(),
      'buscarCliente': () => buscarCliente(params),
      'cadastrarCliente': () => cadastrarCliente(params),
      'atualizarCliente': () => atualizarCliente(params),
      'excluirCliente': () => excluirCliente(params),
      'listarServicos': () => listarServicos(),
      'criarServico': () => criarServico(params),
      'atualizarServico': () => atualizarServico(params),
      'excluirServico': () => excluirServico(params),
      'listarProdutos': () => listarProdutos(),
      'criarProduto': () => criarProduto(params),
      'atualizarProduto': () => atualizarProduto(params),
      'excluirProduto': () => excluirProduto(params),
      'ajustarEstoque': () => ajustarEstoque(params),
      'listarTransacoes': () => listarTransacoes(params),
      'criarTransacao': () => criarTransacao(params),
      'atualizarTransacao': () => atualizarTransacao(params),
      'excluirTransacao': () => excluirTransacao(params),
      'getConfig': () => getConfig(params),
      'setConfig': () => setConfig(params),
      'getAllConfigs': () => getAllConfigs()
    };
    
    if (actions[action]) {
      return jsonResponse(actions[action]());
    }
    
    return jsonResponse({ ok: false, error: 'Ação desconhecida: ' + action });
    
  } catch (error) {
    return jsonResponse({ ok: false, error: error.toString() });
  }
}

// ===== CONEXÃO E AUTENTICAÇÃO =====

function handlePing(params) {
  return {
    ok: true,
    agendadores: listarAgendadores().data || [],
    horarios: getHorarios()
  };
}

function getHorarios() {
  // Try to read from config first
  try {
    const config = getConfig({ chave: 'horarios_sistema' });
    if (config.ok && config.valor) {
      return config.valor;
    }
  } catch (e) {
    // If error reading config, use defaults
  }
  
  // Default business hours (novo formato por dia da semana)
  // 0=Segunda, 1=Terça, 2=Quarta, 3=Quinta, 4=Sexta, 5=Sábado, 6=Domingo
  return {
    dias: {
      "0": { abre: "08:00", fecha: "18:00" },
      "1": { abre: "08:00", fecha: "18:00" },
      "2": { abre: "08:00", fecha: "18:00" },
      "3": { abre: "08:00", fecha: "18:00" },
      "4": { abre: "08:00", fecha: "18:00" },
      "5": { abre: "08:00", fecha: "12:00" },
      "6": { abre: "00:00", fecha: "00:00" }
    }
  };
}

function handleAuth(params) {
  const { agendadorId, senha } = params;
  const sheet = getSheet(SHEETS.AGENDADORES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    if (row.id == agendadorId && row.senha === senha) {
      const agendador = {
        id: row.id,
        nome: row.nome,
        isAdmin: row.isAdmin === true
      };
      return {
        ok: true,
        agendador: agendador,
        user: agendador  // Legacy compatibility
      };
    }
  }
  
  return { ok: false, error: 'Credenciais inválidas' };
}

// ===== AGENDADORES =====

function listarAgendadores() {
  const sheet = getSheet(SHEETS.AGENDADORES);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return { ok: true, data: [] };
  
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
  
  if (rowNum === -1) return { ok: false, error: 'Agendador não encontrado' };
  
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
  
  if (rowNum === -1) return { ok: false, error: 'Agendador não encontrado' };
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  headers.forEach((header, index) => {
    if (header === 'bloqueado' && bloqueado !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(bloqueado);
    }
    if (header === 'almocoInicio' && almocoInicio !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(almocoInicio);
    }
    if (header === 'almocoFim' && almocoFim !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(almocoFim);
    }
    if (header === 'atualizadoEm') {
      sheet.getRange(rowNum, index + 1).setValue(now());
    }
  });
  
  return { ok: true };
}

function criarAgendador(params) {
  const sheet = getSheet(SHEETS.AGENDADORES);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Suporta tanto snake_case quanto camelCase
  const nome = params.nome;
  const senha = params.senha;
  const isAdmin = params.isAdmin === true;
  const almocoInicio = params.almocoInicio || params.almoco_inicio || '';
  const almocoFim = params.almocoFim || params.almoco_fim || '';
  const comissaoServicos = params.comissao_servicos || params.comissaoServicos || 0;
  const comissaoProdutos = params.comissao_produtos || params.comissaoProdutos || 0;
  
  if (!nome || !senha) {
    return { ok: false, error: 'Nome e senha são obrigatórios' };
  }
  
  // Verificar se já existe agendador com mesmo nome
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    if (row.nome && row.nome.toLowerCase() === nome.toLowerCase()) {
      return { ok: false, error: 'Já existe um agendador com este nome' };
    }
  }
  
  const id = generateId();
  const timestamp = now();
  
  const newRow = headers.map(header => {
    switch(header) {
      case 'id': return id;
      case 'nome': return nome;
      case 'senha': return senha;
      case 'isAdmin': return isAdmin;
      case 'bloqueado': return false;
      case 'almocoInicio': return almocoInicio;
      case 'almocoFim': return almocoFim;
      case 'comissaoServicos': return comissaoServicos;
      case 'comissaoProdutos': return comissaoProdutos;
      case 'permissoes': return JSON.stringify(params.permissoes || {});
      case 'criadoEm': return timestamp;
      case 'atualizadoEm': return timestamp;
      default: return '';
    }
  });
  
  sheet.appendRow(newRow);
  
  return { ok: true, id: id };
}

function atualizarAgendador(params) {
  const { id } = params;
  if (!id) return { ok: false, error: 'ID é obrigatório' };
  
  const sheet = getSheet(SHEETS.AGENDADORES);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Agendador não encontrado' };
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Mapeamento de campos (suporta snake_case e camelCase)
  const fieldMap = {
    'nome': params.nome,
    'isAdmin': params.isAdmin,
    'bloqueado': params.bloqueado !== undefined ? params.bloqueado : params.agenda_bloqueada,
    'almocoInicio': params.almocoInicio || params.almoco_inicio,
    'almocoFim': params.almocoFim || params.almoco_fim,
    'comissaoServicos': params.comissao_servicos || params.comissaoServicos,
    'comissaoProdutos': params.comissao_produtos || params.comissaoProdutos,
    'permissoes': params.permissoes ? JSON.stringify(params.permissoes) : undefined,
    'status': params.status
  };
  
  headers.forEach((header, index) => {
    if (fieldMap[header] !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(fieldMap[header]);
    }
    if (header === 'atualizadoEm') {
      sheet.getRange(rowNum, index + 1).setValue(now());
    }
  });
  
  return { ok: true };
}

function excluirAgendador(params) {
  const { id } = params;
  if (!id) return { ok: false, error: 'ID é obrigatório' };
  
  const sheet = getSheet(SHEETS.AGENDADORES);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Agendador não encontrado' };
  
  sheet.deleteRow(rowNum);
  
  return { ok: true };
}

function atualizarSenhaAgendador(params) {
  const { id, novaSenha, senhaAtual, isAdmin } = params;
  if (!id) return { ok: false, error: 'ID é obrigatório' };
  if (!novaSenha) return { ok: false, error: 'Nova senha é obrigatória' };
  
  const sheet = getSheet(SHEETS.AGENDADORES);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Agendador não encontrado' };
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
  const agendador = rowToObject(headers, row);
  
  // Se não é admin, verificar senha atual
  if (!isAdmin && agendador.senha !== senhaAtual) {
    return { ok: false, error: 'Senha atual incorreta' };
  }
  
  const senhaIndex = headers.indexOf('senha');
  if (senhaIndex >= 0) {
    sheet.getRange(rowNum, senhaIndex + 1).setValue(novaSenha);
  }
  
  return { ok: true };
}

// ===== AGENDAMENTOS =====

function listarAgendamentos(params) {
  const { date, agendadorId } = params || {};
  const sheet = getSheet(SHEETS.AGENDAMENTOS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return { ok: true, data: [] };
  
  const headers = data[0];
  const agendamentos = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    
    if (date && row.date !== date) continue;
    if (agendadorId && row.agendadorId != agendadorId) continue;
    
    agendamentos.push({
      id: row.id,
      date: row.date,
      time: row.time,
      client: row.client,
      phone: row.phone,
      servico: row.servico,
      observacoes: row.observacoes,
      agendadorId: row.agendadorId,
      agendador: row.agendador,
      blocked: row.blocked === true,
      confirmado: row.confirmado === true
    });
  }
  
  return { ok: true, data: agendamentos };
}

function criarAgendamento(params) {
  const { date, time, client, phone, servico, observacoes, agendadorId, agendador, blocked } = params;
  const sheet = getSheet(SHEETS.AGENDAMENTOS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const id = getNextId(sheet);
  
  const newRow = headers.map(header => {
    if (header === 'id') return id;
    if (header === 'date') return date;
    if (header === 'time') return time;
    if (header === 'client') return client || '';
    if (header === 'phone') return phone || '';
    if (header === 'servico') return servico || '';
    if (header === 'observacoes') return observacoes || '';
    if (header === 'agendadorId') return agendadorId;
    if (header === 'agendador') return agendador || '';
    if (header === 'blocked') return blocked === true;
    if (header === 'confirmado') return false;
    if (header === 'criadoEm') return now();
    if (header === 'atualizadoEm') return now();
    return '';
  });
  
  sheet.appendRow(newRow);
  return { ok: true, id: id };
}

function atualizarAgendamento(params) {
  const { id, date, time, client, phone, servico, observacoes, agendadorId, agendador, blocked, confirmado } = params;
  const sheet = getSheet(SHEETS.AGENDAMENTOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Agendamento não encontrado' };
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const updates = { date, time, client, phone, servico, observacoes, agendadorId, agendador, blocked, confirmado };
  
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

function excluirAgendamento(params) {
  const { id } = params;
  const sheet = getSheet(SHEETS.AGENDAMENTOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Agendamento não encontrado' };
  
  sheet.deleteRow(rowNum);
  return { ok: true };
}

function verificarDisponibilidade(params) {
  const { date, agendadorId } = params;
  const agendamentos = listarAgendamentos({ date, agendadorId });
  
  const horariosOcupados = (agendamentos.data || []).map(a => a.time);
  
  return { ok: true, ocupados: horariosOcupados };
}

// ===== CLIENTES =====

function listarClientes() {
  const sheet = getSheet(SHEETS.CLIENTES);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return { ok: true, data: [] };
  
  const headers = data[0];
  const clientes = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    clientes.push({
      id: row.id,
      nome: row.nome,
      telefone: row.telefone,
      cpf: row.cpf || '',
      aniversario: row.aniversario || '',
      notas: row.notas || '',
      totalAgendamentos: row.totalAgendamentos || 0
    });
  }
  
  return { ok: true, data: clientes };
}

function buscarCliente(params) {
  const { termo } = params;
  if (!termo) return { ok: true, data: [] };
  
  const clientes = listarClientes().data || [];
  const termoLower = termo.toLowerCase();
  
  const resultados = clientes.filter(c => 
    (c.nome && c.nome.toLowerCase().includes(termoLower)) ||
    (c.telefone && c.telefone.includes(termo))
  );
  
  return { ok: true, data: resultados };
}

function cadastrarCliente(params) {
  const { nome, telefone, cpf, aniversario, notas } = params;
  const sheet = getSheet(SHEETS.CLIENTES);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
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
  const { id, telefone, nome, cpf, aniversario, notas } = params;
  const sheet = getSheet(SHEETS.CLIENTES);
  
  // Buscar por ID ou telefone
  let rowNum = -1;
  if (id) {
    rowNum = findRowById(sheet, id);
  } else if (telefone) {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const telCol = headers.indexOf('telefone');
    for (let i = 1; i < data.length; i++) {
      if (data[i][telCol] === telefone) {
        rowNum = i + 1;
        break;
      }
    }
  }
  
  if (rowNum === -1) return { ok: false, error: 'Cliente não encontrado' };
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const updates = { nome, cpf, aniversario, notas };
  
  headers.forEach((header, index) => {
    if (header === 'id' || header === 'criadoEm' || header === 'telefone') return;
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
  
  if (rowNum === -1) return { ok: false, error: 'Cliente não encontrado' };
  
  sheet.deleteRow(rowNum);
  return { ok: true };
}

// ===== SERVIÇOS =====

function listarServicos() {
  const sheet = getSheet(SHEETS.SERVICOS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return { ok: true, data: [] };
  
  const headers = data[0];
  const servicos = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    if (row.ativo === false) continue;
    
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
  
  if (rowNum === -1) return { ok: false, error: 'Serviço não encontrado' };
  
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
  
  if (rowNum === -1) return { ok: false, error: 'Serviço não encontrado' };
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const ativoCol = headers.indexOf('ativo') + 1;
  const atualizadoEmCol = headers.indexOf('atualizadoEm') + 1;
  
  if (ativoCol > 0) sheet.getRange(rowNum, ativoCol).setValue(false);
  if (atualizadoEmCol > 0) sheet.getRange(rowNum, atualizadoEmCol).setValue(now());
  
  return { ok: true };
}

// ===== PRODUTOS =====

function listarProdutos() {
  const sheet = getSheet(SHEETS.PRODUTOS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return { ok: true, data: [] };
  
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
  
  if (rowNum === -1) return { ok: false, error: 'Produto não encontrado' };
  
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
  
  if (rowNum === -1) return { ok: false, error: 'Produto não encontrado' };
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const ativoCol = headers.indexOf('ativo') + 1;
  const atualizadoEmCol = headers.indexOf('atualizadoEm') + 1;
  
  if (ativoCol > 0) sheet.getRange(rowNum, ativoCol).setValue(false);
  if (atualizadoEmCol > 0) sheet.getRange(rowNum, atualizadoEmCol).setValue(now());
  
  return { ok: true };
}

function ajustarEstoque(params) {
  const { id, quantidade, tipo } = params;
  const sheet = getSheet(SHEETS.PRODUTOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Produto não encontrado' };
  
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

// ===== TRANSAÇÕES (CAIXA) =====

function listarTransacoes(params) {
  const { dataInicio, dataFim, type, paymentMethod } = params || {};
  const sheet = getSheet(SHEETS.TRANSACOES);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return { ok: true, data: [] };
  
  const headers = data[0];
  const transacoes = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    
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
  
  if (rowNum === -1) return { ok: false, error: 'Transação não encontrada' };
  
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
  
  if (rowNum === -1) return { ok: false, error: 'Transação não encontrada' };
  
  sheet.deleteRow(rowNum);
  return { ok: true };
}

// ===== CONFIGURAÇÕES =====

function getConfig(params) {
  const { chave } = params;
  const sheet = getSheet(SHEETS.CONFIGURACOES);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === chave) {
      let valor = data[i][1];
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
  
  let rowNum = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === chave) {
      rowNum = i + 1;
      break;
    }
  }
  
  const valorStr = typeof valor === 'object' ? JSON.stringify(valor) : valor;
  
  if (rowNum === -1) {
    sheet.appendRow([chave, valorStr, now()]);
  } else {
    sheet.getRange(rowNum, 2).setValue(valorStr);
    sheet.getRange(rowNum, 3).setValue(now());
  }
  
  return { ok: true };
}

function getAllConfigs() {
  const sheet = getSheet(SHEETS.CONFIGURACOES);
  const data = sheet.getDataRange().getValues();
  
  const configs = {};
  for (let i = 1; i < data.length; i++) {
    let valor = data[i][1];
    try { valor = JSON.parse(valor); } catch (e) {}
    configs[data[i][0]] = valor;
  }
  
  return { ok: true, data: configs };
}
