import React, { useMemo, useState } from "react";
import {
    Box,
    Checkbox,
    Chip,
    Input,
    Stack,
    Typography,
    Button,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material";

const EmployeeMultiSelect = ({
    employees = [],
    value = [],
    onChange,
    onMulitpleAllocate
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [search, setSearch] = useState("");

    const filteredEmployees = useMemo(() => {
        return employees?.filter((emp) =>
            emp?.name?.toLowerCase()?.includes(search?.toLowerCase())
        );
    }, [employees, search]);

    const handleToggle = (id) => {
        if (value?.includes(id)) {
            onChange(value?.filter((x) => x !== id));
        } else {
            onChange([...(value || []), id]);
        }
    };

    const selectAll = () => {
        onChange(filteredEmployees?.map((e) => e?.user_id) || []);
    };

    const clearAll = () => {
        onChange([]);
    };

    return (
        <Box
            sx={{
                border: "1px solid",
                borderColor: isDark
                    ? "rgba(255,255,255,.08)"
                    : "#dbe4ee",
                borderRadius: "12px",
                bgcolor: isDark ? "#111827" : "#fff",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    borderBottom: "1px solid",
                    borderColor: isDark
                        ? "rgba(255,255,255,.08)"
                        : "#eef2f7",
                }}
            >
                <Typography level="title-md">
                    Select Employees
                </Typography>

                <Typography level="body-xs" sx={{ mt: 0.3 }}>
                    {value?.length || 0} Employee(s) Selected
                </Typography>

                <Input
                    sx={{ mt: 1.5 }}
                    placeholder="Search employee..."
                    startDecorator={<SearchIcon />}
                    value={search}
                    onChange={(e) => setSearch(e?.target?.value)}
                />

                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                    <Button
                        size="sm"
                        variant="soft"
                        onClick={selectAll}
                    >
                        Select All
                    </Button>

                    <Button
                        size="sm"
                        color="danger"
                        variant="soft"
                        onClick={clearAll}
                    >
                        Clear
                    </Button>
                    <Button
                        size="sm"
                        color="warning"
                        variant="soft"
                        onClick={() => onMulitpleAllocate("PENDING", 0, 'Multiple Allocations')}
                        
                    >
                        Allocate
                    </Button>
                </Stack>
            </Box>

            {/* Employee List */}
            <Box
                sx={{
                    maxHeight: 400,
                    overflowY: "auto",
                    p: 1,

                    // Hide scrollbar (Chrome, Edge, Safari)
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },

                    // Hide scrollbar (Firefox)
                    scrollbarWidth: "none",

                    // Hide scrollbar (IE/Edge Legacy)
                    msOverflowStyle: "none",
                }}
            >
                <Stack spacing={1}>
                    {filteredEmployees?.length === 0 && (
                        <Typography
                            level="body-sm"
                            textAlign="center"
                            sx={{ py: 3 }}
                        >
                            No Employees Found
                        </Typography>
                    )}

                    {filteredEmployees?.map((emp) => {
                        const selected = value?.includes(emp?.user_id);

                        return (
                            <Box
                                key={emp?.user_id}
                                onClick={() =>
                                    handleToggle(emp?.user_id)
                                }
                                sx={{
                                    cursor: "pointer",
                                    borderRadius: "10px",
                                    p: 1,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    transition: ".2s",
                                    border: selected
                                        ? "2px solid #2563eb"
                                        : isDark
                                            ? "1px solid rgba(255,255,255,.08)"
                                            : "1px solid #e5e7eb",
                                    bgcolor: selected
                                        ? isDark
                                            ? "rgba(37,99,235,.15)"
                                            : "#eff6ff"
                                        : "transparent",
                                    "&:hover": {
                                        bgcolor: isDark
                                            ? "rgba(255,255,255,.04)"
                                            : "#f8fafc",
                                    },
                                }}
                            >
                                <Checkbox
                                    checked={selected}
                                    onChange={() =>
                                        handleToggle(emp?.user_id)
                                    }
                                    onClick={(e) =>
                                        e.stopPropagation()
                                    }
                                    label={
                                        <Typography
                                            fontSize={10}
                                            fontWeight={600}
                                        >
                                            {emp?.name?.toUpperCase()}
                                        </Typography>
                                    }
                                />

                                <Chip
                                    size="sm"
                                    color={
                                        emp?.status_name === "AVAILABLE"
                                            ? "success"
                                            : "warning"
                                    }
                                    sx={{
                                        fontSize: 8
                                    }}
                                >
                                    {emp?.status_name}
                                </Chip>
                            </Box>
                        );
                    })}
                </Stack>
            </Box>
        </Box>
    );
};

export default EmployeeMultiSelect;