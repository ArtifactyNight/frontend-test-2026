import { Field, FieldError, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { MaskInput } from '#/components/ui/mask-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Separator } from '#/components/ui/separator'
import { useStore } from '@tanstack/react-form'
import { withFieldGroup } from '../hooks/form-hook'
import type { ServeConfig } from '../lib/schema'
import {
  emptyVariationsIcon,
  SelectOptionLabel,
  SERVE_TYPE_OPTIONS,
  VariationMarker,
  VariationOptionLabel,
} from '../lib/select-options'
import {
  createPercentageDistribution,
  fromDatetimeLocalValue,
  isFieldInvalid,
  normalizeFieldErrors,
  toDatetimeLocalValue,
} from '../lib/utils'

const serveDefaultValues: ServeConfig = {
  type: 'variation',
  variation: '',
  percentage: {},
  progressiveRollout: {
    initial: { variation: '', percentage: 0, date: '' },
    end: { variation: '', percentage: 100, date: '' },
  },
}

function VariationSelect({
  value,
  onChange,
  onBlur,
  variationKeys,
  invalid,
  id,
}: {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  variationKeys: Array<string>
  invalid?: boolean
  id?: string
}) {
  return (
    <Select
      name={id}
      value={value || null!}
      onValueChange={onChange}
      onOpenChange={(open) => {
        if (!open) onBlur?.()
      }}
    >
      <SelectTrigger
        id={id}
        className="h-8 text-xs"
        aria-invalid={invalid}
        onBlur={onBlur}
      >
        <SelectValue placeholder="Select variation" />
      </SelectTrigger>
      <SelectContent>
        {variationKeys.length === 0 ? (
          <SelectItem value="_none" disabled className="text-xs">
            <SelectOptionLabel
              icon={emptyVariationsIcon}
              label="Add variations first"
            />
          </SelectItem>
        ) : (
          variationKeys.map((key, index) => (
            <SelectItem key={key} value={key} className="text-xs">
              <VariationOptionLabel label={key} index={index} />
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}

export const ServeFields = withFieldGroup({
  defaultValues: serveDefaultValues,
  props: {
    variationKeys: [] as Array<string>,
  },
  render: function Render({ group, variationKeys }) {
    const serveType = useStore(group.store, (state) => state.values.type)

    return (
      <div className="flex flex-col gap-3">
        <group.AppField name="type">
          {(field) => (
            <Field>
              <FieldLabel className="text-xs text-muted-foreground">
                Serve
              </FieldLabel>
              <Select
                value={field.state.value || null!}
                onValueChange={(value) => {
                  field.handleChange(value as ServeConfig['type'])
                  if (value === 'percentage') {
                    const current = group.getFieldValue('percentage') as Record<
                      string,
                      number
                    >
                    group.setFieldValue('percentage', {
                      ...createPercentageDistribution(variationKeys),
                      ...current,
                    })
                  }
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVE_TYPE_OPTIONS.map(({ value, label, icon }) => (
                    <SelectItem key={value} value={value} className="text-xs">
                      <SelectOptionLabel icon={icon} label={label} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        </group.AppField>

        {serveType === 'variation' && (
          <group.AppField
            name="variation"
            validators={{
              onBlur: ({ value }) =>
                !value ? 'Select a variation' : undefined,
            }}
          >
            {(field) => {
              const isInvalid = isFieldInvalid(field.state.meta)
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel className="text-xs text-muted-foreground">
                    Variation
                  </FieldLabel>
                  <VariationSelect
                    id={field.name}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    variationKeys={variationKeys}
                    invalid={isInvalid}
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
        )}

        {serveType === 'percentage' && (
          <group.AppField name="percentage">
            {(field) => (
              <div className="flex flex-col gap-2">
                <FieldLabel className="text-xs text-muted-foreground">
                  Percentage distribution
                </FieldLabel>
                {variationKeys.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Add variations first
                  </p>
                ) : (
                  variationKeys.map((key, index) => (
                    <Field key={key}>
                      <FieldLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <VariationMarker index={index} />
                        {key}
                      </FieldLabel>
                      <MaskInput
                        mask="percentage"
                        placeholder="0.00%"
                        min={0}
                        max={100}
                        className="h-8 text-xs"
                        value={String(field.state.value[key] ?? 0)}
                        onValueChange={(_maskedValue, unmaskedValue) => {
                          const parsed =
                            unmaskedValue === '' || unmaskedValue === '.'
                              ? 0
                              : parseFloat(unmaskedValue)
                          field.handleChange({
                            ...field.state.value,
                            [key]: Number.isNaN(parsed) ? 0 : parsed,
                          })
                        }}
                        onBlur={field.handleBlur}
                      />
                    </Field>
                  ))
                )}
              </div>
            )}
          </group.AppField>
        )}

        {serveType === 'progressive' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 rounded-md border border-border p-3">
              <FieldLabel className="text-xs font-medium">Initial</FieldLabel>
              <group.AppField
                name="progressiveRollout.initial.variation"
                validators={{
                  onBlur: ({ value }) =>
                    !value ? 'Select a variation' : undefined,
                }}
              >
                {(field) => {
                  const isInvalid = isFieldInvalid(field.state.meta)
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel className="text-xs text-muted-foreground">
                        Variation
                      </FieldLabel>
                      <VariationSelect
                        value={field.state.value}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        variationKeys={variationKeys}
                        invalid={isInvalid}
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

              <group.AppField name="progressiveRollout.initial.percentage">
                {(field) => (
                  <Field className="w-full">
                    <FieldLabel className="text-xs text-muted-foreground">
                      Percentage
                    </FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      className="h-8 text-xs"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      onBlur={field.handleBlur}
                    />
                  </Field>
                )}
              </group.AppField>

              <group.AppField name="progressiveRollout.initial.date">
                {(field) => (
                  <Field>
                    <FieldLabel className="text-xs text-muted-foreground">
                      Date
                    </FieldLabel>
                    <Input
                      type="datetime-local"
                      className="h-8 text-xs"
                      value={toDatetimeLocalValue(field.state.value)}
                      onChange={(e) =>
                        field.handleChange(
                          fromDatetimeLocalValue(e.target.value),
                        )
                      }
                      onBlur={field.handleBlur}
                    />
                  </Field>
                )}
              </group.AppField>
            </div>

            <Separator />

            <div className="flex flex-col gap-2 rounded-md border border-border p-3">
              <FieldLabel className="text-xs font-medium">End</FieldLabel>
              <group.AppField
                name="progressiveRollout.end.variation"
                validators={{
                  onBlur: ({ value }) =>
                    !value ? 'Select a variation' : undefined,
                }}
              >
                {(field) => {
                  const isInvalid = isFieldInvalid(field.state.meta)
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel className="text-xs text-muted-foreground">
                        Variation
                      </FieldLabel>
                      <VariationSelect
                        value={field.state.value}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        variationKeys={variationKeys}
                        invalid={isInvalid}
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

              <group.AppField name="progressiveRollout.end.percentage">
                {(field) => (
                  <Field className="w-full">
                    <FieldLabel className="text-xs text-muted-foreground">
                      Percentage
                    </FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      className="h-8 text-xs"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      onBlur={field.handleBlur}
                    />
                  </Field>
                )}
              </group.AppField>

              <group.AppField
                name="progressiveRollout.end.date"
                validators={{
                  onBlur: ({ value }) => {
                    const initialDate = group.getFieldValue(
                      'progressiveRollout.initial.date',
                    ) as string
                    if (!value) return 'Date is required'
                    const initial = new Date(initialDate)
                    const end = new Date(value)
                    if (!isNaN(initial.getTime()) && end <= initial) {
                      return 'End date must be after initial date'
                    }
                    return undefined
                  },
                  onChangeListenTo: ['progressiveRollout.initial.date'],
                }}
              >
                {(field) => {
                  const isInvalid = isFieldInvalid(field.state.meta)
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel className="text-xs text-muted-foreground">
                        Date
                      </FieldLabel>
                      <Input
                        type="datetime-local"
                        className="h-8 text-xs"
                        value={toDatetimeLocalValue(field.state.value)}
                        onChange={(e) =>
                          field.handleChange(
                            fromDatetimeLocalValue(e.target.value),
                          )
                        }
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
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
            </div>
          </div>
        )}
      </div>
    )
  },
})
