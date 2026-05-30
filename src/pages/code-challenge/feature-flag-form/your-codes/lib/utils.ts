import type { FlagFormValues, RuleGroup } from './schema'

export const newId = () => crypto.randomUUID()

export function isFieldInvalid(meta: {
  isTouched: boolean
  isValid: boolean
}) {
  return meta.isTouched && !meta.isValid
}

export function normalizeFieldErrors(
  errors: Array<unknown>,
): Array<{ message?: string } | undefined> {
  return errors.map((error) =>
    typeof error === 'string'
      ? { message: error }
      : (error as { message?: string }),
  )
}

export const parseVariationValue = (v: string): string | boolean | number => {
  if (v === 'true') return true
  if (v === 'false') return false
  const n = Number(v)
  return !isNaN(n) && v.trim() !== '' ? n : v
}

const buildQueryString = (group: RuleGroup): string => {
  const parts = [
    ...group.conditions.map((c) => `${c.field} ${c.operator} '${c.value}'`),
    ...group.groups.map((g) => `(${buildQueryString(g)})`),
  ]
  return parts.join(` ${group.connector} `)
}

export const buildOutput = (values: FlagFormValues) => ({
  flags: {
    [values.flagName || 'unnamed-flag']: {
      variations: Object.fromEntries(
        values.variations.map((v) => [v.key, parseVariationValue(v.value)]),
      ),
      targeting: values.targeting.map((rule) => ({
        query: buildQueryString(rule.queryGroup),
        percentage: rule.percentage,
        variation: rule.variation,
      })),
      defaultRule: {
        variation: values.defaultVariation,
      },
    },
  },
})
