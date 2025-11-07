import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  Building2,
  Mail,
  FileText,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  XCircle,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  taxId: string;
  category: string;
  status: "pending" | "approved" | "revision" | "rejected";
  revisionCount: number;
  createdAt: string;
  email: string;
  phone: string;
  address: string;
  owner: string;
  offersCount: number;
  website?: string;
  description?: string;
  logo?: string;
}

// Mock data - in real app, fetch from API
const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Blue Lagoon Spa",
    registrationNumber: "550289-2349",
    taxId: "TAX-001",
    category: "Wellness & Spa",
    status: "approved",
    revisionCount: 0,
    createdAt: "2024-11-15T10:00:00Z",
    email: "info@bluelagoon.is",
    phone: "+354 420 8800",
    address: "240 Grindavík",
    owner: "John Doe",
    offersCount: 5,
    website: "https://bluelagoon.is",
    description: "A premium spa and wellness center",
  },
  {
    id: "2",
    name: "Hotel Aurora",
    registrationNumber: "560123-4567",
    taxId: "TAX-002",
    category: "Hotels & Accommodation",
    status: "approved",
    revisionCount: 0,
    createdAt: "2025-01-10T14:30:00Z",
    email: "reservations@hotelaurora.is",
    phone: "+354 555 1234",
    address: "Reykjavík",
    owner: "Jane Smith",
    offersCount: 3,
  },
];

const categoryOptionsBase = [
  { value: "Food & Dining", key: "foodDining" },
  { value: "Hotels & Accommodation", key: "hotelsAccommodation" },
  { value: "Wellness & Spa", key: "wellnessSpa" },
  { value: "Activities & Entertainment", key: "activitiesEntertainment" },
  { value: "Shopping & Retail", key: "shoppingRetail" },
  { value: "Beauty & Personal Care", key: "beautyPersonalCare" },
  { value: "Health & Fitness", key: "healthFitness" },
  { value: "Travel & Tourism", key: "travelTourism" },
  { value: "Education & Training", key: "educationTraining" },
  { value: "Professional Services", key: "professionalServices" },
];

export default function AdminEditCompanyPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    taxId: "",
    category: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    description: "",
    logo: "",
  });

  const statusTranslationMap: Record<string, string> = {
    approved: "adminCompanyDetails.status.approved",
    rejected: "adminCompanyDetails.status.rejected",
    revision: "adminCompanyDetails.status.revision",
    pending: "adminCompanyDetails.status.pending",
  };

  const categoryOptions = useMemo(
    () =>
      categoryOptionsBase.map((category) => ({
        value: category.value,
        label: t(`adminEditCompany.categories.${category.key}`),
      })),
    [t]
  );

  useEffect(() => {
    // Simulate API call
    const fetchCompanyData = () => {
      setLoading(true);
      setTimeout(() => {
        const foundCompany = mockCompanies.find((c) => c.id === id);
        setCompany(foundCompany || null);
        if (foundCompany) {
          setFormData({
            name: foundCompany.name || "",
            registrationNumber: foundCompany.registrationNumber || "",
            taxId: foundCompany.taxId || "",
            category: foundCompany.category || "",
            email: foundCompany.email || "",
            phone: foundCompany.phone || "",
            address: foundCompany.address || "",
            website: foundCompany.website || "",
            description: foundCompany.description || "",
            logo: foundCompany.logo || "",
          });
        }
        setLoading(false);
      }, 500);
    };

    fetchCompanyData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = t("adminEditCompany.validation.nameRequired");
    if (!formData.registrationNumber.trim())
      newErrors.registrationNumber = t("adminEditCompany.validation.registrationRequired");
    if (!formData.taxId.trim()) newErrors.taxId = t("adminEditCompany.validation.taxIdRequired");
    if (!formData.category) newErrors.category = t("adminEditCompany.validation.categoryRequired");
    if (!formData.email.trim()) newErrors.email = t("adminEditCompany.validation.emailRequired");
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("adminEditCompany.validation.emailInvalid");
    }
    if (!formData.phone.trim()) newErrors.phone = t("adminEditCompany.validation.phoneRequired");
    if (!formData.address.trim()) newErrors.address = t("adminEditCompany.validation.addressRequired");
    if (!formData.description.trim())
      newErrors.description = t("adminEditCompany.validation.descriptionRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In real app, call API to update company
      console.log("Updating company:", id, formData);
      
      window.alert(t("adminEditCompany.notifications.success"));
      navigate("/admin/companies");
    } catch (error) {
      console.error("Failed to update company:", error);
      window.alert(t("adminEditCompany.notifications.error"));
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-card-background border border-primary rounded-lg animate-pulse" />
          <div className="flex-1">
            <div className="h-8 bg-card-background border border-primary rounded-lg animate-pulse mb-2" />
            <div className="h-4 bg-card-background border border-primary rounded-lg animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/companies"
            className="p-2 hover:bg-primary/10 rounded-lg transition-all"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {t("adminEditCompany.notFound.title")}
          </h1>
        </div>
        <div className="bg-card-background border border-primary rounded-2xl p-8 text-center">
          <p className="text-gray-400">
            {t("adminEditCompany.notFound.description")}
          </p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="text-green" size={20} />;
      case "rejected":
        return <XCircle className="text-red-500" size={20} />;
      case "revision":
        return <AlertCircle className="text-yellow" size={20} />;
      default:
        return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green/20 text-green border border-green/30";
      case "rejected":
        return "bg-red-500/20 text-red-500 border border-red-500/30";
      case "revision":
        return "bg-yellow/20 text-yellow border border-yellow/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  const getStatusText = (status: string) =>
    t(statusTranslationMap[status] ?? "adminCompanyDetails.status.pendingReview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/companies"
            className="p-2 hover:bg-primary/10 rounded-lg transition-all"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {t("adminEditCompany.header.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminEditCompany.header.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Company Status Banner */}
      <div className={`bg-card-background border rounded-2xl p-4 ${getStatusColor(company.status)}`}>
        <div className="flex items-center gap-3">
          {getStatusIcon(company.status)}
          <div>
            <p className="font-semibold">
              {t("adminEditCompany.statusBanner.label", {
                status: getStatusText(company.status),
              })}
            </p>
            {company.status === "revision" && (
              <p className="text-sm opacity-90 mt-1">
                {t("adminEditCompany.statusBanner.revisionAttempt", {
                  count: company.revisionCount,
                  total: 3,
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="space-y-6">
          {/* Company Information */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="text-primary" size={20} />
              {t("adminEditCompany.sections.companyInfoTitle")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("adminEditCompany.form.companyNameLabel")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.name ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder={t("adminEditCompany.form.companyNamePlaceholder")}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("adminEditCompany.form.categoryLabel")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.category ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                >
                  <option value="">{t("adminEditCompany.form.categoryPlaceholder")}</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("adminEditCompany.form.registrationLabel")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.registrationNumber ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder={t("adminEditCompany.form.registrationPlaceholder")}
                />
                {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("adminEditCompany.form.taxIdLabel")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.taxId ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder={t("adminEditCompany.form.taxIdPlaceholder")}
                />
                {errors.taxId && <p className="text-red-500 text-xs mt-1">{errors.taxId}</p>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Mail className="text-primary" size={20} />
              {t("adminEditCompany.sections.contactInfoTitle")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("adminEditCompany.form.emailLabel")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.email ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder={t("adminEditCompany.form.emailPlaceholder")}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("adminEditCompany.form.phoneLabel")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.phone ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder={t("adminEditCompany.form.phonePlaceholder")}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("adminEditCompany.form.addressLabel")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.address ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder={t("adminEditCompany.form.addressPlaceholder")}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <Globe size={16} />
                  {t("adminEditCompany.form.websiteLabel")}
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary transition-all"
                  placeholder={t("adminEditCompany.form.websitePlaceholder")}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="text-primary" size={20} />
              {t("adminEditCompany.sections.descriptionTitle")}
            </h3>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminEditCompany.form.descriptionLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.description ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
                placeholder={t("adminEditCompany.form.descriptionPlaceholder")}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-primary/30">
            <Link
              to="/admin/companies"
              className="px-6 py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all"
            >
              {t("adminEditCompany.buttons.cancel")}
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                  {t("adminEditCompany.buttons.submitting")}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {t("adminEditCompany.buttons.submit")}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

