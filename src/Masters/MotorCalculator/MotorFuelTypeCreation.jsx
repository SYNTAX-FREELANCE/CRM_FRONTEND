import { Box } from "@mui/joy";
import { memo, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";

import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

import { axioslogin } from "../../Connection/axios";


const MotorFuelTypeCreation = () => {

    const [fuelType, setFuelType] = useState({
        fuelCode: "",
        fuelName: "",
        description: "",
        isActive: "Active"
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};


    // SET FIELD
    const set = (field) => (e) =>
        setFuelType((prev) => ({
            ...prev,
            [field]: e.target.value
        }));


    // GET BY ID
    const getFuelTypeById = async (id) => {

        try {

            const result = await axioslogin.get(
                `/motor/fuel-type/getbyid/${id}`
            );

            const {
                data,
                success,
                message
            } = result?.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setFuelType({
                fuelCode: data.fuel_code || "",
                fuelName: data.fuel_name || "",
                description: data.description || "",
                isActive: data.is_active === 1
                    ? "Active"
                    : "Inactive"
            });

        } catch (error) {

            console.error(error);

            warningNotify(
                "Failed to load fuel type details"
            );
        }
    };


    // LOAD EDIT DATA
    useEffect(() => {

        if (mode === "edit" && id) {
            getFuelTypeById(id);
        }

    }, [id, mode]);


    // VALIDATION
    const validateFuelType = () => {

        if (
            !fuelType.fuelCode ||
            fuelType.fuelCode.trim() === ""
        ) {

            warningNotify(
                "Fuel Code is required."
            );

            return false;
        }


        if (fuelType.fuelCode.trim().length > 50) {

            warningNotify(
                "Fuel Code must not exceed 50 characters."
            );

            return false;
        }


        if (
            !fuelType.fuelName ||
            fuelType.fuelName.trim() === ""
        ) {

            warningNotify(
                "Fuel Name is required."
            );

            return false;
        }


        if (fuelType.fuelName.trim().length < 2) {

            warningNotify(
                "Fuel Name must be at least 2 characters."
            );

            return false;
        }


        if (fuelType.fuelName.trim().length > 100) {

            warningNotify(
                "Fuel Name must not exceed 100 characters."
            );

            return false;
        }


        if (
            fuelType.description &&
            fuelType.description.length > 500
        ) {

            warningNotify(
                "Description must not exceed 500 characters."
            );

            return false;
        }


        return true;
    };


    // RESET
    const handleReset = useCallback(() => {

        setFuelType({
            fuelCode: "",
            fuelName: "",
            description: "",
            isActive: "Active"
        });

        navigate(".", { replace: true, state: null });

    }, [navigate]);


    // SAVE / UPDATE
    const handleSave = async () => {

        if (!validateFuelType()) {
            return;
        }

        setLoading(true);

        try {

            const fuelTypeData = {

                fuel_code:
                    fuelType.fuelCode.trim(),

                fuel_name:
                    fuelType.fuelName.trim(),

                description:
                    fuelType.description?.trim() || null,

                is_active:
                    fuelType.isActive === "Active"
                        ? 1
                        : 0
            };


            let response;


            // UPDATE
            if (mode === "edit") {

                response = await axioslogin.patch(
                    `/motor/fuel-type/update/${id}`,
                    fuelTypeData
                );

            }
            // CREATE
            else {

                response = await axioslogin.post(
                    "/motor/fuel-type/create",
                    fuelTypeData
                );
            }


            const {
                success,
                message
            } = response.data;


            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Fuel Type updated successfully!"
                        : "Fuel Type created successfully!"
                );


                handleReset();


                // AFTER UPDATE GO TO VIEW
                if (mode === "edit") {

                    navigate(
                        "/home/setting/commonview",
                        {
                            state: {

                                title:
                                    "Motor Fuel Type Master",

                                type:
                                    "motorfueltype",

                                idField:
                                    "fuel_type_id",

                                editRoute:
                                    "motorfueltype",

                                navigateback:
                                    "/home/settings",

                                columns: [

                                    {
                                        field:
                                            "fuel_code",

                                        headerName:
                                            "Fuel Code"
                                    },

                                    {
                                        field:
                                            "fuel_name",

                                        headerName:
                                            "Fuel Name"
                                    },

                                    {
                                        field:
                                            "description",

                                        headerName:
                                            "Description"
                                    },

                                    {
                                        field:
                                            "is_active",

                                        headerName:
                                            "Status",

                                        type:
                                            "status"
                                    }

                                ]
                            }
                        }
                    );
                }

            } else {

                warningNotify(
                    message ||
                    (
                        mode === "edit"
                            ? "Failed to update fuel type"
                            : "Failed to create fuel type"
                    )
                );
            }

        } catch (error) {

            console.error(error);

            warningNotify(
                error.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating fuel type"
                        : "Error creating fuel type"
                )
            );

        } finally {

            setLoading(false);
        }
    };


    // CANCEL
    const handleCancel = useCallback(() => {

        handleReset();

    }, [handleReset]);


    // VIEW
    const handleView = () => {

        navigate(
            "/home/setting/commonview",
            {
                state: {

                    title:
                        "Motor Fuel Type Master",

                    type:
                        "motorfueltype",

                    idField:
                        "fuel_type_id",

                    editRoute:
                        "motorfueltype",

                    navigateback:
                        "/home/settings",

                    columns: [

                        {
                            field:
                                "fuel_code",

                            headerName:
                                "Fuel Code"
                        },

                        {
                            field:
                                "fuel_name",

                            headerName:
                                "Fuel Name"
                        },

                        {
                            field:
                                "description",

                            headerName:
                                "Description"
                        },

                        {
                            field:
                                "is_active",

                            headerName:
                                "Status",

                            type:
                                "status"
                        }

                    ]
                }
            }
        );
    };


    // CLOSE
    const handleClose = () => {

        navigate("/home/settings");

    };


    return (

        <Wrapper>

            <Panel title="Motor Fuel Type Creation">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "60%" }}>

                        {/* FUEL CODE */}

                        <FormRow
                            label="Fuel Code"
                            required
                        >

                            <InputLg
                                value={
                                    fuelType.fuelCode
                                }
                                onChange={
                                    set("fuelCode")
                                }
                                placeholder="Enter fuel code"
                            />

                        </FormRow>


                        {/* FUEL NAME */}

                        <FormRow
                            label="Fuel Name"
                            required
                        >

                            <InputLg
                                value={
                                    fuelType.fuelName
                                }
                                onChange={
                                    set("fuelName")
                                }
                                placeholder="Enter fuel name"
                            />

                        </FormRow>


                        {/* DESCRIPTION */}

                        <FormRow
                            label="Description"
                        >

                            <InputLg
                                value={
                                    fuelType.description
                                }
                                onChange={
                                    set("description")
                                }
                                placeholder="Enter description"
                            />

                        </FormRow>


                        {/* STATUS */}

                        <FormRow
                            label="Active Status"
                        >

                            <Checkbox
                                value={
                                    fuelType.isActive
                                }
                                onChange={
                                    set("isActive")
                                }
                            />

                        </FormRow>

                    </Box>

                </Box>


                {/* DIVIDER */}

                <div
                    style={{
                        borderTop:
                            "1px solid #e5e7eb",

                        margin:
                            "20px 0"
                    }}
                />


                {/* BUTTONS */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        paddingTop: "8px"
                    }}
                >

                    <Button
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : "Save"}
                    </Button>


                    <Button
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>


                    <Button
                        onClick={handleView}
                    >
                        View
                    </Button>


                    <Button
                        onClick={handleClose}
                    >
                        Close
                    </Button>

                </div>

            </Panel>

        </Wrapper>
    );
};


export default memo(MotorFuelTypeCreation);