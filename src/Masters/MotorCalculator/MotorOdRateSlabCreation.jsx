import { Box } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";

import { axioslogin } from "../../Connection/axios";

import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

import {
    useMotorODRateMaster,
    useMotorEngineCCSlabMaster,
    useMotorGVWSlabMaster,
    useMotorODRateSlabMaster
} from "../../CommonCode/useQuery";


const MotorOdRateSlabCreation = () => {

    const [odRateSlab, setOdRateSlab] = useState({
        odRateId: "",
        engineCcSlabId: "",
        gvwSlabId: "",

        minSeatingCapacity: "",
        maxSeatingCapacity: "",

        minAgeMonths: "",
        maxAgeMonths: "",

        rateValue: "",
        description: "",
        isActive: "Active"
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};


    // ---------------------------------------------------------
    // MASTER DATA
    // ---------------------------------------------------------

    const { data: OdRateMaster = [] } =
        useMotorODRateMaster();

    const { data: EngineCCSlabMaster = [] } =
        useMotorEngineCCSlabMaster();

    const { data: GVWSlabMaster = [] } =
        useMotorGVWSlabMaster();


    // ---------------------------------------------------------
    // REFRESH OD RATE SLAB LIST
    // ---------------------------------------------------------

    const { refetch: FetchOdRateSlabMaster } =
        useMotorODRateSlabMaster();


    // ---------------------------------------------------------
    // DROPDOWN OPTIONS
    // ---------------------------------------------------------

    const ActiveOdRateMaster =
        Array.isArray(OdRateMaster)
            ? OdRateMaster
                .filter(item => item.is_active === 1)
                .map(item => ({
                    id: item.od_rate_id,
                    label: [
                        item.insurance_company_name,
                        item.product_name,
                        item.policy_type_name,
                        item.category_name,
                        item.class_name,
                        item.fuel_name
                    ]
                        .filter(Boolean)
                        .join(" | ")
                }))
            : [];


    const ActiveEngineCCSlabMaster =
        Array.isArray(EngineCCSlabMaster)
            ? EngineCCSlabMaster
                .filter(item => item.is_active === 1)
                .map(item => ({
                    id: item.engine_cc_slab_id,
                    label:
                        item.slab_name ||
                        `${item.min_cc} - ${item.max_cc || "Above"} CC`
                }))
            : [];


    const ActiveGVWSlabMaster =
        Array.isArray(GVWSlabMaster)
            ? GVWSlabMaster
                .filter(item => item.is_active === 1)
                .map(item => ({
                    id: item.gvw_slab_id,
                    label:
                        item.slab_name ||
                        `${item.min_gvw} - ${item.max_gvw || "Above"} KG`
                }))
            : [];


    // ---------------------------------------------------------
    // COMMON SETTER
    // ---------------------------------------------------------

    const set = (field) => (e) =>
        setOdRateSlab((prev) => ({
            ...prev,
            [field]: e.target.value
        }));


    // ---------------------------------------------------------
    // GET BY ID
    // ---------------------------------------------------------

    const getOdRateSlabById = async (id) => {

        try {

            const result = await axioslogin.get(
                `/motor/od-rate-slab/getbyid/${id}`
            );

            const { success, data, message } = result.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setOdRateSlab({

                odRateId:
                    data.od_rate_id || "",

                engineCcSlabId:
                    data.engine_cc_slab_id || "",

                gvwSlabId:
                    data.gvw_slab_id || "",

                minSeatingCapacity:
                    data.min_seating_capacity ?? "",

                maxSeatingCapacity:
                    data.max_seating_capacity ?? "",

                minAgeMonths:
                    data.min_age_months ?? "",

                maxAgeMonths:
                    data.max_age_months ?? "",

                rateValue:
                    data.rate_value ?? "",

                description:
                    data.description || "",

                isActive:
                    data.is_active === 1
                        ? "Active"
                        : "Inactive"
            });

        } catch (error) {

            console.error(error);

            warningNotify(
                "Failed to load OD rate slab details"
            );
        }
    };


    useEffect(() => {

        if (mode === "edit" && id) {
            getOdRateSlabById(id);
        }

    }, [id, mode]);


    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    const validateOdRateSlab = () => {

        if (!odRateSlab.odRateId) {

            warningNotify(
                "OD Rate Master is required"
            );

            return false;
        }


        /*
         * At least one rating dimension should be provided.
         *
         * Examples:
         *
         * Engine CC only
         * GVW only
         * Seating only
         * Age only
         * Engine CC + Seating
         * Engine CC + Age
         * GVW + Seating
         * GVW + Age
         * Engine CC + GVW + Seating + Age
         */

        if (
            !odRateSlab.engineCcSlabId &&
            !odRateSlab.gvwSlabId &&
            !odRateSlab.minSeatingCapacity &&
            !odRateSlab.maxSeatingCapacity &&
            !odRateSlab.minAgeMonths &&
            !odRateSlab.maxAgeMonths
        ) {

            warningNotify(
                "At least one of Engine CC, GVW, Seating Capacity or Vehicle Age is required"
            );

            return false;
        }


        // -----------------------------------------------------
        // SEATING VALIDATION
        // -----------------------------------------------------

        if (
            odRateSlab.minSeatingCapacity !== "" &&
            Number(odRateSlab.minSeatingCapacity) < 0
        ) {

            warningNotify(
                "Minimum Seating Capacity cannot be negative"
            );

            return false;
        }


        if (
            odRateSlab.maxSeatingCapacity !== "" &&
            Number(odRateSlab.maxSeatingCapacity) < 0
        ) {

            warningNotify(
                "Maximum Seating Capacity cannot be negative"
            );

            return false;
        }


        if (
            odRateSlab.minSeatingCapacity !== "" &&
            odRateSlab.maxSeatingCapacity !== "" &&
            Number(odRateSlab.maxSeatingCapacity) <
            Number(odRateSlab.minSeatingCapacity)
        ) {

            warningNotify(
                "Maximum Seating Capacity cannot be less than Minimum Seating Capacity"
            );

            return false;
        }


        // -----------------------------------------------------
        // AGE VALIDATION
        // -----------------------------------------------------

        if (
            odRateSlab.minAgeMonths !== "" &&
            Number(odRateSlab.minAgeMonths) < 0
        ) {

            warningNotify(
                "Minimum Vehicle Age cannot be negative"
            );

            return false;
        }


        if (
            odRateSlab.maxAgeMonths !== "" &&
            Number(odRateSlab.maxAgeMonths) < 0
        ) {

            warningNotify(
                "Maximum Vehicle Age cannot be negative"
            );

            return false;
        }


        if (
            odRateSlab.minAgeMonths !== "" &&
            odRateSlab.maxAgeMonths !== "" &&
            Number(odRateSlab.maxAgeMonths) <
            Number(odRateSlab.minAgeMonths)
        ) {

            warningNotify(
                "Maximum Vehicle Age cannot be less than Minimum Vehicle Age"
            );

            return false;
        }


        // -----------------------------------------------------
        // RATE VALIDATION
        // -----------------------------------------------------

        if (
            odRateSlab.rateValue === "" ||
            odRateSlab.rateValue === null ||
            odRateSlab.rateValue === undefined
        ) {

            warningNotify(
                "Rate Value is required"
            );

            return false;
        }


        if (isNaN(odRateSlab.rateValue)) {

            warningNotify(
                "Rate Value must be numeric"
            );

            return false;
        }


        if (Number(odRateSlab.rateValue) < 0) {

            warningNotify(
                "Rate Value cannot be negative"
            );

            return false;
        }


        // -----------------------------------------------------
        // DESCRIPTION
        // -----------------------------------------------------

        if (
            odRateSlab.description &&
            odRateSlab.description.trim().length > 500
        ) {

            warningNotify(
                "Description cannot exceed 500 characters"
            );

            return false;
        }


        return true;
    };


    // ---------------------------------------------------------
    // RESET
    // ---------------------------------------------------------

    const handleReset = useCallback(() => {

        setOdRateSlab({

            odRateId: "",
            engineCcSlabId: "",
            gvwSlabId: "",

            minSeatingCapacity: "",
            maxSeatingCapacity: "",

            minAgeMonths: "",
            maxAgeMonths: "",

            rateValue: "",
            description: "",
            isActive: "Active"

        });

        navigate(".", {
            replace: true,
            state: null
        });

    }, [navigate]);


    // ---------------------------------------------------------
    // VIEW CONFIG
    // ---------------------------------------------------------

    const viewConfig = {

        title: "Motor OD Rate Slab Master",

        type: "motorodrateslab",

        idField: "od_rate_slab_id",

        editRoute: "motorodrateslab",

        columns: [

            {
                field: "od_rate_id",
                headerName: "OD Rate ID"
            },

            {
                field: "product_name",
                headerName: "Product"
            },

            {
                field: "policy_type_name",
                headerName: "Policy Type"
            },

            {
                field: "category_name",
                headerName: "Vehicle Category"
            },

            {
                field: "class_name",
                headerName: "Vehicle Class"
            },

            {
                field: "engine_cc_slab_name",
                headerName: "Engine CC"
            },

            {
                field: "gvw_slab_name",
                headerName: "GVW"
            },

            {
                field: "min_seating_capacity",
                headerName: "Min Seats"
            },

            {
                field: "max_seating_capacity",
                headerName: "Max Seats"
            },

            {
                field: "min_age_months",
                headerName: "Min Age (Months)"
            },

            {
                field: "max_age_months",
                headerName: "Max Age (Months)"
            },

            {
                field: "rate_value",
                headerName: "Rate Value"
            },

            {
                field: "description",
                headerName: "Description"
            },

            {
                field: "is_active",
                headerName: "Status",
                type:
                    "status"
            }

        ]
    };


    // ---------------------------------------------------------
    // SAVE
    // ---------------------------------------------------------

    const handleSave = async () => {

        if (!validateOdRateSlab()) {
            return;
        }

        setLoading(true);

        try {

            const odRateSlabData = {

                od_rate_id:
                    Number(odRateSlab.odRateId),

                engine_cc_slab_id:
                    odRateSlab.engineCcSlabId
                        ? Number(odRateSlab.engineCcSlabId)
                        : null,

                gvw_slab_id:
                    odRateSlab.gvwSlabId
                        ? Number(odRateSlab.gvwSlabId)
                        : null,

                min_seating_capacity:
                    odRateSlab.minSeatingCapacity !== ""
                        ? Number(
                            odRateSlab.minSeatingCapacity
                        )
                        : null,

                max_seating_capacity:
                    odRateSlab.maxSeatingCapacity !== ""
                        ? Number(
                            odRateSlab.maxSeatingCapacity
                        )
                        : null,

                min_age_months:
                    odRateSlab.minAgeMonths !== ""
                        ? Number(
                            odRateSlab.minAgeMonths
                        )
                        : null,

                max_age_months:
                    odRateSlab.maxAgeMonths !== ""
                        ? Number(
                            odRateSlab.maxAgeMonths
                        )
                        : null,

                rate_value:
                    Number(odRateSlab.rateValue),

                description:
                    odRateSlab.description?.trim() || null,

                is_active: odRateSlab.isActive === "Active" ? 1 : 0

            };


            let response;


            if (mode === "edit") {

                response = await axioslogin.put(
                    `/motor/od-rate-slab/update/${id}`,
                    odRateSlabData
                );

            } else {

                response = await axioslogin.post(
                    "/motor/od-rate-slab/create",
                    odRateSlabData
                );
            }


            const {
                success,
                message
            } = response.data;


            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "OD Rate Slab updated successfully!"
                        : "OD Rate Slab created successfully!"
                );


                FetchOdRateSlabMaster();


                handleReset();


                if (mode === "edit") {

                    navigate(
                        "/home/setting/commonview",
                        {
                            state: viewConfig
                        }
                    );

                }

            } else {

                warningNotify(
                    message ||
                    (
                        mode === "edit"
                            ? "Failed to update OD Rate Slab"
                            : "Failed to create OD Rate Slab"
                    )
                );
            }


        } catch (error) {

            console.error(error);

            warningNotify(
                error?.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating OD Rate Slab"
                        : "Error creating OD Rate Slab"
                )
            );

        } finally {

            setLoading(false);

        }
    };


    // ---------------------------------------------------------
    // CANCEL
    // ---------------------------------------------------------

    const handleCancel = () => {

        handleReset();

    };


    // ---------------------------------------------------------
    // VIEW
    // ---------------------------------------------------------

    const handleView = () => {

        navigate(
            "/home/setting/commonview",
            {
                state: viewConfig
            }
        );

    };


    // ---------------------------------------------------------
    // CLOSE
    // ---------------------------------------------------------

    const handleClose = useCallback(() => {

        navigate("/home/settings");

    }, [navigate]);


    // ---------------------------------------------------------
    // UI
    // ---------------------------------------------------------

    return (

        <Wrapper>

            <Panel
                title={
                    mode === "edit"
                        ? "Edit Motor OD Rate Slab"
                        : "Motor OD Rate Slab Creation"
                }
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "70%" }}>


                        {/* OD RATE MASTER */}

                        <FormRow
                            label="OD Rate Master"
                            required
                        >

                            <SelectLg
                                value={
                                    odRateSlab.odRateId
                                }
                                onChange={
                                    set("odRateId")
                                }
                                options={
                                    ActiveOdRateMaster
                                }
                            />

                        </FormRow>


                        {/* ENGINE CC */}

                        <FormRow
                            label="Engine CC Slab"
                        >

                            <SelectLg
                                value={
                                    odRateSlab.engineCcSlabId
                                }
                                onChange={
                                    set("engineCcSlabId")
                                }
                                options={
                                    ActiveEngineCCSlabMaster
                                }
                            />

                        </FormRow>


                        {/* GVW */}

                        <FormRow
                            label="GVW Slab"
                        >

                            <SelectLg
                                value={
                                    odRateSlab.gvwSlabId
                                }
                                onChange={
                                    set("gvwSlabId")
                                }
                                options={
                                    ActiveGVWSlabMaster
                                }
                            />

                        </FormRow>


                        {/* MIN SEATING */}

                        <FormRow
                            label="Minimum Seating Capacity"
                        >

                            <InputLg
                                value={
                                    odRateSlab.minSeatingCapacity
                                }
                                onChange={
                                    set(
                                        "minSeatingCapacity"
                                    )
                                }
                                type="number"
                                placeholder="Enter minimum seats"
                            />

                        </FormRow>


                        {/* MAX SEATING */}

                        <FormRow
                            label="Maximum Seating Capacity"
                        >

                            <InputLg
                                value={
                                    odRateSlab.maxSeatingCapacity
                                }
                                onChange={
                                    set(
                                        "maxSeatingCapacity"
                                    )
                                }
                                type="number"
                                placeholder="Enter maximum seats"
                            />

                        </FormRow>


                        {/* MIN AGE */}

                        <FormRow
                            label="Minimum Vehicle Age (Months)"
                        >

                            <InputLg
                                value={
                                    odRateSlab.minAgeMonths
                                }
                                onChange={
                                    set(
                                        "minAgeMonths"
                                    )
                                }
                                type="number"
                                placeholder="Enter minimum age in months"
                            />

                        </FormRow>


                        {/* MAX AGE */}

                        <FormRow
                            label="Maximum Vehicle Age (Months)"
                        >

                            <InputLg
                                value={
                                    odRateSlab.maxAgeMonths
                                }
                                onChange={
                                    set(
                                        "maxAgeMonths"
                                    )
                                }
                                type="number"
                                placeholder="Enter maximum age in months"
                            />

                        </FormRow>


                        {/* RATE */}

                        <FormRow
                            label="Rate Value"
                            required
                        >

                            <InputLg
                                value={
                                    odRateSlab.rateValue
                                }
                                onChange={
                                    set("rateValue")
                                }
                                type="number"
                                placeholder="Enter rate value"
                            />

                        </FormRow>


                        {/* DESCRIPTION */}

                        <FormRow
                            label="Description"
                        >

                            <InputLg
                                value={
                                    odRateSlab.description
                                }
                                onChange={
                                    set("description")
                                }
                                placeholder="Enter description"
                            />

                        </FormRow>


                        {/* ACTIVE STATUS */}

                        <FormRow
                            label="Active Status"
                        >

                            <Checkbox
                                value={
                                    odRateSlab.isActive
                                }
                                onChange={
                                    set("isActive")
                                }
                            />

                        </FormRow>

                    </Box>

                </Box>


                <div
                    style={{
                        borderTop:
                            "1px solid #e5e7eb",
                        margin:
                            "20px 0"
                    }}
                />


                <ButtonWrapper>

                    <Button
                        onClick={
                            handleSave
                        }
                        disabled={
                            loading
                        }
                    >

                        {
                            loading
                                ? "Saving..."
                                : "Save"
                        }

                    </Button>


                    <Button
                        onClick={
                            handleCancel
                        }
                    >
                        Cancel
                    </Button>


                    <Button
                        onClick={
                            handleView
                        }
                    >
                        View
                    </Button>


                    <Button
                        onClick={
                            handleClose
                        }
                    >
                        Close
                    </Button>

                </ButtonWrapper>

            </Panel>

        </Wrapper>
    );
};


export default MotorOdRateSlabCreation;