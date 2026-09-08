# Pacotes de deploy

Um arquivo por deploy, nomeado `DEPLOY-AAAA-MM-DD-vX.Y.md`.

Regras em `CEREBRO-OPERACIONAL.md` §9:

- Nenhum deploy sem a linha "Aprovação expressa — Reinaldo" preenchida.
- Não há automação de deploy de nenhuma natureza.
- O pacote registra escopo, IDs do backlog, migrações e ordem, passos de
  rollback, evidência de homologação e checklist LGPD quando toca dado pessoal.

Template:

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
