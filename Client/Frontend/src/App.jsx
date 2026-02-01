import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './components/LandingPage/Landingpage';
import SchemeDiscovery from './components/AllScheme/Schemediscovery';
import LoginPage from './components/Login/LoginPage';
import VerifyEmailToken from './components/VerifyEmailToken/VerifyEmailToken';
import ForgotPassword from './components/forgotpassword/ForgotPasswordPage';
import ResetPassword from './components/resetpassword/ResetPasswordPage';
import ProfilePage from './components/Profile/profile';
import RegisterPage from './components/Register/RegisterPage';
import SchemeDetails from './components/SchemeDetails/SchemeDetails';
import BookmarksPage from './components/bookMarksPage/bookMarksPage';
import RecommendedSchemes from './components/recommended/recommendedSchemes';



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

          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/schemes" element={<SchemeDiscovery />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/Profile" element={<ProfilePage />} />
            
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/scheme/:id" element={<SchemeDetails />} />
            <Route path='/userInfo/bookmarks' element={<BookmarksPage />}/>
            <Route path='/recommend' element={<RecommendedSchemes />}/>

          </Route>

          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmailToken />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;