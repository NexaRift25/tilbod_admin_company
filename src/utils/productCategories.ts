const PRODUCT_CATEGORIES_STORAGE_KEY = "tilbod_product_categories";

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  offersCount?: number;
}

export const getProductCategories = (): ProductCategory[] => {
  const stored = localStorage.getItem(PRODUCT_CATEGORIES_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

export const getActiveProductCategories = (): string[] => {
  const categories = getProductCategories();
  return categories
    .filter(cat => cat.status === "active")
    .map(cat => cat.name);
};

export const searchProductCategories = (searchTerm: string): string[] => {
  const categories = getProductCategories();
  const lowerSearch = searchTerm.toLowerCase();
  return categories
    .filter(cat => 
      cat.status === "active" && 
      (cat.name.toLowerCase().includes(lowerSearch) || 
       cat.description.toLowerCase().includes(lowerSearch))
    )
    .map(cat => cat.name);
};

