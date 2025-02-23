import React, { useState } from 'react';
import { TextField, InputAdornment, List, ListItem, ListItemText, Typography, Box, Divider, IconButton, styled, alpha } from '@mui/material';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import SearchIcon from '@mui/icons-material/Search';
import './LeftNav.css';
import { FileUploadOutlined, KeyboardArrowDownSharp, KeyboardArrowUpSharp, MoreHoriz } from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';
import Menu, { MenuProps } from '@mui/material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import trashIcon from '../../assets/trash.svg'
import AddIcon from '@mui/icons-material/Add';
import evenIcon from '../../assets/evenLogo.svg';
import backwardIcon from '../../assets/backwardIcon.svg';
import { useTestConfigStore } from '../../store/app-store';
import { v4 as uuidv4 } from "uuid";



interface Case {
  number: number;
  name: string;
  label: string;
}

interface NavItem {
  name: string;
  cases: Case[];
}

interface LeftNavProps {
  items: NavItem[];
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(12),
    // marginTop:"100px",
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}));


const LeftNav: React.FC<LeftNavProps> = ({ items }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const { selectedTestSuiteIndex, setSelectedTestSuite } = useTestConfigStore()
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // const handleTabClose = (id: number, event: React.MouseEvent) => {
  //   event.stopPropagation(); // Prevent tab selection when closing
  //   const updatedTabs = tabs.filter((tab) => tab.id !== id);
  //   setTabs(updatedTabs);
  // };
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleTextFieldClick = (index: number) => {
    setSelectedTestSuite(index === selectedTestSuiteIndex ? null : index);
  };
  const handleAddTestSuite = () => {
    const { testConfig, updateTestConfig, clearTestSuites } = useTestConfigStore.getState();
    const newTestSuite = {
      name: `Test Suite ${testConfig.testSuites.length + 1}`,
      description: "",
      id: uuidv4(),
      testCases: [
        {
          action: "addUser",
          testDescription: "",
          testId: "",
          userName: "",
          server: "",
          consumedBy: [],
          addUserMessage: {},
          timeout: 0,
        },
      ],
    };
    updateTestConfig({ testSuites: [...testConfig.testSuites, newTestSuite] });
  };
  return (
    <div className="left-nav" style={{ backgroundColor: "#F5F5F566" }}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: "10px"}}>
      <Box
        key="menu-dropdown-tab"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: "center",
          width: "80px",
          // padding:"10px 0px 20px 0px",
          // paddingLeft:"20px",
          position: 'relative', // Needed for the divider position
          // paddingRight: 1,
          // borderRight: 1,
          // borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="small" onClick={handleMenuOpen} sx={{ display: 'flex', justifyContent:"center",  alignItems: 'center', gap: 1 }}>
            <img src={evenIcon} alt="Menu"  />
            <Typography variant="caption" sx={{ color: "black", fontSize: "12px", fontWeight: 600 }}>
              Even
            </Typography>
          </IconButton>
        </Box>

        {/* Menu Dropdown */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Even Server</MenuItem>
          <MenuItem onClick={handleMenuClose}>Even Test</MenuItem>
          {/* <MenuItem onClick={handleMenuClose}>Option 3</MenuItem> */}
        </Menu>
      </Box>
      <Box>
        <img src={backwardIcon} alt={"close"}/>
      </Box>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <IconButton onClick={handleAddTestSuite}>
          <AddIcon />
        </IconButton>
        <TextField
          variant="outlined"
          placeholder="Search..."
          fullWidth
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px', // Apply border radius
              '& fieldset': {
                borderColor: '#DFE3EB', // Apply border color
              },
              '&:hover fieldset': {
                borderColor: '#B0BEC5', // Change border color on hover (optional)
              },
              '&.Mui-focused fieldset': {
                borderColor: '#42A5F5', // Change border color on focus (optional)
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>


      <Typography variant="h6" gutterBottom sx={{ color: "#666E7D", fontSize: "12px" }}>
        Test Suites
      </Typography>
      {/* Navigation List */}
      <List>
        {filteredItems.map((item, index) => (
          <ListItem sx={{ display: "flex", flexDirection: "column", padding: "5px 5px 5px 5px" }}>
            <TextField
              variant="standard"
              fullWidth
              size="small"
              value={item.name || "Untitled"}
              onClick={() => handleTextFieldClick(index)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FolderOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {selectedTestSuiteIndex === index ? <KeyboardArrowUpSharp /> : <KeyboardArrowDownSharp />}
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInput-underline:before": {
                  borderBottom: "none", // Remove the default underline
                },
                "& .MuiInput-underline:after": {
                  borderBottom: "none", // Ensure no underline after focus
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottom: "none", // Show underline on hover
                  // borderColor: "rgba(0, 0, 0, 0.42)", // Default MUI underline color
                },
                "& .MuiInputBase-input": {
                  color: "#666E7D", // Set custom text color
                  fontSize: "14px", // Set custom font size
                  padding: "2px"
                },
              }}
            />
            {selectedTestSuiteIndex === index && (
              <Box sx={{ marginTop: 1, width: "100%", paddingLeft: "30px" }}>
                {item.cases.map((caseItem, idx) => {
                  console.log(caseItem)
                 return( <Box sx={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#F2F2F3", // Change to desired hover color
                    },
                  }}>
                    <Typography
                      key={idx}
                      variant="body1"
                      sx={{
                        color: "#2160EB",
                        display: "flex",
                        padding: "5px",
                        backgroundColor:"#F2F4FF",
                        // justifyContent: "space-around",
                        gap: "16px" // Adjust the value as needed for the desired spacing
                      }}
                    >
                      {caseItem.label}
                    </Typography>
                    <IconButton
                      id="composition-button"
                      aria-controls={open ? 'composition-menu' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <MoreHoriz fontSize='small' sx={{ color: "#666E7D" }} />

                    </IconButton>
                    <StyledMenu
                      id="demo-customized-menu"
                      MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose} sx={{ fontSize: "12px" }} disableRipple>
                        <EditIcon />
                        Edit
                      </MenuItem>
                      <MenuItem onClick={handleClose} sx={{ fontSize: "12px" }} disableRipple>
                        <FileUploadOutlined />
                        Export
                      </MenuItem>
                      <Divider sx={{ my: 0.5 }} />
                      <MenuItem onClick={handleClose} sx={{ color: "#F94F4F", fontSize: "12px" }} disableRipple>
                        <IconButton>
                          <img src={trashIcon} alt="trash" />
                        </IconButton>
                        Delete
                      </MenuItem>
                    </StyledMenu>
                  </Box>
                )})}
              </Box>
            )}
            <Divider orientation="horizontal" flexItem sx={{ mx: 1, marginTop: "10px" }} />
          </ListItem>
        ))}
      </List>
      {/* <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          padding: "16px",
          width: "20%",
          minWidth: "300px",
          // backgroundColor: "#f4f6f8", 
          // backgroundColor: "red", 
          // boxShadow: "0px -2px 8px rgba(0, 0, 0, 0.1)",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center"
        }}
      >
        <Card sx={{ padding: "10px" }}>
          <Typography variant='h6' sx={{ color: "#0E1524", fontSize: "14px", fontWeight: 600 }}>
            Mock-Server
          </Typography>
          <Typography variant='h6' sx={{ color: "#666E7D", fontSize: "12px", marginTop:"2px", fontWeight: 400 }}>
          Upload a configuration file to instantly start a mock server.      </Typography>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{
              // background: "linear-gradient(180deg, #6E9AF9 -75.83%, #2160EB 100%)", 
              color: "#fff",
              marginTop:"10px",
              boxShadow: " 0px 0px 0.5px 0px #FFFFFF70 inset"
            }}
          >
            Upload
            <input
              type="file"
              hidden
            // onChange={handleFileUpload} // Add your file upload handler here
            />
          </Button>
        </Card>

      </Box> */}
    </div>
  );
};

export default LeftNav;
