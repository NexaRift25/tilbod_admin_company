const DISCOUNT_LABELS_STORAGE_KEY = "tilbod_discount_labels";

export interface DiscountLabel {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  description: string;
  status: "active" | "inactive";
  applicableTo: ("active" | "weekdays" | "happy_hour" | "gift_card")[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export const getDiscountLabels = (): DiscountLabel[] => {
  const stored = localStorage.getItem(DISCOUNT_LABELS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

export const getActiveDiscountLabels = (offerType?: "active" | "weekdays" | "happy_hour" | "gift_card"): DiscountLabel[] => {
  const labels = getDiscountLabels();
  const active = labels.filter(label => label.status === "active");
  
  if (offerType) {
    return active.filter(label => label.applicableTo.includes(offerType));
  }
  
  return active;
};

export const calculateDiscountPrice = (
  originalPrice: number,
  label: DiscountLabel | null
): { discountPrice: number; discountPercentage: number } => {
  if (!label || label.status !== "active") {
    return {
      discountPrice: originalPrice,
      discountPercentage: 0,
    };
  }

  let discountAmount = 0;
  
  if (label.type === "percentage") {
    discountAmount = (originalPrice * label.value) / 100;
  } else {
    discountAmount = label.value;
  }

  const discountPrice = Math.max(0, originalPrice - discountAmount);
  const discountPercentage = originalPrice > 0 
    ? Math.round((discountAmount / originalPrice) * 100) 
    : 0;

  return {
    discountPrice,
    discountPercentage,
  };
};

export const incrementLabelUsage = (labelId: string): void => {
  const labels = getDiscountLabels();
  const updated = labels.map(label =>
    label.id === labelId
      ? { ...label, usageCount: label.usageCount + 1 }
      : label
  );
  localStorage.setItem(DISCOUNT_LABELS_STORAGE_KEY, JSON.stringify(updated));
};

