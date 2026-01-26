import { useEffect, useState } from 'react';
import { 
    User, MapPin, Briefcase, TrendingUp, Target, 
    Edit, Loader2, Building2, Wallet 
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import CreateProfileModal from './CreateProfileModal'; 

const ProfilePage = () => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [profile, setProfile] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProfile = async () => {
        try {
            const response = await axiosClient.get('/userInfo/userInfoGet'); 
            
            if (response.data && response.data.data) {
                // Handle nested structure differences if any
                if(response.data.data.userInfo) {
                    setProfile(response.data.data.userInfo);
                } else {
                    setProfile(response.data.data);
                }
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setProfile(null); 
            } else {
                console.error("Profile Fetch Error:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            
            <CreateProfileModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchProfile} 
                initialData={profile}
            />

            {!profile ? (
                /* --- STATE 1: CREATE PROFILE --- */
                <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
                    <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User className="h-10 w-10 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome, {user?.FullName || "User"}!
                        </h2>
                        <p className="text-gray-500 mb-8">
                            You haven't set up your business profile yet. Tell us about your business to get personalized scheme recommendations.
                        </p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-md hover:shadow-lg w-full sm:w-auto"
                        >
                            Create My Profile
                        </button>
                    </div>
                </div>
            ) : (
                /* --- STATE 2: SHOW DASHBOARD --- */
                <div className="max-w-4xl mx-auto space-y-6">
                    
                    {/* Header Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        
                        {/* 1. BLUE BANNER with Name Inside */}
                        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 h-48 px-8 flex items-end pb-6">
                            {/* Text Container - Pushed right (ml-32) to make room for Avatar */}
                            <div className="ml-0 sm:ml-36 w-full">
                                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md mb-2">
                                    {user?.FullName}
                                </h1>
                                <p className="text-blue-100 flex items-center gap-2 text-base sm:text-lg font-medium opacity-95">
                                    <Briefcase className="h-5 w-5" /> {profile.sector} • {profile.state}
                                </p>
                            </div>
                        </div>

                        {/* 2. White Section with Avatar & Stats */}
                        <div className="px-8 pb-8">
                            {/* Avatar Section - Pulls up into the blue area */}
                            <div className="relative -mt-20 mb-6 flex justify-between items-end">
                                <img 
                                    src={"/Profile.png"} 
                                    alt="Avatar" 
                                    className="w-32 h-32 rounded-full border-[5px] border-white shadow-lg bg-white object-cover"
                                />
                                
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium border border-gray-200"
                                >
                                    <Edit className="h-4 w-4" /> Edit Profile
                                </button>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-100/50">
                                    <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Category</p>
                                        <p className="font-bold text-gray-900 text-lg">{profile.category}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-50/50 border border-purple-100/50">
                                    <div className="p-2.5 bg-purple-100 rounded-lg text-purple-600">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Business Stage</p>
                                        <p className="font-bold text-gray-900 text-lg">{profile.stage}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50/50 border border-green-100/50">
                                    <div className="p-2.5 bg-green-100 rounded-lg text-green-600">
                                        <Wallet className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Turnover</p>
                                        <p className="font-bold text-gray-900 text-lg">₹ {(profile.turnover || 0).toLocaleString()}</p>
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
                                        <p className="text-xs text-gray-400 font-bold uppercase">Gender</p>
                                        <p className="text-gray-700 font-medium">{profile.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">State</p>
                                        <p className="text-gray-700 font-medium flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" /> {profile.state}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                                        <p className="text-gray-700 font-medium truncate">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Needs */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Target className="h-5 w-5 text-gray-400" /> Current Business Needs
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.needs && profile.needs.length > 0 ? (
                                        profile.needs.map((need, index) => (
                                            <span 
                                                key={index}
                                                className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-100"
                                            >
                                                {need}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic text-sm">No specific needs selected.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;