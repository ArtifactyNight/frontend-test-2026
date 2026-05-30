import Editor from '@monaco-editor/react'
import { useFormContext } from '../hooks/form-hook'
import { buildOutput } from '../lib/utils'
import type { FlagFormValues } from '../lib/schema'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

export default function JsonPreview() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useFormContext() as any

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="font-mono text-sm">output.json</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <form.Subscribe selector={(s: any) => s.values}>
          {(values: FlagFormValues) => {
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
}
