import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Search,
  Filter,
  Calendar,
  FileText,
  Building2,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/modal";
import Pagination from "@/components/ui/Pagination";

type InvoiceStatus = "paid" | "pending" | "overdue" | "cancelled";

interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  companyName: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  period: string;
  description: string;
  items: InvoiceItem[];
  totalAmount: number;
  taxAmount: number;
  netAmount: number;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const sampleInvoices: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2025-0001",
    companyId: "COMP-101",
    companyName: "Nordic Spa & Wellness",
    amount: 45000,
    currency: "ISK",
    status: "paid",
    issueDate: "2025-01-01",
    dueDate: "2025-01-31",
    paidDate: "2025-01-15",
    period: "December 2024",
    description: "Commission for Active Offers and Gift Cards",
    items: [
      {
        id: "item-1",
        description: "Active Offers Commission (30 days)",
        quantity: 30,
        unitPrice: 1,
        total: 30,
      },
      {
        id: "item-2",
        description: "Gift Cards Commission (5%)",
        quantity: 1,
        unitPrice: 45000,
        total: 45000,
      },
    ],
    totalAmount: 45000,
    taxAmount: 0,
    netAmount: 45000,
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2025-0002",
    companyId: "COMP-207",
    companyName: "Reykjavík Adventure Tours",
    amount: 5200,
    currency: "ISK",
    status: "paid",
    issueDate: "2025-01-01",
    dueDate: "2025-01-31",
    paidDate: "2025-01-10",
    period: "December 2024",
    description: "Commission for Active Offers",
    items: [
      {
        id: "item-1",
        description: "Active Offers Commission (52 days)",
        quantity: 52,
        unitPrice: 1,
        total: 52,
      },
    ],
    totalAmount: 5200,
    taxAmount: 0,
    netAmount: 5200,
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2025-0003",
    companyId: "COMP-132",
    companyName: "Harbor View Restaurant",
    amount: 12000,
    currency: "ISK",
    status: "pending",
    issueDate: "2025-01-01",
    dueDate: "2025-01-31",
    period: "December 2024",
    description: "Commission for Weekdays Offers and Happy Hour",
    items: [
      {
        id: "item-1",
        description: "Weekdays Offers Commission (3 weeks)",
        quantity: 3,
        unitPrice: 4,
        total: 12,
      },
      {
        id: "item-2",
        description: "Happy Hour Commission (1 month)",
        quantity: 1,
        unitPrice: 10,
        total: 10,
      },
    ],
    totalAmount: 12000,
    taxAmount: 0,
    netAmount: 12000,
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-2024-0045",
    companyId: "COMP-089",
    companyName: "Blue Lagoon Spa",
    amount: 8500,
    currency: "ISK",
    status: "overdue",
    issueDate: "2024-12-01",
    dueDate: "2024-12-31",
    period: "November 2024",
    description: "Commission for Active Offers",
    items: [
      {
        id: "item-1",
        description: "Active Offers Commission (85 days)",
        quantity: 85,
        unitPrice: 1,
        total: 85,
      },
    ],
    totalAmount: 8500,
    taxAmount: 0,
    netAmount: 8500,
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-2025-0004",
    companyId: "COMP-256",
    companyName: "Icelandic Souvenirs",
    amount: 3200,
    currency: "ISK",
    status: "pending",
    issueDate: "2025-01-01",
    dueDate: "2025-01-31",
    period: "December 2024",
    description: "Commission for Gift Cards",
    items: [
      {
        id: "item-1",
        description: "Gift Cards Commission (5%)",
        quantity: 1,
        unitPrice: 3200,
        total: 3200,
      },
    ],
    totalAmount: 3200,
    taxAmount: 0,
    netAmount: 3200,
  },
];

export default function AdminInvoiceHistoryPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "is" ? "is-IS" : "en-US";
  const formatCurrency = (value: number, currency: string) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency === "ISK" ? "ISK" : currency,
      currencyDisplay: "symbol",
      maximumFractionDigits: currency === "ISK" ? 0 : 2,
    }).format(value);

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredInvoices = useMemo(() => {
    return sampleInvoices.filter((invoice) => {
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        invoice.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.period.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInvoices.slice(startIndex, endIndex);
  }, [filteredInvoices, currentPage]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const stats = useMemo(() => {
    const totalAmount = filteredInvoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0
    );
    const paidCount = filteredInvoices.filter(
      (invoice) => invoice.status === "paid"
    ).length;
    const pendingCount = filteredInvoices.filter(
      (invoice) => invoice.status === "pending"
    ).length;
    const overdueCount = filteredInvoices.filter(
      (invoice) => invoice.status === "overdue"
    ).length;

    return {
      totalAmount,
      paidCount,
      pendingCount,
      overdueCount,
    };
  }, [filteredInvoices]);

  const statusChipStyles: Record<InvoiceStatus, string> = {
    paid: "bg-green/10 text-green border border-green/30",
    pending: "bg-yellow/10 text-yellow border border-yellow/30",
    overdue: "bg-red-500/10 text-red-400 border border-red-500/30",
    cancelled: "bg-gray-500/10 text-gray-400 border border-gray-500/30",
  };

  const statusIcon: Record<InvoiceStatus, JSX.Element> = {
    paid: <CheckCircle size={14} />,
    pending: <Clock size={14} />,
    overdue: <XCircle size={14} />,
    cancelled: <XCircle size={14} />,
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseModal = () => {
    setSelectedInvoice(null);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // TODO: Implement invoice download
    console.log("Download invoice:", invoice.invoiceNumber);
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
              {t("adminInvoiceHistory.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminInvoiceHistory.subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg border border-primary/40 text-gray-300 hover:text-white hover:border-primary transition-all">
            <RefreshCw size={16} className="inline mr-2" />
            {t("adminInvoiceHistory.actions.refresh")}
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-dark font-semibold hover:bg-primary/90 transition-all">
            <Download size={16} className="inline mr-2" />
            {t("adminInvoiceHistory.actions.export")}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminInvoiceHistory.stats.totalAmount")}
              </p>
              <p className="text-white text-2xl font-bold">
                {formatCurrency(stats.totalAmount, "ISK")}
              </p>
            </div>
            <DollarSign className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminInvoiceHistory.stats.paid")}
              </p>
              <p className="text-white text-2xl font-bold">{stats.paidCount}</p>
            </div>
            <CheckCircle className="text-green" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-yellow rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminInvoiceHistory.stats.pending")}
              </p>
              <p className="text-white text-2xl font-bold">
                {stats.pendingCount}
              </p>
            </div>
            <Clock className="text-yellow" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-red-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminInvoiceHistory.stats.overdue")}
              </p>
              <p className="text-white text-2xl font-bold">
                {stats.overdueCount}
              </p>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card-background border border-primary rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={t("adminInvoiceHistory.filters.searchPlaceholder")}
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
              onChange={(e) =>
                setStatusFilter(e.target.value as InvoiceStatus | "all")
              }
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">{t("adminInvoiceHistory.filters.status.all")}</option>
              <option value="paid">{t("adminInvoiceHistory.status.paid")}</option>
              <option value="pending">{t("adminInvoiceHistory.status.pending")}</option>
              <option value="overdue">{t("adminInvoiceHistory.status.overdue")}</option>
              <option value="cancelled">{t("adminInvoiceHistory.status.cancelled")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              {t("adminInvoiceHistory.table.title")}
            </h3>
            <p className="text-gray-400 text-sm">
              {t("adminInvoiceHistory.table.subtitle", {
                count: filteredInvoices.length,
              })}
            </p>
          </div>
        </div>

        {paginatedInvoices.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">
              {t("adminInvoiceHistory.table.empty.title")}
            </h3>
            <p className="text-gray-400">
              {t("adminInvoiceHistory.table.empty.description")}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-primary/50">
                    <th className="px-6 py-3">{t("adminInvoiceHistory.table.headers.invoiceNumber")}</th>
                    <th className="px-6 py-3">{t("adminInvoiceHistory.table.headers.company")}</th>
                    <th className="px-6 py-3">{t("adminInvoiceHistory.table.headers.period")}</th>
                    <th className="px-6 py-3">{t("adminInvoiceHistory.table.headers.amount")}</th>
                    <th className="px-6 py-3">{t("adminInvoiceHistory.table.headers.issueDate")}</th>
                    <th className="px-6 py-3">{t("adminInvoiceHistory.table.headers.dueDate")}</th>
                    <th className="px-6 py-3">{t("adminInvoiceHistory.table.headers.status")}</th>
                    <th className="px-6 py-3 text-right">{t("adminInvoiceHistory.table.headers.actions")}</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {paginatedInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-primary/10 hover:bg-primary/5"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="text-primary" size={16} />
                          <span className="font-medium">{invoice.invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="text-gray-400" size={16} />
                          <span>{invoice.companyName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {invoice.period}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatDate(invoice.issueDate)}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${statusChipStyles[invoice.status]}`}
                        >
                          {statusIcon[invoice.status]}
                          {t(`adminInvoiceHistory.status.${invoice.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title={t("adminInvoiceHistory.table.actions.view")}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title={t("adminInvoiceHistory.table.actions.download")}
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Invoice Details Modal */}
      <Modal
        isOpen={!!selectedInvoice}
        onClose={handleCloseModal}
        title={
          selectedInvoice
            ? t("adminInvoiceHistory.modal.title", {
                number: selectedInvoice.invoiceNumber,
              })
            : ""
        }
        size="2xl"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleCloseModal}
              className="px-6 py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all"
            >
              {t("adminInvoiceHistory.modal.close")}
            </button>
            {selectedInvoice && (
              <button
                onClick={() => handleDownloadInvoice(selectedInvoice)}
                className="px-6 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all"
              >
                <Download size={16} className="inline mr-2" />
                {t("adminInvoiceHistory.modal.download")}
              </button>
            )}
          </div>
        }
      >
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-primary/30">
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  {t("adminInvoiceHistory.modal.company")}
                </p>
                <p className="text-white font-semibold">
                  {selectedInvoice.companyName}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  ID: {selectedInvoice.companyId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">
                  {t("adminInvoiceHistory.modal.status")}
                </p>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${statusChipStyles[selectedInvoice.status]}`}
                >
                  {statusIcon[selectedInvoice.status]}
                  {t(`adminInvoiceHistory.status.${selectedInvoice.status}`)}
                </span>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  {t("adminInvoiceHistory.modal.issueDate")}
                </p>
                <p className="text-white">{formatDate(selectedInvoice.issueDate)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  {t("adminInvoiceHistory.modal.dueDate")}
                </p>
                <p className="text-white">{formatDate(selectedInvoice.dueDate)}</p>
              </div>
              {selectedInvoice.paidDate && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    {t("adminInvoiceHistory.modal.paidDate")}
                  </p>
                  <p className="text-white">{formatDate(selectedInvoice.paidDate)}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  {t("adminInvoiceHistory.modal.period")}
                </p>
                <p className="text-white">{selectedInvoice.period}</p>
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <h4 className="text-white font-semibold mb-4">
                {t("adminInvoiceHistory.modal.items")}
              </h4>
              <div className="space-y-3">
                {selectedInvoice.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.description}</p>
                      <p className="text-gray-400 text-sm">
                        {t("adminInvoiceHistory.modal.quantity")}: {item.quantity} ×{" "}
                        {formatCurrency(item.unitPrice, selectedInvoice.currency)}
                      </p>
                    </div>
                    <p className="text-white font-semibold">
                      {formatCurrency(item.total, selectedInvoice.currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Totals */}
            <div className="pt-4 border-t border-primary/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">
                  {t("adminInvoiceHistory.modal.subtotal")}
                </span>
                <span className="text-white font-semibold">
                  {formatCurrency(selectedInvoice.totalAmount, selectedInvoice.currency)}
                </span>
              </div>
              {selectedInvoice.taxAmount > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">
                    {t("adminInvoiceHistory.modal.tax")}
                  </span>
                  <span className="text-white font-semibold">
                    {formatCurrency(selectedInvoice.taxAmount, selectedInvoice.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-4 border-t border-primary/30">
                <span className="text-white text-lg font-bold">
                  {t("adminInvoiceHistory.modal.total")}
                </span>
                <span className="text-white text-lg font-bold">
                  {formatCurrency(selectedInvoice.netAmount, selectedInvoice.currency)}
                </span>
              </div>
            </div>

            {/* Description */}
            {selectedInvoice.description && (
              <div className="pt-4 border-t border-primary/30">
                <p className="text-gray-400 text-sm mb-2">
                  {t("adminInvoiceHistory.modal.description")}
                </p>
                <p className="text-white">{selectedInvoice.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

