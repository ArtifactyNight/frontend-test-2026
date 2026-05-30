import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { cn } from '#/lib/utils'
import { LayersIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useFormContext } from '../hooks/form-hook'
import { OPERATORS } from '../lib/schema'
import { newId } from '../lib/utils'

const DEPTH_COLORS = [
  'border-blue-500/50',
  'border-green-500/50',
  'border-purple-500/50',
  'border-orange-500/50',
  'border-pink-500/50',
]

interface RuleGroupNodeProps {
  basePath: string
  depth?: number
  onRemove?: () => void
}

export default function RuleGroupNode({ basePath, depth = 0, onRemove }: RuleGroupNodeProps) {
   
  const form = useFormContext()

  const addCondition = () => {
    form.pushFieldValue(`${basePath}.conditions`, {
      id: newId(),
      field: '',
      operator: '==',
      value: '',
    })
  }

  const addSubGroup = () => {
    form.pushFieldValue(`${basePath}.groups`, {
      id: newId(),
      connector: 'AND',
      conditions: [],
      groups: [],
    })
  }

  const depthColor = DEPTH_COLORS[depth % DEPTH_COLORS.length]

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-lg border-l-2 bg-muted/30 p-3',
        depthColor,
        depth > 0 && 'ml-3',
      )}
    >
      {/* Header: AND/OR + remove */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayersIcon className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Group</span>
          <form.AppField name={`${basePath}.connector`}>
            {(connField: any) => (
              <ToggleGroup
                type="single"
                size="sm"
                spacing={0}
                value={connField.state.value}
                onValueChange={(v: string) => v && connField.handleChange(v)}
              >
                <ToggleGroupItem value="AND" variant="outline">AND</ToggleGroupItem>
                <ToggleGroupItem value="OR" variant="outline">OR</ToggleGroupItem>
              </ToggleGroup>
            )}
          </form.AppField>
        </div>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-7 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2Icon />
          </Button>
        )}
      </div>

      {/* Conditions */}
      <form.AppField name={`${basePath}.conditions`} mode="array">
        {(conditionsField: any) => (
          <div className="flex flex-col gap-2">
            {conditionsField.state.value.map((_: any, i: number) => {
              const condId = conditionsField.state.value[i]?.id ?? i
              return (
                <div key={condId} className="flex items-start gap-1.5">
                  <form.AppField name={`${basePath}.conditions[${i}].field`}>
                    {(f: any) => (
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <Input
                          placeholder="field"
                          value={f.state.value}
                          onChange={(e: any) => f.handleChange(e.target.value)}
                          onBlur={f.handleBlur}
                          aria-invalid={f.state.meta.errors.length > 0}
                          className="h-8 text-xs"
                        />
                        {f.state.meta.errors.length > 0 && (
                          <p className="text-[11px] text-destructive">{f.state.meta.errors[0]}</p>
                        )}
                      </div>
                    )}
                  </form.AppField>

                  <form.AppField name={`${basePath}.conditions[${i}].operator`}>
                    {(f: any) => (
                      <Select value={f.state.value || null!} onValueChange={f.handleChange}>
                        <SelectTrigger className="h-8 w-24 shrink-0 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {OPERATORS.map((op) => (
                            <SelectItem key={op} value={op} className="text-xs">
                              {op}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </form.AppField>

                  <form.AppField name={`${basePath}.conditions[${i}].value`}>
                    {(f: any) => (
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <Input
                          placeholder="value"
                          value={f.state.value}
                          onChange={(e: any) => f.handleChange(e.target.value)}
                          onBlur={f.handleBlur}
                          aria-invalid={f.state.meta.errors.length > 0}
                          className="h-8 text-xs"
                        />
                        {f.state.meta.errors.length > 0 && (
                          <p className="text-[11px] text-destructive">{f.state.meta.errors[0]}</p>
                        )}
                      </div>
                    )}
                  </form.AppField>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => conditionsField.removeValue(i)}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </form.AppField>

      {/* Nested groups */}
      <form.AppField name={`${basePath}.groups`} mode="array">
        {(groupsField: any) => (
          <div className="flex flex-col gap-2">
            {groupsField.state.value.map((_: any, i: number) => {
              const gId = groupsField.state.value[i]?.id ?? i
              return (
                <RuleGroupNode
                  key={gId}
                  basePath={`${basePath}.groups[${i}]`}
                  depth={depth + 1}
                  onRemove={() => groupsField.removeValue(i)}
                />
              )
            })}
          </div>
        )}
      </form.AppField>

      {/* Add buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={addCondition}
        >
          <PlusIcon data-icon="inline-start" />
          Condition
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={addSubGroup}
        >
          <LayersIcon data-icon="inline-start" />
          Sub-group
        </Button>
      </div>
    </div>
  )
}
