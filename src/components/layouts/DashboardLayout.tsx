
import { useState, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  ChevronLeft,
  ChevronRight, 
  LogOut, 
  Settings, 
  ShoppingBag, 
  Users, 
  LayoutDashboard,
  Menu,
  Package,
  ClipboardList,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout, hasRole } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  
  // Define navigation items based on user role
  const getNavItems = () => {
    const items = [];

    if (hasRole("sysadmin")) {
      items.push(
        { name: "Dashboard", href: "/sysadmin", icon: LayoutDashboard },
        { name: "Store Layout", href: "/sysadmin/layout", icon: Store },
        { name: "Icons & Images", href: "/sysadmin/icons", icon: Package },
        { name: "Labels & Text", href: "/sysadmin/labels", icon: ClipboardList },
        { name: "Settings", href: "/sysadmin/settings", icon: Settings },
      );
    } else if (hasRole("admin")) {
      items.push(
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Products", href: "/admin/products", icon: ShoppingBag },
        { name: "Orders", href: "/admin/orders", icon: ClipboardList },
        { name: "Employees", href: "/admin/employees", icon: Users },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      );
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-40 block lg:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="m-2" 
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu />
        </Button>
      </div>

      {/* Sidebar for desktop */}
      <aside 
        className={cn(
          "fixed inset-y-0 z-30 flex h-screen flex-col border-r bg-white transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          "hidden lg:flex"
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && (
            <span className="text-xl font-semibold text-gray-800">
              GrocerSync
            </span>
          )}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        {/* Sidebar content */}
        <nav className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex flex-col flex-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100",
                  collapsed ? "justify-center" : "justify-start"
                )}
              >
                <item.icon size={20} />
                {!collapsed && <span className="ml-4">{item.name}</span>}
              </Link>
            ))}
          </div>
          <div className="p-4">
            <Button 
              variant="ghost" 
              onClick={logout}
              className={cn(
                "flex w-full items-center text-gray-700",
                collapsed ? "justify-center px-2" : "justify-start px-4"
              )}
            >
              <LogOut size={20} />
              {!collapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </nav>
      </aside>

      {/* Mobile sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 flex-col border-r bg-white transition-all duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:hidden"
        )}
      >
        {/* Mobile sidebar header */}
        <div className="flex h-16 items-center justify-between px-4">
          <span className="text-xl font-semibold text-gray-800">
            GrocerSync
          </span>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
            <ChevronLeft size={20} />
          </Button>
        </div>

        {/* Mobile sidebar content */}
        <nav className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex flex-col flex-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={20} />
                <span className="ml-4">{item.name}</span>
              </Link>
            ))}
          </div>
          <div className="p-4">
            <Button 
              variant="ghost" 
              onClick={logout}
              className="flex w-full items-center justify-start px-4 text-gray-700"
            >
              <LogOut size={20} />
              <span className="ml-2">Logout</span>
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300",
        "lg:ml-64",
        collapsed && "lg:ml-16"
      )}>
        {/* User info bar */}
        <div className="bg-white border-b shadow-sm p-4 flex justify-between items-center">
          <div className="lg:ml-0 ml-8">
            <h1 className="text-xl font-semibold text-gray-800">
              {navItems.find(item => item.href === window.location.pathname)?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center">
            {user && (
              <div className="mr-4 text-right">
                <p className="font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
