import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface TopNavBarProps {
  serverTab: number;
  setServerTab: React.Dispatch<React.SetStateAction<number>>;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TopNavBar: React.FC<TopNavBarProps> = ({ serverTab, setServerTab }) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setServerTab(newValue); // Update parent state
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={serverTab} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Mock Server" {...a11yProps(0)} />
        <Tab label="Proxy Server" {...a11yProps(1)} />
        <Tab label="Web Socket" {...a11yProps(2)} />
      </Tabs>
    </Box>
  );
};

export default TopNavBar;
