import { Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import PanelPage from './PanelPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/panel" element={<PanelPage />} />
    </Routes>
  )
}

export default App
