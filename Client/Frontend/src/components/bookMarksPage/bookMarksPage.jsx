import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import SchemeCard from '../schemes/SchemeCard'; // Reusing your existing card
import { Bookmark, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookmarksPage = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await axiosClient.get('/userInfo/bookmarks');
                setBookmarks(response.data.data || []);
            } catch (err) {
                console.error("Error fetching bookmarks:", err);
                setError("Failed to load your saved schemes.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Link to="/schemes" className="p-2 hover:bg-gray-100 rounded-full transition">
                            <ArrowLeft className="h-6 w-6 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Bookmark className="h-6 w-6 text-blue-600 fill-current" />
                                My Saved Schemes
                            </h1>
                            <p className="text-gray-500 text-sm">
                                {bookmarks.length} {bookmarks.length === 1 ? 'scheme' : 'schemes'} saved for later
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {error ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-red-100">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : bookmarks.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookmarks.map((scheme) => (
                            <SchemeCard key={scheme._id} scheme={scheme} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="bg-blue-50 p-4 rounded-full mb-4">
                            <Bookmark className="h-8 w-8 text-blue-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No bookmarks yet</h3>
                        <p className="text-gray-500 max-w-sm mb-6">
                            Save schemes you are interested in so you can easily find and apply for them later.
                        </p>
                        <Link 
                            to="/schemes" 
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Explore Schemes
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookmarksPage;