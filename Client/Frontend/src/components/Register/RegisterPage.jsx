import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Building2, ArrowRight, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        FullName: '',
        username: '',
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMode, setSuccessMode] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axiosClient.post('/auth/register', formData);
            setSuccessMode(true); 
        } catch (err) {
            console.error("Registration Error:", err);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (successMode) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h2>
                    <p className="text-gray-500 mb-6">
                        We've sent a verification link to <span className="font-semibold text-gray-900">{formData.email}</span>.
                        Please verify your email to access the dashboard.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gray-50 py-12">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-gray-500 mt-2">Join YojanaSetu today</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <input
                                type="text" name="FullName" required
                                value={formData.FullName} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
                                placeholder="John Doe"
                            />
                            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <div className="relative">
                            <input
                                type="text" name="username" required
                                value={formData.username} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
                                placeholder="John_Doe"
                            />
                            <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <input
                                type="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
                                placeholder="name@company.com"
                            />
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type="password" name="password" required
                                value={formData.password} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
                                placeholder="••••••••"
                                minLength={6}
                            />
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Create Account <ArrowRight className="h-5 w-5" /></>}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;