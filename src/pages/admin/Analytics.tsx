import { useMemo, useState } from "react";
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
import { useTranslation } from "react-i18next";

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

type ChartType = "revenue" | "companies" | "users" | "offers";
type ChangeType = "positive" | "negative";
type ActivityType = "registration" | "approval" | "revenue" | "moderation";

type TimeRangeValue = "7d" | "30d" | "90d" | "1y";

type MetricFilterValue = "all" | "revenue" | "count" | "growth";

export default function AdminAnalyticsPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "is" ? "is-IS" : "en-US";

  const [timeRange, setTimeRange] = useState<TimeRangeValue>("30d");
  const [chartType, setChartType] = useState<ChartType>("revenue");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [metricFilter, setMetricFilter] = useState<MetricFilterValue>("all");

  const formatNumber = (value: number) => value.toLocaleString(locale);
  const formatCurrencyValue = (value: number) =>
    t("adminAnalytics.common.currency", { value: formatNumber(value) });
  const formatPercentageValue = (value: number, fractionDigits = 1) =>
    t("adminAnalytics.common.percentage", {
      value: value.toFixed(fractionDigits),
    });

  const timeRangeOptions = useMemo(
    () => [
      { value: "7d" as TimeRangeValue, label: t("adminAnalytics.filters.timeRange.7d") },
      { value: "30d" as TimeRangeValue, label: t("adminAnalytics.filters.timeRange.30d") },
      { value: "90d" as TimeRangeValue, label: t("adminAnalytics.filters.timeRange.90d") },
      { value: "1y" as TimeRangeValue, label: t("adminAnalytics.filters.timeRange.1y") },
    ],
    [t]
  );

  const chartTypeOptions = useMemo(
    () => [
      { value: "revenue" as ChartType, label: t("adminAnalytics.filters.chartType.options.revenue") },
      { value: "companies" as ChartType, label: t("adminAnalytics.filters.chartType.options.companies") },
      { value: "users" as ChartType, label: t("adminAnalytics.filters.chartType.options.users") },
      { value: "offers" as ChartType, label: t("adminAnalytics.filters.chartType.options.offers") },
    ],
    [t]
  );

  const metricOptions = useMemo(
    () => [
      { value: "all" as MetricFilterValue, label: t("adminAnalytics.filters.metric.options.all") },
      { value: "revenue" as MetricFilterValue, label: t("adminAnalytics.filters.metric.options.revenue") },
      { value: "count" as MetricFilterValue, label: t("adminAnalytics.filters.metric.options.count") },
      { value: "growth" as MetricFilterValue, label: t("adminAnalytics.filters.metric.options.growth") },
    ],
    [t]
  );

  const selectedRangeLabel = useMemo(
    () => timeRangeOptions.find((option) => option.value === timeRange)?.label ?? "",
    [timeRange, timeRangeOptions]
  );

  const overviewStats = useMemo(
    () => [
      {
        label: t("adminAnalytics.overview.totalRevenue.label"),
        value: formatCurrencyValue(2456789),
        change: t("adminAnalytics.overview.totalRevenue.change", { value: "+18.5%" }),
        changeType: "positive" as ChangeType,
        icon: DollarSign,
      },
      {
        label: t("adminAnalytics.overview.activeCompanies.label"),
        value: formatNumber(156),
        change: t("adminAnalytics.overview.activeCompanies.change", { value: "+12" }),
        changeType: "positive" as ChangeType,
        icon: Building2,
      },
      {
        label: t("adminAnalytics.overview.totalUsers.label"),
        value: formatNumber(1234),
        change: t("adminAnalytics.overview.totalUsers.change", { value: "+8.2%" }),
        changeType: "positive" as ChangeType,
        icon: Users,
      },
      {
        label: t("adminAnalytics.overview.activeOffers.label"),
        value: formatNumber(2847),
        change: t("adminAnalytics.overview.activeOffers.change", { value: "+23" }),
        changeType: "positive" as ChangeType,
        icon: FileText,
      },
    ],
    [t, locale]
  );

  const platformMetrics = useMemo(
    () => [
      {
        label: t("adminAnalytics.platformMetrics.pageViews.label"),
        value: formatNumber(45678),
        change: t("adminAnalytics.platformMetrics.pageViews.change", { value: "+12.3%" }),
        changeType: "positive" as ChangeType,
      },
      {
        label: t("adminAnalytics.platformMetrics.offerViews.label"),
        value: formatNumber(23456),
        change: t("adminAnalytics.platformMetrics.offerViews.change", { value: "+8.7%" }),
        changeType: "positive" as ChangeType,
      },
      {
        label: t("adminAnalytics.platformMetrics.conversions.label"),
        value: formatNumber(1234),
        change: t("adminAnalytics.platformMetrics.conversions.change", { value: "+15.2%" }),
        changeType: "positive" as ChangeType,
      },
      {
        label: t("adminAnalytics.platformMetrics.conversionRate.label"),
        value: formatPercentageValue(5.26, 2),
        change: t("adminAnalytics.platformMetrics.conversionRate.change", { value: "+0.8%" }),
        changeType: "positive" as ChangeType,
      },
    ],
    [t, locale]
  );

  const revenueData = useMemo(
    () => [
      { monthIndex: 0, monthLabel: t("common.months.short.jan"), revenue: 180000, companies: 12 },
      { monthIndex: 1, monthLabel: t("common.months.short.feb"), revenue: 220000, companies: 15 },
      { monthIndex: 2, monthLabel: t("common.months.short.mar"), revenue: 195000, companies: 13 },
      { monthIndex: 3, monthLabel: t("common.months.short.apr"), revenue: 280000, companies: 18 },
      { monthIndex: 4, monthLabel: t("common.months.short.may"), revenue: 320000, companies: 22 },
      { monthIndex: 5, monthLabel: t("common.months.short.jun"), revenue: 290000, companies: 19 },
      { monthIndex: 6, monthLabel: t("common.months.short.jul"), revenue: 350000, companies: 25 },
      { monthIndex: 7, monthLabel: t("common.months.short.aug"), revenue: 380000, companies: 28 },
      { monthIndex: 8, monthLabel: t("common.months.short.sep"), revenue: 420000, companies: 32 },
      { monthIndex: 9, monthLabel: t("common.months.short.oct"), revenue: 450000, companies: 35 },
      { monthIndex: 10, monthLabel: t("common.months.short.nov"), revenue: 480000, companies: 38 },
      { monthIndex: 11, monthLabel: t("common.months.short.dec"), revenue: 520000, companies: 42 },
    ],
    [t]
  );

  const userGrowthData = useMemo(
    () => [
      { monthIndex: 0, monthLabel: t("common.months.short.jan"), users: 850, newUsers: 45 },
      { monthIndex: 1, monthLabel: t("common.months.short.feb"), users: 920, newUsers: 70 },
      { monthIndex: 2, monthLabel: t("common.months.short.mar"), users: 980, newUsers: 60 },
      { monthIndex: 3, monthLabel: t("common.months.short.apr"), users: 1050, newUsers: 70 },
      { monthIndex: 4, monthLabel: t("common.months.short.may"), users: 1120, newUsers: 70 },
      { monthIndex: 5, monthLabel: t("common.months.short.jun"), users: 1180, newUsers: 60 },
      { monthIndex: 6, monthLabel: t("common.months.short.jul"), users: 1234, newUsers: 54 },
    ],
    [t]
  );

  const companyRegistrations = useMemo(
    () => [
      { categoryKey: "foodDining", count: 45, percentage: 28.8 },
      { categoryKey: "hotelsAccommodation", count: 32, percentage: 20.5 },
      { categoryKey: "wellnessSpa", count: 28, percentage: 17.9 },
      { categoryKey: "activitiesEntertainment", count: 25, percentage: 16.0 },
      { categoryKey: "shoppingRetail", count: 15, percentage: 9.6 },
      { categoryKey: "beautyPersonalCare", count: 11, percentage: 7.1 },
    ],
    []
  );

  const offerPerformance = useMemo(
    () => [
      { typeKey: "active", count: 1247, revenue: 1200000 },
      { typeKey: "weekdays", count: 856, revenue: 680000 },
      { typeKey: "happyHour", count: 423, revenue: 340000 },
      { typeKey: "giftCard", count: 321, revenue: 236789 },
    ],
    []
  );

  const conversionFunnel = useMemo(
    () => [
      { stageKey: "visitors", count: 45678, percentage: 100 },
      { stageKey: "offerViews", count: 23456, percentage: 51.4 },
      { stageKey: "interested", count: 12345, percentage: 27.0 },
      { stageKey: "purchases", count: 1234, percentage: 2.7 },
    ],
    []
  );

  const topCompanies = useMemo(
    () => [
      {
        name: t("adminAnalytics.data.companyNames.blueLagoon"),
        revenue: formatCurrencyValue(456789),
        offers: 12,
        conversion: formatPercentageValue(8.5),
        growth: t("adminAnalytics.topCompanies.growth", { value: "+22%" }),
      },
      {
        name: t("adminAnalytics.data.companyNames.hotelAurora"),
        revenue: formatCurrencyValue(389456),
        offers: 8,
        conversion: formatPercentageValue(7.2),
        growth: t("adminAnalytics.topCompanies.growth", { value: "+18%" }),
      },
      {
        name: t("adminAnalytics.data.companyNames.restaurantNordic"),
        revenue: formatCurrencyValue(234567),
        offers: 6,
        conversion: formatPercentageValue(6.8),
        growth: t("adminAnalytics.topCompanies.growth", { value: "+15%" }),
      },
      {
        name: t("adminAnalytics.data.companyNames.adventureTours"),
        revenue: formatCurrencyValue(198234),
        offers: 4,
        conversion: formatPercentageValue(5.9),
        growth: t("adminAnalytics.topCompanies.growth", { value: "+12%" }),
      },
    ],
    [t, locale]
  );

  const recentActivity = useMemo(
    () => [
      {
        type: "registration" as ActivityType,
        title: t("adminAnalytics.recentActivity.items.registration", {
          company: t("adminAnalytics.data.companyNames.spaRetreat"),
        }),
        timestamp: t("adminAnalytics.recentActivity.timestamps.twoHoursAgo"),
      },
      {
        type: "approval" as ActivityType,
        title: t("adminAnalytics.recentActivity.items.approval", {
          offer: t("adminAnalytics.data.offers.weekendPackage"),
          company: t("adminAnalytics.data.companyNames.hotelAurora"),
        }),
        timestamp: t("adminAnalytics.recentActivity.timestamps.fourHoursAgo"),
      },
      {
        type: "revenue" as ActivityType,
        title: t("adminAnalytics.recentActivity.items.revenue", {
          company: t("adminAnalytics.data.companyNames.blueLagoon"),
        }),
        timestamp: t("adminAnalytics.recentActivity.timestamps.sixHoursAgo"),
        amount: formatCurrencyValue(50000),
      },
      {
        type: "moderation" as ActivityType,
        title: t("adminAnalytics.recentActivity.items.moderation", {
          user: "Mike Johnson",
        }),
        timestamp: t("adminAnalytics.recentActivity.timestamps.eightHoursAgo"),
        reason: t("adminAnalytics.recentActivity.reasons.policyViolation"),
      },
    ],
    [t, locale]
  );

  const quickActions = useMemo(
    () => [
      {
        icon: Building2,
        title: t("adminAnalytics.quickActions.company.title"),
        description: t("adminAnalytics.quickActions.company.description"),
        cta: t("adminAnalytics.quickActions.company.cta"),
        to: "/admin/companies",
        borderClass: "border-blue-500",
        gradientClass: "from-blue-500/20 to-blue-500/5",
        textClass: "text-blue-500",
      },
      {
        icon: FileText,
        title: t("adminAnalytics.quickActions.offers.title"),
        description: t("adminAnalytics.quickActions.offers.description"),
        cta: t("adminAnalytics.quickActions.offers.cta"),
        to: "/admin/offers",
        borderClass: "border-green",
        gradientClass: "from-green-500/20 to-green-500/5",
        textClass: "text-green",
      },
      {
        icon: Users,
        title: t("adminAnalytics.quickActions.users.title"),
        description: t("adminAnalytics.quickActions.users.description"),
        cta: t("adminAnalytics.quickActions.users.cta"),
        to: "/admin/users",
        borderClass: "border-purple-500",
        gradientClass: "from-purple-500/20 to-purple-500/5",
        textClass: "text-purple-500",
      },
    ],
    [t]
  );

  const getActivityIcon = (type: ActivityType) => {
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

  const getActivityColor = (type: ActivityType) => {
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

  const filteredRevenueData = useMemo(() => {
    if (!dateFrom || !dateTo) {
      return revenueData;
    }

    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      return revenueData;
    }

    const fromMonth = fromDate.getMonth();
    const toMonth = toDate.getMonth();

    return revenueData.filter(
      (data) => data.monthIndex >= fromMonth && data.monthIndex <= toMonth
    );
  }, [dateFrom, dateTo, revenueData]);

  const RevenueChart = () => {
    const maxRevenue = Math.max(...filteredRevenueData.map((d) => d.revenue));

    return (
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">
            {t("adminAnalytics.charts.revenueTrend.title")}
          </h3>
          <div className="flex items-center gap-2">
            <DollarSign className="text-green" size={20} />
            <span className="text-sm text-gray-400">
              {t("adminAnalytics.charts.revenueTrend.last12Months")}
            </span>
          </div>
        </div>

        <div className="h-64 flex items-end justify-between gap-2">
          {filteredRevenueData.map((data, index) => (
            <div key={data.monthIndex} className="flex flex-col items-center flex-1">
              <div className="relative w-full">
                <div
                  className="bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-500 hover:from-primary/80 hover:to-primary/40"
                  style={{
                    height: maxRevenue > 0 ? `${(data.revenue / maxRevenue) * 200}px` : 0,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 font-medium">
                  {(data.revenue / 1000).toFixed(0)}k
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400 font-medium">
                {data.monthLabel}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            {t("adminAnalytics.charts.revenueTrend.totalRevenue", {
              value: formatCurrencyValue(2456789),
            })}
          </span>
          <span className="text-green font-semibold">
            {t("adminAnalytics.charts.revenueTrend.change", { value: "+18.5%" })}
          </span>
        </div>
      </div>
    );
  };

  const CompanyCategoryChart = () => (
    <div className="bg-card-background border border-primary rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">
          {t("adminAnalytics.charts.companyCategories.title")}
        </h3>
        <Building2 className="text-primary" size={20} />
      </div>

      <div className="space-y-4">
        {companyRegistrations.map((category, index) => (
          <div key={category.categoryKey} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium text-sm">
                {t(`adminAnalytics.data.categories.${category.categoryKey}`)}
              </span>
              <span className="text-gray-400 text-sm">
                {t("adminAnalytics.charts.companyCategories.count", {
                  count: category.count,
                })}
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${category.percentage}%`,
                  animationDelay: `${index * 200}ms`,
                }}
              />
            </div>
            <div className="text-right text-xs text-gray-400">
              {t("adminAnalytics.common.percentage", {
                value: category.percentage.toFixed(1),
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const OfferPerformanceChart = () => {
    const maxRevenue = Math.max(...offerPerformance.map((offer) => offer.revenue));

    return (
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">
            {t("adminAnalytics.charts.offerPerformance.title")}
          </h3>
          <FileText className="text-primary" size={20} />
        </div>

        <div className="space-y-4">
          {offerPerformance.map((offer, index) => (
            <div key={offer.typeKey} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium text-sm">
                  {t(`adminAnalytics.data.offerTypes.${offer.typeKey}`)}
                </span>
                <div className="text-right">
                  <div className="text-gray-400 text-sm">
                    {t("adminAnalytics.charts.offerPerformance.count", {
                      count: offer.count,
                    })}
                  </div>
                  <div className="text-primary text-sm font-semibold">
                    {formatCurrencyValue(offer.revenue)}
                  </div>
                </div>
              </div>
              <div className="w-full bg-background rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                  style={{
                    width: maxRevenue > 0 ? `${(offer.revenue / maxRevenue) * 100}%` : 0,
                    animationDelay: `${index * 150}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const UserGrowthChart = () => {
    const maxUsers = Math.max(...userGrowthData.map((d) => d.users));

    return (
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">
            {t("adminAnalytics.charts.userGrowth.title")}
          </h3>
          <Users className="text-primary" size={20} />
        </div>

        <div className="h-48 flex items-end justify-between gap-3">
          {userGrowthData.map((data, index) => (
            <div key={data.monthIndex} className="flex flex-col items-center flex-1">
              <div className="relative w-full flex flex-col items-center">
                <div
                  className="bg-gradient-to-t from-green-500 to-green-500/60 rounded-t-lg w-full transition-all duration-500 hover:from-green-500/80 hover:to-green-500/40"
                  style={{
                    height: maxUsers > 0 ? `${(data.users / maxUsers) * 150}px` : 0,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 font-medium">
                  {formatNumber(data.users)}
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400 font-medium">
                {data.monthLabel}
              </div>
              <div className="text-xs text-green font-semibold">
                +{formatNumber(data.newUsers)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            {t("adminAnalytics.charts.userGrowth.totalUsers", {
              value: formatNumber(1234),
            })}
          </span>
          <span className="text-green font-semibold">
            {t("adminAnalytics.charts.userGrowth.growth", { value: "+8.2%" })}
          </span>
        </div>
      </div>
    );
  };

  const ConversionFunnelChart = () => (
    <div className="bg-card-background border border-primary rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">
          {t("adminAnalytics.charts.conversionFunnel.title")}
        </h3>
        <ShoppingCart className="text-primary" size={20} />
      </div>

      <div className="space-y-4">
        {conversionFunnel.map((stage, index) => {
          const nextStage = conversionFunnel[index + 1];
          const dropOffPercentage = nextStage
            ? ((stage.count - nextStage.count) / stage.count) * 100
            : 0;

          return (
            <div key={stage.stageKey} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium text-sm">
                  {t(`adminAnalytics.data.conversionStages.${stage.stageKey}`)}
                </span>
                <div className="text-right">
                  <span className="text-gray-400 text-sm">
                    {formatNumber(stage.count)}
                  </span>
                  <span className="text-primary text-sm font-semibold ml-2">
                    {formatPercentageValue(stage.percentage, 1)}
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="w-full bg-background rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-4 rounded-full transition-all duration-1000"
                    style={{
                      width: `${stage.percentage}%`,
                      animationDelay: `${index * 200}ms`,
                    }}
                  />
                </div>
                {nextStage && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500">
                    {t("adminAnalytics.charts.conversionFunnel.dropoff", {
                      value: dropOffPercentage.toFixed(1),
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">
            {t("adminAnalytics.charts.conversionFunnel.overall")}
          </span>
          <span className="text-primary text-lg font-bold">
            {formatPercentageValue(2.7, 1)}
          </span>
        </div>
        <div className="text-sm text-gray-400 mt-1">
          {t("adminAnalytics.charts.conversionFunnel.overallDescription")}
        </div>
      </div>
    </div>
  );

  const filteredRevenueChartData = useMemo(() => ({
    labels: filteredRevenueData.map((d) => d.monthLabel),
    datasets: [
      {
        label: t("adminAnalytics.charts.revenueTrend.datasets.revenue"),
        data: filteredRevenueData.map((d) => d.revenue),
        backgroundColor: "rgba(251, 146, 60, 0.8)",
        borderColor: "rgba(251, 146, 60, 1)",
        borderWidth: 2,
      },
      {
        label: t("adminAnalytics.charts.revenueTrend.datasets.companies"),
        data: filteredRevenueData.map((d) => d.companies),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
    ],
  }), [filteredRevenueData, t]);

  const userGrowthChartData = useMemo(() => ({
    labels: userGrowthData.map((d) => d.monthLabel),
    datasets: [
      {
        label: t("adminAnalytics.charts.userGrowth.datasets.total"),
        data: userGrowthData.map((d) => d.users),
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: t("adminAnalytics.charts.userGrowth.datasets.new"),
        data: userGrowthData.map((d) => d.newUsers),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  }), [userGrowthData, t]);

  const companyCategoryChartData = useMemo(() => ({
    labels: companyRegistrations.map((d) => t(`adminAnalytics.data.categories.${d.categoryKey}`)),
    datasets: [
      {
        label: t("adminAnalytics.charts.companyCategories.dataset"),
        data: companyRegistrations.map((d) => d.count),
        backgroundColor: [
          "rgba(251, 146, 60, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(20, 184, 166, 0.8)",
        ],
        borderWidth: 2,
        borderColor: "rgba(17, 24, 39, 1)",
      },
    ],
  }), [companyRegistrations, t]);

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
              {t("adminAnalytics.header.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminAnalytics.header.subtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRangeValue)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              {timeRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all">
            <Download size={16} />
            {t("adminAnalytics.header.export")}
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6 hover:border-primary/80 transition-all"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="text-primary" size={20} />
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    stat.changeType === "positive" ? "text-green" : "text-red-500"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-400 text-xs sm:text-sm mb-1">{stat.label}</h3>
              <p className="text-white text-xl sm:text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Form for Charts */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Filter className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-white">
            {t("adminAnalytics.filters.title")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminAnalytics.filters.chartType.label")}
            </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="w-full px-4 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              {chartTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminAnalytics.filters.dateFrom")}
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminAnalytics.filters.dateTo")}
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminAnalytics.filters.metric.label")}
            </label>
            <select
              value={metricFilter}
              onChange={(e) => setMetricFilter(e.target.value as MetricFilterValue)}
              className="w-full px-4 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              {metricOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filtered Chart Data */}
      <div className="grid grid-cols-1">
        {chartType === "revenue" && (
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              {t("adminAnalytics.charts.revenueTrend.filteredTitle")}
            </h3>
            <div className="h-[300px]">
              <Bar
                data={filteredRevenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: "#ffffff",
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      titleColor: "#ffffff",
                      bodyColor: "#ffffff",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { color: "#9ca3af" },
                      grid: { color: "rgba(255, 255, 255, 0.1)" },
                    },
                    x: {
                      ticks: { color: "#9ca3af" },
                      grid: { color: "rgba(255, 255, 255, 0.1)" },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
        {chartType === "users" && (
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              {t("adminAnalytics.charts.userGrowth.filteredTitle")}
            </h3>
            <div className="h-[300px]">
              <Line
                data={userGrowthChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: "#ffffff",
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      titleColor: "#ffffff",
                      bodyColor: "#ffffff",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { color: "#9ca3af" },
                      grid: { color: "rgba(255, 255, 255, 0.1)" },
                    },
                    x: {
                      ticks: { color: "#9ca3af" },
                      grid: { color: "rgba(255, 255, 255, 0.1)" },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
        {chartType === "companies" && (
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              {t("adminAnalytics.charts.companyCategories.filteredTitle")}
            </h3>
            <div className="h-[300px]">
              <Doughnut
                data={companyCategoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        color: "#ffffff",
                        padding: 15,
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      titleColor: "#ffffff",
                      bodyColor: "#ffffff",
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>

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
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {t("adminAnalytics.platformMetrics.title")}
          </h2>
          <div className="flex items-center gap-2">
            <BarChart3 className="text-primary" size={20} />
            <span className="text-sm text-gray-400">
              {t("adminAnalytics.platformMetrics.subtitle", {
                range: selectedRangeLabel,
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {platformMetrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span
                  className={`text-sm font-semibold ${
                    metric.changeType === "positive" ? "text-green" : "text-red-500"
                  }`}
                >
                  {metric.changeType === "positive" ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    metric.changeType === "positive" ? "text-green" : "text-red-500"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
              <p className="text-white text-2xl font-bold mb-1">{metric.value}</p>
              <p className="text-gray-400 text-sm">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Companies */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {t("adminAnalytics.topCompanies.title")}
          </h2>
          <Link
            to="/admin/companies"
            className="text-primary hover:text-primary/80 font-medium text-sm"
          >
            {t("adminAnalytics.topCompanies.viewAll")}
          </Link>
        </div>

        <div className="space-y-4">
          {topCompanies.map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="flex items-center justify-between p-4 bg-background rounded-lg border border-primary/50 hover:border-primary transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">#{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{company.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>
                      {t("adminAnalytics.topCompanies.stats.offers", {
                        count: company.offers,
                      })}
                    </span>
                    <span>•</span>
                    <span>
                      {t("adminAnalytics.topCompanies.stats.conversion", {
                        value: company.conversion,
                      })}
                    </span>
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
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {t("adminAnalytics.recentActivity.title")}
          </h2>
          <Calendar className="text-primary" size={20} />
        </div>

        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={`${activity.type}-${index}`}
              className="flex items-center gap-4 p-3 bg-background rounded-lg border border-primary/50 hover:border-primary transition-all"
            >
              <div className={`w-8 h-8 ${getActivityColor(activity.type)} rounded-lg flex items-center justify-center`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{activity.title}</p>
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
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.to}
              to={action.to}
              className={`bg-gradient-to-br ${action.gradientClass} border ${action.borderClass} rounded-2xl p-6 hover:border-opacity-80 transition-all`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className={action.textClass} size={24} />
                <h3 className="text-lg font-bold text-white">{action.title}</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">{action.description}</p>
              <div className={`${action.textClass} text-sm font-semibold`}>
                {action.cta}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
