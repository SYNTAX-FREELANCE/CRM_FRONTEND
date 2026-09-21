import React from "react";
import { Button, TextField } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";

export const CustomToolbar = ({
    selectedDateType,
    setSelectedDateType,
    selectedMonth,
    setSelectedMonth,
    setSearchText,
    searchText
}) => {
    const dateOptions = [
        {
            value: "sale_date",
            label: "Sale Date",
        },
        {
            value: "known_policy_expiry_date",
            label: "Expiry Date",
        },
        {
            value: "registration_date",
            label: "Registration Date",
        },
        {
            value: "next_followup_date",
            label: "Reminder Date",
        },
    ];

    return (
        <GridToolbarContainer
            sx={{
                minHeight: "48px",
                px: 1,
                py: 0.5,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 1,
                borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
            }}
        >

            <TextField
                size="small"
                placeholder="Search registration / customer"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{ width: 230, "& .MuiInputBase-root": { height: 36, fontSize: 12, }, "& .MuiOutlinedInput-input": { py: 0.5, }, "& .MuiInputBase-input::placeholder": { fontSize: 12, opacity: 0.7, }, }}
            />
            {/* DATE TYPE */}
            <TextField
                select
                size="small"
                // label="Date Type"
                value={selectedDateType}
                onChange={(e) => setSelectedDateType(e.target.value)}
                SelectProps={{
                    native: true,
                }}
                sx={{
                    width: 170,

                    "& .MuiInputBase-root": {
                        height: 36,
                        fontSize: 12,
                    },

                    "& .MuiInputLabel-root": {
                        fontSize: 12,
                    },
                }}
            >
                <option value="">Select Date</option>

                {dateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </TextField>

            {/* MONTH */}
            <TextField
                type="month"
                size="small"
                label="Month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                sx={{
                    width: 170,

                    "& .MuiInputBase-root": {
                        height: 36,
                        fontSize: 12,
                    },

                    "& .MuiInputLabel-root": {
                        fontSize: 12,
                    },

                    "& .MuiOutlinedInput-input": {
                        py: 0.5,
                    },
                }}
            />
        </GridToolbarContainer>
    );
};



export const CaptureListToolbar = ({
    selectedMonth,
    setSelectedMonth,
    onExportExcel
}) => {
    return (
        <GridToolbarContainer
            sx={{
                minHeight: "48px",
                px: 1,
                py: 0.5,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 1,
                borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
            }}
        >
            <TextField
                type="month"
                size="small"
                label="Sale Month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                sx={{
                    width: 170,
                    "& .MuiInputBase-root": {
                        height: 36,
                        fontSize: 12,
                    },
                    "& .MuiInputLabel-root": {
                        fontSize: 12,
                    },
                    "& .MuiOutlinedInput-input": {
                        py: 0.5,
                    },
                }}
            />

            <Button
                variant="contained"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={onExportExcel}
                sx={{
                    height: 36,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 1.5,
                    px: 1.5,
                    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                    boxShadow: "none",
                    "&:hover": {
                        background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                        boxShadow: "none",
                    },
                }}
            >
                Export Excel
            </Button>
        </GridToolbarContainer>
    );
};

