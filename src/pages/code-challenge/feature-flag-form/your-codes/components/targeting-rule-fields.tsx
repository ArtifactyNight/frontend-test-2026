import {
  Field,
  FieldError,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Separator } from '#/components/ui/separator'
import { withFieldGroup } from '../hooks/form-hook'
import type { TargetingRule } from '../lib/schema'
import { isFieldInvalid, normalizeFieldErrors } from '../lib/utils'
import { RuleGroupFields } from './rule-group-fields'
import { ServeFields } from './serve-fields'

const targetingRuleDefaultValues: TargetingRule = {
  id: '',
  name: '',
  queryGroup: {
    id: '',
    connector: 'AND',
    conditions: [],
    groups: [],
  },
  serve: {
    type: 'variation',
    variation: '',
    percentage: {},
    progressiveRollout: {
      initial: { variation: '', percentage: 0, date: '' },
      end: { variation: '', percentage: 100, date: '' },
    },
  },
}

export function targetingRuleFields(index: number) {
  return {
    id: `targeting[${index}].id`,
    name: `targeting[${index}].name`,
    queryGroup: `targeting[${index}].queryGroup`,
    serve: `targeting[${index}].serve`,
  } as const
}

export const TargetingRuleFields = withFieldGroup({
  defaultValues: targetingRuleDefaultValues,
  render: function Render({ group, variationKeys }) {
    return (
      <>
        <group.AppField
          name="name"
          validators={{
            onBlur: ({ value }) =>
              !value?.trim() ? 'Name is required' : undefined,
          }}
        >
          {(field) => {
            const isInvalid = isFieldInvalid(field.state.meta)
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel className="text-xs text-muted-foreground">
                  Name
                </FieldLabel>
                <Input
                  placeholder="Rule 1"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
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

        <RuleGroupFields form={group} fields="queryGroup" />

        <Separator />

        <ServeFields form={group} fields="serve" variationKeys={variationKeys} />
      </>
    )
  },
  props: {
    variationKeys: [] as Array<string>,
  },
})
