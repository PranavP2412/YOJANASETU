import { useState } from 'react';
// 1. CHANGE THIS IMPORT: Use 'useParams' instead of 'useSearchParams'
import { useParams, useNavigate } from 'react-router-dom'; 
import { Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const ResetPasswordPage = () => {
    const { resetToken } = useParams(); 
    
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (passwords.newPassword.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);
        try {
            await axiosClient.post(`/auth/reset-password/${resetToken}`, { 
                newPassword: passwords.newPassword
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to reset password. The link may be expired.");
        } finally {
            setLoading(false);
        }
    };
    if (!resetToken) return <div className="text-center mt-20 text-red-500">Invalid Link (No Token Found)</div>;

    if (success) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Password Reset!</h2>
                    <p className="text-gray-500 mt-2">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Set New Password</h2>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
                                placeholder="••••••••"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            />
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
                                placeholder="••••••••"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            />
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;