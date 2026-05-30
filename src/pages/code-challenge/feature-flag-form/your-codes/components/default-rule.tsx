import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { withForm } from '../hooks/form-hook'
import { featureFlagFormOptions } from '../lib/form-options'
import { isFieldInvalid, normalizeFieldErrors } from '../lib/utils'

export const DefaultRule = withForm({
  ...featureFlagFormOptions,
  render: ({ form }) => (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Default Rule</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <FieldGroup>
          <form.AppField
            name="defaultVariation"
            validators={{
              onBlur: ({ value }) =>
                !value ? 'Select a default variation' : undefined,
            }}
          >
            {(field) => {
              const variationKeys: string[] = form.state.values.variations.map(
                (v) => v.key,
              )
              const isInvalid = isFieldInvalid(field.state.meta)
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="defaultVariation">
                    Default Variation{' '}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger
                      id="defaultVariation"
                      aria-invalid={isInvalid}
                    >
                      <SelectValue placeholder="Select a variation" />
                    </SelectTrigger>
                    <SelectContent>
                      {variationKeys.length === 0 ? (
                        <SelectItem value="_none" disabled>
                          Add variations first
                        </SelectItem>
                      ) : (
                        variationKeys.map((key) => (
                          <SelectItem key={key} value={key}>
                            {key}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Fallback variation served to users who don&apos;t match any
                    targeting rule.
                  </FieldDescription>
                  {isInvalid && (
                    <FieldError
                      errors={normalizeFieldErrors(field.state.meta.errors)}
                    />
                  )}
                </Field>
              )
            }}
          </form.AppField>
        </FieldGroup>
      </CardContent>
    </Card>
  ),
})
