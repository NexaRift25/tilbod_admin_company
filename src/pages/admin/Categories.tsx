import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderOpen,
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
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/modal";

interface Category {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  offersCount?: number;
  companiesCount?: number;
}

export default function CategoriesPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "is" ? "is-IS" : "en-US";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Hotels & Accommodation",
      description: "Hotels, guesthouses, and accommodation services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 245,
      companiesCount: 32,
    },
    {
      id: "2",
      name: "Food & Dining",
      description: "Restaurants, cafes, bars, and food services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 456,
      companiesCount: 45,
    },
    {
      id: "3",
      name: "Wellness & Spa",
      description: "Spas, wellness centers, and relaxation services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 123,
      companiesCount: 28,
    },
    {
      id: "4",
      name: "Activities & Entertainment",
      description: "Tours, activities, and entertainment services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 234,
      companiesCount: 25,
    },
    {
      id: "5",
      name: "Shopping & Retail",
      description: "Retail stores, shops, and shopping services",
      status: "inactive",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T14:30:00Z",
      offersCount: 89,
      companiesCount: 15,
    },
    {
      id: "6",
      name: "Beauty & Personal Care",
      description: "Beauty salons, personal care, and grooming services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 67,
      companiesCount: 11,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active" as "active" | "inactive",
  });

  const statusFilterOptions = useMemo(
    () => [
      { value: "all", label: t("adminCategories.filters.status.all") },
      { value: "active", label: t("adminCategories.filters.status.active") },
      { value: "inactive", label: t("adminCategories.filters.status.inactive") },
    ],
    [t]
  );

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || category.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        status: category.status,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        status: "active",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      status: "active",
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      window.alert(t("adminCategories.notifications.validation"));
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                name: formData.name,
                description: formData.description,
                status: formData.status,
                updatedAt: new Date().toISOString(),
              }
            : cat
        )
      );
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        offersCount: 0,
        companiesCount: 0,
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    setIsSaving(false);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleToggleStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id
          ? {
              ...cat,
              status: cat.status === "active" ? "inactive" : "active",
              updatedAt: new Date().toISOString(),
            }
          : cat
      )
    );
  };

  const getStatusColor = (status: string) =>
    status === "active"
      ? "bg-green/10 text-green border-green"
      : "bg-red-500/50 text-gray-400 border-gray-500";

  const getStatusLabel = (status: Category["status"]) =>
    t(`adminCategories.status.${status}`);

  const categoryStats = useMemo(
    () => ({
      total: categories.length,
      active: categories.filter((c) => c.status === "active").length,
      inactive: categories.filter((c) => c.status === "inactive").length,
      totalOffers: categories.reduce((sum, c) => sum + (c.offersCount || 0), 0),
      totalCompanies: categories.reduce((sum, c) => sum + (c.companiesCount || 0), 0),
    }),
    [categories]
  );

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const selectedCategory = showDeleteConfirm
    ? categories.find((c) => c.id === showDeleteConfirm)
    : null;

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
              {t("adminCategories.header.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminCategories.header.subtitle")}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
        >
          <Plus size={20} />
          {t("adminCategories.header.addButton")}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminCategories.stats.total")}
              </p>
              <p className="text-white text-2xl font-bold">{categoryStats.total}</p>
            </div>
            <FolderOpen className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminCategories.stats.active")}
              </p>
              <p className="text-white text-2xl font-bold">{categoryStats.active}</p>
            </div>
            <CheckCircle className="text-green" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-gray-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminCategories.stats.inactive")}
              </p>
              <p className="text-white text-2xl font-bold">{categoryStats.inactive}</p>
            </div>
            <XCircle className="text-gray-400" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminCategories.stats.totalOffers")}
              </p>
              <p className="text-white text-2xl font-bold">{categoryStats.totalOffers}</p>
            </div>
            <AlertCircle className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-purple-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminCategories.stats.totalCompanies")}
              </p>
              <p className="text-white text-2xl font-bold">{categoryStats.totalCompanies}</p>
            </div>
            <FolderOpen className="text-purple-500" size={24} />
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
                placeholder={t("adminCategories.filters.searchPlaceholder") ?? ""}
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
            <FolderOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">
              {t("adminCategories.empty.title")}
            </h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? t("adminCategories.empty.searchAdjust")
                : t("adminCategories.empty.createFirst")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-primary/50">
                  <th className="pb-3">{t("adminCategories.table.name")}</th>
                  <th className="pb-3">{t("adminCategories.table.description")}</th>
                  <th className="pb-3">{t("adminCategories.table.status")}</th>
                  <th className="pb-3">{t("adminCategories.table.companies")}</th>
                  <th className="pb-3">{t("adminCategories.table.offers")}</th>
                  <th className="pb-3">{t("adminCategories.table.updated")}</th>
                  <th className="pb-3">{t("adminCategories.table.actions")}</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b border-primary/10 hover:bg-primary/5">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="text-primary" size={18} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <p
                        className="text-sm text-gray-300 max-w-xs truncate"
                        title={category.description}
                      >
                        {category.description}
                      </p>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          category.status
                        )}`}
                      >
                        {category.status === "active" ? (
                          <CheckCircle className="text-green" size={12} />
                        ) : (
                          <XCircle className="text-gray-400" size={12} />
                        )}
                        <span>{getStatusLabel(category.status)}</span>
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-medium">{category.companiesCount || 0}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-medium">{category.offersCount || 0}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-sm text-gray-300">{formatDate(category.updatedAt)}</p>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(category.id)}
                          className={`p-2 rounded-lg transition-all ${
                            category.status === "active"
                              ? "text-gray-400 hover:text-yellow hover:bg-yellow/10"
                              : "text-gray-400 hover:text-green hover:bg-green/10"
                          }`}
                          title={
                            category.status === "active"
                              ? t("adminCategories.actions.deactivate")
                              : t("adminCategories.actions.activate")
                          }
                        >
                          {category.status === "active" ? (
                            <XCircle size={16} />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenModal(category)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title={t("adminCategories.actions.edit")}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(category.id)}
                          className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title={t("adminCategories.actions.delete")}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={
          editingCategory
            ? t("adminCategories.modal.editTitle")
            : t("adminCategories.modal.addTitle")
        }
        size="2xl"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleCloseModal}
              className="px-6 py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all"
            >
              {t("adminCategories.modal.cancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name.trim() || isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                  {t("adminCategories.modal.saving")}
                </>
              ) : (
                <>
                  <Save size={16} />
                  {editingCategory
                    ? t("adminCategories.modal.updateButton")
                    : t("adminCategories.modal.createButton")}
                </>
              )}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminCategories.form.nameLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder={t("adminCategories.form.namePlaceholder") ?? ""}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminCategories.form.descriptionLabel")}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder={t("adminCategories.form.descriptionPlaceholder") ?? ""}
              rows={4}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminCategories.form.statusLabel")}
            </label>
            <div className="flex items-center gap-4">
              <label
                className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition-all ${
                  formData.status === "active" ? "bg-green/10" : "bg-background"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === "active"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as "active" | "inactive",
                    }))
                  }
                  className="w-4 h-4 text-green bg-background border-green focus:ring-green focus:ring-2"
                />
                <span className="flex items-center gap-2 font-medium text-green">
                  <CheckCircle className="text-green" size={16} />
                  {t("adminCategories.form.statusOptions.active")}
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition-all">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === "inactive"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as "active" | "inactive",
                    }))
                  }
                  className="w-4 h-4 text-red-500 bg-background border-red-500 focus:ring-red-500 focus:ring-2"
                />
                <span className="flex items-center gap-2 font-medium text-red-500">
                  <XCircle className="text-red-500" size={16} />
                  {t("adminCategories.form.statusOptions.inactive")}
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
              {t("adminCategories.delete.cancel")}
            </button>
            <button
              onClick={() => handleDelete(showDeleteConfirm!)}
              className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-500/90 transition-all"
            >
              {t("adminCategories.delete.confirmButton")}
            </button>
          </div>
        }
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-500" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {t("adminCategories.delete.title")}
            </h3>
            <p className="text-gray-400 text-sm">
              {t("adminCategories.delete.subtitle")}
            </p>
          </div>
        </div>

        <p className="text-gray-300">
          {t("adminCategories.delete.message", {
            name: selectedCategory?.name ?? "",
          })}
        </p>
      </Modal>
    </div>
  );
}

