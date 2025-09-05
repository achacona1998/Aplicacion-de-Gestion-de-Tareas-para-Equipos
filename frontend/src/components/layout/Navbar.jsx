import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout, getCurrentUser } from "../../services/auth";
import NotificationMenu from "../NotificationMenu";
import MessageMenu from "../MessageMenu";
import { List, Menu } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setUser(user);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-500 shadow-md text-white flex fixed z-50 justify-between items-center w-full h-16 px-5">
      {/* Logo and app name */}
      <Link to="/" className="flex items-center gap-1">
        <List className="h-9 w-9" />
        <span className="text-3xl font-bold">TaskFlow</span>
      </Link>

      {/* User menu and icons */}
      <div className="flex items-center md:gap-4 gap-2">
        <NotificationMenu />
        <MessageMenu />
        <div className="relative hidden md:flex">
          {/* User button and dropdown */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 hover:text-gray-900">
            <div className="h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center text-white font-medium">
              {user ? user.username.substring(0, 2).toUpperCase() : "US"}
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="hidden md:inline-block  text-md font-semibold">
                {user ? user.full_name : "Usuario"}
              </span>
              <span className="hidden md:inline-block font-medium">
                {user ? user.role : "Usuario"}
              </span>
            </div>
          </button>

          {/* Menú desplegable de usuario */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowUserMenu(false)}>
                Mi Perfil
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setShowUserMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden w-8 h-8 flex items-center justify-center"
          aria-label="Toggle sidebar menu">
          <Menu className="w-8 h-8" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
