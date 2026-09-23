# Contrato — Webhook de Geração de Proposta

Entrada programática do workflow **Geração de Proposta** (`EQ3YEDcPysyaFlZp`), em paralelo ao Form Trigger (`01_form_trigger`). As duas entradas convergem em `00_normaliza_entrada` e seguem pelo mesmo pipeline (cálculo → template → PDF → e-mail → RD Station → `base_funil_completo`).

## Requisição

```
POST https://raregoat-n8n.cloudfy.live/webhook/geracao-proposta
Content-Type: application/json
X-Webhook-Token: <token>
```

- **Token:** aba `tokens` da planilha "Leads Site", linha `service = geracao_proposta_webhook`, coluna `access_token`. O valor não fica versionado; para trocar, basta editar essa célula (vale na próxima chamada).
- Cloudflare bloqueia User-Agents que não sejam de navegador: chamadas de script precisam enviar um `User-Agent` de navegador.

## Respostas

| HTTP | Corpo | Significado |
|---|---|---|
| 202 | `{"status":"accepted","message":"Proposta em processamento"}` | Token válido. A resposta sai **antes** da geração (fire-and-forget); o resultado real se confere pela execução no n8n, pelo Resend e pela `base_funil_completo`. |
| 401 | `{"status":"unauthorized","message":"Token invalido ou ausente"}` | Token errado, ausente, ou linha do token não encontrada na planilha. Nada é processado. |
| 404 | — | Método diferente de POST. |

## Corpo (JSON)

As chaves são **os rótulos exatos do formulário**, com acento, maiúsculas e espaços. O pipeline lê vários campos pelo rótulo literal (`20e_grava_base_funil_proposta` usa `['Razão Social']`, `['CNPJ']` e `['Soluções'].join(...)`, e `chama_criacao_lead_form2` usa `['E-mail']`, `['Nome Contato']` etc.). Aliases em snake_case **não** funcionam em todos os nós.

### Obrigatórios

| Chave | Tipo | Observação |
|---|---|---|
| `Razão Social` | string | |
| `CNPJ` | string | Com ou sem máscara. CNPJ inativo/inválido desvia para revisão manual. |
| `Nome Contato` | string | |
| `Sobrenome contato` | string | `c` minúsculo. |
| `E-mail` | string | Com hífen. |
| `Telefone` | string | Com ou sem máscara. |
| `Soluções` | **array** de strings | Valores: `"TEF"`, `"Link de Pagamento/Gateway"`, `"C6 Pay"`, `"Conta C6 Bank"`. Mande sempre um array, mesmo com um item só. |

### Opcionais

| Chave | Tipo | Observação |
|---|---|---|
| `lead_id` | string | ID da negociação no RD Station. Vazio/ausente cria o lead via `Sub_Criar_Lead_RDStation`; preenchido atualiza a negociação existente (sem duplicar). |
| `ref` | string | `"site_institucional"` grava a origem "Lead site institucional". |
| `Sistema PDV` | string | |
| `Quantidade de lojas (CNPJs)` | número ou string numérica | Vazio conta como 1 loja. |
| `Quantidade de PDVs (caixas)` | número ou string numérica | |
| `Volume transações Link / Gateway` | string | Uma das opções: `"Até 200"`, `"201 a 600"`, `"601 a 1000"`, `"1001 a 1500"`, `"1501 a 3000"`, `"3001 a 6000"`, `"6001 a 10000"`, `"Acima de 10000"`. `"Acima de 10000"` dispara o escalonamento (`13_email_escalonamento`). |
| `TPV` | string | `"Até R$8 mil"`, `"R$8 mil a R$30 mil"`, `"Acima de R$30 mil"`. |
| `Modelo Recebimento` | string | `"Receba amanhã (taxa levemente maior)"` ou `"Receba em até 31 dias (a taxa mais baixa do mercado)"`. |

O consentimento LGPD (checkbox do formulário) não é lido por nenhum nó. Quem chama o webhook é responsável por já ter o consentimento do lead.

## Exemplo

```bash
curl -X POST "https://raregoat-n8n.cloudfy.live/webhook/geracao-proposta" \
  -A "Mozilla/5.0" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Token: $TOKEN" \
  -d '{
    "Razão Social": "Empresa Exemplo LTDA",
    "CNPJ": "00.000.000/0001-00",
    "Nome Contato": "Maria",
    "Sobrenome contato": "Silva",
    "E-mail": "maria@exemplo.com.br",
    "Telefone": "(11) 90000-0000",
    "Soluções": ["TEF"],
    "Quantidade de lojas (CNPJs)": 3,
    "Quantidade de PDVs (caixas)": 10,
    "lead_id": "<id da negociação no RD, se já existir>"
  }'
```

## Fluxo interno

`01b_webhook_trigger` → `01c_busca_token_webhook` (lê a aba `tokens`) → `01d_valida_token`
- TRUE → `01e_responde_aceito` (202) **e** `00_normaliza_entrada` → `checa_lead_id` → pipeline normal
- FALSE → `01f_responde_nao_autorizado` (401)

`00_normaliza_entrada` lê o body direto de `$('01b_webhook_trigger')` quando o webhook executou, porque o `01c` (Google Sheets) sobrescreve o item corrente. No caminho do formulário, usa o próprio item do `01_form_trigger`.
