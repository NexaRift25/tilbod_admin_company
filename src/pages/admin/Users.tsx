import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Shield,
  Building2,
  UserCheck,
  UserX,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { useTranslation } from "react-i18next";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { t } = useTranslation();

  // Mock data for admin users management
  const users = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@company.com",
      role: "company",
      status: "active",
      isVerified: true,
      phone: "+354 555 1234",
      createdAt: "2024-11-15T10:00:00Z",
      lastLogin: "2025-01-15T14:30:00Z",
      companiesCount: 2,
      offersCount: 5,
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@hotel.com",
      role: "company",
      status: "active",
      isVerified: true,
      phone: "+354 555 5678",
      createdAt: "2024-12-20T09:15:00Z",
      lastLogin: "2025-01-14T16:45:00Z",
      companiesCount: 1,
      offersCount: 3,
    },
    {
      id: "3",
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike@restaurant.is",
      role: "company",
      status: "pending",
      isVerified: false,
      phone: "+354 555 9012",
      createdAt: "2025-01-10T14:30:00Z",
      lastLogin: "2025-01-10T14:30:00Z",
      companiesCount: 0,
      offersCount: 0,
    },
    {
      id: "4",
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah@adventure.is",
      role: "company",
      status: "suspended",
      isVerified: true,
      phone: "+354 555 3456",
      createdAt: "2024-10-05T11:20:00Z",
      lastLogin: "2025-01-05T09:30:00Z",
      companiesCount: 1,
      offersCount: 0,
    },
    {
      id: "5",
      firstName: "Admin",
      lastName: "User",
      email: "admin@tilbod.is",
      role: "admin",
      status: "active",
      isVerified: true,
      phone: "+354 555 0000",
      createdAt: "2024-01-01T00:00:00Z",
      lastLogin: "2025-01-15T10:00:00Z",
      companiesCount: 0,
      offersCount: 0,
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (newFilter: string, filterType: 'status' | 'role') => {
    if (filterType === 'status') {
      setStatusFilter(newFilter);
    } else {
      setRoleFilter(newFilter);
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch);
    setCurrentPage(1);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="text-green" size={20} />;
      case "suspended":
        return <XCircle className="text-red-500" size={20} />;
      case "pending":
        return <Clock className="text-yellow" size={20} />;
      default:
        return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green/10 text-green";
      case "suspended":
        return "bg-red-500/10 text-red-500";
      case "pending":
        return "bg-yellow/10 text-yellow";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const getStatusText = (status: string) =>
    t(`adminUsers.status.${status}`, {
      defaultValue: t("adminUsers.status.unknown"),
    });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="text-blue-500" size={16} />;
      case "company":
        return <Building2 className="text-primary" size={16} />;
      default:
        return <Users className="text-gray-400" size={16} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-blue-500/10 text-blue-500";
      case "company":
        return "bg-primary/10 text-primary";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const getRoleLabel = (role: string) =>
    t(`adminUsers.roles.${role}`, { defaultValue: role });

  const userStats = useMemo(
    () => ({
      total: users.length,
      active: users.filter(u => u.status === "active").length,
      pending: users.filter(u => u.status === "pending").length,
      suspended: users.filter(u => u.status === "suspended").length,
      verified: users.filter(u => u.isVerified).length,
    }),
    [users]
  );

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter(u => u.status === "active").length,
      pending: users.filter(u => u.status === "pending").length,
      suspended: users.filter(u => u.status === "suspended").length,
      verified: users.filter(u => u.isVerified).length,
      companies: users.filter(u => u.role === "company").length,
      admins: users.filter(u => u.role === "admin").length,
    }),
    [users]
  );

  const verificationRate = useMemo(
    () => (stats.total ? Math.round((stats.verified / stats.total) * 100) : 0),
    [stats.total, stats.verified]
  );

  const companyRegistrations = useMemo(
    () =>
      users
        .filter(u => u.role === "company")
        .reduce((sum, u) => sum + (u.companiesCount || 0), 0),
    [users]
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: t("adminUsers.filters.status.all") },
      { value: "active", label: t("adminUsers.status.active") },
      { value: "pending", label: t("adminUsers.status.pending") },
      { value: "suspended", label: t("adminUsers.status.suspended") },
    ],
    [t]
  );

  const roleOptions = useMemo(
    () => [
      { value: "all", label: t("adminUsers.filters.role.all") },
      { value: "admin", label: t("adminUsers.roles.admin") },
      { value: "company", label: t("adminUsers.roles.company") },
    ],
    [t]
  );

  const statsCards = useMemo(
    () => [
      {
        id: "total",
        value: userStats.total,
        icon: Users,
        borderClass: "border-primary",
        iconColor: "text-primary",
      },
      {
        id: "active",
        value: userStats.active,
        icon: CheckCircle,
        borderClass: "border-green",
        iconColor: "text-green",
      },
      {
        id: "pending",
        value: userStats.pending,
        icon: Clock,
        borderClass: "border-yellow-500",
        iconColor: "text-yellow",
      },
      {
        id: "suspended",
        value: userStats.suspended,
        icon: XCircle,
        borderClass: "border-red-500",
        iconColor: "text-red-500",
      },
      {
        id: "verified",
        value: userStats.verified,
        icon: UserCheck,
        borderClass: "border-blue-500",
        iconColor: "text-blue-500",
      },
    ],
    [userStats]
  );

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
              {t("adminUsers.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminUsers.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statsCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.id} className={`bg-card-background border ${card.borderClass} rounded-2xl p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t(`adminUsers.stats.${card.id}`)}</p>
                  <p className="text-white text-2xl font-bold">{card.value}</p>
                </div>
                <Icon className={card.iconColor} size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-card-background border border-primary rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t("adminUsers.filters.searchPlaceholder")}
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
              onChange={(e) => handleFilterChange(e.target.value, 'status')}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={roleFilter}
              onChange={(e) => handleFilterChange(e.target.value, 'role')}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {paginatedUsers.length === 0 ? (
          <div className="bg-card-background border border-primary rounded-2xl p-8 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">{t("adminUsers.empty.title")}</h3>
            <p className="text-gray-400">{t("adminUsers.empty.description")}</p>
          </div>
        ) : (
          paginatedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-card-background border border-primary rounded-2xl p-6 hover:border-primary/80 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="text-primary" size={24} />
                    <h3 className="text-xl font-bold text-white">
                      {user.firstName} {user.lastName}
                    </h3>
                    <span className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="ml-1">{getRoleLabel(user.role)}</span>
                    </span>
                    <span className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                      <span className="ml-1">{getStatusText(user.status)}</span>
                    </span>
                    {user.isVerified && (
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-semibold">
                        <UserCheck size={12} className="inline mr-1" />
                        {t("adminUsers.badges.verified")}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-400">{t("adminUsers.details.email")}</p>
                      <p className="text-white font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t("adminUsers.details.phone")}</p>
                      <p className="text-white font-medium">{user.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t("adminUsers.details.companies")}</p>
                      <p className="text-white font-medium">{user.companiesCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t("adminUsers.details.offers")}</p>
                      <p className="text-white font-medium">{user.offersCount}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">{t("adminUsers.details.joined")}</p>
                      <p className="text-white font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t("adminUsers.details.lastLogin")}</p>
                      <p className="text-white font-medium">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title={t("adminUsers.actions.view")}
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title={t("adminUsers.actions.edit")}
                  >
                    <Edit size={20} />
                  </button>
                  {user.status === "active" ? (
                    <button
                      className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title={t("adminUsers.actions.suspend")}
                    >
                      <UserX size={20} />
                    </button>
                  ) : (
                    <button
                      className="p-2 text-green hover:text-green hover:bg-green/10 rounded-lg transition-all"
                      title={t("adminUsers.actions.activate")}
                    >
                      <UserCheck size={20} />
                    </button>
                  )}
                  <div className="relative">
                    <button
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      title={t("adminUsers.actions.more")}
                    >
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > itemsPerPage && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}


      {/* User Insights */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">{t("adminUsers.insights.title")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Users className="text-green flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-green font-bold mb-1">{t("adminUsers.insights.userDistribution.title")}</h4>
                <p className="text-sm text-gray-300">
                  {t("adminUsers.insights.userDistribution.description", {
                    companies: stats.companies,
                    admins: stats.admins,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-blue-500 font-bold mb-1">{t("adminUsers.insights.verification.title")}</h4>
                <p className="text-sm text-gray-300">
                  {t("adminUsers.insights.verification.description", {
                    verified: stats.verified,
                    rate: verificationRate,
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-purple-500 font-bold mb-1">{t("adminUsers.insights.security.title")}</h4>
                <p className="text-sm text-gray-300">
                  {t("adminUsers.insights.security.description", {
                    active: stats.active,
                    suspended: stats.suspended,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-orange-500 font-bold mb-1">{t("adminUsers.insights.activity.title")}</h4>
                <p className="text-sm text-gray-300">
                  {t("adminUsers.insights.activity.description", {
                    count: companyRegistrations,
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
