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

const MotorCashbackRuleCreation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);

    const [cashbackRule, setCashbackRule] = useState({
        insuranceCompanyId: "",
        productId: "",
        policyTypeId: "",
        vehicleCategoryId: "",
        vehicleClassId: "",
        cashbackType: "",
        cashbackValue: "",
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
     * CASHBACK TYPES
     */

    const CashbackTypeMaster = [
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
        setCashbackRule(prev => ({
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
            fetchCashbackRule(editId);
        }
    }, [editId]);

    const fetchCashbackRule = async id => {
        try {
            setLoading(true);

            const response =
                await axioslogin.get(
                    `/motor/cashback-rule/getbyid/${id}`
                );

            if (response?.data?.success === 1) {
                const data =
                    response?.data?.data;

                setCashbackRule({
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

                    cashbackType:
                        data?.cashback_type || "",

                    cashbackValue:
                        data?.cashback_value ?? "",

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
                    "Failed to fetch cashback rule"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify(
                "Failed to fetch cashback rule"
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
            cashbackRule.insuranceCompanyId !== undefined &&
            cashbackRule.insuranceCompanyId !== null &&
            cashbackRule.insuranceCompanyId !== "" &&
            (
                isNaN(
                    cashbackRule.insuranceCompanyId
                ) ||
                Number(
                    cashbackRule.insuranceCompanyId
                ) <= 0
            )
        ) {
            errorNotify(
                "Invalid insurance company"
            );

            return false;
        }

        if (
            !cashbackRule.productId ||
            isNaN(cashbackRule.productId) ||
            Number(cashbackRule.productId) <= 0
        ) {
            errorNotify(
                "Product is required"
            );

            return false;
        }

        if (
            cashbackRule.policyTypeId !== undefined &&
            cashbackRule.policyTypeId !== null &&
            cashbackRule.policyTypeId !== "" &&
            (
                isNaN(
                    cashbackRule.policyTypeId
                ) ||
                Number(
                    cashbackRule.policyTypeId
                ) <= 0
            )
        ) {
            errorNotify(
                "Invalid policy type"
            );

            return false;
        }

        if (
            cashbackRule.vehicleCategoryId !== undefined &&
            cashbackRule.vehicleCategoryId !== null &&
            cashbackRule.vehicleCategoryId !== "" &&
            (
                isNaN(
                    cashbackRule.vehicleCategoryId
                ) ||
                Number(
                    cashbackRule.vehicleCategoryId
                ) <= 0
            )
        ) {
            errorNotify(
                "Invalid vehicle category"
            );

            return false;
        }

        if (
            cashbackRule.vehicleClassId !== undefined &&
            cashbackRule.vehicleClassId !== null &&
            cashbackRule.vehicleClassId !== "" &&
            (
                isNaN(
                    cashbackRule.vehicleClassId
                ) ||
                Number(
                    cashbackRule.vehicleClassId
                ) <= 0
            )
        ) {
            errorNotify(
                "Invalid vehicle class"
            );

            return false;
        }

        const allowedCashbackTypes = [
            "PERCENTAGE",
            "FIXED",
        ];

        if (
            !cashbackRule.cashbackType ||
            !allowedCashbackTypes.includes(
                cashbackRule.cashbackType
            )
        ) {
            errorNotify(
                "Invalid cashback type"
            );

            return false;
        }

        if (
            cashbackRule.cashbackValue === undefined ||
            cashbackRule.cashbackValue === null ||
            cashbackRule.cashbackValue === "" ||
            isNaN(
                cashbackRule.cashbackValue
            ) ||
            Number(
                cashbackRule.cashbackValue
            ) < 0
        ) {
            errorNotify(
                "Valid cashback value is required"
            );

            return false;
        }

        if (
            cashbackRule.cashbackType ===
                "PERCENTAGE" &&
            Number(
                cashbackRule.cashbackValue
            ) > 100
        ) {
            errorNotify(
                "Percentage cashback value cannot exceed 100"
            );

            return false;
        }

        if (
            cashbackRule.minPremium !== undefined &&
            cashbackRule.minPremium !== null &&
            cashbackRule.minPremium !== "" &&
            (
                isNaN(
                    cashbackRule.minPremium
                ) ||
                Number(
                    cashbackRule.minPremium
                ) < 0
            )
        ) {
            errorNotify(
                "Invalid minimum premium"
            );

            return false;
        }

        if (
            cashbackRule.maxPremium !== undefined &&
            cashbackRule.maxPremium !== null &&
            cashbackRule.maxPremium !== "" &&
            (
                isNaN(
                    cashbackRule.maxPremium
                ) ||
                Number(
                    cashbackRule.maxPremium
                ) < 0
            )
        ) {
            errorNotify(
                "Invalid maximum premium"
            );

            return false;
        }

        if (
            cashbackRule.minPremium !== undefined &&
            cashbackRule.minPremium !== null &&
            cashbackRule.minPremium !== "" &&
            cashbackRule.maxPremium !== undefined &&
            cashbackRule.maxPremium !== null &&
            cashbackRule.maxPremium !== "" &&
            Number(
                cashbackRule.maxPremium
            ) <
            Number(
                cashbackRule.minPremium
            )
        ) {
            errorNotify(
                "Maximum premium cannot be less than minimum premium"
            );

            return false;
        }

        if (!cashbackRule.effectiveFrom) {
            errorNotify(
                "Effective from date is required"
            );

            return false;
        }

        if (
            cashbackRule.effectiveTo &&
            cashbackRule.effectiveTo <
                cashbackRule.effectiveFrom
        ) {
            errorNotify(
                "Effective to date cannot be before effective from date"
            );

            return false;
        }

        if (
            cashbackRule.description &&
            cashbackRule.description.length > 500
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
        setCashbackRule({
            insuranceCompanyId: "",
            productId: "",
            policyTypeId: "",
            vehicleCategoryId: "",
            vehicleClassId: "",
            cashbackType: "",
            cashbackValue: "",
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
                        "Motor Cashback Rule Master",

                    type:
                        "motorcashbackrule",

                    idField:
                        "cashback_rule_id",

                    editRoute:
                        "motorcashbackrule",

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
                                "cashback_type",
                            headerName:
                                "Cashback Type",
                        },
                        {
                            field:
                                "cashback_value",
                            headerName:
                                "Cashback Value",
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
                cashbackRule.insuranceCompanyId === ""
                    ? null
                    : Number(
                        cashbackRule.insuranceCompanyId
                    ),

            product_id:
                Number(
                    cashbackRule.productId
                ),

            policy_type_id:
                cashbackRule.policyTypeId === ""
                    ? null
                    : Number(
                        cashbackRule.policyTypeId
                    ),

            vehicle_category_id:
                cashbackRule.vehicleCategoryId === ""
                    ? null
                    : Number(
                        cashbackRule.vehicleCategoryId
                    ),

            vehicle_class_id:
                cashbackRule.vehicleClassId === ""
                    ? null
                    : Number(
                        cashbackRule.vehicleClassId
                    ),

            cashback_type:
                cashbackRule.cashbackType,

            cashback_value:
                Number(
                    cashbackRule.cashbackValue
                ),

            min_premium:
                cashbackRule.minPremium === ""
                    ? null
                    : Number(
                        cashbackRule.minPremium
                    ),

            max_premium:
                cashbackRule.maxPremium === ""
                    ? null
                    : Number(
                        cashbackRule.maxPremium
                    ),

            effective_from:
                cashbackRule.effectiveFrom,

            effective_to:
                cashbackRule.effectiveTo === ""
                    ? null
                    : cashbackRule.effectiveTo,

            description:
                cashbackRule.description
                    ? cashbackRule.description.trim()
                    : null,

            is_active:
                String(
                    cashbackRule?.isActive
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
                        `/motor/cashback-rule/update/${editId}`,
                        payload
                    );

            } else {

                response =
                    await axioslogin.post(
                        `/motor/cashback-rule/create`,
                        payload
                    );
            }

            if (
                response?.data?.success === 1
            ) {

                successNotify(
                    response?.data?.message ||
                    `Cashback rule ${
                        mode === "edit"
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
                    "Failed to save cashback rule"
                );
            }

        } catch (error) {

            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save cashback rule"
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
                        ? "Edit Motor Cashback Rule"
                        : "Motor Cashback Rule Creation"
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
                                    cashbackRule.insuranceCompanyId
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
                                    cashbackRule.productId
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
                                    cashbackRule.policyTypeId
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
                                    cashbackRule.vehicleCategoryId
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
                                    cashbackRule.vehicleClassId
                                }
                                onChange={
                                    set(
                                        "vehicleClassId"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow
                            label="Cashback Type"
                            required
                        >
                            <SelectLg
                                options={
                                    CashbackTypeMaster
                                }
                                value={
                                    cashbackRule.cashbackType
                                }
                                onChange={
                                    set(
                                        "cashbackType"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow
                            label="Cashback Value"
                            required
                        >
                            <InputLg
                                value={
                                    cashbackRule.cashbackValue
                                }
                                onChange={
                                    set(
                                        "cashbackValue"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow label="Minimum Premium">
                            <InputLg
                                value={
                                    cashbackRule.minPremium
                                }
                                onChange={
                                    set("minPremium")
                                }
                            />
                        </FormRow>

                        <FormRow label="Maximum Premium">
                            <InputLg
                                value={
                                    cashbackRule.maxPremium
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
                                    cashbackRule.effectiveFrom
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
                                    cashbackRule.effectiveTo
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
                                    cashbackRule.description
                                }
                                onChange={
                                    set("description")
                                }
                            />
                        </FormRow>

                        <FormRow label="Status">
                            <Checkbox
                                value={
                                    cashbackRule.isActive
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

export default MotorCashbackRuleCreation;
