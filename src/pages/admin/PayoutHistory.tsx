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
  ChevronDown,
  ChevronUp,
  Receipt,
  User,
  Info,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/modal";
import Pagination from "@/components/ui/Pagination";

type ExpenseStatus = "DRAFT" | "PAID" | "PENDING" | "CANCELLED";

interface ExpenseLine {
  id: string;
  expenseId: string;
  description: string;
  quantity: number;
  unitPriceExcludingVat: number;
  unitPriceIncludingVat: number;
  vatPercentage: number;
  discountPercentage: number | null;
  accountId: string;
  created: string;
}

interface Creditor {
  id: string;
  ssn: string;
  name: string;
}

interface Expense {
  id: string;
  source: string | null;
  status: ExpenseStatus;
  creditor: Creditor;
  paidDate: string | null;
  paymentType: string | null;
  date: string;
  dueDate: string | null;
  finalDueDate: string | null;
  reference: string;
  deductible: boolean;
  comments: string;
  amountExcludingVat: number;
  amountIncludingVat: number;
  amountVat: number;
  voucher: string | null;
  created: string;
  lines: ExpenseLine[];
}

const sampleExpenses: Expense[] = [
  {
    id: "6e4334a6-b44b-4e1b-a418-a45b5e0cbe1b",
    source: null,
    status: "DRAFT",
    creditor: {
      id: "e2f78a27-331f-4fe5-a44f-9a92441aa3ca",
      ssn: "5204172570",
      name: "Payday ehf.",
    },
    paidDate: null,
    paymentType: null,
    date: "2020-06-10T00:00:00Z",
    dueDate: null,
    finalDueDate: null,
    reference: "test",
    deductible: true,
    comments: "athugasemd",
    amountExcludingVat: 100,
    amountIncludingVat: 124,
    amountVat: 24,
    voucher: null,
    created: "2022-05-27T13:20:50Z",
    lines: [
      {
        id: "9903339-1162-4cd0-3353-6ce444e6951d",
        expenseId: "6e4334a6-b44b-4e1b-a418-a45b5e0cbe1b",
        description: "Húsaleiga",
        quantity: 1,
        unitPriceExcludingVat: 100,
        unitPriceIncludingVat: 124,
        vatPercentage: 24,
        discountPercentage: null,
        accountId: "14231333-2448-473f-a5de-32c26bf7195e",
        created: "2022-05-27T13:20:50Z",
      },
    ],
  },
  {
    id: "7f5445b7-c55c-5f2c-b529-b56c6f1dcf2c",
    source: "payday",
    status: "PAID",
    creditor: {
      id: "f3g89b38-442g-5gf6-b55g-0b03552bb4db",
      ssn: "6205183681",
      name: "Office Supplies Ltd.",
    },
    paidDate: "2024-12-15T10:30:00Z",
    paymentType: "BANK_TRANSFER",
    date: "2024-12-01T00:00:00Z",
    dueDate: "2024-12-31T00:00:00Z",
    finalDueDate: "2024-12-31T00:00:00Z",
    reference: "OFF-2024-001",
    deductible: true,
    comments: "Monthly office supplies",
    amountExcludingVat: 50000,
    amountIncludingVat: 62000,
    amountVat: 12000,
    voucher: "VCH-2024-123",
    created: "2024-12-01T08:00:00Z",
    lines: [
      {
        id: "aa1444a-2273-5de1-4464-7df555f7a06e",
        expenseId: "7f5445b7-c55c-5f2c-b529-b56c6f1dcf2c",
        description: "Printer paper",
        quantity: 50,
        unitPriceExcludingVat: 800,
        unitPriceIncludingVat: 992,
        vatPercentage: 24,
        discountPercentage: null,
        accountId: "25342444-3559-584g-b6ef-43d37cg82a5f",
        created: "2024-12-01T08:00:00Z",
      },
      {
        id: "bb2555b-3384-6ef2-5575-8eg666g8b17f",
        expenseId: "7f5445b7-c55c-5f2c-b529-b56c6f1dcf2c",
        description: "Office chairs",
        quantity: 2,
        unitPriceExcludingVat: 18000,
        unitPriceIncludingVat: 22320,
        vatPercentage: 24,
        discountPercentage: 5,
        accountId: "25342444-3559-584g-b6ef-43d37cg82a5f",
        created: "2024-12-01T08:00:00Z",
      },
    ],
  },
  {
    id: "8g6556c8-d66d-6g3d-c63a-c67d7g2ed3d",
    source: "payday",
    status: "PENDING",
    creditor: {
      id: "g4h90c49-553h-6hg7-c66h-1c14663cc5ec",
      ssn: "7206294792",
      name: "IT Services Inc.",
    },
    paidDate: null,
    paymentType: null,
    date: "2025-01-05T00:00:00Z",
    dueDate: "2025-01-20T00:00:00Z",
    finalDueDate: "2025-01-20T00:00:00Z",
    reference: "IT-2025-002",
    deductible: true,
    comments: "Monthly IT maintenance",
    amountExcludingVat: 75000,
    amountIncludingVat: 93000,
    amountVat: 18000,
    voucher: null,
    created: "2025-01-05T09:15:00Z",
    lines: [
      {
        id: "cc3666c-4495-7fg3-6686-9fh777h9c28g",
        expenseId: "8g6556c8-d66d-6g3d-c63a-c67d7g2ed3d",
        description: "Server maintenance",
        quantity: 1,
        unitPriceExcludingVat: 75000,
        unitPriceIncludingVat: 93000,
        vatPercentage: 24,
        discountPercentage: null,
        accountId: "36453555-4660-695h-c7fg-54e48dh93b6g",
        created: "2025-01-05T09:15:00Z",
      },
    ],
  },
];

export default function AdminPayoutHistoryPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "is" ? "is-IS" : "en-US";
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "ISK",
      currencyDisplay: "symbol",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (value: string | null) =>
    value ? new Date(value).toLocaleDateString(locale) : "-";

  const formatDateTime = (value: string | null) =>
    value ? new Date(value).toLocaleString(locale) : "-";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | "all">("all");
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredExpenses = useMemo(() => {
    return sampleExpenses.filter((expense) => {
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        expense.creditor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.comments.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || expense.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredExpenses.slice(startIndex, endIndex);
  }, [filteredExpenses, currentPage]);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const stats = useMemo(() => {
    const totalAmount = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amountIncludingVat,
      0
    );
    const totalVat = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amountVat,
      0
    );
    const paidCount = filteredExpenses.filter(
      (expense) => expense.status === "PAID"
    ).length;
    const draftCount = filteredExpenses.filter(
      (expense) => expense.status === "DRAFT"
    ).length;
    const pendingCount = filteredExpenses.filter(
      (expense) => expense.status === "PENDING"
    ).length;

    return {
      totalAmount,
      totalVat,
      paidCount,
      draftCount,
      pendingCount,
    };
  }, [filteredExpenses]);

  const statusChipStyles: Record<ExpenseStatus, string> = {
    DRAFT: "bg-gray-500/10 text-gray-400 border border-gray-500/30",
    PAID: "bg-green/10 text-green border border-green/30",
    PENDING: "bg-yellow/10 text-yellow border border-yellow/30",
    CANCELLED: "bg-red-500/10 text-red-400 border border-red-500/30",
  };

  const statusIcon: Record<ExpenseStatus, JSX.Element> = {
    DRAFT: <FileText size={14} />,
    PAID: <CheckCircle size={14} />,
    PENDING: <Clock size={14} />,
    CANCELLED: <XCircle size={14} />,
  };

  const toggleRowExpansion = (expenseId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(expenseId)) {
        newSet.delete(expenseId);
      } else {
        newSet.add(expenseId);
      }
      return newSet;
    });
  };

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense);
  };

  const handleCloseModal = () => {
    setSelectedExpense(null);
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
              {t("adminPayoutHistory.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminPayoutHistory.subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg border border-primary/40 text-gray-300 hover:text-white hover:border-primary transition-all">
            <RefreshCw size={16} className="inline mr-2" />
            {t("adminPayoutHistory.actions.refresh")}
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-dark font-semibold hover:bg-primary/90 transition-all">
            <Download size={16} className="inline mr-2" />
            {t("adminPayoutHistory.actions.export")}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminPayoutHistory.stats.totalAmount")}
              </p>
              <p className="text-white text-2xl font-bold">
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
            <DollarSign className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminPayoutHistory.stats.totalVat")}
              </p>
              <p className="text-white text-2xl font-bold">
                {formatCurrency(stats.totalVat)}
              </p>
            </div>
            <Receipt className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminPayoutHistory.stats.paid")}
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
                {t("adminPayoutHistory.stats.pending")}
              </p>
              <p className="text-white text-2xl font-bold">
                {stats.pendingCount}
              </p>
            </div>
            <Clock className="text-yellow" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-gray-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminPayoutHistory.stats.draft")}
              </p>
              <p className="text-white text-2xl font-bold">{stats.draftCount}</p>
            </div>
            <FileText className="text-gray-400" size={24} />
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
                placeholder={t("adminPayoutHistory.filters.searchPlaceholder")}
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
                setStatusFilter(e.target.value as ExpenseStatus | "all")
              }
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">{t("adminPayoutHistory.filters.status.all")}</option>
              <option value="DRAFT">{t("adminPayoutHistory.status.DRAFT")}</option>
              <option value="PAID">{t("adminPayoutHistory.status.PAID")}</option>
              <option value="PENDING">{t("adminPayoutHistory.status.PENDING")}</option>
              <option value="CANCELLED">{t("adminPayoutHistory.status.CANCELLED")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              {t("adminPayoutHistory.table.title")}
            </h3>
            <p className="text-gray-400 text-sm">
              {t("adminPayoutHistory.table.subtitle", {
                count: filteredExpenses.length,
              })}
            </p>
          </div>
        </div>

        {paginatedExpenses.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">
              {t("adminPayoutHistory.table.empty.title")}
            </h3>
            <p className="text-gray-400">
              {t("adminPayoutHistory.table.empty.description")}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-primary/50">
                    <th className="px-6 py-3 w-12"></th>
                    <th className="px-6 py-3">{t("adminPayoutHistory.table.headers.date")}</th>
                    <th className="px-6 py-3">{t("adminPayoutHistory.table.headers.creditor")}</th>
                    <th className="px-6 py-3">{t("adminPayoutHistory.table.headers.reference")}</th>
                    <th className="px-6 py-3">{t("adminPayoutHistory.table.headers.amountExcludingVat")}</th>
                    <th className="px-6 py-3">{t("adminPayoutHistory.table.headers.vat")}</th>
                    <th className="px-6 py-3">{t("adminPayoutHistory.table.headers.amountIncludingVat")}</th>
                    <th className="px-6 py-3">{t("adminPayoutHistory.table.headers.status")}</th>
                    <th className="px-6 py-3 text-right">{t("adminPayoutHistory.table.headers.actions")}</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {paginatedExpenses.map((expense) => {
                    const isExpanded = expandedRows.has(expense.id);
                    return (
                      <>
                        <tr
                          key={expense.id}
                          className="border-b border-primary/10 hover:bg-primary/5"
                        >
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleRowExpansion(expense.id)}
                              className="p-1 hover:bg-primary/10 rounded transition-all"
                            >
                              {isExpanded ? (
                                <ChevronUp size={16} className="text-gray-400" />
                              ) : (
                                <ChevronDown size={16} className="text-gray-400" />
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {formatDate(expense.date)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User className="text-gray-400" size={16} />
                              <div>
                                <p className="font-medium">{expense.creditor.name}</p>
                                <p className="text-xs text-gray-500">
                                  SSN: {expense.creditor.ssn}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-primary">
                              {expense.reference}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {formatCurrency(expense.amountExcludingVat)}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {formatCurrency(expense.amountVat)}
                          </td>
                          <td className="px-6 py-4 font-semibold text-green">
                            {formatCurrency(expense.amountIncludingVat)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${statusChipStyles[expense.status]}`}
                            >
                              {statusIcon[expense.status]}
                              {t(`adminPayoutHistory.status.${expense.status}`)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewExpense(expense)}
                                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                title={t("adminPayoutHistory.table.actions.view")}
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-background/50">
                            <td colSpan={9} className="px-6 py-4">
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-400">
                                      {t("adminPayoutHistory.details.dueDate")}
                                    </p>
                                    <p className="text-white">
                                      {formatDate(expense.dueDate)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400">
                                      {t("adminPayoutHistory.details.paidDate")}
                                    </p>
                                    <p className="text-white">
                                      {formatDate(expense.paidDate)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400">
                                      {t("adminPayoutHistory.details.paymentType")}
                                    </p>
                                    <p className="text-white">
                                      {expense.paymentType || "-"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400">
                                      {t("adminPayoutHistory.details.deductible")}
                                    </p>
                                    <p className="text-white">
                                      {expense.deductible
                                        ? t("common.yes")
                                        : t("common.no")}
                                    </p>
                                  </div>
                                </div>
                                {expense.comments && (
                                  <div>
                                    <p className="text-gray-400 text-sm mb-1">
                                      {t("adminPayoutHistory.details.comments")}
                                    </p>
                                    <p className="text-white text-sm bg-background border border-primary/30 rounded-lg p-3">
                                      {expense.comments}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-gray-400 text-sm mb-2">
                                    {t("adminPayoutHistory.details.lines")}
                                  </p>
                                  <div className="space-y-2">
                                    {expense.lines.map((line) => (
                                      <div
                                        key={line.id}
                                        className="flex items-center justify-between p-3 bg-background border border-primary/30 rounded-lg"
                                      >
                                        <div className="flex-1">
                                          <p className="text-white font-medium">
                                            {line.description}
                                          </p>
                                          <p className="text-gray-400 text-xs">
                                            {t("adminPayoutHistory.details.quantity")}:{" "}
                                            {line.quantity} ×{" "}
                                            {formatCurrency(line.unitPriceExcludingVat)}{" "}
                                            ({line.vatPercentage}% VAT)
                                            {line.discountPercentage &&
                                              ` - ${line.discountPercentage}% ${t("adminPayoutHistory.details.discount")}`}
                                          </p>
                                        </div>
                                        <p className="text-white font-semibold">
                                          {formatCurrency(line.unitPriceIncludingVat)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
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

      {/* Expense Details Modal */}
      <Modal
        isOpen={!!selectedExpense}
        onClose={handleCloseModal}
        title={
          selectedExpense
            ? t("adminPayoutHistory.modal.title", {
                reference: selectedExpense.reference,
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
              {t("adminPayoutHistory.modal.close")}
            </button>
            {selectedExpense && (
              <button
                onClick={() => {
                  // TODO: Implement export
                  console.log("Export expense:", selectedExpense.id);
                }}
                className="px-6 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all"
              >
                <Download size={16} className="inline mr-2" />
                {t("adminPayoutHistory.modal.export")}
              </button>
            )}
          </div>
        }
      >
        {selectedExpense && (
          <div className="space-y-6">
            {/* Expense Header */}
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-primary/30">
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  {t("adminPayoutHistory.modal.creditor")}
                </p>
                <p className="text-white font-semibold">
                  {selectedExpense.creditor.name}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  SSN: {selectedExpense.creditor.ssn}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">
                  {t("adminPayoutHistory.modal.status")}
                </p>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${statusChipStyles[selectedExpense.status]}`}
                >
                  {statusIcon[selectedExpense.status]}
                  {t(`adminPayoutHistory.status.${selectedExpense.status}`)}
                </span>
              </div>
            </div>

            {/* Expense Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  {t("adminPayoutHistory.modal.date")}
                </p>
                <p className="text-white">{formatDate(selectedExpense.date)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  {t("adminPayoutHistory.modal.dueDate")}
                </p>
                <p className="text-white">
                  {formatDate(selectedExpense.dueDate)}
                </p>
              </div>
              {selectedExpense.paidDate && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    {t("adminPayoutHistory.modal.paidDate")}
                  </p>
                  <p className="text-white">
                    {formatDateTime(selectedExpense.paidDate)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  {t("adminPayoutHistory.modal.paymentType")}
                </p>
                <p className="text-white">
                  {selectedExpense.paymentType || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  {t("adminPayoutHistory.modal.deductible")}
                </p>
                <p className="text-white">
                  {selectedExpense.deductible
                    ? t("common.yes")
                    : t("common.no")}
                </p>
              </div>
              {selectedExpense.voucher && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    {t("adminPayoutHistory.modal.voucher")}
                  </p>
                  <p className="text-white">{selectedExpense.voucher}</p>
                </div>
              )}
            </div>

            {/* Expense Lines */}
            <div>
              <h4 className="text-white font-semibold mb-4">
                {t("adminPayoutHistory.modal.lines")}
              </h4>
              <div className="space-y-3">
                {selectedExpense.lines.map((line) => (
                  <div
                    key={line.id}
                    className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{line.description}</p>
                      <p className="text-gray-400 text-sm">
                        {t("adminPayoutHistory.modal.quantity")}: {line.quantity} ×{" "}
                        {formatCurrency(line.unitPriceExcludingVat)} ({line.vatPercentage}% VAT)
                        {line.discountPercentage &&
                          ` - ${line.discountPercentage}% ${t("adminPayoutHistory.modal.discount")}`}
                      </p>
                    </div>
                    <p className="text-white font-semibold">
                      {formatCurrency(line.unitPriceIncludingVat)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Totals */}
            <div className="pt-4 border-t border-primary/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">
                  {t("adminPayoutHistory.modal.amountExcludingVat")}
                </span>
                <span className="text-white font-semibold">
                  {formatCurrency(selectedExpense.amountExcludingVat)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">
                  {t("adminPayoutHistory.modal.vat")}
                </span>
                <span className="text-white font-semibold">
                  {formatCurrency(selectedExpense.amountVat)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-primary/30">
                <span className="text-white text-lg font-bold">
                  {t("adminPayoutHistory.modal.total")}
                </span>
                <span className="text-white text-lg font-bold">
                  {formatCurrency(selectedExpense.amountIncludingVat)}
                </span>
              </div>
            </div>

            {/* Comments */}
            {selectedExpense.comments && (
              <div className="pt-4 border-t border-primary/30">
                <p className="text-gray-400 text-sm mb-2">
                  {t("adminPayoutHistory.modal.comments")}
                </p>
                <p className="text-white bg-background/60 border border-primary/20 rounded-xl px-4 py-3">
                  {selectedExpense.comments}
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <Info size={18} className="text-primary mt-0.5" />
              <div className="text-xs text-gray-400">
                <p className="mb-1">
                  <strong>{t("adminPayoutHistory.modal.created")}:</strong>{" "}
                  {formatDateTime(selectedExpense.created)}
                </p>
                {selectedExpense.source && (
                  <p>
                    <strong>{t("adminPayoutHistory.modal.source")}:</strong>{" "}
                    {selectedExpense.source}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

