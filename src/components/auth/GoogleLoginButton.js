import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const { login } = useAuth();

  // Google OAuth is disabled for now - requires proper Google Cloud Console setup
  // with authorized origins configured
  return null;

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post('/auth/google', {
        token: credentialResponse.credential
      });
      
      const data = response.data;
      
      if (data.success) {
        login(data.user, data.token);
        if (onSuccess) {
          onSuccess(data.user);
        }
      } else {
        if (onError) {
          onError(data.message || 'Google authentication failed');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (onError) {
        onError(error.response?.data?.message || 'Login failed. Please try again.');
      }
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    if (onError) {
      onError('Google login failed. Please try again.');
    }
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="filled_blue"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="100%"
        useOneTap
      />
    </div>
  );
};

export default GoogleLoginButton;
