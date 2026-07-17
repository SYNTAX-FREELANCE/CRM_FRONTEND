import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import GridViewIcon from "@mui/icons-material/GridView";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";
import SavedSearchIcon from "@mui/icons-material/SavedSearch";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import PersonIcon from "@mui/icons-material/Person";

export const MENU = [
  {
    module_id: 1,
    label: "Dashboard",
    icon: DashboardIcon,
    path: "/home",
  },
  {
    module_id: 3,
    label: "Calls",
    icon: LocalPhoneIcon,
    path: "/home/freshcalls",
  },
  {
    module_id: 4,
    label: "Allocate",
    icon: DataThresholdingIcon,
    nested: [
      {
        module_id: 9,
        label: "New Allocation",
        path: "/home/allocation",
      },
      {
        module_id: 10,
        label: "Allocation List",
        path: "/home/view-allocation",
      },
    ],
  },
  {
    module_id: 5,
    label: "Search",
    icon: SavedSearchIcon,
    path: "/home/search",
  },
  {
    module_id: 6,
    label: "Queue Control",
    icon: FlagCircleIcon,
    path: "/home/batchcontrol",
  },
  {
    module_id: 7,
    label: "Settings",
    icon: SettingsSuggestIcon,
    path: "/home/settings",
  },
  {
    module_id: 8,
    label: "Userinfo",
    icon: PersonIcon,
    path: "/home/userinfo",
  },
];

export const getMenu = (RoleRights = []) => {
  const allowed = new Set(RoleRights?.map((item) => item.module_id));

  return MENU
    .filter((item) => {
      if (!item.nested) return allowed.has(item.module_id);

      const nested = item.nested
        .filter((sub) => allowed.has(sub.module_id))
        .sort((a, b) => a.module_id - b.module_id);

      return allowed.has(item.module_id) && nested.length > 0;
    })
    .map((item) => {
      if (!item.nested) return item;
      return {
        ...item,
        nested: item.nested
          .filter((sub) => allowed.has(sub.module_id))
          .sort((a, b) => a.module_id - b.module_id),
      };
    })
    .sort((a, b) => a.module_id - b.module_id);
};