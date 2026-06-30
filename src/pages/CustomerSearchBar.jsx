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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { debounce } from "@mui/material/utils";
import { axioslogin } from "../Axios/axios";

const CustomerSearchBar = ({ onSelectCustomer, setDetailLoading }) => {
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

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
        <Box ref={wrapperRef} sx={{ position: "relative", width: "100%", }}>
            <Paper
                elevation={0}
                sx={{
                    p: 1,
                    borderRadius: 3,
                    border: "1px solid rgba(226,232,240,0.95)",
                    bgcolor: "#fff",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
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
                    placeholder="Vehicle Number / Mobile / Customer Name"
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "#2563eb" }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    {loading && <CircularProgress size={18} thickness={5} />}
                                    {inputValue && (
                                        <Box
                                            onClick={clearSearch}
                                            sx={{
                                                display: "grid",
                                                placeItems: "center",
                                                width: 30,
                                                height: 30,
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                                color: "#64748b",
                                                "&:hover": { bgcolor: "rgba(148,163,184,0.12)" },
                                            }}
                                        >
                                            <CloseIcon sx={{ fontSize: 18 }} />
                                        </Box>
                                    )}
                                </Stack>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiInputBase-root": {
                            fontSize: 15,
                            fontWeight: 600,
                            px: 0.5,
                            py: 1,
                        },
                    }}
                />
            </Paper>

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
                        border: "1px solid rgba(226,232,240,0.95)",
                        bgcolor: "#fff",
                        boxShadow: "0 18px 45px rgba(15,23,42,0.12)",
                        overflow: "hidden",
                        maxHeight: 360,
                    }}
                >
                    <Box
                        sx={{
                            px: 2,
                            py: 1.25,
                            bgcolor: "rgba(37,99,235,0.06)",
                            borderBottom: "1px solid rgba(226,232,240,0.9)",
                        }}
                    >
                        <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#2563eb" }}>
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
                                <Typography sx={{ color: "#64748b", fontWeight: 600 }}>
                                    Start typing to search customers
                                </Typography>
                            </Box>
                        ) : options?.length === 0 && !loading ? (
                            <Box sx={{ p: 2.5, textAlign: "center" }}>
                                <Typography sx={{ color: "#64748b", fontWeight: 600 }}>
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
                                        borderBottom: "1px solid rgba(241,245,249,0.9)",
                                        transition: "0.2s",
                                        "&:hover": {
                                            bgcolor: "rgba(37,99,235,0.05)",
                                        },

                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 42,
                                            height: 42,
                                            bgcolor: "rgba(37,99,235,0.10)",
                                            color: "#2563eb",
                                            fontWeight: 800,
                                            fontSize: { xs: 14, sm: 16, md: 18 }
                                        }}
                                    >
                                        {(option.customer_name || "?").charAt(0).toUpperCase()}
                                    </Avatar>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: 12, sm: 14, md: 16 } }} noWrap>
                                            {option.customer_name || "-"}
                                        </Typography>

                                        <Typography sx={{ fontSize: 13, color: "#2563eb", mt: 0.2, fontSize: { xs: 10, sm: 12, md: 14 } }} noWrap>
                                            {option.registration_number
                                                ? `${option.registration_number}`
                                                : option.mobile_number_1
                                                    ? ` ${option.mobile_number_1}`
                                                    : " Customer"}
                                        </Typography>

                                        <Typography sx={{ fontSize: 12, color: "#64748b", fontSize: { xs: 10, sm: 12, md: 14 } }} noWrap>
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