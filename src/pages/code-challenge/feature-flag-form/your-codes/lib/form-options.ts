import { formOptions } from '@tanstack/react-form'
import { flagFormSchema } from './schema'
import type { RuleCondition, RuleGroup } from './schema'
import { newId } from './utils'

export const featureFlagFormOptions = formOptions({
  validators: { onSubmit: flagFormSchema.parse },
  defaultValues: {
    flagName: 'my-new-feature',
    description: '',
    enabled: true,
    variations: [
      { id: newId(), key: 'on', value: 'true' },
      { id: newId(), key: 'off', value: 'false' },
    ],
    targeting: [
      {
        id: newId(),
        queryGroup: {
          id: newId(),
          connector: 'AND' as const,
          conditions: [] as Array<RuleCondition>,
          groups: [] as Array<RuleGroup>,
        },
        percentage: 100,
        variation: 'on',
      },
    ],
    defaultVariation: 'on',
  },
})
