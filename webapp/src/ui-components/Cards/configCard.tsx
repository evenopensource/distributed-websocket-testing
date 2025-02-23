import React, { useRef, useState } from "react";
import { Box, TextField, Typography, Autocomplete, Grid } from "@mui/material";
import CardHeader from "../common/cardHeader";
import UploadDialog, { UploadDialogRef } from "../dialog-boxes/upload-dialog-box";
import MessageEditBox from "../common/messageEditBox";
import { useTestConfigStore } from "../../store/app-store";
import { TestConfig } from "../../store/types";
import ConsumedBy from "../Contents/consumedBy";

interface ConfigCardProps {
  serverConfig: {
    header: string;
    fields: {
      label: string;
      type: string;
      width: number
      options?: { label: string; value: string }[];
      placeholder?: string;
      columns?: { placeholder: string; name: string }[];
      path: string;
      name: string;
      dataType?: string
    }[];
  };
}
type NestedObject = Record<string, any>;

export function getValueByPath(obj: NestedObject, path: string, lastKey: string): any {
  console.log(obj, path, lastKey)
  if (!lastKey) {
    return ""
  }
  if (!path && lastKey) {
    return obj[lastKey]

  }
  const keys = path.split('.');
  let current: any = obj;

  for (const key of keys) {
    if (current && typeof current === 'object') {
      current = current[key];
    } else {
      return undefined; // Path does not exist
    }
  }

  return current ? current[lastKey] : undefined;
}


const TableComponent = ({ columns, list }: { columns: { placeholder: string; name: string }[], list: { server: string, port: string }[] }) => {
  const { onFieldChange } = useTestConfigStore()

  const handleChange = (index: number, field: string, value: string) => {
    const updatedRows = [...list];
    updatedRows[index][field] = value;
    onFieldChange(value, "", "servers")
  };


  return (
    <Box sx={{ width: "100%", paddingTop: "10px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", }}>
        <tbody >
          {list.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} style={{ border: "1px solid #ccc" }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    value={row[col.name]}
                    onChange={(e) => handleChange(rowIndex, col.name, e.target.value)}
                    placeholder={col.placeholder}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none", // Removes the border
                        },
                      },
                      "& .MuiInput-underline:before": { borderBottom: "none" },
                      "& .MuiInput-underline:after": { borderBottom: "none" },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                    }}
                  />

                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

const ConfigCard: React.FC<ConfigCardProps> = ({ serverConfig, caseIndex }) => {
  const { header, fields } = serverConfig;
  const { testConfig, onFieldChange } = useTestConfigStore()


  const uploadDialogRef = useRef<UploadDialogRef>(null);

  return (
    <Box sx={{ flexGrow: 1, margin: "15px", border: "1px solid #DFE3EB", borderRadius: "8px" }}>
      <CardHeader header={header} />
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 16 }} sx={{ padding: "10px" }}>
        {fields.map((field, index) => (
          <Grid key={index} item xs={2} sm={4} md={field?.width || 4}>
            <Box sx={{ textAlign: "left" }}>
              <Typography sx={{ fontWeight: "600" }}>
                {field.label}
              </Typography>
              {(() => {
                const value = getValueByPath(testConfig, field?.path, field.name)
                switch (field.type) {
                  case "servers":
                    const serverOptions = testConfig.servers?.map((server) => server.name) ?? [];

                    return (
                      <Autocomplete
                        options={serverOptions}
                        value={value || null} // Ensure value is controlled
                        onChange={(event, newValue) => onFieldChange(newValue, field.path, field.name)} // Corrected onChange
                        renderInput={(params) => <TextField {...params} variant="standard"  />}
                      />
                    );

                  case "consumedBy":
                    return <ConsumedBy index={caseIndex} />;
                  case "script":
                    return <TextField variant="standard" value={value} placeholder={field.placeholder} fullWidth multiline minRows={20} sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none", // Removes the border
                        },
                      },
                      "& .MuiInput-underline:before": { borderBottom: "none" },
                      "& .MuiInput-underline:after": { borderBottom: "none" },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                    }} />
                  case "dropDown":
                    return (
                      <Autocomplete
                        options={field.options || []}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                          <TextField {...params} value={value}
                            placeholder={field.label} variant="standard" />
                        )}
                      />
                    );
                  case "messageBox":
                    return <MessageEditBox index={caseIndex} value={value} />
                  case "textField":
                    return <TextField fullWidth variant="standard"
                      datatype={field.dataType || "string"}
                      onChange={(e) => onFieldChange(e.target.value, field.path, field.name)}
                      value={value}
                    />;
                  case "file":
                    return (
                      <label
                        htmlFor="file-upload"
                        style={{ cursor: "pointer", display: "block", width: "100%" }}
                      >
                        <TextField
                          fullWidth
                          variant="standard"
                          onClick={(event) => uploadDialogRef.current?.openDialog(event)}
                          value={field.placeholder} // Placeholder sentence
                          slotProps={{
                            input: {
                              readOnly: true,
                              sx: { pointerEvents: "none" }, // Prevents text interception
                            },
                          }}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 50,
                              color: "#2160EB",
                              cursor: "pointer",
                            },
                            "& .MuiInput-underline:before": { borderBottom: "none" },
                            "& .MuiInput-underline:after": { borderBottom: "none" },
                            "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                          }}
                        />
                        <UploadDialog ref={uploadDialogRef} />
                      </label>
                    );
                  case "table":
                    return <TableComponent columns={field.columns || []} list={value} />;
                  default:
                    return null;
                }
              })()}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ConfigCard;
