// Modelo de dados da Torre de Controle de Roadmap.
// Espelha a hierarquia Épico > História > Task extraída do Jira (ver seção 3 do spec).
// Hoje populado por mockData.ts; ao plugar a API real do Jira, apenas o
// adaptador de origem muda — as interfaces abaixo continuam as mesmas.

export type Technology = 'Frontend' | 'Backend' | 'iOS' | 'Android' | 'Web Banking'

export type ItemStatus = 'A Fazer' | 'Em Andamento' | 'Bloqueado' | 'Em Homologação' | 'Concluído'

export type RiskLevel = 'baixo' | 'médio' | 'alto'

export type ExternalDependencyType = 'HX' | 'Sales Force' | 'Sites' | 'Nenhuma'

export type DependencyStatus = 'não iniciado' | 'em andamento' | 'concluído' | 'bloqueado'

export type SecurityStatus = 'pendente' | 'aprovado' | 'reprovado' | 'N/A'

export type ParecerResultado = 'aprovado' | 'aprovado com ressalvas' | 'reprovado' | 'pendente'

export type CeremonyType = 'Subcomitê de Produtos' | 'Refinamento' | 'Planning' | 'Review'

export type ReleasePlatform = 'iOS' | 'Android' | 'Web Banking'

export interface ExternalDependency {
  type: ExternalDependencyType
  status: DependencyStatus
  expectedDate: string | null
}

export interface ThirdPartyInfo {
  company: string
  homologationStatus: DependencyStatus
  requestedDate: string
  expectedDate: string | null
  completedDate: string | null
}

export interface SecurityAssessment {
  status: SecurityStatus
  date: string | null
  owner: string | null
  deadline: string | null
  notes: string
}

export interface Risk {
  level: RiskLevel
  reason: string
}

export interface Task {
  id: string
  key: string
  title: string
  assignee: string
  size: number
  dueDate: string
  status: ItemStatus
  updatedAt: string
}

export interface Story {
  id: string
  key: string
  title: string
  status: ItemStatus
  technology: Technology
  squad: string
  size: number
  startDate: string
  dueDate: string
  completedDate: string | null
  sprint: string
  externalDependency: ExternalDependency
  thirdParty: ThirdPartyInfo | null
  security: SecurityAssessment
  risk: Risk
  releaseCutoffId: string | null
  tasks: Task[]
  updatedAt: string
}

export interface Epic {
  id: string
  key: string
  title: string
  technologies: Technology[]
  squads: string[]
  milestoneDate: string
  dueDate: string
  stories: Story[]
}

export interface Ceremony {
  id: string
  type: CeremonyType
  date: string
  agendaItemKeys: string[]
  notes: string
}

export interface Parecer {
  id: string
  itemKey: string
  itemTitle: string
  date: string
  resultado: ParecerResultado
  observacoes: string
}

export interface ReleaseCutoff {
  id: string
  platform: ReleasePlatform
  version: string
  cutoffDate: string
  releaseDate: string
}

export interface DataSnapshot {
  epics: Epic[]
  ceremonies: Ceremony[]
  pareceres: Parecer[]
  releaseCutoffs: ReleaseCutoff[]
  lastUpdated: string
}
