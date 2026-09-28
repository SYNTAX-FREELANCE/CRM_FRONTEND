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

import { useMotorNCBRuleMaster } from "../../CommonCode/useQuery";

const MotorNcbClaimRuleCreation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);

    const [ncbClaimRule, setNcbClaimRule] = useState({
        ncbRuleId: "",
        claimCount: "",
        ncbPercentage: "",
        description: "",
        isActive: "Active",
    });

    const {
        data: NcbRuleMaster = [],
    } = useMotorNCBRuleMaster();

    const ActiveNcbRuleMaster =
        NcbRuleMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.ncb_rule_id,
                label:
                    `${item.ncb_rule_id} - ` +
                    `${item?.product_name || "Product"} - ` +
                    `${item?.policy_type_name || "Policy Type"}`,
            })) || [];

    const set = field => event => {
        setNcbClaimRule(prev => ({
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
            fetchNcbClaimRule(editId);
        }
    }, [editId]);

    const fetchNcbClaimRule = async id => {
        try {
            setLoading(true);

            const response = await axioslogin.get(
                `/motor/ncb-claim-rule/getbyid/${id}`
            );

            if (response?.data?.success === 1) {
                const data =
                    response.data.data;

                setNcbClaimRule({
                    ncbRuleId:
                        data?.ncb_rule_id || "",

                    claimCount:
                        data?.claim_count ?? "",

                    ncbPercentage:
                        data?.ncb_percentage ?? "",

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
                    "Failed to fetch NCB claim rule"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify(
                "Failed to fetch NCB claim rule"
            );
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        // NCB Rule
        if (!ncbClaimRule.ncbRuleId) {
            errorNotify(
                "NCB rule is required"
            );
            return false;
        }

        if (
            isNaN(ncbClaimRule.ncbRuleId) ||
            Number(ncbClaimRule.ncbRuleId) <= 0
        ) {
            errorNotify(
                "NCB rule must be a valid value"
            );
            return false;
        }

        // Claim Count
        if (
            ncbClaimRule.claimCount === undefined ||
            ncbClaimRule.claimCount === null ||
            ncbClaimRule.claimCount === "" ||
            isNaN(ncbClaimRule.claimCount) ||
            Number(ncbClaimRule.claimCount) < 0
        ) {
            errorNotify(
                "Claim count must be a valid value"
            );
            return false;
        }

        // NCB Percentage
        if (
            ncbClaimRule.ncbPercentage === undefined ||
            ncbClaimRule.ncbPercentage === null ||
            ncbClaimRule.ncbPercentage === "" ||
            isNaN(ncbClaimRule.ncbPercentage) ||
            Number(ncbClaimRule.ncbPercentage) < 0 ||
            Number(ncbClaimRule.ncbPercentage) > 100
        ) {
            errorNotify(
                "NCB percentage must be between 0 and 100"
            );
            return false;
        }

        // Description
        if (
            ncbClaimRule.description &&
            ncbClaimRule.description.length > 500
        ) {
            errorNotify(
                "Description cannot exceed 500 characters"
            );
            return false;
        }

        return true;
    };

    const handleCancel = useCallback(() => {
        setNcbClaimRule({
            ncbRuleId: "",
            claimCount: "",
            ncbPercentage: "",
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
        navigate(
            "/home/setting/commonview",
            {
                state: {
                    title:
                        "Motor NCB Claim Rule Master",

                    type:
                        "motorncbclaimrule",

                    idField:
                        "ncb_claim_rule_id",

                    editRoute:
                        "motorncbclaimrule",

                    columns: [
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
                                "min_policy_years",
                            headerName:
                                "Min Policy Years",
                        },
                        {
                            field:
                                "max_policy_years",
                            headerName:
                                "Max Policy Years",
                        },
                        {
                            field:
                                "claim_free_required",
                            headerName:
                                "Claim Free Required",
                        },
                        {
                            field:
                                "claim_count",
                            headerName:
                                "Claim Count",
                        },
                        {
                            field:
                                "ncb_percentage",
                            headerName:
                                "NCB Percentage",
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
                        },
                    ],
                },
            }
        );
    };

    const handleSave = async () => {
        if (!validate()) return;

        const payload = {
            ncb_rule_id:
                Number(
                    ncbClaimRule.ncbRuleId
                ),

            claim_count:
                Number(
                    ncbClaimRule.claimCount
                ),

            ncb_percentage:
                Number(
                    ncbClaimRule.ncbPercentage
                ),

            description:
                ncbClaimRule.description ||
                null,
        };

        try {
            setLoading(true);

            let response;

            if (mode === "edit") {
                response =
                    await axioslogin.put(
                        `/motor/ncb-claim-rule/update/${editId}`,
                        payload
                    );
            } else {
                response =
                    await axioslogin.post(
                        `/motor/ncb-claim-rule/create`,
                        payload
                    );
            }

            if (
                response?.data?.success === 1
            ) {
                successNotify(
                    response?.data?.message ||
                    `NCB claim rule ${
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
                    "Failed to save NCB claim rule"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save NCB claim rule"
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
                        ? "Edit Motor NCB Claim Rule"
                        : "Motor NCB Claim Rule Creation"
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
                            label="NCB Rule"
                            required
                        >
                            <SelectLg
                                options={
                                    ActiveNcbRuleMaster
                                }
                                value={
                                    ncbClaimRule.ncbRuleId
                                }
                                onChange={set(
                                    "ncbRuleId"
                                )}
                            />
                        </FormRow>

                        <FormRow
                            label="Claim Count"
                            required
                        >
                            <InputLg
                                type="number"
                                value={
                                    ncbClaimRule.claimCount
                                }
                                onChange={set(
                                    "claimCount"
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
                                    ncbClaimRule.ncbPercentage
                                }
                                onChange={set(
                                    "ncbPercentage"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Description">
                            <InputLg
                                value={
                                    ncbClaimRule.description
                                }
                                onChange={set(
                                    "description"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Status">
                            <Checkbox
                                value={
                                    ncbClaimRule.isActive
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

export default MotorNcbClaimRuleCreation;