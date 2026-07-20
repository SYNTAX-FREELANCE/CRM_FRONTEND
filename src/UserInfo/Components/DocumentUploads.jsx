import React, { useState } from "react";
import { Grid, Box, Typography, Divider, Stack, Avatar, Button, IconButton, Modal, ModalDialog, DialogContent, DialogActions, Chip } from "@mui/joy";
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
    const [pendingUpload, setPendingUpload] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);

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
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.data && response.data.success === 1) {
                refetchDocuments();
                successNotify("Document uploaded successfully!");
                setUploadConfirmOpen(false);
                setPendingUpload(null);
            } else {
                errorNotify(response.data.message || "Failed to upload file");
            }
        } catch (error) {
            console.error("Upload error:", error);
            errorNotify(error.response?.data?.message || "Failed to upload file");
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

    const docCategories = [
        { key: "bankDetails", label: "Bank Details", icon: <AccountBalanceIcon sx={{ color: "#2563eb", fontSize: 20 }} />, color: "#2563eb" },
        { key: "resume", label: "Resume / CV", icon: <ResumeIcon sx={{ color: "#7c3aed", fontSize: 20 }} />, color: "#7c3aed" },
        { key: "aadhar", label: "Aadhar Card", icon: <AadharIcon sx={{ color: "#059669", fontSize: 20 }} />, color: "#059669" },
        { key: "otherUploads", label: "Other Uploads", icon: <CloudUploadIcon sx={{ color: "#ea580c", fontSize: 20 }} />, color: "#ea580c" }
    ];

    const totalFilesCount = Object.values(documents).reduce((acc, curr) => acc + (curr?.length || 0), 0);

    return (
        <Grid xs={12}>
            <Box
                sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    borderRadius: "20px",
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 12px rgba(15, 23, 42, 0.03)",
                    boxSizing: "border-box"
                }}
            >
                {/* Header Row */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                        <Avatar variant="soft" sx={{ bgcolor: "rgba(37, 99, 235, 0.08)", color: "#2563eb", borderRadius: "10px", width: 36, height: 36 }}>
                            <CloudUploadIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Box>
                            <Typography level="title-md" sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: "15px", sm: "16px" } }}>
                                Document Uploads
                            </Typography>
                            <Typography level="body-xs" sx={{ color: "#64748b", fontWeight: 600 }}>
                                KYC & identity documents
                            </Typography>
                        </Box>
                    </Box>

                    <Chip
                        variant="soft"
                        color={totalFilesCount > 0 ? "success" : "neutral"}
                        size="sm"
                        sx={{ borderRadius: "8px", fontWeight: 750, px: 1.2 }}
                    >
                        {totalFilesCount} {totalFilesCount === 1 ? "File" : "Files"}
                    </Chip>
                </Box>

                <Divider sx={{ mb: 2.5, opacity: 0.5 }} />

                {/* 4 Equal Clean Responsive Cards Grid */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(4, 1fr)"
                        },
                        gap: 2,
                        alignItems: "stretch"
                    }}
                >
                    {docCategories.map(({ key, label, icon, color }) => {
                        const fileList = documents[key] || [];
                        const isUploaded = fileList.length > 0;

                        return (
                            <Box
                                key={key}
                                sx={{
                                    p: 2,
                                    borderRadius: "14px",
                                    bgcolor: isUploaded ? "#f8fafc" : "#fafafa",
                                    border: `1px solid ${isUploaded ? "#cbd5e1" : "#e2e8f0"}`,
                                    borderLeft: `4px solid ${isUploaded ? color : "#cbd5e1"}`,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    transition: "all 0.2s ease-in-out",
                                    "&:hover": {
                                        boxShadow: "0 6px 16px rgba(15, 23, 42, 0.05)",
                                        transform: "translateY(-2px)",
                                        bgcolor: "#ffffff"
                                    }
                                }}
                            >
                                <Box>
                                    {/* Title & Icon Header */}
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            {icon}
                                            <Typography level="title-sm" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "13.5px" }}>
                                                {label}
                                            </Typography>
                                        </Box>
                                        {isUploaded ? (
                                            <Chip size="sm" variant="soft" color="success" sx={{ fontSize: "10px", fontWeight: 800, borderRadius: "6px", px: 0.8 }}>
                                                ✓ {fileList.length}
                                            </Chip>
                                        ) : (
                                            <Chip size="sm" variant="soft" color="neutral" sx={{ fontSize: "10px", fontWeight: 700, borderRadius: "6px", px: 0.8 }}>
                                                Empty
                                            </Chip>
                                        )}
                                    </Box>

                                    {/* Uploaded Files List (2 files fully visible, scrollbar for 3+ files) */}
                                    {isUploaded ? (
                                        <Stack
                                            spacing={1}
                                            sx={{
                                                my: 1,
                                                maxHeight: fileList.length > 2 ? "90px" : "auto",
                                                overflowY: fileList.length > 2 ? "auto" : "visible",
                                                pr: fileList.length > 2 ? 0.5 : 0,
                                                "&::-webkit-scrollbar": {
                                                    width: "4px"
                                                },
                                                "&::-webkit-scrollbar-track": {
                                                    bgcolor: "rgba(0,0,0,0.03)",
                                                    borderRadius: "4px"
                                                },
                                                "&::-webkit-scrollbar-thumb": {
                                                    bgcolor: "rgba(0,0,0,0.15)",
                                                    borderRadius: "4px",
                                                    "&:hover": {
                                                        bgcolor: "rgba(0,0,0,0.25)"
                                                    }
                                                }
                                            }}
                                        >
                                            {fileList.map((file, idx) => (
                                                <Box
                                                    key={file.file_id || idx}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        height: "40px",
                                                        px: 1.2,
                                                        borderRadius: "8px",
                                                        bgcolor: "#ffffff",
                                                        border: "1px solid #e2e8f0",
                                                        minWidth: 0,
                                                        boxSizing: "border-box"
                                                    }}
                                                >
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1, mr: 1 }}>
                                                        <FilePresentIcon sx={{ color: color, fontSize: 16, flexShrink: 0 }} />
                                                        <Typography level="body-xs" noWrap sx={{ fontWeight: 700, color: "#1e293b", fontSize: "11px" }}>
                                                            {file.name}
                                                        </Typography>
                                                    </Box>

                                                    <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                                                        <IconButton
                                                            size="sm"
                                                            variant="plain"
                                                            color="primary"
                                                            onClick={() => handleViewFile(file, file.name)}
                                                            sx={{ width: 24, height: 24, borderRadius: "4px" }}
                                                        >
                                                            <FilePresentIcon sx={{ fontSize: 14 }} />
                                                        </IconButton>
                                                        <IconButton
                                                            size="sm"
                                                            variant="plain"
                                                            color="danger"
                                                            onClick={() => handleFileDelete(file)}
                                                            sx={{ width: 24, height: 24, borderRadius: "4px" }}
                                                        >
                                                            <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                                                        </IconButton>
                                                    </Stack>
                                                </Box>
                                            ))}
                                        </Stack>
                                    ) : (
                                        /* Simple Empty Dropzone */
                                        <Box
                                            component="label"
                                            sx={{
                                                my: 1.5,
                                                py: 2.5,
                                                px: 1.5,
                                                borderRadius: "10px",
                                                border: "1px dashed #cbd5e1",
                                                bgcolor: "#f8fafc",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: 0.5,
                                                cursor: "pointer",
                                                transition: "0.2s",
                                                "&:hover": {
                                                    borderColor: color,
                                                    bgcolor: "rgba(59, 130, 246, 0.04)"
                                                }
                                            }}
                                        >
                                            <CloudUploadIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                                            <Typography level="body-xs" sx={{ fontWeight: 700, color: "#64748b", fontSize: "11px" }}>
                                                Upload document
                                            </Typography>
                                            <input
                                                type="file"
                                                multiple
                                                hidden
                                                accept=".jpg,.jpeg,.png,.pdf"
                                                onChange={(e) => handleFileUpload(key, e)}
                                            />
                                        </Box>
                                    )}
                                </Box>

                                {/* Action Button */}
                                {isUploaded && (
                                    <Button
                                        component="label"
                                        size="sm"
                                        variant="soft"
                                        color="neutral"
                                        startDecorator={<CloudUploadIcon style={{ fontSize: 13 }} />}
                                        sx={{
                                            mt: 1.5,
                                            borderRadius: "8px",
                                            fontWeight: 750,
                                            fontSize: "11px",
                                            width: "100%",
                                            height: 30
                                        }}
                                    >
                                        + Add File
                                        <input
                                            type="file"
                                            multiple
                                            hidden
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            onChange={(e) => handleFileUpload(key, e)}
                                        />
                                    </Button>
                                )}
                            </Box>
                        );
                    })}
                </Box>

                {/* Upload Confirmation Modal */}
                <Modal open={uploadConfirmOpen} onClose={() => { if (!isUploading) { setUploadConfirmOpen(false); setPendingUpload(null); } }}>
                    <ModalDialog
                        variant="outlined"
                        sx={{
                            width: { xs: "calc(100vw - 32px)", sm: "400px" },
                            borderRadius: "16px",
                            p: 3,
                            textAlign: "center",
                            alignItems: "center"
                        }}
                    >
                        <Avatar variant="soft" color="primary" sx={{ width: 48, height: 48, mb: 2 }}>
                            <CloudUploadIcon style={{ fontSize: 24 }} />
                        </Avatar>
                        <Typography level="title-md" sx={{ fontWeight: 800, mb: 0.5 }}>
                            Upload Document
                        </Typography>
                        <Typography level="body-xs" sx={{ color: "neutral.500", mb: 2.5 }}>
                            {isUploading ? "Uploading file, please wait..." : "Confirm file upload?"}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                            <Button variant="solid" color="primary" onClick={executeFileUpload} loading={isUploading} disabled={isUploading} sx={{ flex: 1, borderRadius: "8px" }}>
                                Yes, Upload
                            </Button>
                            <Button variant="soft" color="neutral" disabled={isUploading} onClick={() => { setUploadConfirmOpen(false); setPendingUpload(null); }} sx={{ flex: 1, borderRadius: "8px" }}>
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
                            width: { xs: "calc(100vw - 32px)", sm: "400px" },
                            borderRadius: "16px",
                            p: 3,
                            textAlign: "center",
                            alignItems: "center"
                        }}
                    >
                        <Avatar variant="soft" color="danger" sx={{ width: 48, height: 48, mb: 2 }}>
                            <DeleteOutlineIcon style={{ fontSize: 24 }} />
                        </Avatar>
                        <Typography level="title-md" sx={{ fontWeight: 800, mb: 0.5 }}>
                            Delete Document
                        </Typography>
                        <Typography level="body-xs" sx={{ color: "neutral.500", mb: 2.5 }}>
                            Are you sure you want to delete this document?
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                            <Button variant="solid" color="danger" onClick={executeFileDelete} sx={{ flex: 1, borderRadius: "8px" }}>
                                Delete
                            </Button>
                            <Button variant="soft" color="neutral" onClick={() => { setDeleteConfirmOpen(false); setPendingDelete(null); }} sx={{ flex: 1, borderRadius: "8px" }}>
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
                            width: { xs: "95vw", sm: "85vw" },
                            maxWidth: "1000px",
                            height: "80vh",
                            borderRadius: "20px",
                            p: 2.5,
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1, borderBottom: "1px solid #e2e8f0" }}>
                            <Typography level="title-md" noWrap sx={{ fontWeight: 800 }}>
                                {viewingFileName}
                            </Typography>
                            <IconButton variant="plain" color="neutral" onClick={() => { setViewModalOpen(false); setViewingFileUrl(""); }}>
                                ✕
                            </IconButton>
                        </Box>
                        <DialogContent sx={{ mt: 1.5, flex: 1, minHeight: 0, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#f8fafc", borderRadius: "10px", p: 1 }}>
                            {viewingFileType && viewingFileType.startsWith("image/") ? (
                                <img src={viewingFileUrl} alt={viewingFileName} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "6px" }} />
                            ) : viewingFileType === "application/pdf" ? (
                                <iframe src={viewingFileUrl} title={viewingFileName} width="100%" height="100%" style={{ border: "none", borderRadius: "6px" }} />
                            ) : (
                                <Typography level="body-sm" sx={{ fontWeight: 600 }}>Preview not available for this file type.</Typography>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ mt: 1.5, display: "flex", justifyContent: "space-between" }}>
                            <Button
                                variant="solid"
                                color="primary"
                                onClick={() => {
                                    const a = document.createElement("a");
                                    a.href = viewingFileUrl;
                                    a.download = viewingFileName;
                                    a.click();
                                }}
                                sx={{ borderRadius: "8px" }}
                            >
                                Download File
                            </Button>
                            <Button variant="outlined" color="neutral" onClick={() => { setViewModalOpen(false); setViewingFileUrl(""); }} sx={{ borderRadius: "8px" }}>
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
