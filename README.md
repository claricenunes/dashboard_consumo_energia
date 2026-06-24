# ⚡ Smart Grid — Dashboard de Consumo de Energia

Trabalho acadêmico — Dashboard para monitoramento de eficiência energética em setores industriais, construído com **Angular 21** e **TypeScript**.

---

## Sobre o projeto

Sistema de monitoramento do consumo de energia elétrica por setor industrial. Permite cadastrar setores com metas de consumo e operadores vinculados a cada setor, exibindo alertas visuais quando o consumo ultrapassa a meta estabelecida.

---

## Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| Angular 21 | Framework principal (componentes standalone) |
| TypeScript | Tipagem estática e interfaces de dados |
| Angular HttpClient | Consumo da API REST |
| Angular Router | Navegação entre páginas |
| json-server | API REST mock (simula back-end) |
| Bootstrap 5 | Estilização e layout responsivo |
| Chart.js | Gráfico de barras (consumo vs meta) |

---

## Funcionalidades

### Recurso 1 — Setores
- Cadastro, edição e exclusão de setores
- Campos: **nome**, **categoria**, **consumo_meta** (kWh), **consumo_atual** (kWh)
- Cards com cor dinâmica:
  - 🟢 **Verde** — consumo dentro da meta
  - 🟡 **Laranja** — consumo levemente acima da meta (até 10%)
  - 🔴 **Vermelho** — consumo acima da meta (mais de 10%)

### Recurso 2 — Operadores
- Cadastro, edição e exclusão de operadores
- Campos: **nome**, **matrícula**, **turno** (Manhã / Tarde / Noite), **setor**
- Formulário com `<select>` usando `<optgroup>` para agrupar setores por categoria

### Dashboard
- Cards de métricas: consumo total, setores monitorados, setores acima da meta, total de operadores
- Gráfico de barras: consumo atual vs meta por setor
- Cards de status de cada setor com indicador visual

---

## Estrutura do projeto

```
src/
└── app/
    ├── models/
    │   ├── setor.model.ts          # Interface TypeScript — Setor
    │   └── operador.model.ts       # Interface TypeScript — Operador
    ├── services/
    │   ├── setor.service.ts        # HttpClient → /setores
    │   └── operador.service.ts     # HttpClient → /operadores
    ├── components/
    │   └── navbar/                 # Barra de navegação
    ├── pages/
    │   ├── dashboard/              # Página inicial com métricas e gráfico
    │   ├── setores/                # CRUD de setores
    │   └── operadores/             # CRUD de operadores
    ├── app.routes.ts               # Configuração de rotas
    ├── app.config.ts               # Providers (Router, HttpClient)
    └── app.component.ts            # Componente raiz
db.json                             # Banco de dados da API mock
```

---

## Como executar

### Pré-requisitos
- Node.js 18+
- npm

### Instalação

```bash
npm install
```

### Executar o projeto

```bash
npm run dev
```

Inicia a API e a aplicação Angular simultaneamente em um único terminal.

- API disponível em `http://localhost:3000`
- Aplicação disponível em `http://localhost:4200`

Endpoints disponíveis:
- `GET/POST` → `http://localhost:3000/setores`
- `GET/PUT/DELETE` → `http://localhost:3000/setores/:id`
- `GET/POST` → `http://localhost:3000/operadores`
- `GET/PUT/DELETE` → `http://localhost:3000/operadores/:id`

---

## Rotas da aplicação

| Rota | Página |
|---|---|
| `/` | Dashboard (métricas e gráfico) |
| `/setores` | Gerenciamento de setores |
| `/operadores` | Gerenciamento de operadores |

---

## Dados iniciais (db.json)

O arquivo `db.json` contém dados de exemplo com os setores **Usinagem**, **Montagem** e **ADM** (conforme enunciado), além de operadores cadastrados. Esses dados são carregados automaticamente pelo json-server.

---

## Checklist do enunciado

- [x] **Recurso 1 — Setores:** campos `nome`, `consumo_meta`, `consumo_atual`
- [x] **Dinamismo:** card fica laranja/vermelho quando `consumo_atual > consumo_meta`
- [x] **Recurso 2 — Operadores:** campos `setorId`, `nome`, `turno`, `matricula`
- [x] **Destaque:** formulário de operador usa `<select>` com `<optgroup>` agrupado por categoria
- [x] **Service:** `SetorService` e `OperadorService` usando `HttpClient`
- [x] **Modelagem:** interfaces TypeScript em `setor.model.ts` e `operador.model.ts`
- [x] **Componentes:** cards, gráfico de barras e tabelas
- [x] **Navegação:** roteamento Angular com 3 páginas distintas
