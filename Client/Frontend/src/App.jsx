import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './components/LandingPage/Landingpage';
import SchemeDiscovery from './components/AllScheme/Schemediscovery';
import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Register/RegisterPage';
import VerifyEmailPage from './components/emailverfication/VerifyEmailPage';

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/emailverification" element={<VerifyEmailPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;