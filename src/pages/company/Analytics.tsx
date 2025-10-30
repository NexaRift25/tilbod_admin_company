import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  ShoppingBag,
  DollarSign,
  Calendar,
  ArrowLeft,
  Download,
  Users
} from "lucide-react";

interface AnalyticsData {
  period: string;
  views: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30");

  // Mock analytics data
  const analyticsData: AnalyticsData[] = [
    { period: "Jan 1-7", views: 245, purchases: 12, revenue: 420000, conversionRate: 4.9 },
    { period: "Jan 8-14", views: 312, purchases: 18, revenue: 630000, conversionRate: 5.8 },
    { period: "Jan 15-21", views: 289, purchases: 15, revenue: 525000, conversionRate: 5.2 },
    { period: "Jan 22-28", views: 356, purchases: 22, revenue: 770000, conversionRate: 6.2 },
    { period: "Jan 29-31", views: 198, purchases: 9, revenue: 315000, conversionRate: 4.5 },
  ];

  const currentMonthStats = {
    totalViews: analyticsData.reduce((sum, item) => sum + item.views, 0),
    totalPurchases: analyticsData.reduce((sum, item) => sum + item.purchases, 0),
    totalRevenue: analyticsData.reduce((sum, item) => sum + item.revenue, 0),
    avgConversionRate: Math.round(analyticsData.reduce((sum, item) => sum + item.conversionRate, 0) / analyticsData.length * 10) / 10,
  };

  const offerPerformance = [
    { name: "Weekend Getaway Package", views: 245, purchases: 12, revenue: 420000, conversionRate: 4.9 },
    { name: "Happy Hour Special", views: 312, purchases: 18, revenue: 18000, conversionRate: 5.8 },
    { name: "Tuesday Restaurant Special", views: 156, purchases: 8, revenue: 16000, conversionRate: 5.1 },
    { name: "Spa & Wellness Gift Card", views: 89, purchases: 15, revenue: 127500, conversionRate: 16.9 },
  ];

  const topPerformingOffers = [...offerPerformance]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

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
              Analytics
            </h1>
            <p className="text-gray-400 text-sm">
              Track your offers' performance and insights
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="p-2 hover:bg-primary/10 rounded-lg transition-all">
            <Download className="text-primary" size={20} />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-white text-2xl font-bold">{currentMonthStats.totalViews.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="text-green-500" size={14} />
                <span className="text-green-500 text-xs">+12%</span>
              </div>
            </div>
            <Eye className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Purchases</p>
              <p className="text-white text-2xl font-bold">{currentMonthStats.totalPurchases}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="text-green-500" size={14} />
                <span className="text-green-500 text-xs">+18%</span>
              </div>
            </div>
            <ShoppingBag className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-white text-2xl font-bold">{currentMonthStats.totalRevenue.toLocaleString()} kr.</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="text-green-500" size={14} />
                <span className="text-green-500 text-xs">+24%</span>
              </div>
            </div>
            <DollarSign className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-purple-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Conversion</p>
              <p className="text-white text-2xl font-bold">{currentMonthStats.avgConversionRate}%</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="text-red-500" size={14} />
                <span className="text-red-500 text-xs">-2%</span>
              </div>
            </div>
            <BarChart3 className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Revenue Bar Chart - Responsive */}
      <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Revenue Trend</h3>

        <div className="space-y-4 sm:space-y-6">
          {analyticsData.map((data, index) => {
            const maxRevenue = Math.max(...analyticsData.map(d => d.revenue));
            const barWidth = (data.revenue / maxRevenue) * 100;
            const colors = [
              'bg-gradient-to-r from-blue-500 to-blue-600',
              'bg-gradient-to-r from-green-500 to-green-600',
              'bg-gradient-to-r from-purple-500 to-purple-600',
              'bg-gradient-to-r from-orange-500 to-orange-600',
              'bg-gradient-to-r from-pink-500 to-pink-600'
            ];
            const barColor = colors[index % colors.length];

            return (
              <div key={data.period} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-white">{data.period}</span>
                  <span className="text-xs sm:text-sm font-bold text-white">{data.revenue.toLocaleString()} kr.</span>
                </div>
                <div className="w-full bg-background rounded-full h-5 sm:h-6 overflow-hidden shadow-inner">
                  <div
                    className={`${barColor} h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2 sm:pr-3 shadow-lg group-hover:shadow-xl`}
                    style={{ width: `${barWidth}%` }}
                  >
                    <span className="text-[10px] sm:text-xs font-bold text-white">{data.purchases} sales</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smooth Curve Line Chart - Revenue & Purchases Trend */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Revenue & Purchase Trends</h3>

        <div className="relative w-full h-72 sm:h-80">
          <svg className="w-full h-full" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet">
            {/* Grid Lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={i}
                x1="40"
                y1={50 + i * 40}
                x2="480"
                y2={50 + i * 40}
                stroke="rgba(255, 238, 0, 0.1)"
                strokeWidth="1"
              />
            ))}

            {/* Revenue Area Chart (Gradient Fill) */}
            <defs>
              <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="purchaseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Revenue Curved Line */}
            <path
              d={`M 60 ${250 - (analyticsData[0].revenue / 10000)} 
                  Q 120 ${250 - (analyticsData[0].revenue / 10000) - 10}, 140 ${250 - (analyticsData[1].revenue / 10000)}
                  Q 220 ${250 - (analyticsData[1].revenue / 10000) - 10}, 240 ${250 - (analyticsData[2].revenue / 10000)}
                  Q 320 ${250 - (analyticsData[2].revenue / 10000) + 10}, 340 ${250 - (analyticsData[3].revenue / 10000)}
                  Q 420 ${250 - (analyticsData[3].revenue / 10000) - 20}, 460 ${250 - (analyticsData[4].revenue / 10000)}`}
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-lg"
            />

            {/* Revenue Area Fill */}
            <path
              d={`M 60 ${250 - (analyticsData[0].revenue / 10000)} 
                  Q 120 ${250 - (analyticsData[0].revenue / 10000) - 10}, 140 ${250 - (analyticsData[1].revenue / 10000)}
                  Q 220 ${250 - (analyticsData[1].revenue / 10000) - 10}, 240 ${250 - (analyticsData[2].revenue / 10000)}
                  Q 320 ${250 - (analyticsData[2].revenue / 10000) + 10}, 340 ${250 - (analyticsData[3].revenue / 10000)}
                  Q 420 ${250 - (analyticsData[3].revenue / 10000) - 20}, 460 ${250 - (analyticsData[4].revenue / 10000)}
                  L 460 250 L 60 250 Z`}
              fill="url(#revenueGradient)"
            />

            {/* Purchases Curved Line */}
            <path
              d={`M 60 ${230 - (analyticsData[0].purchases * 8)} 
                  Q 120 ${230 - (analyticsData[0].purchases * 8) + 5}, 140 ${230 - (analyticsData[1].purchases * 8)}
                  Q 220 ${230 - (analyticsData[1].purchases * 8) - 5}, 240 ${230 - (analyticsData[2].purchases * 8)}
                  Q 320 ${230 - (analyticsData[2].purchases * 8) + 5}, 340 ${230 - (analyticsData[3].purchases * 8)}
                  Q 420 ${230 - (analyticsData[3].purchases * 8) - 10}, 460 ${230 - (analyticsData[4].purchases * 8)}`}
              fill="none"
              stroke="rgb(34, 197, 94)"
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-lg"
            />

            {/* Data Points */}
            {analyticsData.map((data, index) => {
              const x = 60 + index * 100;
              const yRevenue = 250 - (data.revenue / 10000);
              const yPurchases = 230 - (data.purchases * 8);

              return (
                <g key={index}>
                  {/* Revenue Point */}
                  <circle cx={x} cy={yRevenue} r="5" fill="rgb(59, 130, 246)" className="drop-shadow-md" />
                  <circle cx={x} cy={yRevenue} r="8" fill="rgb(59, 130, 246)" opacity="0.3" />
                  
                  {/* Purchase Point */}
                  <circle cx={x} cy={yPurchases} r="5" fill="rgb(34, 197, 94)" className="drop-shadow-md" />
                  <circle cx={x} cy={yPurchases} r="8" fill="rgb(34, 197, 94)" opacity="0.3" />

                  {/* X-axis Labels */}
                  <text x={x} y="280" textAnchor="middle" fill="rgb(156, 163, 175)" fontSize="11" fontWeight="500">
                    {data.period.split(' ')[1]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 pt-4 border-t border-primary/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-400">Revenue (kr)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-400">Purchases</span>
          </div>
        </div>
      </div>

      {/* Top Performing Offers with Medal Design - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Top Performing Offers</h3>

          <div className="space-y-3 sm:space-y-4">
            {topPerformingOffers.map((offer, index) => {
              const medalColors = [
                'bg-gradient-to-br from-yellow-400 to-yellow-600',
                'bg-gradient-to-br from-gray-300 to-gray-500',
                'bg-gradient-to-br from-orange-400 to-orange-600'
              ];
              const medalBorders = [
                'border-yellow-400',
                'border-gray-400',
                'border-orange-400'
              ];

              return (
                <div key={offer.name} className={`p-3 sm:p-4 bg-background rounded-xl border-2 ${medalBorders[index]} hover:scale-[1.02] transition-all`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${medalColors[index]} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <span className="text-dark font-black text-base sm:text-lg">#{index + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-white text-sm sm:text-base truncate">{offer.name}</p>
                        <p className="text-xs sm:text-sm text-gray-400">{offer.purchases} purchases • {offer.views} views</p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right pl-13 sm:pl-0">
                      <p className="text-white font-bold text-base sm:text-lg">{offer.revenue.toLocaleString()} kr.</p>
                      <p className="text-green-500 text-xs sm:text-sm font-semibold">{offer.conversionRate}% conversion</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Circular Progress Charts - Responsive */}
        <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Conversion Rate by Offer Type</h3>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {offerPerformance.map((offer, index) => {
              const colors = ['text-blue-500', 'text-green-500', 'text-purple-500', 'text-orange-500'];
              const bgColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
              const strokeColors = ['stroke-blue-500', 'stroke-green-500', 'stroke-purple-500', 'stroke-orange-500'];
              const glowColors = ['shadow-blue-500/50', 'shadow-green-500/50', 'shadow-purple-500/50', 'shadow-orange-500/50'];
              
              const circumference = 2 * Math.PI * 40;
              const progress = (offer.conversionRate / 100) * circumference;

              return (
                <div key={offer.name} className="flex flex-col items-center group">
                  <div className={`relative w-24 h-24 sm:w-28 sm:h-28 transition-transform group-hover:scale-110 ${glowColors[index % glowColors.length]}`}>
                    <svg className="transform -rotate-90 w-full h-full">
                      <circle
                        cx="56"
                        cy="56"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-700"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                        className={`${strokeColors[index % strokeColors.length]} transition-all duration-1000`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-lg sm:text-2xl font-bold ${colors[index % colors.length]}`}>
                        {offer.conversionRate}%
                      </span>
                    </div>
                  </div>
                  <p className="text-white text-xs sm:text-sm font-medium mt-2 sm:mt-3 text-center">{offer.name.split(' ')[0]}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 ${bgColors[index % bgColors.length]} rounded-full`}></div>
                    <span className="text-gray-400 text-xs">{offer.purchases} sales</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Purchase Funnel Chart - Fixed Progress Bars */}
      <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Sales Funnel</h3>

        <div className="space-y-3 sm:space-y-4">
          {[
            { stage: 'Total Views', count: currentMonthStats.totalViews, percentage: 100, color: 'bg-blue-500' },
            { stage: 'Clicked Offers', count: Math.round(currentMonthStats.totalViews * 0.4), percentage: 40, color: 'bg-green-500' },
            { stage: 'Added to Cart', count: Math.round(currentMonthStats.totalViews * 0.15), percentage: 15, color: 'bg-purple-500' },
            { stage: 'Completed Purchase', count: currentMonthStats.totalPurchases, percentage: Math.round((currentMonthStats.totalPurchases / currentMonthStats.totalViews) * 100), color: 'bg-orange-500' }
          ].map((stage, index) => (
            <div key={stage.stage} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 ${stage.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-xs sm:text-sm">{index + 1}</span>
                  </div>
                  <span className="font-medium text-white text-sm sm:text-base truncate">{stage.stage}</span>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className="font-bold text-white text-sm sm:text-base">{stage.count.toLocaleString()}</span>
                  <span className="text-gray-400 text-xs sm:text-sm ml-1 sm:ml-2">({stage.percentage}%)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0"></div>
                <div className="flex-1 bg-background rounded-full h-2 sm:h-3 overflow-hidden shadow-inner">
                  <div
                    className={`${stage.color} h-full rounded-full transition-all duration-700 shadow-sm`}
                    style={{ width: `${Math.min(stage.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donut Charts - Revenue & Category Distribution - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Distribution Donut */}
        <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Revenue Distribution</h3>

          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <defs>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                </defs>
                
                {/* Background Circle */}
                <circle cx="100" cy="100" r="80" fill="transparent" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="30" />
                
                {/* Revenue Segments */}
                {(() => {
                  const revenues = [
                    { name: 'Active', amount: 420000, color: 'rgb(59, 130, 246)' },
                    { name: 'Gift Cards', amount: 127500, color: 'rgb(249, 115, 22)' },
                    { name: 'Happy Hour', amount: 18000, color: 'rgb(168, 85, 247)' },
                    { name: 'Weekdays', amount: 16000, color: 'rgb(34, 197, 94)' }
                  ];
                  const total = revenues.reduce((sum, r) => sum + r.amount, 0);
                  let currentAngle = 0;
                  const circumference = 2 * Math.PI * 80;

                  return revenues.map((revenue, index) => {
                    const percentage = revenue.amount / total;
                    const segmentLength = circumference * percentage;
                    const offset = circumference - currentAngle - segmentLength;
                    currentAngle += segmentLength;

                    return (
                      <circle
                        key={index}
                        cx="100"
                        cy="100"
                        r="80"
                        fill="transparent"
                        stroke={revenue.color}
                        strokeWidth="30"
                        strokeDasharray={`${segmentLength} ${circumference}`}
                        strokeDashoffset={-offset}
                        className="transition-all duration-1000"
                        filter="url(#shadow)"
                      />
                    );
                  });
                })()}
              </svg>
              
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg sm:text-2xl md:text-3xl font-bold text-white">{(currentMonthStats.totalRevenue / 1000).toFixed(0)}k</span>
                <span className="text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium">Revenue</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6 w-full">
              {[
                { name: 'Active Offers', amount: 420000, color: 'bg-blue-500', percentage: 72 },
                { name: 'Gift Cards', amount: 127500, color: 'bg-orange-500', percentage: 22 },
                { name: 'Happy Hour', amount: 18000, color: 'bg-purple-500', percentage: 3 },
                { name: 'Weekdays', amount: 16000, color: 'bg-green-500', percentage: 3 }
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${item.color} rounded-full flex-shrink-0`}></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.percentage}% • {item.amount.toLocaleString()} kr</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Performance Pie Chart */}
        <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Performance by Category</h3>

          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background Circle */}
                <circle cx="100" cy="100" r="70" fill="rgba(31, 34, 51, 0.8)" />
                
                {/* Category Segments */}
                {(() => {
                  const categories = [
                    { name: 'Hotels', purchases: 12, color: 'rgb(59, 130, 246)' },
                    { name: 'Dining', purchases: 26, color: 'rgb(34, 197, 94)' },
                    { name: 'Wellness', purchases: 15, color: 'rgb(168, 85, 247)' },
                    { name: 'Activities', purchases: 23, color: 'rgb(249, 115, 22)' }
                  ];
                  const total = categories.reduce((sum, c) => sum + c.purchases, 0);
                  let currentAngle = 0;

                  return categories.map((cat, index) => {
                    const percentage = cat.purchases / total;
                    const angle = percentage * 360;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angle;
                    currentAngle += angle;

                    // Calculate path for pie slice
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    const x1 = 100 + 70 * Math.cos(startRad);
                    const y1 = 100 + 70 * Math.sin(startRad);
                    const x2 = 100 + 70 * Math.cos(endRad);
                    const y2 = 100 + 70 * Math.sin(endRad);
                    const largeArc = angle > 180 ? 1 : 0;

                    return (
                      <g key={index}>
                        <path
                          d={`M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={cat.color}
                          className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                          filter="url(#shadow)"
                        />
                      </g>
                    );
                  });
                })()}
                
                {/* Center Circle */}
                <circle cx="100" cy="100" r="45" fill="rgb(31, 34, 51)" />
              </svg>
              
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg sm:text-2xl md:text-3xl font-bold text-white">{currentMonthStats.totalPurchases}</span>
                <span className="text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium">Sales</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6 w-full">
              {[
                { name: 'Hotels', purchases: 12, color: 'bg-blue-500', percentage: 16 },
                { name: 'Dining', purchases: 26, color: 'bg-green-500', percentage: 34 },
                { name: 'Wellness', purchases: 15, color: 'bg-purple-500', percentage: 20 },
                { name: 'Activities', purchases: 23, color: 'bg-orange-500', percentage: 30 }
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${item.color} rounded-full flex-shrink-0`}></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.percentage}% • {item.purchases} sales</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Heatmap - Responsive */}
      <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg font-bold text-white mb-4 sm:mb-6">Weekly Activity Heatmap</h3>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[600px] space-y-2 sm:space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, dayIndex) => {
              const activityLevels = [20, 65, 85, 75, 90, 45, 30];
              const activity = activityLevels[dayIndex];
              const colors = [
                'bg-gray-600',
                'bg-blue-600',
                'bg-green-600',
                'bg-yellow',
                'bg-orange-500',
                'bg-red-500',
                'bg-pink-500'
              ];

              return (
                <div key={day} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-16 sm:w-24 text-xs sm:text-sm font-medium text-gray-400">{day.slice(0, 3)}</div>
                  <div className="flex-1 flex gap-0.5 sm:gap-1">
                    {Array.from({ length: 24 }).map((_, hour) => {
                      const hourActivity = hour >= 8 && hour <= 22 ? Math.random() * 100 : Math.random() * 30;
                      const opacity = hourActivity > 70 ? '100' : hourActivity > 40 ? '60' : hourActivity > 20 ? '30' : '10';
                      
                      return (
                        <div
                          key={hour}
                          className={`flex-1 h-6 sm:h-8 ${colors[dayIndex % colors.length]} rounded opacity-${opacity} hover:opacity-100 transition-opacity cursor-pointer group relative`}
                          title={`${day} ${hour}:00 - Activity: ${Math.round(hourActivity)}%`}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-dark px-2 py-1 rounded text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {hour}:00
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="w-12 sm:w-16 text-right">
                    <span className="text-xs sm:text-sm font-bold text-white">{activity}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 border-t border-primary/50">
          <span className="text-xs text-gray-400">Less Active</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-600 opacity-10 rounded"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 opacity-30 rounded"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-600 opacity-60 rounded"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-600 opacity-100 rounded"></div>
          </div>
          <span className="text-xs text-gray-400">More Active</span>
        </div>
      </div>

      {/* Radial Progress - Monthly Goals */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Monthly Goals Progress</h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Revenue Goal', current: 581500, target: 800000, color: 'stroke-blue-500', bgColor: 'text-blue-500' },
            { label: 'Sales Target', current: 76, target: 100, color: 'stroke-green-500', bgColor: 'text-green-500' },
            { label: 'New Customers', current: 145, target: 200, color: 'stroke-purple-500', bgColor: 'text-purple-500' },
            { label: 'Avg Conversion', current: 5.5, target: 8, color: 'stroke-orange-500', bgColor: 'text-orange-500' }
          ].map((goal) => {
            const percentage = (goal.current / goal.target) * 100;
            const radius = 45;
            const circumference = 2 * Math.PI * radius;
            const progress = (percentage / 100) * circumference;

            return (
              <div key={goal.label} className="flex flex-col items-center">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - progress}
                      className={`${goal.color} transition-all duration-1000`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-xl sm:text-2xl font-bold ${goal.bgColor}`}>
                      {Math.round(percentage)}%
                    </span>
                    <span className="text-xs text-gray-400">{goal.current.toLocaleString()}/{goal.target.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-white text-center mt-3">{goal.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offer Type Performance Comparison - Responsive */}
      <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Performance by Offer Type</h3>

        <div className="space-y-4 sm:space-y-6">
          {[
            { name: 'Active Offers', views: 245, purchases: 12, revenue: 420000, color: 'bg-blue-500', borderColor: 'border-blue-500', shadowColor: 'shadow-blue-500/20' },
            { name: 'Weekday Specials', views: 156, purchases: 8, revenue: 16000, color: 'bg-green-500', borderColor: 'border-green-500', shadowColor: 'shadow-green-500/20' },
            { name: 'Happy Hour', views: 312, purchases: 18, revenue: 18000, color: 'bg-purple-500', borderColor: 'border-purple-500', shadowColor: 'shadow-purple-500/20' },
            { name: 'Gift Cards', views: 89, purchases: 15, revenue: 127500, color: 'bg-orange-500', borderColor: 'border-orange-500', shadowColor: 'shadow-orange-500/20' }
          ].map((type) => {
            const maxRevenue = 420000;
            const revenuePercentage = (type.revenue / maxRevenue) * 100;
            
            return (
              <div key={type.name} className={`border-l-4 ${type.borderColor} pl-3 sm:pl-4 py-2 hover:bg-background/50 transition-all rounded-r-lg ${type.shadowColor}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 ${type.color} rounded-full flex-shrink-0`}></div>
                    <span className="font-semibold text-white text-sm sm:text-base">{type.name}</span>
                  </div>
                  <span className="text-white font-bold text-sm sm:text-base">{type.revenue.toLocaleString()} kr.</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-2">
                  <div className="bg-background rounded-lg p-2">
                    <p className="text-[10px] sm:text-xs text-gray-400">Views</p>
                    <p className="text-white font-bold text-sm sm:text-base">{type.views}</p>
                  </div>
                  <div className="bg-background rounded-lg p-2">
                    <p className="text-[10px] sm:text-xs text-gray-400">Purchases</p>
                    <p className="text-white font-bold text-sm sm:text-base">{type.purchases}</p>
                  </div>
                  <div className="bg-background rounded-lg p-2">
                    <p className="text-[10px] sm:text-xs text-gray-400">Conversion</p>
                    <p className="text-white font-bold text-sm sm:text-base">{((type.purchases / type.views) * 100).toFixed(1)}%</p>
                  </div>
                </div>

                <div className="w-full bg-background rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className={`${type.color} h-full rounded-full transition-all duration-700 shadow-lg`}
                    style={{ width: `${revenuePercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights - Responsive */}
      <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4">Key Insights</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-green-500/10 rounded-lg border border-green-500/30 hover:bg-green-500/20 transition-all">
              <TrendingUp className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-green-500 font-bold mb-1 text-sm sm:text-base">Strong Performance</h4>
                <p className="text-xs sm:text-sm text-gray-300">
                  Your offers are performing well with a {currentMonthStats.avgConversionRate}% conversion rate, above the industry average.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 hover:bg-blue-500/20 transition-all">
              <BarChart3 className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-blue-500 font-bold mb-1 text-sm sm:text-base">Top Performer</h4>
                <p className="text-xs sm:text-sm text-gray-300">
                  Spa & Wellness Gift Card has the highest conversion rate at 16.9%.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-yellow/10 rounded-lg border border-yellow/30 hover:bg-yellow/20 transition-all">
              <Calendar className="text-yellow flex-shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-yellow font-bold mb-1 text-sm sm:text-base">Peak Days</h4>
                <p className="text-xs sm:text-sm text-gray-300">
                  Highest engagement occurs on Tuesdays and Wednesdays. Consider scheduling more offers during these days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 bg-purple-500/10 rounded-lg border border-purple-500/30 hover:bg-purple-500/20 transition-all">
              <Users className="text-purple-500 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-purple-500 font-bold mb-1 text-sm sm:text-base">Customer Behavior</h4>
                <p className="text-xs sm:text-sm text-gray-300">
                  Most customers browse in the evening (6-9 PM). Happy Hour offers perform best during this time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

