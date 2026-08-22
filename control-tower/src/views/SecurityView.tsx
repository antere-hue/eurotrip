import { securityFindings } from '../selectors'
import { Card, StatTile } from '../components/Card'
import { SecurityBadge } from '../components/Badge'
import { formatDate } from '../format'

export function SecurityView() {
  const findings = securityFindings()
  const pending = findings.filter((f) => f.story.security.status === 'pendente')
  const rejected = findings.filter((f) => f.story.security.status === 'reprovado')
  const approved = findings.filter((f) => f.story.security.status === 'aprovado')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Apontamentos" value={findings.length} />
        <StatTile label="Pendentes" value={pending.length} tone={pending.length > 0 ? 'amber' : 'default'} />
        <StatTile label="Reprovados" value={rejected.length} tone={rejected.length > 0 ? 'red' : 'default'} />
        <StatTile label="Aprovados" value={approved.length} tone="green" />
      </div>

      <Card title="Apontamentos e pareceres de segurança">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="py-2">Item</th>
                <th>Status</th>
                <th>Responsável</th>
                <th>Prazo</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              {findings
                .sort((a, b) => {
                  const order = { reprovado: 0, pendente: 1, aprovado: 2, 'N/A': 3 }
                  return order[a.story.security.status] - order[b.story.security.status]
                })
                .map(({ story, epic }) => (
                  <tr key={story.id} className="border-b border-gray-100 align-top dark:border-gray-800">
                    <td className="py-2 whitespace-nowrap">
                      <span className="font-mono text-xs text-gray-400">{epic.key}/{story.key}</span> {story.title}
                    </td>
                    <td><SecurityBadge status={story.security.status} /></td>
                    <td className="whitespace-nowrap text-gray-600 dark:text-gray-300">{story.security.owner ?? '—'}</td>
                    <td className="whitespace-nowrap text-gray-600 dark:text-gray-300">{formatDate(story.security.deadline)}</td>
                    <td className="text-gray-500 dark:text-gray-400">{story.security.notes}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
