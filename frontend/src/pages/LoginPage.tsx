import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/auth.api';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';

function LoginPage() {
    const { t } = useTranslation();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        try {
            if (!auth) {
                console.error('Auth context is null');
                return;
            }
            
            const decoded = jwtDecode(credentialResponse.credential);
            const response = await authApi.googleLogin(credentialResponse.credential);
            if (response.data.token) {
                auth.login(response.data.token, response?.data?.user?.name);
                navigate('/');
            } else {
                setError('Invalid token received');
            }
        } catch (err) {
            setError(t('auth.googleLoginError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white shadow-2xl rounded-2xl p-10 border border-purple-100">
                <div className="text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-4xl font-extrabold text-purple-600 mb-4">
                            {t('auth.appName')}
                        </h2>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            {t('auth.welcome')}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {t('auth.loginPrompt')}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center mb-4">
                        {error}
                    </div>
                )}

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError(t('auth.googleLoginError'))}
                        useOneTap={false}
                        type="standard"
                    />
                </div>

                {loading && (
                    <div className="flex justify-center mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginPage;