// PolicyUploadDetails.jsx
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Grid,
    Paper,
    Chip,
    Button,
    Divider,
    Stack,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
} from '@mui/material';
import { useGetCustomerPolicyDetails, useGetPolicyFiles } from '../CommonCode/useQuery';
import CustomerHeader from './CustomersComponents/CustomerHeader';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import TextsmsIcon from '@mui/icons-material/Textsms';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadPreview from './CustomersComponents/UploadPreview';
import { axioslogin } from '../Connection/axios';
import { errorNotify, getAuthUser, successNotify, warningNofity } from '../constant/Constant';
import UploadBox from './CustomersComponents/UploadBox';
import PolicyInfoCard from './CustomersComponents/PolicyInfoCard';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import FloatingBackButton from '../CommonComponents/FloatingBackButton';

const themeColors = {
    orange: '#F57C00',
    orangeLight: '#FFF3E0',
    blue: '#1565C0',
    blueLight: '#E3F2FD',
    border: '#DCE8F7',
    textDark: '#1E293B',
    textLight: '#64748B',
};


const PolicyUploadDetails = () => {
    const { customerid, policyid } = useParams();
    const navigate = useNavigate();

    const authUser = getAuthUser();
    const { id } = authUser ?? {}

    const [rcFiles, setRcFiles] = useState([]);
    const [policyFiles, setPolicyFiles] = useState([]);
    const [kycFiles, setKycFiles] = useState([]);
    const [vehicleImages, setVehicleImages] = useState([]);
    const [loading, setLoading] = useState(false)

    const { data: policyDetails = [], isLoading, isError, refetch } = useGetCustomerPolicyDetails(customerid);
    const { data: PolicyFiles = [], refetch: refetchPolicyFiles, isLoading: LoadingPolicyFiles } = useGetPolicyFiles(policyid);


    const uploadedFiles = PolicyFiles ?? {};

    const uploadedRC = uploadedFiles?.RC ?? [];
    const uploadedPolicy = uploadedFiles?.PREVIOUS_POLICY ?? [];
    const uploadedKYC = uploadedFiles?.KYC ?? [];
    const uploadedVehicle = uploadedFiles?.VEHICLE_IMAGE ?? [];

    const policy = useMemo(
        () => policyDetails?.find((p) => String(p.policy_id) === String(policyid)),
        [policyDetails, policyid]
    );

    const customer = useMemo(() => {
        if (!policyDetails?.length) return null;
        const p = policy;
        return {
            customer_id: p.customer_id,
            customer_name: p.customer_name,
            mobile_number_1: p.mobile_number_1,
            mobile_number_2: p.mobile_number_2,
            email: p.customeremail,
            address: p.address,
            city: p.city,
            district: p.district,
            state: p.state,
            pincode: p.pincode,
            is_previous_customer: p.is_previous_customer,
        };
    }, [policyDetails]);

    const resetDetails = useCallback(() => {
        setRcFiles([])
        setPolicyFiles([])
        setKycFiles([])
        setVehicleImages([])
    }, []);

    const uploadFiles = async (files, fileType) => {

        if (!files.length) return;

        const formData = new FormData();

        files.forEach(item => {
            formData.append("files", item.file);
        });

        // Optional: keep these in FormData if you need them in req.body
        formData.append("customer_id", customerid);
        formData.append("policy_id", policyid);
        formData.append("file_type", fileType);
        formData.append("uploaded_by", id);

        try {
            setLoading(true)
            const response = await axioslogin.post(
                `/employee/upload-policy-document?policy_id=${policyid}&file_type=${encodeURIComponent(fileType)}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const { success, message } = response.data;
            if (success !== 1) return warningNofity(message)
            successNotify(message)
            resetDetails();
            refetchPolicyFiles();
        } catch (err) {
            errorNotify("Error in Uploading Files Details!")
        } finally {
            setLoading(false)
        }
    };

    const createFiles = (files) =>
        Array.from(files).map((file, index) => ({
            id: `${Date.now()}-${index}`,
            file,
            preview: file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : null,
        }));

    const handleUpload = (e, setter) => {
        const files = createFiles(e.target.files);
        setter(prev => [...prev, ...files]);
        e.target.value = "";
    };



    const removeFile = async (item, setter) => {

        try {
            // File already exists on server
            if (item.file_id) {
                const { data } = await axioslogin.delete(
                    `/employee/policy-document/${item.file_id}`
                );
                const { success, message } = data;
                if (success !== 1) {
                    return warningNofity(message);
                }
                successNotify(message);
                // Refresh uploaded files
                refetchPolicyFiles();
                return;
            }
            // Local file only
            setter(prev => {
                const file = prev.find(x => x.id === item.id);
                if (file?.preview) {
                    URL.revokeObjectURL(file.preview);
                }
                return prev.filter(x => x.id !== item.id);
            });

        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Unable to remove file.";
            errorNotify(message);

        }

    };

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
                <CircularProgress sx={{ color: themeColors.orange }} />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to load policy details.
                </Alert>
                <Button onClick={() => refetch()} variant="contained">
                    Retry
                </Button>
            </Box>
        );
    }

    if (!policy) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">Policy not found.</Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "95vh",
                width: "100%",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                background: `
                     radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.22) 0%, transparent 45%),
                     radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.18) 0%, transparent 45%),
                     linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #fff7ed 100%)
                   `,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    height: "95vh",
                    width: "100%",
                    border: "1px solid rgba(255,255,255,.65)",
                    boxShadow: "0 20px 40px rgba(15,23,42,.05)",
                    borderRadius: 0,
                    background: "rgba(255,255,255,.5)",
                    backdropFilter: "blur(24px)",

                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >

                <CustomerHeader customer={customer} />


                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",

                        scrollbarWidth: "none",
                        msOverflowStyle: "none",

                        "&::-webkit-scrollbar": {
                            display: "none",
                        },

                        p: 1,
                    }}
                >

                    <PolicyInfoCard policy={policy} />

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            border: `1px solid ${themeColors.border}`,
                            // width: { xs: "100%", lg: "50%" },
                            width: '100%'
                        }}
                    >
                        <Box sx={{
                            display: "flex",
                            gap: 1
                        }}>
                            <EditDocumentIcon sx={{
                                color: '#fb3e05'
                            }} />
                            <Typography
                                sx={{
                                    fontSize: { xs: 15, sm: 20 },
                                    fontWeight: 600,
                                    color: themeColors.textDark,
                                    mb: 3,
                                }}>
                                POLICY DOCUMENT UPLOADS
                            </Typography>
                        </Box>



                        <Stack spacing={2}>

                            <UploadBox
                                title="Registration Certificate (RC)"
                                subtitle="Upload the vehicle Registration Certificate (Smart Card or RC Book)."
                                multiple
                                loading={loading}
                                onChange={(e) => handleUpload(e, setRcFiles)}
                                onAdd={() => uploadFiles(rcFiles, "RC")}
                            />

                            <UploadPreview
                                files={[
                                    ...(uploadedRC ?? []),
                                    ...rcFiles
                                ]}
                                LoadingPolicyFiles={LoadingPolicyFiles}
                                onRemove={(item) => removeFile(item, setRcFiles)}
                            />

                            <UploadBox
                                title="Previous Insurance Policy"
                                subtitle="Upload the latest insurance policy document for renewal verification."
                                multiple
                                loading={loading}
                                onChange={(e) => handleUpload(e, setPolicyFiles)}
                                onAdd={() => uploadFiles(policyFiles, "PREVIOUS_POLICY")}
                            />
                            <UploadPreview
                                files={[
                                    ...(uploadedPolicy ?? []),
                                    ...policyFiles
                                ]}
                                LoadingPolicyFiles={LoadingPolicyFiles}
                                onRemove={(item) => removeFile(item, setPolicyFiles)}
                            />

                            <UploadBox
                                title="Customer KYC Documents"
                                subtitle="Upload Aadhaar Card, PAN Card, Driving Licence, Passport or other valid identity/address proof."
                                multiple
                                loading={loading}
                                onChange={(e) => handleUpload(e, setKycFiles)}
                                onAdd={() => uploadFiles(kycFiles, "KYC")}
                            />

                            <UploadPreview
                                files={[
                                    ...(uploadedKYC ?? []),
                                    ...kycFiles
                                ]}
                                LoadingPolicyFiles={LoadingPolicyFiles}
                                onRemove={(item) => removeFile(item, setKycFiles)}
                            />

                            <UploadBox
                                title="Vehicle Inspection Images"
                                subtitle="Upload clear photos of the Front, Rear, Left Side, Right Side and any existing damages if applicable."
                                multiple
                                loading={loading}
                                onChange={(e) => handleUpload(e, setVehicleImages)}
                                onAdd={() => uploadFiles(vehicleImages, "VEHICLE_IMAGE")}
                            />

                            <UploadPreview
                                LoadingPolicyFiles={LoadingPolicyFiles}
                                files={[
                                    ...(uploadedVehicle ?? []),
                                    ...vehicleImages
                                ]}
                                onRemove={(item) => removeFile(item, setVehicleImages)}
                            />

                        </Stack>
                    </Paper>
                </Box>
            </Paper>
            <FloatingBackButton />
        </Box>
    );
};



export default memo(PolicyUploadDetails);