import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Tag,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  ArrowLeft,
  Eye,
  Search
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

// offerTypes will be created inside component to use translations

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

export default function CreateOfferPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const offerTypes = [
    {
      id: "active",
      name: t("createOffer.activeOffer"),
      description: t("createOffer.activeOfferDescription"),
      icon: Tag,
      color: "bg-yellow/10 text-yellow border-yellow"
    },
    {
      id: "weekdays",
      name: t("createOffer.weekdaysOffer"),
      description: t("createOffer.weekdaysOfferDescription"),
      icon: Calendar,
      color: "bg-pink/10 text-pink border-pink"
    },
    {
      id: "happy_hour",
      name: t("createOffer.happyHourOffer"),
      description: t("createOffer.happyHourOfferDescription"),
      icon: Clock,
      color: "bg-green/10 text-green border-green"
    },
    {
      id: "gift_card",
      name: t("createOffer.giftCard"),
      description: t("createOffer.giftCardDescription"),
      icon: DollarSign,
      color: "bg-orange-500/10 text-orange-500 border-orange-500"
    }
  ];

  const weekdays = [
    { id: "monday", name: t("weekdays.monday") },
    { id: "tuesday", name: t("weekdays.tuesday") },
    { id: "wednesday", name: t("weekdays.wednesday") },
    { id: "thursday", name: t("weekdays.thursday") },
    { id: "friday", name: t("weekdays.friday") },
    { id: "saturday", name: t("weekdays.saturday") },
    { id: "sunday", name: t("weekdays.sunday") }
  ];
  const [selectedType, setSelectedType] = useState<OfferType>("active");
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
    if (!endDate) return t("createOffer.endsSoon");
    const end = new Date(endDate + "T23:59:59");
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return t("createOffer.ended");
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return days === 1 ? t("createOffer.dayLeft", { count: days }) : t("createOffer.daysLeft", { count: days });
    if (hours > 0) return hours === 1 ? t("createOffer.hourLeft", { count: hours }) : t("createOffer.hoursLeft", { count: hours });
    if (minutes > 0) return t("createOffer.minLeft", { count: minutes });
    return t("createOffer.endsSoon");
  };

  // Transform form data for ActiveOfferCard preview
  const previewActiveOffer = useMemo(() => {
    return {
      id: 0,
      offerType: "active",
      title: formData.title || t("createOffer.yourOfferTitle"),
      discount: formData.discountPercentage ? `${formData.discountPercentage}% OFF` : t("createOffer.specialOffer"),
      description: formData.description || t("createOffer.yourOfferDescription"),
      image: previewImageUrl || formData.image || "/placeholder-image.jpg",
      category: formData.category || t("common.category"),
      timeLeft: calculateTimeLeft(formData.endDate),
      location: "",
      price: formData.originalPrice || null,
      discountPrice: formData.discountPrice || null,
      link: formData.offerLink || "#"
    };
  }, [formData, previewImageUrl, t]);

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
      title: formData.title || t("createOffer.yourWeeklyOfferTitle"),
      discount: formData.discountPercentage ? `${formData.discountPercentage}% Discount` : t("createOffer.discountAvailable"),
      description: formData.description || t("createOffer.yourWeeklyOfferDescription"),
      image: previewImageUrl || formData.image || "/placeholder-image.jpg",
      badge: formData.category || t("createOffer.weeklySpecial"),
      location: formData.weekdayAddress || t("createOffer.locationLabel"),
      time: formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : t("createOffer.availableAllDay"),
      availableDays: availableDays.length > 0 ? availableDays : ["Mon", "Tue", "Wed", "Thu", "Fri"],
      link: formData.offerLink || "#"
    };
  }, [formData, previewImageUrl, t]);

  // Transform form data for HappyHourOfferCard preview
  const previewHappyHourOffer = useMemo(() => {
    const calculateStatus = () => {
      if (!formData.startTime || !formData.endTime) return t("createOffer.closed");
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hours + minutes / 60;
      
      const [startHour, startMin] = formData.startTime.split(':').map(Number);
      const [endHour, endMin] = formData.endTime.split(':').map(Number);
      const startDecimal = startHour + startMin / 60;
      const endDecimal = endHour + endMin / 60;
      
      if (currentTime >= startDecimal && currentTime < endDecimal) {
        return t("createOffer.openNow");
      }
      return t("createOffer.closed");
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
      title: formData.title || t("createOffer.yourOfferTitle"),
      time: formatTimeRange(),
      description: formData.description || t("createOffer.yourOfferDescription"),
      image: previewImageUrl || formData.image || "/placeholder-image.jpg",
      status: calculateStatus(),
      location: formData.location || t("createOffer.locationLabel"),
      pricing: formData.discountPrice ? `${formData.discountPrice} kr.` : t("createOffer.specialOffer"),
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      link: formData.offerLink || "#"
    };
  }, [formData, previewImageUrl, t]);

  // Transform form data for GiftOfferCard preview
  const previewGiftOffer = useMemo(() => {
    return {
      id: 0,
      offerType: "gift_card",
      title: formData.title || t("createOffer.yourOfferTitle"),
      price: formData.discountPrice || "0",
      description: formData.description || t("createOffer.yourOfferDescription"),
      image: previewImageUrl || formData.image || "/placeholder-image.jpg",
      category: formData.category || t("common.category"),
      timeLeft: calculateTimeLeft(formData.endDate),
      purchaseCount: 0,
      link: "#"
    };
  }, [formData, previewImageUrl, t]);

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
      console.log("Creating offer:", { ...formData, type: selectedType });

      // Redirect to offers list
      navigate("/company/offers");
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
          to="/company/offers"
          className="p-2 hover:bg-primary/10 rounded-lg transition-all"
        >
          <ArrowLeft className="text-primary" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t("createOffer.title")}
          </h1>
          <p className="text-gray-400 text-sm">
            {t("createOffer.subtitle")}
          </p>
        </div>
      </div>

      {/* Offer Type Selection */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">{t("createOffer.selectType")}</h3>
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
            {t("createOffer.createOfferType", { type: selectedOfferType.name })}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                {t("createOffer.titleLabel")} *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.title ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
                placeholder={t("createOffer.titlePlaceholder")}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                {t("createOffer.productCategory")} *
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
                    placeholder={t("createOffer.productCategoryPlaceholder")}
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
                        <div className="px-4 py-2 text-gray-400 text-sm">{t("createOffer.noMatchingCategories")}</div>
                      )}
                  </div>
                )}
              </div>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              <p className="text-gray-500 text-xs mt-1">
                {t("createOffer.productCategoryHint")}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">
                {t("common.description")} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.description ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                }`}
                placeholder={t("createOffer.descriptionPlaceholder")}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">{t("createOffer.pricingInformation")}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("createOffer.originalPriceLabel")} *
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
                  {t("createOffer.discountedPriceLabel")} *
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
                  {t("createOffer.discountPercentLabel")}
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
              <h4 className="text-lg font-bold text-white mb-4">{t("createOffer.dates")}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    {t("createOffer.startDate")} *
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
                    {t("createOffer.endDate")} *
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
                <h4 className="text-lg font-bold text-white mb-4">{t("createOffer.selectWeekdays")}</h4>
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
                <h4 className="text-lg font-bold text-white mb-4">{t("createOffer.timeRange")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                      {t("createOffer.startTimeLabel")} *
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
                      {t("createOffer.endTimeLabel")} *
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
                <h4 className="text-lg font-bold text-white mb-4">{t("createOffer.locationLabel")}</h4>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    {t("createOffer.weekdayAddressLabel")} *
                  </label>
                  <input
                    type="text"
                    name="weekdayAddress"
                    value={formData.weekdayAddress}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.weekdayAddress ? "border-red-500 focus:border-red-500" : "border-pink/30 focus:border-pink"
                    }`}
                    placeholder={t("createOffer.weekdayAddressPlaceholder")}
                  />
                  {errors.weekdayAddress && <p className="text-red-500 text-xs mt-1">{errors.weekdayAddress}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Happy Hour Specific Fields */}
          {selectedType === "happy_hour" && (
            <div>
              <h4 className="text-lg font-bold text-white mb-4">{t("offerDetails.happyHourDetails")}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    {t("createOffer.startTimeLabel")} *
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
                    {t("createOffer.endTimeLabel")} *
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
                    {t("createOffer.locationLabel")} *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.location ? "border-red-500 focus:border-red-500" : "border-primary/30 focus:border-primary"
                    }`}
                    placeholder={t("createOffer.locationPlaceholder")}
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
                {t("createOffer.offerLinkLabel")}
              </label>
              <input
                type="url"
                name="offerLink"
                value={formData.offerLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary transition-all"
                placeholder={t("createOffer.offerLinkPlaceholder")}
              />
              <p className="text-gray-500 text-xs mt-1">{t("createOffer.optional")}</p>
            </div>
          )}

          {/* Terms & Conditions */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("createOffer.termsLabel")} ({t("createOffer.optional")})
            </label>
            <textarea
              name="terms"
              value={formData.terms}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary transition-all resize-none"
              placeholder={t("createOffer.termsPlaceholder")}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("createOffer.offerImage")} ({t("createOffer.optional")})
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
                  <span className="text-gray-400 text-sm">{t("createOffer.uploadImage")}</span>
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
                  {t("createOffer.create")}
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
            <h2 className="text-xl font-bold text-white">{t("createOffer.previewTitle")}</h2>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            {t("createOffer.previewDescription")}
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
