import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/Landingpage';
import SchemeDiscovery from './pages/schemediscovery';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Navbar appears on all pages */}
        <Navbar />

        <Routes>
          {/* When URL is /, show Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* When URL is /schemes, show Search Page */}
          <Route path="/schemes" element={<SchemeDiscovery />} />
          <Route path="/login" element={<LoginPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;