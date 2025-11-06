import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Gift,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  Key,
  Copy,
  RefreshCw,
  Mail,
  Phone,
} from "lucide-react";
import Modal from "@/components/ui/modal";

interface GiftCardPurchase {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  purchaseDate: string;
  purchaseAmount: number;
  status: "active" | "used" | "expired";
  otp?: string;
  otpGeneratedAt?: string;
  usedAt?: string;
}

interface GiftCard {
  id: string;
  title: string;
  description: string;
  value: number;
  discountPercentage?: number;
  status: "approved";
  approvedAt: string;
  validFrom: string;
  validUntil: string;
  terms?: string;
  image?: string;
}

// Mock data
const mockGiftCards: Record<string, GiftCard> = {
  "1": {
    id: "1",
    title: "Spa & Wellness Gift Card",
    description: "Full day spa experience with treatments and relaxation",
    value: 15000,
    discountPercentage: 20,
    status: "approved",
    approvedAt: "2025-01-10",
    validFrom: "2025-01-15",
    validUntil: "2025-12-31",
    terms: "Valid for 12 months from purchase date. Non-refundable. Cannot be combined with other offers.",
    image: "/placeholder-image.jpg"
  },
  "2": {
    id: "2",
    title: "Restaurant Dining Gift Card",
    description: "Fine dining experience for two",
    value: 10000,
    discountPercentage: 15,
    status: "approved",
    approvedAt: "2025-01-08",
    validFrom: "2025-01-10",
    validUntil: "2025-11-30",
    terms: "Valid for reservations. Advance booking required.",
  },
  "3": {
    id: "3",
    title: "Adventure Tours Gift Card",
    description: "Experience Iceland's natural wonders",
    value: 25000,
    discountPercentage: 25,
    status: "approved",
    approvedAt: "2025-01-05",
    validFrom: "2025-01-12",
    validUntil: "2025-12-31",
  },
  "4": {
    id: "4",
    title: "Hotel Stay Gift Card",
    description: "Luxury hotel accommodation package",
    value: 50000,
    discountPercentage: 30,
    status: "approved",
    approvedAt: "2025-01-03",
    validFrom: "2025-01-15",
    validUntil: "2026-01-15",
  },
};

const mockPurchases: Record<string, GiftCardPurchase[]> = {
  "1": [
    {
      id: "p1",
      customerName: "Anna Jónsdóttir",
      customerEmail: "anna@example.com",
      customerPhone: "+354 555 1234",
      purchaseDate: "2025-01-15",
      purchaseAmount: 15000,
      status: "active",
    },
    {
      id: "p2",
      customerName: "Björn Guðmundsson",
      customerEmail: "bjorn@example.com",
      purchaseDate: "2025-01-18",
      purchaseAmount: 15000,
      status: "active",
    },
    {
      id: "p3",
      customerName: "Sara Magnúsdóttir",
      customerEmail: "sara@example.com",
      customerPhone: "+354 555 5678",
      purchaseDate: "2025-01-20",
      purchaseAmount: 15000,
      status: "used",
      usedAt: "2025-01-25",
    },
    {
      id: "p4",
      customerName: "Erik Larsson",
      customerEmail: "erik@example.com",
      purchaseDate: "2025-01-12",
      purchaseAmount: 15000,
      status: "active",
    },
  ],
  "2": [
    {
      id: "p5",
      customerName: "Maria Rodriguez",
      customerEmail: "maria@example.com",
      purchaseDate: "2025-01-14",
      purchaseAmount: 10000,
      status: "active",
    },
    {
      id: "p6",
      customerName: "David Kim",
      customerEmail: "david@example.com",
      purchaseDate: "2025-01-16",
      purchaseAmount: 10000,
      status: "used",
      usedAt: "2025-01-22",
    },
  ],
};

export default function GiftCardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [giftCard, setGiftCard] = useState<GiftCard | null>(null);
  const [purchases, setPurchases] = useState<GiftCardPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState<GiftCardPurchase | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchData = () => {
      setLoading(true);
      setTimeout(() => {
        const card = mockGiftCards[id || ""];
        const cardPurchases = mockPurchases[id || ""] || [];
        setGiftCard(card || null);
        setPurchases(cardPurchases);
        setLoading(false);
      }, 500);
    };

    fetchData();
  }, [id]);

  const generateOTP = () => {
    // Generate 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleGenerateOTP = async (purchase: GiftCardPurchase) => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const otp = generateOTP();
    setGeneratedOtp(otp);
    
    // Update purchase with OTP
    setPurchases(prev => prev.map(p => 
      p.id === purchase.id 
        ? { ...p, otp, otpGeneratedAt: new Date().toISOString() }
        : p
    ));
    
    setSelectedPurchase({ ...purchase, otp, otpGeneratedAt: new Date().toISOString() });
    setIsGenerating(false);
    setShowOtpModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green/10 text-green border-green";
      case "used":
        return "bg-blue-500/10 text-blue-500 border-blue-500";
      case "expired":
        return "bg-gray-500/10 text-gray-400 border-gray-500";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500";
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

  if (!giftCard) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/company/gift-cards"
            className="flex items-center justify-center w-10 h-10 border border-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Gift Card Not Found
            </h1>
          </div>
        </div>
        <div className="bg-card-background border border-primary rounded-2xl p-6 text-center">
          <p className="text-gray-400">The requested gift card could not be found.</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalPurchases: purchases.length,
    activeCards: purchases.filter(p => p.status === "active").length,
    usedCards: purchases.filter(p => p.status === "used").length,
    totalRevenue: purchases.reduce((sum, p) => sum + p.purchaseAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/company/gift-cards"
          className="p-2 hover:bg-primary/10 rounded-lg transition-all"
        >
          <ArrowLeft className="text-primary" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Gift Card Details
          </h1>
          <p className="text-gray-400 text-sm">
            View details and manage gift card purchases
          </p>
        </div>
      </div>

      {/* Gift Card Info */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {giftCard.image && (
            <div className="w-full md:w-64 h-48 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={giftCard.image}
                alt={giftCard.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Gift className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-white">{giftCard.title}</h2>
              <span className="px-3 py-1 bg-green/10 text-green border border-green rounded-full text-xs font-semibold">
                <CheckCircle size={12} className="inline mr-1" />
                Approved
              </span>
            </div>
            <p className="text-gray-300 mb-4">{giftCard.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Card Value</p>
                <p className="text-white text-xl font-bold">{giftCard.value.toLocaleString()} kr.</p>
              </div>
              {giftCard.discountPercentage && (
                <div className="bg-background rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Discount</p>
                  <p className="text-green text-xl font-bold">{giftCard.discountPercentage}% OFF</p>
                </div>
              )}
              <div className="bg-background rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Total Purchases</p>
                <p className="text-white text-xl font-bold">{stats.totalPurchases}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                  <Calendar size={16} />
                  Valid From
                </p>
                <p className="text-white font-semibold">
                  {new Date(giftCard.validFrom).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                  <Calendar size={16} />
                  Valid Until
                </p>
                <p className="text-white font-semibold">
                  {new Date(giftCard.validUntil).toLocaleDateString()}
                </p>
              </div>
            </div>

            {giftCard.terms && (
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">Terms & Conditions</p>
                <p className="text-gray-300 text-sm">{giftCard.terms}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Purchases</p>
              <p className="text-white text-2xl font-bold">{stats.totalPurchases}</p>
            </div>
            <Users className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Cards</p>
              <p className="text-white text-2xl font-bold">{stats.activeCards}</p>
            </div>
            <CheckCircle className="text-green" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Used Cards</p>
              <p className="text-white text-2xl font-bold">{stats.usedCards}</p>
            </div>
            <Gift className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-purple-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-white text-2xl font-bold">{stats.totalRevenue.toLocaleString()} kr.</p>
            </div>
            <DollarSign className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Purchases List */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Users className="text-primary" size={20} />
          Gift Card Purchases ({purchases.length})
        </h3>

        {purchases.length === 0 ? (
          <div className="p-8 text-center">
            <Gift className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No purchases yet</h3>
            <p className="text-gray-400">This gift card hasn't been purchased by anyone yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-primary/50">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Purchase Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">OTP</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b border-primary/10 hover:bg-primary/5">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{purchase.customerName}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Mail size={12} />
                          <span>{purchase.customerEmail}</span>
                        </div>
                        {purchase.customerPhone && (
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <Phone size={12} />
                            <span>{purchase.customerPhone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-sm text-gray-300">
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-bold">{purchase.purchaseAmount.toLocaleString()} kr.</p>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(purchase.status)}`}>
                        {purchase.status === "active" && <CheckCircle size={12} />}
                        <span className="capitalize">{purchase.status}</span>
                      </span>
                    </td>
                    <td className="py-4">
                      {purchase.otp ? (
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-background px-2 py-1 rounded border border-primary/50">
                            {purchase.otp}
                          </code>
                          <button
                            onClick={() => copyToClipboard(purchase.otp!)}
                            className="p-1 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-all"
                            title="Copy OTP"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Not generated</span>
                      )}
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleGenerateOTP(purchase)}
                        disabled={purchase.status !== "active" || isGenerating}
                        className="flex items-center gap-2 px-3 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        title={purchase.status !== "active" ? "Only active cards can generate OTP" : "Generate OTP"}
                      >
                        <Key size={14} />
                        {purchase.otp ? "Regenerate" : "Generate OTP"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* OTP Modal */}
      <Modal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          setSelectedPurchase(null);
          setGeneratedOtp("");
        }}
        title="OTP Generated Successfully"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setShowOtpModal(false);
                setSelectedPurchase(null);
                setGeneratedOtp("");
              }}
              className="px-6 py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all"
            >
              Close
            </button>
            <button
              onClick={() => {
                if (generatedOtp) {
                  copyToClipboard(generatedOtp);
                }
              }}
              className="px-6 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <Copy size={16} />
              Copy OTP
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {selectedPurchase && (
            <div className="bg-background/50 border border-primary/30 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Customer</span>
                  <span className="text-white font-semibold">{selectedPurchase.customerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Email</span>
                  <span className="text-white text-sm">{selectedPurchase.customerEmail}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Gift Card Value</span>
                  <span className="text-white font-semibold">{selectedPurchase.purchaseAmount.toLocaleString()} kr.</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-primary/10 border border-primary rounded-lg p-6 text-center">
            <Key className="mx-auto text-primary mb-3" size={32} />
            <p className="text-gray-400 text-sm mb-2">Generated OTP</p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-3xl font-mono font-bold text-white bg-background px-4 py-2 rounded border border-primary">
                {generatedOtp}
              </code>
              <button
                onClick={() => copyToClipboard(generatedOtp)}
                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                title="Copy OTP"
              >
                <Copy size={20} />
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-3">
              Share this OTP with the customer. They can use it to redeem their gift card.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <RefreshCw className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-blue-500 text-xs">
                OTP is valid for redemption. You can regenerate a new OTP if needed, which will invalidate the previous one.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

