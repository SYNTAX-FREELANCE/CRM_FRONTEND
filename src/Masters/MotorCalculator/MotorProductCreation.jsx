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

const MotorProductCreation = () => {

    const [product, setProduct] = useState({
        productCode: "",
        productName: "",
        description: "",
        isActive: "Active"
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const set = (field) => (e) =>
        setProduct((prev) => ({
            ...prev,
            [field]: e.target.value
        }));

    const getProductById = async (id) => {
        try {

            const result = await axioslogin.get(
                `/motor/product/getbyid/${id}`
            );

            const { data, success, message } = result?.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setProduct({
                productCode: data.product_code || "",
                productName: data.product_name || "",
                description: data.description || "",
                isActive: data.is_active === 1
                    ? "Active"
                    : "Inactive"
            });

        } catch (error) {

            console.error(error);

            warningNotify(
                "Failed to load product details"
            );
        }
    };

    useEffect(() => {
        if (mode === "edit" && id) {
            getProductById(id);
        }
    }, [id, mode]);

    const validateProduct = () => {

        if (
            !product.productCode ||
            product.productCode.trim() === ""
        ) {
            warningNotify("Product Code is required.");
            return false;
        }

        if (product.productCode.trim().length > 50) {
            warningNotify(
                "Product Code must not exceed 50 characters."
            );
            return false;
        }

        if (
            !product.productName ||
            product.productName.trim() === ""
        ) {
            warningNotify("Product Name is required.");
            return false;
        }

        if (product.productName.trim().length < 2) {
            warningNotify(
                "Product Name must be at least 2 characters."
            );
            return false;
        }

        if (product.productName.trim().length > 150) {
            warningNotify(
                "Product Name must not exceed 150 characters."
            );
            return false;
        }

        if (
            product.description &&
            product.description.trim().length > 500
        ) {
            warningNotify(
                "Description must not exceed 500 characters."
            );
            return false;
        }

        return true;
    };

    const handleReset = useCallback(() => {

        setProduct({
            productCode: "",
            productName: "",
            description: "",
            isActive: "Active"
        });
        
        navigate(".", { replace: true, state: null });

    }, [navigate]);

    const handleSave = async () => {

        if (!validateProduct()) return;

        setLoading(true);

        try {

            const productData = {
                product_code: product.productCode.trim(),
                product_name: product.productName.trim(),
                description:
                    product.description?.trim() || null
            };

            let response;

            if (mode === "edit") {

                response = await axioslogin.put(
                    `/motor/product/update/${id}`,
                    productData
                );

            } else {

                response = await axioslogin.post(
                    "/motor/product/create",
                    productData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Product updated successfully!"
                        : "Product created successfully!"
                );

                handleReset();

                if (mode === "edit") {

                    navigate("/home/setting/commonview", {
                        state: {
                            title: "Motor Product Master",
                            type: "motorproduct",
                            idField: "product_id",
                            editRoute: "motorproduct",
                            navigateback: "/home/settings",

                            columns: [
                                {
                                    field: "product_code",
                                    headerName: "Product Code"
                                },
                                {
                                    field: "product_name",
                                    headerName: "Product Name"
                                },
                                {
                                    field: "description",
                                    headerName: "Description"
                                },
                                {
                                    field: "is_active",
                                    headerName: "Status",
                                    type: "status"
                                }
                            ]
                        }
                    });
                }

            } else {

                warningNotify(
                    message ||
                    (
                        mode === "edit"
                            ? "Failed to update product"
                            : "Failed to create product"
                    )
                );
            }

        } catch (error) {

            console.error(error);

            warningNotify(
                error.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating product"
                        : "Error creating product"
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

        navigate("/home/setting/commonview", {
            state: {
                title: "Motor Product Master",
                type: "motorproduct",
                idField: "product_id",
                editRoute: "motorproduct",
                navigateback: "/home/settings",

                columns: [
                    {
                        field: "product_code",
                        headerName: "Product Code"
                    },
                    {
                        field: "product_name",
                        headerName: "Product Name"
                    },
                    {
                        field: "description",
                        headerName: "Description"
                    },
                    {
                        field: "is_active",
                        headerName: "Status",
                        type: "status"
                    }
                ]
            }
        });
    };

    const handleClose = () => {
        navigate("/home/settings");
    };

    return (
        <Wrapper>

            <Panel title="Motor Product Creation">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "60%" }}>

                        <FormRow label="Product Code" required>
                            <InputLg
                                value={product.productCode}
                                onChange={set("productCode")}
                                placeholder="Enter product code"
                            />
                        </FormRow>

                        <FormRow label="Product Name" required>
                            <InputLg
                                value={product.productName}
                                onChange={set("productName")}
                                placeholder="Enter product name"
                            />
                        </FormRow>

                        <FormRow label="Description">
                            <InputLg
                                value={product.description}
                                onChange={set("description")}
                                placeholder="Enter description"
                            />
                        </FormRow>

                        <FormRow label="Active Status">
                            <Checkbox
                                value={product.isActive}
                                onChange={set("isActive")}
                            />
                        </FormRow>

                    </Box>

                </Box>

                <div
                    style={{
                        borderTop: "1px solid #e5e7eb",
                        margin: "20px 0"
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        paddingTop: "8px"
                    }}
                >

                    <Button
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>

                    <Button onClick={handleCancel}>
                        Cancel
                    </Button>

                    <Button onClick={handleView}>
                        View
                    </Button>

                    <Button onClick={handleClose}>
                        Close
                    </Button>

                </div>

            </Panel>

        </Wrapper>
    );
};

export default memo(MotorProductCreation);