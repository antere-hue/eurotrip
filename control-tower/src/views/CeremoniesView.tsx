import { ceremonies, pareceres } from '../mockData'
import { findEpicByKey } from '../selectors'
import { Card } from '../components/Card'
import { ParecerBadge } from '../components/Badge'
import { formatDate } from '../format'
import type { CeremonyType } from '../types'

const typeTone: Record<CeremonyType, string> = {
  'Subcomitê de Produtos': 'border-l-4 border-purple-400',
  Refinamento: 'border-l-4 border-blue-400',
  Planning: 'border-l-4 border-amber-400',
  Review: 'border-l-4 border-emerald-400',
}

export function CeremoniesView() {
  const sorted = [...ceremonies].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="space-y-6">
      <Card title="Calendário de cerimônias">
        <ul className="space-y-2">
          {sorted.map((c) => (
            <li key={c.id} className={`rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800/60 ${typeTone[c.type]}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-gray-800 dark:text-gray-200">{c.type}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(c.date)}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-2 text-xs">
                {c.agendaItemKeys.map((key) => {
                  const epic = findEpicByKey(key)
                  return (
                    <span key={key} className="rounded bg-white px-2 py-0.5 font-mono text-gray-600 shadow-sm dark:bg-gray-900 dark:text-gray-300">
                      {key}{epic ? ` — ${epic.title}` : ''}
                    </span>
                  )
                })}
              </div>
              {c.notes && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{c.notes}</p>}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Pareceres emitidos pelo subcomitê">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="py-2">Data</th>
                <th>Item</th>
                <th>Resultado</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              {[...pareceres]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 align-top dark:border-gray-800">
                    <td className="py-2 whitespace-nowrap">{formatDate(p.date)}</td>
                    <td className="whitespace-nowrap"><span className="font-mono text-xs text-gray-400">{p.itemKey}</span> {p.itemTitle}</td>
                    <td><ParecerBadge resultado={p.resultado} /></td>
                    <td className="text-gray-500 dark:text-gray-400">{p.observacoes}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
