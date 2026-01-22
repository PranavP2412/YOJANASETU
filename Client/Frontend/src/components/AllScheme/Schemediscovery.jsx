import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import SchemeCard from "../schemes/SchemeCard";
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const SchemeDiscovery = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
       const fetchSchemes = async () => {
    setLoading(true);
    try {
        const response = await axiosClient.get(`/schemes?page=${page}`);
        
        // --- ADD THIS DEBUG LOG ---
        console.log("🔥 FULL API RESPONSE:", response);
        console.log("📂 Data Location:", response.data?.data?.schemes);
        // --------------------------

        setSchemes(response.data.data.schemes || []);
        setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
        console.error("❌ Error fetching schemes:", error);
    } finally {
        setLoading(false);
    }
};

        fetchSchemes();
        
        // Scroll to top of results when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]); // Re-run effect when 'page' changes

    const handlePrevious = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-blue-900 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Explore Government Schemes</h1>
                    <p className="text-blue-200 max-w-2xl mx-auto text-lg">
                        Search through our verified database of grants, loans, and subsidies.
                    </p>

                    {/* Search Bar (Visual Only for now as backend search is disabled) */}
                    <div className="mt-8 max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Try searching for 'Solar', 'Women', or 'Subsidy'..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl shadow-lg border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 outline-none"
                        />
                        <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            {/* Showing count for current page */}
                            Showing Page {page} of {totalPages}
                        </h2>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
                            <Filter className="h-4 w-4" /> Filter
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {schemes.map((scheme) => (
                                    <SchemeCard key={scheme._id} scheme={scheme} />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {schemes.length > 0 && (
                                <div className="flex justify-center items-center gap-4 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={page === 1}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition
                                            ${page === 1 
                                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200' 
                                                : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-blue-500 border-gray-300'
                                            }`}
                                    >
                                        <ChevronLeft className="h-4 w-4" /> Previous
                                    </button>

                                    <span className="text-sm font-medium text-gray-600">
                                        Page {page} of {totalPages}
                                    </span>

                                    <button
                                        onClick={handleNext}
                                        disabled={page === totalPages}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition
                                            ${page === totalPages 
                                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200' 
                                                : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-blue-500 border-gray-300'
                                            }`}
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