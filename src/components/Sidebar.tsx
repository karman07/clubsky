import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/contexts/navLinks";
import { COLORS } from "@/constants/colors";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState<{ name: string; email: string; image?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const renderLinks = (isMobile = false) =>
    NAV_LINKS.map(({ name, to, icon: Icon }) => {
      const isActive = location.pathname === to;

      return (
        <Link
          key={to}
          to={to}
          onClick={() => isMobile && setIsOpen(false)}
          className={`flex items-center px-4 py-3 font-medium space-x-2 relative transition-all ${
            isActive ? "border-l-4" : ""
          }`}
          style={{
            backgroundColor: isActive ? COLORS.activeBg : COLORS.white,
            color: isActive ? COLORS.activeText : COLORS.grayText,
            borderLeftColor: isActive ? COLORS.activeText : "transparent",
          }}
        >
          <Icon className="w-5 h-5" />
          <span>{name}</span>
        </Link>
      );
    });

  const userName = user?.name || "Admin";
  const userEmail = user?.email || "admin@food.com";
  const userImage = user?.image || "https://avatar.iran.liara.run/public";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col z-10 shadow-md"
        style={{
          backgroundColor: COLORS.white,
          borderRight: `1px solid ${COLORS.grayText}20`,
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: `${COLORS.grayText}20` }}>
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="flex-1 overflow-y-auto">{renderLinks()}</nav>
        <div
          className="p-4 border-t flex items-center"
          style={{ borderColor: `${COLORS.grayText}20` }}
        >
          <img src={userImage} alt="User" className="w-10 h-10 rounded-full" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{userName}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-gray-800 text-gray-100"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-20 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Sidebar */}
          <aside
            className="relative w-64 h-full bg-white shadow-lg z-30 flex flex-col"
            style={{
              backgroundColor: COLORS.white,
            }}
          >
            <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: `${COLORS.grayText}20` }}>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <button
                className="p-1 text-gray-600"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto">{renderLinks(true)}</nav>
            <div
              className="p-4 border-t flex items-center"
              style={{ borderColor: `${COLORS.grayText}20` }}
            >
              <img src={userImage} alt="User" className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
