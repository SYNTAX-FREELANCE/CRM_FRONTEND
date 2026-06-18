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
    



// src/constants/options.js

export const QUALIFICATION_OPTIONS = [
    "-- Select --", "10th", "12th", "Diploma", "ITI",
    "Graduate", "Post Graduate", "PhD", "Other",
];

export const COMPANY_OPTIONS = [
    "-- Select --", "Head Office", "Branch - Chennai",
    "Branch - Mumbai", "Branch - Delhi", "Branch - Bengaluru",
];

export const ROLE_OPTIONS = [
    "-- Select --", "Admin", "Manager", "Team Lead",
    "Telecaller", "Field Agent", "Accounts", "HR", "IT Support",
];

export const STATUS_OPTIONS = [
    "-- Select --", "Active", "Inactive", "On Leave",
    "Probation", "Terminated",
];