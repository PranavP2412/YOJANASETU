// src/components/ForgotPassword/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            await axiosClient.post('/auth/reset-password-email', { email });
            setStatus('success');
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || "Could not send email. Please try again.");
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your mail</h2>
                    <p className="text-gray-500 mb-6">
                        We have sent a password recover instruction to your email.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => setStatus('idle')}
                            className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                        >
                            Try another email
                        </button>
                        <Link to="/login" className="block text-blue-600 font-bold hover:underline">
                            Skip, I'll login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                        <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                    <p className="text-gray-500 mt-2">No worries, we'll send you reset instructions.</p>
                </div>

                {status === 'error' && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3 rounded-r-md">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-red-700">{message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
                            placeholder="Enter your email"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {status === 'loading' ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>Reset Password <ArrowRight className="h-5 w-5" /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center justify-center gap-2">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;