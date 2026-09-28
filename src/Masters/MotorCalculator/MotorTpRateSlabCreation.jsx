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
    useMotorEngineCCSlabMaster,
    useMotorGVWSlabMaster,
    useMotorTPRateMaster,
} from "../../CommonCode/useQuery";

const MotorTpRateSlabCreation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(editId ? "edit" : "create");
    const [loading, setLoading] = useState(false);

    const [tpRateSlab, setTpRateSlab] = useState({
        tpRateId: "",
        engineCcSlabId: "",
        gvwSlabId: "",
        minSeatingCapacity: "",
        maxSeatingCapacity: "",
        rateValue: "",
        description: "",
        isActive: "Active",
    });

    const {
        data: TpRateMaster = [],
    } = useMotorTPRateMaster();

    const {
        data: EngineCCSlabMaster = [],
    } = useMotorEngineCCSlabMaster();

    const {
        data: GVWSlabMaster = [],
    } = useMotorGVWSlabMaster();

    const ActiveTpRateMaster =
        TpRateMaster
            ?.filter(item => Number(item?.is_active) === 1)
            ?.map(item => ({
                id: item.tp_rate_id,
                label:
                    `${item.tp_rate_id} - ` +
                    `${item?.product_name || "Product"} - ` +
                    `${item?.policy_type_name || "Policy Type"}`,
            })) || [];

    const ActiveEngineCCSlabMaster =
        EngineCCSlabMaster
            ?.filter(item => Number(item?.is_active) === 1)
            ?.map(item => ({
                id: item.engine_cc_slab_id,
                label: item.slab_name,
            })) || [];

    const ActiveGVWSlabMaster =
        GVWSlabMaster
            ?.filter(item => Number(item?.is_active) === 1)
            ?.map(item => ({
                id: item.gvw_slab_id,
                label: item.slab_name,
            })) || [];

    const set = field => event => {
        setTpRateSlab(prev => ({
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
            fetchTpRateSlab(editId);
        }
    }, [editId]);

    const fetchTpRateSlab = async id => {
        try {
            setLoading(true);

            const response = await axioslogin.get(
                `/motor/tp-rate-slab/getbyid/${id}`
            );

            if (response?.data?.success === 1) {
                const data = response.data.data;

                setTpRateSlab({
                    tpRateId: data?.tp_rate_id || "",
                    engineCcSlabId:
                        data?.engine_cc_slab_id || "",
                    gvwSlabId:
                        data?.gvw_slab_id || "",
                    minSeatingCapacity:
                        data?.min_seating_capacity ?? "",
                    maxSeatingCapacity:
                        data?.max_seating_capacity ?? "",
                    rateValue:
                        data?.rate_value ?? "",
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
                    "Failed to fetch TP rate slab"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify(
                "Failed to fetch TP rate slab"
            );
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        if (!tpRateSlab.tpRateId) {
            errorNotify("TP rate is required");
            return false;
        }

        if (
            isNaN(tpRateSlab.tpRateId) ||
            Number(tpRateSlab.tpRateId) <= 0
        ) {
            errorNotify(
                "TP rate must be a valid value"
            );
            return false;
        }

        const optionalFields = [
            {
                value: tpRateSlab.engineCcSlabId,
                name: "Engine CC slab",
            },
            {
                value: tpRateSlab.gvwSlabId,
                name: "GVW slab",
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
            tpRateSlab.minSeatingCapacity !== undefined &&
            tpRateSlab.minSeatingCapacity !== null &&
            tpRateSlab.minSeatingCapacity !== ""
        ) {
            if (
                isNaN(tpRateSlab.minSeatingCapacity) ||
                Number(tpRateSlab.minSeatingCapacity) < 0
            ) {
                errorNotify(
                    "Minimum seating capacity must be a valid value"
                );
                return false;
            }
        }

        if (
            tpRateSlab.maxSeatingCapacity !== undefined &&
            tpRateSlab.maxSeatingCapacity !== null &&
            tpRateSlab.maxSeatingCapacity !== ""
        ) {
            if (
                isNaN(tpRateSlab.maxSeatingCapacity) ||
                Number(tpRateSlab.maxSeatingCapacity) < 0
            ) {
                errorNotify(
                    "Maximum seating capacity must be a valid value"
                );
                return false;
            }
        }

        if (
            tpRateSlab.minSeatingCapacity !== "" &&
            tpRateSlab.maxSeatingCapacity !== "" &&
            tpRateSlab.minSeatingCapacity !== null &&
            tpRateSlab.maxSeatingCapacity !== null &&
            Number(tpRateSlab.maxSeatingCapacity) <
                Number(tpRateSlab.minSeatingCapacity)
        ) {
            errorNotify(
                "Maximum seating capacity cannot be less than minimum seating capacity"
            );
            return false;
        }

        if (
            tpRateSlab.rateValue === "" ||
            tpRateSlab.rateValue === null ||
            tpRateSlab.rateValue === undefined
        ) {
            errorNotify("Rate value is required");
            return false;
        }

        if (
            isNaN(tpRateSlab.rateValue) ||
            Number(tpRateSlab.rateValue) < 0
        ) {
            errorNotify(
                "Rate value must be a valid value"
            );
            return false;
        }

        if (
            tpRateSlab.description &&
            tpRateSlab.description.length > 500
        ) {
            errorNotify(
                "Description cannot exceed 500 characters"
            );
            return false;
        }

        return true;
    };

    const handleCancel = useCallback(() => {
        setTpRateSlab({
            tpRateId: "",
            engineCcSlabId: "",
            gvwSlabId: "",
            minSeatingCapacity: "",
            maxSeatingCapacity: "",
            rateValue: "",
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
                title: "Motor TP Rate Slab Master",
                type: "motortprateslab",
                idField: "tp_rate_slab_id",
                editRoute: "motortprateslab",
                columns: [
                    {
                        field: "tp_rate_id",
                        headerName: "TP Rate",
                    },
                    {
                        field: "engine_cc_slab_name",
                        headerName: "Engine CC Slab",
                    },
                    {
                        field: "gvw_slab_name",
                        headerName: "GVW Slab",
                    },
                    {
                        field: "min_seating_capacity",
                        headerName: "Min Seating Capacity",
                    },
                    {
                        field: "max_seating_capacity",
                        headerName: "Max Seating Capacity",
                    },
                    {
                        field: "rate_value",
                        headerName: "Rate Value",
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
            tp_rate_id: Number(
                tpRateSlab.tpRateId
            ),

            engine_cc_slab_id:
                tpRateSlab.engineCcSlabId
                    ? Number(
                        tpRateSlab.engineCcSlabId
                    )
                    : null,

            gvw_slab_id:
                tpRateSlab.gvwSlabId
                    ? Number(
                        tpRateSlab.gvwSlabId
                    )
                    : null,

            min_seating_capacity:
                tpRateSlab.minSeatingCapacity !== ""
                    ? Number(
                        tpRateSlab.minSeatingCapacity
                    )
                    : null,

            max_seating_capacity:
                tpRateSlab.maxSeatingCapacity !== ""
                    ? Number(
                        tpRateSlab.maxSeatingCapacity
                    )
                    : null,

            rate_value: Number(
                tpRateSlab.rateValue
            ),

            description:
                tpRateSlab.description || null,
        };

        try {
            setLoading(true);

            let response;

            if (mode === "edit") {
                response = await axioslogin.put(
                    `/motor/tp-rate-slab/update/${editId}`,
                    payload
                );
            } else {
                response = await axioslogin.post(
                    `/motor/tp-rate-slab/create`,
                    payload
                );
            }

            if (response?.data?.success === 1) {
                successNotify(
                    response?.data?.message ||
                    `TP rate slab ${
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
                    "Failed to save TP rate slab"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save TP rate slab"
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
                        ? "Edit Motor TP Rate Slab"
                        : "Motor TP Rate Slab Creation"
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
                            label="TP Rate"
                            required
                        >
                            <SelectLg
                                options={
                                    ActiveTpRateMaster
                                }
                                value={
                                    tpRateSlab.tpRateId
                                }
                                onChange={set(
                                    "tpRateId"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Engine CC Slab">
                            <SelectLg
                                options={
                                    ActiveEngineCCSlabMaster
                                }
                                value={
                                    tpRateSlab.engineCcSlabId
                                }
                                onChange={set(
                                    "engineCcSlabId"
                                )}
                            />
                        </FormRow>

                        <FormRow label="GVW Slab">
                            <SelectLg
                                options={
                                    ActiveGVWSlabMaster
                                }
                                value={
                                    tpRateSlab.gvwSlabId
                                }
                                onChange={set(
                                    "gvwSlabId"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Min Seating Capacity">
                            <InputLg
                                type="number"
                                value={
                                    tpRateSlab.minSeatingCapacity
                                }
                                onChange={set(
                                    "minSeatingCapacity"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Max Seating Capacity">
                            <InputLg
                                type="number"
                                value={
                                    tpRateSlab.maxSeatingCapacity
                                }
                                onChange={set(
                                    "maxSeatingCapacity"
                                )}
                            />
                        </FormRow>

                        <FormRow
                            label="Rate Value"
                            required
                        >
                            <InputLg
                                type="number"
                                value={
                                    tpRateSlab.rateValue
                                }
                                onChange={set(
                                    "rateValue"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Description">
                            <InputLg
                                value={
                                    tpRateSlab.description
                                }
                                onChange={set(
                                    "description"
                                )}
                            />
                        </FormRow>

                        <FormRow label="Status">
                            <Checkbox
                                value={
                                    tpRateSlab.isActive
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

export default MotorTpRateSlabCreation;