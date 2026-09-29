import { Box } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";

import { axioslogin } from "../../Connection/axios";

import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

import {
    useInsuranceCompanyMaster,
    useMotorProductMaster,
    useMotorPolicyTypeMaster,
    useMotorVehicleCategoryMaster,
    useMotorVehicleClassMaster,
    useMotorFuelTypeMaster,
    useMotorVehicleUsageMaster,
    useMotorODRateMaster
} from "../../CommonCode/useQuery";


const MotorOdRateCreation = () => {

    const [odRate, setOdRate] = useState({
        insuranceCompanyId: "",
        productId: "",
        policyTypeId: "",
        vehicleCategoryId: "",
        vehicleClassId: "",
        fuelTypeId: "",
        usageId: "",
        rateType: "PERCENTAGE",
        rateValue: "",
        effectiveFrom: "",
        effectiveTo: "",
        description: "",
        isActive: "Active"
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};


    // ---------------------------------------------------------
    // MASTER DATA
    // ---------------------------------------------------------

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

    const { data: FuelTypeMaster = [] } =
        useMotorFuelTypeMaster();

    const { data: VehicleUsageMaster = [] } =
        useMotorVehicleUsageMaster();




    const { refetch: FetchOdRateMaster } =
        useMotorODRateMaster();


    // ---------------------------------------------------------
    // DROPDOWN OPTIONS
    // ---------------------------------------------------------

    const ActiveInsuranceCompanyMaster =
        Array.isArray(InsuranceCompanyMaster)
            ? InsuranceCompanyMaster
                .filter(item => item.is_active === 1)
                .map(item => ({
                    id: item.insurance_company_id,
                    label: item.company_name || item.insurance_company_name
                }))
            : [];


    const ActiveProductMaster =
        Array.isArray(ProductMaster)
            ? ProductMaster
                .filter(item => item.is_active === 1)
                .map(item => ({
                    id: item.product_id,
                    label: item.product_name
                }))
            : [];


    const ActivePolicyTypeMaster =
        Array.isArray(PolicyTypeMaster)
            ? PolicyTypeMaster
                .filter(item => item.is_active === 1)
                .map(item => ({
                    id: item.policy_type_id,
                    label: item.policy_type_name
                }))
            : [];


    const ActiveVehicleCategoryMaster =
        Array.isArray(VehicleCategoryMaster)
            ? VehicleCategoryMaster
                .filter(item => item.is_active === 1)
                .map(item => ({
                    id: item.vehicle_category_id,
                    label: item.category_name
                }))
            : [];


    const ActiveVehicleClassMaster =
        Array.isArray(VehicleClassMaster)
            ? VehicleClassMaster
                .filter(item => item.is_active === 1)
                .map(item => ({
                    id: item.vehicle_class_id,
                    label: item.class_name
                }))
            : [];


    const ActiveFuelTypeMaster =
        Array.isArray(FuelTypeMaster)
            ? FuelTypeMaster
                .filter(item => item.is_active === 1)
                .map(item => ({
                    id: item.fuel_type_id,
                    label: item.fuel_name
                }))
            : [];


    const ActiveVehicleUsageMaster =
        Array.isArray(VehicleUsageMaster)
            ? VehicleUsageMaster
                .filter(item => item.is_active === 1)
                .map(item => ({
                    id: item.usage_id,
                    label: item.usage_name
                }))
            : [];


    // ---------------------------------------------------------
    // COMMON SETTER
    // ---------------------------------------------------------

    const set = (field) => (e) =>
        setOdRate((prev) => ({
            ...prev,
            [field]: e.target.value
        }));


    // ---------------------------------------------------------
    // GET BY ID
    // ---------------------------------------------------------

    const getOdRateById = async (id) => {

        try {

            const result = await axioslogin.get(
                `/motor/od-rate/getbyid/${id}`
            );

            const { success, data, message } = result.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setOdRate({
                insuranceCompanyId:
                    data.insurance_company_id || "",

                productId:
                    data.product_id || "",

                policyTypeId:
                    data.policy_type_id || "",

                vehicleCategoryId:
                    data.vehicle_category_id || "",

                vehicleClassId:
                    data.vehicle_class_id || "",

                fuelTypeId:
                    data.fuel_type_id || "",

                usageId:
                    data.usage_id || "",

                rateType:
                    data.rate_type || "PERCENTAGE",

                rateValue:
                    data.rate_value ?? "",

                effectiveFrom:
                    data.effective_from
                        ? String(data.effective_from).substring(0, 10)
                        : "",

                effectiveTo:
                    data.effective_to
                        ? String(data.effective_to).substring(0, 10)
                        : "",

                description:
                    data.description || "",

                isActive:
                    data.is_active === 1
                        ? "Active"
                        : "Inactive"
            });

        } catch (error) {

            console.error(error);

            warningNotify(
                "Failed to load OD rate details"
            );
        }
    };


    useEffect(() => {

        if (mode === "edit" && id) {
            getOdRateById(id);
        }

    }, [id, mode]);


    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    const validateOdRate = () => {

        if (!odRate.productId) {
            warningNotify("Product is required");
            return false;
        }


        if (!odRate.policyTypeId) {
            warningNotify("Policy Type is required");
            return false;
        }


        if (
            odRate.rateValue === "" ||
            odRate.rateValue === null ||
            odRate.rateValue === undefined
        ) {
            warningNotify("Rate Value is required");
            return false;
        }


        if (isNaN(odRate.rateValue)) {
            warningNotify("Rate Value must be numeric");
            return false;
        }


        if (Number(odRate.rateValue) < 0) {
            warningNotify("Rate Value cannot be negative");
            return false;
        }


        if (
            odRate.rateType === "PERCENTAGE" &&
            Number(odRate.rateValue) > 100
        ) {
            warningNotify(
                "Percentage Rate cannot exceed 100"
            );
            return false;
        }


        if (!odRate.effectiveFrom) {
            warningNotify(
                "Effective From date is required"
            );
            return false;
        }


        if (
            odRate.effectiveTo &&
            new Date(odRate.effectiveTo) <
            new Date(odRate.effectiveFrom)
        ) {
            warningNotify(
                "Effective To date cannot be before Effective From date"
            );
            return false;
        }


        if (
            odRate.description &&
            odRate.description.trim().length > 500
        ) {
            warningNotify(
                "Description cannot exceed 500 characters"
            );
            return false;
        }


        return true;
    };


    // ---------------------------------------------------------
    // RESET
    // ---------------------------------------------------------

    const handleReset = useCallback(() => {

        setOdRate({
            insuranceCompanyId: "",
            productId: "",
            policyTypeId: "",
            vehicleCategoryId: "",
            vehicleClassId: "",
            fuelTypeId: "",
            usageId: "",
            rateType: "PERCENTAGE",
            rateValue: "",
            effectiveFrom: "",
            effectiveTo: "",
            description: "",
            isActive: "Active"
        });
        navigate(".", { replace: true, state: null });

    }, [navigate]);


    // ---------------------------------------------------------
    // SAVE
    // ---------------------------------------------------------

    const handleSave = async () => {

        if (!validateOdRate()) {
            return;
        }

        setLoading(true);

        try {

            const odRateData = {

                insurance_company_id:
                    odRate.insuranceCompanyId
                        ? Number(odRate.insuranceCompanyId)
                        : null,

                product_id:
                    Number(odRate.productId),

                policy_type_id:
                    Number(odRate.policyTypeId),

                vehicle_category_id:
                    odRate.vehicleCategoryId
                        ? Number(odRate.vehicleCategoryId)
                        : null,

                vehicle_class_id:
                    odRate.vehicleClassId
                        ? Number(odRate.vehicleClassId)
                        : null,

                fuel_type_id:
                    odRate.fuelTypeId
                        ? Number(odRate.fuelTypeId)
                        : null,

                usage_id:
                    odRate.usageId
                        ? Number(odRate.usageId)
                        : null,

                rate_type:
                    odRate.rateType,

                rate_value:
                    Number(odRate.rateValue),

                effective_from:
                    odRate.effectiveFrom,

                effective_to:
                    odRate.effectiveTo || null,

                description:
                    odRate.description?.trim() || null
            };


            let response;


            if (mode === "edit") {

                response = await axioslogin.put(
                    `/motor/od-rate/update/${id}`,
                    odRateData
                );

            } else {

                response = await axioslogin.post(
                    "/motor/od-rate/create",
                    odRateData
                );
            }


            const { success, message } =
                response.data;


            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "OD Rate updated successfully!"
                        : "OD Rate created successfully!"
                );


                FetchOdRateMaster();

                handleReset();


                if (mode === "edit") {

                    navigate(
                        "/home/setting/commonview",
                        {
                            state: {
                                title:
                                    "Motor OD Rate Master",

                                type:
                                    "motorodrate",

                                idField:
                                    "od_rate_id",

                                editRoute:
                                    "motorodrate",

                                columns: [
                                    {
                                        field:
                                            "insurance_company_name",
                                        headerName:
                                            "Insurance Company"
                                    },
                                    {
                                        field:
                                            "product_name",
                                        headerName:
                                            "Product"
                                    },
                                    {
                                        field:
                                            "policy_type_name",
                                        headerName:
                                            "Policy Type"
                                    },
                                    {
                                        field:
                                            "category_name",
                                        headerName:
                                            "Vehicle Category"
                                    },
                                    {
                                        field:
                                            "class_name",
                                        headerName:
                                            "Vehicle Class"
                                    },
                                    {
                                        field:
                                            "fuel_name",
                                        headerName:
                                            "Fuel Type"
                                    },
                                    {
                                        field:
                                            "usage_name",
                                        headerName:
                                            "Usage"
                                    },
                                    {
                                        field:
                                            "rate_type",
                                        headerName:
                                            "Rate Type"
                                    },
                                    {
                                        field:
                                            "rate_value",
                                        headerName:
                                            "Rate Value"
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
                                            "Description"
                                    },
                                    {
                                        field:
                                            "is_active",
                                        headerName:
                                            "Status",
                                        type:
                                            "status"
                                    }
                                ]
                            }
                        }
                    );
                }

            } else {

                warningNotify(
                    message ||
                    (
                        mode === "edit"
                            ? "Failed to update OD Rate"
                            : "Failed to create OD Rate"
                    )
                );
            }

        } catch (error) {

            console.error(error);

            warningNotify(
                error?.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating OD Rate"
                        : "Error creating OD Rate"
                )
            );

        } finally {

            setLoading(false);
        }
    };


    // ---------------------------------------------------------
    // CANCEL
    // ---------------------------------------------------------

    const handleCancel = () => {
        handleReset();
    };


    // ---------------------------------------------------------
    // VIEW
    // ---------------------------------------------------------

    const handleView = () => {

        navigate(
            "/home/setting/commonview",
            {
                state: {

                    title:
                        "Motor OD Rate Master",

                    type:
                        "motorodrate",

                    idField:
                        "od_rate_id",

                    editRoute:
                        "motorodrate",

                    columns: [
                        {
                            field:
                                "insurance_company_name",
                            headerName:
                                "Insurance Company"
                        },
                        {
                            field:
                                "product_name",
                            headerName:
                                "Product"
                        },
                        {
                            field:
                                "policy_type_name",
                            headerName:
                                "Policy Type"
                        },
                        {
                            field:
                                "category_name",
                            headerName:
                                "Vehicle Category"
                        },
                        {
                            field:
                                "class_name",
                            headerName:
                                "Vehicle Class"
                        },
                        {
                            field:
                                "fuel_name",
                            headerName:
                                "Fuel Type"
                        },
                        {
                            field:
                                "usage_name",
                            headerName:
                                "Usage"
                        },
                        {
                            field:
                                "rate_type",
                            headerName:
                                "Rate Type"
                        },
                        {
                            field:
                                "rate_value",
                            headerName:
                                "Rate Value"
                        },
                        {
                            field:
                                "effective_from",
                            headerName:
                                "Effective From"
                        },
                        {
                            field:
                                "effective_to",
                            headerName:
                                "Effective To"
                        },
                        {
                            field:
                                "description",
                            headerName:
                                "Description"
                        },
                        {
                            field:
                                "is_active",
                            headerName:
                                "Status",
                            type:
                                "status"
                        }
                    ]
                }
            }
        );
    };


    // ---------------------------------------------------------
    // CLOSE
    // ---------------------------------------------------------

    const handleClose = useCallback(() => {

        navigate("/home/settings");

    }, [navigate]);


    // ---------------------------------------------------------
    // UI
    // ---------------------------------------------------------

    return (

        <Wrapper>

            <Panel
                title={
                    mode === "edit"
                        ? "Edit Motor OD Rate"
                        : "Motor OD Rate Creation"
                }
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "70%" }}>


                        <FormRow
                            label="Insurance Company"
                        >
                            <SelectLg
                                value={
                                    odRate.insuranceCompanyId
                                }
                                onChange={
                                    set("insuranceCompanyId")
                                }
                                options={
                                    ActiveInsuranceCompanyMaster
                                }
                            />
                        </FormRow>


                        <FormRow
                            label="Product"
                            required
                        >
                            <SelectLg
                                value={
                                    odRate.productId
                                }
                                onChange={
                                    set("productId")
                                }
                                options={
                                    ActiveProductMaster
                                }
                            />
                        </FormRow>


                        <FormRow
                            label="Policy Type"
                            required
                        >
                            <SelectLg
                                value={
                                    odRate.policyTypeId
                                }
                                onChange={
                                    set("policyTypeId")
                                }
                                options={
                                    ActivePolicyTypeMaster
                                }
                            />
                        </FormRow>


                        <FormRow
                            label="Vehicle Category"
                        >
                            <SelectLg
                                value={
                                    odRate.vehicleCategoryId
                                }
                                onChange={
                                    set("vehicleCategoryId")
                                }
                                options={
                                    ActiveVehicleCategoryMaster
                                }
                            />
                        </FormRow>


                        <FormRow
                            label="Vehicle Class"
                        >
                            <SelectLg
                                value={
                                    odRate.vehicleClassId
                                }
                                onChange={
                                    set("vehicleClassId")
                                }
                                options={
                                    ActiveVehicleClassMaster
                                }
                            />
                        </FormRow>


                        <FormRow
                            label="Fuel Type"
                        >
                            <SelectLg
                                value={
                                    odRate.fuelTypeId
                                }
                                onChange={
                                    set("fuelTypeId")
                                }
                                options={
                                    ActiveFuelTypeMaster
                                }
                            />
                        </FormRow>


                        <FormRow
                            label="Usage"
                        >
                            <SelectLg
                                value={
                                    odRate.usageId
                                }
                                onChange={
                                    set("usageId")
                                }
                                options={
                                    ActiveVehicleUsageMaster
                                }
                            />
                        </FormRow>


                        <FormRow
                            label="Rate Type"
                            required
                        >
                            <SelectLg
                                value={
                                    odRate.rateType
                                }
                                onChange={
                                    set("rateType")
                                }
                                options={[
                                    {
                                        id: "PERCENTAGE",
                                        label: "Percentage"
                                    },
                                    {
                                        id: "FIXED",
                                        label: "Fixed"
                                    }
                                ]}
                            />
                        </FormRow>


                        <FormRow
                            label="Rate Value"
                            required
                        >
                            <InputLg
                                value={
                                    odRate.rateValue
                                }
                                onChange={
                                    set("rateValue")
                                }
                                placeholder={
                                    odRate.rateType === "PERCENTAGE"
                                        ? "Enter percentage rate"
                                        : "Enter fixed rate"
                                }
                                type="number"
                            />
                        </FormRow>


                        <FormRow
                            label="Effective From"
                            required
                        >
                            <InputLg
                                value={
                                    odRate.effectiveFrom
                                }
                                onChange={
                                    set("effectiveFrom")
                                }
                                type="date"
                            />
                        </FormRow>


                        <FormRow
                            label="Effective To"
                        >
                            <InputLg
                                value={
                                    odRate.effectiveTo
                                }
                                onChange={
                                    set("effectiveTo")
                                }
                                type="date"
                            />
                        </FormRow>


                        <FormRow
                            label="Description"
                        >
                            <InputLg
                                value={
                                    odRate.description
                                }
                                onChange={
                                    set("description")
                                }
                                placeholder="Enter description"
                            />
                        </FormRow>


                        <FormRow
                            label="Active Status"
                        >
                            <Checkbox
                                value={
                                    odRate.isActive
                                }
                                onChange={
                                    set("isActive")
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
                            "20px 0"
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


export default MotorOdRateCreation;
