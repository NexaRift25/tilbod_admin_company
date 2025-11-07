import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Tag,
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Modal from "@/components/ui/modal";

interface TargetedDiscount {
  id: string;
  name: string;
  createdAt: string;
  status: "active" | "inactive";
}

export default function TargetedDiscountsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [discountName, setDiscountName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const [discounts, setDiscounts] = useState<TargetedDiscount[]>([
    {
      id: "1",
      name: "Student Discount",
      createdAt: "2024-12-15",
      status: "active",
    },
    {
      id: "2",
      name: "Senior Citizen Discount",
      createdAt: "2024-12-10",
      status: "active",
    },
    {
      id: "3",
      name: "First Time Customer",
      createdAt: "2024-12-05",
      status: "inactive",
    },
  ]);

  const handleCreateDiscount = async () => {
    if (!discountName.trim()) {
      alert("Please enter a discount name");
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newDiscount: TargetedDiscount = {
      id: Date.now().toString(),
      name: discountName.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      status: "active",
    };

    setDiscounts(prev => [newDiscount, ...prev]);
    setDiscountName("");
    setShowCreateModal(false);
    setIsSaving(false);
  };

  const handleDeleteDiscount = (id: string) => {
    setDiscounts(prev => prev.filter(d => d.id !== id));
    setShowDeleteConfirm(null);
  };

  const toggleStatus = (id: string) => {
    setDiscounts(prev =>
      prev.map(d =>
        d.id === id
          ? { ...d, status: d.status === "active" ? "inactive" : "active" }
          : d
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/dashboard"
            className="p-2 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <ArrowLeft className="text-red-500" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Targeted Discounts
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Create and manage targeted discount campaigns
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-all"
        >
          <Plus size={20} />
          Create Discount
        </button>
      </div>

      {/* Discounts List */}
      <div className="bg-card-background border border-primary rounded-2xl overflow-hidden">
        <div className="p-6">
          <div className="space-y-3">
            {discounts.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="mx-auto text-gray-500 mb-4" size={48} />
                <p className="text-gray-400">No targeted discounts created yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Click "Create Discount" to get started
                </p>
              </div>
            ) : (
              discounts.map((discount) => (
                <div
                  key={discount.id}
                  className="flex items-center justify-between p-4 bg-background border border-primary/30 rounded-lg hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Tag className="text-primary" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{discount.name}</h3>
                      <p className="text-gray-400 text-sm">
                        Created on {new Date(discount.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          discount.status === "active"
                            ? "bg-green/10 text-green"
                            : "bg-red-500/40 text-white"
                        }`}
                      >
                        {discount.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleStatus(discount.id)}
                      className={`p-2 rounded-lg transition-all ${
                        discount.status === "active"
                          ? "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
                          : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                      }`}
                      title={discount.status === "active" ? "Deactivate" : "Activate"}
                    >
                      {discount.status === "active" ? (
                        <XCircle size={18} />
                      ) : (
                        <CheckCircle size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(discount.id)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Discount Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setDiscountName("");
        }}
        title="Create Targeted Discount"
      >
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Discount Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={discountName}
              onChange={(e) => setDiscountName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && discountName.trim()) {
                  handleCreateDiscount();
                }
              }}
              className="w-full px-4 py-3 bg-background border border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary"
              placeholder="e.g., Student Discount, Senior Citizen Discount"
              autoFocus
            />
            <p className="text-gray-500 text-xs mt-2">
              Enter a descriptive name for this targeted discount campaign
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-primary/30">
            <button
              onClick={() => {
                setShowCreateModal(false);
                setDiscountName("");
              }}
              className="px-6 py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateDiscount}
              disabled={isSaving || !discountName.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Discount
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        title="Delete Targeted Discount"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Are you sure you want to delete this targeted discount? This action cannot be undone.
          </p>
          {showDeleteConfirm && (
            <p className="text-white font-semibold">
              {discounts.find(d => d.id === showDeleteConfirm)?.name}
            </p>
          )}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-primary/30">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="px-6 py-2 text-gray-400 hover:text-white hover:bg-primary/10 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => showDeleteConfirm && handleDeleteDiscount(showDeleteConfirm)}
              className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

