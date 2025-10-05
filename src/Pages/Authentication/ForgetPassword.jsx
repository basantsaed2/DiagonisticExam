import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePost } from "../../Hooks/usePost";
import { 
    FaEnvelope, 
    FaKey, 
    FaLock, 
    FaArrowLeft, 
    FaSpinner 
} from "react-icons/fa";
import mainLogo from '../../assets/Images/mainLogo.png';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // State for different steps
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // API hooks
    const { postData: postEmail, loadingPost: loadingEmail, response: responseEmail } = usePost({ url: `${apiUrl}/user/forget_password` });
    const { postData: postCode, loadingPost: loadingCode, response: responseCode } = usePost({ url: `${apiUrl}/user/confirm_code` });
    const { postData: postUpdatedPassword, loadingPost: loadingUpdatedPassword, response: responseUpdatedPassword } = usePost({ url: `${apiUrl}/user/update_password` });

    // Handle responses
    useEffect(() => {
        if (responseEmail && responseEmail.status === 200) {
            setStep(2); // Move to OTP step
            setSuccessMessage('OTP sent to your email successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    }, [responseEmail]);

    useEffect(() => {
        if (responseCode && responseCode.status === 200) {
            setStep(3); // Move to password reset step
            setSuccessMessage('OTP verified successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    }, [responseCode]);

    useEffect(() => {
        if (responseUpdatedPassword && responseUpdatedPassword.status === 200) {
            setSuccessMessage('Password updated successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    }, [responseUpdatedPassword]);

    // Validation functions
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6; // Minimum 6 characters
    };

    // Step 1: Send email to get OTP
    const handleSendEmail = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!validateEmail(email)) {
            setErrors({ email: 'Please enter a valid email address' });
            return;
        }

        const emailData = { user: email };
        postEmail(emailData);
    };

    // Step 2: Verify OTP
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!code || code.length !== 6) {
            setErrors({ code: 'Please enter a valid 6-digit OTP' });
            return;
        }

        const codeData = { user: email, code: code };
        postCode(codeData);
    };

    // Step 3: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        
        if (!validatePassword(newPassword)) {
            newErrors.newPassword = 'Password must be at least 6 characters long';
        }
        
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const passwordData = {
            user: email,
            code: code,
            password: newPassword,
        };
        
        postUpdatedPassword(passwordData);
    };

    const handleBackToLogin = () => {
        navigate('/');
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            setCode('');
        } else if (step === 3) {
            setStep(2);
            setNewPassword('');
            setConfirmPassword('');
        }
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
                    {/* Back button */}
                    <button
                        onClick={step === 1 ? handleBackToLogin : handleBack}
                        className="flex items-center text-mainColor hover:text-secondColor mb-6 transition-colors duration-200"
                    >
                        <FaArrowLeft className="mr-2" />
                        {step === 1 ? 'Back to Login' : 'Back'}
                    </button>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-mainColor mb-2">
                            {step === 1 && 'Reset Password'}
                            {step === 2 && 'Enter OTP'}
                            {step === 3 && 'New Password'}
                        </h1>
                        <p className="text-mainColor/80 text-lg">
                            {step === 1 && 'Enter your email to receive OTP'}
                            {step === 2 && 'Enter the 6-digit code sent to your email'}
                            {step === 3 && 'Enter your new password'}
                        </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center">
                            {[1, 2, 3].map((stepNumber) => (
                                <React.Fragment key={stepNumber}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        step >= stepNumber 
                                            ? 'bg-mainColor text-white' 
                                            : 'bg-gray-200 text-gray-400'
                                    }`}>
                                        {stepNumber}
                                    </div>
                                    {stepNumber < 3 && (
                                        <div className={`w-12 h-1 mx-2 ${
                                            step > stepNumber 
                                                ? 'bg-mainColor' 
                                                : 'bg-gray-200'
                                        }`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm mb-4">
                            {successMessage}
                        </div>
                    )}

                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <form onSubmit={handleSendEmail} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                                            errors.email ? 'border-red-400' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor outline-none transition duration-300 bg-gray-50 hover:bg-white`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loadingEmail}
                                className="w-full bg-mainColor hover:bg-secondColor text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center shadow-md hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-70"
                            >
                                {loadingEmail ? (
                                    <>
                                        <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Sending OTP...
                                    </>
                                ) : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Input */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Verification Code
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaKey className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="Enter 6-digit code"
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                                            errors.code ? 'border-red-400' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor outline-none transition duration-300 bg-gray-50 hover:bg-white text-center tracking-widest`}
                                        maxLength={6}
                                    />
                                </div>
                                {errors.code && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.code}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500 mt-2">
                                    Code sent to: {email}
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loadingCode}
                                className="w-full bg-mainColor hover:bg-secondColor text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center shadow-md hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-70"
                            >
                                {loadingCode ? (
                                    <>
                                        <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Verifying...
                                    </>
                                ) : 'Verify Code'}
                            </button>
                        </form>
                    )}

                    {/* Step 3: New Password Input */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                                            errors.newPassword ? 'border-red-400' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor outline-none transition duration-300 bg-gray-50 hover:bg-white`}
                                    />
                                </div>
                                {errors.newPassword && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.newPassword}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                                            errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor outline-none transition duration-300 bg-gray-50 hover:bg-white`}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loadingUpdatedPassword}
                                className="w-full bg-mainColor hover:bg-secondColor text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center shadow-md hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-70"
                            >
                                {loadingUpdatedPassword ? (
                                    <>
                                        <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Updating...
                                    </>
                                ) : 'Reset Password'}
                            </button>
                        </form>
                    )}
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
        </div>
    );
};

export default ForgetPassword;