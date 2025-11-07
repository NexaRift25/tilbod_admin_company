import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock,
  AlertTriangle,
  AlertCircle,
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
import Modal from "@/components/ui/modal";
import { getAllRejectionReasons } from "@/utils/rejectionReasons";
import { calculateSLA, formatTimeRemaining, formatTimeRemainingDetailed, getSLABadgeColorClass } from "@/utils/slaTracking";
import { useTranslation } from "react-i18next";

interface ApprovalItem {
  id: string;
  type: "company" | "offer";
  name: string;
  companyName?: string;
  submittedBy: string;
  submittedAt: string;
  priority: "low" | "medium" | "high" | "urgent";
  category?: string;
  description?: string;
  status: "pending";
}

export default function ApprovalsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [approvals] = useState<ApprovalItem[]>([
    {
      id: "1",
      type: "company",
      name: "Nordic Spa & Wellness",
      companyName: "Nordic Group",
      submittedBy: "John Doe",
      submittedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
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
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingItem, setRejectingItem] = useState<ApprovalItem | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisingItem, setRevisingItem] = useState<ApprovalItem | null>(null);
  const [revisionComment, setRevisionComment] = useState("");
  const [isRequestingRevision, setIsRequestingRevision] = useState(false);

  // Force re-render every second for real-time countdown updates
  const [, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for real-time countdown

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

  const getTypeLabel = (type: ApprovalItem["type"]) =>
    t(`adminApproval.types.${type}`, { defaultValue: type });

  const getPriorityLabel = (priority: ApprovalItem["priority"]) =>
    t(`adminApproval.priority.${priority}`, { defaultValue: priority });

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

  const stats = useMemo(
    () => ({
      total: approvals.length,
      urgent: approvals.filter(a => {
        const sla = calculateSLA(a.submittedAt);
        return sla.status === "urgent" || sla.status === "expired";
      }).length,
      high: approvals.filter(a => a.priority === "high").length,
      overdue: approvals.filter(a => {
        const sla = calculateSLA(a.submittedAt);
        return sla.status === "expired";
      }).length,
    }),
    [approvals]
  );

  const statsCards = useMemo(
    () => [
      {
        id: "total",
        value: stats.total,
        icon: Clock,
        borderClass: "border-primary",
        iconColor: "text-primary",
      },
      {
        id: "urgent",
        value: stats.urgent,
        icon: AlertTriangle,
        borderClass: "border-red-500",
        iconColor: "text-red-500",
      },
      {
        id: "high",
        value: stats.high,
        icon: Clock,
        borderClass: "border-orange-500",
        iconColor: "text-orange-500",
      },
      {
        id: "overdue",
        value: stats.overdue,
        icon: AlertTriangle,
        borderClass: "border-red-500",
        iconColor: "text-red-500",
        animate: true,
      },
    ],
    [stats]
  );

  const typeOptions = useMemo(
    () => [
      { value: "all", label: t("adminApproval.filters.types.all") },
      { value: "company", label: t("adminApproval.types.company") },
      { value: "offer", label: t("adminApproval.types.offer") },
    ],
    [t]
  );

  const priorityOptions = useMemo(
    () => [
      { value: "all", label: t("adminApproval.filters.priority.all") },
      { value: "urgent", label: t("adminApproval.priority.urgent") },
      { value: "high", label: t("adminApproval.priority.high") },
      { value: "medium", label: t("adminApproval.priority.medium") },
      { value: "low", label: t("adminApproval.priority.low") },
    ],
    [t]
  );

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
              {t("adminApproval.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminApproval.subtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-red-500/10 rounded-lg transition-all"
            title={t("adminApproval.actions.refresh")}
          >
            <RefreshCw className="text-red-500" size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`bg-card-background border ${card.borderClass} rounded-2xl p-4 ${card.animate ? "animate-pulse" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t(`adminApproval.stats.${card.id}`)}</p>
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
                placeholder={t("adminApproval.filters.searchPlaceholder")}
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
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
          <div className="bg-card-background border border-primary rounded-2xl p-8 text-center">
            <CheckCircle className="mx-auto text-green mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">{t("adminApproval.empty.title")}</h3>
            <p className="text-gray-400">{t("adminApproval.empty.description")}</p>
          </div>
        ) : (
          currentPageItems.map((item) => {
            const sla = calculateSLA(item.submittedAt);
            return (
            <div
              key={item.id}
              className={`bg-card-background border rounded-2xl p-6 hover:border-primary/80 transition-all ${
                sla.status === "urgent" || sla.status === "expired" ? "border-red-500 animate-pulse" : "border-primary"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {item.type === "company" ? (
                      <Building2 className="text-primary" size={24} />
                    ) : (
                      <Tag className="text-primary" size={24} />
                    )}
                    <h3 className="text-xl font-bold text-white">{item.name}</h3>

                    <span className={`px-3 py-1 flex items-center rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                      {getPriorityIcon(item.priority)}
                      <span className="ml-1">{getPriorityLabel(item.priority)}</span>
                    </span>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSLABadgeColorClass(sla.status)}`}>
                      <Clock size={12} className="inline mr-1" />
                      {t("adminApproval.sla.badge", { time: formatTimeRemaining(sla.timeRemaining) })}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">{t("adminApproval.details.type")}</p>
                      <p className="text-white font-medium">{getTypeLabel(item.type)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t("adminApproval.details.company")}</p>
                      <p className="text-white font-medium">{item.companyName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t("adminApproval.details.submittedBy")}</p>
                      <p className="text-white font-medium">{item.submittedBy}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t("adminApproval.details.submittedAt")}</p>
                      <p className="text-white font-medium">
                        {new Date(item.submittedAt).toLocaleDateString()} at{" "}
                        {new Date(item.submittedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {item.category && (
                    <div className="mt-2">
                      <p className="text-gray-400 text-sm">
                        {t("adminApproval.details.category")}: <span className="text-white">{item.category}</span>
                      </p>
                    </div>
                  )}

                  {item.description && (
                    <div className="mt-2">
                      <p className="text-gray-400 text-sm">
                        {t("adminApproval.details.description")}: <span className="text-white">{item.description}</span>
                      </p>
                    </div>
                  )}

                  {(sla.status === "urgent" || sla.status === "expired") && (
                    <div className="mt-3 bg-red-500/10 border border-red-500 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={16} />
                        <span className="text-red-500 text-sm font-semibold">
                          {sla.status === "expired"
                            ? t("adminApproval.sla.expired")
                            : t("adminApproval.sla.urgent", {
                                time: formatTimeRemainingDetailed(sla.timeRemainingSeconds),
                              })}
                        </span>
                      </div>
                    </div>
                  )}
                  {sla.status === "warning" && (
                    <div className="mt-3 bg-yellow/10 border border-yellow rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="text-yellow" size={16} />
                        <span className="text-yellow text-sm font-semibold">
                          {t("adminApproval.sla.warning", {
                            time: formatTimeRemainingDetailed(sla.timeRemainingSeconds),
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
                  <Link
                    to={`/admin/approval-queue/${item.type}/${item.id}`}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all flex-shrink-0"
                    title={t("adminApproval.actions.view")}
                  >
                    <Eye size={20} />
                  </Link>
                  <button 
                    onClick={() => navigate(`/admin/approval-queue/${item.type}/${item.id}/commission`)}
                    className="px-4 py-2 bg-green text-white font-semibold rounded-lg hover:bg-green transition-all whitespace-nowrap"
                  >
                    {t("adminApproval.actions.approve")}
                  </button>
                  <button 
                    onClick={() => {
                      setRejectingItem(item);
                      setSelectedReason("");
                      setRejectionNotes("");
                      setShowRejectModal(true);
                    }}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all whitespace-nowrap"
                  >
                    {t("adminApproval.actions.reject")}
                  </button>
                  <button 
                    onClick={() => {
                      setRevisingItem(item);
                      setRevisionComment("");
                      setShowRevisionModal(true);
                    }}
                    className="px-4 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all whitespace-nowrap"
                  >
                    {t("adminApproval.actions.revision")}
                  </button>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {filteredApprovals.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {t("adminApproval.pagination.summary", {
              start: startIndex + 1,
              end: Math.min(endIndex, filteredApprovals.length),
              total: filteredApprovals.length,
            })}
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
              {t("adminApproval.slaPanel.title")}
            </h3>
            <p className="text-sm text-gray-300">
              {t("adminApproval.slaPanel.description")}
            </p>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectingItem(null);
          setSelectedReason("");
          setRejectionNotes("");
        }}
        title={
          rejectingItem
            ? t("adminApproval.rejectModal.title", { type: getTypeLabel(rejectingItem.type) })
            : t("adminApproval.rejectModal.fallbackTitle")
        }
        size="lg"
        footer={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
            <button
              onClick={() => {
                setShowRejectModal(false);
                setRejectingItem(null);
                setSelectedReason("");
                setRejectionNotes("");
              }}
              className="px-4 sm:px-6 py-2.5 sm:py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
            >
              {t("adminApproval.common.cancel")}
            </button>
            <button
              onClick={async () => {
                if (!selectedReason || !rejectingItem) return;
                setIsRejecting(true);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                // Here you would normally call the API to reject with reason
                console.log("Rejecting", {
                  id: rejectingItem.id,
                  type: rejectingItem.type,
                  reason: selectedReason,
                  notes: rejectionNotes,
                });
              // In a real app, this would update the backend and remove from list
              // For now, the item remains (since approvals is const)
              console.log("Item rejected and should be removed from list:", rejectingItem.id);
                setIsRejecting(false);
                setShowRejectModal(false);
                setRejectingItem(null);
                setSelectedReason("");
                setRejectionNotes("");
                window.alert(
                  t("adminApproval.rejectModal.success", {
                    type: getTypeLabel(rejectingItem.type),
                  })
                );
              }}
              disabled={!selectedReason || isRejecting || !rejectingItem}
              className="px-4 sm:px-6 py-2.5 sm:py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
            >
              {isRejecting
                ? t("adminApproval.rejectModal.actions.rejecting")
                : t("adminApproval.rejectModal.actions.confirm")}
            </button>
          </div>
        }
      >
        <div className="space-y-4 sm:space-y-6">
          {rejectingItem && (
            <div className="bg-background/50 border border-primary/30 rounded-lg p-3 sm:p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {rejectingItem.type === "company" ? (
                    <Building2 className="text-primary flex-shrink-0" size={18} />
                  ) : (
                    <Tag className="text-primary flex-shrink-0" size={18} />
                  )}
                  <h4 className="text-white font-semibold text-sm sm:text-base break-words">{rejectingItem.name}</h4>
                </div>
                {rejectingItem.companyName && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                    <span className="text-gray-400 text-xs sm:text-sm">Company</span>
                    <span className="text-white font-medium text-xs sm:text-sm break-words">{rejectingItem.companyName}</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                  <span className="text-gray-400 text-xs sm:text-sm">Submitted By</span>
                  <span className="text-white font-medium text-xs sm:text-sm break-words">{rejectingItem.submittedBy}</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm sm:text-base mb-2 block">
              {t("adminApproval.rejectModal.reasonLabel")}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative w-full">
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-background border border-primary/50 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-primary appearance-none cursor-pointer
                           hover:border-primary/70 transition-all
                           min-h-[44px] sm:min-h-[48px]
                           truncate pr-10 sm:pr-12"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23FFEE00' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25em 1.25em',
                }}
              >
                <option value="" className="bg-background text-white">
                  {t("adminApproval.rejectModal.reasonPlaceholder")}
                </option>
                {rejectingItem && getAllRejectionReasons(rejectingItem.type).map(reason => (
                  <option key={reason.id} value={reason.id} className="bg-background text-white">
                    {reason.reason}
                  </option>
                ))}
              </select>
            </div>
            {selectedReason && rejectingItem && (
              <div className="mt-2 p-2 sm:p-3 bg-background/50 border border-primary/30 rounded-lg">
                <p className="text-primary text-xs sm:text-sm font-semibold mb-1">
                  {getAllRejectionReasons(rejectingItem.type).find(r => r.id === selectedReason)?.reason}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm break-words">
                  {getAllRejectionReasons(rejectingItem.type).find(r => r.id === selectedReason)?.description}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="text-gray-400 text-sm sm:text-base mb-2 block">
              {t("adminApproval.rejectModal.notesLabel")}
            </label>
            <textarea
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              placeholder={t("adminApproval.rejectModal.notesPlaceholder")}
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-background border border-primary/50 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary resize-none min-h-[100px]"
            />
          </div>

          <div className="bg-yellow/10 border border-yellow rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertTriangle className="text-yellow flex-shrink-0 mt-0.5" size={18} />
              <div className="flex-1 min-w-0">
                <h4 className="text-yellow font-bold mb-1 text-sm sm:text-base">{t("adminApproval.rejectModal.notice.title")}</h4>
                <p className="text-xs sm:text-sm text-gray-300 break-words">
                  {t("adminApproval.rejectModal.notice.description", {
                    type: rejectingItem ? getTypeLabel(rejectingItem.type) : "",
                    name: rejectingItem?.submittedBy ?? "",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Revision Modal */}
      <Modal
        isOpen={showRevisionModal}
        onClose={() => {
          setShowRevisionModal(false);
          setRevisingItem(null);
          setRevisionComment("");
        }}
        title={
          revisingItem
            ? t("adminApproval.revisionModal.title", { type: getTypeLabel(revisingItem.type) })
            : t("adminApproval.revisionModal.fallbackTitle")
        }
        size="lg"
        footer={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
            <button
              onClick={() => {
                setShowRevisionModal(false);
                setRevisingItem(null);
                setRevisionComment("");
              }}
              className="px-4 sm:px-6 py-2.5 sm:py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
            >
              {t("adminApproval.common.cancel")}
            </button>
            <button
              onClick={async () => {
                if (!revisionComment.trim() || !revisingItem) return;
                setIsRequestingRevision(true);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                // Here you would normally call the API to request revision
                console.log("Requesting revision", {
                  id: revisingItem.id,
                  type: revisingItem.type,
                  comment: revisionComment,
                });
                setIsRequestingRevision(false);
                setShowRevisionModal(false);
                setRevisingItem(null);
                setRevisionComment("");
                window.alert(
                  t("adminApproval.revisionModal.success", {
                    type: getTypeLabel(revisingItem.type),
                  })
                );
              }}
              disabled={!revisionComment.trim() || isRequestingRevision || !revisingItem}
              className="px-4 sm:px-6 py-2.5 sm:py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
            >
              {isRequestingRevision
                ? t("adminApproval.revisionModal.actions.requesting")
                : t("adminApproval.revisionModal.actions.submit")}
            </button>
          </div>
        }
      >
        <div className="space-y-4 sm:space-y-6">
          {revisingItem && (
            <div className="bg-background/50 border border-primary/30 rounded-lg p-3 sm:p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {revisingItem.type === "company" ? (
                    <Building2 className="text-primary flex-shrink-0" size={18} />
                  ) : (
                    <Tag className="text-primary flex-shrink-0" size={18} />
                  )}
                  <h4 className="text-white font-semibold text-sm sm:text-base break-words">{revisingItem.name}</h4>
                </div>
                {revisingItem.companyName && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                    <span className="text-gray-400 text-xs sm:text-sm">Company</span>
                    <span className="text-white font-medium text-xs sm:text-sm break-words">{revisingItem.companyName}</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                  <span className="text-gray-400 text-xs sm:text-sm">Submitted By</span>
                  <span className="text-white font-medium text-xs sm:text-sm break-words">{revisingItem.submittedBy}</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm sm:text-base mb-2 block">
              {t("adminApproval.revisionModal.commentLabel")}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={revisionComment}
              onChange={(e) => setRevisionComment(e.target.value)}
              placeholder={t("adminApproval.revisionModal.commentPlaceholder")}
              rows={6}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-background border border-primary/50 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary resize-none min-h-[150px]"
            />
            <p className="text-gray-500 text-xs mt-2">
              {t("adminApproval.revisionModal.characterCount", { count: revisionComment.length })}
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
              <div className="flex-1 min-w-0">
                <h4 className="text-blue-500 font-bold mb-1 text-sm sm:text-base">{t("adminApproval.revisionModal.notice.title")}</h4>
                <p className="text-xs sm:text-sm text-gray-300 break-words">
                  {t("adminApproval.revisionModal.notice.description", {
                    type: revisingItem ? getTypeLabel(revisingItem.type) : "",
                    name: revisingItem?.submittedBy ?? "",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

