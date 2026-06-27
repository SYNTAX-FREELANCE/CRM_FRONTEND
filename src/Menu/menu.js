import React from "react";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import GroupsIcon from "@mui/icons-material/Groups";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
// import ChatIcon from "@mui/icons-material/Chat";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WorkIcon from "@mui/icons-material/Work";
import NotificationsIcon from "@mui/icons-material/Notifications";

export const Menu = [
  {
    // groupLabel: "Main",
    label: "Dashboard",
    icon: DashboardIcon,
    path: "/home",
  },
  {
    label: "Calendar",
    icon: CalendarMonthIcon,
    path: "/calendar",
  },
  {
    label: "Campaigns",
    icon: WorkIcon,
    nested: [
      { label: "My Camp", path: "/campaigns/my-camp" },
      { label: "Checklist", path: "/campaigns/checklist" },
      { label: "Campers", path: "/campaigns/campers" },
      { label: "Save Spots", path: "/campaigns/save-spots" },
    ],
  },
  {
    // groupLabel: "Account",
    label: "Notification",
    icon: NotificationsIcon,
    path: "/notifications",
  },
  {
    // groupLabel: "Account",
    label: "Settings",
    icon: SettingsSuggestIcon,
    path: "/home/settings",
  },
];




// import React from "react";
// import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
// import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
// import GroupsIcon from "@mui/icons-material/Groups";
// import DescriptionIcon from "@mui/icons-material/Description";
// import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
// // import ChatIcon from "@mui/icons-material/Chat";
// import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
// import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
// import EditDocumentIcon from "@mui/icons-material/EditDocument";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import WorkIcon from "@mui/icons-material/Work";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

// export const Menu = [
//   {
//     // groupLabel: "Main",
//     label: "Dashboard",
//     icon: DashboardIcon,
//     path: "/home",
//   },
//   {
//     label: "Calls",
//     icon: LocalPhoneIcon,
//     path: "/home/freshcalls",
//   },
//   {
//     label: "Campaigns",
//     icon: WorkIcon,
//     nested: [
//       { label: "My Camp", path: "/campaigns/my-camp" },
//       { label: "Checklist", path: "/campaigns/checklist" },
//       { label: "Campers", path: "/campaigns/campers" },
//       { label: "Save Spots", path: "/campaigns/save-spots" },
//     ],
//   },
//   {
//     // groupLabel: "Account",
//     label: "Notification",
//     icon: NotificationsIcon,
//     path: "/notifications",
//   },
//   {
//     // groupLabel: "Account",
//     label: "Settings",
//     icon: SettingsSuggestIcon,
//     path: "/home/settings",
//   },

// ];