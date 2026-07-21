import React, { memo, useState } from "react";
import { Box, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../CommonComponents/PageWrapper";

// Material UI Icons for a rich, creative, visual settings menu
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
import { useGetEmployeeMenuRights } from "../CommonCode/useQuery";
import { getAuthUser } from "../constant/Constant";


const Settings = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null); // Default to no expanded section

  const authUser = getAuthUser();

  const { role_id } = authUser ?? {};

  const { data: EmployeeMenuRights = [] } = useGetEmployeeMenuRights(role_id);

  const master = [
    {
      main: "General Master",
      colorTheme: "blue",
      icon: <ExtensionIcon sx={{ color: "#1e40af", fontSize: "1.5rem" }} />,
      bgGlow: "rgba(30, 64, 175, 0.08)",
      children: [
        { menuslno: 1, label: "Menu Master", path: "/home/setting/menumaster", icon: <MenuIcon /> },
        { menuslno: 2, label: "Module Master", path: "/home/setting/modulemaster", icon: <ExtensionIcon /> },
        { menuslno: 3, label: "Submodule Master", path: "/home/setting/submodulemaster", icon: <LayersIcon /> },
        { menuslno: 4, label: "Qualification Master", path: "/home/setting/qualificationmaster", icon: <SchoolIcon /> },
        { menuslno: 5, label: "Company Master", path: "/home/setting/companymaster", icon: <BusinessIcon /> },
        { menuslno: 6, label: "Status Master", path: "/home/setting/statusmaster", icon: <ToggleOnIcon /> },
        { menuslno: 7, label: "Lead Master", path: "/home/setting/leadmaster", icon: <LeaderboardIcon /> },
        { menuslno: 8, label: "Vehicle Type Master", path: "/home/setting/vehicletypemaster", icon: <DirectionsCarIcon /> },
        { menuslno: 9, label: "Insurance Company Master", path: "/home/setting/insurancecompany", icon: <ShieldIcon /> },
        { menuslno: 10, label: "Customer Master", path: "/home/setting/customermaster", icon: <PeopleIcon /> },
        { menuslno: 11, label: "Vehicle Master", path: "/home/setting/vehiclemaster", icon: <DirectionsCarIcon /> },
      ],
    },
    {
      main: "User Management",
      colorTheme: "orange",
      icon: <PeopleIcon sx={{ color: "#ea580c", fontSize: "1.5rem" }} />,
      bgGlow: "rgba(234, 88, 12, 0.08)",
      children: [
        { menuslno: 12, label: "Employee Master", path: "/home/setting/employeemaster", icon: <BadgeIcon /> },
        { menuslno: 13, label: "Role Master", path: "/home/setting/rolemaster", icon: <SecurityIcon /> },
        { menuslno: 14, label: "User Right Master", path: "/home/setting/userrightmaster", icon: <VpnKeyIcon /> },
        { menuslno: 15, label: "Data Upload Master", path: "/home/setting/Uploadmaster", icon: <CloudUploadIcon /> },
        { menuslno: 16, label: "User Module Rights", path: "/home/setting/usermodulerightmaster", icon: <VpnKeyIcon /> },
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
        bgcolor: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.35)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
        p: { xs: 2.5, md: 4 },
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(100vh - 40px)",
      }}>

      {/* Background Glow Blobs */}
      <Box
        sx={{
          position: "absolute",
          top: "-5%",
          left: "-5%",
          width: { xs: "250px", md: "400px" },
          height: { xs: "250px", md: "400px" },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30, 64, 175, 0.25) 0%, rgba(30, 64, 175, 0) 70%)",
          filter: "blur(40px)",
          zIndex: 0,
          pointerEvents: "none",
          animation: "floatBlob1 12s infinite alternate",
          "@keyframes floatBlob1": {
            "0%": { transform: "translate(0, 0) scale(1)" },
            "100%": { transform: "translate(40px, 20px) scale(1.15)" },
          }
        }}
      />


      <Box
        sx={{
          position: "absolute",
          bottom: "-5%",
          right: "-5%",
          width: { xs: "300px", md: "450px" },
          height: { xs: "300px", md: "450px" },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0) 70%)",
          filter: "blur(50px)",
          zIndex: 0,
          pointerEvents: "none",
          animation: "floatBlob2 15s infinite alternate-reverse",
          "@keyframes floatBlob2": {
            "0%": { transform: "translate(0, 0) scale(1)" },
            "100%": { transform: "translate(-50px, -30px) scale(1.1)" },
          }
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "30%",
          left: "25%",
          width: { xs: "200px", md: "350px" },
          height: { xs: "200px", md: "350px" },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 75%)",
          filter: "blur(35px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />


      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            borderRadius: "16px",
            background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #f97316 100%)",
            boxShadow: "0 8px 24px -6px rgba(30, 64, 175, 0.4)",
            animation: "spinSlow 20s linear infinite",
            "@keyframes spinSlow": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            }
          }}
        >
          <SettingsIcon sx={{ color: "#ffffff", fontSize: "1.7rem" }} />
        </Box>
        <Box>
          <Typography
            level="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              letterSpacing: "-0.5px",
              background: "linear-gradient(90deg, #1e40af 0%, #2563eb 45%, #ea580c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Master Settings
          </Typography>
          <Typography
            level="body-xs"
            sx={{
              color: "#475569",
              fontWeight: 600,
              letterSpacing: "0.2px",
              opacity: 0.8,
            }}
          >
            Configure and maintain global CRM master directories
          </Typography>
        </Box>
      </Box>

      {/* Settings Sections Accordion Grid */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        {filteredMaster.map((section, index) => {
          const isExpanded = expandedIndex === index;
          const themeColor = section.colorTheme === "blue" ? "#2563eb" : "#ea580c";
          const themeColorLight = section.bgGlow;

          return (
            <Box
              key={index}
              sx={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.45)",
                backdropFilter: "blur(20px)",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                boxShadow: isExpanded
                  ? `0 20px 40px -15px ${section.colorTheme === "blue" ? "rgba(30, 64, 175, 0.08)" : "rgba(234, 88, 12, 0.08)"}, 0 0 0 1px ${themeColorLight} inset`
                  : "0 8px 30px -10px rgba(31, 38, 135, 0.04)",
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  boxShadow: `0 20px 40px -10px ${section.colorTheme === "blue" ? "rgba(30, 64, 175, 0.12)" : "rgba(234, 88, 12, 0.12)"}`,
                  border: "1px solid rgba(255, 255, 255, 0.7)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {/* Header Trigger */}
              <Box
                onClick={() => handleExpand(index)}
                sx={{
                  px: { xs: 2.5, md: 3 },
                  py: 2.5,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: isExpanded ? `linear-gradient(90deg, ${themeColorLight} 0%, rgba(255,255,255,0) 100%)` : "transparent",
                  transition: "background 0.3s ease",
                  userSelect: "none",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 44,
                      height: 44,
                      borderRadius: "14px",
                      bgcolor: "rgba(255, 255, 255, 0.75)",
                      border: `1px solid ${isExpanded ? themeColor : "rgba(255, 255, 255, 0.9)"}`,
                      boxShadow: isExpanded ? `0 0 15px ${themeColorLight}` : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: "#0f172a",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        letterSpacing: "-0.2px",
                      }}
                    >
                      {section.main}
                    </Typography>
                    <Typography
                      level="body-xs"
                      sx={{
                        color: "#64748b",
                        fontWeight: 500,
                      }}
                    >
                      {section.children.length} configuration directories
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 255, 255, 0.75)",
                    border: "1px solid rgba(255, 255, 255, 0.9)",
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s",
                    "&:hover": {
                      bgcolor: "#ffffff",
                    }
                  }}
                >
                  <ArrowForwardIosIcon
                    sx={{
                      fontSize: "0.8rem",
                      color: isExpanded ? themeColor : "#64748b",
                      transition: "color 0.3s",
                    }}
                  />
                </Box>
              </Box>

              {/* Children Content Grid */}
              <Box
                sx={{
                  maxHeight: isExpanded ? "1000px" : "0px",
                  opacity: isExpanded ? 1 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
                  borderTop: isExpanded ? "1px solid rgba(255, 255, 255, 0.4)" : "none",
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      md: "1fr 1fr 1fr",
                    },
                    gap: 2,
                    p: { xs: 2.5, md: 3 },
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
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        cursor: "pointer",
                        borderRadius: "18px",
                        background: "rgba(255, 255, 255, 0.55)",
                        border: "1px solid rgba(255, 255, 255, 0.6)",
                        boxShadow: "0 4px 15px -8px rgba(31, 38, 135, 0.02)",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "4px",
                          height: "100%",
                          background: `linear-gradient(180deg, ${themeColor} 0%, ${section.colorTheme === "blue" ? "#1d4ed8" : "#c2410c"} 100%)`,
                          borderRadius: "4px 0 0 4px",
                          opacity: 0.6,
                          transition: "width 0.3s ease, opacity 0.3s ease",
                        },
                        "&:hover": {
                          transform: "translateY(-3px)",
                          background: "#ffffff",
                          boxShadow: `0 10px 24px -10px ${section.colorTheme === "blue" ? "rgba(59, 130, 246, 0.18)" : "rgba(249, 115, 22, 0.18)"}`,
                          border: `1px solid ${themeColor}`,
                          "&::before": {
                            width: "6px",
                            opacity: 1,
                          },
                          "& .child-icon-box": {
                            bgcolor: themeColorLight,
                            color: themeColor,
                            transform: "scale(1.1)",
                          },
                          "& .child-arrow": {
                            transform: "translateX(3px)",
                            color: themeColor,
                          }
                        },
                      }}
                    >
                      {/* Left Icon */}
                      <Box
                        className="child-icon-box"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 38,
                          height: 38,
                          borderRadius: "12px",
                          bgcolor: "rgba(255, 255, 255, 0.85)",
                          color: "#475569",
                          border: "1px solid rgba(255, 255, 255, 0.9)",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {React.cloneElement(child.icon, {
                          sx: { fontSize: "1.2rem", transition: "color 0.3s" }
                        })}
                      </Box>

                      {/* Middle Texts */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: "#0f172a",
                            fontWeight: 650,
                            fontSize: "0.85rem",
                            lineHeight: 1.25,
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
                            color: "#64748b",
                            fontWeight: 500,
                            fontSize: "0.7rem",
                          }}
                        >
                          Manage data entries
                        </Typography>
                      </Box>

                      {/* Arrow Icon */}
                      <ArrowForwardIosIcon
                        className="child-arrow"
                        sx={{
                          fontSize: "0.65rem",
                          color: "#cbd5e1",
                          transition: "all 0.3s ease",
                          mr: 0.5,
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