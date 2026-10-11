import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import { Box } from "@mui/joy";
import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";

import { axioslogin } from "../../Connection/axios";

import {
    errorNotify,
    successNotify,
} from "../../constant/Constant";

import {
    useMotorVehicleCategoryMaster,
} from "../../CommonCode/useQuery";

import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";

const MotorProfitCreation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);

    const [profit, setProfit] = useState({
        vehicleCategoryId: "",
        profitAmount: "",
        description: "",
        isActive: "Active",
    });

    /*
     * MASTER DATA
     */

    const {
        data: MotorVehicleCategoryMaster = [],
    } = useMotorVehicleCategoryMaster();

    /*
     * ACTIVE VEHICLE CATEGORY OPTIONS
     */

    const ActiveMotorVehicleCategoryMaster =
        MotorVehicleCategoryMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.vehicle_category_id,
                label: item?.category_code
                    ? `${item.category_code} - ${item.category_name}`
                    : item.category_name,
            })) || [];

    /*
     * SET FORM VALUE
     */

    const set = field => event => {
        setProfit(prev => ({
            ...prev,
            [field]:
                event?.target?.value !== undefined
                    ? event.target.value
                    : event,
        }));
    };

    /*
     * FETCH EDIT DATA
     */

    useEffect(() => {
        if (editId) {
            setMode("edit");
            fetchProfit(editId);
        }
    }, [editId]);

    const fetchProfit = async id => {
        try {
            setLoading(true);

            const response = await axioslogin.get(
                `/motor/profit/getbyid/${id}`
            );

            if (response?.data?.success === 1) {
                const data = response?.data?.data;

                setProfit({
                    vehicleCategoryId:
                        data?.vehicle_category_id ?? "",

                    profitAmount:
                        data?.profit_amount ?? "",

                    description:
                        data?.description || "",

                    isActive:
                        Number(data?.is_active) === 1
                            ? "Active"
                            : "Inactive",
                });
            } else {
                errorNotify(
                    response?.data?.message ||
                    "Failed to fetch profit"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to fetch profit"
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * VALIDATION
     */

    const validate = () => {
        if (
            !profit.vehicleCategoryId ||
            isNaN(profit.vehicleCategoryId) ||
            Number(profit.vehicleCategoryId) <= 0
        ) {
            errorNotify("Vehicle category is required");
            return false;
        }

        if (
            profit.profitAmount === "" ||
            profit.profitAmount === null ||
            profit.profitAmount === undefined ||
            isNaN(profit.profitAmount) ||
            Number(profit.profitAmount) < 0
        ) {
            errorNotify("Valid profit amount is required");
            return false;
        }

        if (
            profit.description &&
            profit.description.length > 500
        ) {
            errorNotify(
                "Description cannot exceed 500 characters"
            );
            return false;
        }

        return true;
    };

    /*
     * CANCEL
     */

    const handleCancel = useCallback(() => {
        setProfit({
            vehicleCategoryId: "",
            profitAmount: "",
            description: "",
            isActive: "Active",
        });

        navigate(".", {
            replace: true,
            state: null,
        });
    }, [navigate]);

    /*
     * CLOSE
     */

    const handleClose = () => {
        navigate("/home/settings");
    };

    /*
     * VIEW
     */

    const handleView = () => {
        navigate(
            "/home/setting/commonview",
            {
                state: {
                    title: "Motor Profit Master",

                    type: "motorprofit",

                    idField: "profit_id",

                    editRoute: "motorprofit",

                    columns: [
                        {
                            field: "category_name",
                            headerName: "Vehicle Category",
                        },
                        {
                            field: "profit_amount",
                            headerName: "Profit Amount",
                        },
                        {
                            field: "description",
                            headerName: "Description",
                        },
                        {
                            field: "is_active",
                            headerName: "Status",
                            type: "status",
                        },
                    ],
                },
            }
        );
    };

    /*
     * SAVE
     */

    const handleSave = async () => {
        if (!validate()) return;

        const payload = {
            vehicle_category_id:
                Number(profit.vehicleCategoryId),

            profit_amount:
                Number(profit.profitAmount),

            description:
                profit.description
                    ? profit.description.trim()
                    : null,

            is_active:
                String(profit.isActive) === "Active"
                    ? 1
                    : 0,
        };

        try {
            setLoading(true);

            let response;

            if (mode === "edit") {
                response = await axioslogin.put(
                    `/motor/profit/update/${editId}`,
                    payload
                );
            } else {
                response = await axioslogin.post(
                    `/motor/profit/create`,
                    payload
                );
            }

            if (response?.data?.success === 1) {
                successNotify(
                    response?.data?.message ||
                    `Profit ${mode === "edit"
                        ? "updated"
                        : "created"
                    } successfully`
                );

                handleCancel();

                if (mode === "edit") {
                    handleView();
                }
            } else {
                errorNotify(
                    response?.data?.message ||
                    "Failed to save profit"
                );
            }
        } catch (error) {
            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save profit"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Wrapper>
            <Panel
                title={
                    mode === "edit"
                        ? "Edit Motor Profit"
                        : "Motor Profit Creation"
                }
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px",
                    }}
                >
                    <Box sx={{ width: "70%" }}>

                        <FormRow
                            label="Vehicle Category"
                            required
                        >
                            <SelectLg
                                options={
                                    ActiveMotorVehicleCategoryMaster
                                }
                                value={
                                    profit.vehicleCategoryId
                                }
                                onChange={
                                    set("vehicleCategoryId")
                                }
                            />
                        </FormRow>

                        <FormRow
                            label="Fixed Profit Amount"
                            required
                        >
                            <InputLg
                                type="number"
                                value={profit.profitAmount}
                                onChange={set("profitAmount")}
                            />
                        </FormRow>

                        <FormRow label="Description">
                            <InputLg
                                value={profit.description}
                                onChange={set("description")}
                            />
                        </FormRow>

                        <FormRow label="Status">
                            <Checkbox
                                value={profit.isActive}
                                onChange={set("isActive")}
                            />
                        </FormRow>

                    </Box>
                </Box>

                <div
                    style={{
                        borderTop: "1px solid #e5e7eb",
                        margin: "20px 0",
                    }}
                />

                <ButtonWrapper>
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
                </ButtonWrapper>
            </Panel>
        </Wrapper>
    );
};

export default MotorProfitCreation;