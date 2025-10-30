import { useState } from "react";
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
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";

export default function AdminOffersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Mock data for admin offers management
  const offers = [
    {
      id: "1",
      title: "Weekend Getaway Package",
      company: "Hotel Aurora",
      companyId: "2",
      type: "Active Offer",
      status: "approved",
      price: "15,000 kr.",
      discount: "20%",
      createdAt: "2025-01-10T14:30:00Z",
      validUntil: "2025-02-10T23:59:59Z",
      views: 245,
      purchases: 12,
    },
    {
      id: "2",
      title: "Spa Day Special",
      company: "Blue Lagoon Spa",
      companyId: "1",
      type: "Weekday Special",
      status: "pending",
      price: "8,500 kr.",
      discount: "15%",
      createdAt: "2025-01-12T09:15:00Z",
      validUntil: "2025-02-12T23:59:59Z",
      views: 89,
      purchases: 0,
    },
    {
      id: "3",
      title: "Happy Hour Drinks",
      company: "Bar Central",
      companyId: "5",
      type: "Happy Hour",
      status: "revision",
      price: "1,200 kr.",
      discount: "30%",
      createdAt: "2025-01-08T16:45:00Z",
      validUntil: "2025-02-08T23:59:59Z",
      views: 156,
      purchases: 8,
      revisionCount: 1,
    },
    {
      id: "4",
      title: "Adventure Tour Package",
      company: "Adventure Tours Iceland",
      companyId: "4",
      type: "Gift Card",
      status: "rejected",
      price: "25,000 kr.",
      discount: "10%",
      createdAt: "2025-01-05T11:20:00Z",
      validUntil: "2025-02-05T23:59:59Z",
      views: 67,
      purchases: 0,
    },
  ];

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || offer.status === statusFilter;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="text-green-500" size={20} />;
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
        return "bg-green-500/10 text-green-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      case "revision":
        return "bg-yellow/10 text-yellow";
      default:
        return "bg-gray-500/10 text-gray-400";
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Active Offer":
        return "bg-blue-500/10 text-blue-500";
      case "Weekday Special":
        return "bg-green-500/10 text-green-500";
      case "Happy Hour":
        return "bg-purple-500/10 text-purple-500";
      case "Gift Card":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const offerStats = {
    total: offers.length,
    approved: offers.filter(o => o.status === "approved").length,
    pending: offers.filter(o => o.status === "pending").length,
    revision: offers.filter(o => o.status === "revision").length,
    rejected: offers.filter(o => o.status === "rejected").length,
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
              Offer Management
            </h1>
            <p className="text-gray-400 text-sm">
              Review and manage all platform offers
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-white text-2xl font-bold">{offerStats.total}</p>
            </div>
            <FileText className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-white text-2xl font-bold">{offerStats.approved}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-gray-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-white text-2xl font-bold">{offerStats.pending}</p>
            </div>
            <Clock className="text-gray-400" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-yellow-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revision</p>
              <p className="text-white text-2xl font-bold">{offerStats.revision}</p>
            </div>
            <AlertCircle className="text-yellow" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-red-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Rejected</p>
              <p className="text-white text-2xl font-bold">{offerStats.rejected}</p>
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
                placeholder="Search offers..."
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
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="revision">Needs Revision</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {paginatedOffers.length === 0 ? (
          <div className="bg-card-background border border-primary rounded-2xl p-8 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No offers found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria
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
                    <h3 className="text-xl font-bold text-white">{offer.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(offer.type)}`}>
                      <Tag size={12} className="inline mr-1" />
                      {offer.type}
                    </span>
                    <span className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold ${getStatusColor(offer.status)}`}>
                      {getStatusIcon(offer.status)}
                      <span className="ml-1">{getStatusText(offer.status)}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-400">Company</p>
                      <p className="text-white font-medium">{offer.company}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Price</p>
                      <p className="text-white font-medium">{offer.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Discount</p>
                      <p className="text-white font-medium">{offer.discount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Performance</p>
                      <p className="text-white font-medium">{offer.views} views, {offer.purchases} purchases</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Created</p>
                      <p className="text-white font-medium">
                        {new Date(offer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Valid Until</p>
                      <p className="text-white font-medium">
                        {new Date(offer.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {offer.status === "revision" && (
                    <div className="mt-3 bg-yellow/10 border border-yellow rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="text-yellow" size={16} />
                        <span className="text-yellow text-sm">
                          Revision required (Attempt {offer.revisionCount}/2)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                    <Eye size={20} />
                  </button>
                  <button className="p-2 text-green-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all">
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
    </div>
  );
}
