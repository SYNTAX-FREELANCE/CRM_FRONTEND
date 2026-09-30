import { Box } from "@mui/joy";
import { memo, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";

import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

import { axioslogin } from "../../Connection/axios";

import {
    useMotorVehicleCategoryMaster,
    useMotorVehicleClassMaster
} from "../../CommonCode/useQuery";


const MotorVehicleClassCreation = () => {

    const [vehicleClass, setVehicleClass] = useState({
        vehicleCategoryId: "",
        classCode: "",
        className: "",
        description: "",
        isActive: "Active"
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const {
        refetch: FetchMotorVehicleClassMaster
    } = useMotorVehicleClassMaster();

    const {
        data: VehicleCategoryMaster = []
    } = useMotorVehicleCategoryMaster();


    // ACTIVE VEHICLE CATEGORIES
    const ActiveVehicleCategoryMaster =
        Array.isArray(VehicleCategoryMaster)
            ? VehicleCategoryMaster
                .filter(item => item.is_active === 1)
                .map(item => ({
                    id: item.vehicle_category_id,
                    label: item.category_name
                }))
            : [];


    // SET FIELD
    const set = (field) => (e) =>
        setVehicleClass((prev) => ({
            ...prev,
            [field]: e.target.value
        }));


    // GET BY ID
    const getVehicleClassById = async (id) => {

        try {

            const result = await axioslogin.get(
                `/motor/vehicle-class/getbyid/${id}`
            );

            const {
                data,
                success,
                message
            } = result?.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setVehicleClass({
                vehicleCategoryId: data.vehicle_category_id || "",
                classCode: data.class_code || "",
                className: data.class_name || "",
                description: data.description || "",
                isActive: data.is_active === 1
                    ? "Active"
                    : "Inactive"
            });

        } catch (error) {

            console.error(error);

            warningNotify(
                "Failed to load vehicle class details"
            );
        }
    };


    // LOAD EDIT DATA
    useEffect(() => {

        if (mode === "edit" && id) {
            getVehicleClassById(id);
        }

    }, [id, mode]);


    // VALIDATION
    const validateVehicleClass = () => {

        if (!vehicleClass.vehicleCategoryId) {

            warningNotify(
                "Vehicle Category is required."
            );

            return false;
        }


        if (
            !vehicleClass.classCode ||
            vehicleClass.classCode.trim() === ""
        ) {

            warningNotify(
                "Class Code is required."
            );

            return false;
        }


        if (vehicleClass.classCode.trim().length > 50) {

            warningNotify(
                "Class Code must not exceed 50 characters."
            );

            return false;
        }


        if (
            !vehicleClass.className ||
            vehicleClass.className.trim() === ""
        ) {

            warningNotify(
                "Class Name is required."
            );

            return false;
        }


        if (vehicleClass.className.trim().length < 2) {

            warningNotify(
                "Class Name must be at least 2 characters."
            );

            return false;
        }


        if (vehicleClass.className.trim().length > 150) {

            warningNotify(
                "Class Name must not exceed 150 characters."
            );

            return false;
        }


        if (
            vehicleClass.description &&
            vehicleClass.description.length > 500
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

        setVehicleClass({
            vehicleCategoryId: "",
            classCode: "",
            className: "",
            description: "",
            isActive: "Active"
        });
        navigate(".", { replace: true, state: null });

    }, [navigate]);


    // SAVE / UPDATE
    const handleSave = async () => {

        if (!validateVehicleClass()) {
            return;
        }

        setLoading(true);

        try {

            const classData = {

                vehicle_category_id:
                    Number(vehicleClass.vehicleCategoryId),

                class_code:
                    vehicleClass.classCode.trim(),

                class_name:
                    vehicleClass.className.trim(),

                description:
                    vehicleClass.description?.trim() || null,

                is_active:
                    vehicleClass.isActive === "Active"
                        ? 1
                        : 0
            };


            let response;


            // UPDATE
            if (mode === "edit") {

                response = await axioslogin.patch(
                    `/motor/vehicle-class/update/${id}`,
                    classData
                );

            }
            // CREATE
            else {

                response = await axioslogin.post(
                    "/motor/vehicle-class/create",
                    classData
                );
            }


            const {
                success,
                message
            } = response.data;


            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Vehicle Class updated successfully!"
                        : "Vehicle Class created successfully!"
                );


                FetchMotorVehicleClassMaster();


                handleReset();


                // AFTER UPDATE GO TO VIEW
                if (mode === "edit") {

                    navigate(
                        "/home/setting/commonview",
                        {
                            state: {

                                title:
                                    "Motor Vehicle Class Master",

                                type:
                                    "motorvehicleclass",

                                idField:
                                    "vehicle_class_id",

                                editRoute:
                                    "motorvehicleclass",

                                navigateback:
                                    "/home/settings",

                                columns: [

                                    {
                                        field:
                                            "category_name",

                                        headerName:
                                            "Vehicle Category"
                                    },

                                    {
                                        field:
                                            "class_code",

                                        headerName:
                                            "Class Code"
                                    },

                                    {
                                        field:
                                            "class_name",

                                        headerName:
                                            "Class Name"
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
                            ? "Failed to update vehicle class"
                            : "Failed to create vehicle class"
                    )
                );
            }

        } catch (error) {

            console.error(error);

            warningNotify(
                error.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating vehicle class"
                        : "Error creating vehicle class"
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
                        "Motor Vehicle Class Master",

                    type:
                        "motorvehicleclass",

                    idField:
                        "vehicle_class_id",

                    editRoute:
                        "motorvehicleclass",

                    navigateback:
                        "/home/settings",

                    columns: [

                        {
                            field:
                                "category_name",

                            headerName:
                                "Vehicle Category"
                        },

                        {
                            field:
                                "class_code",

                            headerName:
                                "Class Code"
                        },

                        {
                            field:
                                "class_name",

                            headerName:
                                "Class Name"
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

            <Panel title="Motor Vehicle Class Creation">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "60%" }}>

                        {/* VEHICLE CATEGORY */}

                        <FormRow
                            label="Vehicle Category"
                            required
                        >

                            <SelectLg
                                value={
                                    vehicleClass.vehicleCategoryId
                                }
                                onChange={
                                    set("vehicleCategoryId")
                                }
                                options={
                                    ActiveVehicleCategoryMaster
                                }
                            />

                        </FormRow>


                        {/* CLASS CODE */}

                        <FormRow
                            label="Class Code"
                            required
                        >

                            <InputLg
                                value={
                                    vehicleClass.classCode
                                }
                                onChange={
                                    set("classCode")
                                }
                                placeholder="Enter class code"
                            />

                        </FormRow>


                        {/* CLASS NAME */}

                        <FormRow
                            label="Class Name"
                            required
                        >

                            <InputLg
                                value={
                                    vehicleClass.className
                                }
                                onChange={
                                    set("className")
                                }
                                placeholder="Enter class name"
                            />

                        </FormRow>


                        {/* DESCRIPTION */}

                        <FormRow
                            label="Description"
                        >

                            <InputLg
                                value={
                                    vehicleClass.description
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
                                    vehicleClass.isActive
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


export default memo(MotorVehicleClassCreation);