import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '../layout.jsx'
import Dashboard from '../Pages/Dasboard.js'
import Properties from '../Pages/Properties.js'
import Leads from '../Pages/Leads.js'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/leads" element={<Leads />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App 