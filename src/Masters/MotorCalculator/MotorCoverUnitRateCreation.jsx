import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";

import { axioslogin } from "../../Connection/axios";

import {
    errorNotify,
    successNotify,
} from "../../constant/Constant";

import {
    useMotorCoverRateMaster,
} from "../../CommonCode/useQuery";

import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";


const MotorCoverUnitRateCreation = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);



    // FORM STATE


    const [coverUnitRate, setCoverUnitRate] = useState({
        coverRateId: "",
        minUnits: "",
        maxUnits: "",
        ratePerUnit: "",
        description: "",
        isActive: "Active"
    });



    // COVER RATE MASTER


    const {
        data: CoverRateMaster = [],
    } = useMotorCoverRateMaster();


    const ActiveCoverRateMaster =
        CoverRateMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.cover_rate_id,

                label:
                    `${item?.cover_code || ""} - ` +
                    `${item?.cover_name || ""} - ` +
                    `${item?.product_name || "Product"} - ` +
                    `${item?.policy_type_name || "Policy Type"} - ` +
                    `${item?.rate_type || ""} ` +
                    `${item?.rate_value ?? ""}`,
            })) || [];



    // SET FIELD


    const set = field => event => {

        setCoverUnitRate(prev => ({
            ...prev,

            [field]:
                event?.target?.value !== undefined
                    ? event.target.value
                    : event,
        }));

    };



    // EDIT FETCH


    useEffect(() => {

        if (editId) {

            setMode("edit");

            fetchCoverUnitRate(editId);

        }

    }, [editId]);


    const fetchCoverUnitRate = async id => {

        try {

            setLoading(true);

            const response =
                await axioslogin.get(
                    `/motor/cover-unit-rate/getbyid/${id}`
                );


            if (response?.data?.success === 1) {

                const data =
                    response.data.data;


                setCoverUnitRate({

                    coverRateId:
                        data?.cover_rate_id || "",

                    minUnits:
                        data?.min_units ?? "",

                    maxUnits:
                        data?.max_units ?? "",

                    ratePerUnit:
                        data?.rate_per_unit ?? "",

                    description:
                        data?.description || "",

                    isActive:
                        Number(data?.is_active) === 1
                            ? "Active"
                            : "Inactive"

                });


            } else {

                errorNotify(
                    response?.data?.message ||
                    "Failed to fetch cover unit rate"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                "Failed to fetch cover unit rate"
            );

        } finally {

            setLoading(false);

        }

    };



    // VALIDATION


    const validate = () => {


        // Cover Rate

        if (!coverUnitRate.coverRateId) {

            errorNotify(
                "Cover rate is required"
            );

            return false;

        }


        if (
            isNaN(coverUnitRate.coverRateId) ||
            Number(coverUnitRate.coverRateId) <= 0
        ) {

            errorNotify(
                "Cover rate must be a valid value"
            );

            return false;

        }


        // Minimum Units

        if (
            coverUnitRate.minUnits === undefined ||
            coverUnitRate.minUnits === null ||
            coverUnitRate.minUnits === "" ||
            isNaN(coverUnitRate.minUnits) ||
            !Number.isInteger(
                Number(coverUnitRate.minUnits)
            ) ||
            Number(coverUnitRate.minUnits) < 0
        ) {

            errorNotify(
                "Valid minimum units are required"
            );

            return false;

        }


        // Maximum Units

        if (
            coverUnitRate.maxUnits !== undefined &&
            coverUnitRate.maxUnits !== null &&
            coverUnitRate.maxUnits !== "" &&
            (
                isNaN(coverUnitRate.maxUnits) ||
                !Number.isInteger(
                    Number(coverUnitRate.maxUnits)
                ) ||
                Number(coverUnitRate.maxUnits) < 0
            )
        ) {

            errorNotify(
                "Invalid maximum units"
            );

            return false;

        }


        if (
            coverUnitRate.maxUnits !== undefined &&
            coverUnitRate.maxUnits !== null &&
            coverUnitRate.maxUnits !== "" &&
            Number(coverUnitRate.maxUnits) <
            Number(coverUnitRate.minUnits)
        ) {

            errorNotify(
                "Maximum units cannot be less than minimum units"
            );

            return false;

        }


        // Rate Per Unit

        if (
            coverUnitRate.ratePerUnit === undefined ||
            coverUnitRate.ratePerUnit === null ||
            coverUnitRate.ratePerUnit === "" ||
            isNaN(coverUnitRate.ratePerUnit) ||
            Number(coverUnitRate.ratePerUnit) < 0
        ) {

            errorNotify(
                "Valid rate per unit is required"
            );

            return false;

        }


        // Description

        if (
            coverUnitRate.description &&
            coverUnitRate.description.length > 500
        ) {

            errorNotify(
                "Description cannot exceed 500 characters"
            );

            return false;

        }


        return true;

    };



    // CANCEL


    const handleCancel = useCallback(() => {

        setCoverUnitRate({

            coverRateId: "",
            minUnits: "",
            maxUnits: "",
            ratePerUnit: "",
            description: "",
            isActive: "Active",

        });


        navigate(".", {

            replace: true,

            state: null,

        });

    }, [navigate]);



    // CLOSE


    const handleClose = () => {

        navigate("/home/settings");

    };



    // VIEW


    const handleView = () => {

        navigate(
            "/home/setting/commonview",
            {
                state: {

                    title:
                        "Motor Cover Unit Rate Master",

                    type:
                        "motorcoverunitrate",

                    idField:
                        "cover_unit_rate_id",

                    editRoute:
                        "motorcoverunitrate",

                    columns: [

                        {
                            field:
                                "cover_code",

                            headerName:
                                "Cover Code",
                        },

                        {
                            field:
                                "cover_name",

                            headerName:
                                "Cover Name",
                        },

                        {
                            field:
                                "insurance_company_name",

                            headerName:
                                "Insurance Company",
                        },

                        {
                            field:
                                "product_name",

                            headerName:
                                "Product",
                        },

                        {
                            field:
                                "policy_type_name",

                            headerName:
                                "Policy Type",
                        },

                        {
                            field:
                                "category_name",

                            headerName:
                                "Vehicle Category",
                        },

                        {
                            field:
                                "class_name",

                            headerName:
                                "Vehicle Class",
                        },

                        {
                            field:
                                "rate_type",

                            headerName:
                                "Rate Type",
                        },

                        {
                            field:
                                "cover_rate_value",

                            headerName:
                                "Cover Rate",
                        },

                        {
                            field:
                                "min_units",

                            headerName:
                                "Min Units",
                        },

                        {
                            field:
                                "max_units",

                            headerName:
                                "Max Units",
                        },

                        {
                            field:
                                "rate_per_unit",

                            headerName:
                                "Rate Per Unit",
                        },

                        {
                            field:
                                "description",

                            headerName:
                                "Description",
                        },

                        {
                            field:
                                "is_active",

                            headerName:
                                "Status",

                            type:
                                "status"
                        },

                    ],

                },
            }
        );

    };



    // SAVE


    const handleSave = async () => {

        if (!validate()) return;


        const payload = {

            cover_rate_id:
                Number(
                    coverUnitRate.coverRateId
                ),

            min_units:
                Number(
                    coverUnitRate.minUnits
                ),

            max_units:
                coverUnitRate.maxUnits === "" ||
                coverUnitRate.maxUnits === null
                    ? null
                    : Number(
                        coverUnitRate.maxUnits
                    ),

            rate_per_unit:
                Number(
                    coverUnitRate.ratePerUnit
                ),

            description:
                coverUnitRate.description
                    ? coverUnitRate.description.trim()
                    : null,

            is_active:
                String(
                    coverUnitRate?.isActive
                ) === "Active"
                    ? 1
                    : 0

        };


        try {

            setLoading(true);

            let response;


            if (mode === "edit") {

                response =
                    await axioslogin.put(
                        `/motor/cover-unit-rate/update/${editId}`,
                        payload
                    );

            } else {

                response =
                    await axioslogin.post(
                        `/motor/cover-unit-rate/create`,
                        payload
                    );

            }


            if (response?.data?.success === 1) {

                successNotify(
                    response?.data?.message ||
                    `Cover unit rate ${mode === "edit"
                        ? "updated"
                        : "created"
                    } successfully`
                );


                handleCancel();


                if (mode === "edit") {

                    handleView();

                }

            } else {

                errorNotify(
                    response?.data?.message ||
                    "Failed to save cover unit rate"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save cover unit rate"
            );

        } finally {

            setLoading(false);

        }

    };



    // UI


    return (

        <Wrapper>

            <Panel
                title={
                    mode === "edit"
                        ? "Edit Motor Cover Unit Rate"
                        : "Motor Cover Unit Rate Creation"
                }
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px",
                    }}
                >

                    <Box sx={{ width: "70%" }}>


                        {/* COVER RATE */}

                        <FormRow
                            label="Cover Rate"
                            required
                        >

                            <SelectLg
                                options={
                                    ActiveCoverRateMaster
                                }

                                value={
                                    coverUnitRate.coverRateId
                                }

                                onChange={set(
                                    "coverRateId"
                                )}
                            />

                        </FormRow>


                        {/* MINIMUM UNITS */}

                        <FormRow
                            label="Minimum Units"
                            required
                        >

                            <InputLg
                                value={
                                    coverUnitRate.minUnits
                                }

                                onChange={set(
                                    "minUnits"
                                )}
                            />

                        </FormRow>


                        {/* MAXIMUM UNITS */}

                        <FormRow
                            label="Maximum Units"
                        >

                            <InputLg
                                value={
                                    coverUnitRate.maxUnits
                                }

                                onChange={set(
                                    "maxUnits"
                                )}
                            />

                        </FormRow>


                        {/* RATE PER UNIT */}

                        <FormRow
                            label="Rate Per Unit"
                            required
                        >

                            <InputLg
                                value={
                                    coverUnitRate.ratePerUnit
                                }

                                onChange={set(
                                    "ratePerUnit"
                                )}
                            />

                        </FormRow>


                        {/* DESCRIPTION */}

                        <FormRow
                            label="Description"
                        >

                            <InputLg
                                value={
                                    coverUnitRate.description
                                }

                                onChange={set(
                                    "description"
                                )}
                            />

                        </FormRow>


                        {/* STATUS */}

                        <FormRow
                            label="Status"
                        >

                            <Checkbox
                                value={
                                    coverUnitRate.isActive
                                }

                                onChange={set(
                                    "isActive"
                                )}
                            />

                        </FormRow>


                    </Box>

                </Box>


                <div
                    style={{
                        borderTop:
                            "1px solid #e5e7eb",

                        margin:
                            "20px 0",
                    }}
                />


                <ButtonWrapper>

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

                </ButtonWrapper>

            </Panel>

        </Wrapper>

    );

};


export default MotorCoverUnitRateCreation;