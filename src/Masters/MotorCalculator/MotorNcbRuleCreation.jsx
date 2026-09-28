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
    useMotorProductMaster,
    useMotorPolicyTypeMaster,
} from "../../CommonCode/useQuery";

const MotorNcbRuleCreation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(editId ? "edit" : "create");
    const [loading, setLoading] = useState(false);

    const [ncbRule, setNcbRule] = useState({
        productId: "",
        policyTypeId: "",
        minPolicyYears: "",
        maxPolicyYears: "",
        claimFreeRequired: "1",
        ncbPercentage: "",
        effectiveFrom: "",
        effectiveTo: "",
        description: "",
        isActive: "Active",
    });

    const {
        data: ProductMaster = [],
    } = useMotorProductMaster();

    const {
        data: PolicyTypeMaster = [],
    } = useMotorPolicyTypeMaster();

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

    const set = field => event => {
        setNcbRule(prev => ({
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
            fetchNcbRule(editId);
        }
    }, [editId]);

    const fetchNcbRule = async id => {
        try {
            setLoading(true);

            const response = await axioslogin.get(
                `/motor/ncb-rule/getbyid/${id}`
            );

            if (response?.data?.success === 1) {
                const data = response.data.data;

                setNcbRule({
                    productId:
                        data?.product_id || "",

                    policyTypeId:
                        data?.policy_type_id || "",

                    minPolicyYears:
                        data?.min_policy_years ?? "",

                    maxPolicyYears:
                        data?.max_policy_years ?? "",

                    claimFreeRequired:
                        data?.claim_free_required !== undefined &&
                        data?.claim_free_required !== null
                            ? String(
                                data.claim_free_required
                            )
                            : "1",

                    ncbPercentage:
                        data?.ncb_percentage ?? "",

                    effectiveFrom:
                        data?.effective_from
                            ? data.effective_from.substring(
                                0,
                                10
                            )
                            : "",

                    effectiveTo:
                        data?.effective_to
                            ? data.effective_to.substring(
                                0,
                                10
                            )
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
                    "Failed to fetch NCB rule"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify(
                "Failed to fetch NCB rule"
            );
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        // Product
        if (!ncbRule.productId) {
            errorNotify("Product is required");
            return false;
        }

        if (
            isNaN(ncbRule.productId) ||
            Number(ncbRule.productId) <= 0
        ) {
            errorNotify(
                "Product must be a valid value"
            );
            return false;
        }

        // Policy Type - Optional
        if (
            ncbRule.policyTypeId !== undefined &&
            ncbRule.policyTypeId !== null &&
            ncbRule.policyTypeId !== ""
        ) {
            if (
                isNaN(ncbRule.policyTypeId) ||
                Number(ncbRule.policyTypeId) <= 0
            ) {
                errorNotify(
                    "Policy type must be a valid value"
                );
                return false;
            }
        }

        // Minimum Policy Years
        if (
            ncbRule.minPolicyYears !== undefined &&
            ncbRule.minPolicyYears !== null &&
            ncbRule.minPolicyYears !== ""
        ) {
            if (
                isNaN(ncbRule.minPolicyYears) ||
                Number(ncbRule.minPolicyYears) < 0
            ) {
                errorNotify(
                    "Minimum policy years must be a valid value"
                );
                return false;
            }
        }

        // Maximum Policy Years
        if (
            ncbRule.maxPolicyYears !== undefined &&
            ncbRule.maxPolicyYears !== null &&
            ncbRule.maxPolicyYears !== ""
        ) {
            if (
                isNaN(ncbRule.maxPolicyYears) ||
                Number(ncbRule.maxPolicyYears) < 0
            ) {
                errorNotify(
                    "Maximum policy years must be a valid value"
                );
                return false;
            }
        }

        // Min / Max comparison
        if (
            ncbRule.minPolicyYears !== "" &&
            ncbRule.minPolicyYears !== null &&
            ncbRule.maxPolicyYears !== "" &&
            ncbRule.maxPolicyYears !== null &&
            Number(ncbRule.maxPolicyYears) <
            Number(ncbRule.minPolicyYears)
        ) {
            errorNotify(
                "Maximum policy years cannot be less than minimum policy years"
            );
            return false;
        }

        // Claim Free Required
        if (
            !["0", "1"].includes(
                String(ncbRule.claimFreeRequired)
            )
        ) {
            errorNotify(
                "Claim free required must be 0 or 1"
            );
            return false;
        }

        // NCB Percentage
        if (
            ncbRule.ncbPercentage === undefined ||
            ncbRule.ncbPercentage === null ||
            ncbRule.ncbPercentage === "" ||
            isNaN(ncbRule.ncbPercentage) ||
            Number(ncbRule.ncbPercentage) < 0 ||
            Number(ncbRule.ncbPercentage) > 100
        ) {
            errorNotify(
                "NCB percentage must be between 0 and 100"
            );
            return false;
        }

        // Effective From
        if (!ncbRule.effectiveFrom) {
            errorNotify(
                "Effective from date is required"
            );
            return false;
        }

        // Effective To
        if (
            ncbRule.effectiveTo &&
            ncbRule.effectiveTo <
            ncbRule.effectiveFrom
        ) {
            errorNotify(
                "Effective to date cannot be before effective from date"
            );
            return false;
        }

        // Description
        if (
            ncbRule.description &&
            ncbRule.description.length > 500
        ) {
            errorNotify(
                "Description cannot exceed 500 characters"
            );
            return false;
        }

        return true;
    };

    const handleCancel = useCallback(() => {
        setNcbRule({
            productId: "",
            policyTypeId: "",
            minPolicyYears: "",
            maxPolicyYears: "",
            claimFreeRequired: "1",
            ncbPercentage: "",
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

    const handleClose = () => {
        navigate("/home/settings");
    };

    const handleView = () => {
        navigate("/home/setting/commonview", {
            state: {
                title: "Motor NCB Rule Master",
                type: "motorncbrule",
                idField: "ncb_rule_id",
                editRoute: "motorncbrule",
                columns: [
                    {
                        field: "product_name",
                        headerName: "Product",
                    },
                    {
                        field: "policy_type_name",
                        headerName: "Policy Type",
                    },
                    {
                        field: "min_policy_years",
                        headerName: "Min Policy Years",
                    },
                    {
                        field: "max_policy_years",
                        headerName: "Max Policy Years",
                    },
                    {
                        field: "claim_free_required",
                        headerName: "Claim Free Required",
                    },
                    {
                        field: "ncb_percentage",
                        headerName: "NCB Percentage",
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
            product_id:
                Number(ncbRule.productId),

            policy_type_id:
                ncbRule.policyTypeId
                    ? Number(ncbRule.policyTypeId)
                    : null,

            min_policy_years:
                ncbRule.minPolicyYears !== ""
                    ? Number(ncbRule.minPolicyYears)
                    : null,

            max_policy_years:
                ncbRule.maxPolicyYears !== ""
                    ? Number(ncbRule.maxPolicyYears)
                    : null,

            claim_free_required:
                Number(
                    ncbRule.claimFreeRequired
                ),

            ncb_percentage:
                Number(ncbRule.ncbPercentage),

            effective_from:
                ncbRule.effectiveFrom,

            effective_to:
                ncbRule.effectiveTo || null,

            description:
                ncbRule.description || null,
        };

        try {
            setLoading(true);

            let response;

            if (mode === "edit") {
                response = await axioslogin.put(
                    `/motor/ncb-rule/update/${editId}`,
                    payload
                );
            } else {
                response = await axioslogin.post(
                    `/motor/ncb-rule/create`,
                    payload
                );
            }

            if (response?.data?.success === 1) {
                successNotify(
                    response?.data?.message ||
                    `NCB rule ${
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
                    "Failed to save NCB rule"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save NCB rule"
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
                        ? "Edit Motor NCB Rule"
                        : "Motor NCB Rule Creation"
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
                            label="Product"
                            required
                        >
                            <SelectLg
                                options={
                                    ActiveProductMaster
                                }
                                value={
                                    ncbRule.productId
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
                                    ncbRule.policyTypeId
                                }
                                onChange={set(
                                    "policyTypeId"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Min Policy Years">
                            <InputLg
                                type="number"
                                value={
                                    ncbRule.minPolicyYears
                                }
                                onChange={set(
                                    "minPolicyYears"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Max Policy Years">
                            <InputLg
                                type="number"
                                value={
                                    ncbRule.maxPolicyYears
                                }
                                onChange={set(
                                    "maxPolicyYears"
                                )}
                            />
                        </FormRow>

                        <FormRow
                            label="Claim Free Required"
                        >
                            <SelectLg
                                options={[
                                    {
                                        id: "1",
                                        label: "Yes",
                                    },
                                    {
                                        id: "0",
                                        label: "No",
                                    },
                                ]}
                                value={
                                    ncbRule.claimFreeRequired
                                }
                                onChange={set(
                                    "claimFreeRequired"
                                )}
                            />
                        </FormRow>

                        <FormRow
                            label="NCB Percentage"
                            required
                        >
                            <InputLg
                                type="number"
                                value={
                                    ncbRule.ncbPercentage
                                }
                                onChange={set(
                                    "ncbPercentage"
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
                                    ncbRule.effectiveFrom
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
                                    ncbRule.effectiveTo
                                }
                                onChange={set(
                                    "effectiveTo"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Description">
                            <InputLg
                                value={
                                    ncbRule.description
                                }
                                onChange={set(
                                    "description"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Status">
                            <Checkbox
                                value={
                                    ncbRule.isActive
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
                        borderTop: "1px solid #e5e7eb",
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

export default MotorNcbRuleCreation;