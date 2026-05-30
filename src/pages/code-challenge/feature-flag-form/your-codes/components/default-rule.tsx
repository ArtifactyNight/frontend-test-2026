import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { withForm } from '../hooks/form-hook'
import { featureFlagFormOptions } from '../lib/form-options'
import { ServeFields } from './serve-fields'

export const DefaultRule = withForm({
  ...featureFlagFormOptions,
  render: ({ form }) => {
    const variationKeys = form.state.values.variations.map((v) => v.key)

    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Default Rule</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ServeFields
            form={form}
            fields="defaultServe"
            variationKeys={variationKeys}
          />
        </CardContent>
      </Card>
    )
  },
})
