import { formOptions } from '@tanstack/react-form'
import type { FlagFormValues, RuleCondition, RuleGroup } from './schema'
import { flagFormSchema } from './schema'
import { createDefaultServe, newId } from './utils'

function validateFlagForm({ value }: { value: FlagFormValues }) {
  const result = flagFormSchema.safeParse(value)
  if (result.success) return undefined

  const fields: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const path = issue.path.reduce<string>((acc, segment, i) => {
      if (typeof segment === 'number') return `${acc}[${segment}]`
      return i === 0 ? String(segment) : `${acc}.${String(segment)}`
    }, '')
    if (path && !(path in fields)) fields[path] = issue.message
  }

  return { fields }
}

export const featureFlagFormOptions = formOptions({
  validators: {
    onBlur: validateFlagForm,
    onSubmit: validateFlagForm,
  },
  defaultValues: {
    flagName: 'my-new-feature',
    description: '',
    enabled: true,
    variations: [
      { id: newId(), key: 'variant_1', value: 'true' },
      { id: newId(), key: 'variant_2', value: 'false' },
    ],
    targeting: [
      {
        id: newId(),
        name: 'Rule 1',
        queryGroup: {
          id: newId(),
          connector: 'AND' as const,
          conditions: [] as Array<RuleCondition>,
          groups: [] as Array<RuleGroup>,
        },
        serve: createDefaultServe('variant_1'),
      },
    ],
    defaultServe: createDefaultServe('variant_1'),
    metadata: [],
  },
})
