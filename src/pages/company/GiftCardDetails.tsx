import { useMemo, useState, useEffect, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Gift,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  Key,
  QrCode,
  Mail,
  Phone,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
      otp: "SPA-001",
      otpGeneratedAt: "2025-01-15T09:00:00Z",
    },
    {
      id: "p2",
      customerName: "Björn Guðmundsson",
      customerEmail: "bjorn@example.com",
      purchaseDate: "2025-01-18",
      purchaseAmount: 15000,
      status: "active",
      otp: "SPA-002",
      otpGeneratedAt: "2025-01-18T11:30:00Z",
    },
    {
      id: "p3",
      customerName: "Sara Magnúsdóttir",
      customerEmail: "sara@example.com",
      customerPhone: "+354 555 5678",
      purchaseDate: "2025-01-20",
      purchaseAmount: 15000,
      status: "used",
      otp: "SPA-003",
      otpGeneratedAt: "2025-01-20T13:45:00Z",
      usedAt: "2025-01-25",
    },
    {
      id: "p4",
      customerName: "Erik Larsson",
      customerEmail: "erik@example.com",
      purchaseDate: "2025-01-12",
      purchaseAmount: 15000,
      status: "active",
      otp: "SPA-004",
      otpGeneratedAt: "2025-01-12T10:15:00Z",
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
      otp: "REST-001",
      otpGeneratedAt: "2025-01-14T16:00:00Z",
    },
    {
      id: "p6",
      customerName: "David Kim",
      customerEmail: "david@example.com",
      purchaseDate: "2025-01-16",
      purchaseAmount: 10000,
      status: "used",
      otp: "REST-002",
      otpGeneratedAt: "2025-01-16T12:20:00Z",
      usedAt: "2025-01-22",
    },
  ],
};

export default function GiftCardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [giftCard, setGiftCard] = useState<GiftCard | null>(null);
  const [purchases, setPurchases] = useState<GiftCardPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [verificationMethod, setVerificationMethod] = useState<"scan" | "email" | "code">("scan");
  const [verificationFeedback, setVerificationFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [matchedPurchaseId, setMatchedPurchaseId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const stats = useMemo(
    () => ({
      totalPurchases: purchases.length,
      activeCards: purchases.filter((p) => p.status === "active").length,
      usedCards: purchases.filter((p) => p.status === "used").length,
      totalRevenue: purchases.reduce((sum, p) => sum + p.purchaseAmount, 0),
    }),
    [purchases]
  );

  const matchedPurchase = useMemo(
    () => purchases.find((purchase) => purchase.id === matchedPurchaseId) ?? null,
    [purchases, matchedPurchaseId]
  );

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

  useEffect(() => {
    setVerificationFeedback(null);
    setMatchedPurchaseId(null);
    setVerificationCode("");
  }, [verificationMethod]);

  useEffect(() => {
    if (matchedPurchaseId && !purchases.some((purchase) => purchase.id === matchedPurchaseId)) {
      setMatchedPurchaseId(null);
    }
  }, [matchedPurchaseId, purchases]);

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

  const getPurchaseStatusLabel = (status: GiftCardPurchase["status"]) =>
    t(`companyGiftCardDetails.purchases.status.${status}`);

  const handleScanVerify = async () => {
    const nextActive = purchases.find((purchase) => purchase.status === "active");

    if (!nextActive) {
      setVerificationFeedback({
        type: "error",
        message: t("companyGiftCardDetails.verify.errors.noActivePurchases"),
      });
      return;
    }

    setIsVerifying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMatchedPurchaseId(nextActive.id);
      setVerificationFeedback({
        type: "success",
        message: t("companyGiftCardDetails.verify.scanSuccess", {
          customer: nextActive.customerName,
        }),
      });
      if (nextActive.otp) {
        setVerificationCode(nextActive.otp);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSendEmailVerification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = emailAddress.trim();

    if (!trimmedEmail) {
      setVerificationFeedback({
        type: "error",
        message: t("companyGiftCardDetails.verify.errors.emailRequired"),
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setVerificationFeedback({
        type: "error",
        message: t("companyGiftCardDetails.verify.errors.emailInvalid"),
      });
      return;
    }

    const normalizedEmail = trimmedEmail.toLowerCase();
    const matches = purchases.filter(
      (purchase) => purchase.customerEmail.toLowerCase() === normalizedEmail
    );

    if (matches.length === 0) {
      setVerificationFeedback({
        type: "error",
        message: t("companyGiftCardDetails.verify.errors.emailNotFound", {
          email: trimmedEmail,
        }),
      });
      return;
    }

    const candidate = matches.find((purchase) => purchase.status === "active") ?? matches[0];

    if (candidate.status !== "active") {
      setVerificationFeedback({
        type: "error",
        message: t("companyGiftCardDetails.verify.errors.alreadyProcessed", {
          status: getPurchaseStatusLabel(candidate.status),
        }),
      });
      return;
    }

    setIsVerifying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMatchedPurchaseId(candidate.id);
      setVerificationFeedback({
        type: "success",
        message: t("companyGiftCardDetails.verify.emailSuccess", {
          customer: candidate.customerName,
          email: trimmedEmail,
        }),
      });
      if (candidate.otp) {
        setVerificationCode(candidate.otp);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualCodeVerification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedCode = verificationCode.trim();

    if (!trimmedCode) {
      setVerificationFeedback({
        type: "error",
        message: t("companyGiftCardDetails.verify.errors.codeRequired"),
      });
      return;
    }

    const normalizedCode = trimmedCode.toLowerCase();
    const candidate = purchases.find((purchase) => {
      const otp = purchase.otp?.toLowerCase();
      return otp ? otp === normalizedCode : purchase.id.toLowerCase() === normalizedCode;
    });

    if (!candidate) {
      setVerificationFeedback({
        type: "error",
        message: t("companyGiftCardDetails.verify.errors.codeNotFound", {
          code: trimmedCode,
        }),
      });
      return;
    }

    if (candidate.status !== "active") {
      setVerificationFeedback({
        type: "error",
        message: t("companyGiftCardDetails.verify.errors.alreadyProcessed", {
          status: getPurchaseStatusLabel(candidate.status),
        }),
      });
      return;
    }

    setIsVerifying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMatchedPurchaseId(candidate.id);
      setVerificationFeedback({
        type: "success",
        message: t("companyGiftCardDetails.verify.codeSuccess", {
          code: trimmedCode,
          customer: candidate.customerName,
        }),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancelMatchedPurchase = () => {
    setMatchedPurchaseId(null);
    setVerificationFeedback(null);
    setVerificationCode("");
  };

  const handleObtainMatchedPurchase = async () => {
    if (!matchedPurchase) {
      return;
    }

    if (matchedPurchase.status !== "active") {
      setVerificationFeedback({
        type: "error",
        message: t("companyGiftCardDetails.verify.errors.alreadyProcessed", {
          status: getPurchaseStatusLabel(matchedPurchase.status),
        }),
      });
      setMatchedPurchaseId(null);
      return;
    }

    setIsCompleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const verifiedAt = new Date().toISOString();

      setPurchases((previous) =>
        previous.map((purchase) =>
          purchase.id === matchedPurchase.id
            ? { ...purchase, status: "used", usedAt: verifiedAt }
            : purchase
        )
      );

      setVerificationFeedback({
        type: "success",
        message: t("companyGiftCardDetails.verify.obtainSuccess", {
          customer: matchedPurchase.customerName,
        }),
      });
      setMatchedPurchaseId(null);
      setVerificationCode("");
    } finally {
      setIsCompleting(false);
    }
  };

  const infoStats = useMemo(
    () => [
      {
        labelKey: "companyGiftCardDetails.info.cardValue",
        value: `${giftCard?.value.toLocaleString()} kr.`,
      },
      giftCard?.discountPercentage !== undefined
        ? {
            labelKey: "companyGiftCardDetails.info.discount",
            value: t("companyGiftCardDetails.info.discountValue", {
              value: giftCard.discountPercentage,
            }),
          }
        : null,
      {
        labelKey: "companyGiftCardDetails.info.totalPurchases",
        value: stats.totalPurchases.toLocaleString(),
      },
    ].filter(Boolean) as { labelKey: string; value: string }[],
    [giftCard?.discountPercentage, giftCard?.value, stats.totalPurchases, t]
  );

  const summaryStats = useMemo(
    () => [
      {
        labelKey: "companyGiftCardDetails.stats.totalPurchases",
        value: stats.totalPurchases.toLocaleString(),
        icon: Users,
        borderClass: "border-primary",
        iconColor: "text-primary",
      },
      {
        labelKey: "companyGiftCardDetails.stats.activeCards",
        value: stats.activeCards.toLocaleString(),
        icon: CheckCircle,
        borderClass: "border-green",
        iconColor: "text-green",
      },
      {
        labelKey: "companyGiftCardDetails.stats.usedCards",
        value: stats.usedCards.toLocaleString(),
        icon: Gift,
        borderClass: "border-blue-500",
        iconColor: "text-blue-500",
      },
      {
        labelKey: "companyGiftCardDetails.stats.totalRevenue",
        value: `${stats.totalRevenue.toLocaleString()} kr.`,
        icon: DollarSign,
        borderClass: "border-purple-500",
        iconColor: "text-purple-500",
      },
    ],
    [stats.activeCards, stats.totalPurchases, stats.totalRevenue, stats.usedCards]
  );

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
              {t("companyGiftCardDetails.notFoundTitle")}
            </h1>
          </div>
        </div>
        <div className="bg-card-background border border-primary rounded-2xl p-6 text-center">
          <p className="text-gray-400">{t("companyGiftCardDetails.notFoundDescription")}</p>
          <p className="text-gray-500 text-sm mt-2">{t("companyGiftCardDetails.notFoundHint")}</p>
        </div>
      </div>
    );
  }
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
            {t("companyGiftCardDetails.title")}
          </h1>
          <p className="text-gray-400 text-sm">
            {t("companyGiftCardDetails.subtitle")}
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
                {t("companyGiftCardDetails.info.approved")}
              </span>
            </div>
            <p className="text-gray-300 mb-4">{giftCard.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {infoStats.map((item, index) => (
                <div key={index} className="bg-background rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">{t(item.labelKey)}</p>
                  <p className="text-white text-xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>

   

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                  <Calendar size={16} />
                  {t("companyGiftCardDetails.info.validFrom")}
                </p>
                <p className="text-white font-semibold">
                  {new Date(giftCard.validFrom).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                  <Calendar size={16} />
                  {t("companyGiftCardDetails.info.validUntil")}
                </p>
                <p className="text-white font-semibold">
                  {new Date(giftCard.validUntil).toLocaleDateString()}
                </p>
              </div>
            </div>

            {giftCard.terms && (
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">{t("companyGiftCardDetails.info.terms")}</p>
                <p className="text-gray-300 text-sm">{giftCard.terms}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {summaryStats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className={`bg-card-background border ${item.borderClass} rounded-2xl p-4`}>
          <div className="flex items-center justify-between">
            <div>
                  <p className="text-gray-400 text-sm">{t(item.labelKey)}</p>
                  <p className="text-white text-2xl font-bold">{item.value}</p>
            </div>
                <Icon className={item.iconColor} size={24} />
        </div>
            </div>
          );
        })}
      </div>

      {/* Verify Gift Card */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              {t("companyGiftCardDetails.verify.title")}
            </h3>
            <p className="text-gray-400 text-sm">
              {t("companyGiftCardDetails.verify.subtitle")}
            </p>
          </div>

          {purchases.length === 0 ? (
            <div className="rounded-lg border border-primary/30 bg-background/40 p-4 text-sm text-gray-400">
              {t("companyGiftCardDetails.verify.emptyState")}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm font-medium text-gray-300">
                  {t("companyGiftCardDetails.verify.methodLabel")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setVerificationMethod("scan")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      verificationMethod === "scan"
                        ? "bg-primary text-dark border-primary"
                        : "border-primary/40 text-gray-300 hover:bg-primary/10"
                    }`}
                  >
                    {t("companyGiftCardDetails.verify.method.scan")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationMethod("email")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      verificationMethod === "email"
                        ? "bg-primary text-dark border-primary"
                        : "border-primary/40 text-gray-300 hover:bg-primary/10"
                    }`}
                  >
                    {t("companyGiftCardDetails.verify.method.email")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationMethod("code")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      verificationMethod === "code"
                        ? "bg-primary text-dark border-primary"
                        : "border-primary/40 text-gray-300 hover:bg-primary/10"
                    }`}
                  >
                    {t("companyGiftCardDetails.verify.method.code")}
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                {t("companyGiftCardDetails.verify.autoHint")}
              </p>

              {verificationMethod === "scan" ? (
                <div className="rounded-lg border border-primary/30 bg-background/40 p-4">
                  <div className="flex items-start gap-3">
                    <QrCode className="text-primary mt-1" size={20} />
                    <div>
                      <p className="text-white font-semibold">
                        {t("companyGiftCardDetails.verify.scanTitle")}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {t("companyGiftCardDetails.verify.scanDescription")}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleScanVerify}
                    disabled={isVerifying}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-dark transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t(
                      isVerifying
                        ? "companyGiftCardDetails.verify.scanButtonLoading"
                        : "companyGiftCardDetails.verify.scanButton"
                    )}
                  </button>
                </div>
              ) : verificationMethod === "email" ? (
                <form
                  onSubmit={handleSendEmailVerification}
                  className="space-y-3 rounded-lg border border-primary/30 bg-background/40 p-4"
                >
                  <div className="flex items-start gap-3">
                    <Mail className="text-primary mt-1" size={20} />
                    <div>
                      <p className="text-white font-semibold">
                        {t("companyGiftCardDetails.verify.emailTitle")}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {t("companyGiftCardDetails.verify.emailDescription")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="gift-card-verification-email"
                      className="text-sm font-medium text-gray-300"
                    >
                      {t("companyGiftCardDetails.verify.emailLabel")}
                    </label>
                    <input
                      id="gift-card-verification-email"
                      type="email"
                      value={emailAddress}
                      onChange={(event) => setEmailAddress(event.target.value)}
                      className="mt-1 w-full rounded-lg border border-primary/40 bg-background px-3 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2"
                      placeholder={t("companyGiftCardDetails.verify.emailPlaceholder")}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-dark transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t(
                      isVerifying
                        ? "companyGiftCardDetails.verify.emailButtonLoading"
                        : "companyGiftCardDetails.verify.emailButton"
                    )}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handleManualCodeVerification}
                  className="space-y-3 rounded-lg border border-primary/30 bg-background/40 p-4"
                >
                  <div className="flex items-start gap-3">
                    <Key className="text-primary mt-1" size={20} />
                    <div>
                      <p className="text-white font-semibold">
                        {t("companyGiftCardDetails.verify.codeTitle")}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {t("companyGiftCardDetails.verify.codeDescription")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="gift-card-verification-code"
                      className="text-sm font-medium text-gray-300"
                    >
                      {t("companyGiftCardDetails.verify.codeLabel")}
                    </label>
                    <input
                      id="gift-card-verification-code"
                      type="text"
                      value={verificationCode}
                      onChange={(event) => setVerificationCode(event.target.value)}
                      className="mt-1 w-full rounded-lg border border-primary/40 bg-background px-3 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2"
                      placeholder={t("companyGiftCardDetails.verify.codePlaceholder")}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-dark transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t(
                      isVerifying
                        ? "companyGiftCardDetails.verify.codeButtonLoading"
                        : "companyGiftCardDetails.verify.codeButton"
                    )}
                  </button>
                </form>
              )}

              {matchedPurchase && (
                <div className="space-y-4 rounded-lg border border-primary/40 bg-background/40 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm uppercase tracking-wide text-gray-500">
                        {t("companyGiftCardDetails.verify.matchFoundLabel")}
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {matchedPurchase.customerName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail size={14} />
                        <span>{matchedPurchase.customerEmail}</span>
                      </div>
                      {matchedPurchase.customerPhone && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Phone size={14} />
                          <span>{matchedPurchase.customerPhone}</span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-300 sm:grid-cols-2">
                      <div>
                        <span className="block text-xs uppercase tracking-wide text-gray-500">
                          {t("companyGiftCardDetails.verify.matchAmount")}
                        </span>
                        <span className="font-semibold text-white">
                          {matchedPurchase.purchaseAmount.toLocaleString()} kr.
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase tracking-wide text-gray-500">
                          {t("companyGiftCardDetails.verify.matchStatus")}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${getStatusColor(
                            matchedPurchase.status
                          )}`}
                        >
                          <span>{getPurchaseStatusLabel(matchedPurchase.status)}</span>
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase tracking-wide text-gray-500">
                          {t("companyGiftCardDetails.verify.matchCode")}
                        </span>
                        <span className="font-mono text-white">
                          {matchedPurchase.otp ?? matchedPurchase.id}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase tracking-wide text-gray-500">
                          {t("companyGiftCardDetails.verify.matchPurchaseDate")}
                        </span>
                        <span className="text-white">
                          {new Date(matchedPurchase.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleCancelMatchedPurchase}
                      className="rounded-lg border border-primary/40 px-4 py-2 text-sm text-gray-300 transition-all hover:border-primary hover:text-white"
                    >
                      {t("companyGiftCardDetails.verify.cancelButton")}
                    </button>
                    <button
                      type="button"
                      onClick={handleObtainMatchedPurchase}
                      disabled={isCompleting}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-dark transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t(
                        isCompleting
                          ? "companyGiftCardDetails.verify.obtainButtonLoading"
                          : "companyGiftCardDetails.verify.obtainButton"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {verificationFeedback && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                verificationFeedback.type === "success"
                  ? "border-green/40 bg-green/10 text-green"
                  : "border-red-500/40 bg-red-500/10 text-red-500"
              }`}
            >
              {verificationFeedback.message}
            </div>
          )}
        </div>
      </div>

      {/* Purchases List */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Users className="text-primary" size={20} />
          {t("companyGiftCardDetails.purchases.title", { count: purchases.length })}
        </h3>

        {purchases.length === 0 ? (
          <div className="p-8 text-center">
            <Gift className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">{t("companyGiftCardDetails.purchases.emptyTitle")}</h3>
            <p className="text-gray-400">{t("companyGiftCardDetails.purchases.emptyDescription")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-primary/50">
                  <th className="pb-3">{t("companyGiftCardDetails.purchases.table.customer")}</th>
                  <th className="pb-3">{t("companyGiftCardDetails.purchases.table.purchaseDate")}</th>
                  <th className="pb-3">{t("companyGiftCardDetails.purchases.table.amount")}</th>
                  <th className="pb-3">{t("companyGiftCardDetails.purchases.table.status")}</th>
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
                        <span className="capitalize">{getPurchaseStatusLabel(purchase.status)}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

