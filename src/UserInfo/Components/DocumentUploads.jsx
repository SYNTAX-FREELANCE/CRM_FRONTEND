import React, { useState } from "react";
import { Grid, Box, Typography, Divider, Stack, Avatar, Button, IconButton, Modal, ModalDialog, DialogContent, DialogActions } from "@mui/joy";
import { useEmployeeFiles } from "../../CommonCode/useQuery";
import {
    CloudUploadIcon,
    FilePresentIcon,
    DeleteOutlineIcon,
    AccountBalanceIcon,
    ResumeIcon,
    AadharIcon
} from "./Icons";
import { axioslogin } from "../../Connection/axios";
import { errorNotify, infoNotify } from "../../constant/Constant";

const DocumentUploads = ({
    userId,
    employeeId,
    successNotify,
}) => {
    // Fetch and load existing files from database using useQuery hook from common useQuery file
    const { data: documents = { bankDetails: [], resume: [], aadhar: [], otherUploads: [] }, refetch: refetchDocuments } = useEmployeeFiles(userId);


    // Modal states for insert and delete confirmation
    const [uploadConfirmOpen, setUploadConfirmOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [pendingUpload, setPendingUpload] = useState(null); // { docType, files }
    const [pendingDelete, setPendingDelete] = useState(null); // doc

    // Document Viewer modal states
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewingFileUrl, setViewingFileUrl] = useState("");
    const [viewingFileType, setViewingFileType] = useState("");
    const [viewingFileName, setViewingFileName] = useState("");

    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = (docType, e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Check file extensions (allowed: jpg, jpeg, png, pdf)
        const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
        const invalidFile = files.find(file => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            return !allowedExtensions.includes(fileExtension);
        });
        if (invalidFile) {
            infoNotify(`File "${invalidFile.name}" is not supported. Only JPG, PNG, and PDF files are allowed.`);
            return;
        }

        // Check file sizes (25MB limit)
        const MAX_SIZE = 25 * 1024 * 1024;
        const oversizedFile = files.find(file => file.size > MAX_SIZE);
        if (oversizedFile) {
            infoNotify(`File "${oversizedFile.name}" exceeds 25 MB limit`);
            return;
        }

        setPendingUpload({ docType, files });
        setUploadConfirmOpen(true);
        e.target.value = null;
    };

    const executeFileUpload = async () => {
        if (!pendingUpload) return;
        const { docType, files } = pendingUpload;

        const labelMap = {
            bankDetails: "bank",
            resume: "resume",
            aadhar: "aadhar",
            otherUploads: "others"
        };
        const fileType = labelMap[docType];

        const formData = new FormData();
        files.forEach(file => {
            formData.append("files", file);
        });

        setIsUploading(true);

        try {
            const response = await axioslogin.post(
                `/employee/upload-document?employee_id=${employeeId}&user_id=${userId}&file_type=${fileType}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (response.data && response.data.success === 1) {
                refetchDocuments();
                successNotify("Documents uploaded successfully!");
                setUploadConfirmOpen(false);
                setPendingUpload(null);
            } else {
                errorNotify(response.data.message || "Failed to upload files");
            }
        } catch (error) {
            console.error("Upload error:", error);
            errorNotify(error.response?.data?.message || "Failed to upload files");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileDelete = (doc) => {
        if (!doc || !doc.file_id) return;
        setPendingDelete(doc);
        setDeleteConfirmOpen(true);
    };

    const executeFileDelete = async () => {
        if (!pendingDelete || !pendingDelete.file_id) return;

        try {
            const response = await axioslogin.delete(`/employee/delete-file/${pendingDelete.file_id}`);
            if (response.data && response.data.success === 1) {
                refetchDocuments();
                successNotify("Document removed successfully.");
            } else {
                errorNotify(response.data.message || "Failed to delete file");
            }
        } catch (error) {
            console.error("Delete error:", error);
            errorNotify(error.response?.data?.message || "Failed to delete file");
        } finally {
            setDeleteConfirmOpen(false);
            setPendingDelete(null);
        }
    };

    const handleViewFile = async (file, fileName) => {
        if (file instanceof File || file instanceof Blob) {
            const url = URL.createObjectURL(file);
            window.open(url, '_blank');
            return;
        }
        try {
            const response = await axioslogin.get(`/fileupload/getMedicalDocFile`, {
                params: { id: userId, filename: fileName },
                responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = URL.createObjectURL(blob);

            setViewingFileUrl(url);
            setViewingFileType(response.headers['content-type'] || 'application/octet-stream');
            setViewingFileName(fileName);
            setViewModalOpen(true);
        } catch (error) {
            errorNotify("Error fetching file");
        }
    };

    return (
        <Grid xs={12} sm={12} md={4}>
            <Box
                sx={{
                    p: { xs: 1.5, md: 2.5 },
                    borderRadius: "18px",
                    bgcolor: "#f8fafc",
                    border: "1px solid rgba(0,0,0,0.01)",
                    height: { xs: "auto", md: "450px" },
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box"
                }}
            >
                <Typography level="title-sm" sx={{ fontWeight: 900, color: "#1e1b4b", display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
                    <CloudUploadIcon sx={{ color: "#2563eb", fontSize: 20 }} />
                    Document Uploads
                </Typography>
                <Divider sx={{ mb: 2, opacity: 0.6 }} />
                <Stack spacing={2} sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
                    {["bankDetails", "resume", "aadhar", "otherUploads"].map((docType) => {
                        const docsList = documents[docType] || [];
                        const labelMap = {
                            bankDetails: { name: "bank", label: "Bank Details", icon: <AccountBalanceIcon sx={{ color: "#3b82f6" }} /> },
                            resume: { name: "resume", label: "Resume", icon: <ResumeIcon sx={{ color: "#a855f7" }} /> },
                            aadhar: { name: "aadhar", label: "Aadhar Card", icon: <AadharIcon sx={{ color: "#10b981" }} /> },
                            otherUploads: { name: "others", label: "Other Uploads", icon: <CloudUploadIcon sx={{ color: "#f97316" }} /> }
                        };
                        const { label, icon } = labelMap[docType];

                        return (
                            <Box
                                key={docType}
                                sx={{
                                    p: 1.5,
                                    borderRadius: "14px",
                                    bgcolor: docsList.length > 0 ? "rgba(16, 185, 129, 0.02)" : "rgba(248, 250, 252, 0.8)",
                                    border: docsList.length > 0 ? "1px solid rgba(16, 185, 129, 0.15)" : "1px dashed rgba(0, 0, 0, 0.08)",
                                    transition: "all 0.25s ease",
                                    "&:hover": {
                                        borderColor: docsList.length > 0 ? "rgba(16, 185, 129, 0.3)" : "#3b82f6",
                                        bgcolor: docsList.length > 0 ? "rgba(16, 185, 129, 0.04)" : "#ffffff",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                                    }
                                }}
                            >
                                {/* Header Info and Persistent Upload Button */}
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, flexWrap: "wrap" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1 }}>
                                        <Avatar variant="soft" sx={{ width: 32, height: 32, bgcolor: "rgba(0,0,0,0.03)", borderRadius: "8px" }}>
                                            {icon}
                                        </Avatar>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography level="body-xs" sx={{ fontWeight: 800, color: "#1e1b4b", fontSize: "11.5px" }}>
                                                {label}
                                            </Typography>
                                            {docsList.length === 0 && (
                                                <Typography level="body-xs" sx={{ color: "neutral.400", fontWeight: 650, mt: 0.25, fontSize: "10.5px" }}>
                                                    No document uploaded
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    <Button
                                        component="label"
                                        size="sm"
                                        variant="soft"
                                        color="primary"
                                        startDecorator={<CloudUploadIcon style={{ fontSize: 13 }} />}
                                        sx={{
                                            borderRadius: "8px",
                                            fontWeight: 800,
                                            fontSize: "11px",
                                            px: 1.5,
                                            height: 28
                                        }}
                                    >
                                        Upload
                                        <input
                                            type="file"
                                            multiple
                                            hidden
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            onChange={(e) => handleFileUpload(docType, e)}
                                        />
                                    </Button>
                                </Box>

                                {/* Uploaded Files List */}
                                {docsList.length > 0 && (
                                    <Stack spacing={1} sx={{ mt: 1.5 }}>
                                        {docsList.map((doc, idx) => (
                                            <Box
                                                key={doc.file_id || idx}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    p: 1,
                                                    borderRadius: "8px",
                                                    bgcolor: "white",
                                                    border: "1px solid rgba(0,0,0,0.05)",
                                                    minWidth: 0
                                                }}
                                            >
                                                <Typography level="body-xs" noWrap sx={{ flex: 1, mr: 1, color: "success.700", fontWeight: 700, fontSize: "10.5px" }}>
                                                    ✓ {doc.name} ({doc.size})
                                                </Typography>
                                                <Stack direction="row" spacing={0.5}>
                                                    <Button
                                                        size="sm"
                                                        variant="plain"
                                                        color="primary"
                                                        onClick={() => handleViewFile(doc, doc.name)}
                                                        sx={{ minWidth: 0, px: 1, height: 24, borderRadius: "4px", fontSize: "10.5px", fontWeight: 800 }}
                                                    >
                                                        View
                                                    </Button>
                                                    <IconButton
                                                        size="sm"
                                                        variant="plain"
                                                        color="danger"
                                                        onClick={() => handleFileDelete(doc)}
                                                        sx={{ width: 24, height: 24, borderRadius: "4px" }}
                                                    >
                                                        <DeleteOutlineIcon style={{ fontSize: 13 }} />
                                                    </IconButton>
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        );
                    })}
                </Stack>

                {/* Insert Confirmation Modal */}
                <Modal open={uploadConfirmOpen} onClose={() => { if (!isUploading) { setUploadConfirmOpen(false); setPendingUpload(null); } }}>
                    <ModalDialog
                        variant="outlined"
                        sx={{
                            width: { xs: "calc(100vw - 32px)", sm: "420px" },
                            maxWidth: "420px",
                            borderRadius: "20px",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                            p: 3,
                            border: "1px solid rgba(0,0,0,0.06)",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        <Avatar
                            variant="soft"
                            color="primary"
                            sx={{
                                width: 56,
                                height: 56,
                                mb: 2.5,
                                bgcolor: "rgba(59, 130, 246, 0.1)",
                                color: "#3b82f6"
                            }}
                        >
                            <CloudUploadIcon style={{ fontSize: 28 }} />
                        </Avatar>

                        <Typography level="title-lg" sx={{ fontWeight: 900, color: "#1e1b4b", mb: 1 }}>
                            Confirm Document Upload
                        </Typography>

                        <Typography level="body-sm" sx={{ color: "neutral.550", fontWeight: 600, mb: 3 }}>
                            {isUploading ? "Uploading document, please wait..." : "Are you sure you want to upload and insert this document?"}
                        </Typography>

                        <Stack direction="row" spacing={1.5} sx={{ width: "100%" }}>
                            <Button
                                variant="solid"
                                color="primary"
                                onClick={executeFileUpload}
                                loading={isUploading}
                                disabled={isUploading}
                                sx={{ flex: 1, borderRadius: "10px", fontWeight: 800, height: 38 }}
                            >
                                Yes, Upload
                            </Button>
                            <Button
                                variant="soft"
                                color="neutral"
                                disabled={isUploading}
                                onClick={() => { setUploadConfirmOpen(false); setPendingUpload(null); }}
                                sx={{ flex: 1, borderRadius: "10px", fontWeight: 800, height: 38 }}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </ModalDialog>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal open={deleteConfirmOpen} onClose={() => { setDeleteConfirmOpen(false); setPendingDelete(null); }}>
                    <ModalDialog
                        variant="outlined"
                        sx={{
                            width: { xs: "calc(100vw - 32px)", sm: "420px" },
                            maxWidth: "420px",
                            borderRadius: "20px",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                            p: 3,
                            border: "1px solid rgba(0,0,0,0.06)",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        <Avatar
                            variant="soft"
                            color="danger"
                            sx={{
                                width: 56,
                                height: 56,
                                mb: 2.5,
                                bgcolor: "rgba(239, 68, 68, 0.1)",
                                color: "#ef4444"
                            }}
                        >
                            <DeleteOutlineIcon style={{ fontSize: 28 }} />
                        </Avatar>

                        <Typography level="title-lg" sx={{ fontWeight: 900, color: "#1e1b4b", mb: 1 }}>
                            Delete Confirmation
                        </Typography>

                        <Typography level="body-sm" sx={{ color: "neutral.550", fontWeight: 650, mb: 3 }}>
                            Are you sure you want to permanently delete this document? This action cannot be undone.
                        </Typography>

                        <Stack direction="row" spacing={1.5} sx={{ width: "100%" }}>
                            <Button
                                variant="solid"
                                color="danger"
                                onClick={executeFileDelete}
                                sx={{ flex: 1, borderRadius: "10px", fontWeight: 800, height: 38 }}
                            >
                                Yes, Delete
                            </Button>
                            <Button
                                variant="soft"
                                color="neutral"
                                onClick={() => { setDeleteConfirmOpen(false); setPendingDelete(null); }}
                                sx={{ flex: 1, borderRadius: "10px", fontWeight: 800, height: 38 }}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </ModalDialog>
                </Modal>

                {/* Document Viewer Modal */}
                <Modal open={viewModalOpen} onClose={() => { setViewModalOpen(false); setViewingFileUrl(""); }}>
                    <ModalDialog
                        variant="outlined"
                        sx={{
                            width: "90vw",
                            maxWidth: "1200px",
                            height: "85vh",
                            borderRadius: "24px",
                            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.16)",
                            p: 3,
                            border: "1px solid rgba(0, 0, 0, 0.05)",
                            display: "flex",
                            flexDirection: "column",
                            bgcolor: "#ffffff"
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1.5, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Avatar variant="soft" color="primary" sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: "rgba(37, 99, 235, 0.08)" }}>
                                    <FilePresentIcon style={{ fontSize: 22, color: "#2563eb" }} />
                                </Avatar>
                                <Box>
                                    <Typography level="title-md" sx={{ fontWeight: 900, color: "#1e1b4b" }}>
                                        {viewingFileName}
                                    </Typography>
                                    <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 650, mt: 0.1 }}>
                                        Document Preview
                                    </Typography>
                                </Box>
                            </Box>

                            <IconButton
                                variant="plain"
                                color="neutral"
                                onClick={() => { setViewModalOpen(false); setViewingFileUrl(""); }}
                                sx={{ borderRadius: "50%", width: 36, height: 36 }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </IconButton>
                        </Box>

                        <DialogContent sx={{ mt: 2, flex: 1, minHeight: 0, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#f8fafc", borderRadius: "14px", border: "1px dashed rgba(0,0,0,0.06)", overflow: "hidden", p: 1.5 }}>
                            {viewingFileType && viewingFileType.startsWith("image/") ? (
                                <img
                                    src={viewingFileUrl}
                                    alt={viewingFileName}
                                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
                                />
                            ) : viewingFileType === "application/pdf" ? (
                                <iframe
                                    src={viewingFileUrl}
                                    title={viewingFileName}
                                    width="100%"
                                    height="100%"
                                    style={{ border: "none", borderRadius: "8px" }}
                                />
                            ) : (
                                <Typography level="body-md" sx={{ fontWeight: 700, color: "neutral.550" }}>
                                    Preview not available for this file type.
                                </Typography>
                            )}
                        </DialogContent>

                        <DialogActions sx={{ mt: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Button
                                variant="solid"
                                color="primary"
                                startDecorator={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                }
                                onClick={() => {
                                    const a = document.createElement("a");
                                    a.href = viewingFileUrl;
                                    a.download = viewingFileName;
                                    a.click();
                                }}
                                sx={{
                                    borderRadius: "10px",
                                    fontWeight: 800,
                                    px: 3.5,
                                    height: 40,
                                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)"
                                }}
                            >
                                Download Document
                            </Button>

                            <Button
                                variant="outlined"
                                color="neutral"
                                onClick={() => { setViewModalOpen(false); setViewingFileUrl(""); }}
                                sx={{ borderRadius: "10px", fontWeight: 800, px: 3, height: 40 }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </ModalDialog>
                </Modal>
            </Box>
        </Grid>
    );
};

export default DocumentUploads;
