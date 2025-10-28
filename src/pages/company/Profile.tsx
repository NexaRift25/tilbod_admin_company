import { useState } from "react";
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

export default function ProfilePage() {
  const { user, companies, updateUser } = useAuth();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (activeTab === "security") {
      if (!formData.currentPassword) newErrors.currentPassword = "Current password is required";
      if (formData.newPassword && formData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      }
      if (formData.newPassword && !formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your new password";
      }
      if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
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
      } else if (activeTab === "security") {
        console.log("Password change requested");
      }

      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Profile update failed", error);
      setErrors({ general: "Failed to update profile. Please try again." });
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
            Profile Settings
          </h1>
          <p className="text-gray-400 text-sm">
            Manage your account information and preferences
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
              Company Account • {companies.length} companies registered
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{companies.length}</p>
              <p className="text-gray-400 text-sm">Companies</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {companies.filter(c => c.status === "approved").length}
              </p>
              <p className="text-gray-400 text-sm">Active</p>
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
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 px-2 font-medium transition-all ${
              activeTab === "security"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("companies")}
            className={`pb-3 px-2 font-medium transition-all ${
              activeTab === "companies"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-400 hover:text-white"
            }`}
          >
            My Companies
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
                  First Name *
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
                    placeholder="Enter first name"
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Last Name *
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
                    placeholder="Enter last name"
                  />
                </div>
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Email Address *
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
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary transition-all"
                    placeholder="+354 XXX XXXX"
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
                    Save Changes
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
                  Current Password *
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
                    placeholder="Enter current password"
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
                  New Password
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
                    placeholder="Enter new password (min 8 characters)"
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
                  Confirm New Password
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
                    placeholder="Confirm new password"
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
                    Update Password
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
                  <span className="text-xs text-gray-400">Registered</span>
                </div>
                <p className="text-2xl font-bold text-white">{companies.length}</p>
                <p className="text-gray-400 text-sm">of 10 max</p>
              </div>

              <div className="bg-background border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-xs text-gray-400">Approved</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {companies.filter(c => c.status === "approved").length}
                </p>
                <p className="text-gray-400 text-sm">Ready for offers</p>
              </div>

              <div className="bg-background border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="text-yellow-500" size={20} />
                  <span className="text-xs text-gray-400">Pending</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {companies.filter(c => c.status === "pending" || c.status === "revision").length}
                </p>
                <p className="text-gray-400 text-sm">Under review</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Registered Companies</h3>

              {companies.length === 0 ? (
                <div className="bg-background border border-primary/50 rounded-lg p-8 text-center">
                  <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
                  <h4 className="text-xl font-bold text-white mb-2">No companies registered</h4>
                  <p className="text-gray-400 mb-4">
                    Register your first company to start creating offers
                  </p>
                  <Link
                    to="/company/companies/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
                  >
                    <Plus size={20} />
                    Register Company
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
                            company.status === "approved" ? "bg-green-500/10 text-green-500" :
                            company.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                            company.status === "revision" ? "bg-orange-500/10 text-orange-500" :
                            "bg-red-500/10 text-red-500"
                          }`}>
                            {company.status}
                          </span>
                          <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
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

