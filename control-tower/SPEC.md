# Antes de construir: campos do Jira e perguntas de esclarecimento

Conforme pedido no prompt original, esta é a lista que deveria ter sido
"devolvida" antes de começar a construir. Como a etapa 1 pede um protótipo
com dados mockados, ela foi resolvida com suposições razoáveis (documentadas
abaixo) para não bloquear a entrega — mas nada aqui foi confirmado com o
time de negócio/Jira, e o adaptador real de integração (seção "Plugando o
Jira de verdade" no README) só deve ser escrito depois de validar isto.

## 1. Campos customizados a criar no Jira

Nenhum destes existe por padrão no Jira — precisam ser criados como campos
customizados (ou reaproveitados se já existir algo equivalente) antes da
extração funcionar 100%:

| Campo | Tipo sugerido | Onde se aplica | Observação |
|---|---|---|---|
| **Tecnologia** | Select (lista) | Épico, História, Task | Valores: Frontend / Backend / iOS / Android / Web Banking. Um épico pode abranger mais de uma — usar multi-select no épico e select simples na história. |
| **Squad** | Select ou já mapeado por board/projeto | Épico, História | Se squads já são representadas por projeto/componente do Jira, este campo pode ser dispensado em favor do campo nativo. |
| **Dependência Externa** | Select | História | Valores: HX / Sales Force / Sites / Nenhuma. |
| **Status da Dependência Externa** | Select | História | não iniciado / em andamento / concluído / bloqueado. |
| **Data Prevista da Dependência** | Data | História | Data prevista de entrega da dependência externa. |
| **Envolve Terceiro (Homologação)** | Checkbox/Booleano | História | Sim/Não. |
| **Empresa Terceira** | Texto curto | História | Nome da empresa, só preenchido se o campo acima for Sim. |
| **Status de Homologação do Terceiro** | Select | História | não iniciado / em andamento / concluído / bloqueado. |
| **Data de Solicitação da Homologação** | Data | História | |
| **Data Prevista/Realizada da Homologação** | Data | História | Pode exigir dois campos (previsão vs. realizado) em vez de um. |
| **Parecer de Segurança — Status** | Select | História | pendente / aprovado / reprovado / N/A. |
| **Parecer de Segurança — Data** | Data | História | |
| **Parecer de Segurança — Responsável** | Usuário ou texto | História | |
| **Parecer de Segurança — Prazo** | Data | História | |
| **Parecer de Segurança — Observações** | Texto longo | História | |
| **Risco** | Select | História (o risco do épico é calculado a partir das histórias) | baixo / médio / alto. |
| **Motivo do Risco** | Texto longo | História | |
| **Corte de Release (Cutoff)** | Select ou vínculo com uma issue "Release" | História | Qual corte (ex. "iOS 9.4.0", "Web Banking 2026.09-r1") a entrega mira. |
| **Épico Pai** | Nativo do Jira (Epic Link) | História | Já existe nativamente — só confirmar que todas as histórias estão vinculadas. |

Além dos campos, duas estruturas separadas do Jira (ou de outra fonte)
também alimentam o sistema e não são campos de issue:

- **Calendário de cerimônias** (Subcomitê de Produtos, Refinamento, Planning,
  Review): pode vir de um calendário/Confluence, ou ser modelado como issues
  de um projeto "Cerimônias" no Jira com data e itens de pauta vinculados
  (`agendaItemKeys` no protótipo).
- **Pareceres do subcomitê**: pode ser um campo customizado na própria
  história/épico (resultado + data + observação, com histórico via
  changelog do Jira) ou uma lista mantida à parte — precisa decidir com o
  time do subcomitê onde essa informação nasce hoje.
- **Datas de corte de release** (iOS/Android/Web Banking): provavelmente já
  existem em algum calendário de releases da área de Mobile/Web Banking;
  precisam ser importadas ou cadastradas manualmente, já que normalmente
  não são um campo por issue, e sim um calendário compartilhado entre times.

## 2. Perguntas de esclarecimento

**Nomenclatura de status**
1. Quais são os status reais usados hoje nos boards do Jira (por
   tecnologia)? O protótipo assumiu `A Fazer / Em Andamento / Bloqueado /
   Em Homologação / Concluído` — isso bate com os workflows de Frontend,
   Backend, iOS, Android e Web Banking, ou cada board tem seu próprio
   vocabulário que precisa de um mapeamento?
2. "Bloqueado" é um status formal no workflow ou é inferido (ex.: label,
   flag "impediment" do Jira)?

**Squads**
3. Qual é a lista definitiva de squads por tecnologia? O protótipo usou
   nomes ilustrativos (Squad Onboarding, Squad Core Bancário, Squad
   Integrações, Squad Mobile iOS, Squad Mobile Android, Squad Web Banking).
4. Squad é 1:1 com board/projeto do Jira, ou uma squad pode conter issues
   de múltiplos projetos/tecnologias?

**Frequência de atualização**
5. A cadência sugerida de 4h em horário comercial atende, ou a liderança
   precisa de algo mais próximo de tempo real (ex. webhook do Jira em vez
   de polling)?
6. O botão "Atualizar agora" deve disparar a extração para todos os épicos
   ou só para o board/tecnologia em foco (para não sobrecarregar a API do
   Jira em picos de uso)?

**Governança e segurança**
7. Pareceres do subcomitê e apontamentos de segurança são registrados hoje
   em algum lugar estruturado (planilha, Confluence, campo de issue), ou
   precisam de um processo novo para não virar só texto solto em
   comentários do Jira?
8. Quem é o "dono" da data de corte de release (Mobile Release Manager?
   Web Banking?) e qual é a fonte oficial dessas datas hoje?

**Escopo do protótipo**
9. Faz sentido a Torre de Controle também escrever de volta no Jira (ex.
   marcar um parecer como emitido), ou o fluxo é somente leitura, com o
   registro de pareceres/segurança continuando a ser feito no Jira/outro
   sistema?
10. Exportação executiva: PDF gerado a partir do dashboard (o protótipo já
    inclui isso via impressão do navegador) é suficiente, ou a liderança
    espera um template de PPT com slides específicos?
