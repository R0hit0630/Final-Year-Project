import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold">
          Travolin
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-gray-200 transition">
            Home
          </Link>
          <Link to="/destinations" className="hover:text-gray-200 transition">
            Destinations
          </Link>
          <Link to="/packages" className="hover:text-gray-200 transition">
            Packages
          </Link>
          <Link to="/about" className="hover:text-gray-200 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-gray-200 transition">
            Contact
          </Link>
          <Link to="/profile" className="hover:text-gray-200 transition">
            Profile
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-600 px-6 pb-4 space-y-2">
          <Link to="/" className="block hover:text-gray-200 transition">
            Home
          </Link>
          <Link
            to="/destinations"
            className="block hover:text-gray-200 transition"
          >
            Destinations
          </Link>
          <Link
            to="/packages"
            className="block hover:text-gray-200 transition"
          >
            Packages
          </Link>
          <Link to="/about" className="block hover:text-gray-200 transition">
            About
          </Link>
          <Link
            to="/contact"
            className="block hover:text-gray-200 transition"
          >
            Contact
          </Link>
          <Link to="/profile" className="block hover:text-gray-200 transition">
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;