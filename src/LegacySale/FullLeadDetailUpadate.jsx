
import React, { useCallback, useState } from "react";
import { Box, Checkbox, Divider, FormControlLabel, Typography, useTheme } from "@mui/material";
import { CheckCircle, DirectionsCar, ReceiptLong } from "@mui/icons-material";

import FormRow from "../Settings/CommonMasterComponent/FormRow";
import InputLg from "../Settings/CommonMasterComponent/InputLg";
import InputDate from "../Settings/CommonMasterComponent/InputDate";
import Button from "../Settings/CommonMasterComponent/Button";
import ButtonWrapper from "../Settings/CommonMasterComponent/ButtonWrapper";
import PersonIcon from '@mui/icons-material/Person';


import { axioslogin } from "../Connection/axios";
import {
    errorNotify,
    getAuthUser,
    successNotify,
    warningNotify,
} from "../constant/Constant";
import PreviousCustomerHeader from "./Components/PreviousCustomerHeader";
import ExpandableSection from "./Components/ExpandableSection";
import { useInsuranceCompanyMaster } from "../CommonCode/useQuery";
import PreviousSaleDetailsForm from "./Components/PreviousSaleDetailsForm";
import SectionHeader from "./Components/SectionHeader";
import GlobalLoader from "../CommonComponents/GlobalLoader";

const FullLeadDetailUpadate = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [loading, setLoading] = useState(false);
    const [isPreviousCustomer, setIsPreviousCustomer] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState('')
    const { data: InsuranceCompanyMasterDetail } =
        useInsuranceCompanyMaster();

    const authUser = getAuthUser();
    const { role, id } = authUser ?? {}


    const isEmployee = role?.toUpperCase() === 'EMPLOYEE';







    // =========================================================
    // CUSTOMER DETAILS
    // =========================================================
    const [customer, setCustomer] = useState({
        customerName: "",
        mobileNumber1: "",
        mobileNumber2: "",
        email: "",
        address: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
    });

    // =========================================================
    // VEHICLE DETAILS
    // =========================================================
    const [vehicle, setVehicle] = useState({
        registrationNumber: "",
        rto: "",
        registrationData: "",
        model: "",
        vehicleMaker: "",
        engineNumber: "",
        chassisNumber: "",
        vehicleClass: "",
        vehicleCategory: "",
        fuelType: "",
        seatCapacity: "",
        knownPolicyExpiryDate: "",
    });

    // =========================================================
    // PREVIOUS SALE DETAILS
    // =========================================================

    const [saleData, setSaleData] = useState({
        sale_date: "",

        paid_amount: "",
        discount_amount: "",
        source_id: "",

        insurance_company_id: "",
        policy_number: "",
        renewal_cycle: "",
        start_date: "",
        expiry_date: "",

        premium_amount: "",
        insured_declared_value: "",

        reminder_days: 30,
        renewal_year: "",

        customer_pay_type_id: "",

        payment_method_id: '',

        cp_reference_no: '',

        pm_reference_no: '',

        remarks: "",
    });



    // =========================================================
    // COMMON SETTER
    // =========================================================
    const setCustomerField = (field) => (e) => {
        let value = e.target.value;

        if (
            field === "mobileNumber1" ||
            field === "mobileNumber2"
        ) {
            value = value.replace(/\D/g, "").slice(0, 10);
        }

        if (field === "pincode") {
            value = value.replace(/\D/g, "").slice(0, 6);
        }

        setCustomer((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const setVehicleField = (field) => (e) => {
        setVehicle((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };



    // =========================================================
    // RESET
    // =========================================================
    const handleReset = () => {
        setCustomer({
            customerName: "",
            mobileNumber1: "",
            mobileNumber2: "",
            email: "",
            address: "",
            city: "",
            district: "",
            state: "",
            pincode: "",
        });

        setVehicle({
            registrationNumber: "",
            rto: "",
            registrationData: "",
            model: "",
            vehicleMaker: "",
            engineNumber: "",
            chassisNumber: "",
            vehicleClass: "",
            vehicleCategory: "",
            fuelType: "",
            seatCapacity: "",
            knownPolicyExpiryDate: "",
        });

        setSaleData({
            sale_date: "",
            paid_amount: "",
            discount_amount: "",
            source_id: "",
            insurance_company_id: "",
            policy_number: "",
            renewal_cycle: "",
            start_date: "",
            expiry_date: "",
            premium_amount: "",
            insured_declared_value: "",
            reminder_days: 30,
            renewal_year: "",
            remarks: "",
            customer_pay_type_id: "",
            payment_method_id: '',
            cp_reference_no: '',
            pm_reference_no: '',
        });;
    };

    // =========================================================
    // VALIDATE CUSTOMER
    // =========================================================
    const validateCustomer = () => {
        if (!customer.customerName.trim()) {
            warningNotify("Customer Name is required");
            return false;
        }

        if (customer.customerName.trim().length < 2) {
            warningNotify("Customer Name must be at least 2 characters");
            return false;
        }

        if (!customer.mobileNumber1.trim()) {
            warningNotify("Mobile Number 1 is required");
            return false;
        }

        if (customer.mobileNumber1.trim().length !== 10) {
            warningNotify("Mobile Number 1 must be exactly 10 digits");
            return false;
        }

        if (
            customer.mobileNumber2.trim() &&
            customer.mobileNumber2.trim().length !== 10
        ) {
            warningNotify("Mobile Number 2 must be exactly 10 digits");
            return false;
        }

        if (
            customer.pincode.trim() &&
            customer.pincode.trim().length !== 6
        ) {
            warningNotify("Pincode must be exactly 6 digits");
            return false;
        }

        return true;
    };

    // =========================================================
    // VALIDATE VEHICLE
    // =========================================================
    const validateVehicle = () => {

        // =====================================================
        // REGISTRATION NUMBER
        // =====================================================
        if (!vehicle.registrationNumber.trim()) {
            warningNotify("Registration Number is required");
            return false;
        }

        if (vehicle.registrationNumber.trim().length < 4) {
            warningNotify(
                "Registration Number must be at least 4 characters"
            );
            return false;
        }


        // =====================================================
        // RTO
        // =====================================================
        if (
            vehicle.rto &&
            typeof vehicle.rto !== "string"
        ) {
            warningNotify("RTO Details is invalid");
            return false;
        }


        // =====================================================
        // REGISTRATION DATE
        // =====================================================
        if (vehicle.registrationData) {

            const registrationDate =
                new Date(vehicle.registrationData);

            if (isNaN(registrationDate.getTime())) {
                warningNotify("Registration Date is invalid");
                return false;
            }
        }


        // =====================================================
        // MODEL
        // =====================================================
        if (
            vehicle.model &&
            typeof vehicle.model !== "string"
        ) {
            warningNotify("Vehicle Model is invalid");
            return false;
        }


        // =====================================================
        // VEHICLE MAKER
        // =====================================================
        if (
            vehicle.vehicleMaker &&
            typeof vehicle.vehicleMaker !== "string"
        ) {
            warningNotify("Vehicle Maker is invalid");
            return false;
        }


        // =====================================================
        // ENGINE NUMBER
        // =====================================================
        if (
            vehicle.engineNumber &&
            typeof vehicle.engineNumber !== "string"
        ) {
            warningNotify("Engine Number is invalid");
            return false;
        }


        // =====================================================
        // CHASSIS NUMBER
        // =====================================================
        if (
            vehicle.chassisNumber &&
            typeof vehicle.chassisNumber !== "string"
        ) {
            warningNotify("Chassis Number is invalid");
            return false;
        }


        // =====================================================
        // VEHICLE CLASS
        // =====================================================
        if (
            vehicle.vehicleClass &&
            typeof vehicle.vehicleClass !== "string"
        ) {
            warningNotify("Vehicle Class is invalid");
            return false;
        }


        // =====================================================
        // VEHICLE CATEGORY
        // =====================================================
        if (
            vehicle.vehicleCategory &&
            typeof vehicle.vehicleCategory !== "string"
        ) {
            warningNotify("Vehicle Category is invalid");
            return false;
        }


        // =====================================================
        // FUEL TYPE
        // =====================================================
        if (
            vehicle.fuelType &&
            typeof vehicle.fuelType !== "string"
        ) {
            warningNotify("Fuel Type is invalid");
            return false;
        }


        // =====================================================
        // SEAT CAPACITY
        // =====================================================
        if (
            vehicle.seatCapacity !== "" &&
            vehicle.seatCapacity !== null &&
            vehicle.seatCapacity !== undefined
        ) {

            const seatCapacity =
                Number(vehicle.seatCapacity);

            if (
                !Number.isInteger(seatCapacity) ||
                seatCapacity < 0
            ) {
                warningNotify(
                    "Seat Capacity must be a valid number"
                );
                return false;
            }
        }


        // =====================================================
        // KNOWN POLICY EXPIRY DATE
        // =====================================================
        if (!vehicle.knownPolicyExpiryDate) {
            warningNotify(
                "Known Policy Expiry Date is required"
            );
            return false;
        }

        const expiryDate =
            new Date(vehicle.knownPolicyExpiryDate);

        if (isNaN(expiryDate.getTime())) {
            warningNotify(
                "Known Policy Expiry Date is invalid"
            );
            return false;
        }


        // =====================================================
        // ALL VEHICLE VALIDATION PASSED
        // =====================================================
        return true;
    };

    // =========================================================
    // VALIDATE SALE
    // =========================================================
    const validateSale = () => {


        // 
        // PREVIOUS SALE DATE
        // 
        if (!saleData.sale_date) {
            warningNotify("Previous Sale Date is required");
            return false;
        }

        // 
        // INSURANCE COMPANY
        // 
        if (
            saleData.insurance_company_id === "" ||
            saleData.insurance_company_id === null ||
            saleData.insurance_company_id === undefined
        ) {
            warningNotify("Insurance Company is required");
            return false;
        }

        // 
        // POLICY NUMBER
        // 
        if (!saleData.policy_number?.trim()) {
            warningNotify("Policy Number is required");
            return false;
        }

        if (saleData.policy_number.trim().length < 3) {
            warningNotify("Policy Number must be at least 3 characters");
            return false;
        }

        // 
        // RENEWAL CYCLE
        // 
        if (!saleData.renewal_cycle) {
            warningNotify("Renewal Cycle is required");
            return false;
        }

        // 
        // START DATE
        // 
        if (!saleData.start_date) {
            warningNotify("Start Date is required");
            return false;
        }

        // 
        // EXPIRY DATE
        // 
        if (!saleData.expiry_date) {
            warningNotify("Expiry Date is required");
            return false;
        }

        // Expiry date cannot be before start date
        if (
            saleData.start_date &&
            saleData.expiry_date &&
            new Date(saleData.expiry_date) < new Date(saleData.start_date)
        ) {
            warningNotify("Expiry Date cannot be before Start Date");
            return false;
        }

        // 
        // SOURCE
        // 
        if (
            saleData.source_id === "" ||
            saleData.source_id === null ||
            saleData.source_id === undefined
        ) {
            warningNotify("Source is required");
            return false;
        }

        // 
        // PREMIUM AMOUNT
        // 
        if (
            saleData.premium_amount === "" ||
            saleData.premium_amount === null ||
            saleData.premium_amount === undefined
        ) {
            warningNotify("Premium Amount is required");
            return false;
        }

        const premiumAmount = Number(saleData.premium_amount);

        if (!Number.isFinite(premiumAmount)) {
            warningNotify("Premium Amount must be a valid number");
            return false;
        }

        if (premiumAmount < 0) {
            warningNotify("Premium Amount cannot be negative");
            return false;
        }

        // 
        // INSURED DECLARED VALUE / NET AMOUNT
        // 
        if (
            saleData.insured_declared_value === "" ||
            saleData.insured_declared_value === null ||
            saleData.insured_declared_value === undefined
        ) {
            warningNotify("Net Amount is required");
            return false;
        }

        const insuredDeclaredValue = Number(
            saleData.insured_declared_value
        );

        if (!Number.isFinite(insuredDeclaredValue)) {
            warningNotify("Net Amount must be a valid number");
            return false;
        }

        if (insuredDeclaredValue < 0) {
            warningNotify("Net Amount cannot be negative");
            return false;
        }

        // 
        // PAID AMOUNT
        // 
        if (
            saleData.paid_amount === "" ||
            saleData.paid_amount === null ||
            saleData.paid_amount === undefined
        ) {
            warningNotify("Paid Amount is required");
            return false;
        }

        const paidAmount = Number(saleData.paid_amount);

        if (!Number.isFinite(paidAmount)) {
            warningNotify("Paid Amount must be a valid number");
            return false;
        }

        if (paidAmount < 0) {
            warningNotify("Paid Amount cannot be negative");
            return false;
        }

        // Paid amount cannot exceed premium
        if (paidAmount > premiumAmount) {
            warningNotify(
                "Paid Amount cannot be greater than Premium Amount"
            );
            return false;
        }

        // 
        // DISCOUNT AMOUNT
        // 
        const discountAmount = Number(saleData.discount_amount);

        if (!Number.isFinite(discountAmount)) {
            warningNotify("Discount Amount must be a valid number");
            return false;
        }

        if (discountAmount < 0) {
            warningNotify("Discount Amount cannot be negative");
            return false;
        }

        // Discount must equal Premium - Paid
        const calculatedDiscount = premiumAmount - paidAmount;

        if (discountAmount !== calculatedDiscount) {
            warningNotify(
                "Discount Amount is not matching Premium Amount and Paid Amount"
            );
            return false;
        }

        // 
        // REMINDER DAYS
        // 
        const allowedReminderDays = [7, 15, 30, 45, 60];

        if (!allowedReminderDays.includes(Number(saleData.reminder_days))) {
            warningNotify("Please select a valid Reminder");
            return false;
        }

        // 
        // RENEWAL YEAR
        // 
        if (
            saleData.renewal_year === "" ||
            saleData.renewal_year === null ||
            saleData.renewal_year === undefined
        ) {
            warningNotify("Renewal Year is required");
            return false;
        }

        const renewalYear = Number(saleData.renewal_year);

        if (!Number.isInteger(renewalYear)) {
            warningNotify("Renewal Year must be a valid year");
            return false;
        }

        if (renewalYear < 2000 || renewalYear > 2100) {
            warningNotify("Renewal Year must be between 2000 and 2100");
            return false;
        }

        // 
        // REMARKS
        // 
        if (saleData.remarks?.trim().length > 500) {
            warningNotify("Remarks cannot exceed 500 characters");
            return false;
        }

        // 
        // ALL VALID
        // 
        return true;

    };


    // =========================================================
    // SAVE EVERYTHING
    // =========================================================
    const handleSave = async () => {
        if (selectedEmployee === "") return warningNotify("Please Select Employee Before Submitting!");
        if (!validateCustomer()) return;
        if (!validateVehicle()) return;
        if (!validateSale()) return;

        setLoading(true);

        try {
            /*
             * ONE PAYLOAD
             *
             * Backend should save:
             *
             * 1. Customer
             * 2. Vehicle
             * 3. Lead / Sale
             * 4. Status = SOLD
             * 5. Previous Customer = 1
             *
             * inside ONE DATABASE TRANSACTION.
             */

            const payload = {
                customer: {
                    customer_name: customer.customerName.trim(),
                    mobile_number_1: customer.mobileNumber1.trim(),
                    mobile_number_2: customer.mobileNumber2.trim() || null,
                    email: customer.email.trim() || null,
                    address: customer.address.trim() || null,
                    city: customer.city.trim() || null,
                    district: customer.district.trim() || null,
                    state: customer.state.trim() || null,
                    pincode: customer.pincode.trim() || null,
                    is_active: 1,
                    // This page is ONLY for previous customers
                    is_previous_customer: 1,
                    created_by: id
                },
                vehicle: {
                    registration_number:
                        vehicle.registrationNumber
                            .trim()
                            .toUpperCase(),

                    rto: vehicle.rto.trim() || null,
                    registration_date: vehicle.registrationData || null,
                    model: vehicle.model.trim() || null,

                    vehicle_maker:
                        vehicle.vehicleMaker.trim() || null,

                    engine_number:
                        vehicle.engineNumber.trim() || null,

                    chassis_number:
                        vehicle.chassisNumber.trim() || null,

                    vehicle_class:
                        vehicle.vehicleClass.trim() || null,

                    vehicle_category:
                        vehicle.vehicleCategory.trim() || null,

                    fuel_type:
                        vehicle.fuelType || null,

                    seat_capacity:
                        vehicle.seatCapacity || null,

                    known_policy_expiry_date:
                        vehicle.knownPolicyExpiryDate || null,

                    expiry_date:
                        vehicle.knownPolicyExpiryDate || null,
                    created_by: id
                },

                sale: {
                    sale_date: saleData.sale_date || null,

                    paid_amount:
                        saleData.paid_amount || null,

                    discount_amount:
                        saleData.discount_amount || null,

                    source_id:
                        saleData.source_id || null,

                    insurance_company_id:
                        saleData.insurance_company_id || null,

                    policy_number:
                        saleData.policy_number?.trim() || null,

                    renewal_cycle:
                        saleData.renewal_cycle || null,

                    start_date:
                        saleData.start_date || null,

                    expiry_date:
                        saleData.expiry_date || null,

                    premium_amount:
                        saleData.premium_amount || null,

                    insured_declared_value:
                        saleData.insured_declared_value || null,

                    reminder_days:
                        saleData.reminder_days || 30,

                    renewal_year:
                        saleData.renewal_year || null,

                    remarks:
                        saleData.remarks?.trim() || null,

                    status: "SOLD",

                    is_previous_customer: isPreviousCustomer,

                    customer_pay_type_id: saleData.customer_pay_type_id,

                    payment_method_id: saleData.payment_method_id,

                    cp_reference_no: saleData.cp_reference_no,

                    pm_reference_no: saleData.pm_reference_no,
                },
                lead: {
                    assigned_to: selectedEmployee,
                    status_id: 5,
                    work_status: 'COMPLETED',
                    is_locked: 1
                }
            };

            // =================================================
            // SINGLE API CALL
            // ================================================

            const response = await axioslogin.post(
                "/customer/create-previous-customer",
                payload
            );

            const { success, message } = response.data;

            if (success === 1) {
                successNotify(
                    "Previous customer added successfully as SOLD!"
                );

                handleReset();
            } else {
                warningNotify(
                    message ||
                    "Failed to add previous customer"
                );
            }
        } catch (error) {
            console.error(
                "Previous Customer Save Error:",
                error
            );

            errorNotify(
                error?.response?.data?.message ||
                "Error while saving previous customer"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // CANCEL / RESET
    // =========================================================
    const handleCancel = useCallback(() => {
        handleReset();
    }, []);



    return (
        <Box sx={{ minHeight: "90vh", bgcolor: isDark ? "background.default" : "#f8fafc" }}>

            {loading && <GlobalLoader text="Submitting Please Wait!" />}
            <Box
                sx={{
                    minHeight: "90vh",
                    bgcolor: isDark
                        ? "background.default"
                        : "#f8fafc",
                }}
            >
                {/* =================================================
                    PAGE HEADER
                ================================================== */}

                <PreviousCustomerHeader
                    isEmployee={isEmployee}
                    selectedEmployee={selectedEmployee}
                    setSelectedEmployee={setSelectedEmployee}
                    isDark={isDark} />

                <Divider
                    sx={{
                        mb: 2.5,
                        borderColor: isDark
                            ? "rgba(255,255,255,0.10)"
                            : "#e2e8f0",
                    }}
                />

                {/* =================================================
                    MAIN PANEL
                ================================================== */}

                <Box>
                    <Box
                        sx={{
                            px: {
                                xs: 1,
                                sm: 2,
                                md: 3,
                            },
                            pb: 2,

                        }}
                    >
                        {/* =================================================
                            CUSTOMER SECTION
                        ================================================== */}

                        <ExpandableSection
                            isDark={isDark}
                            defaultOpen={true}
                            header={
                                <SectionHeader
                                    icon={<PersonIcon />}
                                    title="Customer Information"
                                    subtitle="Customer personal and contact details"
                                    number="01"
                                />
                            }
                        >

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(330px, 1fr))",
                                    gap: {
                                        xs: 1,
                                        md: 3,
                                    },
                                }}
                            >
                                <FormRow
                                    label="Customer Name"
                                    required
                                >
                                    <InputLg
                                        value={
                                            customer.customerName
                                        }
                                        onChange={setCustomerField(
                                            "customerName"
                                        )}
                                        placeholder="Enter customer name"
                                    />
                                </FormRow>

                                <FormRow
                                    label="Mobile Number 1"
                                    required
                                >
                                    <InputLg
                                        value={
                                            customer.mobileNumber1
                                        }
                                        onChange={setCustomerField(
                                            "mobileNumber1"
                                        )}
                                        placeholder="Enter primary mobile number"
                                    />
                                </FormRow>

                                <FormRow label="Mobile Number 2">
                                    <InputLg
                                        value={
                                            customer.mobileNumber2
                                        }
                                        onChange={setCustomerField(
                                            "mobileNumber2"
                                        )}
                                        placeholder="Enter alternate mobile number"
                                    />
                                </FormRow>

                                <FormRow label="Email Address">
                                    <InputLg
                                        value={customer.email}
                                        onChange={setCustomerField(
                                            "email"
                                        )}
                                        placeholder="Enter email address"
                                    />
                                </FormRow>

                                <FormRow label="City">
                                    <InputLg
                                        value={customer.city}
                                        onChange={setCustomerField(
                                            "city"
                                        )}
                                        placeholder="Enter city"
                                    />
                                </FormRow>

                                <FormRow label="District">
                                    <InputLg
                                        value={
                                            customer.district
                                        }
                                        onChange={setCustomerField(
                                            "district"
                                        )}
                                        placeholder="Enter district"
                                    />
                                </FormRow>

                                <FormRow label="State">
                                    <InputLg
                                        value={customer.state}
                                        onChange={setCustomerField(
                                            "state"
                                        )}
                                        placeholder="Enter state"
                                    />
                                </FormRow>

                                <FormRow label="Pincode">
                                    <InputLg
                                        value={customer.pincode}
                                        onChange={setCustomerField(
                                            "pincode"
                                        )}
                                        placeholder="Enter pincode"
                                    />
                                </FormRow>
                                <FormRow label="Previous Customers">
                                    <Checkbox
                                        value={isPreviousCustomer}
                                        onChange={(e) => setIsPreviousCustomer(e.target.checked)}
                                    />
                                </FormRow>
                            </Box>

                            <Box sx={{ mt: 1 }}>
                                <FormRow label="Address">
                                    <textarea
                                        rows={3}
                                        value={customer.address}
                                        onChange={setCustomerField(
                                            "address"
                                        )}
                                        placeholder="Enter customer address"
                                        style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            resize: "vertical",
                                            border: isDark
                                                ? "1px solid #475569"
                                                : "1px solid #d1d5db",
                                            borderRadius: "6px",
                                            padding:
                                                "8px 10px",
                                            fontSize: "13px",
                                            outline: "none",
                                            backgroundColor:
                                                isDark
                                                    ? "#1e293b"
                                                    : "#fff",
                                            color: isDark
                                                ? "#f8fafc"
                                                : "#0f172a",
                                        }}
                                    />
                                </FormRow>
                            </Box>
                        </ExpandableSection>

                        {/* =================================================
                            VEHICLE SECTION
                        ================================================== */}



                        <ExpandableSection
                            isDark={isDark}
                            defaultOpen={true}
                            header={
                                <SectionHeader
                                    icon={<DirectionsCar
                                        sx={{ fontSize: 22 }}
                                    />}
                                    title="Vehicle Information"
                                    subtitle="Enter the vehicle details associated with this customer"
                                    number="02"
                                />
                            }
                        >

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(280px, 1fr))",
                                    gap: {
                                        xs: 1,
                                        md: 2,
                                    },
                                }}
                            >
                                <FormRow
                                    label="Registration Number"
                                    required
                                >
                                    <InputLg
                                        value={
                                            vehicle.registrationNumber
                                        }
                                        onChange={setVehicleField(
                                            "registrationNumber"
                                        )}
                                        placeholder="e.g. KL01AB1234"
                                    />
                                </FormRow>

                                <FormRow label="RTO Details">
                                    <InputLg
                                        value={vehicle.rto}
                                        onChange={setVehicleField(
                                            "rto"
                                        )}
                                        placeholder="Enter RTO code"
                                    />
                                </FormRow>

                                <FormRow label="Registration Date">
                                    <InputDate
                                        value={
                                            vehicle.registrationData
                                        }
                                        onChange={setVehicleField(
                                            "registrationData"
                                        )}
                                    />
                                </FormRow>

                                <FormRow label="Policy Expiry Date" required>
                                    <input
                                        type="date"
                                        value={
                                            vehicle.knownPolicyExpiryDate
                                        }
                                        onChange={setVehicleField(
                                            "knownPolicyExpiryDate"
                                        )}
                                        style={{
                                            height: "30px",
                                            width: "100%",
                                            boxSizing:
                                                "border-box",
                                            fontSize: "13px",
                                            border: isDark
                                                ? "1px solid #475569"
                                                : "1px solid #d1d5db",
                                            borderRadius: "4px",
                                            padding: "0 8px",
                                            outline: "none",
                                            backgroundColor:
                                                isDark
                                                    ? "#1e293b"
                                                    : "#fff",
                                            color: isDark
                                                ? "#f8fafc"
                                                : "#0f172a",
                                        }}
                                    />
                                </FormRow>

                                <FormRow label="Vehicle Maker">
                                    <InputLg
                                        value={
                                            vehicle.vehicleMaker
                                        }
                                        onChange={setVehicleField(
                                            "vehicleMaker"
                                        )}
                                        placeholder="Enter vehicle manufacturer"
                                    />
                                </FormRow>

                                <FormRow label="Vehicle Model">
                                    <InputLg
                                        value={vehicle.model}
                                        onChange={setVehicleField(
                                            "model"
                                        )}
                                        placeholder="Enter vehicle model"
                                    />
                                </FormRow>

                                <FormRow label="Engine Number">
                                    <InputLg
                                        value={
                                            vehicle.engineNumber
                                        }
                                        onChange={setVehicleField(
                                            "engineNumber"
                                        )}
                                        placeholder="Enter engine number"
                                    />
                                </FormRow>

                                <FormRow label="Chassis Number">
                                    <InputLg
                                        value={
                                            vehicle.chassisNumber
                                        }
                                        onChange={setVehicleField(
                                            "chassisNumber"
                                        )}
                                        placeholder="Enter chassis number"
                                    />
                                </FormRow>

                                <FormRow label="Vehicle Class">
                                    <InputLg
                                        value={
                                            vehicle.vehicleClass
                                        }
                                        onChange={setVehicleField(
                                            "vehicleClass"
                                        )}
                                        placeholder="Enter vehicle class"
                                    />
                                </FormRow>

                                <FormRow label="Vehicle Category">
                                    <InputLg
                                        value={
                                            vehicle.vehicleCategory
                                        }
                                        onChange={setVehicleField(
                                            "vehicleCategory"
                                        )}
                                        placeholder="Enter vehicle category"
                                    />
                                </FormRow>

                                <FormRow label="Fuel Type">
                                    <select
                                        value={
                                            vehicle.fuelType
                                        }
                                        onChange={setVehicleField(
                                            "fuelType"
                                        )}
                                        style={{
                                            border: isDark
                                                ? "1px solid #475569"
                                                : "1px solid #d1d5db",
                                            borderRadius:
                                                "4px",
                                            height: "30px",
                                            width: "100%",
                                            fontSize: "13px",
                                            outline: "none",
                                            backgroundColor:
                                                isDark
                                                    ? "#1e293b"
                                                    : "#fff",
                                            color: isDark
                                                ? "#f8fafc"
                                                : "#0f172a",
                                            padding:
                                                "0 8px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <option value="">
                                            -- Select Fuel Type --
                                        </option>

                                        <option value="Petrol">
                                            Petrol
                                        </option>

                                        <option value="Diesel">
                                            Diesel
                                        </option>

                                        <option value="CNG">
                                            CNG
                                        </option>

                                        <option value="Electric">
                                            Electric
                                        </option>

                                        <option value="Hybrid">
                                            Hybrid
                                        </option>
                                    </select>
                                </FormRow>

                                <FormRow label="Seating Capacity">
                                    <InputLg
                                        value={
                                            vehicle.seatCapacity
                                        }
                                        onChange={setVehicleField(
                                            "seatCapacity"
                                        )}
                                        placeholder="Enter seating capacity"
                                    />
                                </FormRow>
                            </Box>
                        </ExpandableSection>

                        {/* =================================================
                            SALE SECTION
                        ================================================== */}

                        <ExpandableSection
                            isDark={isDark}
                            defaultOpen={false}
                            header={
                                <SectionHeader
                                    icon={
                                        <ReceiptLong
                                            sx={{ fontSize: 22 }}
                                        />
                                    }
                                    title="Previous Sale Information"
                                    subtitle="This customer was already sold before entering the CRM"
                                    number="03"
                                />
                            }
                        >
                            <PreviousSaleDetailsForm
                                saleData={saleData}
                                setSaleData={setSaleData}
                                InsuranceCompanyMasterDetail={
                                    InsuranceCompanyMasterDetail
                                }
                            />
                        </ExpandableSection>
                        {/* =================================================
                            FINAL INFORMATION
                        ================================================== */}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                px: 2,
                                py: 1.5,
                                borderRadius: "10px",
                                bgcolor: isDark
                                    ? "rgba(59,130,246,0.08)"
                                    : "#eff6ff",
                                border: "1px solid",
                                borderColor: isDark
                                    ? "rgba(59,130,246,0.18)"
                                    : "#bfdbfe",
                            }}
                        >
                            <CheckCircle
                                sx={{
                                    fontSize: 18,
                                    color: "#2563eb",
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color: isDark
                                        ? "#bfdbfe"
                                        : "#1e40af",
                                }}
                            >
                                Customer type will be saved as{" "}
                                <strong>
                                    PREVIOUS CUSTOMER
                                </strong>{" "}
                                and the lead status will be saved
                                as <strong>SOLD</strong>.
                            </Typography>
                        </Box>
                    </Box>

                    {/* =================================================
                        BUTTONS
                    ================================================== */}

                    <Box
                        sx={{
                            borderTop: "1px solid",
                            borderColor: isDark
                                ? "rgba(255,255,255,0.10)"
                                : "#e5e7eb",
                            pt: 2,
                            mt: 1,
                        }}
                    >
                        <ButtonWrapper>
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save Customer"}
                            </Button>

                            <Button
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Reset
                            </Button>
                        </ButtonWrapper>
                    </Box>
                </Box>
            </Box>
        </Box>

    );
};

export default FullLeadDetailUpadate;

