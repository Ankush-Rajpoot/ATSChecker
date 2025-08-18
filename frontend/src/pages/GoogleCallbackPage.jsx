import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import useAuthStore from '../store/authStore';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleGoogleCallback, isAuthenticated } = useAuthStore();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      const token = searchParams.get('token');
      const userParam = searchParams.get('user');
      const error = searchParams.get('error');

      console.log('Google OAuth Callback - Processing...', { token: !!token, userParam: !!userParam, error });

      if (error) {
        console.error('Google OAuth error:', error);
        setProcessing(false);
        navigate('/login?error=Google authentication failed');
        return;
      }

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          console.log('Parsed user data:', user);
          
          // Call the callback handler
          const result = await handleGoogleCallback(token, user);
          console.log('handleGoogleCallback result:', result);
          
          // Add a small delay to ensure state is updated
          setTimeout(() => {
            setProcessing(false);
            console.log('Navigating to home page...');
            navigate('/', { replace: true });
          }, 100);
          
        } catch (err) {
          console.error('Error parsing user data:', err);
          setProcessing(false);
          navigate('/login?error=Authentication failed');
        }
      } else {
        console.error('Missing token or user data');
        setProcessing(false);
        navigate('/login?error=Authentication failed');
      }
    };

    processCallback();
  }, [searchParams, navigate, handleGoogleCallback]);

  // Also check if we're authenticated and redirect
  useEffect(() => {
    if (isAuthenticated && !processing) {
      console.log('Already authenticated, redirecting to home page');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, processing, navigate]);

  if (!processing && isAuthenticated) {
    // Force redirect if somehow we're still here but authenticated
    navigate('/', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-100 flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-8 h-8 animate-spin text-accent-400 mx-auto mb-4" />
        <p className="text-accent-400 text-lg font-medium">Completing authentication...</p>
        <p className="text-dark-700 text-sm mt-2">Please wait while we sign you in.</p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
