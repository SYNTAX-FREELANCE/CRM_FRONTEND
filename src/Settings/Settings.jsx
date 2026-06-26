import React, { memo, useState } from "react";
import { Box, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../CommonComponents/PageWrapper";

const Settings = () => {

  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);


  const master = [
    {
      main: "General Master",
      children: [
        { label: "Menu Master", path: "/home/setting/menumaster" },
        { label: "Module Master", path: "/home/setting/modulemaster" },
        { label: "Submodule Master", path: "/home/setting/submodulemaster" },
        { label: "Qualification Master", path: "/home/setting/qualificationmaster" },
        { label: "Company Master", path: "/home/setting/companymaster" },
        { label: "Status Master", path: "/home/setting/statusmaster" },
        { label: "Lead Master", path: "/home/setting/leadmaster" },
        { label: "Vehicle Type Master", path: "/home/setting/vehicletypemaster" },
        { label: "Insurance Company Master", path: "/home/setting/insurancecompany" },
      ],
    },
    {
      main: "User Management",
      children: [
        { label: "Employee Master", path: "/home/setting/employeemaster" },
        { label: "Role Master", path: "/home/setting/rolemaster" },
        // { label: "User Module Right Master", path: "/home/setting/usermodulerightmaster" },
        { label: "User Right Master", path: "/home/setting/userrightmaster" },
        { label: "Data Upload Master", path: "/home/setting/Uploadmaster" },

      ],
    },
  ];

  const handleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <PageWrapper>
      <Typography level="h3" mb={3}>
        Master Settings
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {master.map((section, index) => (
          <Box
            key={index}
            sx={{
              width: "90%",
              bgcolor: "#2a2928",
              borderRadius: 5,
              border: "1px solid #ffffff",
              overflow: "hidden",
              boxShadow: "0 0 0 1px rgba(142, 178, 211, 0.12) inset",
            }}
          >
            {/* Main Header */}
            <Box
              onClick={() => handleExpand(index)}
              sx={{
                px: 2,
                py: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontWeight: 700,
                }}
              >
                {section.main}
              </Typography>

              <Typography
                sx={{
                  color: "white",
                  fontWeight: 700,
                }}
              >
                {expandedIndex === index ? "-" : "+"}
              </Typography>
            </Box>

            {/* Children */}
            {expandedIndex === index && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  p: 2,
                  borderTop: "1px solid rgba(255,255,255,0.2)",
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
                      flex: {
                        xs: "0 0 100%",
                        sm: "0 0 calc(50% - 8px)",
                        md: "0 0 calc(25% - 12px)",
                      },
                      cursor: "pointer",
                    }}
                  >
                    <Typography
                      sx={{
                        display: "inline-block",
                        px: 1,
                        py: 0.5,
                        borderBottom: "3px solid #ff9a20",
                        color: "white",
                        fontSize: 13,
                        fontWeight: 600,
                        transition: "0.3s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          color: '#224ff1',
                          borderBottom: "3px solid #224ff1",

                        },
                      }}
                    >
                      {child.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </PageWrapper>
  );
};

export default memo(Settings);