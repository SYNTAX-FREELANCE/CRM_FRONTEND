import { Box } from "@mui/joy";
import { memo, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";

import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

import { axioslogin } from "../../Connection/axios";
import {
    useMotorVehicleCategoryMaster,
    useVehicleTypeMaster
} from "../../CommonCode/useQuery";

import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import { BACKEND_IMAGE } from "../../constant/Static";

const MotorVehicleCategoryCreation = () => {

    const [category, setCategory] = useState({
        vehicleTypeId: "",
        categoryCode: "",
        categoryName: "",
        description: "",
        imageUrl: "",
        isActive: "Active",
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);



    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const {
        refetch: FetchMotorVehicleCategoryMaster
    } = useMotorVehicleCategoryMaster();

    const {
        data: VehicleTypeMaster = []
    } = useVehicleTypeMaster();

    const ActiveVehicleTypeMaster =
        Array.isArray(VehicleTypeMaster)
            ? VehicleTypeMaster
                .filter(
                    item => item.is_active === 1
                )
                .map(item => ({
                    id: item.vehicle_type_id,
                    label: item.vehicle_type_name
                }))
            : [];

    const set = (field) => (e) =>
        setCategory((prev) => ({
            ...prev,
            [field]: e.target.value
        }));

    const getVehicleCategoryById = async (id) => {

        try {

            const result = await axioslogin.get(
                `/motor/vehicle-category/getbyid/${id}`
            );

            const {
                data,
                success,
                message
            } = result?.data;

            if (success !== 1) {
                return errorNotify(message);
            }

        
            setCategory({
                vehicleTypeId: data.vehicle_type_id || "",
                categoryCode: data.category_code || "",
                categoryName: data.category_name || "",
                description: data.description || "",
                imageUrl: data.image_path || "",
                isActive: data.is_active === 1
                    ? "Active"
                    : "Inactive"
            });

            setImagePreview(data.image_path || "");
            setImageFile(null);

        } catch (error) {

            console.error(error);

            warningNotify(
                "Failed to load vehicle category details"
            );
        }
    };

    useEffect(() => {

        if (mode === "edit" && id) {
            getVehicleCategoryById(id);
        }

    }, [id, mode]);

    const handleImageChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            warningNotify(
                "Please select a valid image."
            );

            e.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {

            warningNotify(
                "Image size must be less than 2 MB."
            );

            e.target.value = "";
            return;
        }

        setImageFile(file);

        const previewUrl = URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };

    const validateCategory = () => {

        if (!category.vehicleTypeId) {

            warningNotify(
                "Vehicle Type is required."
            );

            return false;
        }

        if (
            !category.categoryCode ||
            category.categoryCode.trim() === ""
        ) {

            warningNotify(
                "Category Code is required."
            );

            return false;
        }

        if (
            category.categoryCode.trim().length > 50
        ) {

            warningNotify(
                "Category Code must not exceed 50 characters."
            );

            return false;
        }

        if (
            !category.categoryName ||
            category.categoryName.trim() === ""
        ) {

            warningNotify(
                "Category Name is required."
            );

            return false;
        }

        if (
            category.categoryName.trim().length < 2
        ) {

            warningNotify(
                "Category Name must be at least 2 characters."
            );

            return false;
        }

        if (
            category.categoryName.trim().length > 150
        ) {

            warningNotify(
                "Category Name must not exceed 150 characters."
            );

            return false;
        }

        if (
            category.description &&
            category.description.length > 500
        ) {

            warningNotify(
                "Description must not exceed 500 characters."
            );

            return false;
        }

        /*
         * Image is required only while creating.
         * During edit, existing image can remain unchanged.
         */

        if (
            mode !== "edit" &&
            !imageFile
        ) {

            warningNotify(
                "Category Image is required."
            );

            return false;
        }

        return true;
    };

    const handleReset = useCallback(() => {

        setCategory({
            vehicleTypeId: "",
            categoryCode: "",
            categoryName: "",
            description: "",
            imageUrl: "",
            isActive: "Active",
        });

        setImageFile(null);
        setImagePreview("");

        navigate(".", {
            replace: true,
            state: null
        });

    }, [navigate]);

    const handleSave = async () => {

        if (!validateCategory()) {
            return;
        }

        setLoading(true);

        try {

            const formData = new FormData();

            formData.append(
                "vehicle_type_id",
                Number(category.vehicleTypeId)
            );

            formData.append(
                "category_code",
                category.categoryCode.trim()
            );

            formData.append(
                "category_name",
                category.categoryName.trim()
            );

            formData.append(
                "description",
                category.description?.trim() || ""
            );

            formData.append(
                "is_active",
                category.isActive === "Active"
                    ? 1
                    : 0
            );

            /*
             * Only send image when:
             * 1. Creating a new category
             * 2. Editing and selecting a new image
             */

            if (imageFile) {

                formData.append(
                    "image",
                    imageFile
                );
            }

            let response;

            if (mode === "edit") {

                response = await axioslogin.patch(
                    `/motor/vehicle-category/update/${id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

            } else {

                response = await axioslogin.post(
                    "/motor/vehicle-category/create",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }

            const {
                success,
                message
            } = response.data;

            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Vehicle Category updated successfully!"
                        : "Vehicle Category created successfully!"
                );

                FetchMotorVehicleCategoryMaster();

                handleReset();

                if (mode === "edit") {

                    navigate(
                        "/home/setting/commonview",
                        {
                            state: {
                                title:
                                    "Motor Vehicle Category Master",

                                type:
                                    "motorvehiclecategory",

                                idField:
                                    "vehicle_category_id",

                                editRoute:
                                    "motorvehiclecategory",

                                navigateback:
                                    "/home/settings",

                                columns: [
                                    {
                                        field:
                                            "vehicle_type_name",
                                        headerName:
                                            "Vehicle Type"
                                    },
                                    {
                                        field:
                                            "category_code",
                                        headerName:
                                            "Category Code"
                                    },
                                    {
                                        field:
                                            "category_name",
                                        headerName:
                                            "Category Name"
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
                            ? "Failed to update vehicle category"
                            : "Failed to create vehicle category"
                    )
                );
            }

        } catch (error) {

            console.error(error);

            warningNotify(
                error.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating vehicle category"
                        : "Error creating vehicle category"
                )
            );

        } finally {

            setLoading(false);
        }
    };

    const handleCancel = useCallback(() => {

        handleReset();

    }, [handleReset]);

    const handleView = () => {

        navigate(
            "/home/setting/commonview",
            {
                state: {

                    title:
                        "Motor Vehicle Category Master",

                    type:
                        "motorvehiclecategory",

                    idField:
                        "vehicle_category_id",

                    editRoute:
                        "motorvehiclecategory",

                    navigateback:
                        "/home/settings",

                    columns: [
                        {
                            field:
                                "vehicle_type_name",
                            headerName:
                                "Vehicle Type"
                        },
                        {
                            field:
                                "category_code",
                            headerName:
                                "Category Code"
                        },
                        {
                            field:
                                "category_name",
                            headerName:
                                "Category Name"
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

    const handleClose = () => {

        navigate(
            "/home/settings"
        );
    };

    return (
        <Wrapper>

            <Panel title="Motor Vehicle Category Creation">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "60%" }}>

                        <FormRow
                            label="Vehicle Type"
                            required
                        >

                            <SelectLg
                                value={
                                    category.vehicleTypeId
                                }
                                onChange={
                                    set("vehicleTypeId")
                                }
                                options={
                                    ActiveVehicleTypeMaster
                                }
                            />

                        </FormRow>

                        <FormRow
                            label="Category Code"
                            required
                        >

                            <InputLg
                                value={
                                    category.categoryCode
                                }
                                onChange={
                                    set("categoryCode")
                                }
                                placeholder="Enter category code"
                            />

                        </FormRow>

                        <FormRow
                            label="Category Name"
                            required
                        >

                            <InputLg
                                value={
                                    category.categoryName
                                }
                                onChange={
                                    set("categoryName")
                                }
                                placeholder="Enter category name"
                            />

                        </FormRow>

                        <FormRow label="Description">

                            <InputLg
                                value={
                                    category.description
                                }
                                onChange={
                                    set("description")
                                }
                                placeholder="Enter description"
                            />

                        </FormRow>

                        <FormRow
                            label="Category Image"
                            required={mode !== "edit"}
                        >

                            <Box>

                                <input
                                    type="file"
                                    accept="
                                        image/png,
                                        image/jpeg,
                                        image/webp
                                    "
                                    onChange={
                                        handleImageChange
                                    }
                                />

                                {imagePreview && (

                                    <Box
                                        sx={{
                                            marginTop: 1,
                                            width: 160,
                                            height: 110,
                                            border:
                                                "1px solid #ddd",
                                            borderRadius:
                                                "8px",
                                            overflow:
                                                "hidden",
                                            backgroundColor:
                                                "#f8f8f8",
                                        }}
                                    >

                                        <img
                                            src={
                                                imagePreview.startsWith("blob:")
                                                    ? imagePreview
                                                    : `${BACKEND_IMAGE}${imagePreview}`
                                            }
                                            alt={
                                                category.categoryName ||
                                                "Category preview"
                                            }
                                            style={{
                                                width:
                                                    "100%",
                                                height:
                                                    "100%",
                                                objectFit:
                                                    "contain",
                                            }}
                                        />

                                    </Box>
                                )}

                            </Box>

                        </FormRow>

                        <FormRow label="Active Status">

                            <Checkbox
                                value={
                                    category.isActive
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
                            "20px 0",
                    }}
                />

                <div
                    style={{
                        display:
                            "flex",
                        justifyContent:
                            "center",
                        gap:
                            "10px",
                        paddingTop:
                            "8px",
                    }}
                >

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

                </div>

            </Panel>

        </Wrapper>
    );
};

export default memo(
    MotorVehicleCategoryCreation
);
