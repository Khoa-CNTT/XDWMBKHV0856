import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTwitter,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  const socialLinks = [
    { icon: <FaFacebook />, href: "#", label: "Facebook" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
    { icon: <FaYoutube />, href: "#", label: "YouTube" },
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
  ];

  const quickLinks = [
    { name: "Courses", href: "#" },
    { name: "About Us", href: "#" },
    { name: "Instructors", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <footer className="bg-secondary text-foregroundpy-12 transition-colors duration-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl text-primary font-heading mb-4">
              {import.meta.env.VITE_APP_NAME}
            </h3>
            <p className="text-accent-foreground mb-4">
              Empowering learners worldwide with quality online education.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-accent hover:text-primary transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-heading mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <a
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-heading mb-4">Contact Us</h3>
            <div className="space-y-3">
              <p className="flex items-center">
                <FaPhone className="mr-2" /> +84 (984) 123-456
              </p>
              <p className="flex items-center">
                <FaEnvelope className="mr-2" /> support@vlearning.edu.vn
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2" /> 123 Learning Street,
                Education City, 12345
              </p>
            </div>
          </div>

          {/* Newsletter & Settings */}
          <div>
            <h3 className="text-xl font-heading mb-4">Stay Updated</h3>
            <form onSubmit={handleNewsletterSubmit} className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l text-foreground bg-card border border-input focus:outline-none focus:border-primary"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-r hover:bg-opacity-90 transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-accent-foreground">
              © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}. All
              rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
