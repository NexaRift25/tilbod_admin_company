import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Receipt,
  User,
  Mail,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Sale {
  id: string;
  offerTitle: string;
  offerType: string;
  customerName: string;
  customerEmail: string;
  purchaseDate: string;
  amount: number;
  status: "completed" | "pending" | "refunded";
  paymentMethod: "credit_card" | "bank_transfer" | "cash";
  transactionId: string;
}

const mockSales: Sale[] = [
  {
    id: "1",
    offerTitle: "Weekend Getaway Package",
    offerType: "active",
    customerName: "Anna Jónsdóttir",
    customerEmail: "anna@example.com",
    purchaseDate: "2025-01-15",
    amount: 35000,
    status: "completed",
    paymentMethod: "credit_card",
    transactionId: "TXN-20250115-001",
  },
  {
    id: "2",
    offerTitle: "Spa & Wellness Gift Card",
    offerType: "gift_card",
    customerName: "Björn Guðmundsson",
    customerEmail: "bjorn@example.com",
    purchaseDate: "2025-01-14",
    amount: 8500,
    status: "completed",
    paymentMethod: "bank_transfer",
    transactionId: "TXN-20250114-002",
  },
  {
    id: "3",
    offerTitle: "Happy Hour Special",
    offerType: "happy_hour",
    customerName: "Sara Magnúsdóttir",
    customerEmail: "sara@example.com",
    purchaseDate: "2025-01-13",
    amount: 1000,
    status: "pending",
    paymentMethod: "credit_card",
    transactionId: "TXN-20250113-003",
  },
];

const statusConfig: Record<Sale["status"], { icon: JSX.Element; badgeClass: string }> = {
  completed: {
    icon: <CheckCircle className="text-green" size={16} />,
    badgeClass: "bg-green/10 text-green",
  },
  pending: {
    icon: <AlertCircle className="text-yellow" size={16} />,
    badgeClass: "bg-yellow/10 text-yellow",
  },
  refunded: {
    icon: <AlertCircle className="text-red-500" size={16} />,
    badgeClass: "bg-red-500/10 text-red-500",
  },
};

const SaleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const sale = useMemo(() => mockSales.find((item) => item.id === id), [id]);

  const getOfferTypeLabel = (type: string) =>
    t(`companySales.offerTypes.${type}`, { defaultValue: type.replace("_", " ") });

  const getStatusLabel = (status: Sale["status"]) =>
    t(`companySales.status.${status}`);

  const getPaymentMethodLabel = (method: Sale["paymentMethod"]) =>
    t(`companySales.paymentMethods.${method}`);

  if (!sale) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/company/sales"
            className="p-2 hover:bg-primary/10 rounded-lg transition-all"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {t("companySales.detail.notFoundTitle")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("companySales.detail.notFoundDescription")}
            </p>
          </div>
        </div>
        <div className="bg-card-background border border-primary rounded-2xl p-6 text-center">
          <p className="text-gray-400">{t("companySales.detail.notFoundHint")}</p>
        </div>
      </div>
    );
  }

  const status = statusConfig[sale.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/company/sales"
          className="p-2 hover:bg-primary/10 rounded-lg transition-all"
        >
          <ArrowLeft className="text-primary" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t("companySales.detail.title")}
          </h1>
          <p className="text-gray-400 text-sm">
            {t("companySales.detail.subtitle", { offer: sale.offerTitle })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">{t("companySales.detail.offerSection.title")}</p>
                <h2 className="text-2xl font-bold text-white">{sale.offerTitle}</h2>
                <p className="text-sm text-gray-400 capitalize">
                  {getOfferTypeLabel(sale.offerType)}
                </p>
              </div>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${status.badgeClass}`}>
                {status.icon}
                {getStatusLabel(sale.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background/40 border border-primary/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-primary" size={18} />
                  <span className="text-gray-400 text-sm">
                    {t("companySales.detail.fields.purchaseDate")}
                  </span>
                </div>
                <p className="text-white font-medium">{sale.purchaseDate}</p>
              </div>
              <div className="bg-background/40 border border-primary/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Receipt className="text-primary" size={18} />
                  <span className="text-gray-400 text-sm">
                    {t("companySales.detail.fields.transactionId")}
                  </span>
                </div>
                <p className="text-white font-medium">{sale.transactionId}</p>
              </div>
              <div className="bg-background/40 border border-primary/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="text-primary" size={18} />
                  <span className="text-gray-400 text-sm">
                    {t("companySales.detail.fields.amount")}
                  </span>
                </div>
                <p className="text-white font-semibold text-xl">
                  {sale.amount.toLocaleString()} kr.
                </p>
              </div>
              <div className="bg-background/40 border border-primary/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingBag className="text-primary" size={18} />
                  <span className="text-gray-400 text-sm">
                    {t("companySales.detail.fields.offerType")}
                  </span>
                </div>
                <p className="text-white font-medium capitalize">
                  {getOfferTypeLabel(sale.offerType)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              {t("companySales.detail.customerSection.title")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background/40 border border-primary/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <User className="text-primary" size={18} />
                  <span className="text-gray-400 text-sm">
                    {t("companySales.detail.fields.customerName")}
                  </span>
                </div>
                <p className="text-white font-medium">{sale.customerName}</p>
              </div>
              <div className="bg-background/40 border border-primary/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="text-primary" size={18} />
                  <span className="text-gray-400 text-sm">
                    {t("companySales.detail.fields.customerEmail")}
                  </span>
                </div>
                <p className="text-white font-medium break-all">{sale.customerEmail}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              {t("companySales.detail.paymentSection.title")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-primary" size={18} />
                  <div>
                    <p className="text-gray-400 text-sm">
                      {t("companySales.detail.fields.paymentMethod")}
                    </p>
                    <p className="text-white font-medium">
                      {getPaymentMethodLabel(sale.paymentMethod)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Receipt className="text-primary" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">
                    {t("companySales.detail.fields.status")}
                  </p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${status.badgeClass}`}>
                    {status.icon}
                    {getStatusLabel(sale.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500 rounded-2xl p-4">
            <p className="text-sm text-blue-200">
              {t("companySales.detail.supportText")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetailsPage;

