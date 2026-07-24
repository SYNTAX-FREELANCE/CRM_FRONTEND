import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
  Stack,
} from "@mui/joy";
import EditIcon from "@mui/icons-material/Edit";

import MasterWrapper from "../../Settings/CommonMasterComponent/MasterWrapper";
import MasterTable from "../../Settings/CommonMasterComponent/MasterTable";

const BankMaster = () => {
  const [formData, setFormData] = useState({
    bankName: "",
    status: true,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      status: event.target.checked,
    }));
  };

  const handleSave = () => {
    if (!formData.bankName.trim()) {
      alert("Please enter Bank Name");
      return;
    }

  };

  const handleReset = () => {
    setFormData({
      bankName: "",
      status: true,
    });
  };

  const handleEdit = useCallback(() => {
  }, []);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Slno",
        field: "menu_slno",
        width: 90,
      },
      {
        headerName: "Bank Name",
        field: "menu_name",
      },
      {
        headerName: "Status",
        field: "menu_status",
        filter: false,
        valueFormatter: (params) =>
          params.value === 1 ? "Active" : "Inactive",
      },
      {
        headerName: "Action",
        width: 100,

        // disable filter & sort
        filter: false,
        sortable: false,
        floatingFilter: false,

        cellRenderer: (params) => (
          <EditIcon
            style={{ cursor: "pointer", color: "#1976d2" }}
            onClick={() => handleEdit(params.data)}
          />
        ),
      },
    ],
    [handleEdit]
  );

  return (
    <MasterWrapper title="Bank Master">
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          alignItems: 'flex-start',
          width: '100%',
          height: '100%',
          p: 2
        }}
      >
        {/* Left Side - Form */}
        <Card sx={{ width: '30%' }}>
          <CardContent>
            <Typography level="h5" mb={2}>
              Add Bank Name
            </Typography>

            <Stack spacing={2}>
              <FormControl required>
                <FormLabel>Bank Name</FormLabel>
                <Input
                  name="bankName"
                  placeholder="Enter Bank Name"
                  value={formData.bankName}
                  onChange={handleInputChange}
                />
              </FormControl>

              <Checkbox
                label="Active Status"
                checked={formData.status}
                onChange={handleStatusChange}
              />

              <Stack direction="row" spacing={1}>
                <Button color="primary" onClick={handleSave}>
                  Save
                </Button>

                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* RIGHT - TABLE */}
        <Card sx={{ width: '70%', minHeight: '50%' }}>
          <CardContent>
            <MasterTable
              columnDefs={columnDefs}
              rowData={[]}
            />

          </CardContent>
        </Card>
      </Box>
    </MasterWrapper>
  );
};

export default memo(BankMaster);