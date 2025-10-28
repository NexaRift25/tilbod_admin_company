import { useState } from "react";
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

interface Sale {
  id: string;
  offerTitle: string;
  offerType: string;
  customerName: string;
  customerEmail: string;
  purchaseDate: string;
  amount: number;
  status: "completed" | "pending" | "refunded";
  paymentMethod: string;
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
      paymentMethod: "Credit Card",
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
      paymentMethod: "Bank Transfer",
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
      paymentMethod: "Credit Card",
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
        return <CheckCircle className="text-green-500" size={16} />;
      case "pending":
        return <AlertCircle className="text-yellow-500" size={16} />;
      case "refunded":
        return <AlertCircle className="text-red-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-400" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "refunded":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
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
              Sales & Payments
            </h1>
            <p className="text-gray-400 text-sm">
              Track your sales, payments, and financial performance
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
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Sales</p>
              <p className="text-white text-2xl font-bold">{stats.totalSales}</p>
            </div>
            <ShoppingBag className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenue</p>
              <p className="text-white text-2xl font-bold">{stats.totalRevenue.toLocaleString()} kr.</p>
            </div>
            <DollarSign className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-yellow-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-white text-2xl font-bold">{stats.pendingPayments}</p>
            </div>
            <AlertCircle className="text-yellow-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-white text-2xl font-bold">{stats.completedPayments}</p>
            </div>
            <CheckCircle className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-purple-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Order</p>
              <p className="text-white text-2xl font-bold">{stats.averageOrderValue.toLocaleString()} kr.</p>
            </div>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
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
                placeholder="Search sales..."
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
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Sales</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-primary/50">
                <th className="pb-3">Offer</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Payment Method</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b border-primary/10 hover:bg-primary/5">
                  <td className="py-4">
                    <div>
                      <p className="font-medium">{sale.offerTitle}</p>
                      <p className="text-sm text-gray-400 capitalize">{sale.offerType.replace("_", " ")}</p>
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
                      <span className="capitalize">{sale.status}</span>
                    </span>
                  </td>
                  <td className="py-4">
                    <p className="text-sm">{sale.paymentMethod}</p>
                  </td>
                  <td className="py-4">
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payments Section */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Payment History</h3>

        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background rounded-lg border border-primary/50 hover:border-primary transition-all gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Receipt className="text-primary" size={20} />
                  <h4 className="font-bold text-white">{payment.period}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Total Sales</p>
                    <p className="text-white font-medium">{payment.totalSales.toLocaleString()} kr.</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Commission</p>
                    <p className="text-white font-medium">{payment.commission.toLocaleString()} kr.</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Net Amount</p>
                    <p className="text-white font-medium">{payment.netAmount.toLocaleString()} kr.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-sm">
                  <p className="text-gray-400">Due: {payment.dueDate}</p>
                  {payment.paidDate && (
                    <p className="text-green-500">Paid: {payment.paidDate}</p>
                  )}
                </div>
                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Info */}
      <div className="bg-blue-500/10 border border-blue-500 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-blue-500 font-bold mb-1">
              Commission Structure
            </h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• Active Offers: 1 kr. per day</p>
              <p>• Weekdays Offers: 4 kr. per week</p>
              <p>• Happy Hour Offers: 10 kr. per month</p>
              <p>• Gift Cards: Percentage of sale amount</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

