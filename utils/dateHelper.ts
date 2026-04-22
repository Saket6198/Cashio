export const formatDate = (date?: Date) => {
  if (!date) return "Select Date";
  return date.toLocaleDateString();
};
