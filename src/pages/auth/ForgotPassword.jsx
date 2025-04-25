import React, { useState } from 'react';
import { BiShow, BiHide } from 'react-icons/bi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Footer from '../components/common/Footer/Footer';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Password validation logic can be added here

        // Reset states after operations
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <motion.div
                    className="bg-white p-8 rounded-lg shadow-md space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-red-700">
                        Reset Your Password
                    </h2>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {/* Password Input */}
                        <div className="relative">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                New Password
                            </label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full py-2 border rounded-lg focus:outline-none focus:border-red-500"
                            />
                            {passwordError && (
                                <p className="text-red-600">{passwordError}</p>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute top-9 right-3 text-gray-600"
                            >
                                {showPassword ? <BiShow /> : <BiHide />}
                            </button>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full py-2 border rounded-lg focus:outline-none focus:border-red-500"
                            />
                            {confirmPasswordError && (
                                <p className="text-red-600">{confirmPasswordError}</p>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute top-9 right-3 text-gray-600"
                            >
                                {showConfirmPassword ? <BiShow /> : <BiHide />}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-between items-center">
                            <button
                                type="submit"
                                disabled={isLoading || !password || !confirmPassword}
                                className="bg-red-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPassword;