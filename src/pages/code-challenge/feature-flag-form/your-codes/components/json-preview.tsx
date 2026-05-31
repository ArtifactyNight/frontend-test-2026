import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Editor } from '@monaco-editor/react'
import { withForm } from '../hooks/form-hook'
import { featureFlagFormOptions } from '../lib/form-options'
import { buildOutput } from '../lib/utils'

export const JsonPreview = withForm({
  ...featureFlagFormOptions,

  render: ({ form }) => {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="font-mono text-sm">output.json</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <form.Subscribe selector={(s) => s.values}>
            {(values) => {
              const json = JSON.stringify(buildOutput(values), null, 2)
              return (
                <Editor
                  height="calc(100vh - 12rem)"
                  language="json"
                  theme="vs-dark"
                  value={json}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                    fontFamily: 'var(--font-mono)',
                    lineNumbers: 'off',
                    folding: true,
                    wordWrap: 'off',
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              )
            }}
          </form.Subscribe>
        </CardContent>
      </Card>
    )
  },
})
