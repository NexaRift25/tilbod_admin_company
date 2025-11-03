import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Tag,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  Percent,
} from "lucide-react";
import Modal from "@/components/ui/modal";

interface DiscountLabel {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  description: string;
  status: "active" | "inactive";
  applicableTo: ("active" | "weekdays" | "happy_hour" | "gift_card")[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

const DISCOUNT_LABELS_STORAGE_KEY = "tilbod_discount_labels";

export default function DiscountLabelsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingLabel, setEditingLabel] = useState<DiscountLabel | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Load from localStorage on mount
  const [labels, setLabels] = useState<DiscountLabel[]>(() => {
    const stored = localStorage.getItem(DISCOUNT_LABELS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    // Default labels
    return [
      {
        id: "1",
        name: "Early Bird",
        type: "percentage",
        value: 10,
        description: "10% discount for early bookings",
        status: "active",
        applicableTo: ["active", "weekdays"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 15,
      },
      {
        id: "2",
        name: "Holiday Special",
        type: "percentage",
        value: 20,
        description: "20% discount during holiday seasons",
        status: "active",
        applicableTo: ["active", "weekdays", "happy_hour"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 8,
      },
      {
        id: "3",
        name: "Bulk Discount",
        type: "fixed",
        value: 5000,
        description: "5000 kr. off for bulk purchases",
        status: "active",
        applicableTo: ["gift_card"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 3,
      },
    ];
  });

  // Save to localStorage whenever labels change
  useEffect(() => {
    localStorage.setItem(DISCOUNT_LABELS_STORAGE_KEY, JSON.stringify(labels));
  }, [labels]);

  const [formData, setFormData] = useState({
    name: "",
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    description: "",
    status: "active" as "active" | "inactive",
    applicableTo: [] as ("active" | "weekdays" | "happy_hour" | "gift_card")[],
  });

  const filteredLabels = labels.filter(label => {
    const matchesSearch = label.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         label.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || label.status === statusFilter;
    const matchesType = typeFilter === "all" || label.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpenModal = (label?: DiscountLabel) => {
    if (label) {
      setEditingLabel(label);
      setFormData({
        name: label.name,
        type: label.type,
        value: label.value,
        description: label.description,
        status: label.status,
        applicableTo: [...label.applicableTo],
      });
    } else {
      setEditingLabel(null);
      setFormData({
        name: "",
        type: "percentage",
        value: 0,
        description: "",
        status: "active",
        applicableTo: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLabel(null);
    setFormData({
      name: "",
      type: "percentage",
      value: 0,
      description: "",
      status: "active",
      applicableTo: [],
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || formData.value <= 0) {
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingLabel) {
      // Update existing label
      setLabels(prev => prev.map(label =>
        label.id === editingLabel.id
          ? {
              ...label,
              name: formData.name,
              type: formData.type,
              value: formData.value,
              description: formData.description,
              status: formData.status,
              applicableTo: formData.applicableTo,
              updatedAt: new Date().toISOString(),
            }
          : label
      ));
    } else {
      // Add new label
      const newLabel: DiscountLabel = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        value: formData.value,
        description: formData.description,
        status: formData.status,
        applicableTo: formData.applicableTo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
      };
      setLabels(prev => [...prev, newLabel]);
    }

    setIsSaving(false);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setLabels(prev => prev.filter(label => label.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleToggleStatus = (id: string) => {
    setLabels(prev => prev.map(label =>
      label.id === id
        ? {
            ...label,
            status: label.status === "active" ? "inactive" : "active",
            updatedAt: new Date().toISOString(),
          }
        : label
    ));
  };

  const handleToggleApplicableTo = (offerType: "active" | "weekdays" | "happy_hour" | "gift_card") => {
    setFormData(prev => {
      const current = prev.applicableTo;
      const index = current.indexOf(offerType);
      if (index > -1) {
        return { ...prev, applicableTo: current.filter(t => t !== offerType) };
      } else {
        return { ...prev, applicableTo: [...current, offerType] };
      }
    });
  };

  const getStatusIcon = (status: string) => {
    return status === "active" ? (
      <CheckCircle className="text-green" size={20} />
    ) : (
      <XCircle className="text-gray-400" size={20} />
    );
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green/10 text-green border-green"
      : "bg-gray-500/10 text-gray-400 border-gray-500";
  };

  const getOfferTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      active: "Active Offer",
      weekdays: "Weekdays Offer",
      happy_hour: "Happy Hour",
      gift_card: "Gift Card",
    };
    return labels[type] || type;
  };

  const labelStats = {
    total: labels.length,
    active: labels.filter(l => l.status === "active").length,
    inactive: labels.filter(l => l.status === "inactive").length,
    percentage: labels.filter(l => l.type === "percentage").length,
    fixed: labels.filter(l => l.type === "fixed").length,
    totalUsage: labels.reduce((sum, l) => sum + l.usageCount, 0),
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
              Discount Labels
            </h1>
            <p className="text-gray-400 text-sm">
              Create and manage discount labels for offers
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
        >
          <Plus size={20} />
          Create Label
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Labels</p>
              <p className="text-white text-2xl font-bold">{labelStats.total}</p>
            </div>
            <Tag className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-white text-2xl font-bold">{labelStats.active}</p>
            </div>
            <CheckCircle className="text-green" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Percentage</p>
              <p className="text-white text-2xl font-bold">{labelStats.percentage}</p>
            </div>
            <Percent className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-purple-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Fixed Amount</p>
              <p className="text-white text-2xl font-bold">{labelStats.fixed}</p>
            </div>
            <Tag className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-yellow rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Usage</p>
              <p className="text-white text-2xl font-bold">{labelStats.totalUsage}</p>
            </div>
            <AlertCircle className="text-yellow" size={24} />
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
                placeholder="Search discount labels..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Labels List */}
      <div className="space-y-4">
        {filteredLabels.length === 0 ? (
          <div className="bg-card-background border border-primary rounded-2xl p-8 text-center">
            <Tag className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No discount labels found</h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first discount label to get started"}
            </p>
          </div>
        ) : (
          filteredLabels.map((label) => (
            <div
              key={label.id}
              className="bg-card-background border border-primary rounded-2xl p-6 hover:border-primary/80 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <Tag className="text-primary" size={24} />
                    <h3 className="text-xl font-bold text-white">{label.name}</h3>
                    <span className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold border ${getStatusColor(label.status)}`}>
                      {getStatusIcon(label.status)}
                      <span className="ml-1 capitalize">{label.status}</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      label.type === "percentage"
                        ? "bg-blue-500/10 text-blue-500 border border-blue-500"
                        : "bg-purple-500/10 text-purple-500 border border-purple-500"
                    }`}>
                      {label.type === "percentage" ? `${label.value}%` : `${label.value.toLocaleString()} kr.`}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{label.description}</p>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-400 text-sm">Applicable To:</p>
                    <div className="flex flex-wrap gap-2">
                      {label.applicableTo.map(type => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                        >
                          {getOfferTypeLabel(type)}
                        </span>
                      ))}
                      {label.applicableTo.length === 0 && (
                        <span className="text-gray-500 text-sm">None selected</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Usage Count</p>
                      <p className="text-white font-medium">{label.usageCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Type</p>
                      <p className="text-white font-medium capitalize">{label.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Last Updated</p>
                      <p className="text-white font-medium">
                        {new Date(label.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleStatus(label.id)}
                    className={`p-2 rounded-lg transition-all ${
                      label.status === "active"
                        ? "text-gray-400 hover:text-yellow hover:bg-yellow/10"
                        : "text-gray-400 hover:text-green hover:bg-green/10"
                    }`}
                    title={label.status === "active" ? "Deactivate" : "Activate"}
                  >
                    {label.status === "active" ? (
                      <XCircle size={20} />
                    ) : (
                      <CheckCircle size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenModal(label)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title="Edit Label"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(label.id)}
                    className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete Label"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingLabel ? "Edit Discount Label" : "Create Discount Label"}
        size="2xl"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleCloseModal}
              className="px-6 py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name.trim() || formData.value <= 0 || isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {editingLabel ? "Update Label" : "Create Label"}
                </>
              )}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Label Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Early Bird, Holiday Special"
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as "percentage" | "fixed" }))}
                className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (kr.)</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                placeholder={formData.type === "percentage" ? "e.g., 10" : "e.g., 5000"}
                min="0"
                max={formData.type === "percentage" ? "100" : undefined}
                step={formData.type === "percentage" ? "0.1" : "1"}
                className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
              <p className="text-gray-500 text-xs mt-1">
                {formData.type === "percentage" ? "Enter percentage (0-100)" : "Enter amount in kr."}
              </p>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe when and how this discount label should be used"
              rows={3}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Applicable To Offer Types <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(["active", "weekdays", "happy_hour", "gift_card"] as const).map(offerType => (
                <button
                  key={offerType}
                  type="button"
                  onClick={() => handleToggleApplicableTo(offerType)}
                  className={`p-3 rounded-lg border transition-all text-sm ${
                    formData.applicableTo.includes(offerType)
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-background border-primary/30 text-gray-400 hover:bg-primary/5"
                  }`}
                >
                  {getOfferTypeLabel(offerType)}
                </button>
              ))}
            </div>
            {formData.applicableTo.length === 0 && (
              <p className="text-red-500 text-xs mt-1">Please select at least one offer type</p>
            )}
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Status
            </label>
            <div className="flex items-center gap-4">
              <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition-all ${
                formData.status === "active"
                  ? "bg-green/10"
                  : "bg-background"
              }`}>
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === "active"}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "active" | "inactive" }))}
                  className="w-4 h-4 text-green bg-background border-green focus:ring-green focus:ring-2"
                />
                <span className={`flex items-center gap-2 font-medium text-green`}>
                  <CheckCircle className="text-green" size={16} />
                  Active
                </span>
              </label>
              <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition-all`}>
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === "inactive"}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "active" | "inactive" }))}
                  className="w-4 h-4 text-red-500 bg-background border-red-500 focus:ring-red-500 focus:ring-2"
                />
                <span className={`flex items-center gap-2 font-medium text-red-500`}>
                  <XCircle className="text-red-500" size={16} />
                  Inactive
                </span>
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="px-6 py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(showDeleteConfirm!)}
              className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-500/90 transition-all"
            >
              Delete Label
            </button>
          </div>
        }
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-500" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Delete Discount Label</h3>
            <p className="text-gray-400 text-sm">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-gray-300">
          Are you sure you want to delete{" "}
          <span className="text-white font-semibold">
            {labels.find(l => l.id === showDeleteConfirm)?.name}
          </span>
          ? This label will be removed from all offers using it.
        </p>
      </Modal>
    </div>
  );
}

