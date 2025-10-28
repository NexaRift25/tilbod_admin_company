import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  ArrowLeft,
  Save,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterCompanyPage() {
  const navigate = useNavigate();
  const { companies, addCompany } = useAuth();
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
    city: "",
    postalCode: "",
    website: "",
    description: "",
    logo: "",
  });

  const categories = [
    "Food & Dining",
    "Hotels & Accommodation",
    "Wellness & Spa",
    "Activities & Entertainment",
    "Shopping & Retail",
    "Beauty & Personal Care",
    "Health & Fitness",
    "Travel & Tourism",
    "Education & Training",
    "Professional Services"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = "Registration number is required";
    if (!formData.taxId.trim()) newErrors.taxId = "Tax ID is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!formData.description.trim()) newErrors.description = "Company description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if user has reached company limit
    if (companies.length >= 10) {
      setErrors({ general: "You have reached the maximum limit of 10 companies" });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create new company
      const newCompany = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        registrationNumber: formData.registrationNumber,
        taxId: formData.taxId,
        category: formData.category,
        status: "pending" as const,
        revisionCount: 0,
        createdAt: new Date().toISOString(),
      };

      addCompany(newCompany);

      // Show success message
      alert("Company registration submitted successfully! It will be reviewed by our team.");

      // Redirect to companies list
      navigate("/company/companies");
    } catch (error) {
      console.error("Company registration failed", error);
      setErrors({ general: "Failed to register company. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has reached limit
  if (companies.length >= 10) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/company/companies"
            className="p-2 hover:bg-primary/10 rounded-lg transition-all"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Register New Company
            </h1>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500 rounded-2xl p-8 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Company Limit Reached</h3>
          <p className="text-gray-300 mb-4">
            You have registered the maximum of 10 companies. Please manage your existing companies.
          </p>
          <Link
            to="/company/companies"
            className="inline-block px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
          >
            View My Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/company/companies"
          className="p-2 hover:bg-primary/10 rounded-lg transition-all"
        >
          <ArrowLeft className="text-primary" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Register New Company
          </h1>
          <p className="text-gray-400 text-sm">
            Company {companies.length + 1} of 10 • Fill out the form below to register your company
          </p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-500/10 border border-blue-500 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-blue-500 font-bold mb-1">Registration Review Process</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• Your company registration will be reviewed by our team within 24-48 hours</p>
              <p>• You can make up to 3 revision attempts if changes are requested</p>
              <p>• Once approved, you can start creating offers immediately</p>
              <p>• Make sure all information is accurate to avoid delays</p>
            </div>
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
          <h3 className="text-lg font-bold text-white mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.name ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder="Enter company name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Registration Number *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.registrationNumber ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder="e.g., 550289-2349"
                />
              </div>
              {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Tax ID / VAT Number *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.taxId ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder="Enter tax ID"
                />
              </div>
              {errors.taxId && <p className="text-red-500 text-xs mt-1">{errors.taxId}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                Business Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.category ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                Company Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.description ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
                placeholder="Describe your business, services, and what makes you unique..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-card-background border border-primary rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Business Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.email ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder="company@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.phone ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder="+354 XXX XXXX"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                Street Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.address ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder="Street address"
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.city ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
                placeholder="City"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Postal Code *
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.postalCode ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
                placeholder="Postal code"
              />
              {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                Website (Optional)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary transition-all"
                placeholder="https://www.yourcompany.com"
              />
            </div>
          </div>
        </div>

        {/* Company Logo */}
        <div className="bg-card-background border border-primary rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Company Logo (Optional)</h3>
          
          <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/60 transition-all cursor-pointer">
            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-white font-medium mb-2">Click to upload or drag and drop</p>
            <p className="text-gray-400 text-sm">PNG, JPG or SVG (max. 2MB)</p>
            <input type="file" className="hidden" accept="image/*" />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-6">
          <Link
            to="/company/companies"
            className="px-6 py-3 bg-background border border-primary/30 text-white font-semibold rounded-full hover:bg-primary/10 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20} />
                Register Company
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

