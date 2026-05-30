import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { withForm } from '../hooks/form-hook'
import { featureFlagFormOptions } from '../lib/form-options'
import { newId } from '../lib/utils'

function getValueType(v: string): string {
  if (v === 'true' || v === 'false') return 'boolean'
  if (v.trim() !== '' && !isNaN(Number(v))) return 'number'
  if (v.trim() !== '') return 'string'
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
          {(field: any) => (
            <div className="flex flex-col gap-3">
              {field.state.value.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No variations yet. Add at least one.
                </p>
              )}

              {field.state.value.map((_: any, i: number) => {
                const valueStr = field.state.value[i]?.value ?? ''
                const type = getValueType(valueStr)
                return (
                  <div
                    key={field.state.value[i]?.id ?? i}
                    className="flex items-start gap-2"
                  >
                    <form.AppField name={`variations[${i}].key`}>
                      {(keyField: any) => (
                        <div className="flex flex-col gap-1 flex-1">
                          {i === 0 && (
                            <Label className="text-xs text-muted-foreground">
                              Name
                            </Label>
                          )}
                          <Input
                            placeholder="on"
                            value={keyField.state.value}
                            onChange={(e: any) =>
                              keyField.handleChange(e.target.value)
                            }
                            onBlur={keyField.handleBlur}
                            aria-invalid={keyField.state.meta.errors.length > 0}
                          />
                          {keyField.state.meta.errors.length > 0 && (
                            <p className="text-xs text-destructive">
                              {keyField.state.meta.errors[0]}
                            </p>
                          )}
                        </div>
                      )}
                    </form.AppField>

                    <form.AppField name={`variations[${i}].value`}>
                      {(valField: any) => (
                        <div className="flex flex-col gap-1 flex-1">
                          {i === 0 && (
                            <div className="flex items-center gap-1.5">
                              <Label className="text-xs text-muted-foreground">
                                Value
                              </Label>
                            </div>
                          )}
                          <div className="relative">
                            <Input
                              placeholder="true"
                              value={valField.state.value}
                              onChange={(e: any) =>
                                valField.handleChange(e.target.value)
                              }
                              onBlur={valField.handleBlur}
                              aria-invalid={
                                valField.state.meta.errors.length > 0
                              }
                            />
                            {i >= 0 && type && (
                              <Badge
                                variant={typeBadgeVariant[type] ?? 'outline'}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] h-4 px-1"
                              >
                                {type}
                              </Badge>
                            )}
                          </div>
                          {valField.state.meta.errors.length > 0 && (
                            <p className="text-xs text-destructive">
                              {valField.state.meta.errors[0]}
                            </p>
                          )}
                        </div>
                      )}
                    </form.AppField>

                    <div className={i === 0 ? 'mt-5' : ''}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => field.removeValue(i)}
                        disabled={field.state.value.length <= 1}
                      >
                        <Trash2Icon data-icon="inline-start" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </form.AppField>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            (form as any).pushFieldValue('variations', {
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
