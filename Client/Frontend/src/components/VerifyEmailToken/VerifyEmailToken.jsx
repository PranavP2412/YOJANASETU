import React, { useEffect, useState, useRef } from 'react'; // 1. Import useRef
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

const VerifyEmailToken = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); 
  const [message, setMessage] = useState('');

  const hasCalledAPI = useRef(false);

  useEffect(() => {
    if (hasCalledAPI.current) return;
    hasCalledAPI.current = true;

    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/auth/verify-email/${token}`);
        
        if (response.status === 200) {
          setVerificationStatus('success');
          setMessage('Your email has been successfully verified! You can now access your dashboard.');
        }
      } catch (error) {
        setVerificationStatus('error');
        if (error.response && error.response.data && error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('The verification link is invalid or has expired.');
        }
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100 text-center">
        
          {verificationStatus === 'verifying' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
              <p className="text-gray-500">Please wait while we confirm your email address.</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-500 mb-8">{message}</p>
              
              <Link 
                to="/login" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Continue to Login
              </Link>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">{message}</p>
              
              <Link 
                to="/login" 
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VerifyEmailToken;