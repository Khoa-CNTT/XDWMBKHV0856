import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const ChangePasswordForm = () => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.oldPassword) {
            newErrors.oldPassword = "Please enter your current password";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "Please enter a new password";
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = "Password must be at least 6 characters long";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess("");

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setSuccess("Password changed successfully!");
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setIsSubmitting(false);
        }, 1500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className="max-w-[950px] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-lg shadow-sm">
                <div>
                    <h2 className="text-heading font-heading text-center text-foreground">Change Password</h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Old Password Field */}
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-foreground">
                                Current Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="oldPassword"
                                    name="oldPassword"
                                    type={showPassword.old ? "text" : "password"}
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-input rounded-sm placeholder-accent focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-accent hover:text-foreground"
                                    onClick={() => togglePasswordVisibility("old")}
                                >
                                    {showPassword.old ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                </button>
                            </div>
                            {errors.oldPassword && (
                                <p className="mt-2 text-sm text-destructive">{errors.oldPassword}</p>
                            )}
                        </div>

                        {/* New Password Field */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-foreground">
                                New Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPassword.new ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-input rounded-sm placeholder-accent focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-accent hover:text-foreground"
                                    onClick={() => togglePasswordVisibility("new")}
                                >
                                    {showPassword.new ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="mt-2 text-sm text-destructive">{errors.newPassword}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                                Confirm New Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword.confirm ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-input rounded-sm placeholder-accent focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-accent hover:text-foreground"
                                    onClick={() => togglePasswordVisibility("confirm")}
                                >
                                    {showPassword.confirm ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-destructive">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    {success && (
                        <div className="rounded-sm bg-chart-2/20 p-3">
                            <p className="text-sm text-chart-2">{success}</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isSubmitting ? "Changing Password..." : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordForm;