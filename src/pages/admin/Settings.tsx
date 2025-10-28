import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  ArrowLeft,
  Save,
  Shield,
  Bell,
  Key,
  Building2,
  FileText,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    // General Settings
    platformName: "Tilbod Platform",
    platformDescription: "Iceland's premier business offer management platform",
    supportEmail: "support@tilbod.is",
    adminEmail: "admin@tilbod.is",
    
    // Company Settings
    maxCompaniesPerUser: 10,
    companyRevisionLimit: 3,
    
    // Offer Settings
    maxOffersPerCompany: 50,
    offerRevisionLimit: 2,
    offerReviewTimeLimit: 24, // hours
    minOfferDuration: 1, // days
    maxOfferDuration: 365, // days
    
    // Review Settings
    autoApproveThreshold: 0,
    reviewTimeLimit: 48, // hours
    requireVerification: true,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    
    // API Settings
    apiKey: "sk_live_1234567890abcdef",
    apiRateLimit: 1000,
    webhookUrl: "https://api.tilbod.is/webhooks",
    
    // Security Settings
    sessionTimeout: 24, // hours
    requireTwoFactor: false,
    passwordMinLength: 8,
    loginAttemptLimit: 5,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    // Show success message
    alert("Settings saved successfully!");
  };

  const tabs = [
    { id: "general", name: "General", icon: Settings },
    { id: "companies", name: "Companies", icon: Building2 },
    { id: "offers", name: "Offers", icon: FileText },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "api", name: "API", icon: Key },
    { id: "security", name: "Security", icon: Shield },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Platform Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Platform Name</label>
            <input
              type="text"
              value={settings.platformName}
              onChange={(e) => handleSettingChange("platformName", e.target.value)}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => handleSettingChange("supportEmail", e.target.value)}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-gray-400 text-sm mb-2 block">Platform Description</label>
            <textarea
              value={settings.platformDescription}
              onChange={(e) => handleSettingChange("platformDescription", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Company Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Max Companies Per User</label>
            <input
              type="number"
              value={settings.maxCompaniesPerUser}
              onChange={(e) => handleSettingChange("maxCompaniesPerUser", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Company Revision Limit</label>
            <input
              type="number"
              value={settings.companyRevisionLimit}
              onChange={(e) => handleSettingChange("companyRevisionLimit", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Company Review Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Company Review Time Limit (hours)</label>
            <input
              type="number"
              value={settings.reviewTimeLimit}
              onChange={(e) => handleSettingChange("reviewTimeLimit", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.requireVerification}
              onChange={(e) => handleSettingChange("requireVerification", e.target.checked)}
              className="w-5 h-5 text-primary bg-background border-primary/50 rounded focus:ring-primary"
            />
            <label className="text-gray-400 text-sm">Require Email Verification</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOfferSettings = () => (
    <div className="space-y-6">
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Offer Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Max Offers Per Company</label>
            <input
              type="number"
              value={settings.maxOffersPerCompany}
              onChange={(e) => handleSettingChange("maxOffersPerCompany", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Offer Revision Limit</label>
            <input
              type="number"
              value={settings.offerRevisionLimit}
              onChange={(e) => handleSettingChange("offerRevisionLimit", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Offer Review Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Offer Review Time Limit (hours)</label>
            <input
              type="number"
              value={settings.offerReviewTimeLimit || 24}
              onChange={(e) => handleSettingChange("offerReviewTimeLimit", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Auto-approve Threshold</label>
            <input
              type="number"
              value={settings.autoApproveThreshold}
              onChange={(e) => handleSettingChange("autoApproveThreshold", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Offer Content Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Min Offer Duration (days)</label>
            <input
              type="number"
              value={settings.minOfferDuration || 1}
              onChange={(e) => handleSettingChange("minOfferDuration", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Max Offer Duration (days)</label>
            <input
              type="number"
              value={settings.maxOfferDuration || 365}
              onChange={(e) => handleSettingChange("maxOfferDuration", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-gray-400 text-sm">Send notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
              className="w-5 h-5 text-primary bg-background border-primary/50 rounded focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">SMS Notifications</p>
              <p className="text-gray-400 text-sm">Send notifications via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => handleSettingChange("smsNotifications", e.target.checked)}
              className="w-5 h-5 text-primary bg-background border-primary/50 rounded focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Push Notifications</p>
              <p className="text-gray-400 text-sm">Send browser push notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => handleSettingChange("pushNotifications", e.target.checked)}
              className="w-5 h-5 text-primary bg-background border-primary/50 rounded focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Weekly Reports</p>
              <p className="text-gray-400 text-sm">Send weekly performance reports</p>
            </div>
            <input
              type="checkbox"
              checked={settings.weeklyReports}
              onChange={(e) => handleSettingChange("weeklyReports", e.target.checked)}
              className="w-5 h-5 text-primary bg-background border-primary/50 rounded focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">API Configuration</h3>
        <div className="space-y-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">API Key</label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={settings.apiKey}
                onChange={(e) => handleSettingChange("apiKey", e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              >
                {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">API Rate Limit (requests/hour)</label>
            <input
              type="number"
              value={settings.apiRateLimit}
              onChange={(e) => handleSettingChange("apiRateLimit", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Webhook URL</label>
            <input
              type="url"
              value={settings.webhookUrl}
              onChange={(e) => handleSettingChange("webhookUrl", e.target.value)}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Security Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Session Timeout (hours)</label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Password Min Length</label>
            <input
              type="number"
              value={settings.passwordMinLength}
              onChange={(e) => handleSettingChange("passwordMinLength", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Login Attempt Limit</label>
            <input
              type="number"
              value={settings.loginAttemptLimit}
              onChange={(e) => handleSettingChange("loginAttemptLimit", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.requireTwoFactor}
              onChange={(e) => handleSettingChange("requireTwoFactor", e.target.checked)}
              className="w-5 h-5 text-primary bg-background border-primary/50 rounded focus:ring-primary"
            />
            <label className="text-gray-400 text-sm">Require Two-Factor Authentication</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "companies":
        return renderCompanySettings();
      case "offers":
        return renderOfferSettings();
      case "notifications":
        return renderNotificationSettings();
      case "api":
        return renderApiSettings();
      case "security":
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Platform Settings
            </h1>
            <p className="text-gray-400 text-sm">
              Configure platform-wide settings and preferences
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

      {/* Settings Tabs */}
      <div className="bg-card-background border border-primary rounded-2xl p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-dark"
                    : "text-gray-400 hover:text-white hover:bg-primary/10"
                }`}
              >
                <Icon size={16} />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Warning Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-yellow-500 font-bold mb-1">Settings Notice</h3>
            <p className="text-sm text-gray-300">
              Changes to platform settings will affect all users. Please review changes carefully before saving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
