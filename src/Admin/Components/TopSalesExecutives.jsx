import React from "react";
import ReactApexChart from "react-apexcharts";
import {
    Box,
    Card,
    CardContent,
    Avatar,
    Typography,
    Stack,
    Divider,
} from "@mui/material";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import SellIcon from "@mui/icons-material/Sell";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ExecutiveCard from "../../Employee/Component/ExecutiveCard";

const colors = {
    blue: "#1D4ED8",
    blueSoft: "#DBEAFE",
    orange: "#F97316",
    orangeSoft: "#FFEDD5",
    ink: "#0F172A",
    muted: "#64748B",
    border: "#E2E8F0",
    bg: "linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)",
};


const TopSalesExecutives = ({ data = [] }) => {
    const top3 = [...data]
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 3);

    return (
        <Box
            sx={{
                // p: 2.25,
                borderRadius: 4,
                bgcolor: "#fff",
                border: `1px solid ${colors.border}`,
                height:'100%'
            }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                sx={{ mb: 2,p:2.25 }}
            >
                <Box>
                    <Typography sx={{ fontSize: 20, fontWeight: 900, color: colors.ink }}>
                        Top Sales Executives
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: colors.muted }}>
                        Top 3 by completed calls and sold performance
                    </Typography>
                </Box>

            </Stack>

            <Stack direction="column" spacing={2} sx={{
                p:2.25 
            }}>
                {top3.map((item, idx) => (
                    <ExecutiveCard
                        key={item.id || item.name || idx}
                        rank={idx + 1}
                        name={item.name}
                        avatar={item.avatar}
                        calls={item.calls}
                        sold={item.sold}
                        highlight={idx === 0}
                    />
                ))}
            </Stack>
        </Box>
    );
};

export default TopSalesExecutives;