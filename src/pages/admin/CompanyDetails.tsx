import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  Users,
  Plus,
  Trash2,
  Search,
  Save,
} from "lucide-react";
import Modal from "@/components/ui/modal";

interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  taxId: string;
  category: string;
  status: "pending" | "approved" | "revision" | "rejected";
  revisionCount: number;
  createdAt: string;
  email: string;
  phone: string;
  address: string;
  owner: string;
  offersCount: number;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: string;
  purchasesCount?: number;
  totalSpent?: number;
}

// Mock data - in real app, fetch from API
const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Blue Lagoon Spa",
    registrationNumber: "550289-2349",
    taxId: "TAX-001",
    category: "Wellness & Spa",
    status: "approved",
    revisionCount: 0,
    createdAt: "2024-11-15T10:00:00Z",
    email: "info@bluelagoon.is",
    phone: "+354 420 8800",
    address: "240 Grindavík",
    owner: "John Doe",
    offersCount: 5,
  },
  {
    id: "2",
    name: "Hotel Aurora",
    registrationNumber: "560123-4567",
    taxId: "TAX-002",
    category: "Hotels & Accommodation",
    status: "approved",
    revisionCount: 0,
    createdAt: "2025-01-10T14:30:00Z",
    email: "reservations@hotelaurora.is",
    phone: "+354 555 1234",
    address: "Reykjavík",
    owner: "Jane Smith",
    offersCount: 3,
  },
];

const CUSTOMERS_STORAGE_KEY = "tilbod_company_customers";

export default function AdminCompanyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    // Simulate API call
    const fetchCompanyData = () => {
      setLoading(true);
      setTimeout(() => {
        const foundCompany = mockCompanies.find((c) => c.id === id);
        setCompany(foundCompany || null);
        setLoading(false);
      }, 500);
    };

    fetchCompanyData();
  }, [id]);

  // Load customers from localStorage
  useEffect(() => {
    if (id) {
      const stored = localStorage.getItem(`${CUSTOMERS_STORAGE_KEY}_${id}`);
      if (stored) {
        try {
          setCustomers(JSON.parse(stored));
        } catch {
          setCustomers([]);
        }
      } else {
        // Default customers for demo
        const defaultCustomers: Customer[] = [
          {
            id: "1",
            firstName: "Anna",
            lastName: "Jónsdóttir",
            email: "anna.jonsdottir@example.com",
            phone: "+354 555 1111",
            address: "Reykjavík, Iceland",
            notes: "Regular customer, prefers spa packages",
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            purchasesCount: 5,
            totalSpent: 175000,
          },
          {
            id: "2",
            firstName: "Björn",
            lastName: "Guðmundsson",
            email: "bjorn.gudmundsson@example.com",
            phone: "+354 555 2222",
            address: "Akureyri, Iceland",
            notes: "Corporate bookings",
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            purchasesCount: 12,
            totalSpent: 420000,
          },
        ];
        setCustomers(defaultCustomers);
      }
    }
  }, [id]);

  // Save customers to localStorage
  useEffect(() => {
    if (id && customers.length > 0) {
      localStorage.setItem(`${CUSTOMERS_STORAGE_KEY}_${id}`, JSON.stringify(customers));
    }
  }, [customers, id]);

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchTerm)
    );
  });

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || "",
      notes: customer.notes || "",
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCustomer(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    });
  };

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (editingCustomer) {
      // Update existing customer
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? {
                ...c,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                notes: formData.notes,
              }
            : c
        )
      );
    } else {
      // Add new customer
      const newCustomer: Customer = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || undefined,
        notes: formData.notes || undefined,
        createdAt: new Date().toISOString(),
        purchasesCount: 0,
        totalSpent: 0,
      };
      setCustomers((prev) => [...prev, newCustomer]);
    }

    setIsSaving(false);
    handleCloseModal();
  };

  const handleDelete = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    setShowDeleteConfirm(null);
  };

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
        return "Approved";
      case "rejected":
        return "Rejected";
      case "revision":
        return "Needs Revision";
      default:
        return "Pending Review";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-card-background border border-primary rounded-lg animate-pulse" />
          <div className="flex-1">
            <div className="h-8 bg-card-background border border-primary rounded-lg animate-pulse mb-2" />
            <div className="h-4 bg-card-background border border-primary rounded-lg animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/companies"
            className="p-2 hover:bg-primary/10 rounded-lg transition-all"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Company Not Found</h1>
        </div>
        <div className="bg-card-background border border-primary rounded-2xl p-8 text-center">
          <p className="text-gray-400">The company you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/companies"
            className="p-2 hover:bg-primary/10 rounded-lg transition-all"
          >
            <ArrowLeft className="text-primary" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{company.name}</h1>
            <p className="text-gray-400 text-sm">Company Details & Customer Management</p>
          </div>
        </div>
        <Link
          to={`/admin/companies/${company.id}/edit`}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all"
        >
          <Edit size={18} />
          Edit Company
        </Link>
      </div>

      {/* Company Status Banner */}
      <div className={`bg-card-background border rounded-2xl p-4 ${getStatusColor(company.status)}`}>
        <div className="flex items-center gap-3">
          {getStatusIcon(company.status)}
          <div>
            <p className="font-semibold">Status: {getStatusText(company.status)}</p>
            {company.status === "revision" && (
              <p className="text-sm opacity-90 mt-1">
                Revision attempt {company.revisionCount} of 3
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Building2 className="text-primary" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Company Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Category</p>
                <p className="text-white font-semibold text-lg">{company.category}</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Hash size={14} />
                  Registration Number
                </p>
                <p className="text-white font-semibold text-lg">{company.registrationNumber}</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Hash size={14} />
                  Tax ID
                </p>
                <p className="text-white font-semibold text-lg">{company.taxId}</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-primary/30">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Calendar size={14} />
                  Registered Date
                </p>
                <p className="text-white font-semibold text-lg">
                  {new Date(company.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">{company.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gray-400" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white font-medium">{company.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-400" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white font-medium">{company.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-gray-400" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">Owner</p>
                  <p className="text-white font-medium">{company.owner}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Management Section */}
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Users className="text-primary" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Customer List</h2>
                  <p className="text-gray-400 text-sm">{customers.length} customers</p>
                </div>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all"
              >
                <Plus size={18} />
                Add Customer
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
                />
              </div>
            </div>

            {/* Customers List */}
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-bold text-white mb-2">No customers found</h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm ? "Try adjusting your search" : "Add your first customer to get started"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all mx-auto"
                  >
                    <Plus size={18} />
                    Add Customer
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="bg-background/50 border border-primary/30 rounded-lg p-4 hover:border-primary/60 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <Users className="text-primary" size={18} />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">
                              {customer.firstName} {customer.lastName}
                            </h3>
                            <p className="text-gray-400 text-sm">{customer.email}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="text-gray-400" size={14} />
                            <span className="text-gray-300">{customer.phone}</span>
                          </div>
                          {customer.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="text-gray-400" size={14} />
                              <span className="text-gray-300">{customer.address}</span>
                            </div>
                          )}
                          {customer.purchasesCount !== undefined && (
                            <div className="flex items-center gap-2">
                              <FileText className="text-gray-400" size={14} />
                              <span className="text-gray-300">
                                {customer.purchasesCount} purchases
                              </span>
                            </div>
                          )}
                          {customer.totalSpent !== undefined && (
                            <div className="flex items-center gap-2">
                              <Globe className="text-gray-400" size={14} />
                              <span className="text-gray-300">
                                {customer.totalSpent.toLocaleString()} kr. spent
                              </span>
                            </div>
                          )}
                        </div>

                        {customer.notes && (
                          <div className="mt-3 pt-3 border-t border-primary/20">
                            <p className="text-gray-400 text-sm">
                              <span className="font-semibold">Notes:</span> {customer.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(customer)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Edit Customer"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(customer.id)}
                          className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete Customer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-card-background border border-primary rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Total Customers</p>
                <p className="text-white text-2xl font-bold">{customers.length}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Offers</p>
                <p className="text-white text-2xl font-bold">{company.offersCount}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Purchases</p>
                <p className="text-white text-2xl font-bold">
                  {customers.reduce((sum, c) => sum + (c.purchasesCount || 0), 0)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-white text-2xl font-bold">
                  {customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString()} kr.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Customer Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title={editingCustomer ? "Edit Customer" : "Add New Customer"}
        size="2xl"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleCloseModal}
              className="px-6 py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {editingCustomer ? "Update Customer" : "Add Customer"}
                </>
              )}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
                className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
                className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="customer@example.com"
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+354 555 1234"
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Street address, City"
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this customer..."
              rows={4}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="px-6 py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(showDeleteConfirm!)}
              className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
            >
              Delete Customer
            </button>
          </div>
        }
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-500" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Delete Customer</h3>
            <p className="text-gray-400 text-sm">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-gray-300">
          Are you sure you want to delete{" "}
          <span className="text-white font-semibold">
            {customers.find((c) => c.id === showDeleteConfirm)?.firstName}{" "}
            {customers.find((c) => c.id === showDeleteConfirm)?.lastName}
          </span>
          ? This will remove all customer information from this company.
        </p>
      </Modal>
    </div>
  );
}

