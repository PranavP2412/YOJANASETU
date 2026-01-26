import { Link, useNavigate, useLocation } from 'react-router-dom'; 
// 1. IMPORT Bookmark Icon
import { BookOpen, User, Menu, X, HelpCircle, LogOut, ChevronRight, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    
    // State for UI
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State for Data
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserStatus = async () => {
            setLoading(true);
            
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken');

            if (storedUser && token) {
                setUser(JSON.parse(storedUser)); 
            }

            try {
                if (token) {
                    const response = await axiosClient.get('/auth/current-user'); 
                    setUser(response.data.data);
                    localStorage.setItem('user', JSON.stringify(response.data.data)); 
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.log("Session expired or invalid");
                setUser(null);
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
            } finally {
                setLoading(false);
            }
        };

        checkUserStatus();
    }, [location.pathname]); 

    const handleLogout = async () => {
        try {
            await axiosClient.post('/auth/logout'); 
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken'); 
            setUser(null); 
            setIsSidebarOpen(false); 
            navigate('/login'); 
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <>
            {/* --- MAIN NAVBAR --- */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        
                        {/* LEFT SECTION */}
                        <div className="flex items-center gap-4">
                            {user && (
                                <button 
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="p-2 -ml-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-blue-600 focus:outline-none"
                                >
                                    <Menu className="h-6 w-6" />
                                </button>
                            )}
                            
                            <Link to="/" className="flex items-center gap-2">
                                <div className="bg-blue-600 p-1.5 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900 hidden sm:block">Yojanasetu</span>
                            </Link>
                        </div>

                        {/* CENTER SECTION - Added Bookmarks Here */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Home</Link>
                            <Link to="/schemes" className="text-gray-600 hover:text-blue-600 font-medium transition">Schemes</Link>
                            
                            {/* ✅ NEW: Saved Schemes Link in Navbar (Only if logged in) */}
                            {user && (
                                <Link to="/bookmarks" className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1">
                                    Saved
                                </Link>
                            )}

                            <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition">About</Link>
                        </div>

                        {/* RIGHT SECTION */}
                        <div className="flex items-center gap-4">
                            {loading ? (
                                <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                            ) : user ? (
                                // LOGGED IN STATE
                                <button 
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="hidden md:flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full border border-transparent hover:border-gray-200 transition"
                                >
                                    <img 
                                        src={"/Profile.png"} 
                                        alt="Avatar" 
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                    <span className="text-sm font-medium text-gray-700">{user.FullName}</span>
                                </button>
                            ) : (
                                // LOGGED OUT STATE
                                <Link
                                    to="/login"
                                    className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition shadow-sm hover:shadow-md"
                                >
                                    <User className="h-4 w-4" /> Login
                                </Link>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600">
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- SIDEBAR DRAWER --- */}
            {user && (
                <>
                    <div 
                        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
                            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>

                    <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}>
                        
                        <div className="flex justify-end p-4">
                            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-red-500">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="px-6 pb-6 border-b border-gray-100 flex flex-col items-center text-center">
                            <div className="relative">
                                <img 
                                    src={"/Profile.png"} 
                                    alt="Profile" 
                                    className="w-20 h-20 rounded-full border-4 border-blue-50 shadow-md mb-3 object-cover"
                                />
                                <div className="absolute bottom-3 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{user.FullName}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="p-4 space-y-2">
                            <Link 
                                to="/profile" 
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition group"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                                    <span className="font-medium">My Profile</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-400" />
                            </Link>

                            {/* ✅ NEW: Saved Schemes in Sidebar */}
                            <Link 
                                to="/userInfo/bookmarks" 
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition group"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <div className="flex items-center gap-3">
                                    <Bookmark className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                                    <span className="font-medium">Saved Schemes</span>
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

                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition group"
                            >
                                <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Navbar;