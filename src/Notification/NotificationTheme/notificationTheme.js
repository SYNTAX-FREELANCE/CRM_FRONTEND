
import { alpha } from "@mui/material/styles";

export const getNotificationTheme = (theme) => {
    const isDark = theme.palette.mode === "dark";

    return {
        isDark,

        primary: isDark ? "#70cf91" : "#21834b",
        secondary: isDark ? "#f6a45e" : "#d97706",

        background: isDark ? "#17231c" : "#f7faf7",
        paper: isDark ? "#202e25" : "#ffffff",

        border: isDark ? "#35443a" : "#e6eee8",

        text: isDark ? "#e1ebe4" : "#34483a",
        muted: isDark ? "#9aada0" : "#829187",

        greenBg: isDark ? "#294633" : "#e7f4ea",
        orangeBg: isDark ? "#493426" : "#fff0df",

        inputBg: isDark ? "#26342b" : "#ffffff",

        danger: isDark ? "#ff8585" : "#d32f2f",

        cardSx: {
            border: `1px solid ${isDark ? "#35443a" : "#e6eee8"}`,
            borderRadius: "12px",
            bgcolor: isDark ? "#202e25" : "#ffffff",
            boxShadow: "none",
        },

        inputSx: {
            "& .MuiOutlinedInput-root": {
                borderRadius: "9px",
                bgcolor: isDark ? "#26342b" : "#ffffff",

                "& fieldset": {
                    borderColor: isDark ? "#35443a" : "#e6eee8",
                },

                "&:hover fieldset": {
                    borderColor: isDark ? "#70cf91" : "#21834b",
                },

                "&.Mui-focused fieldset": {
                    borderColor: isDark ? "#70cf91" : "#21834b",
                },
            },

            "& .MuiInputLabel-root.Mui-focused": {
                color: isDark ? "#70cf91" : "#21834b",
            },

            "& .MuiInputBase-input": {
                color: isDark ? "#e1ebe4" : "#34483a",
            },
        },
    };
};
