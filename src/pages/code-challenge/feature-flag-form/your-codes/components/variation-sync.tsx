import { useStore } from '@tanstack/react-form'
import { useEffect, useRef } from 'react'
import { useAppForm } from '../hooks/form-hook'
import { featureFlagFormOptions } from '../lib/form-options'
import type { Variation } from '../lib/schema'
import { syncFormServesWithVariations } from '../lib/utils'

export function VariationSync() {
  const form = useAppForm(featureFlagFormOptions)
  const variations = useStore(form.store, (state) => state.values.variations)
  const previousKeysRef = useRef(
    new Map<string, string>(
      form.state.values.variations.map((variation) => [
        variation.id,
        variation.key,
      ]),
    ),
  )

  useEffect(() => {
    const previousKeys = previousKeysRef.current
    const currentMap = new Map(
      variations.map((variation: Variation) => [variation.id, variation.key]),
    )

    let changed = previousKeys.size !== currentMap.size
    if (!changed) {
      for (const [id, key] of currentMap) {
        if (previousKeys.get(id) !== key) {
          changed = true
          break
        }
      }
    }

    if (changed && previousKeys.size > 0) {
      const synced = syncFormServesWithVariations(
        form.state.values,
        previousKeys,
      )
      form.setFieldValue('targeting', synced.targeting)
      form.setFieldValue('defaultServe', synced.defaultServe)
    }

    previousKeysRef.current = currentMap
  }, [variations])

  return null
}
