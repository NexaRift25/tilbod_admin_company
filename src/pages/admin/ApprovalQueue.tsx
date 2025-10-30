import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Filter,
  Search,
  FileText,
  Building2,
  Eye,
  Tag,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";

export default function ApprovalQueuePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Mock data for approval queue
  const queueItems = [
    {
      id: "1",
      type: "Company",
      name: "Hotel Aurora",
      submittedAt: "30 minutes ago",
      submittedBy: "Jane Smith",
      category: "Hotels & Accommodation",
      status: "pending",
      priority: "high",
      timeRemaining: "1 hour 30 minutes",
    },
    {
      id: "2",
      type: "Offer",
      name: "Weekend Getaway Package",
      company: "Hotel Aurora",
      submittedAt: "1 hour ago",
      submittedBy: "Jane Smith",
      status: "pending",
      priority: "medium",
      timeRemaining: "2 hours",
      price: "15,000 kr.",
    },
    {
      id: "3",
      type: "Company",
      name: "Blue Lagoon Spa",
      submittedAt: "2 hours ago",
      submittedBy: "John Doe",
      category: "Wellness & Spa",
      status: "revision",
      priority: "high",
      timeRemaining: "1 hour",
      revisionCount: 1,
    },
    {
      id: "4",
      type: "Offer",
      name: "Spa Day Special",
      company: "Blue Lagoon Spa",
      submittedAt: "3 hours ago",
      submittedBy: "John Doe",
      status: "revision",
      priority: "medium",
      timeRemaining: "30 minutes",
      revisionCount: 1,
      price: "8,500 kr.",
    },
    {
      id: "5",
      type: "Company",
      name: "Restaurant Nordic",
      submittedAt: "4 hours ago",
      submittedBy: "Mike Johnson",
      category: "Food & Dining",
      status: "pending",
      priority: "low",
      timeRemaining: "4 hours",
    },
    {
      id: "6",
      type: "Offer",
      name: "Happy Hour Special",
      company: "Bar Central",
      submittedAt: "5 hours ago",
      submittedBy: "Sarah Wilson",
      status: "pending",
      priority: "low",
      timeRemaining: "3 hours",
      price: "1,200 kr.",
    },
  ];

  const filteredItems = queueItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort by priority and time remaining
  const sortedItems = [...filteredItems].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority as keyof typeof priorityOrder] !== priorityOrder[b.priority as keyof typeof priorityOrder]) {
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, endIndex);

  const handleFilterChange = (newFilter: string, filterType: 'type' | 'status') => {
    if (filterType === 'type') {
      setTypeFilter(newFilter);
    } else {
      setStatusFilter(newFilter);
    }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500";
      case "medium":
        return "bg-yellow/10 text-yellow border-yellow";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500";
    }
  };

  const queueStats = {
    total: queueItems.length,
    companies: queueItems.filter(i => i.type === "Company").length,
    offers: queueItems.filter(i => i.type === "Offer").length,
    pending: queueItems.filter(i => i.status === "pending").length,
    revision: queueItems.filter(i => i.status === "revision").length,
    urgent: queueItems.filter(i => i.priority === "high").length,
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
              Approval Queue
            </h1>
            <p className="text-gray-400 text-sm">
              Review and approve pending companies and offers
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-white text-2xl font-bold">{queueStats.total}</p>
            </div>
            <Shield className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Companies</p>
              <p className="text-white text-2xl font-bold">{queueStats.companies}</p>
            </div>
            <Building2 className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Offers</p>
              <p className="text-white text-2xl font-bold">{queueStats.offers}</p>
            </div>
            <Tag className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-gray-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-white text-2xl font-bold">{queueStats.pending}</p>
            </div>
            <Clock className="text-gray-400" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-yellow-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revision</p>
              <p className="text-white text-2xl font-bold">{queueStats.revision}</p>
            </div>
            <AlertCircle className="text-yellow" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-red-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Urgent</p>
              <p className="text-white text-2xl font-bold">{queueStats.urgent}</p>
            </div>
            <AlertCircle className="text-red-500" size={24} />
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
                placeholder="Search queue items..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => handleFilterChange(e.target.value, 'type')}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="Company">Companies</option>
              <option value="Offer">Offers</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value, 'status')}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="revision">Revision</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queue Items List */}
      <div className="space-y-4">
        {paginatedItems.length === 0 ? (
          <div className="bg-card-background border border-primary rounded-2xl p-8 text-center">
            <Shield className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No items in queue</h3>
            <p className="text-gray-400">
              All items have been reviewed
            </p>
          </div>
        ) : (
          paginatedItems.map((item) => (
            <div
              key={item.id}
              className="bg-card-background border border-primary rounded-2xl p-6 hover:border-primary/80 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {item.type === "Company" ? (
                      <Building2 className="text-primary" size={24} />
                    ) : (
                      <Tag className="text-primary" size={24} />
                    )}
                    <h3 className="text-xl font-bold text-white">{item.name}</h3>
                    <span className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold border ${getPriorityColor(item.priority)}`}>
                      {item.priority.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{getStatusText(item.status)}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    {item.company && (
                      <div>
                        <p className="text-gray-400">Company</p>
                        <p className="text-white font-medium">{item.company}</p>
                      </div>
                    )}
                    {item.category && (
                      <div>
                        <p className="text-gray-400">Category</p>
                        <p className="text-white font-medium">{item.category}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-400">Submitted By</p>
                      <p className="text-white font-medium">{item.submittedBy}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Time Remaining</p>
                      <p className="text-white font-medium">{item.timeRemaining}</p>
                    </div>
                    {item.price && (
                      <div>
                        <p className="text-gray-400">Price</p>
                        <p className="text-white font-medium">{item.price}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Submitted {item.submittedAt}</span>
                    {item.revisionCount && (
                      <span className="bg-yellow/10 text-yellow px-2 py-0.5 rounded text-xs">
                        Revision {item.revisionCount}/3
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                    <Eye size={20} />
                  </button>
                  <button className="p-2 text-green-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all">
                    <CheckCircle size={20} />
                  </button>
                  <button className="p-2 text-yellow hover:text-yellow/80 hover:bg-yellow/10 rounded-lg transition-all">
                    <AlertCircle size={20} />
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
      {sortedItems.length > itemsPerPage && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={sortedItems.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
}

