import { useState } from "react";
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

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
        return <CheckCircle className="text-green-500" size={20} />;
      case "suspended":
        return <XCircle className="text-red-500" size={20} />;
      case "pending":
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500";
      case "suspended":
        return "bg-red-500/10 text-red-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "suspended":
        return "Suspended";
      case "pending":
        return "Pending Verification";
      default:
        return "Unknown";
    }
  };

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

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    pending: users.filter(u => u.status === "pending").length,
    suspended: users.filter(u => u.status === "suspended").length,
    verified: users.filter(u => u.isVerified).length,
  };

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
              User Management
            </h1>
            <p className="text-gray-400 text-sm">
              Manage platform users and their access
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-white text-2xl font-bold">{userStats.total}</p>
            </div>
            <Users className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-white text-2xl font-bold">{userStats.active}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-yellow-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-white text-2xl font-bold">{userStats.pending}</p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-red-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Suspended</p>
              <p className="text-white text-2xl font-bold">{userStats.suspended}</p>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Verified</p>
              <p className="text-white text-2xl font-bold">{userStats.verified}</p>
            </div>
            <UserCheck className="text-blue-500" size={24} />
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
                placeholder="Search users..."
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
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => handleFilterChange(e.target.value, 'role')}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {paginatedUsers.length === 0 ? (
          <div className="bg-card-background border border-primary rounded-2xl p-8 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria
            </p>
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
                      <span className="ml-1 capitalize">{user.role}</span>
                    </span>
                    <span className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                      <span className="ml-1">{getStatusText(user.status)}</span>
                    </span>
                    {user.isVerified && (
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-semibold">
                        <UserCheck size={12} className="inline mr-1" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-400">Email</p>
                      <p className="text-white font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Phone</p>
                      <p className="text-white font-medium">{user.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Companies</p>
                      <p className="text-white font-medium">{user.companiesCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Offers</p>
                      <p className="text-white font-medium">{user.offersCount}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Joined</p>
                      <p className="text-white font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Last Login</p>
                      <p className="text-white font-medium">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                    <Eye size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                    <Edit size={20} />
                  </button>
                  {user.status === "active" ? (
                    <button className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                      <UserX size={20} />
                    </button>
                  ) : (
                    <button className="p-2 text-green-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all">
                      <UserCheck size={20} />
                    </button>
                  )}
                  <div className="relative">
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
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
    </div>
  );
}
