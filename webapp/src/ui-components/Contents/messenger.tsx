import React, { useState } from "react";
import { Box, TextField, Typography, Button, Paper, Chip, IconButton } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MessageEditBox from "../common/messageEditBox";
import MessageIcon from '../../assets/messageIcon.svg';
import { CloseSharp } from "@mui/icons-material";
const WebSocketMockUI: React.FC = () => {
  const dummy = []
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; type: "sent" | "received"; timestamp: string }[]>([{
    text: "this is test message", type: "received", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  }, {
    text: "this is test message", type: "sent", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  }]);

  const handleSend = () => {
    if (message.trim() !== "") {
      setMessages([...messages, { text: message, type: "sent", timestamp: new Date().toLocaleTimeString() }]);
      setMessage("");
    }
  };

  return (
    <Box sx={{ display: "flex", marginBottom:"100px" }}>
      <Box sx={{ border: "1px solid #DFE3EB", display: "flex", width: "60%", flexDirection: "column", alignItems: "center", m: 1, borderRadius: "8px" }}>
        <Box sx={{ borderBottom: "1px solid #DFE3EB", padding: "4px 10px" }} width={"100%"}>
          <Typography variant="h6" align="left">
            WebSocket mock server started at <Chip sx={{ borderRadius: "4px" }} label={<Box sx={{ display: "flex", alignItems: "center" }}><Typography>ws://localhost:8080</Typography><IconButton><ContentCopyIcon fontSize="small" /></IconButton></Box>} />
          </Typography>
        </Box>
        <Box sx={{
          width: "100%", display: "flex",
          flexDirection: "column-reverse", height: "65vh", overflowY: "auto", p: 2, mb: 2
        }}>
          {messages.length === 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "center" }}>
              <img src={MessageIcon} alt="Message Icon" />
              <Typography color="textSecondary" align="center" sx={{ color: "#0E1524", fontWeight: 600, size: "14px" }}>
                Start a new message...
              </Typography>
            </Box>

          ) : (
            messages.reverse().map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: msg.type === "sent" ? "flex-end" : "flex-start",
                  mb: 1,
                  maxWidth: "70%",
                }}
              >
                <Paper
                  sx={{
                    p: 1,
                    borderRadius: "4px",
                    bgcolor: msg.type === "sent" ? "primary.main" : "grey.300",
                    color: msg.type === "sent" ? "white" : "black",
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Paper>
                <Box textAlign={msg.type === "sent" ? "right" : "left"} >
                  {msg.type === "sent" && <IconButton><ContentCopyIcon fontSize="small" /></IconButton>}
                  <Typography variant="caption" color="textSecondary" sx={{ alignSelf: msg.type === "sent" ? "flex-end" : "flex-start" }}>
                    {msg.timestamp}
                  </Typography>
                  {msg.type !== "sent" && <IconButton><ContentCopyIcon fontSize="small" /></IconButton>}
                </Box>

              </Box>
            ))
          )}
        </Box>
        <Box sx={{ width: "100%", padding: "20px" }}>
          <MessageEditBox />
          {/* <TextField
            fullWidth
            label="Start a new message..."
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          /> */}
        </Box>
      </Box>
      <Box sx={{ width: "40%", backgroundColor: "#323845", borderRadius: "8px", m: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #DFE3EB", padding: "4px 10px" }}>
          <Typography variant="h6" align="center" sx={{ color: "#fff", p: 2 }}>
            Code block
          </Typography>
          <IconButton><CloseSharp sx={{ color: "#fff" }} /></IconButton>
        </Box>
        <Box sx={{ p: 2, height:"85%" }}>
          <TextField
            fullWidth
            multiline
            rows={29}
            placeholder="Write your code here..."
            variant="outlined"
            value={message}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "transparent", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "transparent", // Border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent", // Border color when focused
                },
              },
            }}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box
            sx={{
              bgcolor: "#F9F9F9",
              color: "black",
              width: "50px",
              textAlign: "center",
              p: 1,
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "10px",
            }}
            onClick={handleSend}
          >
            ok
          </Box>
        </Box>


      </Box>
    </Box>

  );
};

export default WebSocketMockUI;
