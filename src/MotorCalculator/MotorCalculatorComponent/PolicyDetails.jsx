
import React from "react";
import { Box, Button, Typography } from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

import {
    useMotorPolicyTermMaster,
    useMotorBusinessTypeMaster,
    useMotorPolicyTypeMaster,
    useMotorProductMaster,
} from "../../CommonCode/useQuery";

const PolicyDetails = ({
    value,
    onChange,
    onConfirm,
}) => {
    // ============================================================
    // MASTER DATA
    // ============================================================

    const {
        data: productResponse,
        isLoading: productLoading,
    } = useMotorProductMaster();

    const {
        data: policyTypeResponse,
        isLoading: policyTypeLoading,
    } = useMotorPolicyTypeMaster();

    const {
        data: businessTypeResponse,
        isLoading: businessTypeLoading,
    } = useMotorBusinessTypeMaster();

    const {
        data: policyTermResponse,
        isLoading: policyTermLoading,
    } = useMotorPolicyTermMaster();

    // ============================================================
    // ACTIVE MASTER DATA
    // ============================================================

    const products =
        productResponse
            ?.filter(
                (item) =>
                    Number(item?.is_active) === 1
            )
            ?.map((item) => ({
                id: item.product_id,
                label: item.product_name,
            })) || [];

    const policyTypes =
        policyTypeResponse
            ?.filter(
                (item) =>
                    Number(item?.is_active) === 1
            )
            ?.map((item) => ({
                id: item.policy_type_id,
                label: item.policy_type_name,
            })) || [];

    const businessTypes =
        businessTypeResponse
            ?.filter(
                (item) =>
                    Number(item?.is_active) === 1
            )
            ?.map((item) => ({
                id: item.business_type_id,
                label: item.business_type_name,
            })) || [];

    const policyTerms =
        policyTermResponse
            ?.filter(
                (item) =>
                    Number(item?.is_active) === 1
            )
            ?.map((item) => ({
                id: item.policy_term_id,
                label: item.term_name,
            })) || [];

    // ============================================================
    // CHANGE HANDLER
    // ============================================================

    const handleChange = (field, fieldValue) => {
        onChange({
            ...(value || {}),
            [field]: fieldValue,
        });
    };

    // ============================================================
    // REQUIRED FIELDS
    // ============================================================

    const canContinue =
        Boolean(value?.product_id) &&
        Boolean(value?.policy_type_id) &&
        Boolean(value?.business_type_id) &&
        Boolean(value?.policy_term_id) &&
        Boolean(value?.policy_start_date);

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <Box>
            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    mb: 1,
                }}
            >
                <DescriptionRoundedIcon
                    sx={{
                        fontSize: 18,
                        color: "primary.main",
                    }}
                />

                <Box>
                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 700,
                        }}
                    >
                        Policy Details
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 10,
                            color: "text.secondary",
                        }}
                    >
                        Select policy information
                    </Typography>
                </Box>
            </Box>

            {/* POLICY FIELDS */}

            <Box
                sx={{
                    display: "grid",

                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },

                    gap: 1,
                }}
            >
                {/* PRODUCT */}

                <Box>
                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 600,
                            mb: 0.4,
                        }}
                    >
                        Product
                    </Typography>

                    <select
                        value={
                            value?.product_id || ""
                        }
                        onChange={(e) =>
                            handleChange(
                                "product_id",
                                e.target.value
                                    ? Number(
                                          e.target.value
                                      )
                                    : null
                            )
                        }
                        disabled={productLoading}
                        style={{
                            width: "100%",
                            height: 36,
                            padding: "0 8px",
                            borderRadius: 6,
                            border:
                                "1px solid #cbd5e1",
                            background:
                                "transparent",
                        }}
                    >
                        <option value="">
                            Select Product
                        </option>

                        {products.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </Box>

                {/* POLICY TYPE */}

                <Box>
                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 600,
                            mb: 0.4,
                        }}
                    >
                        Policy Type
                    </Typography>

                    <select
                        value={
                            value?.policy_type_id || ""
                        }
                        onChange={(e) =>
                            handleChange(
                                "policy_type_id",
                                e.target.value
                                    ? Number(
                                          e.target.value
                                      )
                                    : null
                            )
                        }
                        disabled={policyTypeLoading}
                        style={{
                            width: "100%",
                            height: 36,
                            padding: "0 8px",
                            borderRadius: 6,
                            border:
                                "1px solid #cbd5e1",
                            background:
                                "transparent",
                        }}
                    >
                        <option value="">
                            Select Policy Type
                        </option>

                        {policyTypes.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </Box>

                {/* BUSINESS TYPE */}

                <Box>
                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 600,
                            mb: 0.4,
                        }}
                    >
                        Business Type
                    </Typography>

                    <select
                        value={
                            value?.business_type_id ||
                            ""
                        }
                        onChange={(e) =>
                            handleChange(
                                "business_type_id",
                                e.target.value
                                    ? Number(
                                          e.target.value
                                      )
                                    : null
                            )
                        }
                        disabled={businessTypeLoading}
                        style={{
                            width: "100%",
                            height: 36,
                            padding: "0 8px",
                            borderRadius: 6,
                            border:
                                "1px solid #cbd5e1",
                            background:
                                "transparent",
                        }}
                    >
                        <option value="">
                            Select Business Type
                        </option>

                        {businessTypes.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </Box>

                {/* POLICY TERM */}

                <Box>
                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 600,
                            mb: 0.4,
                        }}
                    >
                        Policy Term
                    </Typography>

                    <select
                        value={
                            value?.policy_term_id || ""
                        }
                        onChange={(e) =>
                            handleChange(
                                "policy_term_id",
                                e.target.value
                                    ? Number(
                                          e.target.value
                                      )
                                    : null
                            )
                        }
                        disabled={policyTermLoading}
                        style={{
                            width: "100%",
                            height: 36,
                            padding: "0 8px",
                            borderRadius: 6,
                            border:
                                "1px solid #cbd5e1",
                            background:
                                "transparent",
                        }}
                    >
                        <option value="">
                            Select Policy Term
                        </option>

                        {policyTerms.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </Box>
            </Box>

            {/* DATES */}

            <Box
                sx={{
                    display: "grid",

                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                    },

                    gap: 1,
                    mt: 1,
                }}
            >
                {/* POLICY START DATE */}

                <Box>
                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 600,
                            mb: 0.4,
                        }}
                    >
                        Policy Start Date
                    </Typography>

                    <input
                        type="date"
                        value={
                            value?.policy_start_date ||
                            ""
                        }
                        onChange={(e) =>
                            handleChange(
                                "policy_start_date",
                                e.target.value || null
                            )
                        }
                        style={{
                            width: "100%",
                            height: 36,
                            boxSizing: "border-box",
                            padding: "0 8px",
                            borderRadius: 6,
                            border:
                                "1px solid #cbd5e1",
                            background:
                                "transparent",
                        }}
                    />
                </Box>

                {/* PREVIOUS POLICY EXPIRY */}

                <Box>
                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 600,
                            mb: 0.4,
                        }}
                    >
                        Previous Policy Expiry
                    </Typography>

                    <input
                        type="date"
                        value={
                            value?.previous_policy_expiry ||
                            ""
                        }
                        onChange={(e) =>
                            handleChange(
                                "previous_policy_expiry",
                                e.target.value || null
                            )
                        }
                        style={{
                            width: "100%",
                            height: 36,
                            boxSizing: "border-box",
                            padding: "0 8px",
                            borderRadius: 6,
                            border:
                                "1px solid #cbd5e1",
                            background:
                                "transparent",
                        }}
                    />
                </Box>
            </Box>

            {/* CONTINUE */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 1.2,
                }}
            >
                <Button
                    size="small"
                    variant="contained"
                    disabled={!canContinue}
                    onClick={onConfirm}
                    endIcon={
                        <ArrowForwardRoundedIcon
                            sx={{
                                fontSize: 16,
                            }}
                        />
                    }
                    sx={{
                        minHeight: 32,
                        px: 1.5,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "none",
                    }}
                >
                    Confirm & Continue
                </Button>
            </Box>
        </Box>
    );
};

export default PolicyDetails;
