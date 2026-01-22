import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    User, MapPin, Briefcase, TrendingUp, Target, 
    Edit, AlertCircle, Loader2, Building2, Wallet 
} from 'lucide-react';
import axiosClient from '../../api/axiosClient'; // Ensure this path is correct

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock User Data (Replace with Context/Auth user later if needed)
    // Ideally, the backend response should include basic user info (name/email) too.
    const basicUser = {
        fullName: "Pranava",
        email: "pranava@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pranava"
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Ensure this matches your backend route exactly
                const response = await axiosClient.get('/userInfo/userInfoGet'); 
                setProfile(response.data.data.userInfo);
            } catch (err) {
                // If 404, it means profile doesn't exist yet (this is normal for new users)
                if (err.response && err.response.status === 404) {
                    setProfile(null); 
                } else {
                    console.error("Profile Fetch Error:", err);
                    setError("Failed to load profile data.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    // --- STATE 1: NO PROFILE FOUND (Show "Create Profile" CTA) ---
    if (!profile) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="h-10 w-10 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
                    <p className="text-gray-500 mb-8">
                        You haven't set up your business profile yet. Tell us about your business to get personalized scheme recommendations.
                    </p>
                    
                    <Link 
                        to="/create-profile" // You need to create this page next
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-md hover:shadow-lg w-full sm:w-auto"
                    >
                        Create My Profile
                    </Link>
                </div>
            </div>
        );
    }

    // --- STATE 2: PROFILE EXISTS (Show Dashboard) ---
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="flex items-end gap-6">
                                <img 
                                    src={basicUser.avatar} 
                                    alt="Avatar" 
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white"
                                />
                                <div className="mb-1">
                                    <h1 className="text-2xl font-bold text-gray-900">{basicUser.fullName}</h1>
                                    <p className="text-gray-500 flex items-center gap-1.5 text-sm">
                                        <Briefcase className="h-3.5 w-3.5" /> {profile.sector} • {profile.state}
                                    </p>
                                </div>
                            </div>
                            <Link 
                                to="/edit-profile" 
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                            >
                                <Edit className="h-4 w-4" /> Edit Profile
                            </Link>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Category</p>
                                    <p className="font-semibold text-gray-900">{profile.category}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50/50">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Business Stage</p>
                                    <p className="font-semibold text-gray-900">{profile.stage}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50/50">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <Wallet className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Turnover</p>
                                    <p className="font-semibold text-gray-900">₹ {(profile.turnover || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left Column: Personal Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-gray-400" /> About
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase">Gender</p>
                                    <p className="text-gray-700 font-medium">{profile.gender}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase">State</p>
                                    <p className="text-gray-700 font-medium flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" /> {profile.state}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase">Email</p>
                                    <p className="text-gray-700 font-medium truncate">{basicUser.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Needs & Recommendations */}
                    <div className="md:col-span-2 space-y-6">
                        
                        {/* Needs Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Target className="h-5 w-5 text-gray-400" /> Current Business Needs
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Based on your selection, we will curate schemes that help with:
                            </p>
                            
                            <div className="flex flex-wrap gap-2">
                                {profile.needs && profile.needs.length > 0 ? (
                                    profile.needs.map((need, index) => (
                                        <span 
                                            key={index}
                                            className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-100"
                                        >
                                            {need}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 italic text-sm">No specific needs selected.</span>
                                )}
                            </div>
                        </div>

                        {/* CTA for Schemes (Placeholder for your next feature) */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2">Ready to find funding?</h3>
                                <p className="text-gray-300 mb-6 text-sm max-w-md">
                                    We found schemes matching your profile for {profile.sector} sector in {profile.state}.
                                </p>
                                <Link 
                                    to="/schemes" 
                                    className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-100 transition"
                                >
                                    View Recommended Schemes
                                </Link>
                            </div>
                            
                            {/* Decorative background circle */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;