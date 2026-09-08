# Cérebro Operacional — Gestão de Igrejas (SaaS)

> **Versão:** 1.1 — VIGENTE. Aprovado expressamente por Reinaldo em 2026-09-08
> (registro em `docs/operacao/DECISOES.md`).
> **Alterações neste documento** seguem a mesma regra: proposta do Arquiteto,
> aprovação expressa de Reinaldo, nova linha no §21 e no `DECISOES.md`.
> **Substitui:** a seção 9.3.1 ("Organização proposta dos agentes") do
> `docs/PLANO-ESTRATEGICO-SAAS-2026-09-06.md`. Onde este documento e o plano
> divergirem sobre papéis, sessão, QA ou deploy, **este documento prevalece**.

---

## 1. Propósito e autoridade

Este documento define como os agentes de IA e o proprietário trabalham juntos no
projeto Gestão de Igrejas durante sua transformação em produto SaaS. Ele cobre
papéis, fronteiras, decisões, regras de início e fim de sessão, status report,
pacotes de deploy e o que nunca é permitido.

- **Decisor final:** Reinaldo. Toda decisão Tipo 1 (ver §4) passa por ele
  **expressamente e antes da execução**.
- **Fonte de prioridades e IDs de trabalho:** a tabela do backlog (§8.2 do plano
  estratégico) e a lista de definições pendentes (§10 do plano).
- **Fonte de regras de código:** `AGENTS.md` na raiz. Esta versão do Next.js tem
  breaking changes; ler o guia relevante em `node_modules/next/dist/docs/` antes
  de escrever qualquer código.
- **Idioma de trabalho e documentação:** português do Brasil.

---

## 2. Papéis e fronteiras

| Agente | Identidade | Papel |
|---|---|---|
| **Claude** | Claude Code | Arquiteto Sênior |
| **Codex** | Codex | Dev Sênior — Backend |
| **Antigravity** | Gemini Antigravity IDE (multi-agente) | Dev Sênior — Frontend |
| **Reinaldo** | Proprietário | Orquestrador Geral + QA Validador |

### 2.1 Claude — Arquiteto Sênior

**Faz:** modelo de dados; contratos de API e tipos compartilhados; regras de
isolamento (RLS) e desenho de segurança; ADRs; decomposição do backlog em tarefas
com critério de aceite; especificação de cada tarefa antes de ir para os devs;
revisão obrigatória de todo PR de arquitetura, segurança e financeiro; definição
e conteúdo dos pacotes de deploy; papel de responsável de integração para
alterações em modelo de dados, autenticação, dependências e infraestrutura.

**Também faz, com aval prévio de Reinaldo:** implementação das **fundações
cross-cutting** onde desenho e código são inseparáveis — modelo de dados,
autenticação/autorização, camada de RLS, `lib/brand.ts` e afins.

**Não faz:** implementação de módulos de negócio ponta a ponta; commit, push,
merge para `main`, publicação ou deploy sem autorização expressa de Reinaldo.

### 2.2 Codex — Dev Sênior (Backend)

**Faz:** implementação de backend, domínio, dados, integrações e cobrança,
seguindo a especificação do Arquiteto; testes automatizados e evidência de teste;
migrações versionadas com script de rollback.

**Não faz:** alterar modelo de dados, autenticação/autorização, dependências
(`package.json`) ou infraestrutura sem tarefa Tipo 1 aprovada e revisão do
Arquiteto; ser a única fonte de validação do próprio código em segurança ou
financeiro.

### 2.3 Antigravity — Dev Sênior (Frontend)

**Faz:** implementação de frontend, UI, PWA e site público, seguindo a
especificação do Arquiteto; verificação visual reproduzível em navegador (não
confundir leitura de código com teste visual); testes de componente quando
aplicável.

**Não faz:** o mesmo conjunto de restrições de §2.2. Mesmo operando com vários
sub-agentes, **cada entrega tem um único dono responsável nomeado**.

### 2.4 Reinaldo — Orquestrador Geral + QA Validador

**Faz:** define prioridades e sequência; aprova especificações; autoriza decisões
Tipo 1; valida o aceite de cada entrega (QA); autoriza e executa o merge para
`main`; autoriza pacotes de deploy; autoriza qualquer ação externa (publicação,
divulgação, contato com terceiros).

---

## 3. Divisão de domínio e propriedade de arquivos

Divisão **fixa por camada**:

| Domínio | Dono | Exemplos de caminho |
|---|---|---|
| Backend / domínio / dados / integrações / cobrança | Codex | `lib/` (regras de negócio), migrações, Edge Functions, webhooks |
| Frontend / UI / PWA / site público | Antigravity | `app/`, `components/`, `public/`, `public/sw.js`, `public/manifest.json` |
| Arquivos compartilhados e fundações | Claude (Arquiteto) | `lib/types.ts`, `lib/brand.ts`, camada de auth/RLS, `package.json`, `next.config.ts`, esquema do banco |

Regras:

- **Nunca** dois agentes editando o mesmo arquivo ao mesmo tempo. Se uma tarefa
  precisar tocar arquivo de outro domínio, ela passa pelo Arquiteto, que serializa
  a mudança ou reatribui.
- Toda tarefa trabalha em **cópia de trabalho isolada** (branch
  `tarefa/<ID>-<slug>` ou worktree). `main` é protegida.
- Alteração em arquivo compartilhado ou fundação: só com o Arquiteto como
  responsável de integração.
- Na estrutura de módulos (§15.1), Codex e Antigravity trabalham na **mesma pasta
  de módulo** mas em subpastas distintas (Codex em `domain/`, `services/`,
  `data/`, `api/`; Antigravity em `ui/`). `types.ts` e `index.ts` do módulo são do
  Arquiteto. O `README.md` do módulo nomeia os dois donos.

---

## 4. Taxonomia de decisões

### Tipo 1 — sempre Reinaldo, expressamente, antes de executar

- Modelo de dados e esquema do banco.
- Autenticação, autorização, papéis e permissões.
- Nova dependência (`package.json`) ou upgrade relevante.
- Infraestrutura, ambiente e deploy.
- Marca, nome comercial e domínio.
- Preço, planos, limites e escopo comercial.
- Escopo de entrega e qualquer compromisso com cliente.
- Qualquer ação **irreversível** ou que toque **dado real** / segredo de produção.
- Qualquer mudança que contrarie o plano estratégico vigente.

### Tipo 2 — o agente executa, registra e Reinaldo valida no QA do ciclo

- Implementação dentro de um módulo já especificado e aprovado.
- Refatoração local sem mudança de contrato público.
- Correção de bug sem alteração de modelo de dados ou de contrato.
- Testes, documentação de código e dados fictícios.

**Regra de desempate:** na dúvida entre Tipo 1 e Tipo 2, trata-se como Tipo 1.
Se uma decisão Tipo 1 surgir no meio de uma sessão, o agente **para** e leva ao
Orquestrador antes de prosseguir.

---

## 5. Regras de início de sessão

1. Sincronizar `main` (`git fetch`, árvore de trabalho limpa).
2. Ler, nesta ordem: este documento; a última entrada de
   `docs/operacao/STATUS-REPORT.md`; o item do backlog (§8.2 do plano) da tarefa.
3. Confirmar com o Orquestrador: tarefa, ID do backlog, arquivos sob sua
   responsabilidade, dependências, critério de aceite e tipo (1 ou 2).
4. Criar a cópia de trabalho isolada da tarefa. Nunca trabalhar direto na `main`.
5. Antes de escrever qualquer código, ler o guia relevante em
   `node_modules/next/dist/docs/` (regra do `AGENTS.md`).
6. Confirmar que o ambiente não contém dado pessoal real nem segredo de produção.

---

## 6. Regras de fim de sessão

1. Rodar o portão automático (§6.1) e anexar o resultado à entrada do Status Report.
2. Escrever a entrada no Status Report (§7).
3. Atualizar o status do ID no backlog.
4. Se a tarefa continua: escrever nota de hand-off (onde parou, o que falta, riscos).
5. Abrir ou atualizar o PR da cópia isolada, com descrição vinculada ao ID.
6. **Não** commitar, fazer push, merge ou deploy sem autorização expressa de
   Reinaldo. Quando autorizado, o commit termina com:
   `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
7. Garantir que não há diff isolado contendo apenas o bloco `nextjs-agent-rules`
   do `AGENTS.md`; se houver trabalho, ele é commitado junto.

### 6.1 Portão automático (antes do QA humano)

| Verificação | Critério |
|---|---|
| `npm run lint` | 0 erros (avisos triados e justificados) |
| Typecheck (`tsc --noEmit`) | Sem diagnósticos |
| `npm run build` | Conclui (fonte local/licenciada — achado A10 do plano) |
| Suíte de testes | Verde |
| Testes de isolamento (§8.3 do plano) | Verdes quando a tarefa toca auth, tenant ou financeiro |

O QA humano de Reinaldo só começa com o portão **verde**.

---

## 7. Status Report

**Arquivo único, append-only:** `docs/operacao/STATUS-REPORT.md`. Entrada mais
recente no topo. Uma entrada por sessão de agente.

```
## AAAA-MM-DD — <Agente> — sessão <n>
- Tarefa / ID: <ID do backlog> — <título>
- Tipo: 1 | 2
- Decisões solicitadas ao Orquestrador: <lista ou "nenhuma">
- Entregas: <o que ficou pronto>
- Evidência: <PRs, prints, vídeos, saída de testes>
- Portão automático: lint <ok/n> · types <ok/n> · build <ok/n> · testes <ok/n> · isolamento <ok/n/a>
- Pendências: <o que falta>
- Riscos / bloqueios: <...>
- Próximo passo: <...>
- Arquivos tocados: <lista>
```

---

## 8. Fluxo de trabalho por tarefa

1. **Orquestrador** seleciona o item do backlog (§8.2 do plano) e define prioridade.
2. **Arquiteto** escreve a especificação: objetivo, escopo, arquivos, dependências,
   contratos/tipos afetados, critério de aceite, restrições, tipo (1/2).
3. **Reinaldo** aprova a especificação (Tipo 1 sempre item a item; Tipo 2 pode ser
   aprovação em lote no início do ciclo).
4. **Dev Sênior** da camada correspondente executa na cópia isolada, seguindo o
   `AGENTS.md`.
5. **Portão automático** verde (§6.1).
6. **Revisão:** o Arquiteto sempre; mais um agente diferente do implementador para
   segurança e financeiro.
7. **QA de Reinaldo** (dias 4–5 do ciclo): valida fluxo real entre usuários e
   sessões, dados, permissões e comportamento visual — sem resultados simulados.
8. **Reinaldo autoriza e faz o merge** para `main`.
9. Entrada no Status Report e atualização do backlog.
10. Deploy somente via pacote datado e aprovado (§9).

---

## 9. Pacotes de deploy

**Arquivo:** `docs/operacao/deploys/DEPLOY-AAAA-MM-DD-vX.Y.md`.

```
# Deploy AAAA-MM-DD — vX.Y — <ambiente>
- Escopo: <resumo>
- IDs do backlog incluídos: <...>
- Commits / PRs: <...>
- Migrações (ordem de aplicação): <lista>   | rollback: <script/passos>
- Passos de rollback do deploy: <...>
- Evidência de homologação: rotas <ok> · HTTPS e cabeçalhos <ok> ·
  retorno de autenticação <ok> · operação protegida <ok> ·
  negação de acesso indevido <ok> · atualização do PWA <ok>
- Checklist LGPD (se toca dado pessoal): base legal revisada ·
  retenção/exportação · dados de menores/pastorais tratados
- Aprovação expressa — Reinaldo: [ ] autorizado em ____/____/____
```

Regras:

- Nenhum deploy sem a linha de aprovação preenchida e assinada por Reinaldo.
- **Não há automação de deploy** de nenhuma natureza.
- Operações administrativas e cobrança ficam no backend do Supabase; segredos
  fora dos arquivos publicados.

---

## 10. O que nunca é permitido

- Commit, push, merge para `main`, publicação ou deploy sem autorização expressa
  de Reinaldo na sessão correspondente.
- Dois agentes editando o mesmo arquivo simultaneamente sem coordenação do
  Arquiteto.
- Alterar modelo de dados, autenticação/autorização, dependências ou infra sem
  tarefa Tipo 1 aprovada.
- Colocar dado pessoal real ou segredo de produção em código, fixtures, logs ou
  ambiente de agente.
- Usar chave de serviço que ignora RLS em fluxo de usuário comum.
- Anunciar ou documentar recurso que não foi entregue e homologado.
- Remover o bloco `nextjs-agent-rules` do `AGENTS.md` em um diff isolado.
- Usar a marca, o nome ou casos da Igreja Siloé em qualquer material — a marca
  está sendo desvinculada (ver §13, TAREFA-001).
- Tratar licença de teste como cliente pagante.

---

## 11. Cadência

- Ciclos de **duas semanas** (§9.3.2 do plano).
- Dias 1–3: priorização, implementação, integração.
- Dias 4–5: QA de Reinaldo, correção de pendências, aceite, preparação do próximo
  ciclo.
- Recalibrar prazos após dois ciclos reais, medindo tarefas aceitas e retrabalho.

---

## 12. Definition of Done por tipo de tarefa

| Tipo de tarefa | Pronto quando |
|---|---|
| **Código (módulo/feature)** | Especificação vinculada a ID; código na cópia isolada; portão automático verde; testes novos cobrindo o critério de aceite; sem segredo/dado real; evidência de fluxo para o QA; entrada no Status Report; PR aberto e revisado pelo Arquiteto |
| **Segurança / autorização** | Acima + testes de isolamento §8.3 aplicáveis + revisão do Arquiteto e de um agente distinto do implementador + nenhuma rota/endpoint sem verificação no servidor |
| **Financeiro** | Acima + valores monetários exatos (sem float impreciso) + estorno preserva histórico + totais conciliam por período + revisão dupla |
| **Dados / migração** | Migração versionada + script de rollback + testada em homologação + revisão do Arquiteto como responsável de integração |
| **Documentação** | Revisada, consistente com a especificação, sem promessa de recurso futuro |
| **Infra / deploy** | Pacote de deploy completo (§9) + evidência de homologação + aprovação expressa de Reinaldo |

---

## 13. Registro de decisões e primeira tarefa

O registro leve de decisões (ADR) fica em `docs/operacao/DECISOES.md`. Formato:
número, data, decisão, contexto, alternativas consideradas, quem decidiu (sempre
Reinaldo para Tipo 1), impacto no plano.

### Decisões desta abertura (a transcrever para `DECISOES.md` ao aprovar a v1.0)

| ID | Decisão |
|---|---|
| DEC-001 | Papéis: Claude = Arquiteto Sênior; Codex = Dev Backend; Antigravity = Dev Frontend; Reinaldo = Orquestrador + QA. Substitui §9.3.1 do plano; Gemma sai do time |
| DEC-002 | Claude implementa apenas fundações cross-cutting, com aval prévio |
| DEC-003 | Divisão de trabalho fixa por camada (Codex backend / Antigravity frontend) |
| DEC-004 | Taxonomia de decisões Tipo 1 / Tipo 2 (§4) |
| DEC-005 | Portão automático obrigatório antes do QA humano (§6.1) |
| DEC-006 | Merge para `main` só por Reinaldo; `main` protegida; cópia isolada por tarefa |
| DEC-007 | Revisão de segurança/financeiro = Arquiteto + um agente distinto do implementador |
| DEC-008 | Status Report append-only em `docs/operacao/STATUS-REPORT.md` |
| DEC-009 | Pacote de deploy datado em `docs/operacao/deploys/`; só Reinaldo autoriza; nada automático |
| DEC-010 | Cadência de ciclos de duas semanas, QA nos dias 4–5 |
| DEC-011 | Backlog = tabela §8.2 do plano estratégico como fonte de IDs |
| DEC-012 | `AGENTS.md` aponta para este documento como leitura obrigatória de início de sessão (confirmado e aplicado em 2026-09-08) |
| DEC-013 | Desvincular a marca Igreja Siloé — primeira tarefa rastreada (TAREFA-001) |
| DEC-014 | O repositório passa a ser a linha de produto SaaS; a Igreja Siloé deixa de ser entrega separada e passa a primeiro cliente/tenant. O plano estratégico recebe uma revisão v1.2 registrando a mudança (tarefa à parte) |
| DEC-015 | Estrutura de código em vertical slice: `src/modules/<modulo>/` com todas as camadas dentro, `src/shared/` para transversal, `app/` só compõe rotas (§15.1). Migração do layout atual entra no início da fundação de código, não na TAREFA-001 |
| DEC-016 | POO em `domain/` e `services/`; React funcional em `ui/`; utilitários como funções puras (§15.2) |
| DEC-017 | Padrões de Clean Code, prevenção de mojibake e segurança de dados/cibersegurança consolidados em §14, §16 e §17 |
| DEC-018 | Fundação de tooling (`.editorconfig`, `.gitattributes`, Prettier, verificador de mojibake, scanner de segredos, `npm audit` no portão) entra junto da fundação de código (SEC-01/TEN-01), não antes da TAREFA-001. Risco de mojibake nos ciclos iniciais mitigado por verificação manual registrada no Status Report |

### TAREFA-001 — Desvinculação da marca Igreja Siloé

- **Backlog:** achado A9 / item QUA-01 do plano.
- **Tipo:** 1.
- **Dono:** Arquiteto (fundação `lib/brand.ts` e tokens) + Dev Frontend (assets e textos).
- **Escopo:**
  1. Criar `lib/brand.ts` com nome, nome curto, descrição, contatos, e-mails,
     URLs e redes sociais — default neutro **"Gestão de Igrejas"**. Toda tela
     passa a ler daí.
  2. Trocar as strings visíveis (Categoria A do levantamento) para ler de
     `lib/brand.ts`.
  3. Neutralizar os dados fictícios (`lib/mock-data.ts`, `lib/site-content.ts`,
     `lib/holidays.ts`) para uma igreja genérica ("Igreja Modelo"), corrigindo os
     e-mails malformados `@siloé.org.br`.
  4. Renomear tokens de código: `siloe-demo-role` → `app-demo-role`;
     `siloe-pwa-v2` → `app-pwa-v1`; prefixo de QR `SILOE:` → identificador opaco
     (alinha com o achado A7); `SILOE-EVT-` → `EVT-`.
  5. Substituir os assets visuais por placeholder neutro via
     `scripts/generate-icons.mjs`; remover `public/videos/siloe-logo.mp4`,
     `components/shared/logo-reveal-video.tsx` e seus usos.
  6. Atualizar `public/manifest.json` e `public/offline.html`.
- **Fora de escopo:** identidade visual final (depende da marca — §10 do plano);
  o site comercial do SaaS (TAREFA-002, ciclo próprio); o `docs/PLANO-ESTRATEGICO-*`
  histórico permanece intacto.
- **Critério de aceite:** `grep -ri "silo[eé]"` fora de `docs/` retorna 0
  ocorrências; build verde; PWA instala com identidade neutra; nenhum dado
  pessoal real no repositório; verificação manual de mojibake (§16) executada e
  registrada no Status Report, já que a fundação de tooling ainda não estará
  ativa (DEC-018).

---

## 14. Padrões de Clean Code

Aplicáveis a todo código de produção. A ferramenta decide estilo; a revisão
humana cuida de design e correção.

- **Nomes** descritivos e sem abreviação obscura; o nome revela intenção.
- **Funções pequenas**, uma responsabilidade, poucos parâmetros. Preferir
  `early return` a aninhamento profundo. Evitar parâmetro booleano que muda o
  comportamento — quebrar em duas funções.
- **Sem número mágico**: constantes nomeadas. **Sem código morto ou comentado** —
  o Git guarda o histórico.
- **Comentário explica o porquê**, nunca o o quê.
- **DRY com bom senso**: abstrair no terceiro uso, não no primeiro.
- **Erro explícito**: nada de `catch` vazio. Erros de domínio são tipados;
  a camada define entre `Result`/retorno de erro e exceção.
- **Imutabilidade por padrão**: `const`, sem mutação de estado compartilhado.
- **TypeScript estrito**: sem `any` (usar `unknown` + narrowing); sem
  `@ts-ignore`/`@ts-expect-error` sem comentário justificando; tipos explícitos
  nos limites de módulo.
- **Um componente/arquivo**; arquivo e módulo com tamanho sob controle.
- **Regra de dependência**: a UI não acessa banco direto; o domínio não importa
  React nem SDK de infraestrutura; as dependências apontam para dentro
  (UI → serviços → domínio; `data/` implementa interfaces do domínio).
- **Testes**: o nome descreve o comportamento; padrão Arranjo–Ação–Verificação;
  um conceito por teste; sem `if`/laço dentro do teste.
- **Formatação e lint automáticos** rodam no portão (§6.1); divergência de estilo
  não é assunto de revisão.

---

## 15. Estrutura modular e Programação Orientada a Objetos

### 15.1 Vertical slice por módulo

Cada módulo de negócio vive em uma pasta única, com todas as camadas dentro
(**alta coesão, baixo acoplamento**). O App Router (`app/`) apenas compõe rotas
e importa dos módulos; não contém regra de negócio.

```
src/
  modules/
    <modulo>/            ex.: membros, celulas, financeiro, agenda, avisos
      domain/            entidades, value objects, regras puras — sem I/O, sem React
      services/          casos de uso e orquestração
      data/              repositórios, acesso a Supabase, migrações do módulo
      api/               Edge Functions / handlers do módulo
      ui/                componentes React do módulo
      types.ts           contratos do módulo
      index.ts           API pública: o único ponto que outros módulos importam
      README.md          propósito, dono(s), dependências, decisões locais
      __tests__/
  shared/               auth, brand, ui-kit, utilitários, tipos globais
  app/                  App Router: composição fina, sem regra de negócio
```

Regras:

- Um módulo só importa de outro módulo pelo `index.ts` dele. Nunca alcançar
  arquivo interno de outro módulo.
- `shared/` não importa de `modules/`.
- Todo módulo tem `README.md` com dono de backend, dono de frontend e
  dependências — é o contrato de propriedade do §3.
- **Modelo replicável**: existe `src/modules/_template/` com a estrutura vazia e
  os padrões-base já escritos (Repository, Service/UseCase, mapper linha↔entidade,
  validação de entrada no limite da API, tratamento de erro). Módulo novo começa
  copiando o `_template`.
- A migração do layout atual (`app/` + `lib/` + `components/`) para `src/modules/`
  é tarefa própria, encaixada no início da fundação de código (SEC-01/TEN-01), não
  na TAREFA-001.

### 15.2 POO no domínio, funcional na UI

- **`domain/` e `services/`**: orientados a objetos. Classes para entidades e
  casos de uso; value objects imutáveis para dinheiro, e-mail, identificadores;
  injeção de dependência por construtor; **interfaces** para repositórios
  (o domínio define a interface, `data/` implementa).
- **`ui/`**: React funcional — componentes e hooks. Sem classes de componente,
  sem wrapper OO sobre React.
- **`shared/` utilitários**: funções puras.
- Regra prática: objeto quando há **estado + comportamento + invariantes** a
  proteger; função pura quando é só transformação de dado.

---

## 16. Codificação de texto e prevenção de mojibake

Mojibake (texto corrompido por conversão de codificação) é defeito bloqueante.

- **UTF-8 sem BOM** em todo arquivo versionado; fim de linha **LF**. Garantido por
  `.editorconfig` e `.gitattributes` (`* text=auto eol=lf`).
- **Somente ASCII** em: nomes de arquivo, nomes de pasta, nomes de branch,
  identificadores de código, chaves de objeto/JSON, slugs, e-mails e qualquer
  identificador técnico. (É o defeito já visto em `@siloé.org.br`.)
- **Acentuação normal, em UTF-8**, é permitida e esperada em texto para humanos:
  strings de interface, comentários e documentação.
- **Banco**: colunas de texto em UTF-8; `COLLATE` definido explicitamente;
  normalização Unicode **NFC** na entrada de dados.
- **PowerShell no Windows**: ao gerar arquivo versionado, sempre
  `Out-File`/`Set-Content -Encoding utf8`. Gerar arquivo sem `-Encoding utf8` é
  proibido.
- **Portão automático** (quando a fundação de tooling entrar): script que rejeita
  bytes UTF-8 inválidos e sequências mojibake comuns (`Ã`, `Â`, ` Â€`, `�`) em
  arquivos versionados. Até lá, cada agente roda a verificação manualmente e a
  registra no Status Report.
- **Caminho do projeto**: `Gestão Igreja` (com acento e espaço) é risco conhecido
  para scripts e CI; renome para `gestao-igrejas` é candidato de tarefa futura,
  fora do escopo atual.

---

## 17. Segurança de dados e cibersegurança

Complementa — não substitui — as seções 5.4, 6, 7 e 8.3 do plano estratégico.

### 17.1 Princípios

- **Servidor é a autoridade**: nunca confiar em dado vindo do cliente para
  decidir acesso, tenant, papel, plano ou preço.
- **Menor privilégio** em cada conta, chave, papel e política.
- **Falha segura**: nega por padrão; ausência de regra é negação, não liberação.
- **RLS primeiro**: isolamento no banco, além da verificação no endpoint e da
  validação de campos.
- **Defesa em profundidade**: validação de entrada, codificação de saída,
  autorização por linha, auditoria.

### 17.2 Classificação e tratamento de dados

- Classificar todo campo: **público / interno / pessoal / sensível (LGPD)**.
  Convicção religiosa e filiação religiosa são sensíveis.
- Dado pessoal ou sensível **nunca** em: log, URL, QR code, cache do PWA,
  fixtures, mensagem de erro ou material de divulgação. (Achados A6, A7, A8.)
- Comprovantes e anexos em **storage privado**, com link temporário assinado.
- Coleta mínima: campo opcional exige justificativa no spec.

### 17.3 Credenciais e segredos

- Segredo somente no servidor, via variável de ambiente / secret manager —
  nunca no repositório, no bundle do cliente ou em log.
- Sem criptografia caseira; hashing de senha é do Supabase Auth.
- TLS em todo tráfego.
- Chave de serviço que ignora RLS: só em fluxo administrativo isolado, nunca em
  caminho de usuário comum.
- Vazamento de segredo → rotacionar imediatamente e registrar incidente.

### 17.4 Entrada, sessão e multitenancy

- Validação de **schema** no limite de toda API (tipo, tamanho, formato, faixa);
  rejeitar por padrão.
- Upload: validar tipo real, extensão e tamanho; tratar como não confiável.
- Sessão: expiração e revogação testadas; logout invalida a sessão de fato
  (achado A1); reautenticação em ação crítica; MFA para o proprietário.
- Todo registro de negócio pertence a uma organização; toda consulta filtra por
  tenant no servidor **e** por RLS. Os casos de teste do §8.3 do plano são
  obrigatórios em qualquer tarefa que toque auth, tenant ou dinheiro.
- **Rate limiting** e cotas de uso para conter abuso e custo.

### 17.5 Auditoria e resposta a incidente

- Registrar quem, o quê, quando, alvo e resultado para ações de autenticação,
  mudança de papel/organização, plano, cobrança, exportação e exclusão.
- Nunca apagar log de auditoria; incidente segue o plano de resposta do §7.1 do
  plano estratégico, preservando evidência.

### 17.6 Cadeia de desenvolvimento

- `package-lock.json` versionado; `npm audit` no portão automático.
- **Nova dependência é decisão Tipo 1**: justificativa, alternativa considerada,
  revisão de licença e de manutenção do pacote.
- Proibido `--no-verify`, desabilitar checagem de tipo/lint ou burlar hook.
- `main` protegida; toda mudança por PR revisado.
- Toda tarefa de segurança ou financeiro tem revisão do Arquiteto **e** de um
  agente diferente do implementador (§2, §12).

### 17.7 Modelagem de ameaça por feature

O spec de cada tarefa que toca autenticação, tenant, dinheiro ou dado pessoal
inclui um parágrafo curto: o que pode dar errado, quem seria afetado, qual
controle mitiga.

---

## 18. Manutenção e evolução — curto, médio e longo prazo

| Horizonte | Práticas obrigatórias |
|---|---|
| **Curto** | Portão automático verde; PR pequeno e focado; entrada no Status Report; ADR de toda decisão Tipo 1 |
| **Médio** | `README.md` por módulo atualizado; `_template` mantido em dia; cobertura de testes nos fluxos críticos; dívida técnica registrada como item de backlog, nunca como `TODO` solto no código |
| **Longo** | Regra de dependência entre camadas respeitada; contratos (`index.ts`, `types.ts`) versionados e com mudança comunicada; migrações sempre reversíveis; provedores (Supabase, gateway) atrás de interface própria, sem acoplamento direto espalhado; documentação viva junto do código |

---

## 20. Artefatos de execução e distribuição

Operacionalizam as seções 7, 8, 9 e 12. Todos em `docs/operacao/`.

| Artefato | Papel |
|---|---|
| `BACKLOG-OPERACIONAL.md` | Board vivo: cada ID do §8.2 do plano com responsável, revisor, ciclo, estado e PR |
| `agentes/ARQUITETO.md`, `DEV-BACKEND.md`, `DEV-FRONTEND.md`, `ORQUESTRADOR-QA.md` | Briefing operacional de cada papel — leitura de início de sessão junto com este documento |
| `templates/ORDEM-DE-TRABALHO.md` | Modelo da OT que o Arquiteto redige e Reinaldo aprova antes da execução |
| `templates/PULL-REQUEST.md` | Modelo de descrição de PR |
| `templates/MODULO-README.md` | Modelo do `README.md` por módulo (§15.1) |
| `templates/MODELAGEM-DE-AMEACA.md` | Modelo do parágrafo de ameaça (§17.7) |
| `ordens/OT-<ID>.md` | OT versionada de cada tarefa |
| `ciclos/CICLO-NN.md` | Plano e retrospecto de cada ciclo de duas semanas |
| `deploys/DEPLOY-*.md` | Pacote de deploy datado (§9) |

Fluxo de distribuição:

1. Reinaldo seleciona IDs para o ciclo em `ciclos/CICLO-NN.md`.
2. Arquiteto redige `ordens/OT-<ID>.md` a partir do template.
3. Reinaldo aprova a OT (Tipo 1 item a item; Tipo 2 em lote).
4. O agente responsável lê seu briefing, a OT e o `README.md` do módulo, e executa
   na cópia isolada.
5. O agente atualiza o estado no `BACKLOG-OPERACIONAL.md` e escreve no
   `STATUS-REPORT.md`.
6. Revisão, QA de Reinaldo, merge por Reinaldo; deploy só por pacote aprovado.

---

## 21. Histórico deste documento

| Versão | Data | Mudança |
|---|---|---|
| 0.1 | 2026-09-08 | Rascunho inicial para validação de Reinaldo |
| 0.2 | 2026-09-08 | Seções de Clean Code, estrutura modular + POO, prevenção de mojibake, segurança de dados/cibersegurança e manutenção por horizonte (§14–§18); DEC-015 a DEC-018 |
| 1.0 | 2026-09-08 | Aprovado expressamente por Reinaldo. DEC-012 e DEC-014 confirmados. Criados `docs/operacao/DECISOES.md`, `docs/operacao/STATUS-REPORT.md` e `docs/operacao/deploys/` |
| 1.1 | 2026-09-08 | §20 (artefatos de execução e distribuição): `BACKLOG-OPERACIONAL.md`, `agentes/`, `templates/`, `ordens/`, `ciclos/`; DEC-019 |
