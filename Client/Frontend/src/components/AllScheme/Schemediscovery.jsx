import { useEffect, useState } from 'react';
// FIX 1: Ensure these paths are correct for YOUR folder structure!
import axiosClient from '../../api/axiosClient';
import SchemeCard from "../schemes/SchemeCard"; 
import { Search, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const SchemeDiscovery = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added Error State
    
    // UI State
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchSchemes = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log("Fetching schemes page:", page); // DEBUG LOG
                const response = await axiosClient.get(`/schemes?page=${page}`);
                
                console.log("API Response:", response.data); // DEBUG LOG

                // FIX 2: Safety checks using optional chaining (?.)
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

        fetchSchemes();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]); 

    const handlePrevious = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(prev => prev + 1);
    };

    // FIX 3: If there is a critical error, show it instead of crashing
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
                <p className="text-xl font-bold">Something went wrong!</p>
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Reload Page
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-blue-900 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Explore Government Schemes</h1>
                    <p className="text-blue-200 max-w-2xl mx-auto text-lg">
                        Search through our verified database of grants, loans, and subsidies.
                    </p>

                    {/* Search & Filter */}
                    <div className="mt-8 max-w-2xl mx-auto relative flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl shadow-lg border-0 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                        </div>

                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full md:w-48 px-4 py-4 rounded-xl shadow-lg border-0 focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Finance">Finance</option>
                            <option value="Agriculture">Agriculture</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            Page {page} of {totalPages}
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
                                {/* FIX 4: Ensure schemes is an array before mapping */}
                                {Array.isArray(schemes) && schemes.length > 0 ? (
                                    schemes.map((scheme) => (
                                        <SchemeCard key={scheme._id} scheme={scheme} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-10 text-gray-500">
                                        No schemes found.
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {schemes.length > 0 && (
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