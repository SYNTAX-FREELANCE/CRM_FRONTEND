import React, { useState } from "react";
import {
    Box,
    IconButton,
    Tooltip,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CustomerSearchBar from "../../pages/CustomerSearchBar";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";


const CustomerSearchToggle = ({
    selectedCustomer,
    setSelectedCustomer,
    setDetailLoading,
}) => {
    const [showSearch, setShowSearch] = useState(!selectedCustomer);

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
        setShowSearch(false);
    };

    const handleSearchAgain = () => {
        setShowSearch(true);
    };

    const handleCloseSearch = () => {
        setShowSearch(false);
    };

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
            }}
        >
            {showSearch ? (
                <Box
                    sx={{
                        animation: "searchFadeIn .3s ease",
                        "@keyframes searchFadeIn": {
                            from: {
                                opacity: 0,
                                transform: "translateY(-8px)",
                            },
                            to: {
                                opacity: 1,
                                transform: "translateY(0)",
                            },
                        },
                    }}
                >
                    <CustomerSearchBar
                        onSelectCustomer={handleCustomerSelect}
                        setDetailLoading={setDetailLoading}
                    />

                    {selectedCustomer && (
                        <Tooltip title="Close search">
                            <IconButton
                                size="small"
                                onClick={handleCloseSearch}
                                sx={{
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                    width: 30,
                                    height: 30,
                                    bgcolor: "#f8fafc",
                                    color: "#64748b",
                                    border: "1px solid #e2e8f0",
                                    "&:hover": {
                                        bgcolor: "#f1f5f9",
                                        color: "#ef4444",
                                    },
                                }}
                            >
                                <CloseRoundedIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        animation: "searchButtonEnter .45s ease",
                        "@keyframes searchButtonEnter": {
                            from: {
                                opacity: 0,
                                transform: "translateY(-10px) scale(.9)",
                            },
                            to: {
                                opacity: 1,
                                transform: "translateY(0) scale(1)",
                            },
                        },
                    }}
                >
                    <Tooltip title="Search another customer" placement="left">
                        <Box
                            onClick={handleSearchAgain}
                            sx={{
                                position: "relative",
                                width: 46,
                                height: 38,
                                borderRadius: 2.5,
                                cursor: "pointer",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                bgcolor: "#eff6ff",
                                border: "1px solid #bfdbfe",
                                color: "#2563eb",

                                transition: "all .25s ease",

                                "&:hover": {
                                    bgcolor: "#dbeafe",
                                    borderColor: "#60a5fa",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 6px 16px rgba(37,99,235,.18)",

                                    "& .vehicle-icon": {
                                        transform: "translateX(-2px)",
                                    },

                                    "& .search-icon": {
                                        transform: "translate(3px, -3px) scale(1.08)",
                                    },

                                    "& .search-pulse": {
                                        opacity: 1,
                                        transform: "scale(1.4)",
                                    },
                                },
                            }}
                        >
                            {/* Small animated pulse */}
                            <Box
                                className="search-pulse"
                                sx={{
                                    position: "absolute",
                                    width: 22,
                                    height: 22,
                                    borderRadius: "50%",
                                    border: "1px solid #60a5fa",
                                    opacity: 0,
                                    transform: "scale(.8)",
                                    transition: "all .3s ease",
                                }}
                            />

                            {/* Vehicle */}
                            <DirectionsCarOutlinedIcon
                                className="vehicle-icon"
                                sx={{
                                    position: "absolute",
                                    left: 7,
                                    fontSize: 20,
                                    transition: "transform .25s ease",
                                }}
                            />

                            {/* Search */}
                            <SearchRoundedIcon
                                className="search-icon"
                                sx={{
                                    position: "absolute",
                                    right: 6,
                                    bottom: 5,
                                    fontSize: 16,
                                    bgcolor: "#eff6ff",
                                    borderRadius: "50%",
                                    transition: "all .25s ease",
                                }}
                            />

                            {/* Tiny moving dot */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    width: 4,
                                    height: 4,
                                    borderRadius: "50%",
                                    bgcolor: "#2563eb",
                                    right: 5,
                                    top: 5,

                                    animation: "searchDotBounce 1.5s infinite",

                                    "@keyframes searchDotBounce": {
                                        "0%, 100%": {
                                            transform: "translateY(0)",
                                        },
                                        "50%": {
                                            transform: "translateY(-3px)",
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Tooltip>
                </Box>
            )}
        </Box>
    );
};

export default CustomerSearchToggle;





