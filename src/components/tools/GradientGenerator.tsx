import { useState } from 'react'
import { Copy, Check, RotateCcw } from 'lucide-react'

interface GradientStop {
  color: string
  position: number
}

export default function GradientGenerator() {
  const [stops, setStops] = useState<GradientStop[]>([
    { color: '#64ffda', position: 0 },
    { color: '#bd93f9', position: 100 },
  ])
  const [angle, setAngle] = useState(135)
  const [type, setType] = useState<'linear' | 'radial'>('linear')
  const [copied, setCopied] = useState(false)

  const gradientCSS = type === 'linear'
    ? `linear-gradient(${angle}deg, ${stops.map(s => `${s.color} ${s.position}%`).join(', ')})`
    : `radial-gradient(circle, ${stops.map(s => `${s.color} ${s.position}%`).join(', ')})`

  const fullCSS = `background: ${gradientCSS};`

  function addStop() {
    const maxPos = Math.max(...stops.map(s => s.position))
    setStops([...stops, { color: '#ffb86c', position: Math.min(maxPos + 10, 100) }])
  }

  function removeStop(i: number) {
    if (stops.length > 2) setStops(stops.filter((_, idx) => idx !== i))
  }

  function updateStop(i: number, field: keyof GradientStop, value: string | number) {
    setStops(stops.map((s, idx) => idx === i ? { ...s, [field]: value } : s))
  }

  function reset() {
    setStops([{ color: '#64ffda', position: 0 }, { color: '#bd93f9', position: 100 }])
    setAngle(135)
    setType('linear')
  }

  async function copyCSS() {
    await navigator.clipboard.writeText(fullCSS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">CSS Gradient Generator</h1>
      <p className="text-sm text-muted-foreground mb-6">Build beautiful gradients visually and copy the CSS.</p>

      <div className="w-full h-48 rounded-xl border border-border mb-6" style={{ background: gradientCSS }} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-3">
            {(['linear', 'radial'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  type === t
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
                    : 'bg-surface text-muted-foreground border border-border hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {type === 'linear' && (
            <div>
              <label className="text-xs text-dim mb-1 block">Angle ({angle}°)</label>
              <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(+e.target.value)} className="w-full accent-cyan-400" />
            </div>
          )}

          <div className="space-y-3">
            <label className="text-xs font-semibold text-dim uppercase tracking-wider">Color Stops</label>
            {stops.map((stop, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="color"
                  value={stop.color}
                  onChange={e => updateStop(i, 'color', e.target.value)}
                  className="w-10 h-10 rounded border border-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={stop.color}
                  onChange={e => updateStop(i, 'color', e.target.value)}
                  className="w-24 p-2 bg-surface rounded-lg border border-border text-foreground text-xs font-mono focus:outline-none focus:border-accent-cyan/50"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={e => updateStop(i, 'position', +e.target.value)}
                  className="flex-1 accent-cyan-400"
                />
                <span className="text-xs text-dim w-8">{stop.position}%</span>
                {stops.length > 2 && (
                  <button onClick={() => removeStop(i)} className="text-status-danger text-xs hover:bg-status-danger/10 rounded p-1">✕</button>
                )}
              </div>
            ))}
            <button onClick={addStop} className="text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors">+ Add stop</button>
          </div>

          <div className="flex gap-3">
            <button onClick={reset} className="px-4 py-2 bg-surface text-muted-foreground rounded-lg text-sm border border-border hover:text-foreground transition-colors flex items-center gap-2">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-dim uppercase tracking-wider">CSS Output</label>
            <button onClick={copyCSS} className="text-xs text-muted-foreground hover:text-accent-cyan flex items-center gap-1">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy CSS'}
            </button>
          </div>
          <pre className="p-4 bg-surface rounded-lg border border-border text-sm text-accent-cyan whitespace-pre-wrap break-all">
            {fullCSS}
          </pre>
        </div>
      </div>
    </div>
  )
}
