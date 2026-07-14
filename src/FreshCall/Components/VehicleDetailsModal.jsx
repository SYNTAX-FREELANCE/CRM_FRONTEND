import React, { memo, useCallback, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    InputAdornment,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BadgeIcon from "@mui/icons-material/Badge";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import { axioslogin } from "../../Axios/axios";
import { getAuthUser, successNotify, warningNotify } from "../../constant/Constant";
import { format } from "date-fns";

const compactInput = {
    "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        fontSize: 13,
        backgroundColor: "rgba(255,255,255,0.95)",
    },
    "& .MuiInputLabel-root": {
        fontSize: 12,
    },
    "& .MuiFormHelperText-root": {
        fontSize: { xs: 8, sm: 12 },
        marginLeft: 0,
        marginTop: 1,
    },
};
const initialVehicleData = {
    registration_number: "",
    vehicle_maker: "",
    model: "",
    engine_number: "",
    chassis_number: "",
    registration_date: "",
    rto: "",
    vehicle_class: "",
    vehicle_category: "",
    fuel_type: "",
    seat_capacity: "",
};

const VehicleDetailsModal = ({ open, onClose, lead }) => {
    const [vehicleData, setVehicleData] = useState(initialVehicleData);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const authUser = getAuthUser();
    const { id } = authUser ?? {}



    const handleChange = (field) => (event) => {
        const value = event.target.value;

        setVehicleData((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    const handleClose = useCallback(() => {
        onClose();
        setErrors({})
    }, [])

    const validate = () => {
        const newErrors = {};

        const regNo = vehicleData?.registration_number?.trim();
        const maker = vehicleData?.vehicle_maker?.trim();
        const model = vehicleData?.model?.trim();
        const engineNo = vehicleData?.engine_number?.trim();
        const chassisNo = vehicleData?.chassis_number?.trim();
        const regDate = vehicleData?.registration_date;
        const rto = vehicleData?.rto?.trim();
        const vehicleClass = vehicleData?.vehicle_class;
        const vehicleCategory = vehicleData?.vehicle_category;
        const fuelType = vehicleData?.fuel_type;
        const seatCapacity = vehicleData?.seat_capacity;

        if (!regNo) newErrors.registration_number = "Registration number is required.";
        else if (regNo.length < 4) newErrors.registration_number = "Enter a valid registration number.";

        if (!maker) newErrors.vehicle_maker = "Vehicle maker is required.";
        else if (maker.length < 2) newErrors.vehicle_maker = "Enter a valid maker name.";

        if (!model) newErrors.model = "Model is required.";
        else if (model.length < 1) newErrors.model = "Enter a valid model.";

        if (!engineNo) newErrors.engine_number = "Engine number is required.";
        else if (engineNo.length < 4) newErrors.engine_number = "Enter a valid engine number.";

        if (!chassisNo) newErrors.chassis_number = "Chassis number is required.";
        else if (chassisNo.length < 4) newErrors.chassis_number = "Enter a valid chassis number.";

        if (!regDate) newErrors.registration_date = "Registration date is required.";

        if (!rto) newErrors.rto = "RTO is required.";

        if (!vehicleClass) newErrors.vehicle_class = "Vehicle class is required.";

        if (!vehicleCategory) newErrors.vehicle_category = "Vehicle category is required.";

        if (!fuelType) newErrors.fuel_type = "Fuel type is required.";

        if (!seatCapacity) newErrors.seat_capacity = "Seat capacity is required.";
        else {
            const n = Number(seatCapacity);
            if (Number.isNaN(n) || n <= 0) {
                newErrors.seat_capacity = "Seat capacity must be greater than 0.";
            } else if (n > 100) {
                newErrors.seat_capacity = "Seat capacity looks too high.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setLoading(true);

        const payload = {
            customer_id: lead?.customer_id,
            registration_number: vehicleData?.registration_number.trim().toUpperCase(),
            rto: vehicleData?.rto.trim() || null,
            registration_date: vehicleData?.registration_date || null,
            model: vehicleData?.model.trim() || null,
            vehicle_maker: vehicleData?.vehicle_maker.trim() || null,
            engine_number: vehicleData.engine_number.trim() || null,
            chassis_number: vehicleData.chassis_number.trim() || null,
            vehicle_class: vehicleData.vehicle_class.trim() || null,
            vehicle_category: vehicleData.vehicle_category.trim() || null,
            fuel_type: vehicleData.fuel_type || null,
            seat_capacity: vehicleData.seat_capacity || null,
            created_by: id
        };

        try {


            const response = await axioslogin.post(
                "/customer/create-vehicle",
                payload
            );

            const { success, message } = response.data;

            if (success === 1) {
                
                successNotify("Vehicle created successfully!");
                handleClose();

            } else {
                warningNotify(message || "Failed to create vehicle");
            }
        } catch (error) {

            console.log({ error });

            warningNotify(
                error?.response?.data?.message || "Error creating vehicle"
            );
        } finally {
            setLoading(false);
        }
    };

    const icons = {
        registration_number: <BadgeIcon fontSize="small" />,
        vehicle_maker: <PrecisionManufacturingIcon fontSize="small" />,
        model: <ModelTrainingIcon fontSize="small" />,
        engine_number: <ConfirmationNumberIcon fontSize="small" />,
        chassis_number: <AccountTreeIcon fontSize="small" />,
        registration_date: <EventIcon fontSize="small" />,
        rto: <LocationOnIcon fontSize="small" />,
        vehicle_class: <CategoryIcon fontSize="small" />,
        vehicle_category: <CategoryIcon fontSize="small" />,
        fuel_type: <LocalGasStationIcon fontSize="small" />,
        seat_capacity: <AirlineSeatReclineNormalIcon fontSize="small" />,
    };

    const fieldProps = (name) => ({
        error: !!errors[name],
        helperText: errors[name] || " ",
    });

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: "hidden",
                    background:
                        "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(250,252,255,0.96) 100%)",
                    backdropFilter: "blur(18px)",
                    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.25)",
                },
            }}
        >
            <DialogTitle
                sx={{
                    p: 0,
                    position: "relative",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #ff8a00 0%, #ffffff 45%, #2563eb 100%)",
                    color: "#0f172a",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #f97316 100%)",
                        pointerEvents: "none",
                    }}
                />

                <Box sx={{ position: "relative", p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: -60,
                                    right: -60,
                                    width: 200,
                                    height: 200,
                                    borderRadius: "50%",
                                    bgcolor: "rgba(255, 255, 255, 0.1)",
                                }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: -80,
                                    left: -40,
                                    width: 150,
                                    height: 150,
                                    borderRadius: "50%",
                                    bgcolor: "rgba(255, 255, 255, 0.08)",
                                }}
                            />
                            <Box
                                sx={{
                                    width: { xs: 36, sm: 56 },
                                    height: { xs: 36, sm: 56 },
                                    borderRadius: "50%",
                                    display: "grid",
                                    placeItems: "center",
                                    bgcolor: "rgba(255,255,255,0.78)",
                                    border: "1px solid rgba(255,255,255,0.9)",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                                    backdropFilter: "blur(10px)",
                                    color: "#2563eb",
                                }}
                            >
                                <DirectionsCarIcon
                                    sx={{
                                        fontSize: { xs: 20, sm: 30 },
                                        color: "#060606",
                                    }}
                                />
                            </Box>

                            <Box>
                                <Box
                                    sx={{
                                        fontSize: { xs: 18, sm: 20 },
                                        fontWeight: 900,
                                        lineHeight: 1.2,
                                        color: "#fff",
                                    }}
                                >
                                    VEHICLE DETAILS
                                </Box>
                                <Box
                                    sx={{
                                        opacity: 0.9,
                                        fontSize: { xs: 10, sm: 13 },
                                        color: "#fff",
                                        fontWeight: 900,
                                    }}
                                >
                                    Add new Vehicle Details.
                                </Box>
                            </Box>
                        </Stack>

                        <IconButton
                            onClick={handleClose}
                            sx={{
                                color: "#1e3a8a",
                                bgcolor: "rgba(255,255,255,0.78)",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
                            }}
                        >
                            <CloseIcon sx={{ fontSize: { xs: 20, sm: 30 } }} />
                        </IconButton>
                    </Stack>
                </Box>
            </DialogTitle>

            <Divider />

            <DialogContent
                sx={{
                    p: 0,
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        p: { xs: 0.5, sm: 3 },
                        minHeight: { xs: "70vh", sm: "40vh" },
                        overflow: "hidden",
                        bgcolor: "transparent",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: -40,
                            left: -30,
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            bgcolor: "rgba(255,138,0,0.08)",
                            filter: "blur(2px)",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 30,
                            right: -20,
                            width: 160,
                            height: 160,
                            borderRadius: "50%",
                            bgcolor: "rgba(37,99,235,0.08)",
                            filter: "blur(2px)",
                        }}
                    />

                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,
                            bgcolor: "transparent",
                            borderRadius: 4,
                            p: { xs: 2, sm: 3 },
                        }}
                    >
                        <Grid container spacing={1}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Registration Number"
                                    value={vehicleData.registration_number}
                                    onChange={handleChange("registration_number")}
                                    sx={compactInput}
                                    {...fieldProps("registration_number")}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {icons.registration_number}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Vehicle Maker"
                                    value={vehicleData.vehicle_maker}
                                    onChange={handleChange("vehicle_maker")}
                                    sx={compactInput}
                                    {...fieldProps("vehicle_maker")}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {icons.vehicle_maker}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Model"
                                    value={vehicleData.model}
                                    onChange={handleChange("model")}
                                    sx={compactInput}
                                    {...fieldProps("model")}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {icons.model}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Engine Number"
                                    value={vehicleData.engine_number}
                                    onChange={handleChange("engine_number")}
                                    sx={compactInput}
                                    {...fieldProps("engine_number")}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {icons.engine_number}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Chassis Number"
                                    value={vehicleData.chassis_number}
                                    onChange={handleChange("chassis_number")}
                                    sx={compactInput}
                                    {...fieldProps("chassis_number")}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {icons.chassis_number}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    label="Registration Date"
                                    InputLabelProps={{ shrink: true }}
                                    value={vehicleData.registration_date}
                                    onChange={handleChange("registration_date")}
                                    sx={compactInput}
                                    {...fieldProps("registration_date")}
                                    inputProps={{
                                        max: format(new Date(), "yyyy-MM-dd"),
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {icons.registration_date}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="RTO"
                                    value={vehicleData.rto}
                                    onChange={handleChange("rto")}
                                    sx={compactInput}
                                    {...fieldProps("rto")}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {icons.rto}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Vehicle Class"
                                    value={vehicleData.vehicle_class}
                                    onChange={handleChange("vehicle_class")}
                                    sx={compactInput}
                                    {...fieldProps("vehicle_class")}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {icons.vehicle_class}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="Vehicle Category"
                                    value={vehicleData.vehicle_category}
                                    onChange={handleChange("vehicle_category")}
                                    sx={compactInput}
                                    {...fieldProps("vehicle_category")}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {icons.vehicle_category}
                                            </InputAdornment>
                                        ),
                                    }}
                                >


                                    <MenuItem value="LMV">LMV</MenuItem>
                                    <MenuItem value="MCWG">MCWG</MenuItem>
                                    <MenuItem value="HMV">HMV</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="Fuel Type"
                                    value={vehicleData.fuel_type}
                                    onChange={handleChange("fuel_type")}
                                    sx={compactInput}
                                    {...fieldProps("fuel_type")}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {icons.fuel_type}
                                            </InputAdornment>
                                        ),
                                    }}
                                >
                                    <MenuItem value="Petrol">Petrol</MenuItem>
                                    <MenuItem value="Diesel">Diesel</MenuItem>
                                    <MenuItem value="Electric">Electric</MenuItem>
                                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                                    <MenuItem value="CNG">CNG</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    label="Seat Capacity"
                                    value={vehicleData.seat_capacity}
                                    onChange={handleChange("seat_capacity")}
                                    sx={compactInput}
                                    {...fieldProps("seat_capacity")}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {icons.seat_capacity}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Box
                    sx={{
                        position: "sticky",
                        bottom: 0,
                        zIndex: 2,
                        px: { xs: 2, sm: 3 },
                        py: 2,
                        bgcolor: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(14px)",
                        borderTop: "1px solid rgba(148,163,184,0.2)",
                    }}
                >
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                px: { xs: 2, sm: 3 },
                                fontSize: { xs: 12, sm: 14 },
                                borderColor: "#2563eb",
                                color: "#2563eb",
                                "&:hover": {
                                    borderColor: "#1d4ed8",
                                    bgcolor: "rgba(37,99,235,0.04)",
                                },
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleSave}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: { xs: 12, sm: 14 },
                                px: { xs: 2, sm: 3 },
                                background: "linear-gradient(135deg, #ff8a00 0%, #2563eb 100%)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #f97316 0%, #1d4ed8 100%)",
                                },
                            }}
                        >
                            Save Vehicle
                        </Button>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default memo(VehicleDetailsModal);