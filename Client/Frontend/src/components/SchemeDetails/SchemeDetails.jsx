import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // 1. Added useNavigate
import axiosClient from '../../api/axiosClient';
import { 
    ArrowLeft, Building2, Calendar, CheckCircle, 
    ExternalLink, Loader2, Tag, Wallet, Globe, Share2, Bookmark 
} from 'lucide-react';

const SchemeDetails = () => {
    const { id } = useParams(); 
    const navigate = useNavigate(); // 2. Initialize navigation
    
    const [scheme, setScheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get(`/schemes/${id}`);
                const schemeData = response.data.data;
                setScheme(schemeData);
                try {
                    const bookmarkResponse = await axiosClient.get(`/schemes/isBookmarked/${id}`);
                    if (bookmarkResponse.data && bookmarkResponse.data.data) {
                        setIsBookmarked(bookmarkResponse.data.data.isBookmarked);
                    }
                } catch (authError) {
                    console.log("User not logged in or check failed", authError.message);
                }
                
            } catch (err) {
                console.error("Error fetching scheme details:", err);
                setError(err.response?.data?.message || err.response?.data || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0); 
    }, [id]);

    const handleBookmark = async () => {
        if (!scheme) return;
        
        setBookmarkLoading(true);

        try {
            await axiosClient.post('/schemes/bookmark', {
                schemeId: scheme._id 
            });

            setIsBookmarked(!isBookmarked);
            
        } catch (err) {
            console.error("Error bookmarking scheme:", err);
            
            if (err.response && err.response.status === 401) {
                alert("Please log in to save schemes to your dashboard.");
                navigate('/login');
            } else {
                alert("Failed to update bookmark. Please try again.");
            }
        } finally {
            setBookmarkLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error || !scheme) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Scheme Not Found</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <Link to="/schemes" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Browse Other Schemes
                </Link>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-12 text-white">
                <div className="max-w-5xl mx-auto px-4">
                    <Link to="/schemes" className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Schemes
                    </Link>
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div>
                            <span className="inline-block bg-blue-500/30 border border-blue-400/30 backdrop-blur-sm text-blue-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                                {scheme.category}
                            </span>
                            
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                                {scheme.schemeName}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-4 text-blue-100/90 text-sm md:text-base">
                                <span className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" /> {scheme.ministry}
                                </span>
                                <span className="hidden md:inline">•</span>
                                <span className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" /> Updated: {formatDate(scheme.updatedAt)}
                                </span>
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <a 
                                href={scheme.applicationLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg transform hover:-translate-y-1"
                            >
                                Apply Now <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {scheme.description}
                            </p>
                        </div>

                        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-8">
                            <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                                <Wallet className="h-6 w-6" /> Key Benefits & Funding
                            </h2>
                            <div className="text-emerald-800 leading-relaxed font-medium">
                                {scheme.benefits}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CheckCircle className="h-6 w-6 text-blue-600" /> Eligibility Criteria
                            </h2>
                            <div className="prose prose-blue max-w-none text-gray-600">
                                <p>{scheme.eligibility}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Globe className="h-5 w-5 text-gray-400" /> Application Details
                            </h3>
                            
                            <div className="space-y-4 mb-6">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Application Mode</p>
                                    <p className="font-medium text-gray-900">Online / Direct</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Official Website</p>
                                    <a href={scheme.applicationLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block">
                                        Visit Website
                                    </a>
                                </div>
                            </div>

                            <a 
                                href={scheme.applicationLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md"
                            >
                                Apply on Official Site <ExternalLink className="h-4 w-4" />
                            </a>
                            
                            <div className="grid grid-cols-2 gap-3 mt-3">
                                <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition">
                                    <Share2 className="h-4 w-4" /> Share
                                </button>

                                <button 
                                    onClick={handleBookmark}
                                    disabled={bookmarkLoading}
                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition border ${
                                        isBookmarked 
                                        ? "bg-amber-50 text-amber-700 border-amber-200" 
                                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    {bookmarkLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} /> 
                                    )}
                                    {isBookmarked ? "Saved" : "Save"}
                                </button>
                            </div>
                        </div>

                        {scheme.tags && scheme.tags.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Tag className="h-5 w-5 text-gray-400" /> Related Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {scheme.tags.map((tag, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-lg border border-gray-200">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SchemeDetails;