import { Link } from "react-router-dom";
import { isAdmin } from "../../services/auth";
import {
  Home,
  ListEnd,
  Table,
  ChartBar,
  Users,
  Calendar,
  Bell,
  MessageCircle,
  Settings,
} from "lucide-react";

const SideBar = ({ sidebarOpen, toggleSidebar }) => {
  const linksAdmin = [
    {
      icon: <Home />,
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      icon: <ListEnd />,
      name: "Tareas",
      link: "/tasks",
    },
    {
      icon: <Table />,
      name: "Tablero Kanban",
      link: "/kanban",
    },
    {
      icon: <ChartBar />,
      name: "Diagrama Gantt",
      link: "/gantt",
    },
    {
      icon: <Users />,
      name: "Equipos",
      link: "/team",
    },
    {
      icon: <Calendar />,
      name: "Calendario",
      link: "/calendar",
    },
    {
      icon: <Bell />,
      name: "Notificaciones",
      link: "/notifications",
    },
    {
      icon: <MessageCircle />,
      name: "Mensajes",
      link: "/messages",
    },
    {
      icon: <Settings />,
      name: "Configuracion",
      link: "/settings",
    },
  ];
  const links = [
    {
      icon: <Home />,
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      icon: <ListEnd />,
      name: "Mis Tareas",
      link: "/tasks",
    },
    {
      icon: <Table />,
      name: "Tablero Kanban",
      link: "/kanban",
    },
    {
      icon: <ChartBar />,
      name: "Diagrama Gantt",
      link: "/gantt",
    },
    {
      icon: <Users />,
      name: "Equipo",
      link: "/team",
    },
    {
      icon: <Calendar />,
      name: "Calendario",
      link: "/calendar",
    },
    {
      icon: <Bell />,
      name: "Notificaciones",
      link: "/notifications",
    },
    {
      icon: <MessageCircle />,
      name: "Mensajes",
      link: "/messages",
    },
    {
      icon: <Settings />,
      name: "Configuracion",
      link: "/settings",
    },
  ];

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`md:flex flex-col justify-between p-7 w-fit pt-20 bg-white fixed top-0 left-0 h-full shadow-lg z-40 transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0 flex" : "-translate-x-full"
          } md:translate-x-0 md:static md:shadow-none `}>
        <nav className="space-y-3">
          {(isAdmin() ? linksAdmin : links).map((item, index) => (
            <Link
              key={index}
              to={item.link}
              onClick={() => sidebarOpen && toggleSidebar()}
              className="p-2 w-full text-left rounded hover:bg-blue-800 flex items-center justify-start gap-2">
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        {/* <Alert /> */}
      </aside>
    </>
  );
};

export default SideBar;
