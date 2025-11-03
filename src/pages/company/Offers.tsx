import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Tag,
  Plus,
  Eye,
  Edit,
  ArrowLeft,
  Filter,
  Search,
  Clock,
  DollarSign,
  CheckCircle,
  Users
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import ActiveOfferCard from "@/components/offerCards/active-offer-card";
import WeeklyOfferCard from "@/components/offerCards/weeklyOfferCard";
import HappyHourOfferCard from "@/components/offerCards/happyHour";
import GiftOfferCard from "@/components/offerCards/giftOfferCard";

interface Offer {
  id: string;
  title: string;
  type: "active" | "weekdays" | "happy_hour" | "gift_card";
  category: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  status: "pending" | "approved" | "active" | "expired" | "rejected";
  startDate: string;
  endDate: string;
  createdAt: string;
  views: number;
  purchases: number;
  revenue: number;
  extensionCount: number;
  maxExtensions: 4;
  companyId: string;
}

export default function OffersPage() {
  const [offers] = useState<Offer[]>([
    // Active offers (3)
    {
      id: "1",
      title: "Weekend Getaway Package",
      type: "active",
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
      maxExtensions: 4,
      companyId: "company1"
    },
    {
      id: "2",
      title: "Mountain Adventure Tour",
      type: "active",
      category: "Adventure & Tours",
      originalPrice: 85000,
      discountPrice: 60000,
      discountPercentage: 29,
      status: "approved",
      startDate: "2025-02-01",
      endDate: "2025-02-28",
      createdAt: "2024-12-20",
      views: 189,
      purchases: 15,
      revenue: 900000,
      extensionCount: 0,
      maxExtensions: 4,
      companyId: "company1"
    },
    {
      id: "3",
      title: "Luxury Spa Experience",
      type: "gift_card",
      category: "Wellness & Spa",
      originalPrice: 25000,
      discountPrice: 20000,
      discountPercentage: 20,
      status: "active",
      startDate: "2025-01-15",
      endDate: "2025-03-15",
      createdAt: "2024-12-18",
      views: 312,
      purchases: 28,
      revenue: 560000,
      extensionCount: 0,
      maxExtensions: 4,
      companyId: "company1"
    },
    // Pending offers (3)
    {
      id: "4",
      title: "Happy Hour Special",
      type: "happy_hour",
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
      maxExtensions: 4,
      companyId: "company1"
    },
    {
      id: "5",
      title: "Midweek Restaurant Deal",
      type: "weekdays",
      category: "Food & Dining",
      originalPrice: 3000,
      discountPrice: 2200,
      discountPercentage: 27,
      status: "pending",
      startDate: "2025-02-01",
      endDate: "2025-04-01",
      createdAt: "2024-12-22",
      views: 0,
      purchases: 0,
      revenue: 0,
      extensionCount: 0,
      maxExtensions: 4,
      companyId: "company1"
    },
    {
      id: "6",
      title: "Winter Sports Package",
      type: "active",
      category: "Adventure & Tours",
      originalPrice: 120000,
      discountPrice: 95000,
      discountPercentage: 21,
      status: "pending",
      startDate: "2025-02-10",
      endDate: "2025-03-10",
      createdAt: "2024-12-25",
      views: 0,
      purchases: 0,
      revenue: 0,
      extensionCount: 0,
      maxExtensions: 4,
      companyId: "company1"
    },
    // Inactive/Expired offers (3)
    {
      id: "7",
      title: "Spa & Wellness Gift Card",
      type: "gift_card",
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
      maxExtensions: 4,
      companyId: "company1"
    },
    {
      id: "8",
      title: "Autumn Restaurant Special",
      type: "weekdays",
      category: "Food & Dining",
      originalPrice: 2000,
      discountPrice: 1500,
      discountPercentage: 25,
      status: "expired",
      startDate: "2024-10-01",
      endDate: "2024-11-30",
      createdAt: "2024-09-20",
      views: 134,
      purchases: 9,
      revenue: 13500,
      extensionCount: 1,
      maxExtensions: 4,
      companyId: "company1"
    },
    {
      id: "9",
      title: "Summer Beach Getaway",
      type: "active",
      category: "Hotels & Accommodation",
      originalPrice: 60000,
      discountPrice: 45000,
      discountPercentage: 25,
      status: "expired",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      createdAt: "2024-05-15",
      views: 567,
      purchases: 45,
      revenue: 2025000,
      extensionCount: 0,
      maxExtensions: 4,
      companyId: "company1"
    },
    // Rejected offers (3)
    {
      id: "10",
      title: "Night Club VIP Experience",
      type: "happy_hour",
      category: "Entertainment",
      originalPrice: 5000,
      discountPrice: 3500,
      discountPercentage: 30,
      status: "rejected",
      startDate: "2025-01-20",
      endDate: "2025-02-20",
      createdAt: "2024-12-28",
      views: 0,
      purchases: 0,
      revenue: 0,
      extensionCount: 0,
      maxExtensions: 4,
      companyId: "company1"
    },
    {
      id: "11",
      title: "Premium Golf Package",
      type: "active",
      category: "Sports & Recreation",
      originalPrice: 75000,
      discountPrice: 55000,
      discountPercentage: 27,
      status: "rejected",
      startDate: "2025-03-01",
      endDate: "2025-05-01",
      createdAt: "2024-12-30",
      views: 0,
      purchases: 0,
      revenue: 0,
      extensionCount: 0,
      maxExtensions: 4,
      companyId: "company1"
    },
    {
      id: "12",
      title: "Gourmet Dining Experience",
      type: "weekdays",
      category: "Food & Dining",
      originalPrice: 12000,
      discountPrice: 9000,
      discountPercentage: 25,
      status: "rejected",
      startDate: "2025-02-15",
      endDate: "2025-04-15",
      createdAt: "2025-01-02",
      views: 0,
      purchases: 0,
      revenue: 0,
      extensionCount: 0,
      maxExtensions: 4,
      companyId: "company1"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "inactive" | "pending" | "rejected">("active");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Filter offers by tab
  const getFilteredOffersByTab = () => {
    return offers.filter(offer => {
      switch (activeTab) {
        case "active":
          return offer.status === "active" || offer.status === "approved";
        case "inactive":
          return offer.status === "expired";
        case "pending":
          return offer.status === "pending";
        case "rejected":
          return offer.status === "rejected";
        default:
          return true;
      }
    });
  };

  const filteredOffers = getFilteredOffersByTab().filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || offer.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = filteredOffers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab, typeFilter]);

  // Helper function to calculate time left
  const calculateTimeLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days left`;
  };

  // Transform offer data for ActiveOfferCard
  const transformToActiveOffer = (offer: Offer) => {
    return {
      id: parseInt(offer.id),
      offerType: offer.type,
      title: offer.title,
      discount: `${offer.discountPercentage}% Discount`,
      description: `${offer.title} - ${offer.category}`,
      image: "/placeholder-image.jpg",
      category: offer.category,
      timeLeft: calculateTimeLeft(offer.endDate),
      location: "",
      price: offer.originalPrice.toLocaleString(),
      discountPrice: offer.discountPrice.toLocaleString(),
      link: `/offers/${offer.id}`
    };
  };

  // Transform offer data for WeeklyOfferCard
  const transformToWeeklyOffer = (offer: Offer) => {
    return {
      id: parseInt(offer.id),
      offerType: offer.type,
      title: offer.title,
      discount: `${offer.discountPercentage}% Discount`,
      description: `${offer.title} - ${offer.category}`,
      image: "/placeholder-image.jpg",
      badge: offer.category,
      location: "",
      time: "Available all day",
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      link: `/offers/${offer.id}`
    };
  };

  // Transform offer data for HappyHourOfferCard
  const transformToHappyHourOffer = (offer: Offer) => {
    return {
      id: parseInt(offer.id),
      offerType: offer.type,
      title: offer.title,
      time: "5:00 PM - 7:00 PM",
      description: `${offer.title} - ${offer.category}`,
      image: "/placeholder-image.jpg",
      status: offer.status === "active" ? "Open now" : "Closed",
      location: "",
      pricing: `${offer.discountPrice.toLocaleString()} kr.`,
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      link: `/offers/${offer.id}`
    };
  };

  // Transform offer data for GiftOfferCard
  const transformToGiftOffer = (offer: Offer) => {
    return {
      id: parseInt(offer.id),
      offerType: offer.type,
      title: offer.title,
      price: offer.discountPrice.toLocaleString(),
      description: `${offer.title} - ${offer.category}`,
      image: "/placeholder-image.jpg",
      category: offer.category,
      timeLeft: calculateTimeLeft(offer.endDate),
      purchaseCount: offer.purchases,
      link: `/offers/${offer.id}`
    };
  };

  // Render appropriate card based on offer type
  const renderOfferCard = (offer: Offer) => {
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

  const stats = {
    total: offers.length,
    active: offers.filter(o => o.status === "active").length,
    pending: offers.filter(o => o.status === "pending").length,
    totalViews: offers.reduce((sum, o) => sum + o.views, 0),
    totalPurchases: offers.reduce((sum, o) => sum + o.purchases, 0),
    totalRevenue: offers.reduce((sum, o) => sum + o.revenue, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/company/dashboard"
            className="p-2 hover:bg-primary/10 rounded-lg transition-all"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              My Offers
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your promotional offers and track performance
            </p>
          </div>
        </div>

        <Link
          to="/company/create-offer"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
        >
          <Plus size={20} />
          Create Offer
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Offers</p>
              <p className="text-white text-2xl font-bold">{stats.total}</p>
            </div>
            <Tag className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-white text-2xl font-bold">{stats.active}</p>
            </div>
            <CheckCircle className="text-green" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-yellow-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-white text-2xl font-bold">{stats.pending}</p>
            </div>
            <Clock className="text-yellow" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-white text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-purple-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Purchases</p>
              <p className="text-white text-2xl font-bold">{stats.totalPurchases}</p>
            </div>
            <Users className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-orange-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenue</p>
              <p className="text-white text-2xl font-bold">{(stats.totalRevenue / 1000).toFixed(0)}k kr.</p>
            </div>
            <DollarSign className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card-background border border-primary rounded-2xl p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === "active"
                ? "bg-primary text-dark"
                : "bg-background text-gray-300 hover:bg-primary/20"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("inactive")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === "inactive"
                ? "bg-primary text-dark"
                : "bg-background text-gray-300 hover:bg-primary/20"
            }`}
          >
            Inactive
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === "pending"
                ? "bg-primary text-dark"
                : "bg-background text-gray-300 hover:bg-primary/20"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === "rejected"
                ? "bg-primary text-dark"
                : "bg-background text-gray-300 hover:bg-primary/20"
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card-background border border-primary rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search offers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="active">Active Offer</option>
              <option value="weekdays">Weekdays Offer</option>
              <option value="happy_hour">Happy Hour</option>
              <option value="gift_card">Gift Card</option>
            </select>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        {filteredOffers.length === 0 ? (
          <div className="text-center py-8">
            <Tag className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No offers found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || typeFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : `You don't have any ${activeTab} offers yet`
              }
            </p>
            {!searchTerm && typeFilter === "all" && activeTab === "active" && (
              <Link
                to="/company/create-offer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
              >
                <Plus size={20} />
                Create Your First Offer
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {currentPageItems.map((offer) => (
              <div key={offer.id} className="relative">
                {renderOfferCard(offer)}
                {/* Action buttons overlay */}
                <div className="absolute top-4 right-4 flex gap-2 z-50">
                  <Link
                    to={`/company/offers/${offer.id}`}
                    className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-primary/50 transition-all"
                    title="View Offer Details"
                  >
                    <Eye size={16} />
                  </Link>
                  <Link
                    to={`/company/offers/${offer.id}/edit`}
                    className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-primary/50 transition-all"
                    title="Edit Offer"
                  >
                    <Edit size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOffers.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredOffers.length)} of {filteredOffers.length} offers
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

