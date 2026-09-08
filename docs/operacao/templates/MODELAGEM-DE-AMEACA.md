# Modelagem de ameaça — parágrafo da OT (§17.7)

Preencher quando a tarefa toca autenticação, tenant, dinheiro ou dado pessoal.
Curto e concreto — não é um documento à parte, é um parágrafo dentro da OT.

## Estrutura

- **O que pode dar errado:** <abuso, erro de autorização, vazamento entre
  tenants, valor manipulado no cliente, PII exposta em log/URL/QR/cache…>
- **Quem seria afetado:** <qual igreja, qual pessoa, qual dado>
- **Controle que mitiga:** <verificação no servidor, RLS, validação de schema,
  identificador opaco, rate limiting, auditoria…>
- **Teste que prova:** <caso automatizado + caso do §8.3 do plano aplicável>

## Exemplo preenchido

- **O que pode dar errado:** um operador da igreja A altera o `orgId` na
  requisição e lê lançamentos financeiros da igreja B.
- **Quem seria afetado:** todas as igrejas; dados financeiros.
- **Controle que mitiga:** `orgId` derivado da sessão no servidor, nunca do
  corpo; RLS por organização em `lancamentos`; endpoint valida vínculo ativo.
- **Teste que prova:** teste de isolamento §8.3 caso 2 e caso 3; teste unitário
  que rejeita `orgId` divergente da sessão.
