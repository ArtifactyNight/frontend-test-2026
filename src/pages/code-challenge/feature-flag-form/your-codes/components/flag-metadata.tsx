import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldTitle,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Switch } from '#/components/ui/switch'
import { Textarea } from '#/components/ui/textarea'
import { withForm } from '../hooks/form-hook'
import { featureFlagFormOptions } from '../lib/form-options'

export const FlagMetadata = withForm({
  ...featureFlagFormOptions,
  render: ({ form }) => {
    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Flag Metadata</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-4">
          <form.AppField
            name="flagName"
            validators={{
              onBlur: ({ value }: any) => {
                if (!value) return 'Flag name is required'
                if (!/^[a-z0-9-]+$/.test(value))
                  return 'Lowercase letters, numbers and hyphens only'
                return undefined
              },
            }}
          >
            {(field: any) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="flagName">
                  Flag Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="flagName"
                  placeholder="my-feature-flag"
                  value={field.state.value}
                  onChange={(e: any) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What does this flag control?"
                  rows={2}
                  value={field.state.value}
                  onChange={(e: any) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="resize-none"
                />
              </div>
            )}
          </form.AppField>

          <form.AppField name="enabled">
            {(field) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Enabled</FieldTitle>
                  <FieldDescription>
                    Toggle this flag on or off globally
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="enabled"
                  defaultChecked={false}
                  onCheckedChange={field.handleChange}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
              </Field>
            )}
          </form.AppField>
        </CardContent>
      </Card>
    )
  },
})
