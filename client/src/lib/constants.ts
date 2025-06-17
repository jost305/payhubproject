export const PRICING_PLANS = {
  starter: {
    name: "Starter",
    price: "Free",
    features: [
      "Up to 5 projects",
      "1GB storage",
      "Basic preview sharing",
      "PayVidi subdomain"
    ],
    commission: 5
  },
  professional: {
    name: "Professional", 
    price: "$29/mo",
    features: [
      "Unlimited projects",
      "50GB storage", 
      "Custom subdomain",
      "Advanced analytics",
      "Priority support"
    ],
    commission: 3
  },
  enterprise: {
    name: "Enterprise",
    price: "$99/mo", 
    features: [
      "Everything in Professional",
      "500GB storage",
      "Team collaboration", 
      "White-label option",
      "API access"
    ],
    commission: 2
  }
};

export const PROJECT_STATUSES = {
  draft: "Draft",
  preview_shared: "Preview Shared",
  approved: "Approved", 
  paid: "Paid",
  completed: "Completed"
};
