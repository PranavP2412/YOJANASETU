import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { BookOpen, User, Menu, X, HelpCircle, LogOut, ChevronRight, Bookmark, Home, Info, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsSidebarOpen(false);
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

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

        const handleAuthChange = () => checkUserStatus();
        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);

    }, []); 

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
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        
                        <div className="flex items-center gap-4">
                            {user && (
                                <button 
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="p-2 -ml-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-blue-600 focus:outline-none transition"
                                    title="Open Profile Menu"
                                >
                                    <Menu className="h-6 w-6" />
                                </button>
                            )}
                            
                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900">Yojanasetu</span>
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Home</Link>
                            <Link to="/schemes" className="text-gray-600 hover:text-blue-600 font-medium transition">Schemes</Link>
                            {user && (
                                <Link to="/userInfo/bookmarks" className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1">
                                    Saved
                                </Link>
                            )}
                            <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition">About</Link>
                        </div>

                        <div className="flex items-center gap-4">
                            {loading ? (
                                <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                            ) : user ? (
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
                                <Link
                                    to="/login"
                                    className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition shadow-sm hover:shadow-md"
                                >
                                    <User className="h-4 w-4" /> Login
                                </Link>
                            )}

                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                                className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link 
                                to="/" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <Home className="h-5 w-5" /> Home
                                </div>
                            </Link>
                            <Link 
                                to="/schemes" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <Layers className="h-5 w-5" /> Schemes
                                </div>
                            </Link>
                            <Link 
                                to="/about" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <Info className="h-5 w-5" /> About
                                </div>
                            </Link>

                            {!user && (
                                <Link 
                                    to="/login" 
                                    className="block mt-4 px-3 py-2 text-center rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                    Login / Sign Up
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {user && (
                <>
                    <div 
                        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
                            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                        onClick={() => setIsSidebarOpen(false)}
                    />

                    <div className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}>
                        
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <span className="font-semibold text-lg text-gray-800">Menu</span>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center bg-gray-50">
                            <div className="relative">
                                <img 
                                    src={"/Profile.png"} 
                                    alt="Profile" 
                                    className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-3 object-cover"
                                />
                                <div className="absolute bottom-2 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{user.FullName}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>

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
                                to="/about" 
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition group"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <div className="flex items-center gap-3">
                                    <Info className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                                    <span className="font-medium">About Us</span>
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