# Ordem de Trabalho — OT-TAREFA-001

## Identificação

- **ID / título:** TAREFA-001 — Desvinculação da marca Igreja Siloé
- **Etapa do plano (§8.2):** achado A9 / item QUA-01
- **Tipo:** 1
- **Ciclo:** CICLO-01
- **Responsável:** Arquiteto (`lib/**`, tokens de código) + Dev Frontend
  (`app/**`, `components/**`, `public/**`, `scripts/**`)
- **Revisor:** Arquiteto (revisão da integração final)

## Objetivo

Remover nome, textos e identidade visual da Igreja Siloé do código de produção.
A marca passa a vir de um módulo de configuração único (`lib/brand.ts`) com
default neutro **"Gestão de Igrejas"**. O repositório instala e roda com
identidade 100% neutra.

## Escopo

### Dentro — ordem de execução

1. **Arquiteto — primeiro, destrava o resto.** Criar `lib/brand.ts` exportando ao
   menos: `brandName` ("Gestão de Igrejas"), `brandShortName` ("Gestão Igrejas"),
   `brandDescription`, `supportEmail` (placeholder ASCII, ex. `contato@exemplo.app`),
   `siteUrl` (placeholder), `socials` (vazio/placeholder), `copyrightHolder`.
   Tipos no próprio arquivo.
2. **Arquiteto — `lib/**`:** neutralizar `lib/mock-data.ts`, `lib/site-content.ts`,
   `lib/holidays.ts` para uma igreja fictícia genérica ("Igreja Modelo"),
   corrigindo os e-mails malformados `@siloé.org.br` para ASCII (`@exemplo.app`).
   Renomear em `lib/prototype-auth.ts` os tokens `siloe-demo-role` →
   `app-demo-role` e `siloe-demo-role-change` → `app-demo-role-change`.
   Ajustar `qrCode` de fixtures `SILOE-EVT...` → `EVT-...`.
3. **Dev Frontend — textos:** trocar as strings de marca visíveis em
   `app/layout.tsx` (metadata, OpenGraph), `app/(auth)/login/page.tsx`,
   `app/(app)/dashboard/page.tsx`, `app/(app)/membros/page.tsx`,
   `app/(app)/financeiro/page.tsx`, `app/(app)/eventos/page.tsx`,
   `app/(app)/prestacao-contas/page.tsx`, `app/(app)/louvor/page.tsx`,
   `components/layout/sidebar.tsx`, `components/layout/topbar.tsx` — todas lendo de
   `lib/brand.ts`. Nenhuma string de marca hardcoded.
4. **Dev Frontend — tokens e QR:** `public/sw.js` `CACHE_NAME` `siloe-pwa-v2` →
   `app-pwa-v1`; prefixo do QR do dashboard `SILOE:` → `APP:` e código de evento
   `SILOE-EVT-` → `EVT-`. Só o de-branding do prefixo; o identificador opaco,
   revogável e validado no servidor (achado A7) é trabalho separado em SEC-01.
5. **Dev Frontend — assets:** regenerar `public/icons/*`, `favicon-32x32.png`,
   `apple-touch-icon.png`, `logo.svg`, `logo-transparent.png` com placeholder
   neutro via `scripts/generate-icons.mjs` / `scripts/generate-clean-icons.mjs`;
   remover `public/videos/siloe-logo.mp4` e `components/shared/logo-reveal-video.tsx`
   e todos os seus imports/usos; atualizar `public/manifest.json` e
   `public/offline.html` para os valores neutros.

### Fora

- Redesenho do site público `app/(site)/page.tsx` — é a TAREFA-002 (site
  comercial do SaaS). Nesta OT, apenas trocar as strings de marca óbvias e o
  `<title>`/`alt` para o valor neutro; conteúdo institucional detalhado fica como
  placeholder mínimo que não quebre o build.
- Identidade visual final da marca comercial (depende de nome/domínio — §10 do
  plano).
- Correção completa do achado A7 (identificador opaco no QR) — fica em SEC-01.
- `docs/PLANO-ESTRATEGICO-*` permanece intacto (histórico).

## Arquivos sob responsabilidade

- **Arquiteto:** `lib/brand.ts` (novo), `lib/mock-data.ts`, `lib/site-content.ts`,
  `lib/holidays.ts`, `lib/prototype-auth.ts`.
- **Dev Frontend:** `app/layout.tsx`, `app/(auth)/**`, `app/(app)/**`,
  `app/(site)/page.tsx` (só strings de marca), `components/layout/**`,
  `components/shared/logo-reveal-video.tsx` (remoção), `public/**`, `scripts/**`.
- Sem sobreposição de arquivo entre os dois. Branch única
  `tarefa/TAREFA-001-desmarcacao`; o Arquiteto entrega o passo 1–2 antes do Dev
  Frontend começar o passo 3.

## Dependências

Nenhuma. Não depende de OPS-01 nem de SIL-01.

## Contratos e tipos afetados

Novo contrato `lib/brand.ts`. Sem mudança de esquema de banco. Sem nova
dependência.

## Critério de aceite (verificável)

- [ ] `grep -rin "silo[eé]"` fora de `docs/` retorna 0 ocorrências
- [ ] Nenhuma string de marca hardcoded em `app/` ou `components/`; tudo vem de
      `lib/brand.ts`
- [ ] E-mails e identificadores só ASCII; `@siloé.org.br` eliminado
- [ ] `public/videos/siloe-logo.mp4` e `components/shared/logo-reveal-video.tsx`
      removidos, sem import órfão
- [ ] `npm run build` verde; `npm run lint` sem erros novos; `tsc --noEmit` limpo
- [ ] PWA instala com nome e ícone neutros; `manifest.json` e `offline.html`
      neutros
- [ ] Verificação manual de mojibake (§16) executada e registrada no
      STATUS-REPORT.md (DEC-018 — tooling do portão ainda não ativo)
- [ ] Nenhum dado pessoal real introduzido

## Restrições (§10)

Dev Frontend não toca `lib/**`; Arquiteto não toca `app/**` / `components/**`.
Não redesenhar o site público. Não introduzir dependência. React funcional na UI
(§15.2). Só ASCII em nomes de arquivo, identificadores e slugs (§16).

## Modelagem de ameaça (§17.7)

- **O que pode dar errado:** o de-branding do prefixo de QR alterar o conteúdo
  transmitido e expor mais dado do que hoje.
- **Quem seria afetado:** portadores da carteira/ingresso.
- **Controle que mitiga:** trocar apenas o prefixo textual; não alterar o payload
  do QR nesta OT; o identificador opaco fica em SEC-01.
- **Teste que prova:** inspeção do valor gerado no dashboard antes/depois — mesmo
  payload, só o prefixo muda.

## Plano de teste

`npm run build`, `npm run lint`, `tsc --noEmit`; smoke manual das telas alteradas
(login, dashboard, sidebar, topbar, membros, financeiro, eventos, prestação de
contas); instalar o PWA e conferir nome/ícone; `grep` dos critérios de aceite;
abrir os arquivos alterados e conferir acentuação correta (mojibake).

## Plano de rollback

Reverter o commit da branch `tarefa/TAREFA-001-desmarcacao`. Assets originais
recuperáveis do histórico Git.

## Aprovação

- **Reinaldo:** [ ] aprovada em ____/____/____
