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

import { axioslogin } from "../../Connection/axios";

import {
    errorNotify,
    successNotify,
} from "../../constant/Constant";

import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";

const MotorTaxCreation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);

    const [tax, setTax] = useState({
        taxCode: "",
        taxName: "",
        taxType: "",
        taxPercentage: "",
        effectiveFrom: "",
        effectiveTo: "",
        description: "",
        isActive: "Active",
    });

    /*
     * TAX TYPES
     */

    const TaxTypeMaster = [
        {
            id: "PERCENTAGE",
            label: "Percentage",
        },
        {
            id: "FIXED",
            label: "Fixed",
        },
    ];

    /*
     * SET FORM VALUE
     */

    const set = field => event => {
        setTax(prev => ({
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
            fetchTax(editId);
        }
    }, [editId]);

    const fetchTax = async id => {
        try {
            setLoading(true);

            const response =
                await axioslogin.get(
                    `/motor/tax/getbyid/${id}`
                );

            if (response?.data?.success === 1) {

                const data =
                    response?.data?.data;

                setTax({
                    taxCode:
                        data?.tax_code || "",

                    taxName:
                        data?.tax_name || "",

                    taxType:
                        data?.tax_type || "",

                    taxPercentage:
                        data?.tax_percentage ?? "",

                    effectiveFrom:
                        data?.effective_from
                            ? String(
                                data.effective_from
                            ).substring(0, 10)
                            : "",

                    effectiveTo:
                        data?.effective_to
                            ? String(
                                data.effective_to
                            ).substring(0, 10)
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
                    "Failed to fetch tax"
                );
            }

        } catch (error) {

            console.error(error);

            errorNotify(
                "Failed to fetch tax"
            );

        } finally {

            setLoading(false);

        }
    };

    /*
     * VALIDATION
     */

    const validate = () => {

        if (!tax.taxCode?.trim()) {

            errorNotify(
                "Tax code is required"
            );

            return false;
        }

        if (tax.taxCode.length > 50) {

            errorNotify(
                "Tax code cannot exceed 50 characters"
            );

            return false;
        }

        if (!tax.taxName?.trim()) {

            errorNotify(
                "Tax name is required"
            );

            return false;
        }

        if (tax.taxName.length > 150) {

            errorNotify(
                "Tax name cannot exceed 150 characters"
            );

            return false;
        }

        const allowedTaxTypes = [
            "PERCENTAGE",
            "FIXED",
        ];

        if (
            !tax.taxType ||
            !allowedTaxTypes.includes(
                tax.taxType
            )
        ) {

            errorNotify(
                "Invalid tax type"
            );

            return false;
        }

        if (
            tax.taxPercentage === undefined ||
            tax.taxPercentage === null ||
            tax.taxPercentage === "" ||
            isNaN(
                tax.taxPercentage
            ) ||
            Number(
                tax.taxPercentage
            ) < 0
        ) {

            errorNotify(
                "Valid tax value is required"
            );

            return false;
        }

        if (
            tax.taxType ===
            "PERCENTAGE" &&
            Number(
                tax.taxPercentage
            ) > 100
        ) {

            errorNotify(
                "Tax percentage cannot exceed 100"
            );

            return false;
        }

        if (!tax.effectiveFrom) {

            errorNotify(
                "Effective from date is required"
            );

            return false;
        }

        if (
            tax.effectiveTo &&
            tax.effectiveTo <
            tax.effectiveFrom
        ) {

            errorNotify(
                "Effective to date cannot be before effective from date"
            );

            return false;
        }

        if (
            tax.description &&
            tax.description.length > 500
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

        setTax({
            taxCode: "",
            taxName: "",
            taxType: "",
            taxPercentage: "",
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

                    title:
                        "Motor Tax Master",

                    type:
                        "motortax",

                    idField:
                        "tax_id",

                    editRoute:
                        "motortax",

                    columns: [

                        {
                            field:
                                "tax_code",
                            headerName:
                                "Tax Code",
                        },

                        {
                            field:
                                "tax_name",
                            headerName:
                                "Tax Name",
                        },

                        {
                            field:
                                "tax_type",
                            headerName:
                                "Tax Type",
                        },

                        {
                            field:
                                "tax_percentage",
                            headerName:
                                "Tax Value",
                        },

                        {
                            field:
                                "effective_from",
                            headerName:
                                "Effective From",
                                   type: "date"
                        },

                        {
                            field:
                                "effective_to",
                            headerName:
                                "Effective To",
                                   type: "date"
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

    /*
     * SAVE
     */

    const handleSave = async () => {

        if (!validate()) return;

        const payload = {

            tax_code:
                tax.taxCode.trim(),

            tax_name:
                tax.taxName.trim(),

            tax_type:
                tax.taxType,

            tax_percentage:
                Number(
                    tax.taxPercentage
                ),

            effective_from:
                tax.effectiveFrom,

            effective_to:
                tax.effectiveTo === ""
                    ? null
                    : tax.effectiveTo,

            description:
                tax.description
                    ? tax.description.trim()
                    : null,

            is_active:
                String(
                    tax?.isActive
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
                        `/motor/tax/update/${editId}`,
                        payload
                    );

            } else {

                response =
                    await axioslogin.post(
                        `/motor/tax/create`,
                        payload
                    );
            }

            if (
                response?.data?.success === 1
            ) {

                successNotify(
                    response?.data?.message ||
                    `Tax ${mode === "edit"
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
                    "Failed to save tax"
                );
            }

        } catch (error) {

            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save tax"
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
                        ? "Edit Motor Tax"
                        : "Motor Tax Creation"
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
                            label="Tax Code"
                            required
                        >
                            <InputLg
                                value={
                                    tax.taxCode
                                }
                                onChange={
                                    set("taxCode")
                                }
                            />
                        </FormRow>

                        <FormRow
                            label="Tax Name"
                            required
                        >
                            <InputLg
                                value={
                                    tax.taxName
                                }
                                onChange={
                                    set("taxName")
                                }
                            />
                        </FormRow>

                        <FormRow
                            label="Tax Type"
                            required
                        >
                            <SelectLg
                                options={
                                    TaxTypeMaster
                                }
                                value={
                                    tax.taxType
                                }
                                onChange={
                                    set("taxType")
                                }
                            />
                        </FormRow>

                        <FormRow
                            label={
                                tax.taxType ===
                                    "PERCENTAGE"
                                    ? "Tax Percentage"
                                    : "Tax Value"
                            }
                            required
                        >
                            <InputLg
                                value={
                                    tax.taxPercentage
                                }
                                onChange={
                                    set(
                                        "taxPercentage"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow
                            label="Effective From"
                            required
                        >
                            <InputLg
                                type="date"
                                value={
                                    tax.effectiveFrom
                                }
                                onChange={
                                    set(
                                        "effectiveFrom"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow
                            label="Effective To"
                        >
                            <InputLg
                                type="date"
                                value={
                                    tax.effectiveTo
                                }
                                onChange={
                                    set(
                                        "effectiveTo"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow
                            label="Description"
                        >
                            <InputLg
                                value={
                                    tax.description
                                }
                                onChange={
                                    set(
                                        "description"
                                    )
                                }
                            />
                        </FormRow>

                        <FormRow
                            label="Status"
                        >
                            <Checkbox
                                value={
                                    tax.isActive
                                }
                                onChange={
                                    set(
                                        "isActive"
                                    )
                                }
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
                        onClick={
                            handleSave
                        }
                        disabled={
                            loading
                        }
                    >
                        {
                            loading
                                ? "Saving..."
                                : "Save"
                        }
                    </Button>

                    <Button
                        onClick={
                            handleCancel
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={
                            handleView
                        }
                    >
                        View
                    </Button>

                    <Button
                        onClick={
                            handleClose
                        }
                    >
                        Close
                    </Button>

                </ButtonWrapper>

            </Panel>

        </Wrapper>
    );
};

export default MotorTaxCreation;
