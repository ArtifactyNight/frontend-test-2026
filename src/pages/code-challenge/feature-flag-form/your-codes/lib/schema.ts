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

export const targetingRuleSchema = z.object({
  id: z.string(),
  queryGroup: ruleGroupSchema,
  percentage: z.number().min(1, 'Min 1').max(100, 'Max 100'),
  variation: z.string().min(1, 'Select a variation'),
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
  defaultVariation: z.string().min(1, 'Select a default variation'),
})

export type FlagFormValues = z.infer<typeof flagFormSchema>
