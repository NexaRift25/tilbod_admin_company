import { Link, Outlet } from "react-router-dom";
import {
  Building2,
  LogOut,
  Home,
  LayoutDashboard,
  Users,
  Shield,
  BarChart3,
  Settings,
  FileText,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { Logo, MobileLogo } from "@/components/ui/Header";
import Navigation, { NavItem } from "@/components/ui/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Company Management",
      href: "/admin/companies",
      icon: Building2,
    },
    {
      name: "Offer Management",
      href: "/admin/offers",
      icon: FileText,
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]} requireVerification={true}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-banner-background border-b border-primary sticky top-0 z-40">
          {/* Mobile/Tablet Header */}
          <div className="flex lg:hidden items-center justify-between px-3 sm:px-4 py-3 sm:py-4">
            {/* Mobile Logo */}
            <Link to="/admin/dashboard" className="flex-shrink-0">
              <MobileLogo />
            </Link>

            {/* Mobile Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Home Icon */}
              <Link
                to="/"
                className="w-8 h-8 sm:w-10 sm:h-10 border border-primary rounded-lg flex items-center justify-center bg-transparent hover:bg-primary/10 transition-colors"
                title="Go to Home"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </Link>

              {/* Admin Icon */}
              <Link
                to="/admin/settings"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                title="Admin Settings"
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-dark" />
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-8 h-8 sm:w-10 sm:h-10 border border-red-500/50 rounded-lg flex items-center justify-center bg-transparent hover:bg-red-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              </button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block px-4 sm:px-6 lg:px-8">
            <div className="max-w-[130rem] mx-auto">
              {/* Top Row - Logo and Actions */}
              <div className="flex items-center justify-between py-4">
                <Link to="/">
                  <Logo />
                </Link>
                <div className="flex items-center gap-4">
                  <Link
                    to="/"
                    className="text-primary transition-colors p-2"
                    title="Go to Home"
                  >
                    <Home size={20} />
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="whitespace-nowrap flex items-center gap-3 font-semibold bg-primary text-dark px-4 py-1.5 rounded-3xl hover:bg-primary/90 transition-all"
                  >
                    Admin Panel
                    <span className="text-dark border border-dark rounded-full text-base">
                      <Shield size={16} />
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-primary hover:text-red-500 transition-colors p-2"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Component */}
        <Navigation navItems={navItems} />

        {/* Main Content */}
        <div className="lg:ml-64 pb-20 lg:pb-0">
          <Container className="max-w-[118.75rem] w-[95%] sm:w-[90%] lg:w-[85%] mx-auto">
            <main className="min-h-[calc(100vh-4rem)]">
              <div className="px-2 py-4 sm:px-4 sm:py-6 lg:p-8">
                <Outlet />
              </div>
            </main>
          </Container>
        </div>
      </div>
    </ProtectedRoute>
  );
}
