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
  {id:'F',label:'Female'},
  {id:'M',label:'Male'},
  {id:'O',label:'Others'},
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