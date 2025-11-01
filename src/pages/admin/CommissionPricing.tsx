import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  ArrowLeft,
  Save,
  Percent,
  TrendingUp,
  TrendingDown,
  Edit,
  Building2,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function CommissionPricingPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("commission");

  const [commissionSettings, setCommissionSettings] = useState({
    defaultCommissionRate: 10,
    companyCommissionRates: [
      {
        id: "1",
        companyName: "Blue Lagoon Spa",
        category: "Wellness & Spa",
        commissionRate: 8.5,
        status: "active",
      },
      {
        id: "2",
        companyName: "Hotel Aurora",
        category: "Hotels & Accommodation",
        commissionRate: 12,
        status: "active",
      },
      {
        id: "3",
        companyName: "Restaurant Nordic",
        category: "Food & Dining",
        commissionRate: 10,
        status: "active",
      },
    ],
    categoryRates: [
      {
        category: "Hotels & Accommodation",
        rate: 12,
      },
      {
        category: "Food & Dining",
        rate: 10,
      },
      {
        category: "Wellness & Spa",
        rate: 8.5,
      },
      {
        category: "Activities & Entertainment",
        rate: 9,
      },
      {
        category: "Shopping & Retail",
        rate: 10,
      },
    ],
  });

  const [pricingSettings, setPricingSettings] = useState({
    platformFee: 2.5,
    transactionFee: 0.5,
    subscriptionPlans: [
      {
        id: "1",
        name: "Basic",
        price: 0,
        features: ["Up to 5 offers", "Basic analytics", "Email support"],
      },
      {
        id: "2",
        name: "Professional",
        price: 9900,
        features: ["Unlimited offers", "Advanced analytics", "Priority support", "Custom branding"],
      },
      {
        id: "3",
        name: "Enterprise",
        price: 29900,
        features: ["Everything in Professional", "API access", "Dedicated account manager", "Custom integrations"],
      },
    ],
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    // Settings saved - you can add a toast notification here
  };

  const handleCommissionRateChange = (id: string, rate: number) => {
    setCommissionSettings(prev => ({
      ...prev,
      companyCommissionRates: prev.companyCommissionRates.map(c =>
        c.id === id ? { ...c, commissionRate: rate } : c
      ),
    }));
  };

  const handleCategoryRateChange = (category: string, rate: number) => {
    setCommissionSettings(prev => ({
      ...prev,
      categoryRates: prev.categoryRates.map(c =>
        c.category === category ? { ...c, rate } : c
      ),
    }));
  };

  const totalRevenue = 2456789;
  const totalCommission = totalRevenue * (commissionSettings.defaultCommissionRate / 100);
  const platformFees = totalRevenue * (pricingSettings.platformFee / 100);

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
              Commission & Pricing
            </h1>
            <p className="text-gray-400 text-sm">
              Manage platform commission rates and pricing structure
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={20} />
          )}
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-white text-2xl font-bold">{totalRevenue.toLocaleString()} kr.</p>
            </div>
            <DollarSign className="text-primary" size={24} />
          </div>
          <div className="flex items-center gap-2 text-green text-sm">
            <TrendingUp size={16} />
            <span>+18.5% from last month</span>
          </div>
        </div>

        <div className="bg-card-background border border-green rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Total Commission</p>
              <p className="text-white text-2xl font-bold">{totalCommission.toLocaleString()} kr.</p>
            </div>
            <Percent className="text-green" size={24} />
          </div>
          <div className="text-gray-400 text-sm">
            {commissionSettings.defaultCommissionRate}% average rate
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Platform Fees</p>
              <p className="text-white text-2xl font-bold">{platformFees.toLocaleString()} kr.</p>
            </div>
            <DollarSign className="text-blue-500" size={24} />
          </div>
          <div className="text-gray-400 text-sm">
            {pricingSettings.platformFee}% platform fee
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("commission")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "commission"
                ? "bg-primary text-dark"
                : "text-gray-400 hover:text-white hover:bg-primary/10"
            }`}
          >
            <Percent size={16} />
            <span className="font-medium">Commission Rates</span>
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "pricing"
                ? "bg-primary text-dark"
                : "text-gray-400 hover:text-white hover:bg-primary/10"
            }`}
          >
            <DollarSign size={16} />
            <span className="font-medium">Pricing Structure</span>
          </button>
        </div>

        {/* Commission Tab */}
        {activeTab === "commission" && (
          <div className="space-y-6">
            {/* Default Commission Rate */}
            <div className="bg-background border border-primary/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Default Commission Rate</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-gray-400 text-sm mb-2 block">Commission Rate (%)</label>
                  <input
                    type="number"
                    value={commissionSettings.defaultCommissionRate}
                    onChange={(e) => setCommissionSettings(prev => ({
                      ...prev,
                      defaultCommissionRate: parseFloat(e.target.value),
                    }))}
                    className="w-full px-4 py-3 bg-card-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="mt-6">
                  <div className="text-2xl font-bold text-primary">
                    {commissionSettings.defaultCommissionRate}%
                  </div>
                </div>
              </div>
            </div>

            {/* Category Rates */}
            <div className="bg-background border border-primary/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Commission Rates by Category</h3>
              <div className="space-y-4">
                {commissionSettings.categoryRates.map((category) => (
                  <div key={category.category} className="flex items-center justify-between p-4 bg-card-background rounded-lg">
                    <div>
                      <p className="text-white font-medium">{category.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={category.rate}
                        onChange={(e) => handleCategoryRateChange(category.category, parseFloat(e.target.value))}
                        className="w-24 px-3 py-2 bg-background border border-primary/50 rounded-lg text-white text-right focus:outline-none focus:ring-2 focus:border-primary"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                      <span className="text-primary font-semibold">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company-Specific Rates */}
            <div className="bg-background border border-primary/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Company-Specific Rates</h3>
                <button className="text-primary hover:text-primary/80 text-sm font-medium">
                  Add Custom Rate
                </button>
              </div>
              <div className="space-y-4">
                {commissionSettings.companyCommissionRates.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-4 bg-card-background rounded-lg">
                    <div>
                      <p className="text-white font-medium">{company.companyName}</p>
                      <p className="text-gray-400 text-sm">{company.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={company.commissionRate}
                        onChange={(e) => handleCommissionRateChange(company.id, parseFloat(e.target.value))}
                        className="w-24 px-3 py-2 bg-background border border-primary/50 rounded-lg text-white text-right focus:outline-none focus:ring-2 focus:border-primary"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                      <span className="text-primary font-semibold">%</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        company.status === "active"
                          ? "bg-green/10 text-green"
                          : "bg-gray-500/10 text-gray-400"
                      }`}>
                        {company.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === "pricing" && (
          <div className="space-y-6">
            {/* Platform Fees */}
            <div className="bg-background border border-primary/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Platform Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Platform Fee (%)</label>
                  <input
                    type="number"
                    value={pricingSettings.platformFee}
                    onChange={(e) => setPricingSettings(prev => ({
                      ...prev,
                      platformFee: parseFloat(e.target.value),
                    }))}
                    className="w-full px-4 py-3 bg-card-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Transaction Fee (%)</label>
                  <input
                    type="number"
                    value={pricingSettings.transactionFee}
                    onChange={(e) => setPricingSettings(prev => ({
                      ...prev,
                      transactionFee: parseFloat(e.target.value),
                    }))}
                    className="w-full px-4 py-3 bg-card-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {/* Subscription Plans */}
            <div className="bg-background border border-primary/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Subscription Plans</h3>
                <button className="text-primary hover:text-primary/80 text-sm font-medium">
                  Add Plan
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingSettings.subscriptionPlans.map((plan) => (
                  <div key={plan.id} className="bg-card-background border border-primary/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                      <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                        <Edit size={16} />
                      </button>
                    </div>
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-primary">
                        {plan.price === 0 ? "Free" : `${plan.price.toLocaleString()} kr.`}
                      </div>
                      {plan.price > 0 && (
                        <div className="text-gray-400 text-sm">per month</div>
                      )}
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300 text-sm">
                          <CheckCircle className="text-green" size={16} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

