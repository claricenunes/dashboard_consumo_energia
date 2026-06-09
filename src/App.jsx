import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AppProvider } from './context/AppContext'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { Sectors } from './pages/Sectors'
import { Operators } from './pages/Operators'
import { Settings } from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/setores" element={<Sectors />} />
              <Route path="/operadores" element={<Operators />} />
              <Route path="/configuracoes" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
