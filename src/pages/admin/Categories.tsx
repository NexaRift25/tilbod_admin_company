import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  ArrowLeft,
  Search,
  Filter,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Category {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  offersCount?: number;
  companiesCount?: number;
  activeOffers: boolean;
  weekdaysOffers: boolean;
  happyHour: boolean;
  giftCards: boolean;
}

export default function CategoriesPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "is" ? "is-IS" : "en-US";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeOffersFilter, setActiveOffersFilter] = useState<string>("all");
  const [weekdaysOffersFilter, setWeekdaysOffersFilter] = useState<string>("all");
  const [happyHourFilter, setHappyHourFilter] = useState<string>("all");
  const [giftCardsFilter, setGiftCardsFilter] = useState<string>("all");

  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Food & Dining",
      description: "Restaurants, cafes, bars, and food services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 456,
      companiesCount: 45,
      activeOffers: true,
      weekdaysOffers: true,
      happyHour: true,
      giftCards: true,
    },
    {
      id: "2",
      name: "Hotels & Accommodation",
      description: "Hotels, guesthouses, and accommodation services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 245,
      companiesCount: 32,
      activeOffers: true,
      weekdaysOffers: true,
      happyHour: true,
      giftCards: true,
    },
    {
      id: "3",
      name: "Wellness & Spa",
      description: "Spas, wellness centers, and relaxation services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 123,
      companiesCount: 28,
      activeOffers: true,
      weekdaysOffers: false,
      happyHour: false,
      giftCards: true,
    },
    {
      id: "4",
      name: "Activities & Entertainment",
      description: "Tours, activities, and entertainment services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 234,
      companiesCount: 25,
      activeOffers: true,
      weekdaysOffers: true,
      happyHour: true,
      giftCards: true,
    },
    {
      id: "5",
      name: "Retail & Services",
      description: "Retail stores, shops, and shopping services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 89,
      companiesCount: 15,
      activeOffers: true,
      weekdaysOffers: false,
      happyHour: false,
      giftCards: true,
    },
    {
      id: "6",
      name: "Beauty & Personal Care",
      description: "Beauty salons, personal care, and grooming services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 67,
      companiesCount: 11,
      activeOffers: true,
      weekdaysOffers: true,
      happyHour: true,
      giftCards: true,
    },
    {
      id: "7",
      name: "Health & Fitness",
      description: "Gyms, fitness centers, and health services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 45,
      companiesCount: 8,
      activeOffers: true,
      weekdaysOffers: true,
      happyHour: true,
      giftCards: true,
    },
    {
      id: "8",
      name: "Travel & Tourism",
      description: "Travel agencies, tour operators, and tourism services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 156,
      companiesCount: 18,
      activeOffers: true,
      weekdaysOffers: true,
      happyHour: true,
      giftCards: true,
    },
    {
      id: "9",
      name: "Education & Training",
      description: "Educational institutions, training centers, and courses",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 34,
      companiesCount: 6,
      activeOffers: true,
      weekdaysOffers: false,
      happyHour: false,
      giftCards: true,
    },
    {
      id: "10",
      name: "Professional Services",
      description: "Law, marketing, IT, and other professional services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 23,
      companiesCount: 5,
      activeOffers: true,
      weekdaysOffers: false,
      happyHour: false,
      giftCards: true,
    },
  ]);

  const statusFilterOptions = useMemo(
    () => [
      { value: "all", label: t("adminCategories.filters.status.all") },
      { value: "active", label: t("adminCategories.filters.status.active") },
      {
        value: "inactive",
        label: t("adminCategories.filters.status.inactive"),
      },
    ],
    [t]
  );

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || category.status === statusFilter;
      const matchesActiveOffers =
        activeOffersFilter === "all" ||
        (activeOffersFilter === "true" && category.activeOffers) ||
        (activeOffersFilter === "false" && !category.activeOffers);
      const matchesWeekdaysOffers =
        weekdaysOffersFilter === "all" ||
        (weekdaysOffersFilter === "true" && category.weekdaysOffers) ||
        (weekdaysOffersFilter === "false" && !category.weekdaysOffers);
      const matchesHappyHour =
        happyHourFilter === "all" ||
        (happyHourFilter === "true" && category.happyHour) ||
        (happyHourFilter === "false" && !category.happyHour);
      const matchesGiftCards =
        giftCardsFilter === "all" ||
        (giftCardsFilter === "true" && category.giftCards) ||
        (giftCardsFilter === "false" && !category.giftCards);
      return (
        matchesSearch &&
        matchesStatus &&
        matchesActiveOffers &&
        matchesWeekdaysOffers &&
        matchesHappyHour &&
        matchesGiftCards
      );
    });
  }, [
    categories,
    searchTerm,
    statusFilter,
    activeOffersFilter,
    weekdaysOffersFilter,
    happyHourFilter,
    giftCardsFilter,
  ]);

  const handleToggleOfferType = (
    categoryId: string,
    offerType: keyof Pick<
      Category,
      "activeOffers" | "weekdaysOffers" | "happyHour" | "giftCards"
    >
  ) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              [offerType]: !cat[offerType],
              updatedAt: new Date().toISOString(),
            }
          : cat
      )
    );
  };

  const handleToggleStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id
          ? {
              ...cat,
              status: cat.status === "active" ? "inactive" : "active",
              updatedAt: new Date().toISOString(),
            }
          : cat
      )
    );
  };

  const getStatusColor = (status: string) =>
    status === "active"
      ? "bg-green/10 text-green border-green"
      : "bg-red-500/50 text-gray-400 border-gray-500";

  const getStatusLabel = (status: Category["status"]) =>
    t(`adminCategories.status.${status}`);


  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

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
              {t("adminCategories.header.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminCategories.header.subtitle")}
            </p>
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
                placeholder={
                  t("adminCategories.filters.searchPlaceholder") ?? ""
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary text-sm"
            >
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={activeOffersFilter}
              onChange={(e) => setActiveOffersFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary text-sm"
            >
              <option value="all">{t("adminCategories.filters.activeOffers.all")}</option>
              <option value="true">{t("adminCategories.filters.activeOffers.enabled")}</option>
              <option value="false">{t("adminCategories.filters.activeOffers.disabled")}</option>
            </select>
            <select
              value={weekdaysOffersFilter}
              onChange={(e) => setWeekdaysOffersFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary text-sm"
            >
              <option value="all">{t("adminCategories.filters.weekdaysOffers.all")}</option>
              <option value="true">{t("adminCategories.filters.weekdaysOffers.enabled")}</option>
              <option value="false">{t("adminCategories.filters.weekdaysOffers.disabled")}</option>
            </select>
            <select
              value={happyHourFilter}
              onChange={(e) => setHappyHourFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary text-sm"
            >
              <option value="all">{t("adminCategories.filters.happyHour.all")}</option>
              <option value="true">{t("adminCategories.filters.happyHour.enabled")}</option>
              <option value="false">{t("adminCategories.filters.happyHour.disabled")}</option>
            </select>
            <select
              value={giftCardsFilter}
              onChange={(e) => setGiftCardsFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary text-sm"
            >
              <option value="all">{t("adminCategories.filters.giftCards.all")}</option>
              <option value="true">{t("adminCategories.filters.giftCards.enabled")}</option>
              <option value="false">{t("adminCategories.filters.giftCards.disabled")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center">
            <FolderOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">
              {t("adminCategories.empty.title")}
            </h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? t("adminCategories.empty.searchAdjust")
                : t("adminCategories.empty.createFirst")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-primary/50">
                  <th className="pb-3 pr-4">
                    {t("adminCategories.table.companyCategory")}
                  </th>
                  <th className="pb-3 text-center">
                    {t("adminCategories.table.activeOffers")}
                  </th>
                  <th className="pb-3 text-center">
                    {t("adminCategories.table.weekdaysOffers")}
                  </th>
                  <th className="pb-3 text-center">
                    {t("adminCategories.table.happyHour")}
                  </th>
                  <th className="pb-3 text-center">
                    {t("adminCategories.table.giftCards")}
                  </th>
                </tr>
              </thead>
              <tbody className="text-white">
                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-primary/10 hover:bg-primary/5"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="text-primary" size={18} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={category.activeOffers}
                          onChange={() =>
                            handleToggleOfferType(category.id, "activeOffers")
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
                      </label>
                    </td>
                    <td className="py-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={category.weekdaysOffers}
                          onChange={() =>
                            handleToggleOfferType(category.id, "weekdaysOffers")
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
                      </label>
                    </td>
                    <td className="py-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={category.happyHour}
                          onChange={() =>
                            handleToggleOfferType(category.id, "happyHour")
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
                      </label>
                    </td>
                    <td className="py-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={category.giftCards}
                          onChange={() =>
                            handleToggleOfferType(category.id, "giftCards")
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
                      </label>
                    </td>
                    <td className="py-4"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
