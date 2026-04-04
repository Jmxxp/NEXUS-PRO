/**
 * ================================================================================
 * NEXUS PRO - BACKEND v5.0
 * Sistema completo com gerenciamento de agendadores pelo admin
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
 * NOVIDADES v5.0:
 * - Admin pode criar/editar/excluir agendadores
 * - Sistema de permissões por módulo
 * - Campos de expediente e almoço por agendador
 * - Comissões de serviços e produtos por agendador
 * - Login retorna permissões completas
 * 
 * ================================================================================
 */

// ===== NOMES DAS ABAS =====
const SHEETS = {
  AGENDADORES: 'Agendadores',
  AGENDAMENTOS: 'Agendamentos',
  CLIENTES: 'Clientes',
  SERVICOS: 'Servicos',
  PRODUTOS: 'Produtos',
  TRANSACOES: 'Transacoes',
  CONFIGURACOES: 'Configuracoes'
};

// ===== COLUNAS DAS ABAS v5.0 =====
const COLS = {
  AGENDADORES: [
    'id', 'nome', 'senha', 'isAdmin', 'status',
    'permissoes',           // JSON com permissões por módulo
    'agenda_bloqueada',     // Boolean
    'registrar_expediente', // Boolean - se registra expediente
    'hora_inicio',          // ex: "08:00"
    'hora_fim',             // ex: "18:00"
    'almoco_inicio',        // ex: "12:00"
    'almoco_fim',           // ex: "13:00"
    'comissao_servicos',    // Percentual (0-100)
    'comissao_produtos',    // Percentual (0-100)
    'created_at', 'updated_at'
  ],
  AGENDAMENTOS: [
    'id', 'date', 'time', 'client', 'phone', 'servico', 'observacoes',
    'agendadorId', 'agendador', 'blocked', 'confirmado', 'created_at', 'updated_at'
  ],
  CLIENTES: [
    'id', 'nome', 'telefone', 'cpf', 'aniversario', 'notas',
    'totalAgendamentos', 'created_at', 'updated_at'
  ],
  SERVICOS: [
    'id', 'nome', 'preco', 'duracao', 'descricao', 'icon', 'ativo', 'created_at', 'updated_at'
  ],
  PRODUTOS: [
    'id', 'nome', 'preco', 'estoque', 'estoqueMinimo', 'descricao', 'icon', 'ativo', 'created_at', 'updated_at'
  ],
  TRANSACOES: [
    'id', 'type', 'description', 'value', 'date', 'paymentMethod', 'items',
    'clientPhone', 'agendadorId', 'created_at', 'updated_at', 'editHistory'
  ],
  CONFIGURACOES: ['chave', 'valor', 'updated_at']
};

// ===== PERMISSÕES PADRÃO =====
const DEFAULT_PERMISSIONS = {
  agenda: true,
  clientes: true,
  retorno: true,
  servicos: false,
  produtos: false,
  caixa: false,
  comissoes: false,
  estatisticas: true,
  configuracoes: false,
  backups: false
};

const ADMIN_PERMISSIONS = {
  agenda: true,
  clientes: true,
  retorno: true,
  servicos: true,
  produtos: true,
  caixa: true,
  comissoes: true,
  estatisticas: true,
  configuracoes: true,
  backups: true
};

// ===== ADMIN INICIAL =====
const ADMIN_INICIAL = {
  id: 'admin',
  nome: 'Administrador',
  senha: '123456',  // IMPORTANTE: Usuário deve trocar após primeiro acesso
  isAdmin: true
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
  const colsKey = Object.keys(SHEETS).find(k => SHEETS[k] === sheetName);
  const headers = COLS[colsKey];
  
  if (headers) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    
    // Inicializar admin se for aba de agendadores
    if (sheetName === SHEETS.AGENDADORES) {
      initializeAdmin(sheet);
    }
  }
}

function initializeAdmin(sheet) {
  const now = new Date().toISOString();
  const adminRow = [
    ADMIN_INICIAL.id,
    ADMIN_INICIAL.nome,
    ADMIN_INICIAL.senha,
    true,  // isAdmin
    'ativo',
    JSON.stringify(ADMIN_PERMISSIONS),
    false, // agenda_bloqueada
    false, // registrar_expediente
    '08:00',
    '18:00',
    '12:00',
    '13:00',
    0,     // comissao_servicos
    0,     // comissao_produtos
    now,
    now
  ];
  sheet.appendRow(adminRow);
}

function getNextId(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 1;
  
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat().filter(id => id !== '');
  if (ids.length === 0) return 1;
  
  const numericIds = ids.map(id => {
    const num = parseInt(id);
    return isNaN(num) ? 0 : num;
  });
  
  return Math.max(...numericIds) + 1;
}

function genId() {
  return String(Date.now()) + String(Math.floor(Math.random() * 1000));
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
    if (String(data[i][0]) === String(id)) return i + 1;
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

function toNum(v, d) {
  const n = Number(v);
  return isNaN(n) ? (d || 0) : n;
}

function toBool(v) {
  return v === true || v === 'true' || v === 1 || v === '1';
}

// ===== HANDLERS PRINCIPAIS =====

function doGet(e) {
  return jsonResponse({ ok: true, message: 'NEXUS PRO Backend v5.0 ativo', timestamp: now() });
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    
    const actions = {
      // Sistema
      'ping': () => handlePing(params),
      'auth': () => handleAuth(params),
      
      // Agendadores (novo sistema)
      'agendadores': () => listarAgendadores(),
      'agendadorCreate': () => criarAgendador(params),
      'agendadorUpdate': () => atualizarAgendador(params),
      'agendadorDelete': () => excluirAgendador(params),
      'agendadorGet': () => buscarAgendador(params),
      'agendadorUpdatePassword': () => atualizarSenhaAgendador(params),
      'agendadorUpdatePermissions': () => atualizarPermissoesAgendador(params),
      'agendadorUpdateSchedule': () => atualizarExpedienteAgendador(params),
      'agendadorUpdateCommission': () => atualizarComissaoAgendador(params),
      'agendadorToggleBlock': () => toggleBloqueioAgenda(params),
      
      // Legacy agendadores (compatibilidade)
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
      
      // Taxas de Cartão
      'getCardFees': () => getCardFees(),
      'setCardFees': () => setCardFees(params)
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
  const agendadores = listarAgendadores();
  return {
    ok: true,
    agendadores: agendadores.data || [],
    horarios: getHorariosGlobais()
  };
}

function getHorariosGlobais() {
  // Buscar configuração global ou usar padrão
  const config = getConfig({ chave: 'horarios_sistema' });
  if (config.ok && config.valor) {
    return config.valor;
  }
  return {
    inicio: '08:00',
    fim: '18:00',
    intervalo: 30,
    almoco: { inicio: '12:00', fim: '13:00' }
  };
}

function handleAuth(params) {
  const { agendadorId, senha } = params;
  const sheet = getSheet(SHEETS.AGENDADORES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    if (String(row.id) === String(agendadorId) && row.senha === senha) {
      // Se agendador está inativo, não permitir login
      if (row.status === 'inativo') {
        return { ok: false, error: 'Usuário inativo' };
      }
      
      // Garantir que permissões existem
      let permissoes = row.permissoes;
      if (!permissoes || typeof permissoes !== 'object') {
        permissoes = row.isAdmin ? ADMIN_PERMISSIONS : DEFAULT_PERMISSIONS;
      }
      
      return {
        ok: true,
        user: {
          id: row.id,
          nome: row.nome,
          isAdmin: row.isAdmin === true,
          status: row.status || 'ativo',
          permissoes: permissoes,
          registrar_expediente: toBool(row.registrar_expediente),
          agenda_bloqueada: toBool(row.agenda_bloqueada),
          hora_inicio: row.hora_inicio || '08:00',
          hora_fim: row.hora_fim || '18:00',
          almoco_inicio: row.almoco_inicio || '12:00',
          almoco_fim: row.almoco_fim || '13:00',
          comissao_servicos: toNum(row.comissao_servicos, 0),
          comissao_produtos: toNum(row.comissao_produtos, 0)
        }
      };
    }
  }
  
  return { ok: false, error: 'Credenciais inválidas' };
}

// ===== AGENDADORES (NOVO SISTEMA v5.0) =====

function listarAgendadores() {
  const sheet = getSheet(SHEETS.AGENDADORES);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return { ok: true, data: [] };
  
  const headers = data[0];
  const agendadores = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    
    // Garantir que permissões existem
    let permissoes = row.permissoes;
    if (!permissoes || typeof permissoes !== 'object') {
      permissoes = row.isAdmin ? ADMIN_PERMISSIONS : DEFAULT_PERMISSIONS;
    }
    
    agendadores.push({
      id: row.id,
      nome: row.nome,
      isAdmin: row.isAdmin === true,
      status: row.status || 'ativo',
      permissoes: permissoes,
      agenda_bloqueada: toBool(row.agenda_bloqueada),
      registrar_expediente: toBool(row.registrar_expediente),
      hora_inicio: row.hora_inicio || '',
      hora_fim: row.hora_fim || '',
      almocoInicio: row.almoco_inicio || '',
      almocoFim: row.almoco_fim || '',
      bloqueado: toBool(row.agenda_bloqueada), // Alias para compatibilidade
      comissao_servicos: toNum(row.comissao_servicos, 0),
      comissao_produtos: toNum(row.comissao_produtos, 0)
    });
  }
  
  return { ok: true, data: agendadores };
}

function buscarAgendador(params) {
  const { id } = params;
  if (!id) return { ok: false, error: 'ID obrigatório' };
  
  const sheet = getSheet(SHEETS.AGENDADORES);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Agendador não encontrado' };
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
  const agendador = rowToObject(headers, row);
  
  let permissoes = agendador.permissoes;
  if (!permissoes || typeof permissoes !== 'object') {
    permissoes = agendador.isAdmin ? ADMIN_PERMISSIONS : DEFAULT_PERMISSIONS;
  }
  
  return {
    ok: true,
    agendador: {
      id: agendador.id,
      nome: agendador.nome,
      isAdmin: agendador.isAdmin === true,
      status: agendador.status || 'ativo',
      permissoes: permissoes,
      agenda_bloqueada: toBool(agendador.agenda_bloqueada),
      registrar_expediente: toBool(agendador.registrar_expediente),
      hora_inicio: agendador.hora_inicio || '08:00',
      hora_fim: agendador.hora_fim || '18:00',
      almoco_inicio: agendador.almoco_inicio || '12:00',
      almoco_fim: agendador.almoco_fim || '13:00',
      comissao_servicos: toNum(agendador.comissao_servicos, 0),
      comissao_produtos: toNum(agendador.comissao_produtos, 0),
      created_at: agendador.created_at,
      updated_at: agendador.updated_at
    }
  };
}

function criarAgendador(params) {
  const { nome, senha, isAdmin, permissoes, hora_inicio, hora_fim, almoco_inicio, almoco_fim } = params;
  
  if (!nome) return { ok: false, error: 'Nome obrigatório' };
  if (!senha) return { ok: false, error: 'Senha obrigatória' };
  
  const sheet = getSheet(SHEETS.AGENDADORES);
  const id = getNextId(sheet);
  const timestamp = now();
  
  // Permissões padrão se não especificadas
  const perms = permissoes || (isAdmin ? ADMIN_PERMISSIONS : DEFAULT_PERMISSIONS);
  
  const newRow = [
    id,
    nome,
    senha,
    toBool(isAdmin),
    'ativo',
    JSON.stringify(perms),
    false,  // agenda_bloqueada
    false,  // registrar_expediente
    hora_inicio || '08:00',
    hora_fim || '18:00',
    almoco_inicio || '12:00',
    almoco_fim || '13:00',
    0,      // comissao_servicos
    0,      // comissao_produtos
    timestamp,
    timestamp
  ];
  
  sheet.appendRow(newRow);
  return { ok: true, id: id, message: 'Agendador criado com sucesso' };
}

function atualizarAgendador(params) {
  const { id, nome, isAdmin, status, permissoes, registrar_expediente,
          hora_inicio, hora_fim, almoco_inicio, almoco_fim,
          comissao_servicos, comissao_produtos } = params;
  
  if (!id) return { ok: false, error: 'ID obrigatório' };
  
  // Não permite editar o admin principal
  if (id === 'admin' && isAdmin === false) {
    return { ok: false, error: 'Não é possível remover privilégios do admin principal' };
  }
  
  const sheet = getSheet(SHEETS.AGENDADORES);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Agendador não encontrado' };
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const currentRow = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
  const current = rowToObject(headers, currentRow);
  
  // Atualizar campos
  headers.forEach((header, index) => {
    if (header === 'id' || header === 'created_at') return;
    
    if (header === 'updated_at') {
      sheet.getRange(rowNum, index + 1).setValue(now());
      return;
    }
    
    if (header === 'nome' && nome !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(nome);
    }
    if (header === 'isAdmin' && isAdmin !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(toBool(isAdmin));
    }
    if (header === 'status' && status !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(status);
    }
    if (header === 'permissoes' && permissoes !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(
        typeof permissoes === 'string' ? permissoes : JSON.stringify(permissoes)
      );
    }
    if (header === 'registrar_expediente' && registrar_expediente !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(toBool(registrar_expediente));
    }
    if (header === 'hora_inicio' && hora_inicio !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(hora_inicio);
    }
    if (header === 'hora_fim' && hora_fim !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(hora_fim);
    }
    if (header === 'almoco_inicio' && almoco_inicio !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(almoco_inicio);
    }
    if (header === 'almoco_fim' && almoco_fim !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(almoco_fim);
    }
    if (header === 'comissao_servicos' && comissao_servicos !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(toNum(comissao_servicos, 0));
    }
    if (header === 'comissao_produtos' && comissao_produtos !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(toNum(comissao_produtos, 0));
    }
  });
  
  return { ok: true, message: 'Agendador atualizado com sucesso' };
}

function excluirAgendador(params) {
  const { id } = params;
  
  if (!id) return { ok: false, error: 'ID obrigatório' };
  
  // Não permite excluir o admin principal
  if (id === 'admin') {
    return { ok: false, error: 'Não é possível excluir o administrador principal' };
  }
  
  const sheet = getSheet(SHEETS.AGENDADORES);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Agendador não encontrado' };
  
  sheet.deleteRow(rowNum);
  return { ok: true, message: 'Agendador excluído com sucesso' };
}

function atualizarSenhaAgendador(params) {
  const { id, novaSenha, senhaAtual, isAdmin } = params;
  
  if (!id) return { ok: false, error: 'ID obrigatório' };
  if (!novaSenha) return { ok: false, error: 'Nova senha obrigatória' };
  
  const sheet = getSheet(SHEETS.AGENDADORES);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Agendador não encontrado' };
  
  // Se não é admin, verificar senha atual
  if (!isAdmin) {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const currentRow = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
    const current = rowToObject(headers, currentRow);
    
    if (current.senha !== senhaAtual) {
      return { ok: false, error: 'Senha atual incorreta' };
    }
  }
  
  // Atualizar senha
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const senhaCol = headers.indexOf('senha') + 1;
  const updatedCol = headers.indexOf('updated_at') + 1;
  
  if (senhaCol > 0) sheet.getRange(rowNum, senhaCol).setValue(novaSenha);
  if (updatedCol > 0) sheet.getRange(rowNum, updatedCol).setValue(now());
  
  return { ok: true, message: 'Senha atualizada com sucesso' };
}

function atualizarPermissoesAgendador(params) {
  const { id, permissoes } = params;
  
  if (!id) return { ok: false, error: 'ID obrigatório' };
  if (!permissoes) return { ok: false, error: 'Permissões obrigatórias' };
  
  return atualizarAgendador({ id, permissoes });
}

function atualizarExpedienteAgendador(params) {
  const { id, hora_inicio, hora_fim, almoco_inicio, almoco_fim, registrar_expediente } = params;
  
  if (!id) return { ok: false, error: 'ID obrigatório' };
  
  return atualizarAgendador({
    id,
    hora_inicio,
    hora_fim,
    almoco_inicio,
    almoco_fim,
    registrar_expediente
  });
}

function atualizarComissaoAgendador(params) {
  const { id, comissao_servicos, comissao_produtos } = params;
  
  if (!id) return { ok: false, error: 'ID obrigatório' };
  
  return atualizarAgendador({ id, comissao_servicos, comissao_produtos });
}

function toggleBloqueioAgenda(params) {
  const { id, bloqueado } = params;
  
  if (!id) return { ok: false, error: 'ID obrigatório' };
  
  const sheet = getSheet(SHEETS.AGENDADORES);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Agendador não encontrado' };
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const bloqCol = headers.indexOf('agenda_bloqueada') + 1;
  const updatedCol = headers.indexOf('updated_at') + 1;
  
  if (bloqCol > 0) sheet.getRange(rowNum, bloqCol).setValue(toBool(bloqueado));
  if (updatedCol > 0) sheet.getRange(rowNum, updatedCol).setValue(now());
  
  return { ok: true, message: bloqueado ? 'Agenda bloqueada' : 'Agenda desbloqueada' };
}

// ===== LEGACY AGENDADORES (COMPATIBILIDADE) =====

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
      bloqueado: toBool(agendador.agenda_bloqueada),
      almocoInicio: agendador.almoco_inicio || '12:00',
      almocoFim: agendador.almoco_fim || '13:00'
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
    if (header === 'agenda_bloqueada' && bloqueado !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(toBool(bloqueado));
    }
    if (header === 'almoco_inicio' && almocoInicio !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(almocoInicio);
    }
    if (header === 'almoco_fim' && almocoFim !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(almocoFim);
    }
    if (header === 'updated_at') {
      sheet.getRange(rowNum, index + 1).setValue(now());
    }
  });
  
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
  const id = getNextId(sheet);
  const timestamp = now();
  
  const newRow = [
    id, date, time, client || '', phone || '', servico || '', observacoes || '',
    agendadorId, agendador || '', blocked === true, false, timestamp, timestamp
  ];
  
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
    if (header === 'id' || header === 'created_at') return;
    if (header === 'updated_at') {
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
  
  if (data.length <= 1) return { ok: true, clientes: [] };
  
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
  
  return { ok: true, clientes: clientes };
}

function buscarCliente(params) {
  const { termo } = params;
  if (!termo) return { ok: true, data: [] };
  
  const clientes = listarClientes().clientes || [];
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
  const id = getNextId(sheet);
  const timestamp = now();
  
  const newRow = [
    id, nome || '', telefone || '', cpf || '', aniversario || '', notas || '',
    0, timestamp, timestamp
  ];
  
  sheet.appendRow(newRow);
  return { ok: true, id: id };
}

function atualizarCliente(params) {
  const { id, telefone, nome, cpf, aniversario, notas } = params;
  const sheet = getSheet(SHEETS.CLIENTES);
  
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
    if (header === 'id' || header === 'created_at' || header === 'telefone') return;
    if (header === 'updated_at') {
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
  
  if (data.length <= 1) return { ok: true, data: [], servicos: [] };
  
  const headers = data[0];
  const servicos = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    // Só retorna serviços ativos
    if (row.ativo === false) continue;
    
    servicos.push({
      id: row.id,
      nome: row.nome,
      preco: parseFloat(row.preco) || 0,
      duracao: parseInt(row.duracao) || 30,
      duracao_minutos: parseInt(row.duracao) || 30,
      descricao: row.descricao || '',
      icon: row.icon || 'fa-scissors',
      status: row.ativo !== false ? 'ativo' : 'inativo'
    });
  }
  
  // Retornar em ambos formatos para compatibilidade
  return { ok: true, data: servicos, servicos: servicos };
}

function criarServico(params) {
  const { nome, preco, duracao, duracao_minutos, descricao, icon } = params;
  const sheet = getSheet(SHEETS.SERVICOS);
  const id = getNextId(sheet);
  const timestamp = now();
  
  const duracaoFinal = duracao_minutos || duracao || 30;
  
  const newRow = [
    id, nome || '', parseFloat(preco) || 0, parseInt(duracaoFinal) || 30,
    descricao || '', icon || 'fa-scissors', true, timestamp, timestamp
  ];
  
  sheet.appendRow(newRow);
  return { ok: true, id: id };
}

function atualizarServico(params) {
  const { id, nome, preco, duracao, duracao_minutos, descricao, icon, ativo, status } = params;
  const sheet = getSheet(SHEETS.SERVICOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Serviço não encontrado' };
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  headers.forEach((header, index) => {
    if (header === 'id' || header === 'created_at') return;
    if (header === 'updated_at') {
      sheet.getRange(rowNum, index + 1).setValue(now());
      return;
    }
    if (header === 'nome' && nome !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(nome);
    }
    if (header === 'preco' && preco !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(parseFloat(preco) || 0);
    }
    if (header === 'duracao') {
      const dur = duracao_minutos !== undefined ? duracao_minutos : duracao;
      if (dur !== undefined) {
        sheet.getRange(rowNum, index + 1).setValue(parseInt(dur) || 30);
      }
    }
    if (header === 'descricao' && descricao !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(descricao);
    }
    if (header === 'icon' && icon !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(icon);
    }
    if (header === 'ativo') {
      if (ativo !== undefined) {
        sheet.getRange(rowNum, index + 1).setValue(ativo);
      } else if (status !== undefined) {
        sheet.getRange(rowNum, index + 1).setValue(status === 'ativo');
      }
    }
  });
  
  return { ok: true };
}

function excluirServico(params) {
  const { id } = params;
  const sheet = getSheet(SHEETS.SERVICOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Serviço não encontrado' };
  
  // Soft delete - marca como inativo
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const ativoCol = headers.indexOf('ativo') + 1;
  const updatedCol = headers.indexOf('updated_at') + 1;
  
  if (ativoCol > 0) sheet.getRange(rowNum, ativoCol).setValue(false);
  if (updatedCol > 0) sheet.getRange(rowNum, updatedCol).setValue(now());
  
  return { ok: true };
}

// ===== PRODUTOS =====

function listarProdutos() {
  const sheet = getSheet(SHEETS.PRODUTOS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return { ok: true, data: [], produtos: [] };
  
  const headers = data[0];
  const produtos = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = rowToObject(headers, data[i]);
    // Só retorna produtos ativos
    if (row.ativo === false) continue;
    
    produtos.push({
      id: row.id,
      nome: row.nome,
      preco: parseFloat(row.preco) || 0,
      estoque: parseInt(row.estoque) || 0,
      estoqueMinimo: parseInt(row.estoqueMinimo) || 5,
      descricao: row.descricao || '',
      icon: row.icon || 'fa-box',
      status: row.ativo !== false ? 'ativo' : 'inativo'
    });
  }
  
  // Retornar em ambos formatos para compatibilidade
  return { ok: true, data: produtos, produtos: produtos };
}

function criarProduto(params) {
  const { nome, preco, estoque, estoqueMinimo, descricao, icon } = params;
  const sheet = getSheet(SHEETS.PRODUTOS);
  const id = getNextId(sheet);
  const timestamp = now();
  
  const newRow = [
    id, nome || '', parseFloat(preco) || 0, parseInt(estoque) || 0,
    parseInt(estoqueMinimo) || 5, descricao || '', icon || 'fa-box', true,
    timestamp, timestamp
  ];
  
  sheet.appendRow(newRow);
  return { ok: true, id: id };
}

function atualizarProduto(params) {
  const { id, nome, preco, estoque, estoqueMinimo, descricao, icon, ativo, status } = params;
  const sheet = getSheet(SHEETS.PRODUTOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Produto não encontrado' };
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  headers.forEach((header, index) => {
    if (header === 'id' || header === 'created_at') return;
    if (header === 'updated_at') {
      sheet.getRange(rowNum, index + 1).setValue(now());
      return;
    }
    if (header === 'nome' && nome !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(nome);
    }
    if (header === 'preco' && preco !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(parseFloat(preco) || 0);
    }
    if (header === 'estoque' && estoque !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(parseInt(estoque) || 0);
    }
    if (header === 'estoqueMinimo' && estoqueMinimo !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(parseInt(estoqueMinimo) || 5);
    }
    if (header === 'descricao' && descricao !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(descricao);
    }
    if (header === 'icon' && icon !== undefined) {
      sheet.getRange(rowNum, index + 1).setValue(icon);
    }
    if (header === 'ativo') {
      if (ativo !== undefined) {
        sheet.getRange(rowNum, index + 1).setValue(ativo);
      } else if (status !== undefined) {
        sheet.getRange(rowNum, index + 1).setValue(status === 'ativo');
      }
    }
  });
  
  return { ok: true };
}

function excluirProduto(params) {
  const { id } = params;
  const sheet = getSheet(SHEETS.PRODUTOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Produto não encontrado' };
  
  // Soft delete - marca como inativo
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const ativoCol = headers.indexOf('ativo') + 1;
  const updatedCol = headers.indexOf('updated_at') + 1;
  
  if (ativoCol > 0) sheet.getRange(rowNum, ativoCol).setValue(false);
  if (updatedCol > 0) sheet.getRange(rowNum, updatedCol).setValue(now());
  
  return { ok: true };
}

function ajustarEstoque(params) {
  const { id, quantidade, tipo } = params;
  const sheet = getSheet(SHEETS.PRODUTOS);
  const rowNum = findRowById(sheet, id);
  
  if (rowNum === -1) return { ok: false, error: 'Produto não encontrado' };
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const estoqueCol = headers.indexOf('estoque') + 1;
  const updatedCol = headers.indexOf('updated_at') + 1;
  
  const estoqueAtual = parseInt(sheet.getRange(rowNum, estoqueCol).getValue()) || 0;
  let novoEstoque;
  
  if (tipo === 'adicionar') {
    novoEstoque = estoqueAtual + parseInt(quantidade);
  } else {
    novoEstoque = estoqueAtual - parseInt(quantidade);
    if (novoEstoque < 0) novoEstoque = 0;
  }
  
  sheet.getRange(rowNum, estoqueCol).setValue(novoEstoque);
  if (updatedCol > 0) sheet.getRange(rowNum, updatedCol).setValue(now());
  
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
      createdAt: row.created_at,
      lastEditedAt: row.updated_at,
      editHistory: row.editHistory || []
    });
  }
  
  return { ok: true, data: transacoes };
}

function criarTransacao(params) {
  const { type, description, value, date, paymentMethod, items, clientPhone, agendadorId } = params;
  const sheet = getSheet(SHEETS.TRANSACOES);
  const id = getNextId(sheet);
  const timestamp = now();
  
  const newRow = [
    id,
    type || 'income',
    description || '',
    parseFloat(value) || 0,
    date || new Date().toISOString().split('T')[0],
    paymentMethod || 'dinheiro',
    JSON.stringify(items || []),
    clientPhone || '',
    agendadorId || '',
    timestamp,
    timestamp,
    '[]'
  ];
  
  sheet.appendRow(newRow);
  
  // Ajustar estoque se houver produtos
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
    if (header === 'id' || header === 'created_at') return;
    if (header === 'updated_at') {
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

// ===== TAXAS DE CARTÃO =====

function getCardFees() {
  try {
    const props = PropertiesService.getScriptProperties();
    const stored = props.getProperty('cardFees');
    if (stored) {
      return { ok: true, fees: JSON.parse(stored) };
    }
  } catch (e) {}
  
  return {
    ok: true,
    fees: {
      debit: { visa: 0, mastercard: 0, elo: 0, amex: 0, hipercard: 0 },
      credit: { visa: 0, mastercard: 0, elo: 0, amex: 0, hipercard: 0 }
    }
  };
}

function setCardFees(params) {
  const { fees } = params;
  if (!fees) return { ok: false, error: 'Taxas obrigatórias' };
  
  try {
    const props = PropertiesService.getScriptProperties();
    props.setProperty('cardFees', JSON.stringify(fees));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.toString() };
  }
}
