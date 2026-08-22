// Seletores/derivações sobre a base única de dados (epics/ceremonies/pareceres/cutoffs).
// As 6 telas do spec (seção 5) leem todas a partir daqui — nenhuma tela mantém
// sua própria cópia dos dados, para que uma atualização do Jira se propague sozinha.

import { ceremonies, epics, pareceres, releaseCutoffs } from './mockData'
import type { Epic, ReleaseCutoff, RiskLevel, Story, Task } from './types'

const RISK_WEIGHT: Record<RiskLevel, number> = { baixo: 0, médio: 1, alto: 2 }

export function allStories(): Story[] {
  return epics.flatMap((e) => e.stories)
}

export function allTasks(): (Task & { storyKey: string; epicKey: string })[] {
  return epics.flatMap((e) => e.stories.flatMap((s) => s.tasks.map((t) => ({ ...t, storyKey: s.key, epicKey: e.key }))))
}

export function epicRisk(epic: Epic): RiskLevel {
  if (epic.stories.length === 0) return 'baixo'
  const worst = epic.stories.reduce((acc, s) => Math.max(acc, RISK_WEIGHT[s.risk.level]), 0)
  return (Object.entries(RISK_WEIGHT).find(([, w]) => w === worst)?.[0] as RiskLevel) ?? 'baixo'
}

export function epicProgress(epic: Epic): { done: number; total: number; percent: number } {
  const total = epic.stories.length
  const done = epic.stories.filter((s) => s.status === 'Concluído').length
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) }
}

export function isLate(dueDate: string, completedDate: string | null, today: Date): boolean {
  if (completedDate) return new Date(completedDate) > new Date(dueDate)
  return new Date(dueDate) < today
}

export function daysSince(dateStr: string, today: Date): number {
  const diff = today.getTime() - new Date(dateStr).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function securityFindings() {
  return allStories()
    .filter((s) => s.security.status !== 'N/A')
    .map((s) => ({ story: s, epic: epics.find((e) => e.stories.some((st) => st.id === s.id))! }))
}

export function thirdPartyEntries() {
  return allStories()
    .filter((s): s is Story & { thirdParty: NonNullable<Story['thirdParty']> } => s.thirdParty !== null)
    .map((s) => ({ story: s, epic: epics.find((e) => e.stories.some((st) => st.id === s.id))! }))
}

export function externalDependencyEntries() {
  return allStories()
    .filter((s) => s.externalDependency.type !== 'Nenhuma')
    .map((s) => ({ story: s, epic: epics.find((e) => e.stories.some((st) => st.id === s.id))! }))
}

export function itemsForCutoff(cutoff: ReleaseCutoff) {
  return allStories().filter((s) => s.releaseCutoffId === cutoff.id)
}

export function findEpicByKey(key: string): Epic | undefined {
  return epics.find((e) => e.key === key || e.stories.some((s) => s.key === key))
}

export function technologyCompletion() {
  const techs = ['Frontend', 'Backend', 'iOS', 'Android', 'Web Banking'] as const
  return techs.map((tech) => {
    const stories = allStories().filter((s) => s.technology === tech)
    const done = stories.filter((s) => s.status === 'Concluído').length
    const today = new Date('2026-08-21')
    const late = stories.filter((s) => isLate(s.dueDate, s.completedDate, today) && s.status !== 'Concluído').length
    return {
      technology: tech,
      total: stories.length,
      done,
      late,
      onTrack: stories.length - done - late,
      percent: stories.length === 0 ? 0 : Math.round((done / stories.length) * 100),
    }
  })
}

export function topRisks(limit = 5) {
  return allStories()
    .filter((s) => s.risk.level !== 'baixo')
    .sort((a, b) => RISK_WEIGHT[b.risk.level] - RISK_WEIGHT[a.risk.level])
    .slice(0, limit)
    .map((s) => ({ story: s, epic: epics.find((e) => e.stories.some((st) => st.id === s.id))! }))
}

export function blockedExternalDependencies() {
  return externalDependencyEntries().filter((e) => e.story.externalDependency.status === 'bloqueado')
}

export function upcomingCeremonies(today = new Date('2026-08-21')) {
  return ceremonies
    .filter((c) => new Date(c.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function upcomingCutoffs(today = new Date('2026-08-21')) {
  return releaseCutoffs
    .filter((c) => new Date(c.cutoffDate) >= today)
    .sort((a, b) => new Date(a.cutoffDate).getTime() - new Date(b.cutoffDate).getTime())
}

export function stalledItems(days = 5, today = new Date('2026-08-21')) {
  return allStories()
    .filter((s) => s.status !== 'Concluído' && daysSince(s.updatedAt, today) >= days)
    .map((s) => ({ story: s, epic: epics.find((e) => e.stories.some((st) => st.id === s.id))!, days: daysSince(s.updatedAt, today) }))
}

export function pareceresFor(itemKey: string) {
  return pareceres.filter((p) => p.itemKey === itemKey)
}
