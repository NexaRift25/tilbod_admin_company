export interface RejectionReason {
  id: string;
  category: "company" | "offer" | "both";
  reason: string;
  description: string;
}

export const companyRejectionReasons: RejectionReason[] = [
  {
    id: "comp-1",
    category: "company",
    reason: "Incomplete Information",
    description: "Required company information is missing or incomplete",
  },
  {
    id: "comp-2",
    category: "company",
    reason: "Invalid Registration Number",
    description: "The provided registration number is invalid or cannot be verified",
  },
  {
    id: "comp-3",
    category: "company",
    reason: "Invalid Tax ID",
    description: "The provided tax ID is invalid or cannot be verified",
  },
  {
    id: "comp-4",
    category: "company",
    reason: "Unverifiable Business",
    description: "Unable to verify the business exists or is legitimate",
  },
  {
    id: "comp-5",
    category: "company",
    reason: "Prohibited Category",
    description: "The business category is not allowed on the platform",
  },
  {
    id: "comp-6",
    category: "company",
    reason: "Duplicate Registration",
    description: "This company is already registered on the platform",
  },
  {
    id: "comp-7",
    category: "company",
    reason: "Terms Violation",
    description: "Company violates platform terms and conditions",
  },
  {
    id: "comp-8",
    category: "company",
    reason: "Other",
    description: "Other reason (please specify in notes)",
  },
];

export const offerRejectionReasons: RejectionReason[] = [
  {
    id: "offer-1",
    category: "offer",
    reason: "Incomplete Information",
    description: "Required offer information is missing or incomplete",
  },
  {
    id: "offer-2",
    category: "offer",
    reason: "Invalid Pricing",
    description: "Pricing information is incorrect or misleading",
  },
  {
    id: "offer-3",
    category: "offer",
    reason: "Inappropriate Content",
    description: "Offer content violates platform guidelines",
  },
  {
    id: "offer-4",
    category: "offer",
    reason: "Poor Quality Images",
    description: "Offer images do not meet quality standards",
  },
  {
    id: "offer-5",
    category: "offer",
    reason: "Misleading Description",
    description: "Offer description is misleading or inaccurate",
  },
  {
    id: "offer-6",
    category: "offer",
    reason: "Invalid Date Range",
    description: "Offer dates are invalid or in the past",
  },
  {
    id: "offer-7",
    category: "offer",
    reason: "Terms Not Compliant",
    description: "Terms and conditions do not comply with platform requirements",
  },
  {
    id: "offer-8",
    category: "offer",
    reason: "Duplicate Offer",
    description: "Similar offer already exists for this company",
  },
  {
    id: "offer-9",
    category: "offer",
    reason: "Category Mismatch",
    description: "Offer does not match the selected category",
  },
  {
    id: "offer-10",
    category: "offer",
    reason: "Company Not Approved",
    description: "The company must be approved before creating offers",
  },
  {
    id: "offer-11",
    category: "offer",
    reason: "Other",
    description: "Other reason (please specify in notes)",
  },
];

export const getAllRejectionReasons = (type: "company" | "offer"): RejectionReason[] => {
  if (type === "company") {
    return companyRejectionReasons;
  }
  return offerRejectionReasons;
};

