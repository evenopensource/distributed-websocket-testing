import { useState, forwardRef, useImperativeHandle } from "react";
import { Button, Popover, TextField, IconButton, Box, Typography } from "@mui/material";
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import uploadButton from "../../assets/uploadButton.svg";
import { Close } from "@mui/icons-material";
import { useTestConfigStore } from "../../store/app-store";

export interface UploadDialogRef {
  openDialog: (event: React.MouseEvent<HTMLElement>) => void;
  closeDialog: () => void;
}

const template = {
  student_join: {
    action: "student_join",
    id: "SSN111",
    year: 3,
    section: "A",
    department: "CS",
  },
  professor_join: { action: "professor_join", id: "SSNProf111" },
  professor_broadcast: {
    action: "professor_broadcast",
    stuDepartment: "CS",
    stuYear: 3,
    stuSection: "A",
    message: "hii this is prof SSNProf111",
  },
  student_send: {
    action: "student_send",
    profId: "SSNProf111",
    message: "Hello Prof from SSN222",
  },
};

const UploadDialog = forwardRef<UploadDialogRef>((_, ref) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {onFieldChange} = useTestConfigStore()
  useImperativeHandle(ref, () => ({
    openDialog: (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget),
    closeDialog: () => setAnchorEl(null),
  }));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type === "application/json") {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError("Only JSON files are allowed.");
      }
    }
  };

  const onDownload = () => {
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template.json";
    link.click();
    URL.revokeObjectURL(url);
  };
 const handleUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          onFieldChange(jsonData, "testConfig.message", "recommendationMessages");
          setAnchorEl(null);
        } catch (error) {
          setError("Invalid JSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Box p={2} sx={{ width: 378 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Upload File</Typography>
          <IconButton onClick={() => setAnchorEl(null)}>
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Upload File as per the given Template or upload Async API Docs.
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            fullWidth
            type="file"
            inputProps={{ accept: "application/json" }}
            variant="outlined"
            onChange={handleFileChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                height: "34px",
                fontSize: "14px",
              },
              "& .MuiOutlinedInput-input": {
                padding: "8px 14px",
              },
            }}
          />
          <IconButton>
            <img src={uploadButton} alt="upload" />
          </IconButton>
        </Box>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Box mt={2} display="flex" justifyContent="flex-end" alignItems={"center"}>
          <Typography onClick={onDownload} sx={{ color: "blue", cursor: "pointer" }}>
            Download Template
          </Typography>
          <Button onClick={() => setAnchorEl(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpload} variant="contained" color="primary" >
            Done
          </Button>
        </Box>
      </Box>
    </Popover>
  );
});

export default UploadDialog;
