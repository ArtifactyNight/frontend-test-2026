import { formOptions } from '@tanstack/react-form'
import { flagFormSchema } from './schema'
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
    targeting: [] as Array<{
      id: string
      queryGroup: {
        id: string
        connector: 'AND' | 'OR'
        conditions: Array<{ id: string; field: string; operator: string; value: string }>
        groups: never[]
      }
      percentage: number
      variation: string
    }>,
    defaultVariation: 'on',
  },
})
