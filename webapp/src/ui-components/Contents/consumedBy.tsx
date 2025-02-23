import { Box, Button, TextField, Typography } from "@mui/material";
import MessageEditBox from "../common/messageEditBox";
import MultiSelectDropdown from "../common/dropdown";
import { useTestConfigStore } from "../../store/app-store";


const ConsumedBy = ({ index }) => {
    const { testConfig, onFieldChange } = useTestConfigStore()
    let consumers = testConfig.testSuites?.[0].testCases?.[index].consumedBy
   const onClickAddConsumedBy = () => {
        let newConsumers = [...consumers, { users: [], message: "" }]
        onFieldChange(newConsumers, "testSuites.0.testCases." + index , "consumedBy")
    }
    const onChangeMessage = (value, index) => {
        let newConsumers = [...consumers]
        newConsumers[index].message = value
        onFieldChange(newConsumers, "testSuites.0.testCases." + index, "consumedBy")
    }
    const onChangeUsers = (value, index) => {
        let newConsumers = [...consumers]
        newConsumers[index].users = value
        onFieldChange(newConsumers, "testSuites.0.testCases." + index, "consumedBy")
    }
    const users = []
    const testCases = testConfig.testSuites?.[0].testCases
    for (let i = 0; i < index; i++) {
        if(testCases?.[i].action==="addUser"){
            users.push(testCases?.[i].userName)
        }
    }
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ padding: "10px", textAlign: "start" }}>
                    {"Consumed By"}
                </Typography>
                <Button variant="text" onClick={onClickAddConsumedBy}>Add Consumed By</Button>
            </Box>
            {
                consumers?.map((consumer, index) => {
                    return (
                        <Box>
                            <Box sx={{ padding: "10px", textAlign: "start" }}>
                                <Typography variant="h6" >
                                    {index + 1}
                                </Typography>
                            </Box>
                            <MultiSelectDropdown users={users} onChangeUsers={(value)=>onChangeUsers(value,index)} value={consumer.users}/>
                            <Box sx={{ marginTop: "10px", textAlign: "start" }}>
                                <MessageEditBox label={"Consumed by message"} onChangeValue={(value)=>onChangeMessage(value,index)} value={consumer.message}/>
                            </Box>

                        </Box>
                    )
                })
            }
        </Box>

    )

}
export default ConsumedBy;