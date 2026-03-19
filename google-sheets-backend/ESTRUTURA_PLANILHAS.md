# Estrutura das Planilhas - NEXUS PRO

Este documento mostra a estrutura visual de cada aba da planilha Google Sheets.

---

## 📊 Aba: Agendadores

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| **id** | **nome** | **senha** | **isAdmin** | **bloqueado** | **almocoInicio** | **almocoFim** | **criadoEm** | **atualizadoEm** |
| 1 | Admin | 1234 | TRUE | FALSE | 12:00 | 13:00 | 2025-01-01T10:00:00Z | 2025-01-01T10:00:00Z |
| 2 | João | 1111 | FALSE | FALSE | 12:00 | 13:00 | 2025-01-01T10:00:00Z | 2025-01-01T10:00:00Z |
| 3 | Maria | 2222 | FALSE | FALSE | 13:00 | 14:00 | 2025-01-01T10:00:00Z | 2025-01-01T10:00:00Z |

---

## 📊 Aba: Agendamentos

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **id** | **date** | **time** | **client** | **phone** | **servico** | **observacoes** | **agendadorId** | **agendador** | **blocked** | **confirmado** | **criadoEm** | **atualizadoEm** |
| 1 | 2025-01-15 | 10:00 | Carlos Silva | 5511999998888 | Corte Masculino | Cliente VIP | 1 | Admin | FALSE | TRUE | 2025-01-14T15:00:00Z | 2025-01-14T15:00:00Z |
| 2 | 2025-01-15 | 11:00 | | | BLOQUEIO | Almoço | 1 | Admin | TRUE | FALSE | 2025-01-14T15:00:00Z | 2025-01-14T15:00:00Z |

---

## 📊 Aba: Clientes

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| **id** | **nome** | **telefone** | **cpf** | **aniversario** | **notas** | **totalAgendamentos** | **criadoEm** | **atualizadoEm** |
| 1 | Carlos Silva | 5511999998888 | 123.456.789-00 | 1985-05-20 | Cliente VIP, prefere corte curto | 15 | 2025-01-01T10:00:00Z | 2025-01-15T10:00:00Z |
| 2 | Ana Santos | 5511988887777 | 987.654.321-00 | 1990-12-10 | | 8 | 2025-01-02T14:00:00Z | 2025-01-10T16:00:00Z |

---

## 📊 Aba: Servicos

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| **id** | **nome** | **preco** | **duracao** | **descricao** | **icon** | **ativo** | **criadoEm** | **atualizadoEm** |
| 1 | Corte Masculino | 35 | 30 | Corte simples masculino | fa-cut | TRUE | 2025-01-01T10:00:00Z | 2025-01-01T10:00:00Z |
| 2 | Barba | 20 | 20 | Barba completa | fa-razor | TRUE | 2025-01-01T10:00:00Z | 2025-01-01T10:00:00Z |
| 3 | Corte + Barba | 50 | 50 | Combo corte e barba | fa-scissors | TRUE | 2025-01-01T10:00:00Z | 2025-01-01T10:00:00Z |
| 4 | Hidratação | 40 | 40 | Hidratação capilar | fa-tint | TRUE | 2025-01-01T10:00:00Z | 2025-01-01T10:00:00Z |
| 5 | Progressiva | 150 | 120 | Escova progressiva | fa-magic | TRUE | 2025-01-01T10:00:00Z | 2025-01-01T10:00:00Z |

---

## 📊 Aba: Produtos

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| **id** | **nome** | **preco** | **estoque** | **estoqueMinimo** | **descricao** | **icon** | **ativo** | **criadoEm** | **atualizadoEm** |
| 1 | Pomada Modeladora | 45 | 15 | 5 | Pomada efeito matte | fa-jar | TRUE | 2025-01-01T10:00:00Z | 2025-01-01T10:00:00Z |
| 2 | Gel Fixador | 25 | 20 | 5 | Gel fixação forte | fa-flask | TRUE | 2025-01-01T10:00:00Z | 2025-01-01T10:00:00Z |
| 3 | Shampoo | 35 | 10 | 3 | Shampoo anticaspa | fa-pump-soap | TRUE | 2025-01-01T10:00:00Z | 2025-01-01T10:00:00Z |
| 4 | Óleo de Barba | 55 | 8 | 3 | Óleo hidratante | fa-oil-can | TRUE | 2025-01-01T10:00:00Z | 2025-01-01T10:00:00Z |

---

## 📊 Aba: Transacoes

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **id** | **type** | **description** | **value** | **date** | **paymentMethod** | **items** | **clientPhone** | **agendadorId** | **criadoEm** | **atualizadoEm** | **editHistory** |
| 1 | income | Corte Masculino | 35 | 2025-01-15 | pix | [{"type":"service","id":1,"name":"Corte Masculino","price":35,"quantity":1}] | 5511999998888 | 1 | 2025-01-15T10:30:00Z | 2025-01-15T10:30:00Z | [] |
| 2 | income | Corte + Pomada | 80 | 2025-01-15 | credito | [{"type":"service","id":1,"name":"Corte","price":35,"quantity":1},{"type":"product","id":1,"name":"Pomada","price":45,"quantity":1}] | 5511988887777 | 1 | 2025-01-15T11:00:00Z | 2025-01-15T11:00:00Z | [] |
| 3 | expense | Compra de produtos | 500 | 2025-01-15 | pix | [] | | | 2025-01-15T14:00:00Z | 2025-01-15T14:00:00Z | [] |

---

## 📊 Aba: Configuracoes

| A | B | C |
|---|---|---|
| **chave** | **valor** | **atualizadoEm** |
| horarios | {"domingo":{"abre":"00:00","fecha":"00:00"},"segunda":{"abre":"08:00","fecha":"18:00"},"terca":{"abre":"08:00","fecha":"18:00"},"quarta":{"abre":"08:00","fecha":"18:00"},"quinta":{"abre":"08:00","fecha":"18:00"},"sexta":{"abre":"08:00","fecha":"18:00"},"sabado":{"abre":"08:00","fecha":"14:00"}} | 2025-01-01T10:00:00Z |
| taxas_cartao | {"credito":{"visa":3.5,"mastercard":3.5,"elo":4,"amex":4.5,"hipercard":4},"debito":{"visa":2,"mastercard":2,"elo":2.5,"amex":2.5,"hipercard":2.5}} | 2025-01-01T10:00:00Z |
| birthday_message | Olá {nome}! 🎂 Feliz aniversário! Temos uma surpresa especial esperando você! | 2025-01-01T10:00:00Z |

---

## 🎨 Formatação Recomendada

### Cabeçalhos
- **Negrito**
- Cor de fundo: `#4a4a4a` (cinza escuro)
- Cor do texto: `#ffffff` (branco)
- Congelar primeira linha

### Colunas de Data/Hora
- Formato: `dd/mm/yyyy` ou `yyyy-mm-dd`
- Largura: 100px

### Colunas de Valor (R$)
- Formato: Número com 2 casas decimais
- Largura: 80px

### Colunas JSON
- Largura: 200-300px
- Quebra de texto desativada

---

## 💡 Dicas

1. **Validação de dados**: Use validação do Sheets para campos como `type` (income/expense)
2. **Cores condicionais**: Configure para destacar estoque baixo em vermelho
3. **Filtros**: Ative filtros nos cabeçalhos para facilitar busca
4. **Proteção**: Proteja a linha de cabeçalhos contra edição acidental
