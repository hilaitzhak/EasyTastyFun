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
    // const [showPassword, setShowPassword] = useState(false);

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
    
    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError(null);

    //     const formData = new FormData(e.currentTarget);
    //     const email = formData.get('email') as string;
    //     const password = formData.get('password') as string;

    //     try {
    //     const response = await authApi.loginUser({ email, password });
    //     auth?.login(response.data.token);
    //     navigate('/');
    //     } catch (err) {
    //     setError(t('auth.loginError'));
    //     } finally {
    //     setLoading(false);
    //     }
    // };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {t('auth.welcome')}
                </h2>
                <p className="text-gray-600">
                    {t('auth.loginPrompt')}
                </p>
                </div>

                {/* <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-2xl shadow-lg bg-white p-8 space-y-6">
                        <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('auth.email')}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder={t('auth.emailPlaceholder')}
                            />
                        </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('auth.password')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="appearance-none relative block w-full pl-10 pr-12 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder={t('auth.passwordPlaceholder')}
                                />
                                <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                                </button>
                            </div>
                        </div>

                        {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                        )}

                        <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-medium transition-all disabled:opacity-50"
                        >
                            {loading ? t('common.loading') : t('auth.login')}
                        </button>
                        </div>
                    </div>

                    <div className="text-center">
                        <span className="text-gray-600">
                        {t('auth.noAccount')}{' '}
                        </span>
                        <Link
                        to="/register"
                        className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                        >
                        {t('auth.register')}
                        </Link>
                    </div>
                </form> */}

                {/* <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            {t('auth.orContinueWith')}
                        </span>
                    </div>
                </div> */}

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError(t('auth.googleLoginError'))}
                        useOneTap={false}
                        type="standard"
                    />
                </div>
            </div>
        </div>
    );
}

export default LoginPage;