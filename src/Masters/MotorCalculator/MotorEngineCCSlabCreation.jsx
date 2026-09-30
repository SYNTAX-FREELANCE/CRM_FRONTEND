import { Box } from "@mui/joy";
import { memo, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";

import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

import { axioslogin } from "../../Connection/axios";

const MotorEngineCCSlabCreation = () => {

    const [engineCcSlab, setEngineCcSlab] = useState({
        slabCode: "",
        slabName: "",
        minCc: "",
        maxCc: "",
        description: "",
        isActive: "Active"
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const set = (field) => (e) =>
        setEngineCcSlab((prev) => ({
            ...prev,
            [field]: e.target.value
        }));

    const getEngineCcSlabById = async (id) => {
        try {
            const result = await axioslogin.get(
                `/motor/engine-cc-slab/getbyid/${id}`
            );

            const { data, success, message } = result?.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setEngineCcSlab({
                slabCode: data.slab_code || "",
                slabName: data.slab_name || "",
                minCc: data.min_cc ?? "",
                maxCc: data.max_cc ?? "",
                description: data.description || "",
                isActive: data.is_active === 1
                    ? "Active"
                    : "Inactive"
            });

        } catch (error) {
            console.error(error);

            warningNotify(
                "Failed to load engine CC slab details"
            );
        }
    };

    useEffect(() => {
        if (mode === "edit" && id) {
            getEngineCcSlabById(id);
        }
    }, [id, mode]);

    const validateEngineCcSlab = () => {

        if (
            !engineCcSlab.slabCode ||
            engineCcSlab.slabCode.trim() === ""
        ) {
            warningNotify("Slab Code is required.");
            return false;
        }

        if (engineCcSlab.slabCode.trim().length > 50) {
            warningNotify("Slab Code must not exceed 50 characters.");
            return false;
        }

        if (
            !engineCcSlab.slabName ||
            engineCcSlab.slabName.trim() === ""
        ) {
            warningNotify("Slab Name is required.");
            return false;
        }

        if (engineCcSlab.slabName.trim().length < 2) {
            warningNotify("Slab Name must be at least 2 characters.");
            return false;
        }

        if (engineCcSlab.slabName.trim().length > 150) {
            warningNotify("Slab Name must not exceed 150 characters.");
            return false;
        }

        if (
            engineCcSlab.minCc === "" ||
            engineCcSlab.minCc === null ||
            engineCcSlab.minCc === undefined
        ) {
            warningNotify("Minimum CC is required.");
            return false;
        }

        if (Number.isNaN(Number(engineCcSlab.minCc))) {
            warningNotify("Minimum CC must be a valid number.");
            return false;
        }

        if (
            engineCcSlab.maxCc !== "" &&
            engineCcSlab.maxCc !== null &&
            engineCcSlab.maxCc !== undefined
        ) {
            if (Number.isNaN(Number(engineCcSlab.maxCc))) {
                warningNotify("Maximum CC must be a valid number.");
                return false;
            }

            if (
                Number(engineCcSlab.maxCc) <
                Number(engineCcSlab.minCc)
            ) {
                warningNotify(
                    "Maximum CC cannot be less than minimum CC."
                );
                return false;
            }
        }

        if (
            engineCcSlab.description &&
            engineCcSlab.description.length > 500
        ) {
            warningNotify(
                "Description must not exceed 500 characters."
            );
            return false;
        }

        return true;
    };

    const handleReset = useCallback(() => {
        setEngineCcSlab({
            slabCode: "",
            slabName: "",
            minCc: "",
            maxCc: "",
            description: "",
            isActive: "Active"
        });
        navigate(".", { replace: true, state: null });

    }, [navigate]);

    const handleSave = async () => {

        if (!validateEngineCcSlab()) return;

        setLoading(true);

        try {

            const slabData = {
                slab_code: engineCcSlab.slabCode.trim(),
                slab_name: engineCcSlab.slabName.trim(),
                min_cc: Number(engineCcSlab.minCc),
                max_cc:
                    engineCcSlab.maxCc === "" ||
                        engineCcSlab.maxCc === null ||
                        engineCcSlab.maxCc === undefined
                        ? null
                        : Number(engineCcSlab.maxCc),
                description:
                    engineCcSlab.description?.trim() || null,
                is_active:
                    engineCcSlab.isActive === "Active" ? 1 : 0
            };

            let response;

            if (mode === "edit") {

                response = await axioslogin.patch(
                    `/motor/engine-cc-slab/update/${id}`,
                    slabData
                );

            } else {

                response = await axioslogin.post(
                    "/motor/engine-cc-slab/create",
                    slabData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Engine CC Slab updated successfully!"
                        : "Engine CC Slab created successfully!"
                );

                handleReset();

                if (mode === "edit") {

                    navigate("/home/setting/commonview", {
                        state: {
                            title: "Motor Engine CC Slab Master",
                            type: "motorengineccslab",
                            idField: "engine_cc_slab_id",
                            editRoute: "motorengineccslab",
                            navigateback: "/home/settings",

                            columns: [
                                {
                                    field: "slab_code",
                                    headerName: "Slab Code"
                                },
                                {
                                    field: "slab_name",
                                    headerName: "Slab Name"
                                },
                                {
                                    field: "min_cc",
                                    headerName: "Minimum CC"
                                },
                                {
                                    field: "max_cc",
                                    headerName: "Maximum CC"
                                },
                                {
                                    field: "description",
                                    headerName: "Description"
                                },
                                {
                                    field: "is_active",
                                    headerName: "Status",
                                    type: "status"
                                }
                            ]
                        }
                    });
                }

            } else {

                warningNotify(
                    message ||
                    (
                        mode === "edit"
                            ? "Failed to update engine CC slab"
                            : "Failed to create engine CC slab"
                    )
                );
            }

        } catch (error) {

            console.error(error);

            warningNotify(
                error.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating engine CC slab"
                        : "Error creating engine CC slab"
                )
            );

        } finally {
            setLoading(false);
        }
    };

    const handleCancel = useCallback(() => {
        handleReset();
    }, [handleReset]);

    const handleView = () => {

        navigate("/home/setting/commonview", {
            state: {
                title: "Motor Engine CC Slab Master",
                type: "motorengineccslab",
                idField: "engine_cc_slab_id",
                editRoute: "motorengineccslab",
                navigateback: "/home/settings",

                columns: [
                    {
                        field: "slab_code",
                        headerName: "Slab Code"
                    },
                    {
                        field: "slab_name",
                        headerName: "Slab Name"
                    },
                    {
                        field: "min_cc",
                        headerName: "Minimum CC"
                    },
                    {
                        field: "max_cc",
                        headerName: "Maximum CC"
                    },
                    {
                        field: "description",
                        headerName: "Description"
                    },
                    {
                        field: "is_active",
                        headerName: "Status",
                        type: "status"
                    }
                ]
            }
        });
    };

    const handleClose = () => {
        navigate("/home/settings");
    };

    return (
        <Wrapper>

            <Panel title="Motor Engine CC Slab Creation">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "60%" }}>

                        <FormRow label="Slab Code" required>
                            <InputLg
                                value={engineCcSlab.slabCode}
                                onChange={set("slabCode")}
                                placeholder="Enter slab code"
                            />
                        </FormRow>

                        <FormRow label="Slab Name" required>
                            <InputLg
                                value={engineCcSlab.slabName}
                                onChange={set("slabName")}
                                placeholder="Enter slab name"
                            />
                        </FormRow>

                        <FormRow label="Minimum CC" required>
                            <InputLg
                                type="number"
                                value={engineCcSlab.minCc}
                                onChange={set("minCc")}
                                placeholder="Enter minimum CC"
                            />
                        </FormRow>

                        <FormRow label="Maximum CC">
                            <InputLg
                                type="number"
                                value={engineCcSlab.maxCc}
                                onChange={set("maxCc")}
                                placeholder="Enter maximum CC"
                            />
                        </FormRow>

                        <FormRow label="Description">
                            <InputLg
                                value={engineCcSlab.description}
                                onChange={set("description")}
                                placeholder="Enter description"
                            />
                        </FormRow>

                        <FormRow label="Active Status">
                            <Checkbox
                                value={engineCcSlab.isActive}
                                onChange={set("isActive")}
                            />
                        </FormRow>

                    </Box>

                </Box>

                <div
                    style={{
                        borderTop: "1px solid #e5e7eb",
                        margin: "20px 0"
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        paddingTop: "8px"
                    }}
                >

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

                </div>

            </Panel>

        </Wrapper>
    );
};

export default memo(MotorEngineCCSlabCreation);