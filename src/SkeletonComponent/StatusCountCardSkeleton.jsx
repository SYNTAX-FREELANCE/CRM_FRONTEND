import React from "react";
import { Card, CardContent, Skeleton } from "@mui/material";

const StatusCountCardSkeleton = () => {
    return (
        <Card
            elevation={0}
            sx={{
                minWidth: 0,
                borderRadius: 4,
                border: "1px solid rgba(226,232,240,.8)",
                borderLeft: "4px solid rgba(252,143,26,.45)",

                background: `
                    radial-gradient(circle at 15% 20%, rgba(37,99,235,0.14) 0%, transparent 30%),
                    radial-gradient(circle at 85% 15%, rgba(249,115,22,0.12) 0%, transparent 28%),
                    linear-gradient(180deg, #f8fbff 0%, #ffffff 45%, #f8fafc 100%)
                `,

                boxShadow: `
                    0 12px 30px rgba(15,23,42,.06),
                    inset 0 1px 0 rgba(255,255,255,.8)
                `,
            }}
        >
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Skeleton
                    variant="text"
                    width={90}
                    height={18}
                    sx={{ mb: 1, borderRadius: 1 }}
                />

                <Skeleton
                    variant="text"
                    width={80}
                    height={52}
                    sx={{ borderRadius: 1 }}
                />
            </CardContent>
        </Card>
    );
};

export default React.memo(StatusCountCardSkeleton);