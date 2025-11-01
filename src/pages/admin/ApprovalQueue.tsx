"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Building2,
  Tag,
  Timer,
  ArrowLeft,
  Filter,
  Search,
  RefreshCw
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";

interface ApprovalItem {
  id: string;
  type: "company" | "offer";
  name: string;
  companyName?: string;
  submittedBy: string;
  submittedAt: string;
  timeRemaining: number; // minutes remaining
  priority: "low" | "medium" | "high" | "urgent";
  category?: string;
  description?: string;
  status: "pending";
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    {
      id: "1",
      type: "company",
      name: "Nordic Spa & Wellness",
      companyName: "Nordic Group",
      submittedBy: "John Doe",
      submittedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      timeRemaining: 25,
      priority: "high",
      category: "Wellness & Spa",
      status: "pending"
    },
    {
      id: "2",
      type: "offer",
      name: "Christmas Special - 50% Off",
      companyName: "Hotel Aurora",
      submittedBy: "Jane Smith",
      submittedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 minutes ago
      timeRemaining: 18,
      priority: "high",
      description: "Holiday season promotion for hotel stays",
      status: "pending"
    },
    {
      id: "3",
      type: "company",
      name: "Reykjavik Bar & Lounge",
      companyName: "Nightlife Co.",
      submittedBy: "Mike Johnson",
      submittedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
      timeRemaining: 10,
      priority: "urgent",
      category: "Food & Dining",
      status: "pending"
    },
    {
      id: "4",
      type: "offer",
      name: "Weekend Getaway Package",
      companyName: "Mountain Resort",
      submittedBy: "Sarah Wilson",
      submittedAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(), // 28 minutes ago
      timeRemaining: 2,
      priority: "urgent",
      description: "Weekend package with spa and dining included",
      status: "pending"
    },
    {
      id: "5",
      type: "company",
      name: "Blue Lagoon Tours",
      companyName: "Iceland Adventures",
      submittedBy: "Alex Chen",
      submittedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      timeRemaining: 22,
      priority: "medium",
      category: "Activities & Entertainment",
      status: "pending"
    },
    {
      id: "6",
      type: "offer",
      name: "Spa Day Special",
      companyName: "Blue Lagoon Spa",
      submittedBy: "Maria Rodriguez",
      submittedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      timeRemaining: 15,
      priority: "medium",
      description: "Full day spa experience with treatments",
      status: "pending"
    },
    {
      id: "7",
      type: "company",
      name: "Restaurant Downtown",
      companyName: "Food Group Ltd",
      submittedBy: "David Kim",
      submittedAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
      timeRemaining: 8,
      priority: "high",
      category: "Food & Dining",
      status: "pending"
    },
    {
      id: "8",
      type: "offer",
      name: "Business Lunch Deal",
      companyName: "Restaurant Downtown",
      submittedBy: "Emma Taylor",
      submittedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      timeRemaining: 5,
      priority: "urgent",
      description: "Special lunch menu for business meetings",
      status: "pending"
    },
    {
      id: "9",
      type: "company",
      name: "Fashion Boutique",
      companyName: "Style Corp",
      submittedBy: "Lisa Wang",
      submittedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      timeRemaining: 12,
      priority: "low",
      category: "Shopping & Retail",
      status: "pending"
    },
    {
      id: "10",
      type: "offer",
      name: "Winter Collection Sale",
      companyName: "Fashion Boutique",
      submittedBy: "Tom Anderson",
      submittedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      timeRemaining: 0,
      priority: "urgent",
      description: "End of season sale on winter clothing",
      status: "pending"
    },
    {
      id: "11",
      type: "company",
      name: "Gym & Fitness Center",
      companyName: "Health First",
      submittedBy: "Rachel Green",
      submittedAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
      timeRemaining: 23,
      priority: "medium",
      category: "Health & Fitness",
      status: "pending"
    },
    {
      id: "12",
      type: "offer",
      name: "Personal Training Package",
      companyName: "Gym & Fitness Center",
      submittedBy: "Mark Johnson",
      submittedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
      timeRemaining: 16,
      priority: "medium",
      description: "6-week personal training program",
      status: "pending"
    },
    {
      id: "13",
      type: "company",
      name: "Art Gallery",
      companyName: "Culture Hub",
      submittedBy: "Sophie Brown",
      submittedAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
      timeRemaining: 21,
      priority: "low",
      category: "Activities & Entertainment",
      status: "pending"
    },
    {
      id: "14",
      type: "offer",
      name: "Art Workshop Series",
      companyName: "Art Gallery",
      submittedBy: "Chris Davis",
      submittedAt: new Date(Date.now() - 26 * 60 * 1000).toISOString(),
      timeRemaining: 4,
      priority: "high",
      description: "Weekly art workshops for beginners",
      status: "pending"
    },
    {
      id: "15",
      type: "company",
      name: "Travel Agency",
      companyName: "Wanderlust Tours",
      submittedBy: "Nina Patel",
      submittedAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
      timeRemaining: 19,
      priority: "medium",
      category: "Transportation",
      status: "pending"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Update countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setApprovals(prev => prev.map(item => ({
        ...item,
        timeRemaining: Math.max(0, item.timeRemaining - 1)
      })));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Filter approvals
  const filteredApprovals = approvals.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    return matchesSearch && matchesType && matchesPriority;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredApprovals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = filteredApprovals.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, priorityFilter]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500/10 text-red-500 border-red-500";
      case "high": return "bg-orange-500/10 text-orange-500 border-orange-500";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <AlertTriangle size={16} />;
      case "high": return <Clock size={16} />;
      case "medium": return <Timer size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const formatTimeRemaining = (minutes: number) => {
    if (minutes <= 0) return "Overdue";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const stats = {
    total: approvals.length,
    urgent: approvals.filter(a => a.priority === "urgent").length,
    high: approvals.filter(a => a.priority === "high").length,
    overdue: approvals.filter(a => a.timeRemaining <= 0).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/dashboard"
            className="p-2 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <ArrowLeft className="text-red-500" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Approval Queue
            </h1>
            <p className="text-gray-400 text-sm">
              Review pending companies and offers (30-minute SLA)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-red-500/10 rounded-lg transition-all">
            <RefreshCw className="text-red-500" size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Pending</p>
              <p className="text-white text-2xl font-bold">{stats.total}</p>
            </div>
            <Clock className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-red-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Urgent</p>
              <p className="text-white text-2xl font-bold">{stats.urgent}</p>
            </div>
            <AlertTriangle className="text-red-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-orange-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">High Priority</p>
              <p className="text-white text-2xl font-bold">{stats.high}</p>
            </div>
            <Clock className="text-orange-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-red-500 rounded-2xl p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Overdue</p>
              <p className="text-white text-2xl font-bold">{stats.overdue}</p>
            </div>
            <AlertTriangle className="text-red-500" size={24} />
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
                placeholder="Search approvals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="company">Companies</option>
              <option value="offer">Offers</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
          <div className="bg-card-background border border-primary rounded-2xl p-8 text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No pending approvals</h3>
            <p className="text-gray-400">
              All items have been reviewed or no items match your current filters
            </p>
          </div>
        ) : (
          currentPageItems.map((item) => (
            <div
              key={item.id}
              className={`bg-card-background border rounded-2xl p-6 hover:border-primary/80 transition-all ${
                item.timeRemaining <= 5 ? "border-red-500 animate-pulse" : "border-primary"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {item.type === "company" ? (
                      <Building2 className="text-primary" size={24} />
                    ) : (
                      <Tag className="text-primary" size={24} />
                    )}
                    <h3 className="text-xl font-bold text-white">{item.name}</h3>

                    <span className={`px-3 py-1 flex items-center rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                      {getPriorityIcon(item.priority)}
                      <span className="ml-1 capitalize">{item.priority}</span>
                    </span>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.timeRemaining <= 5 ? "bg-red-500/10 text-red-500" :
                      item.timeRemaining <= 10 ? "bg-orange-500/10 text-orange-500" :
                      "bg-green/10 text-green"
                    }`}>
                      <Clock size={12} className="inline mr-1" />
                      {formatTimeRemaining(item.timeRemaining)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Type</p>
                      <p className="text-white font-medium capitalize">{item.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Company</p>
                      <p className="text-white font-medium">{item.companyName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Submitted By</p>
                      <p className="text-white font-medium">{item.submittedBy}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Submitted</p>
                      <p className="text-white font-medium">
                        {new Date(item.submittedAt).toLocaleDateString()} at{" "}
                        {new Date(item.submittedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {item.category && (
                    <div className="mt-2">
                      <p className="text-gray-400 text-sm">Category: <span className="text-white">{item.category}</span></p>
                    </div>
                  )}

                  {item.description && (
                    <div className="mt-2">
                      <p className="text-gray-400 text-sm">Description: <span className="text-white">{item.description}</span></p>
                    </div>
                  )}

                  {item.timeRemaining <= 5 && (
                    <div className="mt-3 bg-red-500/10 border border-red-500 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={16} />
                        <span className="text-red-500 text-sm font-semibold">
                          URGENT: Only {item.timeRemaining} minutes remaining!
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
                  <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all flex-shrink-0" title="View Details">
                    <Eye size={20} />
                  </button>
                  <button className="px-4 py-2 bg-green text-white font-semibold rounded-lg hover:bg-green transition-all whitespace-nowrap">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all whitespace-nowrap">
                    Reject
                  </button>
                  <button className="px-4 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all whitespace-nowrap">
                    Revision
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredApprovals.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredApprovals.length)} of {filteredApprovals.length} approvals
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* SLA Warning */}
      <div className="bg-red-500/10 border border-red-500 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-red-500 font-bold mb-1">
              30-Minute SLA Requirement
            </h3>
            <p className="text-sm text-gray-300">
              All approval requests must be reviewed within 30 minutes of submission.
              Items marked as urgent require immediate attention to maintain service quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

