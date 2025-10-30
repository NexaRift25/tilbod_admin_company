import { 
  Building2, 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  DollarSign,
  Activity
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Mock data for admin dashboard
  const stats = [
    {
      name: "Total Companies",
      value: "156",
      icon: Building2,
      change: "+12 this month",
      changeType: "positive",
    },
    {
      name: "Active Users",
      value: "1,234",
      icon: Users,
      change: "+8%",
      changeType: "positive",
    },
    {
      name: "Total Offers",
      value: "2,847",
      icon: FileText,
      change: "+23 this week",
      changeType: "positive",
    },
    {
      name: "Platform Revenue",
      value: "1,245,600 kr.",
      icon: DollarSign,
      change: "+15%",
      changeType: "positive",
    },
  ];

  const pendingItems = [
    {
      id: 1,
      type: "Company",
      name: "Hotel Aurora",
      status: "pending",
      submittedAt: "2 hours ago",
      category: "Hotels & Accommodation",
    },
    {
      id: 2,
      type: "Company",
      name: "Blue Lagoon Spa",
      status: "revision",
      submittedAt: "1 day ago",
      revisionCount: 1,
      category: "Wellness & Spa",
    },
    {
      id: 3,
      type: "Offer",
      name: "Weekend Getaway Package",
      status: "pending",
      submittedAt: "30 minutes ago",
      company: "Hotel Aurora",
    },
    {
      id: 4,
      type: "Offer",
      name: "Spa Day Special",
      status: "revision",
      submittedAt: "3 hours ago",
      company: "Blue Lagoon Spa",
      revisionCount: 1,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Company Approved",
      company: "Restaurant Nordic",
      timestamp: "5 minutes ago",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      id: 2,
      action: "Offer Rejected",
      offer: "Happy Hour Special",
      company: "Bar Central",
      timestamp: "1 hour ago",
      icon: XCircle,
      color: "text-red-500",
    },
    {
      id: 3,
      action: "New Company Registration",
      company: "Adventure Tours Iceland",
      timestamp: "2 hours ago",
      icon: Building2,
      color: "text-blue-500",
    },
    {
      id: 4,
      action: "Offer Approved",
      offer: "Weekend Package",
      company: "Hotel Aurora",
      timestamp: "3 hours ago",
      icon: CheckCircle,
      color: "text-green-500",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="text-green-500" size={20} />;
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
        return "bg-green-500/10 text-green-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      case "revision":
        return "bg-yellow/10 text-yellow";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "revision":
        return "Needs Revision";
      default:
        return "Pending Review";
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Manage the platform and oversee all company registrations and offers
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6 hover:border-primary/80 transition-all"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="text-primary" size={20} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-green-500">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-400 text-xs sm:text-sm mb-1">{stat.name}</h3>
              <p className="text-white text-xl sm:text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Pending Approvals */}
      <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">Pending Approvals</h2>
            <span className="bg-yellow/10 text-yellow px-2 py-1 rounded-full text-xs font-semibold">
              {pendingItems.length}
            </span>
          </div>
          <button className="text-primary hover:text-primary/80 font-medium text-xs sm:text-sm">
            View All
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {pendingItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-background rounded-lg border border-primary/50 hover:border-primary transition-all gap-3 sm:gap-0"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-primary text-xs font-semibold">{item.type}</span>
                  {item.revisionCount && (
                    <span className="bg-yellow/10 text-yellow px-2 py-0.5 rounded text-xs">
                      Revision {item.revisionCount}/3
                    </span>
                  )}
                </div>
                <h3 className="text-white font-semibold mb-1 text-sm sm:text-base truncate">
                  {item.name}
                </h3>
                <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400">
                  <span>Submitted {item.submittedAt}</span>
                  {item.category && <span>• {item.category}</span>}
                  {item.company && <span>• {item.company}</span>}
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(item.status)}`}
                >
                  {getStatusIcon(item.status)}
                  <span className="ml-1">{getStatusText(item.status)}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-1 text-green-500 hover:text-green-400 hover:bg-green-500/10 rounded transition-all">
                    <CheckCircle size={16} />
                  </button>
                  <button className="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all">
                    <XCircle size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">Recent Activity</h2>
            <Activity className="text-primary" size={20} />
          </div>
          <button className="text-primary hover:text-primary/80 font-medium text-xs sm:text-sm">
            View All
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {recentActivity.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                    className="flex items-center gap-3 p-3 bg-background rounded-lg border border-primary/50 hover:border-primary transition-all"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className={activity.color} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm sm:text-base">
                    {activity.action}
                    {activity.company && (
                      <span className="text-gray-400"> • {activity.company}</span>
                    )}
                    {activity.offer && (
                      <span className="text-gray-400"> • {activity.offer}</span>
                    )}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">{activity.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
