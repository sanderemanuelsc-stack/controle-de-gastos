# 💰 Controle de Gastos

Aplicação web para registrar receitas e despesas, acompanhar o saldo e visualizar para onde o dinheiro está indo. Feita com **HTML, CSS e JavaScript puro**.

## Funcionalidades
- Cadastro de receitas e despesas com categoria e data
- Resumo automático: total de receitas, despesas e saldo
- Gráfico de barras de despesas por categoria (feito só com CSS)
- Histórico ordenado por data, com filtro por tipo
- Exportação do histórico em **CSV** (abre no Excel)
- Dados salvos no navegador (`localStorage`)

## O que pratiquei
- Métodos de array: `filter`, `reduce`, `sort`, `forEach`
- Formatação de moeda com `Intl` / `toLocaleString("pt-BR")`
- Manipulação de datas (com atenção ao fuso horário)
- Geração e download de arquivo com `Blob`
- Layout responsivo com CSS Grid
- Segurança básica: dados do usuário inseridos com `textContent`

## Como usar
Abra o `index.html` no navegador ou acesse a versão online:
`https://SEU-USUARIO.github.io/controle-de-gastos/`

## Estrutura
```
├── index.html
├── style.css
└── script.js
```

## Próximas melhorias
- [ ] Filtro por mês
- [ ] Meta de gastos por categoria
- [ ] Editar transações
- [ ] Gráfico de pizza
