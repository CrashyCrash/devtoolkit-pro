import { useState } from 'react'
import { Copy, Check, AlertCircle, Clock } from 'lucide-react'

interface JwtParts {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  expiry: string | null
  isExpired: boolean
}

function decodeJwt(token: string): JwtParts {
  const parts = token.trim().split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT: must have 3 parts separated by dots')

  const decode = (s: string) => {
    const base64 = s.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(decodeURIComponent(escape(atob(base64))))
  }

  const header = decode(parts[0])
  const payload = decode(parts[1])

  let expiry: string | null = null
  let isExpired = false
  if (typeof payload.exp === 'number') {
    const expDate = new Date(payload.exp * 1000)
    expiry = expDate.toISOString()
    isExpired = expDate < new Date()
  }

  return { header, payload, expiry, isExpired }
}

export default function JwtDecoder() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<JwtParts | null>(null)
  const [error, setError] = useState('')
  const [copiedField, setCopiedField] = useState('')

  function decode() {
    try {
      setResult(decodeJwt(input))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to decode JWT')
      setResult(null)
    }
  }

  async function copySection(label: string, data: unknown) {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopiedField(label)
    setTimeout(() => setCopiedField(''), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">JWT Decoder</h1>
      <p className="text-sm text-muted-foreground mb-6">Paste a JSON Web Token to decode its header, payload, and check expiry.</p>

      <div>
        <label className="text-xs font-semibold text-dim uppercase tracking-wider mb-2 block">JWT Token</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          className="w-full h-32 p-4 bg-surface rounded-lg border border-border text-foreground text-sm resize-none focus:outline-none focus:border-accent-cyan/50"
          spellCheck={false}
        />
      </div>

      <button onClick={decode} className="mt-4 px-6 py-2 bg-accent-cyan/15 text-accent-cyan rounded-lg text-sm font-medium hover:bg-accent-cyan/25 transition-colors">
        Decode JWT
      </button>

      {error && (
        <div className="flex items-center gap-2 p-3 mt-4 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          {result.expiry && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              result.isExpired
                ? 'bg-status-danger/10 border border-status-danger/30 text-status-danger'
                : 'bg-status-ok/10 border border-status-ok/30 text-status-ok'
            }`}>
              <Clock className="w-4 h-4" />
              {result.isExpired ? 'Token EXPIRED' : 'Token valid'} — Expires: {result.expiry}
            </div>
          )}

          {[
            { label: 'Header', data: result.header, color: 'text-accent-orange' },
            { label: 'Payload', data: result.payload, color: 'text-accent-cyan' },
          ].map(({ label, data, color }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-dim uppercase tracking-wider">{label}</label>
                <button onClick={() => copySection(label, data)} className="text-xs text-muted-foreground hover:text-accent-cyan flex items-center gap-1">
                  {copiedField === label ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedField === label ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className={`p-4 bg-surface rounded-lg border border-border text-sm overflow-auto ${color}`}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
