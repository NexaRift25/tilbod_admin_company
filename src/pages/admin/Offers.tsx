import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Filter,
  Search,
  Tag,
  Users,
  Building2,
  TrendingUp,
  Plus,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { useTranslation } from "react-i18next";

interface Offer {
  id: string;
  title: string;
  type: "active" | "weekdays" | "happy_hour" | "gift_card";
  companyName: string;
  category: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  status: "pending" | "approved" | "active" | "expired" | "rejected" | "revision";
  startDate: string;
  endDate: string;
  createdAt: string;
  views: number;
  purchases: number;
  revenue: number;
  extensionCount: number;
  revisionCount?: number;
}

export default function AdminOffersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "is" ? "is-IS" : "en-US";
  const formatCurrency = (value: number) => value.toLocaleString(locale);
  const formatDate = (value: string | number | Date) =>
    new Date(value).toLocaleDateString(locale);

  // Mock data for admin offers management
  const [offers] = useState<Offer[]>([
    {
      id: "1",
      title: "Weekend Getaway Package",
      type: "active",
      companyName: "Hotel Aurora",
      category: "Hotels & Accommodation",
      originalPrice: 50000,
      discountPrice: 35000,
      discountPercentage: 30,
      status: "active",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      createdAt: "2024-12-15",
      views: 245,
      purchases: 12,
      revenue: 420000,
      extensionCount: 1,
    },
    {
      id: "2",
      title: "Happy Hour Special",
      type: "happy_hour",
      companyName: "Reykjavik Bar & Lounge",
      category: "Food & Dining",
      originalPrice: 1500,
      discountPrice: 1000,
      discountPercentage: 33,
      status: "pending",
      startDate: "2025-01-15",
      endDate: "2025-02-15",
      createdAt: "2024-12-20",
      views: 0,
      purchases: 0,
      revenue: 0,
      extensionCount: 0,
    },
    {
      id: "3",
      title: "Tuesday Restaurant Special",
      type: "weekdays",
      companyName: "Nordic Spa & Wellness",
      category: "Food & Dining",
      originalPrice: 2500,
      discountPrice: 2000,
      discountPercentage: 20,
      status: "approved",
      startDate: "2025-01-10",
      endDate: "2025-03-10",
      createdAt: "2024-12-18",
      views: 156,
      purchases: 8,
      revenue: 16000,
      extensionCount: 0,
    },
    {
      id: "4",
      title: "Spa & Wellness Gift Card",
      type: "gift_card",
      companyName: "Blue Lagoon Spa",
      category: "Wellness & Spa",
      originalPrice: 10000,
      discountPrice: 8500,
      discountPercentage: 15,
      status: "expired",
      startDate: "2024-11-01",
      endDate: "2024-12-31",
      createdAt: "2024-10-25",
      views: 89,
      purchases: 15,
      revenue: 127500,
      extensionCount: 2,
    },
  ]);

  const statusTranslationMap: Record<string, string> = {
    pending: "adminOffers.status.pending",
    approved: "adminOffers.status.approved",
    active: "adminOffers.status.active",
    expired: "adminOffers.status.expired",
    rejected: "adminOffers.status.rejected",
    revision: "adminOffers.status.revision",
  };

  const typeTranslationMap: Record<string, string> = {
    active: "adminOffers.types.active",
    weekdays: "adminOffers.types.weekdays",
    happy_hour: "adminOffers.types.happyHour",
    gift_card: "adminOffers.types.giftCard",
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || offer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOffers = filteredOffers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (newFilter: string) => {
    setStatusFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch);
    setCurrentPage(1);
  };

  const stats = useMemo(
    () => ({
      total: offers.length,
      active: offers.filter((o) => o.status === "active").length,
      pending: offers.filter((o) => o.status === "pending").length,
      totalViews: offers.reduce((sum, o) => sum + o.views, 0),
      totalPurchases: offers.reduce((sum, o) => sum + o.purchases, 0),
      totalRevenue: offers.reduce((sum, o) => sum + o.revenue, 0),
    }),
    [offers]
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="text-green" size={20} />;
      case "rejected":
        return <XCircle className="text-red-500" size={20} />;
      case "revision":
        return <AlertCircle className="text-yellow" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green/10 text-green";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      case "revision":
        return "bg-yellow/10 text-yellow";
      default:
        return "bg-red-500/10 text-red-600 animate-pulse";
    }
  };

  const getStatusText = (status: string) =>
    t(statusTranslationMap[status] ?? "adminOffers.status.pendingReview");

  const getTypeColor = (type: string) => {
    switch (type) {
      case "active":
        return "bg-blue-500/10 text-blue-500";
      case "weekdays":
        return "bg-green/10 text-green";
      case "happy_hour":
        return "bg-purple-500/10 text-purple-500";
      case "gift_card":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const offerStats = useMemo(
    () => ({
      total: offers.length,
      approved: offers.filter((o) => o.status === "approved").length,
      pending: offers.filter((o) => o.status === "pending").length,
      revision: offers.filter((o) => o.status === "revision").length,
      rejected: offers.filter((o) => o.status === "rejected").length,
    }),
    [offers]
  );

  const statusOptions = useMemo<{ value: string; label: string }[]>(
    () => [
      { value: "all", label: t("adminOffers.filters.status.all") },
      { value: "pending", label: t("adminOffers.filters.status.pending") },
      { value: "approved", label: t("adminOffers.filters.status.approved") },
      { value: "revision", label: t("adminOffers.filters.status.revision") },
      { value: "rejected", label: t("adminOffers.filters.status.rejected") },
    ],
    [t]
  );

  const giftCardStats = useMemo(() => {
    const giftCardOffers = offers.filter((o) => o.type === "gift_card");
    const purchases = giftCardOffers.reduce((sum, o) => sum + o.purchases, 0);
    const views = giftCardOffers.reduce((sum, o) => sum + o.views, 0);
    const conversion =
      views > 0 ? `${((purchases / views) * 100).toFixed(1)}%` : "0%";
    return {
      count: giftCardOffers.length,
      purchases,
      views,
      conversion,
    };
  }, [offers]);

  const topCompany = useMemo(() => {
    const companyStats = offers.reduce((acc, offer) => {
      acc[offer.companyName] = (acc[offer.companyName] || 0) + offer.revenue;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(companyStats).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    )[0];
  }, [offers]);

  const typeDistributionText = useMemo(() => {
    const typeCounts = offers.reduce((acc, offer) => {
      acc[offer.type] = (acc[offer.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const entries = Object.entries(typeCounts);
    if (!entries.length) {
      return t("adminOffers.insights.distribution.empty");
    }
    return entries
      .map(([type, count]) =>
        t("adminOffers.insights.distribution.item", {
          count,
          type: t(typeTranslationMap[type] ?? type),
        })
      )
      .join(", ");
  }, [offers, t]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/dashboard"
            className="p-2 hover:bg-primary/10 rounded-lg transition-all"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {t("adminOffers.header.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminOffers.header.subtitle")}
            </p>
          </div>
        </div>
        <Link
          to="/admin/offers/create"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all"
        >
          <Plus size={18} />
          {t("adminOffers.header.createButton")}
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminOffers.stats.total")}
              </p>
              <p className="text-white text-2xl font-bold">
                {offerStats.total}
              </p>
            </div>
            <FileText className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminOffers.stats.approved")}
              </p>
              <p className="text-white text-2xl font-bold">
                {offerStats.approved}
              </p>
            </div>
            <CheckCircle className="text-green" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-gray-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminOffers.stats.pending")}
              </p>
              <p className="text-white text-2xl font-bold">
                {offerStats.pending}
              </p>
            </div>
            <Clock className="text-gray-400" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-yellow-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminOffers.stats.revision")}
              </p>
              <p className="text-white text-2xl font-bold">
                {offerStats.revision}
              </p>
            </div>
            <AlertCircle className="text-yellow" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-red-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminOffers.stats.rejected")}
              </p>
              <p className="text-white text-2xl font-bold">
                {offerStats.rejected}
              </p>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card-background border border-primary rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={t("adminOffers.filters.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {paginatedOffers.length === 0 ? (
          <div className="bg-card-background border border-primary rounded-2xl p-8 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">
              {t("adminOffers.emptyState.title")}
            </h3>
            <p className="text-gray-400">
              {t("adminOffers.emptyState.description")}
            </p>
          </div>
        ) : (
          paginatedOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-card-background border border-primary rounded-2xl p-6 hover:border-primary/80 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="text-primary" size={24} />
                    <h3 className="text-xl font-bold text-white">
                      {offer.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                        offer.type
                      )}`}
                    >
                      <Tag size={12} className="inline mr-1" />
                      {t(typeTranslationMap[offer.type] ?? offer.type)}
                    </span>
                    <span
                      className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold ${getStatusColor(
                        offer.status
                      )}`}
                    >
                      {getStatusIcon(offer.status)}
                      <span className="ml-1">
                        {getStatusText(offer.status)}
                      </span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-400">
                        {t("adminOffers.cards.company")}
                      </p>
                      <p className="text-white font-medium">{offer.companyName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        {t("adminOffers.cards.price")}
                      </p>
                      <p className="text-white font-medium">
                        {t("adminOffers.values.currency", {
                          amount: formatCurrency(offer.discountPrice),
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        {t("adminOffers.cards.discount")}
                      </p>
                      <p className="text-white font-medium">
                        {t("adminOffers.values.percentage", {
                          value: offer.discountPercentage,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        {t("adminOffers.cards.performance")}
                      </p>
                      <p className="text-white font-medium">
                        {t("adminOffers.cards.performanceMetrics", {
                          views: offer.views,
                          purchases: offer.purchases,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">
                        {t("adminOffers.cards.created")}
                      </p>
                      <p className="text-white font-medium">
                        {formatDate(offer.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        {t("adminOffers.cards.validUntil")}
                      </p>
                      <p className="text-white font-medium">
                        {formatDate(offer.endDate)}
                      </p>
                    </div>
                  </div>

                  {offer.status === "revision" && (
                    <div className="mt-3 bg-yellow/10 border border-yellow rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="text-yellow" size={16} />
                        <span className="text-yellow text-sm">
                          {t("adminOffers.cards.revisionNotice", {
                            count: offer.revisionCount ?? 0,
                            total: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/admin/offers/${offer.id}`}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title={t("adminOffers.actions.view")}
                  >
                    <Eye size={20} />
                  </Link>
                  <button className="p-2 text-green hover:text-green hover:bg-green/10 rounded-lg transition-all">
                    <CheckCircle size={20} />
                  </button>
                  <button className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredOffers.length > itemsPerPage && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredOffers.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Platform Insights */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          {t("adminOffers.insights.title")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <TrendingUp
                className="text-green flex-shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <h4 className="text-green font-bold mb-1">
                  {t("adminOffers.insights.performance.title")}
                </h4>
                <p className="text-sm text-gray-300">
                  {t("adminOffers.insights.performance.description", {
                    conversion: giftCardStats.conversion,
                    count: giftCardStats.count,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2
                className="text-blue-500 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <h4 className="text-blue-500 font-bold mb-1">
                  {t("adminOffers.insights.topCompanies.title")}
                </h4>
                <p className="text-sm text-gray-300">
                  {topCompany
                    ? t("adminOffers.insights.topCompanies.description", {
                        company: topCompany[0],
                        revenue: formatCurrency(topCompany[1] as number),
                      })
                    : t("adminOffers.insights.topCompanies.empty")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Tag className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-purple-500 font-bold mb-1">
                  {t("adminOffers.insights.distribution.title")}
                </h4>
                <p className="text-sm text-gray-300">{typeDistributionText}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users
                className="text-orange-500 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <h4 className="text-orange-500 font-bold mb-1">
                  {t("adminOffers.insights.engagement.title")}
                </h4>
                <p className="text-sm text-gray-300">
                  {t("adminOffers.insights.engagement.description", {
                    views: stats.totalViews.toLocaleString(locale),
                    purchases: stats.totalPurchases,
                    averageOrder: formatCurrency(
                      Math.round(
                        stats.totalRevenue / Math.max(stats.totalPurchases, 1)
                      )
                    ),
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
