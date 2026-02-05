import { useEffect, useState } from 'react';
import { 
    User, MapPin, Briefcase, TrendingUp, Target, 
    Edit, Loader2, Building2, Wallet, Mail
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
        <div className="min-h-screen bg-gray-50 pb-12">
            
            <CreateProfileModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchProfile} 
                initialData={profile}
            />

            {!profile ? (
                <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
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
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-md"
                        >
                            Create My Profile
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-w-5xl mx-auto">
                    
                    <div className="relative bg-white shadow-sm border-b border-gray-200">
                        <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                        
                        <div className="px-4 sm:px-8 pb-6">
                            <div className="relative -mt-12 sm:-mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                                
                                <div className="relative">
                                    <img 
                                        src={"/Profile.png"} 
                                        alt="Avatar" 
                                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md bg-white object-cover"
                                    />
                                </div>

                                <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0 sm:mb-2">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        {user?.FullName}
                                    </h1>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1 text-gray-600 text-sm sm:text-base">
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="h-4 w-4" /> {profile.sector}
                                        </span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" /> {profile.state}
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium shadow-sm text-sm"
                                >
                                    <Edit className="h-4 w-4" /> Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 sm:px-8 py-6 space-y-6">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-lg text-blue-600 shadow-sm">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Category</p>
                                    <p className="font-bold text-gray-900 text-lg">{profile.category}</p>
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-lg text-purple-600 shadow-sm">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Stage</p>
                                    <p className="font-bold text-gray-900 text-lg">{profile.stage}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-lg text-green-600 shadow-sm">
                                    <Wallet className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Turnover</p>
                                    <p className="font-bold text-gray-900 text-lg">₹ {(profile.turnover || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 h-full">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
                                        <User className="h-5 w-5 text-gray-500" /> Personal Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                <User className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase">Gender</p>
                                                <p className="text-gray-700 font-medium">{profile.gender}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                                                <p className="text-gray-700 font-medium">{profile.state}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                                                <p className="text-gray-700 font-medium truncate w-full">{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 h-full">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
                                        <Target className="h-5 w-5 text-gray-500" /> Business Goals & Needs
                                    </h3>
                                    
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-3">
                                            Based on your profile, you are currently looking for support in these areas:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.needs && profile.needs.length > 0 ? (
                                                profile.needs.map((need, index) => (
                                                    <span 
                                                        key={index}
                                                        className="px-3 py-1.5 rounded-full bg-white text-indigo-700 text-sm font-semibold border border-indigo-100 shadow-sm"
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;