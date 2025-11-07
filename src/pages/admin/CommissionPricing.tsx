import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  ArrowLeft,
  Tag,
  Calendar,
  Clock,
  CreditCard,
  Settings,
  CheckCircle,
  Edit,
  Plus,
} from "lucide-react";
import { useTranslation } from "react-i18next";

type CommissionUnit = "day" | "week" | "month" | "percentage";
type OfferTypeKey = "active" | "weekdays" | "happyHour" | "giftCard";
type PricingRuleType = "discount" | "markup" | "fixed";
type PricingApplicableKey =
  | "activeOffer"
  | "weekdaysOffer"
  | "giftCard"
  | "hotelsAccommodation"
  | "default";

interface CommissionRule {
  id: string;
  offerType: OfferTypeKey;
  rate: number;
  unit: CommissionUnit;
  descriptionKey: string;
  isActive: boolean;
  lastUpdated: string;
  updatedByKey: string;
}

interface PricingRule {
  id: string;
  nameKey: string;
  type: PricingRuleType;
  value: number;
  unit: "percentage" | "amount";
  descriptionKey: string;
  isActive: boolean;
  applicableToKeys: PricingApplicableKey[];
  createdAt: string;
}

const currentDate = () => new Date().toISOString().split("T")[0];

export default function AdminPricingPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "is" ? "is-IS" : "en-US";
  const formatDate = (value: string | number | Date) =>
    new Date(value).toLocaleDateString(locale);
  const formatCurrency = (value: number) => value.toLocaleString(locale);

  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([
    {
      id: "1",
      offerType: "active",
      rate: 1,
      unit: "day",
      descriptionKey:
        "adminCommissionPricing.commissionRules.types.active.description",
      isActive: true,
      lastUpdated: currentDate(),
      updatedByKey: "adminCommissionPricing.updatedBy.adminUser",
    },
    {
      id: "2",
      offerType: "weekdays",
      rate: 4,
      unit: "week",
      descriptionKey:
        "adminCommissionPricing.commissionRules.types.weekdays.description",
      isActive: true,
      lastUpdated: currentDate(),
      updatedByKey: "adminCommissionPricing.updatedBy.adminUser",
    },
    {
      id: "3",
      offerType: "happyHour",
      rate: 10,
      unit: "month",
      descriptionKey:
        "adminCommissionPricing.commissionRules.types.happyHour.description",
      isActive: true,
      lastUpdated: currentDate(),
      updatedByKey: "adminCommissionPricing.updatedBy.adminUser",
    },
    {
      id: "4",
      offerType: "giftCard",
      rate: 5,
      unit: "percentage",
      descriptionKey:
        "adminCommissionPricing.commissionRules.types.giftCard.description",
      isActive: true,
      lastUpdated: currentDate(),
      updatedByKey: "adminCommissionPricing.updatedBy.adminUser",
    },
  ]);

  const [pricingRules, setPricingRules] = useState<PricingRule[]>([
    {
      id: "1",
      nameKey: "adminCommissionPricing.pricingRules.names.holidayDiscount",
      type: "discount",
      value: 15,
      unit: "percentage",
      descriptionKey:
        "adminCommissionPricing.pricingRules.descriptions.holidayDiscount",
      isActive: true,
      applicableToKeys: ["activeOffer", "weekdaysOffer"],
      createdAt: "2024-11-01",
    },
    {
      id: "2",
      nameKey: "adminCommissionPricing.pricingRules.names.premiumMarkup",
      type: "markup",
      value: 2000,
      unit: "amount",
      descriptionKey:
        "adminCommissionPricing.pricingRules.descriptions.premiumMarkup",
      isActive: true,
      applicableToKeys: ["hotelsAccommodation"],
      createdAt: "2024-11-15",
    },
  ]);

  const [editingCommission, setEditingCommission] = useState<string | null>(
    null
  );
  const [editingPricing, setEditingPricing] = useState<string | null>(null);

  const handleCommissionEdit = (id: string) => setEditingCommission(id);
  const handlePricingEdit = (id: string) => setEditingPricing(id);

  const handleCommissionSave = (id: string, newRate: number) => {
    setCommissionRules((prev) =>
      prev.map((rule) =>
        rule.id === id
          ? { ...rule, rate: newRate, lastUpdated: currentDate() }
          : rule
      )
    );
    setEditingCommission(null);
  };

  const handlePricingSave = (id: string, newValue: number) => {
    setPricingRules((prev) =>
      prev.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              value: newValue,
            }
          : rule
      )
    );
    setEditingPricing(null);
  };

  const toggleCommissionStatus = (id: string) => {
    setCommissionRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const togglePricingStatus = (id: string) => {
    setPricingRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const activeCommissionCount = useMemo(
    () => commissionRules.filter((rule) => rule.isActive).length,
    [commissionRules]
  );

  const activePricingRules = useMemo(
    () => pricingRules.filter((rule) => rule.isActive).length,
    [pricingRules]
  );

  const categoriesAffected = useMemo(
    () => new Set(pricingRules.flatMap((rule) => rule.applicableToKeys)).size,
    [pricingRules]
  );

  const getRateLabel = (rule: CommissionRule) =>
    rule.unit === "percentage"
      ? t("adminCommissionPricing.commissionRules.rate.percentage", {
          rate: rule.rate,
        })
      : t("adminCommissionPricing.commissionRules.rate.value", {
          rate: formatCurrency(rule.rate),
          unit: t(`adminCommissionPricing.units.${rule.unit}`),
        });

  const getPricingValueLabel = (rule: PricingRule) =>
    rule.unit === "percentage"
      ? t("adminCommissionPricing.pricingRules.valueDisplay.percentage", {
          value: rule.value,
        })
      : t("adminCommissionPricing.pricingRules.valueDisplay.amount", {
          amount: formatCurrency(rule.value),
        });

  const getApplicableLabel = (key: PricingApplicableKey) =>
    t(`adminCommissionPricing.pricingRules.applicable.${key}`);

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
              {t("adminCommissionPricing.header.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("adminCommissionPricing.header.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminCommissionPricing.cards.activeCommissions")}
              </p>
              <p className="text-white text-2xl font-bold">
                {activeCommissionCount}
              </p>
            </div>
            <DollarSign className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminCommissionPricing.cards.commissionRules")}
              </p>
              <p className="text-white text-2xl font-bold">
                {activeCommissionCount}/{commissionRules.length}
              </p>
            </div>
            <TrendingUp className="text-green" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminCommissionPricing.cards.activePricing")}
              </p>
              <p className="text-white text-2xl font-bold">
                {activePricingRules}
              </p>
            </div>
            <Settings className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-purple-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminCommissionPricing.cards.categoriesAffected")}
              </p>
              <p className="text-white text-2xl font-bold">
                {categoriesAffected}
              </p>
            </div>
            <Tag className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Commission Rules */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">
            {t("adminCommissionPricing.commissionRules.title")}
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all">
            <Plus size={20} />
            {t("adminCommissionPricing.commissionRules.addButton")}
          </button>
        </div>

        <div className="space-y-4">
          {commissionRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-background border border-primary/30 rounded-lg p-6 hover:border-primary transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${rule.isActive ? "bg-green" : "bg-gray-500"}`}
                  />
                  <h4 className="font-bold text-white">
                    {t(
                      `adminCommissionPricing.commissionRules.types.${rule.offerType}.title`
                    )}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      rule.isActive
                        ? "bg-green/10 text-green"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {t(
                      rule.isActive
                        ? "adminCommissionPricing.common.active"
                        : "adminCommissionPricing.common.inactive"
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCommissionStatus(rule.id)}
                    className={`px-3 py-1.5 font-semibold rounded-lg transition-all text-sm ${
                      rule.isActive
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green text-white hover:bg-green"
                    }`}
                  >
                    {t(
                      rule.isActive
                        ? "adminCommissionPricing.commissionRules.actions.deactivate"
                        : "adminCommissionPricing.commissionRules.actions.activate"
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    {t("adminCommissionPricing.commissionRules.rate.label")}
                  </p>
                  {editingCommission === rule.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue={rule.rate}
                        className="px-3 py-2 bg-card-background border border-primary rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const value = parseFloat(
                              (e.target as HTMLInputElement).value
                            );
                            if (!isNaN(value)) {
                              handleCommissionSave(rule.id, value);
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => handleCommissionSave(rule.id, rule.rate)}
                        className="p-1 hover:bg-primary/10 rounded"
                      >
                        <CheckCircle size={16} className="text-green" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold">{getRateLabel(rule)}</p>
                      <button
                        onClick={() => handleCommissionEdit(rule.id)}
                        className="p-1 hover:bg-primary/10 rounded"
                        title={t(
                          "adminCommissionPricing.commissionRules.rate.editTooltip"
                        )}
                      >
                        <Edit size={16} className="text-primary" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    {t("adminCommissionPricing.commissionRules.description")}
                  </p>
                  <p className="text-white text-sm">{t(rule.descriptionKey)}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    {t("adminCommissionPricing.commissionRules.lastUpdatedLabel")}
                  </p>
                  <p className="text-white text-sm">
                    {t("adminCommissionPricing.commissionRules.lastUpdated", {
                      date: formatDate(rule.lastUpdated),
                      user: t(rule.updatedByKey),
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Rules */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">
            {t("adminCommissionPricing.pricingRules.title")}
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all">
            <Plus size={20} />
            {t("adminCommissionPricing.pricingRules.addButton")}
          </button>
        </div>

        <div className="space-y-4">
          {pricingRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-background border border-primary/30 rounded-lg p-6 hover:border-primary transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${rule.isActive ? "bg-green" : "bg-gray-500"}`}
                  />
                  <h4 className="font-bold text-white">{t(rule.nameKey)}</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      rule.isActive
                        ? "bg-green/10 text-green"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {t(
                      rule.isActive
                        ? "adminCommissionPricing.common.active"
                        : "adminCommissionPricing.common.inactive"
                    )}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      rule.type === "discount"
                        ? "bg-blue-500/10 text-blue-500"
                        : rule.type === "markup"
                        ? "bg-orange-500/10 text-orange-500"
                        : "bg-purple-500/10 text-purple-500"
                    }`}
                  >
                    {t(`adminCommissionPricing.pricingRules.types.${rule.type}`)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePricingStatus(rule.id)}
                    className={`px-3 py-1.5 font-semibold rounded-lg transition-all text-sm ${
                      rule.isActive
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green text-white hover:bg-green"
                    }`}
                  >
                    {t(
                      rule.isActive
                        ? "adminCommissionPricing.pricingRules.actions.deactivate"
                        : "adminCommissionPricing.pricingRules.actions.activate"
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    {t("adminCommissionPricing.pricingRules.valueLabel")}
                  </p>
                  {editingPricing === rule.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue={rule.value}
                        className="px-3 py-2 bg-card-background border border-primary rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const value = parseFloat(
                              (e.target as HTMLInputElement).value
                            );
                            if (!isNaN(value)) {
                              handlePricingSave(rule.id, value);
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => handlePricingSave(rule.id, rule.value)}
                        className="p-1 hover:bg-primary/10 rounded"
                      >
                        <CheckCircle size={16} className="text-green" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold">
                        {getPricingValueLabel(rule)}
                      </p>
                      <button
                        onClick={() => handlePricingEdit(rule.id)}
                        className="p-1 hover:bg-primary/10 rounded"
                      >
                        <Edit size={16} className="text-primary" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    {t("adminCommissionPricing.pricingRules.descriptionLabel")}
                  </p>
                  <p className="text-white text-sm">{t(rule.descriptionKey)}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    {t("adminCommissionPricing.pricingRules.applicableLabel")}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {rule.applicableToKeys.map((category) => (
                      <span
                        key={category}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {getApplicableLabel(category)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Summary */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">
            {t("adminCommissionPricing.summary.title")}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {commissionRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-background/50 border border-primary/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-white">
                  {t(
                    `adminCommissionPricing.commissionRules.types.${rule.offerType}.title`
                  )}
                </h4>
                <span
                  className={`w-2 h-2 rounded-full ${rule.isActive ? "bg-green" : "bg-gray-500"}`}
                />
              </div>
              <p className="text-primary font-bold text-lg">
                {getRateLabel(rule)}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {t(rule.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Calculator */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          {t("adminCommissionPricing.calculator.title")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <DollarSign className="text-green flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-green font-bold mb-1">
                  {t("adminCommissionPricing.calculator.examples.active.title")}
                </h4>
                <p className="text-sm text-gray-300">
                  {t(
                    "adminCommissionPricing.calculator.examples.active.description"
                  )}
                </p>
                <div className="mt-2 p-3 bg-background rounded-lg border border-primary/30">
                  <p className="text-white font-medium">
                    {t(
                      "adminCommissionPricing.calculator.examples.active.example"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-blue-500 font-bold mb-1">
                  {t(
                    "adminCommissionPricing.calculator.examples.weekdays.title"
                  )}
                </h4>
                <p className="text-sm text-gray-300">
                  {t(
                    "adminCommissionPricing.calculator.examples.weekdays.description"
                  )}
                </p>
                <div className="mt-2 p-3 bg-background rounded-lg border border-primary/30">
                  <p className="text-white font-medium">
                    {t(
                      "adminCommissionPricing.calculator.examples.weekdays.example"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-purple-500 font-bold mb-1">
                  {t(
                    "adminCommissionPricing.calculator.examples.happyHour.title"
                  )}
                </h4>
                <p className="text-sm text-gray-300">
                  {t(
                    "adminCommissionPricing.calculator.examples.happyHour.description"
                  )}
                </p>
                <div className="mt-2 p-3 bg-background rounded-lg border border-primary/30">
                  <p className="text-white font-medium">
                    {t(
                      "adminCommissionPricing.calculator.examples.happyHour.example"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-orange-500 font-bold mb-1">
                  {t(
                    "adminCommissionPricing.calculator.examples.giftCard.title"
                  )}
                </h4>
                <p className="text-sm text-gray-300">
                  {t(
                    "adminCommissionPricing.calculator.examples.giftCard.description"
                  )}
                </p>
                <div className="mt-2 p-3 bg-background rounded-lg border border-primary/30">
                  <p className="text-white font-medium">
                    {t(
                      "adminCommissionPricing.calculator.examples.giftCard.example"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

