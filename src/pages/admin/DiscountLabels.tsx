import { useEffect, useMemo, useState } from "react";
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
import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/modal";

type DiscountType = "percentage" | "fixed";
type DiscountStatus = "active" | "inactive";
type OfferType = "active" | "weekdays" | "happy_hour" | "gift_card";

interface DiscountLabel {
  id: string;
  name: string;
  type: DiscountType;
  value: number;
  description: string;
  status: DiscountStatus;
  applicableTo: OfferType[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

const DISCOUNT_LABELS_STORAGE_KEY = "tilbod_discount_labels";

export default function DiscountLabelsPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "is" ? "is-IS" : "en-US";

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions) =>
    value.toLocaleString(locale, options);

  const formatCurrency = (value: number) =>
    t("adminDiscountLabels.common.currency", { value: formatNumber(value) });

  const formatPercentage = (value: number) =>
    t("adminDiscountLabels.common.percentage", {
      value: formatNumber(value, { maximumFractionDigits: 1, minimumFractionDigits: 0 }),
    });

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingLabel, setEditingLabel] = useState<DiscountLabel | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [labels, setLabels] = useState<DiscountLabel[]>(() => {
    const stored = localStorage.getItem(DISCOUNT_LABELS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
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

  useEffect(() => {
    localStorage.setItem(DISCOUNT_LABELS_STORAGE_KEY, JSON.stringify(labels));
  }, [labels]);

  const [formData, setFormData] = useState({
    name: "",
    type: "percentage" as DiscountType,
    value: 0,
    description: "",
    status: "active" as DiscountStatus,
    applicableTo: [] as OfferType[],
  });

  const statusFilterOptions = useMemo(
    () => [
      { value: "all", label: t("adminDiscountLabels.filters.status.all") },
      { value: "active", label: t("adminDiscountLabels.filters.status.active") },
      { value: "inactive", label: t("adminDiscountLabels.filters.status.inactive") },
    ],
    [t]
  );

  const typeFilterOptions = useMemo(
    () => [
      { value: "all", label: t("adminDiscountLabels.filters.type.all") },
      { value: "percentage", label: t("adminDiscountLabels.filters.type.percentage") },
      { value: "fixed", label: t("adminDiscountLabels.filters.type.fixed") },
    ],
    [t]
  );

  const offerTypeLabels = useMemo(
    () => ({
      active: t("adminDiscountLabels.offerTypes.active"),
      weekdays: t("adminDiscountLabels.offerTypes.weekdays"),
      happy_hour: t("adminDiscountLabels.offerTypes.happyHour"),
      gift_card: t("adminDiscountLabels.offerTypes.giftCard"),
    }),
    [t]
  );

  const offerTypeKeys: OfferType[] = ["active", "weekdays", "happy_hour", "gift_card"];

  const getStatusColor = (status: DiscountStatus) =>
    status === "active"
      ? "bg-green/10 text-green border-green"
      : "bg-gray-500/10 text-gray-400 border-gray-500";

  const getStatusIcon = (status: DiscountStatus) =>
    status === "active" ? (
      <CheckCircle className="text-green" size={20} />
    ) : (
      <XCircle className="text-gray-400" size={20} />
    );

  const getStatusLabel = (status: DiscountStatus) =>
    t(`adminDiscountLabels.status.${status}`);

  const getOfferTypeLabel = (type: OfferType) => offerTypeLabels[type] ?? type;

  const filteredLabels = useMemo(
    () =>
      labels.filter((label) => {
        const matchesSearch =
          label.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          label.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || label.status === statusFilter;
        const matchesType = typeFilter === "all" || label.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
      }),
    [labels, searchTerm, statusFilter, typeFilter]
  );

  const labelStats = useMemo(
    () => ({
      total: labels.length,
      active: labels.filter((l) => l.status === "active").length,
      percentage: labels.filter((l) => l.type === "percentage").length,
      fixed: labels.filter((l) => l.type === "fixed").length,
      totalUsage: labels.reduce((sum, l) => sum + l.usageCount, 0),
    }),
    [labels]
  );

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
    if (!formData.name.trim()) {
      window.alert(t("adminDiscountLabels.notifications.nameRequired"));
      return;
    }
    if (formData.value <= 0) {
      window.alert(t("adminDiscountLabels.notifications.valueRequired"));
      return;
    }
    if (formData.applicableTo.length === 0) {
      window.alert(t("adminDiscountLabels.notifications.applicableRequired"));
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (editingLabel) {
      setLabels((prev) =>
        prev.map((label) =>
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
        )
      );
    } else {
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
      setLabels((prev) => [...prev, newLabel]);
    }

    setIsSaving(false);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setLabels((prev) => prev.filter((label) => label.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleToggleStatus = (id: string) => {
    setLabels((prev) =>
      prev.map((label) =>
        label.id === id
          ? {
              ...label,
              status: label.status === "active" ? "inactive" : "active",
              updatedAt: new Date().toISOString(),
            }
          : label
      )
    );
  };

  const handleToggleApplicableTo = (offerType: OfferType) => {
    setFormData((prev) => {
      const current = prev.applicableTo;
      return current.includes(offerType)
        ? { ...prev, applicableTo: current.filter((type) => type !== offerType) }
        : { ...prev, applicableTo: [...current, offerType] };
    });
  };

  const selectedLabel = showDeleteConfirm
    ? labels.find((label) => label.id === showDeleteConfirm)
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
              {t("adminDiscountLabels.header.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminDiscountLabels.header.subtitle")}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
        >
          <Plus size={20} />
          {t("adminDiscountLabels.header.createButton")}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminDiscountLabels.stats.total")}
              </p>
              <p className="text-white text-2xl font-bold">
                {formatNumber(labelStats.total)}
              </p>
            </div>
            <Tag className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminDiscountLabels.stats.active")}
              </p>
              <p className="text-white text-2xl font-bold">
                {formatNumber(labelStats.active)}
              </p>
            </div>
            <CheckCircle className="text-green" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminDiscountLabels.stats.percentage")}
              </p>
              <p className="text-white text-2xl font-bold">
                {formatNumber(labelStats.percentage)}
              </p>
            </div>
            <Percent className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-purple-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminDiscountLabels.stats.fixed")}
              </p>
              <p className="text-white text-2xl font-bold">
                {formatNumber(labelStats.fixed)}
              </p>
            </div>
            <Tag className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-yellow rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminDiscountLabels.stats.totalUsage")}
              </p>
              <p className="text-white text-2xl font-bold">
                {formatNumber(labelStats.totalUsage)}
              </p>
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
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={t("adminDiscountLabels.filters.searchPlaceholder") ?? ""}
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
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              {typeFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Labels List */}
      <div className="space-y-4">
        {filteredLabels.length === 0 ? (
          <div className="bg-card-background border border-primary rounded-2xl p-8 text-center">
            <Tag className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">
              {t("adminDiscountLabels.empty.title")}
            </h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? t("adminDiscountLabels.empty.searchAdjust")
                : t("adminDiscountLabels.empty.createFirst")}
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
                    <span
                      className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        label.status
                      )}`}
                    >
                      {getStatusIcon(label.status)}
                      <span className="ml-1">{getStatusLabel(label.status)}</span>
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        label.type === "percentage"
                          ? "bg-blue-500/10 text-blue-500 border border-blue-500"
                          : "bg-purple-500/10 text-purple-500 border border-purple-500"
                      }`}
                    >
                      {label.type === "percentage"
                        ? formatPercentage(label.value)
                        : formatCurrency(label.value)}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{label.description}</p>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-400 text-sm">
                      {t("adminDiscountLabels.details.applicableTo")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {label.applicableTo.length > 0 ? (
                        label.applicableTo.map((type) => (
                          <span
                            key={type}
                            className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                          >
                            {getOfferTypeLabel(type)}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">
                          {t("adminDiscountLabels.details.noneSelected")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">
                        {t("adminDiscountLabels.details.usageCount")}
                      </p>
                      <p className="text-white font-medium">
                        {formatNumber(label.usageCount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t("adminDiscountLabels.details.type")}</p>
                      <p className="text-white font-medium">
                        {label.type === "percentage"
                          ? t("adminDiscountLabels.types.percentage")
                          : t("adminDiscountLabels.types.fixed")}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        {t("adminDiscountLabels.details.lastUpdated")}
                      </p>
                      <p className="text-white font-medium">
                        {formatDate(label.updatedAt)}
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
                    title={
                      label.status === "active"
                        ? t("adminDiscountLabels.actions.deactivate")
                        : t("adminDiscountLabels.actions.activate")
                    }
                  >
                    {label.status === "active" ? <XCircle size={20} /> : <CheckCircle size={20} />}
                  </button>
                  <button
                    onClick={() => handleOpenModal(label)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title={t("adminDiscountLabels.actions.edit")}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(label.id)}
                    className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title={t("adminDiscountLabels.actions.delete")}
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
        title={
          editingLabel
            ? t("adminDiscountLabels.modal.editTitle")
            : t("adminDiscountLabels.modal.addTitle")
        }
        size="2xl"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleCloseModal}
              className="px-6 py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all"
            >
              {t("adminDiscountLabels.modal.cancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name.trim() || formData.value <= 0 || isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                  {t("adminDiscountLabels.modal.saving")}
                </>
              ) : (
                <>
                  <Save size={16} />
                  {editingLabel
                    ? t("adminDiscountLabels.modal.updateButton")
                    : t("adminDiscountLabels.modal.createButton")}
                </>
              )}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminDiscountLabels.form.nameLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder={t("adminDiscountLabels.form.namePlaceholder") ?? ""}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminDiscountLabels.form.discountTypeLabel")} <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value as DiscountType }))
                }
                className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
              >
                <option value="percentage">
                  {t("adminDiscountLabels.form.discountTypeOptions.percentage")}
                </option>
                <option value="fixed">
                  {t("adminDiscountLabels.form.discountTypeOptions.fixed")}
                </option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminDiscountLabels.form.discountValueLabel")} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    value: Number.isNaN(parseFloat(e.target.value))
                      ? 0
                      : parseFloat(e.target.value),
                  }))
                }
                placeholder={
                  formData.type === "percentage"
                    ? t("adminDiscountLabels.form.discountValuePlaceholder.percentage") ?? ""
                    : t("adminDiscountLabels.form.discountValuePlaceholder.fixed") ?? ""
                }
                min="0"
                max={formData.type === "percentage" ? "100" : undefined}
                step={formData.type === "percentage" ? "0.1" : "1"}
                className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
              <p className="text-gray-500 text-xs mt-1">
                {formData.type === "percentage"
                  ? t("adminDiscountLabels.form.discountValueHintPercentage")
                  : t("adminDiscountLabels.form.discountValueHintFixed")}
              </p>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminDiscountLabels.form.descriptionLabel")}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder={t("adminDiscountLabels.form.descriptionPlaceholder") ?? ""}
              rows={3}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminDiscountLabels.form.applicableLabel")} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {offerTypeKeys.map((offerType) => (
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
              <p className="text-red-500 text-xs mt-1">
                {t("adminDiscountLabels.form.applicableError")}
              </p>
            )}
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminDiscountLabels.form.statusLabel")}
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
                      status: e.target.value as DiscountStatus,
                    }))
                  }
                  className="w-4 h-4 text-green bg-background border-green focus:ring-green focus:ring-2"
                />
                <span className="flex items-center gap-2 font-medium text-green">
                  <CheckCircle className="text-green" size={16} />
                  {t("adminDiscountLabels.form.statusOptions.active")}
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
                      status: e.target.value as DiscountStatus,
                    }))
                  }
                  className="w-4 h-4 text-red-500 bg-background border-red-500 focus:ring-red-500 focus:ring-2"
                />
                <span className="flex items-center gap-2 font-medium text-red-500">
                  <XCircle className="text-red-500" size={16} />
                  {t("adminDiscountLabels.form.statusOptions.inactive")}
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
              {t("adminDiscountLabels.delete.cancel")}
            </button>
            <button
              onClick={() => handleDelete(showDeleteConfirm!)}
              className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-500/90 transition-all"
            >
              {t("adminDiscountLabels.delete.confirmButton")}
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
              {t("adminDiscountLabels.delete.title")}
            </h3>
            <p className="text-gray-400 text-sm">
              {t("adminDiscountLabels.delete.subtitle")}
            </p>
          </div>
        </div>

        <p className="text-gray-300">
          {t("adminDiscountLabels.delete.message", {
            name: selectedLabel?.name ?? "",
          })}
        </p>
      </Modal>
    </div>
  );
}

