import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  FileText,
  Shield,
  RotateCcw,
  Search,
  IdCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { asset } from "../utils/asset";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Terms", path: "/terms", icon: FileText },
    { name: "Privacy Policy", path: "/privacy-policy", icon: Shield },
    { name: "Refund Policy", path: "/refund-policy", icon: RotateCcw },
    { name: "Search Bookings", path: "/search", icon: Search },
    { name: "Membership", path: "/membership", icon: IdCard },
  ];

  const handleLinkClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-green-900 via-emerald-800 to-green-700 text-white shadow-xl backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Brand */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleLinkClick("/")}
            >
              <img
                src={asset("/Screenshot 2025-08-13 at 7.23.04 PM.png")}
                alt="Club Skyshot Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full"
              />
              <div className="flex flex-col leading-tight">
                <div className="text-sm sm:text-lg font-bold tracking-wide bg-gradient-to-r from-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                  Club Skyshot
                </div>
                <div className="text-[9px] sm:text-xs text-yellow-200/80 font-medium -mt-0.5">
                  The Luxury Pickle Zone
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-6 flex items-center space-x-1">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <button
                      key={link.name}
                      onClick={() => handleLinkClick(link.path)}
                      className="group relative px-3 py-2 rounded-lg text-white hover:text-yellow-300 transition-all duration-200 hover:bg-green-800/40 flex items-center space-x-2"
                    >
                      <IconComponent size={18} />
                      <span className="font-medium">{link.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg hover:bg-green-800/40"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Slide-out panel */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-gradient-to-b from-green-900 via-emerald-800 to-green-700 shadow-2xl transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header with Branding */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-400/20">
            <div className="flex items-center space-x-2">
              <img
                src={asset("/Screenshot 2025-08-13 at 7.23.04 PM.png")}
                alt="Club Skyshot Logo"
                className="w-8 h-8 object-contain rounded-full"
              />
              <div className="flex flex-col leading-tight">
                <div className="text-sm font-bold bg-gradient-to-r from-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                  Club Skyshot
                </div>
                <div className="text-[9px] text-yellow-200/80 font-medium">
                  The Luxury Pickle Zone
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={24} className="text-yellow-300" />
            </button>
          </div>

          {/* Drawer Links */}
          <nav className="px-4 py-6 space-y-2">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.path)}
                  className="flex items-center w-full px-4 py-3 rounded-lg text-left text-white hover:bg-green-800/40 hover:text-yellow-300"
                >
                  <IconComponent size={20} className="mr-3" />
                  {link.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
