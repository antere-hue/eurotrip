import { useState } from 'react'
import { lastUpdated as initialLastUpdated } from './mockData'
import { formatDateTime } from './format'
import { ExecutiveView } from './views/ExecutiveView'
import { OperationalView } from './views/OperationalView'
import { CeremoniesView } from './views/CeremoniesView'
import { SecurityView } from './views/SecurityView'
import { ThirdPartyView } from './views/ThirdPartyView'
import { CutoffsView } from './views/CutoffsView'

const TABS = [
  { id: 'executive', label: 'Executivo', view: ExecutiveView },
  { id: 'operational', label: 'Operacional', view: OperationalView },
  { id: 'ceremonies', label: 'Cerimônias & Pareceres', view: CeremoniesView },
  { id: 'security', label: 'Segurança', view: SecurityView },
  { id: 'thirdparty', label: 'Terceiros/Homologação', view: ThirdPartyView },
  { id: 'cutoffs', label: 'Datas de Corte', view: CutoffsView },
] as const

type TabId = (typeof TABS)[number]['id']

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('executive')
  const [lastUpdated, setLastUpdated] = useState(initialLastUpdated)
  const [refreshing, setRefreshing] = useState(false)

  const ActiveView = TABS.find((t) => t.id === activeTab)!.view

  function handleRefresh() {
    setRefreshing(true)
    // Simula a chamada à API do Jira. Ao plugar a integração real,
    // troque este timeout por um fetch dos dados e reatribuição do estado global.
    setTimeout(() => {
      setLastUpdated(new Date().toISOString())
      setRefreshing(false)
    }, 700)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Torre de Controle de Roadmap</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Frontend · Backend · Mobile iOS · Mobile Android · Web Banking — dados sincronizados do Jira
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Última atualização: <strong className="text-gray-700 dark:text-gray-300">{formatDateTime(lastUpdated)}</strong>
            </span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {refreshing ? 'Atualizando…' : 'Atualizar agora'}
            </button>
            {activeTab === 'executive' && (
              <button
                onClick={() => window.print()}
                className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
              >
                Exportar (PDF)
              </button>
            )}
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-2 print:hidden">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <ActiveView />
      </main>
    </div>
  )
}
