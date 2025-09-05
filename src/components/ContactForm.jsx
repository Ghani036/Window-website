import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    email: "",
    projectName: "",
    description: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // You can add actual form submission logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl font-bold text-white text-center mb-4 font-avenir"
        >
          CONTACT
        </motion.h1>

        {/* Horizontal Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full h-px bg-white mb-6"
        />

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg text-white text-center mb-8 font-avenir"
        >
          LET'S SHARE A WINDOW
        </motion.h2>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onSubmit={handleSubmit}
          className="space-y-8 w-full"
        >
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-white text-lg font-avenir mb-3">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm text-lg"
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Project Name Field */}
          <div>
            <label htmlFor="projectName" className="block text-white text-lg font-avenir mb-3">
              Project's Name :
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm text-lg"
              placeholder="Your project name"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-white text-lg font-avenir mb-3">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm resize-none text-lg"
              placeholder="Tell us about your project..."
              required
            />
          </div>

          {/* Send Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 bg-white/5 border border-white/20 rounded-lg text-white font-avenir font-medium hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-lg"
          >
            Send
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
