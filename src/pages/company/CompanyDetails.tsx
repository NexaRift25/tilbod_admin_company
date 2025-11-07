import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Calendar,
  Hash,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function CompanyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { companies } = useAuth();
  const { t } = useTranslation();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && companies) {
      const foundCompany = companies.find((c) => c.id === id);
      if (foundCompany) {
        setCompany(foundCompany);
      }
      setLoading(false);
    }
  }, [id, companies]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="text-green" size={20} />;
      case "rejected":
        return <XCircle className="text-red-500" size={20} />;
      case "revision":
        return <AlertCircle className="text-yellow" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green/20 text-green border border-green/30";
      case "rejected":
        return "bg-red-500/20 text-red-500 border border-red-500/30";
      case "revision":
        return "bg-yellow/20 text-yellow border border-yellow/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return t("status.approved");
      case "rejected":
        return t("status.rejected");
      case "revision":
        return t("status.revision");
      default:
        return t("companies.pendingReview");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-card-background border border-primary rounded-lg animate-pulse" />
          <div className="flex-1">
            <div className="h-8 bg-card-background border border-primary rounded-lg animate-pulse mb-2" />
            <div className="h-4 bg-card-background border border-primary rounded-lg animate-pulse w-2/3" />
          </div>
        </div>
        <div className="bg-card-background border border-primary rounded-2xl p-6 animate-pulse">
          <div className="h-64 bg-background rounded-lg" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-4">
          <Link
            to="/company/companies"
            className="flex items-center justify-center w-10 h-10 border border-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              {t("companyDetails.companyNotFound")}
            </h1>
          </div>
        </div>
        <div className="bg-card-background border border-primary rounded-2xl p-6 text-center">
          <p className="text-gray-400">{t("companyDetails.companyNotFoundMessage")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary rounded-2xl p-6 sm:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/company/companies")}
              className="flex items-center justify-center w-12 h-12 border border-primary/50 bg-card-background/50 backdrop-blur-sm rounded-lg hover:bg-primary/20 transition-all hover:scale-105"
            >
              <ArrowLeft className="text-primary" size={20} />
            </button>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Building2 className="text-primary" size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                      {company.name}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="flex items-center gap-1">
                        <FileText size={14} />
                        {company.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {t("companyDetails.registered", { date: new Date(company.createdAt).toLocaleDateString() })}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm flex items-center gap-2 ${getStatusColor(
                    company.status
                  )}`}
                >
                  {getStatusIcon(company.status)}
                  {getStatusText(company.status)}
                </span>
              </div>
            </div>
            <Link
              to={`/company/companies/${company.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all"
            >
              <Edit size={18} />
              {t("companyDetails.edit")}
            </Link>
          </div>
        </div>
      </div>

      {/* Status Alerts */}
      {company.status === "revision" && company.revisionCount && (
        <div className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/50 rounded-2xl p-5 sm:p-6 shadow-lg shadow-orange-500/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="text-orange-500" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-orange-400 font-bold text-lg mb-2">{t("companyDetails.revisionRequired")}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t("companyDetails.revisionMessage", { count: company.revisionCount, max: "3" })}
              </p>
            </div>
          </div>
        </div>
      )}

      {company.status === "rejected" && (
        <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 border border-red-500/50 rounded-2xl p-5 sm:p-6 shadow-lg shadow-red-500/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <XCircle className="text-red-500" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-red-400 font-bold text-lg mb-2">{t("companyDetails.companyRejected")}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t("companyDetails.rejectionMessage")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <div className="bg-card-background border border-primary rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Building2 className="text-primary" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">{t("companyDetails.companyInformation")}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">{t("companyDetails.category")}</p>
                <p className="text-white font-semibold text-lg">{company.category}</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Hash size={14} />
                  {t("companyDetails.registrationNumber")}
                </p>
                <p className="text-white font-semibold text-lg">{company.registrationNumber}</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Hash size={14} />
                  {t("companyDetails.taxId")}
                </p>
                <p className="text-white font-semibold text-lg">{company.taxId}</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Calendar size={14} />
                  {t("companyDetails.registeredDate")}
                </p>
                <p className="text-white font-semibold text-lg">
                  {new Date(company.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            {(company.email || company.phone || company.address || company.website) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">{t("companyDetails.contactInformation")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {company.email && (
                    <div className="bg-background/50 rounded-xl p-4 border border-primary/30 hover:border-primary/50 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Mail className="text-primary" size={16} />
                        </div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide">{t("companyDetails.email")}</p>
                      </div>
                      <p className="text-white font-medium">{company.email}</p>
                    </div>
                  )}
                  {company.phone && (
                    <div className="bg-background/50 rounded-xl p-4 border border-primary/30 hover:border-primary/50 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Phone className="text-primary" size={16} />
                        </div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide">{t("companyDetails.phone")}</p>
                      </div>
                      <p className="text-white font-medium">{company.phone}</p>
                    </div>
                  )}
                  {company.address && (
                    <div className="bg-background/50 rounded-xl p-4 border border-primary/30 hover:border-primary/50 transition-all sm:col-span-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <MapPin className="text-primary" size={16} />
                        </div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide">{t("companyDetails.address")}</p>
                      </div>
                      <p className="text-white font-medium">{company.address}</p>
                      {company.city && company.postalCode && (
                        <p className="text-gray-400 text-sm mt-1">
                          {company.city}, {company.postalCode}
                        </p>
                      )}
                    </div>
                  )}
                  {company.website && (
                    <div className="bg-background/50 rounded-xl p-4 border border-primary/30 hover:border-primary/50 transition-all sm:col-span-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Globe className="text-primary" size={16} />
                        </div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide">{t("companyDetails.website")}</p>
                      </div>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-medium hover:underline break-all"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {company.description && (
              <div className="mt-6 pt-6 border-t border-primary/30">
                <h3 className="text-lg font-semibold text-white mb-3">{t("companyDetails.description")}</h3>
                <p className="text-gray-300 leading-relaxed bg-background/30 rounded-xl p-4 border border-primary/20">
                  {company.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Status & Actions */}
        <div className="space-y-6">
          <div className="bg-card-background border border-primary rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <FileText className="text-primary" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">{t("companyDetails.status")}</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Clock size={14} />
                  {t("companyDetails.registeredLabel")}
                </p>
                <p className="text-white font-semibold">
                  {new Date(company.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">{t("companyDetails.status")}</p>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(
                    company.status
                  )}`}
                >
                  {getStatusIcon(company.status)}
                  {getStatusText(company.status)}
                </span>
              </div>
              {company.revisionCount > 0 && (
                <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                    {t("companyDetails.revisionAttempts")}
                  </p>
                  <p className="text-white font-semibold">
                    {company.revisionCount} / 3
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card-background border border-primary rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">{t("companyDetails.quickActions")}</h3>
            <div className="space-y-3">
              <Link
                to={`/company/companies/${company.id}/edit`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all"
              >
                <Edit size={18} />
                {t("companyDetails.editCompany")}
              </Link>
              {company.status === "approved" && (
                <Link
                  to="/company/create-offer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-background border border-primary text-white font-semibold rounded-lg hover:bg-primary/10 transition-all"
                >
                  {t("companyDetails.createOffer")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

