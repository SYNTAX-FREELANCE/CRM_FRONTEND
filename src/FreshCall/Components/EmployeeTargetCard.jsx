import React, { memo } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography
} from "@mui/material";

import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PercentIcon from "@mui/icons-material/Percent";


const EmployeeTargetCard = ({ data = [] }) => {

    const emp = data[0];

    if (!emp) return null;


    const totalTarget =
        Number(emp.normal_target) + Number(emp.renewal_target);


    const achievement =
        totalTarget > 0
            ? ((Number(emp.total_sold) / totalTarget) * 100).toFixed(2)
            : 0;


    const cards = [
        {
            title: "Normal Target",
            value: emp.normal_target,
            icon: <TrackChangesIcon sx={{
                fontSize: 12,
                color: '#186f11'
            }} />
        },
        {
            title: "Normal Sold",
            value: emp.normal_sold,
            icon: <TrendingUpIcon sx={{
                fontSize: 12,
                color: '#ff5a0d'
            }} />
        },
        {
            title: "Renewal Target",
            value: emp.renewal_target,
            icon: <AutorenewIcon sx={{
                fontSize: 12,
                color: '#186f11'
            }} />
        },
        {
            title: "Renewal Sold",
            value: emp.renewal_sold,
            icon: <TrendingUpIcon sx={{
                fontSize: 12,
                color: '#ff5a0d'
            }} />
        },
        {
            title: "Total Sold",
            value: emp.total_sold,
            icon: <TrendingUpIcon sx={{
                fontSize: 12,
                color: '#186f11'
            }} />
        },
        {
            title: "Achievement",
            value: `${achievement}%`,
            icon: <PercentIcon sx={{
                fontSize: 12,
                color: '#ff5a0d'
            }} />
        }
    ];


    return (

        <Box
            display="grid"
            gridTemplateColumns={{
                xs: "repeat(2,1fr)",
                sm: "repeat(4,1fr)",
                md: "repeat(6,1fr)"
            }}
            gap={1.5}
            width={'100%'}
        >

            {cards?.map((card) => (

                <Card
                    key={card.title}
                    sx={{
                        borderRadius: 2,
                        boxShadow: 2,
                        height: 60
                    }}
                >

                    <CardContent
                        sx={{
                            p: 1,
                        }}
                    >

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    fontSize: 10,
                                    fontWeight: 800
                                }}
                            >
                                {card.title}
                            </Typography>


                            <Box
                                sx={{
                                    fontSize: 8,
                                    display: "flex"
                                }}
                            >
                                {card.icon}
                            </Box>

                        </Box>


                        <Typography
                            fontWeight={700}
                            sx={{
                                fontSize: 16
                            }}
                        >
                            {card.value}
                        </Typography>


                    </CardContent>

                </Card>

            ))}

        </Box>

    );
};


export default memo(EmployeeTargetCard);