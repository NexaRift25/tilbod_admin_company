import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  FileText,
  DollarSign,
  ShoppingCart,
  Calendar,
  ArrowLeft,
  Download,
  Filter,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [chartType, setChartType] = useState<"revenue" | "companies" | "users" | "offers">("revenue");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [metricFilter, setMetricFilter] = useState<string>("all");

  // Mock analytics data
  const overviewStats = [
    {
      name: "Total Revenue",
      value: "2,456,789 kr.",
      change: "+18.5%",
      changeType: "positive",
      icon: DollarSign,
    },
    {
      name: "Active Companies",
      value: "156",
      change: "+12",
      changeType: "positive",
      icon: Building2,
    },
    {
      name: "Total Users",
      value: "1,234",
      change: "+8.2%",
      changeType: "positive",
      icon: Users,
    },
    {
      name: "Active Offers",
      value: "2,847",
      change: "+23",
      changeType: "positive",
      icon: FileText,
    },
  ];

  const platformMetrics = [
    {
      name: "Page Views",
      value: "45,678",
      change: "+12.3%",
      changeType: "positive",
    },
    {
      name: "Offer Views",
      value: "23,456",
      change: "+8.7%",
      changeType: "positive",
    },
    {
      name: "Conversions",
      value: "1,234",
      change: "+15.2%",
      changeType: "positive",
    },
    {
      name: "Conversion Rate",
      value: "5.26%",
      change: "+0.8%",
      changeType: "positive",
    },
  ];

  // Chart data
  const revenueData = [
    { month: "Jan", revenue: 180000, companies: 12 },
    { month: "Feb", revenue: 220000, companies: 15 },
    { month: "Mar", revenue: 195000, companies: 13 },
    { month: "Apr", revenue: 280000, companies: 18 },
    { month: "May", revenue: 320000, companies: 22 },
    { month: "Jun", revenue: 290000, companies: 19 },
    { month: "Jul", revenue: 350000, companies: 25 },
    { month: "Aug", revenue: 380000, companies: 28 },
    { month: "Sep", revenue: 420000, companies: 32 },
    { month: "Oct", revenue: 450000, companies: 35 },
    { month: "Nov", revenue: 480000, companies: 38 },
    { month: "Dec", revenue: 520000, companies: 42 },
  ];

  const companyRegistrations = [
    { category: "Food & Dining", count: 45, percentage: 28.8 },
    { category: "Hotels & Accommodation", count: 32, percentage: 20.5 },
    { category: "Wellness & Spa", count: 28, percentage: 17.9 },
    { category: "Activities & Entertainment", count: 25, percentage: 16.0 },
    { category: "Shopping & Retail", count: 15, percentage: 9.6 },
    { category: "Beauty & Personal Care", count: 11, percentage: 7.1 },
  ];

  const offerPerformance = [
    { type: "Active Offers", count: 1247, revenue: 1200000 },
    { type: "Weekday Specials", count: 856, revenue: 680000 },
    { type: "Happy Hour", count: 423, revenue: 340000 },
    { type: "Gift Cards", count: 321, revenue: 236789 },
  ];

  const userGrowthData = [
    { month: "Jan", users: 850, newUsers: 45 },
    { month: "Feb", users: 920, newUsers: 70 },
    { month: "Mar", users: 980, newUsers: 60 },
    { month: "Apr", users: 1050, newUsers: 70 },
    { month: "May", users: 1120, newUsers: 70 },
    { month: "Jun", users: 1180, newUsers: 60 },
    { month: "Jul", users: 1234, newUsers: 54 },
  ];

  const conversionFunnel = [
    { stage: "Visitors", count: 45678, percentage: 100 },
    { stage: "Offer Views", count: 23456, percentage: 51.4 },
    { stage: "Interested", count: 12345, percentage: 27.0 },
    { stage: "Purchases", count: 1234, percentage: 2.7 },
  ];

  const topCompanies = [
    {
      name: "Blue Lagoon Spa",
      revenue: "456,789 kr.",
      offers: 12,
      conversion: "8.5%",
      growth: "+22%",
    },
    {
      name: "Hotel Aurora",
      revenue: "389,456 kr.",
      offers: 8,
      conversion: "7.2%",
      growth: "+18%",
    },
    {
      name: "Restaurant Nordic",
      revenue: "234,567 kr.",
      offers: 6,
      conversion: "6.8%",
      growth: "+15%",
    },
    {
      name: "Adventure Tours",
      revenue: "198,234 kr.",
      offers: 4,
      conversion: "5.9%",
      growth: "+12%",
    },
  ];

  const recentActivity = [
    {
      action: "New Company Registration",
      company: "Spa Retreat Iceland",
      timestamp: "2 hours ago",
      type: "registration",
    },
    {
      action: "Offer Approved",
      offer: "Weekend Package",
      company: "Hotel Aurora",
      timestamp: "4 hours ago",
      type: "approval",
    },
    {
      action: "High Revenue Alert",
      company: "Blue Lagoon Spa",
      amount: "50,000 kr.",
      timestamp: "6 hours ago",
      type: "revenue",
    },
    {
      action: "User Suspended",
      user: "Mike Johnson",
      reason: "Policy Violation",
      timestamp: "8 hours ago",
      type: "moderation",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "registration":
        return <Building2 className="text-blue-500" size={16} />;
      case "approval":
        return <FileText className="text-green" size={16} />;
      case "revenue":
        return <DollarSign className="text-yellow" size={16} />;
      case "moderation":
        return <Users className="text-red-500" size={16} />;
      default:
        return <BarChart3 className="text-gray-400" size={16} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "registration":
        return "bg-blue-500/10";
      case "approval":
        return "bg-green/10";
      case "revenue":
        return "bg-yellow/10";
      case "moderation":
        return "bg-red-500/10";
      default:
        return "bg-gray-500/10";
    }
  };

  // Chart components
  const RevenueChart = () => {
    const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
    
    return (
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Revenue Trend</h3>
          <div className="flex items-center gap-2">
            <DollarSign className="text-green" size={20} />
            <span className="text-sm text-gray-400">Last 12 months</span>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between gap-2">
          {revenueData.map((data, index) => (
            <div key={data.month} className="flex flex-col items-center flex-1">
              <div className="relative w-full">
                <div
                  className="bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-500 hover:from-primary/80 hover:to-primary/40"
                  style={{
                    height: `${(data.revenue / maxRevenue) * 200}px`,
                    animationDelay: `${index * 100}ms`
                  }}
                />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-medium">
                  {(data.revenue / 1000).toFixed(0)}k
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400 font-medium">
                {data.month}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">Total Revenue: 2,456,789 kr.</span>
          <span className="text-green font-semibold">+18.5% vs last year</span>
        </div>
      </div>
    );
  };

  const CompanyCategoryChart = () => (
    <div className="bg-card-background border border-primary rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Companies by Category</h3>
        <Building2 className="text-primary" size={20} />
      </div>
      
      <div className="space-y-4">
        {companyRegistrations.map((category, index) => (
          <div key={category.category} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium text-sm">{category.category}</span>
              <span className="text-gray-400 text-sm">{category.count} companies</span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${category.percentage}%`,
                  animationDelay: `${index * 200}ms`
                }}
              />
            </div>
            <div className="text-right text-xs text-gray-400">{category.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );

  const OfferPerformanceChart = () => (
    <div className="bg-card-background border border-primary rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Offer Performance</h3>
        <FileText className="text-primary" size={20} />
      </div>
      
      <div className="space-y-4">
        {offerPerformance.map((offer, index) => (
          <div key={offer.type} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium text-sm">{offer.type}</span>
              <div className="text-right">
                <div className="text-gray-400 text-sm">{offer.count} offers</div>
                <div className="text-primary text-sm font-semibold">{offer.revenue.toLocaleString()} kr.</div>
              </div>
            </div>
            <div className="w-full bg-background rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                style={{
                  width: `${(offer.revenue / Math.max(...offerPerformance.map(o => o.revenue))) * 100}%`,
                  animationDelay: `${index * 150}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UserGrowthChart = () => {
    const maxUsers = Math.max(...userGrowthData.map(d => d.users));
    
    return (
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">User Growth</h3>
          <Users className="text-primary" size={20} />
        </div>
        
        <div className="h-48 flex items-end justify-between gap-3">
          {userGrowthData.map((data, index) => (
            <div key={data.month} className="flex flex-col items-center flex-1">
              <div className="relative w-full flex flex-col items-center">
                <div
                  className="bg-gradient-to-t from-green-500 to-green-500/60 rounded-t-lg w-full transition-all duration-500 hover:from-green-500/80 hover:to-green-500/40"
                  style={{
                    height: `${(data.users / maxUsers) * 150}px`,
                    animationDelay: `${index * 100}ms`
                  }}
                />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-medium">
                  {data.users}
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400 font-medium">
                {data.month}
              </div>
              <div className="text-xs text-green font-semibold">
                +{data.newUsers}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">Total Users: 1,234</span>
          <span className="text-green font-semibold">+8.2% growth</span>
        </div>
      </div>
    );
  };

  const ConversionFunnelChart = () => (
    <div className="bg-card-background border border-primary rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Conversion Funnel</h3>
        <ShoppingCart className="text-primary" size={20} />
      </div>
      
      <div className="space-y-4">
        {conversionFunnel.map((stage, index) => (
          <div key={stage.stage} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium text-sm">{stage.stage}</span>
              <div className="text-right">
                <span className="text-gray-400 text-sm">{stage.count.toLocaleString()}</span>
                <span className="text-primary text-sm font-semibold ml-2">{stage.percentage}%</span>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-background rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-4 rounded-full transition-all duration-1000"
                  style={{
                    width: `${stage.percentage}%`,
                    animationDelay: `${index * 200}ms`
                  }}
                />
              </div>
              {index < conversionFunnel.length - 1 && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                  ↓ {((stage.count - conversionFunnel[index + 1].count) / stage.count * 100).toFixed(1)}% drop-off
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-primary/10 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">Overall Conversion Rate</span>
          <span className="text-primary text-lg font-bold">2.7%</span>
        </div>
        <div className="text-sm text-gray-400 mt-1">
          From visitors to purchases
        </div>
      </div>
    </div>
  );

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
              Platform Analytics
            </h1>
            <p className="text-gray-400 text-sm">
              Comprehensive platform performance metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6 hover:border-primary/80 transition-all"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="text-primary" size={20} />
                </div>
                <span className={`text-xs sm:text-sm font-semibold ${
                  stat.changeType === "positive" ? "text-green" : "text-red-500"
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-400 text-xs sm:text-sm mb-1">{stat.name}</h3>
              <p className="text-white text-xl sm:text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Form for Charts */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Filter className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-white">Chart Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as "revenue" | "companies" | "users" | "offers")}
              className="w-full px-4 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="revenue">Revenue</option>
              <option value="companies">Companies</option>
              <option value="users">Users</option>
              <option value="offers">Offers</option>
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Metric</label>
            <select
              value={metricFilter}
              onChange={(e) => setMetricFilter(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">All Metrics</option>
              <option value="revenue">Revenue Only</option>
              <option value="count">Count Only</option>
              <option value="growth">Growth Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtered Chart Data */}
      {(() => {
        // Filter revenue data based on date range
        let filteredRevenueData = revenueData;
        if (dateFrom && dateTo) {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const fromIndex = months.findIndex(m => m === dateFrom.substring(5, 8));
          const toIndex = months.findIndex(m => m === dateTo.substring(5, 8));
          if (fromIndex >= 0 && toIndex >= 0) {
            filteredRevenueData = revenueData.slice(fromIndex, toIndex + 1);
          }
        }

        const revenueChartData = {
          labels: filteredRevenueData.map(d => d.month),
          datasets: [
            {
              label: 'Revenue (kr.)',
              data: filteredRevenueData.map(d => d.revenue),
              backgroundColor: 'rgba(251, 146, 60, 0.8)',
              borderColor: 'rgba(251, 146, 60, 1)',
              borderWidth: 2,
            },
            {
              label: 'Companies',
              data: filteredRevenueData.map(d => d.companies),
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 2,
            },
          ],
        };

        const userGrowthChartData = {
          labels: userGrowthData.map(d => d.month),
          datasets: [
            {
              label: 'Total Users',
              data: userGrowthData.map(d => d.users),
              borderColor: 'rgba(34, 197, 94, 1)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderWidth: 2,
              tension: 0.4,
            },
            {
              label: 'New Users',
              data: userGrowthData.map(d => d.newUsers),
              borderColor: 'rgba(59, 130, 246, 1)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 2,
              tension: 0.4,
            },
          ],
        };

        const companyCategoryChartData = {
          labels: companyRegistrations.map(d => d.category),
          datasets: [
            {
              label: 'Companies',
              data: companyRegistrations.map(d => d.count),
              backgroundColor: [
                'rgba(251, 146, 60, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(20, 184, 166, 0.8)',
              ],
              borderWidth: 2,
              borderColor: 'rgba(17, 24, 39, 1)',
            },
          ],
        };

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {chartType === "revenue" && (
              <div className="bg-card-background border border-primary rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Revenue Trend (Filtered)</h3>
                <div className="h-[300px]">
                  <Bar
                    data={revenueChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          labels: { color: '#ffffff' },
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: '#ffffff',
                          bodyColor: '#ffffff',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { color: '#9ca3af' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        },
                        x: {
                          ticks: { color: '#9ca3af' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
            {chartType === "users" && (
              <div className="bg-card-background border border-primary rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">User Growth (Filtered)</h3>
                <div className="h-[300px]">
                  <Line
                    data={userGrowthChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          labels: { color: '#ffffff' },
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: '#ffffff',
                          bodyColor: '#ffffff',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { color: '#9ca3af' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        },
                        x: {
                          ticks: { color: '#9ca3af' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
            {chartType === "companies" && (
              <div className="bg-card-background border border-primary rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Companies by Category (Filtered)</h3>
                <div className="h-[300px]">
                  <Doughnut
                    data={companyCategoryChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                          labels: { color: '#ffffff', padding: 15 },
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: '#ffffff',
                          bodyColor: '#ffffff',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <UserGrowthChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompanyCategoryChart />
        <OfferPerformanceChart />
      </div>

      <ConversionFunnelChart />

      {/* Platform Metrics */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">Platform Metrics</h2>
          <div className="flex items-center gap-2">
            <BarChart3 className="text-primary" size={20} />
            <span className="text-sm text-gray-400">Last {timeRange}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {platformMetrics.map((metric) => (
            <div key={metric.name} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`text-sm font-semibold ${
                  metric.changeType === "positive" ? "text-green" : "text-red-500"
                }`}>
                  {metric.changeType === "positive" ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                </span>
                <span className={`text-xs font-semibold ${
                  metric.changeType === "positive" ? "text-green" : "text-red-500"
                }`}>
                  {metric.change}
                </span>
              </div>
              <p className="text-white text-2xl font-bold mb-1">{metric.value}</p>
              <p className="text-gray-400 text-sm">{metric.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Companies */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">Top Performing Companies</h2>
          <Link
            to="/admin/companies"
            className="text-primary hover:text-primary/80 font-medium text-sm"
          >
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {topCompanies.map((company, index) => (
            <div
              key={company.name}
              className="flex items-center justify-between p-4 bg-background rounded-lg border border-primary/50 hover:border-primary transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">#{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{company.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{company.offers} offers</span>
                    <span>•</span>
                    <span>{company.conversion} conversion</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{company.revenue}</p>
                <p className="text-green text-sm font-semibold">{company.growth}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">Recent Activity</h2>
          <Calendar className="text-primary" size={20} />
        </div>

        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 bg-background rounded-lg border border-primary/50 hover:border-primary transition-all"
            >
              <div className={`w-8 h-8 ${getActivityColor(activity.type)} rounded-lg flex items-center justify-center`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">
                  {activity.action}
                  {activity.company && (
                    <span className="text-gray-400"> • {activity.company}</span>
                  )}
                  {activity.offer && (
                    <span className="text-gray-400"> • {activity.offer}</span>
                  )}
                  {activity.user && (
                    <span className="text-gray-400"> • {activity.user}</span>
                  )}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{activity.timestamp}</span>
                  {activity.amount && (
                    <>
                      <span>•</span>
                      <span className="text-yellow font-semibold">{activity.amount}</span>
                    </>
                  )}
                  {activity.reason && (
                    <>
                      <span>•</span>
                      <span className="text-red-500">{activity.reason}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/companies"
          className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500 rounded-2xl p-6 hover:border-blue-500/80 transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="text-blue-500" size={24} />
            <h3 className="text-lg font-bold text-white">Company Management</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            Review and manage company registrations
          </p>
          <div className="text-blue-500 text-sm font-semibold">View Companies →</div>
        </Link>

        <Link
          to="/admin/offers"
          className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green rounded-2xl p-6 hover:border-green/80 transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <FileText className="text-green" size={24} />
            <h3 className="text-lg font-bold text-white">Offer Management</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            Monitor and approve platform offers
          </p>
          <div className="text-green text-sm font-semibold">View Offers →</div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500 rounded-2xl p-6 hover:border-purple-500/80 transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <Users className="text-purple-500" size={24} />
            <h3 className="text-lg font-bold text-white">User Management</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            Manage user accounts and permissions
          </p>
          <div className="text-purple-500 text-sm font-semibold">View Users →</div>
        </Link>
      </div>
    </div>
  );
}
