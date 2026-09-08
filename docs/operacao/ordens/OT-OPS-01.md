# Ordem de Trabalho — OT-OPS-01

## Identificação

- **ID / título:** OPS-01 — Homologar HostGator Plano M + frontend estático + Supabase
- **Etapa do plano (§8.2):** etapa 0 / achado A10 (documentar publicação e reversão)
- **Tipo:** 1
- **Ciclo:** CICLO-01
- **Responsável:** Arquiteto (desenho da prova, RLS de homologação, `.htaccess`/
  export estático, pacote de evidência) + Dev Backend (Supabase de homologação,
  migração da tabela de teste, Edge Function e Storage de prova)
- **Revisor:** Arquiteto + Dev Frontend (agente distinto do implementador —
  toca ida-e-volta de autenticação, §12 / DEC-007)

## Objetivo

Provar, com evidência reproduzível, que a aplicação roda como **frontend estático**
servido pelo HostGator Plano M no domínio `plenaaplicativos.com.br` (subdomínio de
homologação), com o Supabase como back-end de autenticação, dados, Edge Function e
Storage — incluindo recarga de rotas profundas, HTTPS com cabeçalhos, uma escrita
protegida por RLS, negação de acesso cruzado e atualização do PWA.

## Escopo

### Dentro

1. **Ambiente de homologação — infra (Reinaldo executa no cPanel; Arquiteto
   especifica).**
   - Subdomínio `homolog.plenaaplicativos.com.br` apontado para uma pasta própria
     (`/homolog` fora de `public_html` do site principal, ou `public_html` do
     subdomínio).
   - Certificado TLS ativo no subdomínio (AutoSSL).
   - Sem processo Node persistente: a hospedagem serve **apenas arquivos
     estáticos** + `.htaccess`.

2. **Build estático — Arquiteto.**
   - Configurar `output: 'export'` (ou equivalente da versão vigente do Next.js —
     ler `node_modules/next/dist/docs/` antes) e gerar o pacote estático.
   - `.htaccess` com: rewrite de SPA para as rotas do App Router recarregarem sem
     404; `HTTPS` forçado; cabeçalhos `Strict-Transport-Security`,
     `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`,
     `Referrer-Policy`, `Permissions-Policy`; `Cache-Control` correto para
     `index.html`/`sw.js` (sem cache) vs. assets com hash (imutável).
   - Documentar toda variável de ambiente pública necessária ao build
     (`NEXT_PUBLIC_SUPABASE_URL`, chave publishable) — **sem** segredo de
     servidor no bundle (§17.3).

3. **Supabase de homologação — Dev Backend.**
   - **Decisão de Reinaldo (2026-09-08):** usar o projeto-base já existente
     **"Gestão Igreja Pro"** (`wkovbmrvpzukszmgfctd`) — não criar projeto novo.
     Como é o projeto-base, a prova roda **isolada** e é **removida ao fim**:
     - Todos os objetos de teste em um schema próprio `homolog` (nunca em
       `public`), com prefixo `homolog_`.
     - Sem nenhum dado pessoal real.
     - Cleanup obrigatório no aceite (ver critério) + `get_advisors` re-executado
       depois.
   - Migração versionada `homolog.homolog_ping`: `id uuid pk`, `owner uuid not
     null default auth.uid()`, `mensagem text`, `created_at timestamptz`. RLS
     ligada; policy: cada usuário só lê/escreve as próprias linhas.
   - Uma Edge Function trivial (`homolog-echo`) autenticada, para provar deploy e
     invocação de função.
   - Um bucket privado `homolog` com upload e leitura por link assinado
     temporário.
   - Script de rollback: `drop schema homolog cascade`, remover a Edge Function e
     o bucket.
   - **Achado pré-existente a tratar antes do aceite:** `get_advisors(security)`
     acusa `public.rls_auto_enable()` como `SECURITY DEFINER` executável por
     `anon` e `authenticated` via `/rest/v1/rpc/`. Avaliar: revogar `EXECUTE` de
     `anon`/`authenticated` ou mudar para `SECURITY INVOKER`. Registrar a decisão;
     se o tratamento completo não couber nesta OT, abrir item de backlog e deixar
     nota no `DEPLOY-*`.

4. **Prova de ponta a ponta — Arquiteto + Dev Frontend.**
   - Página/rota de homologação mínima (fora do escopo de marca) que faça: login
     Supabase, `insert` em `homolog_ping`, `select` (só a própria linha),
     invocação da `homolog-echo`, upload/download no bucket.
   - Executar com **dois usuários** de teste e confirmar que A não lê nem
     escreve a linha de B (negação de acesso cruzado a nível de RLS).
   - Testar recarga (F5) em rota profunda, navegação após recarga, e atualização
     do Service Worker (versão nova do `sw.js` assume sem limpar dados do
     usuário).

5. **Pacote de evidência — Arquiteto.**
   - Preencher `docs/operacao/deploys/DEPLOY-2026-09-DD-v0.1.md` (homologação) a
     partir da estrutura do `CEREBRO-OPERACIONAL.md` §9, com prints/HAR/saída de
     `curl -I` para cabeçalhos e HTTPS, e o passo a passo de rollback do deploy.

### Fora

- Domínio/branding comercial final e conteúdo do site público (TAREFA-001 /
  TAREFA-002 / SIL-01).
- Modelo multi-tenant real (organizações, vínculos) — é TEN-01. Aqui a "negação
  de acesso cruzado" é só a prova do mecanismo de RLS por `owner = auth.uid()`.
- Auth de produção (recuperação, convite, logout que invalida) — é SEC-01.
- Pipeline/automação de deploy — proibido por §9; o deploy é manual e datado.
- Backup/restore ensaiado — é REC-01.

## Arquivos sob responsabilidade

- **Arquiteto:** `next.config.ts`, `.htaccess` (novo, na raiz do pacote de
  publicação — no HostGator com Apache/LiteSpeed os cabeçalhos e o rewrite de SPA
  vão todos aqui; não usar convenção `_headers`), rota de homologação em `app/**`
  **restrita a strings técnicas** (integração com o Arquiteto como responsável,
  sem sobreposição com TAREFA-001),
  `docs/operacao/deploys/DEPLOY-2026-09-DD-v0.1.md` (novo),
  `docs/operacao/OPS-01-HOMOLOGACAO.md` (novo — runbook).
- **Dev Backend:** migração `homolog.homolog_ping` + rollback (`drop schema
  homolog cascade`), policy RLS, Edge Function `homolog-echo`, configuração do
  bucket `homolog`, tratamento/registro do advisory `public.rls_auto_enable()`,
  `scripts/` de apoio à prova.
- **Reinaldo:** passos no cPanel do HostGator via o agente Claude do Chrome
  (roteiro da sessão 6); provisão das chaves publishable ao ambiente de build
  (URL + `sb_publishable_...`); autorização do caminho de escrita no Supabase.
- Branch única `tarefa/OPS-01-homologacao`. Sem sobreposição de arquivo com
  `tarefa/TAREFA-001-desmarcacao`; se houver colisão em `next.config.ts` ou
  `app/layout.tsx`, o Arquiteto serializa (§3).

## Dependências

- **Pré-requisito operacional:** merge do PR `chore/cerebro-operacional-v1` para
  `main`, para a branch de tarefa sair de base atualizada.
- **Não depende** de SIL-01 nem de TAREFA-001 (ruling do Arquiteto registrado em
  `ciclos/CICLO-01.md`, confirmado por Reinaldo em 2026-09-08).
- **Projeto Supabase — decidido:** projeto-base "Gestão Igreja Pro"
  (`wkovbmrvpzukszmgfctd`), com os objetos de teste isolados no schema `homolog`
  e removidos ao fim (escopo 3).
- **Infra de hospedagem — em andamento:** subdomínio
  `homolog.plenaaplicativos.com.br` + AutoSSL, executados por Reinaldo via o
  agente Claude do Chrome no cPanel do HostGator Plano M, a partir do roteiro
  gerado nesta sessão. O agente devolve: document root absoluto, servidor
  (Apache/LiteSpeed), disponibilidade de `mod_rewrite`/`.htaccess`, versão do
  PHP (irrelevante para estático, mas registrar), e confirmação de HTTPS ativo.
- **Caminho de escrita no Supabase:** definir antes do escopo 3 — dashboard,
  Supabase CLI, ou conector MCP com `apply_migration` autenticado na conta dona
  do projeto (a conexão de `.mcp.json` é `read_only` e não aplica migração).

## Contratos e tipos afetados

- Novo `next.config.ts` com `output: 'export'` (ou equivalente da versão vigente).
- Nenhuma mudança em contrato de módulo. Migração `homolog_ping` é descartável e
  isolada; não integra o modelo de dados do produto.
- Sem nova dependência em `package.json`.

## Critério de aceite (verificável)

- [ ] `homolog.plenaaplicativos.com.br` serve a aplicação por HTTPS; HTTP
      redireciona para HTTPS
- [ ] `curl -I` mostra os cabeçalhos de segurança listados no escopo 2
- [ ] Recarga (F5) em pelo menos 3 rotas profundas distintas não retorna 404 e
      renderiza a rota correta
- [ ] Login Supabase funciona a partir do frontend estático; sessão persiste após
      recarga
- [ ] `insert` + `select` em `homolog_ping` funcionam para o usuário dono
- [ ] Usuário A **não** lê nem escreve a linha do usuário B (evidência dos dois
      lados)
- [ ] `homolog-echo` (Edge Function) responde autenticada e falha sem sessão
- [ ] Upload no bucket `homolog` e leitura só por link assinado temporário
- [ ] Nova versão do `sw.js` é adotada em recarga sem apagar dados do usuário
- [ ] `docs/operacao/deploys/DEPLOY-2026-09-DD-v0.1.md` preenchido com evidência e
      passos de rollback; linha de aprovação de Reinaldo assinada
- [ ] `docs/operacao/OPS-01-HOMOLOGACAO.md` (runbook) permite reproduzir o deploy
      do zero
- [ ] **Cleanup no projeto-base:** `drop schema homolog cascade` executado, Edge
      Function `homolog-echo` e bucket `homolog` removidos, usuários de teste
      excluídos; `get_advisors(security)` re-executado e anexado ao `DEPLOY-*`
- [ ] Decisão registrada sobre `public.rls_auto_enable()` (tratado nesta OT ou
      item de backlog aberto)
- [ ] Nenhum segredo de servidor no bundle publicado; nenhum dado pessoal real
- [ ] Verificação manual de mojibake (§16) nos arquivos criados, registrada no
      STATUS-REPORT.md (DEC-018)
- [ ] Portão automático verde: `npm run lint`, `tsc --noEmit`, `npm run build`
      (com `output: 'export'`), testes

## Restrições (§10)

- Sem automação de deploy de qualquer natureza (§9).
- Segredo só no servidor / ambiente de build, nunca no repositório nem no bundle
  do cliente (§17.3). Chave `service_role` não entra em caminho de usuário.
- Ambiente de homologação sem dado pessoal real (§10, §17.2).
- Ler o guia da versão vigente do Next.js em `node_modules/next/dist/docs/` antes
  de mexer em `next.config.ts` / export estático (`AGENTS.md`).
- Somente ASCII em nomes de arquivo, identificadores, buckets e slugs (§16).
- Nada commitado, mesclado ou publicado sem autorização expressa de Reinaldo na
  sessão (§6.6, §10).

## Modelagem de ameaça (§17.7)

- **O que pode dar errado:**
  1. Chave `service_role` ou segredo de servidor acabar no bundle estático,
     exposto a qualquer visitante.
  2. `.htaccess` com rewrite permissivo servir arquivos indevidos ou abrir
     redirect aberto.
  3. RLS mal configurada deixar A ler dados de B — falso "verde" da prova.
  4. Cache do PWA reter resposta autenticada e servir a outro usuário no mesmo
     navegador.
- **Quem seria afetado:** o próprio ambiente de homologação e, se o padrão for
  replicado, todos os tenants em produção.
- **Controle que mitiga:** revisão do bundle por scanner de segredo antes de
  publicar; `.htaccess` mínimo e revisado pelo Arquiteto; teste explícito de
  negação cruzada com dois usuários; `Cache-Control: no-store` nas respostas
  autenticadas e cache do SW só para assets versionados.
- **Teste que prova:** itens de aceite de cabeçalhos, negação cruzada A/B, e
  inspeção do bundle publicado.

## Plano de teste

- Automatizado: `npm run build` com export estático; teste de RLS (dois usuários,
  quatro operações: A→A ok, A→B nega leitura, A→B nega escrita, B→A nega).
- Manual/reproduzível: `curl -I https://homolog.plenaaplicativos.com.br` (HTTPS +
  cabeçalhos); F5 em rotas profundas; fluxo completo login → insert → select →
  Edge Function → Storage no navegador, com print/HAR; troca de versão do `sw.js`
  e verificação de adoção.
- Casos do §8.3 do plano: aplicáveis de forma reduzida (só o mecanismo de RLS por
  `owner`; o conjunto completo entra em TEN-01).

## Plano de rollback

- **Deploy:** substituir o conteúdo da pasta do subdomínio pelo pacote anterior
  (ou remover o subdomínio); passo a passo no `DEPLOY-2026-09-DD-v0.1.md`.
- **Supabase:** script de rollback da migração `homolog_ping`; remover a Edge
  Function `homolog-echo` e o bucket `homolog`. Projeto de homologação pode ser
  pausado/excluído sem impacto em produção.
- **Repositório:** reverter o commit da branch `tarefa/OPS-01-homologacao`.

## Aprovação

- **Reinaldo:** [x] aprovada em 08/09/2026
  - [x] Item: subdomínio `homolog.plenaaplicativos.com.br` + AutoSSL (via agente
        Claude do Chrome no cPanel)
  - [x] Item: projeto Supabase — usar o base "Gestão Igreja Pro"
        (`wkovbmrvpzukszmgfctd`), objetos de teste no schema `homolog`, removidos
        ao fim
  - [x] Item: `next.config.ts` com `output: 'export'`
  - [x] Item: migração descartável `homolog.homolog_ping` + RLS + Edge Function
        `homolog-echo` + bucket `homolog`
  - [x] Item: rota de homologação mínima em `app/**` (só strings técnicas)
