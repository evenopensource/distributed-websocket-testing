import React, { useState, useRef } from "react";
import { Box, TextField, Typography, Autocomplete, Grid, Button } from "@mui/material";
import CardHeader from "../common/cardHeader";
import UploadDialog from "../dialog-boxes/upload-dialog-box";
import type { UploadDialogRef } from "../dialog-boxes/upload-dialog-box";

interface ConfigCardProps {
    serverConfig: {
        header: string;
        fields: {
            label: string;
            type: string;
            options?: { label: string; value: string }[];
            placeholder?: string;
            columns?: { placeholder: string; name: string }[];
        }[];
    };
}

const TableComponent = ({ columns }: { columns: { placeholder: string; name: string }[] }) => {
    const [rows, setRows] = useState([{ cookieName: "", cookieValue: "" }]);

    const handleChange = (index: number, field: string, value: string) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    const handleAddRow = () => {
        setRows([...rows, { cookieName: "", cookieValue: "" }]);
    };

    return (
        <Box sx={{ width: "202%", paddingTop: "10px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} style={{ border: "1px solid #ccc" }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        value={row[col.name]}
                                        onChange={(e) => handleChange(rowIndex, col.name, e.target.value)}
                                        placeholder={col.placeholder}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    border: "none", // Removes the border
                                                },
                                            },
                                        }}
                                    />

                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddRow}
                sx={{ marginTop: "10px" }}
            >
                Add Row
            </Button>
        </Box>
    );
};

const ConfigCard2: React.FC<ConfigCardProps> = ({ serverConfig }) => {
    const { header, fields } = serverConfig;

    const uploadDialogRef = useRef<UploadDialogRef>(null);

    return (
        <Box sx={{ flexGrow: 1, margin: "15px", border: "1px solid #DFE3EB", borderRadius: "8px" }}>
            <CardHeader header={header} />
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 16 }} sx={{ padding: "10px" }}>
                {fields.map((field, index) => (
                    <Grid key={index} item xs={4} sm={4} md={8}>
                        <Box sx={{ textAlign: "left" }}>
                            <Typography sx={{ fontWeight: "600" }}>{field.label}</Typography>

                            {(() => {
                                switch (field.type) {
                                    case "script":
                                        return <TextField variant="standard"/>
                                    case "dropDown":
                                        return (
                                            <Autocomplete
                                                options={field.options || []}
                                                getOptionLabel={(option) => option.label}
                                                renderInput={(params) => (
                                                    <TextField {...params} placeholder={field.label} variant="standard" fullWidth />
                                                )}
                                            />
                                        );
                                    case "textField":
                                        return <TextField fullWidth variant="standard" />;
                                    case "file":
                                        return (
                                            <Button variant="text" onClick={(event) => uploadDialogRef.current?.openDialog(event)}>
                                                {field.placeholder}
                                            </Button>
                                            // <label htmlFor="file-upload" style={{ cursor: "pointer", display: "block", width: "100%" }}>
                                            //     <TextField
                                            //         fullWidth
                                            //         variant="standard"
                                            //         onClick={(event) => uploadDialogRef.current?.openDialog(event)}
                                            //         value={field.placeholder}
                                            //         slotProps={{
                                            //             input: {
                                            //                 readOnly: true,
                                            //                 sx: { pointerEvents: "none" },
                                            //             },
                                            //         }}
                                            //         sx={{
                                            //             "& .MuiInputBase-root": {
                                            //                 height: 50,
                                            //                 color: "#2160EB",
                                            //                 cursor: "pointer",
                                            //             },
                                            //             "& .MuiInput-underline:before": { borderBottom: "none" },
                                            //             "& .MuiInput-underline:after": { borderBottom: "none" },
                                            //             "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                            //         }}
                                            //     />
                                            //     <UploadDialog ref={uploadDialogRef} />
                                            // </label>
                                        );
                                    case "table":
                                        return <TableComponent columns={field.columns || []} />;
                                    default:
                                        return null;
                                }
                            })()}
                            <UploadDialog ref={uploadDialogRef} />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ConfigCard2;
