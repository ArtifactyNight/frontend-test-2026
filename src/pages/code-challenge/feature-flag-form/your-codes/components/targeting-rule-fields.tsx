import {
  Field,
  FieldError,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Separator } from '#/components/ui/separator'
import { withFieldGroup } from '../hooks/form-hook'
import type { TargetingRule } from '../lib/schema'
import { isFieldInvalid, normalizeFieldErrors } from '../lib/utils'
import { RuleGroupFields } from './rule-group-fields'

const targetingRuleDefaultValues: TargetingRule = {
  id: '',
  queryGroup: {
    id: '',
    connector: 'AND',
    conditions: [],
    groups: [],
  },
  percentage: 100,
  variation: '',
}

export function targetingRuleFields(index: number) {
  return {
    id: `targeting[${index}].id`,
    queryGroup: `targeting[${index}].queryGroup`,
    percentage: `targeting[${index}].percentage`,
    variation: `targeting[${index}].variation`,
  } as const
}

export const TargetingRuleFields = withFieldGroup({
  defaultValues: targetingRuleDefaultValues,
  render: function Render({ group, variationKeys }) {
    return (
      <>
        <RuleGroupFields form={group} fields="queryGroup" />

        <Separator />

        <div className="flex gap-3">
          <group.AppField
            name="percentage"
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
            {(field) => {
              const isInvalid = isFieldInvalid(field.state.meta)
              return (
                <Field className="w-28" data-invalid={isInvalid}>
                  <FieldLabel className="text-xs text-muted-foreground">
                    Percentage (%)
                  </FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    placeholder="100"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(Number(e.target.value))
                    }
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    className="h-8 text-xs"
                  />
                  {isInvalid && (
                    <FieldError
                      errors={normalizeFieldErrors(field.state.meta.errors)}
                    />
                  )}
                </Field>
              )
            }}
          </group.AppField>

          <group.AppField
            name="variation"
            validators={{
              onBlur: ({ value }) =>
                !value ? 'Select a variation' : undefined,
            }}
          >
            {(field) => {
              const isInvalid = isFieldInvalid(field.state.meta)
              return (
                <Field className="flex-1" data-invalid={isInvalid}>
                  <FieldLabel className="text-xs text-muted-foreground">
                    Variation
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger
                      className="h-8 text-xs"
                      aria-invalid={isInvalid}
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
                  {isInvalid && (
                    <FieldError
                      errors={normalizeFieldErrors(field.state.meta.errors)}
                    />
                  )}
                </Field>
              )
            }}
          </group.AppField>
        </div>
      </>
    )
  },
  props: {
    variationKeys: [] as Array<string>,
  },
})
