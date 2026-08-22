# Torre de Controle de Roadmap

Protótipo funcional da Torre de Controle de Roadmap multi-tecnologia
(Frontend, Backend, Mobile iOS, Mobile Android e Web Banking), consolidando
Épico → História → Task com dependências externas (HX, Sales Force, Sites),
homologação de terceiros, pareceres de subcomitê, apontamentos de segurança
e datas de corte de release.

Este é o entregável da etapa 1 do spec: roda 100% sobre **dados mockados**
(`src/mockData.ts`), com o modelo de dados já desenhado para receber a
integração real com o Jira sem mudar nenhuma tela.

## Rodando localmente

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de produção em dist/
npm run preview   # serve o build de produção
```

## Estrutura

```
src/
  types.ts        modelo de dados (Épico/História/Task, dependências, segurança, etc.)
  mockData.ts      dados mockados simulando a extração do Jira
  selectors.ts     derivações sobre a base única (risco, atrasos, alertas, filtros)
  components/      Badge, Card, Gantt — peças de UI reutilizadas pelas 6 telas
  views/
    ExecutiveView.tsx     dashboard executivo (seção 5.1)
    OperationalView.tsx   kanban operacional por squad/tecnologia (seção 5.2)
    CeremoniesView.tsx    calendário de cerimônias + pareceres (seção 5.3)
    SecurityView.tsx      apontamentos de segurança (seção 5.4)
    ThirdPartyView.tsx    terceiros/homologação + dependências externas (seção 5.5)
    CutoffsView.tsx       datas de corte de release (seção 5.6)
  App.tsx          navegação por abas, "última atualização" e atualizar/exportar
```

Todas as 6 telas leem da mesma base (`epics`, `ceremonies`, `pareceres`,
`releaseCutoffs` em `mockData.ts`, processados por `selectors.ts`) — não há
cópias de dados por tela, para que uma atualização do Jira se propague
automaticamente para todos os dashboards.

## Plugando o Jira de verdade

1. Criar um adaptador (`src/jiraAdapter.ts`, não incluído neste protótipo)
   que chama a REST API v3 do Jira e retorna um `DataSnapshot` (ver
   `types.ts`) no mesmo formato que `mockData.ts` produz hoje.
2. Trocar os imports de `./mockData` em `selectors.ts`/`App.tsx` pelo
   resultado desse adaptador (ex.: via `useEffect` + `useState`, ou
   React Query, chamado a cada N horas ou no clique de "Atualizar agora").
3. Autenticar com token de API do Jira armazenado em variável de ambiente
   / secret manager — nunca hardcoded no bundle do frontend. Na prática,
   isso normalmente exige um backend/BFF leve fazendo a chamada ao Jira
   (o token de API não deve ficar exposto no navegador).

Veja `SPEC.md` para a lista de campos customizados a criar no Jira e as
perguntas de esclarecimento levantadas antes desta construção.
