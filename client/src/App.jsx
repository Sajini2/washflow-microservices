import React from 'react'

function App() {
  const services = [
    { name: 'API Gateway', owner: 'ITBIN-2313-0043', port: '8081', desc: 'Central routing & security gateway for all microservice requests.' },
    { name: 'User & Auth Service', owner: 'ITBIN-2313-0043', port: '8082', desc: 'User identity, authentication, JWT tokens, and account management.' },
    { name: 'Laundry Service', owner: 'ITBIN-2313-0064', port: '8083', desc: 'Laundry catalog, pricing, washing status, and itemized processing.' },
    { name: 'Order & Pickup Service', owner: 'ITBIN-2313-0016', port: '8084', desc: 'Pickup scheduling, delivery dispatch, and order lifecycle management.' },
  ]

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <span>🧺 WashFlow</span>
          <span className="badge">v0.1.0 Scaffold</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Service-Oriented Computing Project
        </div>
      </header>

      <main className="hero">
        <h1>Microservices Laundry Platform</h1>
        <p>
          Welcome to WashFlow. A distributed laundry pickup & delivery system built with Spring Boot microservices, React, and MongoDB Atlas.
        </p>

        <div className="services-grid">
          {services.map((svc) => (
            <div key={svc.name} className="service-card">
              <h3>{svc.name}</h3>
              <p>{svc.desc}</p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Owner: <strong>{svc.owner}</strong>
              </div>
              <span className="port-tag">Port :{svc.port}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} WashFlow Team — Coursework Scaffolding Complete</p>
      </footer>
    </div>
  )
}

export default App
