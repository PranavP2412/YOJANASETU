import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Extract ?token=XYZ from URL

    const [status, setStatus] = useState('verifying'); // verifying | success | error

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        const verify = async () => {
            try {
                // Send token to backend to validate
                await axiosClient.post('/auth/verify-email', { token });
                setStatus('success');
            } catch (error) {
                console.error(error);
                setStatus('error');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">



                {/* Error State */}
                {status === 'error' && (

                    <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900">The email has been sent to you</h2>
                        <p className="text-gray-500 mt-2 mb-6">Please Verify your email.</p>
                        <p className="text-gray-500 mt-2 mb-6">We are eager to update you about the schemes that you didnt even heard about.</p>
                    </>
                )}

            </div>
        </div>
    );
};

export default VerifyEmailPage;