# ✅ Checklist de Implementação - NEXUS PRO Backend Completo

## 📋 Pré-requisitos

- [ ] Conta Google (para Google Sheets e Apps Script)
- [ ] NEXUS PRO Web funcionando localmente
- [ ] Acesso ao código fonte (app.js)

---

## 🚀 Fase 1: Configurar Backend

### 1.1 Criar Planilha Google Sheets
- [ ] Acessar [sheets.google.com](https://sheets.google.com)
- [ ] Criar nova planilha em branco
- [ ] Renomear para "NEXUS PRO Database"
- [ ] Copiar ID da planilha da URL

### 1.2 Criar Projeto Google Apps Script
- [ ] Acessar [script.google.com](https://script.google.com)
- [ ] Clicar em "Novo Projeto"
- [ ] Renomear para "NEXUS PRO Backend"
- [ ] Excluir código existente
- [ ] Colar conteúdo de `Code.gs`
- [ ] Substituir `SEU_SPREADSHEET_ID_AQUI` pelo ID copiado
- [ ] Salvar (Ctrl+S)

### 1.3 Executar Setup Inicial
- [ ] No menu: Executar > setupInicial
- [ ] Autorizar permissões
- [ ] Verificar se as 7 abas foram criadas na planilha
- [ ] Executar: Executar > criarAgendadorAdmin

### 1.4 Implantar Web App
- [ ] Implantar > Nova implantação
- [ ] Tipo: Aplicativo da Web
- [ ] Executar como: Eu
- [ ] Acesso: Qualquer pessoa
- [ ] Implantar
- [ ] Copiar URL do Web App

### 1.5 Testar Conexão
- [ ] Abrir NEXUS PRO
- [ ] Colar URL do Web App
- [ ] Verificar se conecta
- [ ] Login: Admin / 1234
- [ ] Verificar se lista carrega

---

## 🔧 Fase 2: Atualizar Frontend (app.js)

### 2.1 Atualizar Objeto DB
- [ ] Localizar objeto `const DB = {` no app.js
- [ ] Adicionar novos métodos (usar INTEGRACAO_FRONTEND.js como referência):
  - [ ] `listarServicos()`
  - [ ] `criarServico(data)`
  - [ ] `atualizarServico(data)`
  - [ ] `excluirServico(id)`
  - [ ] `listarProdutos()`
  - [ ] `criarProduto(data)`
  - [ ] `atualizarProduto(data)`
  - [ ] `excluirProduto(id)`
  - [ ] `ajustarEstoque(id, quantidade, tipo)`
  - [ ] `listarTransacoes(filtros)`
  - [ ] `criarTransacao(data)`
  - [ ] `atualizarTransacao(data)`
  - [ ] `excluirTransacao(id)`
  - [ ] `getTaxasCartao()`
  - [ ] `setTaxasCartao(taxas)`

### 2.2 Modificar Funções de Serviços
- [ ] `loadServices()` - adicionar chamada ao backend
- [ ] `saveService()` - salvar no backend
- [ ] `deleteService()` - excluir no backend

### 2.3 Modificar Funções de Produtos
- [ ] `loadProducts()` - adicionar chamada ao backend
- [ ] `saveProduct()` - salvar no backend
- [ ] `deleteProduct()` - excluir no backend
- [ ] Decrementar estoque ao vender

### 2.4 Modificar Funções de Transações
- [ ] `loadTransactions()` - adicionar chamada ao backend
- [ ] `addTransaction()` - salvar no backend
- [ ] `updateTransaction()` - atualizar no backend
- [ ] `deleteTransaction()` - excluir no backend

### 2.5 Modificar Funções de Taxas
- [ ] `loadCardFees()` - carregar do backend
- [ ] `saveCardFees()` - salvar no backend

### 2.6 Sincronização no Login
- [ ] Modificar `handleConnect()` para:
  - [ ] Carregar serviços do backend
  - [ ] Carregar produtos do backend
  - [ ] Carregar transações recentes
  - [ ] Carregar taxas de cartão

---

## 📤 Fase 3: Migração de Dados

### 3.1 Exportar Dados Locais
- [ ] Na tela Backup > Exportar backup local
- [ ] Salvar arquivo JSON como referência

### 3.2 Migrar para Backend
- [ ] Implementar função `migrarDadosLocaisParaBackend()`
- [ ] Executar migração
- [ ] Verificar dados na planilha

### 3.3 Validar Migração
- [ ] Verificar serviços na aba Servicos
- [ ] Verificar produtos na aba Produtos
- [ ] Verificar transações na aba Transacoes

---

## 🧪 Fase 4: Testes

### 4.1 Testar Serviços
- [ ] Criar novo serviço
- [ ] Editar serviço
- [ ] Excluir serviço
- [ ] Verificar na planilha

### 4.2 Testar Produtos
- [ ] Criar novo produto
- [ ] Editar produto
- [ ] Vender produto (verificar estoque)
- [ ] Excluir produto

### 4.3 Testar Transações
- [ ] Criar venda (income)
- [ ] Criar despesa (expense)
- [ ] Editar transação
- [ ] Verificar histórico de edição
- [ ] Excluir transação

### 4.4 Testar Sincronização
- [ ] Fazer alteração na planilha diretamente
- [ ] Recarregar app
- [ ] Verificar se dados atualizaram

### 4.5 Testar Offline
- [ ] Desconectar internet
- [ ] Verificar se app usa cache local
- [ ] Reconectar
- [ ] Verificar sincronização

---

## 🔐 Fase 5: Segurança (Opcional)

### 5.1 Proteger Planilha
- [ ] Compartilhar planilha apenas com você
- [ ] Não compartilhar publicamente

### 5.2 Proteger Script
- [ ] Não expor credenciais no código
- [ ] Considerar autenticação adicional

### 5.3 Backup
- [ ] Configurar backup automático da planilha
- [ ] Testar restauração

---

## 📊 Resumo das Planilhas

| Aba | Status | Prioridade |
|-----|--------|------------|
| Agendadores | ✅ Já existe | - |
| Agendamentos | ✅ Já existe | - |
| Clientes | ✅ Já existe | - |
| Servicos | 🆕 Nova | Alta |
| Produtos | 🆕 Nova | Alta |
| Transacoes | 🆕 Nova | Alta |
| Configuracoes | 🆕 Nova | Média |

---

## 📞 Problemas Comuns

### Erro: "Permissão negada"
- Verifique se a planilha está acessível
- Verifique se o script tem permissões

### Erro: "Planilha não encontrada"
- Verifique o ID da planilha no Code.gs
- Execute setupInicial novamente

### Erro: "Ação desconhecida"
- Verifique se reimplantou após modificar o código
- Verifique se está usando a URL correta

### Dados não aparecem
- Verifique se as abas têm cabeçalhos corretos
- Verifique logs em Execuções no Apps Script

---

## ✨ Conclusão

Após completar todas as fases:
- Serviços, Produtos e Transações estarão no Google Sheets
- Dados sincronizados entre dispositivos
- Backup automático pelo Google
- App funciona offline com cache local
