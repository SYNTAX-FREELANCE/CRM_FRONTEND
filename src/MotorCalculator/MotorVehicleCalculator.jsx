import React from "react";
import {
    Box,
    Typography,
} from "@mui/material";

import {
    useLocation,
    useParams,
} from "react-router-dom";

const MotorVehicleCalculator = () => {
    const { categoryId } = useParams();
    const location = useLocation();

    const category =
        location.state?.category;



    return (
        <Box
            sx={{
                width: "100%",
                p: 3,
            }}
        >
            <Typography
                variant="h5"
                fontWeight={700}
            >
                Motor Calculator
            </Typography>

            <Typography
                sx={{
                    mt: 1,
                    color: "text.secondary",
                }}
            >
                Category ID: {categoryId}
            </Typography>

            {category && (
                <Typography
                    sx={{
                        mt: 1,
                    }}
                >
                    Vehicle Category:{" "}
                    {category.category_name}
                </Typography>
            )}
        </Box>
    );
};

export default MotorVehicleCalculator;