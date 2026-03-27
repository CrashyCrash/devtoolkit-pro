import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do',
  'eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim',
  'ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi',
  'aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit',
  'voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint',
  'occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt',
  'mollit','anim','id','est','laborum','ac','ante','bibendum','blandit','cras',
  'dignissim','eget','faucibus','gravida','habitant','integer','justo','lacus',
  'maecenas','nec','orci','pellentesque','quisque','risus','sagittis','tincidunt',
  'ultrices','varius','viverra','at','augue','cursus','elementum','felis','hendrerit',
  'imperdiet','leo','massa','neque','odio','placerat','porta','quam','rutrum',
  'semper','sodales','tortor','urna','vel','vulputate','arcu','condimentum','donec',
  'euismod','finibus','hac','iaculis','ligula','mauris','nibh','ornare','pharetra',
]

function generateWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

function generateSentence(minWords = 5, maxWords = 15) {
  const count = minWords + Math.floor(Math.random() * (maxWords - minWords + 1))
  const words = Array.from({ length: count }, generateWord)
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

function generateParagraph(sentences = 4) {
  return Array.from({ length: sentences }, () => generateSentence()).join(' ')
}

export default function LoremIpsum() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs')
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  function generate() {
    if (type === 'paragraphs') {
      setOutput(Array.from({ length: count }, () => generateParagraph()).join('\n\n'))
    } else if (type === 'sentences') {
      setOutput(Array.from({ length: count }, () => generateSentence()).join(' '))
    } else {
      setOutput(Array.from({ length: count }, generateWord).join(' '))
    }
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">Lorem Ipsum Generator</h1>
      <p className="text-sm text-muted-foreground mb-6">Generate placeholder text for designs and layouts.</p>

      <div className="flex flex-wrap gap-3 mb-4 items-end">
        <div>
          <label className="text-xs text-dim mb-1 block">Type</label>
          <div className="flex gap-2">
            {(['paragraphs', 'sentences', 'words'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                  type === t
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
                    : 'bg-surface text-muted-foreground border border-border hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
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
        <button onClick={generate} className="px-6 py-2 bg-accent-cyan/15 text-accent-cyan rounded-lg text-sm font-medium hover:bg-accent-cyan/25 transition-colors">
          Generate
        </button>
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-dim uppercase tracking-wider">Output</label>
            <button onClick={copyOutput} className="text-xs text-muted-foreground hover:text-accent-cyan flex items-center gap-1">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="p-4 bg-surface rounded-lg border border-border text-sm text-foreground whitespace-pre-wrap max-h-96 overflow-auto">
            {output}
          </div>
        </div>
      )}
    </div>
  )
}
