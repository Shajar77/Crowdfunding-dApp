import React from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Particles from "react-tsparticles";

const Footer = () => {
  return (
    <footer className="relative bg-black dark:bg-black text-white px-6 py-20 mt-32 text-gray-200 overflow-hidden z-10">
      {/* Particles Background */}
      <Particles
        id="tsparticles-footer"
        className="absolute inset-0 z-0"
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          particles: {
            number: { value: 50 },
            color: { value: "#00ffcc" },
            shape: { type: "circle" },
            opacity: { value: 0.3 },
            size: { value: { min: 1, max: 4 } },
            links: { enable: true, distance: 150, color: "#00ffcc" },
            move: { enable: true, speed: 1 },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
            modes: { repulse: { distance: 100 }, push: { quantity: 4 } },
          },
        }}
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 px-4 sm:px-0">
        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-sm space-y-4"
        >
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-transparent bg-clip-text font-epilogue">
            Fundverse
          </h2>
          <p className="text-lg text-gray-400">
            The future of funding is here. Empower ideas, back innovation, and fuel dreams with blockchain.
          </p>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm text-gray-300"
        >
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Company</h3>
            <ul className="space-y-2">
              {["About Us", "Blog", "Careers"].map((item, idx) => (
                <li key={idx}>
                  <a href="/" className="hover:text-green-400 transition duration-300 ease-in-out transform hover:scale-105">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Support</h3>
            <ul className="space-y-2">
              {["Help Center", "Terms", "Privacy"].map((item, idx) => (
                <li key={idx}>
                  <a href="/" className="hover:text-green-400 transition duration-300 ease-in-out transform hover:scale-105">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Follow Us</h3>
            <div className="flex space-x-6 text-2xl">
              <a
                href="https://facebook.com"
                className="hover:text-blue-500 transition-all duration-300 transform hover:scale-110"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                className="hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com"
                className="hover:text-blue-300 transition-all duration-300 transform hover:scale-110"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://instagram.com"
                className="hover:text-pink-500 transition-all duration-300 transform hover:scale-110"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Copyright */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-12 text-center text-xs text-gray-500 relative z-10"
      >
        <div className="text-sm text-gray-400">
          <p>A project by Tradewizzz</p>
        </div>
        <div className="text-xs mt-2">
          © {new Date().getFullYear()} FUNDVERSE. All rights reserved.
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
