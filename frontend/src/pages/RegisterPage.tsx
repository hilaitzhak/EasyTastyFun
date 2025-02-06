// import { useContext, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
// import { useTranslation } from 'react-i18next';
// import { authApi } from '../api/auth.api';
// import { AuthContext } from '../context/AuthContext';

// function RegisterPage() {
//     const { t } = useTranslation();
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const auth = useContext(AuthContext);

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const formData = new FormData(e.currentTarget);
//     const name = formData.get('name') as string;
//     const email = formData.get('email') as string;
//     const password = formData.get('password') as string;
//     const confirmPassword = formData.get('confirmPassword') as string;

//     if (password !== confirmPassword) {
//         setError(t('auth.passwordMismatch'));
//         setLoading(false);
//         return;
//     }

//     try {
//         const response = await authApi.registerUser({ name, email, password });
//         auth?.login(response.data.token);
//         navigate('/recipes');
//     } catch (err) {
//         setError(t('auth.registerError'));
//     } finally {
//         setLoading(false);
//     }
//     };

//     return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//             <h2 className="text-4xl font-bold text-gray-900 mb-2">
//             {t('auth.createAccount')}
//             </h2>
//             <p className="text-gray-600">
//             {t('auth.registerPrompt')}
//             </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//         <div className="rounded-2xl shadow-lg bg-white p-8 space-y-6">
//             {/* Name Field */}
//             <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                 {t('auth.name')}
//                 </label>
//                 <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     required
//                     className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                     placeholder={t('auth.namePlaceholder')}
//                 />
//                 </div>
//             </div>

//             {/* Email Field */}
//             <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 {t('auth.email')}
//                 </label>
//                 <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     required
//                     className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                     placeholder={t('auth.emailPlaceholder')}
//                 />
//                 </div>
//             </div>

//             {/* Password Field */}
//             <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 {t('auth.password')}
//                 </label>
//                 <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     required
//                     className="appearance-none relative block w-full pl-10 pr-12 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                     placeholder={t('auth.passwordPlaceholder')}
//                 />
//                 <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                 >
//                     {showPassword ? (
//                         <EyeOff className="h-5 w-5" />
//                     ) : (
//                         <Eye className="h-5 w-5" />
//                     )}
//                 </button>
//                 </div>
//             </div>

//             {/* Confirm Password Field */}
//             <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                 {t('auth.confirmPassword')}
//                 </label>
//                 <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     required
//                     className="appearance-none relative block w-full pl-10 pr-12 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                     placeholder={t('auth.confirmPasswordPlaceholder')}
//                 />
//                 <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                 >
//                     {showConfirmPassword ? (
//                         <EyeOff className="h-5 w-5" />
//                     ) : (
//                         <Eye className="h-5 w-5" />
//                     )}
//                 </button>
//                 </div>
//             </div>

//             {error && (
//                 <div className="text-red-500 text-sm text-center">
//                 {error}
//                 </div>
//             )}

//             <div>
//                 <button
//                 type="submit"
//                 disabled={loading}
//                 className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-medium transition-all disabled:opacity-50"
//                 >
//                 {loading ? t('common.loading') : t('auth.register')}
//                 </button>
//             </div>
//             </div>

//             <div className="text-center">
//             <span className="text-gray-600">
//                 {t('auth.haveAccount')}{' '}
//             </span>
//             <Link
//                 to="/login"
//                 className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
//             >
//                 {t('auth.login')}
//             </Link>
//             </div>
//         </form>
//         </div>
//     </div>
//     );
// }

// export default RegisterPage;