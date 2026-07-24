import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/material";

const CommonDataGrid = ({
    columns = [],
    rows = [],
    onEdit = () => { },
    idField = "id",
}) => {

    const actionColumn = {
        field: "action",
        headerName: "Action",
        width: 80,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <EditIcon
                sx={{
                    cursor: "pointer",
                    color: "#e78910",
                    fontSize: 20
                }}
                onClick={() => onEdit(params.row)}
            />
        )
    };

    const formattedColumns = [
        actionColumn,
        ...columns.map((column) => {
            const { type, ...rest } = column;
            return {
                ...rest,
                flex: column.flex || 1,
                ...(column.width && !column.minWidth ? { minWidth: column.width } : {}),
                ...(column.minWidth ? { minWidth: column.minWidth } : {}),
                renderCell:
                    type === "status"
                        ? (params) =>
                            params.value === 1
                                ? "Active"
                                : "Inactive"
                        : type === "date"
                            ? (params) => {
                                if (!params.value) return "-";
                                try {
                                    if (params.value instanceof Date) {
                                        return params.value.toISOString().split("T")[0];
                                    }
                                    if (typeof params.value === "string") {
                                        return params.value.split("T")[0];
                                    }
                                    return String(params.value);
                                } catch (e) {
                                    console.error(e);
                                    return "-";
                                }
                            }
                            : undefined
            };
        })
    ];

    const formattedRows = rows?.map((row, index) => ({
        id: row[idField] ?? index,
        ...row
    }));

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#fff"
            }}
        >
            <DataGrid
                rows={formattedRows}
                columns={formattedColumns}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25, 50]}
                rowHeight={34}
                columnHeaderHeight={36}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                            page: 0
                        }
                    }
                }}
                sx={{
                    border: "1px solid #e5e7eb",
                    fontSize: "13px",

                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#f7f7f7",
                        minHeight: "36px !important",
                        maxHeight: "36px !important"
                    },

                    "& .MuiDataGrid-columnHeader": {
                        padding: "0 8px"
                    },

                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: 600,
                        fontSize: "13px"
                    },

                    "& .MuiDataGrid-cell": {
                        padding: "0 8px",
                        fontSize: "13px"
                    },

                    "& .MuiDataGrid-footerContainer": {
                        minHeight: "40px"
                    }
                }}
            />
        </Box>
    );
};

export default CommonDataGrid;
