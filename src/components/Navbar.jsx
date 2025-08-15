import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Terms", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Refund Policy", path: "/refund-policy" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">
          Club Skyshot
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="hover:text-yellow-400 transition"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-emerald-900 to-green-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-green-700">
          <div className="text-lg font-semibold">Menu</div>
          <button onClick={() => setIsOpen(false)}>
            <X size={28} />
          </button>
        </div>
        <ul className="flex flex-col space-y-4 mt-6 px-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="block hover:text-yellow-400 transition"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
}
