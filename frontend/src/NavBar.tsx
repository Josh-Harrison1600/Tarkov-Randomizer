import React, { useState, useEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa";

const Navbar: React.FC = () => {
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
        {/* Left Section - GitHub Icon */}
        <div className="flex space-x-4">
          <a
            href="https://github.com/Josh-Harrison1600/Tarkov-Randomizer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-200 font-bold font-roboto text-xl hover:text-blue-500 transition duration-300 flex items-center"
          >
            <FaGithub className="w-6 h-6 mr-2" />
            GitHub
          </a>
        </div>

        {/* Center Section - Title */}
        <div className="text-slate-200 absolute left-1/2 transform -translate-x-1/2 text-4xl font-bold hover:text-blue-500 transition duration-300 cursor-pointer">
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">
            <h1>Tarkov Randomizer</h1>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
