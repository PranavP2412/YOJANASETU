import { Link } from 'react-router-dom';
import { BookOpen, User, Menu, X, HelpCircle, LogOut, Settings, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    // State for the new Left Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // State for the existing Mobile Menu (Right side)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 1. PLACEHOLDER DATA: Replace this with your actual User Context/State later
    const userData = {
        fullName: "Pranava", // Replace with req.user.FullName
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pranava", // Replace with user.avatar.url
        email: "pranava@example.com"
    };

    return (
        <>
            {/* --- MAIN NAVBAR --- */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        
                        {/* LEFT SECTION: Hamburger + Logo */}
                        <div className="flex items-center gap-4">
                            
                            {/* 2. THE TRIGGER: Opens the Left Sidebar */}
                            <button 
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 -ml-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-blue-600 focus:outline-none"
                            >
                                <Menu className="h-6 w-6" />
                            </button>

                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-2">
                                <div className="bg-blue-600 p-1.5 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900 hidden sm:block">Yojanasetu</span>
                            </Link>
                        </div>

                        {/* CENTER SECTION: Desktop Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Home</Link>
                            <Link to="/schemes" className="text-gray-600 hover:text-blue-600 font-medium transition">Schemes</Link>
                            <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition">About</Link>
                        </div>

                        {/* RIGHT SECTION: Login / Mobile Toggle */}
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition shadow-sm hover:shadow-md"
                            >
                                <User className="h-4 w-4" /> Login
                            </Link>

                            {/* Mobile Menu Button (Right Side - for standard links) */}
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600">
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- 3. THE LEFT SIDEBAR (DRAWER) --- */}
            
            {/* Overlay (Dark background) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Content */}
            <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Header: Close Button */}
                <div className="flex justify-end p-4">
                    <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-red-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* USER PROFILE SECTION */}
                <div className="px-6 pb-6 border-b border-gray-100 flex flex-col items-center text-center">
                    <div className="relative">
                        <img 
                            src={userData.avatar} 
                            alt="Profile" 
                            className="w-20 h-20 rounded-full border-4 border-blue-50 shadow-md mb-3 object-cover"
                        />
                        <div className="absolute bottom-3 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{userData.fullName}</h3>
                    <p className="text-sm text-gray-500">{userData.email}</p>
                </div>

                {/* MENU OPTIONS */}
                <div className="p-4 space-y-2">
                    <Link 
                        to="/Profile" 
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition group"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                            <span className="font-medium">My Profile</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-400" />
                    </Link>

                    <Link 
                        to="/help" 
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition group"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <div className="flex items-center gap-3">
                            <HelpCircle className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                            <span className="font-medium">Help & Support</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-400" />
                    </Link>

                    <div className="my-2 border-t border-gray-100"></div>

                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition group">
                        <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>

                {/* Footer Info */}
                <div className="absolute bottom-0 w-full p-6 bg-gray-50 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">YojanaSetu v1.0.0</p>
                </div>
            </div>
        </>
    );
};

export default Navbar;