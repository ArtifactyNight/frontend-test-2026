import { cn } from '#/lib/utils'
import type { LucideIcon } from 'lucide-react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CircleAlertIcon,
  CircleDotIcon,
  DiamondIcon,
  EqualIcon,
  EqualNotIcon,
  FlagIcon,
  HexagonIcon,
  ListIcon,
  ListXIcon,
  PieChartIcon,
  SparklesIcon,
  SquareIcon,
  StarIcon,
  TriangleIcon,
  TrendingUpIcon,
  ZapIcon,
} from 'lucide-react'
import type { Operator, ServeType } from './schema'

type VariationMeta = {
  icon: LucideIcon
  color: string
  bg: string
}

export const VARIATION_META: Array<VariationMeta> = [
  { icon: CircleDotIcon, color: 'text-blue-500', bg: 'bg-blue-500/15' },
  { icon: SquareIcon, color: 'text-green-500', bg: 'bg-green-500/15' },
  { icon: TriangleIcon, color: 'text-purple-500', bg: 'bg-purple-500/15' },
  { icon: DiamondIcon, color: 'text-orange-500', bg: 'bg-orange-500/15' },
  { icon: HexagonIcon, color: 'text-pink-500', bg: 'bg-pink-500/15' },
  { icon: StarIcon, color: 'text-cyan-500', bg: 'bg-cyan-500/15' },
  { icon: SparklesIcon, color: 'text-amber-500', bg: 'bg-amber-500/15' },
  { icon: ZapIcon, color: 'text-rose-500', bg: 'bg-rose-500/15' },
]

export function getVariationMeta(index: number): VariationMeta {
  return VARIATION_META[index % VARIATION_META.length]
}

export function VariationMarker({
  index,
  className,
}: {
  index: number
  className?: string
}) {
  const { icon: Icon, color, bg } = getVariationMeta(index)

  return (
    <span
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded-md',
        bg,
        className,
      )}
    >
      <Icon className={cn('size-3', color)} />
    </span>
  )
}

export function VariationOptionLabel({
  label,
  index,
}: {
  label: string
  index: number
}) {
  return (
    <>
      <VariationMarker index={index} />
      <span>{label}</span>
    </>
  )
}

export function SelectOptionLabel({
  icon: Icon,
  label,
}: {
  icon: LucideIcon
  label: string
}) {
  return (
    <>
      <Icon className="text-muted-foreground size-4 shrink-0" />
      <span>{label}</span>
    </>
  )
}

export const SERVE_TYPE_OPTIONS: Array<{
  value: ServeType
  label: string
  icon: LucideIcon
}> = [
  { value: 'variation', label: 'Variation', icon: FlagIcon },
  { value: 'percentage', label: 'Percentage rollout', icon: PieChartIcon },
  { value: 'progressive', label: 'Progressive rollout', icon: TrendingUpIcon },
]

export const OPERATOR_OPTIONS: Array<{ value: Operator; icon: LucideIcon; label: string }> = [
  { value: '==', icon: EqualIcon, label: 'Equals' },
  { value: '!=', icon: EqualNotIcon, label: 'Not equals' },
  { value: '>', icon: ChevronRightIcon, label: 'Greater than' },
  { value: '<', icon: ChevronLeftIcon, label: 'Less than' },
  { value: '>=', icon: ChevronsRightIcon, label: 'Greater than or equal' },
  { value: '<=', icon: ChevronsLeftIcon, label: 'Less than or equal' },
  { value: 'in', icon: ListIcon, label: 'In' },
  { value: 'not in', icon: ListXIcon, label: 'Not in' },
]

export const emptyVariationsIcon = CircleAlertIcon
