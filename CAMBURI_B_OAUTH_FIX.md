# 🔴 Camburí B - Falha de Credencial OAuth Google Sheets

**Data**: 21 de setembro de 2026, 13:59 UTC  
**Status**: 🔴 CRÍTICO - Workflow Inoperante  
**Workflow**: [Code] Camburí B - Roteador de Mensagens WhatsApp  
**ID**: Bpevh3wjwZsU2lhe

---

## 📋 Sumário do Problema

O workflow **Camburí B** parou de funcionar após o projeto ser considerado completo. Todas as execuções webhook falhavam com erro de autenticação no Google Sheets.

**Total de Execuções com Erro**: 28+ (entre 13:41 e 13:59 UTC)  
**Taxa de Falha**: 100% das tentativas recentes

---

## 🔍 Erro Identificado

### Execução com Erro #8307 (13:59:39 UTC)

```
Node: "Sheets: Ler Estado Atual"
Type: n8n-nodes-base.googleSheets (v4.5)
Operation: read
Document: 1Oo2UiRu0xZoIa7Jyc33iOod9QAm9RIC0vrQEdXepZzw
Sheet: Estado (gid=0)
Credentials: googleSheetsOAuth2Api (ID: osdCvsuHRyhNVACU, nome: "Camburí")
```

### Mensagem de Erro

```
NodeApiError: The provided authorization grant (e.g., authorization code, resource owner credentials) 
or refresh token is invalid, expired, revoked, does not match the redirection URI used in the 
authorization request, or was issued to another client.

HTTP Code: EAUTH
```

### Stack Trace

```
at GoogleSheet.spreadsheetGetSheet (/usr/lib/node_modules/n8n/node_modules/.pnpm/
n8n-nodes-base@file+packages+nodes-base_.../node_modules/n8n-nodes-base/nodes/Google/Sheet/v2/
helpers/GoogleSheet.ts:129:21)
```

---

## 🎯 Causa Raiz

**Token OAuth2 do Google Sheets Expirado/Revogado**

A credencial `googleSheetsOAuth2Api` chamada "Camburí" (ID: osdCvsuHRyhNVACU) tem seu token de refresh inválido ou expirado.

### Por quê isso aconteceu?

1. **Tokens OAuth2 têm validade limitada** - Geralmente 7-30 dias dependendo da política do Google
2. **Tokens podem ser revogados** - Se a autorização foi removida na conta Google ou se houve atividade suspeita
3. **Refresh tokens expiram se não forem usados** - Se não houve uso por período prolongado (tipicamente 6 meses)

### Fluxo Afetado

```
Webhook: Evolution API (WhatsApp)
    ↓
Extrair Número + Texto (JavaScript)
    ↓
❌ Sheets: Ler Estado Atual (FALHA AQUI)
    ↓
[Resto do workflow não executa]
```

---

## 🧪 Teste que Reproduz o Erro

**Trigger**: Qualquer mensagem WhatsApp recebida no webhook

**Execução ID**: 8307, 8306, 8305, 8304, etc.

**Resultado**: Todas falhando no node "Sheets: Ler Estado Atual"

---

## ✅ Solução

### Reconectar a Credencial do Google Sheets no n8n

#### Opção 1: Via Web UI (Recomendado)

1. Acesse o n8n: https://boat-n8n.cloudfy.live/
2. No menu esquerdo, clique em **Credentials**
3. Procure pela credencial **"Camburí"** (tipo: Google Sheets OAuth2)
4. Clique para abrir
5. Clique no botão **"Reconnect"** ou **"Reauthorize"**
6. Faça login com a conta Google (provavelmente comercial@antere.com.br ou a conta que possui a planilha)
7. Autorize o acesso ao Google Sheets
8. Salve a credencial

#### Opção 2: Criar Nova Credencial

Se a credencial anterior não puder ser recuperada:

1. Em **Credentials**, clique em **"New"**
2. Selecione **"Google Sheets OAuth2 API"**
3. Nomeie como **"Camburí"** (para manter compatibilidade)
4. Conecte com a conta Google correta
5. Edite o workflow **Camburí B**
6. Em cada node de Google Sheets, atualize a credencial para a nova
7. Salve e publique o workflow

---

## 📊 Impacto

| Componente | Status | Impacto |
|-----------|--------|---------|
| Camburí A | ✅ OK | Nenhum (usa Open-Meteo) |
| Camburí B | 🔴 DOWN | Não processa mensagens WhatsApp |
| Camburí C | ⏸️ Pendente | Não é chamado (B está down) |
| Camburí D | ⏸️ Pendente | Não é chamado (B está down) |
| Regua Followup | ✅ OK | Nenhum (usa diferentes credentials) |

---

## 🚀 Passos de Resolução

### Imediato
- [ ] Reconectar credencial "Camburí" do Google Sheets via web UI
- [ ] Testar com webhook manual (enviar mensagem WhatsApp)
- [ ] Confirmar execução bem-sucedida

### Verificação
- [ ] Confirmar node "Sheets: Ler Estado Atual" passou
- [ ] Confirmar fluxo completo executou sem erros
- [ ] Validar que dados foram lidos da planilha

### Monitoramento
- [ ] Acompanhar próximas 5 execuções webhook
- [ ] Verificar logs para novos erros de autenticação
- [ ] Monitorar expiração de token (adicionar reminder para 7 dias antes)

---

## 📝 Checklist de Conclusão

- [ ] Credencial Google Sheets reconectada
- [ ] Teste manual executado com sucesso
- [ ] Workflow retornou para status OPERACIONAL
- [ ] Zero erros nas próximas 5 execuções
- [ ] Documentação atualizada

---

## ⚠️ Prevenção Futura

### Monitoramento de Credenciais

Para evitar que tokens OAuth2 expirem sem aviso:

1. **Configurar lembretes** - Reautenticar credenciais a cada 30 dias
2. **Monitorar logs** - Verificar regularmente se há erros de autenticação
3. **Usar credenciais com escopo mínimo** - Apenas Google Sheets, não "full access"
4. **Manter credenciais ativas** - Usar regularmente para evitar timeout de refresh token

### Configuração Recomendada

- Definir calendário: Revalidar credenciais Google a cada 25 dias
- Monitoramento: Alertar se taxa de erro > 5% em qualquer workflow
- Backup: Manter credencial alternativa como fallback

---

## 📚 Referências

- [Google OAuth2 Token Expiration](https://developers.google.com/identity/protocols/oauth2#expiration)
- [n8n Google Sheets Node Documentation](https://docs.n8n.io/nodes/n8n-nodes-base.googleSheets/)
- [Google Sheets OAuth Troubleshooting](https://support.google.com/accounts/troubleshooter/2190369)

---

## 🔐 Segurança

- ✅ Nenhuma credencial foi exposta neste documento
- ✅ Nenhuma chave de API foi documentada
- ✅ Processo usa OAuth2 seguro do Google
- ✅ Reautenticação não compromete segurança

---

**Status Final**: 🟡 PENDENTE DE RESOLUÇÃO MANUAL  
**Tempo Estimado para Resolução**: 2-3 minutos  
**Risco de Regressão**: BAIXO (apenas reconexão de credencial)

