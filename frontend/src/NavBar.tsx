import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Reference for dropdown

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  // Attach and clean up the event listener for clicking outside the dropdown
  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="dark:bg-gray-800 text-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section - Home and About */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/")}
            className="text-slate-200 font-bold font-roboto text-xl hover:text-blue-500 transition duration-300"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/about")}
            className="text-slate-200 font-bold font-roboto text-xl hover:text-blue-500 transition duration-300"
          >
            About
          </button>
        </div>

        {/* Center Section - Title */}
        <div className="text-slate-200 absolute left-1/2 transform -translate-x-1/2 text-4xl font-bold hover:text-blue-500 transition duration-300 cursor-pointer">
          <h1>Tarkov Randomizer</h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
