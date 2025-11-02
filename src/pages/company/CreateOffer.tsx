import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Info,
  Building2,
  Paperclip,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Eye
} from "lucide-react";
import { DateInput } from "@/components/ui/date-input";
import ActiveOfferCard from "@/components/offerCards/active-offer-card";
import GiftOfferCard from "@/components/offerCards/giftOfferCard";
import HappyHourOfferCard from "@/components/offerCards/happyHour";
import WeeklyOfferCard from "@/components/offerCards/weeklyOfferCard";

interface OfferFormData {
  offerType: string;
  title: string;
  typeToggle: "discount" | "offer";
  discountPercentage: string;
  companyForDiscount: string;
  startDate: string;
  endDate: string;
  offerText: string;
  companyCustomers: string;
  photo: File | null;
  price: string;
  startHour: string;
  endHour: string;
  weekdays: string[];
}

const offerTypesList = [
  "Active offers",
  "Weekday offers",
  "Happy hour offers",
  "Gift cards"
];

const mockCompanies = [
  "Nordic Spa & Wellness",
  "Hotel Aurora",
  "Reykjavik Bar & Lounge",
  "Mountain Resort",
  "Blue Lagoon Tours"
];

export default function CreateOfferPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<OfferFormData>({
    offerType: "Active offers",
    title: "",
    typeToggle: "discount",
    discountPercentage: "",
    companyForDiscount: "",
    startDate: "",
    endDate: "",
    offerText: "",
    companyCustomers: "",
    photo: null,
    price: "",
    startHour: "9",
    endHour: "17",
    weekdays: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleToggleChange = (value: "discount" | "offer") => {
    setFormData(prev => ({ ...prev, typeToggle: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Offer title is required";
    if (!formData.discountPercentage) newErrors.discountPercentage = "Discount percentage is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.offerText.trim()) newErrors.offerText = "Offer text is required";

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

      console.log("Creating offer:", formData);

      // Redirect to offers list
      navigate("/company/offers");
    } catch (error) {
      console.error("Offer creation failed", error);
      setErrors({ general: "Failed to create offer. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up object URL when component unmounts or photo changes
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (formData.photo) {
      const url = URL.createObjectURL(formData.photo);
      setPreviewImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewImageUrl(null);
    }
  }, [formData.photo]);

  // Calculate time left from end date
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

  // Create preview offer data for Active offers
  const previewOffer = useMemo(() => {
    const discountText = formData.typeToggle === "discount" && formData.discountPercentage
      ? `${formData.discountPercentage}% OFF`
      : "Special Offer";
    
    const imageUrl = previewImageUrl || "/placeholder-image.jpg";

    // Calculate prices from discount
    let price = null;
    let discountPrice = null;
    if (formData.discountPercentage && formData.price) {
      const numericPrice = parseFloat(formData.price.replace(/[,\s]/g, ''));
      if (!isNaN(numericPrice)) {
        price = numericPrice.toString();
        const discount = parseFloat(formData.discountPercentage);
        if (!isNaN(discount)) {
          discountPrice = (numericPrice * (1 - discount / 100)).toFixed(0);
        }
      }
    }

    return {
      id: 0,
      offerType: formData.offerType,
      title: formData.title || "Your offer title",
      discount: discountText,
      description: formData.offerText || "Your offer description will appear here",
      image: imageUrl,
      category: formData.companyForDiscount || "Category",
      timeLeft: calculateTimeLeft(formData.endDate),
      location: "",
      price: price,
      discountPrice: discountPrice,
      link: "#"
    };
  }, [formData, previewImageUrl]);

  // Create preview gift card data
  const previewGiftOffer = useMemo(() => {
    const imageUrl = previewImageUrl || "/placeholder-image.jpg";
    
    return {
      id: 0,
      offerType: formData.offerType,
      title: formData.title || "Your gift card title",
      price: formData.price || "0",
      description: formData.offerText || "Your gift card description will appear here",
      image: imageUrl,
      category: formData.companyForDiscount || "Category",
      timeLeft: calculateTimeLeft(formData.endDate),
      purchaseCount: 0,
      link: "#"
    };
  }, [formData, previewImageUrl]);

  // Create preview happy hour data
  const previewHappyHourOffer = useMemo(() => {
    const imageUrl = previewImageUrl || "/placeholder-image.jpg";
    
    // Format time range from dates or use placeholder
    const formatTimeRange = () => {
      if (formData.startDate && formData.endDate) {
        // For preview, we'll show a generic time range
        return "5:00 PM - 7:00 PM";
      }
      return "Happy Hour Time";
    };

    // Calculate status based on current time vs happy hour time
    const calculateStatus = () => {
      // For preview, default to "Closed" or we could check current time
      const now = new Date();
      const hours = now.getHours();
      // If it's between 5-7 PM, show "Open now", otherwise "Closed"
      if (hours >= 17 && hours < 19) {
        return "Open now";
      }
      return "Closed";
    };

    // Convert companyCustomers to location or use placeholder
    const location = formData.companyCustomers || formData.companyForDiscount || "Location";

    // Format pricing
    const pricing = formData.price ? `${formData.price} kr.` : "Special pricing";

    // Available days - for preview, show all days, but in real implementation
    // this would come from form data for happy hour
    const availableDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return {
      id: 0,
      offerType: formData.offerType,
      title: formData.title || "Your happy hour title",
      time: formatTimeRange(),
      description: formData.offerText || "Your happy hour description will appear here",
      image: imageUrl,
      status: calculateStatus(),
      location: location,
      pricing: pricing,
      availableDays: availableDays,
      link: "#"
    };
  }, [formData, previewImageUrl]);

  // Create preview weekly offer data
  const previewWeeklyOffer = useMemo(() => {
    const imageUrl = previewImageUrl || "/placeholder-image.jpg";
    
    // Format discount from typeToggle and discountPercentage
    const formatDiscount = () => {
      if (formData.discountPercentage) {
        return formData.typeToggle === "discount" 
          ? `${formData.discountPercentage}% Discount`
          : `${formData.discountPercentage}% Off`;
      }
      return formData.typeToggle === "discount" ? "Discount Available" : "Special Offer";
    };

    // Format time range from hours (24-hour format)
    const formatTime = () => {
      if (formData.startHour && formData.endHour) {
        const startHour = parseInt(formData.startHour);
        const endHour = parseInt(formData.endHour);
        const formatHour = (hour: number) => {
          return hour.toString().padStart(2, '0') + ':00';
        };
        return `${formatHour(startHour)} - ${formatHour(endHour)}`;
      }
      return "Available all day";
    };

    // Badge text (could be category or company name)
    const badge = formData.companyForDiscount || "Weekly Special";

    // Location
    const location = formData.companyCustomers || formData.companyForDiscount || "Location";

    // Available days - use selected weekdays from form data
    const availableDays = formData.weekdays.length > 0 
      ? formData.weekdays 
      : ["Mon", "Tue", "Wed", "Thu", "Fri"]; // Default to weekdays if none selected

    return {
      id: 0,
      offerType: formData.offerType,
      title: formData.title || "Your weekly offer title",
      discount: formatDiscount(),
      description: formData.offerText || "Your weekly offer description will appear here",
      image: imageUrl,
      badge: badge,
      location: location,
      time: formatTime(),
      availableDays: availableDays,
      link: "#"
    };
  }, [formData, previewImageUrl]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
        <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Create Offer Page
          </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Create Offer Form */}
        <form onSubmit={handleSubmit} className="bg-card-background border border-primary rounded-2xl p-6 lg:p-8">
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-500">{errors.general}</p>
          </div>
        )}

        {/* Select type of offer */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
            <Info size={16} className="text-gray-400" />
            Select type of offer
          </label>
          <div className="relative">
            <select
              name="offerType"
              value={formData.offerType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary transition-all appearance-none pr-10"
            >
              {offerTypesList.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>

        {/* Single Column Layout */}
        <div className="space-y-6">
          {/* Offer title */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <Info size={16} className="text-gray-400" />
              Offer title
              </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-10 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.title ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                }`}
                placeholder="What are you going to put on offer?"
              />
              <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

          {/* Type of offer toggle */}
            <div>
            <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <Info size={16} className="text-gray-400" />
              Type of offer
              </label>
            <div className="relative flex items-center bg-background border border-primary/50 rounded-lg p-1">
              <div
                className={`absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-white rounded-md transition-all duration-300 ease-in-out ${
                  formData.typeToggle === "offer" ? "translate-x-full" : "translate-x-0"
                }`}
                style={{
                  left: "4px"
                }}
              />
              <button
                type="button"
                onClick={() => handleToggleChange("discount")}
                className={`relative z-10 flex-1 px-4 py-3 rounded-md font-medium transition-colors ${
                  formData.typeToggle === "discount"
                    ? "text-dark"
                    : "text-gray-400"
                }`}
              >
                Discount
              </button>
              <button
                type="button"
                onClick={() => handleToggleChange("offer")}
                className={`relative z-10 flex-1 px-4 py-3 rounded-md font-medium transition-colors ${
                  formData.typeToggle === "offer"
                    ? "text-dark"
                    : "text-gray-400"
                }`}
              >
                Offer
              </button>
            </div>
            </div>

          {/* Amount of discount */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <Info size={16} className="text-gray-400" />
              Amount of discount
              </label>
            <div className="relative">
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-10 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.discountPercentage ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                }`}
                placeholder="Discount %"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
            </div>
            {errors.discountPercentage && <p className="text-red-500 text-xs mt-1">{errors.discountPercentage}</p>}
          </div>

          {/* Companies for which the discount is available */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <Info size={16} className="text-gray-400" />
              Companies for which the discount is available
                </label>
            <div className="relative">
              <select
                name="companyForDiscount"
                value={formData.companyForDiscount}
                  onChange={handleInputChange}
                className="w-full px-4 py-3 pr-10 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary transition-all appearance-none"
              >
                <option value="">Company</option>
                {mockCompanies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
              <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
              </div>

          {/* Discount valid from time to time */}
              <div>
            <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <Info size={16} className="text-gray-400" />
              Discount valid from time to time
                </label>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <DateInput
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  placeholder="From"
                  error={!!errors.startDate}
                />
                {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
              </div>
              <div className="flex-1">
                <DateInput
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  placeholder="To"
                  error={!!errors.endDate}
                />
                {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Weekday offers specific fields */}
          {formData.offerType === "Weekday offers" && (
            <>
              {/* Select hours (24-hour format) */}
            <div>
                <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                  <Info size={16} className="text-gray-400" />
                  Select hours (24-hour format)
                  </label>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <select
                        name="startHour"
                        value={formData.startHour}
                    onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-10 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary transition-all appearance-none"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}:00
                          </option>
                        ))}
                      </select>
                      <ArrowRight className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                    {errors.startHour && <p className="text-red-500 text-xs mt-1">{errors.startHour}</p>}
                </div>
                  <div className="flex-1">
                    <div className="relative">
                      <select
                        name="endHour"
                        value={formData.endHour}
                    onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-10 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary transition-all appearance-none"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}:00
                          </option>
                        ))}
                      </select>
                      <ArrowRight className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                    {errors.endHour && <p className="text-red-500 text-xs mt-1">{errors.endHour}</p>}
                  </div>
                </div>
              </div>

              {/* Select weekdays */}
            <div>
                <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                  <Info size={16} className="text-gray-400" />
                  Select weekdays when offer will run
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <button
                      key={day}
                    type="button"
                      onClick={() => {
                        setFormData(prev => {
                          const weekdays = prev.weekdays.includes(day)
                            ? prev.weekdays.filter(d => d !== day)
                            : [...prev.weekdays, day];
                          return { ...prev, weekdays };
                        });
                      }}
                      className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                        formData.weekdays.includes(day)
                          ? 'bg-primary text-dark border-2 border-primary'
                          : 'bg-background border-2 border-primary/50 text-gray-300 hover:border-primary/80'
                      }`}
                    >
                      {day}
                  </button>
                ))}
                </div>
                {errors.weekdays && <p className="text-red-500 text-xs mt-1">{errors.weekdays}</p>}
              </div>
            </>
          )}

          {/* Text in offer box */}
            <div>
            <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <Info size={16} className="text-gray-400" />
              Text in offer box
                  </label>
            <textarea
              name="offerText"
              value={formData.offerText}
                    onChange={handleInputChange}
              rows={6}
              className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.offerText ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                    }`}
              placeholder="Further explanation of the offer"
                  />
            {errors.offerText && <p className="text-red-500 text-xs mt-1">{errors.offerText}</p>}
                </div>

          {/* Discounts for customers only */}
                <div>
            <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <Info size={16} className="text-gray-400" />
              Discounts for customers only
                  </label>
            <div className="relative">
              <select
                name="companyCustomers"
                value={formData.companyCustomers}
                    onChange={handleInputChange}
                className="w-full px-4 py-3 pr-10 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary transition-all appearance-none"
              >
                <option value="">Company customers</option>
                {mockCompanies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
              <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
                </div>

          {/* Upload a photo for a quote */}
                <div>
            <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <Info size={16} className="text-gray-400" />
              Upload a photo for a quote
                  </label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-background border border-primary/50 rounded-lg text-white cursor-pointer hover:border-primary transition-all">
              <Paperclip size={20} className="text-gray-400" />
              <span className="text-gray-300">Upload a photo</span>
                  <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {formData.photo && (
              <p className="text-sm text-gray-400 mt-2">{formData.photo.name}</p>
            )}
            </div>

          {/* Price */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <Info size={16} className="text-gray-400" />
              Price
            </label>
            <div className="relative">
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-16 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.price ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary"
                }`}
                placeholder="Enter price"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">kr.</span>
            </div>
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
          </div>

          {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-primary/50">
            <button
              type="submit"
              disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                Confirm offer and pay
                <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>

      {/* Preview Section - Show for Active offers, Weekday offers, Gift cards, and Happy hour offers */}
      {(formData.offerType === "Active offers" || formData.offerType === "Weekday offers" || formData.offerType === "Gift cards" || formData.offerType === "Happy hour offers") && (
        <div className="bg-card-background border border-primary rounded-2xl p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="text-primary" size={20} />
            <h2 className="text-xl font-bold text-white">Preview</h2>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            See how your offer card will look to customers
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              {formData.offerType === "Active offers" && (
                <ActiveOfferCard offer={previewOffer} />
              )}
              {formData.offerType === "Weekday offers" && (
                <WeeklyOfferCard offer={previewWeeklyOffer} />
              )}
              {formData.offerType === "Gift cards" && (
                <GiftOfferCard offer={previewGiftOffer} />
              )}
              {formData.offerType === "Happy hour offers" && (
                <HappyHourOfferCard offer={previewHappyHourOffer} />
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}