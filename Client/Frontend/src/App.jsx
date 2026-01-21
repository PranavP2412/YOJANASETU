import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './components/LandingPage/Landingpage';
import SchemeDiscovery from './components/AllScheme/Schemediscovery';
import LoginPage from './components/Login/LoginPage';
import VerifyEmailToken from './components/VerifyEmailToken/VerifyEmailToken'; // Make sure to import this
import RegisterPage from './components/Register/RegisterPage';

// 1. Create a Layout Component that holds the Navbar
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* This renders the child route's element (e.g., LandingPage) */}
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        
        <Routes>
          {/* Group 1: Routes WITH Navbar (Wrapped in MainLayout) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/schemes" element={<SchemeDiscovery />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Group 2: Routes WITHOUT Navbar (Standalone) */}
          {/* Note: the path includes :token parameter for the dynamic link */}
          <Route path="/verify-email/:token" element={<VerifyEmailToken />} />
          
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;