import { useState } from "react";
import Navbar from "./layout/Navbar";
import SideBar from "./layout/SideBar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen">
      <Navbar toggleSidebar={toggleSidebar} />
      <SideBar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Main Content Area */}
      <main className="overflow-auto flex-1 pt-16 bg-cyan-50">{children}</main>
    </div>
  );
};

export default Layout;
