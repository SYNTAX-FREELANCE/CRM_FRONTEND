import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Box,
    FormControl,
    MenuItem,
    Select,
} from "@mui/material";

import CampaignIcon from "@mui/icons-material/Campaign";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import BlockIcon from "@mui/icons-material/Block";
import PhoneForwardedIcon from "@mui/icons-material/PhoneForwarded";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import SellIcon from "@mui/icons-material/Sell";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SecurityIcon from "@mui/icons-material/Security";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import PhoneIcon from "@mui/icons-material/Phone";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import CallMissedIcon from "@mui/icons-material/CallMissed";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import CallMadeIcon from "@mui/icons-material/CallMade";

import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOffIcon from "@mui/icons-material/PersonOff";

import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";

import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TodayIcon from "@mui/icons-material/Today";

import EmailIcon from "@mui/icons-material/Email";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import BusinessIcon from "@mui/icons-material/Business";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";

import { axioslogin } from "../../Connection/axios";

import {
    errorNotify,
    successNotify,
    warningNotify,
} from "../../constant/Constant";

import { useCallOutcomeMaster } from "../../CommonCode/useQuery";
import { getOutcomeIcons } from "../../CommonCode/outcomeIcons";
import { useLocation, useNavigate } from "react-router-dom";

const CallOutcomeCreation = () => {

    const [outcome, setOutcome] = useState({
        outcomeKey: "",
        outcomeLabel: "",
        iconKey: "",
        displayOrder: "",
        isActive: "Active",
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const OUTCOME_ICONS = getOutcomeIcons();

    const { id, mode } = location.state || {};

    const {
        refetch: FetchCallOutcomeMaster,
    } = useCallOutcomeMaster();


    /*
       ICON MAP
 */

    const iconMap = useMemo(() => {
        return OUTCOME_ICONS.reduce(
            (acc, item) => {
                acc[item.key] = item.Icon;
                return acc;
            },
            {}
        );
    }, []);


    /*
       SET FIELD
 */

    const set = (field) => (e) => {

        setOutcome((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));

    };


    /*
       RESET
 */

    const handleReset = useCallback(() => {

        setOutcome({
            outcomeKey: "",
            outcomeLabel: "",
            iconKey: "",
            displayOrder: "",
            isActive: "Active",
        });

    }, []);


    /*
       VALIDATION
 */

    const validateCallOutcome = () => {

        if (!outcome.outcomeKey.trim()) {

            warningNotify(
                "Outcome Key is required"
            );

            return false;

        }


        if (
            !/^[A-Za-z0-9_]+$/.test(
                outcome.outcomeKey.trim()
            )
        ) {

            warningNotify(
                "Outcome Key can contain only letters, numbers and underscore"
            );

            return false;

        }


        if (!outcome.outcomeLabel.trim()) {

            warningNotify(
                "Outcome Label is required"
            );

            return false;

        }


        if (!outcome.iconKey) {

            warningNotify(
                "Please select an icon"
            );

            return false;

        }


        if (
            outcome.displayOrder === "" ||
            outcome.displayOrder === null
        ) {

            warningNotify(
                "Display Order is required"
            );

            return false;

        }


        if (
            !Number.isInteger(
                Number(outcome.displayOrder)
            ) ||
            Number(outcome.displayOrder) < 0
        ) {

            warningNotify(
                "Display Order must be a valid number"
            );

            return false;

        }


        return true;

    };


    /*
       GET BY ID
 */

    const getCallOutcomeById = async (outcomeId) => {

        try {

            const response = await axioslogin.get(
                `/calloutcome/getbyid/${outcomeId}`
            );

            const {
                success,
                data,
                message,
            } = response.data;


            if (success !== 1) {

                errorNotify(
                    message ||
                    "Call outcome not found"
                );

                return;

            }


            setOutcome({
                outcomeKey: data.outcome_key || "",
                outcomeLabel: data.outcome_label || "",
                iconKey: data.icon_key || "",
                displayOrder: data.display_order ?? "",
                isActive: data.is_active === 1
                    ? "Active"
                    : "Inactive",

            });

        } catch (error) {

            console.error(
                "getCallOutcomeById error:",
                error
            );

            errorNotify(
                error?.response?.data?.message ||
                "Failed to load call outcome"
            );

        }

    };


    /*
       LOAD EDIT DATA
 */

    useEffect(() => {
        if (mode === "edit" && id) {
            getCallOutcomeById(id);
        }
    }, [id, mode]);


    /*
       SAVE
 */

    const handleSave = async () => {

        if (!validateCallOutcome()) {
            return;
        }

        setLoading(true);

        try {

            const outcomeData = {

                outcome_key:
                    outcome.outcomeKey
                        .trim()
                        .toUpperCase(),

                outcome_label: outcome.outcomeLabel.trim(),

                icon_key: outcome.iconKey,

                display_order: Number(outcome.displayOrder),

                is_active: outcome.isActive === "Active"
                    ? 1
                    : 0,

            };


            let response;


            if (mode === "edit" && id) {

                response =
                    await axioslogin.patch(
                        `/calloutcome/update/${id}`,
                        outcomeData
                    );

            } else {
                response =
                    await axioslogin.post(
                        "/calloutcome/create",
                        outcomeData
                    );

            }

            const { success, message, } = response.data;
            if (success === 1) {
                successNotify(
                    mode === "edit"
                        ? "Call outcome updated successfully"
                        : "Call outcome created successfully"
                );

                await FetchCallOutcomeMaster();
                handleReset();

            } else {

                warningNotify(
                    message ||
                    "Something went wrong"
                );

            }

        } catch (error) {

            console.error(
                "Call outcome save error:",
                error
            );


            warningNotify(
                error?.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

    };


    /*
       VIEW
 */

    const handleView = () => {
        navigate(
            "/home/setting/commonview",
            {
                state: {
                    title: "Call Outcome Master",
                    type: "calloutcome",
                    idField: "outcome_id",
                    editRoute: "calloutcome",
                    columns: [
                        {
                            field: "outcome_key",
                            headerName: "Outcome Key",
                        },

                        {
                            field:
                                "outcome_label",

                            headerName:
                                "Outcome",
                        },

                        {
                            field:
                                "icon_key",

                            headerName:
                                "Icon",
                        },

                        {
                            field:
                                "display_order",

                            headerName:
                                "Order",
                        },

                        {
                            field:
                                "is_active",

                            headerName:
                                "Status",

                            type:
                                "status",
                        },

                    ],

                },
            }
        );

    };


    /*
       CLOSE
 */

    const handleClose = useCallback(() => {

        navigate("/home/settings");

    }, [navigate]);


    /*
       SELECTED ICON
 */

    const SelectedIcon =
        iconMap[outcome.iconKey];


    /*
       UI
 */

    return (

        <Wrapper>

            <Panel
                title={
                    mode === "edit"
                        ? "Edit Call Outcome"
                        : "Call Outcome Creation"
                }
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px",
                    }}
                >

                    <Box
                        sx={{
                            width: "70%",
                        }}
                    >

                        {/* =================================
                            OUTCOME KEY
                        ================================= */}

                        <FormRow
                            label="Outcome Key"
                            required
                        >

                            <InputLg
                                value={
                                    outcome.outcomeKey
                                }
                                onChange={
                                    set("outcomeKey")
                                }
                                placeholder="Example: ANSWERED"
                            />

                        </FormRow>


                        {/* =================================
                            OUTCOME LABEL
                        ================================= */}

                        <FormRow
                            label="Outcome Label"
                            required
                        >

                            <InputLg
                                value={
                                    outcome.outcomeLabel
                                }
                                onChange={
                                    set("outcomeLabel")
                                }
                                placeholder="Example: Answered"
                            />

                        </FormRow>


                        {/* =================================
                            ICON
                        ================================= */}

                        <FormRow
                            label="Icon"
                            required
                        >

                            <FormControl
                                fullWidth
                                size="small"
                            >

                                <Select
                                    value={
                                        outcome.iconKey
                                    }
                                    onChange={
                                        set("iconKey")
                                    }
                                    displayEmpty
                                    sx={{
                                        minHeight: "40px",
                                        borderRadius: "6px",
                                        backgroundColor:
                                            "#fff",
                                    }}
                                    renderValue={(selected) => {

                                        if (!selected) {

                                            return (
                                                <span
                                                    style={{
                                                        color:
                                                            "#9ca3af",
                                                    }}
                                                >
                                                    Select an icon
                                                </span>
                                            );

                                        }


                                        const item =
                                            OUTCOME_ICONS.find(
                                                (icon) =>
                                                    icon.key ===
                                                    selected
                                            );


                                        if (!item) {
                                            return selected;
                                        }


                                        const Icon =
                                            item.Icon;


                                        return (

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    gap: 1,
                                                }}
                                            >

                                                <Icon
                                                    sx={{
                                                        fontSize: 20,
                                                    }}
                                                />

                                                <span>
                                                    {
                                                        item.label
                                                    }
                                                </span>

                                            </Box>

                                        );

                                    }}
                                >

                                    <MenuItem
                                        value=""
                                    >
                                        Select an icon
                                    </MenuItem>


                                    {
                                        OUTCOME_ICONS.map(
                                            ({
                                                key,
                                                label,
                                                Icon,
                                            }) => (

                                                <MenuItem
                                                    key={key}
                                                    value={key}
                                                >

                                                    <Box
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 1.5,
                                                        }}
                                                    >

                                                        <Icon
                                                            sx={{
                                                                fontSize:
                                                                    21,
                                                            }}
                                                        />

                                                        <span>
                                                            {
                                                                label
                                                            }
                                                        </span>

                                                    </Box>

                                                </MenuItem>

                                            )
                                        )
                                    }

                                </Select>

                            </FormControl>


                            {/* ICON PREVIEW */}

                            {
                                SelectedIcon && (

                                    <Box
                                        sx={{
                                            mt: 1,
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap: 1,
                                            px: 1.5,
                                            py: 1,
                                            width:
                                                "fit-content",
                                            border:
                                                "1px solid #e5e7eb",
                                            borderRadius:
                                                "8px",
                                            backgroundColor:
                                                "#f8fafc",
                                        }}
                                    >

                                        <SelectedIcon
                                            sx={{
                                                fontSize: 22,
                                            }}
                                        />

                                        <span
                                            style={{
                                                fontSize:
                                                    "13px",
                                                color:
                                                    "#475569",
                                            }}
                                        >
                                            {
                                                outcome.iconKey
                                            }
                                        </span>

                                    </Box>

                                )
                            }

                        </FormRow>


                        {/* =================================
                            DISPLAY ORDER
                        ================================= */}

                        <FormRow
                            label="Display Order"
                            required
                        >

                            <InputLg
                                type="number"
                                value={
                                    outcome.displayOrder
                                }
                                onChange={
                                    set("displayOrder")
                                }
                                placeholder="Example: 1"
                            />

                        </FormRow>


                        {/* =================================
                            ACTIVE STATUS
                        ================================= */}

                        <FormRow
                            label="Active Status"
                        >

                            <Checkbox
                                value={
                                    outcome.isActive
                                }
                                onChange={
                                    set("isActive")
                                }
                            />

                        </FormRow>

                    </Box>

                </Box>


                {/* =====================================
                    BUTTONS
                ===================================== */}

                <ButtonWrapper>

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
                            handleReset
                        }
                        disabled={
                            loading
                        }
                    >
                        Reset
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

                </ButtonWrapper>

            </Panel>

        </Wrapper>

    );

};


export default memo(CallOutcomeCreation);