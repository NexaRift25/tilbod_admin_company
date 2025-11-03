import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Tag,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  ArrowLeft,
  Eye,
  Search,
  Building2,
  CheckCircle
} from "lucide-react";
import ActiveOfferCard from "@/components/offerCards/active-offer-card";
import WeeklyOfferCard from "@/components/offerCards/weeklyOfferCard";
import HappyHourOfferCard from "@/components/offerCards/happyHour";
import GiftOfferCard from "@/components/offerCards/giftOfferCard";
import { getActiveProductCategories } from "@/utils/productCategories";

type OfferType = "active" | "weekdays" | "happy_hour" | "gift_card";

interface OfferFormData {
  type: OfferType;
  title: string;
  description: string;
  category: string;
  originalPrice: string;
  discountPrice: string;
  discountPercentage: string;
  startDate: string;
  endDate: string;
  weekdays: string[];
  startTime: string;
  endTime: string;
  location: string;
  terms: string;
  image: string;
  weekdayAddress: string;
  offerLink: string;
}

const offerTypes = [
  {
    id: "active",
    name: "Active Offer",
    description: "Daily promotional deals available year-round",
    icon: Tag,
    color: "bg-yellow/10 text-yellow border-yellow"
  },
  {
    id: "weekdays",
    name: "Weekdays Offer",
    description: "Special deals for restaurants and activities",
    icon: Calendar,
    color: "bg-pink/10 text-pink border-pink"
  },
  {
    id: "happy_hour",
    name: "Happy Hour Offer",
    description: "Time-based promotions for bars & restaurants",
    icon: Clock,
    color: "bg-green/10 text-green border-green"
  },
  {
    id: "gift_card",
    name: "Gift Card",
    description: "Prepaid value cards for hotels & services",
    icon: DollarSign,
    color: "bg-orange-500/10 text-orange-500 border-orange-500"
  }
];

// Fallback categories if no product categories are stored
const fallbackCategories = [
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

const weekdays = [
  { id: "monday", name: "Monday" },
  { id: "tuesday", name: "Tuesday" },
  { id: "wednesday", name: "Wednesday" },
  { id: "thursday", name: "Thursday" },
  { id: "friday", name: "Friday" },
  { id: "saturday", name: "Saturday" },
  { id: "sunday", name: "Sunday" }
];

// Mock approved companies for admin to select
const mockApprovedCompanies = [
  { id: "1", name: "Blue Lagoon Spa", status: "approved" },
  { id: "2", name: "Hotel Aurora", status: "approved" },
  { id: "3", name: "Restaurant Nordic", status: "approved" },
  { id: "4", name: "Adventure Tours Iceland", status: "approved" },
];

export default function AdminCreateOfferPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<OfferType>("active");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // Load product categories from localStorage
  const [categories] = useState<string[]>(() => {
    const productCats = getActiveProductCategories();
    return productCats.length > 0 ? productCats : fallbackCategories;
  });
  
  const [formData, setFormData] = useState<OfferFormData>({
    type: "active",
    title: "",
    description: "",
    category: "",
    originalPrice: "",
    discountPrice: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
    weekdays: [],
    startTime: "",
    endTime: "",
    location: "",
    terms: "",
    image: "",
    weekdayAddress: "",
    offerLink: ""
  });

  // Update type when selectedType changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, type: selectedType }));
  }, [selectedType]);

  // Calculate discount percentage when prices change
  useEffect(() => {
    if (formData.originalPrice && formData.discountPrice) {
      const original = parseFloat(formData.originalPrice);
      const discounted = parseFloat(formData.discountPrice);
      
      if (!isNaN(original) && !isNaN(discounted) && original > 0) {
        const percentage = ((original - discounted) / original * 100).toFixed(0);
        setFormData(prev => ({ ...prev, discountPercentage: percentage }));
      }
    }
  }, [formData.originalPrice, formData.discountPrice]);

  // Clean up object URL when component unmounts or photo changes
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  // Calculate time left for preview
  const calculateTimeLeft = (endDate: string) => {
    if (!endDate) return "Ends soon";
    const end = new Date(endDate + "T23:59:59");
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    if (minutes > 0) return `${minutes} min left`;
    return "Ends soon";
  };

  // Transform form data for ActiveOfferCard preview
  const previewActiveOffer = useMemo(() => {
    return {
      id: 0,
      offerType: "active",
      title: formData.title || "Your offer title",
      discount: formData.discountPercentage ? `${formData.discountPercentage}% OFF` : "Special Offer",
      description: formData.description || "Your offer description will appear here",
      image: previewImageUrl || formData.image || "/placeholder-image.jpg",
      category: formData.category || "Category",
      timeLeft: calculateTimeLeft(formData.endDate),
      location: "",
      price: formData.originalPrice || null,
      discountPrice: formData.discountPrice || null,
      link: formData.offerLink || "#"
    };
  }, [formData, previewImageUrl]);

  // Transform form data for WeeklyOfferCard preview
  const previewWeeklyOffer = useMemo(() => {
    // Convert weekday IDs to abbreviations
    const weekdayMap: Record<string, string> = {
      "monday": "Mon",
      "tuesday": "Tue",
      "wednesday": "Wed",
      "thursday": "Thu",
      "friday": "Fri",
      "saturday": "Sat",
      "sunday": "Sun"
    };
    const availableDays = formData.weekdays.map(id => weekdayMap[id] || id);

    return {
      id: 0,
      offerType: "weekdays",
      title: formData.title || "Your weekly offer title",
      discount: formData.discountPercentage ? `${formData.discountPercentage}% Discount` : "Discount Available",
      description: formData.description || "Your weekly offer description",
      image: previewImageUrl || formData.image || "/placeholder-image.jpg",
      badge: formData.category || "Weekly Special",
      location: formData.weekdayAddress || "Location",
      time: formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : "Available all day",
      availableDays: availableDays.length > 0 ? availableDays : ["Mon", "Tue", "Wed", "Thu", "Fri"],
      link: formData.offerLink || "#"
    };
  }, [formData, previewImageUrl]);

  // Transform form data for HappyHourOfferCard preview
  const previewHappyHourOffer = useMemo(() => {
    const calculateStatus = () => {
      if (!formData.startTime || !formData.endTime) return "Closed";
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hours + minutes / 60;
      
      const [startHour, startMin] = formData.startTime.split(':').map(Number);
      const [endHour, endMin] = formData.endTime.split(':').map(Number);
      const startDecimal = startHour + startMin / 60;
      const endDecimal = endHour + endMin / 60;
      
      if (currentTime >= startDecimal && currentTime < endDecimal) {
        return "Open now";
      }
      return "Closed";
    };

    const formatTimeRange = () => {
      if (formData.startTime && formData.endTime) {
        const formatTo12Hour = (time: string) => {
          const [hours, minutes] = time.split(':');
          const hour = parseInt(hours);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          return `${displayHour}:${minutes} ${ampm}`;
        };
        return `${formatTo12Hour(formData.startTime)} - ${formatTo12Hour(formData.endTime)}`;
      }
      return "Happy Hour Time";
    };

    return {
      id: 0,
      offerType: "happy_hour",
      title: formData.title || "Your happy hour title",
      time: formatTimeRange(),
      description: formData.description || "Your happy hour description",
      image: previewImageUrl || formData.image || "/placeholder-image.jpg",
      status: calculateStatus(),
      location: formData.location || "Location",
      pricing: formData.discountPrice ? `${formData.discountPrice} kr.` : "Special pricing",
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      link: formData.offerLink || "#"
    };
  }, [formData, previewImageUrl]);

  // Transform form data for GiftOfferCard preview
  const previewGiftOffer = useMemo(() => {
    return {
      id: 0,
      offerType: "gift_card",
      title: formData.title || "Your gift card title",
      price: formData.discountPrice || "0",
      description: formData.description || "Your gift card description",
      image: previewImageUrl || formData.image || "/placeholder-image.jpg",
      category: formData.category || "Category",
      timeLeft: calculateTimeLeft(formData.endDate),
      purchaseCount: 0,
      link: "#"
    };
  }, [formData, previewImageUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleWeekdayChange = (dayId: string) => {
    setFormData(prev => ({
      ...prev,
      weekdays: prev.weekdays.includes(dayId)
        ? prev.weekdays.filter(d => d !== dayId)
        : [...prev.weekdays, dayId]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPreviewImageUrl(url);
      setFormData(prev => ({ ...prev, image: url }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedCompanyId) newErrors.company = "Company is required";
    if (!formData.title.trim()) newErrors.title = "Offer title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.originalPrice) newErrors.originalPrice = "Original price is required";
    if (!formData.discountPrice) newErrors.discountPrice = "Discounted price is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";

    // Type-specific validations
    if (selectedType === "weekdays") {
      if (formData.weekdays.length === 0) {
        newErrors.weekdays = "At least one weekday must be selected";
      }
      if (!formData.startTime) newErrors.startTime = "Start time is required";
      if (!formData.endTime) newErrors.endTime = "End time is required";
      if (!formData.weekdayAddress.trim()) newErrors.weekdayAddress = "Restaurant address is required";
    }
    if (selectedType === "happy_hour") {
      if (!formData.startTime) newErrors.startTime = "Start time is required";
      if (!formData.endTime) newErrors.endTime = "End time is required";
      if (!formData.location.trim()) newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would normally submit to your API
      // Admin-created offers are automatically approved with "active" status
      console.log("Admin creating offer (active immediately):", { 
        ...formData, 
        type: selectedType,
        companyId: selectedCompanyId,
        status: "active" // Directly active, no approval needed
      });

      // Show success message
      alert("Offer created successfully and is now active! No approval required.");

      // Redirect to admin offers list
      navigate("/admin/offers");
    } catch (error) {
      console.error("Offer creation failed", error);
      setErrors({ general: "Failed to create offer. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedOfferType = offerTypes.find(type => type.id === selectedType)!;

  const renderSelectedIcon = () => {
    const Icon = selectedOfferType.icon;
    return <Icon size={24} className="text-primary" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/offers"
          className="p-2 hover:bg-primary/10 rounded-lg transition-all"
        >
          <ArrowLeft className="text-primary" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Create New Offer (Admin)
          </h1>
          <p className="text-gray-400 text-sm">
            Create offers that go live immediately (no approval required)
          </p>
        </div>
      </div>

      {/* Offer Type Selection */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Choose Offer Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offerTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id as OfferType)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedType === type.id
                    ? `${type.color} border-opacity-100`
                    : "border-primary/30 hover:border-primary/60 bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={24} />
                  <div>
                    <h4 className="font-semibold text-white">{type.name}</h4>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Offer Form */}
        <div className="bg-card-background border border-primary rounded-2xl p-6 lg:p-8 max-h-[800px] overflow-y-auto scrollbar-custom">
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-500">{errors.general}</p>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6">
          {renderSelectedIcon()}
          <h3 className="text-xl font-bold text-white">
            Create {selectedOfferType.name}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Admin Notice */}
          <div className="bg-green/20 border border-green rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-green font-bold mb-1">Direct Activation</h4>
                <p className="text-sm text-gray-300">
                  Offers created by admins are automatically activated and go live immediately. No approval queue required.
                </p>
              </div>
            </div>
          </div>

          {/* Company Selection */}
          <div className="md:col-span-2">
            <label className="text-gray-400 text-sm mb-2 block">
              Select Company <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCompanyId}
                onChange={(e) => {
                  setSelectedCompanyId(e.target.value);
                  if (errors.company) {
                    setErrors(prev => ({ ...prev, company: "" }));
                  }
                }}
                className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.company ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                }`}
              >
                <option value="">Select a company</option>
                {mockApprovedCompanies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                Offer Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.title ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
                placeholder="Enter offer title"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                Product Category *
              </label>
              <div className="relative">
                <div className="relative">
                  <input
                    list="product-categories-list"
                    type="text"
                    value={categorySearchTerm}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCategorySearchTerm(value);
                      // Auto-select if exact match
                      const exactMatch = categories.find(cat => cat.toLowerCase() === value.toLowerCase());
                      if (exactMatch) {
                        setFormData(prev => ({ ...prev, category: exactMatch }));
                      }
                      setShowCategoryDropdown(true);
                    }}
                    onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                    onFocus={() => setShowCategoryDropdown(true)}
                    placeholder="Search or type product category..."
                    className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.category ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                    }`}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="hidden"
                    name="category"
                    value={formData.category}
                  />
                </div>
                <datalist id="product-categories-list">
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </datalist>
                {showCategoryDropdown && categorySearchTerm && (
                  <div className="absolute z-10 w-full mt-1 bg-card-background border border-primary/50 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {categories
                      .filter(cat => cat.toLowerCase().includes(categorySearchTerm.toLowerCase()))
                      .map(category => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setCategorySearchTerm(category);
                            setFormData(prev => ({ ...prev, category }));
                            setShowCategoryDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-primary/10 text-white transition-all"
                        >
                          {category}
                        </button>
                      ))
                      .length === 0 && (
                        <div className="px-4 py-2 text-gray-400 text-sm">No matching categories</div>
                      )}
                  </div>
                )}
              </div>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              <p className="text-gray-500 text-xs mt-1">
                Type or search to find a product category (e.g., Clothing, Jewelry)
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.description ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
                placeholder="Describe your offer in detail..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Pricing Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Original Price (kr.) *
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.originalPrice ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder="1000"
                />
                {errors.originalPrice && <p className="text-red-500 text-xs mt-1">{errors.originalPrice}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Discounted Price (kr.) *
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.discountPrice ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder="800"
                />
                {errors.discountPrice && <p className="text-red-500 text-xs mt-1">{errors.discountPrice}</p>}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Discount %
                </label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary transition-all"
                  placeholder="20"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Date & Time (varies by offer type) */}
          {selectedType !== "happy_hour" && (
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Offer Duration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                      errors.startDate ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                    }`}
                  />
                  {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                      errors.endDate ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                    }`}
                  />
                  {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Weekdays Selection (for weekdays offers) */}
          {selectedType === "weekdays" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Select Weekdays</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {weekdays.map(day => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => handleWeekdayChange(day.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        formData.weekdays.includes(day.id)
                          ? "bg-pink/10 border-pink text-pink"
                          : "bg-background border-pink/30 text-gray-400 hover:bg-pink/5"
                      }`}
                    >
                      {day.name}
                    </button>
                  ))}
                </div>
                {errors.weekdays && <p className="text-red-500 text-xs mt-2">{errors.weekdays}</p>}
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4">Time Range</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                        errors.startTime ? "border-red-500 focus:border-red-500" : "border-pink/30 focus:border-pink"
                      }`}
                    />
                    {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                      End Time *
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                        errors.endTime ? "border-red-500 focus:border-red-500" : "border-pink/30 focus:border-pink"
                      }`}
                    />
                    {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4">Location</h4>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Restaurant/Address *
                  </label>
                  <input
                    type="text"
                    name="weekdayAddress"
                    value={formData.weekdayAddress}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.weekdayAddress ? "border-red-500 focus:border-red-500" : "border-pink/30 focus:border-pink"
                    }`}
                    placeholder="Enter restaurant address or location"
                  />
                  {errors.weekdayAddress && <p className="text-red-500 text-xs mt-1">{errors.weekdayAddress}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Happy Hour Specific Fields */}
          {selectedType === "happy_hour" && (
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Happy Hour Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                      errors.startTime ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                    }`}
                  />
                  {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                      errors.endTime ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                    }`}
                  />
                  {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.location ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                    }`}
                    placeholder="Bar/Restaurant name"
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Offer Link (not for Gift Card) */}
          {selectedType !== "gift_card" && (
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Offer Website Link
              </label>
              <input
                type="url"
                name="offerLink"
                value={formData.offerLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary transition-all"
                placeholder="https://your-website.com/offer"
              />
              <p className="text-gray-500 text-xs mt-1">Link to your original offer or website</p>
            </div>
          )}

          {/* Terms & Conditions */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Terms & Conditions (Optional)
            </label>
            <textarea
              name="terms"
              value={formData.terms}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary transition-all resize-none"
              placeholder="Any specific terms or conditions for this offer..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Upload Offer Image (Optional)
            </label>
            <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-background border border-primary/30 rounded-lg cursor-pointer hover:border-primary transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {previewImageUrl ? (
                <img src={previewImageUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              ) : (
                <>
                  <span className="text-gray-400 text-sm">Click to upload or drag and drop</span>
                  <span className="text-gray-500 text-xs">PNG, JPG or SVG (max. 2MB)</span>
                </>
              )}
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end pt-6 border-t border-primary/30">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus size={20} />
                  Create Offer
                </>
              )}
            </button>
          </div>
        </form>
        </div>

        {/* Preview Section */}
        <div className="bg-card-background border border-primary rounded-2xl p-6 lg:p-8 max-h-[800px] overflow-y-auto scrollbar-custom">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="text-primary" size={20} />
            <h2 className="text-xl font-bold text-white">Preview</h2>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            See how your offer card will look to customers
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              {selectedType === "active" && (
                <ActiveOfferCard offer={previewActiveOffer} />
              )}
              {selectedType === "weekdays" && (
                <WeeklyOfferCard offer={previewWeeklyOffer} />
              )}
              {selectedType === "happy_hour" && (
                <HappyHourOfferCard offer={previewHappyHourOffer} />
              )}
              {selectedType === "gift_card" && (
                <GiftOfferCard offer={previewGiftOffer} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
