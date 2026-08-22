import type {
  DependencyStatus,
  ItemStatus,
  ParecerResultado,
  RiskLevel,
  SecurityStatus,
} from '../types'

type Tone = 'gray' | 'blue' | 'red' | 'amber' | 'green' | 'purple'

const toneClasses: Record<Tone, string> = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
}

export function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${toneClasses[tone]}`}>
      {children}
    </span>
  )
}

const riskTone: Record<RiskLevel, Tone> = { baixo: 'green', médio: 'amber', alto: 'red' }
const riskDot: Record<RiskLevel, string> = { baixo: '●', médio: '●', alto: '●' }
export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <Badge tone={riskTone[level]}>
      <span>{riskDot[level]}</span> Risco {level}
    </Badge>
  )
}

const statusTone: Record<ItemStatus, Tone> = {
  'A Fazer': 'gray',
  'Em Andamento': 'blue',
  Bloqueado: 'red',
  'Em Homologação': 'purple',
  Concluído: 'green',
}
export function StatusBadge({ status }: { status: ItemStatus }) {
  return <Badge tone={statusTone[status]}>{status}</Badge>
}

const depTone: Record<DependencyStatus, Tone> = {
  'não iniciado': 'gray',
  'em andamento': 'blue',
  concluído: 'green',
  bloqueado: 'red',
}
export function DependencyStatusBadge({ status }: { status: DependencyStatus }) {
  return <Badge tone={depTone[status]}>{status}</Badge>
}

const secTone: Record<SecurityStatus, Tone> = {
  pendente: 'amber',
  aprovado: 'green',
  reprovado: 'red',
  'N/A': 'gray',
}
export function SecurityBadge({ status }: { status: SecurityStatus }) {
  return <Badge tone={secTone[status]}>{status}</Badge>
}

const parecerTone: Record<ParecerResultado, Tone> = {
  aprovado: 'green',
  'aprovado com ressalvas': 'amber',
  reprovado: 'red',
  pendente: 'gray',
}
export function ParecerBadge({ resultado }: { resultado: ParecerResultado }) {
  return <Badge tone={parecerTone[resultado]}>{resultado}</Badge>
}
