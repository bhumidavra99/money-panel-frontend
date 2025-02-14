import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);
  return (
    <>
      <div className="min-h-screen bg-[#FAFBFE] flex flex-col">
        <Sidebar isOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="lg:ml-72 sticky top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <Navbar toggleSidebar={toggleSidebar} />
        </div>
        <div className="flex flex-1 overflow-hidden h-full md:min-h-[calc(100vh-100px)] min-h-[calc(100vh-120px)]">
          <main
            className={`overflow-y-auto md:px-6 px-4 w-full my-4 relative lg:ml-72 md:min-h-[calc(100vh-115px)] min-h-[calc(100vh-120px)] transition-opacity duration-300 md:pb-0 ${
              isSidebarOpen ? "opacity-50" : "opacity-100"
            }`}
          >
            {isSidebarOpen && (
              <div className="fixed inset-0 bg-black opacity-75 z-30"></div>
            )}
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default DefaultLayout;
