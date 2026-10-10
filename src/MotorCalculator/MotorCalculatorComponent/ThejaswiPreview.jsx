import React from 'react'
import ThejaswiQuotationPreview from './ThejaswiQuotationPreview'
import { useLocation } from 'react-router-dom';
import companylogo from '../../assets/loginimages/companylogo.png'
import FloatingBackButton from '../../CommonComponents/FloatingBackButton';
import QuotationDataUnavailable from './QuotationDataUnavailable';
import { useInsuranceCompanyMaster } from '../../CommonCode/useQuery';

const ThejaswiPreview = () => {


    const {
        data: InsuranceCompanyMaster = [],
    } = useInsuranceCompanyMaster();
    const location = useLocation();
    const calculationData = location.state?.calculationData;
    const formData = location.state?.formData;
    const categoryId = location.state?.categoryId;
    const category = location.state?.category;
    const selectedCustomer = location.state?.selectedCustomer;


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

    return (
        <div>
            <ThejaswiQuotationPreview
                calculationData={calculationData}
                formData={formData}
                VehicleDetails={VehicleDetails?.[0]}
                companylogo={companylogo}
                quoteData={{
                    quoteNo: "THJ-2026-0001",
                    customerName: CustomerName,
                    insurerName: ActiveInsurenceCompanies?.[0]?.company_name,
                    productName: formData.product_name,
                    agentName: "Thejaswi",
                    contactNo: "919633397771",
                    email: "reachus@thejaswi.in",
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
        </div>
    )
}

export default ThejaswiPreview
