import {
  Phone,
  EventAvailable,
  TrendingUp,
  Cancel,
  Description,
  FiberNew,
  Person,
} from "@mui/icons-material";
import { addMonths, parseISO } from "date-fns";
import jsPDF from "jspdf";

import * as XLSX from "xlsx";

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
  "-- Select --",
  "10th",
  "12th",
  "Diploma",
  "ITI",
  "Graduate",
  "Post Graduate",
  "PhD",
  "Other",
];

export const COMPANY_OPTIONS = [
  "-- Select --",
  "Head Office",
  "Branch - Chennai",
  "Branch - Mumbai",
  "Branch - Delhi",
  "Branch - Bengaluru",
];

export const ROLE_OPTIONS = [
  "-- Select --",
  "Admin",
  "Manager",
  "Team Lead",
  "Telecaller",
  "Field Agent",
  "Accounts",
  "HR",
  "IT Support",
];

export const STATUS_OPTIONS = [
  "-- Select --",
  "Active",
  "Inactive",
  "On Leave",
  "Probation",
  "Terminated",
];

export const GENDER_OTPION = [
  { id: "F", label: "Female" },
  { id: "M", label: "Male" },
  { id: "O", label: "Others" },
];

export const summaryData = [
  { label: "New Calls", value: 24, color: "#2563eb" },
  { label: "Today's Follow-ups", value: 12, color: "#f59e0b" },
  { label: "Pending Quotes", value: 8, color: "#2563eb" },
  { label: "Appointments", value: 5, color: "#10b981" },
  { label: "Converted Leads", value: 18, color: "#7c3aed" },
];
export const statusOptions = [
  "All",
  "New",
  "Call Back",
  "Quote",
  "Appointment",
  "Sold",
  "Lost",
];

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
    previousNotes:
      "Customer called earlier asking about insurance renewal and service history.",
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

export const getActivityDetails = (activity) => {
  switch (activity.status_name) {
    case "NEW":
      return {
        icon: <FiberNew />,
        color: "#2563eb",
        bgcolor: "#bdcff6e2",
      };

    case "CALLBACK":
      return {
        icon: <Phone />,
        color: "#8b5cf6",
        bgcolor: "rgb(233, 223, 255)",
      };

    case "QUOTE":
      return {
        icon: <Description />,
        color: "#06b6d4",
        bgcolor: "#ddfaff",
      };

    case "APPOINMENT":
      return {
        icon: <EventAvailable />,
        color: "#f97316",
        bgcolor: "#ffede0",
      };

    case "SOLD":
      return {
        icon: <TrendingUp />,
        color: "#16a34a",
        bgcolor: "#d8ffe6",
      };

    case "LOST":
      return {
        icon: <Cancel />,
        color: "#dc2626",
        bgcolor: "#f6e1e1",
      };

    default:
      return {
        icon: <Person />,
        color: "#64748b",
        bgcolor: "rgba(219, 230, 255, 0.89)",
      };
  }
};

// utils/groupLeadData.js

// export const groupLeadData = (allCallDetails = [], activeStatus = []) => {
//   const groups = {};

//   activeStatus.forEach((status) => {
//     groups[status.status_id] = [];
//   });

//   groups[-1] = []; // Pending
//   groups[-2] = []; // Reminder
//   groups[-3] = []; // Reminder

//   const start = startOfMonth(new Date());
//   const end = endOfMonth(addMonths(new Date(), 1));

//   for (const lead of allCallDetails) {
//     // NEW tab -> only opened leads
//     if (lead?.status_id === 1) {
//       if (lead?.work_status === "IN_PROGRESS") {
//         groups[1].push(lead);
//       }
//     } else {
//       // All other statuses
//       groups[lead.status_id]?.push(lead);
//     }

//     // Pending
//     if (lead?.work_status === "NOT_STARTED") {
//       groups[-1].push(lead);
//     }

//     // Reminder
//     if (lead?.next_followup_date != null) {
//       groups[-2].push(lead);
//     }

//     if (lead?.known_policy_expiry_date) {
//       const expiryDate = parseISO(lead.known_policy_expiry_date);
//       if (
//         isWithinInterval(expiryDate, {
//           start,
//           end,
//         })
//       ) {
//         groups[-3].push(lead);
//       }
//     }
//   }

//   return groups;
// };

// export const groupLeadData = (allCallDetails = [], activeStatus = []) => {

//   const groups = {};

//   activeStatus.forEach((status) => {
//     groups[status.status_id] = [];
//   });

//   groups[-1] = []; // Pending
//   groups[-2] = []; // Follow-up Reminder
//   groups[-3] = []; // Policy Renewal

//   const today = new Date();

//   const currentMonth = today.getMonth();
//   const currentYear = today.getFullYear();

//   const nextMonthDate = addMonths(today, 1);
//   const nextMonth = nextMonthDate.getMonth();
//   const nextMonthYear = nextMonthDate.getFullYear();

//   for (const lead of allCallDetails) {

//     // NEW Tab
//     if (lead?.status_id === 1) {
//       if (lead?.work_status === "IN_PROGRESS") {
//         groups[1].push(lead);
//       }
//     } else {
//       groups[lead.status_id]?.push(lead);
//     }

//     // Pending
//     if (lead?.work_status === "NOT_STARTED") {
//       groups[-1].push(lead);
//     }

//     // Follow-up Reminder
//     if (lead?.next_followup_date) {
//       groups[-2].push(lead);
//     }

//     // Renewal (Current Month + Next Month of CURRENT YEAR ONLY)
//     if (lead?.policy_expiry_date) {

//       const expiryDate = parseISO(lead.policy_expiry_date);

//       const expiryMonth = expiryDate.getMonth();
//       const expiryYear = expiryDate.getFullYear();

//       const isCurrentMonth =
//         expiryYear === currentYear &&
//         expiryMonth === currentMonth;

//       const isNextMonth =
//         expiryYear === nextMonthYear &&
//         expiryMonth === nextMonth;

//       if (isCurrentMonth || isNextMonth) {
//         groups[-3].push(lead);
//       }
//     }
//   }

//   return groups;
// };

export const groupLeadData = (allCallDetails = [], activeStatus = []) => {
  const groups = {};

  // Create groups from status master
  activeStatus.forEach((status) => {
    if (status?.status_id != null) {
      groups[status.status_id] = [];
    }
  });

  // Custom groups
  groups[-1] = []; // Pending
  groups[-2] = []; // Follow-up Reminder
  groups[-3] = []; // Policy Renewal

  const today = new Date();

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const nextMonthDate = addMonths(today, 1);
  const nextMonth = nextMonthDate.getMonth();
  const nextMonthYear = nextMonthDate.getFullYear();

  allCallDetails.forEach((lead) => {
    const statusId = Number(lead?.status_id);

    // Make sure this status group exists
    if (statusId && groups[statusId] === undefined) {
      groups[statusId] = [];
    }

    // -------------------------
    // Status Tabs
    // -------------------------

    if (statusId === 1) {
      // Only opened leads
      if (lead?.work_status === "IN_PROGRESS") {
        groups[statusId]?.push(lead);
      }
    } else {
      groups[statusId]?.push(lead);
    }

    // -------------------------
    // Pending
    // -------------------------

    if (lead?.work_status === "NOT_STARTED") {
      groups[-1].push(lead);
    }

    // -------------------------
    // Follow-up Reminder
    // -------------------------

    if (lead?.next_followup_date && Number(lead.status_id) !== 6) {
      groups[-2].push(lead);
    }

    // -------------------------
    // Policy Renewal
    // Show Current Month + Next Month
    // -------------------------

    if (lead?.policy_expiry_date) {
      try {
        const expiryDate = parseISO(lead.policy_expiry_date);

        const expiryMonth = expiryDate.getMonth();
        const expiryYear = expiryDate.getFullYear();

        const isCurrentMonth =
          expiryMonth === currentMonth && expiryYear === currentYear;

        const isNextMonth =
          expiryMonth === nextMonth && expiryYear === nextMonthYear;

        if (isCurrentMonth || isNextMonth) {
          groups[-3].push(lead);
        }
      } catch (err) {
        console.error("Invalid policy_expiry_date:", lead?.policy_expiry_date);
      }
    }
  });

  return groups;
};

export const themeColors = {
  blue: "#2563eb",
  blueSoft: "rgba(37,99,235,0.08)",
  orange: "#ea580c",
  orangeSoft: "rgba(234,88,12,0.08)",
  border: "rgba(226,232,240,0.95)",
  text: "#0f172a",
  muted: "#64748b",
};

export const DownloadPdf = (row) => {

  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();

  // =========================
  // COLORS
  // =========================
  const blue = [25, 118, 210];
  const dark = [30, 41, 59];
  const gray = [100, 116, 139];
  const lightGray = [241, 245, 249];
  const green = [22, 163, 74];

  // =========================
  // VALUES
  // =========================
  const premium = Number(row.premium_amount || 0);
  const discount = Number(row.discount_amount || 0);
  const paid = Number(row.paid_amount || 0);

  const netAmount = premium - discount;
  const balance = netAmount - paid;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB");
  };

  const money = (value) =>
    `Rs. ${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // =========================
  // HEADER
  // =========================

  doc.setFillColor(...blue);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);

  doc.text("POLICY POS", 18, 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text("Insurance Policy Payment Receipt", 18, 22);

  // PAID badge
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - 48, 9, 30, 10, 2, 2, "F");

  doc.setTextColor(...green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text("PAID", pageWidth - 33, 15.5, {
    align: "center",
  });

  // =========================
  // INVOICE INFO
  // =========================

  let y = 40;

  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text("Invoice Details", 18, y);

  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(`Policy No: ${row.policy_number || "-"}`, 18, y);

  doc.text(`Invoice Date: ${formatDate(new Date())}`, 115, y);

  y += 6;

  doc.text(`Sale Date: ${formatDate(row.sale_date)}`, 18, y);

  doc.text(`Status: ${row.policy_status || "-"}`, 115, y);

  // Divider
  y += 7;

  doc.setDrawColor(220, 226, 232);
  doc.line(18, y, pageWidth - 18, y);

  // =========================
  // CUSTOMER + VEHICLE
  // =========================

  y += 10;

  doc.setTextColor(...blue);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text("Customer", 18, y);

  doc.text("Vehicle", 115, y);

  y += 8;

  doc.setTextColor(...dark);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(row.customer_name || "-", 18, y);

  doc.text(row.registration_number || "-", 115, y);

  y += 6;

  doc.setTextColor(...gray);

  doc.text(row.mobile_number_1 || "-", 18, y);

  doc.text(row.model || row.vehicle_maker || "-", 115, y);

  // =========================
  // PAYMENT TABLE
  // =========================

  y += 12;

  doc.setTextColor(...blue);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text("Payment Summary", 18, y);

  y += 6;

  // Table header
  doc.setFillColor(...lightGray);
  doc.rect(18, y, pageWidth - 36, 8, "F");

  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);

  doc.text("Description", 23, y + 5.5);

  doc.text("Amount", pageWidth - 23, y + 5.5, {
    align: "right",
  });

  y += 8;

  const paymentRows = [
    ["Premium Amount", money(premium)],
    ["Discount", `- ${money(discount)}`],
    ["Net Amount", money(netAmount)],
    ["Amount Paid", money(paid)],
    ["Balance Due", money(balance)],
  ];

  paymentRows.forEach(([label, value], index) => {
    y += 7;

    doc.setFont("helvetica", index === 2 || index === 4 ? "bold" : "normal");

    doc.setTextColor(...dark);
    doc.setFontSize(9);

    doc.text(label, 23, y);

    doc.text(value, pageWidth - 23, y, {
      align: "right",
    });

    doc.setDrawColor(235, 238, 242);

    doc.line(18, y + 3, pageWidth - 18, y + 3);
  });

  // =========================
  // POLICY PERIOD
  // =========================

  y += 14;

  doc.setTextColor(...blue);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text("Policy Period", 18, y);

  y += 8;

  doc.setTextColor(...dark);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(`Start: ${formatDate(row.start_date)}`, 18, y);

  doc.text(`Expiry: ${formatDate(row.policy_expiry_date)}`, 115, y);

  // =========================
  // CAPTURED BY
  // =========================

  y += 12;

  doc.setTextColor(...blue);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text("Captured By", 18, y);

  y += 8;

  doc.setTextColor(...dark);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(`${row.employee_name || "-"} (${row.employee_code || "-"})`, 18, y);

  // =========================
  // FOOTER
  // =========================

  const footerY = 275;

  doc.setDrawColor(220, 226, 232);
  doc.line(18, footerY, pageWidth - 18, footerY);

  doc.setTextColor(...gray);
  doc.setFontSize(7.5);

  doc.text("This receipt is generated from Policy POS.", 18, footerY + 7);

  doc.text(
    "Subject to the terms and conditions of the respective insurance policy.",
    18,
    footerY + 12,
  );

  // =========================
  // DOWNLOAD
  // =========================

  doc.save(`Policy-POS-${row.policy_number || row.policy_id}.pdf`);
};

export const parseDateValue = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  const str = String(value);

  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (match) {
    const [, year, month, day] = match;

    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(str);

  return isNaN(date.getTime()) ? null : date;
};

export const exportPolicyExcel = (filteredRows, selectedMonth) => {
  if (!filteredRows?.length) {
    return;
  }

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getMonthYear = () => {
    if (!selectedMonth) {
      return "All Policy Holders";
    }

    const [year, month] = selectedMonth.split("-");

    const date = new Date(Number(year), Number(month) - 1, 1);

    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const monthYear = getMonthYear();

  const excelData = [];

  // =====================================================
  // REPORT HEADER
  // =====================================================

  excelData.push(["THEJASWI POLICY HOLDERS"]);

  excelData.push(["POLICY REPORT"]);

  excelData.push([monthYear]);

  excelData.push([`Generated Date: ${formatDate(new Date())}`]);

  excelData.push([]);

  // =====================================================
  // TABLE HEADER
  // =====================================================

  excelData.push([
    "CUSTOMER DETAILS",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "VEHICLE DETAILS",
    "",
    "",
    "",
    "",
    "",
    "",
    "POLICY DETAILS",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  excelData.push([
    "Customer Name",
    "Mobile Number",
    "Mobile Number 2",
    "Email",
    "Address",
    "City",
    "District",
    "State",
    "Previous Customer",

    "Registration Number",
    "Model",
    "Vehicle Maker",
    "Engine Number",
    "Chassis Number",
    "Known Policy Expiry",
    "Registration Date",

    "Policy Number",
    "Policy Type",
    "Start Date",
    "Expiry Date",
    "Policy Status",
    "Premium Amount",
    "Paid Amount",
    "Discount Amount",
    "Insured Declared Value",
    "Renewal Cycle",
    "Sale Date",
    "Insurance Company",
    "Insurance Company Contact",
    "Insurance Company Email",
    "Source",
    "Customer Pay Type",
    "Payment Method",
    "Payment Type",
    "Customer Reference No",
    "Payment Reference No",
    "Created By",
    "Employee Code",
  ]);

  // =====================================================
  // DATA
  // =====================================================

  filteredRows.forEach((row) => {
    excelData.push([
      // CUSTOMER
      row.customer_name || "",
      row.mobile_number_1 || "",
      row.mobile_number_2 || "",
      row.email || "",
      row.address || "",
      row.city || "",
      row.district || "",
      row.state || "",
      row.is_previous_customer === 1 ? "Yes" : "No",

      // VEHICLE
      row.registration_number || "",
      row.model || "",
      row.vehicle_maker || "",
      row.engine_number || "",
      row.chassis_number || "",
      formatDate(row.known_policy_expiry_date),
      formatDate(row.registration_date),

      // POLICY
      row.policy_number || "",
      row.policy_type || "",
      formatDate(row.start_date),
      formatDate(row.policy_expiry_date),
      row.policy_status || "",
      row.premium_amount || 0,
      row.paid_amount || 0,
      row.discount_amount || 0,
      row.insured_declared_value || 0,
      row.renewal_cycle || "",
      formatDate(row.sale_date),

      // INSURANCE COMPANY
      row.insurance_company_name || "",
      row.insurance_company_contact || "",
      row.insurance_company_email || "",

      // SOURCE
      row.source_name || "",

      // PAYMENT
      row.pay_type_name || "",
      row.payment_method_name || "",
      row.payment_type || "",
      row.cp_reference_no || "",
      row.pm_reference_no || "",

      // EMPLOYEE
      row.created_by_name || "",
      row.employee_id || "",
    ]);
  });

  // =====================================================
  // CREATE WORKBOOK
  // =====================================================

  const worksheet = XLSX.utils.aoa_to_sheet(excelData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Policy Holders");

  // =====================================================
  // MERGE REPORT TITLE
  // =====================================================

  worksheet["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: 37 },
    },
    {
      s: { r: 1, c: 0 },
      e: { r: 1, c: 37 },
    },
    {
      s: { r: 2, c: 0 },
      e: { r: 2, c: 37 },
    },
    {
      s: { r: 3, c: 0 },
      e: { r: 3, c: 37 },
    },

    // Customer Details
    {
      s: { r: 5, c: 0 },
      e: { r: 5, c: 8 },
    },

    // Vehicle Details
    {
      s: { r: 5, c: 9 },
      e: { r: 5, c: 15 },
    },

    // Policy Details
    {
      s: { r: 5, c: 16 },
      e: { r: 5, c: 37 },
    },
  ];

  // =====================================================
  // COLUMN WIDTHS
  // =====================================================

  worksheet["!cols"] = [
    { wch: 24 },
    { wch: 16 },
    { wch: 16 },
    { wch: 28 },
    { wch: 40 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 16 },

    { wch: 20 },
    { wch: 24 },
    { wch: 24 },
    { wch: 22 },
    { wch: 25 },
    { wch: 20 },
    { wch: 18 },

    { wch: 28 },
    { wch: 18 },
    { wch: 16 },
    { wch: 18 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 20 },
    { wch: 16 },
    { wch: 16 },
    { wch: 32 },
    { wch: 22 },
    { wch: 30 },
    { wch: 25 },
    { wch: 22 },
    { wch: 28 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 22 },
  ];

  // =====================================================
  // FREEZE HEADER
  // =====================================================

  worksheet["!freeze"] = {
    xSplit: 0,
    ySplit: 7,
  };

  // =====================================================
  // AUTO FILTER
  // =====================================================

  worksheet["!autofilter"] = {
    ref: `A7:AL${excelData.length}`,
  };

  // =====================================================
  // DOWNLOAD
  // =====================================================

  const fileMonth = selectedMonth ? selectedMonth : "all";

  XLSX.writeFile(workbook, `Thejaswi_Policy_Holders_${fileMonth}.xlsx`);
};


// utils/glassStyles.js
export const glassStyles = (isDark) => ({
  bgcolor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: isDark 
    ? '0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
    : '0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isDark
      ? 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.03) 100%)'
      : 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: isDark
      ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
    pointerEvents: 'none',
    zIndex: 1,
  },
});