import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
} from "lucide-react";
import Modal from "@/components/ui/modal";

interface Category {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  offersCount?: number;
  companiesCount?: number;
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Hotels & Accommodation",
      description: "Hotels, guesthouses, and accommodation services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 245,
      companiesCount: 32,
    },
    {
      id: "2",
      name: "Food & Dining",
      description: "Restaurants, cafes, bars, and food services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 456,
      companiesCount: 45,
    },
    {
      id: "3",
      name: "Wellness & Spa",
      description: "Spas, wellness centers, and relaxation services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 123,
      companiesCount: 28,
    },
    {
      id: "4",
      name: "Activities & Entertainment",
      description: "Tours, activities, and entertainment services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 234,
      companiesCount: 25,
    },
    {
      id: "5",
      name: "Shopping & Retail",
      description: "Retail stores, shops, and shopping services",
      status: "inactive",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T14:30:00Z",
      offersCount: 89,
      companiesCount: 15,
    },
    {
      id: "6",
      name: "Beauty & Personal Care",
      description: "Beauty salons, personal care, and grooming services",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      offersCount: 67,
      companiesCount: 11,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active" as "active" | "inactive",
  });

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || category.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        status: category.status,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        status: "active",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      status: "active",
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat =>
        cat.id === editingCategory.id
          ? {
              ...cat,
              name: formData.name,
              description: formData.description,
              status: formData.status,
              updatedAt: new Date().toISOString(),
            }
          : cat
      ));
    } else {
      // Add new category
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        offersCount: 0,
        companiesCount: 0,
      };
      setCategories(prev => [...prev, newCategory]);
    }

    setIsSaving(false);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleToggleStatus = (id: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === id
        ? {
            ...cat,
            status: cat.status === "active" ? "inactive" : "active",
            updatedAt: new Date().toISOString(),
          }
        : cat
    ));
  };

  const getStatusIcon = (status: string) => {
    return status === "active" ? (
      <CheckCircle className="text-green" size={20} />
    ) : (
      <XCircle className="text-gray-400" size={20} />
    );
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green/10 text-green border-green"
      : "bg-gray-500/10 text-gray-400 border-gray-500";
  };

  const categoryStats = {
    total: categories.length,
    active: categories.filter(c => c.status === "active").length,
    inactive: categories.filter(c => c.status === "inactive").length,
    totalOffers: categories.reduce((sum, c) => sum + (c.offersCount || 0), 0),
    totalCompanies: categories.reduce((sum, c) => sum + (c.companiesCount || 0), 0),
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
              Category Management
            </h1>
            <p className="text-gray-400 text-sm">
              Manage platform categories and classifications
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-all"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card-background border border-primary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Categories</p>
              <p className="text-white text-2xl font-bold">{categoryStats.total}</p>
            </div>
            <FolderOpen className="text-primary" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-green rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-white text-2xl font-bold">{categoryStats.active}</p>
            </div>
            <CheckCircle className="text-green" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-gray-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Inactive</p>
              <p className="text-white text-2xl font-bold">{categoryStats.inactive}</p>
            </div>
            <XCircle className="text-gray-400" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Offers</p>
              <p className="text-white text-2xl font-bold">{categoryStats.totalOffers}</p>
            </div>
            <AlertCircle className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-card-background border border-purple-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Companies</p>
              <p className="text-white text-2xl font-bold">{categoryStats.totalCompanies}</p>
            </div>
            <FolderOpen className="text-purple-500" size={24} />
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
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-primary/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="bg-card-background border border-primary rounded-2xl p-8 text-center">
            <FolderOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No categories found</h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first category to get started"}
            </p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-card-background border border-primary rounded-2xl p-6 hover:border-primary/80 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <FolderOpen className="text-primary" size={24} />
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                    <span className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-semibold border ${getStatusColor(category.status)}`}>
                      {getStatusIcon(category.status)}
                      <span className="ml-1 capitalize">{category.status}</span>
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{category.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Companies</p>
                      <p className="text-white font-medium">{category.companiesCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Offers</p>
                      <p className="text-white font-medium">{category.offersCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Last Updated</p>
                      <p className="text-white font-medium">
                        {new Date(category.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleStatus(category.id)}
                    className={`p-2 rounded-lg transition-all ${
                      category.status === "active"
                        ? "text-gray-400 hover:text-yellow hover:bg-yellow/10"
                        : "text-gray-400 hover:text-green hover:bg-green/10"
                    }`}
                    title={category.status === "active" ? "Deactivate" : "Activate"}
                  >
                    {category.status === "active" ? (
                      <XCircle size={20} />
                    ) : (
                      <CheckCircle size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title="Edit Category"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(category.id)}
                    className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete Category"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingCategory ? "Edit Category" : "Add New Category"}
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
              disabled={!formData.name.trim() || isSaving}
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
                  {editingCategory ? "Update Category" : "Create Category"}
                </>
              )}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter category name"
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter category description"
              rows={4}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Status
            </label>
            <div className="flex items-center gap-4">
              <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition-all ${
                formData.status === "active"
                  ? "bg-green/10"
                  : "bg-background"
              }`}>
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === "active"}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "active" | "inactive" }))}
                  className="w-4 h-4 text-green bg-background border-green focus:ring-green focus:ring-2"
                />
                <span className={`flex items-center gap-2 font-medium ${
                  formData.status === "active" ? "text-green" : "text-green"
                }`}>
                  <CheckCircle className="text-green" size={16} />
                  Active
                </span>
              </label>
              <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition-all`}>
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === "inactive"}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "active" | "inactive" }))}
                  className="w-4 h-4 text-red-500 bg-background border-red-500 focus:ring-red-500 focus:ring-2"
                />
                <span className={`flex items-center gap-2 font-medium ${
                  formData.status === "inactive" ? "text-red-500" : "text-red-500"
                }`}>
                  <XCircle className="text-red-500" size={16} />
                  Inactive
                </span>
              </label>
            </div>
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
              className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-500/90 transition-all"
            >
              Delete Category
            </button>
          </div>
        }
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-500" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Delete Category</h3>
            <p className="text-gray-400 text-sm">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-gray-300">
          Are you sure you want to delete{" "}
          <span className="text-white font-semibold">
            {categories.find(c => c.id === showDeleteConfirm)?.name}
          </span>
          ? This will affect all associated companies and offers.
        </p>
      </Modal>
    </div>
  );
}

