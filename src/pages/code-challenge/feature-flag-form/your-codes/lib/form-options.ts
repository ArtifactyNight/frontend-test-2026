import { formOptions } from '@tanstack/react-form'
import { type RuleCondition, type RuleGroup } from './schema'
import { createDefaultServe, newId } from './utils'

export const featureFlagFormOptions = formOptions({
  // validators: {
  //   onBlur: flagFormSchema,
  //   onSubmit: flagFormSchema,
  // },
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
