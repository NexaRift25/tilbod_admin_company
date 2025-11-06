import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Tag,
  Clock,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Calendar,
  DollarSign,
  Hash,
  User,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import Modal from "@/components/ui/modal";
import { getAllRejectionReasons } from "@/utils/rejectionReasons";
import { calculateSLA, formatTimeRemaining, formatTimeRemainingDetailed, getSLAColorClass, getSLABadgeColorClass } from "@/utils/slaTracking";

interface ApprovalItemDetails {
  id: string;
  type: "company" | "offer";
  name: string;
  companyName?: string;
  submittedBy: string;
  submittedAt: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending";
  // Company specific fields
  category?: string;
  registrationNumber?: string;
  taxId?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  // Offer specific fields
  title?: string;
  offerType?: string;
  originalPrice?: number;
  discountPrice?: number;
  discountPercentage?: number;
  startDate?: string;
  endDate?: string;
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
    priority: "high",
    status: "pending",
    category: "Wellness & Spa",
    registrationNumber: "REG-54321",
    taxId: "TAX-98765",
    address: "456 Wellness Avenue, Reykjavik, Iceland",
    phone: "+354 555 1234",
    email: "contact@nordicspa.is",
    website: "https://nordicspa.is",
    description: "A premium spa and wellness center offering comprehensive relaxation and health services.",
  },
  "company-3": {
    id: "3",
    type: "company",
    name: "Reykjavik Bar & Lounge",
    companyName: "Nightlife Co.",
    submittedBy: "Mike Johnson",
    submittedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    priority: "urgent",
    status: "pending",
    category: "Food & Dining",
    registrationNumber: "REG-12345",
    taxId: "TAX-67890",
    address: "789 Nightlife Street, Reykjavik, Iceland",
    phone: "+354 555 5678",
    email: "info@barandlounge.is",
    website: "https://barandlounge.is",
    description: "A vibrant bar and lounge offering cocktails, live music, and great atmosphere.",
  },
  "offer-2": {
    id: "2",
    type: "offer",
    name: "Christmas Special - 50% Off",
    title: "Christmas Special - 50% Off",
    companyName: "Hotel Aurora",
    submittedBy: "Jane Smith",
    submittedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    priority: "high",
    status: "pending",
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
    priority: "urgent",
    status: "pending",
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

export default function AdminApprovalDetailsPage() {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ApprovalItemDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionComment, setRevisionComment] = useState("");
  const [isRequestingRevision, setIsRequestingRevision] = useState(false);

  // Force re-render every second for real-time countdown updates
  const [, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for real-time countdown

    return () => clearInterval(interval);
  }, []);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-500 border-red-500";
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle size={16} />;
      case "high":
        return <Clock size={16} />;
      case "medium":
        return <Clock size={16} />;
      default:
        return <Clock size={16} />;
    }
  };


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

  // Calculate SLA for real-time tracking
  const sla = calculateSLA(item.submittedAt);

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
      <div className="relative overflow-hidden bg-gradient-to-br from-red-500/20 via-red-500/10 to-red-500/5 border border-red-500 rounded-2xl p-6">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 flex-1">
              <Link
                to="/admin/approval-queue"
                className="flex items-center justify-center w-12 h-12 border border-red-500/50 bg-card-background/50 backdrop-blur-sm rounded-lg hover:bg-red-500/20 transition-all hover:scale-105"
              >
                <ArrowLeft className="text-white
                -500" size={20} />
              </Link>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                      {item.type === "company" ? (
                        <Building2 className="text-white" size={24} />
                      ) : (
                        <Tag className="text-white" size={24} />
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        {item.name}
                      </h1>
                      <p className="text-gray-400 text-sm capitalize">
                        {item.type} Approval Request
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 flex items-center gap-2 rounded-full text-sm font-semibold border ${getPriorityColor(item.priority)}`}>
                    {getPriorityIcon(item.priority)}
                    <span className="capitalize">{item.priority} Priority</span>
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getSLABadgeColorClass(sla.status)}`}>
                    <Clock size={14} className="inline mr-1" />
                    {formatTimeRemaining(sla.timeRemaining)} remaining
                  </span>
                </div>
              </div>
            </div>
          </div>

          {(sla.status === "urgent" || sla.status === "expired") && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-red-500" size={20} />
                <span className="text-red-500 font-bold">
                  {sla.status === "expired"
                    ? "EXPIRED: Review time has exceeded 30 minutes!"
                    : `URGENT: Only ${formatTimeRemainingDetailed(sla.timeRemainingSeconds)} remaining!`}
                </span>
              </div>
            </div>
          )}
          {sla.status === "warning" && (
            <div className="bg-yellow/20 border border-yellow rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="text-yellow" size={20} />
                <span className="text-yellow font-bold">
                  Warning: Only {formatTimeRemainingDetailed(sla.timeRemainingSeconds)} remaining!
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <User className="text-gray-400" size={16} />
              <span className="text-gray-400">Submitted by:</span>
              <span className="text-white font-semibold">{item.submittedBy}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="text-gray-400" size={16} />
              <span className="text-gray-400">Submitted:</span>
              <span className="text-white font-semibold">
                {new Date(item.submittedAt).toLocaleDateString()} at{" "}
                {new Date(item.submittedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {item.type === "company" ? (
            /* Company Details */
            <>
              <div className="bg-card-background border border-primary rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="text-primary" size={20} />
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Company Name</p>
                    <p className="text-white text-lg font-semibold">{item.name}</p>
                  </div>
                  {item.category && (
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Category</p>
                      <p className="text-white text-lg font-semibold">{item.category}</p>
                    </div>
                  )}
                  {item.registrationNumber && (
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                        <Hash size={16} />
                        Registration Number
                      </p>
                      <p className="text-white text-lg font-semibold">{item.registrationNumber}</p>
                    </div>
                  )}
                  {item.taxId && (
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                        <Hash size={16} />
                        Tax ID
                      </p>
                      <p className="text-white text-lg font-semibold">{item.taxId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              {(item.address || item.phone || item.email || item.website) && (
                <div className="bg-card-background border border-primary rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Phone className="text-primary" size={20} />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.address && (
                      <div className="bg-background rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                          <MapPin size={16} />
                          Address
                        </p>
                        <p className="text-white text-lg font-semibold">{item.address}</p>
                      </div>
                    )}
                    {item.phone && (
                      <div className="bg-background rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                          <Phone size={16} />
                          Phone
                        </p>
                        <p className="text-white text-lg font-semibold">{item.phone}</p>
                      </div>
                    )}
                    {item.email && (
                      <div className="bg-background rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                          <Mail size={16} />
                          Email
                        </p>
                        <p className="text-white text-lg font-semibold">{item.email}</p>
                      </div>
                    )}
                    {item.website && (
                      <div className="bg-background rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                          <Globe size={16} />
                          Website
                        </p>
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-lg font-semibold"
                        >
                          {item.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {item.description && (
                <div className="bg-card-background border border-primary rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              )}
            </>
          ) : (
            /* Offer Details */
            <>
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
                          className="text-primary hover:underline"
                        >
                          {item.offerLink}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority Card */}
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Status & Priority</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <span className="px-3 py-1 bg-yellow/10 text-yellow border border-yellow rounded-full text-xs font-semibold">
                  Pending Review
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Priority</span>
                <span className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold border ${getPriorityColor(item.priority)}`}>
                  {getPriorityIcon(item.priority)}
                  <span className="capitalize">{item.priority}</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Time Remaining</span>
                <span className={`font-semibold ${getSLAColorClass(sla.status)}`}>
                  {formatTimeRemaining(sla.timeRemaining)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Submitted By</span>
                <span className="text-white font-semibold">{item.submittedBy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Submitted</span>
                <span className="text-white font-semibold text-sm">
                  {new Date(item.submittedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate(`/admin/approval-queue/${type}/${id}/commission`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green text-white font-semibold rounded-lg hover:bg-green/90 transition-all"
              >
                <CheckCircle size={18} />
                Approve
              </button>
              <button 
                onClick={() => {
                  setRevisionComment("");
                  setShowRevisionModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all"
              >
                <AlertCircle size={18} />
                Request Revision
              </button>
              <button 
                onClick={() => setShowRejectModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
              >
                <XCircle size={18} />
                Reject
              </button>
            </div>
          </div>

          {/* SLA Warning */}
          {(sla.status === "warning" || sla.status === "urgent" || sla.status === "expired") && (
            <div className={`rounded-2xl p-6 border ${
              sla.status === "expired" || sla.status === "urgent" 
                ? "bg-red-500/10 border-red-500" 
                : "bg-yellow/10 border-yellow"
            }`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={`flex-shrink-0 mt-0.5 ${
                  sla.status === "expired" || sla.status === "urgent" 
                    ? "text-red-500" 
                    : "text-yellow"
                }`} size={20} />
                <div>
                  <h4 className={`font-bold mb-1 ${
                    sla.status === "expired" || sla.status === "urgent" 
                      ? "text-red-500" 
                      : "text-yellow"
                  }`}>
                    {sla.status === "expired" 
                      ? "SLA EXPIRED" 
                      : sla.status === "urgent" 
                        ? "URGENT: SLA Deadline Approaching" 
                        : "SLA Deadline Warning"}
                  </h4>
                  <p className="text-sm text-gray-300">
                    {sla.status === "expired"
                      ? "This item has exceeded the 30-minute SLA requirement. Please review immediately."
                      : `This item must be reviewed within ${formatTimeRemainingDetailed(sla.timeRemainingSeconds)} to meet the 30-minute SLA requirement.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedReason("");
          setRejectionNotes("");
        }}
        title={`Reject ${type === 'company' ? 'Company' : 'Offer'}`}
        size="lg"
        footer={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
            <button
              onClick={() => {
                setShowRejectModal(false);
                setSelectedReason("");
                setRejectionNotes("");
              }}
              className="px-4 sm:px-6 py-2.5 sm:py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!selectedReason) return;
                setIsRejecting(true);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                // Here you would normally call the API to reject with reason
                console.log("Rejecting", {
                  id,
                  type,
                  reason: selectedReason,
                  notes: rejectionNotes,
                });
                setIsRejecting(false);
                setShowRejectModal(false);
                setSelectedReason("");
                setRejectionNotes("");
                // In real app, redirect or update UI
                alert(`${type === 'company' ? 'Company' : 'Offer'} rejected successfully`);
              }}
              disabled={!selectedReason || isRejecting}
              className="px-4 sm:px-6 py-2.5 sm:py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
            >
              {isRejecting ? "Rejecting..." : "Confirm Rejection"}
            </button>
          </div>
        }
      >
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="text-gray-400 text-sm sm:text-base mb-2 block">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <div className="relative w-full">
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-background border border-primary/50 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-primary appearance-none cursor-pointer
                           hover:border-primary/70 transition-all
                           min-h-[44px] sm:min-h-[48px]
                           truncate pr-10 sm:pr-12"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23FFEE00' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25em 1.25em',
                }}
              >
                <option value="" className="bg-background text-white">Select a reason...</option>
                {getAllRejectionReasons(type as "company" | "offer").map(reason => (
                  <option key={reason.id} value={reason.id} className="bg-background text-white">
                    {reason.reason}
                  </option>
                ))}
              </select>
            </div>
            {selectedReason && (
              <div className="mt-2 p-2 sm:p-3 bg-background/50 border border-primary/30 rounded-lg">
                <p className="text-primary text-xs sm:text-sm font-semibold mb-1">
                  {getAllRejectionReasons(type as "company" | "offer").find(r => r.id === selectedReason)?.reason}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm break-words">
                  {getAllRejectionReasons(type as "company" | "offer").find(r => r.id === selectedReason)?.description}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="text-gray-400 text-sm sm:text-base mb-2 block">
              Additional Notes (Optional)
            </label>
            <textarea
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              placeholder="Add any additional information about the rejection..."
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-background border border-primary/50 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary resize-none min-h-[100px]"
            />
          </div>

          <div className="bg-yellow/10 border border-yellow rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertTriangle className="text-yellow flex-shrink-0 mt-0.5" size={18} />
              <div className="flex-1 min-w-0">
                <h4 className="text-yellow font-bold mb-1 text-sm sm:text-base">Important</h4>
                <p className="text-xs sm:text-sm text-gray-300 break-words">
                  The {type === 'company' ? 'company' : 'offer'} will be rejected and an email notification will be sent to the submitter with the rejection reason.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Revision Modal */}
      <Modal
        isOpen={showRevisionModal}
        onClose={() => {
          setShowRevisionModal(false);
          setRevisionComment("");
        }}
        title={`Request Revision - ${type === 'company' ? 'Company' : 'Offer'}`}
        size="lg"
        footer={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
            <button
              onClick={() => {
                setShowRevisionModal(false);
                setRevisionComment("");
              }}
              className="px-4 sm:px-6 py-2.5 sm:py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!revisionComment.trim()) return;
                setIsRequestingRevision(true);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                // Here you would normally call the API to request revision
                console.log("Requesting revision", {
                  id,
                  type,
                  comment: revisionComment,
                });
                setIsRequestingRevision(false);
                setShowRevisionModal(false);
                setRevisionComment("");
                alert(`${type === 'company' ? 'Company' : 'Offer'} revision requested successfully. The submitter will be notified.`);
              }}
              disabled={!revisionComment.trim() || isRequestingRevision}
              className="px-4 sm:px-6 py-2.5 sm:py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
            >
              {isRequestingRevision ? "Requesting..." : "Request Revision"}
            </button>
          </div>
        }
      >
        <div className="space-y-4 sm:space-y-6">
          {item && (
            <div className="bg-background/50 border border-primary/30 rounded-lg p-3 sm:p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.type === "company" ? (
                    <Building2 className="text-primary flex-shrink-0" size={18} />
                  ) : (
                    <Tag className="text-primary flex-shrink-0" size={18} />
                  )}
                  <h4 className="text-white font-semibold text-sm sm:text-base break-words">{item.name}</h4>
                </div>
                {item.companyName && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                    <span className="text-gray-400 text-xs sm:text-sm">Company</span>
                    <span className="text-white font-medium text-xs sm:text-sm break-words">{item.companyName}</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                  <span className="text-gray-400 text-xs sm:text-sm">Submitted By</span>
                  <span className="text-white font-medium text-xs sm:text-sm break-words">{item.submittedBy}</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm sm:text-base mb-2 block">
              Revision Comments <span className="text-red-500">*</span>
            </label>
            <textarea
              value={revisionComment}
              onChange={(e) => setRevisionComment(e.target.value)}
              placeholder="Please provide detailed comments about what needs to be revised. Be specific about the changes required..."
              rows={6}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-background border border-primary/50 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary resize-none min-h-[150px]"
            />
            <p className="text-gray-500 text-xs mt-2">
              {revisionComment.length} characters
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
              <div className="flex-1 min-w-0">
                <h4 className="text-blue-500 font-bold mb-1 text-sm sm:text-base">Important</h4>
                <p className="text-xs sm:text-sm text-gray-300 break-words">
                  The {type === 'company' ? 'company' : 'offer'} will be sent back for revision. An email notification will be sent to {item?.submittedBy} with your comments. They will be able to make the requested changes and resubmit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

