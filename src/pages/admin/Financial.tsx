import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Eye,
  Wallet,
  CreditCard,
  ArrowLeft,
  Building2,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";

interface FinancialTransaction {
  id: string;
  date: string;
  type: "revenue" | "commission" | "refund" | "payout";
  description: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  company?: string;
  offerType?: string;
  reference: string;
}

interface CommissionBreakdown {
  offerType: string;
  baseFee: number;
  transactions: number;
  totalCommission: number;
  percentage: number;
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
  commission: number;
  netIncome: number;
  transactions: number;
  growth: string;
  growthType: "positive" | "negative";
}

export default function AdminFinancialPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [selectedTab, setSelectedTab] = useState<"overview" | "transactions" | "commissions" | "payouts">("overview");

  // Mock financial data
  const summaryStats = [
    {
      name: "Total Revenue",
      value: "4,587,234 kr.",
      change: "+18.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      borderColor: "border-green",
      iconBg: "bg-green/10",
      iconColor: "text-green",
    },
    {
      name: "Platform Commission",
      value: "458,723 kr.",
      change: "+18.2%",
      changeType: "positive" as const,
      icon: Wallet,
      borderColor: "border-primary",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      name: "Net Income",
      value: "4,128,511 kr.",
      change: "+18.7%",
      changeType: "positive" as const,
      icon: TrendingUp,
      borderColor: "border-blue-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      name: "Total Transactions",
      value: "1,234",
      change: "+23",
      changeType: "positive" as const,
      icon: FileText,
      borderColor: "border-purple-500",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
  ];

  const monthlyRevenue: MonthlyRevenue[] = [
    {
      month: "Jul 2024",
      revenue: 350000,
      commission: 35000,
      netIncome: 315000,
      transactions: 89,
      growth: "+12.5%",
      growthType: "positive",
    },
    {
      month: "Aug 2024",
      revenue: 380000,
      commission: 38000,
      netIncome: 342000,
      transactions: 95,
      growth: "+8.6%",
      growthType: "positive",
    },
    {
      month: "Sep 2024",
      revenue: 420000,
      commission: 42000,
      netIncome: 378000,
      transactions: 105,
      growth: "+10.5%",
      growthType: "positive",
    },
    {
      month: "Oct 2024",
      revenue: 450000,
      commission: 45000,
      netIncome: 405000,
      transactions: 112,
      growth: "+7.1%",
      growthType: "positive",
    },
    {
      month: "Nov 2024",
      revenue: 480000,
      commission: 48000,
      netIncome: 432000,
      transactions: 120,
      growth: "+6.7%",
      growthType: "positive",
    },
    {
      month: "Dec 2024",
      revenue: 520000,
      commission: 52000,
      netIncome: 468000,
      transactions: 130,
      growth: "+8.3%",
      growthType: "positive",
    },
    {
      month: "Jan 2025",
      revenue: 587234,
      commission: 58723,
      netIncome: 528511,
      transactions: 147,
      growth: "+12.9%",
      growthType: "positive",
    },
  ];

  const commissionBreakdown: CommissionBreakdown[] = [
    {
      offerType: "Active Offer",
      baseFee: 1,
      transactions: 567,
      totalCommission: 17577,
      percentage: 38.3,
    },
    {
      offerType: "Weekday Offer",
      baseFee: 4,
      transactions: 423,
      totalCommission: 1692,
      percentage: 36.9,
    },
    {
      offerType: "Happy Hour",
      baseFee: 10,
      transactions: 198,
      totalCommission: 5940,
      percentage: 12.9,
    },
    {
      offerType: "Gift Card",
      baseFee: 5,
      transactions: 146,
      totalCommission: 2920,
      percentage: 6.4,
    },
  ];

  const recentTransactions: FinancialTransaction[] = [
    {
      id: "1",
      date: "2025-01-20",
      type: "commission",
      description: "Active Offer commission",
      amount: 45,
      status: "completed",
      company: "Blue Lagoon Spa",
      offerType: "Active Offer",
      reference: "COM-20250120-001",
    },
    {
      id: "2",
      date: "2025-01-20",
      type: "revenue",
      description: "Gift Card sale",
      amount: 8500,
      status: "completed",
      company: "Hotel Aurora",
      offerType: "Gift Card",
      reference: "TXN-20250120-045",
    },
    {
      id: "3",
      date: "2025-01-19",
      type: "commission",
      description: "Weekday Offer commission",
      amount: 16,
      status: "completed",
      company: "Restaurant Downtown",
      offerType: "Weekday Offer",
      reference: "COM-20250119-012",
    },
    {
      id: "4",
      date: "2025-01-19",
      type: "commission",
      description: "Happy Hour commission",
      amount: 10,
      status: "completed",
      company: "Bar Central",
      offerType: "Happy Hour",
      reference: "COM-20250119-008",
    },
    {
      id: "5",
      date: "2025-01-18",
      type: "refund",
      description: "Gift Card refund",
      amount: 5000,
      status: "completed",
      company: "Nordic Wellness",
      offerType: "Gift Card",
      reference: "REF-20250118-003",
    },
    {
      id: "6",
      date: "2025-01-18",
      type: "commission",
      description: "Active Offer commission",
      amount: 23,
      status: "pending",
      company: "Shopping Mall Iceland",
      offerType: "Active Offer",
      reference: "COM-20250118-034",
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "revenue":
        return DollarSign;
      case "commission":
        return Wallet;
      case "refund":
        return TrendingDown;
      case "payout":
        return CreditCard;
      default:
        return FileText;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "revenue":
        return "text-green";
      case "commission":
        return "text-primary";
      case "refund":
        return "text-red-500";
      case "payout":
        return "text-blue-500";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "failed":
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green";
      case "pending":
        return "text-yellow";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Financial Overview</h1>
            <p className="text-gray-400 text-sm">Monitor platform revenue, commissions, and transactions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className={`bg-card-background border ${stat.borderColor} rounded-2xl p-6`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={stat.iconColor} size={20} />
                </div>
                <span className={`text-xs font-semibold ${
                  stat.changeType === "positive" ? "text-green" : "text-red-500"
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.name}</h3>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-card-background border border-primary rounded-2xl p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "transactions", label: "Transactions", icon: FileText },
            { id: "commissions", label: "Commissions", icon: Wallet },
            { id: "payouts", label: "Payouts", icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                selectedTab === tab.id
                  ? "bg-primary text-dark font-semibold"
                  : "text-gray-400 hover:text-white hover:bg-primary/10"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === "overview" && (
        <>
          {/* Monthly Revenue Table */}
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Monthly Revenue Breakdown</h2>
              <Filter size={20} className="text-gray-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/30">
                    <th className="text-left text-gray-400 text-sm py-3 px-4">Month</th>
                    <th className="text-right text-gray-400 text-sm py-3 px-4">Revenue</th>
                    <th className="text-right text-gray-400 text-sm py-3 px-4">Commission</th>
                    <th className="text-right text-gray-400 text-sm py-3 px-4">Net Income</th>
                    <th className="text-center text-gray-400 text-sm py-3 px-4">Transactions</th>
                    <th className="text-right text-gray-400 text-sm py-3 px-4">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyRevenue.map((month, index) => (
                    <tr key={index} className="border-b border-primary/10 hover:bg-primary/5 transition-all">
                      <td className="text-white font-medium py-3 px-4">{month.month}</td>
                      <td className="text-white text-right py-3 px-4">{month.revenue.toLocaleString()} kr.</td>
                      <td className="text-primary text-right py-3 px-4">{month.commission.toLocaleString()} kr.</td>
                      <td className="text-green text-right py-3 px-4 font-semibold">{month.netIncome.toLocaleString()} kr.</td>
                      <td className="text-gray-300 text-center py-3 px-4">{month.transactions}</td>
                      <td className={`text-right py-3 px-4 font-semibold ${
                        month.growthType === "positive" ? "text-green" : "text-red-500"
                      }`}>
                        {month.growth}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commission Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card-background border border-primary rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Commission by Offer Type</h2>
              <div className="space-y-4">
                {commissionBreakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{item.offerType}</span>
                      <span className="text-primary font-bold">{item.totalCommission.toLocaleString()} kr.</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-2 bg-primary/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-sm">{item.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{item.transactions} transactions</span>
                      <span>{item.baseFee} kr. per {item.offerType.includes("Gift Card") ? "sale" : item.offerType.includes("Happy Hour") ? "month" : item.offerType.includes("Weekday") ? "week" : "day"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card-background border border-primary rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-4 bg-primary/10 border border-primary rounded-lg hover:bg-primary/20 transition-all text-left">
                  <Eye className="text-primary" size={20} />
                  <div>
                    <p className="text-white font-semibold">View Financial Report</p>
                    <p className="text-gray-400 text-sm">Generate detailed PDF report</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-4 bg-primary/10 border border-primary rounded-lg hover:bg-primary/20 transition-all text-left">
                  <Download className="text-primary" size={20} />
                  <div>
                    <p className="text-white font-semibold">Export Data</p>
                    <p className="text-gray-400 text-sm">Download CSV/Excel file</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-4 bg-primary/10 border border-primary rounded-lg hover:bg-primary/20 transition-all text-left">
                  <Building2 className="text-primary" size={20} />
                  <div>
                    <p className="text-white font-semibold">Company Reports</p>
                    <p className="text-gray-400 text-sm">View per-company breakdown</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedTab === "transactions" && (
        <div className="bg-card-background border border-primary rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <Download size={20} className="text-gray-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/30">
                  <th className="text-left text-gray-400 text-sm py-3 px-4">Date</th>
                  <th className="text-left text-gray-400 text-sm py-3 px-4">Type</th>
                  <th className="text-left text-gray-400 text-sm py-3 px-4">Description</th>
                  <th className="text-left text-gray-400 text-sm py-3 px-4">Company</th>
                  <th className="text-right text-gray-400 text-sm py-3 px-4">Amount</th>
                  <th className="text-center text-gray-400 text-sm py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => {
                  const Icon = getTransactionIcon(transaction.type);
                  const StatusIcon = getStatusIcon(transaction.status);
                  return (
                    <tr key={transaction.id} className="border-b border-primary/10 hover:bg-primary/5 transition-all">
                      <td className="text-white py-3 px-4">{new Date(transaction.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Icon className={getTransactionColor(transaction.type)} size={16} />
                          <span className="text-white capitalize">{transaction.type}</span>
                        </div>
                      </td>
                      <td className="text-gray-300 py-3 px-4">{transaction.description}</td>
                      <td className="text-gray-300 py-3 px-4">{transaction.company}</td>
                      <td className={`text-right py-3 px-4 font-bold ${getTransactionColor(transaction.type)}`}>
                        {transaction.amount.toLocaleString()} kr.
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <StatusIcon className={getStatusColor(transaction.status)} size={16} />
                          <span className={`text-sm capitalize ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTab === "commissions" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Commission Structure</h2>
            <div className="space-y-4">
              {commissionBreakdown.map((item, index) => (
                <div key={index} className="border border-primary/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-semibold">{item.offerType}</span>
                    <span className="text-primary font-bold">{item.totalCommission.toLocaleString()} kr.</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 h-2 bg-primary/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-sm">{item.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Base Fee</p>
                      <p className="text-white font-medium">{item.baseFee} kr.</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Transactions</p>
                      <p className="text-white font-medium">{item.transactions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Commission Summary</h2>
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Commission Earned</p>
                <p className="text-primary text-3xl font-bold">{commissionBreakdown.reduce((sum, item) => sum + item.totalCommission, 0).toLocaleString()} kr.</p>
              </div>
              <div className="h-px bg-primary/30"></div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Average per Transaction</p>
                <p className="text-white text-xl font-bold">
                  {(commissionBreakdown.reduce((sum, item) => sum + item.totalCommission, 0) / commissionBreakdown.reduce((sum, item) => sum + item.transactions, 0)).toFixed(2)} kr.
                </p>
              </div>
              <div className="h-px bg-primary/30"></div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Transactions</p>
                <p className="text-white text-xl font-bold">{commissionBreakdown.reduce((sum, item) => sum + item.transactions, 0)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === "payouts" && (
        <div className="bg-card-background border border-primary rounded-2xl p-6">
          <div className="text-center py-12">
            <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">Payout Management</h3>
            <p className="text-gray-400">Payout functionality will be available soon</p>
          </div>
        </div>
      )}
    </div>
  );
}

