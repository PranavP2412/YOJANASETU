import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import SchemeCard from "../schemes/SchemeCard";
import { Search, Filter } from 'lucide-react';

const SchemeDiscovery = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // In a real app, you would debounce this search
        const fetchSchemes = async () => {
            try {
                const response = await axiosClient.get('/schemes');
                setSchemes(response.data.data || []);
            } catch (error) {
                console.error("Error fetching schemes:", error);
                // Fallback data for demo purposes if backend is offline
                setSchemes([
                    { _id: 1, title: 'PMEGP Scheme', description: 'Credit linked subsidy program.', simplifiedDescription: 'Get up to 35% subsidy on projects.', deadline: '2025-03-31' },
                    { _id: 2, title: 'CGTMSE', description: 'Collateral free loans for MSEs.', simplifiedDescription: 'Loans up to ₹2 Crore without collateral.', deadline: null }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchSchemes();
    }, []);

    const filteredSchemes = schemes.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-blue-900 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Explore Government Schemes</h1>
                    <p className="text-blue-200 max-w-2xl mx-auto text-lg">
                        Search through our verified database of grants, loans, and subsidies.
                    </p>

                    {/* Search Bar */}
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
                            {filteredSchemes.length} Schemes Found
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
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSchemes.map((scheme) => (
                                <SchemeCard key={scheme._id} scheme={scheme} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchemeDiscovery;