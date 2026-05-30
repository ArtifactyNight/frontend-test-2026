import { z } from 'zod'

export const OPERATORS = [
  '==',
  '!=',
  '>',
  '<',
  '>=',
  '<=',
  'in',
  'not in',
] as const
export type Operator = (typeof OPERATORS)[number]

const ruleConditionSchema = z.object({
  id: z.string(),
  field: z.string().min(1, 'Field is required'),
  operator: z.enum(OPERATORS),
  value: z.string().min(1, 'Value is required'),
})
export type RuleCondition = z.infer<typeof ruleConditionSchema>

export interface RuleGroup {
  id: string
  connector: 'AND' | 'OR'
  conditions: RuleCondition[]
  groups: RuleGroup[]
}

export const ruleGroupSchema: z.ZodType<RuleGroup> = z.lazy(() =>
  z.object({
    id: z.string(),
    connector: z.enum(['AND', 'OR']),
    conditions: z.array(ruleConditionSchema),
    groups: z.array(ruleGroupSchema),
  }),
)

export const variationSchema = z.object({
  id: z.string(),
  key: z.string().min(1, 'Name is required'),
  value: z.string().min(1, 'Value is required'),
})
export type Variation = z.infer<typeof variationSchema>

export const SERVE_TYPES = ['variation', 'percentage', 'progressive'] as const
export type ServeType = (typeof SERVE_TYPES)[number]

export const progressiveRolloutPointSchema = z.object({
  variation: z.string().min(1, 'Select a variation'),
  percentage: z.number().min(0, 'Min 0'),
  date: z.string().min(1, 'Date is required'),
})

export const serveConfigSchema = z
  .object({
    type: z.enum(SERVE_TYPES),
    variation: z.string(),
    percentage: z.record(z.string(), z.number()),
    progressiveRollout: z.object({
      initial: progressiveRolloutPointSchema,
      end: progressiveRolloutPointSchema,
    }),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'variation' && !data.variation) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select a variation',
        path: ['variation'],
      })
    }

    if (data.type === 'progressive') {
      const initialDate = new Date(data.progressiveRollout.initial.date)
      const endDate = new Date(data.progressiveRollout.end.date)
      if (
        !isNaN(initialDate.getTime()) &&
        !isNaN(endDate.getTime()) &&
        endDate <= initialDate
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'End date must be after initial date',
          path: ['progressiveRollout', 'end', 'date'],
        })
      }
    }
  })

export type ServeConfig = z.infer<typeof serveConfigSchema>

export const metadataItemSchema = z.object({
  id: z.string(),
  key: z.string(),
  value: z.string(),
})
export type MetadataItem = z.infer<typeof metadataItemSchema>

export const targetingRuleSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  queryGroup: ruleGroupSchema,
  serve: serveConfigSchema,
})
export type TargetingRule = z.infer<typeof targetingRuleSchema>

export const flagFormSchema = z.object({
  flagName: z
    .string()
    .min(1, 'Flag name is required')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  description: z.string(),
  enabled: z.boolean(),
  variations: z
    .array(variationSchema)
    .min(1, 'At least one variation required'),
  targeting: z.array(targetingRuleSchema),
  defaultServe: serveConfigSchema,
  metadata: z.array(metadataItemSchema),
})

export type FlagFormValues = z.infer<typeof flagFormSchema>
