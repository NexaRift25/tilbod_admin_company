import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Building2, Tag, Clock, AlertCircle, MapPin, Phone, Mail, Globe, FileText, Calendar, DollarSign, Hash, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PendingItemDetails {
  id: number;
  type: "Company" | "Offer";
  name: string;
  status: "pending" | "revision";
  submittedAt: string;
  revisionCount?: number;
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
  companyName?: string;
}

export default function PendingItemDetailsPage() {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [item, setItem] = useState<PendingItemDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const fetchItemDetails = () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        if (type === "Company") {
          const companyData: PendingItemDetails = {
            id: parseInt(id || "1"),
            type: "Company",
            name: id === "1" ? "Hotel Aurora" : id === "2" ? "Blue Lagoon Spa" : "Mountain View Restaurant",
            status: id === "2" ? "revision" : "pending",
            submittedAt: id === "1" ? "2 hours ago" : id === "2" ? "1 day ago" : "3 days ago",
            revisionCount: id === "2" ? 1 : undefined,
            category: "Hotels & Accommodation",
            registrationNumber: "REG-12345",
            taxId: "TAX-67890",
            address: "123 Main Street, Reykjavik, Iceland",
            phone: "+354 123 4567",
            email: "info@hotelaurora.is",
            website: "https://hotelaurora.is",
            description: "A luxurious hotel located in the heart of Reykjavik, offering world-class amenities and exceptional service.",
          };
          setItem(companyData);
        } else {
          const offerData: PendingItemDetails = {
            id: parseInt(id || "1"),
            type: "Offer",
            name: id === "3" ? "Weekend Getaway Package" : "Summer Special Deal",
            status: id === "3" ? "pending" : "revision",
            submittedAt: id === "3" ? "30 minutes ago" : "2 days ago",
            revisionCount: id === "5" ? 2 : undefined,
            title: id === "3" ? "Weekend Getaway Package" : "Summer Special Deal",
            offerType: "Active Offer",
            originalPrice: 50000,
            discountPrice: 35000,
            discountPercentage: 30,
            startDate: "2025-01-01",
            endDate: "2025-01-31",
            companyName: "Hotel Aurora",
          };
          setItem(offerData);
        }
        setLoading(false);
      }, 500);
    };

    fetchItemDetails();
  }, [id, type]);

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
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
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/company/pending-approvals"
            className="flex items-center justify-center w-10 h-10 border border-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              {t("pendingItemDetails.itemNotFound")}
            </h1>
          </div>
        </div>
        <div className="bg-card-background border border-primary rounded-2xl p-6 text-center">
          <p className="text-gray-400">{t("pendingItemDetails.itemNotFoundMessage")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary rounded-2xl p-6 sm:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/company/pending-approvals")}
              className="flex items-center justify-center w-12 h-12 border border-primary/50 bg-card-background/50 backdrop-blur-sm rounded-lg hover:bg-primary/20 transition-all hover:scale-105"
            >
              <ArrowLeft className="text-primary" size={20} />
            </button>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    {item.type === "Company" ? (
                      <Building2 className="text-primary" size={24} />
                    ) : (
                      <Tag className="text-primary" size={24} />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                      {item.name}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="flex items-center gap-1">
                        <FileText size={14} />
                        {item.type === "Company" ? t("common.company") : t("offerTypes.offer")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {t("pendingItemDetails.submitted", { time: item.submittedAt })}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
                    item.status === "pending"
                      ? "bg-yellow/20 text-yellow border border-yellow/30"
                      : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  }`}
                >
                  {item.status === "pending" ? t("pendingItemDetails.underReview") : t("pendingItemDetails.needsRevision")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {item.status === "revision" && item.revisionCount && (
        <div className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/50 rounded-2xl p-5 sm:p-6 shadow-lg shadow-orange-500/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="text-orange-500" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-orange-400 font-bold text-lg mb-2">{t("pendingItemDetails.revisionRequired")}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t("pendingItemDetails.revisionMessage", { 
                  count: item.revisionCount, 
                  max: item.type === "Company" ? "3" : "2" 
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {item.type === "Company" ? (
            <>
              {/* Company Information */}
              <div className="bg-card-background border border-primary rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Building2 className="text-primary" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">{t("pendingItemDetails.companyInformation")}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">{t("pendingItemDetails.category")}</p>
                    <p className="text-white font-semibold text-lg">{item.category}</p>
                  </div>
                  <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Hash size={14} />
                      {t("pendingItemDetails.registrationNumber")}
                    </p>
                    <p className="text-white font-semibold text-lg">{item.registrationNumber}</p>
                  </div>
                  <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Hash size={14} />
                      {t("pendingItemDetails.taxId")}
                    </p>
                    <p className="text-white font-semibold text-lg">{item.taxId}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">{t("pendingItemDetails.contactInformation")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-background/50 rounded-xl p-4 border border-primary/30 hover:border-primary/50 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <MapPin className="text-primary" size={16} />
                        </div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide">{t("pendingItemDetails.address")}</p>
                      </div>
                      <p className="text-white font-medium">{item.address}</p>
                    </div>
                    <div className="bg-background/50 rounded-xl p-4 border border-primary/30 hover:border-primary/50 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Phone className="text-primary" size={16} />
                        </div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide">{t("pendingItemDetails.phone")}</p>
                      </div>
                      <p className="text-white font-medium">{item.phone}</p>
                    </div>
                    <div className="bg-background/50 rounded-xl p-4 border border-primary/30 hover:border-primary/50 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Mail className="text-primary" size={16} />
                        </div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide">{t("pendingItemDetails.email")}</p>
                      </div>
                      <p className="text-white font-medium">{item.email}</p>
                    </div>
                    <div className="bg-background/50 rounded-xl p-4 border border-primary/30 hover:border-primary/50 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Globe className="text-primary" size={16} />
                        </div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide">{t("pendingItemDetails.website")}</p>
                      </div>
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-medium hover:underline break-all"
                      >
                        {item.website}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <div className="mt-6 pt-6 border-t border-primary/30">
                    <h3 className="text-lg font-semibold text-white mb-3">{t("pendingItemDetails.description")}</h3>
                    <p className="text-gray-300 leading-relaxed bg-background/30 rounded-xl p-4 border border-primary/20">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Offer Information */}
              <div className="bg-card-background border border-primary rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Tag className="text-primary" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">{t("pendingItemDetails.offerDetails")}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Building2 size={14} />
                      {t("pendingItemDetails.company")}
                    </p>
                    <p className="text-white font-semibold text-lg">{item.companyName}</p>
                  </div>
                  <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                      <FileText size={14} />
                      {t("pendingItemDetails.offerType")}
                    </p>
                    <p className="text-white font-semibold text-lg">{item.offerType}</p>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="text-primary" size={20} />
                    {t("pendingItemDetails.pricingInformation")}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">{t("pendingItemDetails.originalPrice")}</p>
                      <p className="text-white font-bold text-xl">{item.originalPrice?.toLocaleString()} kr.</p>
                    </div>
                    <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">{t("pendingItemDetails.discountPrice")}</p>
                      <p className="text-primary font-bold text-xl">{item.discountPrice?.toLocaleString()} kr.</p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-4 border border-primary/50">
                      <p className="text-gray-300 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                        <TrendingDown size={14} />
                        {t("pendingItemDetails.discount")}
                      </p>
                      <p className="text-primary font-bold text-2xl">{item.discountPercentage}% {t("pendingItemDetails.off")}</p>
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="text-primary" size={20} />
                    {t("pendingItemDetails.offerPeriod")}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">{t("pendingItemDetails.startDate")}</p>
                      <p className="text-white font-semibold">
                        {item.startDate
                          ? new Date(item.startDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : t("pendingItemDetails.notAvailable")}
                      </p>
                    </div>
                    <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">{t("pendingItemDetails.endDate")}</p>
                      <p className="text-white font-semibold">
                        {item.endDate
                          ? new Date(item.endDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : t("pendingItemDetails.notAvailable")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar - Submission Info */}
        <div className="space-y-6">
          <div className="bg-card-background border border-primary rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <FileText className="text-primary" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">{t("pendingItemDetails.submission")}</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Clock size={14} />
                  {t("pendingItemDetails.submittedLabel")}
                </p>
                <p className="text-white font-semibold">{item.submittedAt}</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">{t("pendingItemDetails.status")}</p>
                <span
                  className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
                    item.status === "pending"
                      ? "bg-yellow/20 text-yellow border border-yellow/30"
                      : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  }`}
                >
                  {item.status === "pending" ? t("pendingItemDetails.underReview") : t("pendingItemDetails.needsRevision")}
                </span>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">{t("pendingItemDetails.itemType")}</p>
                <p className="text-white font-semibold flex items-center gap-2">
                  {item.type === "Company" ? (
                    <Building2 className="text-primary" size={18} />
                  ) : (
                    <Tag className="text-primary" size={18} />
                  )}
                  {item.type === "Company" ? t("common.company") : t("offerTypes.offer")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

