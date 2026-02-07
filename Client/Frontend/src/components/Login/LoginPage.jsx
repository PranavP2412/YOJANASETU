import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google'; 
import axiosClient from '../../api/axiosClient';

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axiosClient.post('/auth/login', formData);
            handleAuthSuccess(response.data.data); 
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.response?.data || "An unexpected error occurred.";
            setError(errorMessage);
            setSuccess(false);
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosClient.post('/auth/google', {
                token: credentialResponse.credential
            });
            handleAuthSuccess(response.data.data); 
        } catch (err) {
            console.error("Google Login Error:", err);
            const errorMessage = err.response?.data?.message || "Google sign-in failed. Please try again.";
            setError(errorMessage);
            setLoading(false);
        }
    };

    const handleAuthSuccess = (data) => {
        const { accessToken, user } = data; 

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        window.dispatchEvent(new Event("auth-change"));

        setSuccess(true);
        setLoading(false);

        setTimeout(() => {
            navigate('/'); 
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

                    <div className="mb-8 text-center">
                        <h2 className="text-4xl font-extrabold text-gray-900">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sign in to access YojanaSetu
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            <p className="text-sm text-green-700">Login successful! Redirecting...</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <Link
                                        to="/forgot-password"
                                        className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading && !formData.google ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" /> Signing in...
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle2 className="h-5 w-5" /> Success
                                </>
                            ) : (
                                <>
                                    Sign In <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center w-full">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    console.error('Google Login Failed');
                                    setError('Google sign-in was unsuccessful.');
                                }}
                                useOneTap
                                theme="filled_blue"
                                shape="pill"
                                width="100%" 
                            />
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 font-bold hover:underline">
                            Create account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;