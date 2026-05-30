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
import { Switch } from '#/components/ui/switch'
import { Textarea } from '#/components/ui/textarea'
import { withForm } from '../hooks/form-hook'
import { featureFlagFormOptions } from '../lib/form-options'
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
                onBlur: ({ value }) => {
                  if (!value) return 'Flag name is required'
                  if (!/^[a-z0-9-]+$/.test(value))
                    return 'Lowercase letters, numbers and hyphens only'
                  return undefined
                },
              }}
            >
              {(field) => {
                const isInvalid = isFieldInvalid(field.state.meta)
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="flagName">
                      Flag Name <span className="text-destructive">*</span>
                    </FieldLabel>
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
          </FieldGroup>
        </CardContent>
      </Card>
    )
  },
})
