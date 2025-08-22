"use client";
import React, { useState } from 'react';
import { Mail, MessageCircle, User } from 'lucide-react';

// The main App component that contains the ContactUs form.
// In a real application, you would only export the ContactUs component.
// We are including it here to make the code runnable and self-contained.
export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <ContactUs />
      </div>
    </div>
  );
}

// The ContactUs component with a form and state management.
const ContactUs = () => {
  // State to hold the form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // State to handle form submission status and messages
  const [submissionStatus, setSubmissionStatus] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmissionStatus('loading');

    // Simulate an API call to a backend service
    setTimeout(() => {
      // In a real application, you would send formData to your server.
      // e.g., fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
      // For this example, we'll just log the data and show a success message.
      console.log('Form data submitted:', formData);
      setSubmissionStatus('success');
      
      // Optionally, clear the form after successful submission
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    }, 1500); // Simulate network delay
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
        Contact Us
      </h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Have a question or feedback about PDF Minify? Send us a message, and we'll get back to you as soon as we can!
      </p>

      {/* Conditional message based on submission status */}
      {submissionStatus === 'loading' && (
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg mb-6 w-full text-center">
          Sending your message...
        </div>
      )}
      {submissionStatus === 'success' && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 w-full text-center">
          Thank you! Your message has been sent.
        </div>
      )}

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {/* Name Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Your Name"
            required
          />
        </div>

        {/* Email Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Your Email"
            required
          />
        </div>

        {/* Message Textarea */}
        <div className="relative">
          <div className="absolute top-4 left-0 pl-3 flex items-center pointer-events-none">
            <MessageCircle className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Your Message"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

