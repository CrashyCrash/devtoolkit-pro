import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function process() {
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))))
      }
      setError('')
    } catch {
      setError(mode === 'decode' ? 'Invalid Base64 string' : 'Failed to encode')
      setOutput('')
    }
  }

  function swap() {
    setInput(output)
    setOutput('')
    setMode(mode === 'encode' ? 'decode' : 'encode')
    setError('')
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">Base64 Encoder / Decoder</h1>
      <p className="text-sm text-muted-foreground mb-6">Encode or decode Base64 text instantly.</p>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => { setMode('encode'); setError('') }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'encode'
              ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
              : 'bg-surface text-muted-foreground border border-border hover:text-foreground'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => { setMode('decode'); setError('') }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'decode'
              ? 'bg-accent-orange/20 text-accent-orange border border-accent-orange/40'
              : 'bg-surface text-muted-foreground border border-border hover:text-foreground'
          }`}
        >
          Decode
        </button>
      </div>

      <div>
        <label className="text-xs font-semibold text-dim uppercase tracking-wider mb-2 block">
          {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Hello, World!' : 'SGVsbG8sIFdvcmxkIQ=='}
          className="w-full h-40 p-4 bg-surface rounded-lg border border-border text-foreground text-sm resize-none focus:outline-none focus:border-accent-cyan/50"
          spellCheck={false}
        />
      </div>

      <div className="flex gap-3 my-4">
        <button onClick={process} className="px-6 py-2 bg-accent-cyan/15 text-accent-cyan rounded-lg text-sm font-medium hover:bg-accent-cyan/25 transition-colors">
          {mode === 'encode' ? 'Encode →' : 'Decode →'}
        </button>
        <button onClick={swap} className="px-4 py-2 bg-surface text-muted-foreground rounded-lg text-sm border border-border hover:text-foreground transition-colors">
          ⇄ Swap
        </button>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-sm">{error}</div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-dim uppercase tracking-wider">Result</label>
          {output && (
            <button onClick={copyOutput} className="text-xs text-muted-foreground hover:text-accent-cyan flex items-center gap-1">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        <pre className="w-full h-40 p-4 bg-surface rounded-lg border border-border text-sm overflow-auto whitespace-pre-wrap text-accent-cyan">
          {output || <span className="text-dim">Result will appear here...</span>}
        </pre>
      </div>
    </div>
  )
}
