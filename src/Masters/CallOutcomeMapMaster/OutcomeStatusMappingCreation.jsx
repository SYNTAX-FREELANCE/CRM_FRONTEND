import React, {
    memo,
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Box,
    FormControl,
    MenuItem,
    Select,
} from "@mui/material";

import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LinkIcon from "@mui/icons-material/Link";
import CallIcon from "@mui/icons-material/Call";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
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

import {
    useCallOutcomeMaster,
    useLeadMaster,
    useOutcomeStatusMappingMaster,
    useStatusMaster,
} from "../../CommonCode/useQuery";

import { getOutcomeIcons } from "../../CommonCode/outcomeIcons";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";


const OutcomeStatusMappingCreation = () => {

    // STATE

    const [mapping, setMapping] = useState({
        outcomeId: "",
        statusId: "",
        isActive: "Active",
    });
    const [loading, setLoading] = useState(false);


    // NAVIGATION

    const navigate = useNavigate();
    const location = useLocation();


    const {
        id,
        mode,
    } = location.state || {};

    // MASTER DATA
    const {
        data: callOutcomeMaster = [],
        refetch: FetchCallOutcomeMaster,
    } = useCallOutcomeMaster();

    const {
        data: FinalMapData = [],
        refetch: FetchStatusMaster,
    } = useLeadMaster();


    const {
        refetch: FetchCallMapMaster
    } = useOutcomeStatusMappingMaster();

    const statusMaster = (FinalMapData || [])?.filter(item => item.requires_followup === 1);
    // ICONS
    const OUTCOME_ICONS = getOutcomeIcons();
    // SET FIELD
    const set = (field) => (e) => {
        setMapping((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));

    };
    // RESET
    const handleReset = useCallback(() => {
        setMapping({
            outcomeId: "",
            isActive: "Active",
        });

        // Clear edit/location state
        navigate(location.pathname, {
            replace: true,
            state: null,
        });
    }, []);


    // GET ICON

    const getOutcomeIcon = useCallback((iconKey) => {
        const item = OUTCOME_ICONS.find(
            (icon) => icon.key === iconKey
        );
        return item?.Icon || CallIcon;
    }, [OUTCOME_ICONS]);


    // VALIDATION

    const validateMapping = () => {

        if (
            !mapping.outcomeId
        ) {

            warningNotify(
                "Please select a Call Outcome"
            );

            return false;

        }


        if (
            !mapping.statusId
        ) {

            warningNotify(
                "Please select a Lead Status"
            );

            return false;

        }


        return true;

    };


    // GET MAPPING BY ID

    const getMappingById = async (mappingId) => {

        try {

            const response =
                await axioslogin.get(
                    `/outcomestatusmapping/getbyid/${mappingId}`
                );


            const {
                success,
                data,
                message,
            } = response.data;
            if (success !== 1) {

                errorNotify(
                    message ||
                    "Mapping not found"
                );
                return;
            }

            setMapping({
                outcomeId: data.outcome_id ?? "",
                statusId: data.status_id ?? "",
                isActive: data.is_active === 1
                    ? "Active"
                    : "Inactive",

            });
        } catch (error) {
            console.error("getMappingById error:", error);
            errorNotify(error?.response?.data?.message || "Failed to load outcome status mapping");

        }

    };


    // LOAD EDIT DATA

    useEffect(() => {
        if (mode === "edit" && id) {
            getMappingById(id);
        }
    }, [id, mode]);


    // SAVE

    const handleSave = async () => {
        if (!validateMapping()) {
            return;
        }
        setLoading(true);
        try {
            const mappingData = {
                outcome_id:
                    Number(mapping.outcomeId),
                status_id:
                    Number(mapping.statusId),
                is_active:
                    mapping.isActive === "Active"
                        ? 1
                        : 0,
            };

            let response;

            if (
                mode === "edit" &&
                id
            ) {

                response =
                    await axioslogin.patch(
                        `/outcomestatusmapping/update/${id}`,
                        mappingData
                    );

            }
            else {

                response =
                    await axioslogin.post(
                        "/outcomestatusmapping/create",
                        mappingData
                    );

            }
            const {
                success,
                message,
            } = response.data;

            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Outcome status mapping updated successfully"
                        : "Outcome status mapping created successfully"
                );

                FetchCallMapMaster()
                handleReset();
            } else {

                warningNotify(
                    message ||
                    "Something went wrong"
                );

            }

        } catch (error) {

            console.error(
                "Outcome status mapping save error:",
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


    // VIEW

    const handleView = () => {

        navigate(
            "/home/setting/commonview",
            {
                state: {
                    title: "Outcome Status Mapping Master",
                    type: "outcomestatusmapping",
                    idField: "mapping_id",
                    editRoute: "outcomemapmaster",
                    columns: [

                        {
                            field:
                                "outcome_label",

                            headerName:
                                "Call Outcome",
                        },

                        {
                            field:
                                "outcome_key",

                            headerName:
                                "Outcome Key",
                        },

                        {
                            field:
                                "status_name",

                            headerName:
                                "Lead Status",
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


    // CLOSE

    const handleClose = useCallback(() => {
        navigate(
            "/home/settings"
        );
    }, [navigate]);






    return (

        <Wrapper>

            <Panel
                title={
                    mode === "edit"
                        ? "Edit Outcome Status Mapping"
                        : "Outcome Status Mapping Creation"
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

                        {/* 
                            CALL OUTCOME
                         */}

                        <FormRow
                            label="Call Outcome"
                            required
                        >

                            <FormControl fullWidth size="small">
                                <Select
                                    value={
                                        mapping.outcomeId === undefined ||
                                            mapping.outcomeId === null
                                            ? ""
                                            : Number(mapping.outcomeId)
                                    }
                                    onChange={(e) => {
                                        setMapping((prev) => ({
                                            ...prev,
                                            outcomeId: e.target.value,
                                        }));
                                    }}
                                    displayEmpty
                                    sx={{
                                        minHeight: "40px",
                                        borderRadius: "6px",
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <MenuItem value="0">
                                        Select Outcome
                                    </MenuItem>

                                    {(callOutcomeMaster || [])?.map((outcome) => (
                                        <MenuItem
                                            key={outcome?.outcome_id}
                                            value={Number(outcome?.outcome_id)}
                                        >
                                            {outcome?.outcome_label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </FormRow>

                        {/* 
                            LEAD STATUS
                         */}

                        <FormRow
                            label="Lead Status"
                            required
                        >

                            <FormControl fullWidth size="small">
                                <Select
                                    value={
                                        mapping.statusId === undefined ||
                                            mapping.statusId === null
                                            ? ""
                                            : Number(mapping.statusId)
                                    }
                                    onChange={(e) => {
                                        setMapping((prev) => ({
                                            ...prev,
                                            statusId: e.target.value,
                                        }));
                                    }}
                                    displayEmpty
                                    sx={{
                                        minHeight: "40px",
                                        borderRadius: "6px",
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <MenuItem value="0">
                                        Select Status
                                    </MenuItem>

                                    {(statusMaster || [])?.map((status) => (
                                        <MenuItem
                                            key={status?.status_id}
                                            value={Number(status?.status_id)}
                                        >
                                            {status?.status_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </FormRow>


                        {/* 
                            ACTIVE STATUS
                         */}

                        <FormRow
                            label="Active Status"
                        >

                            <Checkbox
                                value={
                                    mapping.isActive
                                }

                                onChange={
                                    set("isActive")
                                }
                            />

                        </FormRow>

                    </Box>

                </Box>

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


export default memo(
    OutcomeStatusMappingCreation
);