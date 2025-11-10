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
import Modal from "@/components/ui/modal";

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

interface AddPricingFormState {
  name: string;
  description: string;
  type: PricingRuleType;
  value: string;
  unit: "percentage" | "amount";
  applicableToKeys: PricingApplicableKey[];
}

interface AddCommissionFormState {
  offerType: OfferTypeKey;
  rate: string;
}

const currentDate = () => new Date().toISOString().split("T")[0];

const commissionOfferTypes: OfferTypeKey[] = [
  "active",
  "weekdays",
  "happyHour",
  "giftCard",
];

const offerTypeConfig: Record<
  OfferTypeKey,
  { unit: CommissionUnit; descriptionKey: string }
> = {
  active: {
    unit: "day",
    descriptionKey:
      "adminCommissionPricing.commissionRules.types.active.description",
  },
  weekdays: {
    unit: "week",
    descriptionKey:
      "adminCommissionPricing.commissionRules.types.weekdays.description",
  },
  happyHour: {
    unit: "month",
    descriptionKey:
      "adminCommissionPricing.commissionRules.types.happyHour.description",
  },
  giftCard: {
    unit: "percentage",
    descriptionKey:
      "adminCommissionPricing.commissionRules.types.giftCard.description",
  },
};

const pricingApplicableOptions: PricingApplicableKey[] = [
  "activeOffer",
  "weekdaysOffer",
  "giftCard",
  "hotelsAccommodation",
  "default",
];

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
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [commissionForm, setCommissionForm] = useState<AddCommissionFormState>({
    offerType: "active",
    rate: "",
  });
  const [commissionFormError, setCommissionFormError] = useState<
    string | null
  >(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingForm, setPricingForm] = useState<AddPricingFormState>({
    name: "",
    description: "",
    type: "discount",
    value: "",
    unit: "percentage",
    applicableToKeys: ["activeOffer"],
  });
  const [pricingFormError, setPricingFormError] = useState<string | null>(null);

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

  const getPricingRuleName = (rule: PricingRule) =>
    rule.nameKey.startsWith("adminCommissionPricing.")
      ? t(rule.nameKey)
      : rule.nameKey;

  const getPricingRuleDescription = (rule: PricingRule) =>
    rule.descriptionKey.startsWith("adminCommissionPricing.")
      ? t(rule.descriptionKey)
      : rule.descriptionKey;

  const existingOfferTypeKeys = useMemo(
    () => new Set(commissionRules.map((rule) => rule.offerType)),
    [commissionRules]
  );

  const availableOfferType = useMemo(() => {
    const fallback = commissionOfferTypes[0];
    for (const key of commissionOfferTypes) {
      if (!existingOfferTypeKeys.has(key)) {
        return key;
      }
    }
    return fallback;
  }, [existingOfferTypeKeys]);

  const offerTypeOptions = useMemo(
    () =>
      commissionOfferTypes.map((offerType) => ({
        value: offerType,
        label: t(
          `adminCommissionPricing.commissionRules.types.${offerType}.title`
        ),
      })),
    [t]
  );

  const handleOpenCommissionModal = () => {
    setCommissionForm({
      offerType: availableOfferType,
      rate: "",
    });
    setCommissionFormError(null);
    setShowCommissionModal(true);
  };

  const handleCloseCommissionModal = () => {
    setShowCommissionModal(false);
    setCommissionFormError(null);
  };

  const handleCommissionFormChange = <K extends keyof AddCommissionFormState>(
    key: K,
    value: AddCommissionFormState[K]
  ) => {
    setCommissionForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (commissionFormError) {
      setCommissionFormError(null);
    }
  };

  const handleCommissionCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedRate = Number(commissionForm.rate);

    if (!commissionForm.rate.trim() || Number.isNaN(parsedRate)) {
      setCommissionFormError(
        t("adminCommissionPricing.commissionRules.addModal.errors.rateRequired")
      );
      return;
    }

    if (parsedRate <= 0) {
      setCommissionFormError(
        t("adminCommissionPricing.commissionRules.addModal.errors.ratePositive")
      );
      return;
    }

    if (existingOfferTypeKeys.has(commissionForm.offerType)) {
      setCommissionFormError(
        t(
          "adminCommissionPricing.commissionRules.addModal.errors.offerTypeDuplicate"
        )
      );
      return;
    }

    const config = offerTypeConfig[commissionForm.offerType];

    const newRule: CommissionRule = {
      id: Date.now().toString(),
      offerType: commissionForm.offerType,
      rate: parsedRate,
      unit: config.unit,
      descriptionKey: config.descriptionKey,
      isActive: true,
      lastUpdated: currentDate(),
      updatedByKey: "adminCommissionPricing.updatedBy.adminUser",
    };

    setCommissionRules((prev) => [...prev, newRule]);
    setShowCommissionModal(false);
    setCommissionFormError(null);
  };

  const handleOpenPricingModal = () => {
    setPricingForm({
      name: "",
      description: "",
      type: "discount",
      value: "",
      unit: "percentage",
      applicableToKeys: ["activeOffer"],
    });
    setPricingFormError(null);
    setShowPricingModal(true);
  };

  const handleClosePricingModal = () => {
    setShowPricingModal(false);
    setPricingFormError(null);
  };

  const handlePricingFormChange = <K extends keyof AddPricingFormState>(
    key: K,
    value: AddPricingFormState[K]
  ) => {
    setPricingForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "type") {
        next.unit = value === "discount" ? "percentage" : "amount";
      }
      return next;
    });

    if (pricingFormError) {
      setPricingFormError(null);
    }
  };

  const toggleApplicableSelection = (key: PricingApplicableKey) => {
    setPricingForm((prev) => {
      const exists = prev.applicableToKeys.includes(key);
      const next = exists
        ? prev.applicableToKeys.filter((item) => item !== key)
        : [...prev.applicableToKeys, key];

      return {
        ...prev,
        applicableToKeys: next.length > 0 ? next : prev.applicableToKeys,
      };
    });

    if (pricingFormError) {
      setPricingFormError(null);
    }
  };

  const handlePricingCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!pricingForm.name.trim()) {
      setPricingFormError(
        t("adminCommissionPricing.pricingRules.addModal.errors.nameRequired")
      );
      return;
    }

    const parsedValue = Number(pricingForm.value);

    if (!pricingForm.value.trim() || Number.isNaN(parsedValue)) {
      setPricingFormError(
        t("adminCommissionPricing.pricingRules.addModal.errors.valueRequired")
      );
      return;
    }

    if (parsedValue <= 0) {
      setPricingFormError(
        t("adminCommissionPricing.pricingRules.addModal.errors.valuePositive")
      );
      return;
    }

    if (pricingForm.applicableToKeys.length === 0) {
      setPricingFormError(
        t(
          "adminCommissionPricing.pricingRules.addModal.errors.applicableRequired"
        )
      );
      return;
    }

    const newRule: PricingRule = {
      id: Date.now().toString(),
      nameKey: pricingForm.name.trim(),
      descriptionKey: pricingForm.description.trim(),
      type: pricingForm.type,
      value: parsedValue,
      unit: pricingForm.unit,
      applicableToKeys: pricingForm.applicableToKeys,
      isActive: true,
      createdAt: currentDate(),
    };

    setPricingRules((prev) => [newRule, ...prev]);
    setShowPricingModal(false);
    setPricingFormError(null);
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
          <button
            onClick={handleOpenCommissionModal}
            disabled={existingOfferTypeKeys.size >= commissionOfferTypes.length}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-semibold rounded-full transition-all disabled:cursor-not-allowed disabled:opacity-60 hover:bg-primary/90 disabled:hover:bg-primary"
          >
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
          <button
            onClick={handleOpenPricingModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
          >
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
                  <h4 className="font-bold text-white">
                    {getPricingRuleName(rule)}
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
                  <p className="text-white text-sm">
                    {getPricingRuleDescription(rule)}
                  </p>
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

      <Modal
        isOpen={showCommissionModal}
        onClose={handleCloseCommissionModal}
        title={t("adminCommissionPricing.commissionRules.addModal.title")}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseCommissionModal}
              className="px-4 py-2 rounded-lg border border-primary/40 text-gray-300 hover:text-white hover:border-primary transition-all"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              form="commission-rule-form"
              className="px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-primary/80 transition-all"
              disabled={existingOfferTypeKeys.has(commissionForm.offerType)}
            >
              {t("adminCommissionPricing.commissionRules.addModal.submit")}
            </button>
          </div>
        }
      >
        <form
          id="commission-rule-form"
          onSubmit={handleCommissionCreate}
          className="space-y-5"
        >
          <p className="text-gray-400 text-sm">
            {t("adminCommissionPricing.commissionRules.addModal.description")}
          </p>

          <div className="space-y-2">
            <label
              htmlFor="commission-offer-type"
              className="text-sm font-medium text-white"
            >
              {t("adminCommissionPricing.commissionRules.addModal.offerType")}
            </label>
            <select
              id="commission-offer-type"
              value={commissionForm.offerType}
              onChange={(event) =>
                handleCommissionFormChange(
                  "offerType",
                  event.target.value as OfferTypeKey
                )
              }
              className="w-full rounded-lg border border-primary/40 bg-background px-3 py-2 text-white focus:border-primary focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {offerTypeOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={existingOfferTypeKeys.has(option.value)}
                >
                  {option.label}
                </option>
              ))}
            </select>
            {existingOfferTypeKeys.has(commissionForm.offerType) && (
              <p className="text-xs text-orange-400">
                {t(
                  "adminCommissionPricing.commissionRules.addModal.offerTypeUnavailable"
                )}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="commission-rate"
              className="text-sm font-medium text-white"
            >
              {t("adminCommissionPricing.commissionRules.addModal.rate")}
            </label>
            <input
              id="commission-rate"
              type="number"
              min="0"
              step="0.01"
              value={commissionForm.rate}
              onChange={(event) =>
                handleCommissionFormChange("rate", event.target.value)
              }
              placeholder={t(
                "adminCommissionPricing.commissionRules.addModal.ratePlaceholder",
                {
                  unit: t(
                    `adminCommissionPricing.units.${offerTypeConfig[commissionForm.offerType].unit}`
                  ),
                }
              )}
              className="w-full rounded-lg border border-primary/40 bg-background px-3 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2"
            />
            <p className="text-xs text-gray-400">
              {t("adminCommissionPricing.commissionRules.addModal.rateHint", {
                unit: t(
                  `adminCommissionPricing.units.${offerTypeConfig[commissionForm.offerType].unit}`
                ),
              })}
            </p>
          </div>

          {commissionFormError && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {commissionFormError}
            </div>
          )}
        </form>
      </Modal>

      <Modal
        isOpen={showPricingModal}
        onClose={handleClosePricingModal}
        title={t("adminCommissionPricing.pricingRules.addModal.title")}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClosePricingModal}
              className="px-4 py-2 rounded-lg border border-primary/40 text-gray-300 hover:text-white hover:border-primary transition-all"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              form="pricing-rule-form"
              className="px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-primary/80 transition-all"
            >
              {t("adminCommissionPricing.pricingRules.addModal.submit")}
            </button>
          </div>
        }
      >
        <form
          id="pricing-rule-form"
          onSubmit={handlePricingCreate}
          className="space-y-5"
        >
          <p className="text-gray-400 text-sm">
            {t("adminCommissionPricing.pricingRules.addModal.description")}
          </p>

          <div className="space-y-2">
            <label
              htmlFor="pricing-name"
              className="text-sm font-medium text-white"
            >
              {t("adminCommissionPricing.pricingRules.addModal.name")}
            </label>
            <input
              id="pricing-name"
              type="text"
              value={pricingForm.name}
              onChange={(event) =>
                handlePricingFormChange("name", event.target.value)
              }
              placeholder={t(
                "adminCommissionPricing.pricingRules.addModal.namePlaceholder"
              )}
              className="w-full rounded-lg border border-primary/40 bg-background px-3 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="pricing-description"
              className="text-sm font-medium text-white"
            >
              {t("adminCommissionPricing.pricingRules.addModal.descriptionLabel")}
            </label>
            <textarea
              id="pricing-description"
              value={pricingForm.description}
              onChange={(event) =>
                handlePricingFormChange("description", event.target.value)
              }
              placeholder={t(
                "adminCommissionPricing.pricingRules.addModal.descriptionPlaceholder"
              )}
              rows={3}
              className="w-full rounded-lg border border-primary/40 bg-background px-3 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="pricing-type"
                className="text-sm font-medium text-white"
              >
                {t("adminCommissionPricing.pricingRules.addModal.type")}
              </label>
              <select
                id="pricing-type"
                value={pricingForm.type}
                onChange={(event) =>
                  handlePricingFormChange(
                    "type",
                    event.target.value as PricingRuleType
                  )
                }
                className="w-full rounded-lg border border-primary/40 bg-background px-3 py-2 text-white focus:border-primary focus:outline-none focus:ring-2"
              >
                <option value="discount">
                  {t("adminCommissionPricing.pricingRules.types.discount")}
                </option>
                <option value="markup">
                  {t("adminCommissionPricing.pricingRules.types.markup")}
                </option>
                <option value="fixed">
                  {t("adminCommissionPricing.pricingRules.types.fixed")}
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="pricing-value"
                className="text-sm font-medium text-white"
              >
                {t("adminCommissionPricing.pricingRules.addModal.value")}
              </label>
              <input
                id="pricing-value"
                type="number"
                min="0"
                step="0.01"
                value={pricingForm.value}
                onChange={(event) =>
                  handlePricingFormChange("value", event.target.value)
                }
                placeholder={t(
                  "adminCommissionPricing.pricingRules.addModal.valuePlaceholder",
                  {
                    unit:
                      pricingForm.unit === "percentage"
                        ? "%"
                        : t("adminCommissionPricing.pricingRules.addModal.amountUnit"),
                  }
                )}
                className="w-full rounded-lg border border-primary/40 bg-background px-3 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2"
              />
              <p className="text-xs text-gray-400">
                {t("adminCommissionPricing.pricingRules.addModal.valueHint", {
                  unit:
                    pricingForm.unit === "percentage"
                      ? "%"
                      : t("adminCommissionPricing.pricingRules.addModal.amountUnit"),
                })}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-white">
              {t("adminCommissionPricing.pricingRules.addModal.applicable")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pricingApplicableOptions.map((option) => {
                const selected = pricingForm.applicableToKeys.includes(option);
                return (
                  <label
                    key={option}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                      selected
                        ? "border-primary bg-primary/10 text-white"
                        : "border-primary/30 text-gray-300 hover:border-primary/60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleApplicableSelection(option)}
                      className="h-4 w-4 rounded border-primary/40 bg-background text-primary focus:ring-primary"
                    />
                    <span>{getApplicableLabel(option)}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {pricingFormError && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {pricingFormError}
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}

