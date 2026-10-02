import React from "react";
import { Box, Button, Typography } from "@mui/joy";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { useInsuranceCompanyMaster } from "../../CommonCode/useQuery";

const InsuranceDetails = ({
    value,
    onChange,
    onConfirm,
}) => {
    const {
        data: InsuranceCompanyMaster = [],
    } = useInsuranceCompanyMaster();

    const ActiveInsuranceCompanyMaster =
        Array.isArray(InsuranceCompanyMaster)
            ? InsuranceCompanyMaster
                  .filter(
                      (item) => item.is_active === 1
                  )
                  .map((item) => ({
                      id:
                          item.insurance_company_id,
                      label:
                          item.company_name ||
                          item.insurance_company_name,
                  }))
            : [];

    return (
        <Box>
            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",

                    mb: 1.3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                    }}
                >
                    <BusinessRoundedIcon
                        sx={{
                            fontSize: 18,
                            color: "primary.500",
                        }}
                    />

                    <Typography
                        level="title-sm"
                        fontWeight={700}
                    >
                        Insurance Company
                    </Typography>
                </Box>

                <Typography
                    level="body-xs"
                    sx={{
                        color: "text.secondary",
                    }}
                >
                    {
                        ActiveInsuranceCompanyMaster.length
                    }{" "}
                    available
                </Typography>
            </Box>

            {/* COMPANIES */}

            <Box
                sx={{
                    display: "grid",

                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                    },

                    gap: 1,
                }}
            >
                {ActiveInsuranceCompanyMaster.map(
                    (company) => {
                        const isSelected =
                            value?.id ===
                            company.id;

                        return (
                            <Box
                                key={company.id}
                                onClick={() =>
                                    onChange(
                                        company
                                    )
                                }
                                sx={{
                                    minHeight: 52,

                                    px: 1,

                                    py: 0.7,

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap: 0.8,

                                    cursor:
                                        "pointer",

                                    border:
                                        "1px solid",

                                    borderColor:
                                        isSelected
                                            ? "primary.500"
                                            : "divider",

                                    borderRadius:
                                        "9px",

                                    backgroundColor:
                                        isSelected
                                            ? "primary.softBg"
                                            : "background.surface",

                                    transition:
                                        "all 0.15s ease",

                                    "&:hover":
                                        {
                                            borderColor:
                                                "primary.400",
                                        },
                                }}
                            >
                                {/* ICON */}

                                <Box
                                    sx={{
                                        width: 29,
                                        height: 29,

                                        minWidth: 29,

                                        borderRadius:
                                            "7px",

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        backgroundColor:
                                            isSelected
                                                ? "primary.500"
                                                : "neutral.softBg",

                                        color:
                                            isSelected
                                                ? "#fff"
                                                : "text.secondary",
                                    }}
                                >
                                    <BusinessRoundedIcon
                                        sx={{
                                            fontSize:
                                                15,
                                        }}
                                    />
                                </Box>

                                {/* NAME */}

                                <Typography
                                    level="body-xs"
                                    fontWeight={
                                        isSelected
                                            ? 700
                                            : 500
                                    }
                                    sx={{
                                        flex: 1,

                                        lineHeight:
                                            1.2,
                                    }}
                                >
                                    {
                                        company.label
                                    }
                                </Typography>

                                {/* CHECK */}

                                {isSelected && (
                                    <CheckCircleRoundedIcon
                                        sx={{
                                            fontSize:
                                                16,

                                            color:
                                                "primary.500",
                                        }}
                                    />
                                )}
                            </Box>
                        );
                    }
                )}
            </Box>

            {/* SELECTED */}

            {value && (
                <Box
                    sx={{
                        mt: 1,

                        px: 1,

                        py: 0.6,

                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap: 0.7,

                        borderRadius:
                            "8px",

                        backgroundColor:
                            "success.softBg",

                        border: "1px solid",

                        borderColor:
                            "success.200",
                    }}
                >
                    <CheckCircleRoundedIcon
                        sx={{
                            fontSize: 16,

                            color:
                                "success.500",
                        }}
                    />

                    <Typography
                        level="body-xs"
                        fontWeight={600}
                        sx={{
                            flex: 1,
                        }}
                    >
                        {value.label}
                    </Typography>

                    <ArrowForwardRoundedIcon
                        sx={{
                            fontSize: 16,

                            color:
                                "success.500",
                        }}
                    />
                </Box>
            )}

            {/* CONFIRM */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "flex-end",

                    mt: 1.2,
                }}
            >
                <Button
                    size="sm"
                    disabled={!value}
                    onClick={onConfirm}
                    endDecorator={
                        <ArrowForwardRoundedIcon
                            sx={{
                                fontSize: 16,
                            }}
                        />
                    }
                >
                    Confirm & Continue
                </Button>
            </Box>
        </Box>
    );
};

export default InsuranceDetails;

