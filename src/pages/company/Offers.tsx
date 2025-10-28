import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Tag,
  Plus,
  Eye,
  Edit,
  ArrowLeft,
  Filter,
  Search,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  Users
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";

interface Offer {
  id: string;
  title: string;
  type: "active" | "weekdays" | "happy_hour" | "gift_card";
  category: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  status: "pending" | "approved" | "active" | "expired" | "rejected";
  startDate: string;
  endDate: string;
  createdAt: string;
  views: number;
  purchases: number;
  revenue: number;
  extensionCount: number;
  maxExtensions: 4;
  companyId: string;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: "1",
      title: "Weekend Getaway Package",
      type: "active",
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
      maxExtensions: 4,
      companyId: "company1"
    },
    {
      id: "2",
      title: "Happy Hour Special",
      type: "happy_hour",
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
      maxExtensions: 4,
      companyId: "company1"
    },
    {
      id: "3",
      title: "Tuesday Restaurant Special",
      type: "weekdays",
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
      maxExtensions: 4,
      companyId: "company1"
    },
    {
      id: "4",
      title: "Spa & Wellness Gift Card",
      type: "gift_card",
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
      maxExtensions: 4,
      companyId: "company1"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || offer.status === statusFilter;
    const matchesType = typeFilter === "all" || offer.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = filteredOffers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="text-green-500" size={20} />;
      case "approved":
        return <CheckCircle className="text-blue-500" size={20} />;
      case "pending":
        return <Clock className="text-yellow-500" size={20} />;
      case "expired":
        return <XCircle className="text-gray-500" size={20} />;
      case "rejected":
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500";
      case "approved":
        return "bg-blue-500/10 text-blue-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "expired":
        return "bg-gray-500/10 text-gray-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const getStatusTextClass = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "approved":
        return "text-blue-500";
      case "pending":
        return "text-yellow-500";
      case "expired":
        return "text-gray-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "active":
        return <Tag className="text-blue-500" size={16} />;
      case "weekdays":
        return <Calendar className="text-green-500" size={16} />;
      case "happy_hour":
        return <Clock className="text-purple-500" size={16} />;
      case "gift_card":
        return <DollarSign className="text-orange-500" size={16} />;
      default:
        return <Tag className="text-gray-500" size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "active":
        return "bg-blue-500/10 text-blue-500";
      case "weekdays":
        return "bg-green-500/10 text-green-500";
      case "happy_hour":
        return "bg-purple-500/10 text-purple-500";
      case "gift_card":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const handleEditOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowEditModal(true);
  };

  const handleExtendOffer = (offer: Offer) => {
    if (offer.extensionCount < offer.maxExtensions) {
      setOffers(prev => prev.map(o =>
        o.id === offer.id
          ? { ...o, extensionCount: o.extensionCount + 1, endDate: new Date(Date.parse(o.endDate) + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
          : o
      ));
    }
  };

  const stats = {
    total: offers.length,
    active: offers.filter(o => o.status === "active").length,
    pending: offers.filter(o => o.status === "pending").length,
    totalViews: offers.reduce((sum, o) => sum + o.views, 0),
    totalPurchases: offers.reduce((sum, o) => sum + o.purchases, 0),
    totalRevenue: offers.reduce((sum, o) => sum + o.revenue, 0),
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
              My Offers
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your promotional offers and track performance
            </p>
          </div>
        </div>

        <Link
          to="/company/create-offer"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
        >
          <Plus size={20} />
          Create Offer
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Offers</p>
              <p className="text-white text-2xl font-bold">{stats.total}</p>
            </div>
            <Tag className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-white text-2xl font-bold">{stats.active}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-yellow-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-white text-2xl font-bold">{stats.pending}</p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-white text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-purple-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Purchases</p>
              <p className="text-white text-2xl font-bold">{stats.totalPurchases}</p>
            </div>
            <Users className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-orange-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenue</p>
              <p className="text-white text-2xl font-bold">{(stats.totalRevenue / 1000).toFixed(0)}k kr.</p>
            </div>
            <DollarSign className="text-orange-500" size={24} />
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="expired">Expired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="active">Active Offer</option>
              <option value="weekdays">Weekdays Offer</option>
              <option value="happy_hour">Happy Hour</option>
              <option value="gift_card">Gift Card</option>
            </select>
          </div>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        {filteredOffers.length === 0 ? (
          <div className="text-center py-8">
            <Tag className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No offers found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't created any offers yet"
              }
            </p>
            {!searchTerm && statusFilter === "all" && typeFilter === "all" && (
              <Link
                to="/company/create-offer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
              >
                <Plus size={20} />
                Create Your First Offer
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-primary/30">
                  <th className="pb-3 px-2">Offer</th>
                  <th className="pb-3 px-2">Type</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2">Price</th>
                  <th className="pb-3 px-2">Duration</th>
                  <th className="pb-3 px-2 text-center">Views</th>
                  <th className="pb-3 px-2 text-center">Purchases</th>
                  <th className="pb-3 px-2 text-center">Revenue</th>
                  <th className="pb-3 px-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {currentPageItems.map((offer) => (
                  <tr key={offer.id} className="border-b border-primary/10 hover:bg-primary/5">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(offer.type)}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{offer.title}</p>
                          <p className="text-sm text-gray-400 truncate">{offer.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getTypeColor(offer.type)}`}>
                        {offer.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {getStatusIcon(offer.status)}
                        <span className={`text-sm font-medium truncate ${getStatusTextClass(offer.status)}`}>
                          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{offer.discountPrice.toLocaleString()} kr.</p>
                        <p className="text-xs text-gray-400 line-through">{offer.originalPrice.toLocaleString()} kr.</p>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{offer.startDate}</p>
                        <p className="text-xs text-gray-400">to {offer.endDate}</p>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center text-sm">{offer.views}</td>
                    <td className="py-4 px-2 text-center text-sm">{offer.purchases}</td>
                    <td className="py-4 px-2 text-center text-sm">{offer.revenue.toLocaleString()} kr.</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-all">
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleEditOffer(offer)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-all"
                        >
                          <Edit size={14} />
                        </button>
                        {offer.status === "active" && offer.extensionCount < offer.maxExtensions && (
                          <button
                            onClick={() => handleExtendOffer(offer)}
                            className="px-2 py-1 bg-green-500 text-white font-semibold rounded text-xs hover:bg-green-600 transition-all"
                          >
                            Extend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOffers.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredOffers.length)} of {filteredOffers.length} offers
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Edit Offer Modal */}
      {showEditModal && selectedOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-background border border-primary rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Edit Offer</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-all"
              >
                <XCircle className="text-gray-400" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Offer Title</label>
                  <input
                    type="text"
                    defaultValue={selectedOffer.title}
                    className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Category</label>
                  <select
                    defaultValue={selectedOffer.category}
                    className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
                  >
                    <option value={selectedOffer.category}>{selectedOffer.category}</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Hotels & Accommodation">Hotels & Accommodation</option>
                    <option value="Wellness & Spa">Wellness & Spa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Original Price</label>
                  <input
                    type="number"
                    defaultValue={selectedOffer.originalPrice}
                    className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Discount Price</label>
                  <input
                    type="number"
                    defaultValue={selectedOffer.discountPrice}
                    className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Discount %</label>
                  <input
                    type="number"
                    defaultValue={selectedOffer.discountPercentage}
                    className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Start Date</label>
                  <input
                    type="date"
                    defaultValue={selectedOffer.startDate}
                    className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">End Date</label>
                  <input
                    type="date"
                    defaultValue={selectedOffer.endDate}
                    className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-primary/30">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-background border border-primary/30 text-white font-semibold rounded-lg hover:bg-primary/10 transition-all"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

