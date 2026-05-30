import { useFormContext } from '../form-hook'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { FlagFormValues } from '../schema'

export default function DefaultRule() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useFormContext() as any

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Default Rule</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-xs text-muted-foreground mb-3">
          Fallback variation served to users who don't match any targeting rule.
        </p>
        <form.Field
          name="defaultVariation"
          validators={{
            onBlur: ({ value }: any) => (!value ? 'Select a default variation' : undefined),
          }}
        >
          {(field: any) => {
            const variationKeys: string[] = (form as any).state.values.variations.map(
              (v: FlagFormValues['variations'][number]) => v.key,
            )
            return (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="defaultVariation">
                  Default Variation <span className="text-destructive">*</span>
                </Label>
                <Select value={field.state.value} onValueChange={field.handleChange}>
                  <SelectTrigger
                    id="defaultVariation"
                    aria-invalid={field.state.meta.errors.length > 0}
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
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )
          }}
        </form.Field>
      </CardContent>
    </Card>
  )
}
