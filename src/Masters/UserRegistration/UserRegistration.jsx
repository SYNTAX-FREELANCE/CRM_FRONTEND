import React, { memo, useCallback, useState } from "react";
import {
  Box,
  Card,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Button,
  Grid,
  Stack,
  Divider,
} from "@mui/joy";

import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { axioslogin, axiosLogin } from "../../Connection/axios";
import { successNotify, warningNotify } from "../../constant/Constant";

const UserRegistration = () => {
  const [files, setFiles] = useState({
    aadhar: null,
    accountProof: null,
    biodata: null,
  });

  const [formData, setFormData] = useState({
    aadharNumber: "",
    fullName: "",
    age: "",
    qualification: "",
    mobileNumber: "",
    dateOfJoin: "",
    experience: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const [errors, setErrors] = useState({});

  const handleFileChange = (field, file) => {
    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case "aadharNumber":
        if (/^\d{0,12}$/.test(value)) {
          setFormData((prev) => ({ ...prev, [field]: value }));
        }
        break;

      case "mobileNumber":
        if (/^\d{0,10}$/.test(value)) {
          setFormData((prev) => ({ ...prev, [field]: value }));
        }
        break;

      case "accountNumber":
        if (/^\d*$/.test(value)) {
          setFormData((prev) => ({ ...prev, [field]: value }));
        }
        break;

      case "fullName":
      case "qualification":
      case "experience":
      case "accountHolderName":
      case "bankName":
        if (/^[A-Za-z\s]*$/.test(value)) {
          setFormData((prev) => ({ ...prev, [field]: value }));
        }
        break;

      default:
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };


  const validateForm = () => {
    const newErrors = {};

    if (!formData.aadharNumber) {
      newErrors.aadharNumber = "Aadhaar Number is required";
    } else if (formData.aadharNumber.length !== 12) {
      newErrors.aadharNumber = "Aadhaar Number must be 12 digits";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile Number is required";
    } else if (formData.mobileNumber.length !== 10) {
      newErrors.mobileNumber = "Mobile Number must be 10 digits";
    }

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName =
        "Account Holder Name is required";
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank Name is required";
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account Number is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    const result = await axioslogin.post('usercreation/insertuser', formData)
    const { message, success } = result.data;
    if (success === 1) {
      successNotify(message)
    }
    else {
      warningNotify(message)
    }
  }, [formData])

  const uploadCard = (
    title,
    accept,
    fieldName,
    selectedFile
  ) => (
    <Card
      variant="outlined"
      sx={{
        p: 1,
        borderRadius: "18px",
        border: "2px dashed #3468E8",
        textAlign: "center",
        bgcolor: "#fff",
        transition: "all 0.3s ease",
        height: "100%",
        "&:hover": {
          borderColor: "#FF9624",
          transform: "translateY(-4px)",
          boxShadow: "lg",
        },
      }}
    >
      <CloudUploadIcon
        sx={{
          fontSize: 50,
          color: "#3468E8",
          mb: 1,
          textAlign: "center"
        }}
      />

      <Typography level="title-md" fontWeight="lg">
        {title}
      </Typography>

      <Typography
        level="body-sm"
        sx={{
          color: "text.secondary",
          mb: 2,
        }}
      >
        Upload Document
      </Typography>

      <Button
        component="label"
        sx={{
          background:
            "linear-gradient(90deg,#3468E8 0%,#FF9624 100%)",
          color: "#fff",
          borderRadius: "10px",
          fontWeight: 600,
          "&:hover": {
            opacity: 0.9,
          },
        }}
      >
        Choose File

        <input
          hidden
          type="file"
          accept={accept}
          onChange={(e) =>
            handleFileChange(fieldName, e.target.files[0])
          }
        />
      </Button>

      <Typography
        level="body-xs"
        sx={{
          mt: 2,
          wordBreak: "break-word",
        }}
      >
        {selectedFile?.name || "No file selected"}
      </Typography>
    </Card>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
        background:
          "linear-gradient(180deg,#EEF1F6 0%,#F8F5F1 100%)",
      }}
    >
      <Card
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          p: { xs: 2, md: 4 },
          borderRadius: "24px",
          bgcolor: "#fff",
          boxShadow:
            "0px 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <Typography
          level="h2"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          Employee Registration
        </Typography>

        <Typography
          level="body-md"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            mb: 4,
          }}
        >
          Add employee details and upload required
          documents.
        </Typography>

        {/* PERSONAL INFO */}
        <Box
          sx={{
            p: 1.5,
            mb: 3,
            borderRadius: "12px",
            background:
              "linear-gradient(90deg, rgba(52,104,232,0.08) 0%, rgba(255,150,36,0.08) 100%)",
          }}
        >
          <Typography
            startDecorator={<PersonIcon />}
            level="title-lg"
            fontWeight="lg"
          >
            Personal Information
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            {/* <FormControl>
              <FormLabel>Aadhaar Number</FormLabel>
              <Input placeholder="Enter Aadhaar Number" />
            </FormControl> */}
            <FormControl error={!!errors.aadharNumber}>
              <FormLabel>Aadhaar Number</FormLabel>
              <Input
                placeholder="Enter Aadhaar Number"
                value={formData.aadharNumber}
                onChange={(e) =>
                  handleInputChange(
                    "aadharNumber",
                    e.target.value
                  )
                }
              />
              {errors.aadharNumber && (
                <Typography level="body-xs" color="danger">
                  {errors.aadharNumber}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid xs={12} md={6}>
            <FormControl error={!!errors.fullName}>
              <FormLabel>Full Name</FormLabel>
              <Input
                placeholder="Enter Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  handleInputChange("fullName", e.target.value)
                }
              />
              {errors.fullName && (
                <Typography level="body-xs" color="danger">
                  {errors.fullName}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid xs={12} md={4}>
            <FormControl error={!!errors.mobileNumber}>
              <FormLabel>Personal Number</FormLabel>
              <Input
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={(e) =>
                  handleInputChange(
                    "mobileNumber",
                    e.target.value
                  )
                }
              />
              {errors.mobileNumber && (
                <Typography level="body-xs" color="danger">
                  {errors.mobileNumber}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid xs={12} md={4}>
            {/* <FormControl> 
            <FormLabel>Age</FormLabel> 
            <Input
  type="number"
  placeholder="Enter Age"
  value={formData.age}
  onChange={(e) =>
    handleInputChange("age", e.target.value)
  }
/>
            </FormControl>  */}
            <FormControl error={!!errors.age}>
              <FormLabel>Age</FormLabel>

              <Input
                placeholder="Enter Age"
                value={formData.age}
                onChange={(e) =>
                  handleInputChange(
                    "age",
                    e.target.value
                  )
                }
              />

              {errors.age && (
                <Typography
                  level="body-xs"
                  color="danger"
                >
                  {errors.age}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid xs={12} md={4}>
            <FormControl>
              <FormLabel>Qualification</FormLabel>
              <Input
                placeholder="Qualification"
                value={formData.qualification}
                onChange={(e) =>
                  handleInputChange(
                    "qualification",
                    e.target.value
                  )
                }
              />
            </FormControl>
          </Grid>


        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* EMPLOYMENT DETAILS */}
        <Box
          sx={{
            p: 1.5,
            mb: 3,
            borderRadius: "12px",
            background:
              "linear-gradient(90deg, rgba(52,104,232,0.08) 0%, rgba(255,150,36,0.08) 100%)",
          }}
        >
          <Typography
            startDecorator={<WorkIcon />}
            level="title-lg"
            fontWeight="lg"
          >
            Employment Details
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <FormControl>
              <FormLabel>Date of Join</FormLabel>
              <Input
                type="date"
                value={formData.dateOfJoin}
                onChange={(e) =>
                  handleInputChange(
                    "dateOfJoin",
                    e.target.value
                  )
                }
              />
            </FormControl>
          </Grid>

          <Grid xs={12} md={6}>
            <FormControl>
              <FormLabel>Experience</FormLabel>
              <Input
                placeholder="Ex: 5 Years"
                value={formData.experience}
                onChange={(e) =>
                  handleInputChange("experience", e.target.value)
                }
              />            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* ACCOUNT DETAILS */}
        <Box
          sx={{
            p: 1.5,
            mb: 3,
            borderRadius: "12px",
            background:
              "linear-gradient(90deg, rgba(52,104,232,0.08) 0%, rgba(255,150,36,0.08) 100%)",
          }}
        >
          <Typography
            startDecorator={<AccountBalanceIcon />}
            level="title-lg"
            fontWeight="lg"
          >
            Bank Account Details
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <FormControl error={!!errors.accountHolderName}>
              <FormLabel>Account Holder Name</FormLabel>
              <Input
                placeholder="Account Holder Name"
                value={formData.accountHolderName}
                onChange={(e) =>
                  handleInputChange(
                    "accountHolderName",
                    e.target.value
                  )
                }
              />
              {errors.accountHolderName && (
                <Typography level="body-xs" color="danger">
                  {errors.accountHolderName}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid xs={12} md={6}>
            <FormControl error={!!errors.bankName}>
              <FormLabel>Bank Name</FormLabel>
              <Input
                placeholder="Bank Name"
                value={formData.bankName}
                onChange={(e) =>
                  handleInputChange("bankName", e.target.value)
                }
              />
              {errors.bankName && (
                <Typography level="body-xs" color="danger">
                  {errors.bankName}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid xs={12} md={6}>
            <FormControl error={!!errors.accountNumber}>
              <FormLabel>Account Number</FormLabel>
              <Input
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={(e) =>
                  handleInputChange(
                    "accountNumber",
                    e.target.value
                  )
                }
              />
              {errors.accountNumber && (
                <Typography level="body-xs" color="danger">
                  {errors.accountNumber}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid xs={12} md={6}>
            <FormControl>
              <FormLabel>IFSC Code</FormLabel>
              <Input
                placeholder="IFSC Code"
                value={formData.ifscCode}
                onChange={(e) =>
                  handleInputChange(
                    "ifscCode",
                    e.target.value.toUpperCase()
                  )
                }
              />            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* DOCUMENT UPLOADS */}
        <Box
          sx={{
            p: 1.5,
            mb: 3,
            borderRadius: "12px",
            background:
              "linear-gradient(90deg, rgba(52,104,232,0.08) 0%, rgba(255,150,36,0.08) 100%)",
          }}
        >
          <Typography
            startDecorator={<DescriptionIcon />}
            level="title-lg"
            fontWeight="lg"
          >
            Document Uploads
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            {uploadCard(
              "Aadhaar Copy",
              ".pdf,.jpg,.jpeg,.png",
              "aadhar",
              files.aadhar
            )}
          </Grid>

          <Grid xs={12} md={4}>
            {uploadCard(
              "Account Proof",
              ".pdf,.jpg,.jpeg,.png",
              "accountProof",
              files.accountProof
            )}
          </Grid>

          <Grid xs={12} md={4}>
            {uploadCard(
              "Biodata / Resume",
              ".pdf,.doc,.docx",
              "biodata",
              files.biodata
            )}
          </Grid>
        </Grid>

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{ mt: 5 }}
        >
          <Button
            variant="outlined"
            sx={{
              borderRadius: "10px",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            sx={{
              px: 4,
              borderRadius: "10px",
              background:
                "linear-gradient(90deg,#3468E8 0%,#FF9624 100%)",
              color: "#fff",
              fontWeight: 700,
              boxShadow:
                "0 10px 25px rgba(52,104,232,0.25)",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            Register User
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default memo(UserRegistration);