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
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import PersonIcon from '@mui/icons-material/Person';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import GridViewIcon from '@mui/icons-material/GridView';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';


export const Menu = [
  {
    // groupLabel: "Main",
    label: "Dashboard",
    icon: DashboardIcon,
    path: "/home",
  },
  {
    label: "Calls",
    icon: LocalPhoneIcon,
    path: "/home/freshcalls",
  },
  {
    label: "Employee",
    icon: GridViewIcon,
    path: "/home/employee",
  },
  {
    label: "Allocate",
    icon: DataThresholdingIcon,
    path: "/home/allocation",
  },

  {
    label: "Search",
    icon: SavedSearchIcon,
    path: "/home/search",
  },
{
    label: "Queue Control",
    icon: FlagCircleIcon,
    path: "/home/batchcontrol",
  },

  
  {
    // groupLabel: "Account",
    label: "Settings",
    icon: SettingsSuggestIcon,
    path: "/home/settings",
  },
    {
    // groupLabel: "Account",
    label: "Userinfo",
    icon: PersonIcon,
    path: "/home/userinfo",
  },
];
