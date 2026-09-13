
import React, { memo } from "react";
import {
    Box,
    Typography,
    Stack,
} from "@mui/material";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

const EmployeeIncentiveCard = ({
    captureCount,
    incentiveAmount,
    slabs,
}) => {

    const sortedSlabs = [...slabs]?.sort((a, b) => a?.minimum_capture - b?.minimum_capture);

    const currentSlab = [...sortedSlabs]?.filter((slab) => captureCount >= slab?.minimum_capture)?.sort(
        (a, b) =>
            b?.minimum_capture - a?.minimum_capture
    )[0];

    const nextSlab = sortedSlabs?.find(
        (slab) => captureCount < slab?.minimum_capture
    );

    let progress = 0;

    if (currentSlab && nextSlab) {
        progress =
            ((captureCount -
                currentSlab.minimum_capture) /
                (nextSlab.minimum_capture -
                    currentSlab.minimum_capture)) *
            100;
    } else if (currentSlab && !nextSlab) {
        progress = 100;
    }

    progress = Math.min(
        100,
        Math.max(0, progress)
    );

    const currentIndex = currentSlab
        ? sortedSlabs.indexOf(currentSlab)
        : -1;

    return (
        <Box
            sx={{
                width: "100%",
                // bgcolor:'red',
                px: { xs: 1.5, sm: 2.5, md: 3 },
                position: "relative",
                overflow: "hidden",
            }}
        >


            {/* Timeline */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    pt: 2.5,
                }}
            >
                <Stack
                    direction="row"
                    alignItems="flex-start"
                    sx={{
                        width: "100%",
                    }}
                >
                    {
                        sortedSlabs?.map(
                            (slab, index) => {
                                const achieved =
                                    captureCount >=
                                    slab?.minimum_capture;

                                const isCurrent =
                                    currentSlab
                                        ?.minimum_capture ===
                                    slab.minimum_capture;

                                return (
                                    <React.Fragment
                                        key={
                                            slab?.minimum_capture
                                        }
                                    >
                                        {/* Slab */}
                                        <Box
                                            sx={{
                                                width: {
                                                    xs: 42,
                                                    sm: 55,
                                                    md: 65,
                                                },

                                                minWidth: {
                                                    xs: 42,
                                                    sm: 55,
                                                    md: 65,
                                                },

                                                display:
                                                    "flex",
                                                flexDirection:
                                                    "column",
                                                alignItems:
                                                    "center",

                                                position:
                                                    "relative",
                                                zIndex: 3,
                                            }}
                                        >
                                            {/* Circle */}
                                            <Box
                                                sx={{
                                                    width: {
                                                        xs: 29,
                                                        sm: 32,
                                                    },

                                                    height: {
                                                        xs: 29,
                                                        sm: 32,
                                                    },

                                                    borderRadius:
                                                        "50%",

                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",

                                                    background:
                                                        achieved
                                                            ? "linear-gradient(135deg, #2563eb, #f97316)"
                                                            : "#e2e8f0",

                                                    color:
                                                        achieved
                                                            ? "#fff"
                                                            : "#94a3b8",

                                                    border:
                                                        isCurrent
                                                            ? "2px solid #fff"
                                                            : "none",

                                                    boxShadow:
                                                        isCurrent
                                                            ? "0 0 0 3px rgba(249,115,22,0.25), 0 4px 12px rgba(37,99,235,0.18)"
                                                            : "none",
                                                }}
                                            >
                                                {achieved ? (
                                                    <Box
                                                        sx={{
                                                            position: "relative",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            animation: "trophyBounce 1.8s ease-in-out infinite",
                                                            "@keyframes trophyBounce": {
                                                                "0%, 100%": {
                                                                    transform: "translateY(0) scale(1)",
                                                                },
                                                                "50%": {
                                                                    transform: "translateY(-3px) scale(1.08)",
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <EmojiEventsRoundedIcon
                                                            sx={{
                                                                fontSize: 20,
                                                                color: "#f8f7f7",
                                                                filter:
                                                                    "drop-shadow(0 2px 4px rgba(249,115,22,0.45))",
                                                            }}
                                                        />

                                                        {/* Glow */}
                                                        <Box
                                                            sx={{
                                                                position: "absolute",
                                                                inset: -4,
                                                                borderRadius: "50%",
                                                                border: "2px solid rgba(249,115,22,0.25)",
                                                                animation: "trophyGlow 1.8s ease-out infinite",
                                                                "@keyframes trophyGlow": {
                                                                    "0%": {
                                                                        transform: "scale(0.8)",
                                                                        opacity: 0.8,
                                                                    },
                                                                    "100%": {
                                                                        transform: "scale(1.5)",
                                                                        opacity: 0,
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                ) : (
                                                    <>
                                                        <Box
                                                            sx={{
                                                                mt: 0.4,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                gap: 0.4,
                                                                px: 0.7,
                                                                py: 0.25,
                                                                borderRadius: "6px",
                                                                background: achieved
                                                                    ? "rgba(34,197,94,0.10)"
                                                                    : "rgba(100,116,139,0.08)",
                                                                border: achieved
                                                                    ? "1px solid rgba(34,197,94,0.18)"
                                                                    : "1px solid rgba(148,163,184,0.15)",
                                                            }}
                                                        >
                                                            <LockRoundedIcon
                                                                sx={{
                                                                    fontSize: 12,
                                                                    color: achieved ? "#16a34a" : "#94a3b8",
                                                                }}
                                                            />

                                                            <Typography
                                                                sx={{
                                                                    fontSize: {
                                                                        xs: 9,
                                                                        sm: 10,
                                                                    },
                                                                    fontWeight: 900,
                                                                    lineHeight: 1,
                                                                    color: achieved
                                                                        ? "#1e293b"
                                                                        : "#94a3b8",
                                                                }}
                                                            >
                                                                {slab.minimum_capture}
                                                            </Typography>
                                                        </Box>
                                                    </>
                                                )}
                                            </Box>

                                            {/* Slab incentive */}
                                            {
                                                !achieved &&

                                                <Typography
                                                    sx={{
                                                        fontSize: {
                                                            xs: 8,
                                                            sm: 9,
                                                        },
                                                        fontWeight: 700,
                                                        color:
                                                            achieved
                                                                ? "#64748b"
                                                                : "#000000",
                                                    }}>
                                                    ⭐ {Number(slab.incentive_amount / 10)}
                                                </Typography>
                                            }
                                        </Box>

                                        {/* Connector */}
                                        {index <
                                            sortedSlabs.length -
                                            1 && (
                                                <Box
                                                    sx={{
                                                        flex: 1,
                                                        position:
                                                            "relative",
                                                        height: 32,
                                                    }}
                                                >
                                                    {/* Line */}
                                                    <Box
                                                        sx={{
                                                            position:
                                                                "absolute",
                                                            left: 0,
                                                            right: 0,
                                                            top: "14px",
                                                            height: 3,
                                                            borderRadius:
                                                                10,

                                                            background:
                                                                captureCount >=
                                                                    sortedSlabs[
                                                                        index +
                                                                        1
                                                                    ]
                                                                        .minimum_capture
                                                                    ? "linear-gradient(90deg, #2563eb, #f97316)"
                                                                    : "#e2e8f0",
                                                        }}
                                                    />

                                                    {/* Current point + amount */}
                                                    {currentSlab &&
                                                        nextSlab &&
                                                        index === currentIndex && (
                                                            <Box
                                                                sx={{
                                                                    position: "absolute",
                                                                    left: `${progress}%`,
                                                                    top: 10,
                                                                    transform: "translate(-50%, -50%)",
                                                                    zIndex: 5,
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    alignItems: "center",
                                                                }}
                                                            >
                                                                {/* Current Incentive Label */}
                                                                <Box
                                                                    sx={{
                                                                        position: "absolute",
                                                                        bottom: 16,
                                                                        left: "50%",
                                                                        transform: "translateX(-50%)",
                                                                        px: 1,
                                                                        py: 0.45,
                                                                        borderRadius: "7px",
                                                                        background:
                                                                            "linear-gradient(135deg, #f97316, #ea580c)",
                                                                        boxShadow:
                                                                            "0 4px 10px rgba(249,115,22,0.30)",
                                                                        whiteSpace: "nowrap",
                                                                        "&::after": {
                                                                            content: '""',
                                                                            position: "absolute",
                                                                            left: "50%",
                                                                            bottom: -4,
                                                                            transform: "translateX(-50%)",
                                                                            width: 0,
                                                                            height: 0,
                                                                            borderLeft: "4px solid transparent",
                                                                            borderRight: "4px solid transparent",
                                                                            borderTop: "5px solid #ea580c",
                                                                        },
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: { xs: 9, sm: 12 },
                                                                            fontWeight: 900,
                                                                            color: "#fff",
                                                                            lineHeight: 1,
                                                                        }}
                                                                    >
                                                                        ⭐ {Number(incentiveAmount / 10).toFixed(1)}
                                                                    </Typography>
                                                                </Box>

                                                                {/* Current Point */}
                                                                {/* Current Point */}
                                                                <Box
                                                                    sx={{
                                                                        position: "relative",
                                                                        width: 0,
                                                                        height: 0,
                                                                        borderLeft: "8px solid transparent",
                                                                        borderRight: "8px solid transparent",
                                                                        borderTop: "13px solid #f97316",
                                                                        filter:
                                                                            "drop-shadow(0 3px 5px rgba(249,115,22,0.40))",
                                                                        zIndex: 2,

                                                                        "&::before": {
                                                                            content: '""',
                                                                            position: "absolute",
                                                                            left: "50%",
                                                                            top: -15,
                                                                            transform: "translateX(-50%)",
                                                                            width: 6,
                                                                            height: 6,
                                                                            borderRadius: "50%",
                                                                            background: "#fff",
                                                                        },
                                                                    }}
                                                                />
                                                            </Box>
                                                        )}
                                                </Box>
                                            )}
                                    </React.Fragment>
                                );
                            }
                        )}
                </Stack>
            </Box>
        </Box>
    );
};

export default memo(EmployeeIncentiveCard);

