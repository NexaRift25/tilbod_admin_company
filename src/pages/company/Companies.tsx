import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Plus,
  Eye,
  Edit,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  Filter,
  Search
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function CompaniesPage() {
  const { companies } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green/10 text-green";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      case "revision":
        return "bg-yellow/10 text-yellow";
      default:
        return "bg-red-500/60 text-white animate-pulse";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "revision":
        return "Needs Revision";
      default:
        return "Pending Review";
    }
  };

  const companyStats = {
    total: companies.length,
    approved: companies.filter(c => c.status === "approved").length,
    pending: companies.filter(c => c.status === "pending").length,
    revision: companies.filter(c => c.status === "revision").length,
    rejected: companies.filter(c => c.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/company/dashboard"
            className="p-2 hover:bg-primary/10 rounded-lg transition-all"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              My Companies
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your registered businesses ({companies.length}/10 companies)
            </p>
          </div>
        </div>

        {companies.length < 10 && (
          <Link
            to="/company/companies/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
          >
            <Plus size={20} />
            Register Company
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-white text-2xl font-bold">{companyStats.total}</p>
            </div>
            <Building2 className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-white text-2xl font-bold">{companyStats.approved}</p>
            </div>
            <CheckCircle className="text-green" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-gray-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-white text-2xl font-bold">{companyStats.pending}</p>
            </div>
            <Clock className="text-gray-400" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-yellow-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revision</p>
              <p className="text-white text-2xl font-bold">{companyStats.revision}</p>
            </div>
            <AlertCircle className="text-yellow" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-red-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Rejected</p>
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
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="revision">Needs Revision</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Companies List */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        {filteredCompanies?.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No companies found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't registered any companies yet"
              }
            </p>
            {!searchTerm && statusFilter === "all" && companies.length < 10 && (
              <Link
                to="/company/companies/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
              >
                <Plus size={20} />
                Register Your First Company
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-primary/50">
                  <th className="pb-3">Company Name</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Registration #</th>
                  <th className="pb-3">Tax ID</th>
                  <th className="pb-3">Registered</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {filteredCompanies?.map((company) => (
                  <tr key={company.id} className="border-b border-primary/10 hover:bg-primary/5">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="text-primary" size={18} />
                        <div>
                          <p className="font-medium">{company.name}</p>
                          {company?.status === "revision" && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertCircle className="text-yellow" size={12} />
                              <span className="text-yellow text-xs">
                                Revision (Attempt {company.revisionCount}/3)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(company.status)}`}>
                        {company.status === "approved" ? (
                          <CheckCircle className="text-green" size={12} />
                        ) : company.status === "rejected" ? (
                          <XCircle className="text-red-500" size={12} />
                        ) : company.status === "revision" ? (
                          <AlertCircle className="text-yellow" size={12} />
                        ) : (
                          <Clock className="text-gray-400" size={12} />
                        )}
                        <span>{getStatusText(company.status)}</span>
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="text-sm">{company.category}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-medium">{company.registrationNumber}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-medium">{company.taxId}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-sm text-gray-300">
                        {new Date(company?.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/company/companies/${company.id}`}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/company/companies/${company.id}/edit`}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Edit Company"
                        >
                          <Edit size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Limit Warning */}
      {companies?.length >= 8 && (
        <div className="bg-yellow/10 border border-yellow rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-yellow font-bold mb-1">
                Company Registration Limit Warning
              </h3>
              <p className="text-sm text-gray-300">
                You have registered {companies.length}/10 companies. You have {10 - companies.length} company registrations remaining.
              </p>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

