import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Tag,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  MapPin,
  Globe,
  AlertCircle,
} from "lucide-react";

interface ApprovalItemDetails {
  id: string;
  type: "company" | "offer";
  name: string;
  companyName?: string;
  submittedBy: string;
  submittedAt: string;
  // Offer specific fields
  title?: string;
  offerType?: string;
  originalPrice?: number;
  discountPrice?: number;
  discountPercentage?: number;
  startDate?: string;
  endDate?: string;
  description?: string;
  location?: string;
  weekdayAddress?: string;
  startTime?: string;
  endTime?: string;
  weekdays?: string[];
  offerLink?: string;
  terms?: string;
  image?: string;
}

// Mock data - in real app, fetch from API based on ID and type
const mockApprovalItems: Record<string, ApprovalItemDetails> = {
  "company-1": {
    id: "1",
    type: "company",
    name: "Nordic Spa & Wellness",
    companyName: "Nordic Group",
    submittedBy: "John Doe",
    submittedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  "offer-2": {
    id: "2",
    type: "offer",
    name: "Christmas Special - 50% Off",
    title: "Christmas Special - 50% Off",
    companyName: "Hotel Aurora",
    submittedBy: "Jane Smith",
    submittedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    offerType: "active",
    description: "Holiday season promotion for hotel stays",
    originalPrice: 100000,
    discountPrice: 50000,
    discountPercentage: 50,
    startDate: "2025-12-20",
    endDate: "2026-01-05",
    offerLink: "https://hotelaurora.is/christmas-special",
    terms: "Valid for bookings made before December 15th. Non-refundable.",
    image: "/placeholder-image.jpg"
  },
  "offer-4": {
    id: "4",
    type: "offer",
    name: "Weekend Getaway Package",
    title: "Weekend Getaway Package",
    companyName: "Mountain Resort",
    submittedBy: "Sarah Wilson",
    submittedAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    offerType: "active",
    description: "Weekend package with spa and dining included",
    originalPrice: 75000,
    discountPrice: 55000,
    discountPercentage: 27,
    startDate: "2025-02-01",
    endDate: "2025-04-30",
    offerLink: "https://mountainresort.is/weekend-package",
    terms: "Valid Friday-Sunday only. Includes breakfast.",
    image: "/placeholder-image.jpg"
  },
};

export default function CommissionApprovalPage() {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ApprovalItemDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchItemDetails = () => {
      setLoading(true);
      setTimeout(() => {
        const key = `${type}-${id}`;
        const foundItem = mockApprovalItems[key];
        setItem(foundItem || null);
        setLoading(false);
      }, 500);
    };

    fetchItemDetails();
  }, [id, type]);

  const getTypeColor = (offerType?: string) => {
    switch (offerType) {
      case "active":
        return "bg-blue-500/10 text-blue-500 border-blue-500";
      case "weekdays":
        return "bg-green/10 text-green border-green";
      case "happy_hour":
        return "bg-purple-500/10 text-purple-500 border-purple-500";
      case "gift_card":
        return "bg-orange-500/10 text-orange-500 border-orange-500";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500";
    }
  };

  const getTypeText = (offerType?: string) => {
    switch (offerType) {
      case "active":
        return "Active Offer";
      case "weekdays":
        return "Weekdays Offer";
      case "happy_hour":
        return "Happy Hour";
      case "gift_card":
        return "Gift Card";
      default:
        return "Offer";
    }
  };

  // Calculate commission based on offer type
  const calculateCommission = () => {
    if (!item || item.type === "company") {
      return {
        type: "Company Registration",
        commission: 0,
        description: "No commission for company registration",
        breakdown: []
      };
    }

    if (!item.offerType || !item.startDate || !item.endDate) {
      return {
        type: getTypeText(item.offerType),
        commission: 0,
        description: "Commission will be calculated after approval",
        breakdown: []
      };
    }

    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const weeksDiff = Math.ceil(daysDiff / 7);
    const monthsDiff = Math.ceil(daysDiff / 30);

    let commission = 0;
    let description = "";
    let breakdown: Array<{ label: string; value: string }> = [];

    switch (item.offerType) {
      case "active":
        const activeDays = Math.min(daysDiff, 30);
        commission = activeDays * 1;
        description = `${activeDays} days × 1 kr. per day`;
        breakdown = [
          { label: "Duration", value: `${daysDiff} days` },
          { label: "Rate", value: "1 kr. per day" },
          { label: "Max Duration", value: "30 days (capped)" },
          { label: "Billable Days", value: `${activeDays} days` }
        ];
        if (daysDiff > 30) {
          description += ` (capped at 30 days)`;
        }
        break;
      case "weekdays":
        commission = weeksDiff * 4;
        description = `${weeksDiff} weeks × 4 kr. per week`;
        breakdown = [
          { label: "Duration", value: `${daysDiff} days (${weeksDiff} weeks)` },
          { label: "Rate", value: "4 kr. per week" },
          { label: "Total Weeks", value: `${weeksDiff} weeks` }
        ];
        break;
      case "happy_hour":
        commission = monthsDiff * 10;
        description = `${monthsDiff} months × 10 kr. per month`;
        breakdown = [
          { label: "Duration", value: `${daysDiff} days (${monthsDiff} months)` },
          { label: "Rate", value: "10 kr. per month" },
          { label: "Total Months", value: `${monthsDiff} months` }
        ];
        break;
      case "gift_card":
        if (item.discountPrice) {
          commission = Math.round(item.discountPrice * 0.05);
          description = `${item.discountPrice.toLocaleString()} kr. × 5%`;
          breakdown = [
            { label: "Gift Card Value", value: `${item.discountPrice.toLocaleString()} kr.` },
            { label: "Commission Rate", value: "5% per sale" },
            { label: "Commission per Sale", value: `${commission.toLocaleString()} kr.` }
          ];
        } else {
          commission = 0;
          description = "Commission calculated per sale (5% of sale amount)";
          breakdown = [
            { label: "Commission Rate", value: "5% per sale" },
            { label: "Note", value: "Calculated when gift card is sold" }
          ];
        }
        break;
      default:
        commission = 0;
        description = "No commission structure defined";
        breakdown = [];
    }

    return {
      type: getTypeText(item.offerType),
      commission,
      description,
      breakdown,
      duration: daysDiff
    };
  };

  const commissionInfo = item ? calculateCommission() : null;

  const handleFinalApproval = async () => {
    setIsApproving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In real app, call API to approve
    console.log("Approving", { id, type, commissionInfo });
    setIsApproving(false);
    // Navigate back to approval queue
    navigate("/admin/approval-queue");
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

  if (!item) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/admin/approval-queue"
            className="flex items-center justify-center w-10 h-10 border border-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Item Not Found
            </h1>
          </div>
        </div>
        <div className="bg-card-background border border-primary rounded-2xl p-6 text-center">
          <p className="text-gray-400">The requested approval item could not be found.</p>
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
      <div className="flex items-center gap-4">
        <Link
          to="/admin/approval-queue"
          className="p-2 hover:bg-primary/10 rounded-lg transition-all"
        >
          <ArrowLeft className="text-primary" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Final Approval & Commission Summary
          </h1>
          <p className="text-gray-400 text-sm">
            Review offer details and commission before final approval
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Offer Details - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {item.type === "offer" ? (
            <>
              {/* Offer Header */}
              <div className="bg-card-background border border-primary rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getTypeColor(item.offerType)}`}>
                    <Tag size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{item.title || item.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(item.offerType)}`}>
                      {getTypeText(item.offerType)}
                    </span>
                  </div>
                </div>
                {item.description && (
                  <p className="text-gray-300 text-base leading-relaxed mb-4">
                    {item.description}
                  </p>
                )}
                {item.image && (
                  <div className="mt-4 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title || item.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Company Information */}
              {item.companyName && (
                <div className="bg-card-background border border-primary rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Building2 className="text-primary" size={20} />
                    Company
                  </h3>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-white text-lg font-semibold">{item.companyName}</p>
                  </div>
                </div>
              )}

              {/* Pricing Information */}
              {item.originalPrice && item.discountPrice && (
                <div className="bg-card-background border border-primary rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="text-primary" size={20} />
                    Pricing Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Original Price</p>
                      <p className="text-white text-xl font-bold">{item.originalPrice.toLocaleString()} kr.</p>
                    </div>
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Discounted Price</p>
                      <p className="text-green text-xl font-bold">{item.discountPrice.toLocaleString()} kr.</p>
                    </div>
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Discount</p>
                      <p className="text-primary text-xl font-bold">{item.discountPercentage}% OFF</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Offer Duration */}
              {item.startDate && item.endDate && (
                <div className="bg-card-background border border-primary rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="text-primary" size={20} />
                    Offer Duration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Start Date</p>
                      <p className="text-white text-lg font-semibold">
                        {new Date(item.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">End Date</p>
                      <p className="text-white text-lg font-semibold">
                        {new Date(item.endDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

              )}

              {/* Type-Specific Details */}
              {item.offerType === "weekdays" && (
                <div className="bg-card-background border border-primary rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="text-primary" size={20} />
                    Weekdays Details
                  </h3>
                  <div className="space-y-4">
                    {item.weekdays && item.weekdays.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Available Days</p>
                        <div className="flex flex-wrap gap-2">
                          {item.weekdays.map(day => (
                            <span key={day} className="px-3 py-1 bg-green/10 text-green border border-green rounded-lg text-sm">
                              {weekdayMap[day] || day}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.startTime && item.endTime && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Time Range</p>
                        <p className="text-white text-lg font-semibold">{item.startTime} - {item.endTime}</p>
                      </div>
                    )}
                    {item.weekdayAddress && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                          <MapPin size={16} />
                          Location
                        </p>
                        <p className="text-white text-lg font-semibold">{item.weekdayAddress}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {item.offerType === "happy_hour" && (
                <div className="bg-card-background border border-primary rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="text-primary" size={20} />
                    Happy Hour Details
                  </h3>
                  <div className="space-y-4">
                    {item.startTime && item.endTime && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Time Range</p>
                        <p className="text-white text-lg font-semibold">{item.startTime} - {item.endTime}</p>
                      </div>
                    )}
                    {item.location && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                          <MapPin size={16} />
                          Location
                        </p>
                        <p className="text-white text-lg font-semibold">{item.location}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {(item.terms || item.offerLink) && (
                <div className="bg-card-background border border-primary rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="text-primary" size={20} />
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    {item.terms && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Terms & Conditions</p>
                        <p className="text-gray-300">{item.terms}</p>
                      </div>
                    )}
                    {item.offerLink && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Offer Link</p>
                        <a
                          href={item.offerLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <Globe size={16} />
                          {item.offerLink}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-card-background border border-primary rounded-2xl p-6">
              <p className="text-gray-400">Company approvals do not require commission calculation.</p>
            </div>
          )}
        </div>

        {/* Commission Summary - Right Side */}
        <div className="space-y-6">
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="text-primary" size={20} />
              Commission Summary
            </h3>
            
            {commissionInfo && (
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Offer Type</p>
                  <p className="text-white text-lg font-semibold">{commissionInfo.type}</p>
                </div>

                {commissionInfo.breakdown.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm font-semibold">Calculation Breakdown</p>
                    {commissionInfo.breakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-background rounded-lg p-3">
                        <span className="text-gray-300 text-sm">{item.label}</span>
                        <span className="text-white font-medium text-sm">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-primary/30 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Commission Calculation</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{commissionInfo.description}</p>
                  <div className="bg-primary/10 border border-primary rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">Total Commission</span>
                      <span className="text-primary text-2xl font-bold">
                        {commissionInfo.commission > 0 
                          ? `${commissionInfo.commission.toLocaleString()} kr.`
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {item.offerType === "gift_card" && commissionInfo.commission === 0 && (
                  <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
                      <p className="text-blue-500 text-xs">
                        Commission will be calculated per sale (5% of each gift card sale amount)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleFinalApproval}
                disabled={isApproving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green text-white font-semibold rounded-lg hover:bg-green/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApproving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Final Approval
                  </>
                )}
              </button>
              <Link
                to="/admin/approval-queue"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
              >
                <XCircle size={18} />
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

