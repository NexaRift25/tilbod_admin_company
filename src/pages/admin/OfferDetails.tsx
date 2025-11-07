import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Calendar,
  Eye,
  Users,
  TrendingUp,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Building2
} from "lucide-react";
import ActiveOfferCard from "@/components/offerCards/active-offer-card";
import HappyHourOfferCard from "@/components/offerCards/happyHour";
import GiftOfferCard from "@/components/offerCards/giftOfferCard";
import WeeklyOfferCard from "@/components/offerCards/weeklyOfferCard";

interface OfferDetails {
  id: string;
  title: string;
  type: "active" | "weekdays" | "happy_hour" | "gift_card";
  companyName: string;
  category: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  status: "pending" | "approved" | "active" | "expired" | "rejected" | "revision";
  startDate: string;
  endDate: string;
  createdAt: string;
  views: number;
  purchases: number;
  revenue: number;
  extensionCount: number;
  description?: string;
  location?: string;
  weekdayAddress?: string;
  startTime?: string;
  endTime?: string;
  weekdays?: string[];
  offerLink?: string;
  terms?: string;
  image?: string;
  revisionCount?: number;
}

// Mock data - in real app, fetch from API based on ID
const mockOffers: OfferDetails[] = [
  {
    id: "1",
    title: "Weekend Getaway Package",
    type: "active",
    companyName: "Hotel Aurora",
    category: "Hotels & Accommodation",
    originalPrice: 50000,
    discountPrice: 35000,
    discountPercentage: 30,
    status: "active",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    createdAt: "2024-12-15",
    views: 245,
    purchases: 12,
    revenue: 420000,
    extensionCount: 1,
    description: "Experience luxury accommodation with breathtaking views. Perfect for a romantic weekend getaway.",
    offerLink: "https://example.com/weekend-package",
    terms: "Valid for new bookings only. Non-refundable.",
    image: "/placeholder-image.jpg"
  },
  {
    id: "2",
    title: "Happy Hour Special",
    type: "happy_hour",
    companyName: "Reykjavik Bar & Lounge",
    category: "Food & Dining",
    originalPrice: 1500,
    discountPrice: 1000,
    discountPercentage: 33,
    status: "pending",
    startDate: "2025-01-15",
    endDate: "2025-02-15",
    createdAt: "2024-12-20",
    views: 0,
    purchases: 0,
    revenue: 0,
    extensionCount: 0,
    description: "Great drinks at discounted prices during happy hour.",
    location: "Downtown Bar",
    startTime: "17:00",
    endTime: "19:00",
    offerLink: "https://example.com/happyhour",
    terms: "Valid Monday-Friday only",
    image: "/placeholder-image.jpg"
  },
  {
    id: "3",
    title: "Tuesday Restaurant Special",
    type: "weekdays",
    companyName: "Nordic Spa & Wellness",
    category: "Food & Dining",
    originalPrice: 2500,
    discountPrice: 2000,
    discountPercentage: 20,
    status: "approved",
    startDate: "2025-01-10",
    endDate: "2025-03-10",
    createdAt: "2024-12-18",
    views: 156,
    purchases: 8,
    revenue: 16000,
    extensionCount: 0,
    description: "Delicious meals at great prices during weekdays.",
    weekdayAddress: "123 Main Street, Reykjavik",
    startTime: "11:00",
    endTime: "14:00",
    weekdays: ["tuesday"],
    offerLink: "https://example.com/restaurant-deal",
    terms: "Not valid on holidays",
    image: "/placeholder-image.jpg"
  },
  {
    id: "4",
    title: "Spa & Wellness Gift Card",
    type: "gift_card",
    companyName: "Blue Lagoon Spa",
    category: "Wellness & Spa",
    originalPrice: 10000,
    discountPrice: 8500,
    discountPercentage: 15,
    status: "expired",
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    createdAt: "2024-10-25",
    views: 89,
    purchases: 15,
    revenue: 127500,
    extensionCount: 2,
    description: "Perfect gift for someone special. Valid for spa treatments.",
    terms: "Valid for 1 year from purchase",
    image: "/placeholder-image.jpg"
  }
];

export default function AdminOfferDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<OfferDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchOffer = () => {
      setLoading(true);
      setTimeout(() => {
        const foundOffer = mockOffers.find(o => o.id === id);
        setOffer(foundOffer || null);
        setLoading(false);
      }, 500);
    };

    fetchOffer();
  }, [id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
        return <CheckCircle className="text-green" size={20} />;
      case "rejected":
        return <XCircle className="text-red-500" size={20} />;
      case "revision":
        return <AlertCircle className="text-yellow" size={20} />;
      case "pending":
        return <Clock className="text-yellow" size={20} />;
      case "expired":
        return <AlertCircle className="text-gray-400" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
        return "bg-green/10 text-green border-green";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500";
      case "revision":
        return "bg-yellow/10 text-yellow border-yellow";
      case "pending":
        return "bg-yellow/10 text-yellow border-yellow";
      case "expired":
        return "bg-gray-500/10 text-gray-400 border-gray-500";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "active":
        return "Active";
      case "rejected":
        return "Rejected";
      case "revision":
        return "Needs Revision";
      case "pending":
        return "Pending Review";
      case "expired":
        return "Expired";
      default:
        return "Unknown";
    }
  };

  const calculateTimeLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days left`;
  };

  // Transform offer data for ActiveOfferCard
  const transformToActiveOffer = (offer: OfferDetails) => {
    return {
      id: parseInt(offer.id),
      offerType: offer.type,
      title: offer.title,
      discount: `${offer.discountPercentage}% Discount`,
      description: offer.description || `${offer.title} - ${offer.category}`,
      image: offer.image || "/placeholder-image.jpg",
      category: offer.category,
      timeLeft: calculateTimeLeft(offer.endDate),
      location: offer.location || "",
      price: offer.originalPrice.toLocaleString(),
      discountPrice: offer.discountPrice.toLocaleString(),
      link: offer.offerLink || `/admin/offers/${offer.id}`
    };
  };

  // Transform offer data for WeeklyOfferCard
  const transformToWeeklyOffer = (offer: OfferDetails) => {
    const weekdays = offer.weekdays || [];
    const dayAbbreviations = weekdays.map(day => {
      const dayMap: Record<string, string> = {
        "monday": "Mon",
        "tuesday": "Tue",
        "wednesday": "Wed",
        "thursday": "Thu",
        "friday": "Fri",
        "saturday": "Sat",
        "sunday": "Sun"
      };
      return dayMap[day.toLowerCase()] || day.substring(0, 3);
    });

    return {
      id: parseInt(offer.id),
      offerType: offer.type,
      title: offer.title,
      discount: `${offer.discountPercentage}% Discount`,
      description: offer.description || `${offer.title} - ${offer.category}`,
      image: offer.image || "/placeholder-image.jpg",
      badge: offer.category,
      location: offer.location || offer.weekdayAddress || "",
      time: offer.startTime && offer.endTime 
        ? `${offer.startTime} - ${offer.endTime}` 
        : "Available all day",
      availableDays: dayAbbreviations.length > 0 ? dayAbbreviations : ["Mon", "Tue", "Wed", "Thu", "Fri"],
      link: offer.offerLink || `/admin/offers/${offer.id}`
    };
  };

  // Transform offer data for HappyHourOfferCard
  const transformToHappyHourOffer = (offer: OfferDetails) => {
    const weekdays = offer.weekdays || [];
    const dayAbbreviations = weekdays.map(day => {
      const dayMap: Record<string, string> = {
        "monday": "Mon",
        "tuesday": "Tue",
        "wednesday": "Wed",
        "thursday": "Thu",
        "friday": "Fri",
        "saturday": "Sat",
        "sunday": "Sun"
      };
      return dayMap[day.toLowerCase()] || day.substring(0, 3);
    });

    return {
      id: parseInt(offer.id),
      offerType: offer.type,
      title: offer.title,
      time: offer.startTime && offer.endTime 
        ? `${offer.startTime} - ${offer.endTime}` 
        : "5:00 PM - 7:00 PM",
      description: offer.description || `${offer.title} - ${offer.category}`,
      image: offer.image || "/placeholder-image.jpg",
      status: offer.status === "active" ? "Open now" : "Closed",
      location: offer.location || "",
      pricing: `${offer.discountPrice.toLocaleString()} kr.`,
      availableDays: dayAbbreviations.length > 0 ? dayAbbreviations : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      link: offer.offerLink || `/admin/offers/${offer.id}`
    };
  };

  // Transform offer data for GiftOfferCard
  const transformToGiftOffer = (offer: OfferDetails) => {
    return {
      id: parseInt(offer.id),
      offerType: offer.type,
      title: offer.title,
      price: `${offer.discountPrice.toLocaleString()} kr.`,
      description: offer.description || `${offer.title} - ${offer.category}`,
      image: offer.image || "/placeholder-image.jpg",
      category: offer.category,
      timeLeft: calculateTimeLeft(offer.endDate),
      purchaseCount: offer.purchases,
      link: offer.offerLink || `/admin/offers/${offer.id}`
    };
  };

  // Render appropriate card based on offer type
  const renderOfferCard = (offer: OfferDetails) => {
    switch (offer.type) {
      case "active":
        return <ActiveOfferCard offer={transformToActiveOffer(offer)} />;
      case "weekdays":
        return <WeeklyOfferCard offer={transformToWeeklyOffer(offer)} />;
      case "happy_hour":
        return <HappyHourOfferCard offer={transformToHappyHourOffer(offer)} />;
      case "gift_card":
        return <GiftOfferCard offer={transformToGiftOffer(offer)} />;
      default:
        return <ActiveOfferCard offer={transformToActiveOffer(offer)} />;
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
        <div className="bg-card-background border border-primary rounded-2xl p-6 animate-pulse">
          <div className="h-64 bg-background rounded-lg" />
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/admin/offers"
            className="flex items-center justify-center w-10 h-10 border border-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Offer Not Found
            </h1>
          </div>
        </div>
        <div className="bg-card-background border border-primary rounded-2xl p-6 text-center">
          <p className="text-gray-400">The requested offer could not be found.</p>
        </div>
      </div>
    );
  }

  const weekdayMap: Record<string, string> = {
    "monday": "Monday",
    "tuesday": "Tuesday",
    "wednesday": "Wednesday",
    "thursday": "Thursday",
    "friday": "Friday",
    "saturday": "Saturday",
    "sunday": "Sunday"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Link
            to="/admin/offers"
            className="p-2 hover:bg-primary/10 rounded-lg transition-all flex-shrink-0"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 truncate">
              Offer Details
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              View complete information about this offer
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:flex-shrink-0">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green/10 border border-green text-green font-semibold rounded-lg hover:bg-green/20 transition-all text-sm sm:text-base">
            <CheckCircle size={18} />
            <span>Approve</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-500/20 transition-all text-sm sm:text-base">
            <XCircle size={18} />
            <span>Reject</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="2xl:col-span-2 col-span-2 space-y-6">
          {/* Company Information */}
          <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="text-primary" size={20} />
              Company Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-3 sm:p-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Company Name</p>
                <p className="text-white text-base sm:text-lg font-semibold break-words">{offer.companyName}</p>
              </div>
              <div className="bg-background rounded-lg p-3 sm:p-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Category</p>
                <p className="text-white text-base sm:text-lg font-semibold break-words">{offer.category}</p>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="text-primary" size={20} />
              Pricing Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-3 sm:p-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Original Price</p>
                <p className="text-white text-lg sm:text-xl font-bold">{offer.originalPrice.toLocaleString()} kr.</p>
              </div>
              <div className="bg-background rounded-lg p-3 sm:p-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Discounted Price</p>
                <p className="text-green text-lg sm:text-xl font-bold">{offer.discountPrice.toLocaleString()} kr.</p>
              </div>
              <div className="bg-background rounded-lg p-3 sm:p-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Discount</p>
                <p className="text-primary text-lg sm:text-xl font-bold">{offer.discountPercentage}% OFF</p>
              </div>
            </div>
          </div>

          {/* Offer Duration */}
          <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="text-primary" size={20} />
              Offer Duration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-3 sm:p-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Start Date</p>
                <p className="text-white text-sm sm:text-base lg:text-lg font-semibold">
                  {new Date(offer.startDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="bg-background rounded-lg p-3 sm:p-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">End Date</p>
                <p className="text-white text-sm sm:text-base lg:text-lg font-semibold">
                  {new Date(offer.endDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-primary text-xs sm:text-sm mt-1">{calculateTimeLeft(offer.endDate)}</p>
              </div>
            </div>
          </div>

          {/* Type-Specific Details */}
          {offer.type === "weekdays" && (
            <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="text-primary" size={20} />
                Weekdays Details
              </h3>
              <div className="space-y-4">
                {offer.weekdays && offer.weekdays.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Available Days</p>
                    <div className="flex flex-wrap gap-2">
                      {offer.weekdays.map(day => (
                        <span key={day} className="px-3 py-1 bg-green/10 text-green border border-green rounded-lg text-sm">
                          {weekdayMap[day] || day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {offer.startTime && offer.endTime && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Time Range</p>
                    <p className="text-white text-lg font-semibold">{offer.startTime} - {offer.endTime}</p>
                  </div>
                )}
                {offer.weekdayAddress && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                      <MapPin size={16} />
                      Location
                    </p>
                    <p className="text-white text-lg font-semibold">{offer.weekdayAddress}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {offer.type === "happy_hour" && (
            <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="text-primary" size={20} />
                Happy Hour Details
              </h3>
              <div className="space-y-4">
                {offer.startTime && offer.endTime && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Time Range</p>
                    <p className="text-white text-lg font-semibold">{offer.startTime} - {offer.endTime}</p>
                  </div>
                )}
                {offer.location && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                      <MapPin size={16} />
                      Location
                    </p>
                    <p className="text-white text-lg font-semibold">{offer.location}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {(offer.terms || offer.offerLink) && (
            <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="text-primary" size={20} />
                Additional Information
              </h3>
              <div className="space-y-4">
                {offer.terms && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Terms & Conditions</p>
                    <p className="text-gray-300">{offer.terms}</p>
                  </div>
                )}
                {offer.offerLink && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Offer Link</p>
                    <a 
                      href={offer.offerLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {offer.offerLink}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2   xl:col-span-1 space-y-6">
          {/* Offer Card Preview */}
          <div className=" bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white">Offer Preview</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 sm:px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold border ${getStatusColor(offer.status)}`}>
                    {getStatusIcon(offer.status)}
                    <span className="hidden sm:inline">{getStatusText(offer.status)}</span>
                    <span className="sm:hidden">{getStatusText(offer.status).split(' ')[0]}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-center overflow-x-auto">
              <div className="w-full max-w-sm sm:max-w-md lg:max-w-full">
                {renderOfferCard(offer)}
              </div>
            </div>
          </div>
          
          {/* Status Card */}
          <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4">Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Status</span>
                <span className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold border ${getStatusColor(offer.status)}`}>
                  {getStatusIcon(offer.status)}
                  {getStatusText(offer.status)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Created</span>
                <span className="text-white font-semibold">
                  {new Date(offer.createdAt).toLocaleDateString()}
                </span>
              </div>
              {offer.revisionCount !== undefined && offer.revisionCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Revision Attempt</span>
                  <span className="text-yellow font-semibold">
                    {offer.revisionCount}/2
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="text-primary" size={20} />
              Performance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="text-gray-400" size={18} />
                  <span className="text-gray-400">Views</span>
                </div>
                <span className="text-white font-bold">{offer.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="text-gray-400" size={18} />
                  <span className="text-gray-400">Purchases</span>
                </div>
                <span className="text-white font-bold">{offer.purchases}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-gray-400" size={18} />
                  <span className="text-gray-400">Revenue</span>
                </div>
                <span className="text-green font-bold">{offer.revenue.toLocaleString()} kr.</span>
              </div>
              {offer.purchases > 0 && offer.views > 0 && (
                <div className="pt-3 border-t border-primary/30">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Conversion Rate</span>
                    <span className="text-primary font-bold">
                      {((offer.purchases / offer.views) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Extension Info */}
          <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4">Extensions</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Used</span>
                <span className="text-white font-semibold">{offer.extensionCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Maximum</span>
                <span className="text-white font-semibold">4</span>
              </div>
            </div>
          </div>

          {/* Revision Notice */}
          {offer.status === "revision" && (
            <div className="bg-yellow/10 border border-yellow rounded-2xl p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-yellow font-bold mb-1">Revision Required</h4>
                  <p className="text-sm text-gray-300">
                    This offer needs revision. {offer.revisionCount && `Attempt ${offer.revisionCount}/2.`} Please review and request changes from the company.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

