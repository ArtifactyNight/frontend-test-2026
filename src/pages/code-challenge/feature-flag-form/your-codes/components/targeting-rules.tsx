import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Separator } from '#/components/ui/separator'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useFormContext, withForm } from '../hooks/form-hook'
import { featureFlagFormOptions } from '../lib/form-options'
import type { FlagFormValues } from '../lib/schema'
import { newId } from '../lib/utils'
import RuleGroupNode from './rule-group'

interface SortableRuleProps {
  ruleId: string
  index: number
  variationKeys: string[]
  onRemove: () => void
}

function SortableRule({
  ruleId,
  index,
  variationKeys,
  onRemove,
}: SortableRuleProps) {
   
  const form = useFormContext()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: ruleId,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3"
    >
      {/* Rule header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVerticalIcon className="size-4" />
        </button>
        <span className="text-xs font-medium text-muted-foreground">
          Rule {index + 1}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-7 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2Icon />
        </Button>
      </div>

      {/* Query builder */}
      <RuleGroupNode basePath={`targeting[${index}].queryGroup`} depth={0} />

      <Separator />

      {/* Percentage + Variation */}
      <div className="flex gap-3">
        <form.AppField
          name={`targeting[${index}].percentage` as any}
          validators={{
            onBlur: ({ value }) => {
              const n = Number(value)
              if (isNaN(n)) return 'Must be a number'
              if (n < 1) return 'Min 1'
              if (n > 100) return 'Max 100'
              return undefined
            },
          }}
        >
          {(f: any) => (
            <div className="flex flex-col gap-1 w-28">
              <Label className="text-xs text-muted-foreground">
                Percentage (%)
              </Label>
              <Input
                type="number"
                min={1}
                max={100}
                placeholder="100"
                value={f.state.value}
                onChange={(e: any) => f.handleChange(Number(e.target.value))}
                onBlur={f.handleBlur}
                aria-invalid={f.state.meta.errors.length > 0}
                className="h-8 text-xs"
              />
              {f.state.meta.errors.length > 0 && (
                <p className="text-[11px] text-destructive">
                  {f.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.AppField>

        <form.AppField
          name={`targeting[${index}].variation`}
          validators={{
            onBlur: ({ value }: any) =>
              !value ? 'Select a variation' : undefined,
          }}
        >
          {(f: any) => (
            <div className="flex flex-col gap-1 flex-1">
              <Label className="text-xs text-muted-foreground">Variation</Label>
              <Select value={f.state.value || null!} onValueChange={f.handleChange}>
                <SelectTrigger
                  className="h-8 text-xs"
                  aria-invalid={f.state.meta.errors.length > 0}
                >
                  <SelectValue placeholder="Select variation" />
                </SelectTrigger>
                <SelectContent>
                  {variationKeys.length === 0 ? (
                    <SelectItem value="_none" disabled className="text-xs">
                      Add variations first
                    </SelectItem>
                  ) : (
                    variationKeys.map((key) => (
                      <SelectItem key={key} value={key} className="text-xs">
                        {key}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {f.state.meta.errors.length > 0 && (
                <p className="text-[11px] text-destructive">
                  {f.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.AppField>
      </div>
    </div>
  )
}

export const TargetingRules = withForm({
  ...featureFlagFormOptions,
  render: ({ form }: { form: any }) => {
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    )

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const targeting: FlagFormValues['targeting'] = (form).state.values
        .targeting
      const oldIdx = targeting.findIndex((r) => r.id === active.id)
      const newIdx = targeting.findIndex((r) => r.id === over.id)
      if (oldIdx === -1 || newIdx === -1) return
      ;(form).setFieldValue(
        'targeting',
        arrayMove(targeting, oldIdx, newIdx),
      )
    }

    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Targeting Rules</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form.AppField name="targeting" mode="array">
            {(field: any) => {
              const targeting: FlagFormValues['targeting'] = field.state.value
              const variationKeys: string[] = (
                form
              ).state.values.variations.map((v: any) => v.key)
              const ids = targeting.map((r) => r.id)

              if (targeting.length === 0) {
                return (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No targeting rules. The default rule will apply to all
                    users.
                  </p>
                )
              }

              return (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={ids}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-3">
                      {targeting.map((rule, i) => (
                        <SortableRule
                          key={rule.id}
                          ruleId={rule.id}
                          index={i}
                          variationKeys={variationKeys}
                          onRemove={() => field.removeValue(i)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )
            }}
          </form.AppField>
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              (form).pushFieldValue('targeting', {
                id: newId(),
                queryGroup: {
                  id: newId(),
                  connector: 'AND',
                  conditions: [
                    { id: newId(), field: '', operator: '==', value: '' },
                  ],
                  groups: [],
                },
                percentage: 100,
                variation: (form).state.values.variations[0]?.key ?? '',
              })
            }
          >
            <PlusIcon data-icon="inline-start" />
            Add Rule
          </Button>
        </CardFooter>
      </Card>
    )
  },
})
