import { ExternalLink } from 'lucide-react'

const categories = [
  {
    title: 'Code Editors & IDEs',
    items: [
      { name: 'VS Code', url: 'https://code.visualstudio.com/', desc: 'Free, powerful code editor by Microsoft' },
      { name: 'WebStorm', url: 'https://www.jetbrains.com/webstorm/', desc: 'Professional JavaScript & TypeScript IDE' },
      { name: 'Cursor', url: 'https://cursor.sh/', desc: 'AI-first code editor built on VS Code' },
    ],
  },
  {
    title: 'Hosting & Deployment',
    items: [
      { name: 'Vercel', url: 'https://vercel.com/', desc: 'Deploy frontend apps with zero config' },
      { name: 'Netlify', url: 'https://www.netlify.com/', desc: 'Modern web hosting and automation' },
      { name: 'DigitalOcean', url: 'https://www.digitalocean.com/', desc: 'Cloud infrastructure for developers' },
      { name: 'GitHub Pages', url: 'https://pages.github.com/', desc: 'Free static site hosting from GitHub' },
    ],
  },
  {
    title: 'Design & UI',
    items: [
      { name: 'Tailwind CSS', url: 'https://tailwindcss.com/', desc: 'Utility-first CSS framework' },
      { name: 'Figma', url: 'https://www.figma.com/', desc: 'Collaborative design tool' },
      { name: 'Lucide Icons', url: 'https://lucide.dev/', desc: 'Beautiful, consistent open-source icons' },
      { name: 'Coolors', url: 'https://coolors.co/', desc: 'Color palette generator' },
    ],
  },
  {
    title: 'APIs & Backend',
    items: [
      { name: 'Supabase', url: 'https://supabase.com/', desc: 'Open-source Firebase alternative' },
      { name: 'Postman', url: 'https://www.postman.com/', desc: 'API development and testing platform' },
      { name: 'JSONPlaceholder', url: 'https://jsonplaceholder.typicode.com/', desc: 'Free fake REST API for testing' },
    ],
  },
  {
    title: 'Learning & Documentation',
    items: [
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', desc: 'The definitive web development reference' },
      { name: 'React Docs', url: 'https://react.dev/', desc: 'Official React documentation' },
      { name: 'TypeScript Docs', url: 'https://www.typescriptlang.org/docs/', desc: 'Learn TypeScript from scratch' },
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', desc: 'Free coding bootcamp and certifications' },
    ],
  },
]

export default function Resources() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">Developer Resources</h1>
      <p className="text-sm text-muted-foreground mb-6">Curated tools, services, and resources for modern web developers.</p>

      <div className="space-y-8">
        {categories.map(cat => (
          <div key={cat.title}>
            <h2 className="text-sm font-semibold text-accent-cyan uppercase tracking-wider mb-3">{cat.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cat.items.map(item => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 bg-surface rounded-lg border border-border hover:border-border-active transition-colors group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground group-hover:text-accent-cyan transition-colors">{item.name}</span>
                      <ExternalLink className="w-3 h-3 text-dim" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-surface-raised rounded-xl border border-border text-center">
        <h2 className="text-lg font-bold text-foreground mb-2">Support DevToolKit Pro</h2>
        <p className="text-sm text-muted-foreground mb-4">
          If you find these tools useful, consider supporting the project!
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://buymeacoffee.com/crashycrash"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-accent-orange/15 text-accent-orange rounded-lg text-sm font-medium hover:bg-accent-orange/25 transition-colors"
          >
            ☕ Buy me a coffee
          </a>
          <a
            href="https://github.com/sponsors/CrashyCrash"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-accent-purple/15 text-accent-purple rounded-lg text-sm font-medium hover:bg-accent-purple/25 transition-colors"
          >
            💜 Sponsor on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
