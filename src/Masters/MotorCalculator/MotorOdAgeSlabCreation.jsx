import { Box } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import Toast from "../../Settings/CommonMasterComponent/Toast";

import { axioslogin } from "../../Connection/axios";
import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";


const MotorOdAgeSlabCreation = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [odAgeSlab, setOdAgeSlab] = useState({
        slabCode: "",
        slabName: "",
        minAgeMonths: "",
        maxAgeMonths: "",
        odRateAdjustmentType: "NONE",
        odRateAdjustment: "",
        description: "",
        isActive: "Active"
    });

    const [mode, setMode] = useState("create");
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);


    // ---------------------------------------------------------
    // SET VALUE
    // ---------------------------------------------------------

    const set = (field) => (event) => {

        const value =
            event?.target?.value !== undefined
                ? event.target.value
                : event;

        setOdAgeSlab((prev) => ({
            ...prev,
            [field]: value
        }));

    };



    const handlereset = useCallback(() => {
        setOdAgeSlab({
            slabCode: "",
            slabName: "",
            minAgeMonths: "",
            maxAgeMonths: "",
            odRateAdjustmentType: "NONE",
            odRateAdjustment: "",
            description: "",
            isActive: "Active"
        })
        navigate(".", { replace: true, state: null });

    }, [navigate]);

    // ---------------------------------------------------------
    // GET BY ID
    // ---------------------------------------------------------

    useEffect(() => {

        const id = location?.state?.id;

        if (!id) {

            setMode("create");
            setEditId(null);

            setOdAgeSlab({
                slabCode: "",
                slabName: "",
                minAgeMonths: "",
                maxAgeMonths: "",
                odRateAdjustmentType: "NONE",
                odRateAdjustment: "",
                description: "",
                isActive: "Active"
            });

            return;
        }


        setMode("edit");
        setEditId(id);

        axioslogin
            .get(`/motor/od-age-slab/getbyid/${id}`)
            .then((res) => {

                if (res.data?.success !== 1) {

                    errorNotify(
                        res.data?.message ||
                        "Failed to fetch OD age slab"
                    );

                    return;
                }

                const data = res.data.data;

                setOdAgeSlab({
                    slabCode: data?.slab_code || "",

                    slabName: data?.slab_name || "",

                    minAgeMonths:
                        data?.min_age_months !== null &&
                            data?.min_age_months !== undefined
                            ? String(data.min_age_months)
                            : "",

                    maxAgeMonths:
                        data?.max_age_months !== null &&
                            data?.max_age_months !== undefined
                            ? String(data.max_age_months)
                            : "",

                    odRateAdjustmentType:
                        data?.od_rate_adjustment_type || "NONE",

                    odRateAdjustment:
                        data?.od_rate_adjustment !== null &&
                            data?.od_rate_adjustment !== undefined
                            ? String(data.od_rate_adjustment)
                            : "",

                    description:
                        data?.description || "",

                    isActive:
                        Number(data?.is_active) === 1
                            ? "Active"
                            : "Inactive"
                });

            })
            .catch(() => {

                errorNotify(
                    "Failed to fetch OD age slab"
                );

            });

    }, [location?.state?.id]);


    // ---------------------------------------------------------
    // SAVE
    // ---------------------------------------------------------

    const handleSave = async () => {

        const {
            slabCode,
            slabName,
            minAgeMonths,
            maxAgeMonths,
            odRateAdjustmentType,
            odRateAdjustment,
            description
        } = odAgeSlab;


        // Slab Code

        if (!slabCode.trim()) {

            warningNotify(
                "Slab code is required"
            );

            return;
        }


        // Slab Name

        if (!slabName.trim()) {

            warningNotify(
                "Slab name is required"
            );

            return;
        }


        // Minimum Age

        if (
            minAgeMonths === "" ||
            minAgeMonths === null ||
            minAgeMonths === undefined
        ) {

            warningNotify(
                "Minimum age in months is required"
            );

            return;
        }


        if (
            isNaN(minAgeMonths) ||
            Number(minAgeMonths) < 0
        ) {

            warningNotify(
                "Minimum age in months must be a valid non-negative number"
            );

            return;
        }


        // Maximum Age

        if (
            maxAgeMonths !== "" &&
            maxAgeMonths !== null &&
            maxAgeMonths !== undefined
        ) {

            if (
                isNaN(maxAgeMonths) ||
                Number(maxAgeMonths) < Number(minAgeMonths)
            ) {

                warningNotify(
                    "Maximum age must be greater than or equal to minimum age"
                );

                return;
            }

        }


        // Adjustment Type

        if (
            ![
                "NONE",
                "PERCENTAGE",
                "FIXED"
            ].includes(odRateAdjustmentType)
        ) {

            warningNotify(
                "Invalid OD rate adjustment type"
            );

            return;
        }


        // Adjustment

        const adjustment =
            odRateAdjustment === "" ||
                odRateAdjustment === null ||
                odRateAdjustment === undefined
                ? 0
                : Number(odRateAdjustment);


        if (
            isNaN(adjustment) ||
            adjustment < 0
        ) {

            warningNotify(
                "OD rate adjustment must be a valid non-negative number"
            );

            return;
        }


        // Percentage

        if (
            odRateAdjustmentType === "PERCENTAGE" &&
            adjustment > 100
        ) {

            warningNotify(
                "Percentage adjustment cannot exceed 100"
            );

            return;
        }


        const body = {

            slab_code:
                slabCode.trim(),

            slab_name:
                slabName.trim(),

            min_age_months:
                Number(minAgeMonths),

            max_age_months:
                maxAgeMonths === "" ||
                    maxAgeMonths === null ||
                    maxAgeMonths === undefined
                    ? null
                    : Number(maxAgeMonths),

            od_rate_adjustment_type:
                odRateAdjustmentType,

            od_rate_adjustment:
                adjustment,

            description:
                description.trim() || null
        };


        setLoading(true);


        try {

            let response;


            if (mode === "edit") {

                response = await axioslogin.put(
                    `/motor/od-age-slab/update/${editId}`,
                    body
                );

            } else {

                response = await axioslogin.post(
                    "/motor/od-age-slab/create",
                    body
                );

            }


            if (response.data?.success === 1) {

                successNotify(
                    response.data?.message ||
                    (
                        mode === "edit"
                            ? "OD age slab updated successfully"
                            : "OD age slab created successfully"
                    )
                );

                handleView();

            } else {

                errorNotify(
                    response.data?.message ||
                    "Failed to save OD age slab"
                );

            }

        } catch (error) {

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save OD age slab"
            );

        } finally {

            setLoading(false);

        }

    };


    // ---------------------------------------------------------
    // VIEW
    // ---------------------------------------------------------

    const handleView = () => {

        navigate(
            "/home/setting/commonview",
            {
                state: {
                    title:
                        "Motor OD Age Slab Master",

                    type:
                        "motorodageslab",

                    idField:
                        "od_age_slab_id",

                    editRoute:
                        "motorodageslab",

                    columns: [
                        {
                            field: "slab_code",
                            headerName: "Slab Code"
                        },
                        {
                            field: "slab_name",
                            headerName: "Slab Name"
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
                            field: "od_rate_adjustment_type",
                            headerName: "Adjustment Type"
                        },
                        {
                            field: "od_rate_adjustment",
                            headerName: "Adjustment"
                        },
                        {
                            field: "description",
                            headerName: "Description"
                        },
                        {
                            field: "is_active",
                            headerName: "Status"
                        }
                    ]
                }
            }
        );

    };


    // ---------------------------------------------------------
    // CANCEL
    // ---------------------------------------------------------

    const handleCancel = () => {

        handlereset();

    };


    // ---------------------------------------------------------
    // CLOSE
    // ---------------------------------------------------------

    const handleClose = () => {

        navigate('/home/settings');

    };


    return (

        <Wrapper>

            <Panel
                title={
                    mode === "edit"
                        ? "Edit Motor OD Age Slab"
                        : "Motor OD Age Slab Creation"
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


                        {/* SLAB CODE */}

                        <FormRow
                            label="Slab Code"
                            required
                        >
                            <InputLg
                                value={
                                    odAgeSlab.slabCode
                                }
                                onChange={
                                    set("slabCode")
                                }
                                placeholder="Enter slab code"
                            />
                        </FormRow>


                        {/* SLAB NAME */}

                        <FormRow
                            label="Slab Name"
                            required
                        >
                            <InputLg
                                value={
                                    odAgeSlab.slabName
                                }
                                onChange={
                                    set("slabName")
                                }
                                placeholder="Enter slab name"
                            />
                        </FormRow>


                        {/* MIN AGE */}

                        <FormRow
                            label="Minimum Age (Months)"
                            required
                        >
                            <InputLg
                                value={
                                    odAgeSlab.minAgeMonths
                                }
                                onChange={
                                    set("minAgeMonths")
                                }
                                placeholder="Enter minimum age"
                                type="number"
                            />
                        </FormRow>


                        {/* MAX AGE */}

                        <FormRow
                            label="Maximum Age (Months)"
                        >
                            <InputLg
                                value={
                                    odAgeSlab.maxAgeMonths
                                }
                                onChange={
                                    set("maxAgeMonths")
                                }
                                placeholder="Enter maximum age"
                                type="number"
                            />
                        </FormRow>


                        {/* ADJUSTMENT TYPE */}

                        <FormRow
                            label="OD Rate Adjustment Type"
                            required
                        >
                            <SelectLg
                                value={
                                    odAgeSlab.odRateAdjustmentType
                                }
                                onChange={
                                    set(
                                        "odRateAdjustmentType"
                                    )
                                }
                                options={[
                                    {
                                        id: "NONE",
                                        label: "None"
                                    },
                                    {
                                        id: "PERCENTAGE",
                                        label: "Percentage"
                                    },
                                    {
                                        id: "FIXED",
                                        label: "Fixed"
                                    }
                                ]}
                            />
                        </FormRow>


                        {/* ADJUSTMENT */}

                        <FormRow
                            label="OD Rate Adjustment"
                        >
                            <InputLg
                                value={
                                    odAgeSlab.odRateAdjustment
                                }
                                onChange={
                                    set(
                                        "odRateAdjustment"
                                    )
                                }
                                placeholder={
                                    odAgeSlab.odRateAdjustmentType ===
                                        "PERCENTAGE"
                                        ? "Enter percentage adjustment"
                                        : "Enter adjustment"
                                }
                                type="number"
                            />
                        </FormRow>


                        {/* DESCRIPTION */}

                        <FormRow
                            label="Description"
                        >
                            <InputLg
                                value={
                                    odAgeSlab.description
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
                                    odAgeSlab.isActive
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

            <Toast />

        </Wrapper>

    );

};

export default MotorOdAgeSlabCreation;