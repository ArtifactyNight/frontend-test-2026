import type {
  FlagFormValues,
  MetadataItem,
  RuleGroup,
  ServeConfig,
} from './schema'

export const newId = () => crypto.randomUUID()

export function isFieldInvalid(meta: { isTouched: boolean; isValid: boolean }) {
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

export function createPercentageDistribution(
  variationKeys: Array<string>,
): Record<string, number> {
  return Object.fromEntries(variationKeys.map((key) => [key, 0]))
}

export function createDefaultServe(firstVariationKey: string): ServeConfig {
  const now = new Date()
  const end = new Date(now)
  end.setDate(end.getDate() + 10)

  return {
    type: 'variation',
    variation: firstVariationKey,
    percentage: createPercentageDistribution(
      firstVariationKey ? [firstVariationKey] : [],
    ),
    progressiveRollout: {
      initial: {
        variation: firstVariationKey,
        percentage: 0,
        date: now.toISOString(),
      },
      end: {
        variation: firstVariationKey,
        percentage: 100,
        date: end.toISOString(),
      },
    },
  }
}

export function toDatetimeLocalValue(iso: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (isNaN(date.getTime())) return ''

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fromDatetimeLocalValue(local: string): string {
  if (!local) return new Date().toISOString()
  return new Date(local).toISOString()
}

function serializeServe(serve: ServeConfig): Record<string, unknown> {
  switch (serve.type) {
    case 'variation':
      return { variation: serve.variation }
    case 'percentage':
      return { percentage: serve.percentage }
    case 'progressive':
      return { progressiveRollout: serve.progressiveRollout }
  }
}

function metadataToRecord(items: Array<MetadataItem>): Record<string, string> {
  return Object.fromEntries(
    items
      .filter((item) => item.key.trim())
      .map((item) => [item.key.trim(), item.value]),
  )
}

export function syncServeWithVariations(
  serve: ServeConfig,
  previousKeys: Array<string>,
  currentKeys: Array<string>,
  renames: Map<string, string>,
): ServeConfig {
  const nextPercentage = { ...serve.percentage }

  for (const key of previousKeys) {
    if (!currentKeys.includes(key) && !renames.has(key)) {
      delete nextPercentage[key]
    }
  }

  for (const [oldKey, newKey] of renames) {
    if (oldKey in nextPercentage) {
      nextPercentage[newKey] = nextPercentage[oldKey]
      delete nextPercentage[oldKey]
    }
  }

  for (const key of currentKeys) {
    if (!(key in nextPercentage)) {
      nextPercentage[key] = 0
    }
  }

  const resolveVariation = (variation: string) => {
    if (renames.has(variation)) return renames.get(variation)!
    if (currentKeys.includes(variation)) return variation
    return currentKeys[0] ?? variation
  }

  return {
    ...serve,
    variation: resolveVariation(serve.variation),
    percentage: nextPercentage,
    progressiveRollout: {
      initial: {
        ...serve.progressiveRollout.initial,
        variation: resolveVariation(serve.progressiveRollout.initial.variation),
      },
      end: {
        ...serve.progressiveRollout.end,
        variation: resolveVariation(serve.progressiveRollout.end.variation),
      },
    },
  }
}

export function syncFormServesWithVariations(
  values: FlagFormValues,
  previousKeysById: Map<string, string>,
): Pick<FlagFormValues, 'targeting' | 'defaultServe'> {
  const currentKeys = values.variations
    .map((variation) => variation.key)
    .filter(Boolean)
  const previousKeys = [...previousKeysById.values()].filter(Boolean)

  const renames = new Map<string, string>()
  for (const variation of values.variations) {
    const previousKey = previousKeysById.get(variation.id)
    if (previousKey && previousKey !== variation.key && variation.key) {
      renames.set(previousKey, variation.key)
    }
  }

  return {
    targeting: values.targeting.map((rule) => ({
      ...rule,
      serve: syncServeWithVariations(
        rule.serve,
        previousKeys,
        currentKeys,
        renames,
      ),
    })),
    defaultServe: syncServeWithVariations(
      values.defaultServe,
      previousKeys,
      currentKeys,
      renames,
    ),
  }
}

export const buildOutput = (
  values: FlagFormValues,
): Record<string, unknown> => {
  const flagConfig: Record<string, unknown> = {
    variations: Object.fromEntries(
      values.variations.map((v) => [v.key, parseVariationValue(v.value)]),
    ),
    targeting: values.targeting.map((rule) => ({
      name: rule.name,
      query: buildQueryString(rule.queryGroup),
      ...serializeServe(rule.serve),
    })),
    defaultRule: serializeServe(values.defaultServe),
  }

  const metadata = metadataToRecord(values.metadata)
  if (Object.keys(metadata).length > 0) {
    flagConfig.metadata = metadata
  }

  return {
    [values.flagName || 'unnamed-flag']: flagConfig,
  }
}
