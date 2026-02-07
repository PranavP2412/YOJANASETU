import { useEffect, useState } from 'react';
import { 
    User, MapPin, Briefcase, TrendingUp, Target, 
    Edit, Loader2, Building2, Wallet, Mail, LayoutDashboard
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
        <div className="min-h-screen bg-gray-50/50 pb-12">
            
            <CreateProfileModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchProfile} 
                initialData={profile}
            />

            {!profile ? (
                // --- EMPTY STATE ---
                <div className="min-h-[80vh] flex items-center justify-center px-4">
                    <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-10 text-center border border-gray-100">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LayoutDashboard className="h-10 w-10 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            Welcome, {user?.FullName || "User"}!
                        </h2>
                        <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                            Your dashboard is empty. Create your business profile to unlock personalized scheme recommendations and insights.
                        </p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Complete My Profile
                        </button>
                    </div>
                </div>
            ) : (
                // --- PROFILE CONTENT ---
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                    
                    {/* 1. Header Card (Blue Container) */}
                    <div className="rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                        {/* Unified Blue Container */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-10">
                            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                                
                                {/* Avatar */}
                                <div className="shrink-0 relative">
                                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[4px] border-white/30 shadow-lg bg-white overflow-hidden">
                                        <img 
                                            src={"/Profile.png"} 
                                            alt="Avatar" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Main Info - White Text */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                                        {user?.FullName}
                                    </h1>
                                    
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                                        {/* Glassmorphism Tags */}
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium text-white border border-white/20">
                                            <Briefcase className="h-3.5 w-3.5 text-blue-100" /> {profile.sector}
                                        </span>
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium text-white border border-white/20">
                                            <MapPin className="h-3.5 w-3.5 text-blue-100" /> {profile.state}
                                        </span>
                                    </div>
                                </div>

                                {/* Edit Button - Inside Blue Div */}
                                <div className="mt-2 sm:mt-0">
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl hover:bg-white hover:text-blue-600 transition-all font-medium shadow-sm active:scale-95"
                                    >
                                        <Edit className="h-4 w-4" /> 
                                        <span>Edit Profile</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Category */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-blue-300 transition-colors group">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Business Category</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">{profile.category}</p>
                        </div>

                        {/* Stage */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-purple-300 transition-colors group">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Current Stage</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">{profile.stage}</p>
                        </div>

                        {/* Turnover */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-green-300 transition-colors group">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Wallet className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Annual Turnover</p>
                            <p className="text-xl font-bold text-gray-900 mt-1 font-mono">
                                ₹{(profile.turnover || 0).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* 3. Personal Details Column */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                    Contact Details
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="group">
                                        <div className="flex items-center gap-3 text-sm font-medium text-gray-500 mb-1">
                                            <User className="h-4 w-4" /> Gender
                                        </div>
                                        <div className="pl-7 text-gray-900 font-semibold text-lg">{profile.gender}</div>
                                    </div>

                                    <div className="w-full border-t border-gray-100"></div>

                                    <div className="group">
                                        <div className="flex items-center gap-3 text-sm font-medium text-gray-500 mb-1">
                                            <MapPin className="h-4 w-4" /> State
                                        </div>
                                        <div className="pl-7 text-gray-900 font-semibold text-lg">{profile.state}</div>
                                    </div>

                                    <div className="w-full border-t border-gray-100"></div>

                                    <div className="group">
                                        <div className="flex items-center gap-3 text-sm font-medium text-gray-500 mb-1">
                                            <Mail className="h-4 w-4" /> Email
                                        </div>
                                        <div className="pl-7 text-gray-900 font-semibold text-base break-all">{user?.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Business Needs Column */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                                    Strategic Focus Areas
                                </h3>
                                <p className="text-gray-500 text-sm mb-6 ml-3">
                                    Schemes will be curated based on the following business needs:
                                </p>
                                
                                <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-100 border-dashed">
                                    <div className="flex flex-wrap gap-3">
                                        {profile.needs && profile.needs.length > 0 ? (
                                            profile.needs.map((need, index) => (
                                                <span 
                                                    key={index}
                                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-gray-700 text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-default"
                                                >
                                                    <Target className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                                                    {need}
                                                </span>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full py-8 text-gray-400">
                                                <Target className="h-10 w-10 mb-2 opacity-20" />
                                                <span>No specific business needs selected.</span>
                                            </div>
                                        )}
                                    </div>
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