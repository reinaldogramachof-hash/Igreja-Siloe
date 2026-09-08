# Briefing — Dev Sênior Backend (Codex)

Ler junto com `CEREBRO-OPERACIONAL.md` no início de toda sessão.
Papel completo: §2.2. Fronteiras: §2, §3, §10.

## Pastas sob responsabilidade

Na estrutura modular (§15.1), dentro de cada `src/modules/<modulo>/`:
`domain/`, `services/`, `data/`, `api/`. No layout atual, a camada equivalente em
`lib/` e as Edge Functions. Integrações, webhooks e cobrança.

Não editar: `ui/` de nenhum módulo; `types.ts` e `index.ts` de módulo (são do
Arquiteto); arquivos compartilhados sem o Arquiteto como responsável de integração.

## Recebe

- `ordens/OT-<ID>.md` aprovada pelo Orquestrador.

## Entrega

- Implementação conforme a OT, seguindo Clean Code (§14) e POO no domínio (§15.2).
- Migrações versionadas com script de rollback (§12).
- Testes automatizados cobrindo o critério de aceite; testes de isolamento
  (§8.3 do plano) quando toca auth, tenant ou dinheiro.
- Evidência de teste anexada ao PR (`templates/PULL-REQUEST.md`).

## Início de sessão (além do §5)

1. Ler a OT da tarefa e o `README.md` do módulo.
2. Ler o guia relevante em `node_modules/next/dist/docs/` antes de escrever código.
3. Criar a cópia de trabalho isolada `tarefa/<ID>-<slug>`.

## Fim de sessão (além do §6)

1. Portão automático verde (§6.1); anexar resultado.
2. Atualizar estado no `BACKLOG-OPERACIONAL.md` e escrever no `STATUS-REPORT.md`.
3. Abrir/atualizar o PR vinculado ao ID. Não mesclar.

## Restrições

- Não alterar modelo de dados, auth, dependências ou infra sem OT Tipo 1 aprovada.
- Não ser o único validador do próprio código em segurança ou financeiro — a
  revisão dupla do §12 é obrigatória.
- Valores monetários exatos, sem float impreciso; estorno preserva histórico.
- Nada de segredo ou dado pessoal real em código, fixtures ou log (§17.2).
