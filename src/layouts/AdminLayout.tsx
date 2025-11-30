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
  DollarSign,
  Calendar,
  Tag,
  FolderOpen,
  Package,
  TrendingUp,
  CreditCard,
  FileText,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { Logo, MobileLogo } from "@/components/ui/Header";
import Navigation, { NavItem } from "@/components/ui/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function AdminLayout() {
  const { logout } = useAuth();
  const { t } = useTranslation();

  const navItems: NavItem[] = useMemo(
    () => [
      {
        name: t("adminSidebar.nav.dashboard"),
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: t("adminSidebar.nav.approval"),
        href: "/admin/approval-queue",
        icon: Shield,
        badge: t("adminSidebar.badges.approval"),
      },
      {
        name: t("adminSidebar.nav.companies"),
        href: "/admin/companies",
        icon: Building2,
      },
      {
        name: t("adminSidebar.nav.offers"),
        href: "/admin/offers",
        icon: Tag,
      },
      {
        name: t("adminSidebar.nav.users"),
        href: "/admin/users",
        icon: Users,
      },
      {
        name: t("adminSidebar.nav.commission"),
        href: "/admin/commission-pricing",
        icon: DollarSign,
      },
      {
        name: t("adminSidebar.nav.paymentHistory"),
        href: "/admin/payment-history",
        icon: CreditCard,
      },
      {
        name: t("adminSidebar.nav.invoiceHistory"),
        href: "/admin/invoice-history",
        icon: FileText,
      },
      {
        name: t("adminSidebar.nav.analytics"),
        href: "/admin/analytics",
        icon: BarChart3,
      },
      // {
      //   name: t("adminSidebar.nav.events"),
      //   href: "/admin/events-seasons",
      //   icon: Calendar,
      // },
      {
        name: t("adminSidebar.nav.categories"),
        href: "/admin/categories",
        icon: FolderOpen,
      },
      {
        name: t("adminSidebar.nav.productCategories"),
        href: "/admin/product-categories",
        icon: Package,
      },
      // {
      //   name: t("adminSidebar.nav.discountLabels"),
      //   href: "/admin/discount-labels",
      //   icon: Tag,
      // },
      // {
      //   name: t("adminSidebar.nav.targetedDiscounts"),
      //   href: "/admin/targeted-discounts",
      //   icon: Target,
      // },
      {
        name: t("adminSidebar.nav.financial"),
        href: "/admin/financial",
        icon: TrendingUp,
      },
      {
        name: t("adminSidebar.nav.settings"),
        href: "/admin/settings",
        icon: Settings,
      },
    ],
    [t]
  );

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
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Home Icon */}
              <Link
                to="/"
                className="w-8 h-8 sm:w-10 sm:h-10 border border-primary rounded-lg flex items-center justify-center bg-transparent hover:bg-primary/10 transition-colors"
                title={t("adminSidebar.actions.goHome")}
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </Link>

              {/* Admin Icon */}
              <Link
                to="/admin/settings"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                title={t("adminSidebar.actions.settings")}
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-dark" />
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-8 h-8 sm:w-10 sm:h-10 border border-red-500/50 rounded-lg flex items-center justify-center bg-transparent hover:bg-red-500/10 transition-colors"
                title={t("adminSidebar.actions.logout")}
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
                  <LanguageSwitcher />
                  <Link
                    to="/"
                    className="text-primary transition-colors p-2"
                    title={t("adminSidebar.actions.goHome")}
                  >
                    <Home size={20} />
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="whitespace-nowrap flex items-center gap-3 font-semibold bg-primary text-dark px-4 py-1.5 rounded-3xl hover:bg-primary/90 transition-all"
                  >
                    {t("adminSidebar.actions.panelButton")}
                    <span className="text-dark border border-dark rounded-full text-base">
                      <Shield size={16} />
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-primary hover:text-red-500 transition-colors p-2"
                    title={t("adminSidebar.actions.logout")}
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
          <Container className="max-w-[118.75rem] mx-auto">
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
