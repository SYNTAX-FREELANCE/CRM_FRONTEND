
import React, { useMemo, useState } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";

import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

const CustomerAllocationTable = ({
    data = [],
    selectedRows,
    setSelectedRows,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [expiryFrom, setExpiryFrom] = useState("");
    const [expiryTo, setExpiryTo] = useState("");

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            if (!row.expiry_date) return !expiryFrom && !expiryTo;

            const expiryDate = new Date(row.expiry_date);

            if (Number.isNaN(expiryDate.getTime())) {
                return false;
            }

            // Compare calendar dates without time components.
            const date = new Date(
                expiryDate.getFullYear(),
                expiryDate.getMonth(),
                expiryDate.getDate()
            );

            const from = expiryFrom
                ? new Date(`${expiryFrom}T00:00:00`)
                : null;

            const to = expiryTo
                ? new Date(`${expiryTo}T00:00:00`)
                : null;

            if (from && date < from) return false;
            if (to && date > to) return false;

            return true;
        });
    }, [data, expiryFrom, expiryTo]);

    const columns = useMemo(
        () => [
            {
                accessorKey: "customer_name",
                header: "Customer",
                size: 220,
            },
            {
                accessorKey: "vehicle_category",
                header: "Category",
                size: 120,
            },
            {
                accessorKey: "registration_number",
                header: "Registration No",
                size: 150,
            },
            {
                accessorKey: "vehicle_class",
                header: "Vehicle Class",
                size: 120,
            },
            {
                accessorKey: "model",
                header: "Model",
                size: 120,
            },
            {
                accessorFn: (row) =>
                    row.registration_date
                        ? new Date(
                              row.registration_date
                          ).toLocaleDateString("en-GB")
                        : "-",
                id: "registration_date",
                header: "Registration Date",
                size: 140,
            },
            {
                accessorFn: (row) =>
                    row.expiry_date
                        ? new Date(
                              row.expiry_date
                          ).toLocaleDateString("en-GB")
                        : "-",
                id: "expiry_date",
                header: "Expiry Date",
                size: 140,
            },
        ],
        []
    );

    const clearExpiryFilter = () => {
        setExpiryFrom("");
        setExpiryTo("");
    };

    const table = useMaterialReactTable({
        columns,
        data: filteredData,

        enableRowSelection: true,
        enableMultiRowSelection: true,
        enableSelectAll: true,
        selectAllMode: "all",

        getRowId: (row) => row.customer_id.toString(),

        onRowSelectionChange: setSelectedRows,

        state: {
            rowSelection: selectedRows,
        },

        initialState: {
            density: "compact",
            pagination: {
                pageSize: 10,
            },
        },

        enableDensityToggle: false,
        enableFullScreenToggle: false,
        enableColumnActions: false,

        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: 2,
                border: isDark
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid #e5e7eb",
                bgcolor: isDark ? "#0f172a" : "#fff",
            },
        },

        muiTableContainerProps: {
            sx: {
                maxHeight: 550,
                bgcolor: isDark ? "#0f172a" : undefined,
                fontFamily: "Bahnschrift",
            },
        },

        muiTableHeadCellProps: {
            sx: {
                fontWeight: 700,
                fontSize: "13px",
                py: 0.8,
                px: 1,
                backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                color: isDark ? "#f8fafc" : "#374151",
                borderBottom: isDark
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid #e5e7eb",
                fontFamily: "Bahnschrift",
            },
        },

        muiTableBodyCellProps: {
            sx: {
                fontSize: "13px",
                py: 0.6,
                px: 1,
                whiteSpace: "nowrap",
                color: isDark ? "#cbd5e1" : undefined,
                borderBottom: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : undefined,
                fontFamily: "Bahnschrift",
            },
        },

        muiTableBodyRowProps: {
            hover: true,
            sx: {
                height: 40,
                backgroundColor: isDark ? "#0f172a" : undefined,
                "&:hover": {
                    backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                },
                fontFamily: "Bahnschrift",
            },
        },

        muiSelectCheckboxProps: {
            size: "small",
        },

        muiPaginationProps: {
            rowsPerPageOptions: [10, 20, 50, 100],
            showFirstButton: true,
            showLastButton: true,
            sx: {
                color: isDark ? "#f8fafc" : undefined,
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiIconButton-root":
                    {
                        color: isDark ? "#f8fafc" : undefined,
                    },
                fontFamily: "Bahnschrift",
            },
        },
    });

    return (
        <Box>
            {/* Expiry Date Filter */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    border: `1px solid ${
                        isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb"
                    }`,
                    bgcolor: isDark ? "#0f172a" : "#fff",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <FilterAltOutlinedIcon
                        fontSize="small"
                        sx={{ color: theme.palette.primary.main }}
                    />

                    <Box>
                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: isDark ? "#f8fafc" : "#1f2937",
                                fontFamily: "Bahnschrift",
                            }}
                        >
                            Expiry Date Range
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 11,
                                color: isDark ? "#94a3b8" : "#6b7280",
                                fontFamily: "Bahnschrift",
                            }}
                        >
                            {filteredData.length} of {data.length} customers
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                    }}
                >
                    <TextField
                        label="From"
                        type="date"
                        size="small"
                        value={expiryFrom}
                        onChange={(e) => setExpiryFrom(e.target.value)}
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: {
                                max: expiryTo || undefined,
                            },
                        }}
                        sx={{
                            width: 160,
                            "& .MuiInputBase-root": {
                                fontSize: 12,
                                fontFamily: "Bahnschrift",
                            },
                            "& .MuiInputLabel-root": {
                                fontFamily: "Bahnschrift",
                            },
                        }}
                    />

                    <TextField
                        label="To"
                        type="date"
                        size="small"
                        value={expiryTo}
                        onChange={(e) => setExpiryTo(e.target.value)}
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: {
                                min: expiryFrom || undefined,
                            },
                        }}
                        sx={{
                            width: 160,
                            "& .MuiInputBase-root": {
                                fontSize: 12,
                                fontFamily: "Bahnschrift",
                            },
                            "& .MuiInputLabel-root": {
                                fontFamily: "Bahnschrift",
                            },
                        }}
                    />

                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<RestartAltOutlinedIcon />}
                        onClick={clearExpiryFilter}
                        disabled={!expiryFrom && !expiryTo}
                        sx={{
                            textTransform: "none",
                            fontFamily: "Bahnschrift",
                            minHeight: 40,
                        }}
                    >
                        Reset
                    </Button>
                </Box>
            </Box>

            <MaterialReactTable table={table} />
        </Box>
    );
};

export default CustomerAllocationTable;
