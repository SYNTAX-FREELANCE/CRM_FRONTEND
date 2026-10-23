import React, { useCallback, useState } from 'react'
import ThejaswiQuotationPreview from './ThejaswiQuotationPreview'
import { useLocation } from 'react-router-dom';
import FloatingBackButton from '../../CommonComponents/FloatingBackButton';
import QuotationDataUnavailable from './QuotationDataUnavailable';
import { useAllEmployeeDetails, useInsuranceCompanyMaster } from '../../CommonCode/useQuery';
import { errorNotify, getAuthUser, infoNotify, successNotify } from '../../constant/Constant';
import createQuotationPayload from '../MotorHooks/CalculateQuotationDetails';
import { axioslogin } from '../../Connection/axios';
import GlobalLoader from '../../CommonComponents/GlobalLoader';
import { BACKEND_IMAGE } from '../../constant/Static';
import GoBackToLead from './GoBackToLead';

const ThejaswiPreview = () => {

    const authUser = getAuthUser();

    const [loading, setLoading] = useState(false)
    const { id: createdBy, emp_name } = authUser ?? {};
    const [quotationdata, setQuotataionData] = useState(null)



    const {
        data: InsuranceCompanyMaster = [],
    } = useInsuranceCompanyMaster();

    const { data: employeeListData = [], } = useAllEmployeeDetails();

    const employees = employeeListData?.find(emp => Number(emp.user_id) === Number(createdBy))

    const location = useLocation();
    const calculationData = location.state?.calculationData;
    const formData = location.state?.formData;
    const categoryId = location.state?.categoryId;
    const category = location.state?.category;
    const selectedCustomer = location.state?.selectedCustomer;
    const coverInputValues = location.state?.coverInputValues;
    const lead = location.state?.lead;


    const validateQuotation = useCallback(() => {
        const errors = [];

        if (!formData) {
            errors.push("Vehicle and policy form data is missing.");
        }

        if (!calculationData) {
            errors.push("Quotation calculation data is missing.");
        }

        if (!selectedCustomer) {
            errors.push("Please select a customer.");
        }

        if (!createdBy) {
            errors.push("Logged-in employee details are missing.");
        }

        if (formData) {
            if (!formData.policy_start_date) {
                errors.push("Policy start date is required.");
            }

            if (!formData.product_id) {
                errors.push("Please select a product.");
            }

            if (!formData.policy_type_id) {
                errors.push("Please select a policy type.");
            }

            if (!formData.vehicle_category_id && !category?.vehicle_category_id) {
                errors.push("Vehicle category is required.");
            }
        }
        return errors;
    }, [
        formData,
        calculationData,
        selectedCustomer,
        createdBy,
        category,
    ]);





    const handleCreateQuotation = useCallback(async () => {

        const errors = validateQuotation();

        if (quotationdata != null)
            return infoNotify(`Quotation ${quotationdata?.quotation_number} Already Exists`)

        if (errors.length > 0) {
            infoNotify(
                "Please correct the following before generating the quotation:\n\n" +
                errors.map((error, index) => `${index + 1}. ${error}`).join("\n")
            );
            return;
        }
        try {


            setLoading(true);

            const payload = createQuotationPayload({
                formData,
                calculationData,
                category,
                selectedCustomer,
                coverInputValues,
                lead,
                createdBy,
            });

            const response = await axioslogin.post(
                "/motor/calculation/create",
                payload
            );
            const { success, data, message } = response?.data ?? {};
            if (success === 1) {
                successNotify(message)
                setQuotataionData(data)
            } else {
                errorNotify(message)
            }
        } catch (error) {
            console.error(
                "Failed to create quotation:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    }, [
        createQuotationPayload,
        formData,
        calculationData,
        category,
        selectedCustomer,
        lead,
        createdBy,
        axioslogin,
        quotationdata
    ]);


    if (!calculationData || !formData || !selectedCustomer) {
        return <QuotationDataUnavailable />;
    }

    const ActiveInsurenceCompanies = InsuranceCompanyMaster?.filter(item => item?.insurance_company_id === formData?.insurance_company_id);

    const Customer = selectedCustomer?.customer ||
        selectedCustomer ||
        {}
    const CustomerName = Customer?.customer_name || "Customer"
    const VehicleDetails = selectedCustomer?.vehicles ||
        selectedCustomer ||
        {}

    const imagePath = ActiveInsurenceCompanies?.[0]?.company_image;
    const CompanyIMage = `${BACKEND_IMAGE}${imagePath}`

    return (
        <div>

            {
                loading && <GlobalLoader text="Generating Please Wait" />
            }
            <ThejaswiQuotationPreview
                calculationData={calculationData}
                formData={formData}
                VehicleDetails={VehicleDetails?.[0]}
                createQuotation={handleCreateQuotation}
                coverInputValues={coverInputValues}
                quoteData={{
                    quoteNo: quotationdata?.quotation_number || "QOUT-3887JDS-EXMP- ****",
                    customerName: CustomerName,
                    insurerName: ActiveInsurenceCompanies?.[0]?.company_name,
                    coloreCode: ActiveInsurenceCompanies?.[0]?.company_color,
                    InsuranceCompanyImage: CompanyIMage,
                    productName: formData.product_name,
                    agentName: emp_name || "Employee",
                    contactNo: employees?.mobile_number_1 || "+91 9656 *** **4",
                    email: employees?.email || "example@gmail.com",
                }}
            />

            <FloatingBackButton
                navigateTo={`/home/motor-calculator/category/${categoryId}`}
                state={{
                    formData,
                    calculationData,
                    categoryId,
                    category,
                    selectedCustomer
                }} />


            <GoBackToLead
                leadId={lead?.lead_id}
                statusId={lead?.status_id}
            />
        </div>
    )
}

export default ThejaswiPreview
