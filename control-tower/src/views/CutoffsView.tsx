import { releaseCutoffs } from '../mockData'
import { itemsForCutoff } from '../selectors'
import { epics } from '../mockData'
import { Card } from '../components/Card'
import { RiskBadge, StatusBadge } from '../components/Badge'
import { formatDate } from '../format'

const platformTone: Record<string, string> = {
  iOS: 'border-l-4 border-gray-400',
  Android: 'border-l-4 border-emerald-400',
  'Web Banking': 'border-l-4 border-blue-400',
}

export function CutoffsView() {
  const sorted = [...releaseCutoffs].sort((a, b) => new Date(a.cutoffDate).getTime() - new Date(b.cutoffDate).getTime())

  return (
    <div className="space-y-4">
      {sorted.map((cutoff) => {
        const items = itemsForCutoff(cutoff)
        return (
          <Card key={cutoff.id} className={platformTone[cutoff.platform]}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{cutoff.platform} — versão {cutoff.version}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Corte: <strong>{formatDate(cutoff.cutoffDate)}</strong> · Publicação prevista: {formatDate(cutoff.releaseDate)}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{items.length} item(ns) neste corte</span>
            </div>
            {items.length > 0 ? (
              <ul className="space-y-1">
                {items.map((s) => {
                  const epic = epics.find((e) => e.stories.some((st) => st.id === s.id))!
                  return (
                    <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800/60">
                      <span><span className="font-mono text-xs text-gray-400">{epic.key}/{s.key}</span> {s.title}</span>
                      <span className="flex items-center gap-2">
                        <StatusBadge status={s.status} />
                        <RiskBadge level={s.risk.level} />
                      </span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Nenhuma entrega vinculada a este corte ainda.</p>
            )}
          </Card>
        )
      })}
    </div>
  )
}
