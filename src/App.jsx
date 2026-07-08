import { useEffect, useState } from 'react'

const CHECKS = [
  { label: 'DNS résolu', key: 'dns' },
  { label: 'HTTP 200 reçu', key: 'http' },
  { label: 'Rendu React OK', key: 'render' },
  { label: 'Env vars injectées', key: 'env' },
]

export default function App() {
  const [checks, setChecks] = useState({ dns: false, http: false, render: false, env: false })
  const [buildInfo, setBuildInfo] = useState(null)

  useEffect(() => {
    setChecks(c => ({ ...c, render: true }))

    fetch('/health')
      .then(r => {
        if (r.ok) setChecks(c => ({ ...c, dns: true, http: true }))
        return r.json()
      })
      .catch(() => setChecks(c => ({ ...c, dns: false, http: false })))

    const env = import.meta.env
    if (Object.keys(env).length > 0) setChecks(c => ({ ...c, env: true }))

    setBuildInfo({
      mode: import.meta.env.MODE,
      base: import.meta.env.BASE_URL,
      built: new Date().toISOString(),
    })
  }, [])

  const allGreen = Object.values(checks).every(Boolean)

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#0f172a', minHeight: '100vh', color: '#e2e8f0' }}>
      <header style={{ background: 'linear-gradient(135deg,#7c3aed,#0f172a)', padding: '2rem', borderBottom: '1px solid #6d28d9' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#c4b5fd' }}>
          React Test App{' '}
          <span style={{ background: allGreen ? '#16a34a' : '#b45309', color: '#fff', fontSize: '.75rem', padding: '2px 10px', borderRadius: '9999px', marginLeft: '.75rem', verticalAlign: 'middle' }}>
            {allGreen ? 'ALL CHECKS PASSED' : 'CHECKING...'}
          </span>
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '.25rem', fontSize: '.9rem' }}>
          <span style={{ background: '#4c1d95', color: '#c4b5fd', borderRadius: '4px', padding: '2px 8px', fontSize: '.75rem', fontFamily: 'monospace' }}>React 18 + Vite</span>
          {' · Nginx · SystalinkCloud Datacloud'}
        </p>
      </header>

      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div style={card}>
          <h2 style={cardTitle}>Platform Checks</h2>
          {CHECKS.map(({ label, key }) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid #1e3a5f' }}>
              <span style={{ color: '#94a3b8', fontSize: '.9rem' }}>{label}</span>
              <span style={{ fontFamily: 'monospace', color: checks[key] ? '#34d399' : '#f87171' }}>
                {checks[key] ? '✓ OK' : '⏳ ...'}
              </span>
            </div>
          ))}
        </div>

        <div style={card}>
          <h2 style={cardTitle}>Build Info</h2>
          {buildInfo && Object.entries(buildInfo).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid #1e3a5f' }}>
              <span style={{ color: '#94a3b8', fontSize: '.88rem' }}>{k}</span>
              <span style={{ fontFamily: 'monospace', fontSize: '.88rem', color: '#f1f5f9' }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ ...card, gridColumn: '1/-1' }}>
          <h2 style={cardTitle}>Vite Env Variables</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', color: '#64748b', padding: '.4rem .5rem', borderBottom: '1px solid #1e3a5f' }}>Variable</th>
                <th style={{ textAlign: 'left', color: '#64748b', padding: '.4rem .5rem', borderBottom: '1px solid #1e3a5f' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(import.meta.env).map(([k, v]) => (
                <tr key={k}>
                  <td style={{ padding: '.4rem .5rem', fontFamily: 'monospace', color: '#c4b5fd', borderBottom: '1px solid #1e293b' }}>{k}</td>
                  <td style={{ padding: '.4rem .5rem', fontFamily: 'monospace', borderBottom: '1px solid #1e293b' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem', color: '#475569', fontSize: '.8rem' }}>
        react-test-app · SystalinkCloud Datacloud · Deployed on K8s
      </footer>
    </div>
  )
}

const card = { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }
const cardTitle = { fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.08em', color: '#64748b', marginBottom: '1rem' }
