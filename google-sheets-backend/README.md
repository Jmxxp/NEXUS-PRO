# NEXUS PRO - Google Sheets Backend

## 📋 Visão Geral

Este é o backend completo do sistema NEXUS PRO usando Google Apps Script + Google Sheets como banco de dados.

---

## 🗂️ Estrutura das Planilhas

### 1. **Agendadores** (Profissionais)
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | number | ID único |
| nome | string | Nome do profissional |
| senha | string | Senha para login |
| isAdmin | boolean | Se é administrador |
| bloqueado | boolean | Se agenda está bloqueada |
| almocoInicio | string | Horário início almoço (HH:MM) |
| almocoFim | string | Horário fim almoço (HH:MM) |
| criadoEm | datetime | Data/hora criação |
| atualizadoEm | datetime | Data/hora última atualização |

### 2. **Agendamentos** (Appointments)
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | number | ID único |
| date | string | Data (YYYY-MM-DD) |
| time | string | Hora (HH:MM) |
| client | string | Nome do cliente |
| phone | string | Telefone |
| servico | string | Nome do serviço |
| observacoes | string | Observações |
| agendadorId | number | ID do profissional |
| agendador | string | Nome do profissional |
| blocked | boolean | Se é bloqueio de horário |
| confirmado | boolean | Se está confirmado |
| criadoEm | datetime | Data/hora criação |
| atualizadoEm | datetime | Data/hora última atualização |

### 3. **Clientes**
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | number | ID único |
| nome | string | Nome completo |
| telefone | string | Telefone (com DDD) |
| cpf | string | CPF (XXX.XXX.XXX-XX) |
| aniversario | string | Data nascimento (YYYY-MM-DD) |
| notas | string | Anotações sobre o cliente |
| totalAgendamentos | number | Contador de agendamentos |
| criadoEm | datetime | Data/hora criação |
| atualizadoEm | datetime | Data/hora última atualização |

### 4. **Servicos**
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | number | ID único |
| nome | string | Nome do serviço |
| preco | number | Preço em R$ |
| duracao | number | Duração em minutos |
| descricao | string | Descrição |
| icon | string | Classe FontAwesome (ex: fa-cut) |
| ativo | boolean | Se está ativo |
| criadoEm | datetime | Data/hora criação |
| atualizadoEm | datetime | Data/hora última atualização |

### 5. **Produtos**
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | number | ID único |
| nome | string | Nome do produto |
| preco | number | Preço em R$ |
| estoque | number | Quantidade em estoque |
| estoqueMinimo | number | Quantidade mínima (alerta) |
| descricao | string | Descrição |
| icon | string | Classe FontAwesome (ex: fa-box) |
| ativo | boolean | Se está ativo |
| criadoEm | datetime | Data/hora criação |
| atualizadoEm | datetime | Data/hora última atualização |

### 6. **Transacoes** (Caixa/Financeiro)
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | number | ID único |
| type | string | 'income' ou 'expense' |
| description | string | Descrição da transação |
| value | number | Valor em R$ |
| date | string | Data (YYYY-MM-DD) |
| paymentMethod | string | 'dinheiro', 'pix', 'credito', 'debito', 'carne' |
| items | JSON | Array de itens vendidos |
| clientPhone | string | Telefone do cliente (opcional) |
| agendadorId | number | ID do profissional (opcional) |
| criadoEm | datetime | Data/hora criação |
| atualizadoEm | datetime | Data/hora última atualização |
| editHistory | JSON | Histórico de edições |

#### Estrutura do campo `items`:
```json
[
  {
    "type": "service",
    "id": 1,
    "name": "Corte Masculino",
    "price": 35.00,
    "quantity": 1,
    "icon": "fa-cut"
  },
  {
    "type": "product",
    "id": 2,
    "name": "Pomada",
    "price": 45.00,
    "quantity": 1,
    "icon": "fa-box"
  }
]
```

### 7. **Configuracoes**
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| chave | string | Nome da configuração |
| valor | string/JSON | Valor (pode ser JSON) |
| atualizadoEm | datetime | Data/hora última atualização |

#### Configurações padrão:
- `horarios` - Horários de funcionamento por dia da semana
- `taxas_cartao` - Taxas de crédito/débito por bandeira
- `birthday_message` - Mensagem de aniversário

---

## 🚀 Instalação

### Passo 1: Criar a Planilha
1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha vazia
3. Copie o ID da planilha da URL:
   ```
   https://docs.google.com/spreadsheets/d/ESTE_É_O_ID/edit
   ```

### Passo 2: Criar o Script
1. Acesse [Google Apps Script](https://script.google.com)
2. Clique em **Novo Projeto**
3. Substitua todo o código por `Code.gs` desta pasta
4. Substitua `SEU_SPREADSHEET_ID_AQUI` pelo ID da sua planilha
5. Salve (Ctrl+S)

### Passo 3: Executar Setup Inicial
1. No menu, vá em **Executar > setupInicial**
2. Autorize as permissões quando solicitado
3. Execute também **criarAgendadorAdmin** para criar o primeiro usuário

### Passo 4: Implantar como Web App
1. Vá em **Implantar > Nova implantação**
2. Selecione tipo: **Aplicativo da Web**
3. Configure:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
4. Clique em **Implantar**
5. Copie a URL do Web App

### Passo 5: Configurar no NEXUS PRO
1. Abra o NEXUS PRO no navegador
2. Cole a URL do Web App no campo de conexão
3. Faça login com:
   - Usuário: **Admin**
   - Senha: **1234**

---

## 📡 API - Endpoints

### Conexão
| Action | Parâmetros | Descrição |
|--------|------------|-----------|
| `ping` | - | Testa conexão, retorna agendadores e horários |
| `auth` | id, senha | Autentica usuário |

### Agendadores
| Action | Parâmetros | Descrição |
|--------|------------|-----------|
| `agendadores` | - | Lista todos os profissionais |
| `getAgendadorConfig` | agendadorId | Obtém configurações do profissional |
| `setAgendadorConfig` | agendadorId, bloqueado, almocoInicio, almocoFim | Atualiza configurações |

### Agendamentos
| Action | Parâmetros | Descrição |
|--------|------------|-----------|
| `list` | date?, agendadorId?, dateStart?, dateEnd? | Lista agendamentos |
| `create` | date, time, client, phone, servico, observacoes, agendadorId, agendador, blocked?, confirmado? | Cria agendamento |
| `update` | id, ...campos | Atualiza agendamento |
| `delete` | id | Exclui agendamento |
| `disponibilidade` | date, agendadorId | Verifica horários ocupados |

### Clientes
| Action | Parâmetros | Descrição |
|--------|------------|-----------|
| `listarClientes` | - | Lista todos os clientes |
| `buscarCliente` | termo | Busca por nome ou telefone |
| `cadastrarCliente` | nome, telefone, cpf?, aniversario?, notas? | Cadastra cliente |
| `atualizarCliente` | id, nome?, telefone?, cpf?, aniversario?, notas?, totalAgendamentos? | Atualiza cliente |
| `excluirCliente` | id | Exclui cliente |

### Serviços
| Action | Parâmetros | Descrição |
|--------|------------|-----------|
| `listarServicos` | - | Lista serviços ativos |
| `criarServico` | nome, preco, duracao, descricao?, icon? | Cria serviço |
| `atualizarServico` | id, nome?, preco?, duracao?, descricao?, icon? | Atualiza serviço |
| `excluirServico` | id | Desativa serviço (soft delete) |

### Produtos
| Action | Parâmetros | Descrição |
|--------|------------|-----------|
| `listarProdutos` | - | Lista produtos ativos |
| `criarProduto` | nome, preco, estoque, estoqueMinimo?, descricao?, icon? | Cria produto |
| `atualizarProduto` | id, nome?, preco?, estoque?, estoqueMinimo?, descricao?, icon? | Atualiza produto |
| `excluirProduto` | id | Desativa produto (soft delete) |
| `ajustarEstoque` | id, quantidade, tipo ('adicionar'/'remover') | Ajusta estoque |

### Transações
| Action | Parâmetros | Descrição |
|--------|------------|-----------|
| `listarTransacoes` | dataInicio?, dataFim?, type?, paymentMethod? | Lista transações |
| `criarTransacao` | type, description, value, date, paymentMethod, items?, clientPhone?, agendadorId? | Cria transação |
| `atualizarTransacao` | id, type?, description?, value?, date?, paymentMethod?, items?, editHistory? | Atualiza transação |
| `excluirTransacao` | id | Exclui transação |

### Configurações
| Action | Parâmetros | Descrição |
|--------|------------|-----------|
| `getConfig` | chave | Obtém configuração |
| `setConfig` | chave, valor | Define configuração |
| `getAllConfigs` | - | Lista todas as configurações |
| `getTaxasCartao` | - | Obtém taxas de cartão |
| `setTaxasCartao` | taxas | Define taxas de cartão |

---

## 📝 Exemplos de Uso

### Exemplo: Criar transação via fetch
```javascript
const response = await fetch(BACKEND_URL, {
  method: 'POST',
  body: JSON.stringify({
    action: 'criarTransacao',
    type: 'income',
    description: 'Corte + Barba',
    value: 55.00,
    date: '2025-01-15',
    paymentMethod: 'pix',
    items: [
      { type: 'service', id: 1, name: 'Corte', price: 35, quantity: 1 },
      { type: 'service', id: 2, name: 'Barba', price: 20, quantity: 1 }
    ]
  })
});

const result = await response.json();
// { ok: true, id: 123 }
```

### Exemplo: Listar transações do mês
```javascript
const response = await fetch(BACKEND_URL, {
  method: 'POST',
  body: JSON.stringify({
    action: 'listarTransacoes',
    dataInicio: '2025-01-01',
    dataFim: '2025-01-31'
  })
});

const result = await response.json();
// { ok: true, data: [...] }
```

---

## ⚠️ Notas Importantes

1. **Limite do Google Sheets**: ~10 milhões de células por planilha
2. **Limite de requisições**: ~20.000/dia no plano gratuito
3. **Tempo de resposta**: ~500ms-2s devido à natureza do Apps Script
4. **Backup automático**: Google Sheets tem histórico de versões

---

## 🔄 Migração de Dados Locais

Para migrar dados que estavam em localStorage para o backend:

1. Exporte backup local no NEXUS PRO (tela Backup)
2. Use a função `importarDadosLocais` no script (a ser implementada)
3. Ou importe manualmente via planilha

---

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs em **Execuções** no Apps Script
2. Teste individualmente cada função
3. Verifique permissões da planilha
