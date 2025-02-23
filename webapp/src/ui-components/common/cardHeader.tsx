import React from "react";
import { Box, Typography } from "@mui/material";

interface CardHeaderProps {
  header: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ header }) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        borderBottom: "1px solid #DFE3EB",
        padding: "10px",
        backgroundColor: "#F8FAFF",
        textAlign: "left",
      }}
    >
      <Typography sx={{ fontWeight: "600" }}>{header}</Typography>
    </Box>
  );
};

export default CardHeader;
