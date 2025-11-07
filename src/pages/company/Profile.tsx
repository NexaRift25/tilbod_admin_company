import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Building2,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Camera,
  AlertTriangle,
  CheckCircle,
  Plus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { user, companies, updateUser } = useAuth();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "security" | "companies">("personal");

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const companyStats = useMemo(() => {
    const approved = companies.filter(c => c.status === "approved").length;
    const pending = companies.filter(c => c.status === "pending" || c.status === "revision").length;

    return {
      total: companies.length,
      approved,
      pending,
      max: 10,
    };
  }, [companies]);

  const getCompanyStatusLabel = (status: string) =>
    t(`companyProfile.companiesTab.status.${status}`, {
      defaultValue: t("companyProfile.companiesTab.status.unknown", { status }),
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = t("companyProfile.validation.firstNameRequired");
    if (!formData.lastName.trim()) newErrors.lastName = t("companyProfile.validation.lastNameRequired");
    if (!formData.email.trim()) newErrors.email = t("companyProfile.validation.emailRequired");
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("companyProfile.validation.emailInvalid");
    }

    if (activeTab === "security") {
      if (!formData.currentPassword) newErrors.currentPassword = t("companyProfile.validation.currentPasswordRequired");
      if (formData.newPassword && formData.newPassword.length < 8) {
        newErrors.newPassword = t("companyProfile.validation.passwordMinLength");
      }
      if (formData.newPassword && !formData.confirmPassword) {
        newErrors.confirmPassword = t("companyProfile.validation.confirmPasswordRequired");
      }
      if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = t("companyProfile.validation.passwordMismatch");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (activeTab === "personal") {
        updateUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        });
        window.alert(t("companyProfile.messages.personalSaved"));
      } else if (activeTab === "security") {
        console.log("Password change requested");
        window.alert(t("companyProfile.messages.passwordRequested"));
      }
    } catch (error) {
      console.error("Profile update failed", error);
      setErrors({ general: t("companyProfile.errors.updateFailed") });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/company/dashboard"
          className="p-2 hover:bg-primary/10 rounded-lg transition-all"
        >
          <ArrowLeft className="text-primary" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t("companyProfile.title")}
          </h1>
          <p className="text-gray-400 text-sm">
            {t("companyProfile.subtitle")}
          </p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <Building2 className="text-dark" size={32} />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-all">
              <Camera className="text-dark" size={16} />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-400 mb-2">{user?.email}</p>
            <p className="text-primary font-medium">
              {t("companyProfile.header.accountSummary", { count: companyStats.total })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{companyStats.total}</p>
              <p className="text-gray-400 text-sm">{t("companyProfile.header.companiesLabel")}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{companyStats.approved}</p>
              <p className="text-gray-400 text-sm">{t("companyProfile.header.activeLabel")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center gap-6 mb-6 border-b border-primary/50">
          <button
            onClick={() => setActiveTab("personal")}
            className={`pb-3 px-2 font-medium transition-all ${
              activeTab === "personal"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t("companyProfile.tabs.personal")}
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 px-2 font-medium transition-all ${
              activeTab === "security"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t("companyProfile.tabs.security")}
          </button>
          <button
            onClick={() => setActiveTab("companies")}
            className={`pb-3 px-2 font-medium transition-all ${
              activeTab === "companies"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t("companyProfile.tabs.companies")}
          </button>
        </div>

        {/* Personal Information Tab */}
        {activeTab === "personal" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                <p className="text-red-500">{errors.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("companyProfile.personal.firstNameLabel")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.firstName ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                    }`}
                    placeholder={t("companyProfile.personal.firstNamePlaceholder")}
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("companyProfile.personal.lastNameLabel")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.lastName ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                    }`}
                    placeholder={t("companyProfile.personal.lastNamePlaceholder")}
                  />
                </div>
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("companyProfile.personal.emailLabel")}
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
                    placeholder={t("companyProfile.personal.emailPlaceholder")}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("companyProfile.personal.phoneLabel")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary transition-all"
                    placeholder={t("companyProfile.personal.phonePlaceholder")}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-6 border-t border-primary/50">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    {t("companyProfile.personal.saveButton")}
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                <p className="text-red-500">{errors.general}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("companyProfile.security.currentPasswordLabel")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.currentPassword ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                    }`}
                    placeholder={t("companyProfile.security.currentPasswordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("companyProfile.security.newPasswordLabel")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.newPassword ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                    }`}
                    placeholder={t("companyProfile.security.newPasswordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("companyProfile.security.confirmPasswordLabel")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                    }`}
                    placeholder={t("companyProfile.security.confirmPasswordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex items-center justify-end pt-6 border-t border-primary/50">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    {t("companyProfile.security.updateButton")}
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Companies Tab */}
        {activeTab === "companies" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background border border-primary/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="text-primary" size={20} />
                  <span className="text-xs text-gray-400">{t("companyProfile.companiesTab.registeredLabel")}</span>
                </div>
                <p className="text-2xl font-bold text-white">{companyStats.total}</p>
                <p className="text-gray-400 text-sm">
                  {t("companyProfile.companiesTab.registeredSummary", { count: companyStats.total, max: companyStats.max })}
                </p>
              </div>

              <div className="bg-background border border-green/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="text-green" size={20} />
                  <span className="text-xs text-gray-400">{t("companyProfile.companiesTab.approvedLabel")}</span>
                </div>
                <p className="text-2xl font-bold text-white">{companyStats.approved}</p>
                <p className="text-gray-400 text-sm">{t("companyProfile.companiesTab.approvedDescription")}</p>
              </div>

              <div className="bg-background border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="text-yellow" size={20} />
                  <span className="text-xs text-gray-400">{t("companyProfile.companiesTab.pendingLabel")}</span>
                </div>
                <p className="text-2xl font-bold text-white">{companyStats.pending}</p>
                <p className="text-gray-400 text-sm">{t("companyProfile.companiesTab.pendingDescription")}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">{t("companyProfile.companiesTab.title")}</h3>

              {companies.length === 0 ? (
                <div className="bg-background border border-primary/50 rounded-lg p-8 text-center">
                  <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
                  <h4 className="text-xl font-bold text-white mb-2">{t("companyProfile.companiesTab.emptyTitle")}</h4>
                  <p className="text-gray-400 mb-4">
                    {t("companyProfile.companiesTab.emptyDescription")}
                  </p>
                  <Link
                    to="/company/companies/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
                  >
                    <Plus size={20} />
                    {t("companyProfile.companiesTab.registerButton")}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {companies.map((company) => (
                    <div
                      key={company.id}
                      className="bg-background border border-primary/50 rounded-lg p-6 hover:border-primary transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building2 className="text-primary" size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-white">{company.name}</h4>
                            <p className="text-gray-400 text-sm">{company.category}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            company.status === "approved" ? "bg-green/10 text-green" :
                            company.status === "pending" ? "bg-yellow/10 text-yellow" :
                            company.status === "revision" ? "bg-orange-500/10 text-orange-500" :
                            "bg-red-500/10 text-red-500"
                          }`}>
                            {getCompanyStatusLabel(company.status)}
                          </span>
                          <button
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title={t("companyProfile.companiesTab.viewDetails")}
                          >
                            <Eye size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

