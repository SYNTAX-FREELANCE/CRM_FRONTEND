import React, { useMemo } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";
import { useTheme } from "@mui/material";

const CustomerAllocationTable = ({
    data = [],
    selectedRows,
    setSelectedRows,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

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
                accessorFn: (row) =>
                    new Date(row.registration_date).toLocaleDateString("en-GB"),
                id: "registration_date",
                header: "Registration Date",
                size: 140,
            },
            {
                accessorFn: (row) =>
                    new Date(row.expiry_date).toLocaleDateString("en-GB"),
                id: "expiry_date",
                header: "Expiry Date",
                size: 140,
            },
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data,

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
                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
                bgcolor: isDark ? "#0f172a" : "#fff",
            },
        },

        muiTableContainerProps: {
            sx: {
                maxHeight: 550,
                bgcolor: isDark ? "#0f172a" : undefined,
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
                borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
            },
        },

        muiTableBodyCellProps: {
            sx: {
                fontSize: "13px",
                py: 0.6,
                px: 1,
                whiteSpace: "nowrap",
                color: isDark ? "#cbd5e1" : undefined,
                borderBottom: isDark ? "1px solid rgba(255,255,255,0.08)" : undefined,
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
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiIconButton-root": {
                    color: isDark ? "#f8fafc" : undefined,
                },
            },
        },
    });

    return <MaterialReactTable table={table} />;
};

export default CustomerAllocationTable;