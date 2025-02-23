import { useState, forwardRef, useImperativeHandle, FC, useEffect } from "react";
import { Box, Typography,Popover, TextField, Button, IconButton, CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { Close } from "@mui/icons-material";

export interface AddPackageDialogRef {
    openDialog: (event: React.MouseEvent<HTMLElement>) => void;
    closeDialog: () => void;
}

const AddPackages = forwardRef<AddPackageDialogRef>(({value=[], onClickDone}:{value:array[],onClickDone:Function}, ref) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [selectedPackages, setSelectedPackages] = useState<string[]>([...value]);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    useEffect(()=>{
        setSelectedPackages([...value])
    },[value,ref])

    useImperativeHandle(ref, () => ({
        openDialog: (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget),
        closeDialog: () => setAnchorEl(null),
      }));

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (!value) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${value}&size=5`);
            const data = await response.json();
            setSearchResults(data.objects.map((obj: any) => obj.package.name));
        } catch (error) {
            console.error("Error fetching npm packages:", error);
        }
        setLoading(false);
    };

    const handleSelectPackage = (pkg: string) => {
        if (!selectedPackages.includes(pkg)) {
            setSelectedPackages([...selectedPackages, pkg]);
        }
        setSearchTerm("");
        setSearchResults([]);
    };

    const handleRemovePackage = (pkg: string) => {
        setSelectedPackages(selectedPackages.filter((p) => p !== pkg));
    };

    const handleSave=()=>{
        onClickDone(selectedPackages)
        setAnchorEl(null)
        setSelectedPackages([])
    }

    return (
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
        <Box sx={{ 
            width: "50%", 
            minWidth: "400px", 
            border: "1px solid #ccc", 
            borderRadius: "8px", 
            background: "white",
            padding: "16px",
            zIndex: 1000,
            boxShadow: 3
        }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">Add Packages</Typography>
                <IconButton onClick={() => setAnchorEl(null)}>
                    <Close />
                </IconButton>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search npm packages"
                InputProps={{
                    endAdornment: loading ? <CircularProgress size={20} /> : <SearchIcon />,
                }}
            />

            <Box height={200} sx={{ overflow: "auto", mt: 2 }}>
                {searchResults.length > 0 && (
                    <List>
                        {searchResults.map((pkg) => (
                            <ListItem key={pkg} onClick={() => handleSelectPackage(pkg)} >
                                <ListItemText primary={pkg} />
                            </ListItem>
                        ))}
                    </List>
                )}

                <List>
                    {selectedPackages.map((pkg) => (
                        <ListItem key={pkg} sx={{ backgroundColor: "#FBFBFB", border: "1px solid #E4E9F0", mt: 1 }}>
                            <ListItemText primary={pkg} />
                            <IconButton onClick={() => handleRemovePackage(pkg)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box mt={2} sx={{ borderTop: "1px solid #DFE3EB", padding: "10px", display: "flex", justifyContent: "flex-end" }}>
                <Button color="secondary"onClick={() => setAnchorEl(null)}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Done
                </Button>
            </Box>
        </Box>
        </Popover>
    );
});

export default AddPackages;
