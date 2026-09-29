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

const MotorGVWSlabCreation = () => {

    const [gvwSlab, setGvwSlab] = useState({
        slabCode: "",
        slabName: "",
        minGvw: "",
        maxGvw: "",
        description: "",
        isActive: "Active"
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const set = (field) => (e) =>
        setGvwSlab((prev) => ({
            ...prev,
            [field]: e.target.value
        }));

    const getGvwSlabById = async (id) => {
        try {

            const result = await axioslogin.get(
                `/motor/gvw-slab/getbyid/${id}`
            );

            const { data, success, message } = result?.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setGvwSlab({
                slabCode: data.slab_code || "",
                slabName: data.slab_name || "",
                minGvw: data.min_gvw ?? "",
                maxGvw: data.max_gvw ?? "",
                description: data.description || "",
                isActive: data.is_active === 1
                    ? "Active"
                    : "Inactive"
            });

        } catch (error) {

            console.error(error);

            warningNotify(
                "Failed to load GVW slab details"
            );
        }
    };

    useEffect(() => {
        if (mode === "edit" && id) {
            getGvwSlabById(id);
        }
    }, [id, mode]);

    const validateGvwSlab = () => {

        if (
            !gvwSlab.slabCode ||
            gvwSlab.slabCode.trim() === ""
        ) {
            warningNotify("Slab Code is required.");
            return false;
        }

        if (gvwSlab.slabCode.trim().length > 50) {
            warningNotify(
                "Slab Code must not exceed 50 characters."
            );
            return false;
        }

        if (
            !gvwSlab.slabName ||
            gvwSlab.slabName.trim() === ""
        ) {
            warningNotify("Slab Name is required.");
            return false;
        }

        if (gvwSlab.slabName.trim().length < 2) {
            warningNotify(
                "Slab Name must be at least 2 characters."
            );
            return false;
        }

        if (gvwSlab.slabName.trim().length > 150) {
            warningNotify(
                "Slab Name must not exceed 150 characters."
            );
            return false;
        }

        if (
            gvwSlab.minGvw === "" ||
            gvwSlab.minGvw === null ||
            gvwSlab.minGvw === undefined
        ) {
            warningNotify("Minimum GVW is required.");
            return false;
        }

        if (Number.isNaN(Number(gvwSlab.minGvw))) {
            warningNotify(
                "Minimum GVW must be a valid number."
            );
            return false;
        }

        if (Number(gvwSlab.minGvw) < 0) {
            warningNotify(
                "Minimum GVW cannot be negative."
            );
            return false;
        }

        if (
            gvwSlab.maxGvw !== "" &&
            gvwSlab.maxGvw !== null &&
            gvwSlab.maxGvw !== undefined
        ) {

            if (Number.isNaN(Number(gvwSlab.maxGvw))) {
                warningNotify(
                    "Maximum GVW must be a valid number."
                );
                return false;
            }

            if (
                Number(gvwSlab.maxGvw) <
                Number(gvwSlab.minGvw)
            ) {
                warningNotify(
                    "Maximum GVW cannot be less than minimum GVW."
                );
                return false;
            }
        }

        if (
            gvwSlab.description &&
            gvwSlab.description.trim().length > 500
        ) {
            warningNotify(
                "Description must not exceed 500 characters."
            );
            return false;
        }

        return true;
    };

    const handleReset = useCallback(() => {

        setGvwSlab({
            slabCode: "",
            slabName: "",
            minGvw: "",
            maxGvw: "",
            description: "",
            isActive: "Active"
        });
        navigate(".", { replace: true, state: null });

    }, [navigate]);


    const handleSave = async () => {

        if (!validateGvwSlab()) return;

        setLoading(true);

        try {

            const slabData = {
                slab_code: gvwSlab.slabCode.trim(),
                slab_name: gvwSlab.slabName.trim(),
                min_gvw: Number(gvwSlab.minGvw),

                max_gvw:
                    gvwSlab.maxGvw === "" ||
                        gvwSlab.maxGvw === null ||
                        gvwSlab.maxGvw === undefined
                        ? null
                        : Number(gvwSlab.maxGvw),

                description:
                    gvwSlab.description?.trim() || null
            };

            let response;

            if (mode === "edit") {

                // Backend uses PUT for update
                response = await axioslogin.put(
                    `/motor/gvw-slab/update/${id}`,
                    slabData
                );

            } else {

                response = await axioslogin.post(
                    "/motor/gvw-slab/create",
                    slabData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "GVW Slab updated successfully!"
                        : "GVW Slab created successfully!"
                );

                handleReset();

                if (mode === "edit") {

                    navigate("/home/setting/commonview", {
                        state: {
                            title: "Motor GVW Slab Master",
                            type: "motorgvwslab",
                            idField: "gvw_slab_id",
                            editRoute: "motorgvwslab",
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
                                    field: "min_gvw",
                                    headerName: "Minimum GVW"
                                },
                                {
                                    field: "max_gvw",
                                    headerName: "Maximum GVW"
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
                            ? "Failed to update GVW slab"
                            : "Failed to create GVW slab"
                    )
                );
            }

        } catch (error) {

            console.error(error);

            warningNotify(
                error.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating GVW slab"
                        : "Error creating GVW slab"
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
                title: "Motor GVW Slab Master",
                type: "motorgvwslab",
                idField: "gvw_slab_id",
                editRoute: "motorgvwslab",
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
                        field: "min_gvw",
                        headerName: "Minimum GVW"
                    },
                    {
                        field: "max_gvw",
                        headerName: "Maximum GVW"
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

            <Panel title="Motor GVW Slab Creation">

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
                                value={gvwSlab.slabCode}
                                onChange={set("slabCode")}
                                placeholder="Enter slab code"
                            />
                        </FormRow>

                        <FormRow label="Slab Name" required>
                            <InputLg
                                value={gvwSlab.slabName}
                                onChange={set("slabName")}
                                placeholder="Enter slab name"
                            />
                        </FormRow>

                        <FormRow label="Minimum GVW" required>
                            <InputLg
                                type="number"
                                value={gvwSlab.minGvw}
                                onChange={set("minGvw")}
                                placeholder="Enter minimum GVW"
                            />
                        </FormRow>

                        <FormRow label="Maximum GVW">
                            <InputLg
                                type="number"
                                value={gvwSlab.maxGvw}
                                onChange={set("maxGvw")}
                                placeholder="Enter maximum GVW"
                            />
                        </FormRow>

                        <FormRow label="Description">
                            <InputLg
                                value={gvwSlab.description}
                                onChange={set("description")}
                                placeholder="Enter description"
                            />
                        </FormRow>

                        <FormRow label="Active Status">
                            <Checkbox
                                value={gvwSlab.isActive}
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

export default memo(MotorGVWSlabCreation);