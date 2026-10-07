import React, { memo, useState } from "react";
import { Box, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../CommonComponents/PageWrapper";

// Material UI Icons
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import ExtensionIcon from "@mui/icons-material/Extension";
import LayersIcon from "@mui/icons-material/Layers";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ShieldIcon from "@mui/icons-material/Shield";
import PeopleIcon from "@mui/icons-material/People";
import BadgeIcon from "@mui/icons-material/Badge";
import SecurityIcon from "@mui/icons-material/Security";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PaymentIcon from "@mui/icons-material/Payment";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import StairsIcon from "@mui/icons-material/Stairs";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent";
import AddCallIcon from "@mui/icons-material/AddCall";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import KeyboardIcon from '@mui/icons-material/Keyboard';
import CategoryIcon from "@mui/icons-material/Category";
import ClassIcon from "@mui/icons-material/Class";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import CommuteIcon from "@mui/icons-material/Commute";
import SpeedIcon from "@mui/icons-material/Speed";
import ScaleIcon from "@mui/icons-material/Scale";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ArticleIcon from "@mui/icons-material/Article";
import WorkIcon from "@mui/icons-material/Work";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PercentIcon from "@mui/icons-material/Percent";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import GavelIcon from "@mui/icons-material/Gavel";
import RuleIcon from "@mui/icons-material/Rule";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DiscountIcon from "@mui/icons-material/Discount";
import TuneIcon from "@mui/icons-material/Tune";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import BuildIcon from "@mui/icons-material/Build";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import PolicyIcon from "@mui/icons-material/Policy";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PaymentsIcon from "@mui/icons-material/Payments";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

import { useGetEmployeeMenuRights } from "../CommonCode/useQuery";
import { getAuthUser } from "../constant/Constant";
import { useTheme } from "@mui/material";
import { glassStyles } from "../CommonCode/Reusable";

const Settings = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const authUser = getAuthUser();
  const { role_id } = authUser ?? {};

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { data: EmployeeMenuRights = [] } =
    useGetEmployeeMenuRights(role_id);

  const master = [
    {
      main: "General Master",
      colorTheme: "blue",
      icon: <ExtensionIcon />,
      bgGlow: "rgba(30, 64, 175, 0.08)",
      children: [
        {
          menuslno: 1,
          label: "Menu Master",
          path: "/home/setting/menumaster",
          icon: <MenuIcon />,
        },
        {
          menuslno: 2,
          label: "Module Master",
          path: "/home/setting/modulemaster",
          icon: <ExtensionIcon />,
        },
        {
          menuslno: 3,
          label: "Submodule Master",
          path: "/home/setting/submodulemaster",
          icon: <LayersIcon />,
        },
        {
          menuslno: 4,
          label: "Qualification Master",
          path: "/home/setting/qualificationmaster",
          icon: <SchoolIcon />,
        },
        {
          menuslno: 5,
          label: "Company Master",
          path: "/home/setting/companymaster",
          icon: <BusinessIcon />,
        },
        {
          menuslno: 6,
          label: "Status Master",
          path: "/home/setting/statusmaster",
          icon: <ToggleOnIcon />,
        },
        {
          menuslno: 7,
          label: "Lead Master",
          path: "/home/setting/leadmaster",
          icon: <LeaderboardIcon />,
        },
        {
          menuslno: 8,
          label: "Vehicle Type Master",
          path: "/home/setting/vehicletypemaster",
          icon: <DirectionsCarIcon />,
        },
        {
          menuslno: 9,
          label: "Insurance Company Master",
          path: "/home/setting/insurancecompany",
          icon: <ShieldIcon />,
        },
        {
          menuslno: 10,
          label: "Customer Master",
          path: "/home/setting/customermaster",
          icon: <PeopleIcon />,
        },
        {
          menuslno: 20,
          label: "Policy Source Master",
          path: "/home/setting/policysource",
          icon: <LocalPoliceIcon />,
        },
        {
          menuslno: 22,
          label: "Employee Level Master",
          path: "/home/setting/employeelevel",
          icon: <StairsIcon />,
        },
        {
          menuslno: 23,
          label: "Incentive Master",
          path: "/home/setting/incentiveschema",
          icon: <AddShoppingCartIcon />,
        },
        {
          menuslno: 24,
          label: "Incentive Slab Master",
          path: "/home/setting/incentiveschemaslab",
          icon: <CurrencyRupeeIcon />,
        },
        {
          menuslno: 25,
          label: "Customer Pay Type",
          path: "/home/setting/customerpaytype",
          icon: <PaymentIcon />,
        },
        {
          menuslno: 26,
          label: "Payment Method Master",
          path: "/home/setting/paymentmethod",
          icon: <PaymentIcon />,
        },
      ],
    },

    {
      main: "User Management",
      colorTheme: "orange",
      icon: <PeopleIcon />,
      bgGlow: "rgba(234, 88, 12, 0.08)",
      children: [
        {
          menuslno: 12,
          label: "Employee Master",
          path: "/home/setting/employeemaster",
          icon: <BadgeIcon />,
        },
        {
          menuslno: 13,
          label: "Role Master",
          path: "/home/setting/rolemaster",
          icon: <SecurityIcon />,
        },
        {
          menuslno: 14,
          label: "User Right Master",
          path: "/home/setting/userrightmaster",
          icon: <VpnKeyIcon />,
        },
        {
          menuslno: 15,
          label: "Data Upload Master",
          path: "/home/setting/Uploadmaster",
          icon: <CloudUploadIcon />,
        },
        {
          menuslno: 16,
          label: "User Module Rights",
          path: "/home/setting/usermodulerightmaster",
          icon: <VpnKeyIcon />,
        },
        {
          menuslno: 17,
          label: "Target Master",
          path: "/home/setting/targetmaster",
          icon: <TrackChangesIcon />,
        },
        {
          menuslno: 18,
          label: "Call Outcome Master",
          path: "/home/setting/calloutcome",
          icon: <DirectionsCarIcon />,
        },
        {
          menuslno: 19,
          label: "Call Outcome Map Master",
          path: "/home/setting/outcomemapmaster",
          icon: <AddCallIcon />,
        },
        {
          menuslno: 21,
          label: "Legacy Sale Upload Master",
          path: "/home/setting/legacysalemaster",
          icon: <RealEstateAgentIcon />,
        },
      ],
    },

    {
      main: "Motor Calculator",
      colorTheme: "orange",
      icon: <DirectionsCarIcon />,
      bgGlow: "rgba(234, 12, 160, 0.08)",
      children: [
        {
          menuslno: 27,
          label: "Vehicle Category Master",
          path: "/home/setting/motorvehiclecategory",
          icon: <CategoryIcon />,
        },
        {
          menuslno: 28,
          label: "Vehicle Class Master",
          path: "/home/setting/motorvehicleclass",
          icon: <ClassIcon />,
        },
        {
          menuslno: 29,
          label: "Fuel Type Master",
          path: "/home/setting/motorfueltype",
          icon: <LocalGasStationIcon />,
        },
        {
          menuslno: 30,
          label: "Vehicle Usage Master",
          path: "/home/setting/motorvehicleusage",
          icon: <CommuteIcon />,
        },
        {
          menuslno: 31,
          label: "Engine CC Slab Master",
          path: "/home/setting/motorengineccslab",
          icon: <SpeedIcon />,
        },
        {
          menuslno: 32,
          label: "GVW Slab Master",
          path: "/home/setting/motorgvwslab",
          icon: <ScaleIcon />,
        },
        {
          menuslno: 33,
          label: "Product Master",
          path: "/home/setting/motorproduct",
          icon: <Inventory2Icon />,
        },
        {
          menuslno: 34,
          label: "Policy Type Master",
          path: "/home/setting/motorpolicytype",
          icon: <ArticleIcon />,
        },
        {
          menuslno: 35,
          label: "Business Type Master",
          path: "/home/setting/motorbusinesstype",
          icon: <WorkIcon />,
        },
        {
          menuslno: 36,
          label: "Policy Term Master",
          path: "/home/setting/motorpolicyterm",
          icon: <CalendarMonthIcon />,
        },
        {
          menuslno: 37,
          label: "OD Rate Master",
          path: "/home/setting/motorodrate",
          icon: <PercentIcon />,
        },
        {
          menuslno: 38,
          label: "OD Age Slab Master",
          path: "/home/setting/motorodageslab",
          icon: <AccessTimeIcon />,
        },
        {
          menuslno: 39,
          label: "OD Depreciation Master",
          path: "/home/setting/motoroddepreciation",
          icon: <TrendingDownIcon />,
        },
        {
          menuslno: 40,
          label: "TP Rate Master",
          path: "/home/setting/mortprate",
          icon: <GavelIcon />,
        },
        {
          menuslno: 41,
          label: "TP Rate Slab Master",
          path: "/home/setting/motortprateslab",
          icon: <RuleIcon />,
        },
        {
          menuslno: 42,
          label: "NCB Rule Master",
          path: "/home/setting/motorncbrule",
          icon: <AccountBalanceIcon />,
        },
        {
          menuslno: 43,
          label: "NCB Claim Rule Master",
          path: "/home/setting/motorncbclaimrule",
          icon: <RuleIcon />,
        },
        {
          menuslno: 44,
          label: "Discount Rule Master",
          path: "/home/setting/motordiscountrule",
          icon: <DiscountIcon />,
        },
        {
          menuslno: 45,
          label: "Discount Condition Master",
          path: "/home/setting/motordiscountcondition",
          icon: <TuneIcon />,
        },
        {
          menuslno: 46,
          label: "ZD Rate Master",
          path: "/home/setting/motorzdrate",
          icon: <HealthAndSafetyIcon />,
        },
        {
          menuslno: 47,
          label: "Addon Master",
          path: "/home/setting/motoraddon",
          icon: <ExtensionIcon />,
        },
        {
          menuslno: 48,
          label: "Addon Rule Master",
          path: "/home/setting/motoraddonrule",
          icon: <BuildIcon />,
        },
        {
          menuslno: 49,
          label: "Addon Condition Master",
          path: "/home/setting/motoraddoncondition",
          icon: <SettingsSuggestIcon />,
        },
        {
          menuslno: 50,
          label: "Cover Master",
          path: "/home/setting/motorcover",
          icon: <PolicyIcon />,
        },
        {
          menuslno: 51,
          label: "Cover Rate Master",
          path: "/home/setting/motorcoverrate",
          icon: <AttachMoneyIcon />,
        },
        {
          menuslno: 52,
          label: "Cover Unit Rate Master",
          path: "/home/setting/motorcoverunitrate",
          icon: <PeopleAltIcon />,
        },
        {
          menuslno: 53,
          label: "Commission Rule Master",
          path: "/home/setting/motorcommissionrule",
          icon: <PaymentsIcon />,
        },
        {
          menuslno: 54,
          label: "Cashback Rule Master",
          path: "/home/setting/motorcashbackrule",
          icon: <CurrencyExchangeIcon />,
        },
        {
          menuslno: 55,
          label: "Tax Master",
          path: "/home/setting/motortax",
          icon: <PercentIcon />,
        },
        {
          menuslno: 56,
          label: "Vehicle Category Input Fields",
          path: "/home/setting/motorvehicleinputfield",
          icon: <KeyboardIcon />,
        },

      ],
    },
  ];

  const allowedMenuIds = new Set(
    Array.isArray(EmployeeMenuRights)
      ? EmployeeMenuRights.map((item) => item.menu_id)
      : []
  );

  const filteredMaster = master
    .map((section) => ({
      ...section,
      children: section.children.filter((child) =>
        allowedMenuIds.has(child.menuslno)
      ),
    }))
    .filter((section) => section.children.length > 0);

  const handleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <PageWrapper
      sx={{
        //  boxShadow: isDark ? "0 8px 30px rgba(0,0,0,0.5)" : "0 8px 30px rgba(0,0,0,0.06)",
        // border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.8)",
        // bgcolor: isDark ? "rgba(30,41,59,0.7)" : "#fff",
        backdropFilter: "blur(24px)",
        // border: "1px solid rgba(255, 255, 255, 0.35)",
        // boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
        ...glassStyles(isDark),
        position: "relative",
        overflowY: "scroll",
        overflowX: "hidden",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {/* Background Glow */}
      <Box
        sx={{
          position: "absolute",
          top: "-5%",
          left: "-5%",
          width: { xs: 220, md: 320 },
          height: { xs: 220, md: 320 },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(30, 64, 175, 0.18) 0%, rgba(30, 64, 175, 0) 70%)",
          filter: "blur(40px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: "-5%",
          right: "-5%",
          width: { xs: 250, md: 350 },
          height: { xs: 250, md: 350 },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(249, 115, 22, 0.16) 0%, rgba(249, 115, 22, 0) 70%)",
          filter: "blur(45px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Compact Page Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 2.5,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 42,
            height: 42,
            borderRadius: "12px",
            background:
              "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #f97316 100%)",
            boxShadow: "0 6px 18px -6px rgba(30, 64, 175, 0.4)",
          }}
        >
          <SettingsIcon sx={{ color: "#fff", fontSize: "1.35rem" }} />
        </Box>

        <Box>
          <Typography
            level="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.35rem", md: "1.7rem" },
              lineHeight: 1.1,
              letterSpacing: "-0.4px",
              // background:
              //   "linear-gradient(90deg, #1e40af 0%, #2563eb 45%, #ea580c 100%)",
              bgcolor: isDark ? "rgb(250, 250, 250)" : "#0c0b0b",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Master Settings
          </Typography>

          <Typography
            level="body-xs"
            sx={{
              color: "#64748b",
              fontWeight: 500,
              fontSize: "0.7rem",
              mt: 0.3,
            }}
          >
            Configure and maintain global CRM master directories
          </Typography>
        </Box>
      </Box>

      {/* Compact Settings Sections */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          position: "relative",
          zIndex: 1,
        }}
      >
        {filteredMaster?.map((section, index) => {
          const isExpanded = expandedIndex === index;

          const themeColor =
            section.colorTheme === "blue" ? "#2563eb" : "#ea580c";

          const themeColorLight = section.bgGlow;

          return (
            <Box
              key={index}
              sx={{
                width: "100%",
                background: isDark ? 'rgba(15, 23, 42, 0.6)' : "rgba(255, 255, 255, 0.48)",
                backdropFilter: "blur(16px)",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.65)",
                boxShadow: isExpanded
                  ? `0 10px 24px -12px ${section.colorTheme === "blue"
                    ? "rgba(30, 64, 175, 0.15)"
                    : "rgba(234, 88, 12, 0.15)"
                  }`
                  : "0 4px 15px -8px rgba(31, 38, 135, 0.06)",
                overflow: "hidden",
                transition: "all 0.25s ease",
                "&:hover": {
                  boxShadow: `0 10px 22px -10px ${section.colorTheme === "blue"
                    ? "rgba(30, 64, 175, 0.14)"
                    : "rgba(234, 88, 12, 0.14)"
                    }`,
                },
              }}
            >
              {/* Compact Section Header */}
              <Box
                onClick={() => handleExpand(index)}
                sx={{
                  px: { xs: 1.5, md: 2 },
                  py: 1.25,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: isExpanded
                    ? `linear-gradient(90deg, ${themeColorLight} 0%, rgba(255,255,255,0) 100%)`
                    : "transparent",
                  userSelect: "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                  }}
                >
                  {/* Section Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 34,
                      height: 34,
                      borderRadius: "9px",
                      bgcolor: "rgba(255,255,255,0.8)",
                      color: themeColor,
                      border: `1px solid ${isExpanded
                        ? themeColor
                        : "rgba(255,255,255,0.9)"
                        }`,
                      transition: "all 0.25s ease",
                    }}
                  >
                    {React.cloneElement(section.icon, {
                      sx: {
                        fontSize: "1.2rem",
                        color: themeColor,
                      },
                    })}
                  </Box>

                  {/* Section Title */}
                  <Box>
                    <Typography
                      sx={{
                        color: isDark ? "#fff" : "#0f172a",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {section.main}
                    </Typography>

                    <Typography
                      level="body-xs"
                      sx={{
                        color: "#64748b",
                        fontWeight: 500,
                        fontSize: "0.62rem",
                        lineHeight: 1.2,
                        mt: 0.2,
                      }}
                    >
                      {section.children.length} configuration directories
                    </Typography>
                  </Box>
                </Box>

                {/* Expand Arrow */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 26,
                    height: 26,
                    borderRadius: "7px",
                    bgcolor: "rgba(255,255,255,0.75)",
                    border: "1px solid rgba(255,255,255,0.9)",
                    transform: isExpanded
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.25s ease",
                  }}
                >
                  <ArrowForwardIosIcon
                    sx={{
                      fontSize: "0.62rem",
                      color: isExpanded ? themeColor : "#64748b",
                    }}
                  />
                </Box>
              </Box>

              {/* Children */}
              <Box
                sx={{
                  maxHeight: isExpanded ? "1200px" : "0px",
                  opacity: isExpanded ? 1 : 0,
                  overflow: "hidden",
                  transition:
                    "max-height 0.35s ease, opacity 0.25s ease",
                  borderTop: isExpanded
                    ? "1px solid rgba(255,255,255,0.5)"
                    : "none",
                  bgcolor: "rgba(255,255,255,0.12)",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)",
                    },
                    gap: 1,
                    p: { xs: 1.25, md: 1.5 },
                  }}
                >
                  {section.children.map((child, childIndex) => (
                    <Box
                      key={childIndex}
                      onClick={() =>
                        navigate(child.path, {
                          state: { title: child.label },
                        })
                      }
                      sx={{
                        minWidth: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1.15,
                        py: 1,
                        cursor: "pointer",
                        borderRadius: "10px",
                        background: isDark ? 'rgba(15, 23, 42, 0.6)' : "rgba(255,255,255,0.58)",
                        border: "1px solid rgba(255,255,255,0.7)",
                        boxShadow:
                          "0 2px 8px -5px rgba(31,38,135,0.08)",
                        transition: "all 0.2s ease",
                        position: "relative",
                        overflow: "hidden",

                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "3px",
                          height: "100%",
                          background: themeColor,
                          opacity: 0.65,
                          transition: "all 0.2s ease",
                        },

                        "&:hover": {
                          transform: "translateY(-1px)",
                          background: isDark ? "#fad2b7" : "#ffffff",
                          border: `1px solid ${themeColor}`,
                          boxShadow: `0 5px 14px -8px ${section.colorTheme === "blue"
                            ? "rgba(59,130,246,0.3)"
                            : "rgba(249,115,22,0.3)"
                            }`,

                          "&::before": {
                            width: "4px",
                            opacity: 1,
                          },

                          "& .child-icon-box": {
                            bgcolor: themeColorLight,
                            color: themeColor,
                            transform: "scale(1.04)",
                          },

                          "& .child-arrow": {
                            transform: "translateX(2px)",
                            color: themeColor,
                          },
                        },
                      }}
                    >
                      {/* Child Icon */}
                      <Box
                        className="child-icon-box"
                        sx={{
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 30,
                          height: 30,
                          borderRadius: "8px",
                          bgcolor: "rgba(255,255,255,0.9)",
                          color: "#475569",
                          border: "1px solid rgba(255,255,255,0.9)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {React.cloneElement(child.icon, {
                          sx: {
                            fontSize: "1rem",
                            transition: "color 0.2s",
                          },
                        })}
                      </Box>

                      {/* Text */}
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            color: isDark ? "#fff" : "#0f172a",
                            fontWeight: 650,
                            fontSize: "0.76rem",
                            lineHeight: 1.2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {child.label}
                        </Typography>

                        <Typography
                          level="body-xs"
                          sx={{
                            color: "#94a3b8",
                            fontWeight: 500,
                            fontSize: "0.58rem",
                            lineHeight: 1.2,
                            mt: 0.2,
                          }}
                        >
                          Manage entries
                        </Typography>
                      </Box>

                      {/* Arrow */}
                      <ArrowForwardIosIcon
                        className="child-arrow"
                        sx={{
                          flexShrink: 0,
                          fontSize: "0.55rem",
                          color: "#cbd5e1",
                          transition: "all 0.2s ease",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </PageWrapper>
  );
};

export default memo(Settings);