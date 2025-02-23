import React, { useRef, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import CardHeader from "../common/cardHeader";
import AddPackages from "../dialog-boxes/add-packages";
import { AddPackageDialogRef } from "../dialog-boxes/add-packages";
import { useTestConfigStore } from "../../store/app-store";
import { getValueByPath } from "./configCard";
interface MessageProcessorsProps {
    serverConfig: {
        header: string;
        fields: {
            label: string;
            type: string;
            width?: number;
            options?: { label: string; value: string }[];
            placeholder?: string;
        }[];
    };

}

const MessageProcessors: React.FC<MessageProcessorsProps> = ({ serverConfig }) => {
    const { header, fields } = serverConfig;
    const addPackageDialogRef = useRef<AddPackageDialogRef>(null);
    const { testConfig, onFieldChange } = useTestConfigStore()


    interface OnChangeProps {
        (value: string): void;
    }

    const onChange: OnChangeProps = (value) => {
        console.log(value);
    }

    return (
        <Box sx={{ flexGrow: 1, margin: "15px", border: "1px solid #DFE3EB", borderRadius: "8px" }}>
            <CardHeader header={header} />
            <Box sx={{ display: "flex" }}>
                {fields.map((field) => {
                    const value = getValueByPath(testConfig,field.path,field.name)
                    const packages = getValueByPath(testConfig, field.path, "packages")
                    return (
                        <Box sx={{ textAlign: "left", width: field.width || "50%", border: "1px solid #DFE3EB" }}>
                            <Box sx={{ padding: "20px" }}>
                                <Typography sx={{ fontWeight: "600" }}>{field.label}</Typography>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    defaultValue={value}
                                    placeholder={field.placeholder}
                                    onChange={(e) => onFieldChange(e.target.value, field.path, field.name)}
                                    multiline
                                    rows={20}
                                    sx={{
                                        "& .MuiInput-underline:before": { borderBottom: "none" },
                                        "& .MuiInput-underline:after": { borderBottom: "none" },
                                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                    }}
                                />
                            </Box>
                            <AddPackages ref={addPackageDialogRef} value={packages} onClickDone ={(data)=>{onFieldChange(data,field.path, "packages")}} />
                            <Box sx={{ padding: "10px", borderTop: "1px solid #DFE3EB", textAlign: "start" }}>
                                <Button variant="outlined" onClick={(event) => addPackageDialogRef.current?.openDialog(event)}>
                                    Import Packages
                                </Button>
                            </Box>
                        </Box>
                    )

                })}
            </Box>

        </Box>
    );
};

export default MessageProcessors;
