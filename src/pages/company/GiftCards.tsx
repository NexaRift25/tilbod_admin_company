import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Gift,
  ArrowLeft,
  Eye,
  Search,
  Filter,
  DollarSign,
  Users,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/modal";

interface GiftCard {
  id: string;
  title: string;
  description: string;
  value: number;
  discountPercentage?: number;
  status: "approved" | "pending" | "rejected";
  approvedAt: string;
  totalPurchases: number;
  totalRevenue: number;
  validFrom: string;
  validUntil: string;
}

export default function GiftCardsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("approved");
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationFeedback, setVerificationFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [giftCards] = useState<GiftCard[]>([
    {
      id: "1",
      title: "Spa & Wellness Gift Card",
      description: "Full day spa experience with treatments and relaxation",
      value: 15000,
      discountPercentage: 20,
      status: "approved",
      approvedAt: "2025-01-10",
      totalPurchases: 45,
      totalRevenue: 675000,
      validFrom: "2025-01-15",
      validUntil: "2025-12-31",
    },
    {
      id: "2",
      title: "Restaurant Dining Gift Card",
      description: "Fine dining experience for two",
      value: 10000,
      discountPercentage: 15,
      status: "approved",
      approvedAt: "2025-01-08",
      totalPurchases: 32,
      totalRevenue: 320000,
      validFrom: "2025-01-10",
      validUntil: "2025-11-30",
    },
    {
      id: "3",
      title: "Adventure Tours Gift Card",
      description: "Experience Iceland's natural wonders",
      value: 25000,
      discountPercentage: 25,
      status: "approved",
      approvedAt: "2025-01-05",
      totalPurchases: 18,
      totalRevenue: 450000,
      validFrom: "2025-01-12",
      validUntil: "2025-12-31",
    },
    {
      id: "4",
      title: "Hotel Stay Gift Card",
      description: "Luxury hotel accommodation package",
      value: 50000,
      discountPercentage: 30,
      status: "approved",
      approvedAt: "2025-01-03",
      totalPurchases: 12,
      totalRevenue: 600000,
      validFrom: "2025-01-15",
      validUntil: "2026-01-15",
    },
  ]);

  const filteredGiftCards = giftCards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || card.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: giftCards.length,
    totalPurchases: giftCards.reduce((sum, card) => sum + card.totalPurchases, 0),
    totalRevenue: giftCards.reduce((sum, card) => sum + card.totalRevenue, 0),
  };

  const statsCards = useMemo(
    () => [
      {
        labelKey: "companyGiftCards.stats.total",
        value: stats.total.toLocaleString(),
        icon: Gift,
        borderClass: "border-primary",
        iconColor: "text-primary",
      },
      {
        labelKey: "companyGiftCards.stats.totalPurchases",
        value: stats.totalPurchases.toLocaleString(),
        icon: Users,
        borderClass: "border-green",
        iconColor: "text-green",
      },
      {
        labelKey: "companyGiftCards.stats.totalRevenue",
        value: `${stats.totalRevenue.toLocaleString()} kr.`,
        icon: DollarSign,
        borderClass: "border-blue-500",
        iconColor: "text-blue-500",
      },
    ],
    [stats.total, stats.totalPurchases, stats.totalRevenue]
  );

  const handleOpenVerifyModal = (card: GiftCard) => {
    setSelectedCard(card);
    setVerificationCode("");
    setVerificationFeedback(null);
    setIsVerifyModalOpen(true);
  };

  const handleCloseVerifyModal = () => {
    setIsVerifyModalOpen(false);
    setSelectedCard(null);
    setVerificationCode("");
    setVerificationFeedback(null);
  };

  const handleVerifySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!verificationCode.trim()) {
      setVerificationFeedback({
        type: "error",
        message: t("companyGiftCards.verifyModal.errors.required"),
      });
      return;
    }

    const normalizedCode = verificationCode.trim();

    setVerificationFeedback({
      type: "success",
      message: t("companyGiftCards.verifyModal.resultSuccess", {
        code: normalizedCode,
        card: selectedCard?.title ?? "",
      }),
    });
  };

  const statusOptions = useMemo(
    () => [
      { value: "approved", label: t("companyGiftCards.filters.status.approved") },
      { value: "all", label: t("companyGiftCards.filters.status.all") },
      { value: "pending", label: t("companyGiftCards.filters.status.pending") },
      { value: "rejected", label: t("companyGiftCards.filters.status.rejected") },
    ],
    [t]
  );

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
            {t("companyGiftCards.title")}
          </h1>
          <p className="text-gray-400 text-sm">
            {t("companyGiftCards.subtitle")}
          </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statsCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={`bg-card-background border ${card.borderClass} rounded-2xl p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t(card.labelKey)}</p>
                <p className="text-white text-2xl font-bold">{card.value}</p>
              </div>
              <Icon className={card.iconColor} size={24} />
            </div>
          </div>
        );
      })}
      </div>

      {/* Filters */}
      <div className="bg-card-background border border-primary rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
              placeholder={t("companyGiftCards.filters.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gift Cards List */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        {filteredGiftCards.length === 0 ? (
          <div className="p-8 text-center">
            <Gift className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">{t("companyGiftCards.table.emptyTitle")}</h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== "approved"
                ? t("companyGiftCards.table.emptyFiltered")
                : t("companyGiftCards.table.emptyDefault")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-primary/50">
                  <th className="pb-3">{t("companyGiftCards.table.headers.giftCard")}</th>
                  <th className="pb-3">{t("companyGiftCards.table.headers.value")}</th>
                  <th className="pb-3">{t("companyGiftCards.table.headers.discount")}</th>
                  <th className="pb-3">{t("companyGiftCards.table.headers.purchases")}</th>
                  <th className="pb-3">{t("companyGiftCards.table.headers.revenue")}</th>
                  <th className="pb-3">{t("companyGiftCards.table.headers.validPeriod")}</th>
                  <th className="pb-3">{t("companyGiftCards.table.headers.actions")}</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {filteredGiftCards.map((card) => (
                  <tr key={card.id} className="border-b border-primary/10 hover:bg-primary/5">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Gift className="text-primary" size={18} />
                        <div>
                          <p className="font-medium">{card.title}</p>
                          <p className="text-sm text-gray-400 max-w-xs truncate" title={card.description}>
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-bold">{card.value.toLocaleString()} kr.</p>
                    </td>
                    <td className="py-4">
                      {card.discountPercentage ? (
                        <span className="text-sm text-green font-semibold">
                          {t("companyGiftCards.table.discountValue", { value: card.discountPercentage })}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">{t("companyGiftCards.table.noDiscount")}</span>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        <Users size={14} className="text-gray-400" />
                        <p className="text-sm font-medium">{card.totalPurchases}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-bold text-green">{card.totalRevenue.toLocaleString()} kr.</p>
                    </td>
                    <td className="py-4">
                      <div className="text-sm">
                        <p className="text-gray-300">
                          {new Date(card.validFrom).toLocaleDateString()} - {new Date(card.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenVerifyModal(card)}
                          className="p-2 text-gray-400 hover:text-green hover:bg-green/10 rounded-lg transition-all"
                          title={t("companyGiftCards.table.verify")}
                          aria-label={t("companyGiftCards.table.verify")}
                        >
                          <ShieldCheck size={16} />
                        </button>
                        <Link
                          to={`/company/gift-cards/${card.id}`}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title={t("companyGiftCards.table.viewDetails")}
                        >
                          <Eye size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isVerifyModalOpen}
        onClose={handleCloseVerifyModal}
        title={t("companyGiftCards.verifyModal.title", { card: selectedCard?.title ?? "" })}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseVerifyModal}
              className="px-4 py-2 rounded-lg border border-primary/40 text-gray-300 hover:text-white hover:border-primary transition-all"
            >
              {t("companyGiftCards.verifyModal.cancel")}
            </button>
            <button
              type="submit"
              form="verify-gift-card-form"
              className="px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-primary/80 transition-all"
            >
              {t("companyGiftCards.verifyModal.submit")}
            </button>
          </div>
        }
      >
        <form id="verify-gift-card-form" onSubmit={handleVerifySubmit} className="space-y-4">
          <p className="text-gray-400">
            {t("companyGiftCards.verifyModal.description", {
              card: selectedCard?.title ?? t("companyGiftCards.verifyModal.fallbackCard"),
            })}
          </p>

          <div className="space-y-2">
            <label htmlFor="gift-card-verification-code" className="text-sm font-medium text-white">
              {t("companyGiftCards.verifyModal.codeLabel")}
            </label>
            <input
              id="gift-card-verification-code"
              type="text"
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value)}
              placeholder={t("companyGiftCards.verifyModal.codePlaceholder")}
              className="w-full rounded-lg border border-primary/40 bg-background px-3 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2"
            />
          </div>

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
        </form>
      </Modal>
    </div>
  );
}

