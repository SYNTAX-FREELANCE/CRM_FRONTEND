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

import { axioslogin } from "../../Connection/axios";

import {
    errorNotify,
    successNotify,
} from "../../constant/Constant";

import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";


const MotorCoverCreation = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);



    // FORM STATE


    const [cover, setCover] = useState({
        coverCode: "",
        coverName: "",
        coverType: "",
        description: "",
        isActive: "Active"
    });



    // COVER TYPE OPTIONS


    const CoverTypeOptions = [
        {
            id: "CPA",
            label: "CPA",
        },
        {
            id: "LIABILITY",
            label: "Liability",
        },
        {
            id: "PASSENGER",
            label: "Passenger",
        },
        {
            id: "DRIVER",
            label: "Driver",
        },
        {
            id: "LEGAL_LIABILITY",
            label: "Legal Liability",
        },
    ];



    // SET FIELD


    const set = field => event => {

        setCover(prev => ({
            ...prev,

            [field]:
                event?.target?.value !== undefined
                    ? event.target.value
                    : event,
        }));

    };



    // EDIT FETCH


    useEffect(() => {

        if (editId) {

            setMode("edit");

            fetchCover(editId);

        }

    }, [editId]);


    const fetchCover = async id => {

        try {

            setLoading(true);

            const response =
                await axioslogin.get(
                    `/motor/cover/getbyid/${id}`
                );


            if (response?.data?.success === 1) {

                const data =
                    response.data.data;


                setCover({

                    coverCode:
                        data?.cover_code || "",

                    coverName:
                        data?.cover_name || "",

                    coverType:
                        data?.cover_type || "",

                    description:
                        data?.description || "",

                    isActive:
                        Number(data?.is_active) === 1
                            ? "Active"
                            : "Inactive"

                });


            } else {

                errorNotify(
                    response?.data?.message ||
                    "Failed to fetch cover"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                "Failed to fetch cover"
            );

        } finally {

            setLoading(false);

        }

    };



    // VALIDATION


    const validate = () => {


        // Cover Code

        if (!cover.coverCode) {

            errorNotify(
                "Cover code is required"
            );

            return false;

        }


        if (
            cover.coverCode.trim().length > 50
        ) {

            errorNotify(
                "Cover code must not exceed 50 characters"
            );

            return false;

        }


        // Cover Name

        if (!cover.coverName) {

            errorNotify(
                "Cover name is required"
            );

            return false;

        }


        if (
            cover.coverName.trim().length > 150
        ) {

            errorNotify(
                "Cover name must not exceed 150 characters"
            );

            return false;

        }


        // Cover Type

        if (!cover.coverType) {

            errorNotify(
                "Cover type is required"
            );

            return false;

        }


        if (
            ![
                "CPA",
                "LIABILITY",
                "PASSENGER",
                "DRIVER",
                "LEGAL_LIABILITY",
            ].includes(cover.coverType)
        ) {

            errorNotify(
                "Invalid cover type"
            );

            return false;

        }


        // Description

        if (
            cover.description &&
            cover.description.length > 500
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

        setCover({

            coverCode: "",
            coverName: "",
            coverType: "",
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
                        "Motor Cover Master",

                    type:
                        "motorcover",

                    idField:
                        "cover_id",

                    editRoute:
                        "motorcover",

                    columns: [

                        {
                            field:
                                "cover_code",

                            headerName:
                                "Cover Code",
                        },

                        {
                            field:
                                "cover_name",

                            headerName:
                                "Cover Name",
                        },

                        {
                            field:
                                "cover_type",

                            headerName:
                                "Cover Type",
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
                                "status"
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

            cover_code:
                cover.coverCode.trim(),

            cover_name:
                cover.coverName.trim(),

            cover_type:
                cover.coverType,

            description:
                cover.description
                    ? cover.description.trim()
                    : null,

            is_active:
                String(cover?.isActive) === "Active"
                    ? 1
                    : 0,

        };


        try {

            setLoading(true);

            let response;


            if (mode === "edit") {

                response =
                    await axioslogin.put(
                        `/motor/cover/update/${editId}`,
                        payload
                    );

            } else {

                response =
                    await axioslogin.post(
                        `/motor/cover/create`,
                        payload
                    );

            }


            if (response?.data?.success === 1) {

                successNotify(
                    response?.data?.message ||
                    `Cover ${mode === "edit"
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
                    "Failed to save cover"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save cover"
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
                        ? "Edit Motor Cover"
                        : "Motor Cover Creation"
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


                        {/* COVER CODE */}

                        <FormRow
                            label="Cover Code"
                            required
                        >

                            <InputLg
                                value={
                                    cover.coverCode
                                }

                                onChange={set(
                                    "coverCode"
                                )}
                            />

                        </FormRow>


                        {/* COVER NAME */}

                        <FormRow
                            label="Cover Name"
                            required
                        >

                            <InputLg
                                value={
                                    cover.coverName
                                }

                                onChange={set(
                                    "coverName"
                                )}
                            />

                        </FormRow>


                        {/* COVER TYPE */}

                        <FormRow
                            label="Cover Type"
                            required
                        >

                            <SelectLg
                                options={
                                    CoverTypeOptions
                                }

                                value={
                                    cover.coverType
                                }

                                onChange={set(
                                    "coverType"
                                )}
                            />

                        </FormRow>


                        {/* DESCRIPTION */}

                        <FormRow
                            label="Description"
                        >

                            <InputLg
                                value={
                                    cover.description
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
                                    cover.isActive
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


export default MotorCoverCreation;
