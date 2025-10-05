import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePost } from '../../Hooks/usePost';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../../Context/Auth';
import mainLogo from '../../assets/Images/mainLogo.png';

const Login = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const auth = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    // API hooks
    const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/user/login` });

    useEffect(() => {
        if (response && response.data && response.status === 200 && !loadingPost) {
            auth.login(response.data?.user);
            navigate('/courses', { replace: true });
        }}, [response]);

    // Validate email format
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validation
        const newErrors = {};
        if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        const credentials = { email, password };
        postData(credentials);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 md:p-8">
            {/* Logo in top-left corner */}
            <img 
                src={mainLogo} 
                alt="Maths House Logo" 
                className="absolute top-4 left-4 h-12 md:h-16 object-contain"
            />
            
            <div className="relative max-w-7xl w-full flex rounded-3xl overflow-hidden">
                {/* Left side - Form */}
                <div className="w-full md:w-3/5 p-6 md:p-12 flex flex-col justify-center">
                    <div className="text-center mb-8 animate-fade-in">
                        <h1 className="text-3xl md:text-4xl font-bold text-mainColor mb-2">Login to Maths House</h1>
                        <p className="text-mainColor/80 text-lg">Welcome Back!</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.email ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor outline-none transition duration-300 bg-gray-50 hover:bg-white`}
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-red-500 animate-pulse">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.password ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor outline-none transition duration-300 bg-gray-50 hover:bg-white`}
                                />
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-500 animate-pulse">{errors.password}</p>}
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                className="text-sm text-mainColor hover:text-secondColor font-medium transition-colors duration-200"
                                onClick={() => navigate('/forget_password')}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {errors.general && (
                            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm animate-fade-in">
                                {errors.general}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-mainColor hover:bg-secondColor text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center shadow-md hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-70"
                            disabled={loadingPost}
                        >
                            {loadingPost ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </>
                            ) : 'Login'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-mainColor hover:text-secondColor font-medium transition-colors duration-200">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right side - Logo (hidden on small screens) */}
                <div className="hidden md:flex w-2/5 bg-gradient-to-br from-mainColor to-secondColor items-center justify-center">
                    <img 
                        src={mainLogo} 
                        alt="Maths House Logo" 
                        className="w-3/4 max-w-md object-contain animate-float"
                    />
                </div>
            </div>

            {/* Tailwind animation classes */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease forwards;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;