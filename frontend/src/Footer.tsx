import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer: React.FC = () => {
    return (
        <footer className="bg-white shadow dark:bg-gray-800 w-full">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                              <a
                                href="https://github.com/Josh-Harrison1600/Tarkov-Randomizer"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-roboto hover:text-blue-500 transition duration-300 flex items-center"
                              >
                                <FaGithub className="w-6 h-6 mr-2" />
                                Star on GitHub!
                              </a>
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="https://www.joshharrison.ca/" className="hover:underline me-4 md:me-6">About</a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
