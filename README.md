<h1 align="center">NutriPlan</h1>

<p align="center">
	Aplicação para nutricionistas montarem planos alimentares com mais agilidade, organização e exportação em PDF.
</p>

<p align="center">
	<a href="#-visao-geral">Visão geral</a> •
	<a href="#-funcionalidades">Funcionalidades</a> •
	<a href="#-tecnologias">Tecnologias</a> •
	<a href="#-estrutura-de-pastas">Pastas</a> •
	<a href="#instalacao">Instalação</a> •
	<a href="#-scripts-disponiveis">Scripts</a> •
	<a href="#-testes">Testes</a> •
</p>

<p align="center">
	<!-- Sugestões de badges:
	<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
	<img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
	<img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
	<img src="https://img.shields.io/badge/Vitest-Tests-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
	<img src="https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions" />
	<img src="https://img.shields.io/badge/SonarQube-Quality%20Gate-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white" alt="SonarQube" />
	<img src="https://img.shields.io/badge/Vercel-Production%20Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
	-->
</p>

---

## 📌 Visao Geral
NutriPlan foi pensado para deixar a criação de planos alimentares mais prática no dia a dia. A ideia aqui é seguir um fluxo simples: preencher os dados do profissional, cadastrar o paciente, montar as refeições, revisar tudo e baixar o PDF no final.

A aplicação funciona em um formulário dividido em 4 etapas (wizard), então todo o processo acontece de forma guiada e sem precisar navegar por várias páginas. Os dados ficam salvos no `localStorage`, o que ajuda bastante a continuar o preenchimento e reaproveitar as informações do profissional para novos pacientes.

---
## ✨ Funcionalidades

- Cadastro dos dados do profissional com nome, CRN e upload de logo.
- Cadastro do paciente com nome, idade, peso, objetivo e observações.
- Montagem do plano alimentar por refeições.
- Inclusão de vários alimentos em cada refeição.
- Edição, visualização e exclusão de refeições.
- Validação de formulário com mensagens claras.
- Salvamento local do andamento do wizard no navegador.
- Pré-visualização do PDF antes do download.
- Exportação do plano alimentar em PDF.
- Novo plano com reaproveitamento dos dados do profissional.
- Alternância de tema com suporte a `light`, `dark` e `system`.

---

## 🧰 Tecnologias

### Base da aplicação

- React 19
- TypeScript
- Vite

### UI e estilização

- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Lucide React
- Montserrat Variable
- Sonner

### Formulários e validação

- React Hook Form
- Zod
- `@hookform/resolvers`
- Maskito

### PDF

- `@react-pdf/renderer`

### Testes

- Vitest
- Testing Library
- JSDOM
- Coverage com provider `v8`

### CI/CD e qualidade

- GitHub Actions
- SonarQube
- Vercel

### Utilitários usados

- `clsx`
- `class-variance-authority`
- `tailwind-merge`

> Bibliotecas como `html2canvas`, `html2pdf.js` e `jspdf` aparecem nas dependências, mas hoje a geração do PDF está sendo feita com `@react-pdf/renderer`.

---

## 🏗️ Arquitetura Frontend

### Visão geral

A base da aplicação gira em torno da feature `wizard`, que concentra o fluxo principal. A troca de etapa acontece localmente, sem rotas.

### Estado global

O estado compartilhado fica em um contexto React (`WizardProvider`) usando o hook `useWizard`. É ele que controla:

- etapa atual do fluxo;
- dados do profissional;
- dados do paciente;
- dieta com lista de refeições.

### Persistência

Os dados ficam salvos no `localStorage` com a chave `diet_wizard`. Também existe uma rotina simples de migração para limpar dados antigos quando a versão muda.

### Geração de PDF

O PDF nasce a partir dos dados do wizard e passa por uma camada de mapeamento antes da exportação. Hoje a aplicação tem:

- um componente de pré-visualização HTML;
- um componente PDF com `@react-pdf/renderer`;
- um hook dedicado ao download do arquivo.

### Organização visual

A interface usa componentes base em `src/components/ui`, tema com CSS variables, cards, stepper e modais. O visual segue uma linha escura, com destaque em tons de verde/teal.

---

## 📁 Estrutura de Pastas

```text
src/
	components/
		ui/                  # Componentes de interface reutilizáveis
		delete-modal.tsx     # Modal de confirmação de exclusão
		header.tsx           # Cabeçalho da aplicação
		theme-provider.tsx   # Gerenciamento de tema
	features/
		wizard/
			components/        # Componentes do fluxo e PDF
			context/           # Context API do wizard
			hooks/             # Hooks do fluxo e exportação
			schemas/           # Schemas Zod de validação
			steps/             # Etapas do wizard
			stores/            # Tipos e estado base do fluxo
			types/             # Tipagens e enums de domínio
			utils/             # Utilitários da feature
	lib/
		masks.ts             # Máscaras e restrições de entrada
		utils.ts             # Utilitários genéricos
	tests/
		setup.ts             # Setup dos testes
	App.tsx                # Composição principal da interface
	main.tsx               # Bootstrap da aplicação
	storage-migration.ts   # Migração de armazenamento local
```

---

<h2 id="instalacao">⚙️ Instalacao</h2>

### Pre-requisitos

- Node.js instalado
- `pnpm` recomendado

### Instalar dependencias

```bash
pnpm install
```

Se preferir, também é possível usar outro gerenciador compatível com o `package.json`, mas o projeto possui `pnpm-lock.yaml` versionado.

---

## 🔧 Configuracao

Hoje não existe arquivo `.env` para a aplicação frontend.

Alguns pontos importantes de configuração:

- alias `@` apontando para `src` no Vite;
- Tailwind CSS v4 configurado por `src/index.css`;
- testes configurados no `vite.config.ts`;
- componentes `shadcn/ui` configurados em `components.json`.

### Secrets do repositório

Os workflows usam estes secrets:

- `SONAR_HOST_URL`;
- `SONAR_TOKEN`;
- `VERCEL_TOKEN`.

---

## 🚀 Execucao Local

```bash
pnpm dev
```

Por padrão, a aplicação será servida pelo Vite em ambiente de desenvolvimento local.

Depois disso, é só abrir a URL mostrada no terminal.

---

## 📜 Scripts Disponiveis

| Script | Descrição |
| --- | --- |
| `pnpm dev` | Inicia o servidor de desenvolvimento com Vite |
| `pnpm build` | Executa o TypeScript build e gera a versão de produção |
| `pnpm preview` | Faz o preview local da build gerada |
| `pnpm lint` | Executa o ESLint no projeto |
| `pnpm format` | Formata arquivos `ts` e `tsx` com Prettier |
| `pnpm typecheck` | Executa checagem de tipos com TypeScript |
| `pnpm test` | Inicia o Vitest em modo interativo |
| `pnpm test:run` | Executa a suíte de testes uma vez |
| `pnpm test:coverage` | Gera cobertura de testes |

---

## 🔄 Fluxo do Sistema

O fluxo principal segue esta ordem:

1. Perfil profissional
2. Dados do paciente
3. Elaboração da dieta
4. Exportação

### Resumo operacional

1. O nutricionista informa nome, CRN e logo.
2. O paciente é cadastrado com dados básicos e objetivo.
3. O plano alimentar é montado adicionando refeições e alimentos.
4. O sistema exibe um resumo e a prévia do documento.
5. O plano é exportado em PDF.
6. O usuário pode iniciar um novo plano mantendo os dados do profissional.

---

## 📄 Geracao de PDF

A geração de PDF já faz parte do fluxo principal da aplicação.

### Como funciona

- Mapeamento dos dados do wizard para uma estrutura própria de exportação.
- Validação prévia antes de permitir o download.
- Componente de pré-visualização HTML para revisão visual.
- Documento final gerado com `@react-pdf/renderer`.
- Download do arquivo por criação de `Blob` no navegador.

### Conteúdo exportado

- dados do profissional;
- CRN;
- logo, quando informada;
- dados do paciente;
- objetivo do plano;
- observações clínicas;
- lista de refeições e alimentos;
- data de emissão.

---

## 📱 Responsividade

O layout já usa utilitários e estruturas que ajudam bastante na adaptação entre tamanhos de tela, como:

- containers com largura máxima controlada;
- grids para cards de resumo;
- áreas com `overflow-y-auto` para conteúdo extenso;
- componentes de formulário baseados em layout fluido.

Não existe uma documentação específica sobre breakpoints, mas a interface já segue uma base responsiva com Tailwind.

---

## 🧪 Testes

Há testes automatizados cobrindo componentes, hooks, schemas, utilitários e partes do fluxo principal.

### Ferramentas identificadas

- Vitest
- Testing Library
- JSDOM

### Cobertura

O `vite.config.ts` define cobertura mínima de 80% para:

- linhas;
- branches;
- funções;
- statements.

### Execução em CI

O workflow `CI — Build & SonarQube` roda em `push` para `main` e também em `pull_request`. Nele entram:

- instalação de dependências com `pnpm`;
- build de produção;
- execução dos testes com cobertura;
- análise SonarQube com espera pelo quality gate.

Para executar:

```bash
pnpm test:run
pnpm test:coverage
```

---

## 📦 Build e Deploy

### Build

A build de produção roda com:

```bash
pnpm build
```

Esse script executa `tsc -b` e depois `vite build`.

### CI

O CI fica no GitHub Actions com o workflow `CI — Build & SonarQube`.

Ele prepara Java, Node.js e `pnpm`, faz a build, roda os testes com cobertura e envia a análise para o SonarQube.

### Deploy

O deploy também acontece pelo GitHub Actions com o workflow `Deploy`.

Ele é disparado por `workflow_run` depois que o `CI — Build & SonarQube` passa na branch `main`.

### Fluxo de CD

- checkout do repositório;
- setup de `pnpm` e Node.js;
- instalação das dependências;
- instalação global da CLI da Vercel;
- `vercel pull --environment=production`;
- `vercel build --prod`;
- `vercel deploy --prebuilt --prod`.

### Hosting

- plataforma de deploy: Vercel;
- execução da pipeline: GitHub Actions.

---