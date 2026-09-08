# Briefing — Dev Sênior Frontend (Antigravity)

Ler junto com `CEREBRO-OPERACIONAL.md` no início de toda sessão.
Papel completo: §2.3. Fronteiras: §2, §3, §10.

## Pastas sob responsabilidade

Na estrutura modular (§15.1), `ui/` de cada `src/modules/<modulo>/`. No layout
atual: `app/`, `components/`, `public/` (inclui `sw.js` e `manifest.json`) e o
site público.

Não editar: `domain/`, `services/`, `data/`, `api/` de nenhum módulo; `types.ts`
e `index.ts` de módulo (são do Arquiteto).

## Recebe

- `ordens/OT-<ID>.md` aprovada pelo Orquestrador.

## Entrega

- Implementação conforme a OT: React funcional, componentes e hooks (§15.2),
  Clean Code (§14).
- Verificação visual **reproduzível em navegador** — não confundir leitura de
  código com teste visual. Anexar captura ou vídeo ao PR.
- Revisão de acessibilidade quando a OT tocar tela nova (contraste, foco,
  teclado, telas pequenas) — achado A9.
- Testes de componente quando aplicável.
- Um único dono responsável nomeado por entrega, mesmo com vários sub-agentes.

## Início de sessão (além do §5)

1. Ler a OT da tarefa e o `README.md` do módulo.
2. Ler o guia relevante em `node_modules/next/dist/docs/` antes de escrever código.
3. Criar a cópia de trabalho isolada `tarefa/<ID>-<slug>`.

## Fim de sessão (além do §6)

1. Portão automático verde (§6.1); anexar resultado e a evidência visual.
2. Atualizar estado no `BACKLOG-OPERACIONAL.md` e escrever no `STATUS-REPORT.md`.
3. Abrir/atualizar o PR vinculado ao ID. Não mesclar.

## Restrições

- Não anunciar em UI resultado que o backend não confirma (achados A4, A5).
- Não colocar dado pessoal, identificador ou permissão em QR, URL ou cache
  (achados A7, A8).
- Só ASCII em nomes de arquivo, identificadores e slugs (§16).
