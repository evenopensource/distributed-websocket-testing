import React, { useState, useRef } from "react";
import { Box, Button, Divider, IconButton, TextField, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditSquare from '../../assets/editSquare.svg';
import { useTestConfigStore } from "../../store/app-store";
import CodeDialog from "./codeBlock";

const MessageEditBox: React.FC = ({value, label, index, onChangeValue}:{value:string, label:string}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [selectedTab, setSelectedTab] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {testConfig,onFieldChange} = useTestConfigStore()
    const recommendationMessages = testConfig.message.recommendationMessages
    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth / 2;
            scrollRef.current.scrollTo({
                left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: "smooth",
            });
        }
    };
    const onSelectRecommendation = (message:string) => {
        if(label){
            onChangeValue(recommendationMessages[message])
        }
        onFieldChange(recommendationMessages[message], "testSuites.0.testCases." + index, "addUserMessage")
    }
    const onChangeField = (value:string) => {
        if(label){
            onChangeValue(value)
        }
        onFieldChange(value, "testSuites.0.testCases." + index, "addUserMessage")
    }

    return (
        <Box display="flex" flexDirection="column" gap={1} sx={{ width: "100%", border: "1px solid #DFE3EB", padding: "10px 10px" }}>
            <Box>
            <Typography variant="h6" >{label || "User Message"}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
                <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Start a new message..."
                    value={JSON.stringify(value)}
                    onChange={(e) => onChangeField(e.target.value)}
                    InputProps={{ disableUnderline: true }}
                />
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
                <IconButton onClick={() => scroll("left")}>
                    <ArrowBackIcon />
                </IconButton>
                <Box
                    ref={scrollRef}
                    sx={{
                        display: "flex",
                        overflowX: "auto",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": { display: "none" },
                        gap: 1,
                        flexGrow: 1,
                        maxWidth: "100%",
                    }}
                >
                    {Object.keys(recommendationMessages).map((key, index) => (
                        <Button
                            key={index}
                            variant={ "outlined"}
                            onClick={() => onSelectRecommendation(key)}
                            sx={{
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                minWidth: "120px",
                                color:"#666E7D",
                                borderColor: "#DFE3EB",
                            }}
                        >{key}
                           
                        </Button>
                    ))}
                </Box>
                <IconButton onClick={() => scroll("right")}>
                    <ArrowForwardIcon />
                </IconButton>
                <Divider
                    orientation="vertical"
                    sx={{ borderColor: "#DFE3EB", height: "24px", mx: 1 }}
                />

                <IconButton onClick={() => setIsDialogOpen(true)}>
                    <img src={EditSquare} alt="Edit" />
                </IconButton>
            </Box>
            <CodeDialog value={JSON.stringify(value)} open={isDialogOpen} onChangeValue={onChangeField} onClose={()=>{setIsDialogOpen(false)}}/>
        </Box>
    );
};

export default MessageEditBox;
