import { Link } from 'react-router-dom';
import { BookOpen, User, Menu } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">Yojanasetu</span>
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Home</Link>
                        <Link to="/schemes" className="text-gray-600 hover:text-blue-600 font-medium transition">Schemes</Link>
                        <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition">About</Link>
                        <Link
                            to="/login"
                            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition shadow-sm hover:shadow-md"
                        >
                            <User className="h-4 w-4" /> Login
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;