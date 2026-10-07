import React from "react";
import {
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
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

    const fieldCode = field.field_code;

    const fieldType =
        String(field.field_type).toUpperCase();

    const options =
        getFieldOptions(fieldCode);

    const isSelect =
        fieldType === "SELECT";

    const isCheckbox =
        fieldType === "CHECKBOX";

    if (isCheckbox) {
        return (
            <FormControlLabel
                control={
                    <Checkbox
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
                    />
                }
                label={field.field_label}
            />
        );
    }

    return (
        <TextField
            fullWidth
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
            required={
                Number(field.is_required) === 1
            }
            placeholder={
                field.placeholder || ""
            }
            sx={{
                ...selectSx,
                width: 200,
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
                    key="empty"
                    value=""
                >
                    {field.placeholder ||
                        `Select ${field.field_label}`}
                </MenuItem>,

                ...options.map((item) => (
                    <MenuItem
                        key={getOptionId(
                            item,
                            fieldCode
                        )}
                        value={getOptionId(
                            item,
                            fieldCode
                        )}
                    >
                        {getOptionName(
                            item,
                            fieldCode
                        )}
                    </MenuItem>
                )),
            ]}
        </TextField>
    );
};

export default DynamicInputField;