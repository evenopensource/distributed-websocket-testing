import { Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
import Content from "../ui-components/Contents/Content"
import LeftNav from "../ui-components/leftNav/LeftNav";
import { useTestConfigStore } from "../store/app-store";
import { ArrowBack } from "@mui/icons-material";
import ConfigCard from "../ui-components/Cards/configCard";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";


interface Field {
    name?: string;
    label?: string;
    placeholder?: string;
    type: string;
    options?: { label: string; value: string }[];
    width?: number;
    path?: string;
    key?: string;
}

interface ServerConfig {
    type: string;
    header: string;
    fields?: Field[];
}
const testSuitCard: ServerConfig = {
    type: "card",
    header: "Test suite",
    fields: [
        {
            name: "name",
            label: "Name",
            placeholder: "Enter Name",
            width: 8,
            type: "textField",
        },
        {
            name: "description",
            label: "Description",
            width: 8,
            placeholder: "Enter description",
            type: "textField"
        },
    ]
}

const userAdditionCard: ServerConfig =
{
    type: "card",
    header: "User Addition",
    fields: [
        {
            name: "testCaseName",
            label: "Test case Name",
            placeholder: "Enter Test case Name",
            width: 8,
            type: "dropDown",
            options: [{ label: "Socket Io", value: "socketIo" }]
        },
        {
            name: "timeout",
            label: "Time out",
            width: 8,
            placeholder: "Enter Time out",
            type: "textField"
        },
        {
            name: "userName",
            label: "User Name",
            placeholder: "Enter Name",
            width: 8,
            type: "textField"
        },
        {
            name: "server",
            label: "Server",
            width: 8,
            placeholder: "Enter Server",
            type: "servers",
            // options: [{ label: "Server1", value: "server1" }, { label: "Server2", value: "server2"}]
        },
        {
            name: "addUserMessage",
            // label: "User Message",
            width: 16,
            type: "messageBox"
        },
        {
            type: "consumedBy",
            // label: "Consumed By",
            width: 16,
        }
    ]
}
const userDeletionCard: ServerConfig =
{
    type: "card",
    header: "User deletion",
    fields: [
        {
            name: "testCaseName",
            label: "Test case Name",
            placeholder: "Enter Test case Name",
            width: 8,
            type: "dropDown",
            options: [{ label: "Socket Io", value: "socketIo" }]
        },
        {
            name: "timeout",
            label: "Time out",
            width: 8,
            placeholder: "Enter Time out",
            type: "textField"
        },
        {
            label: "User",
            type: "label",
            width: 16,
        },
        {
            name: "name",
            label: "Name",
            placeholder: "Enter Name",
            width: 8,
            type: "textField"
        },
        {
            name: "server",
            label: "Server",
            width: 8,
            placeholder: "Enter Server",
            type: "servers",
            // options: [{ label: "Server1", value: "server1" }, { label: "Server2", value: "server2"}]
        },
        {
            name: "addUserMessage",
            // label: "User Message",
            width: 16,
            type: "messageBox"
        },
        {
            type: "consumedBy",
            // label: "Consumed By",
            width: 16,
        }
    ]
}
const sendMessageCard: ServerConfig =
{
    type: "card",
    header: "Send message",
    fields: [
        {
            name: "testCaseName",
            label: "Test case Name",
            placeholder: "Enter Test case Name",
            width: 8,
            type: "dropDown",
            options: [{ label: "Socket Io", value: "socketIo" }]
        },
        {
            name: "timeout",
            label: "Time out",
            width: 8,
            placeholder: "Enter Time out",
            type: "textField"
        },
        {
            label: "User",
            type: "label",
            width: 16,
        },
        {
            name: "name",
            label: "Name",
            placeholder: "Enter Name",
            width: 8,
            type: "textField"
        },
        {
            name: "server",
            label: "Server",
            width: 8,
            placeholder: "Enter Server",
            type: "servers",
            // options: [{ label: "Server1", value: "server1" }, { label: "Server2", value: "server2"}]
        },
        {
            name: "addUserMessage",
            // label: "User Message",
            width: 16,
            type: "messageBox"
        },
        {
            type: "consumedBy",
            // label: "Consumed By",
            width: 16,
        }
    ]
}
const testCaseLabelMapping = {
    addUser: "User addition",
    removeUser: "User deletion",
    sendMessage: "Send message"
}
export default function CreateTestCases() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { testConfig, selectedTestSuiteIndex } = useTestConfigStore()
    const navItems = testConfig?.testSuites?.map((item: any) => {
        return {
            name: item.name,
            cases: item.testCases.map((caseItem: { name: keyof typeof testCaseLabelMapping; action: keyof typeof testCaseLabelMapping }) => { return { ...caseItem, label: testCaseLabelMapping[caseItem.action] } }),
        }
    })
    const handleAddTestCase = (type, index) => {
        setAnchorEl(null);
        const updatedConfig = { ...testConfig };
        let newCase = {};
        switch(type){
            case "addUser":
                newCase = {
                    action: "addUser",
                    testId: uuidv4(),
                    testCaseName: "",
                    timeout: 1000,
                    name: "",
                    server: [],
                    addUserMessage: {},
                    consumedBy: []
                }
                break;
            case "removeUser":
                newCase = {
                    action: "removeUser",
                    testId: uuidv4(),
                    testCaseName: "",
                    timeout: 1000,
                    name: "",
                    server: "",
                    addUserMessage: {},
                    consumedBy: []
                }
                break;
            case "sendMessage":
                newCase = {
                    action: "sendMessage",
                    testCaseName: "socketIo",
                    testId: uuidv4(),
                    timeout: 1000,
                    name: "",
                    server: "",
                    addUserMessage: {},
                    consumedBy: []
                }
                break;
        
        }
        //add new test case to the selected test suite case is type of the test case
        updatedConfig.testSuites[selectedTestSuiteIndex].testCases.splice(index + 1, 0, newCase);
        

    }
   const onclickExport = () => {
        //download testCofig json
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(testConfig)], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "testConfig.json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();

    }
    return (
        <div style={{ display: "flex", height: "100vh", paddingBottom: "50px" }}>
            {/* Left Navigation Panel */}
            <div style={{ width: "20%", minWidth: "300px" }}>
                <LeftNav items={navItems} />
            </div>

            {/* Main Content */}
            <div style={{ width: "80%", minWidth: "400px", backgroundColor: "#fff", overflow: "auto" }}>
                {/* <Content serverConfig={MockserverConfig} /> */}
                <Box>
                    <Link to="/">
                    <IconButton>
                        <ArrowBack sx={{ color: "#2160EB" }} />
                        <span style={{ marginLeft: "15px", color: "#0E1524", fontWeight: "600" }}>Project Configuration</span>
                    </IconButton>
                    </Link>

                </Box>
                <ConfigCard serverConfig={{ header: testSuitCard.header, fields: testSuitCard.fields?.map((item) => { return { ...item, path: `testSuites.${selectedTestSuiteIndex}` } }) || [], }} />
                {testConfig?.testSuites?.[selectedTestSuiteIndex]?.testCases?.map((item: any, index: number) => (
                    <Box key={index}>
                        {(() => {
                            switch (item.action) {
                                case "addUser":
                                    return (
                                        <ConfigCard
                                            serverConfig={{
                                                header: userAdditionCard.header,
                                                fields: userAdditionCard.fields?.map((field: Field) => ({
                                                    ...field,
                                                    path: `testSuites.${selectedTestSuiteIndex}.testCases.${index}`
                                                })) || []
                                            }}
                                            caseIndex={index}
                                        />
                                    );
                                case "removeUser":
                                    return <ConfigCard
                                        serverConfig={{
                                            header: userDeletionCard.header,
                                            fields: userDeletionCard.fields?.map((field: Field) => ({
                                                ...field,
                                                path: `testSuites.${selectedTestSuiteIndex}.testCases.${index}`
                                            })) || []
                                        }}
                                        caseIndex={index}
                                    />
                                case "sendMessage":
                                    return <ConfigCard
                                        serverConfig={{
                                            header: sendMessageCard.header,
                                            fields: sendMessageCard.fields?.map((field: Field) => ({
                                                ...field,
                                                path: `testSuites.${selectedTestSuiteIndex}.testCases.${index}`
                                            })) || []
                                        }}
                                        caseIndex={index}
                                    />
                                default:
                                    return null;
                            }
                        })()}
                        <Box
                            sx={{ display: "flex", justifyContent: "center", padding: "10px", position: "relative", paddingBottom:"30px" }}
                            onMouseEnter={() => setIsHovered(index)}
                            onMouseLeave={() => setIsHovered(null)}
                        >
                            {(isHovered===index || Boolean(anchorEl)) && (
                                <Button variant="outlined" color="primary" onClick={handleClick}>
                                    Add
                                </Button>
                            )}
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                                <MenuItem onClick={()=>handleAddTestCase("addUser", index)}>Add User</MenuItem>
                                <MenuItem onClick={()=>handleAddTestCase("removeUser", index)}>Remove User</MenuItem>
                                <MenuItem onClick={()=>handleAddTestCase("sendMessage", index)}>Send Message</MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                ))}


            </div>
            <div>
                {/* Bottom Control Panel */}
                <Box
                    sx={{
                        border: "1px solid #DFE3EB",
                        position: "fixed",
                        left: "clamp(300px, 20%, 400px)",
                        width: "clamp(400px, 80%, calc(100% - 300px))",
                        padding: "10px",
                        bottom: 0,
                        backgroundColor: "#fff",
                        textAlign: "end"
                    }}
                >
                    <Box>
                        <Button onClick={onclickExport} variant="contained" color="secondary">
                            Export test Suites
                        </Button>
                    </Box>

                </Box>
            </div>
        </div >
    )

}
