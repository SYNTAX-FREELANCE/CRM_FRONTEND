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
import { useMotorVehicleCategoryMaster, useMotorVehicleClassMaster } from "../../CommonCode/useQuery";
import { FieldCodeMaster } from "../../CommonCode/Reusable";

const MotorVehicleInputFieldCreation = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const editId =
        location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);


    const { data: MotorVehicleClassMaster = [] } = useMotorVehicleClassMaster()
    const { data: MotorVehicleCategoryMaster = [] } = useMotorVehicleCategoryMaster()


    const [inputField, setInputField] = useState({

        vehicleCategoryId: "",
        vehicleClassId: "",

        fieldCode: "",
        fieldLabel: "",
        fieldType: "",

        isRequired: "Active",
        isVisible: "Active",

        displayOrder: "0",

        minValue: "",
        maxValue: "",

        placeholder: "",

        isActive: "Active",

    });


    const handleFieldCodeChange = (value) => {
        const fieldCode = value?.target?.value ?? value;

        const selectedField = FieldCodeMaster.find(
            item => item.id === fieldCode
        );

        if (!selectedField) return;

        setInputField(prev => ({
            ...prev,
            fieldCode: selectedField.id,
            fieldLabel: selectedField.label,
            fieldType: selectedField.type,
            placeholder: selectedField.placeholder,
        }));
    };


    const categoryMaster =
        MotorVehicleCategoryMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.vehicle_category_id,
                label:
                    item?.category_code
                        ? `${item.category_code} - ${item.category_name}`
                        : item.category_name,
            })) || [];

    const classMaster =
        MotorVehicleClassMaster
            ?.filter(item => Number(item?.is_active) === 1 && Number(inputField?.vehicleCategoryId) === Number(item.vehicle_category_id))
            ?.map(item => ({
                id: item.vehicle_class_id,
                label:
                    item?.class_code
                        ? `${item.class_code} - ${item.class_name}`
                        : item.class_name,
            })) || [];



    /*
     * FIELD TYPES
     */

    const FieldTypeMaster = [

        {
            id: "TEXT",
            label: "Text",
        },

        {
            id: "NUMBER",
            label: "Number",
        },

        {
            id: "DATE",
            label: "Date",
        },

        {
            id: "SELECT",
            label: "Select",
        },

        {
            id: "DECIMAL",
            label: "Decimal",
        },

        {
            id: "CHECKBOX",
            label: "Checkbox",
        },

    ];

    /*
     * SET FORM VALUE
     */

    const set = field => event => {
        setInputField(prev => ({
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
            fetchInputField(editId);
        }

    }, [editId]);


    /*
     * FETCH BY ID
     */

    const fetchInputField = async id => {

        try {

            setLoading(true);

            const response =
                await axioslogin.get(
                    `/motor/vehicle-input-field/getbyid/${id}`
                );

            if (
                response?.data?.success === 1
            ) {

                const data =
                    response?.data?.data;

                setInputField({

                    vehicleCategoryId:
                        data?.vehicle_category_id
                            ? String(
                                data.vehicle_category_id
                            )
                            : "",

                    vehicleClassId:
                        data?.vehicle_class_id
                            ? String(
                                data.vehicle_class_id
                            )
                            : "",

                    fieldCode:
                        data?.field_code || "",

                    fieldLabel:
                        data?.field_label || "",

                    fieldType:
                        data?.field_type || "",

                    isRequired:
                        Number(
                            data?.is_required
                        ) === 1
                            ? "Active"
                            : "Inactive",

                    isVisible:
                        Number(
                            data?.is_visible
                        ) === 1
                            ? "Active"
                            : "Inactive",

                    displayOrder:
                        data?.display_order ??
                        "0",

                    minValue:
                        data?.min_value ??
                        "",

                    maxValue:
                        data?.max_value ??
                        "",

                    placeholder:
                        data?.placeholder ||
                        "",

                    isActive:
                        Number(
                            data?.is_active
                        ) === 1
                            ? "Active"
                            : "Inactive",

                });

            } else {

                errorNotify(
                    response?.data?.message ||
                    "Failed to fetch input field"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                "Failed to fetch input field"
            );

        } finally {

            setLoading(false);

        }

    };


    /*
     * VALIDATION
     */

    const validate = () => {

        if (
            !inputField.vehicleCategoryId
        ) {

            errorNotify(
                "Vehicle category is required"
            );

            return false;

        }


        if (
            !inputField.fieldCode?.trim()
        ) {

            errorNotify(
                "Field code is required"
            );

            return false;

        }


        if (
            inputField.fieldCode.length > 50
        ) {

            errorNotify(
                "Field code cannot exceed 50 characters"
            );

            return false;

        }


        if (
            !inputField.fieldLabel?.trim()
        ) {

            errorNotify(
                "Field label is required"
            );

            return false;

        }


        if (
            inputField.fieldLabel.length > 150
        ) {

            errorNotify(
                "Field label cannot exceed 150 characters"
            );

            return false;

        }


        const allowedFieldTypes = [
            "TEXT",
            "NUMBER",
            "DATE",
            "SELECT",
            "DECIMAL",
            "CHECKBOX"

        ];


        if (
            !inputField.fieldType ||
            !allowedFieldTypes.includes(
                inputField.fieldType
            )
        ) {

            errorNotify(
                "Invalid field type"
            );

            return false;

        }


        if (
            inputField.displayOrder ===
            "" ||
            inputField.displayOrder ===
            null ||
            isNaN(
                inputField.displayOrder
            ) ||
            Number(
                inputField.displayOrder
            ) < 0
        ) {

            errorNotify(
                "Valid display order is required"
            );

            return false;

        }


        if (
            inputField.minValue !== "" &&
            (
                isNaN(
                    inputField.minValue
                )
            )
        ) {

            errorNotify(
                "Minimum value must be a valid number"
            );

            return false;

        }


        if (
            inputField.maxValue !== "" &&
            (
                isNaN(
                    inputField.maxValue
                )
            )
        ) {

            errorNotify(
                "Maximum value must be a valid number"
            );

            return false;

        }


        if (
            inputField.minValue !== "" &&
            inputField.maxValue !== "" &&
            Number(
                inputField.minValue
            ) >
            Number(
                inputField.maxValue
            )
        ) {

            errorNotify(
                "Maximum value cannot be less than minimum value"
            );

            return false;

        }


        if (
            inputField.placeholder &&
            inputField.placeholder.length > 150
        ) {

            errorNotify(
                "Placeholder cannot exceed 150 characters"
            );

            return false;

        }


        return true;

    };


    /*
     * CANCEL
     */

    const handleCancel = useCallback(() => {

        setInputField({

            vehicleCategoryId: "",
            vehicleClassId: "",

            fieldCode: "",
            fieldLabel: "",
            fieldType: "",

            isRequired: "Active",
            isVisible: "Active",

            displayOrder: "0",

            minValue: "",
            maxValue: "",

            placeholder: "",

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
                        "Motor Vehicle Input Field Master",

                    type:
                        "motorvehicleinputfield",

                    idField:
                        "vehicle_input_field_id",

                    editRoute:
                        "motorvehicleinputfield",

                    columns: [

                        {
                            field:
                                "category_name",

                            headerName:
                                "Vehicle Category",
                        },

                        {
                            field:
                                "class_name",

                            headerName:
                                "Vehicle Class",
                        },

                        {
                            field:
                                "field_code",

                            headerName:
                                "Field Code",
                        },

                        {
                            field:
                                "field_label",

                            headerName:
                                "Field Label",
                        },

                        {
                            field:
                                "field_type",

                            headerName:
                                "Field Type",
                        },

                        {
                            field:
                                "is_required",

                            headerName:
                                "Required",

                            type:
                                "status",
                        },

                        {
                            field:
                                "is_visible",

                            headerName:
                                "Visible",

                            type:
                                "status",
                        },

                        {
                            field:
                                "display_order",

                            headerName:
                                "Display Order",
                        },

                        {
                            field:
                                "min_value",

                            headerName:
                                "Min Value",
                        },

                        {
                            field:
                                "max_value",

                            headerName:
                                "Max Value",
                        },

                        {
                            field:
                                "placeholder",

                            headerName:
                                "Placeholder",
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

            vehicle_category_id:
                Number(
                    inputField.vehicleCategoryId
                ),

            vehicle_class_id:
                inputField.vehicleClassId === ""
                    ? null
                    : Number(
                        inputField.vehicleClassId
                    ),

            field_code:
                inputField.fieldCode.trim(),

            field_label:
                inputField.fieldLabel.trim(),

            field_type:
                inputField.fieldType,

            is_required:
                inputField.isRequired ===
                    "Active"
                    ? 1
                    : 0,

            is_visible:
                inputField.isVisible ===
                    "Active"
                    ? 1
                    : 0,

            display_order:
                Number(
                    inputField.displayOrder
                ),

            min_value:
                inputField.minValue === ""
                    ? null
                    : Number(
                        inputField.minValue
                    ),

            max_value:
                inputField.maxValue === ""
                    ? null
                    : Number(
                        inputField.maxValue
                    ),

            placeholder:
                inputField.placeholder
                    ? inputField.placeholder.trim()
                    : null,

            is_active:
                String(
                    inputField.isActive
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

                        `/motor/vehicle-input-field/update/${editId}`,

                        payload

                    );

            } else {

                response =
                    await axioslogin.post(

                        `/motor/vehicle-input-field/create`,

                        payload

                    );

            }


            if (
                response?.data?.success === 1
            ) {

                successNotify(

                    response?.data?.message ||

                    `Input field ${mode === "edit"
                        ? "updated"
                        : "created"
                    } successfully`

                );


                handleCancel();


                if (
                    mode === "edit"
                ) {

                    handleView();

                }

            } else {

                errorNotify(

                    response?.data?.message ||

                    "Failed to save input field"

                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(

                error?.response?.data?.message ||

                "Failed to save input field"

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
                        ? "Edit Motor Vehicle Input Field"
                        : "Motor Vehicle Input Field Creation"
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
                            label="Vehicle Category"
                            required
                        >

                            <SelectLg
                                options={
                                    categoryMaster
                                }
                                value={
                                    inputField.vehicleCategoryId
                                }
                                onChange={
                                    set(
                                        "vehicleCategoryId"
                                    )
                                }
                            />

                        </FormRow>


                        <FormRow
                            label="Vehicle Class"
                        >

                            <SelectLg
                                options={
                                    classMaster
                                }
                                value={
                                    inputField.vehicleClassId
                                }
                                onChange={
                                    set(
                                        "vehicleClassId"
                                    )
                                }
                            />

                        </FormRow>


                        <FormRow label="Field Code" required>
                            <SelectLg
                                options={FieldCodeMaster?.map(item => ({
                                    id: item.id,
                                    label: `${item.id} - ${item.label}`,
                                }))}
                                value={inputField.fieldCode}
                                onChange={handleFieldCodeChange}
                            />
                        </FormRow>


                        <FormRow
                            label="Field Label"
                            required
                        >

                            <InputLg
                                value={
                                    inputField.fieldLabel
                                }
                                onChange={
                                    set(
                                        "fieldLabel"
                                    )
                                }
                            />

                        </FormRow>


                        <FormRow
                            label="Field Type"
                            required
                        >

                            <SelectLg
                                options={
                                    FieldTypeMaster
                                }
                                value={
                                    inputField.fieldType
                                }
                                onChange={
                                    set(
                                        "fieldType"
                                    )
                                }
                            />

                        </FormRow>


                        <FormRow
                            label="Required"
                        >

                            <Checkbox
                                value={
                                    inputField.isRequired
                                }
                                onChange={
                                    set(
                                        "isRequired"
                                    )
                                }
                            />

                        </FormRow>


                        <FormRow
                            label="Visible"
                        >

                            <Checkbox
                                value={
                                    inputField.isVisible
                                }
                                onChange={
                                    set(
                                        "isVisible"
                                    )
                                }
                            />

                        </FormRow>


                        <FormRow
                            label="Display Order"
                            required
                        >

                            <InputLg
                                type="number"
                                value={
                                    inputField.displayOrder
                                }
                                onChange={
                                    set(
                                        "displayOrder"
                                    )
                                }
                            />

                        </FormRow>


                        <FormRow
                            label="Minimum Value"
                        >

                            <InputLg
                                type="number"
                                value={
                                    inputField.minValue
                                }
                                onChange={
                                    set(
                                        "minValue"
                                    )
                                }
                            />

                        </FormRow>


                        <FormRow
                            label="Maximum Value"
                        >

                            <InputLg
                                type="number"
                                value={
                                    inputField.maxValue
                                }
                                onChange={
                                    set(
                                        "maxValue"
                                    )
                                }
                            />

                        </FormRow>


                        <FormRow
                            label="Placeholder"
                        >

                            <InputLg
                                value={
                                    inputField.placeholder
                                }
                                onChange={
                                    set(
                                        "placeholder"
                                    )
                                }
                            />

                        </FormRow>


                        <FormRow
                            label="Status"
                        >

                            <Checkbox
                                value={
                                    inputField.isActive
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


export default MotorVehicleInputFieldCreation;