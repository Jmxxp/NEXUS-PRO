# Frontend Structure (NEXUS WEB 3)

Organizacao aplicada para facilitar manutencao e evolucao do app.

## HTML

- `index.html`: estrutura das telas, cards e modais.

## CSS

- `css/styles.css`: manifesto de imports CSS.
- `css/base/core.css`: variaveis, reset, base visual, login e home base.
- `css/layout/shell-calendar-clients.css`: layout principal, sidebar, agenda e clientes.
- `css/screens/modals-forms-services.css`: modais, formularios, servicos/produtos e blocos relacionados.
- `css/screens/cashier.css`: tela de caixa e componentes financeiros da operacao.
- `css/screens/ai-chat.css`: FAB e modal de chat IA.
- `css/screens/responsive-overrides.css`: ajustes responsivos e overrides finais.

## JavaScript

- `js/modules/00-core.js`: i18n, estado global, API DB e storage.
- `js/modules/10-init-auth-navigation.js`: boot, login, conexao, navegacao e base da app shell.
- `js/modules/20-home-calendar-appointments.js`: home, calendario, agendamentos e modal de agendamento.
- `js/modules/30-clients-stats.js`: clientes e estatisticas principais.
- `js/modules/40-config-modals-services.js`: configuracoes, modais globais e servicos/produtos.
- `js/modules/50-backup-ai.js`: backup/cartoes/chat IA/importacao.
- `js/modules/60-cashier.js`: modulo de caixa e movimentacoes.
- `js/modules/70-financial-and-final.js`: estatisticas financeiras e finalizadores.

## Compatibilidade

- `js/app.js`: loader legado (compatibilidade).
- `js/legacy/app.monolith.js`: snapshot do arquivo unico antigo.

## Regras de manutencao

1. Edite a feature no modulo correto.
2. Evite adicionar novas regras em `js/app.js`.
3. Mantenha `css/styles.css` somente como manifesto.
4. Para novos blocos grandes, prefira criar arquivo novo em `css/screens/` ou `js/modules/`.
