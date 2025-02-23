import React, {  useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import CardHeader from "../common/cardHeader";
import { getValueByPath } from "./configCard";
import { useTestConfigStore } from "../../store/app-store";
interface DataScriptsProps {
    serverConfig: {
        header: string;
        fields: {
            label: string;
            type: string;
            width?: number;
            options?: { label: string; value: string }[];
            placeholder?: string;
            name?:any;
            path?:any
            value?:any
        }[];
    };

}


const DataScripts: React.FC<DataScriptsProps> = ({ serverConfig }) => {
    const { header, fields } = serverConfig;
    const [timer, setTimer] = useState(0);
    const { testConfig, onFieldChange } = useTestConfigStore()


    return (
        <Box sx={{ flexGrow: 1, margin: "15px", border: "1px solid #DFE3EB", borderRadius: "8px" }}>
            <CardHeader header={header} />
            <Box sx={{ display: "flex" }}>
                {fields.map((field,index) => {
                    const value = getValueByPath(testConfig, field.path, field.name)
                    return (
                        <Box sx={{ textAlign: "left", width: field.width || "50%", border: "1px solid #DFE3EB" }}>
                            <Box sx={{ padding: "20px" }}>
                                <Typography sx={{ fontWeight: "600" }}>{field.label}</Typography>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    placeholder={field.placeholder}
                                    defaultValue={value}
                                    onChange={(e) => onFieldChange(e.target.value,field.path, field.value)}
                                    multiline
                                    rows={20}
                                    sx={{
                                        "& .MuiInput-underline:before": { borderBottom: "none" },
                                        "& .MuiInput-underline:after": { borderBottom: "none" },
                                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                    }}
                                />
                            </Box>
                            <Box sx={{ padding: "10px", borderTop: "1px solid #DFE3EB", textAlign: "start" }}>
                                <Typography>{"Timeout (in seconds)"}{<input
                                    type="number"
                                    value={index===0 ?testConfig.dataScript.initTimeout : testConfig.dataScript.cleanUpTimeout}
                                    onChange={(e)=>{onFieldChange(e.target.value,field.path,index===0 ?"initTimeout":"cleanUpTimeout")}}
                                    min={0}
                                    max={999}
                                    style={{
                                        width: "60px",
                                        textAlign: "center",
                                    }}
                                />}</Typography>
                            </Box>
                        </Box>
                    )

                })}
            </Box>
        </Box>
    );
};

export default DataScripts;
