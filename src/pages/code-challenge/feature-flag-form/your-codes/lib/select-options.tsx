import type { LucideIcon } from 'lucide-react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CircleAlertIcon,
  EqualIcon,
  EqualNotIcon,
  FlagIcon,
  ListIcon,
  ListXIcon,
  PieChartIcon,
  TagIcon,
  TrendingUpIcon,
} from 'lucide-react'
import type { Operator, ServeType } from './schema'

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

export const variationOptionIcon = TagIcon
export const emptyVariationsIcon = CircleAlertIcon
