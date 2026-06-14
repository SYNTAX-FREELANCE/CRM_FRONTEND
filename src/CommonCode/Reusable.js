export const isValidEmail = (email) => {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email.trim());
};

export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
  });
};

export const formatDateForMySQL = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
};
    