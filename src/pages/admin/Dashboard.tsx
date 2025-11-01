import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  DollarSign,
  Activity,
  Tag
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Mock data for admin dashboard
  const stats = [
    {
      name: "Pending Approvals",
      value: "8",
      icon: Clock,
      change: "Review in 30 min",
      changeType: "warning",
      borderColor: "border-red-500",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
    },
    {
      name: "Total Companies",
      value: "156",
      icon: Building2,
      change: "+12 this month",
      changeType: "positive",
      borderColor: "border-primary",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      name: "Active Offers",
      value: "342",
      icon: Tag,
      change: "+28 this week",
      changeType: "positive",
      borderColor: "border-primary",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      name: "Platform Revenue",
      value: "1.2M kr.",
      icon: DollarSign,
      change: "+15%",
      changeType: "positive",
      borderColor: "border-primary",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
  ];

  const pendingItems = [
    {
      id: 1,
      type: "Company",
      name: "Nordic Spa & Wellness",
      status: "pending",
      submittedAt: "5 minutes ago",
      company: "Nordic Group",
      timeRemaining: 25,
      urgent: false,
    },
    {
      id: 2,
      type: "Offer",
      name: "Christmas Special - 50% Off",
      status: "pending",
      submittedAt: "12 minutes ago",
      company: "Hotel Aurora",
      timeRemaining: 18,
      urgent: false,
    },
    {
      id: 3,
      type: "Company",
      name: "Reykjavik Bar & Lounge",
      status: "pending",
      submittedAt: "20 minutes ago",
      company: "Nightlife Co.",
      timeRemaining: 10,
      urgent: true,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Company Approved",
      company: "Restaurant Nordic",
      timestamp: "5 minutes ago",
      icon: CheckCircle,
      color: "text-green",
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
      color: "text-green",
    },
  ];


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
          const changeColor = stat.changeType === "warning" 
            ? "text-yellow" 
            : stat.changeType === "positive" 
            ? "text-green" 
            : "text-red-500";
          
          return (
            <div
              key={stat.name}
              className={`bg-card-background border ${stat.borderColor} rounded-2xl p-4 sm:p-6 hover:${stat.borderColor}/80 transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.iconBg} rounded-lg flex items-center justify-center p-2 sm:p-2.5`}>
                  <Icon className={stat.iconColor} size={20} />
                </div>
                <span className={`text-xs sm:text-sm font-semibold ${changeColor}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-white text-sm sm:text-base mb-3">{stat.name}</h3>
              <p className="text-white text-2xl sm:text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Approval Queue */}
      <div className="bg-card-background border border-red-500 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <h2 className="text-lg sm:text-xl font-bold text-white">Approval Queue</h2>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
              30 min SLA
            </span>
          </div>
          <button className="text-red-500 hover:text-red-400 font-medium text-xs sm:text-sm">
            Review All
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {pendingItems.map((item) => {
            const isUrgent = item.urgent || item.timeRemaining <= 10;
            const borderColor = isUrgent ? "border-red-500 hover:border-red-500/80" : "border-primary hover:border-primary/80";
            const timeColor = isUrgent ? "text-red-500" : "text-white";
            
            return (
              <div
                key={item.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background rounded-lg border ${borderColor} transition-all gap-3 sm:gap-4`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-primary text-xs font-semibold">{item.type}</span>
                    {isUrgent && (
                      <>
                        <AlertCircle className="text-red-500" size={14} />
                        <span className="text-red-500 text-xs font-semibold">Urgent</span>
                      </>
                    )}
                    <span className="text-white font-bold text-sm sm:text-base">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                    <span>{item.company}</span>
                    <span>•</span>
                    <span>Submitted {item.submittedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`bg-gray-500/20 ${timeColor} px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap`}>
                    {item.timeRemaining} min left
                  </span>
                  <button className="bg-primary text-dark px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all">
                    Review
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card-background border border-primary rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">Recent Activity</h2>
            <Activity className="text-primary" size={20} />
          </div>
          <button className="text-primary hover:text-primary/80 font-medium text-xs sm:text-lg">
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
