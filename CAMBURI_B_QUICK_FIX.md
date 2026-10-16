# ⚡ Quick Fix - 5 minutos

## Pré-requisito: Você já tem Service Account criado?

Se SIM → Vá direto para [Seção 2](#seção-2-configurar-no-n8n)  
Se NÃO → Comece pela [Seção 1](#seção-1-criar-service-account)

---

## Seção 1: Criar Service Account (5 min)

### 1.1 Google Cloud Console
```
https://console.cloud.google.com/
```
- Novo Projeto: "Eurotrip Workflows"
- APIs: Ativar "Google Sheets API"

### 1.2 Criar Service Account
```
IAM & Admin → Service Accounts
  → Create Service Account
    Nome: camburi-workflows
    → Create and Continue
```

### 1.3 Gerar Chave JSON
```
Selecione a account criada
  → Tab "Keys"
  → Add Key → Create new key
  → JSON
  → Download (arquivo.json)
```

### 1.4 Compartilhar Planilha
```
https://docs.google.com/spreadsheets/d/1Oo2UiRu0xZoIa7Jyc33iOod9QAm9RIC0vrQEdXepZzw/

Share → Cole o email da Service Account:
camburi-workflows@seu-projeto.iam.gserviceaccount.com

Editor → Share
```

---

## Seção 2: Configurar no n8n

### 2.1 Nova Credencial
```
https://boat-n8n.cloudfy.live/
  → Credentials
  → New
  → Selecione "Google Sheets (Service Account)"
  
Nome: "Camburí Service Account"
Paste JSON: [Cole o arquivo.json completo]

Test Connection → Save
```

### 2.2 Atualizar Workflows
```
Abra Camburí B
  → Node "Sheets: Ler Estado Atual"
  → Credenciais: Selecione "Camburí Service Account"
  
Repita para TODOS os nodes de Google Sheets
  → Save
  → Publish
```

### 2.3 Validar
```
Envie mensagem WhatsApp de teste
Verifique: Execução do Camburí B deve passar
```

---

## ✅ Pronto!

- ✅ Service Account configurado (nunca expira)
- ✅ Planilha compartilhada
- ✅ n8n usando nova credencial
- ✅ Camburí B operacional

**Lembrete**: Rotacionar chave em 90 dias

