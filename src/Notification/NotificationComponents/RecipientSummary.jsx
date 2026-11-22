
import React from "react";

import {
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    Groups,
    PeopleAlt,
    Person,
} from "@mui/icons-material";

const RecipientSummary = ({
    formData,
    activeEmployees,
    selectedEmployees,
    colors,
}) => {

    const recipientInfo = {
        ALL: {
            icon: <Groups />,
            label: `${activeEmployees.length} active employees`,
        },

        ROLE: {
            icon: <PeopleAlt />,
            label: formData.audience_role || "Select a role",
        },

        SELECTED: {
            icon: <Person />,
            label: `${selectedEmployees.length} employees selected`,
        },
    };

    const current = recipientInfo[formData.audience_type];

    return (
        <Paper
            elevation={0}
            sx={{
                p: 1.5,
                borderRadius: "9px",
                border: `1px solid ${colors.border}`,
                bgcolor: colors.isDark
                    ? "rgba(112,207,145,0.07)"
                    : "#f4faf5",
            }}
        >

            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
            >

                <Stack
                    sx={{
                        color: colors.primary,
                        "& svg": {
                            fontSize: 19,
                        },
                    }}
                >
                    {current?.icon}
                </Stack>

                <Typography
                    fontSize={12}
                    fontWeight={800}
                    color={colors.text}
                >
                    Recipients:
                </Typography>

                <Typography
                    fontSize={12}
                    color={colors.muted}
                >
                    {current?.label || "-"}
                </Typography>

            </Stack>

        </Paper>
    );
};

export default RecipientSummary;
