import { useState } from 'react'
import { Copy, Check, AlertCircle, Minimize2, Maximize2 } from 'lucide-react'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function format() {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }

  function minify() {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }

  function validate() {
    try {
      JSON.parse(input)
      setError('')
      setOutput('✅ Valid JSON')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">JSON Formatter & Validator</h1>
      <p className="text-sm text-muted-foreground mb-6">Paste JSON to format, minify, or validate it.</p>

      <div className="flex gap-3 mb-4">
        <button onClick={format} className="px-4 py-2 bg-accent-cyan/15 text-accent-cyan rounded-lg text-sm font-medium hover:bg-accent-cyan/25 transition-colors flex items-center gap-2">
          <Maximize2 className="w-4 h-4" /> Format
        </button>
        <button onClick={minify} className="px-4 py-2 bg-accent-orange/15 text-accent-orange rounded-lg text-sm font-medium hover:bg-accent-orange/25 transition-colors flex items-center gap-2">
          <Minimize2 className="w-4 h-4" /> Minify
        </button>
        <button onClick={validate} className="px-4 py-2 bg-accent-purple/15 text-accent-purple rounded-lg text-sm font-medium hover:bg-accent-purple/25 transition-colors flex items-center gap-2">
          <Check className="w-4 h-4" /> Validate
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-dim uppercase tracking-wider mb-2 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-96 p-4 bg-surface rounded-lg border border-border text-foreground text-sm resize-none focus:outline-none focus:border-accent-cyan/50"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-dim uppercase tracking-wider">Output</label>
            {output && (
              <button onClick={copyOutput} className="text-xs text-muted-foreground hover:text-accent-cyan flex items-center gap-1">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <pre className="w-full h-96 p-4 bg-surface rounded-lg border border-border text-sm overflow-auto whitespace-pre-wrap text-accent-cyan">
            {output || <span className="text-dim">Output will appear here...</span>}
          </pre>
        </div>
      </div>
    </div>
  )
}
