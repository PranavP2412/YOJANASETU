import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './components/LandingPage/Landingpage';
import SchemeDiscovery from './components/AllScheme/Schemediscovery';
import LoginPage from './components/Login/LoginPage';
import VerifyEmailToken from './components/VerifyEmailToken/VerifyEmailToken'; // Make sure to import this
import ForgotPassword from './components/forgotpassword/ForgotPasswordPage';
import ResetPassword from './components/resetpassword/ResetPasswordPage';
import ProfilePage from './components/Profile/profile';
import RegisterPage from './components/Register/RegisterPage';
<<<<<<< HEAD
=======

>>>>>>> f042a07789305026c61369df4240d54a19b9ace1

// 1. Layout Component (Contains Navbar)
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Routes>

          {/* Group 1: Routes WITH Navbar (Everything inside here gets the top bar) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/schemes" element={<SchemeDiscovery />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/Profile" element={<ProfilePage />} />
            
            <Route path="/register" element={<RegisterPage />} />

            {/* ✅ MOVED HERE: Now these will show the Navbar */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Group 2: Routes WITHOUT Navbar */}
          <Route path="/verify-email/:token" element={<VerifyEmailToken />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;