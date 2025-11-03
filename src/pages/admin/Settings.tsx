import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  Save,
  ArrowLeft,
  Shield,
  Bell,
  CreditCard,
  Globe,
  Database,
  Key,
  RefreshCw,
} from "lucide-react";

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      platformName: "Tilbod",
      platformDescription: "Iceland's premier offers and deals platform",
      contactEmail: "admin@tilbod.is",
      supportPhone: "+354 555 0000",
      maintenanceMode: false,
      registrationEnabled: true,
    },
    security: {
      twoFactorRequired: false,
      passwordMinLength: 8,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      ipWhitelist: "",
      auditLogging: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      approvalAlerts: true,
      systemAlerts: true,
      marketingEmails: false,
    },
    payments: {
      commissionActiveOffers: 1,
      commissionWeekdaysOffers: 4,
      commissionHappyHourOffers: 10,
      commissionGiftCards: 5,
      paymentProcessor: "Teya",
      autoPayoutEnabled: true,
      minimumPayout: 10000,
    },
    integrations: {
      googleAnalytics: "",
      facebookPixel: "",
      paymentGateway: "Teya",
      emailProvider: "SendGrid",
      smsProvider: "Twilio",
    },
  });

  const settingSections: SettingSection[] = [
    {
      id: "general",
      title: "General Settings",
      description: "Basic platform configuration",
      icon: Settings,
    },
    {
      id: "security",
      title: "Security",
      description: "Security and access controls",
      icon: Shield,
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Email and alert preferences",
      icon: Bell,
    },
    {
      id: "payments",
      title: "Payments & Commissions",
      description: "Commission rates and payment settings",
      icon: CreditCard,
    },
    {
      id: "integrations",
      title: "Integrations",
      description: "Third-party service connections",
      icon: Globe,
    },
  ];

  const handleSettingChange = (section: string, key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = (section: string) => {
    // Here you would normally save to your backend
    console.log(`Saving ${section} settings:`, settings[section as keyof typeof settings]);
    alert(`${section} settings saved successfully!`);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Platform Name
          </label>
          <input
            type="text"
            value={settings.general.platformName}
            onChange={(e) => handleSettingChange("general", "platformName", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Contact Email
          </label>
          <input
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => handleSettingChange("general", "contactEmail", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-gray-400 text-sm mb-2 block">
            Platform Description
          </label>
          <textarea
            value={settings.general.platformDescription}
            onChange={(e) => handleSettingChange("general", "platformDescription", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary resize-none"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Support Phone
          </label>
          <input
            type="tel"
            value={settings.general.supportPhone}
            onChange={(e) => handleSettingChange("general", "supportPhone", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Maintenance Mode</h4>
            <p className="text-gray-400 text-sm">Temporarily disable platform access</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.maintenanceMode}
              onChange={(e) => handleSettingChange("general", "maintenanceMode", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg">
          <div>
            <h4 className="text-white font-medium">User Registration</h4>
            <p className="text-gray-400 text-sm">Allow new users to register</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.registrationEnabled}
              onChange={(e) => handleSettingChange("general", "registrationEnabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Minimum Password Length
          </label>
          <input
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => handleSettingChange("security", "passwordMinLength", parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            min="6"
            max="20"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange("security", "sessionTimeout", parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            min="15"
            max="480"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleSettingChange("security", "maxLoginAttempts", parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            min="3"
            max="10"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Two-Factor Authentication</h4>
            <p className="text-gray-400 text-sm">Require 2FA for all admin accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.twoFactorRequired}
              onChange={(e) => handleSettingChange("security", "twoFactorRequired", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Audit Logging</h4>
            <p className="text-gray-400 text-sm">Log all admin actions for security</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.auditLogging}
              onChange={(e) => handleSettingChange("security", "auditLogging", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
          </label>
        </div>
      </div>

      <div>
        <label className="text-gray-400 text-sm mb-2 block">
          IP Whitelist (Optional)
        </label>
        <textarea
          value={settings.security.ipWhitelist}
          onChange={(e) => handleSettingChange("security", "ipWhitelist", e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary resize-none"
          placeholder="Enter allowed IP addresses, one per line"
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Email Notifications</h4>
            <p className="text-gray-400 text-sm">Send email alerts for important events</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => handleSettingChange("notifications", "emailNotifications", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg">
          <div>
            <h4 className="text-white font-medium">SMS Notifications</h4>
            <p className="text-gray-400 text-sm">Send SMS alerts for urgent matters</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.smsNotifications}
              onChange={(e) => handleSettingChange("notifications", "smsNotifications", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Push Notifications</h4>
            <p className="text-gray-400 text-sm">Browser push notifications for real-time alerts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.pushNotifications}
              onChange={(e) => handleSettingChange("notifications", "pushNotifications", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Approval Alerts</h4>
            <p className="text-gray-400 text-sm">Notify when new approvals are pending</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.approvalAlerts}
              onChange={(e) => handleSettingChange("notifications", "approvalAlerts", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg">
          <div>
            <h4 className="text-white font-medium">System Alerts</h4>
            <p className="text-gray-400 text-sm">Critical system notifications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.systemAlerts}
              onChange={(e) => handleSettingChange("notifications", "systemAlerts", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Active Offers Commission (kr./day)
          </label>
          <input
            type="number"
            value={settings.payments.commissionActiveOffers}
            onChange={(e) => handleSettingChange("payments", "commissionActiveOffers", parseFloat(e.target.value))}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Weekdays Offers Commission (kr./week)
          </label>
          <input
            type="number"
            value={settings.payments.commissionWeekdaysOffers}
            onChange={(e) => handleSettingChange("payments", "commissionWeekdaysOffers", parseFloat(e.target.value))}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Happy Hour Commission (kr./month)
          </label>
          <input
            type="number"
            value={settings.payments.commissionHappyHourOffers}
            onChange={(e) => handleSettingChange("payments", "commissionHappyHourOffers", parseFloat(e.target.value))}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Gift Cards Commission (%)
          </label>
          <input
            type="number"
            value={settings.payments.commissionGiftCards}
            onChange={(e) => handleSettingChange("payments", "commissionGiftCards", parseFloat(e.target.value))}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            min="0"
            max="100"
            step="0.01"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Payment Processor
          </label>
          <select
            value={settings.payments.paymentProcessor}
            onChange={(e) => handleSettingChange("payments", "paymentProcessor", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
          >
            <option value="Teya">Teya</option>
            <option value="Stripe">Stripe</option>
            <option value="PayPal">PayPal</option>
          </select>
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Minimum Payout Amount (kr.)
          </label>
          <input
            type="number"
            value={settings.payments.minimumPayout}
            onChange={(e) => handleSettingChange("payments", "minimumPayout", parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            min="1000"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg">
        <div>
          <h4 className="text-white font-medium">Automatic Payouts</h4>
          <p className="text-gray-400 text-sm">Automatically process payouts when minimum is reached</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.payments.autoPayoutEnabled}
            onChange={(e) => handleSettingChange("payments", "autoPayoutEnabled", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green"></div>
        </label>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Google Analytics ID
          </label>
          <input
            type="text"
            value={settings.integrations.googleAnalytics}
            onChange={(e) => handleSettingChange("integrations", "googleAnalytics", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            placeholder="G-XXXXXXXXXX"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Facebook Pixel ID
          </label>
          <input
            type="text"
            value={settings.integrations.facebookPixel}
            onChange={(e) => handleSettingChange("integrations", "facebookPixel", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            placeholder="XXXXXXXXXXXXXXX"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            Email Provider
          </label>
          <select
            value={settings.integrations.emailProvider}
            onChange={(e) => handleSettingChange("integrations", "emailProvider", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
          >
            <option value="SendGrid">SendGrid</option>
            <option value="Mailgun">Mailgun</option>
            <option value="AWS SES">AWS SES</option>
          </select>
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            SMS Provider
          </label>
          <select
            value={settings.integrations.smsProvider}
            onChange={(e) => handleSettingChange("integrations", "smsProvider", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
          >
            <option value="Twilio">Twilio</option>
            <option value="AWS SNS">AWS SNS</option>
            <option value="MessageBird">MessageBird</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSettingsContent = () => {
    switch (activeSection) {
      case "general":
        return renderGeneralSettings();
      case "security":
        return renderSecuritySettings();
      case "notifications":
        return renderNotificationSettings();
      case "payments":
        return renderPaymentSettings();
      case "integrations":
        return renderIntegrationSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/dashboard"
          className="p-2 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <ArrowLeft className="text-red-500" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Platform Settings
          </h1>
          <p className="text-gray-400 text-sm">
            Configure platform behavior and integrations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card-background border border-primary rounded-2xl p-4">
            <nav className="space-y-2">
              {settingSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                      activeSection === section.id
                        ? "bg-red-500/10 text-red-500 border border-red-500"
                        : "text-gray-400 hover:text-white hover:bg-primary/10"
                    }`}
                  >
                    <Icon size={20} />
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs opacity-75">{section.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">
                {settingSections.find(s => s.id === activeSection)?.title}
              </h3>
              <button
                onClick={() => handleSaveSettings(activeSection)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-all"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>

            {renderSettingsContent()}

            {/* System Actions */}
            <div className="mt-8 pt-6 border-t border-primary/30">
              <h4 className="text-lg font-bold text-white mb-4">System Actions</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center gap-2 p-3 bg-background border border-primary/30 rounded-lg hover:bg-primary/10 transition-all">
                  <Database size={20} className="text-blue-500" />
                  <span className="text-white text-sm">Backup Data</span>
                </button>

                <button className="flex items-center gap-2 p-3 bg-background border border-primary/30 rounded-lg hover:bg-primary/10 transition-all">
                  <RefreshCw size={20} className="text-green-500" />
                  <span className="text-white text-sm">Clear Cache</span>
                </button>

                <button className="flex items-center gap-2 p-3 bg-background border border-primary/30 rounded-lg hover:bg-primary/10 transition-all">
                  <Key size={20} className="text-purple-500" />
                  <span className="text-white text-sm">Reset API Keys</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
