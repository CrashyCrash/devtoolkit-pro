import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'

const JsonFormatter = lazy(() => import('./components/tools/JsonFormatter'))
const RegexTester = lazy(() => import('./components/tools/RegexTester'))
const Base64Tool = lazy(() => import('./components/tools/Base64Tool'))
const JwtDecoder = lazy(() => import('./components/tools/JwtDecoder'))
const ColorPicker = lazy(() => import('./components/tools/ColorPicker'))
const GradientGenerator = lazy(() => import('./components/tools/GradientGenerator'))
const LoremIpsum = lazy(() => import('./components/tools/LoremIpsum'))
const UuidGenerator = lazy(() => import('./components/tools/UuidGenerator'))
const Resources = lazy(() => import('./components/pages/Resources'))

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/json" replace />} />
            <Route path="/json" element={<JsonFormatter />} />
            <Route path="/regex" element={<RegexTester />} />
            <Route path="/base64" element={<Base64Tool />} />
            <Route path="/jwt" element={<JwtDecoder />} />
            <Route path="/color" element={<ColorPicker />} />
            <Route path="/gradient" element={<GradientGenerator />} />
            <Route path="/lorem" element={<LoremIpsum />} />
            <Route path="/uuid" element={<UuidGenerator />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
