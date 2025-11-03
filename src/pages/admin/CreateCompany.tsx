import { useState } from "react";
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

export default function AdminCreateCompanyPage() {
  const navigate = useNavigate();
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
    if (!formData.description.trim()) newErrors.description = "Company description is required";
    if (!formData.owner.trim()) newErrors.owner = "Owner name is required";

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
      alert("Company created successfully and approved immediately! The company can now create offers.");

      // Redirect to companies list
      navigate("/admin/companies");
    } catch (error) {
      console.error("Company creation failed", error);
      setErrors({ general: "Failed to create company. Please try again." });
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
            Create New Company
          </h1>
          <p className="text-gray-400 text-sm">
            Create a company that will be approved immediately (no approval queue)
          </p>
        </div>
      </div>

      {/* Admin Notice */}
      <div className="bg-green/20 border border-green rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-green flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-green font-bold mb-1">Direct Approval</h3>
            <p className="text-sm text-gray-300">
              Companies created by admins are automatically approved and can create offers immediately. 
              No approval queue required.
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
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                Company Name <span className="text-red-500">*</span>
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
                  placeholder="Enter company name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Registration Number <span className="text-red-500">*</span>
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
                  placeholder="e.g., 550289-2349"
                />
              </div>
              {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Tax ID / VAT Number <span className="text-red-500">*</span>
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
                  placeholder="Enter tax ID"
                />
              </div>
              {errors.taxId && <p className="text-red-500 text-xs mt-1">{errors.taxId}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                Business Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.category ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
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
                Company Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.description ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                }`}
                placeholder="Describe the business, services, and what makes it unique..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                Owner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.owner ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                }`}
                placeholder="Enter company owner name"
              />
              {errors.owner && <p className="text-red-500 text-xs mt-1">{errors.owner}</p>}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-card-background border border-primary rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Mail className="text-primary" size={20} />
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Business Email <span className="text-red-500">*</span>
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
                  placeholder="company@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Phone Number <span className="text-red-500">*</span>
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
                  placeholder="+354 XXX XXXX"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                Street Address <span className="text-red-500">*</span>
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
                  placeholder="Street address, City"
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block flex items-center gap-2">
                <Globe size={16} />
                Website (Optional)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary transition-all"
                placeholder="https://www.company.com"
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
                Create Company
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

