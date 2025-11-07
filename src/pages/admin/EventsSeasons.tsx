import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Clock,
  Users,
  Tag,
  Settings,
  Snowflake,
  Sun,
  Leaf,
  Gift,
  Star,
  Heart,
  Sparkles,
  Save,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/modal";

type EventTypeKey = "seasonal" | "holiday" | "custom";
type EventStatusKey = "active" | "upcoming" | "ended";
type EventIconKey = "gift" | "star" | "sun" | "snowflake" | "heart" | "leaf" | "sparkles";

type TimeRangeValue = "thisWeek" | "nextMonth" | "thisYear";

type EventSortValue = "startDate" | "createdAt" | "status" | "offers";

interface Event {
  id: string;
  nameKey: string;
  type: EventTypeKey;
  icon: EventIconKey;
  startDate: string;
  endDate: string;
  status: EventStatusKey;
  descriptionKey: string;
  discountRange: string;
  affectedOffers: number;
  expectedRevenue: number;
  createdAt: string;
  isAutoManaged: boolean;
}

const iconComponents: Record<EventIconKey, LucideIcon> = {
  gift: Gift,
  star: Star,
  sun: Sun,
  snowflake: Snowflake,
  heart: Heart,
  leaf: Leaf,
  sparkles: Sparkles,
};

export default function AdminEventsPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "is" ? "is-IS" : "en-US";

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRangeValue>("nextMonth");
  const [sortOrder, setSortOrder] = useState<EventSortValue>("startDate");
  const [searchTerm, setSearchTerm] = useState("");

  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      nameKey: "adminEvents.events.christmasSeason.name",
      type: "holiday",
      icon: "gift",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      status: "active",
      descriptionKey: "adminEvents.events.christmasSeason.description",
      discountRange: "15-30%",
      affectedOffers: 45,
      expectedRevenue: 750000,
      createdAt: "2024-11-01",
      isAutoManaged: true,
    },
    {
      id: "2",
      nameKey: "adminEvents.events.blackFriday.name",
      type: "holiday",
      icon: "star",
      startDate: "2024-11-24",
      endDate: "2024-11-27",
      status: "ended",
      descriptionKey: "adminEvents.events.blackFriday.description",
      discountRange: "20-50%",
      affectedOffers: 67,
      expectedRevenue: 1200000,
      createdAt: "2024-10-15",
      isAutoManaged: true,
    },
    {
      id: "3",
      nameKey: "adminEvents.events.summerSeason.name",
      type: "seasonal",
      icon: "sun",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      status: "ended",
      descriptionKey: "adminEvents.events.summerSeason.description",
      discountRange: "10-25%",
      affectedOffers: 38,
      expectedRevenue: 580000,
      createdAt: "2024-05-01",
      isAutoManaged: true,
    },
    {
      id: "4",
      nameKey: "adminEvents.events.valentinesDay.name",
      type: "holiday",
      icon: "heart",
      startDate: "2025-02-10",
      endDate: "2025-02-14",
      status: "upcoming",
      descriptionKey: "adminEvents.events.valentinesDay.description",
      discountRange: "15-25%",
      affectedOffers: 23,
      expectedRevenue: 320000,
      createdAt: "2024-12-15",
      isAutoManaged: true,
    },
    {
      id: "5",
      nameKey: "adminEvents.events.restaurantWeek.name",
      type: "custom",
      icon: "leaf",
      startDate: "2025-03-15",
      endDate: "2025-03-21",
      status: "upcoming",
      descriptionKey: "adminEvents.events.restaurantWeek.description",
      discountRange: "20-30%",
      affectedOffers: 18,
      expectedRevenue: 245000,
      createdAt: "2024-12-20",
      isAutoManaged: false,
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    name: "",
    type: "custom" as EventTypeKey,
    icon: "sparkles" as EventIconKey,
    startDate: "",
    endDate: "",
    description: "",
    discountRange: "",
    isAutoManaged: false,
  });

  const timeRangeOptions = useMemo(
    () => [
      { value: "thisWeek" as TimeRangeValue, label: t("adminEvents.filters.timeRange.thisWeek") },
      { value: "nextMonth" as TimeRangeValue, label: t("adminEvents.filters.timeRange.nextMonth") },
      { value: "thisYear" as TimeRangeValue, label: t("adminEvents.filters.timeRange.thisYear") },
    ],
    [t]
  );

  const sortOptions = useMemo(
    () => [
      { value: "startDate" as EventSortValue, label: t("adminEvents.filters.sort.startDate") },
      { value: "createdAt" as EventSortValue, label: t("adminEvents.filters.sort.createdAt") },
      { value: "status" as EventSortValue, label: t("adminEvents.filters.sort.status") },
      { value: "offers" as EventSortValue, label: t("adminEvents.filters.sort.offers") },
    ],
    [t]
  );

  const formatDate = (value: string) =>
    value ? new Date(value).toLocaleDateString(locale) : "";
  const formatCurrency = (value: number) =>
    t("adminEvents.common.currency", { value: value.toLocaleString(locale) });

  const handleCreateEvent = async () => {
    if (!newEvent.name.trim() || !newEvent.startDate || !newEvent.endDate || !newEvent.description.trim()) {
      window.alert(t("adminEvents.create.validation"));
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const createdEvent: Event = {
      id: Date.now().toString(),
      nameKey: newEvent.name,
      type: newEvent.type,
      icon: newEvent.icon,
      startDate: newEvent.startDate,
      endDate: newEvent.endDate,
      status: new Date(newEvent.startDate) > new Date() ? "upcoming" : "active",
      descriptionKey: newEvent.description,
      discountRange: newEvent.discountRange || "10-30%",
      affectedOffers: 0,
      expectedRevenue: 0,
      createdAt: new Date().toISOString().split("T")[0],
      isAutoManaged: newEvent.isAutoManaged,
    };

    setEvents((prev) => [...prev, createdEvent]);
    setShowCreateModal(false);
    setNewEvent({
      name: "",
      type: "custom",
      icon: "sparkles",
      startDate: "",
      endDate: "",
      description: "",
      discountRange: "",
      isAutoManaged: false,
    });
    setIsSaving(false);
    window.alert(t("adminEvents.create.success"));
  };

  const filteredAndSortedEvents = useMemo(() => {
    const now = new Date();

    const matchesTimeRange = (event: Event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);

      switch (timeRange) {
        case "thisWeek": {
          const weekAhead = new Date(now);
          weekAhead.setDate(now.getDate() + 7);
          return end >= now && start <= weekAhead;
        }
        case "thisYear":
          return (
            start.getFullYear() === now.getFullYear() ||
            end.getFullYear() === now.getFullYear()
          );
        case "nextMonth":
        default: {
          const monthAhead = new Date(now);
          monthAhead.setDate(now.getDate() + 30);
          return end >= now && start <= monthAhead;
        }
      }
    };

    const filtered = events.filter((event) => {
      const matchesRange = matchesTimeRange(event);
      if (!searchTerm.trim()) {
        return matchesRange;
      }
      const name = t(event.nameKey).toLowerCase();
      const description = t(event.descriptionKey).toLowerCase();
      const term = searchTerm.toLowerCase();
      return matchesRange && (name.includes(term) || description.includes(term));
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "status":
          return t(`adminEvents.data.statusOrder.${a.status}`)
            .localeCompare(t(`adminEvents.data.statusOrder.${b.status}`));
        case "offers":
          return b.affectedOffers - a.affectedOffers;
        case "startDate":
        default:
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
    });

    return sorted;
  }, [events, sortOrder, searchTerm, timeRange, t]);

  const stats = useMemo(
    () => ({
      total: events.length,
      active: events.filter((e) => e.status === "active").length,
      upcoming: events.filter((e) => e.status === "upcoming").length,
      totalOffers: events.reduce((sum, e) => sum + e.affectedOffers, 0),
      expectedRevenue: events.reduce((sum, e) => sum + e.expectedRevenue, 0),
      autoManaged: events.filter((e) => e.isAutoManaged).length,
    }),
    [events]
  );

  const getEventIcon = (iconName: EventIconKey) => {
    const Icon = iconComponents[iconName] ?? Calendar;
    return <Icon size={20} />;
  };

  const getTypeColor = (type: EventTypeKey) => {
    switch (type) {
      case "holiday":
        return "bg-red-500/10 text-red-500";
      case "seasonal":
        return "bg-blue-500/10 text-blue-500";
      case "custom":
      default:
        return "bg-purple-500/10 text-purple-500";
    }
  };

  const getStatusColor = (status: EventStatusKey) => {
    switch (status) {
      case "active":
        return "bg-green/10 text-green";
      case "upcoming":
        return "bg-yellow-500/10 text-yellow-500";
      case "ended":
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const timeRangeSummary = useMemo(() => {
    const upcomingEvents = events.filter((event) => event.status === "upcoming");
    if (!upcomingEvents.length) {
      return t("adminEvents.upcoming.none");
    }

    return upcomingEvents
      .slice(0, 2)
      .map((event) =>
        t("adminEvents.upcoming.summaryItem", {
          name: t(event.nameKey),
          days: Math.max(
            0,
            Math.ceil(
              (new Date(event.startDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )
          ),
        })
      )
      .join(" ");
  }, [events, t]);

  const resetNewEvent = () => {
    setNewEvent({
      name: "",
      type: "custom",
      icon: "sparkles",
      startDate: "",
      endDate: "",
      description: "",
      discountRange: "",
      isAutoManaged: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/dashboard"
            className="p-2 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <ArrowLeft className="text-red-500" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {t("adminEvents.header.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminEvents.header.subtitle")}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-all"
        >
          <Plus size={20} />
          {t("adminEvents.header.createButton")}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminEvents.filters.timeRangeLabel")}
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRangeValue)}
              className="w-full px-4 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              {timeRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminEvents.filters.sortLabel")}
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as EventSortValue)}
              className="w-full px-4 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminEvents.filters.searchLabel")}
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("adminEvents.filters.searchPlaceholder") ?? ""}
              className="w-full px-4 py-2 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminEvents.stats.total")}
              </p>
              <p className="text-white text-2xl font-bold">{stats.total}</p>
            </div>
            <Calendar className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminEvents.stats.active")}
              </p>
              <p className="text-white text-2xl font-bold">{stats.active}</p>
            </div>
            <Clock className="text-green" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-yellow-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminEvents.stats.upcoming")}
              </p>
              <p className="text-white text-2xl font-bold">{stats.upcoming}</p>
            </div>
            <Calendar className="text-yellow-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminEvents.stats.offers")}
              </p>
              <p className="text-white text-2xl font-bold">{stats.totalOffers}</p>
            </div>
            <Tag className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-purple-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminEvents.stats.expectedRevenue")}
              </p>
              <p className="text-white text-2xl font-bold">{formatCurrency(stats.expectedRevenue)}</p>
            </div>
            <Users className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-orange-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminEvents.stats.autoManaged")}
              </p>
              <p className="text-white text-2xl font-bold">{stats.autoManaged}</p>
            </div>
            <Settings className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredAndSortedEvents.map((event) => (
          <div
            key={event.id}
            className="bg-card-background border border-primary rounded-2xl p-6 hover:border-primary/80 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    event.type === "holiday" ? "bg-red-500/10" :
                    event.type === "seasonal" ? "bg-blue-500/10" :
                    "bg-purple-500/10"
                  }`}>
                    <span className={`${
                      event.type === "holiday" ? "text-red-500" :
                      event.type === "seasonal" ? "text-blue-500" :
                      "text-purple-500"
                    }`}>
                      {getEventIcon(event.icon)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t(event.nameKey)}</h3>
                    <p className="text-gray-400 text-sm">{t(event.descriptionKey)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">{t("adminEvents.data.typeLabel")}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(event.type)}`}>
                      {t(`adminEvents.data.types.${event.type}`)}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400">{t("adminEvents.data.statusLabel")}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                      {t(`adminEvents.data.statuses.${event.status}`)}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400">{t("adminEvents.data.durationLabel")}</p>
                    <p className="text-white font-medium">
                      {formatDate(event.startDate)} - {formatDate(event.endDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">{t("adminEvents.data.discountRangeLabel")}</p>
                    <p className="text-white font-medium">{event.discountRange}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-gray-400">{t("adminEvents.data.affectedOffersLabel")}</p>
                    <p className="text-white font-medium">{event.affectedOffers}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">{t("adminEvents.data.expectedRevenueLabel")}</p>
                    <p className="text-white font-medium">{formatCurrency(event.expectedRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">{t("adminEvents.data.autoManagedLabel")}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${event.isAutoManaged ? "bg-green/10 text-green" : "bg-gray-500/10 text-gray-500"}`}>
                      {event.isAutoManaged ? t("adminEvents.data.autoManagedOptions.yes") : t("adminEvents.data.autoManagedOptions.no")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all">
                  <Eye size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                  <Edit size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Management */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">{t("adminEvents.management.title")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Settings className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-blue-500 font-bold mb-1">{t("adminEvents.management.autoManaged.title")}</h4>
                <p className="text-sm text-gray-300">
                  {t("adminEvents.management.autoManaged.description")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Tag className="text-green flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-green font-bold mb-1">{t("adminEvents.management.customEvents.title")}</h4>
                <p className="text-sm text-gray-300">
                  {t("adminEvents.management.customEvents.description")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-purple-500 font-bold mb-1">{t("adminEvents.management.seasonalEvents.title")}</h4>
                <p className="text-sm text-gray-300">
                  {t("adminEvents.management.seasonalEvents.description")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-orange-500 font-bold mb-1">{t("adminEvents.management.impactTracking.title")}</h4>
                <p className="text-sm text-gray-300">
                  {t("adminEvents.management.impactTracking.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events Alert */}
      <div className="bg-yellow/10 border border-yellow rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Calendar className="text-yellow flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-yellow font-bold mb-1">
              {t("adminEvents.upcoming.alertTitle")}
            </h3>
            <p className="text-sm text-gray-300">
              {timeRangeSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetNewEvent();
        }}
        title={t("adminEvents.create.modalTitle")}
      >
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminEvents.create.eventNameLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newEvent.name}
              onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              placeholder={t("adminEvents.create.eventNamePlaceholder")}
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminEvents.create.eventTypeLabel")} <span className="text-red-500">*</span>
            </label>
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as EventTypeKey }))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="custom">{t("adminEvents.create.eventType.custom")}</option>
              <option value="holiday">{t("adminEvents.create.eventType.holiday")}</option>
              <option value="seasonal">{t("adminEvents.create.eventType.seasonal")}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminEvents.create.startDateLabel")} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {t("adminEvents.create.endDateLabel")} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminEvents.create.descriptionLabel")} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary resize-none"
              placeholder={t("adminEvents.create.descriptionPlaceholder")}
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              {t("adminEvents.create.discountRangeLabel")}
            </label>
            <input
              type="text"
              value={newEvent.discountRange}
              onChange={(e) => setNewEvent(prev => ({ ...prev, discountRange: e.target.value }))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              placeholder={t("adminEvents.create.discountRangePlaceholder")}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoManaged"
              checked={newEvent.isAutoManaged}
              onChange={(e) => setNewEvent(prev => ({ ...prev, isAutoManaged: e.target.checked }))}
              className="w-5 h-5 rounded border-primary/50 bg-background text-primary focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="autoManaged" className="text-gray-400 text-sm">
              {t("adminEvents.create.autoManagedLabel")}
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-primary/30">
            <button
              onClick={() => {
                setShowCreateModal(false);
                resetNewEvent();
              }}
              className="px-6 py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all"
            >
              {t("adminEvents.create.cancelButton")}
            </button>
            <button
              onClick={handleCreateEvent}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("adminEvents.create.creating")}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {t("adminEvents.create.createButton")}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

