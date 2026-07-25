import React, { memo } from "react";
import { Button, CircularProgress } from "@mui/material";

const CustomButton = ({
    children,
    onClick,
    loading = false,
    disabled = false,
    startIcon,
    endIcon,
    variant = "outlined",
    sx = {},
    ...props
}) => {
    return (
        <Button
            variant={variant}
            disabled={disabled || loading}
            onClick={onClick}
            startIcon={!loading ? startIcon : null}
            endIcon={!loading ? endIcon : null}
            sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 800,
                fontSize: { xs: 10, md: 14 },
                px: 1.5,
                py: 0.5,
                color: '#f47120',
                boxShadow: "none",
                "&:hover": {
                    boxShadow: "none",
                },
                ...sx,
            }}
            {...props}
        >
            {loading ? (
                <CircularProgress size={20} color="inherit" />
            ) : (
                children
            )}
        </Button>
    );
};

export default memo(CustomButton);