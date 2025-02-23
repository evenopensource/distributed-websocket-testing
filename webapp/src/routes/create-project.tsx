import { Box, Button, IconButton, Typography } from "@mui/material";
import Content from "../ui-components/Contents/Content"
import evenIcon from "../assets/evenLogo.svg"
import { Link } from "react-router-dom";
import { useTestConfigStore } from "../store/app-store";

interface Field {
    name: string;
    label: string;
    placeholder: string;
    width: string | number;
    type: string;
    path?:string;
    options?: { label: string; value: string }[];
    columns?: { placeholder: string; name: string }[];
    dataType?: string;
}

interface ServerConfig {
    type: string;
    header: string;
    fields?: Field[];
}

const MockserverConfig: ServerConfig[] = [
    {
        type: "card",
        header: "Project configuration",
        fields: [
            {
                name: "isSocketIo",
                label: "Type",
                placeholder: "Enter Type",
                width: 5.3,
                type: "dropDown",
                path:"repo",
                options: [{ label: "Socket Io", value: "yes" }, { label: "Web Sockets", value: "no" }]
            },
            {
                name: "name",
                label: "Project Name",
                width: 5.3,
                path:"repo",
                placeholder: "Enter Project Name",
                type: "textField"
            },
            {
                name: "description",
                label: "Project description",
                width: 5.3,
                path:"repo",
                placeholder: "Enter Project description",
                type: "textField"
            }
        ]
    },
    {
        type: "card",
        header: "Server configuration",
        fields: [
            {
                name: "serverBootTime",
                label: "server boot time",
                placeholder: "Enter server boot time",
                width: 8,
                path:"repo",
                dataType:"number",
                type: "textField",
            },
            {
                name: "path",
                label: "Project path",
                width: 8,
                path:"repo",
                placeholder: "Enter Project path",
                type: "textField"
            },
            {
                name: "length",
                label: "No of websocket servers to start",
                placeholder: "Enter No of websocket servers to start",
                width: 8,
                path:"servers",
                dataType:"number",
                type: "textField",
            },
            {
                name: "startCommand",
                label: "Start command",
                width: 8,
                path:"repo",
                placeholder: "Enter Start command",
                type: "textField"
            },
            {
                name: "servers",
                label: "Server Details",
                type: "table",
                width: 8,
                placeholder: "Table data", // Added placeholder to fix TypeScript error
                columns: [
                    { placeholder: "Server Name", name: "name" },
                    { placeholder: "Server Port", name: "port" }
                ]
            }
            // {
            //     name: "serverName",
            //     label: "Server Name",
            //     placeholder: "Enter Server Name",
            //     type: "textField"
            // },
            // {
            //     name: "serverPort",
            //     label: "Server port",
            //     placeholder: "Enter Server port",
            //     type: "textField"
            // }
        ]
    },
    {
        type: "card",
        header: "Message configurations",
        fields: [
            {
                name: "uploadMessages",
                label: "Upload Messages",
                placeholder: "Click here to Upload",
                path:"message.recommendationMessages",
                width: 5.3,
                type: "file"
            }
        ]
    },
    {
        type: "messageProcessor",
        header: "Message Processors",
        fields: [
            {
                name: "code",
                label: "Inbound",
                width: "50%",
                path:"message.inboundMessageProcessor",
                placeholder: "const inboundMessageProcessor = (message) => {\n //Process message here\n return message\n}",
                type: "textField"
            },
            {
                name: "code",
                label: "Outbound",
                width: "50%",
                path:"message.outboundMessageProcessor",
                placeholder: "const outboundMessageProcessor = (message) => {\n //Process message here\n return message\n}",
                type: "textField"
            }
        ]
    },
    {
        type: "scripts",
        header: "Data scripts",
        fields: [
            {
                name: "init",
                label: "Init",
                width: "50%",
                path:"dataScript",
                placeholder: "sudo snap start redis\ncd ../evenOs && npm run dev\nkafka-server-start.sh",
                type: "script"
            },
            {
                name: "cleanUp",
                label: "Cleanup",
                width: "50%",
                path:"dataScript",
                placeholder: "sudo snap start redis\ncd ../evenOs && npm run dev\nkafka-server-start.sh",
                type: "script"
            }
        ]
    }
];

export default function CreatePage() {
    const { clearTestSuites } = useTestConfigStore()
    return (
        <Box >
            <Box sx={{ borderBottom: "1px solid #DFE3EB", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 25px 10px 35px" }}>
                <Box
                    key="menu-dropdown-tab"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "center",
                        width: "80px",
                        position: 'relative',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton size="small" sx={{ display: 'flex', justifyContent: "center", alignItems: 'center', gap: 1 }}>
                            <img src={evenIcon} alt="Menu" />
                            <Typography variant="caption" sx={{ color: "black", fontSize: "12px", fontWeight: 600 }}>
                                Even
                            </Typography>
                            {/* <KeyboardArrowDown fontSize="small" /> */}
                        </IconButton>
                    </Box>
                </Box>
                <Box>
                    <Link to="/add-test-cases">
                        <Button variant="outlined" >
                            Import project
                        </Button>
                    </Link>
                </Box>

            </Box>
            <Box sx={{ padding: "10px" }}>
                <Content serverConfig={MockserverConfig} />
            </Box>
            <Box
                sx={{
                    border: "1px solid #DFE3EB",
                    position: "fixed",
                    //   left: "clamp(300px, 20%, 400px)", 
                    width: "100%",
                    padding: "10px",
                    bottom: 0,
                    backgroundColor: "#fff",
                    textAlign: "end"
                }}
            >
                <Box>
                    <Link to="/add-test-cases">
                        <Button sx={{ marginLeft: "20px" }} onClick={clearTestSuites} variant="contained" color="secondary">
                            Create New tests
                        </Button>
                    </Link>

                </Box>
            </Box>

        </Box>
    )

}
