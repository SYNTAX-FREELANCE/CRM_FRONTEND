
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
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";

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
    useMotorTaxMaster,
} from "../../CommonCode/useQuery";

const MotorTaxRuleCreation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);

    const [taxRule, setTaxRule] = useState({
        taxId: "",
        insuranceCompanyId: "",
        productId: "",
        policyTypeId: "",
        vehicleCategoryId: "",
        vehicleClassId: "",
        premiumComponent: "",
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

    const {
        data: MotorTaxMaster = [],
    } = useMotorTaxMaster();

    /*
     * ACTIVE INSURANCE COMPANIES
     */

    const ActiveInsuranceCompanyMaster =
        InsuranceCompanyMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.insurance_company_id,
                label: item?.company_code
                    ? `${item.company_code} - ${item.company_name}`
                    : item.company_name,
            })) || [];

    /*
     * ACTIVE PRODUCTS
     */

    const ActiveMotorProductMaster =
        MotorProductMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.product_id,
                label: item?.product_code
                    ? `${item.product_code} - ${item.product_name}`
                    : item.product_name,
            })) || [];

    /*
     * ACTIVE POLICY TYPES
     */

    const ActiveMotorPolicyTypeMaster =
        MotorPolicyTypeMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.policy_type_id,
                label: item?.policy_type_code
                    ? `${item.policy_type_code} - ${item.policy_type_name}`
                    : item.policy_type_name,
            })) || [];

    /*
     * ACTIVE VEHICLE CATEGORIES
     */

    const ActiveMotorVehicleCategoryMaster =
        MotorVehicleCategoryMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.vehicle_category_id,
                label: item?.category_code
                    ? `${item.category_code} - ${item.category_name}`
                    : item.category_name,
            })) || [];

    /*
     * ACTIVE VEHICLE CLASSES
     */

    const ActiveMotorVehicleClassMaster =
        MotorVehicleClassMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1 &&
                    Number(item.vehicle_category_id) === Number(taxRule?.vehicleCategoryId)
            )
            ?.map(item => ({
                id: item.vehicle_class_id,
                label: item?.class_code
                    ? `${item.class_code} - ${item.class_name}`
                    : item.class_name,
            })) || [];

    /*
     * ACTIVE TAX MASTER
     *
     * Assumes motor_tax_master contains:
     * tax_id, tax_code, tax_name, is_active.
     */

    const ActiveMotorTaxMaster =
        MotorTaxMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.tax_id,
                label: item?.tax_code
                    ? `${item.tax_code} - ${item.tax_name}`
                    : item.tax_name,
            })) || [];

    /*
     * PREMIUM COMPONENTS
     */

    const PremiumComponentMaster = [
        {
            id: "OD",
            label: "Own Damage (OD)",
        },
        {
            id: "TP",
            label: "Third Party (TP)",
        },
        {
            id: "ADDON",
            label: "Add-on",
        },
        {
            id: "COVER",
            label: "Cover",
        },
    ];

    /*
     * SET FORM VALUE
     */

    const set = field => event => {
        setTaxRule(prev => ({
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
            fetchTaxRule(editId);
        }
    }, [editId]);

    const fetchTaxRule = async id => {
        try {
            setLoading(true);

            const response = await axioslogin.get(
                `/motor/tax-rule/getbyid/${id}`
            );

            if (response?.data?.success === 1) {
                const data = response?.data?.data;

                setTaxRule({
                    taxId: data?.tax_id ?? "",

                    insuranceCompanyId:
                        data?.insurance_company_id ?? "",

                    productId:
                        data?.product_id ?? "",

                    policyTypeId:
                        data?.policy_type_id ?? "",

                    vehicleCategoryId:
                        data?.vehicle_category_id ?? "",

                    vehicleClassId:
                        data?.vehicle_class_id ?? "",

                    premiumComponent:
                        data?.premium_component ?? "",

                    effectiveFrom:
                        data?.effective_from
                            ? String(data.effective_from).substring(0, 10)
                            : "",

                    effectiveTo:
                        data?.effective_to
                            ? String(data.effective_to).substring(0, 10)
                            : "",

                    description:
                        data?.description ?? "",

                    isActive:
                        Number(data?.is_active) === 1
                            ? "Active"
                            : "Inactive",
                });
            } else {
                errorNotify(
                    response?.data?.message ||
                    "Failed to fetch tax rule"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to fetch tax rule"
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * VALIDATION
     */

    const validate = () => {
        /*
         * TAX MASTER
         */

        if (
            !taxRule.taxId ||
            isNaN(taxRule.taxId) ||
            Number(taxRule.taxId) <= 0
        ) {
            errorNotify("Tax is required");
            return false;
        }

        /*
         * OPTIONAL MASTER IDS
         */

        const optionalIds = [
            {
                value: taxRule.insuranceCompanyId,
                message: "Invalid insurance company",
            },
            {
                value: taxRule.productId,
                message: "Invalid product",
            },
            {
                value: taxRule.policyTypeId,
                message: "Invalid policy type",
            },
            {
                value: taxRule.vehicleCategoryId,
                message: "Invalid vehicle category",
            },
            {
                value: taxRule.vehicleClassId,
                message: "Invalid vehicle class",
            },
        ];

        for (const item of optionalIds) {
            if (
                item.value !== "" &&
                item.value !== null &&
                item.value !== undefined &&
                (
                    isNaN(item.value) ||
                    Number(item.value) <= 0
                )
            ) {
                errorNotify(item.message);
                return false;
            }
        }

        /*
         * PREMIUM COMPONENT
         */

        const allowedComponents = [
            "OD",
            "TP",
            "ADDON",
            "COVER",
        ];

        if (
            !allowedComponents.includes(
                taxRule.premiumComponent
            )
        ) {
            errorNotify("Premium component is required");
            return false;
        }

        /*
         * EFFECTIVE FROM
         */

        if (!taxRule.effectiveFrom) {
            errorNotify("Effective from date is required");
            return false;
        }

        /*
         * EFFECTIVE TO
         */

        if (
            taxRule.effectiveTo &&
            taxRule.effectiveTo < taxRule.effectiveFrom
        ) {
            errorNotify(
                "Effective to date cannot be before effective from date"
            );
            return false;
        }

        /*
         * DESCRIPTION
         */

        if (
            taxRule.description &&
            taxRule.description.length > 500
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
        setTaxRule({
            taxId: "",
            insuranceCompanyId: "",
            productId: "",
            policyTypeId: "",
            vehicleCategoryId: "",
            vehicleClassId: "",
            premiumComponent: "",
            effectiveFrom: "",
            effectiveTo: "",
            description: "",
            isActive: "Active",
        });

        setMode("create");

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
                    title: "Motor Tax Rule Master",

                    type: "motortaxrule",

                    idField: "tax_rule_id",

                    editRoute: "motortaxrule",

                    columns: [
                        {
                            field: "tax_name",
                            headerName: "Tax",
                        },
                        {
                            field: "insurance_company_name",
                            headerName: "Insurance Company",
                        },
                        {
                            field: "product_name",
                            headerName: "Product",
                        },
                        {
                            field: "policy_type_name",
                            headerName: "Policy Type",
                        },
                        {
                            field: "category_name",
                            headerName: "Vehicle Category",
                        },
                        {
                            field: "class_name",
                            headerName: "Vehicle Class",
                        },
                        {
                            field: "premium_component",
                            headerName: "Premium Component",
                        },
                        {
                            field: "effective_from",
                            headerName: "Effective From",
                            type: "date",
                        },
                        {
                            field: "effective_to",
                            headerName: "Effective To",
                            type: "date",
                        },
                        {
                            field: "description",
                            headerName: "Description",
                        },
                        {
                            field: "is_active",
                            headerName: "Status",
                            type: "status",
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
            tax_id: Number(taxRule.taxId),

            insurance_company_id:
                taxRule.insuranceCompanyId === ""
                    ? null
                    : Number(taxRule.insuranceCompanyId),

            product_id:
                taxRule.productId === ""
                    ? null
                    : Number(taxRule.productId),

            policy_type_id:
                taxRule.policyTypeId === ""
                    ? null
                    : Number(taxRule.policyTypeId),

            vehicle_category_id:
                taxRule.vehicleCategoryId === ""
                    ? null
                    : Number(taxRule.vehicleCategoryId),

            vehicle_class_id:
                taxRule.vehicleClassId === ""
                    ? null
                    : Number(taxRule.vehicleClassId),

            premium_component:
                taxRule.premiumComponent,

            effective_from:
                taxRule.effectiveFrom,

            effective_to:
                taxRule.effectiveTo === ""
                    ? null
                    : taxRule.effectiveTo,

            description:
                taxRule.description
                    ? taxRule.description.trim()
                    : null,

            is_active:
                String(taxRule.isActive) === "Active"
                    ? 1
                    : 0,
        };

        try {
            setLoading(true);

            let response;

            if (mode === "edit") {
                response = await axioslogin.put(
                    `/motor/tax-rule/update/${editId}`,
                    payload
                );
            } else {
                response = await axioslogin.post(
                    "/motor/tax-rule/create",
                    payload
                );
            }

            if (response?.data?.success === 1) {
                successNotify(
                    response?.data?.message ||
                    `Tax rule ${mode === "edit"
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
                    "Failed to save tax rule"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save tax rule"
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
                        ? "Edit Motor Tax Rule"
                        : "Motor Tax Rule Creation"
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

                        <FormRow
                            label="Tax"
                            required
                        >
                            <SelectLg
                                options={ActiveMotorTaxMaster}
                                value={taxRule.taxId}
                                onChange={set("taxId")}
                            />
                        </FormRow>

                        <FormRow label="Insurance Company">
                            <SelectLg
                                options={ActiveInsuranceCompanyMaster}
                                value={taxRule.insuranceCompanyId}
                                onChange={set("insuranceCompanyId")}
                            />
                        </FormRow>

                        <FormRow label="Product">
                            <SelectLg
                                options={ActiveMotorProductMaster}
                                value={taxRule.productId}
                                onChange={set("productId")}
                            />
                        </FormRow>

                        <FormRow label="Policy Type">
                            <SelectLg
                                options={ActiveMotorPolicyTypeMaster}
                                value={taxRule.policyTypeId}
                                onChange={set("policyTypeId")}
                            />
                        </FormRow>

                        <FormRow label="Vehicle Category">
                            <SelectLg
                                options={ActiveMotorVehicleCategoryMaster}
                                value={taxRule.vehicleCategoryId}
                                onChange={set("vehicleCategoryId")}
                            />
                        </FormRow>

                        <FormRow label="Vehicle Class">
                            <SelectLg
                                options={ActiveMotorVehicleClassMaster}
                                value={taxRule.vehicleClassId}
                                onChange={set("vehicleClassId")}
                            />
                        </FormRow>

                        <FormRow
                            label="Premium Component"
                            required
                        >
                            <SelectLg
                                options={PremiumComponentMaster}
                                value={taxRule.premiumComponent}
                                onChange={set("premiumComponent")}
                            />
                        </FormRow>

                        <FormRow
                            label="Effective From"
                            required
                        >
                            <InputLg
                                type="date"
                                value={taxRule.effectiveFrom}
                                onChange={set("effectiveFrom")}
                            />
                        </FormRow>

                        <FormRow label="Effective To">
                            <InputLg
                                type="date"
                                value={taxRule.effectiveTo}
                                onChange={set("effectiveTo")}
                            />
                        </FormRow>

                        <FormRow label="Description">
                            <InputLg
                                value={taxRule.description}
                                onChange={set("description")}
                            />
                        </FormRow>

                        <FormRow label="Status">
                            <Checkbox
                                value={taxRule.isActive}
                                onChange={set("isActive")}
                            />
                        </FormRow>

                    </Box>
                </Box>

                <div
                    style={{
                        borderTop: "1px solid #e5e7eb",
                        margin: "20px 0",
                    }}
                />

                <ButtonWrapper>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>

                    <Button onClick={handleCancel}>
                        Cancel
                    </Button>

                    <Button onClick={handleView}>
                        View
                    </Button>

                    <Button onClick={handleClose}>
                        Close
                    </Button>
                </ButtonWrapper>
            </Panel>
        </Wrapper>
    );
};

export default MotorTaxRuleCreation;