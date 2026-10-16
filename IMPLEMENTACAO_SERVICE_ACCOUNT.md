# 📋 Plano de Implementação - Service Account

**Data de Início**: 16 de outubro de 2026  
**Responsável**: Você (via Google Cloud + n8n UI)  
**Tempo Estimado**: 15-20 minutos  
**Status**: EM PROGRESSO

---

## ✅ Checklist Pré-Implementação

Antes de começar, confirme que tem:

- [ ] Acesso ao Google Cloud Console (console.cloud.google.com)
- [ ] Acesso ao n8n (boat-n8n.cloudfy.live)
- [ ] Acesso à planilha "Torre de Controle - Camburí"
- [ ] Tempo disponível: 20 minutos ininterruptos

---

## 🚀 FASE 1: Google Cloud Setup (5 min)

### 1.1 Criar Projeto
```
console.cloud.google.com
  → Selecione projeto ou crie novo
  → Nome: "Eurotrip Workflows"
  → Criar
```

**Validação**: Você deve estar dentro do novo projeto

### 1.2 Ativar Google Sheets API
```
Pesquise: "Google Sheets API"
  → Clique no resultado
  → "Ativar"
  
Espere 1-2 minutos até aparecer "API ativada"
```

**Validação**: Deve aparecer mensagem "API ativada com sucesso"

### 1.3 Criar Service Account
```
Painel do Google Cloud
  → IAM e admin
  → Contas de serviço
  → Criar conta de serviço

Preencha:
  Nome: camburi-workflows
  ID: camburi-workflows (auto)
  Descrição: Automação de workflows n8n para Camburí
  
  → Criar e continuar
  → Ignorar grants opcionais (próximo)
  → Criar
```

**Validação**: Conta criada aparece na lista

### 1.4 Gerar Chave JSON
```
Na conta criada:
  → Aba "Chaves"
  → Adicionar chave
  → Criar nova chave
  → Selecione "JSON"
  → Criar

Um arquivo "camburi-workflows-xxxxx.json" será baixado
```

**⚠️ IMPORTANTE**: Guarde este arquivo em local seguro!

**Validação**: Arquivo baixado com sucesso

---

## 🔐 FASE 2: Compartilhar Planilha (3 min)

### 2.1 Obter Email da Service Account
```
Volte ao Google Cloud
  → Service Accounts
  → Clique em "camburi-workflows"
  → Copie o "Email" (formato: camburi-workflows@PROJECT-ID.iam.gserviceaccount.com)
```

### 2.2 Compartilhar Planilha
```
Abra: https://docs.google.com/spreadsheets/d/1Oo2UiRu0xZoIa7Jyc33iOod9QAm9RIC0vrQEdXepZzw/

Canto superior direito:
  → Compartilhar
  → Cole o email da Service Account
  → Selecione "Editor"
  → Compartilhar

Confirme na caixa de diálogo
```

**Validação**: Email adicionado como colaborador "Editor"

---

## ⚙️ FASE 3: Configurar no n8n (5 min)

### 3.1 Criar Credencial
```
https://boat-n8n.cloudfy.live/

Menu esquerdo:
  → Credentials
  → Create new
  → Procure: "Google Sheets"
  → Selecione "Google Sheets (Service Account)"

Configure:
  Credential name: Camburí Service Account
  
  Service account email: [Cole do Google Cloud]
  
  Private Key: [Cole EXATAMENTE o campo "private_key" do JSON]
    - Ou clique "Paste JSON from file" e cole o JSON completo
    
  → Save
```

**Validação**: Deve aparecer "Credential saved"

### 3.2 Testar Conexão
```
Na credencial criada:
  → Clique em "Test" ou aguarde validação automática
  → Deve passar (verde)
```

**Validação**: Status = "Credenciais testadas com sucesso"

---

## 🔄 FASE 4: Atualizar Workflows (5 min)

### 4.1 Camburí B - Atualizar Node
```
Abra Camburí B (Roteador)
  → Procure node "Sheets: Ler Estado Atual"
  → Clique no node
  → Painel direito: Credenciais
  → Selecione "Camburí Service Account" (a nova)
  → Feche o painel
  
Salve o workflow:
  → Ctrl+S ou botão "Save"
  → "Publish" quando solicitado
```

**Validação**: Workflow salvo sem erros (canto inferior: "Workflow saved")

### 4.2 Verificar Outros Nodes
```
No mesmo workflow, procure por TODOS os nodes de Google Sheets:
  - "Sheets: status=aguardando_fabiana"
  - "Sheets: status=fabiana_aceitou"
  - "Sheets: status=aguardando_pagamento"
  - Qualquer outro node com "googleSheets"

Para cada um:
  → Clique no node
  → Painel direito: Selecione "Camburí Service Account"
  → Feche

Salve novamente
```

**Validação**: Todos os nodes apontam para "Camburí Service Account"

---

## 🧪 FASE 5: Validação (2 min)

### 5.1 Teste Manual
```
Abra Camburí B
  → Botão "Execute Workflow" (ou envie mensagem WhatsApp de teste)
  → Aguarde execução (15-20 segundos)
```

**Validação**: 
- ❌ Se erro: Verifique mensagem de erro
- ✅ Se sucesso: Workflow completou sem erros

### 5.2 Verificar Planilha
```
Abra a planilha "Torre de Controle - Camburí"
  → Verifique se dados foram lidos corretamente
  → Confirme que colunas aparecem: row_number, data, status, etc
```

**Validação**: Dados aparecem normalmente

### 5.3 Executar 5 Testes
```
Repita 5x:
  1. Envie mensagem de teste via WhatsApp
  2. Aguarde execução completar
  3. Confirme status = SUCCESS
```

**Validação**: 5/5 execuções com sucesso

---

## 📊 Matriz de Validação

| Fase | Item | Status | Observações |
|------|------|--------|------------|
| 1 | Projeto Google Cloud criado | ☐ | |
| 1 | Google Sheets API ativada | ☐ | |
| 1 | Service Account criado | ☐ | Email: _________________ |
| 1 | Chave JSON gerada | ☐ | Arquivo: camburi-workflows-xxxxx.json |
| 2 | Planilha compartilhada | ☐ | Email: _________________ |
| 3 | Credencial n8n criada | ☐ | |
| 3 | Conexão testada | ☐ | Status: Verde ✓ |
| 4 | Camburí B atualizado | ☐ | |
| 4 | Todos nodes atualizados | ☐ | Count: _____ nodes |
| 5 | Teste 1 passado | ☐ | |
| 5 | Teste 2 passado | ☐ | |
| 5 | Teste 3 passado | ☐ | |
| 5 | Teste 4 passado | ☐ | |
| 5 | Teste 5 passado | ☐ | |

---

## 🚨 Troubleshooting Durante Implementação

### Erro: "Invalid JSON"
**Solução**: 
- Copie o arquivo JSON completo (abra em editor de texto)
- Valide JSON em jsonlint.com
- Cole novamente no n8n

### Erro: "Service Account does not have access"
**Solução**:
- Verifique email da SA (sem espaços)
- Confirme planilha foi compartilhada com "Editor"
- Aguarde 2-3 minutos e tente novamente

### Erro: "Cannot find private_key"
**Solução**:
- Abra JSON em editor de texto
- Procure campo: `"private_key": "-----BEGIN..."`
- Copie o valor completo INCLUINDO as quebras de linha

### Workflow ainda falha após atualizar credencial
**Solução**:
1. Publique novamente o workflow
2. Aguarde 30 segundos
3. Teste novamente

---

## ✅ Conclusão da Implementação

Quando TODOS os itens estiverem marcados ☑️:

1. ✅ Service Account criado e configurado
2. ✅ Planilha compartilhada
3. ✅ n8n usando nova credencial
4. ✅ 5 testes passando
5. ✅ Camburí B 100% operacional

**Resultado Final**: 🟢 Problema de expiração RESOLVIDO

---

## 📅 Próximas Ações

**Imediato** (hoje):
- [ ] Completar implementação conforme fases acima
- [ ] Validar 5 testes
- [ ] Documentar no repositório

**Futuro** (90 dias):
- [ ] Agendar rotação de chave JSON
- [ ] Gerar nova chave no Google Cloud
- [ ] Atualizar credencial n8n

---

**Quando terminar, confirme nesta sessão que tudo foi implementado com sucesso!**

