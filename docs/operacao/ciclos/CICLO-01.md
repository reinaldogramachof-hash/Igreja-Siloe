# CICLO-01 — datas a definir por Reinaldo

Esqueleto. Aguarda priorização e datas do Orquestrador (dia 1 do ciclo).

## Objetivo proposto do ciclo

Destravar a fundação: registrar a mudança estratégica, desvincular a marca e
provar a hospedagem, deixando o repositório pronto para a fundação de código.

## Tarefas candidatas (proposta do Arquiteto)

| ID | Responsável | Revisor | Estado alvo no fim do ciclo | Observação |
|---|---|---|---|---|
| PLAN-12 | Arquiteto | Reinaldo | Aceita / Merge | Revisão v1.2 do plano: Siloé vira tenant; seções 2.2, 8, 8.1 |
| TAREFA-001 | Arquiteto + Dev Frontend | Arquiteto | Aceita / Merge | Desvinculação da marca; escopo já detalhado no `CEREBRO-OPERACIONAL.md` §13 |
| OPS-01 | Arquiteto + Dev Backend | Arquiteto | Especificação + prova iniciada | Depende de insumos da conta HostGator; pode não fechar no ciclo |

## Aprovações de OT

- [ ] `ordens/OT-PLAN-12.md` — redigida, aguardando aprovação
- [ ] `ordens/OT-TAREFA-001.md` — redigida, aguardando aprovação
- [x] `ordens/OT-OPS-01.md` — **aprovada por Reinaldo em 2026-09-08** (sessão 6),
      item a item. Projeto Supabase = "Gestão Igreja Pro" (`wkovbmrvpzukszmgfctd`,
      schema `homolog`, removido ao fim). Subdomínio de homologação em
      provisionamento pelo agente Claude do Chrome no cPanel.
- [ ] `ordens/OT-SIL-01.md` — bloqueada por insumos (ver abaixo)
- Tipo 2 aprovadas em lote em ____/____: —

## Situação em 2026-09-08

- Codex (Dev Backend) e Antigravity (Dev Frontend): ciência confirmada, read-back
  aceito pelo Arquiteto. Ambos aguardando OT aprovada.
- **OPS-01 (sessão 6):** acesso ao Supabase revalidado (`read_only`); `OT-OPS-01`
  aprovada item a item; projeto Supabase = "Gestão Igreja Pro" (schema `homolog`).
  Governança no PR #2 (aberto, aguarda merge de Reinaldo).
- **OPS-01 — infra (agente Claude do Chrome, 2026-09-08):** subdomínio
  `homolog.plenaaplicativos.com.br` **criado** na conta `hg2fbe99`, document root
  `/home2/hg2fbe99/homolog`, SSL AutoSSL válido (expira 2026-12-07), HTTPS 200,
  PHP 8.3, provável Apache. Chave SSH `id_rsa` — Reinaldo confirmou que é dele
  (mantida). Force HTTPS Redirect e `mod_rewrite` tratados no `.htaccess`.
- **OPS-01 — execução (sessão 7):** conector claude.ai Supabase não alcança o
  "Gestão Igreja Pro"; Reinaldo aplica o SQL manualmente. Branch
  `tarefa/OPS-01-homologacao` com a migração `20260908183000_homolog.sql`, o
  rollback, a Edge Function `homolog-echo` e o README em `supabase/`. Falta
  aplicar no projeto e seguir com `next.config.ts`/`.htaccess`/runbook e a prova
  A/B.
- **Dependência OPS-01 × SIL-01 (ruling do Arquiteto):** a prova técnica de
  compatibilidade do OPS-01 (build estático, deploy no Plano M, rotas após
  recarga, HTTPS/cabeçalhos, ida-e-volta de auth no Supabase, uma escrita
  protegida + negação de acesso cruzado, atualização do PWA) **não depende** de
  SIL-01 aceita. SIL-01 só alimenta o conteúdo final publicado. OPS-01 e SIL-01
  correm em paralelo no Ciclo 1, como já previa o roadmap (DEC-020). O
  `BACKLOG-OPERACIONAL.md` foi ajustado.

## Insumos pendentes de Reinaldo

Para `OT-OPS-01`:
- ~~Domínio~~ — **RESOLVIDO em 2026-09-08:** `www.plenaaplicativos.com.br`,
  disponível e validado na HostGator. Homologação em
  `homolog.plenaaplicativos.com.br`.
- ~~Confirmar o ruling (OPS-01 não espera SIL-01)~~ — **confirmado por Reinaldo
  em 2026-09-08.**
- Acesso ou instruções do cPanel do HostGator Plano M; criar o subdomínio de
  homologação e ativar AutoSSL.
- Supabase: criar projeto novo de homologação (recomendado pelo Arquiteto —
  isola custo, dado e chaves; o projeto conectado hoje via MCP está vazio e a
  conexão é `read_only`) ou usar o existente `wkovbmrvpzukszmgfctd`?
- Caminho de escrita no Supabase para a migração/Edge Function/bucket da prova
  (dashboard, CLI ou conector com `apply_migration` na conta dona do projeto).
- Aprovar `ordens/OT-OPS-01.md` item a item (Tipo 1).
- Confirmar a lista mínima de operações da prova descrita na OT: login, escrita
  protegida por RLS (`homolog_ping`), negação de acesso cruzado A/B, Edge
  Function, Storage, atualização do PWA/cache, recarga de rotas, build estático.

Para `NEG-01` (recebido de Reinaldo em 2026-09-10, **parcial** — mensagem
cortada, falta completar antes de fechar a especificação):
- Modelo de Entrada: LocalStorage (sem backend), pagamento único, licença
  vitalícia.
- Gestão Lite: módulos base online, R$ 69,90 (periodicidade a confirmar —
  provável mensal).
- Gestão Online: mais módulos que o Lite, valores escalando, passando por um
  nível "Essencial" até um nível "Premium" (nomes, módulos incluídos em cada
  nível e valores exatos de Essencial/Premium **ainda não informados**).
- **Falta:** valores de Essencial e Premium; o que cada nível libera
  (diferença de módulos); se "Gestão Online" é o nome comercial da faixa
  toda ou só de um nível; critérios de teste/trial mencionados no título do
  NEG-01.

Para `OT-SIL-01`:
- O que a Igreja Siloé usa hoje (planilha, sistema, papel).
- Número de operadores (secretaria, tesouraria, líderes).
- Tamanho da congregação e número de células reais.
- O que é inegociável na entrega da Siloé.
- Existe acordo escrito? O que "único/exclusivo" significa nele (§2.2 do plano).
- Autorização para usar o nome/caso Siloé em divulgação (ainda não informada).

Pré-requisito geral: **merge do PR `chore/cerebro-operacional-v1` para `main`**,
para as branches de tarefa saírem de uma base atualizada.

## QA (dias 4–5)

<A preencher.>

## Retrospecto

<A preencher no fecho do ciclo.>
