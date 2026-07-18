import React, { useState } from "react";
import {
    Box,
    IconButton,
    Stack,
    Tooltip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CancelIcon from '@mui/icons-material/Cancel';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";

const EditableDateField = ({
    value,
    editable = false,
    onSave,
    minDate,
}) => {
    const [editing, setEditing] = useState(false);
    const [date, setDate] = useState(value ? dayjs(value) : null);

    const handleEdit = () => {
        setDate(value ? dayjs(value) : null);
        setEditing(true);
    };

    const handleSave = () => {
        onSave?.(date ? date.format("YYYY-MM-DD") : null);
        setEditing(false);
    };

    if (!editable) {
        return value ? dayjs(value).format("DD-MM-YYYY") : "-";
    }

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: "flex-end"
        }}>
            {editing ? (
                <>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={date}
                            onChange={setDate}
                            minDate={minDate ? dayjs(minDate) : undefined}
                            format="DD-MM-YYYY"
                            slotProps={{
                                textField: {
                                    size: "small",
                                    sx: {
                                        width: 150,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                        },
                                    },
                                },
                            }}
                        />
                    </LocalizationProvider>

                    <Tooltip title="Cancel">
                        <IconButton
                            color="error"
                            size="small"
                            onClick={() => setEditing(false)}
                        >
                            <CancelIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Save">
                        <IconButton
                            color="success"
                            size="small"
                            onClick={handleSave}
                        >
                            <SaveOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </>
            ) : (
                <>
                    <Box sx={{ fontWeight: 600 }}>
                        {value ? dayjs(value).format("DD-MM-YYYY") : "-"}
                    </Box>

                    <Tooltip title="Edit">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={handleEdit}
                        >
                            <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </>
            )}
        </Box>
    );
};

export default EditableDateField;