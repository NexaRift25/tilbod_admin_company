import { useMemo } from "react";
import {
  Building2,
  Clock,
  AlertCircle,
  DollarSign,
  Activity,
  Tag,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const stats = useMemo(
    () => [
      {
        id: "pendingApprovals",
        value: "8",
        icon: Clock,
        changeType: "warning",
        borderColor: "border-red-500",
        iconBg: "bg-red-500/10",
        iconColor: "text-red-500",
      },
      {
        id: "totalCompanies",
        value: "156",
        icon: Building2,
        changeType: "positive",
        borderColor: "border-primary",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
      },
      {
        id: "activeOffers",
        value: "342",
        icon: Tag,
        changeType: "positive",
        borderColor: "border-primary",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
      },
      {
        id: "platformRevenue",
        value: "1.2M kr.",
        icon: DollarSign,
        changeType: "positive",
        borderColor: "border-primary",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
      },
    ],
    []
  );

  const pendingItems = useMemo(
    () => [
      {
        id: 1,
        type: "company" as const,
        name: "Nordic Spa & Wellness",
        company: "Nordic Group",
        submittedAtKey: "nordicSpa" as const,
        timeRemaining: 25,
        urgent: false,
      },
      {
        id: 2,
        type: "offer" as const,
        name: "Christmas Special - 50% Off",
        company: "Hotel Aurora",
        submittedAtKey: "christmasSpecial" as const,
        timeRemaining: 18,
        urgent: false,
      },
      {
        id: 3,
        type: "company" as const,
        name: "Reykjavik Bar & Lounge",
        company: "Nightlife Co.",
        submittedAtKey: "reykjavikBar" as const,
        timeRemaining: 10,
        urgent: true,
      },
    ],
    []
  );

  const recentActivity = useMemo(
    () => [
      {
        id: 1,
        action: "approved" as const,
        type: "company" as const,
        name: "Blue Lagoon Spa",
        timeKey: "blueLagoon" as const,
      },
      {
        id: 2,
        action: "rejected" as const,
        type: "offer" as const,
        name: "Invalid Pricing Deal",
        timeKey: "invalidPricing" as const,
      },
      {
        id: 3,
        action: "revision" as const,
        type: "company" as const,
        name: "Mountain Resort",
        timeKey: "mountainResort" as const,
      },
    ],
    []
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          {t("adminDashboard.header.title", { name: user?.firstName ?? "" })}
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          {t("adminDashboard.header.subtitle")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const changeColor =
            stat.changeType === "warning"
              ? "text-yellow"
              : stat.changeType === "positive"
              ? "text-green"
              : "text-red-500";

          return (
            <div
              key={stat.id}
              className={`bg-card-background border ${stat.borderColor} rounded-2xl p-4 sm:p-6 hover:${stat.borderColor}/80 transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`${stat.iconBg} rounded-lg flex items-center justify-center p-2 sm:p-2.5`}
                >
                  <Icon className={stat.iconColor} size={20} />
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold ${changeColor}`}
                >
                  {t(`adminDashboard.stats.${stat.id}.change`)}
                </span>
              </div>
              <h3 className="text-white text-sm sm:text-base mb-3">
                {t(`adminDashboard.stats.${stat.id}.label`)}
              </h3>
              <p className="text-white text-2xl sm:text-3xl font-bold">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Approval Queue */}
      <div className="bg-card-background border border-red-500 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {t("adminDashboard.approvalQueue.title")}
            </h2>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
              {t("adminDashboard.approvalQueue.badge")}
            </span>
          </div>
          <Link to="/admin/approval-queue" className="text-red-500 hover:text-red-400 font-medium text-xs sm:text-lg">
            {t("adminDashboard.approvalQueue.reviewAll")}
          </Link>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {pendingItems.map((item) => {
            const isUrgent = item.urgent || item.timeRemaining <= 10;
            const borderColor = isUrgent
              ? "border-red-500 hover:border-red-500/80"
              : "border-primary hover:border-primary/80";
            const timeColor = isUrgent ? "text-red-500" : "text-white";

            return (
              <div
                key={item.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background rounded-lg border ${borderColor} transition-all gap-3 sm:gap-4`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-primary text-xs font-semibold">
                      {t(`adminDashboard.pendingItems.type.${item.type}`)}
                    </span>
                    {isUrgent && (
                      <>
                        <AlertCircle className="text-red-500" size={14} />
                        <span className="text-red-500 text-xs font-semibold">
                          {t("adminDashboard.pendingItems.urgent")}
                        </span>
                      </>
                    )}
                    <span className="text-white font-bold text-sm sm:text-base">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                    <span>{item.company}</span>
                    <span>•</span>
                    <span>
                      {t("adminDashboard.pendingItems.submittedAt", {
                        time: t(`adminDashboard.pendingItems.items.${item.submittedAtKey}.time`),
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`bg-gray-500/20 ${timeColor} px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap`}
                  >
                    {t("adminDashboard.pendingItems.timeRemaining", {
                      count: item.timeRemaining,
                    })}
                  </span>
                  <button className="bg-primary text-dark px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all">
                    {t("adminDashboard.pendingItems.reviewButton")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {t("adminDashboard.recentActivity.title")}
            </h2>
            <Activity className="text-primary" size={20} />
          </div>
          <Link to="/admin/companies" className="text-primary hover:text-primary/80 font-medium text-xs sm:text-lg">
            {t("adminDashboard.recentActivity.viewAll")}
          </Link>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 sm:p-4 bg-background rounded-lg border border-primary/30 hover:border-primary transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.action === "approved"
                      ? "bg-green"
                      : activity.action === "rejected"
                      ? "bg-red-500"
                      : "bg-yellow"
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold text-sm sm:text-base ${
                        activity.action === "approved"
                          ? "text-green"
                          : activity.action === "rejected"
                          ? "text-red-500"
                          : "text-yellow"
                      }`}
                    >
                      {t(`adminDashboard.recentActivity.actions.${activity.action}`)}
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-primary text-xs">
                      {t(`adminDashboard.recentActivity.type.${activity.type}`)}
                    </span>
                  </div>
                  <p className="text-white text-sm sm:text-base">
                    {activity.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">
                  {t(`adminDashboard.recentActivity.times.${activity.timeKey}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
