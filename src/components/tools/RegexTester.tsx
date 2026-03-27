import { useState, useMemo } from 'react'
import { AlertCircle } from 'lucide-react'

interface MatchResult {
  match: string
  index: number
  groups: string[]
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')

  const { matches, error, highlightedText } = useMemo(() => {
    if (!pattern || !testString) return { matches: [] as MatchResult[], error: '', highlightedText: testString }
    try {
      const regex = new RegExp(pattern, flags)
      let m: RegExpExecArray | null
      const results: MatchResult[] = []
      if (flags.includes('g')) {
        while ((m = regex.exec(testString)) !== null) {
          results.push({ match: m[0], index: m.index, groups: m.slice(1) })
          if (!m[0]) regex.lastIndex++
        }
      } else {
        m = regex.exec(testString)
        if (m) results.push({ match: m[0], index: m.index, groups: m.slice(1) })
      }

      let highlighted = testString
      if (results.length > 0) {
        const parts: string[] = []
        let lastIdx = 0
        for (const r of results) {
          if (r.index > lastIdx) parts.push(testString.slice(lastIdx, r.index))
          parts.push(`【${r.match}】`)
          lastIdx = r.index + r.match.length
        }
        if (lastIdx < testString.length) parts.push(testString.slice(lastIdx))
        highlighted = parts.join('')
      }

      return { matches: results, error: '', highlightedText: highlighted }
    } catch (e) {
      return { matches: [] as MatchResult[], error: e instanceof Error ? e.message : 'Invalid regex', highlightedText: testString }
    }
  }, [pattern, flags, testString])

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">Regex Tester</h1>
      <p className="text-sm text-muted-foreground mb-6">Test regular expressions with live matching and capture groups.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <label className="text-xs font-semibold text-dim uppercase tracking-wider mb-2 block">Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="[a-z]+@[a-z]+\.[a-z]+"
            className="w-full p-3 bg-surface rounded-lg border border-border text-foreground text-sm focus:outline-none focus:border-accent-cyan/50"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-dim uppercase tracking-wider mb-2 block">Flags</label>
          <div className="flex gap-2">
            {['g', 'i', 'm', 's'].map((f) => (
              <button
                key={f}
                onClick={() => setFlags((prev) => prev.includes(f) ? prev.replace(f, '') : prev + f)}
                className={`w-10 h-10 rounded-lg text-sm font-mono font-bold transition-colors ${
                  flags.includes(f)
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
                    : 'bg-surface text-dim border border-border hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-dim uppercase tracking-wider mb-2 block">Test String</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against..."
            className="w-full h-64 p-4 bg-surface rounded-lg border border-border text-foreground text-sm resize-none focus:outline-none focus:border-accent-cyan/50"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-dim uppercase tracking-wider mb-2 block">
            Matches ({matches.length})
          </label>
          <div className="w-full h-64 p-4 bg-surface rounded-lg border border-border text-sm overflow-auto">
            {matches.length > 0 ? (
              <div className="space-y-2">
                {matches.map((m, i) => (
                  <div key={i} className="p-2 rounded bg-surface-raised border border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-dim">#{i + 1}</span>
                      <span className="text-accent-cyan font-mono">"{m.match}"</span>
                      <span className="text-xs text-dim">at index {m.index}</span>
                    </div>
                    {m.groups.length > 0 && (
                      <div className="mt-1 flex gap-2 flex-wrap">
                        {m.groups.map((g, gi) => (
                          <span key={gi} className="text-xs px-2 py-0.5 rounded-full bg-accent-purple/15 text-accent-purple">
                            Group {gi + 1}: "{g}"
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dim">{pattern ? 'No matches found' : 'Enter a pattern to start matching'}</p>
            )}
          </div>
        </div>
      </div>

      {matches.length > 0 && (
        <div className="mt-4">
          <label className="text-xs font-semibold text-dim uppercase tracking-wider mb-2 block">Highlighted</label>
          <pre className="p-4 bg-surface rounded-lg border border-border text-sm whitespace-pre-wrap">
            {highlightedText}
          </pre>
        </div>
      )}
    </div>
  )
}
