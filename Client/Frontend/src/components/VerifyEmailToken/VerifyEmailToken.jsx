import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './VerifyEmailToken.css'; // Assuming you'll create a CSS file for styling

const VerifyEmailToken = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(`http://localhost:8000/api/auth/verify-email/${token}`);
        if (response.status === 200) {
          setVerificationStatus('success');
          setMessage('Your email has been successfully verified!');
        }
      } catch (error) {
        setVerificationStatus('error');
        if (error.response && error.response.data && error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('An error occurred during email verification.');
        }
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="verify-email-container">
      {verificationStatus === 'verifying' && (
        <div className="verification-message verifying">
          <h2>Verifying your email...</h2>
          <p>Please wait while we confirm your email address.</p>
        </div>
      )}

      {verificationStatus === 'success' && (
        <div className="verification-message success">
          <h2>Email Verified!</h2>
          <p>{message}</p>
          <Link to="/" className="home-button">Go to Home Page</Link>
        </div>
      )}

      {verificationStatus === 'error' && (
        <div className="verification-message error">
          <h2>Verification Failed</h2>
          <p>{message}</p>
          <Link to="/" className="home-button">Go to Home Page</Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailToken;
