import React, { memo, useState } from "react";

import {
    Box,
    Stack,
    Typography,
    Button,
    Drawer,
    IconButton,
    TextField,
    Divider,
    Paper,
} from "@mui/material";


import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { axioslogin } from "../../Connection/axios";
import { errorNotify, successNotify } from "../../constant/Constant";
import GlobalLoader from "../../CommonComponents/GlobalLoader";


const PolicyDetails = ({ policyData, open, setOpen }) => {
    // Claim drawer

    // CLAIM INITIAL STATE
    // =========================================

    const initialClaimForm = {
        accident_date: "",
        accident_time: "",
        accident_place: "",
        accident_description: "",

        driver_name: "",
        driver_address: "",
        driver_age: "",
        driver_relationship: "",
        driving_license_no: "",

        inspection_location: "",
        estimated_repair_cost: "",

        other_insurance_policy_no: "",

        remarks: "",
    };


    // =========================================
    // CLAIM FORM
    // =========================================

    const [claimForm, setClaimForm] = useState(initialClaimForm);
    const [loading, setLoading] = useState(false);

    const [claimErrors, setClaimErrors] = useState({});


    // =========================================
    // OPEN CLAIM DRAWER
    // =========================================

    const handlerest = () => {
        setClaimForm(initialClaimForm);
        setClaimErrors({});
        setOpen(false);
    };


    // =========================================
    // CLOSE CLAIM DRAWER
    // =========================================

    const handleCloseClaim = () => {
        setOpen(false);
        setClaimErrors({});
    };


    // =========================================
    // FORM CHANGE
    // =========================================

    const handleClaimChange = (field) => (event) => {

        const value = event.target.value;

        setClaimForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Remove error once user starts correcting field
        setClaimErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };


    // =========================================
    // VALIDATE CLAIM FORM
    // =========================================

    const validateClaimForm = () => {

        const errors = {};

        // POLICY

        if (!policyData?.policy_id) {
            errors.policy_id = "Policy is required";
        }

        // ACCIDENT DATE

        if (!claimForm.accident_date?.trim()) {

            errors.accident_date =
                "Accident date is required";

        }


        // ACCIDENT TIME

        if (!claimForm.accident_time?.trim()) {

            errors.accident_time =
                "Accident time is required";

        }


        // ACCIDENT PLACE

        if (!claimForm.accident_place?.trim()) {

            errors.accident_place =
                "Accident place is required";

        } else if (
            claimForm.accident_place.trim().length > 255
        ) {

            errors.accident_place =
                "Accident place cannot exceed 255 characters";

        }


        // ACCIDENT DESCRIPTION

        if (!claimForm.accident_description?.trim()) {

            errors.accident_description =
                "Accident description is required";

        }


        // DRIVER NAME

        if (!claimForm.driver_name?.trim()) {

            errors.driver_name =
                "Driver name is required";

        } else if (
            claimForm.driver_name.trim().length > 150
        ) {

            errors.driver_name =
                "Driver name cannot exceed 150 characters";

        }


        // DRIVER ADDRESS

        if (!claimForm.driver_address?.trim()) {

            errors.driver_address =
                "Driver address is required";

        }


        // DRIVER AGE

        if (claimForm.driver_age !== "") {

            const age = Number(claimForm.driver_age);

            if (!Number.isInteger(age)) {

                errors.driver_age =
                    "Driver age must be a whole number";

            } else if (age < 18 || age > 100) {

                errors.driver_age =
                    "Driver age must be between 18 and 100";

            }
        }


        // DRIVING LICENCE

        if (!claimForm.driving_license_no?.trim()) {

            errors.driving_license_no =
                "Driving licence number is required";

        } else if (
            claimForm.driving_license_no.trim().length > 100
        ) {

            errors.driving_license_no =
                "Driving licence number cannot exceed 100 characters";

        }


        // INSPECTION LOCATION

        if (!claimForm.inspection_location?.trim()) {

            errors.inspection_location =
                "Inspection location is required";

        }


        // ESTIMATED REPAIR COST

        if (
            claimForm.estimated_repair_cost === ""
        ) {

            errors.estimated_repair_cost =
                "Estimated repair cost is required";

        } else {

            const amount = Number(
                claimForm.estimated_repair_cost
            );

            if (!Number.isFinite(amount)) {

                errors.estimated_repair_cost =
                    "Enter a valid repair cost";

            } else if (amount < 0) {

                errors.estimated_repair_cost =
                    "Repair cost cannot be negative";

            }
        }


        // OTHER INSURANCE POLICY
        // Optional

        if (
            claimForm.other_insurance_policy_no &&
            claimForm.other_insurance_policy_no.trim().length > 100
        ) {

            errors.other_insurance_policy_no =
                "Policy number cannot exceed 100 characters";

        }


        // RETURN

        setClaimErrors(errors);

        return Object.keys(errors).length === 0;
    };


    // =========================================
    // CLEAN CLAIM DATA
    // =========================================

    const cleanClaimData = (data) => {

        const cleaned = {};

        Object.entries(data).forEach(
            ([key, value]) => {

                // String
                if (typeof value === "string") {

                    const trimmedValue =
                        value.trim();

                    cleaned[key] =
                        trimmedValue === ""
                            ? null
                            : trimmedValue;

                    return;
                }

                // Everything else
                cleaned[key] = value;
            }
        );

        return cleaned;
    };


    // =========================================
    // SAVE CLAIM
    // =========================================

    const handleSaveClaim = async () => {

        try {

            setLoading(true);

            // First validate
            const isValid =
                validateClaimForm();

            if (!isValid) {
                return;
            }


            // CREATE RAW PAYLOAD

            const rawPayload = {

                policy_id:
                    Number(policyData.policy_id),

                accident_date:
                    claimForm.accident_date,

                accident_time:
                    claimForm.accident_time,

                accident_place:
                    claimForm.accident_place,

                accident_description:
                    claimForm.accident_description,

                driver_name:
                    claimForm.driver_name,

                driver_address:
                    claimForm.driver_address,

                driver_age:
                    claimForm.driver_age === ""
                        ? null
                        : Number(claimForm.driver_age),

                driver_relationship:
                    claimForm.driver_relationship,

                driving_license_no:
                    claimForm.driving_license_no,

                inspection_location:
                    claimForm.inspection_location,

                estimated_repair_cost:
                    claimForm.estimated_repair_cost === ""
                        ? null
                        : Number(
                            claimForm.estimated_repair_cost
                        ),

                other_insurance_policy_no:
                    claimForm.other_insurance_policy_no,

                remarks:
                    claimForm.remarks,
            };


            // REMOVE EMPTY VALUES
            const payload = cleanClaimData(rawPayload);

            // FINAL PAYLOAD
            const response = await axioslogin.post(`/policyclaim/create`, payload);
            const { success, message } = response?.data ?? {};
            if (success !== 1) return errorNotify(message);
            successNotify(message)
            handlerest()
        } catch (error) {
            errorNotify("Error in Claming Process")
        } finally {
            setLoading(false)
        }
        // API CALL HERE
    };


    return (
        <>
            {
                loading && <GlobalLoader text={"Claming Please Wait"} />
            }
            <Drawer
                anchor="right"
                open={open}
                onClose={handleCloseClaim}
                PaperProps={{
                    sx: {
                        width: {
                            xs: "100%",
                            sm: 560,
                            md: 650,
                        },

                        maxWidth: "100%",

                        display: "flex",
                        flexDirection: "column",
                    },
                }}
            >

                {/* =================================================
                    DRAWER HEADER
                ================================================= */}

                <Box
                    sx={{
                        px: 2.5,
                        py: 1.8,

                        borderBottom:
                            "1px solid #e5e7eb",

                        background:
                            "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                    }}
                >

                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >

                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.2}
                        >

                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,

                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    background:
                                        "linear-gradient(135deg, #fceedc, #fceedc)",
                                }}
                            >

                                <AssignmentTurnedInRoundedIcon
                                    sx={{
                                        color: "#ea5c10",
                                        fontSize: 24,
                                    }}
                                />

                            </Box>


                            <Box>

                                <Typography
                                    sx={{
                                        fontSize: 18,
                                        fontWeight: 800,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    Create Claim
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color: "#64748b",
                                        mt: 0.3,
                                    }}
                                >
                                    Create a new claim for this policy
                                </Typography>

                            </Box>

                        </Stack>


                        <IconButton
                            size="small"
                            onClick={handleCloseClaim}
                            sx={{
                                border:
                                    "1px solid #e2e8f0",

                                borderRadius: 2,

                                "&:hover": {
                                    background: "#f1f5f9",
                                },
                            }}
                        >
                            <CloseRoundedIcon
                                fontSize="small"
                            />
                        </IconButton>

                    </Stack>

                </Box>


                {/* =================================================
                    DRAWER CONTENT
                ================================================= */}

                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        p: {
                            xs: 2,
                            sm: 2.5,
                        },

                        background: "#f8fafc",
                    }}
                >


                    {/* =============================================
                        POLICY INFORMATION
                    ============================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,

                            borderRadius: 2,

                            border:
                                "1px solid #e2e8f0",

                            background: "#ffffff",

                            mb: 2,
                        }}
                    >

                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 800,
                                mb: 1.5,
                            }}
                        >
                            Policy Information
                        </Typography>


                        <Stack spacing={1.2}>

                            <PolicyRow
                                label="Policy No"
                                value={
                                    policyData?.policy_number
                                }
                            />

                            <PolicyRow
                                label="Customer"
                                value={
                                    policyData?.customer_name
                                }
                            />

                            <PolicyRow
                                label="Vehicle"
                                value={
                                    policyData?.registration_number
                                }
                            />

                            <PolicyRow
                                label="Insurance Company"
                                value={
                                    policyData?.company_name
                                }
                            />

                            <PolicyRow
                                label="Policy Period"
                                value={
                                    policyData?.start_date &&
                                        policyData?.expiry_date
                                        ? `${policyData.start_date} - ${policyData.expiry_date}`
                                        : "-"
                                }
                            />

                        </Stack>

                    </Paper>


                    {/* =============================================
                        ACCIDENT DETAILS
                    ============================================= */}

                    <SectionTitle>
                        Accident Details
                    </SectionTitle>


                    <Box
                        sx={{
                            display: "grid",

                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                            },

                            gap: 2,
                            mb: 2,
                        }}
                    >

                        <TextField
                            fullWidth
                            size="small"
                            label="Accident Date"
                            type="date"
                            value={
                                claimForm.accident_date
                            }
                            onChange={handleClaimChange(
                                "accident_date"
                            )}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={Boolean(claimErrors.accident_date)}
                            helperText={claimErrors.accident_date}

                        />


                        <TextField
                            fullWidth
                            size="small"
                            label="Accident Time"
                            type="time"
                            value={
                                claimForm.accident_time
                            }
                            onChange={handleClaimChange(
                                "accident_time"
                            )}
                            error={Boolean(claimErrors.accident_time)}
                            helperText={claimErrors.accident_time}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                    </Box>


                    <TextField
                        fullWidth
                        size="small"
                        label="Accident Place"
                        value={
                            claimForm.accident_place
                        }
                        onChange={handleClaimChange(
                            "accident_place"
                        )}
                        error={Boolean(claimErrors.accident_place)}
                        helperText={claimErrors.accident_place}
                        sx={{ mb: 2 }}
                    />


                    <TextField
                        fullWidth
                        size="small"
                        multiline
                        minRows={3}
                        label="Brief Particulars of Accident"
                        value={
                            claimForm.accident_description
                        }
                        onChange={handleClaimChange(
                            "accident_description"
                        )}
                        error={Boolean(claimErrors.accident_description)}
                        helperText={claimErrors.accident_description}
                        sx={{ mb: 2 }}
                    />


                    {/* =============================================
                        DRIVER DETAILS
                    ============================================= */}

                    <SectionTitle>
                        Driver Details
                    </SectionTitle>


                    <TextField
                        fullWidth
                        size="small"
                        label="Driver Name"
                        value={
                            claimForm.driver_name
                        }
                        onChange={handleClaimChange(
                            "driver_name"
                        )}
                        error={Boolean(claimErrors.driver_name)}
                        helperText={claimErrors.driver_name}
                        sx={{ mb: 2 }}
                    />


                    <TextField
                        fullWidth
                        size="small"
                        multiline
                        minRows={2}
                        label="Driver Address"
                        value={
                            claimForm.driver_address
                        }
                        onChange={handleClaimChange(
                            "driver_address"
                        )}
                        error={Boolean(claimErrors.driver_address)}
                        helperText={claimErrors.driver_address}
                        sx={{ mb: 2 }}
                    />


                    <Box
                        sx={{
                            display: "grid",

                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                            },

                            gap: 2,
                            mb: 2,
                        }}
                    >

                        <TextField
                            fullWidth
                            size="small"
                            label="Driver Age"
                            type="number"
                            value={
                                claimForm.driver_age
                            }
                            onChange={handleClaimChange(
                                "driver_age"
                            )}

                        />


                        <TextField
                            fullWidth
                            size="small"
                            label="Relationship with Owner"
                            value={
                                claimForm.driver_relationship
                            }
                            onChange={handleClaimChange(
                                "driver_relationship"
                            )}

                        />

                    </Box>


                    <TextField
                        fullWidth
                        size="small"
                        label="Driving Licence No."
                        value={
                            claimForm.driving_license_no
                        }
                        onChange={handleClaimChange(
                            "driving_license_no"
                        )}
                        error={Boolean(claimErrors.driving_license_no)}
                        helperText={claimErrors.driving_license_no}
                        sx={{ mb: 2 }}
                    />


                    {/* =============================================
                        VEHICLE INSPECTION
                    ============================================= */}

                    <SectionTitle>
                        Vehicle Inspection
                    </SectionTitle>


                    <TextField
                        fullWidth
                        size="small"
                        multiline
                        minRows={2}
                        label="When & Where Damaged Vehicle Can Be Inspected"
                        value={
                            claimForm.inspection_location
                        }
                        onChange={handleClaimChange(
                            "inspection_location"
                        )}
                        sx={{ mb: 2 }}
                    />


                    <TextField
                        fullWidth
                        size="small"
                        label="Approximate Estimated Cost of Repairs"
                        type="number"
                        value={
                            claimForm.estimated_repair_cost
                        }
                        onChange={handleClaimChange(
                            "estimated_repair_cost"
                        )}
                        error={Boolean(claimErrors.estimated_repair_cost)}
                        helperText={claimErrors.estimated_repair_cost}
                        InputProps={{
                            startAdornment: (
                                <Typography
                                    sx={{
                                        mr: 0.8,
                                        color: "#64748b",
                                        fontSize: 14,
                                    }}
                                >
                                    ₹
                                </Typography>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />


                    {/* =============================================
                        OTHER INSURANCE
                    ============================================= */}

                    <SectionTitle>
                        Other Insurance Details
                    </SectionTitle>


                    <TextField
                        fullWidth
                        size="small"
                        label="Policy No. Under Other Insurance Policy"
                        value={
                            claimForm.other_insurance_policy_no
                        }
                        onChange={handleClaimChange(
                            "other_insurance_policy_no"
                        )}
                        sx={{ mb: 2 }}
                    />


                    {/* =============================================
                        REMARKS
                    ============================================= */}

                    <SectionTitle>
                        Remarks
                    </SectionTitle>


                    <TextField
                        fullWidth
                        size="small"
                        multiline
                        minRows={3}
                        label="Remarks"
                        value={
                            claimForm.remarks
                        }
                        onChange={handleClaimChange(
                            "remarks"
                        )}
                        sx={{ mb: 2 }}
                    />

                </Box>


                {/* =================================================
                    DRAWER FOOTER
                ================================================= */}

                <Box
                    sx={{
                        px: 2.5,
                        py: 1.5,

                        borderTop:
                            "1px solid #e2e8f0",

                        background: "#ffffff",
                    }}
                >

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                    >

                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleCloseClaim}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                            }}
                        >
                            Cancel
                        </Button>


                        <Button
                            variant="contained"
                            size="small"
                            startIcon={
                                <AssignmentTurnedInRoundedIcon />
                            }
                            onClick={handleSaveClaim}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                fontWeight: 700,

                                background:
                                    "linear-gradient(135deg, #a37616 0%, #dfa513 100%)",

                                "&:hover": {
                                    background:
                                        "linear-gradient(135deg, #bd6e15 0%, #d88827 100%)",
                                },
                            }}
                        >
                            Save Claim
                        </Button>

                    </Stack>

                </Box>

            </Drawer>

        </>
    );
};


/* =============================================================
   POLICY ROW
============================================================= */

const PolicyRow = ({ label, value }) => {

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
        >

            <Typography
                sx={{
                    fontSize: { xs: 10, sm: 12 },
                    color: "#64748b",
                }}
            >
                {label}
            </Typography>


            <Typography
                sx={{
                    fontSize: { xs: 11, sm: 13 },
                    fontWeight: 700,
                    textAlign: "right",
                }}
            >
                {value || "-"}
            </Typography>

        </Stack>
    );
};


/* =============================================================
   SECTION TITLE
============================================================= */

const SectionTitle = ({ children }) => {

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
                mb: 1.5,
                mt: 1,
            }}
        >

            <Box
                sx={{
                    width: 4,
                    height: 18,
                    borderRadius: 1,
                    background: "#a35816",
                }}
            />

            <Typography
                sx={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#1e293b",
                }}
            >
                {children}
            </Typography>

        </Stack>
    );
};


export default memo(PolicyDetails);