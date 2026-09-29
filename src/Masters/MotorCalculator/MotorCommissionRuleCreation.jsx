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
    useInsuranceCompanyMaster,
    useMotorProductMaster,
    useMotorPolicyTypeMaster,
    useMotorVehicleCategoryMaster,
    useMotorVehicleClassMaster,
} from "../../CommonCode/useQuery";

import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";

const MotorCommissionRuleCreation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);

    const [commissionRule, setCommissionRule] = useState({
        insuranceCompanyId: "",
        productId: "",
        policyTypeId: "",
        vehicleCategoryId: "",
        vehicleClassId: "",
        commissionType: "",
        commissionValue: "",
        minPremium: "",
        maxPremium: "",
        effectiveFrom: "",
        effectiveTo: "",
        description: "",
        isActive: "Active",
    });

    /*
     * MASTER DATA
     */

    const {
        data: InsuranceCompanyMaster = [],
    } = useInsuranceCompanyMaster();

    const {
        data: MotorProductMaster = [],
    } = useMotorProductMaster();

    const {
        data: MotorPolicyTypeMaster = [],
    } = useMotorPolicyTypeMaster();

    const {
        data: MotorVehicleCategoryMaster = [],
    } = useMotorVehicleCategoryMaster();

    const {
        data: MotorVehicleClassMaster = [],
    } = useMotorVehicleClassMaster();

    /*
     * ACTIVE MASTER OPTIONS
     */

    const ActiveInsuranceCompanyMaster =
        InsuranceCompanyMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.insurance_company_id,
                label:
                    item?.company_code
                        ? `${item.company_code} - ${item.company_name}`
                        : item.company_name,
            })) || [];

    const ActiveMotorProductMaster =
        MotorProductMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.product_id,
                label:
                    item?.product_code
                        ? `${item.product_code} - ${item.product_name}`
                        : item.product_name,
            })) || [];

    const ActiveMotorPolicyTypeMaster =
        MotorPolicyTypeMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.policy_type_id,
                label:
                    item?.policy_type_code
                        ? `${item.policy_type_code} - ${item.policy_type_name}`
                        : item.policy_type_name,
            })) || [];

    const ActiveMotorVehicleCategoryMaster =
        MotorVehicleCategoryMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.vehicle_category_id,
                label:
                    item?.category_code
                        ? `${item.category_code} - ${item.category_name}`
                        : item.category_name,
            })) || [];

    const ActiveMotorVehicleClassMaster =
        MotorVehicleClassMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.vehicle_class_id,
                label:
                    item?.class_code
                        ? `${item.class_code} - ${item.class_name}`
                        : item.class_name,
            })) || [];

    /*
     * COMMISSION TYPES
     */

    const CommissionTypeMaster = [
        {
            id: "PERCENTAGE",
            label: "Percentage",
        },
        {
            id: "FIXED",
            label: "Fixed",
        },
    ];

    /*
     * SET FORM VALUE
     */

    const set = field => event => {
        setCommissionRule(prev => ({
            ...prev,
            [field]:
                event?.target?.value !== undefined
                    ? event.target.value
                    : event,
        }));
    };

    /*
     * FETCH EDIT DATA
     */

    useEffect(() => {
        if (editId) {
            setMode("edit");
            fetchCommissionRule(editId);
        }
    }, [editId]);

    const fetchCommissionRule = async id => {
        try {
            setLoading(true);

            const response =
                await axioslogin.get(
                    `/motor/commission-rule/getbyid/${id}`
                );

            if (response?.data?.success === 1) {
                const data =
                    response?.data?.data;

                setCommissionRule({
                    insuranceCompanyId:
                        data?.insurance_company_id || "",

                    productId:
                        data?.product_id || "",

                    policyTypeId:
                        data?.policy_type_id || "",

                    vehicleCategoryId:
                        data?.vehicle_category_id || "",

                    vehicleClassId:
                        data?.vehicle_class_id || "",

                    commissionType:
                        data?.commission_type || "",

                    commissionValue:
                        data?.commission_value ?? "",

                    minPremium:
                        data?.min_premium ?? "",

                    maxPremium:
                        data?.max_premium ?? "",

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
                            : "Inactive",
                });
            } else {
                errorNotify(
                    response?.data?.message ||
                    "Failed to fetch commission rule"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify(
                "Failed to fetch commission rule"
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * VALIDATION
     */

    const validate = () => {

        if (
            commissionRule.insuranceCompanyId !== undefined &&
            commissionRule.insuranceCompanyId !== null &&
            commissionRule.insuranceCompanyId !== "" &&
            (
                isNaN(
                    commissionRule.insuranceCompanyId
                ) ||
                Number(
                    commissionRule.insuranceCompanyId
                ) <= 0
            )
        ) {
            errorNotify(
                "Invalid insurance company"
            );

            return false;
        }

        if (
            !commissionRule.productId ||
            isNaN(commissionRule.productId) ||
            Number(commissionRule.productId) <= 0
        ) {
            errorNotify(
                "Product is required"
            );

            return false;
        }

        if (
            commissionRule.policyTypeId !== undefined &&
            commissionRule.policyTypeId !== null &&
            commissionRule.policyTypeId !== "" &&
            (
                isNaN(
                    commissionRule.policyTypeId
                ) ||
                Number(
                    commissionRule.policyTypeId
                ) <= 0
            )
        ) {
            errorNotify(
                "Invalid policy type"
            );

            return false;
        }

        if (
            commissionRule.vehicleCategoryId !== undefined &&
            commissionRule.vehicleCategoryId !== null &&
            commissionRule.vehicleCategoryId !== "" &&
            (
                isNaN(
                    commissionRule.vehicleCategoryId
                ) ||
                Number(
                    commissionRule.vehicleCategoryId
                ) <= 0
            )
        ) {
            errorNotify(
                "Invalid vehicle category"
            );

            return false;
        }

        if (
            commissionRule.vehicleClassId !== undefined &&
            commissionRule.vehicleClassId !== null &&
            commissionRule.vehicleClassId !== "" &&
            (
                isNaN(
                    commissionRule.vehicleClassId
                ) ||
                Number(
                    commissionRule.vehicleClassId
                ) <= 0
            )
        ) {
            errorNotify(
                "Invalid vehicle class"
            );

            return false;
        }

        const allowedCommissionTypes = [
            "PERCENTAGE",
            "FIXED",
        ];

        if (
            !commissionRule.commissionType ||
            !allowedCommissionTypes.includes(
                commissionRule.commissionType
            )
        ) {
            errorNotify(
                "Invalid commission type"
            );

            return false;
        }

        if (
            commissionRule.commissionValue === undefined ||
            commissionRule.commissionValue === null ||
            commissionRule.commissionValue === "" ||
            isNaN(
                commissionRule.commissionValue
            ) ||
            Number(
                commissionRule.commissionValue
            ) < 0
        ) {
            errorNotify(
                "Valid commission value is required"
            );

            return false;
        }

        if (
            commissionRule.commissionType ===
            "PERCENTAGE" &&
            Number(
                commissionRule.commissionValue
            ) > 100
        ) {
            errorNotify(
                "Percentage commission value cannot exceed 100"
            );

            return false;
        }

        if (
            commissionRule.minPremium !== undefined &&
            commissionRule.minPremium !== null &&
            commissionRule.minPremium !== "" &&
            (
                isNaN(
                    commissionRule.minPremium
                ) ||
                Number(
                    commissionRule.minPremium
                ) < 0
            )
        ) {
            errorNotify(
                "Invalid minimum premium"
            );

            return false;
        }

        if (
            commissionRule.maxPremium !== undefined &&
            commissionRule.maxPremium !== null &&
            commissionRule.maxPremium !== "" &&
            (
                isNaN(
                    commissionRule.maxPremium
                ) ||
                Number(
                    commissionRule.maxPremium
                ) < 0
            )
        ) {
            errorNotify(
                "Invalid maximum premium"
            );

            return false;
        }

        if (
            commissionRule.minPremium !== undefined &&
            commissionRule.minPremium !== null &&
            commissionRule.minPremium !== "" &&
            commissionRule.maxPremium !== undefined &&
            commissionRule.maxPremium !== null &&
            commissionRule.maxPremium !== "" &&
            Number(
                commissionRule.maxPremium
            ) <
            Number(
                commissionRule.minPremium
            )
        ) {
            errorNotify(
                "Maximum premium cannot be less than minimum premium"
            );

            return false;
        }

        if (!commissionRule.effectiveFrom) {
            errorNotify(
                "Effective from date is required"
            );

            return false;
        }

        if (
            commissionRule.effectiveTo &&
            commissionRule.effectiveTo <
            commissionRule.effectiveFrom
        ) {
            errorNotify(
                "Effective to date cannot be before effective from date"
            );

            return false;
        }

        if (
            commissionRule.description &&
            commissionRule.description.length > 500
        ) {
            errorNotify(
                "Description cannot exceed 500 characters"
            );

            return false;
        }

        return true;
    };

    /*
     * CANCEL
     */

    const handleCancel = useCallback(() => {
        setCommissionRule({
            insuranceCompanyId: "",
            productId: "",
            policyTypeId: "",
            vehicleCategoryId: "",
            vehicleClassId: "",
            commissionType: "",
            commissionValue: "",
            minPremium: "",
            maxPremium: "",
            effectiveFrom: "",
            effectiveTo: "",
            description: "",
            isActive: "Active",
        });

        navigate(".", {
            replace: true,
            state: null,
        });
    }, [navigate]);

    /*
     * CLOSE
     */

    const handleClose = () => {
        navigate("/home/settings");
    };

    /*
     * VIEW
     */

    const handleView = () => {
        navigate(
            "/home/setting/commonview",
            {
                state: {
                    title:
                        "Motor Commission Rule Master",

                    type:
                        "motorcommissionrule",

                    idField:
                        "commission_rule_id",

                    editRoute:
                        "motorcommissionrule",

                    columns: [
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
                                "commission_type",
                            headerName:
                                "Commission Type",
                        },
                        {
                            field:
                                "commission_value",
                            headerName:
                                "Commission Value",
                        },
                        {
                            field:
                                "min_premium",
                            headerName:
                                "Min Premium",
                        },
                        {
                            field:
                                "max_premium",
                            headerName:
                                "Max Premium",
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
                                "Description",
                        },
                        {
                            field:
                                "is_active",
                            headerName:
                                "Status",
                            type:
                                "status",
                        },
                    ],
                },
            }
        );
    };

    /*
     * SAVE
     */

    const handleSave = async () => {

        if (!validate()) return;

        const payload = {
            insurance_company_id:
                commissionRule.insuranceCompanyId === ""
                    ? null
                    : Number(
                        commissionRule.insuranceCompanyId
                    ),

            product_id:
                Number(
                    commissionRule.productId
                ),

            policy_type_id:
                commissionRule.policyTypeId === ""
                    ? null
                    : Number(
                        commissionRule.policyTypeId
                    ),

            vehicle_category_id:
                commissionRule.vehicleCategoryId === ""
                    ? null
                    : Number(
                        commissionRule.vehicleCategoryId
                    ),

            vehicle_class_id:
                commissionRule.vehicleClassId === ""
                    ? null
                    : Number(
                        commissionRule.vehicleClassId
                    ),

            commission_type:
                commissionRule.commissionType,

            commission_value:
                Number(
                    commissionRule.commissionValue
                ),

            min_premium:
                commissionRule.minPremium === ""
                    ? null
                    : Number(
                        commissionRule.minPremium
                    ),

            max_premium:
                commissionRule.maxPremium === ""
                    ? null
                    : Number(
                        commissionRule.maxPremium
                    ),

            effective_from:
                commissionRule.effectiveFrom,

            effective_to:
                commissionRule.effectiveTo === ""
                    ? null
                    : commissionRule.effectiveTo,

            description:
                commissionRule.description
                    ? commissionRule.description.trim()
                    : null,

            is_active:
                String(
                    commissionRule?.isActive
                ) === "Active"
                    ? 1
                    : 0,
        };

        try {

            setLoading(true);

            let response;

            if (mode === "edit") {

                response =
                    await axioslogin.put(
                        `/motor/commission-rule/update/${editId}`,
                        payload
                    );

            } else {

                response =
                    await axioslogin.post(
                        `/motor/commission-rule/create`,
                        payload
                    );
            }

            if (
                response?.data?.success === 1
            ) {

                successNotify(
                    response?.data?.message ||
                    `Commission rule ${mode === "edit"
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
                    "Failed to save commission rule"
                );
            }

        } catch (error) {

            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save commission rule"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <Wrapper>

            <Panel
                title={
                    mode === "edit"
                        ? "Edit Motor Commission Rule"
                        : "Motor Commission Rule Creation"
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

                        <FormRow label="Insurance Company">
                            <SelectLg
                                options={
                                    ActiveInsuranceCompanyMaster
                                }
                                value={
                                    commissionRule.insuranceCompanyId
                                }
                                onChange={
                                    set(
                                        "insuranceCompanyId"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow
                            label="Product"
                            required
                        >
                            <SelectLg
                                options={
                                    ActiveMotorProductMaster
                                }
                                value={
                                    commissionRule.productId
                                }
                                onChange={
                                    set("productId")
                                }
                            />
                        </FormRow>

                        <FormRow label="Policy Type">
                            <SelectLg
                                options={
                                    ActiveMotorPolicyTypeMaster
                                }
                                value={
                                    commissionRule.policyTypeId
                                }
                                onChange={
                                    set(
                                        "policyTypeId"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow label="Vehicle Category">
                            <SelectLg
                                options={
                                    ActiveMotorVehicleCategoryMaster
                                }
                                value={
                                    commissionRule.vehicleCategoryId
                                }
                                onChange={
                                    set(
                                        "vehicleCategoryId"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow label="Vehicle Class">
                            <SelectLg
                                options={
                                    ActiveMotorVehicleClassMaster
                                }
                                value={
                                    commissionRule.vehicleClassId
                                }
                                onChange={
                                    set(
                                        "vehicleClassId"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow
                            label="Commission Type"
                            required
                        >
                            <SelectLg
                                options={
                                    CommissionTypeMaster
                                }
                                value={
                                    commissionRule.commissionType
                                }
                                onChange={
                                    set(
                                        "commissionType"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow
                            label="Commission Value"
                            required
                        >
                            <InputLg
                                value={
                                    commissionRule.commissionValue
                                }
                                onChange={
                                    set(
                                        "commissionValue"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow label="Minimum Premium">
                            <InputLg
                                value={
                                    commissionRule.minPremium
                                }
                                onChange={
                                    set("minPremium")
                                }
                            />
                        </FormRow>

                        <FormRow label="Maximum Premium">
                            <InputLg
                                value={
                                    commissionRule.maxPremium
                                }
                                onChange={
                                    set("maxPremium")
                                }
                            />
                        </FormRow>

                        <FormRow
                            label="Effective From"
                            required
                        >
                            <InputLg
                                type="date"
                                value={
                                    commissionRule.effectiveFrom
                                }
                                onChange={
                                    set(
                                        "effectiveFrom"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow label="Effective To">
                            <InputLg
                                type="date"
                                value={
                                    commissionRule.effectiveTo
                                }
                                onChange={
                                    set(
                                        "effectiveTo"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow label="Description">
                            <InputLg
                                value={
                                    commissionRule.description
                                }
                                onChange={
                                    set("description")
                                }
                            />
                        </FormRow>

                        <FormRow label="Status">
                            <Checkbox
                                value={
                                    commissionRule.isActive
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
                            "20px 0",
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

export default MotorCommissionRuleCreation;
