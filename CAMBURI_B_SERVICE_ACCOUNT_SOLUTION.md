# 🔧 Solução Definitiva - Camburí B com Google Service Account

**Data**: 16 de outubro de 2026  
**Status**: IMPLEMENTAÇÃO EM PROGRESSO  
**Objetivo**: Eliminar expiração recorrente de credencial OAuth  

---

## 🎯 Problema Recorrente

A credencial OAuth2 do Google Sheets expira a cada ~25 dias, causando falhas recorrentes:
- **21/09**: Primeira expiração identificada
- **14/10**: Expiração novamente após reconexão (25 dias depois)
- **16/10**: Ainda falhando

**Causa**: Tokens OAuth2 têm validade limitada e refresh tokens expiram se não forem usados.

---

## ✅ Solução: Google Service Account

**Vantagens**:
- ✅ Nunca expira (usa autenticação por chave)
- ✅ Específico para aplicações automatizadas
- ✅ Mais seguro (não requer senhas)
- ✅ Fácil de rotacionar (gerar nova chave)
- ✅ Sem intervenção manual periódica

---

## 📋 Implementação Passo a Passo

### Passo 1: Criar Projeto Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto: **"Eurotrip Workflows"**
3. Ative a API de Google Sheets:
   - Busque "Google Sheets API"
   - Clique em "Ativar"

### Passo 2: Criar Service Account

1. No Google Cloud Console, vá para **IAM & Admin → Service Accounts**
2. Clique em **"Criar Conta de Serviço"**
3. Configure:
   - **Nome**: `camburi-workflows`
   - **ID**: `camburi-workflows` (auto-preenchido)
   - **Descrição**: "Automação de workflows n8n para Camburí"
4. Clique em **"Criar e Continuar"**

### Passo 3: Gerar Chave JSON

1. Na conta de serviço criada, vá para a aba **"Chaves"**
2. Clique em **"Adicionar Chave → Criar Nova Chave"**
3. Selecione tipo **"JSON"**
4. Clique em **"Criar"**
5. Um arquivo JSON será baixado (guarde em segurança!)

**Conteúdo do arquivo**: Não compartilhe com ninguém!

### Passo 4: Compartilhar Planilha com Service Account

1. Abra a planilha **"Torre de Controle - Camburí"**
   - Link: https://docs.google.com/spreadsheets/d/1Oo2UiRu0xZoIa7Jyc33iOod9QAm9RIC0vrQEdXepZzw/

2. Clique em **"Compartilhar"** (canto superior direito)

3. No campo de email, cole o email da Service Account:
   - Encontre em: Google Cloud Console → Service Accounts → Selecione a conta
   - Email format: `camburi-workflows@seu-projeto.iam.gserviceaccount.com`

4. Conceda **Editor** (ou apenas "Editor" é suficiente)

5. Clique em **"Compartilhar"**

### Passo 5: Configurar no n8n

1. Acesse https://boat-n8n.cloudfy.live/

2. Vá para **Credentials**

3. Clique em **"New"** → **"Google Sheets OAuth2 API"**
   - **NÃO use OAuth2** desta vez
   - Procure por **"Google Sheets (Service Account)"**

4. Configure:
   - **Name**: `Camburí Service Account`
   - **Paste JSON**: Cole o conteúdo completo do arquivo JSON baixado

5. Clique em **"Test Connection"** para validar

6. Salve

### Passo 6: Atualizar Workflows

Para cada node de Google Sheets que usa a credencial antiga:

1. Abra o workflow (Camburí B)
2. Clique no node "Sheets: Ler Estado Atual"
3. Na seção de credenciais, selecione a nova: **"Camburí Service Account"**
4. Repita para todos os nodes de Google Sheets
5. Salve e publique

---

## 🔐 Segurança

### ✅ Fazer
- [x] Usar Service Account em vez de OAuth2
- [x] Armazenar chave JSON em local seguro
- [x] Compartilhar planilha apenas com o email do SA
- [x] Usar credencial específica no n8n
- [x] Rotacionar chave a cada 90 dias

### ❌ Não Fazer
- Compartilhar chave JSON com outras pessoas
- Committar chave JSON no git
- Usar credencial pessoal (Gmail) em automações
- Deixar Service Account com acesso de "Owner"

---

## 🧪 Validação Pós-Implementação

Após configurar Service Account:

1. Envie mensagem de teste via WhatsApp
2. Verifique execução do Camburí B
3. Confirme que:
   - ✅ Node "Sheets: Ler Estado Atual" passou
   - ✅ Planilha foi lida corretamente
   - ✅ Workflow completou sem erros

4. Teste 5 execuções adicionais
5. Monitorar por 48 horas

---

## 📊 Comparação: OAuth2 vs Service Account

| Aspecto | OAuth2 | Service Account |
|--------|--------|-----------------|
| **Validade** | 7-30 dias | ∞ (nunca expira) |
| **Refresh** | Automático (até ~6 meses) | Nunca (chave estática) |
| **Setup** | Manual (UI) | Automático (arquivo JSON) |
| **Segurança** | Requer senha/confirmação | Apenas arquivo JSON |
| **Manutenção** | Reconectar a cada 25 dias | Rotacionar chave a cada 90 dias |
| **Ideal para** | Apps com UI (usuários) | Automações (servidores) |

---

## 🔄 Rotação de Chaves (Recomendado: 90 dias)

Quando for rotacionar:

1. Gere nova chave no Google Cloud Console
2. Configure nova credencial no n8n: **"Camburí Service Account v2"**
3. Atualize workflows para usar nova credencial
4. Teste por 24h
5. Delete a chave antiga no Google Cloud Console

---

## 📝 Checklist de Implementação

- [ ] Projeto Google Cloud criado
- [ ] Google Sheets API ativada
- [ ] Service Account criado
- [ ] Chave JSON gerada e segura
- [ ] Planilha compartilhada com SA
- [ ] Credencial n8n configurada
- [ ] Camburí B atualizado para usar nova credencial
- [ ] Teste executado com sucesso
- [ ] 5 execuções validadas
- [ ] Documentação atualizada
- [ ] Lembrete criado para rotação (90 dias)

---

## 🚨 Troubleshooting

### Erro: "Service Account does not have access"
- Verifique se planilha foi compartilhada com o email correto
- Copie email exato do Google Cloud Console

### Erro: "Invalid JSON credentials"
- Verifique se todo o arquivo JSON foi colado (sem truncar)
- Teste em um editor JSON para validar sintaxe

### Erro: "The caller does not have permission"
- Service Account precisa de acesso "Editor" ou "Viewer" (depende da operação)
- Para n8n escrever na planilha: use "Editor"

---

## 📞 Próximas Etapas

1. **Imediato**: Criar Service Account conforme passos acima
2. **Hoje**: Configurar no n8n e testar
3. **Semana 1**: Validar estabilidade por 7 dias
4. **Semana 2**: Documentar como completado
5. **Trimestral**: Rotacionar chave (agendar reminder para 90 dias)

---

**Resultado Final**: 🟢 Camburí B operacional sem expiração periódica de credencial

