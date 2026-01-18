import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const LoginPage = () => {
    const navigate = useNavigate();

    // State for form inputs
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // State for UI feedback
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing again
        if (error) setError(null);
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // POST request to your backend
            const response = await axiosClient.post('/auth/login', formData);

            // If successful:
            // 1. Save the token (Local Storage is easiest for now)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // 2. Redirect to Dashboard or Home
            navigate('/schemes');

        } catch (err) {
            // Handle Errors
            console.error(err);
            const errorMessage = err.response?.data?.message || "Login failed. Please try again.";

            // Specific check for Email Verification
            if (errorMessage.toLowerCase().includes('verify')) {
                setError("Please verify your email address before logging in.");
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Sign in to access YojanaSetu</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                                placeholder="name@company.com"
                            />
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" /> Signing in...
                            </>
                        ) : (
                            <>
                                Sign In <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline">
                        Create account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;