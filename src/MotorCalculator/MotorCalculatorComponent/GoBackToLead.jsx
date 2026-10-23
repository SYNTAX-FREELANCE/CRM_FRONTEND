import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Fab,
    Tooltip,
} from "@mui/material";

import WavingHandIcon from '@mui/icons-material/WavingHand';

const GoBackToLead = ({ leadId, statusId }) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate("/home/freshcalls", {
            state: {
                lead_id: leadId,
                status_id: statusId,
                openLeadDrawer: true,
            },
        });
    };

    return (
        <Tooltip title="Go back to Lead" placement="left">
            <Fab
                color="primary"
                variant="extended"
                onClick={handleGoBack}
                sx={{
                    position: "fixed",
                    right: 24,
                    bottom: 84,
                    zIndex: 1500,
                    textTransform: "none",
                    gap: 1,
                    fontWeight: 600,
                }}
            >
                <WavingHandIcon />
            </Fab>
        </Tooltip>
    );
};

export default GoBackToLead;
