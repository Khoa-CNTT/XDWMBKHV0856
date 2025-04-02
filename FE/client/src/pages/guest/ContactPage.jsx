import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiClock, FiMapPin } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { sendUsMessageSchema } from "../../utils/validator";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(sendUsMessageSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 my-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-accent max-w-2xl mx-auto">
            We're here to help! Send us your questions or concerns and we'll get
            back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-lg p-8 shadow-sm"
          >
            <h2 className="text-2xl font-semibold mb-6 text-foreground">
              Get in Touch
            </h2>

            <div className="space-y-6">
              <div className="flex items-center">
                <FiMapPin className="text-primary w-6 h-6 mr-4" />
                <div>
                  <h3 className="font-medium text-foreground">Address</h3>
                  <p className="text-accent">
                    123 Learning Street, Education City, EC 12345
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <FiMail className="text-primary w-6 h-6 mr-4" />
                <div>
                  <h3 className="font-medium text-foreground">Email</h3>
                  <p className="text-accent">support@learningplatform.com</p>
                </div>
              </div>

              <div className="flex items-center">
                <FiPhone className="text-primary w-6 h-6 mr-4" />
                <div>
                  <h3 className="font-medium text-foreground">Phone</h3>
                  <p className="text-accent">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center">
                <FiClock className="text-primary w-6 h-6 mr-4" />
                <div>
                  <h3 className="font-medium text-foreground">
                    Business Hours
                  </h3>
                  <p className="text-accent">
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-medium text-foreground mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-accent hover:text-primary transition-colors"
                >
                  <FaFacebook className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-accent hover:text-primary transition-colors"
                >
                  <FaTwitter className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-accent hover:text-primary transition-colors"
                >
                  <FaLinkedin className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-accent hover:text-primary transition-colors"
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-lg p-8 shadow-sm"
          >
            <h2 className="text-2xl font-semibold mb-6 text-foreground">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  {...register("fullName")}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.fullName ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  {...register("email")}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.email ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  {...register("phone")}
                  className={`w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.phone ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="inquiryType"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Inquiry Type *
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  {...register("inquiryType")}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.inquiryType ? "border-destructive" : "border-input"
                  }`}
                >
                  <option value="">Select an option</option>
                  <option value="course">Course Information</option>
                  <option value="technical">Technical Support</option>
                  <option value="pricing">Pricing Inquiry</option>
                  <option value="other">Other</option>
                </select>
                {errors.inquiryType && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.inquiryType.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  {...register("message")}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.message ? "border-destructive" : "border-input"
                  }`}
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {submitStatus === "success" && (
                <p className="text-center text-green-600">
                  Message sent successfully!
                </p>
              )}

              {submitStatus === "error" && (
                <p className="text-center text-destructive">
                  Failed to send message. Please try again.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
