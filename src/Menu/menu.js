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
  // {
  //   // groupLabel: "Main",
  //   slno: 1,
  //   label: "Dashboard",
  //   icon: DashboardIcon,
  //   path: "/home",
  // },
  // // {
  // //   label: "Calendar",
  // //   icon: CalendarMonthIcon,
  // //   path: "/calendar",
  // // },
  // // {
  // //   label: "Campaigns",
  // //   icon: WorkIcon,
  // //   nested: [
  // //     { label: "My Camp", path: "/campaigns/my-camp" },
  // //     { label: "Checklist", path: "/campaigns/checklist" },
  // //     { label: "Campers", path: "/campaigns/campers" },
  // //     { label: "Save Spots", path: "/campaigns/save-spots" },
  // //   ],
  // // },
  // // {
  // //   // groupLabel: "Account",
  // //   slno: 2,
  // //   label: "Notification",
  // //   icon: NotificationsIcon,
  // //   path: "/notifications",
  // // },
  // {
  //   // groupLabel: "Account",
  //   slno: 2,
  //   label: "Settings",
  //   icon: SettingsSuggestIcon,
  //   path: "/home/settings",
  // },
  // {
  //   // groupLabel: "Account",
  //   slno: 3,
  //   label: "User Info",
  //   icon: SettingsSuggestIcon,
  //   path: "/home/settings",
  // },

  [
    {
      label: "Settings",
      icon: SettingsSuggestIcon,
      // nested: [
      //   {
      //     label: "Menu Master",
      //     path: "/home/setting/menumaster"
      //   },
      //   {
      //     label: "Role Master",
      //     path: "/home/setting/rolemaster"
      //   }
      // ]
    },
    {
      label: "User Info",
      icon: GroupsIcon,
      // nested: [
      //   {
      //     label: "Employee User Info",
      //     path: "/home/employeeuserinfo"
      //   }
      // ]
    }
  ]
];