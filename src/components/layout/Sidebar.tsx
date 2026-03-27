import { NavLink } from 'react-router-dom'
import {
  Braces,
  Regex,
  Binary,
  KeyRound,
  Palette,
  Paintbrush,
  Type,
  Fingerprint,
  BookOpen,
  Wrench,
} from 'lucide-react'

const tools = [
  { to: '/json', icon: Braces, label: 'JSON Formatter' },
  { to: '/regex', icon: Regex, label: 'Regex Tester' },
  { to: '/base64', icon: Binary, label: 'Base64 Codec' },
  { to: '/jwt', icon: KeyRound, label: 'JWT Decoder' },
  { to: '/color', icon: Palette, label: 'Color Picker' },
  { to: '/gradient', icon: Paintbrush, label: 'Gradient Builder' },
  { to: '/lorem', icon: Type, label: 'Lorem Ipsum' },
  { to: '/uuid', icon: Fingerprint, label: 'UUID Generator' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-screen glass border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Wrench className="w-6 h-6 text-accent-cyan" />
          <span className="text-lg font-bold text-foreground">DevToolKit Pro</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Free developer toolkit</p>
      </div>

      <nav className="flex-1 p-2 overflow-y-auto">
        <div className="text-xs font-semibold text-dim uppercase tracking-wider px-3 py-2">
          Tools
        </div>
        {tools.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-surface-raised text-accent-cyan border border-border-active'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-raised/50'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}

        <div className="text-xs font-semibold text-dim uppercase tracking-wider px-3 py-2 mt-4">
          More
        </div>
        <NavLink
          to="/resources"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-surface-raised text-accent-cyan border border-border-active'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface-raised/50'
            }`
          }
        >
          <BookOpen className="w-4 h-4" />
          Resources
        </NavLink>
      </nav>

      <div className="p-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Built with ❤️ by{' '}
          <a href="https://github.com/CrashyCrash" target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">
            Crash
          </a>
        </p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <a
            href="https://buymeacoffee.com/crashycrash"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent-orange hover:underline"
          >
            ☕ Buy me a coffee
          </a>
          <a
            href="https://github.com/sponsors/CrashyCrash"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent-purple hover:underline"
          >
            💜 Sponsor
          </a>
        </div>
      </div>
    </aside>
  )
}
