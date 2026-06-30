import React, { memo, useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { format, parseISO, subDays, subMonths } from "date-fns";

// const filters = [
//   { value: "7days", label: "Last 7 Days" },
//   { value: "1month", label: "1 Month" },
//   { value: "3months", label: "3 Months" },
//   { value: "custom", label: "Custom" },
// ];

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

const DashboardDateFilter = ({
  value,
  onChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempFrom, setTempFrom] = useState(fromDate || "");
  const [tempTo, setTempTo] = useState(toDate || "");
  const wrapperRef = useRef(null);

  const today = new Date();

  const filters = [
    {
      value: "7days",
      label: "Last 7 Days",
      from: format(subDays(today, 6), "yyyy-MM-dd"),
      to: format(today, "yyyy-MM-dd"),
    },
    {
      value: "1month",
      label: "1 Month",
      from: format(subMonths(today, 1), "yyyy-MM-dd"),
      to: format(today, "yyyy-MM-dd"),
    },
    {
      value: "3months",
      label: "3 Months",
      from: format(subMonths(today, 3), "yyyy-MM-dd"),
      to: format(today, "yyyy-MM-dd"),
    },
    {
      value: "custom",
      label: "Custom",
    },
  ];

  useOnClickOutside(wrapperRef, () => {
    setShowPicker(false);
    setTempFrom(fromDate || "");
    setTempTo(toDate || "");
  });

  const formatDate = useCallback((date) => {
    if (!date) return "";
    return format(parseISO(date), "dd MMM yyyy");
  }, []);

  const customLabel = useMemo(() => {
    if (fromDate && toDate) {
      return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
    }
    return "Custom";
  }, [fromDate, toDate, formatDate]);


  const handleSelectChange = (e) => {
    const selected = filters.find((f) => f.value === e.target.value);

    if (!selected) return;
    if (selected.value === "custom") {
      if (!showPicker) {
        setTempFrom(fromDate || "");
        setTempTo(toDate || "");
        setShowPicker(true);
      }
      return;
    }

    setShowPicker(false);

    onChange(selected.value);

    onFromDateChange(selected.from);
    onToDateChange(selected.to);
  };

  const handleApply = () => {
    onFromDateChange(tempFrom);
    onToDateChange(tempTo);
    onChange("custom");
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempFrom(fromDate || "");
    setTempTo(toDate || "");
    setShowPicker(false);
  };

  return (
    <Box ref={wrapperRef} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {!showPicker ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", md: "flex-end" },
            width: "100%",
            cursor: 'pointer'
          }}
        >
          <select
            value={value}
            onChange={handleSelectChange}
            style={{
              minWidth: 180,
              height: 38,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,.18)",
              background: "#fff",
              color: "#2563eb",
              fontWeight: 700,
              fontSize: 13,
              padding: "0 12px",
              outline: "none",
              cursor: "pointer",
            }}
            sx={{
              "@media (max-width:600px)": {
                minWidth: 150,
                height: 34,
                fontSize: 12,
                padding: "0 10px",
              },
            }}
          >
            {filters.map((item) => (
              <option key={item.value} value={item.value}>
                {item.value === "custom" ? customLabel : item.label}
              </option>
            ))}
          </select>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: { xs: "flex-start", md: "flex-end" },
            width: "100%",
          }}
        >
          <Box>
            <Typography sx={{ color: "#fff", fontSize: { xs: 10, md: 11 }, mb: 0.5, fontWeight: 600 }}>
              From
            </Typography>
            <input
              type="date"
              value={tempFrom}
              onChange={(e) => {
                setTempFrom(e.target.value);
                if (tempTo && e.target.value > tempTo) {
                  setTempTo(e.target.value);
                }
              }}
              style={{
                width: 150,
                height: 36,
                borderRadius: 8,
                border: "none",
                outline: "none",
                padding: "0 10px",
                fontSize: 13,
              }}
            />
          </Box>

          <Box>
            <Typography sx={{ color: "#fff", fontSize: { xs: 10, md: 11 }, mb: 0.5, fontWeight: 600 }}>
              To
            </Typography>
            <input
              type="date"
              min={tempFrom || undefined}
              value={tempTo}
              onChange={(e) => setTempTo(e.target.value)}
              style={{
                width: 150,
                height: 36,
                borderRadius: 8,
                border: "none",
                outline: "none",
                padding: "0 10px",
                fontSize: 13,
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleApply}
              disabled={!tempFrom || !tempTo}
              sx={{
                bgcolor: "#fff",
                color: "#2563eb",
                textTransform: "none",
                fontWeight: 700,
                height: { xs: 32, md: 36 },
                fontSize: { xs: 12, md: 13 },
                px: { xs: 1.5, md: 2 },
                borderRadius: 2,
                "&:hover": { bgcolor: "#f3f4f6" },
              }}
            >
              Apply
            </Button>

            <Button
              variant="text"
              size="small"
              onClick={handleCancel}
              sx={{
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                height: { xs: 32, md: 36 },
                fontSize: { xs: 12, md: 13 },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default memo(DashboardDateFilter);