import { useState } from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";
import { useTestConfigStore } from "../../store/app-store";


const MultiSelectDropdown = ({users,value,onChangeUsers}) => {
    return (
        <Autocomplete
            multiple
            options={users}
            value={value}
            onChange={(event, newValue) => onChangeUsers(newValue)}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip key={index} label={option} {...getTagProps({ index })} />
                ))
            }
            renderInput={(params) => (
                <TextField {...params} variant="outlined" fullWidth label="Select Users" />
            )}
        />
    );
};

export default MultiSelectDropdown;
