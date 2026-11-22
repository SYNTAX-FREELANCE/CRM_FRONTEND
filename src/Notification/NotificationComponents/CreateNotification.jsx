
import React from "react";

import {
    Box,
    Stack,
    Typography,
    Card,
    CardContent,
    Divider,
    TextField,
    MenuItem,
    Autocomplete,
    Chip,
    Button,
    CircularProgress,
} from "@mui/material";

import {
    Campaign,
    Send,
} from "@mui/icons-material";

import RecipientSummary from "./RecipientSummary";

const CreateNotification = ({
    formData,
    setFormData,
    handleFormChange,
    activeEmployees,
    activeRoles,
    selectedEmployees,
    setSelectedEmployees,
    sending,
    handleSendNotification,
    colors,
}) => {

    return (
        <Card sx={colors.cardSx}>

            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    mb={2.5}
                >

                    <Box
                        sx={{
                            width: 34,
                            height: 34,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: "9px",
                            bgcolor: colors.orangeBg,
                            color: colors.secondary,
                        }}
                    >
                        <Campaign fontSize="small" />
                    </Box>

                    <Box>

                        <Typography
                            fontSize={15}
                            fontWeight={800}
                            color={colors.text}
                        >
                            Create New Notification
                        </Typography>

                        <Typography
                            fontSize={11}
                            color={colors.muted}
                        >
                            Compose your message and choose recipients
                        </Typography>

                    </Box>

                </Stack>

                <Divider sx={{ borderColor: colors.border, mb: 2.5 }} />

                <Stack spacing={2}>

                    <TextField
                        fullWidth
                        size="small"
                        label="Notification Title"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        placeholder="Enter notification title"
                        inputProps={{ maxLength: 255 }}
                        sx={colors.inputSx}
                    />

                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        size="small"
                        label="Notification Message"
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        placeholder="Write your notification message..."
                        sx={colors.inputSx}
                    />

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                            },
                            gap: 2,
                        }}
                    >

                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Notification Type"
                            name="notification_type"
                            value={formData.notification_type}
                            onChange={handleFormChange}
                            sx={colors.inputSx}
                        >

                            <MenuItem value="GENERAL">General</MenuItem>
                            <MenuItem value="ANNOUNCEMENT">Announcement</MenuItem>
                            <MenuItem value="SYSTEM">System</MenuItem>

                        </TextField>

                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Send To"
                            name="audience_type"
                            value={formData.audience_type}
                            onChange={handleFormChange}
                            sx={colors.inputSx}
                        >

                            <MenuItem value="ALL">
                                All Active Employees
                            </MenuItem>

                            <MenuItem value="ROLE">
                                Specific Role
                            </MenuItem>

                            <MenuItem value="SELECTED">
                                Selected Employees
                            </MenuItem>

                        </TextField>

                    </Box>

                    {formData.audience_type === "ROLE" && (

                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Select Role"
                            name="audience_role"
                            value={formData.audience_role}
                            onChange={handleFormChange}
                            sx={colors.inputSx}
                        >

                            {activeRoles.map((role) => (

                                <MenuItem
                                    key={role.role_id}
                                    value={role.role_name}
                                >
                                    {role.role_name}
                                </MenuItem>

                            ))}

                        </TextField>

                    )}

                    {formData.audience_type === "SELECTED" && (

                        <Autocomplete
                            multiple
                            options={activeEmployees}
                            value={selectedEmployees}
                            onChange={(event, newValue) =>
                                setSelectedEmployees(newValue)
                            }
                            getOptionLabel={(option) =>
                                `${option.name} (${option.employee_id})`
                            }
                            isOptionEqualToValue={(option, value) =>
                                Number(option.user_id) === Number(value.user_id)
                            }
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "9px",
                                    bgcolor: colors.inputBg,
                                },

                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: colors.border,
                                },

                                "& .MuiAutocomplete-tag": {
                                    bgcolor: colors.greenBg,
                                    color: colors.primary,
                                },
                            }}
                            renderInput={(params) => (

                                <TextField
                                    {...params}
                                    size="small"
                                    label="Select Active Employees"
                                    placeholder="Search employee"
                                    sx={colors.inputSx}
                                />

                            )}
                            renderOption={(props, option) => (

                                <li {...props} key={option.user_id}>

                                    <Box>

                                        <Typography
                                            fontSize={13}
                                            fontWeight={700}
                                        >
                                            {option.name}
                                        </Typography>

                                        <Typography
                                            fontSize={11}
                                            color="text.secondary"
                                        >
                                            {option.employee_id} • {option.role_name}
                                        </Typography>

                                    </Box>

                                </li>

                            )}
                            renderTags={(value, getTagProps) =>

                                value.map((option, index) => (

                                    <Chip
                                        {...getTagProps({ index })}
                                        key={option.user_id}
                                        size="small"
                                        label={option.name}
                                    />

                                ))

                            }
                        />

                    )}

                    <TextField
                        fullWidth
                        size="small"
                        type="datetime-local"
                        label="Expiry Date (Optional)"
                        name="expires_at"
                        value={formData.expires_at}
                        onChange={handleFormChange}
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                        sx={colors.inputSx}
                    />

                    <RecipientSummary
                        formData={formData}
                        activeEmployees={activeEmployees}
                        selectedEmployees={selectedEmployees}
                        colors={colors}
                    />

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                    >

                        <Button
                            variant="contained"
                            onClick={handleSendNotification}
                            disabled={sending}
                            startIcon={
                                sending
                                    ? <CircularProgress size={16} color="inherit" />
                                    : <Send />
                            }
                            sx={{
                                textTransform: "none",
                                borderRadius: "9px",
                                px: 3,
                                py: 1,
                                fontWeight: 800,
                                bgcolor: colors.primary,

                                "&:hover": {
                                    bgcolor: colors.isDark
                                        ? "#56b77a"
                                        : "#176b3b",
                                },
                            }}
                        >
                            {sending ? "Sending..." : "Send Notification"}
                        </Button>

                    </Stack>

                </Stack>

            </CardContent>

        </Card>
    );
};

export default CreateNotification;
