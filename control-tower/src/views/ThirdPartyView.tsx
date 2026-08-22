import { externalDependencyEntries, thirdPartyEntries } from '../selectors'
import { Card } from '../components/Card'
import { DependencyStatusBadge } from '../components/Badge'
import { formatDate } from '../format'

export function ThirdPartyView() {
  const thirdParties = thirdPartyEntries()
  const externalDeps = externalDependencyEntries()

  return (
    <div className="space-y-6">
      <Card title="Terceiros em cadastro/homologação">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="py-2">Empresa</th>
                <th>Item</th>
                <th>Status homologação</th>
                <th>Solicitado em</th>
                <th>Previsto</th>
                <th>Concluído</th>
              </tr>
            </thead>
            <tbody>
              {thirdParties.map(({ story, epic }) => (
                <tr key={story.id} className="border-b border-gray-100 align-top dark:border-gray-800">
                  <td className="py-2 font-medium whitespace-nowrap">{story.thirdParty.company}</td>
                  <td className="whitespace-nowrap"><span className="font-mono text-xs text-gray-400">{epic.key}/{story.key}</span> {story.title}</td>
                  <td><DependencyStatusBadge status={story.thirdParty.homologationStatus} /></td>
                  <td className="whitespace-nowrap text-gray-600 dark:text-gray-300">{formatDate(story.thirdParty.requestedDate)}</td>
                  <td className="whitespace-nowrap text-gray-600 dark:text-gray-300">{formatDate(story.thirdParty.expectedDate)}</td>
                  <td className="whitespace-nowrap text-gray-600 dark:text-gray-300">{formatDate(story.thirdParty.completedDate)}</td>
                </tr>
              ))}
              {thirdParties.length === 0 && (
                <tr><td colSpan={6} className="py-4 text-center text-gray-400">Nenhum terceiro em processo de homologação.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Dependências de times externos (HX / Sales Force / Sites)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="py-2">Time externo</th>
                <th>Item</th>
                <th>Status</th>
                <th>Previsão</th>
              </tr>
            </thead>
            <tbody>
              {externalDeps.map(({ story, epic }) => (
                <tr key={story.id} className="border-b border-gray-100 align-top dark:border-gray-800">
                  <td className="py-2 font-medium whitespace-nowrap">{story.externalDependency.type}</td>
                  <td className="whitespace-nowrap"><span className="font-mono text-xs text-gray-400">{epic.key}/{story.key}</span> {story.title}</td>
                  <td><DependencyStatusBadge status={story.externalDependency.status} /></td>
                  <td className="whitespace-nowrap text-gray-600 dark:text-gray-300">{formatDate(story.externalDependency.expectedDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
