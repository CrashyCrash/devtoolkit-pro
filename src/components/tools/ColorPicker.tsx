import { useState, useCallback } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255)
  }
  return [f(0), f(8), f(4)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, Math.round(l * 100)]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function generatePalette(h: number, s: number, l: number) {
  return {
    complementary: [[(h + 180) % 360, s, l]],
    analogous: [[(h + 30) % 360, s, l], [(h - 30 + 360) % 360, s, l]],
    triadic: [[(h + 120) % 360, s, l], [(h + 240) % 360, s, l]],
    shades: [10, 30, 50, 70, 90].map(lv => [h, s, lv] as [number, number, number]),
  }
}

export default function ColorPicker() {
  const [h, setH] = useState(180)
  const [s, setS] = useState(70)
  const [l, setL] = useState(50)
  const [copied, setCopied] = useState('')

  const [r, g, b] = hslToRgb(h, s, l)
  const hex = rgbToHex(r, g, b)
  const palette = generatePalette(h, s, l)

  const copyValue = useCallback(async (val: string) => {
    await navigator.clipboard.writeText(val)
    setCopied(val)
    setTimeout(() => setCopied(''), 2000)
  }, [])

  function handleHexChange(newHex: string) {
    if (/^#[0-9a-fA-F]{6}$/.test(newHex)) {
      const [nh, ns, nl] = hexToHsl(newHex)
      setH(nh); setS(ns); setL(nl)
    }
  }

  function randomColor() {
    setH(Math.floor(Math.random() * 360))
    setS(40 + Math.floor(Math.random() * 50))
    setL(30 + Math.floor(Math.random() * 40))
  }

  function ColorSwatch({ color, label }: { color: [number, number, number]; label?: string }) {
    const [cr, cg, cb] = hslToRgb(color[0], color[1], color[2])
    const chex = rgbToHex(cr, cg, cb)
    return (
      <button
        onClick={() => copyValue(chex)}
        className="group flex flex-col items-center gap-1"
        title={`Click to copy ${chex}`}
      >
        <div className="w-12 h-12 rounded-lg border border-border group-hover:scale-110 transition-transform" style={{ backgroundColor: chex }} />
        <span className="text-xs text-dim group-hover:text-foreground">{label ?? chex}</span>
      </button>
    )
  }

  const formats = [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
    { label: 'HSL', value: `hsl(${h}, ${s}%, ${l}%)` },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">Color Picker & Palette Generator</h1>
      <p className="text-sm text-muted-foreground mb-6">Pick colors with HSL/RGB/HEX conversion and generate palettes.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="w-full h-40 rounded-xl border border-border" style={{ backgroundColor: hex }} />

          <div>
            <label className="text-xs text-dim mb-1 block">Hue ({h}°)</label>
            <input type="range" min={0} max={360} value={h} onChange={e => setH(+e.target.value)} className="w-full accent-cyan-400" />
          </div>
          <div>
            <label className="text-xs text-dim mb-1 block">Saturation ({s}%)</label>
            <input type="range" min={0} max={100} value={s} onChange={e => setS(+e.target.value)} className="w-full accent-cyan-400" />
          </div>
          <div>
            <label className="text-xs text-dim mb-1 block">Lightness ({l}%)</label>
            <input type="range" min={0} max={100} value={l} onChange={e => setL(+e.target.value)} className="w-full accent-cyan-400" />
          </div>

          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={hex}
              onChange={e => handleHexChange(e.target.value)}
              className="flex-1 p-2 bg-surface rounded-lg border border-border text-foreground text-sm text-center font-mono focus:outline-none focus:border-accent-cyan/50"
            />
            <button onClick={randomColor} className="p-2 bg-surface rounded-lg border border-border text-muted-foreground hover:text-accent-cyan transition-colors" title="Random color">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            {formats.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                <div>
                  <span className="text-xs text-dim">{label}</span>
                  <p className="text-sm font-mono text-foreground">{value}</p>
                </div>
                <button onClick={() => copyValue(value)} className="text-xs text-muted-foreground hover:text-accent-cyan flex items-center gap-1">
                  {copied === value ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-xs font-semibold text-dim uppercase tracking-wider mb-2">Complementary</h3>
            <div className="flex gap-2">{palette.complementary.map((c, i) => <ColorSwatch key={i} color={c as [number, number, number]} />)}</div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-dim uppercase tracking-wider mb-2">Analogous</h3>
            <div className="flex gap-2">{palette.analogous.map((c, i) => <ColorSwatch key={i} color={c as [number, number, number]} />)}</div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-dim uppercase tracking-wider mb-2">Triadic</h3>
            <div className="flex gap-2">{palette.triadic.map((c, i) => <ColorSwatch key={i} color={c as [number, number, number]} />)}</div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-dim uppercase tracking-wider mb-2">Shades</h3>
            <div className="flex gap-2">{palette.shades.map((c, i) => <ColorSwatch key={i} color={c} />)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
