import { Button } from '#/components/ui/button'
import { Field, FieldError } from '#/components/ui/field'
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
import { withFieldGroup } from '../hooks/form-hook'
import type { RuleCondition, RuleGroup } from '../lib/schema'
import { OPERATOR_OPTIONS, SelectOptionLabel } from '../lib/select-options'
import { isFieldInvalid, newId, normalizeFieldErrors } from '../lib/utils'

const DEPTH_COLORS = [
  'border-blue-500/50',
  'border-green-500/50',
  'border-purple-500/50',
  'border-orange-500/50',
  'border-pink-500/50',
]

const ruleGroupDefaultValues: RuleGroup = {
  id: '',
  connector: 'AND',
  conditions: [],
  groups: [],
}

export const RuleGroupFields = withFieldGroup({
  defaultValues: ruleGroupDefaultValues,
  props: {
    depth: 0,
    onRemove: undefined as (() => void) | undefined,
  },
  render: function Render({ group, depth, onRemove }) {
    const depthColor = DEPTH_COLORS[depth % DEPTH_COLORS.length]

    const addCondition = () => {
      group.pushFieldValue('conditions', {
        id: newId(),
        field: '',
        operator: '==',
        value: '',
      })
    }

    const addSubGroup = () => {
      group.pushFieldValue('groups', {
        id: newId(),
        connector: 'AND',
        conditions: [],
        groups: [],
      })
    }

    return (
      <div
        className={cn(
          'flex flex-col gap-3 rounded-lg border-l-2 bg-muted/30 p-3',
          depthColor,
          depth > 0 && 'ml-3',
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayersIcon className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              Group
            </span>
            <group.AppField name="connector">
              {(connField) => (
                <ToggleGroup
                  type="single"
                  size="sm"
                  spacing={0}
                  value={connField.state.value}
                  onValueChange={(v) => v && connField.handleChange(v)}
                >
                  <ToggleGroupItem value="AND" variant="outline">
                    AND
                  </ToggleGroupItem>
                  <ToggleGroupItem value="OR" variant="outline">
                    OR
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
            </group.AppField>
          </div>
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="hover:text-destructive hover:bg-destructive/10"
              onClick={onRemove}
            >
              <Trash2Icon />
            </Button>
          )}
        </div>

        <group.AppField name="conditions" mode="array">
          {(conditionsField) => (
            <div className="flex flex-col gap-2">
              {conditionsField.state.value.map(
                (_: RuleCondition, i: number) => {
                  const condId = conditionsField.state.value[i]?.id ?? i
                  return (
                    <div key={condId} className="flex items-start gap-1.5">
                      <group.AppField name={`conditions[${i}].field`}>
                        {(f) => {
                          const isInvalid = isFieldInvalid(f.state.meta)
                          return (
                            <Field
                              className="min-w-0 flex-1"
                              data-invalid={isInvalid}
                            >
                              <Input
                                placeholder="field"
                                value={f.state.value}
                                onChange={(e) => f.handleChange(e.target.value)}
                                onBlur={f.handleBlur}
                                aria-invalid={isInvalid}
                                className="h-8 text-xs"
                              />
                              {isInvalid && (
                                <FieldError
                                  errors={normalizeFieldErrors(
                                    f.state.meta.errors,
                                  )}
                                />
                              )}
                            </Field>
                          )
                        }}
                      </group.AppField>

                      <group.AppField name={`conditions[${i}].operator`}>
                        {(f) => (
                          <Select
                            value={f.state.value || null!}
                            onValueChange={f.handleChange}
                          >
                            <SelectTrigger className="h-8 min-w-28 shrink-0 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {OPERATOR_OPTIONS.map(
                                ({ value, icon, label }) => (
                                  <SelectItem
                                    key={value}
                                    value={value}
                                    className="text-xs"
                                  >
                                    <SelectOptionLabel
                                      icon={icon}
                                      label={label}
                                    />
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      </group.AppField>

                      <group.AppField name={`conditions[${i}].value`}>
                        {(f) => {
                          const isInvalid = isFieldInvalid(f.state.meta)
                          return (
                            <Field
                              className="min-w-0 flex-1"
                              data-invalid={isInvalid}
                            >
                              <Input
                                placeholder="value"
                                value={f.state.value}
                                onChange={(e) => f.handleChange(e.target.value)}
                                onBlur={f.handleBlur}
                                aria-invalid={isInvalid}
                                className="h-8 text-xs"
                              />
                              {isInvalid && (
                                <FieldError
                                  errors={normalizeFieldErrors(
                                    f.state.meta.errors,
                                  )}
                                />
                              )}
                            </Field>
                          )
                        }}
                      </group.AppField>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="hover:text-destructive hover:bg-destructive/10"
                        onClick={() => conditionsField.removeValue(i)}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  )
                },
              )}
            </div>
          )}
        </group.AppField>

        <group.AppField name="groups" mode="array">
          {(groupsField) => (
            <div className="flex flex-col gap-2">
              {groupsField.state.value.map((_: RuleGroup, i: number) => {
                const gId = groupsField.state.value[i]?.id ?? i
                return (
                  <RuleGroupFields
                    key={gId}
                    form={group}
                    fields={`groups[${i}]`}
                    depth={depth + 1}
                    onRemove={() => groupsField.removeValue(i)}
                  />
                )
              })}
            </div>
          )}
        </group.AppField>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={addCondition}
          >
            <PlusIcon data-icon="inline-start" />
            Condition
          </Button>
          <Button type="button" variant="ghost" size="xs" onClick={addSubGroup}>
            <LayersIcon data-icon="inline-start" />
            Sub-group
          </Button>
        </div>
      </div>
    )
  },
})
