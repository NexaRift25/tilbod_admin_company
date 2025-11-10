import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Search,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Banknote,
  RefreshCw,
  Info,
  ShieldCheck,
  Clock3,
  Wallet,
  Receipt,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/modal";

type TransactionStatus = "completed" | "pending" | "processing" | "failed";
type TransactionType = "payout" | "commission" | "refund" | "adjustment";
type PaymentMethod = "bankTransfer" | "card" | "manual";

interface PaymentTransaction {
  id: string;
  reference: string;
  companyName: string;
  companyId: string;
  amount: number;
  fees: number;
  netAmount: number;
  currency: string;
  date: string;
  processedAt: string;
  type: TransactionType;
  status: TransactionStatus;
  method: PaymentMethod;
  description: string;
  processedBy: string;
}

const sampleTransactions: PaymentTransaction[] = [
  {
    id: "tx-001",
    reference: "PAYOUT-2025-0001",
    companyName: "Nordic Spa & Wellness",
    companyId: "COMP-101",
    amount: 450000,
    fees: 9500,
    netAmount: 440500,
    currency: "ISK",
    date: "2025-01-12",
    processedAt: "2025-01-12T09:45:00Z",
    type: "payout",
    status: "completed",
    method: "bankTransfer",
    description: "Monthly payout for December bookings",
    processedBy: "admin@tilbod.is",
  },
  {
    id: "tx-002",
    reference: "COMMISSION-2025-0045",
    companyName: "Reykjavík Adventure Tours",
    companyId: "COMP-207",
    amount: 52000,
    fees: 0,
    netAmount: 52000,
    currency: "ISK",
    date: "2025-01-10",
    processedAt: "2025-01-10T14:15:00Z",
    type: "commission",
    status: "completed",
    method: "manual",
    description: "Commission deduction for Active Offer (JAN-24)",
    processedBy: "system",
  },
  {
    id: "tx-003",
    reference: "REFUND-2025-0012",
    companyName: "Harbor View Restaurant",
    companyId: "COMP-132",
    amount: -18000,
    fees: 0,
    netAmount: -18000,
    currency: "ISK",
    date: "2025-01-09",
    processedAt: "2025-01-09T11:02:00Z",
    type: "refund",
    status: "processing",
    method: "card",
    description: "Customer refund for booking #BK-8834",
    processedBy: "finance@tilbod.is",
  },
  {
    id: "tx-004",
    reference: "PAYOUT-2025-0002",
    companyName: "Aurora Sky Hotel",
    companyId: "COMP-090",
    amount: 680000,
    fees: 13800,
    netAmount: 666200,
    currency: "ISK",
    date: "2025-01-05",
    processedAt: "2025-01-05T16:25:00Z",
    type: "payout",
    status: "pending",
    method: "bankTransfer",
    description: "Partial payout awaiting bank confirmation",
    processedBy: "admin@tilbod.is",
  },
  {
    id: "tx-005",
    reference: "ADJUST-2024-023",
    companyName: "Glacier Expeditions",
    companyId: "COMP-301",
    amount: 12500,
    fees: 0,
    netAmount: 12500,
    currency: "ISK",
    date: "2024-12-29",
    processedAt: "2024-12-29T08:30:00Z",
    type: "adjustment",
    status: "completed",
    method: "manual",
    description: "Manual adjustment for misreported booking",
    processedBy: "finance@tilbod.is",
  },
  {
    id: "tx-006",
    reference: "PAYOUT-2024-0124",
    companyName: "Icelandic City Tours",
    companyId: "COMP-055",
    amount: 320000,
    fees: 6400,
    netAmount: 313600,
    currency: "ISK",
    date: "2024-12-27",
    processedAt: "2024-12-27T10:12:00Z",
    type: "payout",
    status: "failed",
    method: "bankTransfer",
    description: "Payout rejected by bank (invalid account number)",
    processedBy: "system",
  },
];

export default function AdminPaymentHistoryPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "is" ? "is-IS" : "en-US";
  const formatCurrency = (value: number, currency: string) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency === "ISK" ? "ISK" : currency,
      currencyDisplay: "symbol",
      maximumFractionDigits: currency === "ISK" ? 0 : 2,
    }).format(value);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<TransactionStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [selectedTransaction, setSelectedTransaction] =
    useState<PaymentTransaction | null>(null);

  const filteredTransactions = useMemo(() => {
    return sampleTransactions.filter((transaction) => {
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        transaction.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const totalVolume = sampleTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    const completedCount = sampleTransactions.filter(
      (transaction) => transaction.status === "completed"
    ).length;
    const pendingCount = sampleTransactions.filter(
      (transaction) =>
        transaction.status === "pending" || transaction.status === "processing"
    ).length;
    const failedCount = sampleTransactions.filter(
      (transaction) => transaction.status === "failed"
    ).length;
    const averageProcessing = 18; // placeholder

    return {
      totalVolume,
      completedCount,
      pendingCount,
      failedCount,
      averageProcessing,
    };
  }, []);

  const statusChipStyles: Record<TransactionStatus, string> = {
    completed: "bg-green/10 text-green border border-green/30",
    pending: "bg-yellow/10 text-yellow border border-yellow/30",
    processing: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
    failed: "bg-red-500/10 text-red-400 border border-red-500/30",
  };

  const statusIcon: Record<TransactionStatus, JSX.Element> = {
    completed: <ShieldCheck size={14} />,
    pending: <Clock3 size={14} />,
    processing: <TrendingUp size={14} />,
    failed: <AlertCircle size={14} />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/dashboard"
            className="p-2 hover:bg-primary/10 rounded-lg transition-all"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {t("adminPaymentHistory.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminPaymentHistory.subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg border border-primary/40 text-gray-300 hover:text-white hover:border-primary transition-all">
            <RefreshCw size={16} className="inline mr-2" />
            {t("adminPaymentHistory.actions.refresh")}
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-dark font-semibold hover:bg-primary/90 transition-all">
            <Download size={16} className="inline mr-2" />
            {t("adminPaymentHistory.actions.export")}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Banknote}
          label={t("adminPaymentHistory.stats.totalVolume")}
          value={formatCurrency(stats.totalVolume, "ISK")}
          chip={t("adminPaymentHistory.stats.last30Days")}
        />
        <StatCard
          icon={DollarSign}
          label={t("adminPaymentHistory.stats.completed")}
          value={stats.completedCount.toLocaleString(locale)}
          tone="green"
        />
        <StatCard
          icon={TrendingUp}
          label={t("adminPaymentHistory.stats.processing")}
          value={stats.pendingCount.toLocaleString(locale)}
          tone="blue"
        />
        <StatCard
          icon={AlertCircle}
          label={t("adminPaymentHistory.stats.failed")}
          value={stats.failedCount.toLocaleString(locale)}
          tone="red"
          chip={t("adminPaymentHistory.stats.failureRate", { value: "1.4%" })}
        />
      </div>

      {/* Filters */}
      <div className="bg-card-background border border-primary rounded-2xl p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-gray-500 mb-2 block">
              {t("adminPaymentHistory.filters.searchLabel")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t("adminPaymentHistory.filters.searchPlaceholder")}
                className="w-full pl-10 pr-4 py-2 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-gray-500 mb-2 block">
              {t("adminPaymentHistory.filters.statusLabel")}
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as TransactionStatus | "all")
                }
                className="w-full pl-10 pr-4 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
              >
                <option value="all">{t("adminPaymentHistory.filters.status.all")}</option>
                <option value="completed">{t("adminPaymentHistory.status.completed")}</option>
                <option value="pending">{t("adminPaymentHistory.status.pending")}</option>
                <option value="processing">{t("adminPaymentHistory.status.processing")}</option>
                <option value="failed">{t("adminPaymentHistory.status.failed")}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-gray-500 mb-2 block">
              {t("adminPaymentHistory.filters.typeLabel")}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value as TransactionType | "all")
                }
                className="w-full pl-10 pr-4 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
              >
                <option value="all">{t("adminPaymentHistory.filters.type.all")}</option>
                <option value="payout">{t("adminPaymentHistory.types.payout")}</option>
                <option value="commission">{t("adminPaymentHistory.types.commission")}</option>
                <option value="refund">{t("adminPaymentHistory.types.refund")}</option>
                <option value="adjustment">{t("adminPaymentHistory.types.adjustment")}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-primary/20 mt-4">
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setTypeFilter("all");
            }}
            className="text-sm text-gray-400 hover:text-white transition-all"
          >
            {t("adminPaymentHistory.filters.reset")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-background border border-primary rounded-2xl">
        <div className="p-6 border-b border-primary/20 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              {t("adminPaymentHistory.table.title")}
            </h2>
            <p className="text-sm text-gray-400">
              {t("adminPaymentHistory.table.subtitle", {
                count: filteredTransactions.length,
              })}
            </p>
          </div>
          <button className="px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-sm font-semibold">
            <Download size={14} className="inline mr-2" />
            {t("adminPaymentHistory.actions.downloadVisible")}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-primary/20">
                <th className="px-6 py-3">{t("adminPaymentHistory.table.headers.reference")}</th>
                <th className="px-6 py-3">{t("adminPaymentHistory.table.headers.company")}</th>
                <th className="px-6 py-3">{t("adminPaymentHistory.table.headers.type")}</th>
                <th className="px-6 py-3">{t("adminPaymentHistory.table.headers.amount")}</th>
                <th className="px-6 py-3">{t("adminPaymentHistory.table.headers.fees")}</th>
                <th className="px-6 py-3">{t("adminPaymentHistory.table.headers.netAmount")}</th>
                <th className="px-6 py-3">{t("adminPaymentHistory.table.headers.status")}</th>
                <th className="px-6 py-3">{t("adminPaymentHistory.table.headers.method")}</th>
                <th className="px-6 py-3">{t("adminPaymentHistory.table.headers.date")}</th>
                <th className="px-6 py-3 text-right">{t("adminPaymentHistory.table.headers.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-400">
                    <p className="font-semibold text-white">
                      {t("adminPaymentHistory.table.empty.title")}
                    </p>
                    <p className="text-sm text-gray-400">
                      {t("adminPaymentHistory.table.empty.description")}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="text-white text-sm border-b border-primary/10 hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-primary">
                      {transaction.reference}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{transaction.companyName}</span>
                        <span className="text-xs text-gray-500">{transaction.companyId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 text-sm text-gray-300 capitalize">
                        {t(`adminPaymentHistory.types.${transaction.type}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {formatCurrency(transaction.fees, transaction.currency)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green">
                      {formatCurrency(transaction.netAmount, transaction.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${statusChipStyles[transaction.status]}`}
                      >
                        {statusIcon[transaction.status]}
                        {t(`adminPaymentHistory.status.${transaction.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {t(`adminPaymentHistory.methods.${transaction.method}`)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {new Date(transaction.date).toLocaleDateString(locale)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-primary/40 text-gray-300 hover:text-white hover:border-primary transition-all"
                      >
                        {t("adminPaymentHistory.table.actions.view")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title={
          selectedTransaction
            ? t("adminPaymentHistory.modal.title", {
                reference: selectedTransaction.reference,
              })
            : ""
        }
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSelectedTransaction(null)}
              className="px-4 py-2 rounded-lg border border-primary/40 text-gray-300 hover:text-white hover:border-primary transition-all"
            >
              {t("common.close")}
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-primary/80 transition-all">
              <Download size={16} className="inline mr-2" />
              {t("adminPaymentHistory.modal.export")}
            </button>
          </div>
        }
      >
        {selectedTransaction && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <HighlightCard
                icon={ShieldCheck}
                label={t("adminPaymentHistory.modal.status")}
                value={t(`adminPaymentHistory.status.${selectedTransaction.status}`)}
                tone={statusTone(selectedTransaction.status)}
              />
              <HighlightCard
                icon={Wallet}
                label={t("adminPaymentHistory.modal.netAmount")}
                value={formatCurrency(selectedTransaction.netAmount, selectedTransaction.currency)}
                tone="green"
              />
              <HighlightCard
                icon={Receipt}
                label={t("adminPaymentHistory.modal.type")}
                value={t(`adminPaymentHistory.types.${selectedTransaction.type}`)}
                tone="blue"
              />
            </div>

            <div className="rounded-2xl border border-primary/20 bg-background/60 backdrop-blur">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-primary/10">
                <DetailRow
                  label={t("adminPaymentHistory.modal.company")}
                  value={
                    <div className="space-y-1">
                      <p className="text-white font-semibold">
                        {selectedTransaction.companyName}
                      </p>
                      <span className="inline-flex items-center text-xs text-gray-400 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                        {selectedTransaction.companyId}
                      </span>
                    </div>
                  }
                />
                <DetailRow
                  label={t("adminPaymentHistory.modal.method")}
                  value={
                    <span className="inline-flex items-center gap-2 text-sm text-gray-200">
                      <Wallet size={16} className="text-primary" />
                      {t(`adminPaymentHistory.methods.${selectedTransaction.method}`)}
                    </span>
                  }
                />
                <DetailRow
                  label={t("adminPaymentHistory.modal.amount")}
                  value={formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                />
                <DetailRow
                  label={t("adminPaymentHistory.modal.fees")}
                  value={formatCurrency(selectedTransaction.fees, selectedTransaction.currency)}
                />
                <DetailRow
                  label={t("adminPaymentHistory.modal.processedAt")}
                  value={new Date(selectedTransaction.processedAt).toLocaleString(locale)}
                />
                <DetailRow
                  label={t("adminPaymentHistory.modal.processedBy")}
                  value={selectedTransaction.processedBy}
                />
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                    {t("adminPaymentHistory.modal.description")}
                  </p>
                  <p className="text-sm text-gray-300 bg-background/60 border border-primary/20 rounded-xl px-4 py-3">
                    {selectedTransaction.description}
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <Info size={18} className="text-primary mt-0.5" />
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {t("adminPaymentHistory.modal.notice")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

type StatTone = "primary" | "green" | "blue" | "red";

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "primary",
  chip,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: StatTone;
  chip?: string;
}) {
  const borderClasses: Record<StatTone, string> = {
    primary: "border-primary",
    green: "border-green",
    blue: "border-blue-500",
    red: "border-red-500",
  };
  const iconClasses: Record<StatTone, string> = {
    primary: "text-primary",
    green: "text-green",
    blue: "text-blue-400",
    red: "text-red-400",
  };

  return (
    <div className={`bg-card-background border rounded-2xl p-4 ${borderClasses[tone]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
        <div
          className={`p-2 rounded-xl border ${borderClasses[tone]} bg-primary/5`}
        >
          <Icon size={22} className={iconClasses[tone]} />
        </div>
      </div>
      {chip && (
        <p className="text-xs text-gray-500 mt-3 border-t border-primary/10 pt-2">
          {chip}
        </p>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <div className="text-sm text-gray-200">{value}</div>
    </div>
  );
}

function HighlightCard({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: StatTone;
}) {
  const background: Record<StatTone, string> = {
    primary: "bg-primary/10 border-primary/20 text-primary",
    green: "bg-green/10 border-green/20 text-green",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    red: "bg-red-500/10 border-red-500/20 text-red-400",
  };

  return (
    <div
      className={`rounded-2xl border p-4 flex items-center gap-3 ${background[tone]}`}
    >
      <div className="rounded-xl bg-background/80 p-3">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide opacity-80">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

function statusTone(status: TransactionStatus): StatTone {
  switch (status) {
    case "completed":
      return "green";
    case "failed":
      return "red";
    case "processing":
      return "blue";
    default:
      return "primary";
  }
}

