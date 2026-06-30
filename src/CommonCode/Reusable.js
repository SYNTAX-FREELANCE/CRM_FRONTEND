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


export const GENDER_OTPION = [
  { id: 'F', label: 'Female' },
  { id: 'M', label: 'Male' },
  { id: 'O', label: 'Others' },
]

export const summaryData = [
  { label: "New Calls", value: 24, color: "#2563eb" },
  { label: "Today's Follow-ups", value: 12, color: "#f59e0b" },
  { label: "Pending Quotes", value: 8, color: "#2563eb" },
  { label: "Appointments", value: 5, color: "#10b981" },
  { label: "Converted Leads", value: 18, color: "#7c3aed" },
];
export const statusOptions = ["All", "New", "Call Back", "Quote", "Appointment", "Sold", "Lost"];

export const leadsSeed = [
  {
    id: 1,
    customerName: "Ajith Kumar",
    mobile: "9876543210",
    alternateMobile: "9876501234",
    regNo: "KL-07-AB-1234",
    vehicleModel: "Hyundai Creta",
    vehicleType: "SUV",
    leadAge: "12 mins",
    status: "New",
    address: "Kakkanad, Kochi, Kerala",
    previousNotes: "Customer called earlier asking about insurance renewal and service history.",
    remarks: "High priority, call before 5 PM.",
    source: "Walk-in",
    nextFollowUp: "Today, 4:30 PM",
  },
  {
    id: 2,
    customerName: "Neha Thomas",
    mobile: "8899001122",
    alternateMobile: "8899001133",
    regNo: "KL-17-CD-8899",
    vehicleModel: "Toyota Innova",
    vehicleType: "MPV",
    leadAge: "1 hr",
    status: "Call Back",
    address: "Palarivattom, Ernakulam",
    previousNotes: "Requested quote for annual service package.",
    remarks: "Ask about discount on package service.",
    source: "Website",
    nextFollowUp: "Today, 5:15 PM",
  },
  {
    id: 3,
    customerName: "Rahul Menon",
    mobile: "9447009988",
    alternateMobile: "9447009989",
    regNo: "KL-40-ZZ-7777",
    vehicleModel: "Tata Nexon",
    vehicleType: "SUV",
    leadAge: "3 hrs",
    status: "Quote",
    address: "Thrippunithura, Kochi",
    previousNotes: "Waiting for quotation on denting and painting.",
    remarks: "Needs quick quote on WhatsApp.",
    source: "Admin Added",
    nextFollowUp: "Tomorrow, 10:00 AM",
  },
];


export const statusColors = {
  New: { bg: "#dbeafe", color: "#1d4ed8" },
  "Call Back": { bg: "#fef3c7", color: "#d97706" },
  Quote: { bg: "#ffedd5", color: "#ea580c" },
  Appointment: { bg: "#e0e7ff", color: "#4338ca" },
  Sold: { bg: "#dcfce7", color: "#15803d" },
  Lost: { bg: "#fee2e2", color: "#dc2626" },
};


// export const colorConfig = {
//   All: { color: "#475569", bg: "rgba(71, 85, 105, 0.08)", activeBg: "linear-gradient(135deg, #475569 0%, #334155 100%)", activeShadow: "0 6px 15px rgba(71, 85, 105, 0.25)" },
//   New: { color: "#2563eb", bg: "rgba(37, 99, 235, 0.08)", activeBg: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", activeShadow: "0 6px 15px rgba(37, 99, 235, 0.25)" },
//   "Call Back": { color: "#d97706", bg: "rgba(217, 119, 6, 0.08)", activeBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", activeShadow: "0 6px 15px rgba(217, 119, 6, 0.25)" },
//   Quote: { color: "#ea580c", bg: "rgba(234, 88, 12, 0.08)", activeBg: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", activeShadow: "0 6px 15px rgba(234, 88, 12, 0.25)" },
//   Appointment: { color: "#7c3aed", bg: "rgba(124, 58, 237, 0.08)", activeBg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", activeShadow: "0 6px 15px rgba(124, 58, 237, 0.25)" },
//   Sold: { color: "#16a34a", bg: "rgba(22, 163, 74, 0.08)", activeBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)", activeShadow: "0 6px 15px rgba(22, 163, 74, 0.25)" },
//   Lost: { color: "#dc2626", bg: "rgba(220, 38, 38, 0.08)", activeBg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", activeShadow: "0 6px 15px rgba(220, 38, 38, 0.25)" }
// }[status] || { color: "#2563eb", bg: "rgba(37, 99, 235, 0.08)", activeBg: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", activeShadow: "0 6px 15px rgba(37, 99, 235, 0.25)" };


export const statusReasonMap = {
  ANSWERED: "Customer answered",
  NO_ANSWER: "Customer did not answer",
  BUSY: "Customer was busy",
  SWITCHED_OFF: "Phone switched off",
  INVALID_NUMBER: "Invalid phone number",
  WRONG_NUMBER: "Wrong phone number",
  CALL_BACK_REQUESTED: "Customer requested callback",
  INTERESTED: "Customer is interested",
  NOT_INTERESTED: "Customer is not interested",
  QUOTE_REQUESTED: "Quotation requested",
  FOLLOW_UP_REQUIRED: "Follow-up required",
  MEETING_SCHEDULED: "Meeting scheduled",
  POLICY_RENEWED: "Policy renewed",
  POLICY_PURCHASED: "Policy purchased",
  ALREADY_INSURED: "Already insured",
  DO_NOT_CALL: "Customer requested no further calls",
  OTHER: "Other",
};

