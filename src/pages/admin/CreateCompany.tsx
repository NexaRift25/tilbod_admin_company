import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  ArrowLeft,
  Save,
  CheckCircle,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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

export default function AdminCreateCompanyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    owner: "",
  });

  const categoryOptions = useMemo(
    () =>
      categoryOptionsBase.map((category) => ({
        value: category.value,
        label: t(`adminEditCompany.categories.${category.key}`),
      })),
    [t]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = t("adminCreateCompany.validation.nameRequired");
    if (!formData.registrationNumber.trim())
      newErrors.registrationNumber = t("adminCreateCompany.validation.registrationRequired");
    if (!formData.taxId.trim()) newErrors.taxId = t("adminCreateCompany.validation.taxIdRequired");
    if (!formData.category) newErrors.category = t("adminCreateCompany.validation.categoryRequired");
    if (!formData.email.trim()) newErrors.email = t("adminCreateCompany.validation.emailRequired");
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("adminCreateCompany.validation.emailInvalid");
    }
    if (!formData.phone.trim()) newErrors.phone = t("adminCreateCompany.validation.phoneRequired");
    if (!formData.address.trim()) newErrors.address = t("adminCreateCompany.validation.addressRequired");
    if (!formData.description.trim())
      newErrors.description = t("adminCreateCompany.validation.descriptionRequired");
    if (!formData.owner.trim()) newErrors.owner = t("adminCreateCompany.validation.ownerRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create new company with "approved" status immediately
      const newCompany = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        registrationNumber: formData.registrationNumber,
        taxId: formData.taxId,
        category: formData.category,
        status: "approved" as const, // Directly approved - no approval queue
        revisionCount: 0,
        createdAt: new Date().toISOString(),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        website: formData.website || undefined,
        description: formData.description,
        owner: formData.owner,
        offersCount: 0,
      };

      // In real app, this would call an API
      console.log("Admin creating company (approved immediately):", newCompany);

      // Show success message
      window.alert(t("adminCreateCompany.notifications.success"));

      // Redirect to companies list
      navigate("/admin/companies");
    } catch (error) {
      console.error("Company creation failed", error);
      setErrors({ general: t("adminCreateCompany.errors.general") });
      window.alert(t("adminCreateCompany.notifications.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/companies"
          className="p-2 hover:bg-primary/10 rounded-lg transition-all"
        >
          <ArrowLeft className="text-primary" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t("adminCreateCompany.header.title")}
          </h1>
          <p className="text-gray-400 text-sm">
            {t("adminCreateCompany.header.subtitle")}
          </p>
        </div>
      </div>

      {/* Admin Notice */}
      <div className="bg-green/20 border border-green rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-green flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-green font-bold mb-1">
              {t("adminCreateCompany.notice.title")}
            </h3>
            <p className="text-sm text-gray-300">
              {t("adminCreateCompany.notice.description")}
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Errors */}
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
            <p className="text-red-500">{errors.general}</p>
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-card-background border border-primary rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Building2 className="text-primary" size={20} />
            {t("adminCreateCompany.sections.basicInfoTitle")}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminCreateCompany.form.companyNameLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.name ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                  }`}
                  placeholder={t("adminCreateCompany.form.companyNamePlaceholder")}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminCreateCompany.form.registrationLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.registrationNumber ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                  }`}
                  placeholder={t("adminCreateCompany.form.registrationPlaceholder")}
                />
              </div>
              {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminCreateCompany.form.taxIdLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.taxId ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                  }`}
                  placeholder={t("adminCreateCompany.form.taxIdPlaceholder")}
                />
              </div>
              {errors.taxId && <p className="text-red-500 text-xs mt-1">{errors.taxId}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminCreateCompany.form.categoryLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.category ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                }`}
              >
                <option value="">
                  {t("adminCreateCompany.form.categoryPlaceholder")}
                </option>
                {categoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminCreateCompany.form.descriptionLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.description ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                }`}
                placeholder={t("adminCreateCompany.form.descriptionPlaceholder")}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminCreateCompany.form.ownerLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.owner ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                }`}
                placeholder={t("adminCreateCompany.form.ownerPlaceholder")}
              />
              {errors.owner && <p className="text-red-500 text-xs mt-1">{errors.owner}</p>}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-card-background border border-primary rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Mail className="text-primary" size={20} />
            {t("adminCreateCompany.sections.contactInfoTitle")}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminCreateCompany.form.emailLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.email ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                  }`}
                  placeholder={t("adminCreateCompany.form.emailPlaceholder")}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminCreateCompany.form.phoneLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.phone ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                  }`}
                  placeholder={t("adminCreateCompany.form.phonePlaceholder")}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminCreateCompany.form.addressLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.address ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                  }`}
                  placeholder={t("adminCreateCompany.form.addressPlaceholder")}
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                <Globe size={16} />
                {t("adminCreateCompany.form.websiteLabel")}
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary transition-all"
                placeholder={t("adminCreateCompany.form.websitePlaceholder")}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-6">
          <Link
            to="/admin/companies"
            className="px-6 py-3 bg-background border border-primary/50 text-white font-semibold rounded-full hover:bg-primary/10 transition-all"
          >
            {t("adminCreateCompany.buttons.cancel")}
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                {t("adminCreateCompany.buttons.submitting")}
              </>
            ) : (
              <>
                <Save size={20} />
                {t("adminCreateCompany.buttons.submit")}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

