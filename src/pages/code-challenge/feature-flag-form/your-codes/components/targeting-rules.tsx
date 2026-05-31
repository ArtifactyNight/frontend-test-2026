import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
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
import type { ReactNode } from 'react'
import { withForm } from '../hooks/form-hook'
import { featureFlagFormOptions } from '../lib/form-options'
import type { TargetingRule } from '../lib/schema'
import { createDefaultServe, newId } from '../lib/utils'
import {
  TargetingRuleFields,
  targetingRuleFields,
} from './targeting-rule-fields'

interface SortableRuleShellProps {
  ruleId: string
  index: number
  onRemove: () => void
  children: ReactNode
}

function SortableRuleShell({
  ruleId,
  index,
  onRemove,
  children,
}: SortableRuleShellProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ruleId })

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
          size="icon-sm"
          className="hover:text-destructive hover:bg-destructive/10"
          onClick={onRemove}
        >
          <Trash2Icon />
        </Button>
      </div>
      {children}
    </div>
  )
}

export const TargetingRules = withForm({
  ...featureFlagFormOptions,
  render: function Render({ form }) {
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    )

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const targeting = form.state.values.targeting
      const oldIdx = targeting.findIndex((r) => r.id === active.id)
      const newIdx = targeting.findIndex((r) => r.id === over.id)
      if (oldIdx === -1 || newIdx === -1) return

      form.setFieldValue('targeting', arrayMove(targeting, oldIdx, newIdx))
    }

    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Targeting Rules</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form.AppField name="targeting" mode="array">
            {(field) => {
              const targeting = field.state.value as unknown as TargetingRule[]
              const variationKeys = form.state.values.variations.map(
                (v) => v.key,
              )
              const ids = targeting.map((r: TargetingRule) => r.id)

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
                      {targeting.map((rule: TargetingRule, i: number) => (
                        <SortableRuleShell
                          key={rule.id}
                          ruleId={rule.id}
                          index={i}
                          onRemove={() => field.removeValue(i)}
                        >
                          <TargetingRuleFields
                            form={form}
                            fields={targetingRuleFields(i)}
                            variationKeys={variationKeys}
                          />
                        </SortableRuleShell>
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
            onClick={() => {
              const ruleCount = form.state.values.targeting.length
              const firstVariation = form.state.values.variations[0]?.key ?? ''
              form.pushFieldValue('targeting', {
                id: newId(),
                name: `Rule ${ruleCount + 1}`,
                queryGroup: {
                  id: newId(),
                  connector: 'AND' as const,
                  conditions: [
                    {
                      id: newId(),
                      field: '',
                      operator: '==' as const,
                      value: '',
                    },
                  ],
                  groups: [],
                },
                serve: createDefaultServe(firstVariation),
              })
            }}
          >
            <PlusIcon data-icon="inline-start" />
            Add Rule
          </Button>
        </CardFooter>
      </Card>
    )
  },
})
