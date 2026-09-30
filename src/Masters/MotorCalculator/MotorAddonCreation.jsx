import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";

import { axioslogin } from "../../Connection/axios";

import {
    errorNotify,
    successNotify,
} from "../../constant/Constant";


const MotorAddonCreation = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);



    // FORM STATE

    const [addon, setAddon] = useState({

        addonCode: "",
        addonName: "",
        description: "",

        isActive: "Active",

    });



    // SET FIELD

    const set = field => event => {

        setAddon(prev => ({

            ...prev,

            [field]:
                event?.target?.value !== undefined
                    ? event.target.value
                    : event,

        }));

    };



    // EDIT FETCH

    const fetchAddon = useCallback(async id => {

        try {

            setLoading(true);

            const response =
                await axioslogin.get(
                    `/motor/addon/getbyid/${id}`
                );


            if (response?.data?.success === 1) {

                const data =
                    response.data.data;


                setAddon({

                    addonCode:
                        data?.addon_code || "",

                    addonName:
                        data?.addon_name || "",

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
                    "Failed to fetch addon"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                "Failed to fetch addon"
            );

        } finally {

            setLoading(false);

        }

    }, []);



    useEffect(() => {

        if (editId) {

            setMode("edit");

            fetchAddon(editId);

        }

    }, [editId, fetchAddon]);



    // VALIDATION

    const validate = () => {


        // ADDON CODE

        if (!addon?.addonCode?.trim()) {

            errorNotify(
                "Addon code is required"
            );

            return false;

        }


        if (
            addon?.addonCode?.trim()?.length > 50
        ) {

            errorNotify(
                "Addon code must not exceed 50 characters"
            );

            return false;

        }



        // ADDON NAME

        if (!addon?.addonName?.trim()) {

            errorNotify(
                "Addon name is required"
            );

            return false;

        }


        if (
            addon?.addonName?.trim()?.length > 150
        ) {

            errorNotify(
                "Addon name must not exceed 150 characters"
            );

            return false;

        }



        // DESCRIPTION

        if (
            addon?.description &&
            addon?.description?.length > 500
        ) {

            errorNotify(
                "Description must not exceed 500 characters"
            );

            return false;

        }


        return true;

    };



    // CANCEL

    const handleCancel = useCallback(() => {

        setAddon({

            addonCode: "",
            addonName: "",
            description: "",

            isActive: "Active",

        });


        navigate(".", {

            replace: true,

            state: null,

        });

    }, [navigate]);



    // CLOSE

    const handleClose = () => {

        navigate("/home/settings");

    };



    // VIEW

    const handleView = () => {

        navigate(
            "/home/setting/commonview",
            {

                state: {

                    title:
                        "Motor Addon Master",

                    type:
                        "motoraddon",

                    idField:
                        "addon_id",

                    editRoute:
                        "motoraddon",

                    columns: [

                        {
                            field:
                                "addon_code",

                            headerName:
                                "Addon Code",
                        },

                        {
                            field:
                                "addon_name",

                            headerName:
                                "Addon Name",
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



    // SAVE

    const handleSave = async () => {

        if (!validate()) return;


        const payload = {

            addon_code:
                addon?.addonCode?.trim(),

            addon_name:
                addon?.addonName?.trim(),

            description:
                addon?.description
                    ? addon.description.trim()
                    : null,

            is_active:
                String(
                    addon?.isActive
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
                        `/motor/addon/update/${editId}`,
                        payload
                    );

            } else {

                response =
                    await axioslogin.post(
                        `/motor/addon/create`,
                        payload
                    );

            }


            if (response?.data?.success === 1) {

                successNotify(
                    response?.data?.message ||
                    `Addon ${
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
                    "Failed to save addon"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save addon"
            );

        } finally {

            setLoading(false);

        }

    };



    // UI

    return (

        <Wrapper>

            <Panel
                title={
                    mode === "edit"
                        ? "Edit Motor Addon"
                        : "Motor Addon Creation"
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


                        {/* ADDON CODE */}

                        <FormRow
                            label="Addon Code"
                            required
                        >

                            <InputLg
                                value={
                                    addon.addonCode
                                }

                                onChange={set(
                                    "addonCode"
                                )}
                            />

                        </FormRow>



                        {/* ADDON NAME */}

                        <FormRow
                            label="Addon Name"
                            required
                        >

                            <InputLg
                                value={
                                    addon.addonName
                                }

                                onChange={set(
                                    "addonName"
                                )}
                            />

                        </FormRow>



                        {/* DESCRIPTION */}

                        <FormRow
                            label="Description"
                        >

                            <InputLg
                                value={
                                    addon.description
                                }

                                onChange={set(
                                    "description"
                                )}
                            />

                        </FormRow>



                        {/* STATUS */}

                        <FormRow
                            label="Status"
                        >

                            <Checkbox
                                value={
                                    addon.isActive
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


export default MotorAddonCreation;