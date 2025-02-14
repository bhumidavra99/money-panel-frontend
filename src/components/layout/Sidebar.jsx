import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, setSidebarOpen }) => {
  const navigate = useNavigate()
  const menuItems = [
    { label: "Dashboard", path: "/dashboard"|| "/" },
    { label: "Portals", path: "/portal" },
    { label: "Report", path: "/report" },
    { label: "Add Customer", path: "/add-customer" },
    { label: "Account", path: "/account" },
    { label: "Expenses", path: "/expenses" },
    { label: "Debit", path: "/debit" },
    { label: "Credit", path: "/credit" },
    { label: "Financial Summary", path: "/financial-summary" },
  ];
  const sidebarRef = useRef(null);
  const { pathname } = useLocation();
  const isMainItemActive = (path) => pathname === path;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSidebarOpen]);

  const handleLinkClick = (e) => {
    if (e.target.closest("li").querySelector("ul")) {
      e.stopPropagation();
    } else {
      setSidebarOpen(false);
    }
  };

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 z-40 w-72 bg-white border-r shadow-md transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 h-full transition-transform duration-300 ease-in-out`}
    >
      <div
        className="flex flex-col flex-1 overflow-y-auto custom-scrollbar z-40 h-full"
      >
             <div className="flex justify-center h-[80px] items-center w-full cursor-pointer border-b" onClick={()=>navigate("/")}>
            <p className="text-lg lg:text-3xl font-semibold text-gray-800 mb-4" style={{ fontFamily: "Noto Nastaliq Urdu" }}>
              Shreenathji
            </p>
          </div>
        <nav className="ps-4 pe-2 mt-4">
          <ul className="space-y-1 mb-0">
            {menuItems.map(({ label, path }) => (
              <li key={path || label}>
                <div>
                  <Link
                    to={path}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg text-md font-medium transition-colors ${
                      isMainItemActive(path)
                        ? "bg-[#EB8844] text-white hover:text-white"
                        : "text-gray-700 hover:text-gray-900 hover:bg-orange-100"
                    }`}
                    onClick={(e) => {
                      handleLinkClick(e);
                    }}
                  >
                    {label}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
