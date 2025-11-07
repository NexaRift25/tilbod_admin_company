import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Search,
  ArrowLeft,
  Eye,
  ShoppingBag,
  Receipt,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Sale {
  id: string;
  offerTitle: string;
  offerType: string;
  customerName: string;
  customerEmail: string;
  purchaseDate: string;
  amount: number;
  status: "completed" | "pending" | "refunded";
  paymentMethod: "credit_card" | "bank_transfer" | "cash";
  transactionId: string;
}

interface Payment {
  id: string;
  period: string;
  totalSales: number;
  commission: number;
  netAmount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: string;
  paidDate?: string;
}

export default function SalesPage() {
  const { t } = useTranslation();
  const [sales] = useState<Sale[]>([
    {
      id: "1",
      offerTitle: "Weekend Getaway Package",
      offerType: "active",
      customerName: "Anna Jónsdóttir",
      customerEmail: "anna@example.com",
      purchaseDate: "2025-01-15",
      amount: 35000,
      status: "completed",
      paymentMethod: "credit_card",
      transactionId: "TXN-20250115-001"
    },
    {
      id: "2",
      offerTitle: "Spa & Wellness Gift Card",
      offerType: "gift_card",
      customerName: "Björn Guðmundsson",
      customerEmail: "bjorn@example.com",
      purchaseDate: "2025-01-14",
      amount: 8500,
      status: "completed",
      paymentMethod: "bank_transfer",
      transactionId: "TXN-20250114-002"
    },
    {
      id: "3",
      offerTitle: "Happy Hour Special",
      offerType: "happy_hour",
      customerName: "Sara Magnúsdóttir",
      customerEmail: "sara@example.com",
      purchaseDate: "2025-01-13",
      amount: 1000,
      status: "pending",
      paymentMethod: "credit_card",
      transactionId: "TXN-20250113-003"
    }
  ]);

  const [payments] = useState<Payment[]>([
    {
      id: "1",
      period: "January 2025",
      totalSales: 43500,
      commission: 4350,
      netAmount: 39150,
      status: "paid",
      dueDate: "2025-02-01",
      paidDate: "2025-02-01"
    },
    {
      id: "2",
      period: "December 2024",
      totalSales: 127500,
      commission: 12750,
      netAmount: 114750,
      status: "paid",
      dueDate: "2025-01-01",
      paidDate: "2025-01-01"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState("30");

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.offerTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green" size={16} />;
      case "pending":
        return <AlertCircle className="text-yellow" size={16} />;
      case "refunded":
        return <AlertCircle className="text-red-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-400" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green/10 text-green";
      case "pending":
        return "bg-yellow/10 text-yellow";
      case "refunded":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green/10 text-green";
      case "pending":
        return "bg-yellow/10 text-yellow";
      case "overdue":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const stats = {
    totalSales: sales.length,
    totalRevenue: sales.filter(s => s.status === "completed").reduce((sum, s) => sum + s.amount, 0),
    pendingPayments: sales.filter(s => s.status === "pending").length,
    completedPayments: sales.filter(s => s.status === "completed").length,
    averageOrderValue: sales.length > 0 ? Math.round(sales.filter(s => s.status === "completed").reduce((sum, s) => sum + s.amount, 0) / sales.filter(s => s.status === "completed").length) : 0,
  };

  const statsCards = useMemo(
    () => [
      {
        labelKey: "companySales.stats.totalSales",
        value: stats.totalSales.toLocaleString(),
        icon: ShoppingBag,
        borderClass: "border-primary",
        iconColor: "text-primary",
      },
      {
        labelKey: "companySales.stats.revenue",
        value: `${stats.totalRevenue.toLocaleString()} kr.`,
        icon: DollarSign,
        borderClass: "border-green",
        iconColor: "text-green",
      },
      {
        labelKey: "companySales.stats.pending",
        value: stats.pendingPayments.toLocaleString(),
        icon: AlertCircle,
        borderClass: "border-yellow-500",
        iconColor: "text-yellow",
      },
      {
        labelKey: "companySales.stats.completed",
        value: stats.completedPayments.toLocaleString(),
        icon: CheckCircle,
        borderClass: "border-blue-500",
        iconColor: "text-blue-500",
      },
      {
        labelKey: "companySales.stats.averageOrder",
        value: `${stats.averageOrderValue.toLocaleString()} kr.`,
        icon: TrendingUp,
        borderClass: "border-purple-500",
        iconColor: "text-purple-500",
      },
    ],
    [stats.averageOrderValue, stats.completedPayments, stats.pendingPayments, stats.totalRevenue, stats.totalSales]
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: t("companySales.filters.statusOptions.all") },
      { value: "completed", label: t("companySales.filters.statusOptions.completed") },
      { value: "pending", label: t("companySales.filters.statusOptions.pending") },
      { value: "refunded", label: t("companySales.filters.statusOptions.refunded") },
    ],
    [t]
  );

  const dateRangeOptions = useMemo(
    () => [
      { value: "7", label: t("companySales.filters.dateRanges.7") },
      { value: "30", label: t("companySales.filters.dateRanges.30") },
      { value: "90", label: t("companySales.filters.dateRanges.90") },
      { value: "365", label: t("companySales.filters.dateRanges.365") },
    ],
    [t]
  );

  const commissionStructurePoints = useMemo(
    () => t("companySales.commissionInfo.points", { returnObjects: true }) as string[],
    [t]
  );

  const getOfferTypeLabel = (type: string) =>
    t(`companySales.offerTypes.${type}`, { defaultValue: type.replace("_", " ") });

  const getStatusLabel = (status: Sale["status"]) =>
    t(`companySales.status.${status}`);

  const getPaymentStatusLabel = (status: Payment["status"]) =>
    t(`companySales.paymentStatus.${status}`);

  const getPaymentMethodLabel = (method: Sale["paymentMethod"]) =>
    t(`companySales.paymentMethods.${method}`);

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
              {t("companySales.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("companySales.subtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-primary/10 rounded-lg transition-all">
            <Download className="text-primary" size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                placeholder={t("companySales.filters.searchPlaceholder")}
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

          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">{t("companySales.salesTable.title")}</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-primary/50">
                <th className="pb-3">{t("companySales.salesTable.headers.offer")}</th>
                <th className="pb-3">{t("companySales.salesTable.headers.customer")}</th>
                <th className="pb-3">{t("companySales.salesTable.headers.date")}</th>
                <th className="pb-3">{t("companySales.salesTable.headers.amount")}</th>
                <th className="pb-3">{t("companySales.salesTable.headers.status")}</th>
                <th className="pb-3">{t("companySales.salesTable.headers.paymentMethod")}</th>
                <th className="pb-3">{t("companySales.salesTable.headers.actions")}</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b border-primary/10 hover:bg-primary/5">
                  <td className="py-4">
                    <div>
                      <p className="font-medium">{sale.offerTitle}</p>
                      <p className="text-sm text-gray-400 capitalize">{getOfferTypeLabel(sale.offerType)}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="font-medium">{sale.customerName}</p>
                      <p className="text-sm text-gray-400">{sale.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="font-medium">{sale.purchaseDate}</p>
                      <p className="text-sm text-gray-400">{sale.transactionId}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-bold">{sale.amount.toLocaleString()} kr.</p>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(sale.status)}`}>
                      {getStatusIcon(sale.status)}
                      <span className="capitalize">{getStatusLabel(sale.status)}</span>
                    </span>
                  </td>
                  <td className="py-4">
                    <p className="text-sm">{getPaymentMethodLabel(sale.paymentMethod)}</p>
                  </td>
                  <td className="py-4">
                    <Link
                      to={`/company/sales/${sale.id}`}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      aria-label={t("companySales.salesTable.viewDetails")}
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payments Section */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">{t("companySales.paymentsTable.title")}</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-primary/50">
                <th className="pb-3">{t("companySales.paymentsTable.headers.period")}</th>
                <th className="pb-3">{t("companySales.paymentsTable.headers.totalSales")}</th>
                <th className="pb-3">{t("companySales.paymentsTable.headers.commission")}</th>
                <th className="pb-3">{t("companySales.paymentsTable.headers.netAmount")}</th>
                <th className="pb-3">{t("companySales.paymentsTable.headers.status")}</th>
                <th className="pb-3">{t("companySales.paymentsTable.headers.dueDate")}</th>
                <th className="pb-3">{t("companySales.paymentsTable.headers.paidDate")}</th>
                <th className="pb-3">{t("companySales.paymentsTable.headers.actions")}</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-primary/10 hover:bg-primary/5">
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Receipt className="text-primary" size={18} />
                      <span className="font-medium">{payment.period}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-bold">{payment.totalSales.toLocaleString()} kr.</p>
                  </td>
                  <td className="py-4">
                    <p className="text-gray-300">{payment.commission.toLocaleString()} kr.</p>
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-green">{payment.netAmount.toLocaleString()} kr.</p>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(payment.status)}`}>
                      {payment.status === "paid" && <CheckCircle size={12} />}
                      {payment.status !== "paid" && <AlertCircle size={12} />}
                      <span className="capitalize">{getPaymentStatusLabel(payment.status)}</span>
                    </span>
                  </td>
                  <td className="py-4">
                    <p className="text-sm">{payment.dueDate}</p>
                  </td>
                  <td className="py-4">
                    {payment.paidDate ? (
                      <p className="text-sm text-green">{payment.paidDate}</p>
                    ) : (
                      <p className="text-sm text-gray-500">—</p>
                    )}
                  </td>
                  <td className="py-4">
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission Info */}
      <div className="bg-blue-500/10 border border-blue-500 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-blue-500 font-bold mb-1">{t("companySales.commissionInfo.title")}</h3>
            <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
              {commissionStructurePoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

