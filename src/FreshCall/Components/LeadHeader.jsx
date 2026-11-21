
import React, { memo, Suspense, useCallback, useState } from "react";
import {
    Avatar,
    Box,
    Chip,
    IconButton,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";

import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from "@mui/icons-material/Close";
import CallPopover from "./CallPopover";
import LocalCarWashIcon from "@mui/icons-material/LocalCarWash";
import VehicleDetailsModal from "./VehicleDetailsModal";
import CalculationIcon from "../../MotorCalculator/MotorCalculatorComponent/CalculationIcon";
import { useMotorVehicleCategoryMaster } from "../../CommonCode/useQuery";
import VehicleCategoryPopover from "./VehicleCategoryPopover";
import { useNavigate } from "react-router-dom";

const LeadHeader = ({
    lead = {},
    initials,
    leadColor,
    onClose,
    handleCallClick,
    handleCallClose,
    callAnchorEl,
    callMenuOpen,
    refetch
}) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const isDark = theme.palette.mode === "dark";

    const colors = {
        background: isDark ? "#171d19" : "#ffffff",
        border: isDark ? "#303c33" : "#e5eee8",
        heading: isDark ? "#edf5ef" : "#263b30",
        secondary: isDark ? "#a2b1a6" : "#78877e",
        accent: isDark ? "#65c98a" : "#21834b",
        actionBg: isDark ? "#24372b" : "#edf6f0",
        actionBorder: isDark ? "#385642" : "#d9ebdf",
        actionHover: isDark ? "#316b45" : "#21834b",
        closeBg: isDark ? "#292f2b" : "#f5f7f5",
        closeColor: isDark ? "#b5c0b8" : "#758078",
        statusBg: isDark ? "#203b2b" : "#eaf6ed",
        statusColor: isDark ? "#80d69d" : "#168044",
        statusBorder: isDark ? "#355c41" : "#d2ead9",
    };

    const [openmodal, setOpenModal] = useState(false);

    const handleClickNewVehicle = useCallback(() => {
        setOpenModal(pre => !pre);
    }, []);

    const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);

    const {
        data: MotorVehicleCategoryMaster = [],
    } = useMotorVehicleCategoryMaster();

    const vehicleCategories =
        MotorVehicleCategoryMaster?.filter(
            item => Number(item?.is_active) === 1
        );

    const handleCalculationClick = (event) => {
        const anchor = event.currentTarget;

        setCategoryAnchorEl((current) =>
            current ? null : anchor
        );
    };

    const handleCategoryClose = () => {
        setCategoryAnchorEl(null);
    };

    const handleSelectCategory = (category) => {
        setCategoryAnchorEl(null);
        navigate(`/home/motor-calculator/category/${category?.vehicle_category_id}`, {
            state: { lead, category }
        });
    };

    const actionButtonSx = {
        width: 34,
        height: 34,
        borderRadius: "9px",
        bgcolor: colors.actionBg,
        color: colors.accent,
        border: `1px solid ${colors.actionBorder}`,
        transition: "all 0.2s ease",
        "&:hover": {
            bgcolor: colors.actionHover,
            color: "#ffffff",
            borderColor: colors.actionHover,
        },
    };

    return (
        <Box
            sx={{
                px: { xs: 1.5, sm: 2 },
                py: { xs: 1.5, sm: 1.75 },
                backgroundColor: colors.background,
                borderBottom: `1px solid ${colors.border}`,
                flex: "0 0 auto",
                transition: "background-color 0.2s ease, border-color 0.2s ease",
            }}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={1.5}
            >
                {/* Customer Info */}
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{
                        minWidth: 0,
                        flex: 1,
                    }}
                >
                    <Avatar
                        sx={{
                            width: { xs: 40, sm: 48 },
                            height: { xs: 40, sm: 48 },
                            bgcolor: leadColor,
                            fontWeight: 800,
                            fontSize: { xs: 15, sm: 18 },
                            border: `2px solid ${isDark ? "#355c41" : "#e2f2e7"}`,
                            boxShadow: isDark
                                ? "0 2px 5px rgba(0,0,0,0.2)"
                                : "0 2px 5px rgba(15,90,45,0.08)",
                            flexShrink: 0,
                        }}
                    >
                        {initials}
                    </Avatar>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                lineHeight: 1.25,
                                fontSize: { xs: "0.9rem", sm: "1.05rem" },
                                color: colors.heading,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {lead.customer_name || "Customer"}
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={0.8}
                            alignItems="center"
                            sx={{
                                mt: 0.6,
                                flexWrap: "wrap",
                                rowGap: 0.5,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.75rem",
                                    color: colors.secondary,
                                    fontWeight: 500,
                                }}
                            >
                                {lead.state || "-"}
                            </Typography>

                            <Chip
                                size="small"
                                label={lead.status_name || "NEW"}
                                sx={{
                                    height: 21,
                                    fontWeight: 700,
                                    bgcolor: colors.statusBg,
                                    color: colors.statusColor,
                                    border: `1px solid ${colors.statusBorder}`,
                                    borderRadius: "6px",
                                    fontSize: "0.66rem",
                                    "& .MuiChip-label": {
                                        px: 1,
                                    },
                                }}
                            />
                        </Stack>
                    </Box>
                </Stack>

                {/* Action Buttons */}
                <Stack
                    direction="row"
                    spacing={{ xs: 0.5, sm: 0.8 }}
                    alignItems="center"
                    sx={{
                        flexShrink: 0,
                    }}
                >
                    <CalculationIcon
                        title="View premium calculation"
                        onClick={handleCalculationClick}
                    />

                    <IconButton
                        size="small"
                        onClick={handleClickNewVehicle}
                        sx={actionButtonSx}
                    >
                        {/* <LocalCarWashIcon fontSize="small" /> */}
                        🚗
                    </IconButton>

                    <IconButton
                        size="small"
                        onClick={handleCallClick}
                        sx={actionButtonSx}
                    >
                        {/* <PhoneIcon fontSize="small" /> */}
                        📞
                    </IconButton>

                    <IconButton
                        size="small"
                        onClick={refetch}
                        sx={actionButtonSx}
                    >
                        {/* <LocalCarWashIcon fontSize="small" /> */}
                        🔄
                    </IconButton>

                    <IconButton
                        size="small"
                        onClick={onClose}
                        sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "9px",
                            bgcolor: colors.closeBg,
                            color: colors.closeColor,
                            border: `1px solid ${colors.border}`,
                            transition: "all 0.2s ease",
                            "&:hover": {
                                bgcolor: isDark ? "#512d30" : "#fff0f0",
                                color: isDark ? "#ff8585" : "#d14343",
                                borderColor: isDark ? "#754044" : "#f3d4d4",
                            },
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Stack>

            <Suspense fallback={"Loading...."}>
                {
                    openmodal &&
                    <VehicleDetailsModal
                        lead={lead}
                        open={openmodal}
                        onClose={() => setOpenModal(false)}
                    />
                }
            </Suspense>

            <CallPopover
                anchorEl={callAnchorEl}
                open={callMenuOpen}
                lead={lead}
                onClose={handleCallClose}
                mobile1={lead?.mobile_number_1}
                mobile2={lead?.mobile_number_2}
            />

            <VehicleCategoryPopover
                anchorEl={categoryAnchorEl}
                open={Boolean(categoryAnchorEl)}
                onClose={handleCategoryClose}
                categories={vehicleCategories}
                onSelectCategory={handleSelectCategory}
            />
        </Box>
    );
};

export default memo(LeadHeader);
