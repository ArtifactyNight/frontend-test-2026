import { useFormContext } from '../form-hook'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Switch } from '#/components/ui/switch'
import { Label } from '#/components/ui/label'

export default function FlagMetadata() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useFormContext() as any

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Flag Metadata</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-4">
        <form.Field
          name="flagName"
          validators={{ onBlur: ({ value }: any) => {
            if (!value) return 'Flag name is required'
            if (!/^[a-z0-9-]+$/.test(value)) return 'Lowercase letters, numbers and hyphens only'
            return undefined
          }}}
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
                <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="description">
          {(field: any) => (
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
        </form.Field>

        <form.Field name="enabled">
          {(field: any) => (
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="enabled">Enabled</Label>
                <p className="text-xs text-muted-foreground">
                  Toggle this flag on or off globally
                </p>
              </div>
              <Switch
                id="enabled"
                checked={field.state.value}
                onCheckedChange={field.handleChange}
              />
            </div>
          )}
        </form.Field>
      </CardContent>
    </Card>
  )
}
