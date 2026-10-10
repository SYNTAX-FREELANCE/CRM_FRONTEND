import React, { memo, Suspense, useCallback, useState } from "react";
import {
    Avatar,
    Box,
    Chip,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from "@mui/icons-material/Close";
import CallPopover from "./CallPopover";
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';
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
}) => {

    const navigate = useNavigate();


    const [openmodal, setOpenModal] = useState(false);

    const handleClickNewVehicle = useCallback(() => {
        setOpenModal(pre => !pre)
    }, []);
    const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);

    const {
        data: MotorVehicleCategoryMaster = [],
    } = useMotorVehicleCategoryMaster();


    const vehicleCategories =
        MotorVehicleCategoryMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )



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
        })

    };


    return (
        <Box
            sx={{
                p: 2,
                background:
                    "linear-gradient(135deg, rgba(37,99,235,.12) 0%, rgba(249,115,22,.12) 100%)",
                borderBottom: "1px solid rgba(255,255,255,.2)",
                flex: "0 0 auto",
            }}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                gap={2}
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
                            width: { xs: 36, sm: 56 },
                            height: { xs: 36, sm: 56 },
                            bgcolor: leadColor,
                            fontWeight: 800,
                            fontSize: { xs: 16, sm: 20 },
                        }}
                    >
                        {initials}
                    </Avatar>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 900,
                                lineHeight: 1.15,
                                fontSize: { xs: 16, sm: 20 },
                            }}
                        >
                            {lead.customer_name || "Customer"}
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                                mt: 0.5,
                                flexWrap: "wrap",
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: "0.78rem",
                                    color: "text.secondary",
                                }}
                            >
                                {lead.state || "-"}
                            </Typography>

                            <Chip
                                size="small"
                                label={lead.status_name || "NEW"}
                                sx={{
                                    height: 24,
                                    fontWeight: 800,
                                    bgcolor: "rgba(249,115,22,.2)",
                                    color: "#f97316",
                                    border:
                                        "1px solid rgba(249,115,22,.25)",
                                    fontSize: "0.7rem",
                                }}
                            />
                        </Stack>
                    </Box>
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" spacing={1}>


                    <CalculationIcon
                        title="View premium calculation"
                        onClick={handleCalculationClick}
                    />


                    <IconButton
                        size="small"
                        onClick={handleClickNewVehicle}
                        sx={{
                            bgcolor: "rgba(37,99,235,.2)",
                            color: "#2563eb",
                            border: "1px solid rgba(37,99,235,.25)",
                        }}
                    >
                        <LocalCarWashIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                        size="small"
                        onClick={handleCallClick}
                        sx={{
                            bgcolor: "rgba(37,99,235,.2)",
                            color: "#2563eb",
                            border: "1px solid rgba(37,99,235,.25)",
                        }}
                    >
                        <PhoneIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                        size="small"
                        onClick={onClose}
                        sx={{
                            bgcolor: "rgba(255,255,255,.55)",
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