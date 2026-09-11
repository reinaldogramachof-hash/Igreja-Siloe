# Pesquisa de Mercado — Preços e Planos de Concorrentes (NEG-01)

> **Documento:** Insumo de pesquisa para decisão de preços dos planos **Gestão Online (Essencial e Premium)**.  
> **Ordem de Trabalho:** `OT-NEG-01-PESQUISA.md` (Ciclo 1).  
> **Responsável:** Dev Frontend (Antigravity).  
> **Decisor final do preço (Tipo 1):** Reinaldo.  
> **Data do levantamento:** 2026-09-10.

---

## 1. Objetivo

Mapear a estrutura de planos e valores praticados pelos principais softwares de gestão para igrejas (*Church Management Software* — ChMS) no mercado brasileiro (e referências internacionais), visando embasar a definição de preços dos níveis **Essencial** e **Premium** do plano **Gestão Online** da plataforma, atualmente marcados como `[EM DEFINIÇÃO]` em `lib/plans.ts`.

---

## 2. Tabela Comparativa de Concorrentes

| Concorrente | Modelo de Cobrança | Faixas de Planos e Valores | O que Inclui / Destaques | Limites / Observações |
|---|---|---|---|---|
| **Enuves** (`enuves.com.br`) | Mensalidade por faixa (tabela pública 2026) | • **Gratuito:** R$ 0,00<br>• **Bronze:** R$ 59,00/mês<br>• **Prata:** R$ 84,00/mês<br>• **Ouro:** R$ 99,00/mês<br>• **Diamante:** R$ 109,00/mês<br>• **Esmeralda:** R$ 199,00/mês<br>• **Rubi:** R$ 249,00/mês | Cadastro de membros, grupos/células, financeiro básico a avançado, comunicação integrada. | Escala com limites de campos customizados, grupos e armazenamento. |
| **Igreja Digital** (`igreja.digital`) | Freemium + Mensalidade / Anual | • **ID Free:** R$ 0,00<br>• **ID Lite:** R$ 44,90 a R$ 69,90/mês<br>• **ID Plus / Max:** R$ 99,90 a R$ 149,90/mês | Membros, pequenos grupos, integração WhatsApp, financeiro, aplicativo próprio nos planos maiores. | ID Free limitado a 30 pessoas e 5 grupos; Lite ilimitado para 1 igreja; Plus/Max para multi-igrejas. |
| **Sigreja / Sige Igrejas** (`sigreja.com` / `sigeigrejas.com.br`) | Mensalidade fixa (igreja única vs. sedes) | • **Inicial:** R$ 89,00/mês<br>• **Avançado:** R$ 139,00/mês<br>• **Sede + 10:** R$ 169,00/mês<br>• **Sede + 30:** R$ 289,00/mês<br>• **Sede + 50:** R$ 399,00/mês | Secretaria, financeiro com Pix nativo, PWA, carteirinhas, gestão de filiais/congregações na linha Sede. | Desconto de 20% no pagamento anual; foco em congregações com filiais. |
| **Eklesia** (`eklesia.com.br`) | Mensalidade por porte / membros | • **Inicial:** a partir de R$ 45,00/mês<br>• **Médio Porte:** R$ 90,00 a R$ 150,00/mês<br>• **Grande Porte:** sob consulta | Gestão ministerial, financeiro tradicional, células e ministério infantil (kids). | Marca tradicional no Brasil; valores variam conforme número de membros. |
| **Igreja Conectada** (`igrejaconectada.com.br`) | Mensalidade fixa em nuvem | • **Faixa de Entrada:** R$ 79,90/mês<br>• **Completo / Multi:** R$ 129,90 a R$ 169,90/mês | Gestão de membros, finanças, células, site institucional com transmissão e hospedagem inclusos. | Não cobra taxas adicionais de suporte ou migração. |
| **ePastor** (`epastor.com.br`) | Mensalidade / Planos modulares | • **Básico:** ~R$ 39,90 a R$ 69,90/mês<br>• **Intermediário:** ~R$ 130,00 a R$ 190,00/mês<br>• **Enterprise:** até R$ 299,90+/mês | Membresia, financeiro, WhatsApp nativo, IA para artes e reconhecimento facial. | Teste de 14 dias grátis; planos superiores incluem congregações e suporte VIP. |
| **Atos6** (`atos6.com`) | Consultivo / Customizado (Médio e Grande porte) | • **Estimativa de mercado:** R$ 150,00 a R$ 400,00+/mês | Pastoreio avançado, células com mapa, gestão financeira robusta, plataforma de cursos e aplicativo mobile. | Não divulga tabela aberta; focado em média e alta liderança e denominações. |
| **inChurch** (`inchurch.com.br`) | Consultivo / Enterprise | • **Estimativa de mercado:** R$ 180,00 a R$ 600,00+/mês (+ taxa de 4,99% em eventos) | Aplicativo mobile nativo customizado nas lojas (iOS/Android), multigestão sede/filiais, módulos completos. | Focado em grandes congregações e redes; exige processo de implantação e setup. |
| **ChurchTrac** (`churchtrac.com` — Ref. Internacional) | Mensalidade base em dólar | • **Base:** $29/mês (~R$ 160 a R$ 180/mês)<br>• **Add-ons:** +$7/mês a +$15/mês | All-in-one: membros, dízimos, presença, escalas e contabilidade básica. | Referência global de software de baixo custo para pequenas e médias igrejas. |

---

## 3. Posicionamento Atual dos Nossos Planos Já Definidos

| Nosso Plano | Preço Definido | Posicionamento no Mercado | Vantagem Competitiva |
|---|---|---|---|
| **Modelo de Entrada** | **R$ 399,90 (pagamento único vitalício)** | **Inovador e sem concorrente direto.** O mercado opera 100% em modelo de mensalidade recorrente (SaaS). | Atende congregações no início, plantações de igrejas e líderes que rejeitam mensalidades fixas. Funciona offline (LocalStorage) em PWA ágil. |
| **Gestão Lite** | **R$ 69,90/mês** | **Extremamente competitivo na faixa de entrada.** (Concorrentes diretos cobram entre R$ 44,90 e R$ 89,00). | Já inclui os 4 módulos essenciais (Membros, Célula, Agenda e Financeiro) com nuvem e sem pegadinhas de limite oculto. |

---

## 4. Proposta de Faixas de Preço para Gestão Online (Essencial e Premium)

Com base nas médias praticadas pelo mercado nacional para softwares intermediários e avançados com nuvem, propõem-se as seguintes faixas para validação e decisão de Reinaldo:

### 4.1 Gestão Online — Nível Essencial
* **Faixa sugerida:** **R$ 119,90 a R$ 149,90 / mês** *(Ponto central recomendado: **R$ 129,90/mês**)*
* **Público-alvo:** Igrejas com 50 a 300 membros, múltiplas células e mais de um operador (pastor, tesoureiro, secretária).
* **Justificativa de Mercado:**
  1. Cria um degrau de valor coerente em relação ao plano Lite (R$ 69,90) ao desbloquear multi-células, múltiplos operadores e relatórios de centro de custo.
  2. Alinha-se diretamente com os planos intermediários mais vendidos do mercado (Enuves Diamante a R$ 109,00, Sigreja Avançado a R$ 139,00, Igreja Conectada a R$ 129,90).
  3. Garante margem de contribuição saudável para sustentar os custos incrementais de banco de dados multi-tenant e suporte.

### 4.2 Gestão Online — Nível Premium
* **Faixa sugerida:** **R$ 229,90 a R$ 299,90 / mês** *(Ponto central recomendado: **R$ 249,90/mês**)*
* **Público-alvo:** Igrejas de médio/grande porte (acima de 300 membros), sedes com congregações/filiais, redes ministeriais integradas.
* **Justificativa de Mercado:**
  1. Planos que cobrem sedes + filiais ou congregações ilimitadas praticam valores entre R$ 199,00 e R$ 399,00 (Enuves Rubi R$ 249,00, Sige Sedes R$ 289,00, inChurch/Atos6 acima de R$ 350,00).
  2. O valor de R$ 249,90 posiciona o produto como uma solução completa e de alto nível, mantendo-se mais acessível e fácil de implantar do que as soluções Enterprise tradicionais (que cobram taxas pesadas de setup).
  3. Permite oferecer suporte prioritário e recursos avançados de auditoria e relatórios consolidados para a liderança executiva.

---

## 5. Resumo da Estrutura Comercial Sugerida para o Portfólio

```
[ Modelo de Entrada ]  ────────►  R$ 399,90 (pagamento único vitalício - LocalStorage)
[ Gestão Lite ]        ────────►  R$ 69,90 / mês (1 célula, 4 módulos essenciais em nuvem)
[ Gestão Online Essencial ] ───►  [ Sugestão: R$ 129,90 / mês ] (multi-células, multi-operadores)
[ Gestão Online Premium ]   ───►  [ Sugestão: R$ 249,90 / mês ] (sedes/filiais, relatórios executivos)
```

> **Nota:** Em conformidade com a `OT-NEG-01-PESQUISA`, `lib/plans.ts` mantém os campos como `[EM DEFINIÇÃO]` até que Reinaldo aprove expressamente os valores oficiais (Decisão Tipo 1).
