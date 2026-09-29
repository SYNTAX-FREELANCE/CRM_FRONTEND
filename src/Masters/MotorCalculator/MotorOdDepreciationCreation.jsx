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

import {
    useMotorProductMaster,
    useMotorPolicyTypeMaster
} from "../../CommonCode/useQuery";


const MotorOdDepreciationCreation = () => {

    const navigate = useNavigate();
    const location = useLocation();


    // MASTER DATA

    const {
        data: ProductMaster = []
    } = useMotorProductMaster();

    const {
        data: PolicyTypeMaster = []
    } = useMotorPolicyTypeMaster();


    const ActiveProductMaster =
        ProductMaster
            ?.filter(
                (item) =>
                    Number(item?.is_active) === 1
            )
            ?.map((item) => ({
                id: item.product_id,
                label: item.product_name
            })) || [];


    const ActivePolicyTypeMaster =
        PolicyTypeMaster
            ?.filter(
                (item) =>
                    Number(item?.is_active) === 1
            )
            ?.map((item) => ({
                id: item.policy_type_id,
                label: item.policy_type_name
            })) || [];


    // STATE

    const [odDepreciation, setOdDepreciation] = useState({

        productId: "",

        policyTypeId: "",

        minAgeMonths: "",

        maxAgeMonths: "",

        depreciationPercentage: "",

        effectiveFrom: "",

        effectiveTo: "",

        description: "",

        isActive: "Active"

    });


    const [mode, setMode] = useState("create");

    const [editId, setEditId] = useState(null);

    const [loading, setLoading] = useState(false);


    // SET VALUE

    const set = (field) => (event) => {

        const value =
            event?.target?.value !== undefined
                ? event.target.value
                : event;

        setOdDepreciation((prev) => ({
            ...prev,
            [field]: value
        }));

    };

    const handlereset = useCallback(() => {
        setOdDepreciation({

            productId: "",
            policyTypeId: "",
            minAgeMonths: "",
            maxAgeMonths: "",
            depreciationPercentage: "",
            effectiveFrom: "",
            effectiveTo: "",
            description: "",
            isActive: "Active"

        })
        navigate(".", { replace: true, state: null });

    }, [navigate]);



    // GET BY ID

    useEffect(() => {

        const id = location?.state?.id;

        if (!id) {

            setMode("create");

            setEditId(null);

            setOdDepreciation({

                productId: "",

                policyTypeId: "",

                minAgeMonths: "",

                maxAgeMonths: "",

                depreciationPercentage: "",

                effectiveFrom: "",

                effectiveTo: "",

                description: "",

                isActive: "Active"

            });

            return;

        }


        setMode("edit");

        setEditId(id);


        axioslogin
            .get(
                `/motor/od-depreciation/getbyid/${id}`
            )
            .then((res) => {

                if (res.data?.success !== 1) {

                    errorNotify(
                        res.data?.message ||
                        "Failed to fetch OD depreciation"
                    );

                    return;
                }


                const data = res.data.data;


                setOdDepreciation({

                    productId:
                        data?.product_id !== null &&
                            data?.product_id !== undefined
                            ? String(data.product_id)
                            : "",


                    policyTypeId:
                        data?.policy_type_id !== null &&
                            data?.policy_type_id !== undefined
                            ? String(data.policy_type_id)
                            : "",


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


                    depreciationPercentage:
                        data?.depreciation_percentage !== null &&
                            data?.depreciation_percentage !== undefined
                            ? String(
                                data.depreciation_percentage
                            )
                            : "",


                    effectiveFrom:
                        data?.effective_from
                            ? String(
                                data.effective_from
                            ).substring(0, 10)
                            : "",


                    effectiveTo:
                        data?.effective_to
                            ? String(
                                data.effective_to
                            ).substring(0, 10)
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
                    "Failed to fetch OD depreciation"
                );

            });

    }, [location?.state?.id]);


    // SAVE

    const handleSave = async () => {

        const {
            productId,
            policyTypeId,
            minAgeMonths,
            maxAgeMonths,
            depreciationPercentage,
            effectiveFrom,
            effectiveTo,
            description
        } = odDepreciation;


        // -----------------------------------------------------
        // PRODUCT
        // -----------------------------------------------------

        if (!productId) {

            warningNotify(
                "Product is required"
            );

            return;
        }


        if (
            isNaN(productId) ||
            Number(productId) <= 0
        ) {

            warningNotify(
                "Product must be a valid value"
            );

            return;
        }


        // -----------------------------------------------------
        // POLICY TYPE
        // -----------------------------------------------------

        if (policyTypeId) {

            if (
                isNaN(policyTypeId) ||
                Number(policyTypeId) <= 0
            ) {

                warningNotify(
                    "Policy type must be a valid value"
                );

                return;
            }

        }


        // -----------------------------------------------------
        // MIN AGE
        // -----------------------------------------------------

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
                "Minimum age must be a valid non-negative number"
            );

            return;
        }


        // -----------------------------------------------------
        // MAX AGE
        // -----------------------------------------------------

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


        // -----------------------------------------------------
        // DEPRECIATION
        // -----------------------------------------------------

        if (
            depreciationPercentage === "" ||
            depreciationPercentage === null ||
            depreciationPercentage === undefined
        ) {

            warningNotify(
                "Depreciation percentage is required"
            );

            return;
        }


        if (
            isNaN(depreciationPercentage) ||
            Number(depreciationPercentage) < 0
        ) {

            warningNotify(
                "Depreciation percentage must be a valid non-negative number"
            );

            return;
        }


        if (
            Number(depreciationPercentage) > 100
        ) {

            warningNotify(
                "Depreciation percentage cannot exceed 100"
            );

            return;
        }


        // -----------------------------------------------------
        // EFFECTIVE FROM
        // -----------------------------------------------------

        if (!effectiveFrom) {

            warningNotify(
                "Effective from date is required"
            );

            return;
        }


        // -----------------------------------------------------
        // EFFECTIVE TO
        // -----------------------------------------------------

        if (
            effectiveTo &&
            effectiveTo < effectiveFrom
        ) {

            warningNotify(
                "Effective to date cannot be before effective from date"
            );

            return;
        }


        // -----------------------------------------------------
        // REQUEST BODY
        // -----------------------------------------------------

        const body = {

            product_id:
                Number(productId),

            policy_type_id:
                policyTypeId
                    ? Number(policyTypeId)
                    : null,

            min_age_months:
                Number(minAgeMonths),

            max_age_months:
                maxAgeMonths === "" ||
                    maxAgeMonths === null ||
                    maxAgeMonths === undefined
                    ? null
                    : Number(maxAgeMonths),

            depreciation_percentage:
                Number(depreciationPercentage),

            effective_from:
                effectiveFrom,

            effective_to:
                effectiveTo || null,

            description:
                description.trim() || null

        };


        setLoading(true);


        try {

            let response;


            if (mode === "edit") {

                response = await axioslogin.put(
                    `/motor/od-depreciation/update/${editId}`,
                    body
                );

            } else {

                response = await axioslogin.post(
                    "/motor/od-depreciation/create",
                    body
                );

            }


            if (response.data?.success === 1) {

                successNotify(
                    response.data?.message ||
                    (
                        mode === "edit"
                            ? "OD depreciation updated successfully"
                            : "OD depreciation created successfully"
                    )
                );


                handleView();

            } else {

                errorNotify(
                    response.data?.message ||
                    "Failed to save OD depreciation"
                );

            }

        } catch (error) {

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save OD depreciation"
            );

        } finally {

            setLoading(false);

        }

    };


    // VIEW

    const handleView = () => {

        navigate(
            "/home/setting/commonview",
            {
                state: {

                    title:
                        "Motor OD Depreciation Master",

                    type:
                        "motoroddepreciation",

                    idField:
                        "depreciation_id",

                    editRoute:
                        "motoroddepreciation",

                    columns: [

                        {
                            field:
                                "product_name",
                            headerName:
                                "Product"
                        },

                        {
                            field:
                                "policy_type_name",
                            headerName:
                                "Policy Type"
                        },

                        {
                            field:
                                "min_age_months",
                            headerName:
                                "Min Age (Months)"
                        },

                        {
                            field:
                                "max_age_months",
                            headerName:
                                "Max Age (Months)"
                        },

                        {
                            field:
                                "depreciation_percentage",
                            headerName:
                                "Depreciation %"
                        },

                        {
                            field:
                                "effective_from",
                            headerName:
                                "Effective From",
                            type: "date"

                        },

                        {
                            field:
                                "effective_to",
                            headerName:
                                "Effective To",
                            type: "date"
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
                                "Status"
                        }

                    ]

                }

            }
        );

    };


    // CANCEL

    const handleCancel = () => {

        handlereset();

    };


    // CLOSE

    const handleClose = () => {

        navigate('/home/settings');

    };


    return (

        <Wrapper>

            <Panel
                title={
                    mode === "edit"
                        ? "Edit Motor OD Depreciation"
                        : "Motor OD Depreciation Creation"
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


                        {/* PRODUCT */}

                        <FormRow
                            label="Product"
                            required
                        >
                            <SelectLg
                                value={
                                    odDepreciation.productId
                                }
                                onChange={
                                    set("productId")
                                }
                                options={
                                    ActiveProductMaster
                                }
                            />
                        </FormRow>


                        {/* POLICY TYPE */}

                        <FormRow
                            label="Policy Type"
                        >
                            <SelectLg
                                value={
                                    odDepreciation.policyTypeId
                                }
                                onChange={
                                    set("policyTypeId")
                                }
                                options={
                                    ActivePolicyTypeMaster
                                }
                            />
                        </FormRow>


                        {/* MIN AGE */}

                        <FormRow
                            label="Minimum Age (Months)"
                            required
                        >
                            <InputLg
                                value={
                                    odDepreciation.minAgeMonths
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
                                    odDepreciation.maxAgeMonths
                                }
                                onChange={
                                    set("maxAgeMonths")
                                }
                                placeholder="Enter maximum age"
                                type="number"
                            />
                        </FormRow>


                        {/* DEPRECIATION */}

                        <FormRow
                            label="Depreciation Percentage"
                            required
                        >
                            <InputLg
                                value={
                                    odDepreciation.depreciationPercentage
                                }
                                onChange={
                                    set(
                                        "depreciationPercentage"
                                    )
                                }
                                placeholder="Enter depreciation percentage"
                                type="number"
                            />
                        </FormRow>


                        {/* EFFECTIVE FROM */}

                        <FormRow
                            label="Effective From"
                            required
                        >
                            <InputLg
                                value={
                                    odDepreciation.effectiveFrom
                                }
                                onChange={
                                    set(
                                        "effectiveFrom"
                                    )
                                }
                                type="date"
                            />
                        </FormRow>


                        {/* EFFECTIVE TO */}

                        <FormRow
                            label="Effective To"
                        >
                            <InputLg
                                value={
                                    odDepreciation.effectiveTo
                                }
                                onChange={
                                    set(
                                        "effectiveTo"
                                    )
                                }
                                type="date"
                            />
                        </FormRow>


                        {/* DESCRIPTION */}

                        <FormRow
                            label="Description"
                        >
                            <InputLg
                                value={
                                    odDepreciation.description
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
                                    odDepreciation.isActive
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

export default MotorOdDepreciationCreation;