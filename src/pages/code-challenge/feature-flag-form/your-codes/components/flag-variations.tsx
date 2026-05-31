import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '#/components/ui/input-group'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { withForm } from '../hooks/form-hook'
import { featureFlagFormOptions } from '../lib/form-options'
import type { Variation } from '../lib/schema'
import { isFieldInvalid, newId, normalizeFieldErrors } from '../lib/utils'

function getValueType(v: string | undefined): string {
  const value = v ?? ''
  if (value === 'true' || value === 'false') return 'boolean'
  if (value.trim() !== '' && !isNaN(Number(value))) return 'number'
  if (value.trim() !== '') return 'string'
  return ''
}

const typeBadgeVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  boolean: 'default',
  number: 'secondary',
  string: 'outline',
}

export const FlagVariations = withForm({
  ...featureFlagFormOptions,
  render: ({ form }) => (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Variations</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form.AppField name="variations" mode="array">
          {(field) => {
            const isArrayInvalid = isFieldInvalid(field.state.meta)
            return (
              <FieldSet>
                <FieldLegend variant="label">Variations</FieldLegend>
                {field.state.value.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No variations yet. Add at least one.
                  </p>
                )}
                <FieldGroup className="gap-3">
                  {field.state.value.length > 0 && (
                    <div className="flex items-center gap-2 pr-10">
                      <span className="flex-1 text-xs text-muted-foreground">
                        Name
                      </span>
                      <span className="flex-1 text-xs text-muted-foreground">
                        Value
                      </span>
                    </div>
                  )}
                  {field.state.value.map((_: Variation, i: number) => (
                    <div
                      key={field.state.value[i]?.id ?? i}
                      className="flex items-start gap-2"
                    >
                      <form.AppField name={`variations[${i}].key`}>
                        {(keyField) => {
                          const isInvalid = isFieldInvalid(keyField.state.meta)
                          return (
                            <Field className="flex-1" data-invalid={isInvalid}>
                              <Input
                                placeholder="variant_1"
                                value={keyField.state.value}
                                onChange={(e) =>
                                  keyField.handleChange(e.target.value)
                                }
                                onBlur={keyField.handleBlur}
                                aria-invalid={isInvalid}
                              />
                              {isInvalid && (
                                <FieldError
                                  errors={normalizeFieldErrors(
                                    keyField.state.meta.errors,
                                  )}
                                />
                              )}
                            </Field>
                          )
                        }}
                      </form.AppField>

                      <form.AppField name={`variations[${i}].value`}>
                        {(valField) => {
                          const isInvalid = isFieldInvalid(valField.state.meta)
                          const type = getValueType(valField.state.value)
                          return (
                            <Field className="flex-1" data-invalid={isInvalid}>
                              <InputGroup>
                                <InputGroupInput
                                  placeholder="true"
                                  value={valField.state.value ?? ''}
                                  onChange={(e) =>
                                    valField.handleChange(e.target.value)
                                  }
                                  onBlur={valField.handleBlur}
                                  aria-invalid={isInvalid}
                                />
                                {type && (
                                  <InputGroupAddon align="inline-end">
                                    <Badge
                                      variant={
                                        typeBadgeVariant[type] ?? 'outline'
                                      }
                                      className="text-[10px] h-4 px-1"
                                    >
                                      {type}
                                    </Badge>
                                  </InputGroupAddon>
                                )}
                              </InputGroup>
                              {isInvalid && (
                                <FieldError
                                  errors={normalizeFieldErrors(
                                    valField.state.meta.errors,
                                  )}
                                />
                              )}
                            </Field>
                          )
                        }}
                      </form.AppField>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="hover:text-destructive hover:bg-destructive/10"
                        onClick={() => field.removeValue(i)}
                        disabled={field.state.value.length <= 1}
                      >
                        <Trash2Icon data-icon="inline-start" />
                      </Button>
                    </div>
                  ))}
                </FieldGroup>
                {isArrayInvalid && (
                  <FieldError
                    errors={normalizeFieldErrors(field.state.meta.errors)}
                  />
                )}
              </FieldSet>
            )
          }}
        </form.AppField>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            form.pushFieldValue('variations', {
              id: newId(),
              key: '',
              value: '',
            })
          }
        >
          <PlusIcon data-icon="inline-start" />
          Add Variation
        </Button>
      </CardFooter>
    </Card>
  ),
})
