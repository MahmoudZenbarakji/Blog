import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/home" className="text-2xl font-bold text-blue-600">
          <img src="/WhatsApp Image 2025-11-16 at 11.42.30 PM.jpeg" width={200} alt="" />
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center space-x-6">

          <Link
            to="/home"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Home
          </Link>

          <Link
            to="/profile"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Profile
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Nav;
