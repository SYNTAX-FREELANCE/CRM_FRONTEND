// import React, { useRef, useState } from "react";
// import { Box, Typography } from "@mui/joy";
// import DownloadIcon from "@mui/icons-material/Download";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import * as XLSX from "xlsx";

// import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
// import Panel from "../../Settings/CommonMasterComponent/Panel";


// import {
//     warningNofity,
//     successNotify,
//     errorNotify,
//     infoNotify,
// } from "../../constant/Constant";
// import { axioslogin } from "../../Connection/axios";

// const LegacySaleMaster = () => {

//     const fileInputRef = useRef(null);

//     const [file, setFile] = useState(null);
//     const [previewData, setPreviewData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [uploadResult, setUploadResult] = useState(null);

//     // --------------------------------------------------
//     // TABLE STYLES
//     // --------------------------------------------------

//     const resultHeaderStyle = {
//         position: "sticky",
//         top: 0,
//         zIndex: 2,
//         background: "#f1f5f9",
//         padding: "10px",
//         textAlign: "left",
//         borderBottom: "1px solid #e2e8f0",
//         whiteSpace: "nowrap",
//         color: "#334155",
//         fontWeight: 700,
//     };

//     const resultCellStyle = {
//         padding: "9px 10px",
//         borderBottom: "1px solid #f1f5f9",
//         color: "#475569",
//         whiteSpace: "nowrap",
//     };

//     const failedHeaderStyle = {
//         position: "sticky",
//         top: 0,
//         zIndex: 2,
//         background: "#fee2e2",
//         padding: "10px",
//         textAlign: "left",
//         borderBottom: "1px solid #fecaca",
//         whiteSpace: "nowrap",
//         color: "#991b1b",
//         fontWeight: 700,
//     };

//     const failedCellStyle = {
//         padding: "9px 10px",
//         borderBottom: "1px solid #fee2ea",
//         color: "#475569",
//         whiteSpace: "nowrap",
//     };

//     // --------------------------------------------------
//     // DOWNLOAD EXCEL TEMPLATE
//     // --------------------------------------------------

//     const downloadTemplate = () => {

//         const templateData = [
//             {
//                 customer_name: "",
//                 mobile_number_1: "",
//                 registration_number: "",
//                 known_policy_expiry_date: "",
//                 model: "",
//                 sale_date: "",
//                 insurance_company: "",
//                 policy_number: "",
//                 renewal_cycle: "",
//                 start_date: "",
//                 expiry_date: "",
//                 source: "",
//                 premium_amount: "",
//                 insured_declared_value: "",
//                 paid_amount: "",
//                 reminder_days: "",
//                 renewal_year: "",
//                 remarks: "",
//                 assigned_to: "",
//             },
//         ];

//         const worksheet = XLSX.utils.json_to_sheet(templateData);

//         const workbook = XLSX.utils.book_new();

//         XLSX.utils.book_append_sheet(
//             workbook,
//             worksheet,
//             "Legacy Sales"
//         );

//         XLSX.writeFile(
//             workbook,
//             "Legacy_Sale_Import_Template.xlsx"
//         );
//     };

//     // --------------------------------------------------
//     // FILE CHANGE
//     // --------------------------------------------------

//     const handleFileChange = (event) => {

//         const selectedFile = event.target.files?.[0];

//         if (!selectedFile) {
//             return;
//         }

//         setFile(selectedFile);
//         setUploadResult(null);

//         const reader = new FileReader();

//         reader.onload = (e) => {

//             try {

//                 const data = new Uint8Array(e.target.result);

//                 const workbook = XLSX.read(data, {
//                     type: "array",
//                     cellDates: true,
//                 });

//                 const firstSheetName =
//                     workbook.SheetNames[0];

//                 const worksheet =
//                     workbook.Sheets[firstSheetName];

//                 const jsonData =
//                     XLSX.utils.sheet_to_json(
//                         worksheet,
//                         {
//                             defval: "",
//                             raw: false,
//                         }
//                     );

//                 // Show ALL rows
//                 setPreviewData(jsonData);

//             } catch (error) {

//                 console.error(
//                     "Excel preview error:",
//                     error
//                 );

//                 errorNotify(
//                     "Unable to read Excel file."
//                 );

//                 setPreviewData([]);
//             }
//         };

//         reader.readAsArrayBuffer(selectedFile);
//     };

//     // --------------------------------------------------
//     // UPLOAD EXCEL
//     // --------------------------------------------------

//     const handleUpload = async () => {

//         if (!file) {
//             infoNotify(
//                 "Please select an Excel file."
//             );
//             return;
//         }

//         setLoading(true);
//         setUploadResult(null);

//         try {

//             const formData = new FormData();

//             formData.append(
//                 "file",
//                 file
//             );

//             const response = await axioslogin.post(
//                 "/customer/create-previous-customer-excel",
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );

//             const result = response.data;

//             // Keep complete backend result
//             setUploadResult(result);

//             if (result?.success === 1) {

//                 const total =
//                     result?.data?.total_rows || 0;

//                 const success =
//                     result?.data?.success_count || 0;

//                 const failed =
//                     result?.data?.failed_count || 0;

//                 if (failed > 0) {

//                     warningNofity(
//                         `${success} rows uploaded successfully, ${failed} rows failed.`
//                     );
//                     setPreviewData([])
//                 } else {

//                     successNotify(
//                         `${success} rows uploaded successfully.`
//                     );
//                     setPreviewData([])
//                 }

//             } else {

//                 errorNotify(
//                     result?.message ||
//                     "Error in uploading Excel."
//                 );
//             }

//         } catch (error) {

//             console.error(
//                 "Excel upload error:",
//                 error
//             );

//             const result =
//                 error?.response?.data;

//             if (result) {
//                 setUploadResult(result);
//             }

//             errorNotify(
//                 result?.message ||
//                 "Failed to upload Excel file."
//             );

//         } finally {

//             setLoading(false);
//         }
//     };

//     // --------------------------------------------------
//     // RESET
//     // --------------------------------------------------

//     const handleReset = () => {

//         setFile(null);
//         setPreviewData([]);
//         setUploadResult(null);

//         if (fileInputRef.current) {
//             fileInputRef.current.value = "";
//         }
//     };

//     // --------------------------------------------------
//     // PREVIEW HEADERS
//     // --------------------------------------------------

//     const previewHeaders =
//         previewData.length > 0
//             ? Object.keys(previewData[0])
//             : [];

//     // --------------------------------------------------
//     // COMPONENT
//     // --------------------------------------------------

//     return (
//         <Wrapper>

//             <Panel
//                 title={" Legacy Sale Master"}
//             >
//                 {/* --------------------------------------------------
//                     HEADER
//                 -------------------------------------------------- */}
//                 <Box
//                     sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         gap: 2,
//                         flexWrap: "wrap",
//                         mb: 2,
//                     }}
//                 >

//                     <Box>
//                         <Typography
//                             level="body-sm"
//                             sx={{
//                                 color: "#64748b",
//                                 mt: 0.5,
//                             }}
//                         >
//                             Import previous customer sales
//                             through Excel.
//                         </Typography>

//                     </Box>

//                     <Box
//                         component="button"
//                         onClick={downloadTemplate}
//                         sx={{
//                             border: "none",
//                             cursor: "pointer",
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 1,
//                             px: 2,
//                             py: 1,
//                             borderRadius: "7px",
//                             background: "#f9720a",
//                             color: "#fff",
//                             fontWeight: 600,
//                             "&:hover": {
//                                 background: "#f9720a",
//                             },
//                         }}
//                     >

//                         <DownloadIcon
//                             sx={{
//                                 fontSize: 18,
//                             }}
//                         />

//                         Download Template

//                     </Box>

//                 </Box>


//                 {/* --------------------------------------------------
//                     UPLOAD AREA
//                 -------------------------------------------------- */}

//                 <Box
//                     sx={{
//                         border: "1px dashed #cbd5e1",
//                         borderRadius: "10px",
//                         p: 2,
//                         background: "#f8fafc",
//                     }}
//                 >

//                     <Box
//                         sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 2,
//                             flexWrap: "wrap",
//                         }}
//                     >

//                         <input
//                             ref={fileInputRef}
//                             type="file"
//                             accept=".xlsx,.xls"
//                             onChange={handleFileChange}
//                             style={{
//                                 display: "none",
//                             }}
//                         />

//                         <Box
//                             component="button"
//                             onClick={() =>
//                                 fileInputRef.current?.click()
//                             }
//                             sx={{
//                                 border: "1px solid #cbd5e1",
//                                 cursor: "pointer",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 1,
//                                 px: 2,
//                                 py: 1,
//                                 borderRadius: "7px",
//                                 background: "#fff",
//                                 color: "#334155",
//                                 fontWeight: 600,
//                                 "&:hover": {
//                                     background: "#f1f5f9",
//                                 },
//                             }}
//                         >

//                             <CloudUploadIcon
//                                 sx={{
//                                     fontSize: 19,
//                                 }}
//                             />

//                             Choose Excel

//                         </Box>


//                         {file && (
//                             <Typography
//                                 level="body-sm"
//                                 sx={{
//                                     color: "#475569",
//                                     fontWeight: 600,
//                                 }}
//                             >
//                                 {file.name}
//                             </Typography>
//                         )}

//                     </Box>

//                 </Box>


//                 {/* --------------------------------------------------
//                     EXCEL PREVIEW
//                 -------------------------------------------------- */}

//                 {previewData.length > 0 && (

//                     <Box sx={{ mt: 3 }}>

//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                                 gap: 2,
//                                 flexWrap: "wrap",
//                                 mb: 1,
//                             }}
//                         >

//                             <Typography
//                                 level="title-sm"
//                                 sx={{
//                                     fontWeight: 700,
//                                 }}
//                             >
//                                 Excel Preview
//                             </Typography>

//                             <Typography
//                                 level="body-xs"
//                                 sx={{
//                                     color: "#64748b",
//                                 }}
//                             >
//                                 Showing all{" "}
//                                 <strong>
//                                     {previewData.length}
//                                 </strong>{" "}
//                                 rows
//                             </Typography>

//                         </Box>


//                         <Box
//                             sx={{
//                                 border: "1px solid #e2e8f0",
//                                 borderRadius: "8px",
//                                 overflow: "auto",
//                                 maxHeight: "500px",

//                                 "&::-webkit-scrollbar": {
//                                     width: "6px",
//                                     height: "6px",
//                                 },

//                                 "&::-webkit-scrollbar-thumb": {
//                                     background: "#cbd5e1",
//                                     borderRadius: "10px",
//                                 },
//                             }}
//                         >

//                             <table
//                                 style={{
//                                     width: "100%",
//                                     borderCollapse: "collapse",
//                                     minWidth: "1800px",
//                                     fontSize: "12px",
//                                 }}
//                             >

//                                 <thead>

//                                     <tr>

//                                         <th
//                                             style={
//                                                 resultHeaderStyle
//                                             }
//                                         >
//                                             #
//                                         </th>

//                                         {previewHeaders.map(
//                                             (header) => (
//                                                 <th
//                                                     key={header}
//                                                     style={
//                                                         resultHeaderStyle
//                                                     }
//                                                 >
//                                                     {header}
//                                                 </th>
//                                             )
//                                         )}

//                                     </tr>

//                                 </thead>

//                                 <tbody>

//                                     {previewData.map(
//                                         (row, rowIndex) => (

//                                             <tr
//                                                 key={rowIndex}
//                                             >

//                                                 <td
//                                                     style={
//                                                         resultCellStyle
//                                                     }
//                                                 >
//                                                     {rowIndex + 1}
//                                                 </td>

//                                                 {previewHeaders.map(
//                                                     (
//                                                         header
//                                                     ) => (
//                                                         <td
//                                                             key={
//                                                                 header
//                                                             }
//                                                             style={
//                                                                 resultCellStyle
//                                                             }
//                                                         >
//                                                             {row[
//                                                                 header
//                                                             ] !==
//                                                                 undefined &&
//                                                                 row[
//                                                                 header
//                                                                 ] !==
//                                                                 ""
//                                                                 ? String(
//                                                                     row[
//                                                                     header
//                                                                     ]
//                                                                 )
//                                                                 : "-"}
//                                                         </td>
//                                                     )
//                                                 )}

//                                             </tr>

//                                         )
//                                     )}

//                                 </tbody>

//                             </table>

//                         </Box>

//                     </Box>
//                 )}


//                 {/* --------------------------------------------------
//                     UPLOAD RESULT
//                 -------------------------------------------------- */}

//                 {uploadResult?.data && (

//                     <Box sx={{ mt: 3 }}>

//                         {/* RESULT HEADER */}

//                         <Box
//                             sx={{
//                                 p: 1.5,
//                                 borderRadius:
//                                     "10px 10px 0 0",
//                                 border:
//                                     "1px solid #e2e8f0",
//                                 borderBottom: "none",
//                                 background:
//                                     "#f8fafc",
//                                 display: "flex",
//                                 alignItems:
//                                     "center",
//                                 justifyContent:
//                                     "space-between",
//                                 gap: 2,
//                                 flexWrap: "wrap",
//                             }}
//                         >

//                             <Typography
//                                 level="title-sm"
//                                 sx={{
//                                     fontWeight: 700,
//                                 }}
//                             >
//                                 Upload Result
//                             </Typography>


//                             <Box
//                                 sx={{
//                                     display: "flex",
//                                     gap: 1,
//                                     flexWrap: "wrap",
//                                 }}
//                             >

//                                 {/* TOTAL */}

//                                 <Box
//                                     sx={{
//                                         px: 1,
//                                         py: 0.5,
//                                         borderRadius:
//                                             "6px",
//                                         background:
//                                             "#dbeafe",
//                                         color:
//                                             "#1d4ed8",
//                                         fontSize:
//                                             "12px",
//                                         fontWeight: 700,
//                                     }}
//                                 >
//                                     Total:{" "}
//                                     {
//                                         uploadResult
//                                             .data
//                                             .total_rows
//                                     }
//                                 </Box>


//                                 {/* SUCCESS */}

//                                 <Box
//                                     sx={{
//                                         px: 1,
//                                         py: 0.5,
//                                         borderRadius:
//                                             "6px",
//                                         background:
//                                             "#dcfce7",
//                                         color:
//                                             "#15803d",
//                                         fontSize:
//                                             "12px",
//                                         fontWeight: 700,
//                                     }}
//                                 >
//                                     Success:{" "}
//                                     {
//                                         uploadResult
//                                             .data
//                                             .success_count
//                                     }
//                                 </Box>


//                                 {/* FAILED */}

//                                 <Box
//                                     sx={{
//                                         px: 1,
//                                         py: 0.5,
//                                         borderRadius:
//                                             "6px",
//                                         background:
//                                             uploadResult
//                                                 .data
//                                                 .failed_count >
//                                                 0
//                                                 ? "#fee2e2"
//                                                 : "#f1f5f9",
//                                         color:
//                                             uploadResult
//                                                 .data
//                                                 .failed_count >
//                                                 0
//                                                 ? "#b91c1c"
//                                                 : "#475569",
//                                         fontSize:
//                                             "12px",
//                                         fontWeight: 700,
//                                     }}
//                                 >
//                                     Failed:{" "}
//                                     {
//                                         uploadResult
//                                             .data
//                                             .failed_count
//                                     }
//                                 </Box>

//                             </Box>

//                         </Box>


//                         {/* --------------------------------------------------
//                             SUCCESS ROWS
//                         -------------------------------------------------- */}

//                         {uploadResult.data
//                             .success_rows
//                             ?.length > 0 && (

//                                 <Box
//                                     sx={{
//                                         border:
//                                             "1px solid #e2e8f0",
//                                         overflowX:
//                                             "auto",
//                                         maxHeight:
//                                             "420px",
//                                         overflowY:
//                                             "auto",

//                                         "&::-webkit-scrollbar":
//                                         {
//                                             width:
//                                                 "6px",
//                                             height:
//                                                 "6px",
//                                         },

//                                         "&::-webkit-scrollbar-thumb":
//                                         {
//                                             background:
//                                                 "#cbd5e1",
//                                             borderRadius:
//                                                 "10px",
//                                         },
//                                     }}
//                                 >

//                                     <table
//                                         style={{
//                                             width:
//                                                 "100%",
//                                             borderCollapse:
//                                                 "collapse",
//                                             minWidth:
//                                                 "1100px",
//                                             fontSize:
//                                                 "12px",
//                                         }}
//                                     >

//                                         <thead>

//                                             <tr>

//                                                 <th
//                                                     style={
//                                                         resultHeaderStyle
//                                                     }
//                                                 >
//                                                     #
//                                                 </th>

//                                                 <th
//                                                     style={
//                                                         resultHeaderStyle
//                                                     }
//                                                 >
//                                                     Excel Row
//                                                 </th>

//                                                 <th
//                                                     style={
//                                                         resultHeaderStyle
//                                                     }
//                                                 >
//                                                     Customer
//                                                 </th>

//                                                 <th
//                                                     style={
//                                                         resultHeaderStyle
//                                                     }
//                                                 >
//                                                     Registration
//                                                 </th>

//                                                 <th
//                                                     style={
//                                                         resultHeaderStyle
//                                                     }
//                                                 >
//                                                     Assigned To
//                                                 </th>

//                                                 <th
//                                                     style={
//                                                         resultHeaderStyle
//                                                     }
//                                                 >
//                                                     Customer ID
//                                                 </th>

//                                                 <th
//                                                     style={
//                                                         resultHeaderStyle
//                                                     }
//                                                 >
//                                                     Vehicle ID
//                                                 </th>

//                                                 <th
//                                                     style={
//                                                         resultHeaderStyle
//                                                     }
//                                                 >
//                                                     Lead ID
//                                                 </th>

//                                                 <th
//                                                     style={
//                                                         resultHeaderStyle
//                                                     }
//                                                 >
//                                                     Policy ID
//                                                 </th>

//                                                 <th
//                                                     style={
//                                                         resultHeaderStyle
//                                                     }
//                                                 >
//                                                     Status
//                                                 </th>

//                                             </tr>

//                                         </thead>


//                                         <tbody>

//                                             {uploadResult.data
//                                                 .success_rows
//                                                 .map(
//                                                     (
//                                                         row,
//                                                         index
//                                                     ) => (

//                                                         <tr
//                                                             key={
//                                                                 index
//                                                             }
//                                                         >

//                                                             <td
//                                                                 style={
//                                                                     resultCellStyle
//                                                                 }
//                                                             >
//                                                                 {
//                                                                     index +
//                                                                     1
//                                                                 }
//                                                             </td>

//                                                             <td
//                                                                 style={
//                                                                     resultCellStyle
//                                                                 }
//                                                             >
//                                                                 {
//                                                                     row.row
//                                                                 }
//                                                             </td>

//                                                             <td
//                                                                 style={
//                                                                     resultCellStyle
//                                                                 }
//                                                             >
//                                                                 {
//                                                                     row.customer_name ||
//                                                                     "-"
//                                                                 }
//                                                             </td>

//                                                             <td
//                                                                 style={
//                                                                     resultCellStyle
//                                                                 }
//                                                             >
//                                                                 {
//                                                                     row.registration_number ||
//                                                                     "-"
//                                                                 }
//                                                             </td>

//                                                             <td
//                                                                 style={
//                                                                     resultCellStyle
//                                                                 }
//                                                             >
//                                                                 {
//                                                                     row.assigned_to ??
//                                                                     "-"
//                                                                 }
//                                                             </td>

//                                                             <td
//                                                                 style={
//                                                                     resultCellStyle
//                                                                 }
//                                                             >
//                                                                 {
//                                                                     row.customer_id ??
//                                                                     "-"
//                                                                 }
//                                                             </td>

//                                                             <td
//                                                                 style={
//                                                                     resultCellStyle
//                                                                 }
//                                                             >
//                                                                 {
//                                                                     row.vehicle_id ??
//                                                                     "-"
//                                                                 }
//                                                             </td>

//                                                             <td
//                                                                 style={
//                                                                     resultCellStyle
//                                                                 }
//                                                             >
//                                                                 {
//                                                                     row.lead_id ??
//                                                                     "-"
//                                                                 }
//                                                             </td>

//                                                             <td
//                                                                 style={
//                                                                     resultCellStyle
//                                                                 }
//                                                             >
//                                                                 {
//                                                                     row.policy_id ??
//                                                                     "-"
//                                                                 }
//                                                             </td>

//                                                             <td
//                                                                 style={{
//                                                                     ...resultCellStyle,
//                                                                     color:
//                                                                         "#15803d",
//                                                                     fontWeight:
//                                                                         700,
//                                                                 }}
//                                                             >
//                                                                 Success
//                                                             </td>

//                                                         </tr>

//                                                     )
//                                                 )}

//                                         </tbody>

//                                     </table>

//                                 </Box>
//                             )}


//                         {/* --------------------------------------------------
//                             FAILED ROWS
//                         -------------------------------------------------- */}

//                         {uploadResult.data
//                             .failed_rows
//                             ?.length > 0 && (

//                                 <Box sx={{ mt: 2 }}>

//                                     <Box
//                                         sx={{
//                                             p: 1.5,
//                                             borderRadius:
//                                                 "10px 10px 0 0",
//                                             border:
//                                                 "1px solid #fecaca",
//                                             borderBottom:
//                                                 "none",
//                                             background:
//                                                 "#fef2f2",
//                                         }}
//                                     >

//                                         <Typography
//                                             level="title-sm"
//                                             sx={{
//                                                 fontWeight: 700,
//                                                 color:
//                                                     "#b91c1c",
//                                             }}
//                                         >
//                                             Failed Rows
//                                         </Typography>

//                                     </Box>


//                                     <Box
//                                         sx={{
//                                             border:
//                                                 "1px solid #fecaca",
//                                             overflowX:
//                                                 "auto",
//                                             maxHeight:
//                                                 "300px",
//                                             overflowY:
//                                                 "auto",

//                                             "&::-webkit-scrollbar":
//                                             {
//                                                 width:
//                                                     "6px",
//                                                 height:
//                                                     "6px",
//                                             },

//                                             "&::-webkit-scrollbar-thumb":
//                                             {
//                                                 background:
//                                                     "#fca5a5",
//                                                 borderRadius:
//                                                     "10px",
//                                             },
//                                         }}
//                                     >

//                                         <table
//                                             style={{
//                                                 width:
//                                                     "100%",
//                                                 borderCollapse:
//                                                     "collapse",
//                                                 minWidth:
//                                                     "800px",
//                                                 fontSize:
//                                                     "12px",
//                                             }}
//                                         >

//                                             <thead>

//                                                 <tr>

//                                                     <th
//                                                         style={
//                                                             failedHeaderStyle
//                                                         }
//                                                     >
//                                                         #
//                                                     </th>

//                                                     <th
//                                                         style={
//                                                             failedHeaderStyle
//                                                         }
//                                                     >
//                                                         Excel Row
//                                                     </th>

//                                                     <th
//                                                         style={
//                                                             failedHeaderStyle
//                                                         }
//                                                     >
//                                                         Customer
//                                                     </th>

//                                                     <th
//                                                         style={
//                                                             failedHeaderStyle
//                                                         }
//                                                     >
//                                                         Registration
//                                                     </th>

//                                                     <th
//                                                         style={
//                                                             failedHeaderStyle
//                                                         }
//                                                     >
//                                                         Error
//                                                     </th>

//                                                     <th
//                                                         style={
//                                                             failedHeaderStyle
//                                                         }
//                                                     >
//                                                         Status
//                                                     </th>

//                                                 </tr>

//                                             </thead>


//                                             <tbody>

//                                                 {uploadResult.data
//                                                     .failed_rows
//                                                     .map(
//                                                         (
//                                                             row,
//                                                             index
//                                                         ) => (

//                                                             <tr
//                                                                 key={
//                                                                     index
//                                                                 }
//                                                             >

//                                                                 <td
//                                                                     style={
//                                                                         failedCellStyle
//                                                                     }
//                                                                 >
//                                                                     {
//                                                                         index +
//                                                                         1
//                                                                     }
//                                                                 </td>

//                                                                 <td
//                                                                     style={
//                                                                         failedCellStyle
//                                                                     }
//                                                                 >
//                                                                     {
//                                                                         row.row
//                                                                     }
//                                                                 </td>

//                                                                 <td
//                                                                     style={
//                                                                         failedCellStyle
//                                                                     }
//                                                                 >
//                                                                     {
//                                                                         row.customer_name ||
//                                                                         "-"
//                                                                     }
//                                                                 </td>

//                                                                 <td
//                                                                     style={
//                                                                         failedCellStyle
//                                                                     }
//                                                                 >
//                                                                     {
//                                                                         row.registration_number ||
//                                                                         "-"
//                                                                     }
//                                                                 </td>

//                                                                 <td
//                                                                     style={{
//                                                                         ...failedCellStyle,
//                                                                         color:
//                                                                             "#b91c1c",
//                                                                         fontWeight:
//                                                                             600,
//                                                                     }}
//                                                                 >
//                                                                     {
//                                                                         row.reason ||
//                                                                         "Unknown error"
//                                                                     }
//                                                                 </td>

//                                                                 <td
//                                                                     style={{
//                                                                         ...failedCellStyle,
//                                                                         color:
//                                                                             "#b91c1c",
//                                                                         fontWeight:
//                                                                             700,
//                                                                     }}
//                                                                 >
//                                                                     Failed
//                                                                 </td>

//                                                             </tr>

//                                                         )
//                                                     )}

//                                             </tbody>

//                                         </table>

//                                     </Box>

//                                 </Box>
//                             )}

//                     </Box>
//                 )}


//                 {/* --------------------------------------------------
//                     ACTION BUTTONS
//                 -------------------------------------------------- */}

//                 <Box
//                     sx={{
//                         display: "flex",
//                         justifyContent: "flex-end",
//                         gap: 1,
//                         mt: 3,
//                     }}
//                 >

//                     <Box
//                         component="button"
//                         onClick={handleReset}
//                         disabled={loading}
//                         sx={{
//                             border:
//                                 "1px solid #cbd5e1",
//                             cursor: loading
//                                 ? "not-allowed"
//                                 : "pointer",
//                             px: 2,
//                             py: 1,
//                             borderRadius: "7px",
//                             background: "#fff",
//                             color: "#475569",
//                             fontWeight: 600,

//                             "&:hover": {
//                                 background:
//                                     "#f8fafc",
//                             },
//                         }}
//                     >
//                         Reset
//                     </Box>


//                     <Box
//                         component="button"
//                         onClick={handleUpload}
//                         disabled={
//                             loading ||
//                             !file
//                         }
//                         sx={{
//                             border: "none",
//                             cursor:
//                                 loading ||
//                                     !file
//                                     ? "not-allowed"
//                                     : "pointer",
//                             px: 2,
//                             py: 1,
//                             borderRadius: "7px",
//                             background:
//                                 loading ||
//                                     !file
//                                     ? "#94a3b8"
//                                     : "#16a34a",
//                             color: "#fff",
//                             fontWeight: 600,
//                         }}
//                     >

//                         {loading
//                             ? "Uploading..."
//                             : "Upload Excel"}

//                     </Box>

//                 </Box>

//             </Panel>

//         </Wrapper>
//     );
// };

// export default LegacySaleMaster;



import React, { useRef, useState } from "react";
import { Box, Typography } from "@mui/joy";
import DownloadIcon from "@mui/icons-material/Download";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";

import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import Panel from "../../Settings/CommonMasterComponent/Panel";

import {
    warningNofity,
    successNotify,
    errorNotify,
    infoNotify,
} from "../../constant/Constant";

import { axioslogin } from "../../Connection/axios";

const LegacySaleMaster = () => {

    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);

    // NEW
    const [policyType, setPolicyType] = useState("NEW");

    // --------------------------------------------------
    // TABLE STYLES
    // --------------------------------------------------

    const resultHeaderStyle = {
        position: "sticky",
        top: 0,
        zIndex: 2,
        background: "#f1f5f9",
        padding: "10px",
        textAlign: "left",
        borderBottom: "1px solid #e2e8f0",
        whiteSpace: "nowrap",
        color: "#334155",
        fontWeight: 700,
    };

    const resultCellStyle = {
        padding: "9px 10px",
        borderBottom: "1px solid #f1f5f9",
        color: "#475569",
        whiteSpace: "nowrap",
    };

    const failedHeaderStyle = {
        position: "sticky",
        top: 0,
        zIndex: 2,
        background: "#fee2e2",
        padding: "10px",
        textAlign: "left",
        borderBottom: "1px solid #fecaca",
        whiteSpace: "nowrap",
        color: "#991b1b",
        fontWeight: 700,
    };

    const failedCellStyle = {
        padding: "9px 10px",
        borderBottom: "1px solid #fee2ea",
        color: "#475569",
        whiteSpace: "nowrap",
    };

    // --------------------------------------------------
    // DOWNLOAD NEW POLICY TEMPLATE
    // EXISTING TEMPLATE - KEEP AS SAME
    // --------------------------------------------------

    const downloadNewPolicyTemplate = () => {

        const templateData = [
            {
                customer_name: "",
                mobile_number_1: "",
                registration_number: "",
                known_policy_expiry_date: "",
                model: "",
                sale_date: "",
                insurance_company: "",
                policy_number: "",
                renewal_cycle: "",
                start_date: "",
                expiry_date: "",
                source: "",
                premium_amount: "",
                insured_declared_value: "",
                paid_amount: "",
                reminder_days: "",
                renewal_year: "",
                remarks: "",
                assigned_to: "",
            },
        ];

        const worksheet = XLSX.utils.json_to_sheet(templateData);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Legacy Sales"
        );

        XLSX.writeFile(
            workbook,
            "Legacy_Sale_Import_Template.xlsx"
        );
    };

    // --------------------------------------------------
    // DOWNLOAD PREVIOUS POLICY TEMPLATE
    // ONLY POLICY DETAILS
    // --------------------------------------------------

    const downloadPreviousPolicyTemplate = () => {

        const templateData = [
            {
                registration_number: "",
                sale_date: "",
                insurance_company: "",
                policy_number: "",
                renewal_cycle: "",
                start_date: "",
                expiry_date: "",
                source: "",
                premium_amount: "",
                insured_declared_value: "",
                paid_amount: "",
                discount_amount: "",
                reminder_days: "",
                renewal_year: "",
                remarks: "",
                customer_pay_type_id: "",
                payment_method_id: "",
                cp_reference_no: "",
                pm_reference_no: "",
                assigned_to: "",
            },
        ];

        const worksheet = XLSX.utils.json_to_sheet(templateData);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Previous Policy"
        );

        XLSX.writeFile(
            workbook,
            "Previous_Policy_Import_Template.xlsx"
        );
    };

    // --------------------------------------------------
    // FILE CHANGE
    // --------------------------------------------------

    const handleFileChange = (event) => {

        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        setFile(selectedFile);
        setUploadResult(null);

        const reader = new FileReader();

        reader.onload = (e) => {

            try {

                const data = new Uint8Array(e.target.result);

                const workbook = XLSX.read(data, {
                    type: "array",
                    cellDates: true,
                });

                const firstSheetName =
                    workbook.SheetNames[0];

                const worksheet =
                    workbook.Sheets[firstSheetName];

                const jsonData =
                    XLSX.utils.sheet_to_json(
                        worksheet,
                        {
                            defval: "",
                            raw: false,
                        }
                    );

                setPreviewData(jsonData);

            } catch (error) {

                console.error(
                    "Excel preview error:",
                    error
                );

                errorNotify(
                    "Unable to read Excel file."
                );

                setPreviewData([]);
            }
        };

        reader.readAsArrayBuffer(selectedFile);
    };

    // --------------------------------------------------
    // UPLOAD EXCEL
    // --------------------------------------------------

    const handleUpload = async () => {

        if (!file) {
            infoNotify(
                "Please select an Excel file."
            );
            return;
        }

        setLoading(true);
        setUploadResult(null);

        try {

            const formData = new FormData();

            formData.append(
                "file",
                file
            );

            // =====================================================
            // NEW POLICY
            // EXISTING ENDPOINT - NO CHANGE
            // =====================================================

            const endpoint =
                policyType === "NEW"
                    ? "/customer/create-previous-customer-excel"
                    : "/customer/create-policy-existing-vehicle-excel";

            const response = await axioslogin.post(
                endpoint,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            const result = response.data;

            setUploadResult(result);

            if (result?.success === 1) {

                const total =
                    result?.data?.total_rows || 0;

                const success =
                    result?.data?.success_count || 0;

                const failed =
                    result?.data?.failed_count || 0;

                if (failed > 0) {

                    warningNofity(
                        `${success} rows uploaded successfully, ${failed} rows failed.`
                    );

                    setPreviewData([]);

                } else {

                    successNotify(
                        `${success} rows uploaded successfully.`
                    );

                    setPreviewData([]);
                }

            } else {

                errorNotify(
                    result?.message ||
                    "Error in uploading Excel."
                );
            }

        } catch (error) {

            console.error(
                "Excel upload error:",
                error
            );

            const result =
                error?.response?.data;

            if (result) {
                setUploadResult(result);
            }

            errorNotify(
                result?.message ||
                "Failed to upload Excel file."
            );

        } finally {

            setLoading(false);
        }
    };

    // --------------------------------------------------
    // RESET
    // --------------------------------------------------

    const handleReset = () => {

        setFile(null);
        setPreviewData([]);
        setUploadResult(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // --------------------------------------------------
    // CHANGE POLICY TYPE
    // --------------------------------------------------

    const handlePolicyTypeChange = (type) => {

        if (loading) {
            return;
        }

        setPolicyType(type);

        setFile(null);
        setPreviewData([]);
        setUploadResult(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // --------------------------------------------------
    // PREVIEW HEADERS
    // --------------------------------------------------

    const previewHeaders =
        previewData.length > 0
            ? Object.keys(previewData[0])
            : [];

    // --------------------------------------------------
    // COMPONENT
    // --------------------------------------------------

    return (
        <Wrapper>

            <Panel
                title={" Legacy Sale Master"}
            >

                {/* ==================================================
                    POLICY TYPE TAGS
                ================================================== */}

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        mb: 2,
                        borderBottom: "1px solid #e2e8f0",
                        pb: 1,
                    }}
                >

                    {/* NEW POLICY */}

                    <Box
                        component="button"
                        onClick={() =>
                            handlePolicyTypeChange("NEW")
                        }
                        sx={{
                            border: "none",
                            cursor: "pointer",
                            px: 2,
                            py: 0.9,
                            borderRadius: "7px",

                            background:
                                policyType === "NEW"
                                    ? "#2563eb"
                                    : "#f1f5f9",

                            color:
                                policyType === "NEW"
                                    ? "#fff"
                                    : "#475569",

                            fontWeight: 700,

                            transition:
                                "all 0.2s ease",

                            "&:hover": {
                                background:
                                    policyType === "NEW"
                                        ? "#2563eb"
                                        : "#e2e8f0",
                            },
                        }}
                    >
                        New Policy
                    </Box>


                    {/* PREVIOUS POLICY */}

                    <Box
                        component="button"
                        onClick={() =>
                            handlePolicyTypeChange("PREVIOUS")
                        }
                        sx={{
                            border: "none",
                            cursor: "pointer",
                            px: 2,
                            py: 0.9,
                            borderRadius: "7px",

                            background:
                                policyType === "PREVIOUS"
                                    ? "#f97316"
                                    : "#f1f5f9",

                            color:
                                policyType === "PREVIOUS"
                                    ? "#fff"
                                    : "#475569",

                            fontWeight: 700,

                            transition:
                                "all 0.2s ease",

                            "&:hover": {
                                background:
                                    policyType === "PREVIOUS"
                                        ? "#f97316"
                                        : "#e2e8f0",
                            },
                        }}
                    >
                        Previous Policy
                    </Box>

                </Box>


                {/* ==================================================
                    HEADER
                ================================================== */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                        mb: 2,
                    }}
                >

                    <Box>

                        <Typography
                            level="title-sm"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {policyType === "NEW"
                                ? "Import Previous Customer Sales"
                                : "Add Previous Policy"}
                        </Typography>

                        <Typography
                            level="body-sm"
                            sx={{
                                color: "#64748b",
                                mt: 0.5,
                            }}
                        >
                            {policyType === "NEW"
                                ? "Import previous customer sales through Excel."
                                : "Add a new policy to an existing customer and vehicle using the registration number."}
                        </Typography>

                    </Box>


                    {/* ==================================================
                        DOWNLOAD TEMPLATE
                    ================================================== */}

                    <Box
                        component="button"
                        onClick={
                            policyType === "NEW"
                                ? downloadNewPolicyTemplate
                                : downloadPreviousPolicyTemplate
                        }
                        sx={{
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 2,
                            py: 1,
                            borderRadius: "7px",
                            background: "#f9720a",
                            color: "#fff",
                            fontWeight: 600,

                            "&:hover": {
                                background: "#f9720a",
                            },
                        }}
                    >

                        <DownloadIcon
                            sx={{
                                fontSize: 18,
                            }}
                        />

                        Download Template

                    </Box>

                </Box>


                {/* ==================================================
                    PREVIOUS POLICY INFO
                ================================================== */}

                {policyType === "PREVIOUS" && (

                    <Box
                        sx={{
                            mb: 2,
                            p: 1.5,
                            borderRadius: "8px",
                            background: "#fff7ed",
                            border: "1px solid #fed7aa",
                        }}
                    >

                        <Typography
                            level="body-sm"
                            sx={{
                                color: "#9a3412",
                                fontWeight: 600,
                            }}
                        >
                            Registration number is used to find
                            the existing customer and vehicle.
                            Only the new policy details will be inserted.
                        </Typography>

                    </Box>

                )}


                {/* ==================================================
                    UPLOAD AREA
                ================================================== */}

                <Box
                    sx={{
                        border:
                            "1px dashed #cbd5e1",
                        borderRadius: "10px",
                        p: 2,
                        background: "#f8fafc",
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap",
                        }}
                    >

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            style={{
                                display: "none",
                            }}
                        />


                        <Box
                            component="button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            sx={{
                                border:
                                    "1px solid #cbd5e1",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                px: 2,
                                py: 1,
                                borderRadius: "7px",
                                background: "#fff",
                                color: "#334155",
                                fontWeight: 600,

                                "&:hover": {
                                    background:
                                        "#f1f5f9",
                                },
                            }}
                        >

                            <CloudUploadIcon
                                sx={{
                                    fontSize: 19,
                                }}
                            />

                            Choose Excel

                        </Box>


                        {file && (

                            <Typography
                                level="body-sm"
                                sx={{
                                    color: "#475569",
                                    fontWeight: 600,
                                }}
                            >
                                {file.name}
                            </Typography>

                        )}

                    </Box>

                </Box>


                {/* ==================================================
                    EXCEL PREVIEW
                ================================================== */}

                {previewData.length > 0 && (

                    <Box sx={{ mt: 3 }}>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "space-between",
                                gap: 2,
                                flexWrap: "wrap",
                                mb: 1,
                            }}
                        >

                            <Typography
                                level="title-sm"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                Excel Preview
                            </Typography>

                            <Typography
                                level="body-xs"
                                sx={{
                                    color: "#64748b",
                                }}
                            >
                                Showing all{" "}
                                <strong>
                                    {previewData.length}
                                </strong>{" "}
                                rows
                            </Typography>

                        </Box>


                        <Box
                            sx={{
                                border:
                                    "1px solid #e2e8f0",
                                borderRadius: "8px",
                                overflow: "auto",
                                maxHeight: "500px",

                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                    height: "6px",
                                },

                                "&::-webkit-scrollbar-thumb": {
                                    background:
                                        "#cbd5e1",
                                    borderRadius:
                                        "10px",
                                },
                            }}
                        >

                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse:
                                        "collapse",
                                    minWidth:
                                        policyType === "NEW"
                                            ? "1800px"
                                            : "1500px",
                                    fontSize: "12px",
                                }}
                            >

                                <thead>

                                    <tr>

                                        <th
                                            style={
                                                resultHeaderStyle
                                            }
                                        >
                                            #
                                        </th>

                                        {previewHeaders.map(
                                            (header) => (

                                                <th
                                                    key={header}
                                                    style={
                                                        resultHeaderStyle
                                                    }
                                                >
                                                    {header}
                                                </th>

                                            )
                                        )}

                                    </tr>

                                </thead>


                                <tbody>

                                    {previewData.map(
                                        (
                                            row,
                                            rowIndex
                                        ) => (

                                            <tr
                                                key={rowIndex}
                                            >

                                                <td
                                                    style={
                                                        resultCellStyle
                                                    }
                                                >
                                                    {rowIndex + 1}
                                                </td>

                                                {previewHeaders.map(
                                                    (
                                                        header
                                                    ) => (

                                                        <td
                                                            key={
                                                                header
                                                            }
                                                            style={
                                                                resultCellStyle
                                                            }
                                                        >
                                                            {row[
                                                                header
                                                            ] !==
                                                                undefined &&
                                                                row[
                                                                    header
                                                                ] !==
                                                                ""
                                                                ? String(
                                                                    row[
                                                                        header
                                                                    ]
                                                                )
                                                                : "-"}
                                                        </td>

                                                    )
                                                )}

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </Box>

                    </Box>

                )}


                {/* ==================================================
                    UPLOAD RESULT
                ================================================== */}

                {uploadResult?.data && (

                    <Box sx={{ mt: 3 }}>

                        {/* RESULT HEADER */}

                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius:
                                    "10px 10px 0 0",
                                border:
                                    "1px solid #e2e8f0",
                                borderBottom: "none",
                                background:
                                    "#f8fafc",
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                gap: 2,
                                flexWrap: "wrap",
                            }}
                        >

                            <Typography
                                level="title-sm"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                Upload Result
                            </Typography>


                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                }}
                            >

                                {/* TOTAL */}

                                <Box
                                    sx={{
                                        px: 1,
                                        py: 0.5,
                                        borderRadius:
                                            "6px",
                                        background:
                                            "#dbeafe",
                                        color:
                                            "#1d4ed8",
                                        fontSize:
                                            "12px",
                                        fontWeight: 700,
                                    }}
                                >
                                    Total:{" "}
                                    {
                                        uploadResult
                                            .data
                                            .total_rows
                                    }
                                </Box>


                                {/* SUCCESS */}

                                <Box
                                    sx={{
                                        px: 1,
                                        py: 0.5,
                                        borderRadius:
                                            "6px",
                                        background:
                                            "#dcfce7",
                                        color:
                                            "#15803d",
                                        fontSize:
                                            "12px",
                                        fontWeight: 700,
                                    }}
                                >
                                    Success:{" "}
                                    {
                                        uploadResult
                                            .data
                                            .success_count
                                    }
                                </Box>


                                {/* FAILED */}

                                <Box
                                    sx={{
                                        px: 1,
                                        py: 0.5,
                                        borderRadius:
                                            "6px",
                                        background:
                                            uploadResult
                                                .data
                                                .failed_count >
                                                0
                                                ? "#fee2e2"
                                                : "#f1f5f9",
                                        color:
                                            uploadResult
                                                .data
                                                .failed_count >
                                                0
                                                ? "#b91c1c"
                                                : "#475569",
                                        fontSize:
                                            "12px",
                                        fontWeight: 700,
                                    }}
                                >
                                    Failed:{" "}
                                    {
                                        uploadResult
                                            .data
                                            .failed_count
                                    }
                                </Box>

                            </Box>

                        </Box>


                        {/* ==================================================
                            SUCCESS ROWS
                        ================================================== */}

                        {uploadResult.data
                            .success_rows
                            ?.length > 0 && (

                                <Box
                                    sx={{
                                        border:
                                            "1px solid #e2e8f0",
                                        overflowX:
                                            "auto",
                                        maxHeight:
                                            "420px",
                                        overflowY:
                                            "auto",

                                        "&::-webkit-scrollbar": {
                                            width:
                                                "6px",
                                            height:
                                                "6px",
                                        },

                                        "&::-webkit-scrollbar-thumb": {
                                            background:
                                                "#cbd5e1",
                                            borderRadius:
                                                "10px",
                                        },
                                    }}
                                >

                                    <table
                                        style={{
                                            width:
                                                "100%",
                                            borderCollapse:
                                                "collapse",
                                            minWidth:
                                                "1100px",
                                            fontSize:
                                                "12px",
                                        }}
                                    >

                                        <thead>

                                            <tr>

                                                <th
                                                    style={
                                                        resultHeaderStyle
                                                    }
                                                >
                                                    #
                                                </th>

                                                <th
                                                    style={
                                                        resultHeaderStyle
                                                    }
                                                >
                                                    Excel Row
                                                </th>

                                                <th
                                                    style={
                                                        resultHeaderStyle
                                                    }
                                                >
                                                    Customer
                                                </th>

                                                <th
                                                    style={
                                                        resultHeaderStyle
                                                    }
                                                >
                                                    Registration
                                                </th>

                                                <th
                                                    style={
                                                        resultHeaderStyle
                                                    }
                                                >
                                                    Assigned To
                                                </th>

                                                <th
                                                    style={
                                                        resultHeaderStyle
                                                    }
                                                >
                                                    Customer ID
                                                </th>

                                                <th
                                                    style={
                                                        resultHeaderStyle
                                                    }
                                                >
                                                    Vehicle ID
                                                </th>

                                                <th
                                                    style={
                                                        resultHeaderStyle
                                                    }
                                                >
                                                    Lead ID
                                                </th>

                                                <th
                                                    style={
                                                        resultHeaderStyle
                                                    }
                                                >
                                                    Policy ID
                                                </th>

                                                <th
                                                    style={
                                                        resultHeaderStyle
                                                    }
                                                >
                                                    Status
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {uploadResult.data
                                                .success_rows
                                                .map(
                                                    (
                                                        row,
                                                        index
                                                    ) => (

                                                        <tr
                                                            key={
                                                                index
                                                            }
                                                        >

                                                            <td
                                                                style={
                                                                    resultCellStyle
                                                                }
                                                            >
                                                                {
                                                                    index +
                                                                    1
                                                                }
                                                            </td>

                                                            <td
                                                                style={
                                                                    resultCellStyle
                                                                }
                                                            >
                                                                {
                                                                    row.row
                                                                }
                                                            </td>

                                                            <td
                                                                style={
                                                                    resultCellStyle
                                                                }
                                                            >
                                                                {
                                                                    row.customer_name ||
                                                                    "-"
                                                                }
                                                            </td>

                                                            <td
                                                                style={
                                                                    resultCellStyle
                                                                }
                                                            >
                                                                {
                                                                    row.registration_number ||
                                                                    "-"
                                                                }
                                                            </td>

                                                            <td
                                                                style={
                                                                    resultCellStyle
                                                                }
                                                            >
                                                                {
                                                                    row.assigned_to ??
                                                                    "-"
                                                                }
                                                            </td>

                                                            <td
                                                                style={
                                                                    resultCellStyle
                                                                }
                                                            >
                                                                {
                                                                    row.customer_id ??
                                                                    "-"
                                                                }
                                                            </td>

                                                            <td
                                                                style={
                                                                    resultCellStyle
                                                                }
                                                            >
                                                                {
                                                                    row.vehicle_id ??
                                                                    "-"
                                                                }
                                                            </td>

                                                            <td
                                                                style={
                                                                    resultCellStyle
                                                                }
                                                            >
                                                                {
                                                                    row.lead_id ??
                                                                    "-"
                                                                }
                                                            </td>

                                                            <td
                                                                style={
                                                                    resultCellStyle
                                                                }
                                                            >
                                                                {
                                                                    row.policy_id ??
                                                                    "-"
                                                                }
                                                            </td>

                                                            <td
                                                                style={{
                                                                    ...resultCellStyle,
                                                                    color:
                                                                        "#15803d",
                                                                    fontWeight:
                                                                        700,
                                                                }}
                                                            >
                                                                Success
                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                        </tbody>

                                    </table>

                                </Box>
                            )}


                        {/* ==================================================
                            FAILED ROWS
                        ================================================== */}

                        {uploadResult.data
                            .failed_rows
                            ?.length > 0 && (

                                <Box sx={{ mt: 2 }}>

                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius:
                                                "10px 10px 0 0",
                                            border:
                                                "1px solid #fecaca",
                                            borderBottom:
                                                "none",
                                            background:
                                                "#fef2f2",
                                        }}
                                    >

                                        <Typography
                                            level="title-sm"
                                            sx={{
                                                fontWeight: 700,
                                                color:
                                                    "#b91c1c",
                                            }}
                                        >
                                            Failed Rows
                                        </Typography>

                                    </Box>


                                    <Box
                                        sx={{
                                            border:
                                                "1px solid #fecaca",
                                            overflowX:
                                                "auto",
                                            maxHeight:
                                                "300px",
                                            overflowY:
                                                "auto",

                                            "&::-webkit-scrollbar": {
                                                width:
                                                    "6px",
                                                height:
                                                    "6px",
                                            },

                                            "&::-webkit-scrollbar-thumb": {
                                                background:
                                                    "#fca5a5",
                                                borderRadius:
                                                    "10px",
                                            },
                                        }}
                                    >

                                        <table
                                            style={{
                                                width:
                                                    "100%",
                                                borderCollapse:
                                                    "collapse",
                                                minWidth:
                                                    "800px",
                                                fontSize:
                                                    "12px",
                                            }}
                                        >

                                            <thead>

                                                <tr>

                                                    <th
                                                        style={
                                                            failedHeaderStyle
                                                        }
                                                    >
                                                        #
                                                    </th>

                                                    <th
                                                        style={
                                                            failedHeaderStyle
                                                        }
                                                    >
                                                        Excel Row
                                                    </th>

                                                    <th
                                                        style={
                                                            failedHeaderStyle
                                                        }
                                                    >
                                                        Customer
                                                    </th>

                                                    <th
                                                        style={
                                                            failedHeaderStyle
                                                        }
                                                    >
                                                        Registration
                                                    </th>

                                                    <th
                                                        style={
                                                            failedHeaderStyle
                                                        }
                                                    >
                                                        Error
                                                    </th>

                                                    <th
                                                        style={
                                                            failedHeaderStyle
                                                        }
                                                    >
                                                        Status
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {uploadResult.data
                                                    .failed_rows
                                                    .map(
                                                        (
                                                            row,
                                                            index
                                                        ) => (

                                                            <tr
                                                                key={
                                                                    index
                                                                }
                                                            >

                                                                <td
                                                                    style={
                                                                        failedCellStyle
                                                                    }
                                                                >
                                                                    {
                                                                        index +
                                                                        1
                                                                    }
                                                                </td>

                                                                <td
                                                                    style={
                                                                        failedCellStyle
                                                                    }
                                                                >
                                                                    {
                                                                        row.row
                                                                    }
                                                                </td>

                                                                <td
                                                                    style={
                                                                        failedCellStyle
                                                                    }
                                                                >
                                                                    {
                                                                        row.customer_name ||
                                                                        "-"
                                                                    }
                                                                </td>

                                                                <td
                                                                    style={
                                                                        failedCellStyle
                                                                    }
                                                                >
                                                                    {
                                                                        row.registration_number ||
                                                                        "-"
                                                                    }
                                                                </td>

                                                                <td
                                                                    style={{
                                                                        ...failedCellStyle,
                                                                        color:
                                                                            "#b91c1c",
                                                                        fontWeight:
                                                                            600,
                                                                    }}
                                                                >
                                                                    {
                                                                        row.reason ||
                                                                        "Unknown error"
                                                                    }
                                                                </td>

                                                                <td
                                                                    style={{
                                                                        ...failedCellStyle,
                                                                        color:
                                                                            "#b91c1c",
                                                                        fontWeight:
                                                                            700,
                                                                    }}
                                                                >
                                                                    Failed
                                                                </td>

                                                            </tr>

                                                        )
                                                    )}

                                            </tbody>

                                        </table>

                                    </Box>

                                </Box>
                            )}

                    </Box>
                )}


                {/* ==================================================
                    ACTION BUTTONS
                ================================================== */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "flex-end",
                        gap: 1,
                        mt: 3,
                    }}
                >

                    <Box
                        component="button"
                        onClick={handleReset}
                        disabled={loading}
                        sx={{
                            border:
                                "1px solid #cbd5e1",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                            px: 2,
                            py: 1,
                            borderRadius: "7px",
                            background: "#fff",
                            color: "#475569",
                            fontWeight: 600,

                            "&:hover": {
                                background:
                                    "#f8fafc",
                            },
                        }}
                    >
                        Reset
                    </Box>


                    <Box
                        component="button"
                        onClick={handleUpload}
                        disabled={
                            loading ||
                            !file
                        }
                        sx={{
                            border: "none",
                            cursor:
                                loading ||
                                    !file
                                    ? "not-allowed"
                                    : "pointer",
                            px: 2,
                            py: 1,
                            borderRadius: "7px",
                            background:
                                loading ||
                                    !file
                                    ? "#94a3b8"
                                    : "#16a34a",
                            color: "#fff",
                            fontWeight: 600,
                        }}
                    >

                        {loading
                            ? "Uploading..."
                            : policyType === "NEW"
                                ? "Upload Excel"
                                : "Add Policies"}

                    </Box>

                </Box>

            </Panel>

        </Wrapper>
    );
};

export default LegacySaleMaster;