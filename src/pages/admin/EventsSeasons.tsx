import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Clock,
  Tag,
  Building2,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function EventsSeasonsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);

  const [events, setEvents] = useState([
    {
      id: "1",
      name: "Summer Festival 2025",
      type: "Event",
      startDate: "2025-06-15",
      endDate: "2025-06-30",
      description: "Annual summer festival with special offers from all partners",
      status: "active",
      participatingCompanies: 45,
      specialOffers: 12,
    },
    {
      id: "2",
      name: "Christmas Season",
      type: "Season",
      startDate: "2025-12-01",
      endDate: "2025-12-31",
      description: "Holiday season promotions and gift card campaigns",
      status: "scheduled",
      participatingCompanies: 0,
      specialOffers: 0,
    },
    {
      id: "3",
      name: "New Year Sale",
      type: "Event",
      startDate: "2025-12-28",
      endDate: "2026-01-05",
      description: "New Year promotion with discounted offers",
      status: "scheduled",
      participatingCompanies: 8,
      specialOffers: 3,
    },
    {
      id: "4",
      name: "Spring Break",
      type: "Season",
      startDate: "2025-04-01",
      endDate: "2025-04-30",
      description: "Spring break special offers for travelers",
      status: "ended",
      participatingCompanies: 32,
      specialOffers: 28,
    },
  ]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500";
      case "scheduled":
        return "bg-blue-500/10 text-blue-500 border-blue-500";
      case "ended":
        return "bg-gray-500/10 text-gray-400 border-gray-500";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="text-green-500" size={16} />;
      case "scheduled":
        return <Clock className="text-blue-500" size={16} />;
      case "ended":
        return <XCircle className="text-gray-400" size={16} />;
      default:
        return null;
    }
  };

  const eventStats = {
    total: events.length,
    active: events.filter(e => e.status === "active").length,
    scheduled: events.filter(e => e.status === "scheduled").length,
    ended: events.filter(e => e.status === "ended").length,
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
              Events & Seasons
            </h1>
            <p className="text-gray-400 text-sm">
              Manage seasonal events and promotional campaigns
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
        >
          <Plus size={20} />
          Create Event
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Events</p>
              <p className="text-white text-2xl font-bold">{eventStats.total}</p>
            </div>
            <Calendar className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-white text-2xl font-bold">{eventStats.active}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Scheduled</p>
              <p className="text-white text-2xl font-bold">{eventStats.scheduled}</p>
            </div>
            <Clock className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-gray-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ended</p>
              <p className="text-white text-2xl font-bold">{eventStats.ended}</p>
            </div>
            <XCircle className="text-gray-400" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card-background border border-primary rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="Event">Events</option>
              <option value="Season">Seasons</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-card-background border border-primary rounded-2xl p-8 text-center">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
            <p className="text-gray-400">
              Create your first event or season to get started
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-card-background border border-primary rounded-2xl p-6 hover:border-primary/80 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <Calendar className="text-primary" size={24} />
                    <h3 className="text-xl font-bold text-white">{event.name}</h3>
                    <span className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold border ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                      <span className="ml-1 capitalize">{event.status}</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.type === "Event" 
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-purple-500/10 text-purple-500"
                    }`}>
                      {event.type}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{event.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Start Date</p>
                      <p className="text-white font-medium">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">End Date</p>
                      <p className="text-white font-medium">
                        {new Date(event.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Companies</p>
                      <p className="text-white font-medium flex items-center gap-1">
                        <Building2 size={16} />
                        {event.participatingCompanies}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Special Offers</p>
                      <p className="text-white font-medium flex items-center gap-1">
                        <Tag size={16} />
                        {event.specialOffers}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                    <Edit size={20} />
                  </button>
                  <button className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

