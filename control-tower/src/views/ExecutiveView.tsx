import { epics, releaseCutoffs } from '../mockData'
import {
  blockedExternalDependencies,
  technologyCompletion,
  topRisks,
  upcomingCeremonies,
} from '../selectors'
import { Card, StatTile } from '../components/Card'
import { Gantt } from '../components/Gantt'
import { RiskBadge } from '../components/Badge'
import { formatDate } from '../format'

export function ExecutiveView() {
  const tech = technologyCompletion()
  const risks = topRisks(5)
  const ceremonies = upcomingCeremonies().slice(0, 4)
  const blocked = blockedExternalDependencies()

  const totalStories = tech.reduce((a, t) => a + t.total, 0)
  const totalDone = tech.reduce((a, t) => a + t.done, 0)
  const totalLate = tech.reduce((a, t) => a + t.late, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Histórias no roadmap" value={totalStories} />
        <StatTile label="Concluídas" value={`${totalDone} (${totalStories ? Math.round((totalDone / totalStories) * 100) : 0}%)`} tone="green" />
        <StatTile label="Atrasadas" value={totalLate} tone={totalLate > 0 ? 'red' : 'default'} />
        <StatTile label="Dependências externas bloqueadas" value={blocked.length} tone={blocked.length > 0 ? 'red' : 'default'} />
      </div>

      <Card title="Status geral por tecnologia">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {tech.map((t) => (
            <div key={t.technology} className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <div className="mb-1 flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                <span>{t.technology}</span>
                <span>{t.percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-full bg-emerald-400" style={{ width: `${t.percent}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-gray-500 dark:text-gray-400">
                <span>{t.done} concluídas</span>
                <span>{t.onTrack} no prazo</span>
                <span className={t.late > 0 ? 'font-semibold text-red-500' : ''}>{t.late} atrasadas</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Linha do tempo dos épicos (marcos e cortes de release)">
        <Gantt epics={epics} cutoffs={releaseCutoffs} />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Riscos em destaque">
          <ul className="space-y-2">
            {risks.map(({ story, epic }) => (
              <li key={story.id} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 p-2 text-sm dark:border-gray-800">
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">{story.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{epic.key} · {story.key} · {story.risk.reason}</div>
                </div>
                <RiskBadge level={story.risk.level} />
              </li>
            ))}
            {risks.length === 0 && <p className="text-sm text-gray-400">Nenhum risco médio/alto no momento.</p>}
          </ul>
        </Card>

        <Card title="Próximas cerimônias">
          <ul className="space-y-2">
            {ceremonies.map((c) => (
              <li key={c.id} className="rounded-lg border border-gray-100 p-2 text-sm dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800 dark:text-gray-200">{c.type}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(c.date)}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Pauta: {c.agendaItemKeys.join(', ')}</div>
                {c.notes && <div className="mt-1 text-xs text-gray-400">{c.notes}</div>}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {blocked.length > 0 && (
        <Card title="Dependências externas bloqueadas">
          <ul className="space-y-2">
            {blocked.map(({ story, epic }) => (
              <li key={story.id} className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-2 text-sm dark:border-red-900/40 dark:bg-red-900/10">
                <span>
                  <span className="font-medium">{story.externalDependency.type}</span> — {story.title} <span className="text-xs text-gray-500 dark:text-gray-400">({epic.key} · {story.key})</span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">previsto: {formatDate(story.externalDependency.expectedDate)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
