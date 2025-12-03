import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Gift,
  CheckCircle,
  XCircle,
  Save,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/modal";

interface OfferCategory {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  applicableToActiveOffers: boolean;
  applicableToGiftCards: boolean;
  createdAt: string;
  updatedAt: string;
  offersCount?: number;
}

export default function OfferCategoriesPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "is" ? "is-IS" : "en-US";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<OfferCategory | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [categories, setCategories] = useState<OfferCategory[]>([
    {
      id: "1",
      name: "Black Friday",
      description: "Annual shopping event with massive discounts",
      startDate: "2024-11-24",
      endDate: "2024-11-27",
      status: "inactive",
      applicableToActiveOffers: true,
      applicableToGiftCards: true,
      createdAt: "2024-10-15T10:00:00Z",
      updatedAt: "2024-10-15T10:00:00Z",
      offersCount: 67,
    },
    {
      id: "2",
      name: "Tax-free day",
      description: "Special day with tax-free shopping benefits",
      startDate: "2024-12-20",
      endDate: "2024-12-20",
      status: "active",
      applicableToActiveOffers: true,
      applicableToGiftCards: true,
      createdAt: "2024-11-01T10:00:00Z",
      updatedAt: "2024-11-01T10:00:00Z",
      offersCount: 45,
    },
    {
      id: "3",
      name: "Winter Sale",
      description: "Seasonal winter discounts and promotions",
      startDate: "2024-12-01",
      endDate: "2025-02-28",
      status: "active",
      applicableToActiveOffers: true,
      applicableToGiftCards: true,
      createdAt: "2024-11-15T10:00:00Z",
      updatedAt: "2024-11-15T10:00:00Z",
      offersCount: 123,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "active" as "active" | "inactive",
    applicableToActiveOffers: true,
    applicableToGiftCards: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusFilterOptions = useMemo(
    () => [
      { value: "all", label: t("adminOfferCategories.filters.status.all") },
      { value: "active", label: t("adminOfferCategories.filters.status.active") },
      { value: "inactive", label: t("adminOfferCategories.filters.status.inactive") },
    ],
    [t]
  );

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || category.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  const formatDate = (value: string) =>
    value ? new Date(value).toLocaleDateString(locale) : "";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("adminOfferCategories.form.errors.nameRequired");
    }
    if (!formData.description.trim()) {
      newErrors.description = t("adminOfferCategories.form.errors.descriptionRequired");
    }
    if (!formData.startDate) {
      newErrors.startDate = t("adminOfferCategories.form.errors.startDateRequired");
    }
    if (!formData.endDate) {
      newErrors.endDate = t("adminOfferCategories.form.errors.endDateRequired");
    }
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = t("adminOfferCategories.form.errors.endDateBeforeStart");
      }
    }
    if (!formData.applicableToActiveOffers && !formData.applicableToGiftCards) {
      newErrors.applicableTo = t("adminOfferCategories.form.errors.applicableToRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "active",
      applicableToActiveOffers: true,
      applicableToGiftCards: true,
    });
    setErrors({});
    setEditingCategory(null);
    setShowCreateModal(true);
  };

  const handleEdit = (category: OfferCategory) => {
    setFormData({
      name: category.name,
      description: category.description,
      startDate: category.startDate,
      endDate: category.endDate,
      status: category.status,
      applicableToActiveOffers: category.applicableToActiveOffers,
      applicableToGiftCards: category.applicableToGiftCards,
    });
    setErrors({});
    setEditingCategory(category);
    setShowCreateModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t("adminOfferCategories.delete.confirm"))) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (editingCategory) {
      // Update existing category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                ...formData,
                updatedAt: new Date().toISOString(),
              }
            : cat
        )
      );
    } else {
      // Create new category
      const newCategory: OfferCategory = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        offersCount: 0,
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    setIsSaving(false);
    setShowCreateModal(false);
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "active",
      applicableToActiveOffers: true,
      applicableToGiftCards: true,
    });
    setEditingCategory(null);
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "active",
      applicableToActiveOffers: true,
      applicableToGiftCards: true,
    });
    setEditingCategory(null);
    setErrors({});
  };

  const getStatusColor = (status: string) =>
    status === "active"
      ? "bg-green/10 text-green border-green"
      : "bg-gray-500/10 text-gray-400 border-gray-500";

  const stats = useMemo(
    () => ({
      total: categories.length,
      active: categories.filter((c) => c.status === "active").length,
      inactive: categories.filter((c) => c.status === "inactive").length,
    }),
    [categories]
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
              {t("adminOfferCategories.header.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminOfferCategories.header.subtitle")}
            </p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all"
        >
          <Plus size={18} />
          {t("adminOfferCategories.header.createButton")}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminOfferCategories.stats.total")}
              </p>
              <p className="text-white text-2xl font-bold">{stats.total}</p>
            </div>
            <Tag className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminOfferCategories.stats.active")}
              </p>
              <p className="text-white text-2xl font-bold">{stats.active}</p>
            </div>
            <CheckCircle className="text-green" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-gray-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminOfferCategories.stats.inactive")}
              </p>
              <p className="text-white text-2xl font-bold">{stats.inactive}</p>
            </div>
            <XCircle className="text-gray-400" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card-background border border-primary rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={t("adminOfferCategories.filters.searchPlaceholder")}
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
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary text-sm"
            >
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center">
            <Tag className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">
              {t("adminOfferCategories.empty.title")}
            </h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? t("adminOfferCategories.empty.searchAdjust")
                : t("adminOfferCategories.empty.createFirst")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-background border border-primary/50 rounded-xl p-6 hover:border-primary transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Tag className="text-primary" size={24} />
                      <h3 className="text-xl font-bold text-white">
                        {category.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          category.status
                        )}`}
                      >
                        {t(`adminOfferCategories.status.${category.status}`)}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">
                      {category.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">
                          {t("adminOfferCategories.table.startDate")}
                        </p>
                        <p className="text-white font-medium flex items-center gap-2">
                          <Calendar size={16} />
                          {formatDate(category.startDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">
                          {t("adminOfferCategories.table.endDate")}
                        </p>
                        <p className="text-white font-medium flex items-center gap-2">
                          <Calendar size={16} />
                          {formatDate(category.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">
                          {t("adminOfferCategories.table.applicableTo")}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {category.applicableToActiveOffers && (
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-semibold">
                              {t("adminOfferCategories.applicableTo.activeOffers")}
                            </span>
                          )}
                          {category.applicableToGiftCards && (
                            <span className="px-2 py-1 bg-orange-500/10 text-orange-500 rounded text-xs font-semibold flex items-center gap-1">
                              <Gift size={12} />
                              {t("adminOfferCategories.applicableTo.giftCards")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400">
                          {t("adminOfferCategories.table.offersCount")}
                        </p>
                        <p className="text-white font-medium">
                          {category.offersCount || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      title={t("adminOfferCategories.actions.edit")}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      title={t("adminOfferCategories.actions.delete")}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        title={
          editingCategory
            ? t("adminOfferCategories.form.editTitle")
            : t("adminOfferCategories.form.createTitle")
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminOfferCategories.form.nameLabel")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              placeholder={t("adminOfferCategories.form.namePlaceholder")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminOfferCategories.form.descriptionLabel")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary resize-none"
              placeholder={t("adminOfferCategories.form.descriptionPlaceholder")}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminOfferCategories.form.startDateLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                }
                className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminOfferCategories.form.endDateLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminOfferCategories.form.statusLabel")}
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as "active" | "inactive",
                }))
              }
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="active">
                {t("adminOfferCategories.status.active")}
              </option>
              <option value="inactive">
                {t("adminOfferCategories.status.inactive")}
              </option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-3 block">
              {t("adminOfferCategories.form.applicableToLabel")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.applicableToActiveOffers}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      applicableToActiveOffers: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 rounded border-primary/50 bg-background text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-white">
                  {t("adminOfferCategories.applicableTo.activeOffers")}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.applicableToGiftCards}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      applicableToGiftCards: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 rounded border-primary/50 bg-background text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-white flex items-center gap-2">
                  <Gift size={16} />
                  {t("adminOfferCategories.applicableTo.giftCards")}
                </span>
              </label>
            </div>
            {errors.applicableTo && (
              <p className="text-red-500 text-xs mt-1">{errors.applicableTo}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-primary/30">
            <button
              onClick={handleCloseModal}
              className="px-6 py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all"
            >
              {t("adminOfferCategories.form.cancelButton")}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                  {t("adminOfferCategories.form.saving")}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {t("adminOfferCategories.form.saveButton")}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

