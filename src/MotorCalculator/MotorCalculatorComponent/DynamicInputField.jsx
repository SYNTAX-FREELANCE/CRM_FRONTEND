import React from "react";
import {
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    useTheme,
} from "@mui/material";

const DynamicInputField = ({
    field,
    value,
    onChange,
    getFieldOptions,
    getOptionId,
    getOptionName,
    selectSx,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const fieldCode = field.field_code;

    const fieldType =
        String(field.field_type).toUpperCase();

    const options = getFieldOptions(fieldCode);

    const isSelect = fieldType === "SELECT";
    const isCheckbox = fieldType === "CHECKBOX";

    if (isCheckbox) {
        return (
            <FormControlLabel
                sx={{
                    height: 40,
                    ml: 0,

                    "& .MuiFormControlLabel-label": {
                        fontSize: "13px",
                        color: isDark ? "#f1f5f9" : "#334155",
                    },
                }}
                control={
                    <Checkbox
                        size="small"
                        checked={value === "Y"}
                        onChange={(event) =>
                            onChange({
                                target: {
                                    name: fieldCode,
                                    value: event.target.checked
                                        ? "Y"
                                        : "N",
                                },
                            })
                        }
                        sx={{
                            color: isDark ? "#64748b" : "#94a3b8",

                            "&.Mui-checked": {
                                color: "#3b82f6",
                            },
                        }}
                    />
                }
                label={field.field_label}
            />
        );
    }

    return (
        <TextField
            fullWidth
            size="small"
            select={isSelect}
            type={
                fieldType === "DATE"
                    ? "date"
                    : fieldType === "NUMBER" ||
                        fieldType === "DECIMAL"
                        ? "number"
                        : "text"
            }
            label={field.field_label}
            name={fieldCode}
            value={value}
            onChange={onChange}
            required={Number(field.is_required) === 1}
            placeholder={field.placeholder || ""}
            sx={{
                "& .MuiOutlinedInput-root": {
                    height: 40,
                    borderRadius: "8px",

                    backgroundColor: isDark
                        ? "#273449"
                        : "#fff",

                    "& fieldset": {
                        borderColor: isDark
                            ? "#475569"
                            : "#dbe2ea",
                    },

                    "&:hover fieldset": {
                        borderColor: isDark
                            ? "#64748b"
                            : "#94a3b8",
                    },

                    "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "1px",
                    },
                },

                "& .MuiInputBase-input": {
                    fontSize: "13px",
                    color: isDark
                        ? "#f1f5f9"
                        : "#334155",

                    "&::placeholder": {
                        color: isDark
                            ? "#64748b"
                            : "#94a3b8",
                        opacity: 1,
                    },
                },

                "& .MuiInputLabel-root": {
                    fontSize: "12px",
                    color: isDark
                        ? "#94a3b8"
                        : "#64748b",
                },

                "& .MuiInputLabel-root.Mui-focused": {
                    color: "#3b82f6",
                },

                "& .MuiSelect-icon": {
                    color: isDark
                        ? "#94a3b8"
                        : "#64748b",
                },

                ...selectSx,
            }}
            InputLabelProps={
                fieldType === "DATE"
                    ? { shrink: true }
                    : undefined
            }
            inputProps={
                fieldType === "NUMBER" ||
                    fieldType === "DECIMAL"
                    ? {
                        min: field.min_value,
                        max: field.max_value,
                        step:
                            fieldType === "DECIMAL"
                                ? "0.01"
                                : "1",
                    }
                    : undefined
            }
        >
            {isSelect && [
                <MenuItem
                    sx={{
                        fontFamily: "Bahnschrift",
                        backgroundColor: isDark
                            ? "#273449"
                            : "#fff",
                        color: isDark
                            ? "#f1f5f9"
                            : "#334155",

                        "&:hover": {
                            backgroundColor: isDark
                                ? "#334155"
                                : "#f1f5f9",
                        },

                        "&.Mui-selected": {
                            backgroundColor: isDark
                                ? "#334155"
                                : "#e2e8f0",
                        },

                        "&.Mui-selected:hover": {
                            backgroundColor: isDark
                                ? "#3b475c"
                                : "#e2e8f0",
                        },
                    }}
                    key="empty"
                    value=""
                >
                    {field.placeholder ||
                        `Select ${field.field_label}`}
                </MenuItem>,

                ...options.map((item) => (
                    <MenuItem
                        sx={{
                            fontFamily: "Bahnschrift",
                            backgroundColor: isDark
                                ? "#273449"
                                : "#fff",
                            color: isDark
                                ? "#f1f5f9"
                                : "#334155",

                            "&:hover": {
                                backgroundColor: isDark
                                    ? "#334155"
                                    : "#f1f5f9",
                            },

                            "&.Mui-selected": {
                                backgroundColor: isDark
                                    ? "#334155"
                                    : "#e2e8f0",
                            },

                            "&.Mui-selected:hover": {
                                backgroundColor: isDark
                                    ? "#3b475c"
                                    : "#e2e8f0",
                            },
                        }}
                        key={getOptionId(item, fieldCode)}
                        value={getOptionId(item, fieldCode)}
                    >
                        {getOptionName(item, fieldCode)}
                    </MenuItem>
                )),
            ]}
        </TextField>
    );
};

export default DynamicInputField;