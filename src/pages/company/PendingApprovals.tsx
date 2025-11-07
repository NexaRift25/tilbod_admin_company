import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Filter, AlertCircle, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PendingItem {
  id: number;
  type: "Company" | "Offer";
  name: string;
  status: "pending" | "revision";
  submittedAt: string;
  revisionCount?: number;
}

export default function PendingApprovalsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "revision">("all");

  // Mock data - replace with actual data fetching
  const allPendingItems: PendingItem[] = [
    {
      id: 1,
      type: "Company",
      name: "Hotel Aurora",
      status: "pending",
      submittedAt: "2 hours ago",
    },
    {
      id: 2,
      type: "Company",
      name: "Blue Lagoon Spa",
      status: "revision",
      submittedAt: "1 day ago",
      revisionCount: 1,
    },
    {
      id: 3,
      type: "Offer",
      name: "Weekend Getaway Package",
      status: "pending",
      submittedAt: "30 minutes ago",
    },
    {
      id: 4,
      type: "Company",
      name: "Mountain View Restaurant",
      status: "pending",
      submittedAt: "3 days ago",
    },
    {
      id: 5,
      type: "Offer",
      name: "Summer Special Deal",
      status: "revision",
      submittedAt: "2 days ago",
      revisionCount: 2,
    },
  ];

  // Filter items based on search and status
  const filteredItems = allPendingItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link
          to="/company/dashboard"
          className="flex items-center justify-center w-10 h-10 border border-primary rounded-lg hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="text-primary" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            {t("pendingApprovals.title")}
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            {t("pendingApprovals.subtitle")}
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t("pendingApprovals.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-primary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Filter className="text-gray-400" size={20} />
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  statusFilter === "all"
                    ? "bg-primary text-dark"
                    : "bg-background border border-primary text-gray-400 hover:text-white"
                }`}
              >
                {t("pendingApprovals.all")}
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  statusFilter === "pending"
                    ? "bg-primary text-dark"
                    : "bg-background border border-primary text-gray-400 hover:text-white"
                }`}
              >
                {t("pendingApprovals.pending")}
              </button>
              <button
                onClick={() => setStatusFilter("revision")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  statusFilter === "revision"
                    ? "bg-primary text-dark"
                    : "bg-background border border-primary text-gray-400 hover:text-white"
                }`}
              >
                {t("pendingApprovals.revision")}
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-400">
          {t("pendingApprovals.showing", { count: filteredItems.length, total: allPendingItems.length })}
        </div>
      </div>

      {/* Pending Items List */}
      <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-background rounded-lg border border-primary/50 hover:border-primary transition-all gap-3 sm:gap-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-primary text-xs font-semibold">
                      {item.type === "Company" ? t("common.company") : t("offerTypes.offer")}
                    </span>
                    {item.revisionCount && (
                      <span className="bg-yellow/10 text-yellow px-2 py-0.5 rounded text-xs">
                        {t("pendingApprovals.revisionBadge", { count: item.revisionCount })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold mb-1 text-sm sm:text-base truncate">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {t("pendingApprovals.submitted", { time: item.submittedAt })}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      item.status === "pending"
                        ? "bg-yellow/10 text-yellow"
                        : "bg-orange-500/10 text-orange-500"
                    }`}
                  >
                    {item.status === "pending" ? t("pendingApprovals.underReview") : t("pendingApprovals.needsRevision")}
                  </span>
                  <Link
                    to={`/company/pending-approvals/${item.type.toLowerCase()}/${item.id}`}
                    className="flex items-center justify-center w-10 h-10 border border-primary rounded-lg hover:bg-primary/10 transition-colors"
                    title={t("pendingApprovals.viewDetails")}
                  >
                    <Eye className="text-primary" size={18} />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 sm:p-6 bg-background rounded-lg border border-primary/30 text-center">
              <p className="text-sm sm:text-base text-gray-400">
                {t("pendingApprovals.noItemsFound")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Important Notice */}
      {filteredItems.some((item) => item.status === "revision") && (
        <div className="bg-orange-500/10 border border-orange-500 rounded-2xl p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-orange-500 font-bold mb-1">{t("pendingApprovals.revisionRequired")}</h3>
              <p className="text-sm text-gray-300">
                {t("pendingApprovals.revisionNotice")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

