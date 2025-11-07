import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Filter,
  Search,
  Edit,
  Plus,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { useTranslation } from "react-i18next";

export default function AdminCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "is" ? "is-IS" : "en-US";
  const statusOptions = [
    { value: "all", label: t("adminCompanies.filters.status.all") },
    { value: "pending", label: t("adminCompanies.filters.status.pending") },
    { value: "approved", label: t("adminCompanies.filters.status.approved") },
    { value: "revision", label: t("adminCompanies.filters.status.revision") },
    { value: "rejected", label: t("adminCompanies.filters.status.rejected") },
  ];

  // Mock data for admin companies management
  const companies = [
    {
      id: "1",
      name: "Blue Lagoon Spa",
      registrationNumber: "550289-2349",
      taxId: "TAX-001",
      category: "Wellness & Spa",
      status: "approved",
      revisionCount: 0,
      createdAt: "2024-11-15T10:00:00Z",
      email: "info@bluelagoon.is",
      phone: "+354 420 8800",
      address: "240 Grindavík",
      owner: "John Doe",
      offersCount: 5,
    },
    {
      id: "2",
      name: "Hotel Aurora",
      registrationNumber: "560123-4567",
      taxId: "TAX-002",
      category: "Hotels & Accommodation",
      status: "pending",
      revisionCount: 0,
      createdAt: "2025-01-10T14:30:00Z",
      email: "reservations@hotelaurora.is",
      phone: "+354 555 1234",
      address: "Reykjavík",
      owner: "Jane Smith",
      offersCount: 0,
    },
    {
      id: "3",
      name: "Restaurant Nordic",
      registrationNumber: "570456-7890",
      taxId: "TAX-003",
      category: "Food & Dining",
      status: "revision",
      revisionCount: 1,
      createdAt: "2025-01-08T09:15:00Z",
      email: "info@restaurantnordic.is",
      phone: "+354 555 5678",
      address: "Akureyri",
      owner: "Mike Johnson",
      offersCount: 2,
    },
    {
      id: "4",
      name: "Adventure Tours Iceland",
      registrationNumber: "580789-0123",
      taxId: "TAX-004",
      category: "Activities & Entertainment",
      status: "rejected",
      revisionCount: 2,
      createdAt: "2025-01-05T16:45:00Z",
      email: "bookings@adventuretours.is",
      phone: "+354 555 9012",
      address: "Selfoss",
      owner: "Sarah Wilson",
      offersCount: 0,
    },
  ];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (newFilter: string) => {
    setStatusFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch);
    setCurrentPage(1);
  };

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
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    const statusTranslationMap: Record<string, string> = {
      approved: "adminCompanies.statusLabels.approved",
      rejected: "adminCompanies.statusLabels.rejected",
      revision: "adminCompanies.statusLabels.revision",
      pending: "adminCompanies.statusLabels.pending",
    };

    return t(
      statusTranslationMap[status] ?? "adminCompanies.statusLabels.pendingReview"
    );
  };

  const companyStats = {
    total: companies.length,
    approved: companies.filter(c => c.status === "approved").length,
    pending: companies.filter(c => c.status === "pending").length,
    revision: companies.filter(c => c.status === "revision").length,
    rejected: companies.filter(c => c.status === "rejected").length,
  };
  const totalOffers = companies.reduce(
    (sum, company) => sum + (company.offersCount || 0),
    0
  );
  const approvalRate =
    companyStats.total > 0
      ? Math.round((companyStats.approved / companyStats.total) * 100)
      : 0;

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
              {t("adminCompanies.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminCompanies.subtitle")}
            </p>
          </div>
        </div>
        <Link
          to="/admin/companies/create"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all"
        >
          <Plus size={18} />
          {t("adminCompanies.actions.create")}
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminCompanies.stats.total")}
              </p>
              <p className="text-white text-2xl font-bold">{companyStats.total}</p>
            </div>
            <Building2 className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminCompanies.stats.approved")}
              </p>
              <p className="text-white text-2xl font-bold">{companyStats.approved}</p>
            </div>
            <CheckCircle className="text-green" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-gray-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminCompanies.stats.pending")}
              </p>
              <p className="text-white text-2xl font-bold">{companyStats.pending}</p>
            </div>
            <Clock className="text-gray-400" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-yellow-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminCompanies.stats.revision")}
              </p>
              <p className="text-white text-2xl font-bold">{companyStats.revision}</p>
            </div>
            <AlertCircle className="text-yellow" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-red-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminCompanies.stats.rejected")}
              </p>
              <p className="text-white text-2xl font-bold">{companyStats.rejected}</p>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t("adminCompanies.filters.searchPlaceholder")}
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
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Companies List */}
      <div className="space-y-4">
        {paginatedCompanies.length === 0 ? (
          <div className="bg-card-background border border-primary rounded-2xl p-8 text-center">
            <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">
              {t("adminCompanies.emptyState.title")}
            </h3>
            <p className="text-gray-400">
              {t("adminCompanies.emptyState.description")}
            </p>
          </div>
        ) : (
          paginatedCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-card-background border border-primary rounded-2xl p-6 hover:border-primary/80 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="text-primary" size={24} />
                    <h3 className="text-xl font-bold text-white">{company.name}</h3>
                    <span className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold ${getStatusColor(company.status)}`}>
                      {getStatusIcon(company.status)}
                      <span className="ml-1">{getStatusText(company.status)}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-400">
                        {t("adminCompanies.companyCard.category")}
                      </p>
                      <p className="text-white font-medium">{company.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        {t("adminCompanies.companyCard.owner")}
                      </p>
                      <p className="text-white font-medium">{company.owner}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        {t("adminCompanies.companyCard.registration")}
                      </p>
                      <p className="text-white font-medium">{company.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        {t("adminCompanies.companyCard.offers")}
                      </p>
                      <p className="text-white font-medium">
                        {t("adminCompanies.companyCard.offersActive", {
                          count: company.offersCount,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">
                        {t("adminCompanies.companyCard.email")}
                      </p>
                      <p className="text-white font-medium">{company.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        {t("adminCompanies.companyCard.phone")}
                      </p>
                      <p className="text-white font-medium">{company.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        {t("adminCompanies.companyCard.registered")}
                      </p>
                      <p className="text-white font-medium">
                        {new Date(company.createdAt).toLocaleDateString(locale)}
                      </p>
                    </div>
                  </div>

                  {company.status === "revision" && (
                    <div className="mt-3 bg-yellow/10 border border-yellow-500 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="text-yellow" size={16} />
                        <span className="text-yellow text-sm">
                          {t("adminCompanies.companyCard.revisionNotice", {
                            count: company.revisionCount,
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/admin/companies/${company.id}`}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title={t("adminCompanies.actions.viewDetails")}
                  >
                    <Eye size={20} />
                  </Link>
                  <Link
                    to={`/admin/companies/${company.id}/edit`}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title={t("adminCompanies.actions.edit")}
                  >
                    <Edit size={20} />
                  </Link>
                </div>
              </div>
            </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredCompanies.length > itemsPerPage && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredCompanies.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}


      {/* Company Insights */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          {t("adminCompanies.insights.title")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="text-green flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-green font-bold mb-1">
                  {t("adminCompanies.insights.distribution.title")}
                </h4>
                <p className="text-sm text-gray-300">
                  {t("adminCompanies.insights.distribution.description", {
                    approved: companyStats.approved,
                    pending: companyStats.pending,
                    revision: companyStats.revision,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-blue-500 font-bold mb-1">
                  {t("adminCompanies.insights.approvalRate.title")}
                </h4>
                <p className="text-sm text-gray-300">
                  {t("adminCompanies.insights.approvalRate.description", {
                    approved: companyStats.approved,
                    total: companyStats.total,
                    rate: approvalRate,
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-purple-500 font-bold mb-1">
                  {t("adminCompanies.insights.status.title")}
                </h4>
                <p className="text-sm text-gray-300">
                  {t("adminCompanies.insights.status.description", {
                    approved: companyStats.approved,
                    rejected: companyStats.rejected,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-orange-500 font-bold mb-1">
                  {t("adminCompanies.insights.totalOffers.title")}
                </h4>
                <p className="text-sm text-gray-300">
                  {t("adminCompanies.insights.totalOffers.description", {
                    count: totalOffers,
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
