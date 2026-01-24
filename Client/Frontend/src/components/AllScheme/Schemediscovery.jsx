import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import SchemeCard from "../schemes/SchemeCard"; 
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, Sparkles, RefreshCcw } from 'lucide-react';

const SchemeDiscovery = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // UI State
    const [searchTerm, setSearchTerm] = useState("");
    const [isRecommendedMode, setIsRecommendedMode] = useState(false); // Toggle for "Recommended" vs "All"

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchSchemes = async () => {
            setLoading(true);
            setError(null);
            try {
                let endpoint = '/schemes';
                let params = { page }; // Default params

                // Logic: Decide which API to hit
                if (isRecommendedMode) {
                    // 1. Fetch Recommended Schemes
                    endpoint = '/schemes/recommend'; // Assuming this endpoint exists on your backend
                } else {
                    // 2. Fetch All Schemes (with Search)
                    endpoint = '/schemes';
                    if (searchTerm) {
                        params.search = searchTerm; // Add search query to params
                    }
                }

                console.log(`Fetching: ${endpoint}`, params); // Debug Log

                const response = await axiosClient.get(endpoint, { params });
                
                const fetchedSchemes = response.data?.data?.schemes || [];
                const fetchedPagination = response.data?.data?.pagination;

                setSchemes(fetchedSchemes);
                setTotalPages(fetchedPagination?.totalPages || 1);

            } catch (err) {
                console.error("Error fetching schemes:", err);
                setError("Failed to load schemes. Please try again later.");
                setSchemes([]);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search to prevent too many API calls while typing
        const timeoutId = setTimeout(() => {
            fetchSchemes();
        }, 500);

        return () => clearTimeout(timeoutId);

    }, [page, searchTerm, isRecommendedMode]); 


    // --- HANDLERS ---

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to page 1 on new search
        if (isRecommendedMode) {
            setIsRecommendedMode(false); // Switch back to "All" mode if user starts searching
        }
    };

    const toggleRecommended = () => {
        setIsRecommendedMode(!isRecommendedMode);
        setSearchTerm(""); // Clear search when switching modes
        setPage(1);
    };

    const handlePrevious = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(prev => prev + 1);
    };

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
                <p className="text-xl font-bold">Something went wrong!</p>
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
                >
                    <RefreshCcw className="h-4 w-4" /> Reload Page
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-blue-900 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {isRecommendedMode ? "Schemes Curated For You" : "Explore Government Schemes"}
                    </h1>
                    <p className="text-blue-200 max-w-2xl mx-auto text-lg">
                        {isRecommendedMode 
                            ? "Based on your business profile, sector, and turnover."
                            : "Search through our verified database of grants, loans, and subsidies."
                        }
                    </p>

                    {/* Search & Recommend Button Row */}
                    <div className="mt-8 max-w-3xl mx-auto flex flex-col md:flex-row gap-4 items-center">
                        
                        {/* Search Input */}
                        <div className="relative w-full flex-grow">
                            <input
                                type="text"
                                placeholder="Search by name, sector, or keyword..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-12 pr-4 py-4 rounded-xl shadow-lg border-0 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                        </div>

                        {/* Recommend Toggle Button */}
                        <button
                            onClick={toggleRecommended}
                            className={`w-full md:w-auto px-6 py-4 rounded-xl shadow-lg font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap
                                ${isRecommendedMode 
                                    ? "bg-white text-blue-900 border-2 border-blue-500" 
                                    : "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600"
                                }`}
                        >
                            {isRecommendedMode ? (
                                <>Show All Schemes</>
                            ) : (
                                <><Sparkles className="h-5 w-5" /> Recommended for You</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            {isRecommendedMode ? "Your Matches" : `Page ${page} of ${totalPages}`}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Filter className="h-4 w-4" />
                            <span>Results: {schemes.length}</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {Array.isArray(schemes) && schemes.length > 0 ? (
                                    schemes.map((scheme) => (
                                        <SchemeCard key={scheme._id} scheme={scheme} />
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                                        <Search className="h-12 w-12 text-gray-300 mb-3" />
                                        <p className="text-lg font-medium">No schemes found.</p>
                                        <p className="text-sm">Try adjusting your search or profile details.</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls (Only show if not in Recommend mode) */}
                            {schemes.length > 0 && !isRecommendedMode && (
                                <div className="flex justify-center items-center gap-4 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={page === 1}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                                    >
                                        <ChevronLeft className="h-4 w-4" /> Previous
                                    </button>

                                    <span className="text-sm font-medium text-gray-600">
                                        Page {page} of {totalPages}
                                    </span>

                                    <button
                                        onClick={handleNext}
                                        disabled={page === totalPages}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                                    >
                                        Next <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchemeDiscovery;