import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  Monitor,
  Smartphone,
  MapPin,
  Clock3,
} from "lucide-react";

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export default function AdminSettingsPage() {
  const { t } = useTranslation();
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

  const currentDeviceType = useMemo(() => {
    if (typeof window === "undefined") return "desktop";
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|ipod/.test(userAgent);
    return isMobile ? "mobile" : "desktop";
  }, []);

  const devicePlatform = useMemo(() => {
    if (typeof window === "undefined") return "Unknown Device";
    return window.navigator.platform || "Unknown Device";
  }, []);

  const activeDevices = useMemo(
    () => [
      {
        id: "current",
        label: t("adminSettings.activeDevices.currentSession"),
        deviceName: currentDeviceType === "desktop"
          ? t("adminSettings.activeDevices.deviceTypes.desktop")
          : t("adminSettings.activeDevices.deviceTypes.mobile"),
        deviceInfo: devicePlatform,
        location: t("adminSettings.activeDevices.locations.current"),
        lastActive: t("adminSettings.activeDevices.lastActive.justNow"),
        icon: currentDeviceType === "desktop" ? Monitor : Smartphone,
        isCurrent: true,
      },
      {
        id: "mobile",
        label: t("adminSettings.activeDevices.secondarySession"),
        deviceName: "iPhone 15 Pro",
        deviceInfo: "iOS 17.3",
        location: t("adminSettings.activeDevices.locations.secondary"),
        lastActive: t("adminSettings.activeDevices.lastActive.hoursAgo", { count: 2 }),
        icon: Smartphone,
        isCurrent: false,
      },
    ],
    [currentDeviceType, devicePlatform, t]
  );

  const settingSections = useMemo<SettingSection[]>(
    () => [
      {
        id: "general",
        title: t("adminSettings.sections.general.title"),
        description: t("adminSettings.sections.general.description"),
        icon: Settings,
      },
      {
        id: "security",
        title: t("adminSettings.sections.security.title"),
        description: t("adminSettings.sections.security.description"),
        icon: Shield,
      },
      {
        id: "notifications",
        title: t("adminSettings.sections.notifications.title"),
        description: t("adminSettings.sections.notifications.description"),
        icon: Bell,
      },
      {
        id: "payments",
        title: t("adminSettings.sections.payments.title"),
        description: t("adminSettings.sections.payments.description"),
        icon: CreditCard,
      },
      {
        id: "integrations",
        title: t("adminSettings.sections.integrations.title"),
        description: t("adminSettings.sections.integrations.description"),
        icon: Globe,
      },
    ],
    [t]
  );

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
    const sectionTitle = settingSections.find((s) => s.id === section)?.title ?? "";
    alert(t("adminSettings.messages.saved", { section: sectionTitle }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            {t("adminSettings.general.platformName.label")}
          </label>
          <input
            type="text"
            value={settings.general.platformName}
            onChange={(e) => handleSettingChange("general", "platformName", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            placeholder={t("adminSettings.general.platformName.placeholder") ?? undefined}
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            {t("adminSettings.general.contactEmail.label")}
          </label>
          <input
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => handleSettingChange("general", "contactEmail", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            placeholder={t("adminSettings.general.contactEmail.placeholder") ?? undefined}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-gray-400 text-sm mb-2 block">
            {t("adminSettings.general.platformDescription.label")}
          </label>
          <textarea
            value={settings.general.platformDescription}
            onChange={(e) => handleSettingChange("general", "platformDescription", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary resize-none"
            placeholder={t("adminSettings.general.platformDescription.placeholder") ?? undefined}
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            {t("adminSettings.general.supportPhone.label")}
          </label>
          <input
            type="tel"
            value={settings.general.supportPhone}
            onChange={(e) => handleSettingChange("general", "supportPhone", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            placeholder={t("adminSettings.general.supportPhone.placeholder") ?? undefined}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg">
          <div>
            <h4 className="text-white font-medium">{t("adminSettings.general.maintenance.title")}</h4>
            <p className="text-gray-400 text-sm">{t("adminSettings.general.maintenance.description")}</p>
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
            <h4 className="text-white font-medium">{t("adminSettings.general.registration.title")}</h4>
            <p className="text-gray-400 text-sm">{t("adminSettings.general.registration.description")}</p>
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">{t("adminSettings.activeDevices.title")}</h3>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            {t("adminSettings.activeDevices.manageSessions")}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeDevices.map((device) => {
            const DeviceIcon = device.icon;
            return (
              <div
                key={device.id}
                className={`border rounded-xl p-4 bg-background transition-all ${
                  device.isCurrent ? "border-green/60" : "border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${device.isCurrent ? "bg-green/10" : "bg-primary/10"}`}>
                      <DeviceIcon className={device.isCurrent ? "text-green" : "text-primary"} size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{device.label}</p>
                      <p className="text-gray-400 text-sm">{device.deviceName}</p>
                    </div>
                  </div>
                  {device.isCurrent && (
                    <span className="text-xs font-semibold text-green bg-green/10 px-2 py-1 rounded-full">
                      {t("adminSettings.activeDevices.currentBadge")}
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary" />
                    <span>{device.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 size={14} className="text-primary" />
                    <span>{device.lastActive}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs uppercase tracking-wide">
                      {t("adminSettings.activeDevices.deviceLabel")}
                    </span>
                    <span>{device.deviceInfo}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            {t("adminSettings.security.passwordMinLength.label")}
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
            {t("adminSettings.security.sessionTimeout.label")}
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
            {t("adminSettings.security.maxLoginAttempts.label")}
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
            <h4 className="text-white font-medium">{t("adminSettings.security.twoFactor.title")}</h4>
            <p className="text-gray-400 text-sm">{t("adminSettings.security.twoFactor.description")}</p>
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
            <h4 className="text-white font-medium">{t("adminSettings.security.auditLogging.title")}</h4>
            <p className="text-gray-400 text-sm">{t("adminSettings.security.auditLogging.description")}</p>
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
          {t("adminSettings.security.ipWhitelist.label")}
        </label>
        <textarea
          value={settings.security.ipWhitelist}
          onChange={(e) => handleSettingChange("security", "ipWhitelist", e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary resize-none"
          placeholder={t("adminSettings.security.ipWhitelist.placeholder") ?? undefined}
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg">
          <div>
            <h4 className="text-white font-medium">{t("adminSettings.notifications.email.title")}</h4>
            <p className="text-gray-400 text-sm">{t("adminSettings.notifications.email.description")}</p>
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
            <h4 className="text-white font-medium">{t("adminSettings.notifications.sms.title")}</h4>
            <p className="text-gray-400 text-sm">{t("adminSettings.notifications.sms.description")}</p>
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
            <h4 className="text-white font-medium">{t("adminSettings.notifications.push.title")}</h4>
            <p className="text-gray-400 text-sm">{t("adminSettings.notifications.push.description")}</p>
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
            <h4 className="text-white font-medium">{t("adminSettings.notifications.approval.title")}</h4>
            <p className="text-gray-400 text-sm">{t("adminSettings.notifications.approval.description")}</p>
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
            <h4 className="text-white font-medium">{t("adminSettings.notifications.system.title")}</h4>
            <p className="text-gray-400 text-sm">{t("adminSettings.notifications.system.description")}</p>
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
            {t("adminSettings.payments.commissionActiveOffers.label")}
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
            {t("adminSettings.payments.commissionWeekdaysOffers.label")}
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
            {t("adminSettings.payments.commissionHappyHourOffers.label")}
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
            {t("adminSettings.payments.commissionGiftCards.label")}
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
            {t("adminSettings.payments.paymentProcessor.label")}
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
            {t("adminSettings.payments.minimumPayout.label")}
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
          <h4 className="text-white font-medium">{t("adminSettings.payments.autoPayouts.title")}</h4>
          <p className="text-gray-400 text-sm">{t("adminSettings.payments.autoPayouts.description")}</p>
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
            {t("adminSettings.integrations.googleAnalytics.label")}
          </label>
          <input
            type="text"
            value={settings.integrations.googleAnalytics}
            onChange={(e) => handleSettingChange("integrations", "googleAnalytics", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            placeholder={t("adminSettings.integrations.googleAnalytics.placeholder") ?? undefined}
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            {t("adminSettings.integrations.facebookPixel.label")}
          </label>
          <input
            type="text"
            value={settings.integrations.facebookPixel}
            onChange={(e) => handleSettingChange("integrations", "facebookPixel", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            placeholder={t("adminSettings.integrations.facebookPixel.placeholder") ?? undefined}
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">
            {t("adminSettings.integrations.emailProvider.label")}
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
            {t("adminSettings.integrations.smsProvider.label")}
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
            {t("adminSettings.header.title")}
          </h1>
          <p className="text-gray-400 text-sm">
            {t("adminSettings.header.subtitle")}
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
                        ? "bg-red-500/10 text-white border border-red-500"
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
                {t("adminSettings.buttons.save")}
              </button>
            </div>

            {renderSettingsContent()}

            {/* System Actions */}
            <div className="mt-8 pt-6 border-t border-primary/30">
              <h4 className="text-lg font-bold text-white mb-4">{t("adminSettings.systemActions.title")}</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center gap-2 p-3 bg-background border border-primary/30 rounded-lg hover:bg-primary/10 transition-all">
                  <Database size={20} className="text-blue-500" />
                  <span className="text-white text-sm">{t("adminSettings.systemActions.backupData")}</span>
                </button>

                <button className="flex items-center gap-2 p-3 bg-background border border-primary/30 rounded-lg hover:bg-primary/10 transition-all">
                  <RefreshCw size={20} className="text-green-500" />
                  <span className="text-white text-sm">{t("adminSettings.systemActions.clearCache")}</span>
                </button>

                <button className="flex items-center gap-2 p-3 bg-background border border-primary/30 rounded-lg hover:bg-primary/10 transition-all">
                  <Key size={20} className="text-purple-500" />
                  <span className="text-white text-sm">{t("adminSettings.systemActions.resetApiKeys")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
