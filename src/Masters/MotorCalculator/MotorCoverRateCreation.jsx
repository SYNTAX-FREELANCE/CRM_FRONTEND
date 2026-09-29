import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";

import {
    useInsuranceCompanyMaster,
    useMotorProductMaster,
    useMotorPolicyTypeMaster,
    useMotorVehicleCategoryMaster,
    useMotorVehicleClassMaster,
    useMotorCoverMaster,
} from "../../CommonCode/useQuery";

import {
    errorNotify,
    successNotify,
} from "../../constant/Constant";
import { axioslogin } from "../../Connection/axios";

const MotorCoverRateCreation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(editId ? "edit" : "create");
    const [loading, setLoading] = useState(false);

    const [coverRate, setCoverRate] = useState({
        coverId: "",
        insuranceCompanyId: "",
        productId: "",
        policyTypeId: "",
        vehicleCategoryId: "",
        vehicleClassId: "",
        rateType: "",
        rateValue: "",
        effectiveFrom: "",
        effectiveTo: "",
        description: "",
        isActive: "Active",
    });

const { data: InsuranceCompanyMaster = [] } =
    useInsuranceCompanyMaster();

const { data: ProductMaster = [] } =
    useMotorProductMaster();

const { data: PolicyTypeMaster = [] } =
    useMotorPolicyTypeMaster();

const { data: VehicleCategoryMaster = [] } =
    useMotorVehicleCategoryMaster();

const { data: VehicleClassMaster = [] } =
    useMotorVehicleClassMaster();

const { data: CoverMaster = [] } =
    useMotorCoverMaster();


    const ActiveCoverMaster =
    CoverMaster
        ?.filter(item => Number(item?.is_active ?? 1) === 1)
        ?.map(item => ({
            id: item.cover_id,
            label:
                `${item?.cover_code || ""} - ` +
                `${item?.cover_name || ""}`,
        })) || [];

const ActiveInsuranceCompanyMaster =
    InsuranceCompanyMaster
        ?.filter(item => Number(item?.is_active ?? 1) === 1)
        ?.map(item => ({
            id: item.insurance_company_id,
            label: item.company_name,
        })) || [];

const ActiveProductMaster =
    ProductMaster
        ?.filter(item => Number(item?.is_active ?? 1) === 1)
        ?.map(item => ({
            id: item.product_id,
            label:
                `${item?.product_code || ""} - ` +
                `${item?.product_name || ""}`,
        })) || [];

const ActivePolicyTypeMaster =
    PolicyTypeMaster
        ?.filter(item => Number(item?.is_active ?? 1) === 1)
        ?.map(item => ({
            id: item.policy_type_id,
            label:
                `${item?.policy_type_code || ""} - ` +
                `${item?.policy_type_name || ""}`,
        })) || [];

const ActiveVehicleCategoryMaster =
    VehicleCategoryMaster
        ?.filter(item => Number(item?.is_active ?? 1) === 1)
        ?.map(item => ({
            id: item.vehicle_category_id,
            label:
                `${item?.category_code || ""} - ` +
                `${item?.category_name || ""}`,
        })) || [];

const ActiveVehicleClassMaster =
    VehicleClassMaster
        ?.filter(item => Number(item?.is_active ?? 1) === 1)
        ?.map(item => ({
            id: item.vehicle_class_id,
            label:
                `${item?.class_code || ""} - ` +
                `${item?.class_name || ""}`,
        })) || [];

    const RateTypeOptions = [
        {
            id: "FIXED",
            label: "Fixed",
        },
        {
            id: "PER_UNIT",
            label: "Per Unit",
        },
        {
            id: "PERCENTAGE",
            label: "Percentage",
        },
    ];

    // ---------------------------------------------------------
    // SET VALUE
    // ---------------------------------------------------------

    const set = field => event => {
        setCoverRate(prev => ({
            ...prev,
            [field]:
                event?.target?.value !== undefined
                    ? event.target.value
                    : event,
        }));
    };

    // ---------------------------------------------------------
    // EDIT FETCH
    // ---------------------------------------------------------

    const fetchCoverRate = async id => {
        try {
            setLoading(true);

            const response =
                await axioslogin.get(
                    `/motor/cover-rate/getbyid/${id}`
                );

            if (response?.data?.success === 1) {
                const data = response.data.data;

                setCoverRate({
                    coverId: data?.cover_id || "",
                    insuranceCompanyId:
                        data?.insurance_company_id || "",
                    productId: data?.product_id || "",
                    policyTypeId:
                        data?.policy_type_id || "",
                    vehicleCategoryId:
                        data?.vehicle_category_id || "",
                    vehicleClassId:
                        data?.vehicle_class_id || "",
                    rateType: data?.rate_type || "",
                    rateValue: data?.rate_value ?? "",
                    effectiveFrom:
                        data?.effective_from
                            ?.substring(0, 10) || "",
                    effectiveTo:
                        data?.effective_to
                            ?.substring(0, 10) || "",
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
                    "Failed to fetch cover rate"
                );
            }
        } catch (error) {
            console.error(error);
            errorNotify("Failed to fetch cover rate");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (editId) {
            setMode("edit");
            fetchCoverRate(editId);
        }
    }, [editId]);

    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    const validate = () => {
        if (
            !coverRate.coverId ||
            Number(coverRate.coverId) <= 0
        ) {
            errorNotify("Cover is required");
            return false;
        }

        if (
            coverRate.insuranceCompanyId &&
            Number(coverRate.insuranceCompanyId) <= 0
        ) {
            errorNotify("Invalid insurance company");
            return false;
        }

        if (
            !coverRate.productId ||
            Number(coverRate.productId) <= 0
        ) {
            errorNotify("Product is required");
            return false;
        }

        if (
            coverRate.policyTypeId &&
            Number(coverRate.policyTypeId) <= 0
        ) {
            errorNotify("Invalid policy type");
            return false;
        }

        if (
            coverRate.vehicleCategoryId &&
            Number(coverRate.vehicleCategoryId) <= 0
        ) {
            errorNotify("Invalid vehicle category");
            return false;
        }

        if (
            coverRate.vehicleClassId &&
            Number(coverRate.vehicleClassId) <= 0
        ) {
            errorNotify("Invalid vehicle class");
            return false;
        }

        const allowedRateTypes = [
            "FIXED",
            "PER_UNIT",
            "PERCENTAGE",
        ];

        if (
            !coverRate.rateType ||
            !allowedRateTypes.includes(
                coverRate.rateType
            )
        ) {
            errorNotify("Invalid rate type");
            return false;
        }

        if (
            coverRate.rateValue === "" ||
            coverRate.rateValue === null ||
            coverRate.rateValue === undefined ||
            isNaN(coverRate.rateValue) ||
            Number(coverRate.rateValue) < 0
        ) {
            errorNotify("Valid rate value is required");
            return false;
        }

        if (
            coverRate.rateType === "PERCENTAGE" &&
            Number(coverRate.rateValue) > 100
        ) {
            errorNotify(
                "Percentage rate value cannot exceed 100"
            );
            return false;
        }

        if (!coverRate.effectiveFrom) {
            errorNotify(
                "Effective from date is required"
            );
            return false;
        }

        if (
            coverRate.effectiveTo &&
            coverRate.effectiveTo <
                coverRate.effectiveFrom
        ) {
            errorNotify(
                "Effective to date cannot be before effective from date"
            );
            return false;
        }

        if (
            coverRate.description &&
            coverRate.description.length > 500
        ) {
            errorNotify(
                "Description cannot exceed 500 characters"
            );
            return false;
        }

        return true;
    };

    // ---------------------------------------------------------
    // CANCEL
    // ---------------------------------------------------------

    const handleCancel = useCallback(() => {
        setCoverRate({
            coverId: "",
            insuranceCompanyId: "",
            productId: "",
            policyTypeId: "",
            vehicleCategoryId: "",
            vehicleClassId: "",
            rateType: "",
            rateValue: "",
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

    // ---------------------------------------------------------
    // CLOSE
    // ---------------------------------------------------------

    const handleClose = () => {
        navigate("/home/settings");
    };

    // ---------------------------------------------------------
    // VIEW
    // ---------------------------------------------------------

    const handleView = () => {
        navigate("/home/setting/commonview", {
            state: {
                title: "Motor Cover Rate Master",
                type: "motorcoverrate",
                idField: "cover_rate_id",
                editRoute: "motorcoverrate",
                columns: [
                    {
                        field: "cover_code",
                        headerName: "Cover Code",
                    },
                    {
                        field: "cover_name",
                        headerName: "Cover Name",
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
                        field: "rate_type",
                        headerName: "Rate Type",
                    },
                    {
                        field: "rate_value",
                        headerName: "Rate Value",
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
                        type: "status",
                    },
                ],
            },
        });
    };

    // ---------------------------------------------------------
    // SAVE
    // ---------------------------------------------------------

    const handleSave = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            const payload = {
                cover_id: Number(
                    coverRate.coverId
                ),

                insurance_company_id:
                    coverRate.insuranceCompanyId
                        ? Number(
                              coverRate.insuranceCompanyId
                          )
                        : null,

                product_id: Number(
                    coverRate.productId
                ),

                policy_type_id:
                    coverRate.policyTypeId
                        ? Number(
                              coverRate.policyTypeId
                          )
                        : null,

                vehicle_category_id:
                    coverRate.vehicleCategoryId
                        ? Number(
                              coverRate.vehicleCategoryId
                          )
                        : null,

                vehicle_class_id:
                    coverRate.vehicleClassId
                        ? Number(
                              coverRate.vehicleClassId
                          )
                        : null,

                rate_type:
                    coverRate.rateType,

                rate_value:
                    Number(
                        coverRate.rateValue
                    ),

                effective_from:
                    coverRate.effectiveFrom,

                effective_to:
                    coverRate.effectiveTo
                        ? coverRate.effectiveTo
                        : null,

                description:
                    coverRate.description
                        ? coverRate.description.trim()
                        : null,

                is_active:
                    String(
                        coverRate?.isActive
                    ) === "Active"
                        ? 1
                        : 0,
            };

            let response;

            if (mode === "edit") {
                response =
                    await axioslogin.put(
                        `/motor/cover-rate/update/${editId}`,
                        payload
                    );
            } else {
                response =
                    await axioslogin.post(
                        `/motor/cover-rate/create`,
                        payload
                    );
            }

            if (
                response?.data?.success === 1
            ) {
                successNotify(
                    response?.data?.message ||
                        `Cover rate ${
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
                        "Failed to save cover rate"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                    "Failed to save cover rate"
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
                        ? "Edit Motor Cover Rate"
                        : "Motor Cover Rate Creation"
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
                            label="Cover"
                            required
                        >
                            <SelectLg
                                options={
                                    ActiveCoverMaster
                                }
                                value={
                                    coverRate.coverId
                                }
                                onChange={set(
                                    "coverId"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Insurance Company">
                            <SelectLg
                                options={
                                    ActiveInsuranceCompanyMaster
                                }
                                value={
                                    coverRate.insuranceCompanyId
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
                                options={
                                    ActiveProductMaster
                                }
                                value={
                                    coverRate.productId
                                }
                                onChange={set(
                                    "productId"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Policy Type">
                            <SelectLg
                                options={
                                    ActivePolicyTypeMaster
                                }
                                value={
                                    coverRate.policyTypeId
                                }
                                onChange={set(
                                    "policyTypeId"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Vehicle Category">
                            <SelectLg
                                options={
                                    ActiveVehicleCategoryMaster
                                }
                                value={
                                    coverRate.vehicleCategoryId
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
                                    coverRate.vehicleClassId
                                }
                                onChange={set(
                                    "vehicleClassId"
                                )}
                            />
                        </FormRow>

                        <FormRow
                            label="Rate Type"
                            required
                        >
                            <SelectLg
                                options={
                                    RateTypeOptions
                                }
                                value={
                                    coverRate.rateType
                                }
                                onChange={set(
                                    "rateType"
                                )}
                            />
                        </FormRow>

                        <FormRow
                            label="Rate Value"
                            required
                        >
                            <InputLg
                                value={
                                    coverRate.rateValue
                                }
                                onChange={set(
                                    "rateValue"
                                )}
                            />
                        </FormRow>

                        <FormRow
                            label="Effective From"
                            required
                        >
                            <InputLg
                                type="date"
                                value={
                                    coverRate.effectiveFrom
                                }
                                onChange={set(
                                    "effectiveFrom"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Effective To">
                            <InputLg
                                type="date"
                                value={
                                    coverRate.effectiveTo
                                }
                                onChange={set(
                                    "effectiveTo"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Description">
                            <InputLg
                                value={
                                    coverRate.description
                                }
                                onChange={set(
                                    "description"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Status">
                            <Checkbox
                                value={
                                    coverRate.isActive
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
                        margin: "20px 0",
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

export default MotorCoverRateCreation;