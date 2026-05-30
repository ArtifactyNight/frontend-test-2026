import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  KeyValue,
  KeyValueAdd,
  KeyValueItem,
  KeyValueKeyInput,
  KeyValueList,
  KeyValueRemove,
  KeyValueValueInput,
} from '#/components/ui/key-value'
import { Separator } from '#/components/ui/separator'
import { Switch } from '#/components/ui/switch'
import { Textarea } from '#/components/ui/textarea'
import { withForm } from '../hooks/form-hook'
import { featureFlagFormOptions } from '../lib/form-options'
import { flagNameSchema } from '../lib/schema'
import { isFieldInvalid, normalizeFieldErrors } from '../lib/utils'

export const FlagMetadata = withForm({
  ...featureFlagFormOptions,
  render: ({ form }) => {
    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Flag Metadata</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <FieldGroup>
            <form.AppField
              name="flagName"
              validators={{
                onChange: ({ value }) => {
                  const result = flagNameSchema.safeParse(value)
                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message
                },
              }}
            >
              {(field) => {
                const isInvalid = isFieldInvalid(field.state.meta)
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="flagName">Flag Name</FieldLabel>
                    <Input
                      id="flagName"
                      name={field.name}
                      placeholder="my-feature-flag"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
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
            </form.AppField>

            <form.AppField name="description">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    name={field.name}
                    placeholder="What does this flag control?"
                    rows={2}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="resize-none"
                  />
                </Field>
              )}
            </form.AppField>

            <form.AppField name="enabled">
              {(field) => {
                const isInvalid = isFieldInvalid(field.state.meta)
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldTitle>Enabled</FieldTitle>
                      <FieldDescription>
                        Toggle this flag on or off globally
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError
                          errors={normalizeFieldErrors(field.state.meta.errors)}
                        />
                      )}
                    </FieldContent>
                    <Switch
                      id="enabled"
                      name={field.name}
                      checked={field.state.value}
                      onCheckedChange={field.handleChange}
                      aria-invalid={isInvalid}
                    />
                  </Field>
                )
              }}
            </form.AppField>

            <Separator />

            <form.AppField name="metadata">
              {(field) => (
                <Field>
                  <FieldLabel>Metadata</FieldLabel>
                  <FieldDescription>
                    Optional key-value metadata attached to this flag.
                  </FieldDescription>
                  <KeyValue
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    minItems={0}
                  >
                    <KeyValueList>
                      <KeyValueItem>
                        <KeyValueKeyInput className="h-9 text-sm" />
                        <KeyValueValueInput
                          placeholder="Value"
                          className="min-h-9 text-sm"
                          maxRows={3}
                        />
                        <KeyValueRemove />
                      </KeyValueItem>
                    </KeyValueList>
                    <KeyValueAdd />
                  </KeyValue>
                </Field>
              )}
            </form.AppField>
          </FieldGroup>
        </CardContent>
      </Card>
    )
  },
})
