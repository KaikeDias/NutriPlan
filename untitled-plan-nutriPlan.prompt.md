## Plan: Wizard multi-step + geração de PDF (JSPDF)

TL;DR - Criar um formulário em passos (wizard) com 4 telas (Perfil Profissional, Dados do Paciente, Elaboração da Dieta, Exportação). Reutilizar o `ThemeProvider` e `Button` existentes; armazenar dados no contexto/`localStorage`; gerar PDF final usando `jspdf` + `html2canvas`.

**Steps**
1. Preparação de dependências: instalar `jspdf` e `html2canvas` com `pnpm add jspdf html2canvas` (*depends on step 2 for wiring*).
2. Criar estrutura de componentes de UI: adicionar `Input`, `Select`, `Form` primitives em `src/components/ui/` (*parallel com passo 3*).
3. Implementar o wizard feature:
   1. `src/features/wizard/Wizard.tsx` — container que gerencia o passo atual e navegação.
   2. `src/features/wizard/steps/Step1.tsx` — Perfil Profissional (nome, CRN, CPF/CNPJ, upload logo).
   3. `src/features/wizard/steps/Step2.tsx` — Dados do Paciente.
   4. `src/features/wizard/steps/Step3.tsx` — Elaboração da Dieta (lista/inputs de alimentos/quantidades).
   5. `src/features/wizard/steps/Step4.tsx` — Exportação (revise + botão gerar PDF).
   6. `src/features/wizard/hooks/useWizard.ts` — estado, validação e persistência em `localStorage`.
   (Steps 3.* can be developed in parallel but `useWizard` should be drafted early.)
4. Adicionar utilitário de geração de PDF:
   - `src/lib/pdf/generatePdf.ts` — função que recebe os dados do wizard e/ou um elemento DOM e gera o PDF com `jspdf` + `html2canvas`.
   - `src/lib/pdf/index.ts` — export público.
5. Integração com a app:
   - Importar `Wizard` em `src/App.tsx` e renderizar (single-page) ou adicionar rota (instalar `react-router` se preferir múltiplas rotas).
   - Usar o `Button` existente para navegação e export.
6. UX e acessibilidade:
   - Validação por passo, feedback visual, salvar rascunhos no `localStorage`.
7. Testes manuais e verificação:
   - Rodar `pnpm dev`, preencher formulário, gerar PDF e confirmar conteúdo/layout.
3. Edge cases: testar upload de logo grande, campos vazios, múltiplas dietas.

**Decisions / Assumptions**
- Usar `jspdf` + `html2canvas` para gerar PDF do DOM (melhor fidelidade ao layout mostrado). Alternativa: `@react-pdf/renderer` se preferir construir templates React-to-PDF.
- Estado do wizard: React Context (simples) salvo periodicamente em `localStorage`. Se preferir, usar Zustand/Redux.
- Implementação single-page inicialmente; se preferir URLs por passo, adicionar `react-router`.

**Further Considerations**
1. Logo upload: onde armazenar? LocalStorage aceita base64 pequeno; para produção, backend/Cloud Storage é recomendado.
2. PDF layout: testar páginas longas e quebras de página — `jspdf` + `html2canvas` pode exigir paginação manual.
3. Internacionalização: se precisar, planejar labels/strings em arquivos separados.


Plan created from repo scan. Next step: confirm se prefere single-page wizard or route-per-step, and if quer que eu gere os arquivos iniciais (scaffold) e implemente um prototype de `generatePdf`.