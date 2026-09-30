import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";

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

    useMotorVehicleUsageMaster,
    useMotorPolicyTermMaster,
} from "../../CommonCode/useQuery";

const MotorTpRateCreation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(editId ? "edit" : "create");
    const [loading, setLoading] = useState(false);

    const [tpRate, setTpRate] = useState({
        insuranceCompanyId: "",
        productId: "",
        policyTypeId: "",
        policyTermId: "",
        vehicleCategoryId: "",
        vehicleClassId: "",
        usageId: "",
        rateType: "FIXED",
        effectiveFrom: "",
        effectiveTo: "",
        description: "",
        isActive: "Active",
    });

    const {
        data: InsuranceCompanyMaster = [],
    } = useInsuranceCompanyMaster();

    const {
        data: ProductMaster = [],
    } = useMotorProductMaster();

    const {
        data: PolicyTypeMaster = [],
    } = useMotorPolicyTypeMaster();

    const {
        data: PolicyTermMaster = [],
    } = useMotorPolicyTermMaster();

    const {
        data: VehicleCategoryMaster = [],
    } = useMotorVehicleCategoryMaster();

    const {
        data: VehicleClassMaster = [],
    } = useMotorVehicleClassMaster();

    const {
        data: VehicleUsageMaster = [],
    } = useMotorVehicleUsageMaster();

    const ActiveInsuranceCompanyMaster =
        InsuranceCompanyMaster
            ?.filter(item => Number(item?.is_active) === 1)
            ?.map(item => ({
                id: item.insurance_company_id,
                label: item.company_name,
            })) || [];

    const ActiveProductMaster =
        ProductMaster
            ?.filter(item => Number(item?.is_active) === 1)
            ?.map(item => ({
                id: item.product_id,
                label: item.product_name,
            })) || [];

    const ActivePolicyTypeMaster =
        PolicyTypeMaster
            ?.filter(item => Number(item?.is_active) === 1)
            ?.map(item => ({
                id: item.policy_type_id,
                label: item.policy_type_name,
            })) || [];

    const ActivePolicyTermMaster =
        PolicyTermMaster
            ?.filter(item => Number(item?.is_active) === 1)
            ?.map(item => ({
                id: item.policy_term_id,
                label: item.term_name,
            })) || [];

    const ActiveVehicleCategoryMaster =
        VehicleCategoryMaster
            ?.filter(item => Number(item?.is_active) === 1)
            ?.map(item => ({
                id: item.vehicle_category_id,
                label: item.category_name,
            })) || [];

    const ActiveVehicleClassMaster =
        VehicleClassMaster
            ?.filter(item => Number(item?.is_active) === 1)
            ?.map(item => ({
                id: item.vehicle_class_id,
                label: item.class_name,
            })) || [];

    const ActiveVehicleUsageMaster =
        VehicleUsageMaster
            ?.filter(item => Number(item?.is_active) === 1)
            ?.map(item => ({
                id: item.usage_id,
                label: item.usage_name,
            })) || [];

    const set = field => event => {
        setTpRate(prev => ({
            ...prev,
            [field]:
                event?.target?.value !== undefined
                    ? event.target.value
                    : event,
        }));
    };

    useEffect(() => {
        if (editId) {
            setMode("edit");
            fetchTpRate(editId);
        }
    }, [editId]);

    const fetchTpRate = async id => {
        try {
            setLoading(true);

            const response = await axioslogin.get(
                `/motor/tp-rate/getbyid/${id}`
            );

            if (response?.data?.success === 1) {
                const data = response.data.data;

                setTpRate({
                    insuranceCompanyId: data?.insurance_company_id || "",
                    productId: data?.product_id || "",
                    policyTypeId: data?.policy_type_id || "",
                    policyTermId: data?.policy_term_id || "",
                    vehicleCategoryId: data?.vehicle_category_id || "",
                    vehicleClassId: data?.vehicle_class_id || "",
                    usageId: data?.usage_id || "",
                    rateType: data?.rate_type || "FIXED",
                    effectiveFrom: data?.effective_from
                        ? data.effective_from.substring(0, 10)
                        : "",
                    effectiveTo: data?.effective_to
                        ? data.effective_to.substring(0, 10)
                        : "",
                    description: data?.description || "",
                    isActive:
                        Number(data?.is_active) === 1
                            ? "Active"
                            : "Inactive",
                });
            } else {
                errorNotify(
                    response?.data?.message || "Failed to fetch TP rate"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify("Failed to fetch TP rate");
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        if (!tpRate.productId) {
            errorNotify("Product is required");
            return false;
        }

        if (
            isNaN(tpRate.productId) ||
            Number(tpRate.productId) <= 0
        ) {
            errorNotify("Product must be a valid value");
            return false;
        }

        if (!tpRate.policyTypeId) {
            errorNotify("Policy type is required");
            return false;
        }

        if (
            isNaN(tpRate.policyTypeId) ||
            Number(tpRate.policyTypeId) <= 0
        ) {
            errorNotify("Policy type must be a valid value");
            return false;
        }

        const optionalFields = [
            {
                value: tpRate.insuranceCompanyId,
                name: "Insurance company",
            },
            {
                value: tpRate.policyTermId,
                name: "Policy term",
            },
            {
                value: tpRate.vehicleCategoryId,
                name: "Vehicle category",
            },
            {
                value: tpRate.vehicleClassId,
                name: "Vehicle class",
            },
            {
                value: tpRate.usageId,
                name: "Usage",
            },
        ];

        for (const field of optionalFields) {
            if (
                field.value !== undefined &&
                field.value !== null &&
                field.value !== ""
            ) {
                if (
                    isNaN(field.value) ||
                    Number(field.value) <= 0
                ) {
                    errorNotify(
                        `${field.name} must be a valid value`
                    );
                    return false;
                }
            }
        }

        if (
            !["FIXED", "PER_UNIT"].includes(tpRate.rateType)
        ) {
            errorNotify("Invalid rate type");
            return false;
        }

        if (!tpRate.effectiveFrom) {
            errorNotify("Effective from date is required");
            return false;
        }

        if (
            tpRate.effectiveTo &&
            tpRate.effectiveTo < tpRate.effectiveFrom
        ) {
            errorNotify(
                "Effective to date cannot be before effective from date"
            );
            return false;
        }

        if (
            tpRate.description &&
            tpRate.description.length > 500
        ) {
            errorNotify(
                "Description cannot exceed 500 characters"
            );
            return false;
        }

        return true;
    };

    const handleCancel = useCallback(() => {
        setTpRate({
            insuranceCompanyId: "",
            productId: "",
            policyTypeId: "",
            policyTermId: "",
            vehicleCategoryId: "",
            vehicleClassId: "",
            usageId: "",
            rateType: "FIXED",
            effectiveFrom: "",
            effectiveTo: "",
            description: "",
            isActive: "Active",
        })
        navigate(".", { replace: true, state: null });

    }, [navigate]);





    const handleClose = () => {
        navigate("/home/settings");
    };


    const handleView = () => {
        navigate("/home/setting/commonview", {
            state: {
                title: "Motor TP Rate Master",
                type: "motortprate",
                idField: "tp_rate_id",
                editRoute: "mortprate",
                columns: [
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
                        field: "term_name",
                        headerName: "Policy Term",
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
                        field: "usage_name",
                        headerName: "Usage",
                    },
                    {
                        field: "rate_type",
                        headerName: "Rate Type",
                    },
                    {
                        field: "effective_from",
                        headerName: "Effective From",
                    },
                    {
                        field: "effective_to",
                        headerName: "Effective To",
                    },
                    {
                        field: "description",
                        headerName: "Description",
                    },
                    {
                        field: "is_active",
                        headerName: "Status",
                    },
                ],
            },
        });
    };


    const handleSave = async () => {
        if (!validate()) return;

        const payload = {
            insurance_company_id:
                tpRate.insuranceCompanyId
                    ? Number(tpRate.insuranceCompanyId)
                    : null,

            product_id: Number(tpRate.productId),

            policy_type_id: Number(tpRate.policyTypeId),

            policy_term_id:
                tpRate.policyTermId
                    ? Number(tpRate.policyTermId)
                    : null,

            vehicle_category_id:
                tpRate.vehicleCategoryId
                    ? Number(tpRate.vehicleCategoryId)
                    : null,

            vehicle_class_id:
                tpRate.vehicleClassId
                    ? Number(tpRate.vehicleClassId)
                    : null,

            usage_id:
                tpRate.usageId
                    ? Number(tpRate.usageId)
                    : null,

            rate_type: tpRate.rateType || "FIXED",

            description:
                tpRate.description || null,

            effective_from: tpRate.effectiveFrom,

            effective_to:
                tpRate.effectiveTo || null,
        };

        try {
            setLoading(true);

            let response;

            if (mode === "edit") {
                response = await axioslogin.put(
                    `/motor/tp-rate/update/${editId}`,
                    payload
                );
            } else {
                response = await axioslogin.post(
                    `/motor/tp-rate/create`,
                    payload
                );
            }

            if (response?.data?.success === 1) {
                successNotify(
                    response?.data?.message ||
                    `TP rate ${mode === "edit"
                        ? "updated"
                        : "created"
                    } successfully`
                );

                handleCancel()

                if (mode === "edit") {
                    handleView()
                }
            } else {
                errorNotify(
                    response?.data?.message ||
                    "Failed to save TP rate"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save TP rate"
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
                        ? "Edit Motor TP Rate"
                        : "Motor TP Rate Creation"
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
                            label="Insurance Company"
                        >
                            <SelectLg
                                options={
                                    ActiveInsuranceCompanyMaster
                                }
                                value={
                                    tpRate.insuranceCompanyId
                                }
                                onChange={set(
                                    "insuranceCompanyId"
                                )}
                            />
                        </FormRow>

                        <FormRow
                            label="Product"
                            required
                        >
                            <SelectLg
                                options={ActiveProductMaster}
                                value={tpRate.productId}
                                onChange={set("productId")}
                            />
                        </FormRow>

                        <FormRow
                            label="Policy Type"
                            required
                        >
                            <SelectLg
                                options={
                                    ActivePolicyTypeMaster
                                }
                                value={
                                    tpRate.policyTypeId
                                }
                                onChange={set(
                                    "policyTypeId"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Policy Term">
                            <SelectLg
                                options={
                                    ActivePolicyTermMaster
                                }
                                value={
                                    tpRate.policyTermId
                                }
                                onChange={set(
                                    "policyTermId"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Vehicle Category">
                            <SelectLg
                                options={
                                    ActiveVehicleCategoryMaster
                                }
                                value={
                                    tpRate.vehicleCategoryId
                                }
                                onChange={set(
                                    "vehicleCategoryId"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Vehicle Class">
                            <SelectLg
                                options={
                                    ActiveVehicleClassMaster
                                }
                                value={
                                    tpRate.vehicleClassId
                                }
                                onChange={set(
                                    "vehicleClassId"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Usage">
                            <SelectLg
                                options={
                                    ActiveVehicleUsageMaster
                                }
                                value={tpRate.usageId}
                                onChange={set("usageId")}
                            />
                        </FormRow>

                        <FormRow label="Rate Type">
                            <SelectLg
                                options={[
                                    {
                                        id: "FIXED",
                                        label: "Fixed",
                                    },
                                    {
                                        id: "PER_UNIT",
                                        label: "Per Unit",
                                    },
                                ]}
                                value={tpRate.rateType}
                                onChange={set("rateType")}
                            />
                        </FormRow>

                        <FormRow
                            label="Effective From"
                            required
                        >
                            <InputLg
                                type="date"
                                value={
                                    tpRate.effectiveFrom
                                }
                                onChange={set(
                                    "effectiveFrom"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Effective To">
                            <InputLg
                                type="date"
                                value={tpRate.effectiveTo}
                                onChange={set(
                                    "effectiveTo"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Description">
                            <InputLg
                                value={
                                    tpRate.description
                                }
                                onChange={set(
                                    "description"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Status">
                            <Checkbox
                                value={tpRate.isActive}
                                onChange={set(
                                    "isActive"
                                )}
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

export default MotorTpRateCreation;