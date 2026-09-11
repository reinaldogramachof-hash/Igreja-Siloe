# Ordem de Trabalho — OT-CODEX-LOGO

## Identificação

- **ID / título:** criação do logotipo (marca) do produto
- **Tipo:** 1 (marca, §4)
- **Ciclo:** CICLO-01
- **Responsável:** Codex (Dev Backend) — geração via código (SVG vetorial)
- **Revisor:** Arquiteto + Reinaldo (aprovação de marca é sempre dele)

## Objetivo

Substituir o `logo.svg` atual (170KB, é uma imagem PNG antiga embutida em
base64 dentro do SVG — não é um logotipo de verdade) por um logotipo
vetorial real, simples e legível em qualquer tamanho, para aplicar nos
pontos-chave do sistema.

## Contexto de marca (já validado nesta sessão)

- Nome atual (neutro, em `lib/brand.ts`): "Gestão de Igrejas".
- Tom de marca já estabelecido na Landing Page: acolhedor, pastoral,
  comunitário — deliberadamente **não** parece "SaaS/tech genérico".
- Produto: gestão para igrejas (membros, células, agenda, avisos,
  tesouraria, eventos) — múltiplos tenants, não é mais ligado à Igreja
  Siloé (DEC-026).

## Onde o logotipo é aplicado (pipeline já existe)

- `logo.svg` na raiz do repositório é o arquivo-fonte.
- `scripts/generate-icons.mjs` lê esse arquivo e gera automaticamente:
  ícones PWA (72 a 512px), `apple-touch-icon.png` (180px) e
  `favicon-32x32.png` (32px) em `public/`.
- Usado hoje em: tela de login (`app/(auth)/login/page.tsx`, atualmente
  `<Image src="/logo.svg">` em ~340px), navbar da Landing Page, manifest do
  PWA.

## Escopo

### Prompt para o Codex gerar o logotipo

> Crie um logotipo vetorial (SVG puro, sem imagem raster embutida, sem
> base64) para o produto "Gestão de Igrejas" — um SaaS de gestão para
> igrejas evangélicas brasileiras (membros, células, agenda, avisos,
> tesouraria, eventos).
>
> **Conceito:** um símbolo simples que remeta a comunidade/cuidado/igreja
> sem ser um clichê genérico de "cruz" isolada nem um ícone de "software
> corporativo". Sugestões de direção (escolha uma ou combine):
> - Um telhado/casa estilizado (referência a "lar"/comunidade que já
>   acolhe visitantes) combinado com uma forma de pessoas/união.
> - Um símbolo abstrato de "encontro"/"reunião" (círculos ou formas
>   simples se conectando).
> Evite: fotos, gradientes complexos, detalhes que somem em tamanho
> pequeno (o logotipo precisa continuar legível a 32px de favicon).
>
> **Requisitos técnicos:**
> - SVG com paths/shapes vetoriais reais (`<path>`, `<circle>`, etc.) —
>   nunca `<image>` com base64 embutido.
> - `viewBox` quadrado (ex.: `0 0 100 100`), pronto para redimensionar sem
>   perder proporção.
> - Funciona bem tanto sobre fundo claro quanto escuro (o app tem tema
>   escuro na tela de login) — ou forneça uma variante para cada, se
>   necessário.
> - Paleta: usar o tom "accent" já usado no produto (azul/teal — ver
>   `app/globals.css` para o valor exato da cor `--accent`/`--primary`) ou
>   propor uma paleta nova coerente com o tom acolhedor da marca — se
>   propuser cor nova, justificar.
> - Sem texto embutido no SVG (o nome "Gestão de Igrejas" já é renderizado
>   como texto separado ao lado do símbolo nas telas que usam os dois
>   juntos — ver navbar da Landing Page como referência).
> - Arquivo final enxuto (poucos KB, não centenas) — é ícone, não
>   ilustração.
>
> **Entregável:** `logo.svg` pronto para substituir o arquivo atual na
> raiz do repositório, mais confirmação de que
> `node scripts/generate-icons.mjs` roda sem erro e gera os PNGs
> corretamente a partir dele.

### Fora de escopo

- Nome comercial final (segue "Gestão de Igrejas" por ora — troca de nome é
  decisão à parte).
- Paleta de cor completa do produto (isso é `lib/brand.ts` + design system,
  não esta OT — só a cor do próprio logotipo).
- Aplicar o novo logo em todas as telas do app interno — só confirmar que
  `logo.svg` na raiz está substituído e o script de ícones roda; o
  Arquiteto integra o restante.

## Critério de aceite

- [ ] `logo.svg` é SVG vetorial puro (sem base64/imagem embutida)
- [ ] Legível a 32×32 (favicon)
- [ ] `node scripts/generate-icons.mjs` roda sem erro
- [ ] Arquivo final pequeno (ordem de KB, não centenas)
- [ ] Sem menção/referência à Igreja Siloé em qualquer forma

## Aprovação

- **Reinaldo:** [x] autorizado em 10/09/2026 (pedido direto na sessão) —
  aprovação final do resultado visual ainda pendente, por ser decisão de
  marca (§4)
