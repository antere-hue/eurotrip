import { useMemo, useState } from 'react'
import { epics } from '../mockData'
import { allStories, stalledItems } from '../selectors'
import { Card } from '../components/Card'
import { RiskBadge, StatusBadge, DependencyStatusBadge } from '../components/Badge'
import { formatDate } from '../format'
import type { ItemStatus, RiskLevel, Story, Technology } from '../types'

const STATUSES: ItemStatus[] = ['A Fazer', 'Em Andamento', 'Bloqueado', 'Em Homologação', 'Concluído']
const TECHS: Technology[] = ['Frontend', 'Backend', 'iOS', 'Android', 'Web Banking']

function useFilterOptions() {
  const squads = Array.from(new Set(allStories().map((s) => s.squad))).sort()
  const sprints = Array.from(new Set(allStories().map((s) => s.sprint))).sort()
  return { squads, sprints }
}

export function OperationalView() {
  const { squads, sprints } = useFilterOptions()
  const [tech, setTech] = useState<Technology | 'Todas'>('Todas')
  const [squad, setSquad] = useState<string>('Todos')
  const [sprint, setSprint] = useState<string>('Todos')
  const [risk, setRisk] = useState<RiskLevel | 'Todos'>('Todos')
  const [dependencyOnly, setDependencyOnly] = useState(false)

  const filtered = useMemo(() => {
    return allStories().filter((s) => {
      if (tech !== 'Todas' && s.technology !== tech) return false
      if (squad !== 'Todos' && s.squad !== squad) return false
      if (sprint !== 'Todos' && s.sprint !== sprint) return false
      if (risk !== 'Todos' && s.risk.level !== risk) return false
      if (dependencyOnly && s.externalDependency.type === 'Nenhuma') return false
      return true
    })
  }, [tech, squad, sprint, risk, dependencyOnly])

  const byStatus = STATUSES.map((status) => ({ status, items: filtered.filter((s) => s.status === status) }))
  const stalled = stalledItems(5)
  const velocity = sprints.map((sp) => {
    const items = allStories().filter((s) => s.sprint === sp)
    const done = items.filter((s) => s.status === 'Concluído').reduce((a, s) => a + s.size, 0)
    const total = items.reduce((a, s) => a + s.size, 0)
    return { sprint: sp, done, total }
  })
  const maxVelocity = Math.max(1, ...velocity.map((v) => v.total))

  return (
    <div className="space-y-6">
      <Card title="Filtros">
        <div className="flex flex-wrap gap-3">
          <Select label="Tecnologia" value={tech} onChange={setTech} options={['Todas', ...TECHS]} />
          <Select label="Squad" value={squad} onChange={setSquad} options={['Todos', ...squads]} />
          <Select label="Sprint" value={sprint} onChange={setSprint} options={['Todos', ...sprints]} />
          <Select label="Risco" value={risk} onChange={setRisk} options={['Todos', 'baixo', 'médio', 'alto']} />
          <label className="flex items-center gap-2 self-end pb-1 text-sm text-gray-600 dark:text-gray-300">
            <input type="checkbox" checked={dependencyOnly} onChange={(e) => setDependencyOnly(e.target.checked)} />
            Só com dependência externa
          </label>
        </div>
      </Card>

      {stalled.length > 0 && (
        <Card title={`Alertas — itens sem atualização há 5+ dias (${stalled.length})`}>
          <ul className="flex flex-wrap gap-2">
            {stalled.map(({ story, epic, days }) => (
              <li key={story.id} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300">
                {epic.key}/{story.key} — {days}d sem atualização
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card title="Kanban operacional (Épico › História, clique para ver Tasks)">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          {byStatus.map((col) => (
            <div key={col.status} className="min-w-0">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                <span>{col.status}</span>
                <span>{col.items.length}</span>
              </div>
              <div className="space-y-2">
                {col.items.map((s) => (
                  <StoryCard key={s.id} story={s} />
                ))}
                {col.items.length === 0 && <p className="text-xs text-gray-400">Nenhum item</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Velocidade por sprint (story points concluídos vs. total)">
        <div className="space-y-3">
          {velocity.map((v) => (
            <div key={v.sprint} className="flex items-center gap-3 text-xs">
              <span className="w-20 shrink-0 text-gray-500 dark:text-gray-400">{v.sprint}</span>
              <div className="relative h-4 flex-1 rounded bg-gray-100 dark:bg-gray-800">
                <div className="absolute h-4 rounded bg-gray-300 dark:bg-gray-700" style={{ width: `${(v.total / maxVelocity) * 100}%` }} />
                <div className="absolute h-4 rounded bg-emerald-400" style={{ width: `${(v.done / maxVelocity) * 100}%` }} />
              </div>
              <span className="w-20 shrink-0 text-right text-gray-500 dark:text-gray-400">{v.done}/{v.total} pts</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function Select<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: T[] }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
      {label}
      <select
        className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}

function StoryCard({ story }: { story: Story }) {
  const [open, setOpen] = useState(false)
  const epic = epics.find((e) => e.stories.some((s) => s.id === story.id))!
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-2 text-xs shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[10px] text-gray-400">{epic.key} / {story.key}</span>
        <RiskBadge level={story.risk.level} />
      </div>
      <button className="block w-full text-left font-medium text-gray-800 hover:underline dark:text-gray-200" onClick={() => setOpen((v) => !v)}>
        {story.title}
      </button>
      <div className="mt-1 flex flex-wrap gap-1">
        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">{story.technology}</span>
        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">{story.squad}</span>
        {story.externalDependency.type !== 'Nenhuma' && (
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">{story.externalDependency.type}</span>
        )}
      </div>
      <div className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">Prazo: {formatDate(story.dueDate)} · {story.size} pts</div>
      {open && (
        <div className="mt-2 space-y-1 border-t border-gray-100 pt-2 dark:border-gray-800">
          {story.tasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-2">
              <span className="truncate">{t.title} <span className="text-gray-400">({t.assignee})</span></span>
              <StatusBadge status={t.status} />
            </div>
          ))}
          {story.externalDependency.type !== 'Nenhuma' && (
            <div className="flex items-center justify-between pt-1">
              <span>Dependência {story.externalDependency.type}</span>
              <DependencyStatusBadge status={story.externalDependency.status} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
