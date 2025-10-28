import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Tag,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  ArrowLeft
} from "lucide-react";

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
}

const offerTypes = [
  {
    id: "active",
    name: "Active Offer",
    description: "Daily promotional deals available year-round",
    icon: Tag,
    color: "bg-blue-500/10 text-blue-500 border-blue-500"
  },
  {
    id: "weekdays",
    name: "Weekdays Offer",
    description: "Special deals for restaurants and activities",
    icon: Calendar,
    color: "bg-green-500/10 text-green-500 border-green-500"
  },
  {
    id: "happy_hour",
    name: "Happy Hour Offer",
    description: "Time-based promotions for bars & restaurants",
    icon: Clock,
    color: "bg-purple-500/10 text-purple-500 border-purple-500"
  },
  {
    id: "gift_card",
    name: "Gift Card",
    description: "Prepaid value cards for hotels & services",
    icon: DollarSign,
    color: "bg-orange-500/10 text-orange-500 border-orange-500"
  }
];

const categories = [
  "Food & Dining",
  "Hotels & Accommodation",
  "Wellness & Spa",
  "Activities & Entertainment",
  "Shopping & Retail",
  "Beauty & Personal Care",
  "Health & Fitness"
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

export default function CreateOfferPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<OfferType>("active");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    image: ""
  });

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
    if (selectedType === "weekdays" && formData.weekdays.length === 0) {
      newErrors.weekdays = "At least one weekday must be selected";
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
          to="/company/dashboard"
          className="p-2 hover:bg-primary/10 rounded-lg transition-all"
        >
          <ArrowLeft className="text-primary" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Create New Offer
          </h1>
          <p className="text-gray-400 text-sm">
            Choose offer type and set up your promotion
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

      {/* Create Offer Form */}
      <div className="bg-card-background border border-primary rounded-2xl p-6 lg:p-8">
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

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Category *
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

          {/* Date & Time */}
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

          {/* Weekdays Selection */}
          {selectedType === "weekdays" && (
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
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-primary/30 text-gray-400 hover:bg-primary/5"
                    }`}
                  >
                    {day.name}
                  </button>
                ))}
              </div>
              {errors.weekdays && <p className="text-red-500 text-xs mt-2">{errors.weekdays}</p>}
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
    </div>
  );
}

