# Codel Reciclagem — site institucional

Site estático gerado com [Eleventy](https://www.11ty.dev/) e publicado na Vercel.
Não usa banco de dados e não tem ligação com o SisCodel.

## Onde editar o conteúdo

| O quê | Arquivo |
|---|---|
| Dados da empresa (telefone, endereço, horário, e-mails) | `src/_data/empresa.json` |
| Números da faixa azul | `src/_data/numeros.json` |
| Homologações (ABREE, Circulare, Green Eletron, Reciclus) | `src/_data/parceiros.json` |
| Pontos de coleta | `src/_data/pontos.json` |
| Perguntas frequentes | `src/_data/faq.json` |
| O que recebemos / não recebemos | `src/_data/materiais.json` |
| Menu | `src/_data/navegacao.json` |
| Textos das páginas | `src/*.njk` |

## Regras que não podem quebrar

- **GTM `GTM-PJZ258XN`** em todas as páginas (`src/_includes/base.njk`).
- **Links de WhatsApp sempre com `api.whatsapp.com`** (use o filtro `| whats`). O gatilho de conversão do Google Ads no GTM é "Click URL contém whatsapp" — links `wa.me` não seriam contados.
- Telefone sempre como `tel:+5534996723880`.
- Endereços antigos do WordPress mantidos: `/sobre-nos/`, `/processo/`, `/faqs/`, `/pontos-de-coleta/`, `/compradesucata/`, `/vendadeusados/`, `/logistica-reversa/`.

## Eventos enviados ao GTM

- `formulario_orcamento` — envio do formulário de orçamento (`forma`: email ou whatsapp)
- `clique_telefone` — clique em link de telefone

## Rodar no computador

```
npm install
npm run dev
```
