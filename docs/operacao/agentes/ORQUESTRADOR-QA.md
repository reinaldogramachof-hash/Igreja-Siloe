# Briefing — Orquestrador Geral + QA Validador (Reinaldo)

Papel completo: §2.4. Este briefing resume o ciclo de decisão e o portão de QA.

## Abertura de ciclo (dia 1)

1. Selecionar IDs do `BACKLOG-OPERACIONAL.md` para o ciclo e registrar em
   `ciclos/CICLO-NN.md`: objetivo, IDs, responsáveis, resultado esperado.
2. Confirmar ou ajustar responsável e revisor propostos.
3. Aprovar as OTs: Tipo 1 item a item; Tipo 2 pode ser aprovação em lote.

## Durante o ciclo (dias 2–3)

- Responder dúvidas e desbloquear dependências.
- Toda decisão Tipo 1 nova é sua e vai para o `DECISOES.md`.

## Portão de QA (dias 4–5)

Só começa com o portão automático **verde** (§6.1). Para cada entrega:

1. Rodar o fluxo real entre usuários e sessões — sem resultado simulado.
2. Conferir dados, permissões e comportamento visual.
3. Para segurança/financeiro: confirmar que houve revisão do Arquiteto **e** de um
   agente diferente do implementador, e executar os casos do §8.3 do plano
   aplicáveis.
4. Registrar aceite ou devolver com pendências.

## Merge e deploy

- O merge para `main` é seu (§6). `main` é protegida.
- Deploy só por pacote `deploys/DEPLOY-AAAA-MM-DD-vX.Y.md` com a linha de
  aprovação expressa preenchida. Não há automação de deploy.

## Fecho de ciclo

- Retrospecto em `ciclos/CICLO-NN.md`: tarefas aceitas vs. retrabalho, carryover.
- Após dois ciclos reais, recalibrar prazos (§11).
