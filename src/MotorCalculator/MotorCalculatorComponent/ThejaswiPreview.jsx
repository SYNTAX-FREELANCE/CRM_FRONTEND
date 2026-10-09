import React from 'react'
import ThejaswiQuotationPreview from './ThejaswiQuotationPreview'
import { useLocation, useNavigate } from 'react-router-dom';
import  companylogo from '../../assets/loginimages/companylogo.png'
const ThejaswiPreview = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const calculationData = location.state?.calculationData;
    const formData = location.state?.formData;
   

    if (!calculationData || !formData) {
        return (<div style={{ padding: 24 }}>
            <p>Quotation data is unavailable.</p>
            <button onClick={() => navigate(-1)}>
                Back to Calculator </button>
        </div>);
    }
    return (
        <div>
            <ThejaswiQuotationPreview
                calculationData={calculationData}
                formData={formData}
                companylogo={companylogo}
                quoteData={{
                    quoteNo: "THJ-2026-0001",
                    customerName: formData.customer_name || "Customer",
                    insurerName: formData.insurance_company_name,
                    productName: formData.product_name,
                    agentName: "Thejaswi",
                    contactNo: "919633397771",
                    email: "reachus@thejaswi.in",
                }}
            />
        </div>
    )
}

export default ThejaswiPreview
