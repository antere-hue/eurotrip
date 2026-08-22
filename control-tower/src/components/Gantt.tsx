import type { Epic, ReleaseCutoff } from '../types'
import { epicRisk, epicProgress } from '../selectors'
import { formatDate } from '../format'
import { RiskBadge } from './Badge'

const riskBarTone = { baixo: 'bg-emerald-400', médio: 'bg-amber-400', alto: 'bg-red-400' } as const

export function Gantt({ epics, cutoffs }: { epics: Epic[]; cutoffs: ReleaseCutoff[] }) {
  const allDates = epics.flatMap((e) => [
    ...e.stories.map((s) => s.startDate),
    ...e.stories.map((s) => s.dueDate),
    e.dueDate,
    e.milestoneDate,
  ])
  const min = new Date(Math.min(...allDates.map((d) => new Date(d).getTime())))
  const max = new Date(Math.max(...allDates.map((d) => new Date(d).getTime())))
  min.setDate(min.getDate() - 2)
  max.setDate(max.getDate() + 2)
  const span = max.getTime() - min.getTime()

  const pct = (dateStr: string) => ((new Date(dateStr).getTime() - min.getTime()) / span) * 100

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 border-b border-gray-200 pb-2 text-[11px] text-gray-500 dark:border-gray-800 dark:text-gray-400">
          {cutoffs.map((c) => (
            <span key={c.id} className="whitespace-nowrap">
              ✂ {formatDate(c.cutoffDate)} — {c.platform} {c.version}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          {epics.map((epic) => {
            const start = epic.stories.reduce((m, s) => (s.startDate < m ? s.startDate : m), epic.stories[0]?.startDate ?? epic.dueDate)
            const risk = epicRisk(epic)
            const progress = epicProgress(epic)
            return (
              <div key={epic.id} className="relative flex items-center gap-3">
                <div className="w-56 shrink-0 truncate text-xs">
                  <span className="font-mono text-gray-400">{epic.key}</span>{' '}
                  <span className="font-medium text-gray-800 dark:text-gray-200">{epic.title}</span>
                </div>
                <div className="relative h-6 flex-1 rounded bg-gray-100 dark:bg-gray-800">
                  {cutoffs.map((c) => (
                    <div key={c.id} className="absolute top-0 h-6 border-l border-dashed border-gray-400/60" style={{ left: `${pct(c.cutoffDate)}%` }} />
                  ))}
                  <div
                    className={`absolute top-0 h-6 rounded ${riskBarTone[risk]} opacity-80`}
                    style={{ left: `${pct(start)}%`, width: `${Math.max(pct(epic.dueDate) - pct(start), 1.5)}%` }}
                    title={`${epic.title}: ${formatDate(start)} → ${formatDate(epic.dueDate)}`}
                  />
                  <div
                    className="absolute top-0 h-6 w-0.5 bg-gray-900 dark:bg-gray-100"
                    style={{ left: `${pct(epic.milestoneDate)}%` }}
                    title={`Marco: ${formatDate(epic.milestoneDate)}`}
                  />
                </div>
                <div className="hidden w-24 shrink-0 text-right text-xs text-gray-500 sm:block">{progress.done}/{progress.total} histórias</div>
                <div className="w-28 shrink-0"><RiskBadge level={risk} /></div>
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-gray-900 dark:bg-gray-100" /> marco</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border-l border-dashed border-gray-400" /> corte de release</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-emerald-400" /> risco baixo</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-amber-400" /> risco médio</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-red-400" /> risco alto</span>
        </div>
      </div>
    </div>
  )
}
