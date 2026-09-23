# Monitor_Propostas_Erros

Workflow `GwoC1YXl5G1LH32u`. **Criado inativo** — os Schedule Triggers só disparam depois de ativado.

## O que faz

| Etapa | Quando | O quê |
|---|---|---|
| 1. Coleta | a cada 2h, 08h–20h (America/Sao_Paulo) | Execuções com erro do Geração de Proposta nas últimas 26h. Só `mode = webhook` (formulário ou webhook real); ignora execuções manuais/de teste e as já registradas. |
| 2. Classificação | mesma rodada | Causa + status, gravados na aba `propostas_pendentes_reenvio`. |
| 3. Alerta | mesma rodada, se houver falha nova | Mensagem no `#funil-erros`. O Painel lê a aba (seção "Propostas com Falha" + alertas). |
| 4. Reenvio | 21h (00h UTC, quando a cota diária do Resend reinicia) | Reenvia cada `pendente` pelo `POST /webhook/geracao-proposta`, um por vez, localiza a execução nova pelo `reenvio_ref`, confirma o e-mail no Resend (GET) e atualiza a aba. Resumo no `#funil-erros`. |

Ruído ignorado: razão social começando com `ZZ_` ou contendo "teste".

## Causas

`cota_resend` ("daily email sending quota"), `rede` (ECONNRESET, "connection … closed unexpectedly", timeouts), `rate_limit` ("too many requests", 429), `schema_cache` ("Column names were updated after the node's setup"), `cnpj_invalido`, `nao_identificada`.

## Status na aba `propostas_pendentes_reenvio`

| Status | Significado | Quem muda |
|---|---|---|
| `pendente` | Será reenviada às 21h. | Monitor |
| `reenviado` | Reenvio feito; `resultado_ultima_tentativa` diz se o Resend já confirmou `delivered`. | Monitor |
| `resolvido_automaticamente` | `base_funil_completo` mostra "Proposta Enviada" depois do erro (cliente reenviou o formulário, reenvio manual etc.). | Monitor |
| `substituido` | Havia falha mais recente do mesmo lead (CNPJ/e-mail); só a mais recente é reenviada. | Monitor |
| `revisao_manual` | Não se resolve com reenvio: proposta **já entregue** e falha depois do envio (reenviar duplicaria a proposta ao cliente), `schema_cache`, `cnpj_invalido`, execução sem dados, ou limite de **3 tentativas / 3 dias** atingido. Gera alerta 🔴 no Painel. | Monitor |
| `descartado_teste` | Execução de teste registrada à mão para o monitor ignorar (sem alerta, sem reenvio). | Pessoa |
| `resolvido_manual` (ou qualquer outro valor) | Depois de tratar um caso de revisão manual, **troque o status na planilha** — o alerta 🔴 some na próxima carga do Painel. | Pessoa |

## Garantias

- O reenvio usa o payload original e o `lead_id` criado na própria execução que falhou — não cria lead/negociação duplicada no RD.
- Falha depois do `18_email_proposta` nunca é reenviada automaticamente.
- Uma falha do próprio reenvio não vira linha nova: continua na linha original (`tentativas` + 1).
- Erros do próprio monitor vão para o Mission Control (errorWorkflow).

## Para ativar (Parte C)

1. Ativar o workflow no n8n.
2. Incluir `Monitor_Propostas_Erros` em `06a_workflows_criticos` do Painel com janela de 12h (o maior intervalo sem rodada é das 21h às 08h).
