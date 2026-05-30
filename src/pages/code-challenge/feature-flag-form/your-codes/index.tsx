import { useAppForm } from './form-hook'
import { flagFormSchema, type FlagFormValues } from './schema'
import { newId } from './utils'
import FlagMetadata from './components/flag-metadata'
import FlagVariations from './components/flag-variations'
import TargetingRules from './components/targeting-rules'
import DefaultRule from './components/default-rule'
import JsonPreview from './components/json-preview'

const defaultValues: FlagFormValues = {
  flagName: 'my-new-feature',
  description: '',
  enabled: true,
  variations: [
    { id: newId(), key: 'on', value: 'true' },
    { id: newId(), key: 'off', value: 'false' },
  ],
  targeting: [],
  defaultVariation: 'off',
}

function YourCode() {
  const form = useAppForm({
    defaultValues,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validators: { onSubmit: flagFormSchema as any },
  })

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
          <FlagMetadata />
          <FlagVariations />
          <TargetingRules />
          <DefaultRule />
        </div>
        <div className="lg:sticky lg:top-4">
          <JsonPreview />
        </div>
      </form>
    </form.AppForm>
  )
}

export default YourCode
