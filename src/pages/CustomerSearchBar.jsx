import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Paper,
    TextField,
    Typography,
    Avatar,
    CircularProgress,
    InputAdornment,
    Stack,
    Chip,
    useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { debounce } from "@mui/material/utils";
import { axioslogin } from "../Connection/axios";

const CustomerSearchBar = ({ onSelectCustomer, setDetailLoading }) => {
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const fetchSuggestions = async (query) => {
        if (!query || query.trim().length < 3) {
            setOptions([]);
            setOpen(false);
            return;
        }

        try {
            setLoading(true);
            const { data } = await axioslogin.get(`/lead/search?q=${encodeURIComponent(query)}`);
            const rows = data?.data || [];
            setOptions(rows);
            setOpen(rows.length > 0);
        } catch (err) {
            console.error(err);
            setOptions([]);
            setOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useMemo(() => debounce(fetchSuggestions, 300), []);

    useEffect(() => {
        debouncedFetch(inputValue);
        return () => debouncedFetch.clear();
    }, [inputValue, debouncedFetch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = async (value) => {
        if (!value?.customer_id) return;

        setInputValue(
            value.registration_number ||
            value.mobile_number_1 ||
            value.customer_name ||
            ""
        );
        setOpen(false);
        setDetailLoading?.(true);

        try {
            const { data } = await axioslogin.get(
                `/lead/customer/${value.customer_id}/details`
            );
            onSelectCustomer?.(data?.data);
        } catch (err) {
            console.error(err);
            onSelectCustomer?.(value);
        } finally {
            setDetailLoading?.(false);
        }
    };

    const clearSearch = () => {
        setInputValue("");
        setOptions([]);
        setOpen(false);
        onSelectCustomer?.(null);
    };

    const getSubtitle = (option) => {
        const parts = [
            option.mobile_number_1,
            option.city,
            option.district,
            option.state,
        ].filter(Boolean);
        return parts.join(" • ");
    };

    return (
        <Box ref={wrapperRef} sx={{ position: "relative", width: "100%", mb:2}}>
            <Box
                sx={{
                    p: 1.5,
                    borderRadius: 4,
                    border: isDark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.95)",
                    bgcolor: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.35)",
                    backdropFilter: "blur(24px) saturate(200%)",
                    WebkitBackdropFilter: "blur(24px) saturate(200%)",
                    boxShadow: isDark
                        ? "0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.12) inset, 0 2px 8px rgba(0,0,0,0.2)"
                        : "0 16px 48px rgba(15,23,42,0.15), 0 0 0 1px rgba(255,255,255,0.7) inset, 0 2px 8px rgba(31,38,135,0.08)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                        boxShadow: isDark
                            ? "0 20px 56px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.15) inset, 0 4px 12px rgba(0,0,0,0.25)"
                            : "0 20px 56px rgba(15,23,42,0.18), 0 0 0 1px rgba(255,255,255,0.8) inset, 0 4px 12px rgba(31,38,135,0.12)",
                        bgcolor: isDark ? "rgba(30, 41, 59, 0.75)" : "rgba(255, 255, 255, 0.4)",
                    },
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: isDark
                            ? `
          linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.04) 100%),
          radial-gradient(at 30% 20%, rgba(96,165,250,0.08) 0%, transparent 50%),
          radial-gradient(at 80% 80%, rgba(139,92,246,0.06) 0%, transparent 50%)
        `
                            : `
          linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.3) 100%),
          radial-gradient(at 30% 20%, rgba(37,99,235,0.08) 0%, transparent 50%),
          radial-gradient(at 80% 80%, rgba(167,139,250,0.06) 0%, transparent 50%)
        `,
                        pointerEvents: "none",
                        zIndex: 0,
                    },
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "1px",
                        background: isDark
                            ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), rgba(255,255,255,0.4), rgba(255,255,255,0.25), transparent)"
                            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), rgba(255,255,255,1), rgba(255,255,255,0.9), transparent)",
                        pointerEvents: "none",
                        zIndex: 1,
                    },
                }}
            >
                <TextField
                    fullWidth
                    value={inputValue}
                    onChange={(e) => {
                        const value = e.target.value;
                        setInputValue(value);
                        if (!value.trim()) {
                            clearSearch();
                            return;
                        }
                        setOpen(true);
                    }}
                    onFocus={() => {
                        if (options.length > 0) setOpen(true);
                    }}
                    placeholder="Search vehicle, mobile or customer..."
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Box
                                    sx={{
                                        display: "grid",
                                        placeItems: "center",
                                        width: 36,
                                        height: 36,
                                        borderRadius: 2.5,
                                        bgcolor: isDark ? "rgba(96,165,250,0.15)" : "rgba(37,99,235,0.12)",
                                        backdropFilter: "blur(12px)",
                                        ml: 0.5,
                                    }}
                                >
                                    <SearchIcon sx={{ color: isDark ? "#60a5fa" : "#2563eb", fontSize: 20 }} />
                                </Box>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Stack direction="row" spacing={0.75} alignItems="center">
                                    {loading && (
                                        <CircularProgress
                                            size={20}
                                            thickness={5}
                                            sx={{
                                                color: isDark ? "#60a5fa" : "#2563eb",
                                                mr: 0.5,
                                            }}
                                        />
                                    )}
                                    {inputValue && (
                                        <Box
                                            onClick={clearSearch}
                                            sx={{
                                                display: "grid",
                                                placeItems: "center",
                                                width: 32,
                                                height: 32,
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                                color: isDark ? "#94a3b8" : "#64748b",
                                                bgcolor: isDark ? "rgba(148,163,184,0.1)" : "rgba(100,116,139,0.08)",
                                                backdropFilter: "blur(8px)",
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    bgcolor: isDark ? "rgba(255,255,255,0.15)" : "rgba(148,163,184,0.2)",
                                                    transform: "scale(1.05)",
                                                    boxShadow: isDark
                                                        ? "0 4px 12px rgba(0,0,0,0.3)"
                                                        : "0 4px 12px rgba(31,38,135,0.15)",
                                                },
                                                position: "relative",
                                                zIndex: 2,
                                            }}
                                        >
                                            <CloseIcon sx={{ fontSize: 17 }} />
                                        </Box>
                                    )}
                                </Stack>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiInputBase-root": {
                            fontSize: 15,
                            fontWeight: 500,
                            px: 1,
                            py: 1.25,
                            position: "relative",
                            zIndex: 2,
                            color: isDark ? "#f1f5f9" : "#1e293b",
                            "&::placeholder": {
                                color: isDark ? "#64748b" : "#94a3b8",
                                opacity: 1,
                            },
                        },
                    }}
                />
            </Box>
            {open && (
                <Paper
                    elevation={0}
                    sx={{
                        position: "absolute",
                        top: "calc(100% + 10px)",
                        left: 0,
                        right: 0,
                        zIndex: 20,
                        borderRadius: 3,
                        border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(226,232,240,0.95)",
                        bgcolor: isDark ? "#1e293b" : "#fff",
                        boxShadow: isDark ? "0 18px 45px rgba(0,0,0,0.5)" : "0 18px 45px rgba(15,23,42,0.12)",
                        overflow: "hidden",
                        maxHeight: 360,
                    }}
                >
                    <Box
                        sx={{
                            px: 2,
                            py: 1.25,
                            bgcolor: isDark ? "rgba(37,99,235,0.18)" : "rgba(37,99,235,0.06)",
                            borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(226,232,240,0.9)",
                        }}
                    >
                        <Typography sx={{ fontSize: 12, fontWeight: 800, color: isDark ? "#60a5fa" : "#2563eb" }}>
                            {inputValue.trim().length < 3
                                ? "Type at least 3 characters"
                                : `${options.length} result(s)`}
                        </Typography>
                    </Box>

                    <Box sx={{
                        maxHeight: 300, overflowY: "auto",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}>
                        {inputValue.trim().length < 3 ? (
                            <Box sx={{ p: 2.5, textAlign: "center" }}>
                                <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontWeight: 600 }}>
                                    Start typing to search customers
                                </Typography>
                            </Box>
                        ) : options?.length === 0 && !loading ? (
                            <Box sx={{ p: 2.5, textAlign: "center" }}>
                                <Typography sx={{ color: isDark ? "#94a3b8" : "#64748b", fontWeight: 600 }}>
                                    No matching customer found
                                </Typography>
                            </Box>
                        ) : (
                            options?.map((option) => (
                                <Box
                                    key={`${option.customer_id}-${option.vehicle_id || ""}-${option.lead_id || ""}`}
                                    onClick={() => handleSelect(option)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        px: 2,
                                        py: 1.4,
                                        cursor: "pointer",
                                        borderBottom: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(241,245,249,0.9)",
                                        transition: "0.2s",
                                        "&:hover": {
                                            bgcolor: isDark ? "rgba(37,99,235,0.15)" : "rgba(37,99,235,0.05)",
                                        },

                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 42,
                                            height: 42,
                                            bgcolor: isDark ? "rgba(37,99,235,0.25)" : "rgba(37,99,235,0.10)",
                                            color: isDark ? "#60a5fa" : "#2563eb",
                                            fontWeight: 800,
                                            fontSize: { xs: 14, sm: 16, md: 18 }
                                        }}
                                    >
                                        {(option.customer_name || "?").charAt(0).toUpperCase()}
                                    </Avatar>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography sx={{ fontWeight: 800, color: isDark ? "#f8fafc" : "#0f172a", fontSize: { xs: 12, } }} noWrap>
                                            {option.customer_name || "-"}
                                        </Typography>

                                        <Typography sx={{ fontSize: 13, color: isDark ? "#60a5fa" : "#2563eb", mt: 0.2, fontSize: { xs: 10, } }} noWrap>
                                            {option.registration_number
                                                ? `${option.registration_number}`
                                                : option.mobile_number_1
                                                    ? ` ${option.mobile_number_1}`
                                                    : " Customer"}
                                        </Typography>

                                        <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", fontSize: { xs: 10, } }} noWrap>
                                            {getSubtitle(option) || "Search result"}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default CustomerSearchBar;