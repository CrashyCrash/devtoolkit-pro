import { useState } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

function generateUUID(): string {
  // Crypto.randomUUID with fallback
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback: construct from getRandomValues
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  arr[6] = (arr[6] & 0x0f) | 0x40
  arr[8] = (arr[8] & 0x3f) | 0x80
  const hex = Array.from(arr, b => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>(() => [generateUUID()])
  const [count, setCount] = useState(1)
  const [uppercase, setUppercase] = useState(false)
  const [noDashes, setNoDashes] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState(-1)
  const [copiedAll, setCopiedAll] = useState(false)

  function generate() {
    setUuids(Array.from({ length: count }, generateUUID))
    setCopiedIdx(-1)
  }

  function formatUuid(uuid: string) {
    let result = noDashes ? uuid.replace(/-/g, '') : uuid
    if (uppercase) result = result.toUpperCase()
    return result
  }

  async function copySingle(i: number) {
    await navigator.clipboard.writeText(formatUuid(uuids[i]))
    setCopiedIdx(i)
    setTimeout(() => setCopiedIdx(-1), 2000)
  }

  async function copyAll() {
    await navigator.clipboard.writeText(uuids.map(formatUuid).join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">UUID Generator</h1>
      <p className="text-sm text-muted-foreground mb-6">Generate v4 UUIDs with one click. Copy individually or in bulk.</p>

      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="text-xs text-dim mb-1 block">Count</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(100, +e.target.value)))}
            className="w-20 p-2 bg-surface rounded-lg border border-border text-foreground text-sm text-center focus:outline-none focus:border-accent-cyan/50"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="accent-cyan-400" />
          Uppercase
        </label>

        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={noDashes} onChange={e => setNoDashes(e.target.checked)} className="accent-cyan-400" />
          No dashes
        </label>

        <button onClick={generate} className="px-6 py-2 bg-accent-cyan/15 text-accent-cyan rounded-lg text-sm font-medium hover:bg-accent-cyan/25 transition-colors flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Generate
        </button>

        {uuids.length > 1 && (
          <button onClick={copyAll} className="px-4 py-2 bg-surface text-muted-foreground rounded-lg text-sm border border-border hover:text-foreground transition-colors flex items-center gap-1">
            {copiedAll ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedAll ? 'Copied all!' : 'Copy all'}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {uuids.map((uuid, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border group">
            <span className="text-xs text-dim w-6 text-right">{i + 1}.</span>
            <code className="flex-1 text-sm text-accent-cyan select-all">{formatUuid(uuid)}</code>
            <button onClick={() => copySingle(i)} className="text-muted-foreground hover:text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity">
              {copiedIdx === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
