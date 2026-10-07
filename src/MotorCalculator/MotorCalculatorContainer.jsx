import React, {
    memo,
    useMemo,
} from "react";

import {
    Box,
    useTheme,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import MotorVehicleCategorySelect from "./MotorCalculatorComponent/MotorVehicleCategorySelect";

const MotorCalculatorContainer = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const isDark =
        theme.palette.mode === "dark";

    const colors = useMemo(
        () => ({
            background: isDark
                ? "#0f172a"
                : "#ffffff",

            text: isDark
                ? "#f8fafc"
                : "#172033",

            primary:
                theme.palette.primary.main,
        }),
        [
            isDark,
            theme.palette.primary.main,
        ]
    );

    const handleCategorySelect = category => {
        if (!category?.vehicle_category_id) {
            return;
        }

        const categoryId =
            category.vehicle_category_id;

       
        navigate(
            `/home/motor-calculator/category/${categoryId}`,
            {
                state: {
                    category,
                },
            }
        );
    };

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "90vh",

                backgroundColor:
                    colors.background,

                color: colors.text,

                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    width: "100%",
                }}
            >
                <MotorVehicleCategorySelect
                    onChange={handleCategorySelect}
                />
            </Box>
        </Box>
    );
};

export default memo(
    MotorCalculatorContainer
);