import { 
  Building2, 
  Tag, 
  ShoppingCart, 
  Clock, 
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CompanyDashboardPage() {
  const { user, companies } = useAuth();
  const { t } = useTranslation();

  const stats = [
    {
      name: t("dashboard.totalCompanies"),
      value: companies.length.toString(),
      max: "10",
      icon: Building2,
      change: `${companies.length}/10`,
      changeType: "neutral",
    },
    {
      name: t("dashboard.activeOffers"),
      value: "12",
      icon: Tag,
      change: t("dashboard.thisWeek", { count: 3 }),
      changeType: "positive",
    },
    {
      name: t("dashboard.totalSales"),
      value: "234,500 kr.",
      icon: ShoppingCart,
      change: t("dashboard.change", { percent: 18 }),
      changeType: "positive",
    },
    {
      name: t("dashboard.pendingApprovals"),
      value: "3",
      icon: Clock,
      change: t("dashboard.companiesAndOffers", { companies: 2, offers: 1 }),
      changeType: "warning",
    },
  ];

  const pendingItems = [
    {
      id: 1,
      type: t("common.company"),
      name: "Hotel Aurora",
      status: "pending",
      submittedAt: t("dashboard.submitted", { time: "2 hours ago" }),
    },
    {
      id: 2,
      type: t("common.company"),
      name: "Blue Lagoon Spa",
      status: "revision",
      submittedAt: t("dashboard.submitted", { time: "1 day ago" }),
      revisionCount: 1,
    },
    {
      id: 3,
      type: t("offerTypes.offer"),
      name: "Weekend Getaway Package",
      status: "pending",
      submittedAt: t("dashboard.submitted", { time: "30 minutes ago" }),
    },
  ];

  const quickActions = [
    {
      title: companies.length < 10 ? t("dashboard.registerNewCompany") : t("dashboard.companyLimitReached"),
      description: companies.length < 10 
        ? t("dashboard.addCompanyDescription")
        : t("dashboard.maxCompaniesReached"),
      buttonText: companies.length < 10 ? t("dashboard.registerCompany") : t("dashboard.viewCompanies"),
      href: companies.length < 10 ? "/company/companies/new" : "/company/companies",
      disabled: companies.length >= 10,
      color: "primary",
    },
    {
      title: t("dashboard.createNewOffer"),
      description: t("dashboard.createOfferDescription"),
      buttonText: t("dashboard.createOffer"),
      href: "/company/create-offer",
      color: "blue",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          {t("dashboard.welcome", { name: user?.firstName || "" })}
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          {t("dashboard.subtitle")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6 hover:border-primary/80 transition-all"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10  h-10 sm:w-12 sm:h-12 bg-yellow/10 rounded-lg flex items-center justify-center">
                  <Icon className="text-primary" size={20} />
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    stat.changeType === "positive"
                      ? "text-green"
                      : stat.changeType === "warning"
                      ? "text-yellow"
                      : "text-smoky-white"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-400 text-xs sm:text-sm mb-1">{stat.name}</h3>
              <p className="text-white text-xl sm:text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Pending Approvals */}
      <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">{t("dashboard.pendingApprovalsTitle")}</h2>
            <span className="bg-yellow/10 text-yellow px-2 py-1 rounded-full text-xs font-semibold">
              {pendingItems.length}
            </span>
          </div>
          <Link 
            to="/company/pending-approvals"
            className="text-primary hover:text-primary font-medium text-xs sm:text-xl transition-colors"
          >
            {t("dashboard.viewAll")}
          </Link>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {pendingItems && pendingItems.length > 0 ? (
            pendingItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-background rounded-lg border border-primary/50 hover:border-primary transition-all gap-3 sm:gap-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-primary text-xs font-semibold">{item.type}</span>
                    {item.revisionCount && (
                      <span className="bg-yellow/10 text-yellow px-2 py-0.5 rounded text-xs">
                        {t("dashboard.revision", { count: item.revisionCount })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold mb-1 text-sm sm:text-base truncate">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{item.submittedAt}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      item.status === "pending"
                        ? "bg-yellow/10 text-yellow"
                        : "bg-orange-500/10 text-orange-500"
                    }`}
                  >
                    {item.status === "pending" ? t("dashboard.underReview") : t("dashboard.needsRevision")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 sm:p-6 bg-background rounded-lg border border-primary/30 text-center">
              <p className="text-sm sm:text-base text-gray-400">{t("dashboard.noPendingApprovals")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Important Notice */}
      {pendingItems.some(item => item.status === 'revision') && (
        <div className="bg-orange-500/10 border border-orange-500 rounded-2xl p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-orange-500 font-bold mb-1">{t("dashboard.revisionRequired")}</h3>
              <p className="text-sm text-gray-300">
                {t("dashboard.revisionNotice")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${
              action.color === "primary"
                ? "from-primary/20 to-primary/5 border-primary"
                : "from-blue-500/20 to-blue-500/5 border-blue-500"
            } border rounded-2xl p-4 sm:p-6`}
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {action.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
              {action.description}
            </p>
            <Link
              to={action.href}
              className={`inline-block px-4 sm:px-6 py-2 ${
                action.color === "primary"
                  ? "bg-primary text-dark hover:bg-primary/90"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } font-semibold rounded-full transition-all text-sm sm:text-base ${
                action.disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
              }`}
            >
              {action.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

