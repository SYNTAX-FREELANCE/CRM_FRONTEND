
import { Box } from "@mui/joy";
import { memo, useCallback, useEffect, useState } from "react";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Button from "../../Settings/CommonMasterComponent/Button";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import { axioslogin } from "../../Connection/axios";

import {
    errorNotify,
    warningNotify,
    successNotify,
    getAuthUser
} from "../../constant/Constant";

import {
    useIncentiveSchemaMaster,
} from "../../CommonCode/useQuery";


const Incentiveschemaslab = () => {

    const [slab, setSlab] = useState({
        incentiveSchemeId: "",
        minimumCapture: "",
        incentiveAmount: "",
        ratepercapture: ""
    });


    const [loading, setLoading] = useState(false);


    const authUser = getAuthUser();

    const { id: EmployeeId } = authUser ?? {}

    const navigate = useNavigate();

    const location = useLocation();

    const { id, mode } = location.state || {};


    // ==================== INCENTIVE SCHEME ====================

    const {
        data: incentiveSchemeMaster = []
    } = useIncentiveSchemaMaster();


    // ==================== SET VALUE ====================

    const set = (field) => (e) => {

        setSlab((prev) => ({
            ...prev,
            [field]: e.target.value
        }));

    };


    // ==================== INCENTIVE SCHEME OPTIONS ====================

    const incentiveSchemeOption =
        Array.isArray(incentiveSchemeMaster)
            ? incentiveSchemeMaster
                .filter(
                    item =>
                        item.is_active === 1
                )
                .map(item => ({
                    id:
                        item.incentive_scheme_id,

                    label:
                        item.scheme_name
                }))
            : [];


    // ==================== VALIDATION ====================

    const validateSlab = () => {

        if (!slab.incentiveSchemeId) {

            warningNotify(
                "Incentive Scheme is required."
            );

            return false;
        }


        if (
            slab.minimumCapture === "" ||
            slab.minimumCapture === null
        ) {

            warningNotify(
                "Minimum Capture is required."
            );

            return false;
        }


        if (
            slab.ratepercapture === "" ||
            slab.ratepercapture === null
        ) {

            warningNotify(
                "Rate Per Capture is required."
            );

            return false;
        }

        if (
            !Number.isInteger(
                Number(slab.ratepercapture)
            )
        ) {

            warningNotify(
                "Rate Per Capture must be a valid number."
            );

            return false;
        }

        if (
            !Number.isInteger(
                Number(slab.minimumCapture)
            )
        ) {

            warningNotify(
                "Minimum Capture must be a valid number."
            );

            return false;
        }


        if (
            Number(slab.minimumCapture) < 0
        ) {

            warningNotify(
                "Minimum Capture cannot be negative."
            );

            return false;
        }
        if (
            Number(slab.ratepercapture) < 0
        ) {

            warningNotify(
                "Rate Per Capture must cannot be negative."
            );

            return false;
        }

        if (
            slab.incentiveAmount === "" ||
            slab.incentiveAmount === null
        ) {

            warningNotify(
                "Incentive Amount is required."
            );

            return false;
        }


        if (
            isNaN(
                Number(slab.incentiveAmount)
            )
        ) {

            warningNotify(
                "Incentive Amount must be a valid amount."
            );

            return false;
        }


        if (
            Number(slab.incentiveAmount) < 0
        ) {

            warningNotify(
                "Incentive Amount cannot be negative."
            );

            return false;
        }


        return true;

    };


    // ==================== GET BY ID ====================

    const getIncentiveSlabById = async (id) => {

        try {

            const result = await axioslogin.get(
                `/incentiveslab/getbyid/${id}`
            );


            const {
                data,
                success,
                message
            } = result?.data;


            if (success !== 1) {

                errorNotify(message);

                return;
            }


            setSlab({

                incentiveSchemeId:
                    data.incentive_scheme_id || "",

                minimumCapture:
                    data.minimum_capture ?? "",

                incentiveAmount:
                    data.incentive_amount ?? "",

                ratepercapture:
                    data.rate_per_capture ?? "",


            });

        } catch (error) {

            warningNotify(
                "Failed to load incentive slab details"
            );

        }

    };


    // ==================== EDIT ====================

    useEffect(() => {

        if (
            mode === "edit" &&
            id
        ) {

            getIncentiveSlabById(id);

        }

    }, [id, mode]);





    // ==================== CANCEL ====================

    const handleCancel = () => {

        setSlab({

            incentiveSchemeId: "",

            minimumCapture: "",

            incentiveAmount: "",

            ratepercapture: ""

        });

        navigate(".", {
            replace: true,
            state: null
        });

    };


    // ==================== SAVE ====================

    const handleSave = async () => {

        if (!validateSlab()) {

            return;

        }


        setLoading(true);


        try {

            const incentiveSlabData = {

                incentive_scheme_id:
                    slab.incentiveSchemeId,

                minimum_capture:
                    Number(
                        slab.minimumCapture
                    ),

                incentive_amount:
                    Number(
                        slab.incentiveAmount
                    ),

                rate_per_capture:
                    Number(
                        slab.ratepercapture
                    ),


                created_by: EmployeeId

            };


            let response;


            if (mode === "edit") {

                response =
                    await axioslogin.patch(

                        `/incentiveslab/update/${id}`,

                        incentiveSlabData

                    );

            } else {

                response =
                    await axioslogin.post(

                        "/incentiveslab/create",

                        incentiveSlabData

                    );

            }


            const {
                success,
                message
            } = response.data;


            if (success === 1) {

                successNotify(

                    mode === "edit"

                        ? "Incentive slab updated successfully!"

                        : "Incentive slab created successfully!"

                );


                handleCancel();


            } else {

                warningNotify(

                    message ||

                    (
                        mode === "edit"

                            ? "Failed to update incentive slab"

                            : "Failed to create incentive slab"
                    )

                );

            }

        } catch (error) {

            warningNotify(

                error.response?.data?.message ||

                (
                    mode === "edit"

                        ? "Error updating incentive slab"

                        : "Error creating incentive slab"
                )

            );

        } finally {

            setLoading(false);

        }

    };


    // ==================== VIEW ====================

    const handleView = () => {

        navigate(
            "/home/setting/commonview",
            {

                state: {

                    title:
                        "Incentive Scheme Slab",

                    type:
                        "incentiveSlab",

                    idField:
                        "incentive_slab_id",

                    editRoute:
                        "incentiveschemaslab",

                    columns: [

                        {
                            field:
                                "scheme_name",

                            headerName:
                                "Incentive Scheme"
                        },

                        {
                            field:
                                "minimum_capture",

                            headerName:
                                "Minimum Capture"
                        },

                        {
                            field:
                                "incentive_amount",

                            headerName:
                                "Incentive Amount"
                        },

                        {
                            field:
                                "rate_per_capture",

                            headerName:
                                "Rate Per Capture"
                        }


                    ]

                }

            }
        );

    };


    // ==================== CLOSE ====================

    const handleClose = useCallback(() => {

        navigate("/home/settings");

    }, [navigate]);


    // ==================== UI ====================

    return (

        <Wrapper>

            <Panel title="Incentive Scheme Slab">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "70%" }}>


                        {/* INCENTIVE SCHEME */}

                        <FormRow
                            label="Incentive Scheme"
                            required
                        >

                            <SelectLg
                                value={
                                    slab.incentiveSchemeId
                                }

                                onChange={
                                    set(
                                        "incentiveSchemeId"
                                    )
                                }

                                options={
                                    incentiveSchemeOption
                                }

                            />

                        </FormRow>


                        {/* MINIMUM CAPTURE */}

                        <FormRow
                            label="Minimum Capture"
                            required
                        >

                            <InputLg
                                value={
                                    slab.minimumCapture
                                }

                                onChange={
                                    set(
                                        "minimumCapture"
                                    )
                                }

                                placeholder="Enter minimum capture"

                            />

                        </FormRow>


                        {/* INCENTIVE AMOUNT */}

                        <FormRow
                            label="Incentive Amount"
                            required
                        >

                            <InputLg
                                value={
                                    slab.incentiveAmount
                                }

                                onChange={
                                    set(
                                        "incentiveAmount"
                                    )
                                }

                                placeholder="Enter incentive amount"

                            />

                        </FormRow>

                        <FormRow
                            label="Rate per Capture"
                            required
                        >

                            <InputLg
                                value={
                                    slab.ratepercapture
                                }

                                onChange={
                                    set(
                                        "ratepercapture"
                                    )
                                }

                                placeholder="Enter Rate Per Capture"

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
                        disabled={loading}
                        onClick={handleSave}>
                        {loading
                            ? "Saving..."
                            : mode === "edit"
                                ? "Update"
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


export default memo(
    Incentiveschemaslab
);

