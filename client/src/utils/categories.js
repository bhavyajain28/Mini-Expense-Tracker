export const CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Other',
];

export const CATEGORY_COLORS = {
  Food: '#3b82f6',
  Transport: '#8b5cf6',
  Housing: '#10b981',
  Entertainment: '#f59e0b',
  Healthcare: '#ef4444',
  Shopping: '#ec4899',
  Education: '#14b8a6',
  Other: '#6b7280',
};

export const getCategoryColor = (category) =>
  CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
