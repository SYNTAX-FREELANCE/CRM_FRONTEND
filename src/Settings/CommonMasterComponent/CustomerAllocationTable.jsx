import React, { useMemo } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";

const CustomerAllocationTable = ({
    data = [],
    selectedRows,
    setSelectedRows,
}) => {

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
                border: "1px solid #e5e7eb",
            },
        },

        muiTableContainerProps: {
            sx: {
                maxHeight: 550,
            },
        },

        muiTableHeadCellProps: {
            sx: {
                fontWeight: 700,
                fontSize: "13px",
                py: 0.8,
                px: 1,
                backgroundColor: "#f8fafc",
                color: "#374151",
                borderBottom: "1px solid #e5e7eb",
            },
        },

        muiTableBodyCellProps: {
            sx: {
                fontSize: "13px",
                py: 0.6,
                px: 1,
                whiteSpace: "nowrap",
            },
        },

        muiTableBodyRowProps: {
            hover: true,
            sx: {
                height: 40,
                "&:hover": {
                    backgroundColor: "#f9fafb",
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
        },
    });

    return <MaterialReactTable table={table} />;
};

export default CustomerAllocationTable;