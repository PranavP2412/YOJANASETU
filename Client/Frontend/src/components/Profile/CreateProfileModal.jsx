import { useState, useEffect } from 'react';
import {
    X, User, Building2, MapPin, IndianRupee, Target,
    Save, Loader2, AlertCircle, CheckCircle
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const CreateProfileModal = ({ isOpen, onClose, onSuccess, initialData }) => {
    if (!isOpen) return null;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        category: "General",
        gender: "Male",
        state: "",
        sector: "Manufacturing",
        stage: "Idea/Prototype",
        turnover: "", // Changed default to empty string for dropdown
        needs: []
    });

    // Load initial data if editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                category: initialData.category || "General",
                gender: initialData.gender || "Male",
                state: initialData.state || "",
                sector: initialData.sector || "Manufacturing",
                stage: initialData.stage || "Idea/Prototype",
                turnover: initialData.turnover || "",
                needs: initialData.needs || []
            });
        }
    }, [initialData]);

    // --- DATA LISTS ---
    const categories = ["General", "SC", "ST", "OBC", "Minority"];
    const genders = ["Male", "Female", "Other"];
    const sectors = ["Manufacturing", "Service", "Trading", "Agriculture"];
    const stages = ["Idea/Prototype", "Startup", "Existing Business"];
    const needsOptions = ["Loan", "Subsidy", "Training", "Exhibition", "Certification", "Infrastructure", "Technology"];

    // ✅ New Turnover Options
    const turnoverOptions = [
        "< 20 Lakhs",
        "20 Lakhs - 1 Cr",
        "1 Cr - 5 Cr",
        "5 Cr - 50 Cr",
        "50 Cr - 250 Cr",
        "> 250 Cr"
    ];

    const states = [
        "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
        "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu",
        "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
        "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
        "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
        "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleNeed = (need) => {
        setFormData(prev => {
            if (prev.needs.includes(need)) {
                return { ...prev, needs: prev.needs.filter(n => n !== need) };
            } else {
                return { ...prev, needs: [...prev.needs, need] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (!formData.state) {
            setError("Please select your state.");
            setLoading(false);
            return;
        }
        if (!formData.turnover) {
            setError("Please select your annual turnover.");
            setLoading(false);
            return;
        }

        try {
            await axiosClient.post('/userInfo/userInfoPost', formData);
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Profile Error:", err);
            setError(err.response?.data?.message || "Failed to save profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-8 animation-fade-in">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition text-gray-500"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Header */}
                <div className="p-6 border-b border-gray-100 text-center bg-gray-50 rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {initialData ? "Edit Business Profile" : "Complete Your Profile"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Accurate details help us find the best schemes for you.
                    </p>
                </div>

                {/* Form Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-3 flex items-center gap-3 rounded-r">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Row 1: Gender & Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                                <select
                                    name="gender" value={formData.gender} onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                                >
                                    {genders.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Social Category</label>
                                <select
                                    name="category" value={formData.category} onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Row 2: State & Sector */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                                <select
                                    name="state" value={formData.state} onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                                >
                                    <option value="">Select State...</option>
                                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Industry Sector</label>
                                <select
                                    name="sector" value={formData.sector} onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                                >
                                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Row 3: Stage & Turnover (Updated) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Business Stage</label>
                                <select
                                    name="stage" value={formData.stage} onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
                                >
                                    {stages.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            {/* ✅ Updated Turnover Dropdown */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Annual Turnover</label>
                                <div className="relative">
                                    <select
                                        name="turnover" value={formData.turnover} onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-600 outline-none appearance-none bg-white"
                                    >
                                        <option value="">Select Range...</option>
                                        {turnoverOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <IndianRupee className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Row 4: Needs */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Business Needs</label>
                            <div className="flex flex-wrap gap-2">
                                {needsOptions.map((need) => (
                                    <button
                                        key={need} type="button" onClick={() => toggleNeed(need)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition flex items-center gap-1 ${formData.needs.includes(need)
                                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        {formData.needs.includes(need) && <CheckCircle className="h-3 w-3" />}
                                        {need}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save className="h-5 w-5" /> Save Details</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProfileModal;