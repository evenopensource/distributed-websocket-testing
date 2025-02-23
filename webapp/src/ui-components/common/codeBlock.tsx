import React, { use, useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography } from "@mui/material";
import CloseSharp from "@mui/icons-material/CloseSharp";
import Editor from "@monaco-editor/react";

const CodeDialog = ({ open, onClose, onChangeValue, value }) => {
  const [jsonData, setJsonData] = useState(value?value:'{\n  "key": "value"\n}');
  useEffect(() => { 
    setJsonData(value);
  }, [value]);

  const handleChange = (value) => {
    setJsonData(value);
  };

  const handleSend = () => {
    try {
      onChangeValue(JSON.parse(jsonData))
     onClose();
    } catch {
      alert("Invalid JSON format");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ backgroundColor: "#323845", borderRadius: "8px" }}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#fff",
            borderBottom: "1px solid #DFE3EB",
            padding: "8px 16px",
          }}
        >
          <Typography variant="h6">JSON Code Block</Typography>
          <IconButton onClick={onClose}>
            <CloseSharp sx={{ color: "#fff" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2, height: "300px", backgroundColor: "#1E1E1E" }}>
          <Editor
            height="250px"
            defaultLanguage="json"
            theme="vs-dark"
            value={jsonData}
            onChange={handleChange}
            options={{
              minimap: { enabled: false },
              wordWrap: "on",
              autoClosingBrackets: "always",
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </DialogContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Box
            sx={{
              bgcolor: "#F9F9F9",
              color: "black",
              width: "50px",
              textAlign: "center",
              p: 1,
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handleSend}
          >
            OK
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default CodeDialog;
