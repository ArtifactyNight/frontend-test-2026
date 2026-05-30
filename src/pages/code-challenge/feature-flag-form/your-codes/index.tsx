import { DefaultRule } from './components/default-rule'
import { FlagMetadata } from './components/flag-metadata'
import { FlagVariations } from './components/flag-variations'
import JsonPreview from './components/json-preview'
import { TargetingRules } from './components/targeting-rules'
import { useAppForm } from './hooks/form-hook'
import { featureFlagFormOptions } from './lib/form-options'

function YourCode() {
  const form = useAppForm(featureFlagFormOptions)

  return (
    <form.AppForm>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
      >
        <div className="flex flex-col gap-5">
          <FlagMetadata form={form} />
          <FlagVariations form={form} />
          <TargetingRules form={form} />
          <DefaultRule form={form} />
        </div>
        <div className="lg:sticky lg:top-4">
          <JsonPreview />
        </div>
      </form>
    </form.AppForm>
  )
}

export default YourCode
