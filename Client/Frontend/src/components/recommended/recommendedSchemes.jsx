import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { 
    Loader2, Sparkles, CheckCircle2, 
    ArrowRight, Building2, ExternalLink, AlertCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RecommendedSchemes = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axiosClient.get('schemes/recommend');
                setSchemes(response.data.data || []);
            } catch (err) {
                console.error("Error fetching recommendations:", err);
                setError("Failed to generate recommendations. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    const getScoreColor = (score) => {
        if (score >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200";
        if (score >= 75) return "text-blue-600 bg-blue-50 border-blue-200";
        return "text-amber-600 bg-amber-50 border-amber-200";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">Analyzing your profile...</h2>
                <p className="text-gray-500">Finding the perfect schemes for your business</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-gradient-to-r from-violet-900 to-indigo-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <Sparkles className="h-6 w-6 text-yellow-300" />
                        </div>
                        <span className="font-medium text-violet-200 uppercase tracking-wider text-sm">AI Powered</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Top Recommendations</h1>
                    <p className="text-violet-200 max-w-2xl text-lg">
                        Based on your business profile, we've identified these schemes as the highest potential matches for your current needs.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8">
                
                {error && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-700 mb-8">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}

                {schemes.length === 0 && !error ? (
                    <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-100">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building2 className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Matches Found</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            We couldn't find any schemes matching your specific criteria right now. Try updating your profile with more details.
                        </p>
                        <Link to="/profile" className="text-blue-600 font-medium hover:underline">
                            Update Business Profile
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {schemes.map((item, index) => {
                            const { schemeId, matchScore, reason } = item;
                            if (!schemeId) return null;

                            return (
                                <div 
                                    key={schemeId._id || index}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition duration-300 group relative overflow-hidden"
                                >
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                        matchScore >= 90 ? 'bg-emerald-500' : 
                                        matchScore >= 75 ? 'bg-blue-500' : 'bg-amber-500'
                                    }`}></div>

                                    <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
                                        
                                        <div className="flex-shrink-0">
                                            <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 ${getScoreColor(matchScore)}`}>
                                                <span className="text-2xl font-bold">{matchScore}%</span>
                                                <span className="text-[10px] font-bold uppercase tracking-wide">Match</span>
                                            </div>
                                        </div>

                                        <div className="flex-grow space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                                                        <Link to={`/schemes/${schemeId._id}`}>
                                                            {schemeId.schemeName}
                                                        </Link>
                                                    </h3>
                                                    {schemeId.agency && (
                                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                            <Building2 className="h-3 w-3" /> {schemeId.agency}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100/50">
                                                <div className="flex gap-2">
                                                    <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                    <p className="text-sm text-blue-800 leading-relaxed font-medium">
                                                        <span className="font-bold">Why it fits:</span> {reason}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                {schemeId.description}
                                            </p>

                                            <div className="flex flex-wrap gap-4 pt-2">
                                                <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    {schemeId.benefits ? schemeId.benefits.substring(0, 40) + "..." : "Benefits available"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 lg:w-48 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                                            <Link 
                                                to={`/schemes/${schemeId._id}`}
                                                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition shadow-sm"
                                            >
                                                View Details <ArrowRight className="h-4 w-4" />
                                            </Link>
                                            
                                            {schemeId.applicationLink && (
                                                <a 
                                                    href={schemeId.applicationLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                                                >
                                                    Apply Now <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendedSchemes;